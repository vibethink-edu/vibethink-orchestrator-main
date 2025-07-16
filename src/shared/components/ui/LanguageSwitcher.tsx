/**
 * Language Switcher Component
 * 
 * Componente optimizado para cambio de idioma con mejor UX
 * Soporte para español e inglés con indicadores visuales claros
 * 
 * @author AI Pair Platform - UI Team
 * @version 2.0.0
 */

import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useLanguage } from '@/shared/hooks/useLanguage';

const LanguageSwitcher = () => {
  const { 
    currentLanguage, 
    availableLanguages, 
    switchLanguage, 
    isChanging,
    currentLanguageInfo 
  } = useLanguage();

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode !== currentLanguage && !isChanging) {
      await switchLanguage(languageCode);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
          disabled={isChanging}
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{currentLanguageInfo.flag}</span>
          <span className="hidden md:inline ml-1">{currentLanguageInfo.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        {availableLanguages.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`text-muted-foreground hover:text-foreground hover:bg-accent ${
              currentLanguage === language.code ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.nativeName}</span>
            {currentLanguage === language.code && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
