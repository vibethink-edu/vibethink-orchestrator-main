"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vibethink/ui';
import Link from 'next/link';
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

const dashboards = [
  {
    name: 'Default',
    href: '/dashboard-bundui/default',
    icon: BarChart3,
    description: 'Main landing dashboard with overview of key metrics, team members, and revenue tracking',
    category: 'Dashboards'
  },
  {
    name: 'Academy',
    href: '/dashboard-bundui/academy',
    icon: GraduationCap,
    description: 'Learning management system with courses, progress tracking, and student analytics',
    category: 'Dashboards'
  },
  {
    name: 'Analytics',
    href: '/dashboard-bundui/analytics',
    icon: BarChart3,
    description: 'Comprehensive analytics dashboard with sales, earnings, and campaign metrics',
    category: 'Dashboards'
  },
  {
    name: 'Website Analytics',
    href: '/dashboard-bundui/website-analytics',
    icon: BarChart3,
    description: 'Website analytics dashboard with traffic data, user interactions, and performance metrics',
    category: 'Dashboards'
  },
  {
    name: 'Website Analytics',
    href: '/dashboard-bundui/website-analytics',
    icon: BarChart3,
    description: 'Website traffic analytics with conversion rates, visitor metrics, and campaign performance',
    category: 'Dashboards'
  },
  {
    name: 'CRM',
    href: '/dashboard-bundui/crm',
    icon: Users,
    description: 'Customer relationship management with deals, customers, and sales pipeline',
    category: 'Dashboards'
  },
  {
    name: 'Crypto',
    href: '/dashboard-bundui/crypto',
    icon: Bitcoin,
    description: 'Cryptocurrency portfolio tracker with trading, DeFi, and NFT management',
    category: 'Dashboards'
  },
  {
    name: 'E-commerce',
    href: '/dashboard-bundui/ecommerce',
    icon: ShoppingCart,
    description: 'E-commerce dashboard with products, orders, and sales analytics',
    category: 'Dashboards'
  },
  {
    name: 'File Manager',
    href: '/dashboard-bundui/file-manager',
    icon: FolderOpen,
    description: 'File storage and management system with upload, organization, and sharing',
    category: 'Dashboards'
  },
  {
    name: 'Finance',
    href: '/dashboard-bundui/finance',
    icon: DollarSign,
    description: 'Financial dashboard with budgets, expenses, and financial planning',
    category: 'Dashboards'
  },
  {
    name: 'Hospital Management',
    href: '/dashboard-bundui/hospital-management',
    icon: Hospital,
    description: 'Hospital management system with patients, appointments, and medical records',
    category: 'Dashboards'
  },
  {
    name: 'Hotel',
    href: '/dashboard-bundui/hotel',
    icon: Building2,
    description: 'Hotel management dashboard with bookings, rooms, and guest management',
    category: 'Dashboards'
  },
  {
    name: 'Payment',
    href: '/dashboard-bundui/payment',
    icon: CreditCard,
    description: 'Payment processing dashboard with transactions and payment methods',
    category: 'Dashboards'
  },
  {
    name: 'Projects',
    href: '/dashboard-bundui/projects',
    icon: Briefcase,
    description: 'Project management with tasks, timelines, and team collaboration',
    category: 'Dashboards'
  },
  {
    name: 'Project Management',
    href: '/dashboard-bundui/project-management',
    icon: Briefcase,
    description: 'Comprehensive project management with tasks, timelines, and team collaboration',
    category: 'Dashboards'
  },
  {
    name: 'Project List',
    href: '/dashboard-bundui/project-list',
    icon: FolderKanban,
    description: 'Project list view with kanban boards and project organization',
    category: 'Dashboards'
  },
  {
    name: 'Sales',
    href: '/dashboard-bundui/sales',
    icon: TrendingUp,
    description: 'Sales dashboard with revenue tracking, deals, and performance metrics',
    category: 'Dashboards'
  }
];

const apps = [
  {
    name: 'AI Chat',
    href: '/dashboard-bundui/ai-chat',
    icon: MessageSquare,
    description: 'AI-powered chat interface with multiple model support and conversation history',
    category: 'AI Apps'
  },
  {
    name: 'Calendar',
    href: '/dashboard-bundui/calendar',
    icon: Calendar,
    description: 'Calendar application with events, scheduling, and reminders',
    category: 'Apps'
  },
  {
    name: 'Mail',
    href: '/dashboard-bundui/mail',
    icon: Mail,
    description: 'Email client with inbox, compose, and email management',
    category: 'Apps'
  },
  {
    name: 'Notes',
    href: '/dashboard-bundui/notes',
    icon: StickyNote,
    description: 'Note-taking application with rich text editing and organization',
    category: 'Apps'
  },
  {
    name: 'POS System',
    href: '/dashboard-bundui/pos-system',
    icon: ShoppingBag,
    description: 'Point of sale system for retail and restaurant management',
    category: 'Apps'
  },
  {
    name: 'Tasks',
    href: '/dashboard-bundui/tasks',
    icon: CheckSquare,
    description: 'Task management with to-do lists, priorities, and deadlines',
    category: 'Apps'
  }
];

const categories = [
  { name: 'Dashboards', items: dashboards },
  { name: 'Apps', items: apps.filter(app => app.category === 'Apps') },
  { name: 'AI Apps', items: apps.filter(app => app.category === 'AI Apps') }
];

export default function DashboardBunduiIndex() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Bundui Premium Dashboards</h1>
        <p className="text-muted-foreground">
          Reference implementations mirroring the latest Bundui Premium version. 
          These are demo/reference dashboards using our monorepo architecture and Shadcn UI.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category.name} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {category.items.map((dashboard) => {
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




