import { validatedRecipes } from './recipes';
import { guides } from './guides';
import { substitutesContent } from './substitutesContent';
import { categoryExtraContent } from './categoryContent';
import { isIndexableTag } from './tagContent';

/**
 * Every internal page a content link may point at.
 *
 * Generated guides carry "related" links written by the language model, which
 * was never shown which pages exist. By November 2026, 137 of 158 such links
 * pointed at recipes and guides it had invented, and 39 of 52 guides sent
 * readers and Googlebot to nothing but 404s. Templates render a content link
 * only when its target is in this set, so a bad link in the data is dropped at
 * build time instead of being published. A link to a recipe that is scheduled
 * but not yet live simply appears once that recipe is published.
 */
const tagCounts = validatedRecipes.reduce<Record<string, number>>((acc, r) => {
  for (const t of r.tags ?? []) acc[t.toLowerCase()] = (acc[t.toLowerCase()] ?? 0) + 1;
  return acc;
}, {});

const KNOWN_PATHS = new Set<string>([
  ...validatedRecipes.map((r) => `/recipe/${r.slug}`),
  ...guides.map((g) => `/guides/${g.slug}`),
  ...Object.keys(substitutesContent).map((s) => `/substitutes/${s}`),
  ...Object.keys(categoryExtraContent).map((c) => `/categories/${c}`),
  ...Object.entries(tagCounts)
    .filter(([tag, n]) => isIndexableTag(tag, n))
    .map(([tag]) => `/tags/${tag}`),
]);

export function isKnownInternalPath(href: string): boolean {
  const path = href.trim().split('#')[0].split('?')[0].replace(/\/$/, '');
  return KNOWN_PATHS.has(path);
}
