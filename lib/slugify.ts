/**
 * Converts a location name to a URL-safe slug.
 * Handles Spanish/Portuguese characters: ñ→n, á→a, ã→a, ç→c, etc.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // remove non-alphanumeric
    .trim()
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse consecutive hyphens
}

/**
 * Converts a slug back to a display-ready title-cased string.
 * "sao-paulo" → "Sao Paulo" (approximate — real name comes from DB)
 */
export function deslugify(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
