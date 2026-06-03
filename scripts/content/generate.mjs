import fs from 'fs';
import path from 'path';
import { loadConfig, loadIdeas, saveIdeas, updateIdeaStatus } from './lib/config.mjs';
import { generateText } from './lib/text.mjs';
import { buildRecipePrompt, extractJson } from './lib/prompts.mjs';
import { validateRecipeDraft, generateSlug, attachImagePaths } from './lib/schema.mjs';
import { sanitizeDeep, validateHumanVoice } from './lib/text-cleanup.mjs';
import { generateRecipeImages } from './lib/recipe-images.mjs';
import {
  DRAFTS,
  ensureDirs,
  writeJson,
  ROOT,
} from './lib/paths.mjs';
import { pathToFileURL } from 'url';

async function getExistingTitles() {
  try {
    const mod = await import(pathToFileURL(path.join(ROOT, 'src/data/recipes.ts')).href);
    const generatedDir = path.join(ROOT, 'src/data/recipes/generated');
    let extra = [];
    if (fs.existsSync(generatedDir)) {
      extra = fs
        .readdirSync(generatedDir)
        .filter((f) => f.endsWith('.json'))
        .map((f) => readJsonSafe(path.join(generatedDir, f)).title);
    }
    return [...mod.recipes.map((r) => r.title), ...extra];
  } catch {
    return [];
  }
}

function readJsonSafe(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function cmdGenerate(countArg) {
  ensureDirs();
  const config = loadConfig();
  const ideasData = loadIdeas();
  const count = countArg ?? config.generation.batchSize ?? 3;

  const pending = ideasData.ideas
    .filter((i) => i.status === 'idea' && !i.slug)
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
    .slice(0, count);

  if (pending.length === 0) {
    console.log('No ideas with status "idea". Add rows to content/ideas.json');
    return;
  }

  const existingTitles = await getExistingTitles();
  console.log(`\n🤖 Generating ${pending.length} recipe draft(s)...\n`);

  for (const idea of pending) {
    const maxRetries = config.workflow?.maxRetries ?? config.generation?.maxRetries ?? 2;
    let attempt = 0;
    let succeeded = false;

    while (attempt <= maxRetries && !succeeded) {
      attempt++;
      try {
        if (attempt === 1) {
          updateIdeaStatus(ideasData, idea.id, 'generating');
          saveIdeas(ideasData);
        } else {
          console.log(`  🔁 Retry ${attempt - 1}/${maxRetries}...`);
        }

        const prompt = buildRecipePrompt(idea, config, existingTitles);
        if (attempt === 1) console.log(`→ ${idea.id}: ${idea.title}`);

        const raw = await generateText({ prompt, config });
        let parsed = sanitizeDeep(extractJson(raw));

        if (!parsed.slug) parsed.slug = generateSlug(parsed.title || idea.title);
        parsed.contentIdeaId = idea.id;
        attachImagePaths(parsed, config);

        const voiceErrors = validateHumanVoice(parsed);
        const { valid, errors, warnings } = validateRecipeDraft(parsed, config);
        const allErrors = [...errors, ...voiceErrors];
        if (warnings.length) warnings.forEach((w) => console.warn(`  ⚠️  ${w}`));
        if (!valid || voiceErrors.length) {
          if (attempt <= maxRetries) continue;
          console.error(`  ❌ Validation failed:`, allErrors.join('; '));
          updateIdeaStatus(ideasData, idea.id, 'failed', { error: allErrors.join('; ') });
          saveIdeas(ideasData);
          break;
        }

        await generateRecipeImages(parsed, config);

        writeJson(path.join(DRAFTS, `${idea.id}.json`), parsed);
        updateIdeaStatus(ideasData, idea.id, 'draft', { slug: parsed.slug });
        saveIdeas(ideasData);

        console.log(`  ✅ Draft saved: content/drafts/${idea.id}.json`);
        existingTitles.push(parsed.title);
        succeeded = true;

        await sleep(config.generation.delayBetweenMs ?? 2000);
      } catch (err) {
        if (attempt <= maxRetries) continue;
        console.error(`  ❌ ${idea.id} failed:`, err.message);
        updateIdeaStatus(ideasData, idea.id, 'failed', { error: err.message });
        saveIdeas(ideasData);
      }
    }
  }

  console.log('\nDone. Next: npm run content:run (auto approve+schedule) or content:approve + content:schedule\n');
}
