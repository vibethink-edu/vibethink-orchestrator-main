"use client";

import React, { useState } from 'react';
import { BunduiButton } from '../components/common/BunduiButton';
import { BunduiCard, BunduiCardHeader, BunduiCardTitle, BunduiCardDescription, BunduiCardContent, BunduiCardFooter } from '../components/common/BunduiCard';
import { BunduiBadge } from '../components/data-display/BunduiBadge';
import { useBunduiTheme } from '../hooks/useBunduiTheme';

// Mock data
const mockStats = [
  { title: 'Usuarios Activos', value: '1,234', change: '+12%', trend: 'up' },
  { title: 'Ingresos Mensuales', value: '$45,678', change: '+8%', trend: 'up' },
  { title: 'Tickets Abiertos', value: '89', change: '-5%', trend: 'down' },
  { title: 'Satisfacción', value: '94%', change: '+2%', trend: 'up' }
];

const mockRecentActivity = [
  { user: 'María González', action: 'Creó un nuevo contacto', time: '2 min ago', type: 'contact' },
  { user: 'Carlos Ruiz', action: 'Actualizó el pipeline', time: '5 min ago', type: 'pipeline' },
  { user: 'Ana López', action: 'Resolvió ticket #1234', time: '10 min ago', type: 'ticket' },
  { user: 'Luis Pérez', action: 'Generó reporte mensual', time: '15 min ago', type: 'report' }
];

const mockQuickActions = [
  { title: 'Nuevo Contacto', icon: '👤', color: 'blue' },
  { title: 'Crear Oportunidad', icon: '💼', color: 'green' },
  { title: 'Abrir Ticket', icon: '🎫', color: 'orange' },
  { title: 'Generar Reporte', icon: '📊', color: 'purple' }
];

export const BunduiDashboardPage: React.FC = () => {
  const { currentTheme, changeTheme } = useBunduiTheme();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme.name);

  const handleThemeChange = (themeName: string) => {
    setSelectedTheme(themeName);
    changeTheme(themeName);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact': return '👤';
      case 'pipeline': return '📈';
      case 'ticket': return '🎫';
      case 'report': return '📊';
      default: return '📝';
    }
  };

  const getActionColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      purple: 'bg-purple-500 hover:bg-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                VibeThink Orchestrator
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Selector */}
              <select
                value={selectedTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="vthink-default">VThink Default</option>
                <option value="bundui-light">Bundui Light</option>
                <option value="enterprise-blue">Enterprise Blue</option>
                <option value="modern-dark">Modern Dark</option>
              </select>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <BunduiBadge variant="success">Admin</BunduiBadge>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido de vuelta, Admin!
          </h2>
          <p className="text-gray-600">
            Aquí tienes un resumen de tu actividad reciente
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, index) => (
            <BunduiCard key={index} variant="elevated">
              <BunduiCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <BunduiBadge 
                    variant={stat.trend === 'up' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {stat.change}
                  </BunduiBadge>
                </div>
              </BunduiCardContent>
            </BunduiCard>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <BunduiCard>
              <BunduiCardHeader>
                <BunduiCardTitle>Acciones Rápidas</BunduiCardTitle>
                <BunduiCardDescription>
                  Accede rápidamente a las funciones más usadas
                </BunduiCardDescription>
              </BunduiCardHeader>
              <BunduiCardContent>
                <div className="grid grid-cols-2 gap-4">
                  {mockQuickActions.map((action, index) => (
                    <BunduiButton
                      key={index}
                      variant="outline"
                      className={`h-20 flex flex-col items-center justify-center ${getActionColor(action.color)}`}
                    >
                      <span className="text-2xl mb-1">{action.icon}</span>
                      <span className="text-xs font-medium">{action.title}</span>
                    </BunduiButton>
                  ))}
                </div>
              </BunduiCardContent>
            </BunduiCard>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <BunduiCard>
              <BunduiCardHeader>
                <BunduiCardTitle>Actividad Reciente</BunduiCardTitle>
                <BunduiCardDescription>
                  Últimas acciones de tu equipo
                </BunduiCardDescription>
              </BunduiCardHeader>
              <BunduiCardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.action}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </BunduiCardContent>
              <BunduiCardFooter>
                <BunduiButton variant="outline" size="sm" className="w-full">
                  Ver toda la actividad
                </BunduiButton>
              </BunduiCardFooter>
            </BunduiCard>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Aplicaciones Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'e2CRM', description: 'Gestión de relaciones con clientes', icon: '👥', status: 'active' },
              { name: 'e2Helpdesk', description: 'Sistema de soporte técnico', icon: '🎫', status: 'active' },
              { name: 'e2PQRS', description: 'Gestión de peticiones y quejas', icon: '📝', status: 'active' },
              { name: 'AI Chat', description: 'Asistente inteligente', icon: '🤖', status: 'beta' }
            ].map((app, index) => (
              <BunduiCard key={index} variant="outlined" className="hover:shadow-md transition-shadow">
                <BunduiCardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl mb-3">{app.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{app.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                    <BunduiBadge 
                      variant={app.status === 'active' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {app.status}
                    </BunduiBadge>
                  </div>
                </BunduiCardContent>
                <BunduiCardFooter>
                  <BunduiButton size="sm" className="w-full">
                    Abrir
                  </BunduiButton>
                </BunduiCardFooter>
              </BunduiCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}; 