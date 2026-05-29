import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Dynamic import of data files - use file:// URL for Windows compatibility
const recipesModule = await import(pathToFileURL(path.join(root, 'src', 'data', 'recipes.ts')).href);
const guidesModule = await import(pathToFileURL(path.join(root, 'src', 'data', 'guides.ts')).href);

const validatedRecipes = recipesModule.validatedRecipes;
const guides = guidesModule.guides;

const getQualifiedTagSlugs = () => {
  const tagCounts = validatedRecipes.reduce((acc, r) => {
    (r.tags || []).forEach((t) => {
      const key = t.toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
    });
    return acc;
  }, {});
  return Object.keys(tagCounts).filter((tag) => tagCounts[tag] >= 2);
};

const qualifiedTags = getQualifiedTagSlugs();

// Helper function to encode image URL properly (preserve /, encode only special chars in filename)
const encodeImageUrl = (imagePath) => {
  // Split path into parts, encode only the filename, keep / separators
  const parts = imagePath.split('/');
  const encodedParts = parts.map((part, index) => {
    // Don't encode the first empty part (leading /) or directory separators
    if (index === 0 && part === '') return '';
    // Encode only the filename (last part) and directory names
    return encodeURIComponent(part);
  });
  return encodedParts.join('/');
};

// Generate dynamic sitemap with current date
const generateSitemap = () => {
  const baseUrl = 'https://incr-ediblecupcakes.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${baseUrl}${encodeImageUrl('/A vibrant, mouth-watering cupcake scene.png')}</image:loc>
      <image:title>Incr-EdibleCupCakes - Extraordinary Cupcake Recipes</image:title>
    </image:image>
  </url>

  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/recipes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}${encodeImageUrl('/Sarah.png')}</image:loc>
      <image:title>Sarah - Professional Baker and Recipe Developer</image:title>
    </image:image>
  </url>

  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Categories Index -->
  <url>
    <loc>${baseUrl}/categories</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Category Pages -->
  <url>
    <loc>${baseUrl}/categories/classic</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/categories/keto</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/categories/vegan</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/categories/nut-free</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/categories/gluten-free</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/categories/gourmet</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/categories/tropical</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/categories/spiced</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/categories/seasonal</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Tags Index -->
  <url>
    <loc>${baseUrl}/tags</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Guides Index -->
  <url>
    <loc>${baseUrl}/guides</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

`;

  // Add all recipe pages dynamically
  validatedRecipes.forEach(recipe => {
    const imageUrl = encodeImageUrl(recipe.image);
    sitemap += `  <!-- ${recipe.title} -->
  <url>
    <loc>${baseUrl}/recipe/${recipe.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${baseUrl}${imageUrl}</image:loc>
      <image:title>${recipe.title} Recipe</image:title>
    </image:image>
  </url>

`;
  });

  // Add tag pages (2+ recipes; thin tags use noindex on-site)
  qualifiedTags.forEach(tag => {
    sitemap += `  <!-- Tag: ${tag} -->
  <url>
    <loc>${baseUrl}/tags/${encodeURIComponent(tag)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

`;
  });

  // Add all guide pages
  guides.forEach(guide => {
    const imageUrl = encodeImageUrl(guide.image);
    sitemap += `  <!-- ${guide.title} -->
  <url>
    <loc>${baseUrl}/guides/${guide.slug}</loc>
    <lastmod>${guide.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}${imageUrl}</image:loc>
      <image:title>${guide.title}</image:title>
    </image:image>
  </url>

`;
  });

  // Add substitute pages
  const substitutes = ['egg', 'buttermilk', 'sugar', 'flour'];
  substitutes.forEach(ingredient => {
    sitemap += `  <!-- Substitute: ${ingredient} -->
  <url>
    <loc>${baseUrl}/substitutes/${ingredient}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

`;
  });

  // Add baking-times pages
  const bakingTypes = ['standard', 'mini', 'jumbo'];
  bakingTypes.forEach(type => {
    sitemap += `  <!-- Baking Times: ${type} -->
  <url>
    <loc>${baseUrl}/baking-times/${type}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

`;
  });

  sitemap += `</urlset>`;

  return sitemap;
};

// Write sitemap to public directory
const sitemapContent = generateSitemap();
fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapContent);

const totalUrls = 5 + // homepage, recipes, about, contact, privacy
  1 + // categories index
  9 + // category pages
  1 + // tags index
  validatedRecipes.length + // recipe pages
  qualifiedTags.length + // tag pages (2+ recipes)
  1 + // guides index
  guides.length + // guide pages
  4 + // substitute pages
  3; // baking-times pages

console.log(`✅ Sitemap updated with ${totalUrls} URLs`);
console.log(`   - ${validatedRecipes.length} recipe pages`);
console.log(`   - ${qualifiedTags.length} tag pages (2+ recipes)`);
console.log(`   - ${guides.length} guide pages`);
console.log(`   - Current date: ${new Date().toISOString().split('T')[0]}`);
