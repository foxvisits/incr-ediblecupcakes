#!/usr/bin/env node
/** Regenerate public/llms.txt from live site data (GEO / AI crawlers). */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadSiteData } from './lib/load-site-data.mjs';
import { SITE_ORIGIN, SITEMAP_URL, LLMS_URL } from './lib/seo-config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function generateLlmsTxt({ validatedRecipes, guides }) {
  // validatedRecipes is already sortRecipesByDate() from recipes.ts
  const recipesByNewest = validatedRecipes;

  const guidesByNewest = [...guides].sort((a, b) =>
    (b.publishedAt || '').localeCompare(a.publishedAt || ''),
  );

  const lines = [
    '# Incr-EdibleCupCakes',
    '',
    '> Home-tested cupcake recipes and baking guides for classic, keto, vegan, nut-free, and gluten-free bakers.',
    '',
    '## Primary pages',
    '',
    `${SITE_ORIGIN}/`,
    `${SITE_ORIGIN}/recipes`,
    `${SITE_ORIGIN}/guides`,
    `${SITE_ORIGIN}/categories`,
    `${SITE_ORIGIN}/about`,
    `${SITE_ORIGIN}/contact`,
    `${SITE_ORIGIN}/privacy`,
    '',
    '## Recipes (newest first)',
    '',
    ...recipesByNewest.map((r) => `${SITE_ORIGIN}/recipe/${r.slug}`),
    '',
    '## Guides (newest first)',
    '',
    ...guidesByNewest.map((g) => `${SITE_ORIGIN}/guides/${g.slug}`),
    '',
    '## Reference pages',
    '',
    `${SITE_ORIGIN}/substitutes/egg`,
    `${SITE_ORIGIN}/substitutes/buttermilk`,
    `${SITE_ORIGIN}/substitutes/sugar`,
    `${SITE_ORIGIN}/substitutes/flour`,
    `${SITE_ORIGIN}/baking-times/standard`,
    `${SITE_ORIGIN}/baking-times/mini`,
    `${SITE_ORIGIN}/baking-times/jumbo`,
    `${SITE_ORIGIN}/categories/keto`,
    `${SITE_ORIGIN}/categories/vegan`,
    `${SITE_ORIGIN}/categories/gourmet`,
    `${SITE_ORIGIN}/categories/tropical`,
    `${SITE_ORIGIN}/tags`,
    '',
    '## Resources',
    '',
    `${SITE_ORIGIN}/cupcake-troubleshooting-checklist.txt`,
    `${SITE_ORIGIN}/egg-substitutes-cheatsheet.txt`,
    '',
    `Sitemap: ${SITEMAP_URL}`,
    `LLMs: ${LLMS_URL}`,
    '',
    'Contact: sarah@incr-ediblecupcakes.com',
    '',
  ];

  return lines.join('\n');
}

export async function updateLlms() {
  const data = await loadSiteData();
  const content = generateLlmsTxt(data);
  const out = path.join(ROOT, 'public', 'llms.txt');
  fs.writeFileSync(out, content, 'utf8');
  console.log(
    `  ✓ llms.txt updated (${data.validatedRecipes.length} recipes, ${data.guides.length} guides)`,
  );
  return content;
}

if (process.argv[1]?.endsWith('update-llms.mjs')) {
  updateLlms().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
