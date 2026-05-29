#!/usr/bin/env node
/** One-time helper: trim long recipe card descriptions to ~180 words max. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '..', 'src', 'data', 'recipes.ts');
let content = fs.readFileSync(file, 'utf8');

function trimToWords(text, maxWords = 180) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '…';
}

content = content.replace(
  /description: '((?:\\'|[^'])*)'/g,
  (match, inner) => {
    const unescaped = inner.replace(/\\'/g, "'");
    if (unescaped.split(/\s+/).length <= 200) return match;
    const trimmed = trimToWords(unescaped, 180).replace(/'/g, "\\'");
    return `description: '${trimmed}'`;
  }
);

// Fix author Emma Thompson -> Sarah
content = content.replace(/name: 'Baker Emma Thompson'/g, "name: 'Sarah'");

// Add dateModified where missing on priority slugs
const today = '2026-05-29';
for (const slug of ['yellow-cake-cupcakes', 'keto-chocolate-bliss-cupcakes', 'mango-coconut-sunset-cupcakes', 'chocolate-chili-firecracker-cupcakes']) {
  const re = new RegExp(`(slug: '${slug}',[\\s\\S]*?)(dateModified: '[^']*',)?`, 'm');
  if (re.test(content)) {
    content = content.replace(re, (m, prefix, dm) => {
      if (dm) return m.replace(/dateModified: '[^']*'/, `dateModified: '${today}'`);
      return prefix + `dateModified: '${today}',\n    `;
    });
  }
}

fs.writeFileSync(file, content);
console.log('Trimmed descriptions and fixed author/dates.');
