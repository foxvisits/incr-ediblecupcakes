/** Canonical, SEO-friendly static asset paths (legacy filenames rewritten in public/_redirects). */
export const SITE_IMAGES = {
  hero: '/hero-cupcake-scene.png',
  logo: '/logo.png',
  sarah: '/sarah.png',
} as const;

export const SITE_ORIGIN = 'https://incr-ediblecupcakes.com';

export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path}`;
}
