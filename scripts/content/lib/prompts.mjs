import fs from 'fs';
import path from 'path';
import { CONTENT } from './paths.mjs';

function loadRequirements() {
  const reqPath = path.join(CONTENT, 'requirements.md');
  if (!fs.existsSync(reqPath)) return '';
  return fs.readFileSync(reqPath, 'utf8');
}

export function buildRecipePrompt(idea, config, existingTitles = []) {
  const seo = config.seo;
  const requirements = loadRequirements();
  return `You are Sarah, a home baker and recipe developer for Incr-EdibleCupCakes (incr-ediblecupcakes.com).

Write ONE original cupcake recipe as JSON only (no markdown fences).

IDEA:
- Title: ${idea.title}
- Category: ${idea.category}
- Notes: ${idea.notes || 'none'}

SITE QUALITY REQUIREMENTS (mandatory, follow every rule):
${requirements}

STYLE RULES:
- Write for a home baker, not a food magazine. Average sentence: 12–18 words.
- Lead each section with the answer in the first sentence (GEO/snippet friendly).
- Use short paragraphs (max 2 sentences). Use lists for steps and comparisons.
- NEVER use em dash (—) or en dash (–). Use commas, periods, or colons only.
- NEVER use: delve, leverage, utilize, framework, mid-palate, flavor story, robust, seamless, elevate, crucial, comprehensive.
- Say "main flavor" not "hero ingredient". Say "step-by-step plan" not "framework".
- shortDescription: 1 factual sentence with prep/bake time (for meta + snippets)
- description: 3-4 short paragraphs (max 2 sentences each), useful not poetic
- ingredients: precise US measurements
- instructions: clear numbered steps, ${seo.minInstructions}+ steps
- faq: ${seo.minFaqCount}+ unique Q&A for this recipe (not generic)
- tips: 2-4 pro tips
- Do NOT include rating or featured fields
- difficulty: Easy | Medium | Hard (also include in recipeKeys as "X difficulty")
- tags: 3-6 lowercase kebab-case tags
- recipeKeys: 5-8 SEO keywords comma-separated in array
- relatedSlugs: 2-3 existing recipe slugs to link internally (pick from site themes: classic-vanilla-dream-cupcakes, keto-chocolate-bliss-cupcakes, vegan-rainbow-surprise-cupcakes, etc.)

SEO FIELDS (required):
- metaTitle: under ${seo.titleMax} chars, format "{Title} Recipe | Incr-EdibleCupCakes"
- metaDescription: ${seo.metaDescriptionMin}-${seo.metaDescriptionMax} chars, CTA + keyword
- imageAlt: opisowy alt text for hero photo (no stuffing)
- images: exactly ${config.generation?.imagesPerRecipe ?? 3} objects, each with role (hero|process|detail), alt, prompt
  - hero → ONLY used in page hero (one photo)
  - process + detail → referenced in body copy context; NOT duplicated in hero
  - NEVER use em dashes (—) anywhere in text fields

Avoid duplicating these existing titles: ${existingTitles.slice(0, 30).join('; ')}

Return JSON matching this structure:
{
  "title": "",
  "slug": "",
  "shortDescription": "",
  "description": "",
  "category": "${idea.category}",
  "difficulty": "",
  "prepTime": "25 mins",
  "cookTime": "18 mins",
  "totalTime": "43 mins",
  "servings": 12,
  "ingredients": [],
  "instructions": [],
  "tips": [],
  "faq": [{"question":"","answer":""}],
  "tags": [],
  "recipeKeys": [],
  "keywords": [],
  "nutritionInfo": {"calories":0,"carbs":0,"protein":0,"fat":0,"fiber":0,"sugar":0},
  "dietaryBadges": [],
  "conclusion": "",
  "metaTitle": "",
  "metaDescription": "",
  "imageAlt": "",
  "images": [
    {"role":"hero","alt":"","prompt":""},
    {"role":"process","alt":"","prompt":""},
    {"role":"detail","alt":"","prompt":""}
  ],
  "relatedSlugs": []
}`;
}

export function extractJson(text) {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1].trim() : trimmed;
  return JSON.parse(raw);
}
