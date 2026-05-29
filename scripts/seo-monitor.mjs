#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { INDEXNOW_KEY, LLMS_URL } from './lib/seo-config.mjs';

const root = process.cwd();

const REQUIRED_LLMS_PATHS = [
  '/guides/natural-food-coloring-for-frosting',
  '/guides/cupcake-vs-muffin-whats-the-real-difference',
  '/guides/how-to-create-cupcake-flavors',
  '/guides/cupcake-flavor-pairing-guide',
  '/recipe/miso-caramel-cupcakes',
  '/recipe/ube-coconut-cupcakes',
  '/categories',
  '/substitutes/egg',
  '/baking-times/standard',
];

const checkSEO = () => {
  console.log('🔍 SEO Health Check Starting...\n');

  const keyPath = path.join(root, 'public', `${INDEXNOW_KEY}.txt`);
  if (fs.existsSync(keyPath) && fs.readFileSync(keyPath, 'utf8').trim() === INDEXNOW_KEY) {
    console.log('✅ IndexNow key file present (Bing Webmaster)');
  } else {
    console.log('⚠️  IndexNow key file missing — run npm run update-seo');
  }

  const sitemapPath = path.join(root, 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const sitemapStats = fs.statSync(sitemapPath);
    const daysSinceUpdate = Math.floor(
      (Date.now() - sitemapStats.mtime) / (1000 * 60 * 60 * 24)
    );
    console.log(`✅ Sitemap exists (last updated: ${daysSinceUpdate} days ago)`);
    if (daysSinceUpdate > 7) {
      console.log('⚠️  Sitemap is older than 7 days - run npm run update-sitemap');
    }
    if (!fs.readFileSync(sitemapPath, 'utf8').includes('/privacy')) {
      console.log('⚠️  Sitemap missing /privacy - run npm run update-sitemap');
    }
    if (fs.readFileSync(sitemapPath, 'utf8').includes('mouth-watering')) {
      console.log('⚠️  Sitemap still references legacy hero image filename');
    }
  } else {
    console.log('❌ Sitemap not found!');
  }

  const robotsPath = path.join(root, 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    for (const bot of ['GPTBot', 'Google-Extended', 'PerplexityBot']) {
      if (robots.includes(`User-agent: ${bot}`) && robots.includes('Allow: /')) {
        console.log(`✅ robots.txt allows ${bot}`);
      } else {
        console.log(`⚠️  robots.txt missing Allow for ${bot}`);
      }
    }
    if (robots.includes('Sitemap:')) {
      console.log('✅ Sitemap declared in robots.txt');
    }
  } else {
    console.log('❌ Robots.txt not found!');
  }

  const llmsPath = path.join(root, 'public', 'llms.txt');
  if (fs.existsSync(llmsPath)) {
    const llms = fs.readFileSync(llmsPath, 'utf8');
    console.log('✅ llms.txt present for AI crawlers');
    if (llms.includes(LLMS_URL)) {
      console.log('✅ llms.txt self-reference present');
    }
    for (const requiredPath of REQUIRED_LLMS_PATHS) {
      if (!llms.includes(requiredPath)) {
        console.log(`⚠️  llms.txt missing ${requiredPath} — run npm run update-seo`);
      }
    }
  } else {
    console.log('⚠️  llms.txt missing — run npm run update-seo');
  }

  const headersPath = path.join(root, 'public', '_headers');
  if (fs.existsSync(headersPath)) {
    const headers = fs.readFileSync(headersPath, 'utf8');
    if (headers.includes('Strict-Transport-Security')) {
      console.log('✅ HSTS header configured');
    } else {
      console.log('⚠️  HSTS header missing in _headers');
    }
    if (headers.includes('Content-Security-Policy:') && !headers.includes('Report-Only')) {
      console.log('✅ Enforced CSP configured');
    } else {
      console.log('⚠️  CSP not enforced in _headers');
    }
  }

  const redirectsPath = path.join(root, 'public', '_redirects');
  if (fs.existsSync(redirectsPath)) {
    const redirects = fs.readFileSync(redirectsPath, 'utf8');
    if (redirects.includes('/hero-cupcake-scene.png')) {
      console.log('✅ Canonical image redirects present');
    } else {
      console.log('⚠️  Missing canonical image redirects');
    }
  }

  const layoutPath = path.join(root, 'src', 'layouts', 'BaseLayout.astro');
  if (fs.existsSync(layoutPath)) {
    const layout = fs.readFileSync(layoutPath, 'utf8');
    if (layout.includes('slot name="head"')) {
      console.log('✅ BaseLayout exposes head slot');
    } else {
      console.log('❌ BaseLayout missing <slot name="head" />');
    }
    if (layout.includes('GoogleAnalytics')) {
      console.log('✅ Google Analytics component wired in BaseLayout');
    }
  }

  const recipePagePath = path.join(root, 'src', 'pages', 'recipe', '[slug].astro');
  if (fs.existsSync(recipePagePath)) {
    const recipePage = fs.readFileSync(recipePagePath, 'utf8');
    if (!recipePage.includes('"difficulty":')) {
      console.log('✅ Recipe schema excludes invalid difficulty property');
    } else {
      console.log('⚠️  Recipe schema still includes invalid difficulty property');
    }
  }

  const privacyPath = path.join(root, 'src', 'pages', 'privacy.astro');
  if (fs.existsSync(privacyPath)) {
    console.log('✅ privacy.astro page exists');
  } else {
    console.log('⚠️  privacy.astro missing');
  }

  const homeFaqPath = path.join(root, 'src', 'data', 'homeFaq.ts');
  if (fs.existsSync(homeFaqPath)) {
    console.log('✅ Homepage FAQ data present');
  }

  console.log('\n🎯 SEO Health Check Complete!');
  console.log('\n📋 After deploy: docs/GSC_REINDEX_QUEUE.md');
  console.log('📋 Set PUBLIC_GA_MEASUREMENT_ID in Netlify to override default GA4 ID');
};

checkSEO();
