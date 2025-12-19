"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vibethink/ui';
import Link from 'next/link';
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

const orchestratorDashboards = [
  {
    name: 'CRM',
    href: '/dashboard-vibethink/crm',
    icon: Users,
    description: 'Customer relationship management - VibeThink adapted version ready for production',
    category: 'Business'
  },
  {
    name: 'Sales',
    href: '/dashboard-vibethink/sales',
    icon: TrendingUp,
    description: 'Sales dashboard - VibeThink adapted version ready for production',
    category: 'Business'
  },
  {
    name: 'E-commerce',
    href: '/dashboard-vibethink/ecommerce',
    icon: ShoppingCart,
    description: 'E-commerce dashboard - VibeThink adapted version ready for production',
    category: 'Business'
  },
  {
    name: 'Finance',
    href: '/dashboard-vibethink/finance',
    icon: DollarSign,
    description: 'Financial dashboard with budgets, expenses, and financial planning',
    category: 'Business'
  },
  {
    name: 'Project Management',
    href: '/dashboard-vibethink/project-management',
    icon: Briefcase,
    description: 'Project management with tasks, timelines, and team collaboration',
    category: 'Productivity'
  },
  {
    name: 'Tasks',
    href: '/dashboard-vibethink/tasks',
    icon: CheckSquare,
    description: 'Task management with to-do lists, priorities, and deadlines',
    category: 'Productivity'
  },
  {
    name: 'Calendar',
    href: '/dashboard-vibethink/calendar',
    icon: Calendar,
    description: 'Calendar application with events, scheduling, and reminders',
    category: 'Productivity'
  },
  {
    name: 'Mail',
    href: '/dashboard-vibethink/mail',
    icon: Mail,
    description: 'Email client with inbox, compose, and email management',
    category: 'Productivity'
  },
  {
    name: 'Notes',
    href: '/dashboard-vibethink/notes',
    icon: StickyNote,
    description: 'Note-taking application with rich text editing and organization',
    category: 'Productivity'
  },
  {
    name: 'File Manager',
    href: '/dashboard-vibethink/file-manager',
    icon: FolderOpen,
    description: 'File storage and management system with upload, organization, and sharing',
    category: 'Productivity'
  },
  {
    name: 'Website Analytics',
    href: '/dashboard-vibethink/website-analytics',
    icon: BarChart3,
    description: 'Website analytics dashboard with traffic data, user interactions, and performance metrics',
    category: 'Analytics'
  },
  {
    name: 'AI Chat',
    href: '/dashboard-vibethink/ai-chat',
    icon: Activity,
    description: 'AI-powered chat interface with multiple model support and conversation history',
    category: 'AI'
  },
  {
    name: 'POS System',
    href: '/dashboard-vibethink/pos-system',
    icon: ShoppingBag,
    description: 'Point of sale system for retail and restaurant management',
    category: 'Business'
  },
  {
    name: 'Crypto',
    href: '/dashboard-vibethink/crypto',
    icon: Bitcoin,
    description: 'Cryptocurrency portfolio tracker with trading, DeFi, and NFT management',
    category: 'Finance'
  }
];

const categories = [
  { name: 'Business', dashboards: orchestratorDashboards.filter(d => d.category === 'Business') },
  { name: 'Productivity', dashboards: orchestratorDashboards.filter(d => d.category === 'Productivity') },
  { name: 'Analytics', dashboards: orchestratorDashboards.filter(d => d.category === 'Analytics') },
  { name: 'AI', dashboards: orchestratorDashboards.filter(d => d.category === 'AI') },
  { name: 'Finance', dashboards: orchestratorDashboards.filter(d => d.category === 'Finance') }
].filter(cat => cat.dashboards.length > 0);

export default function DashboardVibeThinkIndex() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">VibeThink Orchestrator Mocks</h1>
        <p className="text-muted-foreground">
          Todos los mocks disponibles de VibeThink Orchestrator. Estos dashboards están adaptados al estilo VibeThink y listos para ser promovidos a módulos reales en la sección /dashboard.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category.name} className="space-y-4">
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
                        <span>View Dashboard</span>
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
