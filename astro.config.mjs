import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('404'),
    })
  ],
  site: 'https://incr-ediblecupcakes.com',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
    format: 'file',
  },
  vite: {
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    ssr: {
      noExternal: ['lucide-react'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'icons': ['lucide-react']
          }
        }
      },
      target: 'es2018',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  },
  experimental: {
    contentCollectionCache: true,
  },
});
