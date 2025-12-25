"use client";

import React from "react";
import { SidebarProvider, SidebarInset } from "@vibethink/ui/components/sidebar";
import { AppSidebar } from "@/shared/components/bundui-premium/components/layout/sidebar-bundui/app-sidebar";
import { DashboardBadge } from "@/shared/components/dashboard-badge";
import { SiteHeader } from "@/shared/components/bundui-premium/components/layout/header-bundui";
import { Footer } from "@/components/layout/footer";

/**
 * Layout para todas las rutas bajo `/dashboard-bundui/*`.
 *
 * - Usa `SidebarProvider` + `SidebarInset` (patrón Shadcn UI correcto)
 * - Sidebar completo de Bundui Premium con toda la navegación
 * - Header con controles y badge "Bundui Premium"
 * - Contenido 1:1 con Bundui Premium mocks
 * - Estructura idéntica a Bundui Premium original
 */
export default function DashboardBunduiLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      defaultOpen={true}
      cookieName="bundui_sidebar_state"
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
      <AppSidebar variant="inset" />
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
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
