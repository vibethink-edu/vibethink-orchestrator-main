
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';

interface TooltipWrapperProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delayDuration?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable tooltip wrapper component that ensures consistent
 * tooltip behavior across the application
 */
export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  children,
  content,
  side = 'top',
  delayDuration = 300,
  disabled = false,
  className
}) => {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className={`z-50 max-w-xs ${className || ''}`}
        >
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
