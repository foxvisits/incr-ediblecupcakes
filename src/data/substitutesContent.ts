export interface SubstituteSwap {
  name: string;
  ratio: string;
  bestFor: string;
  note: string;
}

export interface SubstituteContent {
  title: string;
  metaDescription: string;
  intro: string;
  whyItMatters: string;
  swaps: SubstituteSwap[];
  faq: { question: string; answer: string }[];
  /** Match recipes by category and/or tag slugs */
  relatedCategories?: string[];
  relatedTags?: string[];
  deepDiveGuide?: string;
  deepDiveLabel?: string;
}

export const substitutesContent: Record<string, SubstituteContent> = {
  egg: {
    title: 'Egg substitutes for cupcakes',
    metaDescription:
      'Egg replacements for cupcakes: flax egg, aquafaba, applesauce, yogurt, and commercial replacers. Ratios, when to use each, and which recipes to try.',
    intro:
      'Eggs bind batter, add moisture, and help cupcakes rise. When you bake vegan cupcakes or run out of eggs mid-recipe, the substitute must match what the recipe needs most: structure, lift, or tenderness.',
    whyItMatters:
      'A flax egg excels at binding but will not whip like aquafaba. Applesauce adds moisture but can make the crumb dense if you add too much. Match the swap to the recipe goal and keep leavening fresh.',
    swaps: [
      {
        name: 'Flax egg',
        ratio: '1 tbsp ground flax + 3 tbsp water per egg (rest 5 min)',
        bestFor: 'Binding in chocolate or spice cupcakes',
        note: 'Adds a mild nutty note; works well in denser batters.',
      },
      {
        name: 'Aquafaba',
        ratio: '3 tbsp per egg',
        bestFor: 'Light crumb and lift in vanilla or white cake cupcakes',
        note: 'Liquid from canned chickpeas; whip briefly for extra air.',
      },
      {
        name: 'Unsweetened applesauce',
        ratio: '1/4 cup per egg',
        bestFor: 'Moist spice or fruit cupcakes',
        note: 'Reduce other liquids slightly; expect a softer crumb.',
      },
      {
        name: 'Plain yogurt or dairy-free yogurt',
        ratio: '1/4 cup per egg',
        bestFor: 'Tender vanilla or yellow cake cupcakes',
        note: 'Adds acidity that reacts with baking soda when present.',
      },
      {
        name: 'Commercial egg replacer',
        ratio: 'Per package (often 1 tsp powder + 2 tbsp water per egg)',
        bestFor: 'Consistent results when scaling batches',
        note: 'Neutral flavor; follow brand instructions exactly.',
      },
    ],
    faq: [
      {
        question: 'Will cupcakes rise without eggs?',
        answer:
          'Yes, if leavening is fresh and you do not overmix. Aquafaba and commercial replacers give the most reliable rise; applesauce needs adequate baking powder.',
      },
      {
        question: 'Which substitute is best for chocolate cupcakes?',
        answer:
          'Aquafaba or flax egg maintain structure without overpowering cocoa. Avoid over-moist swaps unless you reduce other liquids.',
      },
      {
        question: 'Can I swap substitutes one-for-one in any recipe?',
        answer:
          'No. Each substitute changes texture differently. Test one batch before serving to guests, especially for vegan or allergy-friendly bakes.',
      },
    ],
    relatedCategories: ['vegan'],
    relatedTags: ['vegan'],
    deepDiveGuide: '/guides/egg-substitutes-for-cupcakes',
    deepDiveLabel: 'Full egg substitutes guide with FAQ and print cheatsheet',
  },
  buttermilk: {
    title: 'Buttermilk substitutes for cupcakes',
    metaDescription:
      'Buttermilk substitutes for cupcake batter: milk with lemon or vinegar, thinned yogurt, kefir, and when each swap affects crumb and rise.',
    intro:
      'Buttermilk adds tang, tenderness, and reacts with baking soda to help cupcakes rise. Red velvet, chocolate, and many classic recipes rely on that acidity for a soft crumb.',
    whyItMatters:
      'A straight milk swap without acid can flatten flavor and reduce rise. The substitutes below restore acidity or mimic buttermilk thickness so baking soda and cocoa behave as intended.',
    swaps: [
      {
        name: 'Milk + lemon juice or vinegar',
        ratio: '1 cup milk + 1 tbsp lemon juice or white vinegar; rest 5 min',
        bestFor: 'Red velvet and classic buttermilk batters',
        note: 'Closest everyday pantry swap; curdles slightly as expected.',
      },
      {
        name: 'Plain yogurt thinned with milk',
        ratio: '3/4 cup yogurt + 1/4 cup milk to make 1 cup',
        bestFor: 'Moist chocolate or spice cupcakes',
        note: 'Richer crumb; reduce butter slightly in very rich recipes.',
      },
      {
        name: 'Kefir',
        ratio: '1:1 for buttermilk',
        bestFor: 'Tangy classic and red velvet cupcakes',
        note: 'Similar acidity; excellent rise with baking soda.',
      },
      {
        name: 'Sour cream thinned',
        ratio: '1/2 cup sour cream + 1/2 cup milk for 1 cup buttermilk',
        bestFor: 'Dense, moist holiday cupcakes',
        note: 'Adds fat; watch doneness early.',
      },
    ],
    faq: [
      {
        question: 'Why do recipes use buttermilk instead of regular milk?',
        answer:
          'Acidity tenderizes gluten and activates baking soda. That combination produces a lighter, softer cupcake crumb in many American-style recipes.',
      },
      {
        question: 'Can I use plant milk for a dairy-free buttermilk substitute?',
        answer:
          'Yes. Stir 1 tbsp lemon juice or apple cider vinegar into 1 cup unsweetened soy or oat milk and rest 5 minutes before using.',
      },
    ],
    relatedCategories: ['classic'],
    relatedTags: ['red-velvet', 'cocoa'],
  },
  sugar: {
    title: 'Sugar substitutes for cupcakes',
    metaDescription:
      'Sugar substitutes in cupcakes: erythritol, monk fruit, coconut sugar, honey, and maple. How each affects sweetness, browning, and texture.',
    intro:
      'Sugar does more than sweeten cupcake batter. It holds moisture, aids browning, and affects spread in the oven. Substituting requires matching the role sugar plays in that specific recipe.',
    whyItMatters:
      'Keto sweeteners can crystallize or cool on the tongue. Liquid sweeteners add moisture and may require less milk. Always adjust bake time when browning changes.',
    swaps: [
      {
        name: 'Erythritol or monk fruit blend',
        ratio: '1:1 by volume for granulated sugar in keto recipes',
        bestFor: 'Keto chocolate and lemon cupcakes',
        note: 'Check cooling effect; combine with allulose for softer crumb if needed.',
      },
      {
        name: 'Coconut sugar',
        ratio: '1:1 for granulated sugar',
        bestFor: 'Spiced and caramel-forward cupcakes',
        note: 'Darker color and molasses note; may need 5–10°F lower oven temp.',
      },
      {
        name: 'Honey or maple syrup',
        ratio: '3/4 cup syrup per 1 cup sugar; reduce other liquids by 2–3 tbsp',
        bestFor: 'Moist spice or seasonal cupcakes',
        note: 'Browns faster; reduce oven temp by 25°F (15°C) if tops darken too soon.',
      },
      {
        name: 'Granulated allulose',
        ratio: '1:1 for sugar in low-carb baking',
        bestFor: 'Soft keto vanilla cupcakes',
        note: 'Adds moisture; excellent for preventing dry almond-flour crumbs.',
      },
    ],
    faq: [
      {
        question: 'Can I use stevia drops in any cupcake recipe?',
        answer:
          'Stevia is best in recipes developed for it. Converting a full-sugar recipe drop-by-drop often yields bitter or dry cupcakes.',
      },
      {
        question: 'Why are my keto cupcakes dry after swapping sugar?',
        answer:
          'Sugar-free sweeteners do not hold moisture like sucrose. Add cream cheese, sour cream, or allulose, and avoid overbaking almond-flour batters.',
      },
    ],
    relatedCategories: ['keto'],
    relatedTags: ['erythritol', 'keto'],
  },
  flour: {
    title: 'Flour substitutes for cupcakes',
    metaDescription:
      'Flour substitutes for cupcakes: 1:1 gluten-free blends, almond flour, oat flour, and when to adjust binders and leavening.',
    intro:
      'All-purpose flour provides structure through gluten. Alternative flours change hydration, spread, and bake time. Cupcakes need enough structure to hold a dome without going dry.',
    whyItMatters:
      'Single-ingredient flours rarely swap 1:1 without recipe changes. Blends with xanthan gum simplify gluten-free cupcakes; nut flours need extra eggs or binders.',
    swaps: [
      {
        name: '1:1 gluten-free baking blend',
        ratio: '1:1 for all-purpose flour',
        bestFor: 'Direct swaps in classic cupcake recipes',
        note: 'Choose a blend with xanthan gum; mix just until combined.',
      },
      {
        name: 'Almond flour',
        ratio: 'Use in recipes developed for almond flour (not 1:1 AP swap)',
        bestFor: 'Keto and low-carb cupcakes',
        note: 'Needs extra binding; dries quickly if overbaked.',
      },
      {
        name: 'Oat flour',
        ratio: 'Substitute up to 25–50% of AP flour for tenderness',
        bestFor: 'Nut-free, soft crumb cupcakes',
        note: 'Use certified GF oats if needed; adds moisture.',
      },
      {
        name: 'Sunflower seed flour',
        ratio: 'Use in nut-free recipes calling for alternative flours',
        bestFor: 'Nut-free lemon and spice cupcakes',
        note: 'Can react with baking soda and turn green; a little lemon juice helps.',
      },
    ],
    faq: [
      {
        question: 'Can I replace all the flour with almond flour in a classic recipe?',
        answer:
          'Not reliably. Almond flour recipes need different egg, leavening, and liquid ratios. Use a dedicated keto recipe for best results.',
      },
      {
        question: 'Why are my gluten-free cupcakes gummy?',
        answer:
          'Overmixing or too much xanthan gum activates starch excessively. Mix until just combined and test doneness with a skewer, not time alone.',
      },
    ],
    relatedCategories: ['gluten-free', 'keto', 'nut-free'],
    relatedTags: ['almond-flour', 'gluten-free'],
  },
};

export function getRelatedRecipesForSubstitute(
  ingredient: string,
  recipes: { slug: string; title: string; category: string; tags?: string[] }[]
) {
  const content = substitutesContent[ingredient];
  if (!content) return recipes.slice(0, 6);

  const tagSet = new Set((content.relatedTags ?? []).map((t) => t.toLowerCase()));
  const categories = new Set(content.relatedCategories ?? []);

  const matched = recipes.filter((r) => {
    if (categories.has(r.category)) return true;
    return r.tags?.some((t) => tagSet.has(t.toLowerCase()));
  });

  return matched.length > 0 ? matched.slice(0, 8) : recipes.slice(0, 6);
}
