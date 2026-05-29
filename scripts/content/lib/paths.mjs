import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '../../..');
export const CONTENT = path.join(ROOT, 'content');
export const DRAFTS = path.join(CONTENT, 'drafts');
export const SCHEDULED = path.join(CONTENT, 'scheduled');
export const PUBLISHED_ARCHIVE = path.join(CONTENT, 'published');
export const ASSETS = path.join(CONTENT, 'assets');
export const GENERATED_RECIPES = path.join(ROOT, 'src/data/recipes/generated');
export const GENERATED_GUIDES = path.join(ROOT, 'src/data/guides/generated');
export const PUBLIC_DIR = path.join(ROOT, 'public');
export const GUIDE_DRAFTS = path.join(CONTENT, 'guide-drafts');
export const GUIDE_SCHEDULED = path.join(CONTENT, 'guide-scheduled');
export const GUIDE_PUBLISHED = path.join(CONTENT, 'guide-published');

export const PATHS = {
  config: path.join(CONTENT, 'config.json'),
  ideas: path.join(CONTENT, 'ideas.json'),
  guideIdeas: path.join(CONTENT, 'guide-ideas.json'),
};

export function ensureDirs() {
  for (const dir of [
    DRAFTS,
    SCHEDULED,
    PUBLISHED_ARCHIVE,
    ASSETS,
    GENERATED_RECIPES,
    GENERATED_GUIDES,
    GUIDE_DRAFTS,
    GUIDE_SCHEDULED,
    GUIDE_PUBLISHED,
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
}
