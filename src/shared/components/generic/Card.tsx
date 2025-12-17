import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface CardProps<T = any> {
  variant?: 'default' | 'metric' | 'team' | 'chat' | 'payment' | 'form';
  data?: T;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  renderHeader?: (data: T) => React.ReactNode;
  renderContent?: (data: T) => React.ReactNode;
  actions?: React.ReactNode;
}

const Card = <T,>({
  variant = 'default',
  data,
  title,
  subtitle,
  icon,
  children,
  className,
  headerClassName,
  contentClassName,
  renderHeader,
  renderContent,
  actions
}: CardProps<T>) => {
  const baseClasses = "bg-card text-card-foreground rounded-xl border";
  
  const variantClasses = {
    default: "p-6",
    metric: "p-6",
    team: "p-6",
    chat: "p-6",
    payment: "p-6",
    form: "p-6"
  };

  const headerClasses = cn(
    "flex items-center justify-between space-y-0 pb-2",
    headerClassName
  );

  const contentClasses = cn(
    "space-y-4",
    contentClassName
  );

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {(title || icon || renderHeader) && (
        <div className={headerClasses}>
          <div className="flex items-center gap-2">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            {title && (
              <div>
                <h3 className="text-sm font-medium">{title}</h3>
                {subtitle && (
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
      )}
      
      <div className={contentClasses}>
        {renderContent && data ? renderContent(data) : children}
      </div>
    </div>
  );
};

export default Card; 
