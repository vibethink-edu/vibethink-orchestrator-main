"use client";

import React, { useState } from 'react';
import { BunduiLoginPage } from './BunduiLoginPage';
import { BunduiDashboardPage } from './BunduiDashboardPage';
import { BunduiButton } from '../components/common/BunduiButton';
import { BunduiCard, BunduiCardHeader, BunduiCardTitle, BunduiCardDescription, BunduiCardContent } from '../components/common/BunduiCard';
import { BunduiBadge } from '../components/data-display/BunduiBadge';

export const BunduiDemoPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'demo' | 'login' | 'dashboard'>('demo');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('login');
  };

  const handleDemoView = () => {
    setCurrentView('demo');
  };

  // Render different views
  if (currentView === 'login') {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <BunduiButton 
            variant="outline" 
            size="sm"
            onClick={handleDemoView}
          >
            ← Volver al Demo
          </BunduiButton>
        </div>
        <BunduiLoginPage />
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <BunduiButton 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </BunduiButton>
        </div>
        <BunduiDashboardPage />
      </div>
    );
  }

  // Demo view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                VibeThink Orchestrator - Demo Bundui
              </h1>
            </div>
            <BunduiBadge variant="success">Demo Mode</BunduiBadge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Bundui UI Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema de componentes para VibeThink Orchestrator
          </p>
          <BunduiBadge variant="success" size="lg">
            VThink 1.0 Methodology
          </BunduiBadge>
        </div>

        {/* Demo Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Login Demo */}
          <BunduiCard variant="elevated" className="hover:shadow-lg transition-shadow">
            <BunduiCardHeader>
              <BunduiCardTitle>🔐 Página de Login</BunduiCardTitle>
              <BunduiCardDescription>
                Formulario de autenticación con validación y temas dinámicos
              </BunduiCardDescription>
            </BunduiCardHeader>
            <BunduiCardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Características:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Validación de formularios en tiempo real</li>
                  <li>• Cambio de temas dinámico</li>
                  <li>• Estados de carga y error</li>
                  <li>• Diseño responsive</li>
                </ul>
              </div>
              <BunduiButton 
                onClick={() => setCurrentView('login')}
                className="w-full"
              >
                Ver Login Demo
              </BunduiButton>
            </BunduiCardContent>
          </BunduiCard>

          {/* Dashboard Demo */}
          <BunduiCard variant="elevated" className="hover:shadow-lg transition-shadow">
            <BunduiCardHeader>
              <BunduiCardTitle>📊 Dashboard General</BunduiCardTitle>
              <BunduiCardDescription>
                Panel principal con estadísticas, actividad y aplicaciones
              </BunduiCardDescription>
            </BunduiCardHeader>
            <BunduiCardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Características:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Métricas en tiempo real</li>
                  <li>• Actividad reciente del equipo</li>
                  <li>• Acciones rápidas</li>
                  <li>• Selector de temas</li>
                </ul>
              </div>
              <BunduiButton 
                onClick={() => setCurrentView('dashboard')}
                className="w-full"
              >
                Ver Dashboard Demo
              </BunduiButton>
            </BunduiCardContent>
          </BunduiCard>
        </div>

        {/* Component Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Componentes Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Buttons */}
            <BunduiCard>
              <BunduiCardHeader>
                <BunduiCardTitle>Botones</BunduiCardTitle>
                <BunduiCardDescription>
                  Variantes y tamaños disponibles
                </BunduiCardDescription>
              </BunduiCardHeader>
              <BunduiCardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <BunduiButton size="sm">Small</BunduiButton>
                  <BunduiButton>Medium</BunduiButton>
                  <BunduiButton size="lg">Large</BunduiButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  <BunduiButton variant="primary">Primary</BunduiButton>
                  <BunduiButton variant="secondary">Secondary</BunduiButton>
                  <BunduiButton variant="outline">Outline</BunduiButton>
                  <BunduiButton variant="ghost">Ghost</BunduiButton>
                </div>
              </BunduiCardContent>
            </BunduiCard>

            {/* Cards */}
            <BunduiCard>
              <BunduiCardHeader>
                <BunduiCardTitle>Tarjetas</BunduiCardTitle>
                <BunduiCardDescription>
                  Estructura modular y flexible
                </BunduiCardDescription>
              </BunduiCardHeader>
              <BunduiCardContent>
                <div className="space-y-2">
                  <BunduiCard variant="default">
                    <BunduiCardContent className="p-3">
                      <p className="text-sm">Default Card</p>
                    </BunduiCardContent>
                  </BunduiCard>
                  <BunduiCard variant="outlined">
                    <BunduiCardContent className="p-3">
                      <p className="text-sm">Outlined Card</p>
                    </BunduiCardContent>
                  </BunduiCard>
                </div>
              </BunduiCardContent>
            </BunduiCard>

            {/* Badges */}
            <BunduiCard>
              <BunduiCardHeader>
                <BunduiCardTitle>Badges</BunduiCardTitle>
                <BunduiCardDescription>
                  Indicadores y etiquetas
                </BunduiCardDescription>
              </BunduiCardHeader>
              <BunduiCardContent>
                <div className="flex flex-wrap gap-2">
                  <BunduiBadge variant="default">Default</BunduiBadge>
                  <BunduiBadge variant="success">Success</BunduiBadge>
                  <BunduiBadge variant="warning">Warning</BunduiBadge>
                  <BunduiBadge variant="destructive">Error</BunduiBadge>
                </div>
              </BunduiCardContent>
            </BunduiCard>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Características de Bundui UI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Multi-Tenant', description: 'Soporte completo para múltiples empresas', icon: '🏢' },
              { title: 'Temas Dinámicos', description: 'Cambio de temas en tiempo real', icon: '🎨' },
              { title: 'TypeScript', description: 'Tipado completo y seguro', icon: '🔒' },
              { title: 'Responsive', description: 'Diseño adaptativo para todos los dispositivos', icon: '📱' }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}; 