import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { loadIdeas, saveIdeas, updateIdeaStatus, loadGuideIdeas, saveGuideIdeas, updateGuideIdeaStatus } from './lib/config.mjs';
import { toLiveRecipe } from './lib/schema.mjs';
import { toLiveGuide } from './lib/guide-schema.mjs';
import {
  SCHEDULED,
  PUBLISHED_ARCHIVE,
  GUIDE_SCHEDULED,
  GUIDE_PUBLISHED,
  ASSETS,
  GENERATED_RECIPES,
  GENERATED_GUIDES,
  PUBLIC_DIR,
  ensureDirs,
  listJsonFiles,
  readJson,
  writeJson,
  ROOT,
} from './lib/paths.mjs';

function copyContentImages(draft) {
  const files = new Set();
  if (draft.images?.length) {
    for (const img of draft.images) {
      if (img.src) files.add(path.basename(img.src));
    }
  } else if (draft.image) {
    files.add(path.basename(draft.image));
  }

  for (const name of files) {
    const assetSrc = path.join(ASSETS, name);
    const publicDest = path.join(PUBLIC_DIR, name);
    if (fs.existsSync(assetSrc)) {
      fs.copyFileSync(assetSrc, publicDest);
      console.log(`  🖼️  Image → public/${name}`);
    } else {
      console.warn(`  ⚠️  No image at content/assets/${name}`);
    }
  }
}

export async function cmdPublishDue() {
  ensureDirs();
  const ideasData = loadIdeas();
  const guideIdeasData = loadGuideIdeas();
  const now = new Date();
  let publishedRecipes = 0;
  let publishedGuides = 0;

  for (const file of listJsonFiles(SCHEDULED)) {
    const scheduledPath = path.join(SCHEDULED, file);
    const draft = readJson(scheduledPath);
    const publishAt = new Date(draft.publishAt);

    if (Number.isNaN(publishAt.getTime()) || publishAt > now) continue;

    const live = toLiveRecipe(draft);
    writeJson(path.join(GENERATED_RECIPES, `${live.slug}.json`), live);
    copyContentImages(draft);

    writeJson(path.join(PUBLISHED_ARCHIVE, file), draft);
    fs.unlinkSync(scheduledPath);

    if (draft.contentIdeaId) {
      try {
        updateIdeaStatus(ideasData, draft.contentIdeaId, 'published', {
          publishedAt: now.toISOString(),
          slug: live.slug,
        });
      } catch { /* */ }
    }

    console.log(`✅ Published recipe: ${live.slug}`);
    publishedRecipes++;
  }

  for (const file of listJsonFiles(GUIDE_SCHEDULED)) {
    const scheduledPath = path.join(GUIDE_SCHEDULED, file);
    const draft = readJson(scheduledPath);
    const publishAt = new Date(draft.publishAt);

    if (Number.isNaN(publishAt.getTime()) || publishAt > now) continue;

    const live = toLiveGuide(draft);
    writeJson(path.join(GENERATED_GUIDES, `${live.slug}.json`), live);
    copyContentImages(draft);

    writeJson(path.join(GUIDE_PUBLISHED, file), draft);
    fs.unlinkSync(scheduledPath);

    if (draft.contentIdeaId) {
      try {
        updateGuideIdeaStatus(guideIdeasData, draft.contentIdeaId, 'published', {
          publishedAt: now.toISOString(),
          slug: live.slug,
        });
      } catch { /* */ }
    }

    console.log(`✅ Published guide: ${live.slug}`);
    publishedGuides++;
  }

  saveIdeas(ideasData);
  saveGuideIdeas(guideIdeasData);

  const total = publishedRecipes + publishedGuides;
  if (total > 0) {
    try {
      const { updateSeo } = await import('../update-seo.mjs');
      await updateSeo({ indexNow: true, ping: false });
    } catch (err) {
      console.warn('SEO sync failed:', err.message);
      try {
        execSync('npx tsx scripts/update-sitemap.mjs', { cwd: ROOT, stdio: 'inherit' });
      } catch {
        console.warn('Sitemap fallback failed');
      }
    }
  } else {
    console.log('Nothing due for publication right now.');
  }

  console.log(`\nPublished ${publishedRecipes} recipe(s), ${publishedGuides} guide(s).\n`);
}
