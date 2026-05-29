/** Shared SEO / IndexNow / GEO config (key is public — verified via hosted key file). */
export const SITE_HOST = 'incr-ediblecupcakes.com';
export const SITE_ORIGIN = `https://${SITE_HOST}`;

/** Override with INDEXNOW_KEY env if rotated in Bing Webmaster. */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || 'a48df6c167094534b369300a89f8f530';

export const INDEXNOW_KEY_URL = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_API = 'https://api.indexnow.org/indexnow';
export const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
export const LLMS_URL = `${SITE_ORIGIN}/llms.txt`;
