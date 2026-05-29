import fs from 'fs';
import path from 'path';
import {
  loadGuideIdeas,
  saveGuideIdeas,
  updateGuideIdeaStatus,
  loadConfig,
} from './lib/config.mjs';
import { validateGuideDraft, generateSlug } from './lib/guide-schema.mjs';
import { GUIDE_DRAFTS, ensureDirs, readJson } from './lib/paths.mjs';

export function cmdApproveGuides(target) {
  ensureDirs();
  const config = loadConfig();
  const ideasData = loadGuideIdeas();

  const toApprove =
    target === 'all'
      ? ideasData.ideas.filter((i) => i.status === 'draft')
      : ideasData.ideas.filter((i) => i.id === target);

  if (toApprove.length === 0) {
    console.log(`No guides to approve for: ${target}`);
    return;
  }

  let approved = 0;
  for (const idea of toApprove) {
    const draftPath = path.join(GUIDE_DRAFTS, `${idea.id}.json`);
    if (!fs.existsSync(draftPath)) {
      console.warn(`⚠️  Missing guide draft: ${draftPath}`);
      continue;
    }

    const draft = readJson(draftPath);
    if (!draft.slug) draft.slug = generateSlug(draft.title);

    const { valid, errors } = validateGuideDraft(draft, config);
    if (!valid) {
      console.error(`❌ ${idea.id} invalid:`, errors.join('; '));
      continue;
    }

    updateGuideIdeaStatus(ideasData, idea.id, 'approved', { slug: draft.slug });
    approved++;
    console.log(`✅ Guide approved: ${idea.id} → ${draft.slug}`);
  }

  saveGuideIdeas(ideasData);
  console.log(`\n${approved} guide(s) approved.\n`);
}
