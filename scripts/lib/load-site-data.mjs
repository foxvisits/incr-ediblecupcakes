import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export async function loadSiteData() {
  const recipesModule = await import(
    pathToFileURL(path.join(root, 'src', 'data', 'recipes.ts')).href
  );
  const guidesModule = await import(
    pathToFileURL(path.join(root, 'src', 'data', 'guides.ts')).href
  );
  const siteAssetsModule = await import(
    pathToFileURL(path.join(root, 'src', 'data', 'siteAssets.ts')).href
  );
  const tagContentModule = await import(
    pathToFileURL(path.join(root, 'src', 'data', 'tagContent.ts')).href
  );

  const validatedRecipes = recipesModule.validatedRecipes;
  const guides = guidesModule.guides;
  const SITE_IMAGES = siteAssetsModule.SITE_IMAGES;
  const getSitemapTags = tagContentModule.getSitemapTags;

  const tagCounts = validatedRecipes.reduce((acc, r) => {
    (r.tags || []).forEach((t) => {
      const key = t.toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
    });
    return acc;
  }, {});
  const qualifiedTags = Object.keys(tagCounts).filter((tag) => tagCounts[tag] >= 2);
  const sitemapTags = getSitemapTags(qualifiedTags);

  return { validatedRecipes, guides, SITE_IMAGES, sitemapTags, qualifiedTags };
}
