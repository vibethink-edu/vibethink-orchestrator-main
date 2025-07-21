// VibeThink 1.0 - Dev Portal Sidebar

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Settings, 
  BarChart3,
  CheckSquare,
  Integration,
  FileText,
  Users
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      current: location.pathname === '/'
    },
    {
      name: 'Tareas Pendientes',
      href: '/tasks',
      icon: CheckSquare,
      current: location.pathname === '/tasks'
    },
    {
      name: 'Alertas',
      href: '/alerts',
      icon: AlertTriangle,
      current: location.pathname === '/alerts'
    },
    {
      name: 'Integraciones',
      href: '/integrations',
      icon: Integration,
      current: location.pathname === '/integrations'
    },
    {
      name: 'Métricas',
      href: '/metrics',
      icon: BarChart3,
      current: location.pathname === '/metrics'
    },
    {
      name: 'Documentación',
      href: '/docs',
      icon: FileText,
      current: location.pathname === '/docs'
    },
    {
      name: 'Equipo',
      href: '/team',
      icon: Users,
      current: location.pathname === '/team'
    },
    {
      name: 'Configuración',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    }
  ];

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">VibeThink1 Dev Portal</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                item.current
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <div className="text-xs text-gray-500">
          VibeThink 1.0 Dev Portal
        </div>
      </div>
    </div>
  );
}; 