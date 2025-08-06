import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface LayoutProps {
  variant?: 'dashboard' | 'admin' | 'helpdesk' | 'login' | 'default';
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  variant = 'default',
  children,
  className,
  sidebar,
  header,
  footer
}) => {
  const baseClasses = "min-h-screen bg-background";
  
  const variantClasses = {
    dashboard: "grid grid-cols-1 lg:grid-cols-[auto_1fr]",
    admin: "grid grid-cols-1 lg:grid-cols-[auto_1fr]",
    helpdesk: "flex flex-col",
    login: "flex items-center justify-center",
    default: "flex flex-col"
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {header && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {header}
        </header>
      )}
      
      <div className="flex flex-1">
        {sidebar && (
          <aside className="hidden lg:block border-r bg-muted/40">
            {sidebar}
          </aside>
        )}
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      
      {footer && (
        <footer className="border-t bg-muted/40">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default Layout; 