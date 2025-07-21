import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User, UserRole, UserStatus } from '@/shared/types/users';

interface UseUsersOptions {
  searchTerm?: string;
  departmentId?: string;
  roleFilter?: UserRole;
  statusFilter?: UserStatus;
}

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    name: 'María García',
    email: 'maria.garcia@empresa.com',
    role: 'ADMIN',
    department: 'Administración',
    status: 'active',
    last_activity: '2024-01-15T10:30:00Z',
    monthly_usage: 75,
    avatar_url: undefined,
    company_id: 'company-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos.lopez@empresa.com',
    role: 'MANAGER',
    department: 'Ventas',
    status: 'active',
    last_activity: '2024-01-15T09:15:00Z',
    monthly_usage: 45,
    avatar_url: undefined,
    company_id: 'company-1',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@empresa.com',
    role: 'EMPLOYEE',
    department: 'Marketing',
    status: 'active',
    last_activity: '2024-01-15T08:45:00Z',
    monthly_usage: 30,
    avatar_url: undefined,
    company_id: 'company-1',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-15T08:45:00Z'
  },
  {
    id: '4',
    name: 'Luis Rodríguez',
    email: 'luis.rodriguez@empresa.com',
    role: 'EMPLOYEE',
    department: 'Desarrollo',
    status: 'suspended',
    last_activity: '2024-01-10T16:20:00Z',
    monthly_usage: 90,
    avatar_url: undefined,
    company_id: 'company-1',
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-10T16:20:00Z'
  },
  {
    id: '5',
    name: 'Sofia Torres',
    email: 'sofia.torres@empresa.com',
    role: 'MANAGER',
    department: 'Recursos Humanos',
    status: 'active',
    last_activity: '2024-01-15T11:00:00Z',
    monthly_usage: 60,
    avatar_url: undefined,
    company_id: 'company-1',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  }
];

export const useUsers = (options: UseUsersOptions = {}) => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { searchTerm, departmentId, roleFilter, statusFilter } = options;

  // Fetch users query
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', currentUser?.company?.id, searchTerm, departmentId, roleFilter, statusFilter],
    queryFn: async () => {
      if (!currentUser?.company?.id) {
        // Return mock data for development
        // TODO: log no company ID found, using mock data
        return mockUsers;
      }

      let query = supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          role,
          department,
          status,
          last_activity,
          monthly_usage,
          avatar_url,
          company_id,
          created_at,
          updated_at
        `)
        .eq('company_id', currentUser.company.id);

      // Apply filters
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%`);
      }
      if (departmentId) {
        query = query.eq('department', departmentId);
      }
      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        // TODO: log database error, using mock data
        return mockUsers;
      }

      return data as User[];
    },
    enabled: true, // Always enabled to show mock data
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create user mutation
  const createUser = useMutation({
    mutationFn: async (newUser: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
      if (!currentUser?.company?.id) {
        // Simulate creation for mock data
        const createdUser: User = {
          ...newUser,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return createdUser;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            ...newUser,
            company_id: currentUser.company.id,
            status: 'active' as UserStatus,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
    },
    onError: (error) => {
      // TODO: log error creating user
      toast.error('Error al crear el usuario');
    }
  });

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<User> & { id: string }) => {
      if (!currentUser?.company?.id) {
        // Simulate update for mock data
        return { id, ...updates, updated_at: new Date().toISOString() } as User;
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error) => {
      // TODO: log error updating user
      toast.error('Error al actualizar el usuario');
    }
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      if (!currentUser?.company?.id) {
        // Simulate deletion for mock data
        return;
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error) => {
      // TODO: log error deleting user
      toast.error('Error al eliminar el usuario');
    }
  });

  // Suspend user mutation
  const suspendUser = useMutation({
    mutationFn: async (userId: string) => {
      if (!currentUser?.company?.id) {
        // Simulate suspension for mock data
        return { id: userId, status: 'suspended' as UserStatus, updated_at: new Date().toISOString() } as User;
      }

      const { data, error } = await supabase
        .from('users')
        .update({ status: 'suspended' as UserStatus })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario suspendido exitosamente');
    },
    onError: (error) => {
      // TODO: log error suspending user
      toast.error('Error al suspender el usuario');
    }
  });

  // Activate user mutation
  const activateUser = useMutation({
    mutationFn: async (userId: string) => {
      if (!currentUser?.company?.id) {
        // Simulate activation for mock data
        return { id: userId, status: 'active' as UserStatus, updated_at: new Date().toISOString() } as User;
      }

      const { data, error } = await supabase
        .from('users')
        .update({ status: 'active' as UserStatus })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario activado exitosamente');
    },
    onError: (error) => {
      // TODO: log error activating user
      toast.error('Error al activar el usuario');
    }
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
  };
}; 