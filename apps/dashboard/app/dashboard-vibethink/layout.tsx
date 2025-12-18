"use client";

import React from "react";
import { SidebarProvider, SidebarInset } from '@vibethink/ui';
import { VibeThinkSidebar } from "@/components/vibethink-sidebar";
import { DashboardBadge } from "@/components/dashboard-badge";
import { SiteHeader } from "@/components/layout/header-bundui";

/**
 * Layout para todas las rutas bajo `/dashboard-vibethink/*`.
 *
 * - Usa `SidebarProvider` + `SidebarInset` (patrón Shadcn UI correcto)
 * - Sidebar dinámico con navegación a CRM, Sales, E-commerce
 * - Header con controles y badge "VibeThink Sandbox"
 * - Contenido de cada dashboard interno
 * - Estructura idéntica a Bundui Premium original
 */
export default function DashboardVibeThinkLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider 
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 14)",
          "--content-padding": "calc(var(--spacing) * 4)",
          "--content-margin": "calc(var(--spacing) * 1.5)",
          "--content-full-height":
            "calc(100vh - var(--header-height) - (var(--content-padding) * 2) - (var(--content-margin) * 2))"
        } as React.CSSProperties
      }
    >
      <VibeThinkSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex items-center gap-2 px-4 pt-2 pb-1 border-b bg-background">
          <DashboardBadge />
        </div>
        <div className="bg-muted/50 flex flex-1 flex-col">
          <div className="@container/main p-[var(--content-padding)] xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
