#!/usr/bin/env node
/**
 * Unified SEO sync: sitemap.xml + llms.txt + IndexNow key file + Bing IndexNow ping.
 * Run after new content publish, before deploy, or in CI.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadSiteData } from './lib/load-site-data.mjs';
import { collectUrls, encodeImageUrl, entriesToUrlList } from './lib/collect-urls.mjs';
import { SITE_ORIGIN, SITEMAP_URL } from './lib/seo-config.mjs';
import { ensureIndexNowKeyFile, submitIndexNow } from './indexnow.mjs';
import { updateLlms } from './update-llms.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function buildSitemapXml(entries) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  for (const entry of entries) {
    xml += `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>`;
    if (entry.image) {
      const title = entry.title || 'Incr-EdibleCupCakes';
      xml += `
    <image:image>
      <image:loc>${SITE_ORIGIN}${encodeImageUrl(entry.image)}</image:loc>
      <image:title>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</image:title>
    </image:image>`;
    }
    xml += `
  </url>

`;
  }

  xml += '</urlset>';
  return xml;
}

export async function updateSitemapFile() {
  const data = await loadSiteData();
  const currentDate = new Date().toISOString().split('T')[0];
  const entries = collectUrls(data, currentDate);
  const xml = buildSitemapXml(entries);
  fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), xml, 'utf8');
  console.log(`  ✓ sitemap.xml updated (${entries.length} URLs)`);
  return entries;
}

async function pingSitemapSearchEngines() {
  const encoded = encodeURIComponent(SITEMAP_URL);
  for (const [name, url] of [
    ['Google', `https://www.google.com/ping?sitemap=${encoded}`],
    ['Bing', `https://www.bing.com/ping?sitemap=${encoded}`],
  ]) {
    try {
      const res = await fetch(url);
      console.log(`  ✓ ${name} sitemap ping HTTP ${res.status}`);
    } catch (err) {
      console.warn(`  ⚠️  ${name} sitemap ping failed: ${err.message}`);
    }
  }
}

function parseArgs(argv) {
  const opts = { indexNow: true, ping: false, urls: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--no-indexnow') opts.indexNow = false;
    else if (argv[i] === '--ping') opts.ping = true;
    else if (argv[i] === '--urls' && argv[i + 1]) {
      opts.urls = argv[++i].split(',').map((u) => u.trim()).filter(Boolean);
    }
  }
  return opts;
}

export async function updateSeo(options = {}) {
  const opts = { indexNow: true, ping: false, urls: null, ...options };
  console.log('\n🔍 SEO sync (sitemap + llms.txt + IndexNow)…\n');

  ensureIndexNowKeyFile();
  const entries = await updateSitemapFile();
  await updateLlms();

  if (opts.indexNow) {
    const urlList = opts.urls?.length ? opts.urls : entriesToUrlList(entries);
    await submitIndexNow(urlList);
  }

  if (opts.ping) {
    await pingSitemapSearchEngines();
  }

  console.log('');
  return entries;
}

if (process.argv[1]?.endsWith('update-seo.mjs')) {
  const opts = parseArgs(process.argv.slice(2));
  updateSeo(opts).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
