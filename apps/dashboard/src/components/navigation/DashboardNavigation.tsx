"use client";

/**
 * Dashboard Navigation Component - Enhanced AI Consensus
 * 
 * Navegación mejorada que implementa los principios del 
 * AI Consensus Framework para dashboards colaborativos.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Button } from '@vibethink/ui/components/button';
import { Badge } from '@vibethink/ui/components/badge';
import {
  BarChart3,
  Brain,
  GitBranch,
  Target,
  Zap,
  Settings,
  Home,
  Activity,
  Users,
  FileText,
  Layout
} from 'lucide-react';

const dashboardNavigation = [
  {
    title: "Default",
    href: "/default",
    icon: Layout,
    description: "Default dashboard (Bundui Reference)",
    badge: "New"
  },
  {
    title: "Overview",
    href: "/enhanced-dashboard",
    icon: Home,
    description: "Main dashboard overview"
  },
  {
    title: "AI Consensus",
    href: "/enhanced-dashboard/consensus",
    icon: Brain,
    description: "Multi-AI collaboration metrics"
  },
  {
    title: "Analytics",
    href: "/enhanced-dashboard/analytics",
    icon: BarChart3,
    description: "Performance analytics"
  },
  {
    title: "Workflow",
    href: "/enhanced-dashboard/workflow",
    icon: GitBranch,
    description: "AI workflow management"
  },
  {
    title: "Decisions",
    href: "/enhanced-dashboard/decisions",
    icon: Target,
    description: "Evidence-based decisions"
  },
  {
    title: "Team",
    href: "/enhanced-dashboard/team",
    icon: Users,
    description: "AI team collaboration"
  },
  {
    title: "Reports",
    href: "/enhanced-dashboard/reports",
    icon: FileText,
    description: "Consensus reports"
  },
  {
    title: "Settings",
    href: "/enhanced-dashboard/settings",
    icon: Settings,
    description: "Dashboard settings"
  }
];

const DashboardNavigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          AI Dashboard
        </h2>
        <div className="space-y-1">
          {dashboardNavigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-muted font-medium"
                  )}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {item.title}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;
