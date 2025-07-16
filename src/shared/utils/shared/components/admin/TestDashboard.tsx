/**
 * TestDashboard - Componente de Prueba Simplificado
 * 
 * Componente simple para verificar que la autenticación y routing funcionan
 * antes de probar el dashboard premium completo.
 */

import React from 'react';
import { useAuth } from '@/shared/hooks/hooks/useAuth';
import { Link } from 'react-router-dom';

const TestDashboard: React.FC = () => {
  const { user, isAuthenticated, loading, hasPermission } = useAuth();

  // TODO: log TestDashboard render en desarrollo

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">VThink Admin</h1>
          <p className="text-gray-600 mb-6">No estás autenticado</p>
          <Link 
            to="/admin/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Test Dashboard - VThink Admin
          </h1>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Información del Usuario */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                👤 Información del Usuario
              </h2>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
                <p><strong>ID:</strong> {user?.id || 'No disponible'}</p>
                <p><strong>Rol:</strong> {user?.profile?.role || 'No disponible'}</p>
                <p><strong>Nombre:</strong> {user?.profile?.full_name || 'No disponible'}</p>
                <p><strong>Empresa:</strong> {user?.company?.name || 'No disponible'}</p>
              </div>
            </div>

            {/* Permisos */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                🔐 Permisos
              </h2>
              <div className="space-y-2">
                <p><strong>ADMIN:</strong> {hasPermission('ADMIN') ? '✅' : '❌'}</p>
                <p><strong>OWNER:</strong> {hasPermission('OWNER') ? '✅' : '❌'}</p>
                <p><strong>SUPER_ADMIN:</strong> {hasPermission('SUPER_ADMIN') ? '✅' : '❌'}</p>
                <p><strong>Autenticado:</strong> {isAuthenticated ? '✅' : '❌'}</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🧭 Navegación de Prueba
            </h2>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Link 
                to="/admin/dashboard"
                className="block p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
              >
                Dashboard Estándar
              </Link>
              
              <Link 
                to="/admin/premium"
                className="block p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 text-center"
              >
                Dashboard Premium
              </Link>
              
              <Link 
                to="/admin/login"
                className="block p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">🐛 Debug Info</h3>
            <pre className="text-sm text-gray-600 overflow-auto">
              {JSON.stringify({
                isAuthenticated,
                loading,
                user: {
                  id: user?.id,
                  email: user?.email,
                  role: user?.profile?.role,
                  company: user?.company?.name
                }
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard; 