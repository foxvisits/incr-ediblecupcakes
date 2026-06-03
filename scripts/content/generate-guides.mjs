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

  for (const idea of pending) {
    const maxRetries = config.workflow?.maxRetries ?? 2;
    let attempt = 0;
    let succeeded = false;

    while (attempt <= maxRetries && !succeeded) {
      attempt++;
      try {
        if (attempt === 1) {
          updateGuideIdeaStatus(ideasData, idea.id, 'generating');
          saveGuideIdeas(ideasData);
        } else {
          console.log(`  🔁 Retry ${attempt - 1}/${maxRetries}...`);
        }

        const prompt = buildGuidePrompt(idea, config, existingTitles);
        if (attempt === 1) console.log(`→ ${idea.id}: ${idea.title}`);

        const raw = await generateText({ prompt, config });
        let parsed = sanitizeDeep(extractJson(raw));

        if (!parsed.slug) parsed.slug = generateSlug(parsed.title || idea.title);
        parsed.contentIdeaId = idea.id;
        parsed.category = idea.category || parsed.category;
        parsed.targetKeyword = idea.targetKeyword || idea.notes;
        attachGuideImagePaths(parsed, config);

        const voiceErrors = validateHumanVoice(parsed);
        const { valid, errors, warnings } = validateGuideDraft(parsed, config);
        const allErrors = [...errors, ...voiceErrors];
        if (warnings.length) warnings.forEach((w) => console.warn(`  ⚠️  ${w}`));
        if (!valid || voiceErrors.length) {
          if (attempt <= maxRetries) continue;
          console.error(`  ❌ Validation failed:`, allErrors.join('; '));
          updateGuideIdeaStatus(ideasData, idea.id, 'failed', { error: allErrors.join('; ') });
          saveGuideIdeas(ideasData);
          break;
        }

        await generateGuideImages(parsed, config);

        writeJson(path.join(GUIDE_DRAFTS, `${idea.id}.json`), parsed);
        updateGuideIdeaStatus(ideasData, idea.id, 'draft', { slug: parsed.slug });
        saveGuideIdeas(ideasData);

        console.log(`  ✅ Guide draft: content/guide-drafts/${idea.id}.json`);
        existingTitles.push(parsed.title);
        succeeded = true;

        await sleep(config.generation.delayBetweenMs ?? 3000);
      } catch (err) {
        if (attempt <= maxRetries) continue;
        console.error(`  ❌ ${idea.id} failed:`, err.message);
        updateGuideIdeaStatus(ideasData, idea.id, 'failed', { error: err.message });
        saveGuideIdeas(ideasData);
      }
    }
  }

  console.log('\nGuides done.\n');
}
