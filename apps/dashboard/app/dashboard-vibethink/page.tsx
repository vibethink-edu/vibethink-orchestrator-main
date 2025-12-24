"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vibethink/ui';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  GraduationCap, 
  BarChart3, 
  Calendar, 
  Bitcoin, 
  FolderOpen, 
  DollarSign, 
  Hospital, 
  Building2, 
  Mail, 
  StickyNote, 
  CreditCard, 
  ShoppingBag, 
  Briefcase, 
  CheckSquare,
  FileText,
  Activity
} from 'lucide-react';

// Dashboard configuration with translation keys
const orchestratorDashboardsConfig = [
  {
    key: 'crm',
    href: '/dashboard-vibethink/crm',
    icon: Users,
    category: 'business'
  },
  {
    key: 'sales',
    href: '/dashboard-vibethink/sales',
    icon: TrendingUp,
    category: 'business'
  },
  {
    key: 'ecommerce',
    href: '/dashboard-vibethink/ecommerce',
    icon: ShoppingCart,
    category: 'business'
  },
  {
    key: 'finance',
    href: '/dashboard-vibethink/finance',
    icon: DollarSign,
    category: 'business'
  },
  {
    key: 'projectManagement',
    href: '/dashboard-vibethink/project-management',
    icon: Briefcase,
    category: 'productivity'
  },
  {
    key: 'tasks',
    href: '/dashboard-vibethink/tasks',
    icon: CheckSquare,
    category: 'productivity'
  },
  {
    key: 'calendar',
    href: '/dashboard-vibethink/calendar',
    icon: Calendar,
    category: 'productivity'
  },
  {
    key: 'mail',
    href: '/dashboard-vibethink/mail',
    icon: Mail,
    category: 'productivity'
  },
  {
    key: 'notes',
    href: '/dashboard-vibethink/notes',
    icon: StickyNote,
    category: 'productivity'
  },
  {
    key: 'fileManager',
    href: '/dashboard-vibethink/file-manager',
    icon: FolderOpen,
    category: 'productivity'
  },
  {
    key: 'websiteAnalytics',
    href: '/dashboard-vibethink/website-analytics',
    icon: BarChart3,
    category: 'analytics'
  },
  {
    key: 'aiChat',
    href: '/dashboard-vibethink/ai-chat',
    icon: Activity,
    category: 'ai'
  },
  {
    key: 'posSystem',
    href: '/dashboard-vibethink/pos-system',
    icon: ShoppingBag,
    category: 'business'
  },
  {
    key: 'crypto',
    href: '/dashboard-vibethink/crypto',
    icon: Bitcoin,
    category: 'finance'
  }
] as const;

const categoryKeys = ['business', 'productivity', 'analytics', 'ai', 'finance'] as const;

export default function DashboardVibeThinkIndex() {
  const { t } = useTranslation('dashboard-vibethink');

  // Build dashboards with translations
  const orchestratorDashboards = orchestratorDashboardsConfig.map(config => ({
    ...config,
    name: t(`dashboards.${config.key}.name`),
    description: t(`dashboards.${config.key}.description`),
    categoryLabel: t(`categories.${config.category}`)
  }));

  // Build categories with translations
  const categories = categoryKeys
    .map(categoryKey => ({
      key: categoryKey,
      name: t(`categories.${categoryKey}`),
      dashboards: orchestratorDashboards.filter(d => d.category === categoryKey)
    }))
    .filter(cat => cat.dashboards.length > 0);

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
            {category.dashboards.map((dashboard) => {
              const Icon = dashboard.icon;
              return (
                <Link key={dashboard.href} href={dashboard.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                      </div>
                      <CardDescription className="mt-2">
                        {dashboard.description}
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
