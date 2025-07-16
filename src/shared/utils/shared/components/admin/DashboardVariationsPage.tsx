/**
 * DashboardVariationsPage - Página de variaciones de dashboard
 * 
 * Página de overview que muestra todas las variaciones de dashboard
 * disponibles con previews, descripciones y acceso directo.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Building2, 
  Shield,
  Settings,
  Eye,
  ExternalLink,
  Star,
  Users,
  TrendingUp,
  BarChart3,
  Package,
  CreditCard
} from 'lucide-react';

// Bundui UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/bundui-premium/components/ui/tabs';
import { Separator } from '@/shared/components/bundui-premium/components/ui/separator';

// Debug Panel
import SystemDebugPanel from './SystemDebugPanel';

interface DashboardVariant {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  path: string;
  icon: React.ReactNode;
  status: 'active' | 'beta' | 'coming-soon';
  category: 'business' | 'ecommerce' | 'admin' | 'analytics';
  features: string[];
  mockDataPoints: number;
  complexity: 'simple' | 'medium' | 'complex';
  tags: string[];
  lastUpdated: string;
}

const DashboardVariationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const dashboardVariants: DashboardVariant[] = [
    {
      id: 'premium',
      name: 'Premium Dashboard',
      description: 'Dashboard principal con todos los componentes Bundui',
      longDescription: 'Dashboard completo que muestra la integración total de Bundui UI con componentes premium, navegación avanzada y sistema de debug integrado.',
      path: '/admin/premium-dashboard',
      icon: <LayoutDashboard className="h-6 w-6" />,
      status: 'active',
      category: 'business',
      features: ['Bundui Components', 'Debug Panel', 'Component Explorer', 'Responsive Design'],
      mockDataPoints: 15,
      complexity: 'complex',
      tags: ['Premium', 'Complete', 'Debug'],
      lastUpdated: '2025-07-07'
    },
    {
      id: 'default',
      name: 'Default Dashboard',
      description: 'Dashboard empresarial estándar con KPIs básicos',
      longDescription: 'Dashboard clásico empresarial con métricas fundamentales, gráficos de rendimiento y vista general del negocio.',
      path: '/admin/dashboard-default',
      icon: <BarChart3 className="h-6 w-6" />,
      status: 'active',
      category: 'business',
      features: ['KPI Cards', 'Sales Overview', 'Recent Orders', 'Performance Metrics'],
      mockDataPoints: 25,
      complexity: 'medium',
      tags: ['Standard', 'Business', 'KPIs'],
      lastUpdated: '2025-07-07'
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce Dashboard',
      description: 'Dashboard especializado para tiendas online y ventas',
      longDescription: 'Dashboard avanzado para e-commerce con análisis de productos, customers insights, métricas de conversión y gestión de inventario.',
      path: '/admin/dashboard-ecommerce',
      icon: <ShoppingCart className="h-6 w-6" />,
      status: 'active',
      category: 'ecommerce',
      features: ['Product Analytics', 'Customer Insights', 'Transaction History', 'Inventory Management'],
      mockDataPoints: 40,
      complexity: 'complex',
      tags: ['E-commerce', 'Sales', 'Analytics'],
      lastUpdated: '2025-07-07'
    },
    {
      id: 'company',
      name: 'Company Dashboard',
      description: 'Dashboard para usuarios empresariales y equipos',
      longDescription: 'Dashboard orientado a gestión empresarial con métricas de equipo, proyectos activos, actividad reciente y productividad.',
      path: '/admin/company-dashboard',
      icon: <Building2 className="h-6 w-6" />,
      status: 'active',
      category: 'business',
      features: ['Team Management', 'Project Tracking', 'Activity Feed', 'Productivity Metrics'],
      mockDataPoints: 30,
      complexity: 'medium',
      tags: ['Enterprise', 'Team', 'Projects'],
      lastUpdated: '2025-07-07'
    },
    {
      id: 'super-admin',
      name: 'Super Admin Dashboard',
      description: 'Dashboard para administradores del sistema',
      longDescription: 'Dashboard de administración avanzada con control total del sistema, gestión de tenants, monitoreo global y alertas.',
      path: '/admin/super-admin',
      icon: <Shield className="h-6 w-6" />,
      status: 'active',
      category: 'admin',
      features: ['System Control', 'Tenant Management', 'Global Monitoring', 'Security Alerts'],
      mockDataPoints: 35,
      complexity: 'complex',
      tags: ['Admin', 'System', 'Security'],
      lastUpdated: '2025-07-07'
    },
    {
      id: 'analytics',
      name: 'Analytics Dashboard',
      description: 'Dashboard de análisis avanzado y métricas',
      longDescription: 'Dashboard especializado en análisis de datos, métricas avanzadas, segmentación de usuarios y análisis predictivo.',
      path: '/admin/dashboard-analytics',
      icon: <BarChart3 className="h-6 w-6" />,
      status: 'active',
      category: 'analytics',
      features: ['Advanced Analytics', 'User Segmentation', 'Predictive Analysis', 'Custom Reports'],
      mockDataPoints: 50,
      complexity: 'complex',
      tags: ['Analytics', 'Data', 'Insights'],
      lastUpdated: '2025-07-07'
    },
    {
      id: 'crm',
      name: 'CRM Dashboard',
      description: 'Dashboard de gestión de relaciones con clientes',
      longDescription: 'Dashboard especializado en CRM con gestión de leads, clientes, pipeline de ventas y actividades de seguimiento.',
      path: '/admin/dashboard-crm',
      icon: <Users className="h-6 w-6" />,
      status: 'active',
      category: 'business',
      features: ['Lead Management', 'Sales Pipeline', 'Customer Insights', 'Activity Tracking'],
      mockDataPoints: 45,
      complexity: 'complex',
      tags: ['CRM', 'Sales', 'Customers'],
      lastUpdated: '2025-07-07'
    },
    {
      id: 'finance',
      name: 'Finance Dashboard',
      description: 'Dashboard financiero y métricas económicas',
      longDescription: 'Dashboard especializado en métricas financieras, análisis de ingresos, gastos, flujo de caja y proyecciones financieras.',
      path: '/admin/dashboard-finance',
      icon: <CreditCard className="h-6 w-6" />,
      status: 'active',
      category: 'business',
      features: ['Financial Metrics', 'Cash Flow', 'Budget Analysis', 'Revenue Tracking'],
      mockDataPoints: 35,
      complexity: 'medium',
      tags: ['Finance', 'Revenue', 'Budget'],
      lastUpdated: '2025-07-07'
    },
    {
      id: 'marketing',
      name: 'Marketing Dashboard',
      description: 'Dashboard de campañas y métricas de marketing',
      longDescription: 'Dashboard especializado en métricas de marketing, campañas, análisis de leads, conversiones y ROI de marketing.',
      path: '/admin/dashboard-marketing',
      icon: <TrendingUp className="h-6 w-6" />,
      status: 'active',
      category: 'business',
      features: ['Campaign Analytics', 'Lead Analysis', 'ROI Tracking', 'Channel Performance'],
      mockDataPoints: 55,
      complexity: 'complex',
      tags: ['Marketing', 'Campaigns', 'ROI'],
      lastUpdated: '2025-07-07'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Dashboards', count: dashboardVariants.length },
    { id: 'business', name: 'Business', count: dashboardVariants.filter(d => d.category === 'business').length },
    { id: 'ecommerce', name: 'E-Commerce', count: dashboardVariants.filter(d => d.category === 'ecommerce').length },
    { id: 'admin', name: 'Admin', count: dashboardVariants.filter(d => d.category === 'admin').length },
    { id: 'analytics', name: 'Analytics', count: dashboardVariants.filter(d => d.category === 'analytics').length }
  ];

  const filteredVariants = dashboardVariants.filter(variant => {
    const matchesCategory = selectedCategory === 'all' || variant.category === selectedCategory;
    const matchesSearch = variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'beta':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Beta</Badge>;
      case 'coming-soon':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const getComplexityBadge = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Simple</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Medium</Badge>;
      case 'complex':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Complex</Badge>;
      default:
        return null;
    }
  };

  const handleViewDashboard = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Dashboard Variations</h1>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search dashboards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Debug
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Debug Panel */}
        {showDebug && (
          <SystemDebugPanel />
        )}

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Dashboards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardVariants.length}</div>
              <p className="text-xs text-muted-foreground">Available variations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Dashboards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardVariants.filter(d => d.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Ready to use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Mock Data Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardVariants.reduce((sum, d) => sum + d.mockDataPoints, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total data points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <p className="text-xs text-muted-foreground">Different types</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-sm">
                {category.name} ({category.count})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4 mt-6">
            {/* Dashboard Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVariants.map((variant) => (
                <Card key={variant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {variant.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{variant.name}</CardTitle>
                          <CardDescription>{variant.description}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(variant.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {variant.longDescription}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <span>Complexity:</span>
                      {getComplexityBadge(variant.complexity)}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span>Mock Data:</span>
                      <Badge variant="outline">{variant.mockDataPoints} points</Badge>
                    </div>

                    <Separator />

                    {/* Features */}
                    <div>
                      <p className="text-xs font-medium mb-2">Key Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {variant.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {variant.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{variant.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <p className="text-xs font-medium mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {variant.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleViewDashboard(variant.path)}
                        className="flex-1"
                        disabled={variant.status === 'coming-soon'}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Dashboard
                      </Button>
                      <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Last updated: {variant.lastUpdated}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredVariants.length === 0 && (
              <div className="text-center py-12">
                <LayoutDashboard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No dashboards found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or category filter.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardVariationsPage;
