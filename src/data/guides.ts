export interface GuideMeta {
  slug: string;
  title: string;
  desc: string;
  image: string;
  publishedAt: string; // ISO date
}

export const guides: GuideMeta[] = [
  {
    slug: 'natural-food-coloring-for-frosting',
    title: 'Natural Food Coloring for Frosting (No Dyes)',
    desc: 'Beet, spirulina, matcha and turmeric for modern pastel palettes.',
    image: '/Pastel-color-palette-frosting-bowls.jpg',
    publishedAt: '2025-11-03'
  },
  {
    slug: 'egg-substitutes-for-cupcakes',
    title: 'Egg substitutes for cupcakes',
    desc: 'Reliable replacements and when to use them.',
    image: '/Egg substitutes for cupcakes.jpg',
    publishedAt: '2025-11-02'
  },
  {
    slug: 'fix-cupcake-mistakes',
    title: '10 cupcake mistakes and how to fix them',
    desc: 'Troubleshooting guide: domes, sinking centers, dryness, tunnels and more.',
    image: '/cupcake-mistakes-and-how-to-avoid-them.jpg',
    publishedAt: '2025-11-01'
  }
];

export const latestGuides = [...guides].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));


