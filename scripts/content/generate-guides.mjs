import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import {
  loadConfig,
  loadGuideIdeas,
  saveGuideIdeas,
  updateGuideIdeaStatus,
} from './lib/config.mjs';
import { generateText } from './lib/text.mjs';
import { buildGuidePrompt, extractJson } from './lib/guide-prompts.mjs';
import { loadLinkablePages, keepLinkable } from './lib/linkable-pages.mjs';
import {
  validateGuideDraft,
  generateSlug,
  attachGuideImagePaths,
} from './lib/guide-schema.mjs';
import { sanitizeDeep, validateHumanVoice } from './lib/text-cleanup.mjs';
import { generateGuideImages } from './lib/guide-images.mjs';
import { GUIDE_DRAFTS, ensureDirs, writeJson, ROOT } from './lib/paths.mjs';

async function getExistingGuideTitles() {
  try {
    const mod = await import(pathToFileURL(path.join(ROOT, 'src/data/guides.ts')).href);
    const genDir = path.join(ROOT, 'src/data/guides/generated');
    let extra = [];
    if (fs.existsSync(genDir)) {
      extra = fs
        .readdirSync(genDir)
        .filter((f) => f.endsWith('.json'))
        .map((f) => JSON.parse(fs.readFileSync(path.join(genDir, f), 'utf8')).title);
    }
    return [...mod.guides.map((g) => g.title), ...extra];
  } catch {
    return [];
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// kie.ai goes through stretches of HTTP 500 and 503 ("Resources are tight")
// that last minutes, not seconds. In November 2026 a batch retried at once,
// so all three attempts failed within seconds and 20 of 32 guides were lost.
// A service error now waits before trying again, and does not use up one of
// the attempts meant for output that fails validation.
const SERVICE_WAITS_S = [30, 90, 180, 300];

async function writeGuideText(idea, config, existingTitles, linkablePages) {
  const maxAttempts = (config.workflow?.maxRetries ?? 2) + 1;
  let attempt = 0;
  let serviceErrors = 0;
  let lastProblem = '';

  while (attempt < maxAttempts) {
    const prompt = buildGuidePrompt(idea, config, existingTitles, linkablePages);
    let raw;
    try {
      raw = await generateText({ prompt, config });
    } catch (err) {
      if (serviceErrors >= SERVICE_WAITS_S.length) throw err;
      const wait = SERVICE_WAITS_S[serviceErrors++];
      console.warn(`  ⚠️  ${idea.id}: ${err.message}. Waiting ${wait}s.`);
      await sleep(wait * 1000);
      continue;
    }

    attempt++;
    let parsed;
    try {
      parsed = sanitizeDeep(extractJson(raw));
    } catch (err) {
      lastProblem = `unreadable JSON (${err.message})`;
      console.warn(`  ⚠️  ${idea.id} attempt ${attempt}: ${lastProblem}`);
      continue;
    }

    if (!parsed.slug) parsed.slug = generateSlug(parsed.title || idea.title);
    parsed.contentIdeaId = idea.id;
    parsed.category = idea.category || parsed.category;
    parsed.targetKeyword = idea.targetKeyword || idea.notes;
    attachGuideImagePaths(parsed, config);

    const links = keepLinkable(parsed.relatedLinks, linkablePages, `/guides/${parsed.slug}`);
    if (links.dropped.length) console.warn(`  ⚠️  dropped related links to unknown pages: ${links.dropped.join(', ')}`);
    parsed.relatedLinks = links.kept;

    const voiceErrors = validateHumanVoice(parsed);
    const { valid, errors, warnings } = validateGuideDraft(parsed, config);
    if (warnings.length) warnings.forEach((w) => console.warn(`  ⚠️  ${w}`));
    if (valid && !voiceErrors.length) return parsed;

    lastProblem = [...errors, ...voiceErrors].join('; ');
    console.warn(`  ⚠️  ${idea.id} attempt ${attempt} failed validation: ${lastProblem}`);
  }
  throw new Error(`Validation failed: ${lastProblem}`);
}

export async function cmdGenerateGuides(countArg) {
  ensureDirs();
  const config = loadConfig();
  const ideasData = loadGuideIdeas();
  const count = countArg ?? config.generation.batchSize ?? 3;

  const pending = ideasData.ideas
    .filter((i) => i.status === 'idea' && !i.slug)
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
    .slice(0, count);

  if (pending.length === 0) {
    console.log('No guide ideas with status "idea".');
    return;
  }

  const existingTitles = await getExistingGuideTitles();
  console.log(`\n📚 Generating ${pending.length} guide draft(s)...\n`);

  const linkablePages = loadLinkablePages();

  for (const idea of pending) {
    console.log(`→ ${idea.id}: ${idea.title}`);
    updateGuideIdeaStatus(ideasData, idea.id, 'generating');
    saveGuideIdeas(ideasData);

    try {
      const parsed = await writeGuideText(idea, config, existingTitles, linkablePages);
      // Images have their own retries; a failure there no longer costs the text.
      await generateGuideImages(parsed, config, { reuseExisting: true });

      writeJson(path.join(GUIDE_DRAFTS, `${idea.id}.json`), parsed);
      updateGuideIdeaStatus(ideasData, idea.id, 'draft', { slug: parsed.slug, error: undefined });
      saveGuideIdeas(ideasData);
      console.log(`  ✅ Guide draft: content/guide-drafts/${idea.id}.json`);
      existingTitles.push(parsed.title);
    } catch (err) {
      console.error(`  ❌ ${idea.id} failed:`, err.message);
      updateGuideIdeaStatus(ideasData, idea.id, 'failed', { error: err.message });
      saveGuideIdeas(ideasData);
    }

    await sleep(config.generation.delayBetweenMs ?? 3000);
  }

  console.log('\nGuides done.\n');
}
