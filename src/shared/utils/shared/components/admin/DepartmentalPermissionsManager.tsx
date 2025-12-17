/**
 * Departmental Permissions Manager Component
 * 
 * Componente completo para gestión de permisos departamentales
 * 
 * @author AI Pair Platform - Admin Team
 * @version 1.0.0
 */

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { 
  Building2, 
  Users, 
  Shield, 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Activity,
  FileText,
  Settings,
  UserCheck,
  Lock,
  Unlock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useDepartmentalPermissions } from '@/hooks/useDepartmentalPermissions'
import type { 
  DepartmentCode, 
  UniversalPermission, 
  CRUDPermission,
  DataAccessPath,
  DepartmentConfiguration,
  BUSINESS_TYPE_CONFIGURATIONS,
  DEPARTMENT_CONFIGURATIONS
} from '@/types/departmentalPermissions'

interface DepartmentalPermissionsManagerProps {
  className?: string
}

export function DepartmentalPermissionsManager({ className }: DepartmentalPermissionsManagerProps) {
  const { user } = useAuth()
  const {
    departments,
    userDepartments,
    departmentPermissions,
    departmentDataAccess,
    permissionLogs,
    dataAccessLogs,
    isLoading,
    hasError,
    createDepartment,
    assignUserToDepartment,
    setDepartmentPermission,
    setDepartmentDataAccess,
    getUserPrimaryDepartment,
    getUserDepartmentRole,
    canManageDepartment,
    getDepartmentPermissions,
    getDepartmentDataAccess,
    getUserCombinedPermissions,
    hasUserPermission
  } = useDepartmentalPermissions()

  // Estados de formularios
  const [newDepartment, setNewDepartment] = React.useState({
    name: '',
    code: '' as DepartmentCode,
    description: '',
    managerUserId: ''
  })

  const [selectedDepartment, setSelectedDepartment] = React.useState<string | null>(null)
  const [selectedPermission, setSelectedPermission] = React.useState<UniversalPermission | null>(null)
  const [selectedDataPath, setSelectedDataPath] = React.useState<DataAccessPath>('')
  const [selectedCRUDPermissions, setSelectedCRUDPermissions] = React.useState<CRUDPermission[]>([])

  // Estados de diálogos
  const [showCreateDepartment, setShowCreateDepartment] = React.useState(false)
  const [showAssignUser, setShowAssignUser] = React.useState(false)
  const [showSetPermission, setShowSetPermission] = React.useState(false)
  const [showSetDataAccess, setShowSetDataAccess] = React.useState(false)

  // =====================================================
  // 1. FUNCIONES DE GESTIÓN
  // =====================================================

  const handleCreateDepartment = async () => {
    if (!newDepartment.name || !newDepartment.code) {
      toast.error('Nombre y código son requeridos')
      return
    }

    try {
      await createDepartment({
        name: newDepartment.name,
        code: newDepartment.code,
        description: newDepartment.description || undefined,
        managerUserId: newDepartment.managerUserId || undefined
      })

      setNewDepartment({ name: '', code: '' as DepartmentCode, description: '', managerUserId: '' })
      setShowCreateDepartment(false)
    } catch (error) {
      // TODO: log 'Error creating department:' error
    }
  }

  const handleAssignUser = async (userId: string, departmentId: string, role: 'MEMBER' | 'LEAD' | 'MANAGER') => {
    try {
      await assignUserToDepartment({
        userId,
        departmentId,
        role,
        isPrimary: false
      })
      setShowAssignUser(false)
    } catch (error) {
      // TODO: log 'Error assigning user:' error
    }
  }

  const handleSetPermission = async () => {
    if (!selectedDepartment || !selectedPermission) {
      toast.error('Departamento y permiso son requeridos')
      return
    }

    try {
      await setDepartmentPermission({
        departmentId: selectedDepartment,
        permission: selectedPermission
      })
      setShowSetPermission(false)
      setSelectedDepartment(null)
      setSelectedPermission(null)
    } catch (error) {
      // TODO: log 'Error setting permission:' error
    }
  }

  const handleSetDataAccess = async () => {
    if (!selectedDepartment || !selectedDataPath || selectedCRUDPermissions.length === 0) {
      toast.error('Departamento, ruta de datos y permisos son requeridos')
      return
    }

    try {
      await setDepartmentDataAccess({
        departmentId: selectedDepartment,
        dataPath: selectedDataPath,
        permissions: selectedCRUDPermissions
      })
      setShowSetDataAccess(false)
      setSelectedDepartment(null)
      setSelectedDataPath('')
      setSelectedCRUDPermissions([])
    } catch (error) {
      // TODO: log 'Error setting data access:' error
    }
  }

  // =====================================================
  // 2. FUNCIONES DE UTILIDAD
  // =====================================================

  const getDepartmentConfig = (code: DepartmentCode): DepartmentConfiguration | null => {
    return DEPARTMENT_CONFIGURATIONS[code] || null
  }

  const getPermissionDescription = (permission: UniversalPermission): string => {
    const descriptions: Record<UniversalPermission, string> = {
      'use_ai_chat': 'Usar chat AI para asistencia',
      'schedule_meetings': 'Programar citas y reuniones',
      'access_company_calendar': 'Ver calendario empresarial',
      'send_internal_communications': 'Enviar comunicaciones internas',
      'send_external_communications': 'Enviar comunicaciones externas',
      'view_sales_reports': 'Ver reportes de ventas',
      'view_financial_reports': 'Ver reportes financieros',
      'view_operational_reports': 'Ver reportes operacionales',
      'view_customer_data': 'Ver datos de clientes',
      'view_inventory_data': 'Ver datos de inventario',
      'view_employee_data': 'Ver datos de empleados',
      'access_shared_folders': 'Acceder a carpetas compartidas',
      'access_department_folders': 'Acceder a carpetas departamentales',
      'access_confidential_folders': 'Acceder a carpetas confidenciales',
      'upload_documents': 'Subir documentos',
      'download_documents': 'Descargar documentos',
      'manage_customer_support': 'Gestionar soporte al cliente',
      'process_transactions': 'Procesar transacciones',
      'manage_inventory': 'Gestionar inventario',
      'create_content': 'Crear contenido',
      'approve_workflows': 'Aprobar flujos de trabajo',
      'access_analytics_dashboard': 'Acceder al dashboard de analytics'
    }
    return descriptions[permission] || 'Permiso sin descripción'
  }

  const getCRUDPermissionDescription = (permission: CRUDPermission): string => {
    const [entity, action] = permission.split(':')
    const actions = {
      'read': 'Ver',
      'create': 'Crear',
      'update': 'Actualizar',
      'delete': 'Eliminar'
    }
    const entities = {
      'inventory': 'Inventario',
      'customers': 'Clientes',
      'projects': 'Proyectos',
      'financial': 'Datos Financieros'
    }
    return `${actions[action as keyof typeof actions]} ${entities[entity as keyof typeof entities] || entity}`
  }

  // =====================================================
  // 3. RENDERIZADO CONDICIONAL POR ROL
  // =====================================================

  if (!user) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Debe iniciar sesión para acceder a la gestión de permisos departamentales.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 animate-spin" />
          <span>Cargando permisos departamentales...</span>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar los permisos departamentales. Intente nuevamente.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Gestión de Permisos Departamentales
          </h1>
          <p className="text-muted-foreground">
            Configure permisos granulares por departamento para control de acceso
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showCreateDepartment} onOpenChange={setShowCreateDepartment}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Departamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Departamento</DialogTitle>
                <DialogDescription>
                  Configure un nuevo departamento con sus permisos básicos
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dept-name">Nombre del Departamento</Label>
                  <Input
                    id="dept-name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Ventas, Marketing, IT"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dept-code">Código</Label>
                  <Select 
                    value={newDepartment.code} 
                    onValueChange={(value) => setNewDepartment(prev => ({ ...prev, code: value as DepartmentCode }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar código" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DEPARTMENT_CONFIGURATIONS).map(([code, config]) => (
                        <SelectItem key={code} value={code}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dept-description">Descripción</Label>
                  <Textarea
                    id="dept-description"
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción del departamento..."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDepartment(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateDepartment}>
                  Crear Departamento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs de Gestión */}
      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Departamentos
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permisos
          </TabsTrigger>
          <TabsTrigger value="data-access" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Acceso a Datos
          </TabsTrigger>
          <TabsTrigger value="memberships" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Membresías
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Logs de Auditoría
          </TabsTrigger>
        </TabsList>

        {/* Tab: Departamentos */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departamentos de la Empresa</CardTitle>
              <CardDescription>
                Gestione los departamentos y sus configuraciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Miembros</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{dept.name}</div>
                          {dept.description && (
                            <div className="text-sm text-muted-foreground">{dept.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{dept.code}</Badge>
                      </TableCell>
                      <TableCell>
                        {dept.manager_user_id ? (
                          <Badge variant="secondary">Asignado</Badge>
                        ) : (
                          <Badge variant="outline">Sin asignar</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {userDepartments.filter(ud => ud.department_id === dept.id).length} miembros
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {dept.is_active ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Inactivo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Users className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Permisos */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Permisos Departamentales</CardTitle>
                  <CardDescription>
                    Configure permisos granulares por departamento
                  </CardDescription>
                </div>
                <Dialog open={showSetPermission} onOpenChange={setShowSetPermission}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Asignar Permiso
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Asignar Permiso Departamental</DialogTitle>
                      <DialogDescription>
                        Seleccione un departamento y un permiso para asignar
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Departamento</Label>
                        <Select value={selectedDepartment || ''} onValueChange={setSelectedDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Permiso</Label>
                        <Select 
                          value={selectedPermission || ''} 
                          onValueChange={(value) => setSelectedPermission(value as UniversalPermission)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar permiso" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(DEPARTMENT_CONFIGURATIONS).flatMap(([code, config]) =>
                              config.default_permissions.map(permission => ({
                                permission,
                                description: getPermissionDescription(permission)
                              }))
                            ).map(({ permission, description }) => (
                              <SelectItem key={permission} value={permission}>
                                <div>
                                  <div className="font-medium">{permission}</div>
                                  <div className="text-sm text-muted-foreground">{description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowSetPermission(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSetPermission}>
                        Asignar Permiso
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Permiso</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Asignado Por</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentPermissions.map((perm) => {
                    const dept = departments.find(d => d.id === perm.department_id)
                    return (
                      <TableRow key={perm.id}>
                        <TableCell>
                          <Badge variant="outline">{dept?.name || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm">{perm.permission}</code>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {getPermissionDescription(perm.permission)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(perm.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {perm.is_active ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="mr-1 h-3 w-3" />
                              Inactivo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Acceso a Datos */}
        <TabsContent value="data-access" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Acceso a Datos por Departamento</CardTitle>
                  <CardDescription>
                    Configure rutas de datos y permisos CRUD específicos
                  </CardDescription>
                </div>
                <Dialog open={showSetDataAccess} onOpenChange={setShowSetDataAccess}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Configurar Acceso
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configurar Acceso a Datos</DialogTitle>
                      <DialogDescription>
                        Defina rutas de datos y permisos CRUD para un departamento
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Departamento</Label>
                        <Select value={selectedDepartment || ''} onValueChange={setSelectedDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Ruta de Datos</Label>
                        <Input
                          value={selectedDataPath}
                          onChange={(e) => setSelectedDataPath(e.target.value)}
                          placeholder="Ej: customers.*, inventory.assigned, projects.active"
                        />
                      </div>
                      
                      <div>
                        <Label>Permisos CRUD</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['inventory', 'customers', 'projects', 'financial'].map(entity => (
                            <div key={entity} className="space-y-2">
                              <div className="font-medium text-sm capitalize">{entity}</div>
                              {['read', 'create', 'update', 'delete'].map(action => {
                                const permission = `${entity}:${action}` as CRUDPermission
                                return (
                                  <div key={action} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={permission}
                                      checked={selectedCRUDPermissions.includes(permission)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedCRUDPermissions(prev => [...prev, permission])
                                        } else {
                                          setSelectedCRUDPermissions(prev => 
                                            prev.filter(p => p !== permission)
                                          )
                                        }
                                      }}
                                    />
                                    <Label htmlFor={permission} className="text-sm capitalize">
                                      {action}
                                    </Label>
                                  </div>
                                )
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowSetDataAccess(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSetDataAccess}>
                        Configurar Acceso
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Ruta de Datos</TableHead>
                    <TableHead>Permisos</TableHead>
                    <TableHead>Condiciones</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentDataAccess.map((access) => {
                    const dept = departments.find(d => d.id === access.department_id)
                    return (
                      <TableRow key={access.id}>
                        <TableCell>
                          <Badge variant="outline">{dept?.name || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm">{access.data_path}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {access.permissions.map((perm) => (
                              <Badge key={perm} variant="secondary" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {access.conditions && access.conditions.length > 0 ? (
                            <Badge variant="outline">Con condiciones</Badge>
                          ) : (
                            <Badge variant="outline">Sin condiciones</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {access.is_active ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="mr-1 h-3 w-3" />
                              Inactivo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Membresías */}
        <TabsContent value="memberships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membresías de Usuarios</CardTitle>
              <CardDescription>
                Gestione las membresías de usuarios en departamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Departamento Principal</TableHead>
                    <TableHead>Fecha de Ingreso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userDepartments.map((membership) => (
                    <TableRow key={membership.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <UserCheck className="h-4 w-4" />
                          </div>
                          <span className="font-medium">Usuario {membership.user_id.slice(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{membership.department_name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          membership.role_in_department === 'MANAGER' ? 'default' :
                          membership.role_in_department === 'LEAD' ? 'secondary' : 'outline'
                        }>
                          {membership.role_in_department}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {membership.is_primary ? (
                          <Badge variant="default" className="bg-blue-100 text-blue-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Principal
                          </Badge>
                        ) : (
                          <Badge variant="outline">Secundario</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(membership.joined_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {membership.is_active ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Inactivo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Logs de Auditoría */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoría</CardTitle>
              <CardDescription>
                Historial de verificaciones de permisos y accesos a datos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="permission-logs" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="permission-logs">Logs de Permisos</TabsTrigger>
                  <TabsTrigger value="data-access-logs">Logs de Acceso a Datos</TabsTrigger>
                </TabsList>

                <TabsContent value="permission-logs">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Acción</TableHead>
                        <TableHead>Recurso</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>IP</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissionLogs.slice(0, 20).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <span className="font-mono text-sm">
                              {log.user_id.slice(0, 8)}...
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              log.action === 'GRANT' || log.action === 'ACCESS' ? 'default' :
                              log.action === 'DENIED' ? 'destructive' : 'outline'
                            }>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{log.resource_type}</div>
                              <div className="text-sm text-muted-foreground">{log.resource_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {log.department_id ? (
                              <Badge variant="outline">Dept {log.department_id.slice(0, 8)}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs">{log.ip_address || '-'}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="data-access-logs">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Ruta de Datos</TableHead>
                        <TableHead>Acción</TableHead>
                        <TableHead>Resultado</TableHead>
                        <TableHead>Duración</TableHead>
                        <TableHead>Filas</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataAccessLogs.slice(0, 20).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <span className="font-mono text-sm">
                              {log.user_id.slice(0, 8)}...
                            </span>
                          </TableCell>
                          <TableCell>
                            <code className="text-sm">{log.data_path}</code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>
                            {log.success ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Exitoso
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="mr-1 h-3 w-3" />
                                Denegado
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {log.query_duration_ms || 0}ms
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {log.rows_affected || 0}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
