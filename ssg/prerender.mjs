import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer, build } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.resolve(root, 'dist');

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function getRecipeSlugs() {
  const recipesPath = path.resolve(root, 'src/data/recipes.ts');
  const src = readFileSync(recipesPath, 'utf8');
  const explicit = [...src.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);
  if (explicit.length) return Array.from(new Set(explicit));
  const titles = [...src.matchAll(/title:\s*'([^']+)'/g)].map(m => m[1]);
  return Array.from(new Set(titles.map(t => slugify(t))));
}

async function prerender() {
  // 1) Build client assets
  await build({ root });

  // 2) Create a Vite dev server in SSR mode
  const server = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom'
  });

  try {
    const templatePath = path.resolve(root, 'index.html');
    const template = readFileSync(templatePath, 'utf8');
    const { render } = await server.ssrLoadModule('/src/entry-server.tsx');

    const staticRoutes = ['/', '/about', '/recipes', '/contact'];
    const recipes = getRecipeSlugs().map(slug => `/recipe/${slug}`);
    const routes = [...staticRoutes, ...recipes];

    for (const url of routes) {
      const { appHtml, head } = await render(url);
      const html = template
        .replace('<!--app-head-->', head)
        .replace('<!--app-html-->', appHtml);

      const outDir = path.join(dist, url === '/' ? '' : url);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
      console.log('✓ prerendered', url);
    }
  } finally {
    await server.close();
  }
}

prerender().catch(err => { console.error(err); process.exit(1); });
