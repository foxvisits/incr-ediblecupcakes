import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer, build } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.resolve(root, 'dist');

// Extract recipe slugs from the recipes data file
function getRecipeSlugs() {
  const recipesPath = path.resolve(root, 'src/data/recipes.ts');
  const src = readFileSync(recipesPath, 'utf8');
  
  // Extract explicit slugs from the file
  const slugMatches = [...src.matchAll(/slug:\s*'([^']+)'/g)];
  const explicitSlugs = slugMatches.map(match => match[1]);
  
  if (explicitSlugs.length > 0) {
    return Array.from(new Set(explicitSlugs));
  }
  
  // Fallback: generate slugs from titles
  const titleMatches = [...src.matchAll(/title:\s*'([^']+)'/g)];
  const titles = titleMatches.map(match => match[1]);
  
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, '');
  };
  
  return Array.from(new Set(titles.map(generateSlug)));
}

async function prerender() {
  console.log('🏗️  Building client assets...');
  
  // Build the client-side assets first
  await build({
    root,
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  });

  console.log('🔧 Creating SSR server...');
  
  // Create a Vite dev server in SSR mode for rendering
  const server = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
    ssr: {
      noExternal: ['react-helmet-async']
    }
  });

  try {
    // Load the template and SSR entry point
    const templatePath = path.resolve(root, 'index.html');
    const template = readFileSync(templatePath, 'utf8');
    
    console.log('📄 Loading SSR module...');
    const { render } = await server.ssrLoadModule('/src/entry-server.tsx');

    // Define all routes to pre-render
    const staticRoutes = [
      '/',
      '/recipes', 
      '/about', 
      '/contact'
    ];
    
    // Get recipe slugs and create recipe routes
    const recipeSlugs = getRecipeSlugs();
    const recipeRoutes = recipeSlugs.map(slug => `/recipe/${slug}`);
    
    // Category routes
    const categoryRoutes = [
      '/categories/classic',
      '/categories/keto', 
      '/categories/vegan',
      '/categories/nut-free',
      '/categories/gluten-free'
    ];
    
    const allRoutes = [...staticRoutes, ...recipeRoutes, ...categoryRoutes];
    
    console.log(`🚀 Pre-rendering ${allRoutes.length} routes...`);

    // Pre-render each route
    for (const url of allRoutes) {
      try {
        console.log(`  📝 Rendering: ${url}`);
        
        const { appHtml, head } = await render(url);
        
        // Replace placeholders in template with rendered content
        const html = template
          .replace('<!--app-head-->', head || '')
          .replace('<!--app-html-->', appHtml || '');

        // Determine output directory
        const outDir = url === '/' ? dist : path.join(dist, url);
        
        // Create directory if it doesn't exist
        if (!existsSync(outDir)) {
          mkdirSync(outDir, { recursive: true });
        }
        
        // Write the HTML file
        const htmlPath = path.join(outDir, 'index.html');
        writeFileSync(htmlPath, html, 'utf8');
        
        console.log(`  ✅ Generated: ${url}`);
      } catch (error) {
        console.error(`  ❌ Failed to render ${url}:`, error.message);
      }
    }
    
    console.log('🎉 Pre-rendering complete!');
    
  } catch (error) {
    console.error('❌ Pre-rendering failed:', error);
    throw error;
  } finally {
    await server.close();
  }
}

// Run the pre-rendering
prerender().catch(error => {
  console.error('💥 Pre-rendering process failed:', error);
  process.exit(1);
});