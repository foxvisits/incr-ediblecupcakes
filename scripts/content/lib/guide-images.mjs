import fs from 'fs';
import path from 'path';
import { generateImage } from './images.mjs';
import { attachGuideImagePaths } from './guide-schema.mjs';
import { ASSETS } from './paths.mjs';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const IMAGE_ATTEMPTS = 3;

/**
 * Each image gets its own retries, so one slow image no longer throws away
 * the guide's text and the images already made.
 *
 * With `reuseExisting`, an image file already on disk is kept rather than
 * paid for again. New drafts pass it: their slugs are new, so a file at that
 * path can only come from an earlier attempt at the same guide that failed
 * partway.
 */
export async function generateGuideImages(parsed, config, { reuseExisting = false } = {}) {
  const draft = attachGuideImagePaths(parsed, config);
  const delay = config.generation?.delayBetweenMs ?? 3000;

  for (let i = 0; i < draft.images.length; i++) {
    const img = draft.images[i];
    const filename = path.basename(img.src);
    const assetPath = path.join(ASSETS, filename);
    const label = `Image ${i + 1}/${draft.images.length} (${img.role})`;
    if (reuseExisting && fs.existsSync(assetPath)) {
      console.log(`  🖼️  ${label}: already saved, reusing ${filename}`);
      continue;
    }
    console.log(`  🖼️  ${label}...`);
    for (let attempt = 1; ; attempt++) {
      try {
        await generateImage({ prompt: img.prompt, config, outputPath: assetPath });
        break;
      } catch (err) {
        if (attempt >= IMAGE_ATTEMPTS) throw err;
        const wait = 60 * attempt;
        console.warn(`  ⚠️  ${label} attempt ${attempt} failed: ${err.message}. Waiting ${wait}s.`);
        await sleep(wait * 1000);
      }
    }
    if (i < draft.images.length - 1) await sleep(delay);
  }

  return draft;
}
