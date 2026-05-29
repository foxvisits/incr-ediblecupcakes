export function buildGuideArticleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  imagePath: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: {
      '@type': 'Person',
      name: 'Sarah',
      url: 'https://incr-ediblecupcakes.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Incr-EdibleCupCakes',
      logo: {
        '@type': 'ImageObject',
        url: 'https://incr-ediblecupcakes.com/Incr-EdibleCupCakes%20Logo.png',
      },
    },
    image: `https://incr-ediblecupcakes.com${opts.imagePath}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.guide-summary', 'h1'],
    },
  };
}
