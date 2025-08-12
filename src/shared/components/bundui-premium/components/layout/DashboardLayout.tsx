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
 * Layout básico para dashboard con sidebar, header y navegación
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
        <main className="p-4">
          {children}
        </main>
        <Toaster position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  );
} 