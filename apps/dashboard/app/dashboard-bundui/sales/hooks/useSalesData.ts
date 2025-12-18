import { useState, useEffect, useCallback } from 'react'
import { 
  Sale, 
  SalesRep, 
  SaleActivity, 
  SalesTarget, 
  SalesMetrics,
  UseSalesDataReturn 
} from '../types'

// Mock auth hook - in real app this would come from your auth system
const useAuth = () => ({
  user: {
    id: 'user_1',
    company_id: 'comp1', // CRITICAL: Multi-tenant security
    email: 'user@company.com',
    role: 'manager'
  }
})

// Mock Supabase client - in real app this would be your actual Supabase client
const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) => ({
          // Mock query response
          then: (callback: (result: any) => void) => {
            // Simulate API call delay
            setTimeout(() => {
              callback({ data: getMockData(table), error: null })
            }, 500)
            return Promise.resolve({ data: getMockData(table), error: null })
          }
        })
      })
    })
  })
}

// Mock data generator
const getMockData = (table: string) => {
  switch (table) {
    case 'sales':
      return mockSales
    case 'sales_reps':
      return mockSalesReps
    case 'sales_activities':
      return mockActivities
    case 'sales_targets':
      return mockTargets
    default:
      return []
  }
}

// Mock data
const mockSales: Sale[] = [
  {
    id: '1',
    title: 'Enterprise Software License',
    customer_name: 'Acme Corporation',
    customer_email: 'john@acme.com',
    customer_company: 'Acme Corp',
    amount: 45000,
    stage: 'negotiating',
    probability: 80,
    close_date: '2024-02-15',
    created_at: '2024-01-10',
    updated_at: '2024-01-28',
    company_id: 'comp1',
    sales_rep_id: 'rep1',
    sales_rep_name: 'Sarah Johnson',
    source: 'inbound'
  },
  {
    id: '2',
    title: 'CRM Implementation',
    customer_name: 'TechStart Inc',
    customer_email: 'mary@techstart.io',
    customer_company: 'TechStart Inc',
    amount: 28000,
    stage: 'proposal',
    probability: 60,
    close_date: '2024-02-28',
    created_at: '2024-01-05',
    updated_at: '2024-01-25',
    company_id: 'comp1',
    sales_rep_id: 'rep2',
    sales_rep_name: 'Mike Chen',
    source: 'referral'
  }
]

const mockSalesReps: SalesRep[] = [
  {
    id: 'rep1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'senior',
    territory: 'North America',
    commission_rate: 0.15,
    created_at: '2023-01-15',
    updated_at: '2024-01-28',
    company_id: 'comp1',
    monthly_quota: 100000,
    deals_closed: 47,
    total_revenue: 485000,
    conversion_rate: 32.5
  },
  {
    id: 'rep2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'senior',
    territory: 'West Coast',
    commission_rate: 0.14,
    created_at: '2023-02-01',
    updated_at: '2024-01-27',
    company_id: 'comp1',
    monthly_quota: 95000,
    deals_closed: 38,
    total_revenue: 421000,
    conversion_rate: 28.7
  }
]

const mockActivities: SaleActivity[] = [
  {
    id: '1',
    sale_id: 'sale_1',
    type: 'stage_change',
    title: 'Deal moved to Closing',
    description: 'Enterprise Software License moved from Negotiating to Closing stage',
    created_at: '2024-01-28T14:30:00Z',
    created_by: 'sarah_johnson',
    company_id: 'comp1'
  }
]

const mockTargets: SalesTarget[] = [
  {
    id: '1',
    sales_rep_id: 'rep1',
    period: 'monthly',
    quota: 100000,
    achieved: 85000,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    created_at: '2024-01-01',
    updated_at: '2024-01-28',
    company_id: 'comp1',
    progress_percentage: 85,
    remaining_quota: 15000,
    days_remaining: 3,
    projected_achievement: 92000
  }
]

/**
 * Custom hook for fetching and managing sales data
 * 
 * Features:
 * - Multi-tenant security with company_id filtering
 * - Real-time data fetching and caching
 * - Error handling and loading states
 * - Data refresh capabilities
 * - Metrics calculation
 * 
 * Security: ALL queries are filtered by company_id to ensure data isolation
 */
