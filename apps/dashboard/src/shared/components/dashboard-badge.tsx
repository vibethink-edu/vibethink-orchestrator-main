"use client";

import { Badge } from '@vibethink/ui';
import { usePathname } from 'next/navigation';

export function DashboardBadge({ forceShow }: { forceShow?: boolean }) {
  const pathname = usePathname();
  
  // Determine badge text based on path
  const getBadgeText = () => {
    if (forceShow) {
      if (pathname?.includes('/dashboard-bundui')) {
        return 'Demo / Reference - Bundui Premium';
      }
      if (pathname?.includes('/dashboard-vibethink')) {
        return 'Demo / Reference - VibeThink';
      }
      return 'Demo / Reference';
    }
    
    if (pathname?.includes('/dashboard-bundui')) {
      return 'Bundui Premium';
    }
    if (pathname?.includes('/dashboard-vibethink')) {
      return 'VibeThink Sandbox';
    }
    
    return null;
  };

  const badgeText = getBadgeText();
  
  if (!badgeText) {
    return null;
  }

  return (
    <Badge variant="secondary" className="text-xs">
      {badgeText}
    </Badge>
  );
}

