/**
 * DashboardNavigator - Navegador de dashboards
 * 
 * Componente de navegación para cambiar fácilmente entre 
 * diferentes variantes de dashboard disponibles.
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Building2, 
  Shield,
  ChevronDown,
  BarChart3,
  Users,
  CreditCard,
  TrendingUp,
  Wrench,
  TestTube,
  Palette,
  Zap,
  Code,
  Play
} from 'lucide-react';

// Bundui UI Components
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';

interface DashboardOption {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  status: 'active' | 'beta' | 'coming-soon' | 'testing';
  category: 'business' | 'admin' | 'premium' | 'development';
  isExternal?: boolean;
}

interface DashboardNavigatorProps {
  className?: string;
}

const DashboardNavigator: React.FC<DashboardNavigatorProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const dashboardOptions: DashboardOption[] = [
    // === DASHBOARDS TEMÁTICOS ===
    {
      id: 'ecommerce',
      name: 'E-Commerce Dashboard',
      description: 'Dashboard especializado para ventas online',
      path: '/admin/dashboard-ecommerce',
      icon: <ShoppingCart className="h-4 w-4" />,
      status: 'active',
      category: 'business'
    },
    {
      id: 'analytics',
      name: 'Analytics Dashboard',
      description: 'Dashboard de análisis avanzado',
      path: '/admin/dashboard-analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      status: 'active',
      category: 'business'
    },
    {
      id: 'crm',
      name: 'CRM Dashboard',
      description: 'Dashboard de gestión de clientes',
      path: '/admin/dashboard-crm',
      icon: <Users className="h-4 w-4" />,
      status: 'active',
      category: 'business'
    },
    {
      id: 'finance',
      name: 'Finance Dashboard',
      description: 'Dashboard financiero y métricas',
      path: '/admin/dashboard-finance',
      icon: <CreditCard className="h-4 w-4" />,
      status: 'active',
      category: 'business'
    },
    {
      id: 'marketing',
      name: 'Marketing Dashboard',
      description: 'Dashboard de campañas y marketing',
      path: '/admin/dashboard-marketing',
      icon: <TrendingUp className="h-4 w-4" />,
      status: 'active',
      category: 'business'
    },
    {
      id: 'company',
      name: 'Company Dashboard',
      description: 'Dashboard para usuarios empresariales',
      path: '/admin/company-dashboard',
      icon: <Building2 className="h-4 w-4" />,
      status: 'active',
      category: 'business'
    },
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'Dashboard para administradores del sistema',
      path: '/admin/super-admin',
      icon: <Shield className="h-4 w-4" />,
      status: 'active',
      category: 'admin'
    },

    // === DASHBOARDS PREMIUM EN TESTING ===
    {
      id: 'premium-test',
      name: 'Premium Test',
      description: '✅ Dashboard premium funcional (SIN errores)',
      path: '/admin/premium-test',
      icon: <Zap className="h-4 w-4" />,
      status: 'testing',
      category: 'premium'
    },
    {
      id: 'premium-test-enhanced',
      name: 'Premium Enhanced',
      description: '✅ Dashboard premium mejorado (Casi sin errores)',
      path: '/admin/premium-test-enhanced',
      icon: <Palette className="h-4 w-4" />,
      status: 'testing',
      category: 'premium'
    },
    {
      id: 'bundui-premium-dashboard',
      name: 'Bundui Premium Dashboard',
      description: '⭐ Dashboard premium completo con todos los componentes',
      path: '/admin/premium-dashboard',
      icon: <Palette className="h-4 w-4" />,
      status: 'active',
      category: 'premium'
    },

    // === HERRAMIENTAS DE DESARROLLO ===
    {
      id: 'test-basic',
      name: 'Basic Test',
      description: '🧪 Testing básico de componentes',
      path: '/admin/basic-test',
      icon: <TestTube className="h-4 w-4" />,
      status: 'testing',
      category: 'development'
    },
    {
      id: 'test-explorer',
      name: 'Component Explorer',
      description: '🔧 Explorador de componentes Bundui',
      path: '/admin/test-explorer',
      icon: <Code className="h-4 w-4" />,
      status: 'testing',
      category: 'development'
    },
    {
      id: 'emergency-test',
      name: 'Emergency Test',
      description: '🚨 Panel de emergencia para debugging',
      path: '/admin/explorer',
      icon: <Wrench className="h-4 w-4" />,
      status: 'testing',
      category: 'development'
    },
    {
      id: 'main-test',
      name: 'Main Test Dashboard',
      description: '✅ Dashboard principal de testing funcional',
      path: '/admin/test',
      icon: <Play className="h-4 w-4" />,
      status: 'testing',
      category: 'development'
    },

    // === NAVEGACIÓN Y OVERVIEW ===
    {
      id: 'dashboard-navigator',
      name: 'Dashboard Navigator',
      description: '📋 Página de overview de todos los dashboards',
      path: '/admin/navigator',
      icon: <LayoutDashboard className="h-4 w-4" />,
      status: 'beta',
      category: 'development'
    },
    {
      id: 'dashboards-overview',
      name: 'Dashboards Overview',
      description: '📊 Vista general de variaciones de dashboard',
      path: '/admin/dashboards',
      icon: <BarChart3 className="h-4 w-4" />,
      status: 'beta',
      category: 'development'
    },


  ];

  const getCurrentDashboard = () => {
    return dashboardOptions.find(option => location.pathname === option.path);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="ml-2 text-xs bg-green-600">✅ Active</Badge>;
      case 'beta':
        return <Badge variant="secondary" className="ml-2 text-xs bg-blue-600">🔄 Beta</Badge>;
      case 'testing':
        return <Badge variant="outline" className="ml-2 text-xs bg-yellow-100 text-yellow-800">🧪 Testing</Badge>;
      case 'coming-soon':
        return <Badge variant="outline" className="ml-2 text-xs">⏳ Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const handleDashboardChange = (path: string, isExternal?: boolean) => {
    if (isExternal) {
      // Para apps externas, usar window.location para cambiar la URL completa
      window.location.href = `http://localhost:8080${path}`;
    } else {
      // Para rutas internas, usar navigate normal
      navigate(path);
    }
  };

  const currentDashboard = getCurrentDashboard();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[200px] justify-between">
            <div className="flex items-center space-x-2">
              {currentDashboard?.icon || <LayoutDashboard className="h-4 w-4" />}
              <span>{currentDashboard?.name || 'Select Dashboard'}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="start" className="w-[380px] max-h-[500px] overflow-y-auto">
          <DropdownMenuLabel className="text-lg font-bold">VibeThink Orchestrator - Dashboard Selector</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Dashboards Temáticos */}
          <DropdownMenuLabel className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-1">
            🎯 Dashboards Temáticos
          </DropdownMenuLabel>
          {dashboardOptions
            .filter(option => ['business', 'admin'].includes(option.category))
            .map((option) => (
                         <DropdownMenuItem
               key={option.id}
               onClick={() => handleDashboardChange(option.path, option.isExternal)}
               className="cursor-pointer p-3 hover:bg-green-50"
               disabled={option.status === 'coming-soon'}
             >
              <div className="flex items-start space-x-3 w-full">
                <div className="mt-0.5">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.name}</span>
                    {getStatusBadge(option.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {/* Dashboards Premium */}
          <DropdownMenuLabel className="text-sm font-semibold text-purple-700 bg-purple-50 px-2 py-1">
            ⭐ Dashboards Premium (En Testing)
          </DropdownMenuLabel>
          {dashboardOptions
            .filter(option => option.category === 'premium')
            .map((option) => (
                         <DropdownMenuItem
               key={option.id}
               onClick={() => handleDashboardChange(option.path, option.isExternal)}
               className="cursor-pointer p-3 hover:bg-purple-50"
               disabled={option.status === 'coming-soon'}
             >
              <div className="flex items-start space-x-3 w-full">
                <div className="mt-0.5">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.name}</span>
                    {getStatusBadge(option.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {/* Development Tools */}
          <DropdownMenuLabel className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-1">
            🔧 Development Tools
          </DropdownMenuLabel>
          {dashboardOptions
            .filter(option => option.category === 'development')
            .map((option) => (
                         <DropdownMenuItem
               key={option.id}
               onClick={() => handleDashboardChange(option.path, option.isExternal)}
               className="cursor-pointer p-3 hover:bg-blue-50"
               disabled={option.status === 'coming-soon'}
             >
              <div className="flex items-start space-x-3 w-full">
                <div className="mt-0.5">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.name}</span>
                    {getStatusBadge(option.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {/* Quick Actions */}
          <DropdownMenuLabel className="text-sm font-semibold text-purple-700 bg-purple-50 px-2 py-1">
            ⚡ Quick Actions
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => window.open('/admin/premium-test', '_blank')}
            className="cursor-pointer hover:bg-purple-50"
          >
            <Zap className="h-4 w-4 mr-2" />
            <span>Open Premium Test (New Tab)</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open('/admin/premium-test-enhanced', '_blank')}
            className="cursor-pointer hover:bg-purple-50"
          >
            <Palette className="h-4 w-4 mr-2" />
            <span>Open Premium Enhanced (New Tab)</span>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

      {/* Current Dashboard Info */}
      {currentDashboard && (
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          <span>•</span>
          <span className="ml-2">{currentDashboard.description}</span>
          {getStatusBadge(currentDashboard.status)}
        </div>
      )}
    </div>
  );
};

export default DashboardNavigator;
