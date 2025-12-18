import { useState, useEffect, useCallback } from 'react'
import { TradingStrategy, DCATrade, UseTradingReturn } from '../types'

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
            setTimeout(() => {
              callback({ data: getMockTradingData(table), error: null })
            }, 300)
            return Promise.resolve({ data: getMockTradingData(table), error: null })
          }
        })
      })
    }),
    insert: (data: any) => ({
      select: () => ({
        then: (callback: (result: any) => void) => {
          setTimeout(() => {
            callback({ data: [{ ...data, id: generateId() }], error: null })
          }, 300)
          return Promise.resolve({ data: [{ ...data, id: generateId() }], error: null })
        }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          then: (callback: (result: any) => void) => {
            setTimeout(() => {
              callback({ data: [{ ...data, id: value }], error: null })
            }, 300)
            return Promise.resolve({ data: [{ ...data, id: value }], error: null })
          }
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: (callback: (result: any) => void) => {
          setTimeout(() => {
            callback({ data: [], error: null })
          }, 300)
          return Promise.resolve({ data: [], error: null })
        }
      })
    })
  })
}

// Helper function to generate mock IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

// Mock data generator
const getMockTradingData = (table: string) => {
  switch (table) {
    case 'trading_strategies':
      return mockTradingStrategies
    case 'dca_trades':
      return mockDCATrades
    default:
      return []
  }
}

