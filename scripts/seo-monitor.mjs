#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const root = process.cwd();

const checkSEO = () => {
  console.log('🔍 SEO Health Check Starting...\n');

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
    console.log('✅ llms.txt present for AI crawlers');
  } else {
    console.log('⚠️  llms.txt missing');
  }

  const layoutPath = path.join(root, 'src', 'layouts', 'BaseLayout.astro');
  if (fs.existsSync(layoutPath)) {
    const layout = fs.readFileSync(layoutPath, 'utf8');
    if (layout.includes('slot name="head"')) {
      console.log('✅ BaseLayout exposes head slot');
    } else {
      console.log('❌ BaseLayout missing <slot name="head" />');
    }
  }

  const privacyPath = path.join(root, 'src', 'pages', 'privacy.astro');
  if (fs.existsSync(privacyPath)) {
    console.log('✅ privacy.astro page exists');
  } else {
    console.log('⚠️  privacy.astro missing');
  }

  console.log('\n🎯 SEO Health Check Complete!');
  console.log('\n📋 After deploy: docs/GSC_REINDEX_QUEUE.md');
};

checkSEO();
