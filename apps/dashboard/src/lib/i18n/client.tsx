'use client';

/**
 * Client-side i18n provider
 * 
 * CAPA 3A: UI Strings
 * Hidrata con resources del servidor (NO blink)
 */

import { createInstance, Resource } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { ReactNode, useEffect, useState } from 'react';
import { type Locale } from '@vibethink/utils';

interface TranslationProviderProps {
  children: ReactNode;
  locale: Locale;
  resources?: Resource;
  namespaces?: string[];
}

export function TranslationProvider({
  children,
  locale,
  resources,
  namespaces = ['common'],
}: TranslationProviderProps) {
  const [i18nInstance, setI18nInstance] = useState<any>(null);

  useEffect(() => {
    const initI18n = async () => {
      const instance = createInstance();

      await instance
        .use(initReactI18next)
        .use(
          resourcesToBackend(
            (language: string, namespace: string) =>
              import(`@/lib/i18n/translations/${language}/${namespace}.json`)
          )
        )
        .init({
          lng: locale,
          fallbackLng: 'en',
          defaultNS: 'common',
          ns: namespaces,
          resources, // ✅ Hidrata con server resources (NO blink)
          
          react: {
            useSuspense: false,
          },
        });

      setI18nInstance(instance);
    };

    initI18n();
  }, [locale, resources, namespaces]);

  if (!i18nInstance) {
    return null; // O skeleton
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}

