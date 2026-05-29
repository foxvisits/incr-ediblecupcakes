import { generateSlug } from './schema.mjs';

export function validateGuideDraft(guide, config) {
  const seo = config.seo;
  const errors = [];
  const warnings = [];

  for (const field of ['title', 'slug', 'summaryShort', 'metaTitle', 'metaDescription']) {
    if (!guide[field] || !String(guide[field]).trim()) errors.push(`Missing: ${field}`);
  }

  if ((guide.sections?.length ?? 0) < (seo.minGuideSections ?? 5)) {
    errors.push(`Need at least ${seo.minGuideSections ?? 5} sections`);
  }
  if ((guide.howToSteps?.length ?? 0) < 5) {
    errors.push('Need at least 5 howToSteps');
  }
  if ((guide.faq?.length ?? 0) < seo.minFaqCount) {
    errors.push(`Need at least ${seo.minFaqCount} FAQ items`);
  }
  if (!guide.sidebarBullets?.length) {
    errors.push('Need sidebarBullets');
  }

  const imageCount = config.generation?.imagesPerGuide ?? 3;
  const imgs = guide.images ?? [];
  if (imgs.length < imageCount) {
    errors.push(`Need ${imageCount} images, got ${imgs.length}`);
  }

  const metaLen = guide.metaDescription?.length ?? 0;
  if (metaLen < seo.metaDescriptionMin || metaLen > seo.metaDescriptionMax) {
    warnings.push(`metaDescription length ${metaLen}`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function attachGuideImagePaths(draft, config) {
  const slug = draft.slug;
  const count = config.generation?.imagesPerGuide ?? 3;
  const suffixes = ['', '-2', '-3', '-4'].slice(0, count);
  const roles = ['hero', 'process', 'detail', 'detail'];
  const defaultPrompts = [
    `Professional food photography for guide "${draft.title}", hero shot of cupcakes or baking scene, Incr-EdibleCupCakes blog style, natural light, no text`,
    `Process photo for "${draft.title}" guide, mixing or technique step, same photoshoot style, no text`,
    `Detail close-up for "${draft.title}" guide, texture or ingredient focus, same photoshoot style, no text`,
  ];

  const existing = (draft.images ?? []).slice(0, count);
  while (existing.length < count) {
    const i = existing.length;
    existing.push({
      role: roles[i],
      alt: `${draft.title} — ${roles[i]}`,
      prompt: defaultPrompts[i] || defaultPrompts[2],
    });
  }

  draft.images = existing.map((img, i) => ({
    ...img,
    role: img.role || roles[i],
    alt: img.alt || `${draft.title} — ${roles[i]}`,
    prompt: img.prompt || defaultPrompts[i],
    src: `/guide-${slug}${suffixes[i]}.jpg`,
  }));

  draft.image = draft.images[0].src;
  return draft;
}

export function toLiveGuide(draft) {
  const now = new Date().toISOString().split('T')[0];
  return {
    slug: draft.slug,
    title: draft.title,
    desc: draft.summaryShort,
    image: draft.image || draft.images?.[0]?.src,
    images: draft.images,
    summaryShort: draft.summaryShort,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    sidebarTitle: draft.sidebarTitle,
    sidebarBullets: draft.sidebarBullets,
    sections: draft.sections,
    howToSteps: draft.howToSteps,
    faq: draft.faq,
    table: draft.table,
    relatedLinks: draft.relatedLinks,
    category: draft.category,
    targetKeyword: draft.targetKeyword,
    datePublished: draft.datePublished || now,
    dateModified: draft.dateModified || now,
    publishedAt: draft.datePublished || now,
    contentIdeaId: draft.contentIdeaId,
  };
}

export { generateSlug };
