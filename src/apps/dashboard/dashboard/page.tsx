"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  FolderKanban, 
  ShoppingBag, 
  Folder, 
  WalletMinimal, 
  GraduationCap, 
  Activity, 
  Building2, 
  Truck,
  Settings,
  User,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";

interface DashboardModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  status: 'active' | 'coming-soon' | 'beta';
  category: 'core' | 'specialized' | 'industry';
}

const dashboardModules: DashboardModule[] = [
  // Core Business Dashboards
  {
    id: 'website-analytics',
    title: 'Website Analytics',
    description: 'Métricas web, SEO y reportes de rendimiento',
    icon: BarChart3,
    href: '/dashboard/website-analytics',
    status: 'active',
    category: 'core'
  },
  {
    id: 'sales',
    title: 'Sales',
    description: 'Gestión de ventas, ingresos y productos',
    icon: DollarSign,
    href: '/dashboard/sales',
    status: 'active',
    category: 'core'
  },
  {
    id: 'crm',
    title: 'CRM',
    description: 'Gestión de clientes y relaciones comerciales',
    icon: Users,
    href: '/dashboard/crm',
    status: 'active',
    category: 'core'
  },
  {
    id: 'project-management',
    title: 'Project Management',
    description: 'Gestión de proyectos y tareas',
    icon: FolderKanban,
    href: '/dashboard/project-management',
    status: 'active',
    category: 'core'
  },
  // Specialized Dashboards
  {
    id: 'ecommerce',
    title: 'E-commerce',
    description: 'Tienda online, productos y órdenes',
    icon: ShoppingBag,
    href: '/dashboard/ecommerce',
    status: 'active',
    category: 'specialized'
  },
  {
    id: 'file-manager',
    title: 'File Manager',
    description: 'Gestión de archivos y almacenamiento',
    icon: Folder,
    href: '/dashboard/file-manager',
    status: 'active',
    category: 'specialized'
  },
  {
    id: 'crypto',
    title: 'Crypto',
    description: 'Gestión de criptomonedas y trading',
    icon: WalletMinimal,
    href: '/dashboard/crypto',
    status: 'active',
    category: 'specialized'
  },
  {
    id: 'academy',
    title: 'Academy',
    description: 'Sistema educativo y cursos',
    icon: GraduationCap,
    href: '/dashboard/academy',
    status: 'active',
    category: 'specialized'
  },
  // Industry-Specific Dashboards
  {
    id: 'hospital-management',
    title: 'Hospital Management',
    description: 'Gestión hospitalaria y médica',
    icon: Activity,
    href: '/dashboard/hospital-management',
    status: 'active',
    category: 'industry'
  },
  {
    id: 'hotel',
    title: 'Hotel',
    description: 'Sistema hotelero y reservas',
    icon: Building2,
    href: '/dashboard/hotel',
    status: 'active',
    category: 'industry'
  },
  {
    id: 'logistics',
    title: 'Logistics',
    description: 'Gestión logística y transporte',
    icon: Truck,
    href: '/dashboard/logistics',
    status: 'active',
    category: 'industry'
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for mock user in localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary">Próximamente</Badge>;
      case 'beta':
        return <Badge className="bg-blue-100 text-blue-800">Beta</Badge>;
      default:
        return null;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'core':
        return 'Dashboards Core';
      case 'specialized':
        return 'Dashboards Especializados';
      case 'industry':
        return 'Dashboards por Industria';
      default:
        return 'Otros';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const groupedModules = dashboardModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, DashboardModule[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                VibeThink Orchestrator
              </h1>
              <Badge variant="secondary" className="ml-2">
                VThink 1.0
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Bienvenido, <span className="font-medium">{user.profile?.full_name || user.email}</span>
              </div>
              <Badge variant="outline">
                {user.profile?.role || 'USER'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('auth_user');
                  localStorage.removeItem('auth_session');
                  router.push('/login');
                }}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Dashboard Principal
            </h2>
            <p className="text-gray-600">
              Accede a todos los módulos de VibeThink Orchestrator
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Módulos Activos</p>
                    <p className="text-2xl font-bold text-gray-900">11</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Performance</p>
                    <p className="text-2xl font-bold text-gray-900">99%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tiempo de Carga</p>
                    <p className="text-2xl font-bold text-gray-900">2.1s</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Empresa</p>
                    <p className="text-2xl font-bold text-gray-900">{user.company?.name || 'Demo'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Modules */}
          {Object.entries(groupedModules).map(([category, modules]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getCategoryTitle(category)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <Card key={module.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <IconComponent className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{module.title}</CardTitle>
                              {getStatusBadge(module.status)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {module.description}
                        </CardDescription>
                        <Button
                          onClick={() => router.push(module.href)}
                          className="w-full"
                          disabled={module.status === 'coming-soon'}
                        >
                          {module.status === 'coming-soon' ? 'Próximamente' : 'Acceder'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/pages/settings')}
                className="h-12"
              >
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/pages/users')}
                className="h-12"
              >
                <User className="mr-2 h-4 w-4" />
                Gestión de Usuarios
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/admin')}
                className="h-12"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Panel de Administración
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 