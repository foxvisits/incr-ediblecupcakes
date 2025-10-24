#!/usr/bin/env node

// SEO Monitoring Script
import fs from 'fs';
import path from 'path';

const checkSEO = () => {
  console.log('🔍 SEO Health Check Starting...\n');

  // Check if sitemap exists and is recent
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const sitemapStats = fs.statSync(sitemapPath);
    const lastModified = new Date(sitemapStats.mtime);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now - lastModified) / (1000 * 60 * 60 * 24));
    
    console.log(`✅ Sitemap exists (last updated: ${daysSinceUpdate} days ago)`);
    
    if (daysSinceUpdate > 7) {
      console.log('⚠️  Sitemap is older than 7 days - consider updating');
    }
  } else {
    console.log('❌ Sitemap not found!');
  }

  // Check robots.txt
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    
    if (robotsContent.includes('Disallow: /*.json$')) {
      console.log('✅ Robots.txt blocks JSON files (good for security)');
    }
    
    if (robotsContent.includes('Allow: /manifest.json')) {
      console.log('✅ Robots.txt allows manifest.json');
    }
    
    if (robotsContent.includes('Sitemap:')) {
      console.log('✅ Sitemap declared in robots.txt');
    }
  } else {
    console.log('❌ Robots.txt not found!');
  }

  // Check manifest.json
  const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    if (manifest.name && manifest.short_name) {
      console.log('✅ PWA manifest.json configured');
    }
    
    if (manifest.lang === 'en') {
      console.log('✅ Manifest language set correctly');
    }
  } else {
    console.log('❌ Manifest.json not found!');
  }

  // Check for duplicate schema markup
  const baseLayoutPath = path.join(process.cwd(), 'src', 'layouts', 'BaseLayout.astro');
  if (fs.existsSync(baseLayoutPath)) {
    const layoutContent = fs.readFileSync(baseLayoutPath, 'utf8');
    const schemaCount = (layoutContent.match(/@type/g) || []).length;
    
    if (schemaCount <= 4) {
      console.log('✅ No duplicate schema markup detected');
    } else {
      console.log(`⚠️  Multiple schema markup blocks detected (${schemaCount} @type declarations)`);
    }
  }

  console.log('\n🎯 SEO Health Check Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Submit sitemap to Google Search Console');
  console.log('2. Request reindexing of main pages');
  console.log('3. Monitor Core Web Vitals');
  console.log('4. Check for crawl errors in GSC');
};

checkSEO();
