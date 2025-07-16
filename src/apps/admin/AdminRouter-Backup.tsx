/**
 * AdminRouter - VThink 1.0 Integration
 * 
 * Sistema de rutas para el panel de administración que incluye
 * el nuevo dashboard premium de Bundui con navegación avanzada.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/hooks/useAuth';

// Componentes de autenticación
import AdminLoginShadcn from './components/AdminLoginShadcn';

// Dashboards
import CleanDashboard from './components/CleanDashboard';
import BunduiPremiumDashboard from './components/BunduiPremiumDashboard';
import BunduiExplorer from './components/BunduiExplorer';
import TestDashboard from './components/TestDashboard';
import TestBunduiExplorer from './components/TestBunduiExplorer';
import BasicTest from './components/BasicTest';
import DiagnosticExplorer from './components/DiagnosticExplorer';
import BunduiExplorerFixed from './components/BunduiExplorerFixed';
import EmergencyTest from './components/EmergencyTest';

// Componentes de layout
import AdminLayout from './components/AdminLayout';

/**
 * Componente de protección de rutas para administradores
 */
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Verificar permisos de administrador
  const isAdmin = user?.profile?.role === "ADMIN" || 
                  user?.profile?.role === "OWNER" || 
                  user?.profile?.role === "SUPER_ADMIN";

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">Solo administradores pueden acceder a este panel.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Componente de protección para rutas premium
 */
const PremiumRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Verificar permisos premium (OWNER o SUPER_ADMIN)
  const isPremium = user?.profile?.role === "OWNER" || 
                   user?.profile?.role === "SUPER_ADMIN";

  if (!isPremium) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Premium</h2>
          <p className="text-gray-600 mb-6">
            Esta funcionalidad premium está disponible solo para propietarios y super administradores.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/dashboard'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ir al Dashboard Estándar
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Volver al Dashboard Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Router principal del panel de administración
 */
const AdminRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Ruta de login */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to="/admin/test" replace /> : 
            <AdminLoginShadcn />
        } 
      />

      {/* Ruta de prueba */}
      <Route 
        path="/test" 
        element={
          <ProtectedAdminRoute>
            <TestDashboard />
          </ProtectedAdminRoute>
        } 
      />

      {/* Ruta de exploración Bundui */}
      <Route 
        path="/explorer" 
        element={<EmergencyTest />}
      />

      {/* Ruta de prueba sin autenticación */}
      <Route 
        path="/test-explorer" 
        element={<TestBunduiExplorer />} 
      />

      {/* Ruta de prueba básica */}
      <Route 
        path="/basic-test" 
        element={<BasicTest />} 
      />

      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <CleanDashboard />
            </AdminLayout>
          </ProtectedAdminRoute>
        } 
      />

      {/* Ruta premium */}
      <Route 
        path="/premium" 
        element={
          <ProtectedAdminRoute>
            <PremiumRoute>
              <BunduiPremiumDashboard />
            </PremiumRoute>
          </ProtectedAdminRoute>
        } 
      />

      {/* Ruta premium sin protección para testing */}
      <Route 
        path="/premium-test" 
        element={<BunduiPremiumDashboard />} 
      />

      {/* Ruta por defecto */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to="/admin/explorer" replace /> : 
            <Navigate to="/admin/login" replace />
        } 
      />

      {/* Ruta de fallback */}
      <Route 
        path="*" 
        element={
          <Navigate to="/admin/explorer" replace />
        } 
      />
    </Routes>
  );
};

export default AdminRouter; 