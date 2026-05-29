/** Normalize unicode fractions and special chars for JSON-LD text fields. */
export function normalizeRecipeText(text: string): string {
  return text
    .replace(/½/g, '1/2')
    .replace(/¼/g, '1/4')
    .replace(/¾/g, '3/4')
    .replace(/⅓/g, '1/3')
    .replace(/⅔/g, '2/3')
    .replace(/⅛/g, '1/8')
    .replace(/⅜/g, '3/8')
    .replace(/⅝/g, '5/8')
    .replace(/⅞/g, '7/8')
    .replace(/-/g, '-')
    .replace(/, /g, '-')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/"/g, '"');
}

export function normalizeRecipeStrings(items: string[]): string[] {
  return items.map(normalizeRecipeText);
}
