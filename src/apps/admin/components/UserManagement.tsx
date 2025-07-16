import React, { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { User, UserRole, UserStatus } from '@/types/users';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Progress } from '@/shared/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Users, 
  Shield, 
  Activity,
  Building,
  BarChart3
} from 'lucide-react';

interface UserTableProps {
  users: User[];
  onActionClick: (action: string, user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onActionClick }) => {
  const getRoleBadge = (role: UserRole) => {
    const styles = {
      'SUPER_ADMIN': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'ADMIN': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'MANAGER': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'EMPLOYEE': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'OWNER': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return styles[role] || styles.EMPLOYEE;
  };

  const getStatusBadge = (status: UserStatus) => {
    const styles = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'suspended': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return styles[status] || styles.inactive;
  };

  const getRoleDisplayName = (role: UserRole) => {
    const names = {
      'SUPER_ADMIN': 'Super Admin',
      'ADMIN': 'Administrador',
      'MANAGER': 'Manager',
      'EMPLOYEE': 'Empleado',
      'OWNER': 'Propietario'
    };
    return names[role] || role;
  };

  const getStatusDisplayName = (status: UserStatus) => {
    const names = {
      'active': 'Activo',
      'suspended': 'Suspendido',
      'inactive': 'Inactivo'
    };
    return names[status] || status;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Lista de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead>Uso Mensual</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getRoleBadge(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {user.department || 'Sin departamento'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusBadge(user.status)}>
                      {getStatusDisplayName(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {user.last_activity ? new Date(user.last_activity).toLocaleDateString() : 'Nunca'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <Progress value={user.monthly_usage} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground">{user.monthly_usage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onActionClick('edit', user)}>
                          Editar Usuario
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onActionClick('suspend', user)}>
                          {user.status === 'active' ? 'Suspender' : 'Activar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onActionClick('delete', user)}>
                          Eliminar Usuario
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'EMPLOYEE' as UserRole,
    department: '',
    status: 'active' as UserStatus
  });

  const {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
  } = useUsers({
    searchTerm,
    roleFilter: roleFilter || undefined,
    statusFilter: statusFilter || undefined,
  });

  const handleActionClick = async (action: string, user: User) => {
    try {
      switch (action) {
        case 'edit':
          toast.info('Función de edición en desarrollo');
          break;
        case 'suspend':
          if (user.status === 'active') {
            await suspendUser.mutateAsync(user.id);
          } else {
            await activateUser.mutateAsync(user.id);
          }
          break;
        case 'delete':
          if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
            await deleteUser.mutateAsync(user.id);
          }
          break;
      }
    } catch (error) {
      toast.error('Error al realizar la acción');
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser.mutateAsync(newUser);
      setShowCreateDialog(false);
      setNewUser({
        name: '',
        email: '',
        role: 'EMPLOYEE',
        department: '',
        status: 'active'
      });
    } catch (error) {
      toast.error('Error al crear el usuario');
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
            Error al cargar los usuarios. Por favor, intente nuevamente.
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    total: users?.length || 0,
    active: users?.filter(u => u.status === 'active').length || 0,
    suspended: users?.filter(u => u.status === 'suspended').length || 0,
    admins: users?.filter(u => u.role === 'ADMIN').length || 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo usuario
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="usuario@empresa.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Empleado</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="OWNER">Propietario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  placeholder="Departamento"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser} disabled={!newUser.name || !newUser.email}>
                Crear Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspendidos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspended}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios por nombre, email o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={(value: UserRole) => setRoleFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los roles</SelectItem>
                <SelectItem value="EMPLOYEE">Empleado</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="OWNER">Propietario</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: UserStatus) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="suspended">Suspendido</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <UserTable users={users || []} onActionClick={handleActionClick} />
      )}

      {/* Summary */}
      <div className="text-sm text-muted-foreground text-center">
        Total: {users?.length || 0} usuarios encontrados
      </div>
    </div>
  );
};

export default UserManagement; 