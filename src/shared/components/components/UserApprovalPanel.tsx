
import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock, AlertTriangle, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  company_id: string;
}

interface UserApprovalPanelProps {
  onStatsUpdate?: () => void;
}

const UserApprovalPanel = ({ onStatsUpdate }: UserApprovalPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [activeUsers, setActiveUsers] = useState<PendingUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (!user?.company?.id) return;

    try {
      // Obtener usuarios pendientes con datos mock
      const mockPendingUsers: PendingUser[] = [
        {
          id: '1',
          email: 'nuevo@empresa.com',
          full_name: 'Usuario Pendiente',
          role: 'EMPLOYEE',
          approval_status: 'PENDING',
          created_at: new Date().toISOString(),
          company_id: user.company.id
        }
      ];

      // Obtener usuarios activos con datos mock
      const mockActiveUsers: PendingUser[] = [
        {
          id: '2',
          email: 'activo@empresa.com',
          full_name: 'Usuario Activo',
          role: 'EMPLOYEE',
          approval_status: 'APPROVED',
          created_at: new Date().toISOString(),
          company_id: user.company.id
        }
      ];

      setPendingUsers(mockPendingUsers);
      setActiveUsers(mockActiveUsers);
    } catch (error) {
      // TODO: log 'Error fetching users:' error
    }
  };

  const approveUser = async (userId: string, newRole: string = 'EMPLOYEE') => {
    setLoading(true);
    try {
      // Mock para desarrollo
      toast({
        title: "Usuario Aprobado",
        description: "El usuario ha sido aprobado exitosamente.",
        variant: "default",
      });
      
      // Simular actualización local
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      fetchUsers();
      onStatsUpdate?.();
    } catch (error) {
      // TODO: log 'Error approving user:' error
      toast({
        title: "Error",
        description: "No se pudo aprobar el usuario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const rejectUser = async (userId: string, reason: string = 'No especificado') => {
    setLoading(true);
    try {
      // Mock para desarrollo
      toast({
        title: "Usuario Rechazado",
        description: "El usuario ha sido rechazado.",
        variant: "default",
      });
      
      // Simular actualización local
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      fetchUsers();
      onStatsUpdate?.();
    } catch (error) {
      // TODO: log 'Error rejecting user:' error
      toast({
        title: "Error",
        description: "No se pudo rechazar el usuario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (userId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Usuario Suspendido",
        description: "El usuario ha sido suspendido exitosamente.",
        variant: "default",
      });
      
      fetchUsers();
      onStatsUpdate?.();
    } catch (error) {
      // TODO: log 'Error suspending user:' error
      toast({
        title: "Error",
        description: "No se pudo suspender el usuario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (userId: string) => {
    // Verificar límites antes de activar
    const currentActiveUsers = activeUsers.filter(u => u.approval_status === 'APPROVED').length;
    const maxUsers = user?.company?.max_users || 5;

    if (currentActiveUsers >= maxUsers) {
      toast({
        title: "Límite Alcanzado",
        description: `No se puede activar más usuarios. Límite del plan: ${maxUsers} usuarios.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Usuario Activado",
        description: "El usuario ha sido activado exitosamente.",
        variant: "default",
      });
      
      fetchUsers();
      onStatsUpdate?.();
    } catch (error) {
      // TODO: log 'Error activating user:' error
      toast({
        title: "Error",
        description: "No se pudo activar el usuario.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPendingUsers = pendingUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActiveUsers = activeUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const styles = {
      'OWNER': 'bg-purple-500/20 text-purple-400',
      'ADMIN': 'bg-red-500/20 text-red-400',
      'MANAGER': 'bg-yellow-500/20 text-yellow-400',
      'EMPLOYEE': 'bg-green-500/20 text-green-400'
    };
    return styles[role as keyof typeof styles] || styles.EMPLOYEE;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'PENDING': 'bg-yellow-500/20 text-yellow-400',
      'APPROVED': 'bg-green-500/20 text-green-400',
      'REJECTED': 'bg-red-500/20 text-red-400'
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#1A2341] border-[#2A3451]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A9C9]">
              Usuarios Activos
            </CardTitle>
            <Users className="h-4 w-4 text-[#A0A9C9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {activeUsers.length}/{user?.company?.max_users || 5}
            </div>
            <p className="text-xs text-[#A0A9C9]">
              {activeUsers.length === user?.company?.max_users ? 'Límite alcanzado' : 'Disponibles'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A2341] border-[#2A3451]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A9C9]">
              Pendientes de Aprobación
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {pendingUsers.length}
            </div>
            <p className="text-xs text-[#A0A9C9]">
              Requieren revisión
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A2341] border-[#2A3451]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A9C9]">
              Espacios Disponibles
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#A0A9C9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {(user?.company?.max_users || 5) - activeUsers.length}
            </div>
            <p className="text-xs text-[#A0A9C9]">
              Para nuevos usuarios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-[#1A2341] border-[#2A3451]">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A0A9C9]" />
            <Input
              placeholder="Buscar usuarios por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#11181f] border-[#2A3451] text-white placeholder-gray-500 focus:border-[#4A7FFF]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Usuarios Pendientes */}
      {pendingUsers.length > 0 && (
        <Card className="bg-[#1A2341] border-[#2A3451]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              Usuarios Pendientes de Aprobación
            </CardTitle>
            <CardDescription className="text-[#A0A9C9]">
              {filteredPendingUsers.length} usuarios esperando aprobación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[#2A3451]">
                  <TableHead className="text-[#A0A9C9]">Usuario</TableHead>
                  <TableHead className="text-[#A0A9C9]">Rol Solicitado</TableHead>
                  <TableHead className="text-[#A0A9C9]">Estado</TableHead>
                  <TableHead className="text-[#A0A9C9]">Fecha Solicitud</TableHead>
                  <TableHead className="text-[#A0A9C9]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPendingUsers.map((pendingUser) => (
                  <TableRow key={pendingUser.id} className="border-[#2A3451]">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{pendingUser.full_name}</div>
                        <div className="text-sm text-[#A0A9C9]">{pendingUser.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(pendingUser.role)}`}>
                        {pendingUser.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(pendingUser.approval_status)}`}>
                        {pendingUser.approval_status}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#A0A9C9]">
                      {new Date(pendingUser.created_at).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveUser(pendingUser.id, pendingUser.role)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectUser(pendingUser.id)}
                          disabled={loading}
                          className="border-red-600 text-red-400 hover:bg-red-600/20"
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Usuarios Activos */}
      <Card className="bg-[#1A2341] border-[#2A3451]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuarios Activos
          </CardTitle>
          <CardDescription className="text-[#A0A9C9]">
            {filteredActiveUsers.length} usuarios activos en la empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#2A3451]">
                <TableHead className="text-[#A0A9C9]">Usuario</TableHead>
                <TableHead className="text-[#A0A9C9]">Rol</TableHead>
                <TableHead className="text-[#A0A9C9]">Estado</TableHead>
                <TableHead className="text-[#A0A9C9]">Fecha Ingreso</TableHead>
                <TableHead className="text-[#A0A9C9]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActiveUsers.map((activeUser) => (
                <TableRow key={activeUser.id} className="border-[#2A3451]">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{activeUser.full_name}</div>
                      <div className="text-sm text-[#A0A9C9]">{activeUser.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(activeUser.role)}`}>
                      {activeUser.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(activeUser.approval_status)}`}>
                      Activo
                    </span>
                  </TableCell>
                  <TableCell className="text-[#A0A9C9]">
                    {new Date(activeUser.created_at).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => suspendUser(activeUser.id)}
                        disabled={loading || activeUser.role === 'OWNER'}
                        className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/20"
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Suspender
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

export default UserApprovalPanel;
