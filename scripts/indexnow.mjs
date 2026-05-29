#!/usr/bin/env node
/** Bing / IndexNow URL submission (https://www.indexnow.org/documentation) */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_URL,
  INDEXNOW_API,
  SITE_HOST,
} from './lib/seo-config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

/** Host key verification file at /{key}.txt */
export function ensureIndexNowKeyFile() {
  const keyPath = path.join(PUBLIC, `${INDEXNOW_KEY}.txt`);
  if (!fs.existsSync(keyPath) || fs.readFileSync(keyPath, 'utf8').trim() !== INDEXNOW_KEY) {
    fs.writeFileSync(keyPath, `${INDEXNOW_KEY}\n`, 'utf8');
    console.log(`  ✓ IndexNow key file → public/${INDEXNOW_KEY}.txt`);
  }
  return keyPath;
}

/**
 * Submit URLs to IndexNow (Bing, Yandex, etc.).
 * @param {string[]} urlList absolute https URLs
 */
export async function submitIndexNow(urlList) {
  const unique = [...new Set(urlList.filter((u) => u.startsWith('https://')))];
  if (unique.length === 0) {
    console.log('  ℹ️  IndexNow: no URLs to submit');
    return { ok: true, count: 0 };
  }

  ensureIndexNowKeyFile();

  const body = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_URL,
    urlList: unique,
  };

  const res = await fetch(INDEXNOW_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  const ok = res.status === 200 || res.status === 202;
  if (ok) {
    console.log(`  ✓ IndexNow submitted ${unique.length} URL(s) (HTTP ${res.status})`);
  } else {
    const text = await res.text().catch(() => '');
    console.warn(`  ⚠️  IndexNow HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ''}`);
  }

  return { ok, status: res.status, count: unique.length };
}

if (process.argv[1]?.endsWith('indexnow.mjs')) {
  const urls = process.argv.slice(2).filter((a) => a.startsWith('http'));
  if (urls.length === 0) {
    console.error('Usage: node scripts/indexnow.mjs https://example.com/page …');
    process.exit(1);
  }
  submitIndexNow(urls).then((r) => process.exit(r.ok ? 0 : 1));
}
