import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

interface Company {
  id: string;
  name: string;
  slug: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  company_id: string;
  created_at: string;
  updated_at: string;
  companies?: Company;
}

type UserRole = 'OWNER_CUST' | 'ADMIN_CUST' | 'MANAGER_CUST' | 'EMPLOYEE_CUST' | 'SUPPORT_AP';

interface NewUserData {
  email: string;
  full_name: string;
  role: UserRole;
  company_id: string;
}

const UserManagementPanel = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUserData>({
    email: '',
    full_name: '',
    role: 'EMPLOYEE_CUST',
    company_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('id, name, slug')
        .order('name');

      if (companiesError) throw companiesError;
      setCompanies(companiesData || []);

      // Fetch users with company info
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          companies(id, name, slug)
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      if (!newUser.email || !newUser.company_id) {
        toast.error('Email y empresa son requeridos');
        return;
      }

      // Generate a UUID for the user (simulating auth user creation)
      const userId = crypto.randomUUID();

      const userData = {
        id: userId,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        company_id: newUser.company_id,
        is_active: true
      };

      const { error } = await supabase
        .from('user_profiles')
        .insert(userData);

      if (error) throw error;

      toast.success('Usuario creado exitosamente');
      setIsCreateDialogOpen(false);
      setNewUser({
        email: '',
        full_name: '',
        role: 'EMPLOYEE_CUST',
        company_id: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error al crear el usuario');
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
      fetchData();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Error al actualizar el estado del usuario');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !selectedCompany || user.company_id === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  const getRoleBadge = (role: string) => {
    const styles = {
      'OWNER_CUST': 'bg-purple-500/20 text-purple-400',
      'ADMIN_CUST': 'bg-red-500/20 text-red-400',
      'MANAGER_CUST': 'bg-yellow-500/20 text-yellow-400',
      'EMPLOYEE_CUST': 'bg-green-500/20 text-green-400',
      'SUPPORT_AP': 'bg-blue-500/20 text-blue-400',
      'SUPER_ADMIN_AP': 'bg-purple-600/20 text-purple-300',
      'DEVELOPER_AP': 'bg-orange-500/20 text-orange-400',
      'MANAGER_AP': 'bg-indigo-500/20 text-indigo-400',
      'EMPLOYEE_AP': 'bg-gray-500/20 text-gray-400'
    };
    return styles[role as keyof typeof styles] || styles.EMPLOYEE_CUST;
  };

  const getRoleDisplayName = (role: string) => {
    const names = {
      'OWNER_CUST': 'Propietario',
      'ADMIN_CUST': 'Administrador',
      'MANAGER_CUST': 'Manager',
      'EMPLOYEE_CUST': 'Empleado',
      'SUPPORT_AP': 'Soporte AI Pair',
      'SUPER_ADMIN_AP': 'Super Admin AI Pair',
      'DEVELOPER_AP': 'Desarrollador AI Pair',
      'MANAGER_AP': 'Manager AI Pair',
      'EMPLOYEE_AP': 'Empleado AI Pair'
    };
    return names[role as keyof typeof names] || role;
  };

  if (loading) {
    return <div className="text-white">Cargando usuarios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
          <p className="text-[#A0A9C9]">Administra usuarios de todas las empresas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#4A7FFF] hover:bg-[#3A6FEF] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A2341] border-[#2A3451]">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nuevo Usuario</DialogTitle>
              <DialogDescription className="text-[#A0A9C9]">
                Crea un nuevo usuario y asígnalo a una empresa
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Email</Label>
                <Input
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="usuario@empresa.com"
                  className="bg-[#2A3451] border-[#3A4561] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Nombre Completo</Label>
                <Input
                  value={newUser.full_name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Nombre completo"
                  className="bg-[#2A3451] border-[#3A4561] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Empresa</Label>
                <Select value={newUser.company_id} onValueChange={(value) => setNewUser(prev => ({ ...prev, company_id: value }))}>
                  <SelectTrigger className="bg-[#2A3451] border-[#3A4561] text-white">
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A3451] border-[#3A4561]">
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id} className="text-white">
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Rol</Label>
                <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="bg-[#2A3451] border-[#3A4561] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A3451] border-[#3A4561]">
                    <SelectItem value="OWNER_CUST" className="text-white">OWNER_CUST</SelectItem>
                    <SelectItem value="ADMIN_CUST" className="text-white">ADMIN_CUST</SelectItem>
                    <SelectItem value="MANAGER_CUST" className="text-white">MANAGER_CUST</SelectItem>
                    <SelectItem value="EMPLOYEE_CUST" className="text-white">EMPLOYEE_CUST</SelectItem>
                    <SelectItem value="SUPPORT_AP" className="text-white">SUPPORT_AP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createUser} className="w-full bg-[#4A7FFF] hover:bg-[#3A6FEF] text-white">
                Crear Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-[#1A2341] border-[#2A3451]">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A0A9C9]" />
              <Input
                placeholder="Buscar por email o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#11181f] border-[#2A3451] text-white placeholder-gray-500"
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-64 bg-[#2A3451] border-[#3A4561] text-white">
                <SelectValue placeholder="Filtrar por empresa" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A3451] border-[#3A4561]">
                <SelectItem value="" className="text-white">Todas las empresas</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id} className="text-white">
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#1A2341] border-[#2A3451]">
        <CardHeader>
          <CardTitle className="text-white">Usuarios del Sistema</CardTitle>
          <CardDescription className="text-[#A0A9C9]">
            {filteredUsers.length} usuarios encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#2A3451]">
                <TableHead className="text-[#A0A9C9]">Usuario</TableHead>
                <TableHead className="text-[#A0A9C9]">Empresa</TableHead>
                <TableHead className="text-[#A0A9C9]">Rol</TableHead>
                <TableHead className="text-[#A0A9C9]">Estado</TableHead>
                <TableHead className="text-[#A0A9C9]">Fecha Creación</TableHead>
                <TableHead className="text-[#A0A9C9]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-[#2A3451]">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{user.full_name || 'Sin nombre'}</div>
                      <div className="text-sm text-[#A0A9C9]">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#A0A9C9]">
                    {(user.companies as any)?.name || 'Sin empresa'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#A0A9C9]">
                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className="border-[#2A3451] text-[#A0A9C9] hover:text-white"
                      >
                        {user.is_active ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPanel;
