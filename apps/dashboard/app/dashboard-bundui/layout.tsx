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
 * - RTL support: sidebar and layout adapt to RTL languages (Arabic, Hebrew, etc.)
 */
export default function DashboardBunduiLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Detect RTL from document direction
  // Initialize with current dir to avoid flash
  const [isRTL, setIsRTL] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.getAttribute('dir') === 'rtl';
    }
    return false;
  });

  React.useEffect(() => {
    // Initial check (in case state initialization didn't capture it)
    const direction = document.documentElement.getAttribute('dir');
    console.log('[Layout] Initial dir check:', direction, 'isRTL:', isRTL);

    if ((direction === 'rtl') !== isRTL) {
      console.log('[Layout] Updating isRTL to:', direction === 'rtl');
      setIsRTL(direction === 'rtl');
    }

    // Watch for dir attribute changes (when locale changes dynamically)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
          const newDir = document.documentElement.getAttribute('dir');
          console.log('[Layout] 🔄 RTL direction changed:', newDir, '→ isRTL will be:', newDir === 'rtl');
          setIsRTL(newDir === 'rtl');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir']
    });

    return () => observer.disconnect();
  }, [isRTL]);

  // Log whenever isRTL changes
  React.useEffect(() => {
    console.log('[Layout] 📍 Sidebar side prop will be:', isRTL ? 'RIGHT' : 'LEFT');
  }, [isRTL]);

  return (
    <SidebarProvider
      key={`sidebar-${isRTL ? 'rtl' : 'ltr'}`}
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
      <AppSidebar key={`app-sidebar-${isRTL ? 'rtl' : 'ltr'}`} variant="inset" side={isRTL ? "right" : "left"} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex items-center gap-2 px-4 pt-2 pb-1 border-b bg-background">
          <DashboardBadge />
        </div>
        <div className="bg-muted/50 flex flex-1 flex-col min-h-0">
          <div className="@container/main p-[var(--content-padding)] xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto flex-1">
            {children}
          </div>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
