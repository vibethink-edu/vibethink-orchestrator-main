"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ icon: Icon, className = "h-4 w-4", children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // If children are provided, render them directly (for static icons)
  if (children) {
    if (!mounted) {
      return <div className={className} />;
    }
    return <>{children}</>;
  }

  // Return a placeholder with the same dimensions during SSR
  if (!mounted) {
    return <div className={className} />;
  }

  return <Icon className={className} />;
};


















