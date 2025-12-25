/**
 * Server-side i18n initialization
 * 
 * CAPA 3A: UI Strings con react-i18next
 * Lee locale de cookie NEXT_LOCALE (NO de URL)
 */

import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { cookies } from 'next/headers';
import { SUPPORTED_LOCALES, type Locale } from '@vibethink/utils';
import { isValidLocale } from './config';

const defaultLocale: Locale = 'en';
const locales = SUPPORTED_LOCALES;

/**
 * Init i18next para Server Components
 * 
 * Resuelve blink: HTML ya incluye traducciones
 */
export async function initI18nServer(ns: string[] = ['common']) {
  // ✅ Leer de cookie (estructura actual)
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || defaultLocale;
  const finalLocale = isValidLocale(locale) ? locale : defaultLocale;

  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          // ✅ Path CORRECTO según estructura actual
          import(`@/lib/i18n/translations/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: finalLocale,
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      defaultNS: 'common',
      fallbackNS: 'common',
      ns,
      preload: [finalLocale], // ✅ Solo idioma activo (NO todos)
      
      react: {
        useSuspense: false,
      },
    });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    locale: finalLocale,
  };
}

