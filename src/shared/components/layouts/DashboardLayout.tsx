import React from 'react';
import { cn } from '@/lib/utils';

/**
 * @component DashboardLayout
 * @description Layout modular de 3 paneles para dashboards empresariales
 * @example
 * <DashboardLayout
 *   sidebar={<UserManagementSidebar />}
 *   mainContent={<CompaniesManager />}
 *   rightPanel={<SupportPanel />}
 * />
 */
interface DashboardLayoutProps {
  sidebar?: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel?: React.ReactNode;
  className?: string;
  showRightPanel?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebar,
  mainContent,
  rightPanel,
  className,
  showRightPanel = true
}) => {
  return (
    <div className={cn(
      "flex h-screen bg-background",
      className
    )}>
      {/* Sidebar - Panel Izquierdo */}
      {sidebar && (
        <aside className="w-64 border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="flex h-full flex-col">
            {sidebar}
          </div>
        </aside>
      )}

      {/* Contenido Principal - Panel Central */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {mainContent}
        </div>
      </main>

      {/* Panel Derecho - Opcional */}
      {showRightPanel && rightPanel && (
        <aside className="w-80 border-l bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="flex h-full flex-col">
            {rightPanel}
          </div>
        </aside>
      )}
    </div>
  );
};

/**
 * @component DashboardHeader
 * @description Header del dashboard con métricas y navegación
 */
interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  children,
  className
}) => {
  return (
    <header className={cn(
      "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="flex h-16 items-center px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-4">
            {children}
          </div>
        )}
      </div>
    </header>
  );
};

/**
 * @component DashboardContent
 * @description Contenedor para el contenido principal del dashboard
 */
interface DashboardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      "flex-1 space-y-4 p-6 pt-6",
      className
    )}>
      {children}
    </div>
  );
};

/**
 * @component DashboardSidebar
 * @description Sidebar con navegación y controles
 */
interface DashboardSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col gap-2 p-4",
      className
    )}>
      {children}
    </div>
  );
};

/**
 * @component DashboardRightPanel
 * @description Panel derecho para información adicional
 */
interface DashboardRightPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardRightPanel: React.FC<DashboardRightPanelProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col gap-4 p-4",
      className
    )}>
      {children}
    </div>
  );
}; 