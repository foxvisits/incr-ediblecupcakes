#!/usr/bin/env node
/**
 * Bing Webmaster URL Submission API.
 * https://learn.microsoft.com/en-us/bingwebmaster/getting-access
 *
 * This is a stronger signal than IndexNow: IndexNow announces that a URL
 * changed, while SubmitUrlBatch asks Bing to crawl a specific list. Both are
 * worth sending — IndexNow also reaches Yandex and Seznam, and neither reaches
 * Google, which has no submission API at all.
 *
 * The key is a credential, unlike the IndexNow key (which is public by design
 * and served from /{key}.txt). Keep it in BING_API_KEY, never in the repo.
 */
import { SITE_ORIGIN } from './lib/seo-config.mjs';

const BING_API = 'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch';

/** Bing rejects oversized batches; it also enforces a per-day URL quota. */
const MAX_BATCH = 100;

export function getBingApiKey() {
  return process.env.BING_API_KEY?.trim() || null;
}

/**
 * @param {string[]} urlList absolute https URLs
 */
export async function submitBingUrls(urlList) {
  const key = getBingApiKey();
  if (!key) {
    console.log('  ℹ️  Bing URL submission skipped (BING_API_KEY not set)');
    return { ok: true, skipped: true, count: 0 };
  }

  const unique = [...new Set(urlList.filter((u) => u.startsWith('https://')))];
  if (unique.length === 0) {
    console.log('  ℹ️  Bing: no URLs to submit');
    return { ok: true, count: 0 };
  }

  let submitted = 0;
  let ok = true;

  for (let i = 0; i < unique.length; i += MAX_BATCH) {
    const batch = unique.slice(i, i + MAX_BATCH);
    try {
      const res = await fetch(`${BING_API}?apikey=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ siteUrl: SITE_ORIGIN, urlList: batch }),
      });

      if (res.ok) {
        submitted += batch.length;
      } else {
        ok = false;
        const text = await res.text().catch(() => '');
        // Never echo the key back into logs, and quota exhaustion is an
        // expected daily outcome rather than a failure worth breaking a build.
        const detail = text.slice(0, 200).replace(key, '***');
        console.warn(`  ⚠️  Bing submit HTTP ${res.status}${detail ? `: ${detail}` : ''}`);
      }
    } catch (err) {
      ok = false;
      console.warn(`  ⚠️  Bing submit failed: ${err.message}`);
    }
  }

  if (submitted) console.log(`  ✓ Bing accepted ${submitted} URL(s)`);
  return { ok, count: submitted };
}

if (process.argv[1]?.endsWith('bing-submit.mjs')) {
  const urls = process.argv.slice(2).filter((a) => a.startsWith('http'));
  if (urls.length === 0) {
    console.error('Usage: node scripts/bing-submit.mjs https://example.com/page …');
    process.exit(1);
  }
  submitBingUrls(urls).then((r) => process.exit(r.ok ? 0 : 1));
}
