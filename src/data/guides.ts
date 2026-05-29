import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface GuideMeta {
  slug: string;
  title: string;
  desc: string;
  image: string;
  publishedAt: string;
}

export interface GeneratedGuide extends GuideMeta {
  summaryShort?: string;
  metaTitle?: string;
  metaDescription?: string;
  sidebarTitle?: string;
  sidebarBullets?: string[];
  sections?: {
    heading: string;
    paragraphs: string[];
    list?: string[];
  }[];
  howToSteps?: string[];
  faq?: { question: string; answer: string }[];
  table?: { headers: string[]; rows: string[][] };
  relatedLinks?: { label: string; href: string }[];
  images?: { role?: string; src: string; alt: string }[];
  datePublished?: string;
  dateModified?: string;
}

const legacyGuides: GuideMeta[] = [
  {
    slug: 'natural-food-coloring-for-frosting',
    title: 'Natural Food Coloring for Frosting (No Dyes)',
    desc: 'Beet, spirulina, matcha and turmeric for modern pastel palettes.',
    image: '/Pastel-color-palette-frosting-bowls.jpg',
    publishedAt: '2025-11-03',
  },
  {
    slug: 'egg-substitutes-for-cupcakes',
    title: 'Egg substitutes for cupcakes',
    desc: 'Reliable replacements and when to use them.',
    image: '/egg-substitutes-for-cupcakes.jpg',
    publishedAt: '2025-11-02',
  },
  {
    slug: 'fix-cupcake-mistakes',
    title: '10 cupcake mistakes and how to fix them',
    desc: 'Troubleshooting guide: domes, sinking centers, dryness, tunnels and more.',
    image: '/cupcake-mistakes-and-how-to-avoid-them.jpg',
    publishedAt: '2025-11-01',
  },
  {
    slug: 'why-do-cupcakes-sink-after-baking',
    title: 'Why Do Cupcakes Sink After Baking?',
    desc: 'Causes, fixes and prevention for sunken cupcake centers.',
    image: '/guide-why-cupcakes-sink.jpg',
    publishedAt: '2026-01-28',
  },
  {
    slug: 'how-to-make-cupcakes-moist-every-time',
    title: 'How to Make Cupcakes Moist Every Time',
    desc: 'Ingredients, techniques and habits for consistently tender, moist cupcakes.',
    image: '/guide-moist-cupcakes.jpg',
    publishedAt: '2026-01-28',
  },
  {
    slug: 'cupcake-vs-muffin-whats-the-real-difference',
    title: "Cupcake vs Muffin - What's the Real Difference?",
    desc: 'Mixing method, ingredients and texture: the real distinctions.',
    image: '/guide-cupcake-vs-muffin.jpg',
    publishedAt: '2026-01-28',
  },
];

const __dataDir = path.dirname(fileURLToPath(import.meta.url));

function generatedGuidesDir() {
  return path.join(process.cwd(), 'src', 'data', 'guides', 'generated');
}

function loadGeneratedGuideMeta(): GuideMeta[] {
  try {
    const dir = generatedGuidesDir();
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => {
        const g = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as GeneratedGuide;
        return {
          slug: g.slug,
          title: g.title,
          desc: g.desc || g.summaryShort || '',
          image: g.image,
          publishedAt: g.publishedAt || g.datePublished || '2026-01-01',
        };
      });
  } catch {
    return [];
  }
}

export function loadGeneratedGuideBySlug(slug: string): GeneratedGuide | null {
  try {
    const file = path.join(generatedGuidesDir(), `${slug}.json`);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8')) as GeneratedGuide;
  } catch {
    return null;
  }
}

export function loadAllGeneratedGuides(): GeneratedGuide[] {
  try {
    const dir = generatedGuidesDir();
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as GeneratedGuide);
  } catch {
    return [];
  }
}

export const guides: GuideMeta[] = [...legacyGuides, ...loadGeneratedGuideMeta()];

export const latestGuides = [...guides].sort((a, b) =>
  a.publishedAt < b.publishedAt ? 1 : -1
);
