/**
 * The pages a generated guide is allowed to link to.
 *
 * The guide prompt used to ask for "2-4 internal links to /recipe/ or /guides/
 * pages on site" without saying which pages exist. The model invented them:
 * by November 2026, 137 of 158 related links in published guides were 404s.
 * The prompt now gets this list, and anything the model returns that is not on
 * it is dropped before the draft is written.
 *
 * Two sources, because a guide is often generated before the recipes it should
 * point at are live:
 *   - public/sitemap.xml, regenerated on every build: what is published now.
 *   - the recipe and guide drafts: what is generated and waiting to publish.
 * A link to something still queued is harmless. The guide template only
 * renders links whose page exists, so it appears once the target goes live.
 */
import fs from 'fs';
import path from 'path';
import { DRAFTS, GUIDE_DRAFTS, PUBLIC_DIR } from './paths.mjs';

const LINKABLE = /^\/(recipe|guides)\/[a-z0-9-]+$/;

const titleFromSlug = (slug) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export function normalizeHref(href) {
  return String(href ?? '')
    .trim()
    .replace(/^https?:\/\/(www\.)?incr-ediblecupcakes\.com/, '')
    .replace(/[.,;:!?]+$/, '')
    .replace(/\/$/, '');
}

export function loadLinkablePages() {
  const pages = new Map();

  for (const [dir, prefix] of [
    [DRAFTS, '/recipe/'],
    [GUIDE_DRAFTS, '/guides/'],
  ]) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (d.slug && d.title) pages.set(prefix + d.slug, d.title);
    }
  }

  const sitemap = path.join(PUBLIC_DIR, 'sitemap.xml');
  if (fs.existsSync(sitemap)) {
    const xml = fs.readFileSync(sitemap, 'utf8');
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const p = normalizeHref(loc);
      if (LINKABLE.test(p) && !pages.has(p)) pages.set(p, titleFromSlug(p.split('/').pop()));
    }
  }

  return [...pages].map(([p, title]) => ({ path: p, title })).sort((a, b) => a.path.localeCompare(b.path));
}

/** Keeps only links to known pages, never to the guide itself, without repeats. */
export function keepLinkable(links, pages, selfPath) {
  const known = new Map(pages.map((p) => [p.path, p.title]));
  const seen = new Set();
  const kept = [];
  const dropped = [];
  for (const link of Array.isArray(links) ? links : []) {
    const href = normalizeHref(link?.href);
    if (!known.has(href) || href === selfPath || seen.has(href)) {
      dropped.push(link?.href);
      continue;
    }
    seen.add(href);
    kept.push({ label: link.label || known.get(href), href });
  }
  return { kept, dropped };
}
