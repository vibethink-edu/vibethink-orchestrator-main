"use client";

import React from "react";
import { SidebarProvider, SidebarInset } from "@vibethink/ui/components/sidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";

/**
 * Layout for Admin Console (Internal Staff Only)
 * 
 * Based on Bundui Premium layout structure:
 * - SidebarProvider + SidebarInset pattern
 * - Collapsible sidebar with navigation
 * - Header with breadcrumbs
 * - Clean, professional design for operations
 */
export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider
            defaultOpen={true}
            style={
                {
                    "--sidebar-width": "16rem",
                    "--header-height": "3.5rem",
                } as React.CSSProperties
            }
        >
            <AdminSidebar variant="inset" />
            <SidebarInset>
                <AdminHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
