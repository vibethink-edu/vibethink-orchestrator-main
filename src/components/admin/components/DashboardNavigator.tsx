import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Settings,
  PieChart,
  Briefcase,
  DollarSign,
  Megaphone,
  Grid3x3
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface DashboardCard {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  category: 'core' | 'business' | 'advanced';
  isNew?: boolean;
}

const dashboardCards: DashboardCard[] = [
  {
    title: 'Dashboard Principal',
    description: 'Vista general con métricas clave y KPIs principales',
    path: '/admin/dashboard',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'bg-blue-500',
    category: 'core'
  },
  {
    title: 'Dashboard de Usuarios',
    description: 'Gestión y análisis de usuarios del sistema',
    path: '/admin/dashboard/users',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-green-500',
    category: 'core'
  },
  {
    title: 'Dashboard de Rendimiento',
    description: 'Métricas de rendimiento y monitoreo del sistema',
    path: '/admin/dashboard/performance',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'bg-orange-500',
    category: 'core'
  },
  {
    title: 'Dashboard de Analytics',
    description: 'Análisis profundo de datos y tendencias avanzadas',
    path: '/admin/dashboard/analytics',
    icon: <PieChart className="h-6 w-6" />,
    color: 'bg-purple-500',
    category: 'business',
    isNew: true
  },
  {
    title: 'Dashboard CRM',
    description: 'Gestión de relaciones con clientes y seguimiento de ventas',
    path: '/admin/dashboard/crm',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'bg-indigo-500',
    category: 'business',
    isNew: true
  },
  {
    title: 'Dashboard Financiero',
    description: 'Análisis financiero, ingresos y control de costos',
    path: '/admin/dashboard/finance',
    icon: <DollarSign className="h-6 w-6" />,
    color: 'bg-emerald-500',
    category: 'business',
    isNew: true
  },
  {
    title: 'Dashboard de Marketing',
    description: 'Campañas, conversiones y análisis de marketing digital',
    path: '/admin/dashboard/marketing',
    icon: <Megaphone className="h-6 w-6" />,
    color: 'bg-pink-500',
    category: 'business',
    isNew: true
  },
  {
    title: 'Todas las Variaciones',
    description: 'Explorar todos los dashboards disponibles',
    path: '/admin/dashboard/variations',
    icon: <Grid3x3 className="h-6 w-6" />,
    color: 'bg-gray-500',
    category: 'advanced'
  }
];

const categoryLabels = {
  core: 'Dashboards Principales',
  business: 'Dashboards de Negocio',
  advanced: 'Exploración Avanzada'
};

const categoryColors = {
  core: 'border-blue-200 bg-blue-50',
  business: 'border-green-200 bg-green-50',
  advanced: 'border-gray-200 bg-gray-50'
};

export const DashboardNavigator: React.FC = () => {
  const location = useLocation();

  const renderDashboardCard = (dashboard: DashboardCard) => {
    const isActive = location.pathname === dashboard.path;
    
    return (
      <Card 
        key={dashboard.path}
        className={`transition-all duration-200 hover:shadow-lg hover:scale-105 ${
          isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${dashboard.color} text-white`}>
              {dashboard.icon}
            </div>
            {dashboard.isNew && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Nuevo
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg font-semibold">{dashboard.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4">
            {dashboard.description}
          </p>
          <Link to={dashboard.path}>
            <Button 
              className="w-full" 
              variant={isActive ? "default" : "outline"}
            >
              {isActive ? 'Dashboard Actual' : 'Ir al Dashboard'}
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  };

  const renderCategory = (category: keyof typeof categoryLabels) => {
    const dashboards = dashboardCards.filter(d => d.category === category);
    
    return (
      <div key={category} className="space-y-4">
        <div className={`p-4 rounded-lg border ${categoryColors[category]}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {categoryLabels[category]}
          </h3>
          <p className="text-sm text-gray-600">
            {category === 'core' && 'Dashboards esenciales para la administración del sistema'}
            {category === 'business' && 'Dashboards especializados para análisis de negocio'}
            {category === 'advanced' && 'Herramientas avanzadas de exploración y configuración'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map(renderDashboardCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Navegador de Dashboards
        </h1>
        <p className="text-lg text-gray-600">
          Accede a todos los dashboards administrativos desde un solo lugar
        </p>
      </div>

      <div className="space-y-8">
        {Object.keys(categoryLabels).map(category => 
          renderCategory(category as keyof typeof categoryLabels)
        )}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <Settings className="h-5 w-5 text-blue-600" />
          <h4 className="text-lg font-semibold text-blue-900">Información del Sistema</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Dashboards Disponibles:</span>
            <span className="ml-2 text-blue-700">{dashboardCards.length}</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Nuevos Dashboards:</span>
            <span className="ml-2 text-blue-700">
              {dashboardCards.filter(d => d.isNew).length}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Dashboard Actual:</span>
            <span className="ml-2 text-blue-700">
              {dashboardCards.find(d => d.path === location.pathname)?.title || 'Navegador'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavigator;
