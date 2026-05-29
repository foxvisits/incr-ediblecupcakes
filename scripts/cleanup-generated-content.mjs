/** Re-sanitize generated + archived content for readability and voice rules */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  repairStructuralFields,
  sanitizeDeep,
  validateHumanVoice,
  hasBannedContent,
} from './content/lib/text-cleanup.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TARGET_DIRS = [
  'src/data/recipes/generated',
  'src/data/guides/generated',
  'content/published',
  'content/guide-published',
  'content/scheduled',
  'content/guide-scheduled',
  'content/drafts',
  'content/guide-drafts',
];

let count = 0;
let warnings = 0;

for (const rel of TARGET_DIRS) {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const fp = path.join(dir, file);
    const raw = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const repaired = repairStructuralFields(raw);
    const cleaned = sanitizeDeep(repaired);
    fs.writeFileSync(fp, JSON.stringify(cleaned, null, 2) + '\n', 'utf8');

    const voiceErrors = validateHumanVoice(cleaned);
    const stillDash = collectAll(cleaned).some(hasBannedContent);
    if (stillDash || voiceErrors.length) {
      console.warn(`  ⚠️  ${rel}/${file}:`, [...voiceErrors, stillDash ? 'em/en dash remains' : ''].filter(Boolean).join('; '));
      warnings++;
    } else {
      console.log(`  ✓ ${rel}/${file}`);
    }
    count++;
  }
}

function collectAll(obj, acc = []) {
  if (typeof obj === 'string') acc.push(obj);
  else if (Array.isArray(obj)) obj.forEach((v) => collectAll(v, acc));
  else if (obj && typeof obj === 'object') Object.values(obj).forEach((v) => collectAll(v, acc));
  return acc;
}

console.log(`\n${count} file(s) processed.${warnings ? ` ${warnings} warning(s).` : ''}\n`);
