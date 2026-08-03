/**
 * Regenerate the text of specific drafts, keeping their existing images.
 *
 * A normal re-run throws the images away and pays for three new ones per item.
 * When the fault is in the copy — a title over the limit, a thin guide, a
 * recipe whose ingredients contradict its photo — the images are usually fine
 * and worth keeping. This regenerates the text against the current prompts,
 * validates it, and reattaches the image paths that were already produced.
 *
 * Usage:
 *   node scripts/content/regenerate.mjs r098 r102 g011
 *   node scripts/content/regenerate.mjs --dry-run r098
 */
import fs from 'fs';
import path from 'path';
import { loadEnvFiles } from './lib/env.mjs';

loadEnvFiles();

const { loadConfig, loadIdeas, saveIdeas, loadGuideIdeas, saveGuideIdeas } = await import('./lib/config.mjs');
const { generateText } = await import('./lib/text.mjs');
const { buildRecipePrompt, extractJson } = await import('./lib/prompts.mjs');
const { buildGuidePrompt } = await import('./lib/guide-prompts.mjs');
const { validateRecipeDraft, generateSlug, attachImagePaths } = await import('./lib/schema.mjs');
const { validateGuideDraft, attachGuideImagePaths } = await import('./lib/guide-schema.mjs');
const { sanitizeDeep, validateHumanVoice } = await import('./lib/text-cleanup.mjs');
const { DRAFTS, GUIDE_DRAFTS, ASSETS, writeJson } = await import('./lib/paths.mjs');

const isGuide = (id) => /^g\d+$/i.test(id);

/**
 * Reattaching by path is what makes this safe: the generator derives image
 * paths from the slug, so a regenerated draft that keeps its slug points at
 * the same files. If the model renames the recipe the slug moves with it and
 * the old images no longer match, so that case falls back to regenerating them.
 */
function keepExistingImages(parsed, previous) {
  const stillOnDisk = (previous.images ?? []).filter((img) =>
    fs.existsSync(path.join(ASSETS, path.basename(img.src))),
  );
  if (stillOnDisk.length !== (previous.images ?? []).length || !stillOnDisk.length) return false;
  if (parsed.slug !== previous.slug) return false;

  parsed.images = stillOnDisk;
  parsed.image = stillOnDisk[0].src;
  parsed.imageAlt = stillOnDisk[0].alt ?? parsed.imageAlt;
  return true;
}

async function regenerateOne(id, { dryRun }) {
  const guide = isGuide(id);
  const dir = guide ? GUIDE_DRAFTS : DRAFTS;
  const file = path.join(dir, `${id}.json`);
  if (!fs.existsSync(file)) {
    console.log(`  ⚠️  ${id}: no draft on disk, skipping`);
    return false;
  }

  const config = loadConfig();
  const previous = JSON.parse(fs.readFileSync(file, 'utf8'));
  const store = guide ? loadGuideIdeas() : loadIdeas();
  const idea = store.ideas.find((i) => i.id === id) ?? {
    id,
    title: previous.title,
    category: previous.category,
    notes: previous.targetKeyword ?? '',
  };

  const maxRetries = config.workflow?.maxRetries ?? 2;
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    const prompt = guide ? buildGuidePrompt(idea, config, []) : buildRecipePrompt(idea, config, []);
    const parsed = sanitizeDeep(extractJson(await generateText({ prompt, config })));

    parsed.slug = previous.slug; // keep the URL: these drafts may already be scheduled
    parsed.contentIdeaId = id;
    if (guide) {
      parsed.category = idea.category ?? previous.category;
      parsed.targetKeyword = idea.targetKeyword ?? previous.targetKeyword;
    }

    const reused = keepExistingImages(parsed, previous);
    if (!reused) (guide ? attachGuideImagePaths : attachImagePaths)(parsed, config);

    const { valid, errors } = guide
      ? validateGuideDraft(parsed, config)
      : validateRecipeDraft(parsed, config);
    const allErrors = [...errors, ...validateHumanVoice(parsed)];

    if (allErrors.length) {
      if (attempt <= maxRetries) continue;
      console.log(`  ❌ ${id}: ${allErrors.join('; ')}`);
      return false;
    }

    if (dryRun) {
      console.log(`  ✓ ${id}: would write (images ${reused ? 'reused' : 'NEED REGENERATING'})`);
      return true;
    }

    writeJson(file, parsed);
    console.log(`  ✅ ${id}: rewritten, images ${reused ? 'reused' : 'need regenerating'}`);
    return true;
  }
  return false;
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const ids = args.filter((a) => !a.startsWith('--'));

if (!ids.length) {
  console.error('Usage: node scripts/content/regenerate.mjs [--dry-run] <id> [<id>…]');
  process.exit(1);
}

console.log(`\n🔁 Regenerating text for ${ids.length} draft(s)${dryRun ? ' (dry run)' : ''}…\n`);
let ok = 0;
for (const id of ids) if (await regenerateOne(id, { dryRun })) ok++;
console.log(`\nDone: ${ok}/${ids.length} succeeded.\n`);
