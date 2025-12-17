/**
 * Hook para gestión de objetos CRM personalizables
 * Inspirado en la arquitectura de Attio - Objetos y Listas
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CRMObject, 
  CRMObjectAttribute, 
  CRMAttributeType,
  CRMQuery,
  CRMFilter,
  CRMListResponse,
  CRMResponse 
} from '@/shared/types/crm';

interface UseCRMObjectsOptions {
  objectType?: string;
  autoRefresh?: boolean;
  pageSize?: number;
}

interface UseCRMObjectsReturn {
  // Objetos
  objects: CRMObject[];
  isLoading: boolean;
  error: Error | null;
  
  // Operaciones CRUD
  createObject: (object: Partial<CRMObject>) => Promise<CRMObject>;
  updateObject: (id: string, updates: Partial<CRMObject>) => Promise<CRMObject>;
  deleteObject: (id: string) => Promise<void>;
  archiveObject: (id: string) => Promise<void>;
  
  // Atributos
  addAttribute: (objectId: string, attribute: Partial<CRMObjectAttribute>) => Promise<CRMObjectAttribute>;
  updateAttribute: (objectId: string, attributeId: string, updates: Partial<CRMObjectAttribute>) => Promise<CRMObjectAttribute>;
  deleteAttribute: (objectId: string, attributeId: string) => Promise<void>;
  
  // Consultas y filtros
  queryObjects: (query: CRMQuery) => Promise<CRMListResponse<CRMObject>>;
  filterObjects: (filters: CRMFilter[]) => void;
  clearFilters: () => void;
  
  // Paginación
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  loadMore: () => void;
  
  // Utilidades
  getObjectBySlug: (slug: string) => CRMObject | undefined;
  getStandardObjects: () => CRMObject[];
  getCustomObjects: () => CRMObject[];
}

export const useCRMObjects = (options: UseCRMObjectsOptions = {}): UseCRMObjectsReturn => {
  const { user, hasPermission } = useAuth();
  const queryClient = useQueryClient();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CRMFilter[]>([]);
  const [pageSize] = useState(options.pageSize || 20);

  // Query key para cache
  const queryKey = ['crm-objects', user?.company_id, currentPage, filters, options.objectType];

  // Fetch objetos CRM
  const {
    data: objectsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<CRMListResponse<CRMObject>> => {
      if (!user?.company_id) throw new Error('Usuario no autenticado');
      
      const query: CRMQuery = {
        object_type: options.objectType || 'all',
        filters: [
          { field: 'company_id', operator: 'equals', value: user.company_id },
          ...filters
        ],
        sort: [{ field: 'created_at', direction: 'desc' }],
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      };

      const response = await fetch('/api/crm/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      });

      if (!response.ok) {
        throw new Error('Error al cargar objetos CRM');
      }

      return response.json();
    },
    enabled: !!user?.company_id && hasPermission('CRM_READ'),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutaciones CRUD
  const createMutation = useMutation({
    mutationFn: async (object: Partial<CRMObject>): Promise<CRMObject> => {
      const response = await fetch('/api/crm/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...object,
          company_id: user?.company_id
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear objeto');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-objects'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CRMObject> }): Promise<CRMObject> => {
      const response = await fetch(`/api/crm/objects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar objeto');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-objects'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/crm/objects/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar objeto');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-objects'] });
    }
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/crm/objects/${id}/archive`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Error al archivar objeto');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-objects'] });
    }
  });

  // Mutaciones para atributos
  const addAttributeMutation = useMutation({
    mutationFn: async ({ objectId, attribute }: { objectId: string; attribute: Partial<CRMObjectAttribute> }): Promise<CRMObjectAttribute> => {
      const response = await fetch(`/api/crm/objects/${objectId}/attributes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...attribute,
          company_id: user?.company_id,
          object_id: objectId
        })
      });

      if (!response.ok) {
        throw new Error('Error al agregar atributo');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-objects'] });
    }
  });

  // Funciones de utilidad
  const getObjectBySlug = useCallback((slug: string): CRMObject | undefined => {
    return objectsData?.data.find(obj => obj.slug === slug);
  }, [objectsData]);

  const getStandardObjects = useCallback((): CRMObject[] => {
    return objectsData?.data.filter(obj => obj.is_standard) || [];
  }, [objectsData]);

  const getCustomObjects = useCallback((): CRMObject[] => {
    return objectsData?.data.filter(obj => !obj.is_standard) || [];
  }, [objectsData]);

  const filterObjects = useCallback((newFilters: CRMFilter[]) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
    setCurrentPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (objectsData?.has_more) {
      setCurrentPage(prev => prev + 1);
    }
  }, [objectsData?.has_more]);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (options.autoRefresh) {
      const interval = setInterval(() => {
        refetch();
      }, 30000); // 30 segundos

      return () => clearInterval(interval);
    }
  }, [options.autoRefresh, refetch]);

  return {
    // Datos
    objects: objectsData?.data || [],
    isLoading,
    error,
    
    // Operaciones CRUD
    createObject: createMutation.mutateAsync,
    updateObject: (id: string, updates: Partial<CRMObject>) => updateMutation.mutateAsync({ id, updates }),
    deleteObject: deleteMutation.mutateAsync,
    archiveObject: archiveMutation.mutateAsync,
    
    // Atributos
    addAttribute: (objectId: string, attribute: Partial<CRMObjectAttribute>) => 
      addAttributeMutation.mutateAsync({ objectId, attribute }),
    updateAttribute: () => Promise.reject(new Error('No implementado')),
    deleteAttribute: () => Promise.reject(new Error('No implementado')),
    
    // Consultas
    queryObjects: async (query: CRMQuery) => {
      const response = await fetch('/api/crm/objects/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      });
      return response.json();
    },
    filterObjects,
    clearFilters,
    
    // Paginación
    currentPage,
    totalPages: Math.ceil((objectsData?.total || 0) / pageSize),
    hasMore: objectsData?.has_more || false,
    loadMore,
    
    // Utilidades
    getObjectBySlug,
    getStandardObjects,
    getCustomObjects
  };
}; 
