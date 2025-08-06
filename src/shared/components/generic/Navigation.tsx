"use client";

import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
}

export interface NavigationProps {
  variant?: 'sidebar' | 'header' | 'breadcrumb' | 'tabs' | 'pagination';
  items: NavigationItem[];
  className?: string;
  itemClassName?: string;
  activeItem?: string;
  onItemClick?: (item: NavigationItem) => void;
  showIcons?: boolean;
  showBadges?: boolean;
  collapsed?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  variant = 'sidebar',
  items,
  className,
  itemClassName,
  activeItem,
  onItemClick,
  showIcons = true,
  showBadges = true,
  collapsed = false
}) => {
  const renderItem = (item: NavigationItem, level: number = 0) => {
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;
    
    const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-md transition-colors";
    const activeClasses = isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted";
    const disabledClasses = item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
    
    const itemClasses = cn(
      baseClasses,
      activeClasses,
      disabledClasses,
      itemClassName
    );

    const handleClick = () => {
      if (!item.disabled && onItemClick) {
        onItemClick(item);
      }
    };

    return (
      <div key={item.id} className={cn("relative", level > 0 && "ml-4")}>
        <div
          className={itemClasses}
          onClick={handleClick}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          {showIcons && item.icon && (
            <span className="flex-shrink-0">
              {item.icon}
            </span>
          )}
          
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              
              {showBadges && item.badge && (
                <span className="flex-shrink-0 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
        
        {hasChildren && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const containerClasses = cn(
    "w-full",
    {
      'space-y-1': variant === 'sidebar',
      'flex items-center space-x-1': variant === 'header',
      'flex items-center space-x-2 text-sm': variant === 'breadcrumb',
      'flex border-b': variant === 'tabs',
      'flex items-center justify-center space-x-1': variant === 'pagination'
    },
    className
  );

  return (
    <nav className={containerClasses}>
      {items.map(item => renderItem(item))}
    </nav>
  );
};

export default Navigation; 