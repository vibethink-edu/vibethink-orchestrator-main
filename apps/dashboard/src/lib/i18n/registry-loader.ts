/**
 * Registry Loader - Loads terminology from concept*.json files
 *
 * Loads terms from:
 * - concept.json (base)
 * - concept-hotel.json (Hotel overrides)
 * - concept-studio.json (Studio overrides)
 * - concept-cowork.json (Cowork overrides)
 * - concept-coliving.json (Coliving overrides)
 *
 * NO part of packages/terminology (not implemented yet)
 * Temporary solution until packages/terminology is created
 */

import fs from 'fs';
import path from 'path';

export interface TermEntry {
  key: string;
  label: string;
  plural?: string;
  description?: string;
  synonyms?: string[];
  gender?: 'm' | 'f' | 'n';
  context?: string; // hotel, studio, cowork, coliving
}

export interface RegistryLoadOptions {
  locale?: string;
  includeOverrides?: boolean;
}

const TRANSLATIONS_DIR = path.join(process.cwd(), 'apps/dashboard/src/lib/i18n/translations');

/**
 * Flatten nested concept structure to flat key-value pairs
 */
function flattenConcepts(obj: any, prefix: string = 'concept'): Map<string, any> {
  const result = new Map<string, any>();

  function recurse(current: any, currentPrefix: string) {
    if (typeof current === 'object' && current !== null) {
      for (const [key, value] of Object.entries(current)) {
        const newPrefix = `${currentPrefix}.${key}`;

        if (typeof value === 'string') {
          // Leaf node - this is a term
          result.set(newPrefix, {
            key: newPrefix,
            label: value,
            description: `Term from ${currentPrefix}`
          });
        } else if (typeof value === 'object' && value !== null) {
          // Check if this is a term object with metadata
          if ('label' in value || 'plural' in value) {
            result.set(newPrefix, {
              key: newPrefix,
              ...value
            });
          } else {
            // Continue recursing
            recurse(value, newPrefix);
          }
        }
      }
    }
  }

  recurse(obj, prefix);
  return result;
}

/**
 * Load concepts from a single JSON file
 */
function loadConceptFile(filePath: string, context?: string): Map<string, TermEntry> {
  if (!fs.existsSync(filePath)) {
    return new Map();
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const flattened = flattenConcepts(data);

    // Add context if provided
    if (context) {
      flattened.forEach((value, key) => {
        value.context = context;
      });
    }

    return flattened;
  } catch (error) {
    console.warn(`Failed to load concept file: ${filePath}`, error);
    return new Map();
  }
}

/**
 * Load terminology registry from concept*.json files
 *
 * @param options - Load options
 * @returns Array of term entries
 */
export function loadRegistry(options: RegistryLoadOptions = {}): TermEntry[] {
  const locale = options.locale || 'en';
  const includeOverrides = options.includeOverrides ?? true;

  const localeDir = path.join(TRANSLATIONS_DIR, locale);

  if (!fs.existsSync(localeDir)) {
    throw new Error(`Locale directory not found: ${locale}`);
  }

  // Load base concepts
  const basePath = path.join(localeDir, 'concept.json');
  const allTerms = loadConceptFile(basePath);

  // Load overrides if requested
  if (includeOverrides) {
    const overrides = [
      { file: 'concept-hotel.json', context: 'hotel' },
      { file: 'concept-studio.json', context: 'studio' },
      { file: 'concept-cowork.json', context: 'cowork' },
      { file: 'concept-coliving.json', context: 'coliving' }
    ];

    for (const override of overrides) {
      const overridePath = path.join(localeDir, override.file);
      const overrideTerms = loadConceptFile(overridePath, override.context);

      // Merge overrides (they win over base)
      overrideTerms.forEach((value, key) => {
        allTerms.set(key, value);
      });
    }
  }

  return Array.from(allTerms.values());
}

/**
 * Find a term by key
 */
export function findTerm(key: string, options: RegistryLoadOptions = {}): TermEntry | undefined {
  const registry = loadRegistry(options);
  return registry.find(term => term.key === key);
}

/**
 * Search terms by label (case-insensitive)
 */
export function searchTerms(query: string, options: RegistryLoadOptions = {}): TermEntry[] {
  const registry = loadRegistry(options);
  const lowerQuery = query.toLowerCase();

  return registry.filter(term =>
    term.label.toLowerCase().includes(lowerQuery) ||
    term.key.toLowerCase().includes(lowerQuery) ||
    term.synonyms?.some(syn => syn.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all terms for a specific context
 */
export function getTermsByContext(context: string, options: RegistryLoadOptions = {}): TermEntry[] {
  const registry = loadRegistry(options);
  return registry.filter(term => term.context === context);
}
