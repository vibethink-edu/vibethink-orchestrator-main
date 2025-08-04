import { useState, useEffect, useCallback } from 'react'
import { 
  Revenue, 
  Expense, 
  Budget, 
  CashFlow, 
  FinancialAccount,
  FinancialMetrics,
  UseFinanceDataReturn,
  CategoryData,
  CashFlowData,
  RevenueData,
  ExpenseData,
  FinancialInsight
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
    case 'revenues':
      return mockRevenues
    case 'expenses':
      return mockExpenses
    case 'budgets':
      return mockBudgets
    case 'cash_flows':
      return mockCashFlows
    case 'financial_accounts':
      return mockAccounts
    default:
      return []
  }
}

// Mock financial data
const mockRevenues: Revenue[] = [
  {
    id: 'rev1',
    company_id: 'comp1',
    amount: 125000,
    currency: 'USD',
    category: 'sales',
    source: 'Product Sales - Enterprise',
    date: '2024-01-15',
    description: 'Q1 Enterprise software licenses',
    recurring: true,
    customer_name: 'Acme Corporation',
    payment_method: 'bank_transfer',
    status: 'received',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'rev2',
    company_id: 'comp1',
    amount: 85000,
    currency: 'USD',
    category: 'services',
    source: 'Consulting Services',
    date: '2024-01-10',
    description: 'Implementation and training services',
    recurring: false,
    customer_name: 'TechStart Inc',
    payment_method: 'credit_card',
    status: 'received',
    created_at: '2024-01-10T14:20:00Z',
    updated_at: '2024-01-10T14:20:00Z'
  },
  {
    id: 'rev3',
    company_id: 'comp1',
    amount: 45000,
    currency: 'USD',
    category: 'subscriptions',
    source: 'Monthly Subscriptions',
    date: '2024-01-01',
    description: 'January subscription renewals',
    recurring: true,
    payment_method: 'stripe',
    status: 'received',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

const mockExpenses: Expense[] = [
  {
    id: 'exp1',
    company_id: 'comp1',
    amount: 15000,
    currency: 'USD',
    category: 'salaries',
    vendor: 'Payroll System',
    date: '2024-01-31',
    description: 'January payroll',
    status: 'paid',
    payment_method: 'bank_transfer',
    approval_required: false,
    department: 'Engineering',
    created_at: '2024-01-31T23:59:00Z',
    updated_at: '2024-01-31T23:59:00Z'
  },
  {
    id: 'exp2',
    company_id: 'comp1',
    amount: 3500,
    currency: 'USD',
    category: 'marketing',
    vendor: 'AdWords Campaign',
    date: '2024-01-20',
    description: 'Google Ads campaign for Q1',
    status: 'paid',
    payment_method: 'credit_card',
    approval_required: true,
    approved_by: 'manager_1',
    approved_at: '2024-01-19T15:30:00Z',
    department: 'Marketing',
    tags: ['advertising', 'digital'],
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-20T09:15:00Z'
  },
  {
    id: 'exp3',
    company_id: 'comp1',
    amount: 2800,
    currency: 'USD',
    category: 'software',
    vendor: 'Microsoft',
    date: '2024-01-15',
    description: 'Office 365 and Azure subscriptions',
    status: 'paid',
    payment_method: 'credit_card',
    approval_required: false,
    department: 'IT',
    created_at: '2024-01-15T12:00:00Z',
    updated_at: '2024-01-15T12:00:00Z'
  }
]

const mockBudgets: Budget[] = [
  {
    id: 'budget1',
    company_id: 'comp1',
    name: 'Q1 Marketing Budget',
    category: 'marketing',
    type: 'expense',
    budgeted_amount: 50000,
    actual_amount: 42500,
    currency: 'USD',
    period: 'quarterly',
    fiscal_year: 2024,
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    department: 'Marketing',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-31T23:59:00Z'
  },
  {
    id: 'budget2',
    company_id: 'comp1',
    name: 'Monthly Payroll Budget',
    category: 'salaries',
    type: 'expense',
    budgeted_amount: 180000,
    actual_amount: 175000,
    currency: 'USD',
    period: 'monthly',
    fiscal_year: 2024,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    department: 'HR',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-31T23:59:00Z'
  }
]

const mockCashFlows: CashFlow[] = [
  {
    id: 'cf1',
    company_id: 'comp1',
    date: '2024-01-31',
    cash_in: 255000,
    cash_out: 195000,
    net_cash_flow: 60000,
    opening_balance: 450000,
    closing_balance: 510000,
    currency: 'USD',
    period: 'monthly',
    created_at: '2024-01-31T23:59:00Z'
  },
  {
    id: 'cf2',
    company_id: 'comp1',
    date: '2023-12-31',
    cash_in: 280000,
    cash_out: 220000,
    net_cash_flow: 60000,
    opening_balance: 390000,
    closing_balance: 450000,
    currency: 'USD',
    period: 'monthly',
    created_at: '2023-12-31T23:59:00Z'
  }
]

const mockAccounts: FinancialAccount[] = [
  {
    id: 'acc1',
    company_id: 'comp1',
    name: 'Primary Checking',
    type: 'checking',
    balance: 510000,
    currency: 'USD',
    bank_name: 'Chase Bank',
    account_number: '****1234',
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-31T23:59:00Z'
  },
  {
    id: 'acc2',
    company_id: 'comp1',
    name: 'Business Savings',
    type: 'savings',
    balance: 250000,
    currency: 'USD',
    bank_name: 'Chase Bank',
    account_number: '****5678',
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-31T23:59:00Z'
  }
]

/**
 * Custom hook for fetching and managing finance data
 * 
 * Features:
 * - Multi-tenant security with company_id filtering
 * - Real-time data fetching and caching
 * - Error handling and loading states
 * - Data refresh capabilities
 * - Financial metrics calculation
 * 
 * Security: ALL queries are filtered by company_id to ensure data isolation
 */
export const useFinanceData = (): UseFinanceDataReturn => {
  const { user } = useAuth()
  
  // State management
  const [revenues, setRevenues] = useState<Revenue[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([])
  const [accounts, setAccounts] = useState<FinancialAccount[]>([])
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch revenues data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchRevenues = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('revenues')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('date', { ascending: false })

      if (error) throw error
      setRevenues(data || [])
    } catch (err) {
      console.error('Error fetching revenues:', err)
      setError('Failed to fetch revenue data')
    }
  }, [user?.company_id])

  /**
   * Fetch expenses data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchExpenses = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('date', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (err) {
      console.error('Error fetching expenses:', err)
      setError('Failed to fetch expense data')
    }
  }, [user?.company_id])

  /**
   * Fetch budgets data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchBudgets = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('start_date', { ascending: false })

      if (error) throw error
      setBudgets(data || [])
    } catch (err) {
      console.error('Error fetching budgets:', err)
      setError('Failed to fetch budget data')
    }
  }, [user?.company_id])

  /**
   * Fetch cash flows data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchCashFlows = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('cash_flows')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('date', { ascending: false })

      if (error) throw error
      setCashFlows(data || [])
    } catch (err) {
      console.error('Error fetching cash flows:', err)
      setError('Failed to fetch cash flow data')
    }
  }, [user?.company_id])

  /**
   * Calculate financial metrics from current data
   */
  const calculateMetrics = useCallback((
    revenuesData: Revenue[],
    expensesData: Expense[],
    budgetsData: Budget[],
    cashFlowsData: CashFlow[],
    accountsData: FinancialAccount[]
  ): FinancialMetrics => {
    // Calculate basic metrics
    const totalRevenue = revenuesData
      .filter(rev => rev.status === 'received')
      .reduce((sum, rev) => sum + rev.amount, 0)

    const totalExpenses = expensesData
      .filter(exp => exp.status === 'paid')
      .reduce((sum, exp) => sum + exp.amount, 0)

    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0

    // Calculate cash balance from accounts
    const cashBalance = accountsData
      .filter(acc => acc.is_active && (acc.type === 'checking' || acc.type === 'savings'))
      .reduce((sum, acc) => sum + acc.balance, 0)

    // Mock financial ratios (would be calculated from balance sheet data)
    const currentRatio = 2.5
    const quickRatio = 1.8

    // Calculate burn rate (monthly expense average)
    const burnRate = totalExpenses // simplified for demo
    const runwayMonths = cashBalance > 0 && burnRate > 0 ? Math.floor(cashBalance / burnRate) : 0

    // Calculate growth rate (mock for demo)
    const growthRate = 15.5

    // Monthly growth metrics (mock)
    const monthlyGrowth = {
      revenue: 12.3,
      expenses: 8.5,
      profit: 18.7
    }

    // Budget variance
    const budgetVariance = {
      revenue: 5.2,
      expenses: -3.1,
      overall: 4.1
    }

    // Top revenue sources
    const revenueByCategory = revenuesData
      .filter(rev => rev.status === 'received')
      .reduce((acc, rev) => {
        acc[rev.category] = (acc[rev.category] || 0) + rev.amount
        return acc
      }, {} as Record<string, number>)

    const topRevenueSources: CategoryData[] = Object.entries(revenueByCategory)
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0,
        count: revenuesData.filter(rev => rev.category === category && rev.status === 'received').length,
        color: `hsl(var(--chart-${(index % 5) + 1}))`
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Top expense categories
    const expensesByCategory = expensesData
      .filter(exp => exp.status === 'paid')
      .reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount
        return acc
      }, {} as Record<string, number>)

    const topExpenseCategories: CategoryData[] = Object.entries(expensesByCategory)
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        count: expensesData.filter(exp => exp.category === category && exp.status === 'paid').length,
        color: `hsl(var(--chart-${(index % 5) + 1}))`
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Mock trend data (would be calculated from historical data)
    const cashFlowTrend: CashFlowData[] = [
      { period: 'Nov', cash_in: 280000, cash_out: 220000, net_flow: 60000, running_balance: 450000 },
      { period: 'Dec', cash_in: 255000, cash_out: 195000, net_flow: 60000, running_balance: 510000 },
      { period: 'Jan', cash_in: 270000, cash_out: 205000, net_flow: 65000, running_balance: 575000 }
    ]

    const revenueTrend: RevenueData[] = [
      { period: 'Nov', revenue: 280000, count: 45, target: 275000 },
      { period: 'Dec', revenue: 255000, count: 38, target: 280000 },
      { period: 'Jan', revenue: 270000, count: 42, target: 285000 }
    ]

    const expenseTrend: ExpenseData[] = [
      { period: 'Nov', expenses: 220000, count: 156, budget: 230000 },
      { period: 'Dec', expenses: 195000, count: 142, budget: 210000 },
      { period: 'Jan', expenses: 205000, count: 148, budget: 215000 }
    ]

    return {
      total_revenue: totalRevenue,
      total_expenses: totalExpenses,
      net_profit: netProfit,
      profit_margin: Math.round(profitMargin * 10) / 10,
      gross_margin: Math.round(grossMargin * 10) / 10,
      cash_balance: cashBalance,
      current_ratio: currentRatio,
      quick_ratio: quickRatio,
      burn_rate: burnRate,
      runway_months: runwayMonths,
      growth_rate: growthRate,
      monthly_growth: monthlyGrowth,
      budget_variance: budgetVariance,
      top_revenue_sources: topRevenueSources,
      top_expense_categories: topExpenseCategories,
      cash_flow_trend: cashFlowTrend,
      revenue_trend: revenueTrend,
      expense_trend: expenseTrend
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
        fetchRevenues(),
        fetchExpenses(),
        fetchBudgets(),
        fetchCashFlows()
      ])
    } catch (err) {
      console.error('Error refreshing data:', err)
      setError('Failed to refresh financial data')
    } finally {
      setLoading(false)
    }
  }, [fetchRevenues, fetchExpenses, fetchBudgets, fetchCashFlows])

  /**
   * Individual refresh functions
   */
  const refreshRevenues = useCallback(async () => {
    await fetchRevenues()
  }, [fetchRevenues])

  const refreshExpenses = useCallback(async () => {
    await fetchExpenses()
  }, [fetchExpenses])

  const refreshBudgets = useCallback(async () => {
    await fetchBudgets()
  }, [fetchBudgets])

  const refreshCashFlows = useCallback(async () => {
    await fetchCashFlows()
  }, [fetchCashFlows])

  /**
   * Calculate metrics whenever data changes
   */
  useEffect(() => {
    if (revenues.length > 0 || expenses.length > 0 || budgets.length > 0 || cashFlows.length > 0 || accounts.length > 0) {
      const calculatedMetrics = calculateMetrics(revenues, expenses, budgets, cashFlows, accounts)
      setMetrics(calculatedMetrics)
    }
  }, [revenues, expenses, budgets, cashFlows, accounts, calculateMetrics])

  /**
   * Initial data fetch
   */
  useEffect(() => {
    if (user?.company_id) {
      refreshAll()
      // Set accounts for demo (in real app this would be fetched)
      setAccounts(mockAccounts)
    }
  }, [user?.company_id, refreshAll])

  return {
    revenues,
    expenses,
    budgets,
    cashFlows,
    accounts,
    metrics,
    loading,
    error,
    refreshRevenues,
    refreshExpenses,
    refreshBudgets,
    refreshCashFlows,
    refreshAll
  }
}