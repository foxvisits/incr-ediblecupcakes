export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  category: 'classic' | 'keto' | 'vegan' | 'nut-free' | 'gluten-free';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  rating: number;
  featured?: boolean;
  ingredients: string[];
  instructions: string[];
  nutritionInfo?: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  tips?: string[];
  variations?: string[];
  pairings?: string;
  bestTime?: string;
  recipeKeys?: string[];
  dietaryBadges?: string[];
  cuisine?: string;
  conclusion?: string;
  faq?: {
    question: string;
    answer: string;
  }[];
  // Schema.org fields
  author?: {
    name: string;
    url?: string;
  };
  keywords?: string[];
  video?: string;
}

// Utility function to generate SEO-friendly slugs from recipe titles
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim() // Remove leading/trailing whitespace
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Utility function to convert time format to ISO 8601 duration
export const convertToISODuration = (timeString: string): string => {
  const match = timeString.match(/(\d+)\s*(mins?|minutes?|hrs?|hours?)/i);
  if (!match) return 'PT30M'; // Default to 30 minutes if parsing fails
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  if (unit.includes('hr') || unit.includes('hour')) {
    return `PT${value}H`;
  } else {
    return `PT${value}M`;
  }
};

// Validation function to ensure all recipes have proper slugs
export const validateRecipeSlug = (recipe: Recipe): Recipe => {
  if (!recipe.slug || recipe.slug.trim() === '') {
    console.warn(`Recipe "${recipe.title}" missing slug, generating one automatically`);
    return {
      ...recipe,
      slug: generateSlug(recipe.title)
    };
  }
  return recipe;
};

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Vanilla Dream Cupcakes',
    slug: 'classic-vanilla-dream-cupcakes',
    description: 'Step into a world of pure vanilla bliss with these extraordinary cupcakes that redefine what classic baking can be. These aren\'t your ordinary vanilla cupcakes – they\'re a symphony of flavors and textures that will make your taste buds sing with joy. The secret begins with real Madagascar vanilla beans, their tiny black specks visible throughout the golden crumb, promising an authentic vanilla experience that artificial extracts simply cannot match. Each cupcake boasts an incredibly moist and tender texture, achieved through a carefully balanced combination of European-style butter and neutral oil that creates the perfect crumb structure. The batter is mixed with precision – just enough to combine the ingredients without developing the gluten, resulting in cupcakes so light and airy they practically melt on your tongue. What truly sets these apart is the Swiss meringue buttercream frosting, whipped to silky perfection with a glossy finish that catches the light beautifully. This isn\'t just frosting; it\'s edible silk that complements the vanilla cake with its subtle sweetness and luxurious mouthfeel. Whether you\'re celebrating a special occasion or simply indulging in life\'s sweet moments, these vanilla dream cupcakes deliver an experience that transforms ordinary days into extraordinary memories.',
    shortDescription: 'Experience pure vanilla bliss with these extraordinary cupcakes featuring real Madagascar vanilla beans and Swiss meringue buttercream frosting.',
    image: '/Classic Vanilla Dream Cupcakes.jpg',
    category: 'classic',
    difficulty: 'Easy',
    prepTime: '25 mins',
    cookTime: '18 mins',
    totalTime: '43 mins',
    servings: 12,
    rating: 4.9,
    featured: true,
    cuisine: 'American',
    dietaryBadges: ['Vegetarian'],
    author: {
      name: 'Incr-EdibleCupCakes',
      url: 'https://incr-ediblecupcakes.com'
    },
    keywords: ['vanilla cupcakes', 'classic cupcakes', 'homemade cupcakes', 'baking recipes', 'dessert recipes'],
    ingredients: [
      '2 cups all-purpose flour',
      '1½ cups granulated sugar',
      '½ cup unsalted butter, softened',
      '2 large eggs',
      '2 tsp vanilla extract',
      '2 tsp baking powder',
      '½ tsp salt',
      '1 cup whole milk',
      'For frosting: 1 cup butter, 4 cups powdered sugar, 2 tsp vanilla'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C) and line muffin tin with cupcake liners.',
      'Cream butter and sugar until light and fluffy, about 3 minutes.',
      'Add eggs one at a time, then vanilla extract.',
      'In separate bowl, whisk flour, baking powder, and salt.',
      'Alternate adding dry ingredients and milk to wet ingredients.',
      'Fill cupcake liners ¾ full and bake for 18-20 minutes.',
      'Cool completely before frosting with vanilla buttercream.'
    ],
    nutritionInfo: {
      calories: 320,
      carbs: 45,
      protein: 4,
      fat: 14,
      fiber: 1,
      sugar: 38
    },
    tips: [
      'Room temperature ingredients mix better',
      'Don\'t overmix the batter to keep cupcakes tender',
      'Use an ice cream scoop for even portions'
    ],
    variations: [
      'Add lemon zest for a citrus twist',
      'Swirl in strawberry jam for berry vanilla cupcakes',
      'Top with fresh berries and whipped cream',
      'Create funfetti version with colorful sprinkles'
    ],
    pairings: 'These vanilla cupcakes pair beautifully with fresh coffee, Earl Grey tea, or a glass of cold milk. For special occasions, serve alongside fresh berries or a scoop of vanilla ice cream.',
    bestTime: 'Perfect for birthday parties, afternoon tea, office celebrations, or any time you want to bring joy to someone\'s day. Best enjoyed within 2-3 days of baking.',
    recipeKeys: ['Beginner Friendly', 'Party Perfect', 'Make Ahead', 'Kid Approved', 'Classic Comfort'],
    conclusion: 'These vanilla dream cupcakes prove that sometimes the classics are classic for a reason. Simple ingredients transformed into something truly magical.',
    faq: [
      {
        question: "Why are my vanilla cupcakes dense instead of fluffy?",
        answer: "Dense cupcakes are usually caused by overmixing the batter or using cold ingredients. Make sure all ingredients are at room temperature and mix just until combined. Overmixing develops the gluten, making cupcakes tough."
      },
      {
        question: "Can I use vanilla extract instead of vanilla beans?",
        answer: "Yes! Use 2 teaspoons of high-quality vanilla extract instead of vanilla beans. While you won't get the beautiful vanilla specks, the flavor will still be excellent. Pure vanilla extract is always better than imitation."
      },
      {
        question: "How do I get perfectly domed cupcakes?",
        answer: "Fill cupcake liners only ¾ full, ensure your oven is properly preheated, and avoid opening the oven door during the first 15 minutes of baking. The right batter consistency and fresh baking powder also help achieve that perfect dome."
      },
      {
        question: "Can I make the buttercream frosting ahead of time?",
        answer: "Absolutely! Swiss meringue buttercream can be made up to 3 days ahead and stored in the refrigerator. Let it come to room temperature and re-whip before using to restore its silky texture."
      },
      {
        question: "What's the secret to extra moist vanilla cupcakes?",
        answer: "The combination of butter and oil in this recipe creates optimal moisture. The butter provides flavor while the oil keeps them tender. Also, don't overbake – they're done when a toothpick comes out with just a few moist crumbs."
      },
      {
        question: "How should I store these cupcakes?",
        answer: "Store unfrosted cupcakes covered at room temperature for up to 3 days. Frosted cupcakes should be refrigerated and consumed within 4 days. Bring to room temperature 30 minutes before serving for best taste."
      }
    ]
  },
  {
    id: '2',
    title: 'Keto Chocolate Bliss Cupcakes',
    slug: 'keto-chocolate-bliss-cupcakes',
    description: 'Indulge in the ultimate guilt-free chocolate experience with these revolutionary keto cupcakes that prove low-carb doesn\'t mean low-flavor. These decadent treats are a masterclass in ketogenic baking, where every ingredient has been carefully selected to deliver maximum taste while keeping carbs to an absolute minimum. The foundation is built on superfine almond flour, which creates an incredibly moist and tender crumb that rivals any traditional wheat-based cupcake. The chocolate flavor is intensely rich and complex, achieved through a combination of premium Dutch-processed cocoa powder and sugar-free dark chocolate, creating layers of chocolate notes that develop beautifully on your palate. Erythritol provides the perfect sweetness without any bitter aftertaste, while coconut oil adds richness and helps create that coveted fudgy texture. The real showstopper is the cream cheese frosting – a cloud of tangy sweetness that perfectly balances the deep chocolate flavors below. Whipped to perfection with powdered erythritol and a touch of vanilla, it\'s so smooth and luxurious that even your non-keto friends will be amazed. At just 3 net carbs per cupcake, these treats allow you to satisfy your chocolate cravings while maintaining your ketogenic lifestyle, proving that healthy choices never have to mean sacrificing the foods you love.',
    shortDescription: 'Indulge guilt-free with these revolutionary keto chocolate cupcakes featuring rich almond flour base and luxurious cream cheese frosting at just 3 net carbs.',
    image: '/keto-chocolate-bliss-cupcakes.png',
    category: 'keto',
    difficulty: 'Medium',
    prepTime: '30 mins',
    cookTime: '20 mins',
    totalTime: '50 mins',
    servings: 10,
    rating: 4.8,
    featured: true,
    cuisine: 'American',
    dietaryBadges: ['Keto', 'Low Carb', 'Gluten-Free'],
    author: {
      name: 'Incr-EdibleCupCakes',
      url: 'https://incr-ediblecupcakes.com'
    },
    keywords: ['keto cupcakes', 'low carb cupcakes', 'chocolate cupcakes', 'keto baking', 'sugar free cupcakes'],
    ingredients: [
      '1½ cups almond flour',
      '¾ cup erythritol sweetener',
      '⅓ cup unsweetened cocoa powder',
      '1½ tsp baking powder',
      '½ tsp salt',
      '3 large eggs',
      '⅓ cup melted coconut oil',
      '½ cup unsweetened almond milk',
      '1 tsp vanilla extract',
      'For frosting: cream cheese, butter, powdered erythritol'
    ],
    instructions: [
      'Preheat oven to 325°F (165°C) and line muffin tin.',
      'Whisk together almond flour, erythritol, cocoa powder, baking powder, and salt.',
      'In another bowl, beat eggs, then add melted coconut oil, almond milk, and vanilla.',
      'Combine wet and dry ingredients until just mixed.',
      'Fill liners ¾ full and bake for 18-22 minutes.',
      'Cool completely before adding cream cheese frosting.'
    ],
    nutritionInfo: {
      calories: 185,
      carbs: 3,
      protein: 6,
      fat: 17,
      fiber: 2,
      sugar: 1
    },
    tips: [
      'Let coconut oil cool slightly before adding to eggs',
      'Don\'t overbake - they continue cooking while cooling',
      'Store in refrigerator due to cream cheese frosting'
    ],
    variations: [
      'Add sugar-free chocolate chips for extra richness',
      'Swirl in peanut butter for a keto PB chocolate combo',
      'Top with crushed sugar-free cookies',
      'Add espresso powder for mocha flavor'
    ],
    pairings: 'Enjoy with bulletproof coffee, unsweetened almond milk, or herbal tea. Perfect alongside keto-friendly nuts or a small serving of berries.',
    bestTime: 'Ideal for keto dieters craving dessert, post-workout treats, or when you need a low-carb celebration cake. Best consumed within 5 days when refrigerated.',
    recipeKeys: ['Keto Friendly', 'Low Carb', 'Sugar Free', 'Gluten Free', 'High Fat'],
    conclusion: 'These keto chocolate cupcakes prove that following a ketogenic lifestyle doesn\'t mean giving up on decadent desserts. Pure chocolate bliss in every bite!',
    faq: [
      {
        question: "Will these cupcakes kick me out of ketosis?",
        answer: "No! With only 3 net carbs per cupcake, these fit perfectly into a ketogenic diet. However, portion control is still important – stick to one cupcake to maintain your macros."
      },
      {
        question: "Can I substitute the erythritol with other keto sweeteners?",
        answer: "Yes! You can use monk fruit sweetener, stevia, or xylitol. Use the same amount for erythritol and monk fruit, but reduce stevia to 1/3 the amount. Xylitol works 1:1 but keep away from pets as it's toxic to them."
      },
      {
        question: "Why do my keto cupcakes have a gritty texture?",
        answer: "This usually happens when erythritol isn't dissolved properly. Try using powdered erythritol instead of granulated, or blend granulated erythritol in a food processor until fine before using."
      },
      {
        question: "Can I make these dairy-free for keto?",
        answer: "Absolutely! Replace the cream cheese frosting with whipped coconut cream sweetened with powdered erythritol. The cupcakes already use coconut oil, making them naturally dairy-free."
      },
      {
        question: "How do I know when keto cupcakes are done baking?",
        answer: "Keto cupcakes can be tricky because almond flour behaves differently. They're done when the tops spring back lightly when touched and a toothpick comes out with just a few moist crumbs. Don't overbake!"
      },
      {
        question: "Do these taste different from regular chocolate cupcakes?",
        answer: "They're incredibly close! The almond flour adds a subtle nutty richness that many people actually prefer. The erythritol provides clean sweetness without the sugar crash."
      }
    ]
  },
  {
    id: '3',
    title: 'Vegan Rainbow Surprise Cupcakes',
    slug: 'vegan-rainbow-surprise-cupcakes',
    description: 'Prepare to be amazed by these spectacular vegan rainbow cupcakes that transform plant-based baking into pure artistry. Each cupcake is a hidden treasure, appearing perfectly normal from the outside but revealing a stunning rainbow of naturally colored layers when you take that first magical bite. This isn\'t just baking – it\'s edible art that celebrates both creativity and compassion. The rainbow effect is achieved through innovative natural coloring techniques that would make any food scientist proud. Vibrant pink comes from pureed fresh beetroot, sunny yellow from golden turmeric, ocean blue from butterfly pea flower tea, and emerald green from nutrient-rich spirulina powder. Each color layer maintains its distinct hue while contributing its own subtle flavor notes to the overall taste experience. The cupcake base is a marvel of vegan baking science, where plant-based milk creates incredible moisture, apple cider vinegar acts as a natural leavening agent, and carefully selected oils provide richness without any animal products. The result is a texture so light, fluffy, and tender that even the most devoted dairy lovers will be converted. Crowned with our signature coconut whipped cream frosting that\'s been whipped to cloud-like perfection, these cupcakes prove that vegan desserts can be every bit as indulgent and satisfying as their traditional counterparts, all while being kinder to our planet and its creatures.',
    shortDescription: 'Be amazed by these spectacular vegan rainbow cupcakes featuring naturally colored layers and cloud-like coconut whipped cream frosting.',
    image: '/vegan-rainbow-surprise-cupcakes.jpg',
    category: 'vegan',
    difficulty: 'Medium',
    prepTime: '40 mins',
    cookTime: '20 mins',
    totalTime: '60 mins',
    servings: 12,
    rating: 4.7,
    featured: true,
    cuisine: 'Modern',
    dietaryBadges: ['Vegan', 'Dairy-Free', 'Egg-Free'],
    author: {
      name: 'Incr-EdibleCupCakes',
      url: 'https://incr-ediblecupcakes.com'
    },
    keywords: ['vegan cupcakes', 'rainbow cupcakes', 'plant based cupcakes', 'dairy free cupcakes', 'colorful cupcakes'],
    ingredients: [
      '2 cups all-purpose flour',
      '1½ cups sugar',
      '1 tsp baking soda',
      '½ tsp salt',
      '1 cup plant-based milk',
      '⅓ cup vegetable oil',
      '2 tbsp apple cider vinegar',
      '1 tsp vanilla extract',
      'Natural food coloring',
      'For frosting: coconut cream, powdered sugar, vanilla'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C) and prepare cupcake liners.',
      'Mix flour, sugar, baking soda, and salt in large bowl.',
      'Combine plant milk, oil, vinegar, and vanilla in separate bowl.',
      'Add wet ingredients to dry and mix until smooth.',
      'Divide batter and add different natural colorings.',
      'Layer colors in cupcake liners for rainbow effect.',
      'Bake for 18-20 minutes and cool before frosting.'
    ],
    nutritionInfo: {
      calories: 280,
      carbs: 42,
      protein: 3,
      fat: 11,
      fiber: 2,
      sugar: 35
    }
    ,
    variations: [
      'Use different natural colorings like matcha or purple sweet potato',
      'Create ombre effect with varying shades of one color',
      'Add vanilla extract to each colored layer for enhanced flavor',
      'Top with edible flowers for extra visual appeal'
    ],
    pairings: 'Perfect with plant-based milk alternatives, herbal teas, or fresh fruit. Great for vegan celebrations and kid-friendly parties.',
    bestTime: 'Ideal for birthday parties, vegan celebrations, or when you want to impress with colorful, compassionate baking. Best enjoyed within 3 days.',
    recipeKeys: ['Vegan', 'Colorful', 'Natural Ingredients', 'Party Perfect', 'Instagram Worthy'],
    conclusion: 'These rainbow cupcakes prove that vegan baking can be both beautiful and delicious, creating joy while being kind to animals and the planet.',
    faq: [
      {
        question: "How do I achieve vibrant colors naturally without artificial dyes?",
        answer: "Use concentrated natural colorings: beetroot powder for pink/red, turmeric for yellow, spirulina for green, and butterfly pea flower for blue. Start with small amounts and gradually add more until you reach desired intensity."
      },
      {
        question: "Will the natural colorings affect the taste?",
        answer: "When used in proper amounts, the taste impact is minimal. Beetroot adds subtle earthiness, turmeric brings mild warmth, spirulina is nearly tasteless, and butterfly pea flower is neutral. The vanilla flavor still dominates."
      },
      {
        question: "Can I make these without the rainbow layers?",
        answer: "Absolutely! Simply skip the coloring step and bake as regular vanilla vegan cupcakes. They'll be just as delicious and much quicker to prepare."
      },
      {
        question: "What's the best vegan butter substitute for frosting?",
        answer: "Use high-quality vegan butter sticks (not margarine) for best results. Brands like Earth Balance or Miyoko's work wonderfully. Make sure it's at room temperature for proper whipping."
      },
      {
        question: "Why did my vegan cupcakes turn out flat?",
        answer: "This often happens when the apple cider vinegar and baking soda reaction is compromised. Make sure your baking soda is fresh, don't overmix after adding wet to dry ingredients, and bake immediately after mixing."
      },
      {
        question: "Can I use different plant milks?",
        answer: "Yes! Oat milk, soy milk, or cashew milk all work well. Avoid light coconut milk as it may not provide enough richness. Full-fat coconut milk creates the most decadent results."
      }
    ]
  },
  {
    id: '4',
    title: 'Nut-Free Lemon Sunshine Cupcakes',
    slug: 'nut-free-lemon-sunshine-cupcakes',
    description: 'Experience pure sunshine captured in cupcake form with these absolutely radiant nut-free lemon creations that will instantly brighten your day and lift your spirits. These aren\'t just cupcakes – they\'re edible rays of sunshine that deliver an explosion of fresh, zesty lemon flavor in every single bite. Crafted with meticulous attention to allergen safety, every ingredient has been carefully selected to ensure complete nut-free preparation while never compromising on the incredible taste and texture that makes these cupcakes truly special. The lemon flavor is achieved through a masterful combination of fresh lemon zest, pure lemon juice, and high-quality lemon extract, creating layers of citrus notes that dance on your palate from the first bite to the last. The cupcake itself boasts an incredibly tender, moist crumb that practically melts on your tongue, achieved through the perfect balance of butter, eggs, and buttermilk that creates a delicate texture reminiscent of the finest European sponge cakes. But the real surprise awaits inside – a hidden center of homemade lemon curd that bursts with tangy sweetness, creating a delightful contrast to the tender cake surrounding it. The crowning glory is our signature lemon buttercream frosting, piped into beautiful swirls that resemble miniature sunshine rays, each one infused with fresh lemon juice and zest for an authentic citrus experience that perfectly complements the cake below. These cupcakes are guaranteed to bring smiles to faces of all ages while providing a safe, delicious treat for those with nut allergies.',
    shortDescription: 'Brighten your day with these radiant nut-free lemon cupcakes featuring fresh citrus flavors, lemon curd centers, and sunshine buttercream frosting.',
    image: '/nut-free-lemon-sunshine-cupcakes.jpg',
    category: 'nut-free',
    difficulty: 'Easy',
    prepTime: '35 mins',
    cookTime: '18 mins',
    totalTime: '53 mins',
    servings: 12,
    rating: 4.6,
    cuisine: 'American',
    dietaryBadges: ['Nut-Free', 'Vegetarian'],
    author: {
      name: 'Incr-EdibleCupCakes',
      url: 'https://incr-ediblecupcakes.com'
    },
    keywords: ['nut free cupcakes', 'lemon cupcakes', 'citrus cupcakes', 'allergy friendly cupcakes', 'lemon dessert'],
    ingredients: [
      '2 cups all-purpose flour',
      '1½ cups sugar',
      '½ cup butter, softened',
      '2 eggs',
      '2 tsp baking powder',
      '½ tsp salt',
      '1 cup milk',
      'Zest of 2 lemons',
      '3 tbsp fresh lemon juice',
      'For frosting: butter, powdered sugar, lemon juice, zest'
    ],
    instructions: [
      'Preheat oven to 350°F and line cupcake pan.',
      'Cream butter and sugar until fluffy.',
      'Add eggs, lemon zest, and lemon juice.',
      'Mix flour, baking powder, and salt separately.',
      'Alternate adding dry ingredients and milk.',
      'Bake for 18-20 minutes until golden.',
      'Top with lemon buttercream frosting.'
    ],
    nutritionInfo: {
      calories: 310,
      carbs: 48,
      protein: 4,
      fat: 12,
      fiber: 1,
      sugar: 42
    }
    ,
    variations: [
      'Add poppy seeds for classic lemon-poppy flavor',
      'Incorporate lime zest for a citrus medley',
      'Fill with lemon curd for extra citrus burst',
      'Top with candied lemon slices for elegant presentation'
    ],
    pairings: 'Delightful with Earl Grey tea, chamomile tea, or iced lemonade. Perfect alongside fresh berries or a light fruit salad.',
    bestTime: 'Perfect for spring gatherings, afternoon tea parties, or when you need a bright pick-me-up. Ideal for those with nut allergies. Best within 3 days.',
    recipeKeys: ['Nut Free', 'Citrus Fresh', 'Allergy Friendly', 'Bright Flavors', 'Mood Lifting'],
    conclusion: 'These lemon sunshine cupcakes bring pure joy and brightness to any occasion while being completely safe for those with nut allergies.',
    faq: [
      {
        question: "How can I ensure my kitchen is completely nut-free for these cupcakes?",
        answer: "Thoroughly clean all surfaces, utensils, and mixing bowls. Check that all ingredients are certified nut-free and processed in nut-free facilities. Even vanilla extract should be verified as some are processed in facilities that handle nuts."
      },
      {
        question: "Can I make lemon curd filling for these cupcakes?",
        answer: "Yes! Make a simple lemon curd with lemon juice, sugar, eggs, and butter. Once cupcakes are baked and cooled, use a cupcake corer or knife to remove a small center portion and fill with curd before frosting."
      },
      {
        question: "My lemon flavor isn't strong enough. How can I intensify it?",
        answer: "Use both lemon zest and juice for maximum flavor. Add lemon extract (start with ½ teaspoon) and consider adding lemon zest to your frosting too. Fresh lemons always provide better flavor than bottled juice."
      },
      {
        question: "Why are my lemon cupcakes turning green?",
        answer: "This happens when lemon juice reacts with aluminum pans or utensils. Use stainless steel bowls and utensils, and stick to paper liners in your muffin tin to prevent this reaction."
      },
      {
        question: "Can I substitute the butter with oil for dairy-free version?",
        answer: "Yes! Use neutral oil like vegetable or canola oil (¾ the amount of butter called for). The texture will be slightly different but still delicious. Use dairy-free milk and make dairy-free frosting too."
      },
      {
        question: "How do I prevent the frosting from becoming too tart?",
        answer: "Balance is key! Start with less lemon juice in the frosting and taste as you go. The sweetness of powdered sugar should balance the tartness. You can always add more lemon, but you can't take it away."
      }
    ]
  },
  {
    id: '5',
    title: 'Red Velvet Romance Cupcakes',
    slug: 'red-velvet-romance-cupcakes',
    description: 'Surrender to the romance and mystique of these absolutely enchanting red velvet cupcakes that embody passion, elegance, and Southern charm in every luxurious bite. These aren\'t merely cupcakes – they\'re edible love letters that tell a story of tradition, craftsmanship, and the kind of baking that touches the soul. The signature deep crimson color is achieved through the perfect balance of natural cocoa powder and food coloring, creating that iconic red velvet hue that has captivated hearts for generations. But the magic goes far beyond appearances – the texture is what truly sets these cupcakes apart, with a crumb so tender and velvety smooth it feels like silk against your palate. This extraordinary texture comes from the careful interaction between buttermilk\'s acidity and a touch of vinegar, which creates a chemical reaction that produces the most incredibly soft and moist cake imaginable. The flavor profile is a sophisticated dance of subtle chocolate notes from premium cocoa powder, balanced perfectly with the tangy richness of cultured buttermilk and the warmth of pure vanilla extract. Each element works in harmony to create a taste that\'s both familiar and mysteriously complex, leaving you wanting more with every bite. The crowning glory is our traditional cream cheese frosting – rich, tangy, and perfectly sweet – that complements the cake\'s flavors like the perfect dance partner. Whether you\'re celebrating love, marking a special occasion, or simply indulging in one of baking\'s most beloved classics, these red velvet cupcakes speak the universal language of romance through the timeless art of exceptional Southern baking.',
    shortDescription: 'Surrender to romance with these enchanting red velvet cupcakes featuring velvety smooth texture and traditional cream cheese frosting.',
    image: '/red-velvet-romance-cupcakes.jpg',
    category: 'classic',
    difficulty: 'Medium',
    prepTime: '45 mins',
    cookTime: '20 mins',
    totalTime: '65 mins',
    servings: 12,
    rating: 4.9,
    cuisine: 'Southern American',
    dietaryBadges: ['Vegetarian'],
    author: {
      name: 'Incr-EdibleCupCakes',
      url: 'https://incr-ediblecupcakes.com'
    },
    keywords: ['red velvet cupcakes', 'classic cupcakes', 'cream cheese frosting', 'southern baking', 'romantic cupcakes'],
    ingredients: [
      '2½ cups all-purpose flour',
      '1½ cups sugar',
      '1 cup buttermilk',
      '2 eggs',
      '2 tbsp red food coloring',
      '1 tsp vanilla extract',
      '1 tsp baking soda',
      '1 tbsp white vinegar',
      '⅓ cup vegetable oil',
      'For frosting: cream cheese, butter, powdered sugar'
    ],
    instructions: [
      'Preheat oven to 350°F and prepare cupcake liners.',
      'Mix flour, sugar, and cocoa powder in large bowl.',
      'Whisk buttermilk, eggs, food coloring, vanilla, and oil.',
      'Combine wet and dry ingredients until smooth.',
      'Mix baking soda with vinegar and fold into batter.',
      'Bake for 18-20 minutes until toothpick comes out clean.',
      'Cool and frost with cream cheese frosting.'
    ],
    nutritionInfo: {
      calories: 340,
      carbs: 52,
      protein: 5,
      fat: 13,
      fiber: 2,
      sugar: 45
    }
    ,
    variations: [
      'Create mini red velvet cupcakes for bite-sized treats',
      'Add white chocolate chips for extra indulgence',
      'Make red velvet whoopie pies with the same batter',
      'Create red velvet cake pops using crumbled cupcakes'
    ],
    pairings: 'Classic with coffee, perfect with champagne for celebrations, or alongside vanilla ice cream. Pairs beautifully with fresh strawberries.',
    bestTime: 'Perfect for Valentine\'s Day, anniversaries, romantic dinners, or any time you want to show someone you care. Best enjoyed within 4 days.',
    recipeKeys: ['Romantic', 'Southern Classic', 'Elegant', 'Special Occasion', 'Timeless'],
    conclusion: 'These red velvet cupcakes are more than dessert – they\'re an expression of love and tradition that creates unforgettable moments.',
    faq: [
      {
        question: "What makes red velvet different from chocolate cake?",
        answer: "Red velvet has a subtle chocolate flavor from cocoa powder, but the real magic comes from the reaction between buttermilk's acidity and baking soda, creating that distinctive tender, velvety texture. It's more about texture than chocolate flavor."
      },
      {
        question: "Can I make red velvet without food coloring?",
        answer: "Traditional red velvet gets its color from the reaction between cocoa and acid, but modern cocoa is processed differently. For natural coloring, try beetroot powder, but you'll need quite a bit to achieve that signature red color."
      },
      {
        question: "Why is my red velvet cake more brown than red?",
        answer: "This usually means you need more food coloring or your cocoa powder is too dark. Use a lighter cocoa powder and don't be afraid to add enough red coloring – typically 2-3 tablespoons for vibrant color."
      },
      {
        question: "Can I make cream cheese frosting ahead of time?",
        answer: "Yes! Cream cheese frosting can be made 2-3 days ahead and refrigerated. Let it come to room temperature and re-whip briefly before using. It actually tastes better after the flavors meld overnight."
      },
      {
        question: "What's the secret to smooth cream cheese frosting?",
        answer: "Use room temperature cream cheese and butter – this is crucial! Beat the cream cheese alone first until smooth, then add butter, and finally powdered sugar. Cold ingredients will create lumpy frosting."
      },
      {
        question: "Can I turn this into a layer cake instead?",
        answer: "Absolutely! This recipe works perfectly for two 9-inch round cake layers. Bake for 25-30 minutes and adjust frosting quantity accordingly. You'll need about double the frosting for a layer cake."
      }
    ]
  },
  {
    id: '6',
    title: 'Gluten-Free Almond Joy Cupcakes',
    slug: 'gluten-free-almond-joy-cupcakes',
    description: 'Escape to a tropical paradise with every bite of these extraordinary gluten-free Almond Joy cupcakes that perfectly capture the essence of the beloved candy bar while delivering a bakery-quality experience that will transport you straight to sandy beaches and swaying palm trees. These aren\'t just gluten-free alternatives – they\'re destination desserts that happen to be made without gluten, proving that dietary restrictions never have to mean compromising on flavor, texture, or pure indulgence. The foundation is built on a carefully crafted blend of premium gluten-free flours that creates the most incredibly tender, moist, and fluffy texture you\'ve ever experienced in a gluten-free baked good. Each cupcake is infused with rich coconut flavor from multiple sources – creamy coconut milk in the batter, finely shredded coconut folded throughout, and coconut extract that intensifies the tropical notes. The result is a cake that tastes like a gentle ocean breeze and feels like silk on your tongue. But the real magic happens with the toppings that transform these cupcakes into edible works of art. A rich, glossy chocolate ganache cascades down the sides like liquid silk, made from premium dark chocolate and heavy cream that creates the perfect balance of bitter and sweet. Crowning each cupcake are perfectly toasted sliced almonds that add not just visual appeal but also a satisfying crunch that contrasts beautifully with the soft cake below. Hidden inside each cupcake is a surprise coconut cream filling that bursts with tropical flavor, creating multiple layers of taste and texture that make every bite an adventure in paradise.',
    shortDescription: 'Escape to paradise with these gluten-free Almond Joy cupcakes featuring coconut-infused cake, chocolate ganache, and toasted almonds.',
    image: '/gluten-free-almond-joy-cupcakes.jpg',
    category: 'gluten-free',
    difficulty: 'Hard',
    prepTime: '50 mins',
    cookTime: '22 mins',
    totalTime: '72 mins',
    servings: 12,
    rating: 4.8,
    cuisine: 'Tropical',
    dietaryBadges: ['Gluten-Free', 'Vegetarian'],
    author: {
      name: 'Incr-EdibleCupCakes',
      url: 'https://incr-ediblecupcakes.com'
    },
    keywords: ['gluten free cupcakes', 'almond joy cupcakes', 'coconut cupcakes', 'tropical cupcakes', 'chocolate coconut'],
    ingredients: [
      '2 cups gluten-free flour blend',
      '1 cup sugar',
      '¾ cup coconut milk',
      '2 eggs',
      '½ cup shredded coconut',
      '⅓ cup coconut oil',
      '1 tsp vanilla',
      '1½ tsp baking powder',
      '½ tsp salt',
      'For topping: dark chocolate, sliced almonds'
    ],
    instructions: [
      'Preheat oven to 350°F and line cupcake pan.',
      'Whisk gluten-free flour, baking powder, and salt.',
      'Beat eggs, sugar, coconut milk, coconut oil, and vanilla.',
      'Fold in dry ingredients and shredded coconut.',
      'Bake for 20-22 minutes until golden.',
      'Top with chocolate ganache and toasted almonds.',
      'Let set before serving.'
    ],
    nutritionInfo: {
      calories: 295,
      carbs: 38,
      protein: 4,
      fat: 15,
      fiber: 3,
      sugar: 32
    }
    ,
    variations: [
      'Use different nuts like pecans or macadamias',
      'Add coconut flakes to the ganache for extra texture',
      'Create mini versions for party treats',
      'Drizzle with caramel sauce for extra indulgence'
    ],
    pairings: 'Tropical with coconut water, coffee, or rum-based cocktails. Perfect alongside fresh pineapple or mango slices.',
    bestTime: 'Ideal for summer parties, tropical-themed events, or when you need a gluten-free treat that doesn\'t compromise on flavor. Best within 4 days.',
    recipeKeys: ['Gluten Free', 'Tropical', 'Candy Bar Inspired', 'Coconut Rich', 'Indulgent'],
    conclusion: 'These Almond Joy cupcakes prove that gluten-free baking can transport you to paradise with every single delicious bite.',
    faq: [
      {
        question: "Which gluten-free flour blend works best for these cupcakes?",
        answer: "Use a high-quality 1:1 gluten-free flour blend that contains xanthan gum (like Bob's Red Mill or King Arthur). Avoid single-grain flours like rice flour alone, as they won't provide the right texture."
      },
      {
        question: "Can I make these nut-free by omitting the almonds?",
        answer: "Yes! Simply omit the sliced almonds and replace with toasted coconut flakes or sunflower seeds for crunch. The coconut flavor will still shine through beautifully."
      },
      {
        question: "Why are my gluten-free cupcakes crumbly?",
        answer: "Gluten-free batters need more moisture and binding. Make sure you're using a flour blend with xanthan gum, don't overbake, and consider adding an extra egg yolk for binding if needed."
      },
      {
        question: "Can I use light coconut milk instead of full-fat?",
        answer: "Full-fat coconut milk is essential for rich flavor and proper texture. Light coconut milk will result in less flavorful, potentially dry cupcakes. The fat content is crucial for gluten-free baking success."
      },
      {
        question: "How do I prevent the chocolate ganache from being too thick?",
        answer: "If your ganache is too thick, warm it gently and whisk in a tablespoon of coconut milk or heavy cream until you reach the desired consistency. It should coat the back of a spoon smoothly."
      },
      {
        question: "Can I make these dairy-free too?",
        answer: "Absolutely! Use dairy-free chocolate for the ganache and ensure your coconut milk is full-fat. These are naturally dairy-free except for the chocolate, so it's an easy swap."
      }
    ]
  },
  {
    id: '7',
    title: 'Rosewater Pistachio Delight Cupcakes',
    slug: 'rosewater-pistachio-delight-cupcakes',
    description: 'These cupcakes are a love letter to delicate flavors and beautiful textures. The sponge is infused with a whisper of rosewater, giving it a fragrant, floral aroma that pairs perfectly with finely ground pistachios folded into the batter. Each cupcake is topped with a cloud of rose-scented buttercream and sprinkled generously with crushed pistachios for a satisfying crunch. They’re as stunning to look at as they are to eat, making them perfect for moments when you want to impress without going over the top.',
    shortDescription: 'Soft rosewater cupcakes topped with pistachio crunch and dreamy rose buttercream.',
    image: '/rosewater-pistachio-delight-cupcakes.jpg',
    category: 'gourmet',
    difficulty: 'Intermediate',
    prepTime: '30 mins',
    cookTime: '18 mins',
    totalTime: '48 mins',
    servings: 12,
    rating: 4.9,
    featured: true,
    cuisine: 'Middle Eastern-Inspired',
    dietaryBadges: ['Vegetarian'],
    author: {
      name: 'Incr-EdibleCupCakes',
      url: 'https://incr-ediblecupcakes.com'
    },
    keywords: ['rosewater cupcakes', 'pistachio cupcakes', 'middle eastern cupcakes', 'gourmet cupcakes', 'floral cupcakes'],
    ingredients: [
      '1½ cups all-purpose flour',
      '½ cup finely ground pistachios',
      '1½ tsp baking powder',
      '½ tsp salt',
      '½ cup unsalted butter, softened',
      '1 cup sugar',
      '2 large eggs',
      '½ cup whole milk',
      '1 tsp rosewater',
      'For frosting: 1 cup butter, 3 cups powdered sugar, 1 tsp rosewater',
      'Crushed pistachios for garnish'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C) and line muffin tin.',
      'Cream butter and sugar until light and fluffy.',
      'Beat in eggs one at a time, then rosewater.',
      'In another bowl, mix flour, pistachios, baking powder, and salt.',
      'Add dry mixture to wet alternately with milk.',
      'Fill liners ¾ full and bake 18 minutes. Cool completely.',
      'Frost with rosewater buttercream and sprinkle with crushed pistachios.'
    ],
    nutritionInfo: { calories: 325, carbs: 42, protein: 5, fat: 16, fiber: 2, sugar: 32 },
    tips: [
      'Use food-grade rosewater for safe consumption',
      'Toast pistachios before grinding for deeper flavor',
      'Avoid adding too much rosewater to prevent overpowering taste'
    ],
    variations: [
      'Add cardamom for a spiced twist',
      'Fill with raspberry jam for extra tartness',
      'Top with edible rose petals for presentation'
    ],
    pairings: 'Perfect with green tea, hibiscus tea, or sparkling water with lemon.',
    bestTime: 'Ideal for weddings, afternoon tea, or thoughtful gifts.',
    recipeKeys: ['Floral', 'Nutty', 'Elegant', 'Showstopper'],
    conclusion: 'These cupcakes are proof that elegance can be both simple and unforgettable.',
    faq: [
      { question: 'Can I skip the pistachios?', answer: 'Yes, you can replace them with almond flour for a slightly different flavor and texture.' },
      { question: 'How strong is the rosewater flavor?', answer: 'It’s subtle and floral—just enough to complement the sweetness without being perfumey.' },
      { question: 'Can I make them vegan?', answer: 'Yes, use plant-based butter, almond milk, and flax eggs for a vegan-friendly version.' },
      { question: 'How should I store them?', answer: 'Keep them in an airtight container at room temperature for 2 days or refrigerate for up to 4 days.' },
      { question: 'Will they freeze well?', answer: 'The unfrosted cupcakes freeze beautifully for up to 2 months. Thaw before frosting.' }
    ]
  },
  {
    id: '8',
    title: 'Mango Coconut Sunset Cupcakes',
    slug: 'mango-coconut-sunset-cupcakes',
    description: 'Inspired by tropical sunsets, these cupcakes combine the creamy sweetness of ripe mango with the rich, nutty flavor of coconut. The sponge is soft and moist, thanks to coconut milk, and filled with a bright mango purée. A swirl of coconut cream frosting tops each one, finished with a slice of fresh mango and a sprinkle of toasted coconut. Every bite is like a warm beach breeze.',
    shortDescription: 'Tropical cupcakes with mango filling, coconut frosting, and toasted coconut topping.',
    image: '/mango-coconut-sunset-cupcakes.png',
    category: 'tropical',
    difficulty: 'Easy',
    prepTime: '25 mins',
    cookTime: '20 mins',
    totalTime: '45 mins',
    servings: 12,
    rating: 4.8,
    featured: false,
    cuisine: 'Caribbean-Inspired',
    dietaryBadges: ['Dairy-Free Option'],
    author: {
      name: 'Incr-EdibleCupCakes',
      url: 'https://incr-ediblecupcakes.com'
    },
    keywords: ['mango cupcakes', 'coconut cupcakes', 'tropical cupcakes', 'caribbean cupcakes', 'summer cupcakes'],
    ingredients: [
      '1½ cups all-purpose flour',
      '1 tsp baking powder',
      '½ tsp baking soda',
      '½ tsp salt',
      '½ cup unsalted butter or coconut oil',
      '1 cup sugar',
      '2 large eggs',
      '½ cup coconut milk',
      '½ cup mango purée (plus extra for filling)',
      'For frosting: 1 cup coconut cream, 3 cups powdered sugar',
      'Toasted coconut and mango slices for garnish'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C).',
      'Cream butter/oil and sugar until fluffy.',
      'Beat in eggs, then mango purée.',
      'Mix dry ingredients separately, then fold into wet mixture alternately with coconut milk.',
      'Bake 20 minutes, cool, core cupcakes, fill with extra mango purée.',
      'Frost with coconut cream frosting and garnish with mango slices and toasted coconut.'
    ],
    nutritionInfo: { calories: 340, carbs: 48, protein: 4, fat: 15, fiber: 2, sugar: 34 },
    tips: [
      'Use ripe, sweet mangoes for best flavor',
      'Chill coconut cream before whipping',
      'Toast coconut for 3-4 minutes for a richer aroma'
    ],
    variations: [
      'Add lime zest for a citrus twist',
      'Fill with passionfruit curd instead of mango',
      'Make vegan by using plant-based substitutes'
    ],
    pairings: 'Best with iced tea, piña colada, or sparkling water with tropical fruit.',
    bestTime: 'Perfect for summer parties, BBQs, and tropical-themed events.',
    recipeKeys: ['Tropical', 'Fruity', 'Beach Vibes'],
    conclusion: 'A bite of sunshine you can enjoy any time of year.',
    faq: [
      { question: 'Can I use frozen mango?', answer: 'Yes, just thaw and blend until smooth for the purée.' },
      { question: 'How do I make coconut cream frosting?', answer: 'Chill the coconut cream overnight, whip with powdered sugar until fluffy.' },
      { question: 'Will the mango filling make the cupcakes soggy?', answer: 'Not if you core them properly and add filling just before serving.' },
      { question: 'Can I use canned coconut milk?', answer: 'Yes, but make sure it’s full-fat for the best texture.' },
      { question: 'Can these be made in advance?', answer: 'Yes, store unfrosted cupcakes for 2 days and assemble before serving.' }
    ]
  },
  {
    id: '9',
    title: 'Chocolate Chili Firecracker Cupcakes',
    slug: 'chocolate-chili-firecracker-cupcakes',
    description: 'These bold cupcakes are for adventurous taste buds. Rich dark chocolate sponge is infused with a hint of chili powder and cinnamon, creating a warm kick that lingers. The frosting is a smooth chocolate ganache with just a touch of cayenne for a fiery finish. Garnished with a shard of chili-infused chocolate, they’re a daring twist on classic chocolate.',
    shortDescription: 'Dark chocolate cupcakes with a warm chili kick and rich ganache frosting.',
    image: '/Chocolate Chili Firecracker Cupcakes.jpg',
    category: 'spiced',
    difficulty: 'Intermediate',
    prepTime: '30 mins',
    cookTime: '20 mins',
    totalTime: '50 mins',
    servings: 12,
    rating: 4.7,
    featured: false,
    cuisine: 'Mexican-Inspired',
    dietaryBadges: [],
    author: {
      name: 'Incr-EdibleCupCakes',
      url: 'https://incr-ediblecupcakes.com'
    },
    keywords: ['chocolate chili cupcakes', 'spicy cupcakes', 'mexican cupcakes', 'chili cupcakes', 'adventurous cupcakes'],
    ingredients: [
      '1 cup all-purpose flour',
      '½ cup cocoa powder',
      '1 tsp baking powder',
      '½ tsp baking soda',
      '½ tsp salt',
      '1 tsp cinnamon',
      '½ tsp chili powder',
      '¼ tsp cayenne pepper',
      '½ cup butter',
      '1 cup sugar',
      '2 eggs',
      '½ cup buttermilk',
      'For ganache: 6 oz dark chocolate, ½ cup cream, pinch of cayenne',
      'Chili chocolate shards for garnish'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C).',
      'Mix flour, cocoa, baking powder, baking soda, salt, cinnamon, chili powder, and cayenne.',
      'Cream butter and sugar, add eggs, then fold in dry ingredients alternately with buttermilk.',
      'Bake 20 minutes, cool, frost with chili-infused ganache, garnish with chocolate shards.'
    ],
    nutritionInfo: { calories: 320, carbs: 42, protein: 4, fat: 15, fiber: 2, sugar: 30 },
    tips: [
      'Adjust chili to taste for heat level',
      'Use high-quality dark chocolate for ganache',
      'Serve at room temperature for best flavor'
    ],
    variations: [
      'Add orange zest for a citrus-spice combo',
      'Top with candied jalapeño slices for presentation',
      'Fill with chocolate-chili truffle'
    ],
    pairings: 'Best with spiced coffee, red wine, or horchata.',
    bestTime: 'Perfect for dinner parties or Valentine’s Day with a twist.',
    recipeKeys: ['Bold', 'Spiced', 'Adventurous'],
    conclusion: 'A cupcake that’s as exciting as it is indulgent.',
    faq: [
      { question: 'Will they be too spicy?', answer: 'The heat is gentle, more of a warm finish than a burn. Adjust cayenne for preference.' },
      { question: 'Can kids eat these?', answer: 'If you reduce the chili, they can be enjoyed by those with milder taste buds.' },
      { question: 'How do I make chili chocolate shards?', answer: 'Melt chocolate, stir in chili powder, spread thin, chill, then break into shards.' },
      { question: 'Can I use milk chocolate?', answer: 'Dark chocolate is better for balancing spice, but milk chocolate works for a sweeter version.' },
      { question: 'Can I freeze them?', answer: 'Yes, but do so without ganache for best results.' }
    ]
  },
  {
    id: '10',
    title: 'Boston Cream Cupcakes',
    slug: 'boston-cream-cupcakes',
    description: 'Experience the perfect fusion of classic American dessert traditions with these extraordinary Boston Cream cupcakes that bring the beloved Boston Cream Pie to life in individual, bite-sized perfection. These aren\'t just cupcakes – they\'re miniature masterpieces that capture the essence of one of America\'s most iconic desserts while delivering an elevated experience that honors the original while creating something entirely new. The foundation is a perfectly tender vanilla sponge cake that\'s been crafted with precision to achieve the ideal texture – moist enough to melt on your tongue yet sturdy enough to hold the luxurious filling that makes these cupcakes truly special. Each cupcake is carefully hollowed out and filled with our signature vanilla pastry cream, a silky-smooth custard that\'s been infused with real vanilla beans and cooked to perfection until it reaches that magical consistency that\'s both rich and light. The pastry cream is the heart of these cupcakes, providing a burst of creamy sweetness that perfectly complements the tender cake surrounding it. But the crowning glory is the glossy chocolate ganache that cascades down the sides like liquid silk, made from premium dark chocolate and heavy cream that creates the perfect balance of bitter and sweet. This isn\'t just any chocolate topping – it\'s a carefully crafted ganache that sets to a beautiful sheen while maintaining its luxurious mouthfeel. Every element works in perfect harmony to create a taste experience that transports you to the finest bakeries of Boston while delivering the convenience and portion control that makes cupcakes so beloved.',
    shortDescription: 'Classic Boston Cream Pie reimagined as individual cupcakes with vanilla pastry cream filling and rich chocolate ganache topping.',
    image: '/boston-cream-cupcakes.jpg',
    category: 'classic',
    difficulty: 'Hard',
    prepTime: '60 mins',
    cookTime: '20 mins',
    totalTime: '80 mins',
    servings: 12,
    rating: 4.9,
    featured: true,
    cuisine: 'American',
    dietaryBadges: ['Vegetarian'],
    author: {
      name: 'Sarah Johnson',
      url: 'https://incr-ediblecupcakes.com/about'
    },
    keywords: ['boston cream cupcakes', 'boston cream pie', 'vanilla custard cupcakes', 'chocolate ganache cupcakes', 'classic american dessert'],
    ingredients: [
      '2 cups all-purpose flour',
      '1½ cups sugar',
      '½ cup butter, softened',
      '2 large eggs',
      '2 tsp vanilla extract',
      '2 tsp baking powder',
      '½ tsp salt',
      '1 cup whole milk',
      'For pastry cream: 2 cups milk, 4 egg yolks, ½ cup sugar, 3 tbsp cornstarch, 1 tsp vanilla',
      'For ganache: 8 oz dark chocolate, 1 cup heavy cream'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C) and line muffin tin with cupcake liners.',
      'Cream butter and sugar until light and fluffy, about 3 minutes.',
      'Add eggs one at a time, then vanilla extract.',
      'In separate bowl, whisk flour, baking powder, and salt.',
      'Alternate adding dry ingredients and milk to wet ingredients.',
      'Fill cupcake liners ¾ full and bake for 18-20 minutes.',
      'Cool completely, then core cupcakes and fill with pastry cream.',
      'Top with chocolate ganache and let set before serving.'
    ],
    nutritionInfo: {
      calories: 385,
      carbs: 52,
      protein: 6,
      fat: 18,
      fiber: 2,
      sugar: 42
    },
    tips: [
      'Make pastry cream ahead of time and chill thoroughly',
      'Core cupcakes carefully to avoid breaking the sides',
      'Let ganache cool slightly before pouring for better control',
      'Store refrigerated due to pastry cream filling'
    ],
    variations: [
      'Add coffee extract to pastry cream for mocha flavor',
      'Top with chocolate shavings or gold leaf for elegance',
      'Create mini versions for bite-sized treats',
      'Add orange zest to pastry cream for citrus twist'
    ],
    pairings: 'Perfect with coffee, espresso, or a glass of cold milk. Pairs beautifully with fresh berries or a scoop of vanilla ice cream.',
    bestTime: 'Ideal for special occasions, dinner parties, or when you want to impress with classic American dessert perfection. Best consumed within 3 days when refrigerated.',
    recipeKeys: ['Classic American', 'Elegant', 'Special Occasion', 'Custard Filled', 'Chocolate Topped'],
    conclusion: 'Boston Cream cupcakes offer the perfect balance of tradition and innovation, delivering restaurant-quality dessert in convenient individual portions.',
    faq: [
      {
        question: "How do I make the pastry cream without lumps?",
        answer: "Temper the egg yolks by slowly adding hot milk while whisking constantly. Cook over medium heat while stirring continuously until thickened. Strain through a fine mesh sieve if needed."
      },
      {
        question: "Can I make these ahead of time?",
        answer: "Yes! Make the pastry cream and cupcakes separately, then assemble and add ganache up to 4 hours before serving. Store refrigerated and bring to room temperature before serving."
      },
      {
        question: "What's the best way to core the cupcakes?",
        answer: "Use a small paring knife or cupcake corer to remove a cone-shaped piece from the center. Cut at an angle to create a cavity for the filling while leaving enough cake at the bottom."
      },
      {
        question: "Can I use store-bought custard instead of making pastry cream?",
        answer: "While homemade pastry cream is superior, you can use high-quality vanilla pudding or custard. Make sure it's thick enough to hold its shape when piped into the cupcakes."
      },
      {
        question: "Why is my ganache too thick or too thin?",
        answer: "For thick ganache, add more cream. For thin ganache, add more chocolate. The ideal ratio is 1:1 chocolate to cream by weight. Let it cool to room temperature before pouring."
      },
      {
        question: "Can I make these gluten-free?",
        answer: "Yes! Use a high-quality gluten-free flour blend and ensure all other ingredients are gluten-free. The texture will be slightly different but still delicious."
      }
    ]
  },
  {
    id: '11',
    title: 'Prune Cupcakes',
    slug: 'prune-cupcakes',
    description: 'Discover the unexpected elegance of these sophisticated prune cupcakes that transform this often-overlooked fruit into a dessert masterpiece that will surprise and delight even the most skeptical palates. These aren\'t your grandmother\'s prune desserts – they\'re a modern interpretation that celebrates the natural sweetness and complex flavor profile of prunes while creating a cupcake that\'s both refined and deeply satisfying. The magic begins with premium, plump prunes that have been carefully selected for their rich, wine-like sweetness and tender texture. These prunes are pureed to silky perfection and folded into a carefully balanced batter that\'s been enhanced with warm spices like cinnamon, nutmeg, and a hint of cardamom that perfectly complements the fruit\'s natural flavors. The result is a cupcake with an incredibly moist, tender crumb that practically melts on your tongue, while the prune puree creates a subtle depth of flavor that\'s both sweet and sophisticated. But the real revelation is the cream cheese frosting that\'s been infused with a touch of vanilla and a whisper of lemon zest, creating the perfect balance of tangy and sweet that beautifully complements the rich prune flavor. Each cupcake is finished with a delicate garnish of chopped prunes or a dusting of cinnamon, creating a visual appeal that hints at the complex flavors within. These cupcakes prove that sometimes the most unexpected ingredients can create the most memorable desserts, offering a sophisticated alternative to traditional fruit-based cupcakes while delivering incredible moisture and natural sweetness.',
    shortDescription: 'Sophisticated cupcakes featuring pureed prunes, warm spices, and cream cheese frosting for a surprisingly elegant dessert experience.',
    image: '/prune-cupcakes.jpg',
    category: 'classic',
    difficulty: 'Medium',
    prepTime: '40 mins',
    cookTime: '20 mins',
    totalTime: '60 mins',
    servings: 12,
    rating: 4.6,
    featured: false,
    cuisine: 'Modern American',
    dietaryBadges: ['Vegetarian'],
    author: {
      name: 'Chef Maria Rodriguez',
      url: 'https://incr-ediblecupcakes.com/about'
    },
    keywords: ['prune cupcakes', 'dried fruit cupcakes', 'spiced cupcakes', 'moist cupcakes', 'natural sweetness cupcakes'],
    ingredients: [
      '2 cups all-purpose flour',
      '1½ cups sugar',
      '½ cup butter, softened',
      '2 large eggs',
      '1 cup prune puree (about 20 prunes)',
      '1 tsp vanilla extract',
      '1 tsp cinnamon',
      '½ tsp nutmeg',
      '¼ tsp cardamom',
      '2 tsp baking powder',
      '½ tsp salt',
      '½ cup buttermilk',
      'For frosting: 8 oz cream cheese, ½ cup butter, 3 cups powdered sugar, 1 tsp vanilla'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C) and line muffin tin with cupcake liners.',
      'Soak prunes in warm water for 10 minutes, then puree until smooth.',
      'Cream butter and sugar until light and fluffy.',
      'Add eggs one at a time, then vanilla and prune puree.',
      'In separate bowl, whisk flour, spices, baking powder, and salt.',
      'Alternate adding dry ingredients and buttermilk to wet ingredients.',
      'Fill cupcake liners ¾ full and bake for 18-22 minutes.',
      'Cool completely before frosting with cream cheese frosting.'
    ],
    nutritionInfo: {
      calories: 320,
      carbs: 48,
      protein: 4,
      fat: 13,
      fiber: 3,
      sugar: 38
    },
    tips: [
      'Use high-quality, plump prunes for best flavor',
      'Puree prunes while still warm for smoother texture',
      'Don\'t overbake - prunes keep cupcakes very moist',
      'Let cupcakes cool completely before frosting'
    ],
    variations: [
      'Add chopped walnuts or pecans to the batter',
      'Swirl in a ribbon of prune puree for extra fruit flavor',
      'Top with candied prunes for elegant presentation',
      'Add orange zest to the frosting for citrus contrast'
    ],
    pairings: 'Delightful with Earl Grey tea, coffee, or a glass of port wine. Pairs beautifully with aged cheeses or fresh fruit.',
    bestTime: 'Perfect for afternoon tea, sophisticated gatherings, or when you want to offer something unique and memorable. Best within 4 days.',
    recipeKeys: ['Unexpected Elegance', 'Natural Sweetness', 'Spiced', 'Moist', 'Sophisticated'],
    conclusion: 'Prune cupcakes demonstrate how traditional ingredients can be reimagined into modern, sophisticated desserts that surprise and delight.',
    faq: [
      {
        question: "Why would I use prunes in cupcakes?",
        answer: "Prunes add incredible moisture, natural sweetness, and a sophisticated depth of flavor. They also provide fiber and nutrients while creating a unique taste that's both familiar and surprising."
      },
      {
        question: "Can I substitute other dried fruits?",
        answer: "Yes! Dates, figs, or raisins work well, but each will change the flavor profile. Prunes have a unique wine-like sweetness that's hard to replicate with other fruits."
      },
      {
        question: "Will these cupcakes taste like prune juice?",
        answer: "Not at all! The prunes are pureed and combined with spices and other ingredients, creating a rich, cake-like flavor that's sweet and sophisticated rather than medicinal."
      },
      {
        question: "How do I make prune puree?",
        answer: "Soak prunes in warm water for 10 minutes, then blend in a food processor or blender until smooth. Add a little soaking liquid if needed to achieve a thick puree consistency."
      },
      {
        question: "Can I make these without the spices?",
        answer: "Yes, but the spices really enhance the prune flavor. If you prefer, you can reduce or omit them, but the cinnamon and nutmeg add warmth that complements the fruit beautifully."
      },
      {
        question: "Are these cupcakes healthy?",
        answer: "They're healthier than many cupcakes due to the natural sweetness from prunes and added fiber, but they still contain sugar and butter. They're a better choice than traditional cupcakes but still a treat."
      }
    ]
  },
  {
    id: '12',
    title: 'Yellow Cake Cupcakes',
    slug: 'yellow-cake-cupcakes',
    description: 'Celebrate the timeless perfection of these classic yellow cake cupcakes that capture the essence of American baking tradition in every golden, buttery bite. These aren\'t just ordinary cupcakes – they\'re a masterclass in fundamental baking techniques that showcase how simple ingredients, when combined with skill and care, can create something truly extraordinary. The foundation is a perfectly balanced yellow cake batter that\'s been crafted to achieve the ideal golden color and tender crumb that defines this beloved American classic. Each cupcake boasts an incredibly moist and fluffy texture that\'s achieved through the perfect ratio of butter, eggs, and milk, creating a crumb so light and airy it practically melts on your tongue. The secret lies in the careful creaming of butter and sugar, which incorporates just the right amount of air to create that signature lightness, while the addition of whole eggs (not just yolks) provides both structure and richness. The vanilla extract is pure and high-quality, adding that essential warmth and depth that makes yellow cake so comforting and familiar. But what truly elevates these cupcakes is the classic chocolate buttercream frosting that\'s been whipped to silky perfection, creating the perfect contrast between the golden cake and rich chocolate topping. This isn\'t just any chocolate frosting – it\'s a carefully balanced blend of cocoa powder, butter, and powdered sugar that creates the ideal sweetness level while allowing the chocolate flavor to shine through. Every element works in perfect harmony to create a taste experience that\'s both nostalgic and sophisticated, proving that sometimes the classics are classic for a very good reason.',
    shortDescription: 'Classic American yellow cake cupcakes with rich chocolate buttercream frosting - the perfect combination of golden cake and chocolate indulgence.',
    image: '/yellow-cake-cupcakes.jpg',
    category: 'classic',
    difficulty: 'Easy',
    prepTime: '30 mins',
    cookTime: '18 mins',
    totalTime: '48 mins',
    servings: 12,
    rating: 4.8,
    featured: true,
    cuisine: 'American',
    dietaryBadges: ['Vegetarian'],
    author: {
      name: 'Baker Emma Thompson',
      url: 'https://incr-ediblecupcakes.com/about'
    },
    keywords: ['yellow cake cupcakes', 'classic cupcakes', 'chocolate buttercream cupcakes', 'american cupcakes', 'golden cake cupcakes'],
    ingredients: [
      '2 cups all-purpose flour',
      '1½ cups sugar',
      '½ cup butter, softened',
      '3 large eggs',
      '2 tsp vanilla extract',
      '2 tsp baking powder',
      '½ tsp salt',
      '1 cup whole milk',
      'For chocolate frosting: ½ cup butter, 3 cups powdered sugar, ½ cup cocoa powder, 3-4 tbsp milk'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C) and line muffin tin with cupcake liners.',
      'Cream butter and sugar until light and fluffy, about 4 minutes.',
      'Add eggs one at a time, beating well after each addition.',
      'Add vanilla extract and mix until combined.',
      'In separate bowl, whisk flour, baking powder, and salt.',
      'Alternate adding dry ingredients and milk to wet ingredients.',
      'Fill cupcake liners ¾ full and bake for 18-20 minutes.',
      'Cool completely before frosting with chocolate buttercream.'
    ],
    nutritionInfo: {
      calories: 350,
      carbs: 52,
      protein: 5,
      fat: 15,
      fiber: 2,
      sugar: 42
    },
    tips: [
      'Room temperature ingredients are essential for proper creaming',
      'Don\'t overmix after adding flour to keep cupcakes tender',
      'Use an ice cream scoop for even portioning',
      'Let cupcakes cool completely before frosting to prevent melting'
    ],
    variations: [
      'Add rainbow sprinkles to the batter for funfetti cupcakes',
      'Fill with vanilla pudding for Boston cream style',
      'Top with chocolate chips or nuts for extra texture',
      'Create marble effect by swirling in chocolate batter'
    ],
    pairings: 'Perfect with cold milk, coffee, or ice cream. Classic pairing with vanilla ice cream for a timeless dessert combination.',
    bestTime: 'Ideal for birthday parties, potlucks, or any time you want to share a beloved classic. Perfect for kids and adults alike. Best within 3 days.',
    recipeKeys: ['Classic American', 'Kid Friendly', 'Party Perfect', 'Nostalgic', 'Timeless'],
    conclusion: 'Yellow cake cupcakes embody the essence of comfort baking, offering timeless appeal with their golden crumb and classic chocolate pairing.',
    faq: [
      {
        question: "What makes yellow cake different from vanilla cake?",
        answer: "Yellow cake uses whole eggs (not just yolks) and often has a slightly higher egg content, giving it that characteristic golden color and rich, buttery flavor. It's more substantial than white cake but lighter than pound cake."
      },
      {
        question: "Can I make these without eggs?",
        answer: "Yes! You can use flax eggs (1 tbsp ground flaxseed + 3 tbsp water per egg) or commercial egg replacers. The texture will be slightly different but still delicious."
      },
      {
        question: "Why did my cupcakes turn out dense instead of fluffy?",
        answer: "This usually happens from overmixing the batter after adding flour, or using cold ingredients. Make sure everything is room temperature and mix just until combined after adding the dry ingredients."
      },
      {
        question: "Can I use different types of milk?",
        answer: "Yes! Whole milk gives the richest flavor, but 2% or even plant-based milks work well. Avoid skim milk as it can make the cupcakes less tender."
      },
      {
        question: "How do I get the perfect golden color?",
        answer: "The golden color comes from the whole eggs and proper creaming. Make sure your eggs are fresh and at room temperature. Overbaking can make them too dark, so watch the timing carefully."
      },
      {
        question: "Can I make these as a layer cake instead?",
        answer: "Absolutely! This recipe works perfectly for two 9-inch round cake layers. Bake for 25-30 minutes and double the frosting recipe for a layer cake."
      }
    ]
  }
]

// Apply validation to all recipes to ensure they have slugs
export const validatedRecipes = recipes.map(validateRecipeSlug);