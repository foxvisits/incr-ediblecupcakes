#!/usr/bin/env node
/**
 * QA: duplicates, schedule integrity, auto-publish readiness.
 * Exit 0 = all checks passed.
 */
import fs from 'fs';
import path from 'path';
import { loadIdeas, loadGuideIdeas, loadConfig } from './lib/config.mjs';
import {
  SCHEDULED,
  GUIDE_SCHEDULED,
  GENERATED_RECIPES,
  GENERATED_GUIDES,
  PUBLISHED_ARCHIVE,
  GUIDE_PUBLISHED,
  ensureDirs,
  listJsonFiles,
  readJson,
  ROOT,
} from './lib/paths.mjs';
import { parseIdeasText } from './import-ideas.mjs';

const FORBIDDEN_DASH = /[\u2013\u2014]/;
const AI_SLOP = /\b(delve|leverage|utilize|hero ingredient|flavor story|mid-palate)\b/i;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  return false;
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
  return true;
}

function collectSlugs(dir) {
  const slugs = new Map();
  if (!fs.existsSync(dir)) return slugs;
  for (const file of listJsonFiles(dir)) {
    const data = readJson(path.join(dir, file));
    const slug = data.slug || file.replace(/\.json$/, '');
    if (!slugs.has(slug)) slugs.set(slug, []);
    slugs.get(slug).push(file);
  }
  return slugs;
}

function checkNoLiveDuplicateSlugs(scheduledDir, liveDir, label) {
  const scheduled = collectSlugs(scheduledDir);
  const live = collectSlugs(liveDir);
  let pass = true;

  for (const slug of scheduled.keys()) {
    if (live.has(slug)) {
      pass = fail(
        `Slug "${slug}" exists in both scheduled and live ${label} (would double-publish)`
      );
    }
  }

  for (const [, files] of scheduled) {
    if (files.length > 1) pass = fail(`Multiple scheduled ${label} files: ${files.join(', ')}`);
  }

  if (pass) ok(`${label}: no scheduled/live slug overlap`);
  return pass;
}

function checkOrphanScheduled(scheduledDir, liveDir, archiveDir, label) {
  let pass = true;
  for (const file of listJsonFiles(scheduledDir)) {
    const draft = readJson(path.join(scheduledDir, file));
    const slug = draft.slug;
    const livePath = path.join(liveDir, `${slug}.json`);
    const archivePath = path.join(archiveDir, file);
    if (fs.existsSync(livePath) || fs.existsSync(archivePath)) {
      pass = fail(
        `Orphan ${label} scheduled file "${file}" (already live/archived as ${slug})`
      );
    }
  }
  if (pass) ok(`${label}: no orphan scheduled (already published)`);
  return pass;
}

function checkPublishAtFuture(scheduledDir, label) {
  let pass = true;
  const now = Date.now();
  for (const file of listJsonFiles(scheduledDir)) {
    const draft = readJson(path.join(scheduledDir, file));
    if (!draft.publishAt) {
      pass = fail(`${label} ${file}: missing publishAt`);
      continue;
    }
    const t = new Date(draft.publishAt).getTime();
    if (Number.isNaN(t)) pass = fail(`${label} ${file}: invalid publishAt`);
    if (t <= now) {
      pass = fail(`${label} ${file}: publishAt in the past (${draft.publishAt}) — cron should publish soon`);
    }
    if (!draft.slug) pass = fail(`${label} ${file}: missing slug`);
    if (!draft.images || draft.images.length < 3) {
      pass = fail(`${label} ${file}: expected 3 images, got ${draft.images?.length ?? 0}`);
    }
  }
  if (pass) ok(`${label}: all scheduled have valid future publishAt + 3 images`);
  return pass;
}

function checkIdeasJsonDuplicates(ideas, label) {
  const titles = new Map();
  const ids = new Map();
  let pass = true;
  for (const idea of ideas) {
    const t = idea.title?.trim().toLowerCase();
    if (titles.has(t)) pass = fail(`${label} duplicate title: ${idea.title}`);
    else titles.set(t, idea.id);
    if (ids.has(idea.id)) pass = fail(`${label} duplicate id: ${idea.id}`);
    else ids.set(idea.id, idea.title);
  }
  if (pass) ok(`${label}: unique titles and ids`);
  return pass;
}

