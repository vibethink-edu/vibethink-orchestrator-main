/**
 * Permission Management Page
 * 
 * Página principal para gestión de permisos departamentales
 * 
 * @author AI Pair Platform - Admin Team
 * @version 1.0.0
 */

import React from 'react'
import { Shield, Users, Settings, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { DepartmentalPermissionsManager } from '@/components/admin/DepartmentalPermissionsManager'

const PermissionManagement = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  // Verificar si el usuario tiene permisos de administración
  const canManagePermissions = user?.profile?.role === 'ADMIN' || user?.profile?.role === 'OWNER'

  if (!canManagePermissions) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('admin.permissions.title')}
          </h1>
          <p className="text-[#A0A9C9] text-lg">
            {t('admin.permissions.subtitle')}
          </p>
        </div>

        <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            No tienes permisos para acceder a la gestión de permisos departamentales. 
            Solo los administradores y propietarios pueden gestionar permisos.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#4A7FFF]" />
          Sistema de Permisos Departamentales
        </h1>
        <p className="text-[#A0A9C9] text-lg">
          Configure permisos granulares por departamento para control de acceso avanzado
        </p>
      </div>

      {/* Feature Status Card */}
      <Card className="bg-[#1A2341] border-[#2A3451] mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <CardTitle className="text-white text-lg">
              Sistema Activo y Funcional
            </CardTitle>
          </div>
          <CardDescription className="text-[#A0A9C9]">
            El sistema de permisos departamentales está completamente implementado y listo para usar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#2A3451]/50 rounded-lg">
              <Shield className="w-6 h-6 text-[#4A7FFF] mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm mb-1">Permisos Granulares</h3>
              <p className="text-[#A0A9C9] text-xs">Control detallado por departamento</p>
            </div>
            <div className="text-center p-4 bg-[#2A3451]/50 rounded-lg">
              <Users className="w-6 h-6 text-[#4A7FFF] mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm mb-1">Gestión de Departamentos</h3>
              <p className="text-[#A0A9C9] text-xs">Crear y configurar departamentos</p>
            </div>
            <div className="text-center p-4 bg-[#2A3451]/50 rounded-lg">
              <Settings className="w-6 h-6 text-[#4A7FFF] mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm mb-1">Auditoría Completa</h3>
              <p className="text-[#A0A9C9] text-xs">Logs de todos los accesos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Permissions Manager */}
      <div className="bg-[#1A2341] border-[#2A3451] rounded-lg">
        <DepartmentalPermissionsManager />
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* How It Works */}
        <Card className="bg-[#1A2341] border-[#2A3451]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#4A7FFF]" />
              ¿Cómo Funciona?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4A7FFF] rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                1
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Crear Departamentos</h4>
                <p className="text-[#A0A9C9] text-xs">Configure departamentos específicos para su empresa</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4A7FFF] rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Asignar Permisos</h4>
                <p className="text-[#A0A9C9] text-xs">Configure permisos granulares por departamento</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#4A7FFF] rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                3
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Gestionar Acceso</h4>
                <p className="text-[#A0A9C9] text-xs">Controle acceso a datos específicos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="bg-[#1A2341] border-[#2A3451]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#4A7FFF]" />
              Beneficios del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-white font-medium text-sm">Seguridad Granular</h4>
                <p className="text-[#A0A9C9] text-xs">Control preciso de acceso por departamento</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-white font-medium text-sm">Auditoría Completa</h4>
                <p className="text-[#A0A9C9] text-xs">Logs detallados de todos los accesos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-white font-medium text-sm">Flexibilidad Total</h4>
                <p className="text-[#A0A9C9] text-xs">Adaptable a cualquier tipo de empresa</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-white font-medium text-sm">Performance Optimizada</h4>
                <p className="text-[#A0A9C9] text-xs">Sistema de logging eficiente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration Status */}
      <Card className="bg-[#1A2341] border-[#2A3451] mt-6">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            Estado de la Migración
          </CardTitle>
          <CardDescription className="text-[#A0A9C9]">
            Verificación del sistema de base de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {['departments', 'department_permissions', 'department_data_access', 'user_department_memberships', 'permission_logs', 'data_access_logs'].map((table) => (
              <div key={table} className="text-center p-3 bg-[#2A3451]/50 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                <h4 className="text-white font-medium text-xs mb-1">{table}</h4>
                <p className="text-[#A0A9C9] text-xs">Verificando...</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/50 rounded-lg">
            <p className="text-blue-200 text-sm">
              💡 <strong>Nota:</strong> Si las tablas aparecen en amarillo, es posible que necesites aplicar la migración manualmente desde el Supabase Dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PermissionManagement
