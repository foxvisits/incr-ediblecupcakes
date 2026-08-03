/**
 * Whole-library audit before approving a batch for publication.
 *
 * Per-item validation runs at generation time and catches a draft in isolation.
 * This checks the properties that only exist across the set — duplicate slugs
 * and titles, images shared between two recipes, gaps in what will be linked —
 * plus a final sweep of the per-item rules, since a draft can be edited by hand
 * after it was generated.
 */
import fs from 'fs';
import path from 'path';
import { loadConfig } from './lib/config.mjs';
import { validateRecipeDraft } from './lib/schema.mjs';
import { validateGuideDraft } from './lib/guide-schema.mjs';
import { DRAFTS, GUIDE_DRAFTS, ASSETS } from './lib/paths.mjs';

const config = loadConfig();
const read = (dir) =>
  fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ id: f.replace('.json', ''), data: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }));

const recipes = read(DRAFTS);
const guides = read(GUIDE_DRAFTS);
const fail = [];
const warn = [];

const wordsIn = (guide) =>
  (guide.sections ?? []).reduce(
    (n, s) => n + (s.paragraphs ?? []).join(' ').split(/\s+/).filter(Boolean).length,
    0,
  );

// --- per item -------------------------------------------------------------
for (const { id, data } of recipes) {
  const v = validateRecipeDraft(data, config);
  if (!v.valid) fail.push(`${id}: ${v.errors.join('; ')}`);
  const missing = (data.images ?? []).filter((im) => !fs.existsSync(path.join(ASSETS, path.basename(im.src))));
  if (missing.length) fail.push(`${id}: ${missing.length} image file(s) missing from disk`);
  const dl = (data.metaDescription ?? '').length;
  if (dl < config.seo.metaDescriptionMin || dl > config.seo.metaDescriptionMax) {
    warn.push(`${id}: metaDescription ${dl} chars`);
  }
}

for (const { id, data } of guides) {
  const v = validateGuideDraft(data, config);
  if (!v.valid) fail.push(`${id}: ${v.errors.join('; ')}`);
  const missing = (data.images ?? []).filter((im) => !fs.existsSync(path.join(ASSETS, path.basename(im.src))));
  if (missing.length) fail.push(`${id}: ${missing.length} image file(s) missing from disk`);
  const w = wordsIn(data);
  if (w < 250) fail.push(`${id}: thin, ${w} words of body copy`);
  else if (w < 350) warn.push(`${id}: ${w} words of body copy`);
}

// --- across the set -------------------------------------------------------
const seen = (items, key, label) => {
  const map = new Map();
  for (const { id, data } of items) {
    const k = String(data[key] ?? '').toLowerCase().trim();
    if (!k) continue;
    if (map.has(k)) fail.push(`${id}: duplicate ${label} "${data[key]}" (also ${map.get(k)})`);
    else map.set(k, id);
  }
};
seen(recipes, 'slug', 'slug');
seen(recipes, 'title', 'title');
seen(guides, 'slug', 'slug');
seen(guides, 'title', 'title');

// A slug collision between a recipe and a guide is harmless (different URL
// prefixes), but two items pointing at the same image file is not: publishing
// one would overwrite the other's photo in public/.
const imageOwners = new Map();
for (const { id, data } of [...recipes, ...guides]) {
  for (const img of data.images ?? []) {
    const f = path.basename(img.src);
    if (imageOwners.has(f)) fail.push(`${id}: shares image ${f} with ${imageOwners.get(f)}`);
    else imageOwners.set(f, id);
  }
}

// --- report ---------------------------------------------------------------
const byCategory = recipes.reduce((m, { data }) => ({ ...m, [data.category]: (m[data.category] ?? 0) + 1 }), {});
const guideWords = guides.map(({ data }) => wordsIn(data)).sort((a, b) => a - b);

console.log(`\nRecipes ${recipes.length} · Guides ${guides.length} · Images ${imageOwners.size}`);
console.log(`Categories: ${JSON.stringify(byCategory)}`);
if (guideWords.length) {
  console.log(
    `Guide body copy: min ${guideWords[0]} · median ${guideWords[Math.floor(guideWords.length / 2)]} · max ${guideWords[guideWords.length - 1]}`,
  );
}

if (warn.length) {
  console.log(`\nWarnings (${warn.length}):`);
  warn.forEach((w) => console.log(`  ${w}`));
}
if (fail.length) {
  console.log(`\nBlocking (${fail.length}):`);
  fail.forEach((f) => console.log(`  ${f}`));
  console.log('');
  process.exit(1);
}
console.log('\nNo blocking issues.\n');
