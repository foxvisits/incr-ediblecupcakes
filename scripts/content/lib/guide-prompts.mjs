import fs from 'fs';
import path from 'path';
import { CONTENT } from './paths.mjs';
import { generateSlug } from './schema.mjs';

function loadRequirements() {
  const reqPath = path.join(CONTENT, 'requirements.md');
  if (!fs.existsSync(reqPath)) return '';
  return fs.readFileSync(reqPath, 'utf8');
}

export function buildGuidePrompt(idea, config, existingTitles = []) {
  const seo = config.seo;
  const imageCount = config.generation?.imagesPerGuide ?? 3;
  return `You are Sarah, a home baker and recipe developer for Incr-EdibleCupCakes (incr-ediblecupcakes.com).

Write ONE original cupcake guide as JSON only (no markdown fences).

IDEA:
- Title: ${idea.title}
- Category: ${idea.category || 'technique'}
- Target keyword: ${idea.targetKeyword || idea.notes || 'none'}
- Notes: ${idea.notes || 'none'}

SITE QUALITY REQUIREMENTS:
${loadRequirements()}

GUIDE RULES:
- Write for a home baker. Average sentence: 12–18 words. Max 2 sentences per paragraph.
- Lead each H2 with a direct answer in the first sentence.
- Use bullets for steps, comparisons, and criteria.
- NEVER em dash (—) or en dash (–). NEVER: framework, mid-palate, leverage, utilize, delve.
- Say "main flavor" not "hero". Say "step-by-step plan" not "framework".
- summaryShort: 1-2 sentences for featured snippet (direct answer)
- sections: ${seo.minGuideSections ?? 5}+ sections with heading + 1-3 paragraphs each; optional bullet list per section
- howToSteps: 5-8 concise actionable steps (for HowTo schema)
- faq: ${seo.minFaqCount}+ unique Q&A for THIS guide
- sidebarTitle + sidebarBullets: 4-6 quick reference bullets
- table: optional comparison table with headers[] and rows[][] (2+ rows) when useful
- relatedLinks: 2-4 internal links {label, href} to /recipe/ or /guides/ pages on site
- metaTitle: under ${seo.titleMax} chars, format "{Title} | Incr-EdibleCupCakes Guides"
- metaDescription: ${seo.metaDescriptionMin}-${seo.metaDescriptionMax} chars
- images: exactly ${imageCount} objects (hero|process|detail), each with alt + prompt
  - hero only in page header; process + detail appear in article body
  - NEVER use em dashes (—) in any text field

Avoid duplicating these existing guide titles: ${existingTitles.slice(0, 20).join('; ')}

Return JSON:
{
  "title": "",
  "slug": "",
  "summaryShort": "",
  "metaTitle": "",
  "metaDescription": "",
  "sidebarTitle": "",
  "sidebarBullets": [],
  "sections": [{"heading":"","paragraphs":[],"list":[]}],
  "howToSteps": [],
  "faq": [{"question":"","answer":""}],
  "table": {"headers":[],"rows":[]},
  "relatedLinks": [{"label":"","href":""}],
  "images": [
    {"role":"hero","alt":"","prompt":""},
    {"role":"process","alt":"","prompt":""},
    {"role":"detail","alt":"","prompt":""}
  ]
}`;
}

export { extractJson } from './prompts.mjs';
