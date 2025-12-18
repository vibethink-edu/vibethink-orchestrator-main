import { useState, useEffect, useCallback } from 'react'
import { Budget, BudgetComparison, UseBudgetDataReturn } from '../types'

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
          then: (callback: (result: any) => void) => {
            setTimeout(() => {
              callback({ data: getMockBudgetData(), error: null })
            }, 300)
            return Promise.resolve({ data: getMockBudgetData(), error: null })
          }
        })
      })
    }),
    insert: (data: any) => ({
      then: (callback: (result: any) => void) => {
        setTimeout(() => {
          callback({ data: [{ ...data, id: `budget_${Date.now()}` }], error: null })
        }, 500)
        return Promise.resolve({ data: [{ ...data, id: `budget_${Date.now()}` }], error: null })
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        eq: (column2: string, value2: any) => ({
          then: (callback: (result: any) => void) => {
            setTimeout(() => {
              callback({ data: [data], error: null })
            }, 500)
            return Promise.resolve({ data: [data], error: null })
          }
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        eq: (column2: string, value2: any) => ({
          then: (callback: (result: any) => void) => {
            setTimeout(() => {
              callback({ data: null, error: null })
            }, 500)
            return Promise.resolve({ data: null, error: null })
          }
        })
      })
    })
  })
}

// Mock budget data
const getMockBudgetData = (): Budget[] => [
  {
    id: 'budget1',
    company_id: 'comp1',
    name: 'Q1 2024 Marketing Budget',
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
    notes: 'Digital marketing campaigns and advertising',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-15T10:30:00Z'
  },
  {
    id: 'budget2',
    company_id: 'comp1',
    name: 'January 2024 Payroll',
    category: 'salaries',
    type: 'expense',
    budgeted_amount: 180000,
    actual_amount: 175000,
    currency: 'USD',
    period: 'monthly',
    fiscal_year: 2024,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    department: 'Human Resources',
    notes: 'Monthly payroll and benefits',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-31T23:59:00Z'
  },
  {
    id: 'budget3',
    company_id: 'comp1',
    name: 'Software & Technology',
    category: 'software',
    type: 'expense',
    budgeted_amount: 15000,
    actual_amount: 18500,
    currency: 'USD',
    period: 'monthly',
    fiscal_year: 2024,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    department: 'IT',
    notes: 'Software licenses, cloud services, and tools',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-31T23:59:00Z'
  },
  {
    id: 'budget4',
    company_id: 'comp1',
    name: 'Q1 2024 Revenue Target',
    category: 'sales',
    type: 'revenue',
    budgeted_amount: 750000,
    actual_amount: 685000,
    currency: 'USD',
    period: 'quarterly',
    fiscal_year: 2024,
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    department: 'Sales',
    notes: 'Quarterly revenue target from product sales',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-29T23:59:00Z'
  },
  {
    id: 'budget5',
    company_id: 'comp1',
    name: 'Office & Operations',
    category: 'operations',
    type: 'expense',
    budgeted_amount: 25000,
    actual_amount: 23200,
    currency: 'USD',
    period: 'monthly',
    fiscal_year: 2024,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    department: 'Operations',
    notes: 'Rent, utilities, office supplies, and maintenance',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-31T23:59:00Z'
  }
]

/**
 * Custom hook for managing budget data and operations
 * 
 * Features:
 * - Multi-tenant security with company_id filtering
 * - Budget CRUD operations
 * - Budget vs actual comparisons
 * - Variance calculations
 * - Error handling and loading states
 * 
 * Security: ALL operations are filtered by company_id to ensure data isolation
 */
export const useBudgetData = (): UseBudgetDataReturn => {
  const { user } = useAuth()
  
  // State management
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [budgetComparisons, setBudgetComparisons] = useState<BudgetComparison[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Calculate budget comparisons and variance
   */
  const calculateBudgetComparisons = useCallback((budgetsData: Budget[]): BudgetComparison[] => {
    return budgetsData.map(budget => {
      const variance = budget.actual_amount - budget.budgeted_amount
      const variancePercentage = budget.budgeted_amount > 0 
        ? (variance / budget.budgeted_amount) * 100 
        : 0

      let status: 'over' | 'under' | 'on_track'
      
      if (Math.abs(variancePercentage) <= 5) {
        status = 'on_track'
      } else if (variance > 0) {
        status = 'over'
      } else {
        status = 'under'
      }

      return {
        category: budget.category,
        budgeted: budget.budgeted_amount,
        actual: budget.actual_amount,
        variance,
        variance_percentage: Math.round(variancePercentage * 10) / 10,
        status
      }
    })
  }, [])

  /**
   * Fetch budgets data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchBudgets = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('start_date', { ascending: false })

      if (error) throw error
      
      const budgetsData = data || []
      setBudgets(budgetsData)
      
      // Calculate comparisons
      const comparisons = calculateBudgetComparisons(budgetsData)
      setBudgetComparisons(comparisons)
      
    } catch (err) {
      console.error('Error fetching budgets:', err)
      setError('Failed to fetch budget data')
    } finally {
      setLoading(false)
    }
  }, [user?.company_id, calculateBudgetComparisons])

  /**
   * Create a new budget
   * CRITICAL: Automatically add company_id for multi-tenant security
   */
  const createBudget = useCallback(async (budgetData: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      setError(null)

      const newBudget = {
        ...budgetData,
        company_id: user.company_id, // 🔒 CRITICAL: Multi-tenant security
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('budgets')
        .insert(newBudget)

      if (error) throw error

      // Refresh budgets after creation
      await fetchBudgets()
      
    } catch (err) {
      console.error('Error creating budget:', err)
      setError('Failed to create budget')
      throw err
    }
  }, [user?.company_id, fetchBudgets])

  /**
   * Update an existing budget
   * CRITICAL: Include company_id check for security
   */
  const updateBudget = useCallback(async (id: string, updates: Partial<Budget>) => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      setError(null)

      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('budgets')
        .update(updatedData)
        .eq('id', id)
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security

      if (error) throw error

      // Refresh budgets after update
      await fetchBudgets()
      
    } catch (err) {
      console.error('Error updating budget:', err)
      setError('Failed to update budget')
      throw err
    }
  }, [user?.company_id, fetchBudgets])

  /**
   * Delete a budget
   * CRITICAL: Include company_id check for security
   */
  const deleteBudget = useCallback(async (id: string) => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      setError(null)

      const { data, error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security

      if (error) throw error

      // Refresh budgets after deletion
      await fetchBudgets()
      
    } catch (err) {
      console.error('Error deleting budget:', err)
      setError('Failed to delete budget')
      throw err
    }
  }, [user?.company_id, fetchBudgets])

  /**
   * Refresh budgets data
   */
  const refreshBudgets = useCallback(async () => {
    await fetchBudgets()
  }, [fetchBudgets])

  /**
   * Initial data fetch
   */
  useEffect(() => {
    if (user?.company_id) {
      fetchBudgets()
    }
  }, [user?.company_id, fetchBudgets])

  return {
    budgets,
    budgetComparisons,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refreshBudgets
  }
}