function checkIdeasTxtQueue(ideasData) {
  const ideasTxt = path.join(ROOT, 'content', 'ideas.txt');
  if (!fs.existsSync(ideasTxt)) return ok('ideas.txt missing (ok if empty queue)');

  const parsed = parseIdeasText(fs.readFileSync(ideasTxt, 'utf8'));
  const byTitle = new Map(
    ideasData.ideas.map((i) => [i.title.trim().toLowerCase(), i])
  );

  let pass = true;
  for (const row of parsed) {
    const key = row.title.trim().toLowerCase();
    const existing = byTitle.get(key);
    if (!existing) continue;
    if (existing.status !== 'idea') {
      pass = fail(
        `ideas.txt still lists "${row.title}" but ideas.json status is "${existing.status}" (remove from queue file)`
      );
    }
  }
  if (pass) ok('ideas.txt: no lines for already imported/scheduled/published recipes');
  return pass;
}

function checkContentFields(dir, label) {
  let pass = true;
  for (const file of listJsonFiles(dir)) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    if (FORBIDDEN_DASH.test(raw)) pass = fail(`${label} ${file}: contains em/en dash`);
    if (AI_SLOP.test(raw)) pass = fail(`${label} ${file}: AI-slop phrase detected`);
  }
  if (pass) ok(`${label}: no forbidden dashes or slop (sample scan)`);
  return pass;
}

function checkSchedulePlan(config, ideasData, guideIdeasData) {
  const schedule = config.schedule;
  const recipes = ideasData.ideas.filter((i) => i.status === 'scheduled');
  const guides = guideIdeasData.ideas.filter((i) => i.status === 'scheduled');
  const rpd = schedule.recipesPerDay ?? 0;
  const gpd = schedule.guidesPerDay ?? 0;

  let pass = true;
  if (recipes.length !== 14) pass = fail(`Expected 14 scheduled recipes, got ${recipes.length}`);
  else ok('14 recipes scheduled');

  if (guides.length !== 5) pass = fail(`Expected 5 scheduled guides, got ${guides.length}`);
  else ok('5 guides scheduled');

  if (rpd === 2 && gpd === 1) ok('Config: 2 recipes + 1 guide per day');
  else pass = fail(`Config recipesPerDay/guidesPerDay = ${rpd}/${gpd}`);

  return pass;
}

function checkGithubWorkflow() {
  const wf = path.join(ROOT, '.github/workflows/content-publish.yml');
  const text = fs.readFileSync(wf, 'utf8');
  let pass = true;
  if (!text.includes("cron: '0 * * * *'")) pass = fail('GitHub Action missing hourly cron');
  else ok('GitHub Action: hourly cron');

  if (!text.includes('content:publish-due')) pass = fail('Workflow missing publish-due');
  else ok('GitHub Action: runs publish-due');

  if (!text.includes('guides/generated')) pass = fail('Workflow git add missing guides/generated');
  else ok('GitHub Action: commits guide generated JSON');

  if (!text.includes('llms.txt')) pass = fail('Workflow git add missing llms.txt');
  else ok('GitHub Action: commits llms.txt');

  return pass;
}

export function cmdVerifyPipeline() {
  ensureDirs();
  const config = loadConfig();
  const ideasData = loadIdeas();
  const guideIdeasData = loadGuideIdeas();

  console.log('\n🔎 Content pipeline verification\n');

  let pass = true;
  const checks = [
    () => checkIdeasJsonDuplicates(ideasData.ideas, 'ideas.json'),
    () => checkIdeasJsonDuplicates(guideIdeasData.ideas, 'guide-ideas.json'),
    () => checkIdeasTxtQueue(ideasData),
    () => checkNoLiveDuplicateSlugs(SCHEDULED, GENERATED_RECIPES, 'recipe'),
    () => checkNoLiveDuplicateSlugs(GUIDE_SCHEDULED, GENERATED_GUIDES, 'guide'),
    () => checkOrphanScheduled(SCHEDULED, GENERATED_RECIPES, PUBLISHED_ARCHIVE, 'recipe'),
    () => checkOrphanScheduled(GUIDE_SCHEDULED, GENERATED_GUIDES, GUIDE_PUBLISHED, 'guide'),
    () => checkPublishAtFuture(SCHEDULED, 'recipe'),
    () => checkPublishAtFuture(GUIDE_SCHEDULED, 'guide'),
    () => checkSchedulePlan(config, ideasData, guideIdeasData),
    () => checkContentFields(SCHEDULED, 'scheduled recipe'),
    () => checkContentFields(GUIDE_SCHEDULED, 'scheduled guide'),
    () => checkGithubWorkflow(),
  ];

  for (const fn of checks) {
    if (!fn()) pass = false;
  }

  console.log(pass ? '\n✅ All checks passed.\n' : '\n❌ Some checks failed.\n');
  return pass ? 0 : 1;
}
