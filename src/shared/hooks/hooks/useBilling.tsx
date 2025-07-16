import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface BillingPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: {
    COP: number;
    USD: number;
    EUR: number;
  };
  trialDays: number;
  limits: {
    users: number;
    aiRequests: number;
    scrapingPages: number;
    storageGB: number;
  };
  features: string[];
}

interface Subscription {
  id: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart: string;
  trialEnd: string;
  plan: BillingPlan;
  cancelAtPeriodEnd: boolean;
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  created: string;
  dueDate: string;
  paidAt?: string;
  pdfUrl?: string;
}

interface UsageMetrics {
  aiRequests: number;
  scrapingPages: number;
  storageGB: number;
  activeUsers: number;
  costPerAIRequest: number;
}

// Planes optimizados para Colombia
const COLOMBIAN_PLANS: BillingPlan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    displayName: 'Iniciador',
    description: 'Perfecto para pequeñas empresas que quieren empezar con IA',
    price: {
      COP: 99000,
      USD: 25,
      EUR: 23
    },
    trialDays: 14,
    limits: {
      users: 5,
      aiRequests: 500,
      scrapingPages: 100,
      storageGB: 10
    },
    features: [
      'Asistente Universal básico',
      'Integración Google Workspace',
      'Soporte por email',
      '5 empleados',
      '500 consultas AI/mes'
    ]
  },
  {
    id: 'professional',
    name: 'PROFESSIONAL',
    displayName: 'Profesional',
    description: 'Para empresas en crecimiento que necesitan más potencia',
    price: {
      COP: 299000,
      USD: 75,
      EUR: 69
    },
    trialDays: 14,
    limits: {
      users: 25,
      aiRequests: 2500,
      scrapingPages: 500,
      storageGB: 50
    },
    features: [
      'Todo del plan Starter',
      'Asistente AI avanzado',
      'Soporte prioritario',
      'API access',
      '25 empleados',
      '2,500 consultas AI/mes'
    ]
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    displayName: 'Empresarial',
    description: 'Solución completa para grandes organizaciones',
    price: {
      COP: 799000,
      USD: 200,
      EUR: 185
    },
    trialDays: 14,
    limits: {
      users: -1,
      aiRequests: 10000,
      scrapingPages: 2000,
      storageGB: 200
    },
    features: [
      'Todo del plan Professional',
      'Asistente AI empresarial',
      'Soporte dedicado 24/7',
      'Single Sign-On (SSO)',
      'White Label',
      'Empleados ilimitados'
    ]
  }
];