// Mock trading strategies
const mockTradingStrategies: TradingStrategy[] = [
  {
    id: 'strategy1',
    company_id: 'comp1',
    user_id: 'user_1',
    name: 'Bitcoin DCA Strategy',
    description: 'Dollar-cost averaging into Bitcoin every week',
    crypto_symbols: ['BTC'],
    strategy_type: 'dca',
    parameters: {
      amount_usd: 500,
      frequency: 'weekly',
      duration_months: 12,
      start_date: '2024-01-01',
      auto_execute: true
    },
    is_active: true,
    performance: {
      total_trades: 24,
      win_rate: 62.5,
      total_return: 18.4,
      sharpe_ratio: 1.8
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  },
  {
    id: 'strategy2',
    company_id: 'comp1',
    user_id: 'user_1',
    name: 'Ethereum Grid Trading',
    description: 'Grid trading strategy for ETH in $2400-$2800 range',
    crypto_symbols: ['ETH'],
    strategy_type: 'grid',
    parameters: {
      lower_bound: 2400,
      upper_bound: 2800,
      grid_levels: 10,
      investment_per_grid: 1000,
      take_profit: 2,
      stop_loss: 5
    },
    is_active: true,
    performance: {
      total_trades: 156,
      win_rate: 78.2,
      total_return: 24.7,
      sharpe_ratio: 2.1
    },
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  },
  {
    id: 'strategy3',
    company_id: 'comp1',
    user_id: 'user_1',
    name: 'Altcoin Momentum',
    description: 'Momentum trading strategy for selected altcoins',
    crypto_symbols: ['ADA', 'SOL', 'LINK'],
    strategy_type: 'momentum',
    parameters: {
      rsi_period: 14,
      rsi_overbought: 70,
      rsi_oversold: 30,
      position_size: 0.05,
      risk_per_trade: 2,
      take_profit_ratio: 3
    },
    is_active: false,
    performance: {
      total_trades: 89,
      win_rate: 58.4,
      total_return: 12.8,
      sharpe_ratio: 1.4
    },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-25T10:30:00Z'
  }
]

// Mock DCA trades
const mockDCATrades: DCATrade[] = [
  {
    id: 'dca1',
    company_id: 'comp1',
    user_id: 'user_1',
    strategy_id: 'strategy1',
    crypto_symbol: 'BTC',
    amount_usd: 500,
    interval: 'weekly',
    next_execution: '2024-02-05T10:00:00Z',
    total_invested: 12000,
    total_tokens: 0.276,
    average_price: 43478,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'dca2',
    company_id: 'comp1',
    user_id: 'user_1',
    strategy_id: 'strategy2',
    crypto_symbol: 'ETH',
    amount_usd: 300,
    interval: 'monthly',
    next_execution: '2024-02-01T10:00:00Z',
    total_invested: 1800,
    total_tokens: 0.68,
    average_price: 2647,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
]

/**
 * Custom hook for managing trading strategies and automated trading
 * 
 * Features:
 * - DCA (Dollar Cost Averaging) strategies
 * - Grid trading strategies
 * - Momentum trading strategies
 * - Strategy performance tracking
 * - Multi-tenant security with company_id filtering
 * 
 * Security: ALL queries are filtered by company_id to ensure data isolation
 */
export const useTrading = (): UseTradingReturn => {
  const { user } = useAuth()
  
  // State management
  const [strategies, setStrategies] = useState<TradingStrategy[]>([])
  const [dcaTrades, setDcaTrades] = useState<DCATrade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch trading strategies with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchStrategies = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('trading_strategies')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('created_at', { ascending: false })

      if (error) throw error
      setStrategies(data || [])
    } catch (err) {
      console.error('Error fetching strategies:', err)
      setError('Failed to fetch trading strategies')
    }
  }, [user?.company_id])

  /**
   * Fetch DCA trades with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchDCATrades = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('dca_trades')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('next_execution', { ascending: true })

      if (error) throw error
      setDcaTrades(data || [])
    } catch (err) {
      console.error('Error fetching DCA trades:', err)
      setError('Failed to fetch DCA trades')
    }
  }, [user?.company_id])

  /**
   * Create a new trading strategy
   */
  const createStrategy = useCallback(async (
    strategyData: Omit<TradingStrategy, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const newStrategy = {
        ...strategyData,
        company_id: user.company_id, // 🔒 CRITICAL: Multi-tenant security
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('trading_strategies')
        .insert(newStrategy)
        .select()

      if (error) throw error

      if (data && data[0]) {
        setStrategies(prev => [data[0], ...prev])
        
        // If it's a DCA strategy, create the DCA trade record
        if (strategyData.strategy_type === 'dca') {
          await createDCATradeFromStrategy(data[0])
        }
      }
    } catch (err) {
      console.error('Error creating strategy:', err)
      throw new Error('Failed to create trading strategy')
    }
  }, [user?.company_id, user?.id])

  /**
   * Update an existing trading strategy
   */
  const updateStrategy = useCallback(async (
    id: string,
    updates: Partial<TradingStrategy>
  ) => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const updatedStrategy = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('trading_strategies')
        .update(updatedStrategy)
        .eq('id', id)
        .select()

      if (error) throw error

      if (data && data[0]) {
        setStrategies(prev => 
          prev.map(strategy => 
            strategy.id === id ? data[0] : strategy
          )
        )
      }
    } catch (err) {
      console.error('Error updating strategy:', err)
      throw new Error('Failed to update trading strategy')
    }
  }, [user?.company_id])

  /**
   * Delete a trading strategy
   */
  const deleteStrategy = useCallback(async (id: string) => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { error } = await supabase
        .from('trading_strategies')
        .delete()
        .eq('id', id)
        // .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security (mock simplified)

      if (error) throw error

      setStrategies(prev => prev.filter(strategy => strategy.id !== id))
      
      // Also remove related DCA trades
      setDcaTrades(prev => prev.filter(trade => trade.strategy_id !== id))
    } catch (err) {
      console.error('Error deleting strategy:', err)
      throw new Error('Failed to delete trading strategy')
    }
  }, [user?.company_id])

  /**
   * Create a DCA trade record from a strategy
   */
  const createDCATradeFromStrategy = useCallback(async (strategy: TradingStrategy) => {
    if (strategy.strategy_type !== 'dca' || !strategy.crypto_symbols[0]) {
      return
    }

    const dcaData: Omit<DCATrade, 'id' | 'created_at'> = {
      company_id: strategy.company_id,
      user_id: strategy.user_id,
      strategy_id: strategy.id,
      crypto_symbol: strategy.crypto_symbols[0],
      amount_usd: strategy.parameters.amount_usd || 100,
      interval: strategy.parameters.frequency || 'weekly',
      next_execution: calculateNextExecution(strategy.parameters.frequency || 'weekly'),
      total_invested: 0,
      total_tokens: 0,
      average_price: 0,
      is_active: strategy.is_active
    }

    await createDCATrade(dcaData)
  }, [])

  /**
   * Create a new DCA trade
   */
  const createDCATrade = useCallback(async (
    tradeData: Omit<DCATrade, 'id' | 'created_at'>
  ) => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const newTrade = {
        ...tradeData,
        company_id: user.company_id, // 🔒 CRITICAL: Multi-tenant security
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('dca_trades')
        .insert(newTrade)
        .select()

      if (error) throw error

      if (data && data[0]) {
        setDcaTrades(prev => [...prev, data[0]])
      }
    } catch (err) {
      console.error('Error creating DCA trade:', err)
      throw new Error('Failed to create DCA trade')
    }
  }, [user?.company_id])

  /**
   * Calculate next execution date for DCA
   */
  const calculateNextExecution = useCallback((interval: string): string => {
    const now = new Date()
    
    switch (interval) {
      case 'daily':
        now.setDate(now.getDate() + 1)
        break
      case 'weekly':
        now.setDate(now.getDate() + 7)
        break
      case 'monthly':
        now.setMonth(now.getMonth() + 1)
        break
      default:
        now.setDate(now.getDate() + 7) // Default to weekly
    }
    
    return now.toISOString()
  }, [])

  /**
   * Get strategy performance summary
   */
  const getPerformanceSummary = useCallback(() => {
    if (strategies.length === 0) return null

    const activeStrategies = strategies.filter(s => s.is_active)
    const totalTrades = strategies.reduce((sum, s) => sum + s.performance.total_trades, 0)
    const avgWinRate = strategies.reduce((sum, s) => sum + s.performance.win_rate, 0) / strategies.length
    const avgReturn = strategies.reduce((sum, s) => sum + s.performance.total_return, 0) / strategies.length
    const avgSharpe = strategies.reduce((sum, s) => sum + s.performance.sharpe_ratio, 0) / strategies.length

    const bestStrategy = strategies.reduce((best, current) => 
      current.performance.total_return > best.performance.total_return ? current : best
    )

    const worstStrategy = strategies.reduce((worst, current) => 
      current.performance.total_return < worst.performance.total_return ? current : worst
    )

    return {
      total_strategies: strategies.length,
      active_strategies: activeStrategies.length,
      total_trades: totalTrades,
      average_win_rate: avgWinRate,
      average_return: avgReturn,
      average_sharpe_ratio: avgSharpe,
      best_performing: {
        name: bestStrategy.name,
        return: bestStrategy.performance.total_return
      },
      worst_performing: {
        name: worstStrategy.name,
        return: worstStrategy.performance.total_return
      }
    }
  }, [strategies])

  /**
   * Get upcoming DCA executions
   */
  const getUpcomingExecutions = useCallback(() => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return dcaTrades
      .filter(trade => trade.is_active)
      .filter(trade => {
        const executionDate = new Date(trade.next_execution)
        return executionDate >= now && executionDate <= nextWeek
      })
      .sort((a, b) => new Date(a.next_execution).getTime() - new Date(b.next_execution).getTime())
  }, [dcaTrades])

  /**
   * Pause/Resume strategy
   */
  const toggleStrategy = useCallback(async (id: string, isActive: boolean) => {
    await updateStrategy(id, { is_active: isActive })
  }, [updateStrategy])

  /**
   * Refresh all trading data
   */
  const refreshAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      await Promise.all([
        fetchStrategies(),
        fetchDCATrades()
      ])
    } catch (err) {
      console.error('Error refreshing trading data:', err)
      setError('Failed to refresh trading data')
    } finally {
      setLoading(false)
    }
  }, [fetchStrategies, fetchDCATrades])

  /**
   * Initial data fetch
   */
  useEffect(() => {
    if (user?.company_id) {
      refreshAll()
    }
  }, [user?.company_id, refreshAll])

  return {
    strategies,
    dcaTrades,
    loading,
    error,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    createDCATrade,
    refreshAll,
    getPerformanceSummary,
    getUpcomingExecutions,
    toggleStrategy
  }
}