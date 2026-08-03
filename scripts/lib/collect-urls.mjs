import { SITE_ORIGIN } from './seo-config.mjs';

/**
 * `lastmod` must describe when the page's content actually changed.
 *
 * This previously stamped `currentDate` on ~60 of the ~96 URLs, so every daily
 * run republished a sitemap claiming the whole site had changed that day.
 * Google drops lastmod as a scheduling signal once it proves unreliable, so the
 * churn cost crawl budget instead of earning it. Each entry below now derives
 * its date from the content it actually renders:
 *
 *   'newest-recipe' / 'newest-guide' / 'newest-content' — listing pages, dated
 *                     by the freshest item they list.
 *   'editorial'     — hand-written pages; bump EDITORIAL_LASTMOD when the copy
 *                     really changes (last verified against git history).
 */
const EDITORIAL_LASTMOD = '2026-05-29';

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly', lastmodFrom: 'newest-content' },
  { path: '/recipes', priority: '0.9', changefreq: 'weekly', lastmodFrom: 'newest-recipe' },
  { path: '/about', priority: '0.8', changefreq: 'monthly', imageKey: 'sarah', lastmodFrom: 'editorial' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly', lastmodFrom: 'editorial' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly', lastmodFrom: 'editorial' },
  { path: '/categories', priority: '0.8', changefreq: 'weekly', lastmodFrom: 'newest-recipe' },
  { path: '/tags', priority: '0.7', changefreq: 'weekly', lastmodFrom: 'newest-recipe' },
  { path: '/guides', priority: '0.8', changefreq: 'weekly', lastmodFrom: 'newest-guide' },
];

/** Latest ISO date in a list, ignoring blanks. ISO dates sort lexically. */
function newestDate(dates, fallback) {
  const valid = dates.filter(Boolean).sort();
  return valid.length ? valid[valid.length - 1] : fallback;
}

const recipeLastmod = (recipe) => recipe.dateModified || recipe.datePublished || null;
const guideLastmod = (guide) => guide.dateModified || guide.publishedAt || guide.datePublished || null;

const CATEGORY_SLUGS = [
  'classic', 'keto', 'vegan', 'nut-free', 'gluten-free',
  'gourmet', 'tropical', 'spiced', 'seasonal',
];

const SUBSTITUTE_SLUGS = ['egg', 'buttermilk', 'sugar', 'flour'];
const BAKING_TIME_SLUGS = ['standard', 'mini', 'jumbo'];

export function encodeImageUrl(imagePath) {
  const parts = imagePath.split('/');
  return parts
    .map((part, index) => (index === 0 && part === '' ? '' : encodeURIComponent(part)))
    .join('/');
}

/** All indexable URLs with metadata for sitemap, llms.txt, IndexNow. */
export function collectUrls({ validatedRecipes, guides, SITE_IMAGES, sitemapTags }, currentDate) {
  const entries = [];

  const newestRecipe = newestDate(validatedRecipes.map(recipeLastmod), EDITORIAL_LASTMOD);
  const newestGuide = newestDate(guides.map(guideLastmod), EDITORIAL_LASTMOD);
  const newestContent = newestDate([newestRecipe, newestGuide], EDITORIAL_LASTMOD);

  const resolveStaticLastmod = (page) => {
    switch (page.lastmodFrom) {
      case 'newest-recipe':
        return newestRecipe;
      case 'newest-guide':
        return newestGuide;
      case 'newest-content':
        return newestContent;
      default:
        return EDITORIAL_LASTMOD;
    }
  };

  for (const page of STATIC_PAGES) {
    entries.push({
      loc: `${SITE_ORIGIN}${page.path}`,
      lastmod: resolveStaticLastmod(page),
      changefreq: page.changefreq,
      priority: page.priority,
      type: 'page',
      image: page.imageKey ? SITE_IMAGES[page.imageKey] : page.path === '/' ? SITE_IMAGES.hero : null,
    });
  }

  for (const slug of CATEGORY_SLUGS) {
    // A category page changes when a recipe in that category changes.
    entries.push({
      loc: `${SITE_ORIGIN}/categories/${slug}`,
      lastmod: newestDate(
        validatedRecipes.filter((r) => r.category === slug).map(recipeLastmod),
        EDITORIAL_LASTMOD,
      ),
      changefreq: 'weekly',
      priority: '0.8',
      type: 'category',
    });
  }

  for (const recipe of validatedRecipes) {
    entries.push({
      loc: `${SITE_ORIGIN}/recipe/${recipe.slug}`,
      lastmod: recipeLastmod(recipe) || EDITORIAL_LASTMOD,
      changefreq: 'monthly',
      priority: '0.9',
      type: 'recipe',
      title: recipe.title,
      image: recipe.image,
    });
  }

  for (const tag of sitemapTags) {
    // A tag page changes when a recipe carrying that tag changes.
    entries.push({
      loc: `${SITE_ORIGIN}/tags/${encodeURIComponent(tag)}`,
      lastmod: newestDate(
        validatedRecipes.filter((r) => r.tags?.includes(tag)).map(recipeLastmod),
        EDITORIAL_LASTMOD,
      ),
      changefreq: 'weekly',
      priority: '0.7',
      type: 'tag',
    });
  }

  for (const guide of guides) {
    entries.push({
      loc: `${SITE_ORIGIN}/guides/${guide.slug}`,
      lastmod: guideLastmod(guide) || EDITORIAL_LASTMOD,
      changefreq: 'monthly',
      priority: '0.8',
      type: 'guide',
      title: guide.title,
      image: guide.image,
    });
  }

  for (const ingredient of SUBSTITUTE_SLUGS) {
    entries.push({
      loc: `${SITE_ORIGIN}/substitutes/${ingredient}`,
      lastmod: EDITORIAL_LASTMOD,
      changefreq: 'monthly',
      priority: '0.7',
      type: 'substitute',
    });
  }

  for (const type of BAKING_TIME_SLUGS) {
    entries.push({
      loc: `${SITE_ORIGIN}/baking-times/${type}`,
      lastmod: EDITORIAL_LASTMOD,
      changefreq: 'monthly',
      priority: '0.7',
      type: 'baking-times',
    });
  }

  return entries;
}

export function entriesToUrlList(entries) {
  return entries.map((e) => e.loc);
}
