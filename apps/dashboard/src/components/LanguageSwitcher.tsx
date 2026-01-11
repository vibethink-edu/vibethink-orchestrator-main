'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SUPPORTED_LOCALES, type Locale } from '@vibethink/utils';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function changeLanguage(newLocale: string) {
    startTransition(() => {
      // ✅ Actualizar cookie (NO URL)
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

      // ✅ Reload para aplicar (mantiene ruta actual)
      router.refresh();
    });
  }

  const localeNames: Record<Locale, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    pt: 'Português',
    de: 'Deutsch',
    it: 'Italiano',
    ko: '한국어',
    ar: 'العربية',
    zh: '中文',
    he: 'עברית',
    fa: 'فارسی',
    ur: 'اردو',
  };

  return (
    <select
      value={currentLocale}
      onChange={(e) => changeLanguage(e.target.value)}
      disabled={isPending}
      className="border rounded px-2 py-1"
    >
      {SUPPORTED_LOCALES.map((locale) => (
        <option key={locale} value={locale}>
          {localeNames[locale]}
        </option>
      ))}
    </select>
  );
}

