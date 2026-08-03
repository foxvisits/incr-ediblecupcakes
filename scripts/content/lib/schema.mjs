import { loadConfig } from './config.mjs';

export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateRecipeDraft(recipe, config) {
  const seo = config.seo;
  const errors = [];
  const warnings = [];

  const required = [
    'title',
    'slug',
    'shortDescription',
    'category',
    'difficulty',
    'prepTime',
    'cookTime',
    'totalTime',
    'servings',
    'ingredients',
    'instructions',
    'metaTitle',
    'metaDescription',
    'imageAlt',
  ];

  for (const field of required) {
    if (recipe[field] === undefined || recipe[field] === null || recipe[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (recipe.ingredients?.length < seo.minIngredients) {
    errors.push(`Need at least ${seo.minIngredients} ingredients`);
  }
  if (recipe.instructions?.length < seo.minInstructions) {
    errors.push(`Need at least ${seo.minInstructions} instructions`);
  }
  if ((recipe.faq?.length ?? 0) < seo.minFaqCount) {
    errors.push(`Need at least ${seo.minFaqCount} FAQ items`);
  }

  // Every one of these recipes is a frosted cupcake, and the instructions
  // always end by telling the reader to frost. A draft that says "cool
  // completely before frosting" while listing no frosting ingredients is
  // unmakeable, and nothing else here would catch it.
  const instructionText = (recipe.instructions ?? []).join(' ').toLowerCase();
  const ingredientText = (recipe.ingredients ?? []).join(' ').toLowerCase();
  const mentionsFrosting = /frost|buttercream|icing|glaze|pipe |piping|swirl/.test(
    `${instructionText} ${(recipe.title ?? '').toLowerCase()}`,
  );
  const hasFrostingIngredients =
    /powdered sugar|confectioner|icing sugar|cream cheese|heavy cream|whipping cream|frosting|buttercream|mascarpone|coconut cream|erythritol|allulose|monk fruit/.test(
      ingredientText,
    );
  if (mentionsFrosting && !hasFrostingIngredients) {
    errors.push('Instructions reference frosting but no frosting ingredients are listed');
  }

  const metaLen = recipe.metaDescription?.length ?? 0;
  if (metaLen < seo.metaDescriptionMin || metaLen > seo.metaDescriptionMax) {
    warnings.push(`metaDescription length ${metaLen} (target ${seo.metaDescriptionMin}-${seo.metaDescriptionMax})`);
  }

  if ((recipe.metaTitle?.length ?? 0) > seo.titleMax) {
    // Was a warning, which meant an over-length title still shipped and got
    // truncated in search results. Validation runs before any image is
    // generated, so a retry costs one text call.
    errors.push(`metaTitle is ${recipe.metaTitle.length} chars, limit is ${seo.titleMax}`);
  }

  if (recipe.rating !== undefined) {
    warnings.push('Remove rating field — not used without real user reviews');
  }

  const imageCount = config.generation?.imagesPerRecipe ?? 3;
  const imgs = recipe.images ?? [];
  if (imgs.length < imageCount) {
    errors.push(`Need ${imageCount} images (hero/process/detail), got ${imgs.length}`);
  }
  for (const [i, img] of imgs.entries()) {
    if (!img?.alt?.trim()) errors.push(`images[${i}] missing alt`);
    if (!img?.prompt?.trim()) errors.push(`images[${i}] missing prompt`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/** Assign public paths and normalize images array on draft */
export function attachImagePaths(draft, config) {
  const slug = draft.slug;
  const count = config.generation?.imagesPerRecipe ?? 3;
  const suffixes = ['', '-2', '-3', '-4'].slice(0, count);

  const roles = ['hero', 'process', 'detail', 'detail'];

  // These defaults described a different look ("white plate, natural soft
  // light") than the house style, so any recipe that fell back to them broke
  // the visual consistency of the library. Both paths now read one setting.
  const style = config.generation?.imageStyle ?? '';
  const defaultPrompts = [
    `Food photography of ${draft.title}, finished cupcakes hero shot. ${style}`,
    `Baking process photo for ${draft.title}, mixing bowl or frosting step. ${style}`,
    `Close-up cross-section or frosting texture of ${draft.title} cupcakes. ${style}`,
  ];

  const existing = (draft.images ?? []).slice(0, count);
  while (existing.length < count) {
    const i = existing.length;
    existing.push({
      role: roles[i],
      alt: `${draft.title} — ${roles[i]} photo`,
      prompt: defaultPrompts[i] || defaultPrompts[2],
    });
  }

  draft.images = existing.map((img, i) => ({
    ...img,
    role: img.role || roles[i],
    alt: img.alt || `${draft.title} — ${roles[i]}`,
    prompt: img.prompt || defaultPrompts[i] || defaultPrompts[2],
    src: `/${slug}${suffixes[i]}.jpg`,
  }));

  draft.image = draft.images[0].src;
  draft.imageAlt = draft.images[0].alt || draft.imageAlt;
  return draft;
}

export function toLiveRecipe(draft) {
  const now = new Date().toISOString().split('T')[0];
  const image = draft.image || `/${draft.slug}.jpg`;

  return {
    id: draft.id || draft.contentIdeaId || draft.slug,
    title: draft.title,
    slug: draft.slug,
    description: draft.description || draft.shortDescription,
    shortDescription: draft.shortDescription,
    image,
    imageAlt: draft.imageAlt,
    images: draft.images,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    category: draft.category,
    difficulty: draft.difficulty,
    prepTime: draft.prepTime,
    cookTime: draft.cookTime,
    totalTime: draft.totalTime,
    servings: draft.servings,
    featured: draft.featured ?? false,
    ingredients: draft.ingredients,
    instructions: draft.instructions,
    tags: draft.tags,
    nutritionInfo: draft.nutritionInfo,
    tips: draft.tips,
    variations: draft.variations,
    pairings: draft.pairings,
    bestTime: draft.bestTime,
    recipeKeys: draft.recipeKeys,
    dietaryBadges: draft.dietaryBadges,
    cuisine: draft.cuisine || 'American',
    conclusion: draft.conclusion,
    faq: draft.faq,
    author: { name: 'Sarah', url: 'https://incr-ediblecupcakes.com/about' },
    keywords: draft.keywords,
    datePublished: draft.datePublished || now,
    dateModified: draft.dateModified || now,
  };
}
