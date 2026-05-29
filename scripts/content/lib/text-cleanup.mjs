/** Post-process AI text: voice + readability. Never mutate slugs, paths, or IDs. */

const EM_EN_DASH = /[\u2014\u2013]/g;

const AI_PHRASE_REPLACEMENTS = [
  [/\bdelve into\b/gi, 'look at'],
  [/\bunlock\b/gi, 'get'],
  [/\bleverage\b/gi, 'use'],
  [/\brobust\b/gi, 'solid'],
  [/\bseamless(ly)?\b/gi, 'smooth'],
  [/\belevate\b/gi, 'improve'],
  [/\bcrucial\b/gi, 'important'],
  [/\bcomprehensive\b/gi, 'full'],
  [/\butilize\b/gi, 'use'],
  [/\bmid-palate\b/gi, 'middle of each bite'],
  [/\bflavor story\b/gi, 'flavor combo'],
  [/\bframework\b/gi, 'step-by-step plan'],
  [/\bhero ingredient\b/gi, 'main flavor'],
  [/\bhero flavor\b/gi, 'main flavor'],
  [/\byour hero\b/gi, 'your main flavor'],
  [/\bthe hero\b/gi, 'the main flavor'],
  [/\baccent ingredient\b/gi, 'supporting flavor'],
  [/\bthe accent\b/gi, 'the supporting flavor'],
  [/\bbridge ingredient\b/gi, 'background note'],
  [/\bthe bridge\b/gi, 'the background note'],
  [/\bflavor trio\b/gi, 'three-part flavor plan'],
  [/\bflavor profile\b/gi, 'flavor mix'],
  [/\breads as flat\b/gi, 'tastes flat'],
  [/\bcloying\b/gi, 'too sweet'],
  [/\bHero Ingredient\b/g, 'Main Flavor'],
  [/\bhero choices\b/gi, 'strong main flavors'],
  [/\bAvoid heroes\b/gi, 'Avoid main flavors'],
  [/\bas a hero\b/gi, 'as your main flavor'],
];

export function stripDashes(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/\s*[\u2014\u2013]\s*/g, ', ')
    .replace(/,\s*,+/g, ',')
    .replace(/,\s*\./g, '.')
    .replace(/\(\s*,/g, '(')
    .replace(/,\s*\)/g, ')')
    .trim();
}

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

