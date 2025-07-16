/**
 * Departmental Permissions Hook
 * 
 * Hook completo para manejo de permisos departamentales con logging optimizado
 * 
 * @author AI Pair Platform - Core Team
 * @version 1.0.0
 */

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/shared/hooks/useAuth'
import { toast } from 'sonner'
import type { 
  Department, 
  DepartmentCode, 
  UniversalPermission, 
  UserDepartmentMembership, 
  DataAccessPath, 
  CRUDPermission,
  PermissionCheckResult,
  DataAccessCheckResult,
  UserDepartmentInfo,
  PermissionLog,
  DataAccessLog
} from '@/shared/types/departmentalPermissions'

export function useDepartmentalPermissions() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // =====================================================
  // 1. QUERIES PRINCIPALES
  // =====================================================

  // Query: Obtener departamentos de la empresa
  const { 
    data: departments = [], 
    isLoading: loadingDepartments,
    error: departmentsError
  } = useQuery({
    queryKey: ['departments', user?.user_metadata?.company_id],
    queryFn: async () => {
      if (!user?.user_metadata?.company_id) return []
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('company_id', user.user_metadata.company_id)
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return data as Department[]
    },
    enabled: !!user?.user_metadata?.company_id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  // Query: Obtener departamentos del usuario actual
  const { 
    data: userDepartments = [], 
    isLoading: loadingUserDepartments,
    error: userDepartmentsError
  } = useQuery({
    queryKey: ['user-departments', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      
      const { data, error } = await supabase
        .rpc('get_user_departments', { p_user_id: user.id })
      
      if (error) throw error
      return data as UserDepartmentInfo[]
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  })

  // Query: Obtener permisos departamentales
  const { 
    data: departmentPermissions = [], 
    isLoading: loadingPermissions,
    error: permissionsError
  } = useQuery({
    queryKey: ['department-permissions', user?.user_metadata?.company_id],
    queryFn: async () => {
      if (!user?.user_metadata?.company_id) return []
      
      const { data, error } = await supabase
        .from('department_permissions')
        .select('*')
        .eq('is_active', true)
        .order('permission')
      
      if (error) throw error
      return data
    },
    enabled: !!user?.user_metadata?.company_id,
    staleTime: 5 * 60 * 1000,
  })

  // Query: Obtener acceso a datos por departamento
  const { 
    data: departmentDataAccess = [], 
    isLoading: loadingDataAccess,
    error: dataAccessError
  } = useQuery({
    queryKey: ['department-data-access', user?.user_metadata?.company_id],
    queryFn: async () => {
      if (!user?.user_metadata?.company_id) return []
      
      const { data, error } = await supabase
        .from('department_data_access')
        .select('*')
        .eq('is_active', true)
        .order('data_path')
      
      if (error) throw error
      return data
    },
    enabled: !!user?.user_metadata?.company_id,
    staleTime: 5 * 60 * 1000,
  })

  // =====================================================
  // 2. FUNCIONES DE VERIFICACIÓN DE PERMISOS
  // =====================================================

  // Función: Verificar permiso específico
  const checkPermission = async (
    permission: UniversalPermission
  ): Promise<PermissionCheckResult> => {
    if (!user?.id) {
      return {
        hasPermission: false,
        permissionLevel: null,
        department: null,
        restrictions: ['Usuario no autenticado'],
        metadata: {}
      }
    }

    try {
      const { data, error } = await supabase
        .rpc('has_department_permission', {
          p_user_id: user.id,
          p_permission: permission
        })

      if (error) throw error

      const hasPermission = data || false
      
      return {
        hasPermission,
        permissionLevel: hasPermission ? permission : null,
        department: hasPermission ? userDepartments[0]?.department_code || null : null,
        restrictions: hasPermission ? [] : [`Permiso requerido: ${permission}`],
        metadata: {
          user_id: user.id,
          permission,
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Error checking permission:', error)
      return {
        hasPermission: false,
        permissionLevel: null,
        department: null,
        restrictions: ['Error al verificar permisos'],
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }

  // Función: Verificar acceso a datos
  const checkDataAccess = async (
    dataPath: DataAccessPath,
    action: 'read' | 'create' | 'update' | 'delete' = 'read'
  ): Promise<DataAccessCheckResult> => {
    if (!user?.id) {
      return {
        hasAccess: false,
        permissionLevel: null,
        department: null,
        dataPath,
        conditions: [],
        restrictions: ['Usuario no autenticado']
      }
    }

    try {
      const { data, error } = await supabase
        .rpc('has_data_access', {
          p_user_id: user.id,
          p_data_path: dataPath,
          p_action: action
        })

      if (error) throw error

      const hasAccess = data || false
      
      return {
        hasAccess,
        permissionLevel: hasAccess ? `${dataPath.split('.')[0]}:${action}` as CRUDPermission : null,
        department: hasAccess ? userDepartments[0]?.department_code || null : null,
        dataPath,
        conditions: [],
        restrictions: hasAccess ? [] : [`Acceso requerido: ${dataPath} (${action})`]
      }
    } catch (error) {
      console.error('Error checking data access:', error)
      return {
        hasAccess: false,
        permissionLevel: null,
        department: null,
        dataPath,
        conditions: [],
        restrictions: ['Error al verificar acceso a datos']
      }
    }
  }

  // Hook personalizado para verificar permisos en tiempo real
  const usePermission = (permission: UniversalPermission) => {
    return useQuery({
      queryKey: ['permission-check', user?.id, permission],
      queryFn: () => checkPermission(permission),
      enabled: !!user?.id,
      staleTime: 2 * 60 * 1000, // 2 minutos
    })
  }

  // Hook personalizado para verificar acceso a datos en tiempo real
  const useDataAccess = (dataPath: DataAccessPath, action: 'read' | 'create' | 'update' | 'delete' = 'read') => {
    return useQuery({
      queryKey: ['data-access-check', user?.id, dataPath, action],
      queryFn: () => checkDataAccess(dataPath, action),
      enabled: !!user?.id,
      staleTime: 2 * 60 * 1000,
    })
  }

  // =====================================================
  // 3. MUTATIONS PARA GESTIÓN
  // =====================================================

  // Mutation: Crear departamento
  const createDepartment = useMutation({
    mutationFn: async ({
      name,
      code,
      description,
      managerUserId
    }: {
      name: string
      code: DepartmentCode
      description?: string
      managerUserId?: string
    }) => {
      if (!user?.user_metadata?.company_id || !user?.id) {
        throw new Error('User or company information not found')
      }

      const { data, error } = await supabase
        .from('departments')
        .insert({
          company_id: user.user_metadata.company_id,
          name,
          code,
          description,
          manager_user_id: managerUserId,
          is_active: true
        })
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Departamento creado exitosamente')
    },
    onError: (error) => {
      console.error('Error creating department:', error)
      toast.error('Error al crear departamento')
    }
  })

  // Mutation: Asignar usuario a departamento
  const assignUserToDepartment = useMutation({
    mutationFn: async ({
      userId,
      departmentId,
      role = 'MEMBER',
      isPrimary = false
    }: {
      userId: string
      departmentId: string
      role?: 'MEMBER' | 'LEAD' | 'MANAGER'
      isPrimary?: boolean
    }) => {
      if (!user?.user_metadata?.company_id) {
        throw new Error('Company ID not found')
      }

      const { data, error } = await supabase
        .from('user_department_memberships')
        .upsert({
          user_id: userId,
          department_id: departmentId,
          role_in_department: role,
          primary_department: isPrimary,
          is_active: true
        })
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-departments'] })
      toast.success('Usuario asignado al departamento exitosamente')
    },
    onError: (error) => {
      console.error('Error assigning user to department:', error)
      toast.error('Error al asignar usuario al departamento')
    }
  })

  // Mutation: Configurar permisos departamentales
  const setDepartmentPermission = useMutation({
    mutationFn: async ({
      departmentId,
      permission
    }: {
      departmentId: string
      permission: UniversalPermission
    }) => {
      if (!user?.id) {
        throw new Error('User not found')
      }

      const { data, error } = await supabase
        .from('department_permissions')
        .upsert({
          department_id: departmentId,
          permission,
          created_by: user.id,
          is_active: true
        })
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-permissions'] })
      toast.success('Permiso departamental configurado')
    },
    onError: (error) => {
      console.error('Error setting department permission:', error)
      toast.error('Error al configurar permiso departamental')
    }
  })

  // Mutation: Configurar acceso a datos
  const setDepartmentDataAccess = useMutation({
    mutationFn: async ({
      departmentId,
      dataPath,
      permissions,
      conditions
    }: {
      departmentId: string
      dataPath: DataAccessPath
      permissions: CRUDPermission[]
      conditions?: any[]
    }) => {
      if (!user?.id) {
        throw new Error('User not found')
      }

      const { data, error } = await supabase
        .from('department_data_access')
        .upsert({
          department_id: departmentId,
          data_path: dataPath,
          permissions,
          conditions,
          created_by: user.id,
          is_active: true
        })
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-data-access'] })
      toast.success('Acceso a datos configurado')
    },
    onError: (error) => {
      console.error('Error setting department data access:', error)
      toast.error('Error al configurar acceso a datos')
    }
  })

  // =====================================================
  // 4. FUNCIONES DE UTILIDAD
  // =====================================================

  // Obtener departamento principal del usuario
  const getUserPrimaryDepartment = (): DepartmentCode | null => {
    const primary = userDepartments.find(dept => dept.is_primary)
    return primary?.department_code || null
  }

  // Obtener rol del usuario en un departamento específico
  const getUserDepartmentRole = (departmentCode: DepartmentCode): string | null => {
    const membership = userDepartments.find(dept => dept.department_code === departmentCode)
    return membership?.role_in_department || null
  }

  // Verificar si el usuario puede gestionar un departamento
  const canManageDepartment = (departmentCode: DepartmentCode): boolean => {
    const role = getUserDepartmentRole(departmentCode)
    return role === 'MANAGER' || role === 'LEAD'
  }

  // Obtener permisos de un departamento específico
  const getDepartmentPermissions = (departmentCode: DepartmentCode): UniversalPermission[] => {
    const department = departments.find(d => d.code === departmentCode)
    if (!department) return []
    
    return departmentPermissions
      .filter(p => p.department_id === department.id)
      .map(p => p.permission)
  }

  // Obtener acceso a datos de un departamento específico
  const getDepartmentDataAccess = (departmentCode: DepartmentCode): DataAccessPath[] => {
    const department = departments.find(d => d.code === departmentCode)
    if (!department) return []
    
    return departmentDataAccess
      .filter(d => d.department_id === department.id)
      .map(d => d.data_path)
  }

  // Combinar permisos de múltiples departamentos
  const getUserCombinedPermissions = (): UniversalPermission[] => {
    const allPermissions = new Set<UniversalPermission>()
    
    userDepartments.forEach(userDept => {
      const deptPermissions = getDepartmentPermissions(userDept.department_code)
      deptPermissions.forEach(permission => allPermissions.add(permission))
    })
    
    return Array.from(allPermissions)
  }

  // Verificar si el usuario tiene un permiso específico
  const hasUserPermission = (permission: UniversalPermission): boolean => {
    const userPermissions = getUserCombinedPermissions()
    return userPermissions.includes(permission)
  }

  // =====================================================
  // 5. QUERIES DE LOGGING (Solo para ADMIN)
  // =====================================================

  // Query: Obtener logs de permisos (solo ADMIN)
  const { 
    data: permissionLogs = [], 
    isLoading: loadingPermissionLogs 
  } = useQuery({
    queryKey: ['permission-logs', user?.user_metadata?.company_id],
    queryFn: async () => {
      if (!user?.user_metadata?.company_id) return []
      
      const { data, error } = await supabase
        .from('permission_logs')
        .select('*')
        .eq('company_id', user.user_metadata.company_id)
        .order('created_at', { ascending: false })
        .limit(100) // Solo últimos 100 logs
      
      if (error) throw error
      return data as PermissionLog[]
    },
    enabled: !!user?.user_metadata?.company_id && user?.profile?.role === 'ADMIN',
    staleTime: 1 * 60 * 1000, // 1 minuto
  })

  // Query: Obtener logs de acceso a datos (solo ADMIN)
  const { 
    data: dataAccessLogs = [], 
    isLoading: loadingDataAccessLogs 
  } = useQuery({
    queryKey: ['data-access-logs', user?.user_metadata?.company_id],
    queryFn: async () => {
      if (!user?.user_metadata?.company_id) return []
      
      const { data, error } = await supabase
        .from('data_access_logs')
        .select('*')
        .eq('company_id', user.user_metadata.company_id)
        .order('created_at', { ascending: false })
        .limit(100) // Solo últimos 100 logs
      
      if (error) throw error
      return data as DataAccessLog[]
    },
    enabled: !!user?.user_metadata?.company_id && user?.profile?.role === 'ADMIN',
    staleTime: 1 * 60 * 1000, // 1 minuto
  })

  // =====================================================
  // 6. ESTADOS DE CARGA Y ERROR
  // =====================================================

  const isLoading = loadingDepartments || loadingUserDepartments || loadingPermissions || loadingDataAccess
  const hasError = departmentsError || userDepartmentsError || permissionsError || dataAccessError

  return {
    // Data
    departments,
    userDepartments,
    departmentPermissions,
    departmentDataAccess,
    permissionLogs,
    dataAccessLogs,
    
    // Loading states
    isLoading,
    loadingDepartments,
    loadingUserDepartments,
    loadingPermissions,
    loadingDataAccess,
    loadingPermissionLogs,
    loadingDataAccessLogs,
    
    // Error states
    hasError,
    departmentsError,
    userDepartmentsError,
    permissionsError,
    dataAccessError,
    
    // Functions
    checkPermission,
    checkDataAccess,
    usePermission,
    useDataAccess,
    getUserPrimaryDepartment,
    getUserDepartmentRole,
    canManageDepartment,
    getDepartmentPermissions,
    getDepartmentDataAccess,
    getUserCombinedPermissions,
    hasUserPermission,
    
    // Mutations
    createDepartment: createDepartment.mutateAsync,
    assignUserToDepartment: assignUserToDepartment.mutateAsync,
    setDepartmentPermission: setDepartmentPermission.mutateAsync,
    setDepartmentDataAccess: setDepartmentDataAccess.mutateAsync,
    
    // Mutation states
    isCreatingDepartment: createDepartment.isPending,
    isAssigningUser: assignUserToDepartment.isPending,
    isSettingPermission: setDepartmentPermission.isPending,
    isSettingDataAccess: setDepartmentDataAccess.isPending,
  }
}

// Hook simplificado para verificación rápida de permisos
export function useHasPermission(permission: UniversalPermission) {
  const { usePermission } = useDepartmentalPermissions()
  const { data: permissionResult, isLoading } = usePermission(permission)
  
  return {
    canAccess: permissionResult?.hasPermission || false,
    permissionLevel: permissionResult?.permissionLevel,
    department: permissionResult?.department,
    isLoading,
    restrictions: permissionResult?.restrictions || []
  }
}

// Hook simplificado para verificación rápida de acceso a datos
export function useHasDataAccess(dataPath: DataAccessPath, action: 'read' | 'create' | 'update' | 'delete' = 'read') {
  const { useDataAccess } = useDepartmentalPermissions()
  const { data: accessResult, isLoading } = useDataAccess(dataPath, action)
  
  return {
    canAccess: accessResult?.hasAccess || false,
    permissionLevel: accessResult?.permissionLevel,
    department: accessResult?.department,
    isLoading,
    restrictions: accessResult?.restrictions || []
  }
} 