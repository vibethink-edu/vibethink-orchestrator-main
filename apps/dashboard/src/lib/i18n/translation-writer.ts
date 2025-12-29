/**
 * Translation Writer - Writes translations to JSON files
 *
 * Writes to: apps/dashboard/src/lib/i18n/translations/{locale}/{namespace}.json
 *
 * Features:
 * - Supports nested keys with dots (projects.table.selectAll)
 * - Creates namespace file if it doesn't exist
 * - Prevents overwriting existing keys
 * - Maintains JSON formatting: UTF-8, LF, 2 spaces, no trailing commas
 * - Preserves insertion order (no key sorting)
 */

import fs from 'fs';
import path from 'path';

export interface AddTranslationOptions {
  locale: string;
  namespace: string;
  key: string;
  value: string;
  overwrite?: boolean;
}

export interface AddTranslationResult {
  success: boolean;
  message: string;
  filePath?: string;
  conflict?: boolean;
}

const TRANSLATIONS_DIR = path.join(process.cwd(), 'apps/dashboard/src/lib/i18n/translations');

/**
 * Set a nested value in an object using dot notation
 */
function setNestedValue(obj: any, keyPath: string, value: string): boolean {
  const keys = keyPath.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!(key in current)) {
      current[key] = {};
    } else if (typeof current[key] !== 'object') {
      // Path conflict: intermediate key exists as a value
      return false;
    }

    current = current[key];
  }

  const lastKey = keys[keys.length - 1];

  // Check if key already exists
  if (lastKey in current) {
    return false; // Conflict
  }

  current[lastKey] = value;
  return true;
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj: any, keyPath: string): any {
  const keys = keyPath.split('.');
  let current = obj;

  for (const key of keys) {
    if (!(key in current)) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Format JSON with proper conventions
 * - 2 spaces indentation
 * - LF line endings
 * - UTF-8 encoding
 * - No trailing comma
 */
function formatJson(obj: any): string {
  return JSON.stringify(obj, null, 2) + '\n';
}

/**
 * Add a translation to a namespace file
 *
 * @param options - Translation options
 * @returns Result with success status and message
 */
export function addTranslation(options: AddTranslationOptions): AddTranslationResult {
  const { locale, namespace, key, value, overwrite = false } = options;

  // Validate inputs
  if (!locale || !namespace || !key || !value) {
    return {
      success: false,
      message: 'Missing required parameters: locale, namespace, key, value'
    };
  }

  const localeDir = path.join(TRANSLATIONS_DIR, locale);
  const filePath = path.join(localeDir, `${namespace}.json`);

  // Ensure locale directory exists
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
  }

  // Load existing translations or create empty object
  let translations: any = {};

  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      translations = JSON.parse(content);
    } catch (error) {
      return {
        success: false,
        message: `Failed to parse existing file: ${filePath}`,
        filePath
      };
    }
  }

  // Check if key already exists
  const existingValue = getNestedValue(translations, key);

  if (existingValue !== undefined && !overwrite) {
    return {
      success: false,
      message: `Key already exists: ${key} = "${existingValue}"`,
      filePath,
      conflict: true
    };
  }

  // Add the translation
  const success = setNestedValue(translations, key, value);

  if (!success && !overwrite) {
    return {
      success: false,
      message: `Path conflict: Cannot set ${key} (intermediate key exists as value)`,
      filePath,
      conflict: true
    };
  }

  // If overwrite is true, force set the value
  if (overwrite) {
    const keys = key.split('.');
    let current = translations;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = value;
  }

  // Write to file
  try {
    const formatted = formatJson(translations);
    fs.writeFileSync(filePath, formatted, { encoding: 'utf-8' });

    return {
      success: true,
      message: `Translation added successfully: ${locale}/${namespace}.json :: ${key}`,
      filePath
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to write file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      filePath
    };
  }
}

/**
 * Add multiple translations at once
 */
export function addTranslations(
  translations: Array<Omit<AddTranslationOptions, 'locale' | 'namespace'> & { locale: string; namespace: string }>
): AddTranslationResult[] {
  return translations.map(trans => addTranslation(trans));
}

/**
 * Check if a translation key exists
 */
export function hasTranslation(locale: string, namespace: string, key: string): boolean {
  const filePath = path.join(TRANSLATIONS_DIR, locale, `${namespace}.json`);

  if (!fs.existsSync(filePath)) {
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(content);
    return getNestedValue(translations, key) !== undefined;
  } catch {
    return false;
  }
}
