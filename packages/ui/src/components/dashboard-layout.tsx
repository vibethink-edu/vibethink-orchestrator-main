"use client";

import * as React from "react"
import { SidebarProvider, SidebarInset } from "./sidebar"
import { cn } from "../lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * DashboardLayout - Wrapper básico para dashboards
 * Reemplazo temporal de bundui-ui DashboardLayout
 */
function DashboardLayout({
  children,
  className
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <SidebarInset>
        <div className={cn("flex flex-1 flex-col", className)}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export { DashboardLayout }
export default DashboardLayout

