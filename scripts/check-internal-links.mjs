#!/usr/bin/env node
/**
 * Finds internal links in the built site that lead nowhere.
 *
 * In November 2026 a crawl of dist/ found 137 links to pages that never
 * existed, all in generated guides, invisible until someone looked. This scans
 * every built page for root-relative href and src values and reports any whose
 * target is neither a built file nor the source of a rule in public/_redirects.
 *
 *   node scripts/check-internal-links.mjs            report only (used by build)
 *   node scripts/check-internal-links.mjs --strict   exit 1 on any broken link
 */
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const strict = process.argv.includes('--strict');

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found: run the build first.');
  process.exit(strict ? 1 : 0);
}

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(DIST);

const redirectSources = fs.existsSync('public/_redirects')
  ? fs
      .readFileSync('public/_redirects', 'utf8')
      .split('\n')
      .map((l) => l.trim().split(/\s+/)[0])
      .filter((s) => s && s.startsWith('/'))
  : [];
const redirected = (u) =>
  redirectSources.some((r) => (r.endsWith('*') ? u.startsWith(r.slice(0, -1)) : u === r));

const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
const resolves = (u) => {
  let clean;
  try {
    clean = decodeURIComponent(u.split('#')[0].split('?')[0]);
  } catch {
    return false;
  }
  if (clean === '/' || clean === '') return true;
  const base = path.join(DIST, clean);
  return isFile(base) || isFile(`${base.replace(/\/$/, '')}.html`) || isFile(path.join(base, 'index.html'));
};

// Server routes that have no file in dist/.
const SKIP = [/^\/api\//, /^\/\.netlify\//];

const broken = new Map();
let checked = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [, attr, url] of html.matchAll(/\s(href|src)="(\/(?!\/)[^"]*)"/g)) {
    if (SKIP.some((re) => re.test(url))) continue;
    checked++;
    if (resolves(url) || redirected(url)) continue;
    const key = `${attr} ${url}`;
    if (!broken.has(key)) broken.set(key, new Set());
    broken.get(key).add(path.relative(DIST, file));
  }
}

if (!broken.size) {
  console.log(`🔗 Internal links: ${checked} checked across ${files.length} pages, none broken.`);
  process.exit(0);
}

console.log(`🔗 Internal links: ${broken.size} broken target(s) across ${files.length} pages:`);
for (const [key, pages] of [...broken].sort((a, b) => b[1].size - a[1].size)) {
  const list = [...pages];
  console.log(`   ${key}  <- ${list.slice(0, 3).join(', ')}${list.length > 3 ? ` (+${list.length - 3} more)` : ''}`);
}
process.exit(strict ? 1 : 0);