export const useBilling = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<UsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de billing
  useEffect(() => {
    if (user?.company_id) {
      loadBillingData();
    }
  }, [user?.company_id]);

  const loadBillingData = async () => {
    setLoading(true);
    try {
      // Simular carga de datos (en producción vendría de Stripe + Supabase)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock subscription data
      const mockSubscription: Subscription = {
        id: 'sub_123456789',
        status: 'trialing',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        trialStart: new Date().toISOString(),
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        plan: COLOMBIAN_PLANS[1], // Professional plan
        cancelAtPeriodEnd: false
      };

      // Mock invoices
      const mockInvoices: Invoice[] = [
        {
          id: 'inv_123',
          number: 'INV-2024-001',
          amount: 299000,
          currency: 'cop',
          status: 'paid',
          created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          pdfUrl: '/invoices/inv_123.pdf'
        }
      ];

      // Mock usage data
      const mockUsage: UsageMetrics = {
        aiRequests: 1250,
        scrapingPages: 250,
        storageGB: 25,
        activeUsers: 8,
        costPerAIRequest: 0.02
      };

      setSubscription(mockSubscription);
      setInvoices(mockInvoices);
      setUsage(mockUsage);
    } catch (err) {
      setError('Error cargando datos de facturación');
      console.error('Error loading billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear suscripción con trial
  const createSubscription = async (
    planId: string,
    paymentMethodId: string,
    currency: string = 'cop'
  ) => {
    try {
      setLoading(true);
      
      // Simular creación de suscripción en Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedPlan = COLOMBIAN_PLANS.find(p => p.id === planId);
      if (!selectedPlan) {
        throw new Error('Plan no encontrado');
      }

      const newSubscription: Subscription = {
        id: `sub_${Math.random().toString(36).substr(2, 9)}`,
        status: 'trialing',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        trialStart: new Date().toISOString(),
        trialEnd: new Date(Date.now() + selectedPlan.trialDays * 24 * 60 * 60 * 1000).toISOString(),
        plan: selectedPlan,
        cancelAtPeriodEnd: false
      };

      setSubscription(newSubscription);
      return newSubscription;
    } catch (err) {
      setError('Error creando suscripción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cambiar plan
  const changePlan = async (newPlanId: string) => {
    if (!subscription) return;

    try {
      setLoading(true);
      
      // Simular cambio de plan
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPlan = COLOMBIAN_PLANS.find(p => p.id === newPlanId);
      if (!newPlan) {
        throw new Error('Plan no encontrado');
      }

      const updatedSubscription: Subscription = {
        ...subscription,
        plan: newPlan
      };

      setSubscription(updatedSubscription);
      return updatedSubscription;
    } catch (err) {
      setError('Error cambiando plan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar suscripción
  const cancelSubscription = async (cancelAtPeriodEnd: boolean = true) => {
    if (!subscription) return;

    try {
      setLoading(true);
      
      // Simular cancelación
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedSubscription: Subscription = {
        ...subscription,
        cancelAtPeriodEnd
      };

      setSubscription(updatedSubscription);
      return updatedSubscription;
    } catch (err) {
      setError('Error cancelando suscripción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener factura PDF
  const getInvoicePDF = async (invoiceId: string) => {
    try {
      // Simular descarga de PDF
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        throw new Error('Factura no encontrada');
      }

      // Aquí iría la lógica real de generación/descarga de PDF
      console.log('Descargando PDF para factura:', invoice.number);
      
      return invoice.pdfUrl;
    } catch (err) {
      setError('Error descargando factura');
      throw err;
    }
  };

  // Enviar factura por email
  const sendInvoiceEmail = async (invoiceId: string, email: string) => {
    try {
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        throw new Error('Factura no encontrada');
      }

      // Aquí iría la lógica real de envío de email
      console.log('Enviando factura por email:', invoice.number, 'a', email);
      
      return true;
    } catch (err) {
      setError('Error enviando factura por email');
      throw err;
    }
  };

  // Obtener métricas de uso
  const getUsageMetrics = async () => {
    try {
      // Simular carga de métricas
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockUsage: UsageMetrics = {
        aiRequests: Math.floor(Math.random() * 2000) + 500,
        scrapingPages: Math.floor(Math.random() * 800) + 100,
        storageGB: Math.floor(Math.random() * 40) + 10,
        activeUsers: Math.floor(Math.random() * 20) + 1,
        costPerAIRequest: 0.02
      };

      setUsage(mockUsage);
      return mockUsage;
    } catch (err) {
      setError('Error cargando métricas de uso');
      throw err;
    }
  };

  // Calcular días restantes de trial
  const getTrialDaysRemaining = () => {
    if (!subscription || subscription.status !== 'trialing') {
      return 0;
    }

    const trialEnd = new Date(subscription.trialEnd);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  // Verificar si está en trial
  const isInTrial = () => {
    return subscription?.status === 'trialing';
  };

  // Verificar si el trial está por vencer (últimos 3 días)
  const isTrialEndingSoon = () => {
    const daysRemaining = getTrialDaysRemaining();
    return daysRemaining <= 3 && daysRemaining > 0;
  };

  // Obtener plan actual
  const getCurrentPlan = () => {
    return subscription?.plan || null;
  };

  // Verificar límites de uso
  const checkUsageLimits = (operation: 'ai' | 'scraping' | 'storage' | 'users') => {
    if (!subscription?.plan || !usage) return { allowed: true, remaining: 0 };

    const limits = subscription.plan.limits;
    
    switch (operation) {
      case 'ai':
        return {
          allowed: usage.aiRequests < limits.aiRequests,
          remaining: Math.max(0, limits.aiRequests - usage.aiRequests)
        };
      case 'scraping':
        return {
          allowed: usage.scrapingPages < limits.scrapingPages,
          remaining: Math.max(0, limits.scrapingPages - usage.scrapingPages)
        };
      case 'storage':
        return {
          allowed: usage.storageGB < limits.storageGB,
          remaining: Math.max(0, limits.storageGB - usage.storageGB)
        };
      case 'users':
        return {
          allowed: limits.users === -1 || usage.activeUsers < limits.users,
          remaining: limits.users === -1 ? -1 : Math.max(0, limits.users - usage.activeUsers)
        };
      default:
        return { allowed: true, remaining: 0 };
    }
  };

  return {
    // Data
    subscription,
    invoices,
    usage,
    plans: COLOMBIAN_PLANS,
    
    // State
    loading,
    error,
    
    // Actions
    createSubscription,
    changePlan,
    cancelSubscription,
    getInvoicePDF,
    sendInvoiceEmail,
    getUsageMetrics,
    
    // Utilities
    getTrialDaysRemaining,
    isInTrial,
    isTrialEndingSoon,
    getCurrentPlan,
    checkUsageLimits,
    
    // Refresh
    loadBillingData
  };
}; 