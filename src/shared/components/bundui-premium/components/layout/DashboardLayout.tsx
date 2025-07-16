"use client";

import React from "react";
import { SidebarInset, SidebarProvider } from "@/shared/components/bundui-premium/components/ui/sidebar";
import Sidebar from "@/shared/components/bundui-premium/components/layout/sidebar";
import Header from "@/shared/components/bundui-premium/components/layout/header/index";
import { Toaster } from "@/shared/components/bundui-premium/components/ui/sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/**
 * Layout completo para dashboard con sidebar, header y navegación
 * Basado en el layout original de Bundui Premium
 */
export default function DashboardLayout({ 
  children, 
  defaultOpen = true 
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar />
      <SidebarInset>
        <Header />
        <div className="@container/main p-4 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto xl:group-data-[theme-content-layout=centered]/layout:mt-8">
          {children}
        </div>
        <Toaster position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  );
} 