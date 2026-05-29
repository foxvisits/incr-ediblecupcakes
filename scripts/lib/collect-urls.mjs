import { SITE_ORIGIN } from './seo-config.mjs';

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/recipes', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly', imageKey: 'sarah' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/categories', priority: '0.8', changefreq: 'weekly' },
  { path: '/tags', priority: '0.7', changefreq: 'weekly' },
  { path: '/guides', priority: '0.8', changefreq: 'weekly' },
];

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

  for (const page of STATIC_PAGES) {
    entries.push({
      loc: `${SITE_ORIGIN}${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority,
      type: 'page',
      image: page.imageKey ? SITE_IMAGES[page.imageKey] : page.path === '/' ? SITE_IMAGES.hero : null,
    });
  }

  for (const slug of CATEGORY_SLUGS) {
    entries.push({
      loc: `${SITE_ORIGIN}/categories/${slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
      type: 'category',
    });
  }

  for (const recipe of validatedRecipes) {
    entries.push({
      loc: `${SITE_ORIGIN}/recipe/${recipe.slug}`,
      lastmod: recipe.dateModified || recipe.datePublished || currentDate,
      changefreq: 'monthly',
      priority: '0.9',
      type: 'recipe',
      title: recipe.title,
      image: recipe.image,
    });
  }

  for (const tag of sitemapTags) {
    entries.push({
      loc: `${SITE_ORIGIN}/tags/${encodeURIComponent(tag)}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7',
      type: 'tag',
    });
  }

  for (const guide of guides) {
    entries.push({
      loc: `${SITE_ORIGIN}/guides/${guide.slug}`,
      lastmod: guide.publishedAt || currentDate,
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
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7',
      type: 'substitute',
    });
  }

  for (const type of BAKING_TIME_SLUGS) {
    entries.push({
      loc: `${SITE_ORIGIN}/baking-times/${type}`,
      lastmod: currentDate,
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
