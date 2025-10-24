import fs from 'fs';
import path from 'path';

// Generate dynamic sitemap with current date
const generateSitemap = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>https://incr-ediblecupcakes.com/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com/A%20vibrant%2C%20mouth-watering%20cupcake%20scene.png</image:loc>
      <image:title>Incr-EdibleCupCakes - Extraordinary Cupcake Recipes</image:title>
    </image:image>
  </url>

  <!-- Main Pages -->
  <url>
    <loc>https://incr-ediblecupcakes.com/recipes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com/Sarah.png</image:loc>
      <image:title>Sarah - Professional Baker and Recipe Developer</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Category Pages -->
  <url>
    <loc>https://incr-ediblecupcakes.com/categories/classic</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/categories/keto</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/categories/vegan</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/categories/nut-free</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/categories/gluten-free</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Recipe Pages -->
  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/classic-vanilla-dream-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2FClassic%20Vanilla%20Dream%20Cupcakes.jpg</image:loc>
      <image:title>Classic Vanilla Dream Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/keto-chocolate-bliss-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2Fketo-chocolate-bliss-cupcakes.png</image:loc>
      <image:title>Keto Chocolate Bliss Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/vegan-rainbow-surprise-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2Fvegan-rainbow-surprise-cupcakes.jpg</image:loc>
      <image:title>Vegan Rainbow Surprise Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/nut-free-lemon-sunshine-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2Fnut-free-lemon-sunshine-cupcakes.jpg</image:loc>
      <image:title>Nut-Free Lemon Sunshine Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/red-velvet-romance-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2Fred-velvet-romance-cupcakes.jpg</image:loc>
      <image:title>Red Velvet Romance Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/gluten-free-almond-joy-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2Fgluten-free-almond-joy-cupcakes.jpg</image:loc>
      <image:title>Gluten-Free Almond Joy Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/rosewater-pistachio-delight-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2Frosewater-pistachio-delight-cupcakes.jpg</image:loc>
      <image:title>Rosewater Pistachio Delight Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/mango-coconut-sunset-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2Fmango-coconut-sunset-cupcakes.png</image:loc>
      <image:title>Mango Coconut Sunset Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/chocolate-chili-firecracker-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2FChocolate%20Chili%20Firecracker%20Cupcakes.jpg</image:loc>
      <image:title>Chocolate Chili Firecracker Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/boston-cream-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2Fboston-cream-cupcakes.jpg</image:loc>
      <image:title>Boston Cream Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/prune-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2Fprune-cupcakes.jpg</image:loc>
      <image:title>Prune Cupcakes Recipe</image:title>
    </image:image>
  </url>

  <url>
    <loc>https://incr-ediblecupcakes.com/recipe/yellow-cake-cupcakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://incr-ediblecupcakes.com%2Fyellow-cake-cupcakes.jpg</image:loc>
      <image:title>Yellow Cake Cupcakes Recipe</image:title>
    </image:image>
  </url>

</urlset>`;

  return sitemap;
};

// Write sitemap to public directory
const sitemapContent = generateSitemap();
fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapContent);

console.log('✅ Sitemap updated with current date:', new Date().toISOString().split('T')[0]);
