import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-4 w-4" />;
    }
    return resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Sun className="mr-2 h-4 w-4" />
          {t('theme.light')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Moon className="mr-2 h-4 w-4" />
          {t('theme.dark')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Monitor className="mr-2 h-4 w-4" />
          {t('theme.system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
