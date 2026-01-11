"use client";

import { useI18n } from '@/lib/i18n/context';
import { Button } from '@vibethink/ui/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@vibethink/ui/components/dropdown-menu';
import { Globe } from "@vibethink/ui/icons";

const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
] as const;

export function LanguageSwitcher() {
    const { locale, setLocale } = useI18n();

    const currentLanguage = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.nativeName}</span>
                    <span className="sm:hidden">{currentLanguage.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLocale(lang.code as any)}
                        className={`flex items-center gap-2 ${locale === lang.code ? 'bg-accent' : ''}`}
                    >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="flex flex-col">
                            <span className="font-medium">{lang.nativeName}</span>
                            <span className="text-xs text-muted-foreground">{lang.name}</span>
                        </div>
                        {locale === lang.code && (
                            <span className="ml-auto text-xs">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
