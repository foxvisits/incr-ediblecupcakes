export interface HomeFaqItem {
  question: string;
  /** Plain-text segments; use `links` for inline anchors rendered on the homepage. */
  answerParts: string[];
  links?: { href: string; label: string; afterIndex?: number }[];
}

export const homeFaq: HomeFaqItem[] = [
  {
    question: 'What makes Incr-EdibleCupCakes recipes different?',
    answerParts: [
      'Incr-EdibleCupCakes recipes are home-kitchen tested by Sarah, a recipe developer who publishes step-by-step instructions, troubleshooting tips, and dietary variations for classic, keto, vegan, nut-free, and gluten-free cupcakes.',
    ],
    links: [{ href: '/about', label: 'About Sarah', afterIndex: 0 }],
  },
  {
    question: 'Do you have keto or vegan cupcake recipes?',
    answerParts: [
      'Yes. Browse dedicated ',
      ' and ',
      ' categories — each recipe lists ingredients, bake times, and nutrition notes.',
    ],
    links: [
      { href: '/categories/keto', label: 'keto', afterIndex: 0 },
      { href: '/categories/vegan', label: 'vegan', afterIndex: 1 },
    ],
  },
  {
    question: 'Why do my cupcakes sink in the middle?',
    answerParts: [
      'Cupcakes usually sink because the center is underbaked, the batter is overmixed, leavening is expired, or liners are overfilled. ',
      ' lists causes and fixes in a table you can print.',
    ],
    links: [
      {
        href: '/guides/why-do-cupcakes-sink-after-baking',
        label: 'Our sunken cupcake guide',
        afterIndex: 0,
      },
    ],
  },
  {
    question: 'How long should cupcakes bake?',
    answerParts: [
      'Standard cupcakes at 175°C (350°F) typically bake 18–20 minutes; mini 10–12 minutes; jumbo 22–26 minutes. See the ',
      ' for temperature adjustments and doneness tests.',
    ],
    links: [{ href: '/baking-times/standard', label: 'standard baking time chart', afterIndex: 0 }],
  },
  {
    question: 'What can I substitute for eggs in cupcakes?',
    answerParts: [
      'Flax egg (1 tbsp ground flax + 3 tbsp water), applesauce (¼ cup per egg), and aquafaba (3 tbsp per egg) are reliable swaps. ',
      ' compares ratios and links to vegan recipes.',
    ],
    links: [{ href: '/substitutes/egg', label: 'Egg substitutes reference', afterIndex: 0 }],
  },
  {
    question: 'How do I keep cupcakes moist?',
    answerParts: [
      'Balance fat and liquid, avoid overmixing, bake until just set, and store cooled cupcakes airtight. ',
      ' covers ingredients, technique, and storage.',
    ],
    links: [
      {
        href: '/guides/how-to-make-cupcakes-moist-every-time',
        label: 'Moist cupcake guide',
        afterIndex: 0,
      },
    ],
  },
];
