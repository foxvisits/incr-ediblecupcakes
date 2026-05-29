import fs from 'fs';
import path from 'path';
import { loadIdeas, saveIdeas, updateIdeaStatus } from './lib/config.mjs';
import { validateRecipeDraft, generateSlug } from './lib/schema.mjs';
import { loadConfig } from './lib/config.mjs';
import { DRAFTS, ensureDirs, readJson, listJsonFiles } from './lib/paths.mjs';

export function cmdApprove(target) {
  ensureDirs();
  const config = loadConfig();
  const ideasData = loadIdeas();

  const toApprove =
    target === 'all'
      ? ideasData.ideas.filter((i) => i.status === 'draft')
      : ideasData.ideas.filter((i) => i.id === target);

  if (toApprove.length === 0) {
    console.log(`Nothing to approve for: ${target}`);
    return;
  }

  let approved = 0;
  for (const idea of toApprove) {
    const draftPath = path.join(DRAFTS, `${idea.id}.json`);
    if (!fs.existsSync(draftPath)) {
      console.warn(`⚠️  Missing draft: ${draftPath}`);
      continue;
    }

    const draft = readJson(draftPath);
    if (!draft.slug) draft.slug = generateSlug(draft.title);

    const { valid, errors } = validateRecipeDraft(draft, config);
    if (!valid) {
      console.error(`❌ ${idea.id} invalid:`, errors.join('; '));
      continue;
    }

    updateIdeaStatus(ideasData, idea.id, 'approved', { slug: draft.slug });
    approved++;
    console.log(`✅ Approved: ${idea.id} → ${draft.slug}`);
  }

  saveIdeas(ideasData);
  console.log(`\n${approved} approved. Run: npm run content:schedule\n`);
}

export function listDraftIds() {
  return listJsonFiles(DRAFTS).map((f) => f.replace('.json', ''));
}
