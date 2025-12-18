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
    name: 'Analytics',
    href: '/dashboard-bundui/analytics',
    icon: BarChart3,
    description: 'Comprehensive analytics dashboard with sales, earnings, and campaign metrics',
    category: 'Analytics'
  },
  {
    name: 'Finance',
    href: '/dashboard-bundui/finance',
    icon: DollarSign,
    description: 'Financial dashboard with budgets, expenses, and financial planning',
    category: 'Business'
  },
  {
    name: 'Projects',
    href: '/dashboard-bundui/projects',
    icon: Briefcase,
    description: 'Project management with tasks, timelines, and team collaboration',
    category: 'Productivity'
  },
  {
    name: 'Tasks',
    href: '/dashboard-bundui/tasks',
    icon: CheckSquare,
    description: 'Task management with to-do lists, priorities, and deadlines',
    category: 'Productivity'
  },
  {
    name: 'Calendar',
    href: '/dashboard-bundui/calendar',
    icon: Calendar,
    description: 'Calendar application with events, scheduling, and reminders',
    category: 'Productivity'
  },
  {
    name: 'Mail',
    href: '/dashboard-bundui/mail',
    icon: Mail,
    description: 'Email client with inbox, compose, and email management',
    category: 'Productivity'
  },
  {
    name: 'Notes',
    href: '/dashboard-bundui/notes',
    icon: StickyNote,
    description: 'Note-taking application with rich text editing and organization',
    category: 'Productivity'
  },
  {
    name: 'File Manager',
    href: '/dashboard-bundui/file-manager',
    icon: FolderOpen,
    description: 'File storage and management system with upload, organization, and sharing',
    category: 'Productivity'
  },
  {
    name: 'Academy',
    href: '/dashboard-bundui/academy',
    icon: GraduationCap,
    description: 'Learning management system with courses, progress tracking, and student analytics',
    category: 'Education'
  },
  {
    name: 'AI Chat',
    href: '/dashboard-bundui/ai-chat',
    icon: Activity,
    description: 'AI-powered chat interface with multiple model support and conversation history',
    category: 'AI'
  },
  {
    name: 'POS System',
    href: '/dashboard-bundui/pos-system',
    icon: ShoppingBag,
    description: 'Point of sale system for retail and restaurant management',
    category: 'Business'
  },
  {
    name: 'Payment',
    href: '/dashboard-bundui/payment',
    icon: CreditCard,
    description: 'Payment processing dashboard with transactions and payment methods',
    category: 'Business'
  },
  {
    name: 'Crypto',
    href: '/dashboard-bundui/crypto',
    icon: Bitcoin,
    description: 'Cryptocurrency portfolio tracker with trading, DeFi, and NFT management',
    category: 'Finance'
  },
  {
    name: 'Hospital Management',
    href: '/dashboard-bundui/hospital-management',
    icon: Hospital,
    description: 'Hospital management system with patients, appointments, and medical records',
    category: 'Healthcare'
  },
  {
    name: 'Hotel',
    href: '/dashboard-bundui/hotel',
    icon: Building2,
    description: 'Hotel management dashboard with bookings, rooms, and guest management',
    category: 'Hospitality'
  },
  {
    name: 'Project List',
    href: '/dashboard-bundui/project-list',
    icon: FileText,
    description: 'Project list view with kanban boards and project organization',
    category: 'Productivity'
  }
];

const categories = [
  { name: 'Business', dashboards: orchestratorDashboards.filter(d => d.category === 'Business') },
  { name: 'Productivity', dashboards: orchestratorDashboards.filter(d => d.category === 'Productivity') },
  { name: 'Analytics', dashboards: orchestratorDashboards.filter(d => d.category === 'Analytics') },
  { name: 'AI', dashboards: orchestratorDashboards.filter(d => d.category === 'AI') },
  { name: 'Finance', dashboards: orchestratorDashboards.filter(d => d.category === 'Finance') },
  { name: 'Education', dashboards: orchestratorDashboards.filter(d => d.category === 'Education') },
  { name: 'Healthcare', dashboards: orchestratorDashboards.filter(d => d.category === 'Healthcare') },
  { name: 'Hospitality', dashboards: orchestratorDashboards.filter(d => d.category === 'Hospitality') }
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
