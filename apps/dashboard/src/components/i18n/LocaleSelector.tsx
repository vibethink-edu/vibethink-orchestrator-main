/**
 * Locale Selector Component
 * 
 * Component for switching between available locales
 */

'use client';

import { Button } from '@vibethink/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@vibethink/ui';
import { useI18n, localeMetadata, AVAILABLE_LOCALES } from '@/lib/i18n';
import { Globe } from 'lucide-react';

/**
 * LocaleSelector Component
 */
export function LocaleSelector() {
  const { locale, setLocale } = useI18n();
  const currentLocale = localeMetadata[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLocale.flag}</span>
          <span className="hidden md:inline">{currentLocale.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {AVAILABLE_LOCALES.map((loc) => {
          const meta = localeMetadata[loc];
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => setLocale(loc)}
              className={locale === loc ? 'bg-accent' : ''}
            >
              <span className="mr-2">{meta.flag}</span>
              <span>{meta.nativeName}</span>
              {locale === loc && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

