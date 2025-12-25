"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import {
  GraduationCap,
  MessageSquare,
  BarChart3,
  Calendar,
  Users,
  Bitcoin,
  ShoppingCart,
  FolderOpen,
  DollarSign,
  Hospital,
  Building2,
  Mail,
  StickyNote,
  CreditCard,
  ShoppingBag,
  FolderKanban,
  Briefcase,
  TrendingUp,
  CheckSquare
} from 'lucide-react';

// Dashboard configuration with translation keys
const dashboardsConfig = [
  {
    key: 'default',
    href: '/dashboard-bundui/default',
    icon: BarChart3,
    category: 'dashboards'
  },
  {
    key: 'academy',
    href: '/dashboard-bundui/academy',
    icon: GraduationCap,
    category: 'dashboards'
  },
  {
    key: 'analytics',
    href: '/dashboard-bundui/analytics',
    icon: BarChart3,
    category: 'dashboards'
  },
  {
    key: 'crm',
    href: '/dashboard-bundui/crm',
    icon: Users,
    category: 'dashboards'
  },
  {
    key: 'ecommerce',
    href: '/dashboard-bundui/ecommerce',
    icon: ShoppingCart,
    category: 'dashboards'
  },
  {
    key: 'hospitalManagement',
    href: '/dashboard-bundui/hospital-management',
    icon: Hospital,
    category: 'dashboards'
  },
  {
    key: 'hotel',
    href: '/dashboard-bundui/hotel',
    icon: Building2,
    category: 'dashboards'
  },
  {
    key: 'payment',
    href: '/dashboard-bundui/payment',
    icon: CreditCard,
    category: 'dashboards'
  },
  {
    key: 'projects',
    href: '/dashboard-bundui/projects',
    icon: Briefcase,
    category: 'dashboards'
  },
  {
    key: 'projectList',
    href: '/dashboard-bundui/project-list',
    icon: FolderKanban,
    category: 'dashboards'
  },
  {
    key: 'sales',
    href: '/dashboard-bundui/sales',
    icon: TrendingUp,
    category: 'dashboards'
  }
] as const;

const appsConfig = [
  {
    key: 'aiChat',
    href: '/dashboard-bundui/apps/chat',
    icon: MessageSquare,
    category: 'aiApps'
  }
] as const;

export default function DashboardBunduiIndex() {
  const { t } = useTranslation('dashboard-bundui');

  // Build dashboards with translations
  const dashboards = dashboardsConfig.map(config => ({
    ...config,
    name: t(`dashboards.${config.key}.name`),
    description: t(`dashboards.${config.key}.description`)
  }));

  // Build apps with translations
  const apps = appsConfig.map(config => ({
    ...config,
    name: t(`apps.${config.key}.name`),
    description: t(`apps.${config.key}.description`)
  }));

  // Build categories with translations
  const categories = [
    { 
      key: 'dashboards',
      name: t('categories.dashboards'), 
      items: dashboards 
    },
    { 
      key: 'aiApps',
      name: t('categories.aiApps'), 
      items: apps 
    }
  ].filter(category => category.items.length > 0);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{t('page.title')}</h1>
        <p className="text-muted-foreground">
          {t('page.description')}
        </p>
      </div>

      {categories.map((category) => (
        <div key={category.key} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </div>
                      <CardDescription className="mt-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{t('page.viewDashboard')}</span>
                        <span>→</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}




