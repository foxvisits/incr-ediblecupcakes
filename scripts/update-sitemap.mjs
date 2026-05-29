#!/usr/bin/env node
/** Back-compat wrapper — prefer npm run update-seo for full sync. */
import { updateSitemapFile } from './update-seo.mjs';
import { loadSiteData } from './lib/load-site-data.mjs';

const entries = await updateSitemapFile();
const data = await loadSiteData();

console.log(`✅ Sitemap updated with ${entries.length} URLs`);
console.log(`   - ${data.validatedRecipes.length} recipe pages`);
console.log(
  `   - ${data.sitemapTags.length} tag pages in sitemap (${data.qualifiedTags.length - data.sitemapTags.length} category-dupe tags excluded)`,
);
console.log(`   - ${data.guides.length} guide pages`);
console.log(`   - Current date: ${new Date().toISOString().split('T')[0]}`);
