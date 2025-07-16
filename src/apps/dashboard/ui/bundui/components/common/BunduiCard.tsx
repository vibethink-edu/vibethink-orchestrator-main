import React from 'react';
import { cn } from '@/lib/utils';

interface BunduiCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

export const BunduiCard: React.FC<BunduiCardProps> = ({
  children,
  className,
  variant = 'default'
}) => {
  const baseClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  
  const variantClasses = {
    default: 'border-border',
    outlined: 'border-2 border-border',
    elevated: 'border-border shadow-lg'
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
};

interface BunduiCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const BunduiCardHeader: React.FC<BunduiCardHeaderProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  );
};

interface BunduiCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const BunduiCardTitle: React.FC<BunduiCardTitleProps> = ({
  children,
  className
}) => {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  );
};

interface BunduiCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const BunduiCardDescription: React.FC<BunduiCardDescriptionProps> = ({
  children,
  className
}) => {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
};

interface BunduiCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const BunduiCardContent: React.FC<BunduiCardContentProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
};

interface BunduiCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const BunduiCardFooter: React.FC<BunduiCardFooterProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)}>
      {children}
    </div>
  );
}; 