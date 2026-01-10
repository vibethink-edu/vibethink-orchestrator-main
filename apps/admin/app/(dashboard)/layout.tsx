"use client";

import React from "react";
import { SidebarProvider, SidebarInset } from "@vibethink/ui/components/sidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";

/**
 * Layout for Admin Console (Internal Staff Only)
 * 
 * Based on Bundui Premium layout structure with:
 * - SidebarProvider + SidebarInset pattern
 * - Collapsible sidebar with navigation
 * - Header with breadcrumbs
 * - Muted background for content area
 * - Proper spacing and CSS variables
 */
export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider
            defaultOpen={true}
            cookieName="admin_sidebar_state"
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
            <AdminSidebar variant="inset" />
            <SidebarInset>
                <AdminHeader />
                <div className="bg-muted/50 flex flex-1 flex-col min-h-0">
                    <div className="@container/main p-[var(--content-padding)] xl:container xl:mx-auto flex-1">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
