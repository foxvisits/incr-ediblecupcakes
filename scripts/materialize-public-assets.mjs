/**
 * Copies legacy public/ filenames to canonical URLs used in code.
 * Netlify _redirects work in production; local dev/preview need real files.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

/** canonical URL path → source filename in public/ (supports spaces) */
const ASSET_MAP = {
  '/hero-cupcake-scene.png': 'A vibrant, mouth-watering cupcake scene.png',
  '/logo.png': 'Incr-EdibleCupCakes Logo.png',
  '/classic-vanilla-dream-cupcakes.jpg': 'Classic Vanilla Dream Cupcakes.jpg',
  '/cranberry-orange-sparkle-cupcakes.jpg': 'Cranberry Orange Sparkle Cupcakes.jpg',
  '/white-chocolate-snowflake-cupcakes.jpg':
    'White Chocolate Snowflake Cupcakes with White chocolate swirl frosting.jpg',
  '/spiced-pear-cupcakes.jpg': 'Spiced Pear Cupcakes with pear puree.jpg',
  '/chocolate-chili-firecracker-cupcakes.jpg': 'Chocolate Chili Firecracker Cupcakes.jpg',
  '/egg-substitutes-for-cupcakes.jpg': 'Egg substitutes for cupcakes.jpg',
};

function copyAsset(canonicalPath, sourceRel) {
  const destName = canonicalPath.replace(/^\//, '');
  const dest = path.join(PUBLIC, destName);
  const src = path.join(PUBLIC, sourceRel);

  if (!fs.existsSync(src)) {
    console.warn(`  ⚠️  Missing source: ${sourceRel} (for ${canonicalPath})`);
    return false;
  }

  // Same path on case-insensitive FS (e.g. Sarah.png → sarah.png): force canonical casing
  if (
    process.platform === 'win32' &&
    destName.toLowerCase() === sourceRel.toLowerCase() &&
    destName !== sourceRel
  ) {
    const buf = fs.readFileSync(src);
    const temp = path.join(PUBLIC, `.${destName}.tmp`);
    fs.writeFileSync(temp, buf);
    try {
      fs.unlinkSync(src);
    } catch {
      /* source may already be gone */
    }
    fs.renameSync(temp, dest);
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  console.log(`  ✓ ${destName}`);
  return true;
}

function main() {
  console.log('\n📁 Materializing public assets...\n');
  let ok = 0;
  let fail = 0;
  for (const [canonical, sourceRel] of Object.entries(ASSET_MAP)) {
    if (copyAsset(canonical, sourceRel)) ok++;
    else fail++;
  }
  console.log(`\nDone: ${ok} assets${fail ? `, ${fail} missing sources` : ''}.\n`);
}

main();