export const useSalesData = (): UseSalesDataReturn => {
  const { user } = useAuth()
  
  // State management
  const [sales, setSales] = useState<Sale[]>([])
  const [salesReps, setSalesReps] = useState<SalesRep[]>([])
  const [activities, setActivities] = useState<SaleActivity[]>([])
  const [targets, setTargets] = useState<SalesTarget[]>([])
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch sales data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchSales = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('created_at', { ascending: false })

      if (error) throw error
      setSales(data || [])
    } catch (err) {
      console.error('Error fetching sales:', err)
      setError('Failed to fetch sales data')
    }
  }, [user?.company_id])

  /**
   * Fetch sales reps data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchSalesReps = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('sales_reps')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('total_revenue', { ascending: false })

      if (error) throw error
      setSalesReps(data || [])
    } catch (err) {
      console.error('Error fetching sales reps:', err)
      setError('Failed to fetch sales reps data')
    }
  }, [user?.company_id])

  /**
   * Fetch activities data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchActivities = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('sales_activities')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('created_at', { ascending: false })

      if (error) throw error
      setActivities(data || [])
    } catch (err) {
      console.error('Error fetching activities:', err)
      setError('Failed to fetch activities data')
    }
  }, [user?.company_id])

  /**
   * Fetch targets data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchTargets = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('sales_targets')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('end_date', { ascending: true })

      if (error) throw error
      setTargets(data || [])
    } catch (err) {
      console.error('Error fetching targets:', err)
      setError('Failed to fetch targets data')
    }
  }, [user?.company_id])

  /**
   * Calculate sales metrics from current data
   */
  const calculateMetrics = useCallback((
    salesData: Sale[], 
    repsData: SalesRep[], 
    targetsData: SalesTarget[]
  ): SalesMetrics => {
    const totalRevenue = salesData
      .filter(sale => sale.stage === 'won')
      .reduce((sum, sale) => sum + sale.amount, 0)

    const dealsClosed = salesData.filter(sale => sale.stage === 'won').length
    const activeProspects = salesData.filter(sale => 
      ['prospecting', 'qualifying', 'demo', 'proposal', 'negotiating', 'closing'].includes(sale.stage)
    ).length

    const totalDeals = salesData.length
    const conversionRate = totalDeals > 0 ? (dealsClosed / totalDeals) * 100 : 0

    const averageDealSize = dealsClosed > 0 ? totalRevenue / dealsClosed : 0

    // Calculate pipeline value (weighted by probability)
    const pipelineValue = salesData
      .filter(sale => sale.stage !== 'won' && sale.stage !== 'lost')
      .reduce((sum, sale) => sum + (sale.amount * (sale.probability / 100)), 0)

    // Mock sales cycle length (would be calculated from actual data)
    const salesCycleLength = 42

    // Calculate quota attainment
    const totalQuota = targetsData.reduce((sum, target) => sum + target.quota, 0)
    const totalAchieved = targetsData.reduce((sum, target) => sum + target.achieved, 0)
    const quotaAttainment = totalQuota > 0 ? (totalAchieved / totalQuota) * 100 : 0

    // Mock growth metrics (would be calculated from historical data)
    const monthlyGrowth = {
      revenue: 15,
      deals: 8,
      prospects: 12
    }

    // Top performers (sorted by revenue)
    const topPerformers = repsData
      .slice()
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 5)

    // Mock pipeline by stage data
    const pipelineByStage = [
      { stage: 'prospecting', count: 45, value: 125000, percentage: 25, color: 'hsl(var(--chart-1))' },
      { stage: 'qualifying', count: 32, value: 189000, percentage: 18, color: 'hsl(var(--chart-2))' },
      { stage: 'demo', count: 28, value: 245000, percentage: 16, color: 'hsl(var(--chart-3))' },
      { stage: 'proposal', count: 18, value: 167000, percentage: 10, color: 'hsl(var(--chart-4))' },
      { stage: 'negotiating', count: 12, value: 145000, percentage: 7, color: 'hsl(var(--chart-5))' },
      { stage: 'closing', count: 8, value: 128000, percentage: 4, color: 'hsl(142 76% 36%)' }
    ] as any

    // Mock revenue by period data
    const revenueByPeriod = [
      { period: 'Jan', revenue: 285000, deals: 23, target: 300000 },
      { period: 'Feb', revenue: 310000, deals: 28, target: 320000 },
      { period: 'Mar', revenue: 295000, deals: 25, target: 315000 }
    ] as any

    return {
      totalRevenue,
      dealsClosed,
      conversionRate: Math.round(conversionRate * 10) / 10,
      activeProspects,
      averageDealSize: Math.round(averageDealSize),
      salesCycleLength,
      pipelineValue: Math.round(pipelineValue),
      quotaAttainment: Math.round(quotaAttainment * 10) / 10,
      monthlyGrowth,
      topPerformers,
      bestDeals: salesData.slice(0, 5),
      pipelineByStage,
      revenueByPeriod
    }
  }, [])

  /**
   * Refresh all data
   */
  const refreshAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      await Promise.all([
        fetchSales(),
        fetchSalesReps(),
        fetchActivities(),
        fetchTargets()
      ])
    } catch (err) {
      console.error('Error refreshing data:', err)
      setError('Failed to refresh data')
    } finally {
      setLoading(false)
    }
  }, [fetchSales, fetchSalesReps, fetchActivities, fetchTargets])

  /**
   * Individual refresh functions
   */
  const refreshSales = useCallback(async () => {
    await fetchSales()
  }, [fetchSales])

  const refreshReps = useCallback(async () => {
    await fetchSalesReps()
  }, [fetchSalesReps])

  const refreshTargets = useCallback(async () => {
    await fetchTargets()
  }, [fetchTargets])

  const refreshActivities = useCallback(async () => {
    await fetchActivities()
  }, [fetchActivities])

  /**
   * Calculate metrics whenever data changes
   */
  useEffect(() => {
    if (sales.length > 0 || salesReps.length > 0 || targets.length > 0) {
      const calculatedMetrics = calculateMetrics(sales, salesReps, targets)
      setMetrics(calculatedMetrics)
    }
  }, [sales, salesReps, targets, calculateMetrics])

  /**
   * Initial data fetch
   */
  useEffect(() => {
    if (user?.company_id) {
      refreshAll()
    }
  }, [user?.company_id, refreshAll])

  return {
    sales,
    salesReps,
    activities,
    targets,
    metrics,
    loading,
    error,
    refreshSales,
    refreshReps,
    refreshTargets,
    refreshActivities,
    refreshAll
  }
}