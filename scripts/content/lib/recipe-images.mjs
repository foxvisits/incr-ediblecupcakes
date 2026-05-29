import path from 'path';
import { generateImage } from './images.mjs';
import { attachImagePaths } from './schema.mjs';
import { ASSETS } from './paths.mjs';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function generateRecipeImages(parsed, config) {
  const draft = attachImagePaths(parsed, config);
  const delay = config.generation?.delayBetweenMs ?? 2000;

  for (let i = 0; i < draft.images.length; i++) {
    const img = draft.images[i];
    const filename = path.basename(img.src);
    const assetPath = path.join(ASSETS, filename);
    console.log(`  🖼️  Image ${i + 1}/${draft.images.length} (${img.role})...`);
    await generateImage({ prompt: img.prompt, config, outputPath: assetPath });
    if (i < draft.images.length - 1) await sleep(delay);
  }

  return draft;
}
