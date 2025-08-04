"use client";

import React from 'react';
import ShadcnStyleDashboard from '@/shared/components/bundui-premium/components/ShadcnStyleDashboard';

/**
 * Página del Dashboard estilo Shadcn UI Kit
 * 
 * Esta página implementa un dashboard completo que replica el diseño y funcionalidad
 * de la demo oficial de Shadcn UI Kit (https://shadcnuikit.com/dashboard/default)
 * usando los componentes premium de Bundui integrados en VibeThink.
 */
export default function ShadcnDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header del dashboard */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">VibeThink Dashboard</h1>
            <div className="h-6 w-px bg-border" />
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a
                href="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </a>
              <a
                href="/shadcn-dashboard"
                className="text-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </a>
              <a
                href="/premium"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Premium
              </a>
              <a
                href="/debug"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Debug
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 space-y-4 p-8 pt-6">
        <ShadcnStyleDashboard />
      </main>
    </div>
  );
}