/** Split long sentences at comma boundaries only when safe. */
export function shortenSentences(text, maxWords = 22) {
  if (!text || typeof text !== 'string') return text;
  if (/\//.test(text) || /\.(jpg|png|webp|astro)/i.test(text)) return text;

  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const out = [];

  for (let sentence of sentences) {
    let s = sentence.trim();
    if (!s) continue;

    while (wordCount(s) > maxWords) {
      const mid = Math.floor(s.length * 0.5);
      let comma = s.lastIndexOf(', ', mid + 40);
      if (comma < 15) comma = s.indexOf(', ', mid - 20);
      if (comma < 0) break;

      const left = s.slice(0, comma).trim();
      const right = s.slice(comma + 2).trim();
      if (!right || wordCount(left) < 8) break;

      out.push(left.endsWith('.') || left.endsWith('!') || left.endsWith('?') ? left : `${left}.`);
      s = right.charAt(0).toUpperCase() + right.slice(1);
    }
    out.push(s);
  }

  return out.join(' ').replace(/\s{2,}/g, ' ').trim();
}

export function sanitizeText(text, { shorten = true } = {}) {
  if (typeof text !== 'string' || !text) return text;
  let out = stripDashes(text);
  for (const [re, replacement] of AI_PHRASE_REPLACEMENTS) {
    out = out.replace(re, replacement);
  }
  return shorten ? shortenSentences(out) : out;
}

export function sanitizeHeading(text) {
  if (typeof text !== 'string') return text;
  let out = stripDashes(text);
  out = out.replace(/\s*[\u2014\u2013]\s*/g, ': ');
  out = out.replace(/^Step (\d+),\s*/i, 'Step $1: ');
  return out;
}

function splitParagraphToChunks(text, maxSentences = 2) {
  const cleaned = sanitizeText(text);
  const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
  const chunks = [];
  for (let i = 0; i < sentences.length; i += maxSentences) {
    chunks.push(sentences.slice(i, i + maxSentences).join(' ').trim());
  }
  return chunks.filter(Boolean);
}

export function improveGuideContent(guide) {
  const g = { ...guide };
  if (g.summaryShort) g.summaryShort = sanitizeText(g.summaryShort);
  if (g.desc) g.desc = g.summaryShort || sanitizeText(g.desc);
  if (g.metaDescription) g.metaDescription = sanitizeText(g.metaDescription, { shorten: false }).slice(0, 158);
  if (g.metaTitle) g.metaTitle = stripDashes(g.metaTitle);
  if (g.title) g.title = stripDashes(g.title);

  if (g.sections) {
    g.sections = g.sections.map((sec) => ({
      ...sec,
      heading: sanitizeHeading(sec.heading),
      paragraphs: (sec.paragraphs || []).map((p) => sanitizeText(p)),
      list: (sec.list || []).map((item) => sanitizeText(item)),
    }));
  }
  if (g.howToSteps) g.howToSteps = g.howToSteps.map((s) => sanitizeText(s));
  if (g.sidebarTitle) g.sidebarTitle = stripTrailingPeriod(sanitizeText(g.sidebarTitle, { shorten: false }));
  if (g.sidebarBullets) g.sidebarBullets = g.sidebarBullets.map((s) => sanitizeText(s));
  if (g.faq) {
    g.faq = g.faq.map((f) => ({
      question: sanitizeHeading(f.question),
      answer: sanitizeText(f.answer),
    }));
  }
  if (g.table?.rows) {
    g.table.rows = g.table.rows.map((row) => row.map((cell) => sanitizeText(cell, { shorten: false })));
  }
  if (g.images) {
    g.images = g.images.map((img) => ({
      ...img,
      alt: stripDashes(img.alt || ''),
      prompt: stripDashes(img.prompt || ''),
    }));
  }
  return g;
}

export function improveRecipeContent(recipe) {
  const r = { ...recipe };
  if (r.shortDescription) r.shortDescription = sanitizeText(r.shortDescription, { shorten: false });
  if (r.description) r.description = sanitizeText(repairBrokenProse(r.description));
  if (r.metaDescription) r.metaDescription = sanitizeText(r.metaDescription, { shorten: false }).slice(0, 158);
  if (r.metaTitle) r.metaTitle = stripDashes(r.metaTitle);
  if (r.title) r.title = stripDashes(r.title);
  if (r.conclusion) r.conclusion = sanitizeText(r.conclusion);
  if (r.instructions) r.instructions = r.instructions.map((s) => sanitizeText(s));
  if (r.tips) r.tips = r.tips.map((s) => sanitizeText(s));
  if (r.faq) {
    r.faq = r.faq.map((f) => ({
      question: sanitizeHeading(f.question),
      answer: sanitizeText(f.answer),
    }));
  }
  if (r.imageAlt) r.imageAlt = stripDashes(r.imageAlt);
  if (r.images) {
    r.images = r.images.map((img) => ({
      ...img,
      alt: stripDashes(img.alt || ''),
      prompt: stripDashes(img.prompt || ''),
    }));
  }
  return r;
}

export function sanitizeDeep(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if (value.slug && value.sections) return improveGuideContent(value);
    if (value.slug && value.ingredients) return improveRecipeContent(value);
  }
  return value;
}

export function hasBannedContent(text) {
  if (typeof text !== 'string') return false;
  return EM_EN_DASH.test(text);
}

export function collectTextFields(obj, acc = []) {
  if (typeof obj === 'string') acc.push(obj);
  else if (Array.isArray(obj)) obj.forEach((v) => collectTextFields(v, acc));
  else if (obj && typeof obj === 'object') {
    for (const v of Object.values(obj)) collectTextFields(v, acc);
  }
  return acc;
}

export function validateHumanVoice(obj) {
  const errors = [];
  for (const t of collectTextFields(obj)) {
    if (hasBannedContent(t)) errors.push('Contains em dash or en dash (forbidden)');
    if (/\b(delve|leverage|utilize|mid-palate|flavor story)\b/i.test(t)) {
      errors.push('Contains banned AI vocabulary');
    }
  }
  return errors;
}

const STRUCTURAL_KEYS = new Set([
  'slug', 'id', 'src', 'image', 'href', 'role', 'category', 'categoryId',
  'difficulty', 'date', 'publishedDate', 'scheduledAt', 'yield', 'servings',
  'prepTime', 'cookTime', 'totalTime', 'amount', 'unit', 'name', 'cuisine',
  'datePublished', 'dateModified', 'url',
]);

