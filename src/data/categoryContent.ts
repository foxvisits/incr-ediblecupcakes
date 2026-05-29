export interface CategoryExtra {
  intro: string;
  faq: { question: string; answer: string }[];
}

export const categoryExtraContent: Record<string, CategoryExtra> = {
  classic: {
    intro: `Classic cupcakes are built on familiar flavors: vanilla, chocolate, yellow cake, and red velvet. At Incr-EdibleCupCakes, classic recipes focus on reliable mixing methods, proper leavening, and frostings that set cleanly. A classic cupcake uses the creaming method or reverse-creaming for a tender crumb, fills liners two-thirds full, and bakes until a skewer comes out clean. Compare recipes below by bake time and difficulty to find your next weekend bake.`,
    faq: [
      { question: 'What makes a cupcake "classic"?', answer: 'Classic cupcakes use traditional flavors and standard wheat flour batters with butter or oil, baking powder, and familiar frostings like buttercream or cream cheese.' },
      { question: 'How do I pick a classic recipe for beginners?', answer: 'Start with Easy-rated vanilla or yellow cake cupcakes. They teach fundamental timing, mixing, and frosting skills.' },
    ],
  },
  keto: {
    intro: `Keto cupcakes keep net carbs low by swapping sugar for erythritol or monk fruit and using almond or coconut flour. Fat from cream cheese, butter, or coconut oil keeps the crumb moist. Success depends on accurate sweetener amounts and not overbaking, almond flour dries quickly. The three keto recipes below range from chocolate fudge to lemon ricotta; each lists prep time and difficulty so you can match your macro goals.`,
    faq: [
      { question: 'Are these keto cupcakes really low carb?', answer: 'Each recipe is developed for ketogenic baking with low-carb flours and sugar-free sweeteners. Check individual nutrition notes on the recipe page.' },
      { question: 'Which sweetener works best for keto cupcakes?', answer: 'Erythritol and monk fruit blends bake cleanly. Allulose adds moisture but may require slight recipe adjustments.' },
    ],
  },
  'nut-free': {
    intro: `Nut-free baking requires more than leaving out almonds or peanut butter. Read every label, extracts, mixes, and even some flours may carry trace nuts. Use dedicated utensils and a clean workspace to reduce cross-contact. Our nut-free lemon sunshine cupcakes use sunflower seed butter for richness without tree nuts. Before serving to someone with allergies, confirm all packaged ingredients are certified nut-free and disclose your kitchen practices.`,
    faq: [
      { question: 'Are these recipes safe for peanut allergies?', answer: 'Recipes avoid tree nuts and peanuts in ingredients, but always verify labels and your kitchen environment for cross-contact.' },
      { question: 'What can I substitute for almond flour in nut-free baking?', answer: 'Use oat flour, sunflower seed flour, or a certified nut-free 1:1 baking blend. Sunflower seed butter can replace nut butters in many batters.' },
      { question: 'How do I prevent cross-contamination?', answer: 'Use clean bowls, wash surfaces, and store nut-free cupcakes separately from other baked goods.' },
    ],
  },
  vegan: {
    intro: `Vegan cupcakes replace eggs and dairy with plant milks, aquafaba, flax eggs, or commercial egg replacers. Fat from oil or vegan butter keeps the crumb tender. These recipes are tested in a home kitchen for reliable rise and flavor without animal products.`,
    faq: [
      { question: 'Do vegan cupcakes taste different?', answer: 'Well-balanced vegan recipes taste like traditional cupcakes. Quality vanilla, cocoa, and frostings matter more than the absence of eggs.' },
    ],
  },
  'gluten-free': {
    intro: `Gluten-free cupcakes need structure from xanthan gum or a balanced 1:1 GF flour blend. Avoid overmixing and check doneness early, GF batters can go from moist to dry quickly. Our almond joy-inspired recipe uses certified GF ingredients.`,
    faq: [
      { question: 'Can I use any gluten-free flour?', answer: 'Use a 1:1 gluten-free baking blend with xanthan gum for best results. Single-ingredient flours usually need recipe adjustments.' },
    ],
  },
  gourmet: {
    intro: `Gourmet cupcakes layer refined flavors, rosewater, pistachio, cherry blossom, and polished presentation. They suit special occasions when you want elevated technique and plating.`,
    faq: [],
  },
  tropical: {
    intro: `Tropical cupcakes highlight mango, coconut, and citrus. Coconut milk and fruit purées add moisture; balance sweetness with lime or passionfruit notes. See our mango coconut sunset recipe for a bright, beach-style finish.`,
    faq: [
      { question: 'How do I keep tropical cupcakes moist?', answer: 'Use fruit purée or coconut milk in the batter and avoid overbaking. Store frosted cupcakes refrigerated in humid climates.' },
    ],
  },
  spiced: {
    intro: `Spiced cupcakes combine warm cinnamon, chili, pear, or seasonal aromatics. Chili-chocolate pairs heat with cocoa for a bold dessert. Measure spices precisely, too much heat or cinnamon can overpower the crumb.`,
    faq: [],
  },
  seasonal: {
    intro: `Seasonal cupcakes follow the calendar: cranberry orange for winter, snowflake white chocolate for holidays, and pastel frostings for spring. Rotate flavors with produce availability for the best taste.`,
    faq: [],
  },
};
