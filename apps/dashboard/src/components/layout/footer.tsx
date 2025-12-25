'use client';

/**
 * Footer Component
 * 
 * Footer global para todas las aplicaciones del dashboard.
 * Muestra la versión de la aplicación como referencia visual.
 */

import { APP_VERSION } from '@/lib/version';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="w-full px-6 flex flex-col items-center justify-between gap-4 py-6 md:flex-row md:py-4">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground md:flex-row md:gap-4 md:text-left">
          <span>&copy; {currentYear} VibeThink Orchestrator</span>
          <span className="hidden md:inline">|</span>
          <span className="font-medium text-foreground">{APP_VERSION}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}

