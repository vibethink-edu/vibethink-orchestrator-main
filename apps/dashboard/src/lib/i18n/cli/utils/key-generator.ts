/**
 * Key Generator
 * Generates suggested i18n key options based on term
 */

export function generateKeyOptions(term: string, namespace: string): string[] {
  const normalized = term
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  const camelCase = term
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');

  const snakeCase = normalized;

  return [camelCase, snakeCase, term.toLowerCase().replace(/\s+/g, '_')];
}
