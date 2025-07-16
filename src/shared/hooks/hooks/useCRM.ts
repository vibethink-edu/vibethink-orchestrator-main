// Hook personalizado para CRM con PQRS especializado
// Gestión de estado y operaciones del CRM

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/shared/hooks/hooks/useAuth';
import { 
  Customer, 
  Deal, 
  PQRSRequest, 
  Interaction, 
  Task, 
  CRMStats,
  CRMFilters 
} from '@/shared/types/crm';

interface UseCRMReturn {
  // Estado
  customers: Customer[];
  deals: Deal[];
  pqrsRequests: PQRSRequest[];
  interactions: Interaction[];
  tasks: Task[];
  stats: CRMStats | null;
  
  // Loading states
  loading: {
    customers: boolean;
    deals: boolean;
    pqrs: boolean;
    interactions: boolean;
    tasks: boolean;
    stats: boolean;
  };
  
  // Operaciones CRUD
  createCustomer: (customer: Omit<Customer, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  createDeal: (deal: Omit<Deal, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  
  createPQRS: (pqrs: Omit<PQRSRequest, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePQRS: (id: string, updates: Partial<PQRSRequest>) => Promise<void>;
  respondToPQRS: (id: string, response: string) => Promise<void>;
  
  createInteraction: (interaction: Omit<Interaction, 'id' | 'company_id' | 'created_at'>) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  
  // Filtros y búsqueda
  filters: CRMFilters;
  setFilters: (filters: CRMFilters) => void;
  searchCustomers: (query: string) => Customer[];
  searchPQRS: (query: string) => PQRSRequest[];
  
  // Utilidades
  refreshData: () => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  getPQRSById: (id: string) => PQRSRequest | undefined;
  getOverduePQRS: () => PQRSRequest[];
  getPendingTasks: () => Task[];
}

export const useCRM = (): UseCRMReturn => {
  const { user } = useAuth();
  
  // Estado principal
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pqrsRequests, setPqrsRequests] = useState<PQRSRequest[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<CRMStats | null>(null);
  
  // Estados de loading
  const [loading, setLoading] = useState({
    customers: false,
    deals: false,
    pqrs: false,
    interactions: false,
    tasks: false,
    stats: false
  });
  
  // Filtros
  const [filters, setFilters] = useState<CRMFilters>({});

  // Cargar datos iniciales
  useEffect(() => {
    if (user?.company_id) {
      loadAllData();
    }
  }, [user?.company_id]);

  const loadAllData = async () => {
    await Promise.all([
      loadCustomers(),
      loadDeals(),
      loadPQRS(),
      loadInteractions(),
      loadTasks(),
      loadStats()
    ]);
  };

  // Cargar clientes
  const loadCustomers = async () => {
    if (!user?.company_id) return;
    
    setLoading(prev => ({ ...prev, customers: true }));
    try {
      // TODO: Implementar llamada real a API
      const mockCustomers: Customer[] = [
        {
          id: '1',
          company_id: user.company_id,
          name: 'María González',
          email: 'maria@empresa.com',
          phone: '+57 300 123 4567',
          company: 'Empresa ABC',
          status: 'customer',
          source: 'website',
          tags: ['salud', 'colombia'],
          pipeline_stage: 'qualified',
          probability: 75,
          expected_value: 5000000,
          notes: [],
          created_at: '2024-01-15',
          updated_at: '2024-01-20'
        },
        {
          id: '2',
          company_id: user.company_id,
          name: 'Carlos Rodríguez',
          email: 'carlos@cliente.com',
          phone: '+57 310 987 6543',
          company: 'Clínica XYZ',
          status: 'prospect',
          source: 'referral',
          tags: ['salud', 'pqrs'],
          pipeline_stage: 'contacted',
          probability: 50,
          expected_value: 3000000,
          notes: [],
          created_at: '2024-01-10',
          updated_at: '2024-01-18'
        }
      ];
      
      setCustomers(mockCustomers);
    } catch (error) {
      // TODO: log error al cargar clientes (error) para auditoría
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  };

  // Cargar oportunidades
  const loadDeals = async () => {
    if (!user?.company_id) return;
    
    setLoading(prev => ({ ...prev, deals: true }));
    try {
      // TODO: Implementar llamada real a API
      const mockDeals: Deal[] = [
        {
          id: '1',
          company_id: user.company_id,
          customer_id: '1',
          title: 'Implementación Sistema PQRS',
          description: 'Sistema completo de gestión PQRS para clínica',
          value: 50000000,
          currency: 'COP',
          stage: 'negotiation',
          probability: 75,
          expected_close_date: '2024-02-15',
          products: [],
          notes: [],
          created_at: '2024-01-10',
          updated_at: '2024-01-20'
        }
      ];
      
      setDeals(mockDeals);
    } catch (error) {
      // TODO: log error al cargar oportunidades (error) para auditoría
    } finally {
      setLoading(prev => ({ ...prev, deals: false }));
    }
  };

  // Cargar PQRS
  const loadPQRS = async () => {
    if (!user?.company_id) return;
    
    setLoading(prev => ({ ...prev, pqrs: true }));
    try {
      // TODO: Implementar llamada real a API
      const mockPQRS: PQRSRequest[] = [
        {
          id: '1',
          company_id: user.company_id,
          customer_id: '1',
          type: 'peticion',
          subject: 'Solicitud de información sobre servicios',
          description: 'Necesito información detallada sobre los servicios de PQRS',
          status: 'pending',
          priority: 'medium',
          assigned_to: null,
          response: null,
          response_date: null,
          created_at: '2024-01-15',
          updated_at: '2024-01-15'
        }
      ];
      
      setPqrsRequests(mockPQRS);
    } catch (error) {
      // TODO: log error al cargar PQRS (error) para auditoría
    } finally {
      setLoading(prev => ({ ...prev, pqrs: false }));
    }
  };

  // Cargar interacciones
  const loadInteractions = async () => {
    if (!user?.company_id) return;
    
    setLoading(prev => ({ ...prev, interactions: true }));
    try {
      // TODO: Implementar llamada real a API
      const mockInteractions: Interaction[] = [];
      setInteractions(mockInteractions);
    } catch (error) {
      // TODO: log error al cargar interacciones (error) para auditoría
    } finally {
      setLoading(prev => ({ ...prev, interactions: false }));
    }
  };

  // Cargar tareas
  const loadTasks = async () => {
    if (!user?.company_id) return;
    
    setLoading(prev => ({ ...prev, tasks: true }));
    try {
      // TODO: Implementar llamada real a API
      const mockTasks: Task[] = [];
      setTasks(mockTasks);
    } catch (error) {
      // TODO: log error al cargar tareas (error) para auditoría
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };

  // Cargar estadísticas
  const loadStats = async () => {
    if (!user?.company_id) return;
    
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      // TODO: Implementar llamada real a API
      const mockStats: CRMStats = {
        total_customers: customers.length,
        total_deals: deals.length,
        total_pqrs: pqrsRequests.length,
        total_revenue: deals.reduce((sum, deal) => sum + deal.value, 0),
        conversion_rate: 0.25,
        avg_deal_size: deals.length > 0 ? deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length : 0
      };
      setStats(mockStats);
    } catch (error) {
      // TODO: log error al cargar estadísticas (error) para auditoría
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Operaciones CRUD para clientes
  const createCustomer = async (customerData: Omit<Customer, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.company_id) return;
    
    try {
      // TODO: Implementar llamada real a API
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        company_id: user.company_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCustomers(prev => [...prev, newCustomer]);
    } catch (error) {
      // TODO: log error al crear cliente (error) para auditoría
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      // TODO: Implementar llamada real a API
      setCustomers(prev => prev.map(customer => 
        customer.id === id 
          ? { ...customer, ...updates, updated_at: new Date().toISOString() }
          : customer
      ));
    } catch (error) {
      // TODO: log error al actualizar cliente (error) para auditoría
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      // TODO: Implementar llamada real a API
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    } catch (error) {
      // TODO: log error al eliminar cliente (error) para auditoría
    }
  };

  // Operaciones CRUD para oportunidades
  const createDeal = async (dealData: Omit<Deal, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.company_id) return;
    
    try {
      // TODO: Implementar llamada real a API
      const newDeal: Deal = {
        ...dealData,
        id: Date.now().toString(),
        company_id: user.company_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setDeals(prev => [...prev, newDeal]);
    } catch (error) {
      // TODO: log error al crear oportunidad (error) para auditoría
    }
  };

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
    try {
      // TODO: Implementar llamada real a API
      setDeals(prev => prev.map(deal => 
        deal.id === id 
          ? { ...deal, ...updates, updated_at: new Date().toISOString() }
          : deal
      ));
    } catch (error) {
      // TODO: log error al actualizar deal (error) para auditoría
    }
  };

  const deleteDeal = async (id: string) => {
    try {
      // TODO: Implementar llamada real a API
      setDeals(prev => prev.filter(deal => deal.id !== id));
    } catch (error) {
      // TODO: log error al eliminar deal (error) para auditoría
    }
  };

  // Operaciones CRUD para PQRS
  const createPQRS = async (pqrsData: Omit<PQRSRequest, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.company_id) return;
    
    try {
      // TODO: Implementar llamada real a API
      const newPQRS: PQRSRequest = {
        ...pqrsData,
        id: Date.now().toString(),
        company_id: user.company_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setPqrsRequests(prev => [...prev, newPQRS]);
    } catch (error) {
      // TODO: log error al crear PQRS (error) para auditoría
    }
  };

  const updatePQRS = async (id: string, updates: Partial<PQRSRequest>) => {
    try {
      // TODO: Implementar llamada real a API
      setPqrsRequests(prev => prev.map(pqrs => 
        pqrs.id === id 
          ? { ...pqrs, ...updates, updated_at: new Date().toISOString() }
          : pqrs
      ));
    } catch (error) {
      // TODO: log error al actualizar PQRS (error) para auditoría
    }
  };

  const respondToPQRS = async (id: string, response: string) => {
    try {
      // TODO: Implementar llamada real a API
      setPqrsRequests(prev => prev.map(pqrs => 
        pqrs.id === id 
          ? { 
              ...pqrs, 
              response, 
              response_date: new Date().toISOString(),
              status: 'responded',
              updated_at: new Date().toISOString()
            }
          : pqrs
      ));
    } catch (error) {
      // TODO: log error al responder a PQRS (error) para auditoría
    }
  };

  // Operaciones para interacciones y tareas
  const createInteraction = async (interactionData: Omit<Interaction, 'id' | 'company_id' | 'created_at'>) => {
    if (!user?.company_id) return;
    
    try {
      // TODO: Implementar llamada real a API
      const newInteraction: Interaction = {
        ...interactionData,
        id: Date.now().toString(),
        company_id: user.company_id,
        created_at: new Date().toISOString()
      };
      
      setInteractions(prev => [...prev, newInteraction]);
    } catch (error) {
      // TODO: log error al crear interacción (error) para auditoría
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.company_id) return;
    
    try {
      // TODO: Implementar llamada real a API
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        company_id: user.company_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      // TODO: log error al crear tarea (error) para auditoría
    }
  };

  // Funciones de búsqueda
  const searchCustomers = useCallback((query: string): Customer[] => {
    const lowerQuery = query.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery) ||
      customer.company.toLowerCase().includes(lowerQuery)
    );
  }, [customers]);

  const searchPQRS = useCallback((query: string): PQRSRequest[] => {
    const lowerQuery = query.toLowerCase();
    return pqrsRequests.filter(pqrs => 
      pqrs.subject.toLowerCase().includes(lowerQuery) ||
      pqrs.description.toLowerCase().includes(lowerQuery)
    );
  }, [pqrsRequests]);

  // Funciones de utilidad
  const refreshData = useCallback(async () => {
    await loadAllData();
  }, []);

  const getCustomerById = useCallback((id: string): Customer | undefined => {
    return customers.find(customer => customer.id === id);
  }, [customers]);

  const getPQRSById = useCallback((id: string): PQRSRequest | undefined => {
    return pqrsRequests.find(pqrs => pqrs.id === id);
  }, [pqrsRequests]);

  const getOverduePQRS = useCallback((): PQRSRequest[] => {
    const now = new Date();
    return pqrsRequests.filter(pqrs => {
      if (pqrs.status === 'pending') {
        const createdDate = new Date(pqrs.created_at);
        const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff > 5; // Considerar vencido después de 5 días
      }
      return false;
    });
  }, [pqrsRequests]);

  const getPendingTasks = useCallback((): Task[] => {
    return tasks.filter(task => task.status === 'pending');
  }, [tasks]);

  return {
    // Estado
    customers,
    deals,
    pqrsRequests,
    interactions,
    tasks,
    stats,
    
    // Loading states
    loading,
    
    // Operaciones CRUD
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createDeal,
    updateDeal,
    deleteDeal,
    createPQRS,
    updatePQRS,
    respondToPQRS,
    createInteraction,
    createTask,
    
    // Filtros y búsqueda
    filters,
    setFilters,
    searchCustomers,
    searchPQRS,
    
    // Utilidades
    refreshData,
    getCustomerById,
    getPQRSById,
    getOverduePQRS,
    getPendingTasks
  };
}; 