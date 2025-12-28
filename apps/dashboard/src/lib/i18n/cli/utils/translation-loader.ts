/**
 * Translation Loader
 * Loads all translation files for a given locale
 */

import fs from 'fs/promises';
import path from 'path';

const TRANSLATIONS_DIR = path.resolve(__dirname, '../../../i18n/translations');

export async function loadAllTranslations(
  locale: string = 'en'
): Promise<Record<string, any>> {
  const localePath = path.join(TRANSLATIONS_DIR, locale);

  try {
    const files = await fs.readdir(localePath);
    const translations: Record<string, any> = {};

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(localePath, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      const namespace = file.replace('.json', '');
      translations[namespace] = data;
    }

    return translations;
  } catch (error) {
    console.error(`Failed to load translations for locale ${locale}:`, error);
    return {};
  }
}

export async function addTranslation(
  locale: string,
  namespace: string,
  key: string,
  value: string
): Promise<void> {
  // TODO: Implement translation addition
  console.log(`Add translation: ${locale}/${namespace}/${key} = ${value}`);
}
