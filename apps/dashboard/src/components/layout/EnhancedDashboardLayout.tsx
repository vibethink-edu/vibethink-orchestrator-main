"use client";

/**
 * Enhanced Dashboard Layout - AI Consensus Framework
 * 
 * Layout mejorado que soluciona los problemas del layout push
 * e integra completamente el BunduiCompleteLayout con 
 * funcionalidades específicas del AI Consensus Framework.
 */

import React from 'react';
import { SidebarProvider } from '@vibethink/ui/components/sidebar';
import DashboardSidebar from '@/components/sidebar/DashboardSidebar';
import DashboardHeader from '@/components/header/DashboardHeader';

interface EnhancedDashboardLayoutProps {
  children: React.ReactNode;
}

const EnhancedDashboardLayout: React.FC<EnhancedDashboardLayoutProps> = ({
  children
}) => {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <DashboardHeader />

          {/* Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EnhancedDashboardLayout;
