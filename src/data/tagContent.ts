/** Category slugs — tag pages with the same slug are excluded from sitemap (use /categories/ instead). */
export const CATEGORY_SLUGS = new Set([
  'classic',
  'keto',
  'vegan',
  'nut-free',
  'gluten-free',
  'gourmet',
  'tropical',
  'spiced',
  'seasonal',
]);

export function isCategoryDuplicateTag(tag: string): boolean {
  return CATEGORY_SLUGS.has(tag.toLowerCase());
}

export function getSitemapTags(qualifiedTags: string[]): string[] {
  return qualifiedTags.filter((tag) => !isCategoryDuplicateTag(tag));
}

/** Unique intros for tag hub pages — angle differs from category pages. */
export const tagExtraContent: Record<string, { intro: string; faq?: { question: string; answer: string }[] }> = {
  chocolate: {
    intro:
      'Chocolate cupcake recipes on Incr-EdibleCupCakes span classic cocoa buttercream, keto almond-flour fudge, and spiced chili-chocolate with ganache. Use this tag to compare bake times, sweeteners, and frosting styles across every chocolate-forward cupcake in the collection.',
    faq: [
      {
        question: 'Which chocolate cupcake is best for beginners?',
        answer: 'Start with classic keto chocolate bliss or yellow cake with chocolate buttercream — both include step-by-step timing and troubleshooting notes.',
      },
    ],
  },
  'almond-flour': {
    intro:
      'Almond flour cupcakes bake differently from wheat flour: they brown faster, need gentle mixing, and dry out if overbaked by even two minutes. Recipes tagged almond flour include keto chocolate and lemon ricotta options with macro-friendly notes.',
    faq: [
      {
        question: 'Can I swap almond flour into any cupcake recipe?',
        answer: 'No — use recipes developed for almond flour. Binding, eggs, and leavening ratios differ from all-purpose flour batters.',
      },
    ],
  },
  erythritol: {
    intro:
      'Erythritol-sweetened cupcakes keep net carbs low without the blood-sugar spike of granulated sugar. Recipes here use erythritol or blends with monk fruit; each page lists approximate net carbs and tips for avoiding a cooling aftertaste.',
  },
  coconut: {
    intro:
      'Coconut appears in tropical mango sunset cupcakes, vegan rainbow batters, and keto frostings. These recipes use coconut milk, shredded coconut, or coconut flour in different roles — compare tags on each card to pick the texture you want.',
  },
  lemon: {
    intro:
      'Lemon-tagged cupcakes include nut-free lemon sunshine with curd filling and keto lemon ricotta. Citrus acidity affects rise when paired with baking soda — each recipe notes mixing order and storage for sharp lemon flavor.',
  },
  'cream-cheese': {
    intro:
      'Cream cheese frosting and cream cheese batter add tang and stability. Recipes tagged cream cheese range from red velvet romance to prune spice cupcakes — ideal when you need frosting that pipes cleanly in warm kitchens.',
  },
  ganache: {
    intro:
      'Ganache-topped cupcakes use dark chocolate and cream for a glossy finish that sets firm at room temperature. Compare chili-chocolate firecracker and gluten-free almond joy recipes for different heat levels and coconut pairings.',
  },
  vanilla: {
    intro:
      'Vanilla-forward cupcakes highlight Madagascar bean, buttercream, and classic American crumb styles. Use this tag to compare our signature vanilla dream recipe with yellow cake and holiday variations.',
  },
  buttercream: {
    intro:
      'Buttercream-frosted cupcakes in this collection use American, Swiss-influenced, or citrus-accented styles. Tag pages help you find recipes by frosting technique when planning a mixed platter.',
  },
  'madagascar-vanilla': {
    intro:
      'Madagascar vanilla bean specks mark our most aromatic classic cupcakes. These recipes call for real bean or high-quality paste — artificial extract-only swaps will change the flavor profile.',
  },
  cranberry: {
    intro:
      'Cranberry cupcakes pair tart fruit compote with orange zest — a seasonal combination that needs balanced sugar in the filling so the batter does not weep.',
  },
  'white-chocolate': {
    intro:
      'White chocolate cupcakes and snowflake holiday variations use cocoa-butter-based chips or melts. Avoid overheating white chocolate when melting for frosting; each recipe includes temperature notes.',
  },
  chili: {
    intro:
      'Chili-chocolate cupcakes use mild heat to amplify cocoa depth. Start with the measured amount in the firecracker recipe before increasing — capsaicin intensifies as the cupcake cools.',
  },
};

export function getTagIntro(tag: string, recipeCount: number): string {
  const extra = tagExtraContent[tag.toLowerCase()];
  if (extra) return extra.intro;
  if (isCategoryDuplicateTag(tag)) {
    return `Recipes tagged "${tag}" are also grouped under our ${tag} category page, which includes a full dietary overview and FAQ. Below are individual cupcakes that use the "${tag}" flavor or technique tag.`;
  }
  return `These ${recipeCount} cupcake recipe${recipeCount === 1 ? '' : 's'} share the "${tag}" tag — a flavor, ingredient, or technique link. Each includes ingredients, bake times, and tips; open a card for the full method.`;
}

export function getTagFaq(tag: string) {
  return tagExtraContent[tag.toLowerCase()]?.faq ?? [];
}