const STRUCTURAL_ARRAY_KEYS = new Set(['tags', 'keywords', 'recipeKeys', 'ingredients', 'dietaryBadges']);

function fixPath(v) {
  return String(v)
    .replace(/\.\s+(jpg|png|webp)/gi, '.$1')
    .replace(/\.(jpg|png|webp)\.+$/i, '.$1')
    .replace(/\s+\./g, '.')
    .replace(/\.+$/, (m) => (m.length > 1 ? '' : m));
}

function stripTrailingPeriod(v) {
  if (typeof v !== 'string') return v;
  return v
    .replace(/\.+\s*com\b/gi, '.com')
    .replace(/\s+\./g, '.')
    .replace(/\.+$/, '')
    .trim();
}

const FRAGMENT_ENDINGS = new Set([
  'vs', 'and', 'or', 'the', 'a', 'an', 'this', 'that', 'both', 'with', 'in', 'on', 'to',
  'for', 'but', 'nutty', 'quiet', 'almost', 'batter', 'crumb', 'move', 'different',
  'through', 'hands', 'same', 'buttercream', 'caramel', 'frosting', 'top', 'fast',
  'want', 'crumb', 'flour', 'sugar', 'butter', 'cream', 'milk', 'eggs', 'above',
  'below', 'here', 'there', 'then', 'also', 'just', 'still', 'only', 'really',
]);

function isProseFragment(text) {
  const trimmed = text.trim();
  const words = trimmed.replace(/\.+$/, '').split(/\s+/);
  const last = words[words.length - 1].toLowerCase().replace(/[.,;:!?]+$/, '');
  if (FRAGMENT_ENDINGS.has(last)) return true;
  if (/\bvs\.?$/i.test(trimmed)) return true;
  if (words.length <= 4) return true;
  if (/^[a-z'"]/.test(trimmed)) return true;
  return false;
}

function mergeParagraphArray(paragraphs) {
  const out = [];
  for (const raw of paragraphs) {
    const p = raw.replace(/\s{2,}/g, ' ').trim();
    if (!p) continue;
    const prev = out[out.length - 1];
    if (prev && (isProseFragment(prev) || isProseFragment(p) || /^[a-z'"]/.test(p))) {
      out[out.length - 1] = `${prev.replace(/\.+$/, '')} ${p}`.replace(/\s{2,}/g, ' ');
    } else {
      out.push(p);
    }
  }
  return out;
}

export function repairBrokenProse(text) {
  if (typeof text !== 'string' || !text.includes('\n\n')) return text?.replace(/\s{2,}/g, ' ') ?? text;
  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  const merged = [];
  let buf = '';
  for (const block of blocks) {
    if (!buf) {
      buf = block;
      continue;
    }
    if (isProseFragment(buf)) {
      buf = `${buf.replace(/\.+$/, '')} ${block}`;
    } else {
      merged.push(buf.replace(/\s{2,}/g, ' '));
      buf = block;
    }
  }
  if (buf) merged.push(buf.replace(/\s{2,}/g, ' '));
  return merged.join('\n\n');
}

/** Undo accidental sanitize damage (trailing periods on slugs/paths). */
export function repairStructuralFields(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(repairStructuralFields);

  const out = { ...obj };
  for (const [k, v] of Object.entries(out)) {
    if (STRUCTURAL_ARRAY_KEYS.has(k) && Array.isArray(v)) {
      out[k] = v.map((item) => (typeof item === 'string' ? stripTrailingPeriod(item) : repairStructuralFields(item)));
    } else if (typeof v === 'string') {
      if (k === 'src' || k === 'image' || v.startsWith('/') || /\.(jpg|png|webp)/i.test(v)) {
        out[k] = fixPath(v);
      } else if (STRUCTURAL_KEYS.has(k)) {
        out[k] = stripTrailingPeriod(v);
      } else if (k === 'description' || k === 'conclusion') {
        out[k] = repairBrokenProse(v.replace(/\s{2,}/g, ' '));
      } else if (k === 'title' || k === 'metaTitle' || k === 'sidebarTitle') {
        out[k] = stripTrailingPeriod(v);
      } else if (k === 'name' && v.length < 40) {
        out[k] = stripTrailingPeriod(v);
      }
    } else if (typeof v === 'object') {
      out[k] = repairStructuralFields(v);
    }
  }
  return out;
}
