import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserManagement from '@/components/admin/UserManagement';
import UserManagementSidebar from '@/components/admin/UserManagementSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Info } from 'lucide-react';

const UsersPage: React.FC = () => {
  const { user, hasPermission } = useAuth();

  // Verificar autenticación y permisos
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission('ADMIN')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="flex h-full bg-background">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            {/* Demo Mode Alert */}
            <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Modo Demo:</strong> Esta interfaz está mostrando datos de ejemplo. 
                En producción, se conectará automáticamente a la base de datos Supabase.
              </AlertDescription>
            </Alert>
            
            <UserManagement />
          </div>
        </div>
        
        {/* Sidebar */}
        <UserManagementSidebar />
      </div>
    </DashboardLayout>
  );
};

export default UsersPage; 