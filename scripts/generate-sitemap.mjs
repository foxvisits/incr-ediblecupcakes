import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Recipe data - simplified extraction for sitemap generation
const recipes = [
  {
    slug: 'classic-vanilla-dream-cupcakes',
    title: 'Classic Vanilla Dream Cupcakes',
    image: '/Classic Vanilla Dream Cupcakes.jpg'
  },
  {
    slug: 'keto-chocolate-bliss-cupcakes', 
    title: 'Keto Chocolate Bliss Cupcakes',
    image: '/keto-chocolate-bliss-cupcakes.png'
  },
  {
    slug: 'vegan-rainbow-surprise-cupcakes',
    title: 'Vegan Rainbow Surprise Cupcakes', 
    image: '/vegan-rainbow-surprise-cupcakes.jpg'
  },
  {
    slug: 'nut-free-lemon-sunshine-cupcakes',
    title: 'Nut-Free Lemon Sunshine Cupcakes',
    image: '/nut-free-lemon-sunshine-cupcakes.jpg'
  },
  {
    slug: 'red-velvet-romance-cupcakes',
    title: 'Red Velvet Romance Cupcakes',
    image: '/red-velvet-romance-cupcakes.jpg'
  },
  {
    slug: 'gluten-free-almond-joy-cupcakes',
    title: 'Gluten-Free Almond Joy Cupcakes',
    image: '/gluten-free-almond-joy-cupcakes.jpg'
  },
  {
    slug: 'rosewater-pistachio-delight-cupcakes',
    title: 'Rosewater Pistachio Delight Cupcakes',
    image: '/rosewater-pistachio-delight-cupcakes.jpg'
  },
  {
    slug: 'mango-coconut-sunset-cupcakes',
    title: 'Mango Coconut Sunset Cupcakes',
    image: '/mango-coconut-sunset-cupcakes.png'
  },
  {
    slug: 'chocolate-chili-firecracker-cupcakes',
    title: 'Chocolate Chili Firecracker Cupcakes',
    image: '/Chocolate Chili Firecracker Cupcakes.jpg'
  }
];

function generateSitemap() {
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
      <image:loc>${baseUrl}/A%20vibrant%2C%20mouth-watering%20cupcake%20scene.png</image:loc>
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
      <image:loc>${baseUrl}/Sarah.png</image:loc>
      <image:title>Sarah - Professional Baker and Recipe Developer</image:title>
    </image:image>
  </url>

  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
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

`;

  // Add individual recipe pages
  recipes.forEach(recipe => {
    sitemap += `  <!-- ${recipe.title} -->
  <url>
    <loc>${baseUrl}/recipe/${recipe.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${baseUrl}${encodeURIComponent(recipe.image)}</image:loc>
      <image:title>${recipe.title} Recipe</image:title>
    </image:image>
  </url>

`;
  });

  sitemap += `</urlset>`;

  // Write sitemap to dist directory
  const sitemapPath = path.resolve(root, 'dist', 'sitemap.xml');
  writeFileSync(sitemapPath, sitemap, 'utf8');
  
  console.log('✅ Generated sitemap.xml with', recipes.length + 9, 'URLs');
}

generateSitemap();