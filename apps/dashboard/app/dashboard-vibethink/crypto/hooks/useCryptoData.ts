import { useState, useEffect, useCallback } from 'react'
import { 
  CryptoHolding,
  CryptoTransaction,
  CryptoWallet,
  CryptoWatchlist,
  CryptoPriceAlert,
  CryptoCurrency,
  CryptoPortfolioMetrics,
  DeFiPosition,
  NFTCollection,
  RiskMetrics,
  UseCryptoDataReturn,
  AllocationData,
  PerformanceData
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
    case 'crypto_holdings':
      return mockHoldings
    case 'crypto_transactions':
      return mockTransactions
    case 'crypto_wallets':
      return mockWallets
    case 'crypto_watchlist':
      return mockWatchlist
    case 'crypto_alerts':
      return mockAlerts
    case 'defi_positions':
      return mockDeFiPositions
    case 'nft_collections':
      return mockNFTCollections
    default:
      return []
  }
}

// Mock crypto holdings
const mockHoldings: CryptoHolding[] = [
  {
    id: 'holding1',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 2.5,
    average_cost: 35000,
    current_price: 43500,
    total_value: 108750,
    profit_loss: 21250,
    profit_loss_percentage: 24.3,
    platform: 'coinbase',
    notes: 'Long-term investment',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  },
  {
    id: 'holding2',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 15.8,
    average_cost: 2200,
    current_price: 2650,
    total_value: 41870,
    profit_loss: 7110,
    profit_loss_percentage: 20.4,
    platform: 'binance',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  },
  {
    id: 'holding3',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    amount: 8500,
    average_cost: 0.55,
    current_price: 0.48,
    total_value: 4080,
    profit_loss: -595,
    profit_loss_percentage: -12.7,
    platform: 'kraken',
    created_at: '2024-01-20T16:45:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  },
  {
    id: 'holding4',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    amount: 125,
    average_cost: 95,
    current_price: 118,
    total_value: 14750,
    profit_loss: 2875,
    profit_loss_percentage: 24.2,
    platform: 'phantom',
    created_at: '2024-01-25T11:30:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  }
]

// Mock transactions
const mockTransactions: CryptoTransaction[] = [
  {
    id: 'tx1',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'bitcoin',
    symbol: 'BTC',
    type: 'buy',
    amount: 1.5,
    price: 42000,
    total_value: 63000,
    fee: 25,
    fee_currency: 'USD',
    platform: 'coinbase',
    status: 'completed',
    date: '2024-01-30T10:15:00Z',
    created_at: '2024-01-30T10:15:00Z',
    updated_at: '2024-01-30T10:15:00Z'
  },
  {
    id: 'tx2',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'ethereum',
    symbol: 'ETH',
    type: 'buy',
    amount: 5.2,
    price: 2580,
    total_value: 13416,
    fee: 15,
    fee_currency: 'USD',
    platform: 'binance',
    status: 'completed',
    date: '2024-01-28T14:30:00Z',
    created_at: '2024-01-28T14:30:00Z',
    updated_at: '2024-01-28T14:30:00Z'
  },
  {
    id: 'tx3',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'cardano',
    symbol: 'ADA',
    type: 'sell',
    amount: 2000,
    price: 0.52,
    total_value: 1040,
    fee: 2,
    fee_currency: 'USD',
    platform: 'kraken',
    status: 'completed',
    date: '2024-01-25T09:45:00Z',
    created_at: '2024-01-25T09:45:00Z',
    updated_at: '2024-01-25T09:45:00Z'
  }
]

// Mock wallets
const mockWallets: CryptoWallet[] = [
  {
    id: 'wallet1',
    company_id: 'comp1',
    user_id: 'user_1',
    name: 'Coinbase Wallet',
    type: 'exchange',
    platform: 'coinbase',
    balance_usd: 108750,
    holdings_count: 3,
    last_sync: '2024-01-30T14:20:00Z',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  },
  {
    id: 'wallet2',
    company_id: 'comp1',
    user_id: 'user_1',
    name: 'Hardware Wallet',
    type: 'cold',
    platform: 'ledger',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    balance_usd: 25000,
    holdings_count: 2,
    last_sync: '2024-01-30T12:00:00Z',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  }
]

// Mock watchlist
const mockWatchlist: CryptoWatchlist[] = [
  {
    id: 'watch1',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    target_price: 20,
    alert_type: 'price_above',
    is_active: true,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'watch2',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'polygon',
    symbol: 'MATIC',
    name: 'Polygon',
    target_price: 0.8,
    alert_type: 'price_below',
    is_active: true,
    created_at: '2024-01-22T15:30:00Z',
    updated_at: '2024-01-22T15:30:00Z'
  }
]

// Mock alerts
const mockAlerts: CryptoPriceAlert[] = [
  {
    id: 'alert1',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'bitcoin',
    symbol: 'BTC',
    alert_type: 'price_above',
    target_value: 45000,
    current_value: 43500,
    is_triggered: false,
    is_active: true,
    notification_method: 'email',
    created_at: '2024-01-15T10:00:00Z'
  }
]

// Mock DeFi positions
const mockDeFiPositions: DeFiPosition[] = [
  {
    id: 'defi1',
    company_id: 'comp1',
    user_id: 'user_1',
    protocol: 'Aave',
    position_type: 'lending',
    crypto_symbol: 'USDC',
    amount: 50000,
    apy: 4.5,
    rewards_earned: 1250,
    total_value: 51250,
    start_date: '2024-01-01T00:00:00Z',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  },
  {
    id: 'defi2',
    company_id: 'comp1',
    user_id: 'user_1',
    protocol: 'Uniswap',
    position_type: 'liquidity_pool',
    crypto_symbol: 'ETH-USDC',
    amount: 25000,
    apy: 12.3,
    rewards_earned: 850,
    total_value: 25850,
    start_date: '2024-01-10T00:00:00Z',
    status: 'active',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  }
]

// Mock NFT collections
const mockNFTCollections: NFTCollection[] = [
  {
    id: 'nft1',
    company_id: 'comp1',
    user_id: 'user_1',
    collection_name: 'Bored Ape Yacht Club',
    contract_address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    blockchain: 'ethereum',
    token_count: 3,
    floor_price: 15.5,
    total_value: 46.5,
    last_updated: '2024-01-30T14:20:00Z',
    created_at: '2024-01-15T00:00:00Z'
  }
]

// Mock market prices (would come from CoinGecko or similar API)
const mockMarketPrices: CryptoCurrency[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 43500,
    market_cap: 853000000000,
    market_cap_rank: 1,
    price_change_24h: 1250,
    price_change_percentage_24h: 2.95,
    price_change_percentage_7d: 8.2,
    price_change_percentage_30d: 12.5,
    volume_24h: 15800000000,
    circulating_supply: 19600000,
    total_supply: 21000000,
    max_supply: 21000000,
    last_updated: '2024-01-30T14:20:00Z',
    image: 'https://assets.coingecko.com/coins/assets/images/1/large/bitcoin.png'
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 2650,
    market_cap: 318000000000,
    market_cap_rank: 2,
    price_change_24h: -15,
    price_change_percentage_24h: -0.56,
    price_change_percentage_7d: 5.8,
    price_change_percentage_30d: 18.3,
    volume_24h: 9200000000,
    circulating_supply: 120000000,
    total_supply: 120000000,
    max_supply: null,
    last_updated: '2024-01-30T14:20:00Z',
    image: 'https://assets.coingecko.com/coins/assets/images/279/large/ethereum.png'
  }
]

/**
 * Custom hook for fetching and managing crypto data
 * 
 * Features:
 * - Multi-tenant security with company_id filtering
 * - Real-time portfolio tracking
 * - DeFi and NFT integration
 * - Risk metrics calculation
 * - Market data integration
 * 
 * Security: ALL queries are filtered by company_id to ensure data isolation
 */
export const useCryptoData = (): UseCryptoDataReturn => {
  const { user } = useAuth()
  
  // State management
  const [holdings, setHoldings] = useState<CryptoHolding[]>([])
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([])
  const [wallets, setWallets] = useState<CryptoWallet[]>([])
  const [watchlist, setWatchlist] = useState<CryptoWatchlist[]>([])
  const [alerts, setAlerts] = useState<CryptoPriceAlert[]>([])
  const [marketPrices, setMarketPrices] = useState<CryptoCurrency[]>([])
  const [portfolioMetrics, setPortfolioMetrics] = useState<CryptoPortfolioMetrics | null>(null)
  const [defiPositions, setDefiPositions] = useState<DeFiPosition[]>([])
  const [nftCollections, setNftCollections] = useState<NFTCollection[]>([])
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch holdings data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchHoldings = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('crypto_holdings')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('total_value', { ascending: false })

      if (error) throw error
      setHoldings(data || [])
    } catch (err) {
      console.error('Error fetching holdings:', err)
      setError('Failed to fetch holdings data')
    }
  }, [user?.company_id])

  /**
   * Fetch transactions data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchTransactions = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('crypto_transactions')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('Failed to fetch transaction data')
    }
  }, [user?.company_id])

  /**
   * Fetch wallets data with multi-tenant security
   * CRITICAL: Always filter by company_id
   */
  const fetchWallets = useCallback(async () => {
    try {
      if (!user?.company_id) {
        throw new Error('User company_id is required for data access')
      }

      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('company_id', user.company_id) // 🔒 CRITICAL: Multi-tenant security
        .order('balance_usd', { ascending: false })

      if (error) throw error
      setWallets(data || [])
    } catch (err) {
      console.error('Error fetching wallets:', err)
      setError('Failed to fetch wallet data')
    }
  }, [user?.company_id])

  /**
   * Fetch market data (not tenant-specific)
   */
  const fetchMarketData = useCallback(async () => {
    try {
      // In real app, this would call CoinGecko API or similar
      setMarketPrices(mockMarketPrices)
    } catch (err) {
      console.error('Error fetching market data:', err)
      setError('Failed to fetch market data')
    }
  }, [])

  /**
   * Calculate portfolio metrics from current data
   */
  const calculatePortfolioMetrics = useCallback((
    holdingsData: CryptoHolding[],
    transactionsData: CryptoTransaction[]
  ): CryptoPortfolioMetrics => {
    // Calculate basic metrics
    const totalValue = holdingsData.reduce((sum, holding) => sum + holding.total_value, 0)
    const totalCost = holdingsData.reduce((sum, holding) => sum + (holding.amount * holding.average_cost), 0)
    const totalProfitLoss = totalValue - totalCost
    const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0

    // Find best and worst performers
    const sortedByPerformance = [...holdingsData].sort((a, b) => b.profit_loss_percentage - a.profit_loss_percentage)
    const bestPerformer = sortedByPerformance[0] ? {
      symbol: sortedByPerformance[0].symbol,
      name: sortedByPerformance[0].name,
      profit_loss_percentage: sortedByPerformance[0].profit_loss_percentage
    } : { symbol: 'N/A', name: 'N/A', profit_loss_percentage: 0 }
    
    const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1] ? {
      symbol: sortedByPerformance[sortedByPerformance.length - 1].symbol,
      name: sortedByPerformance[sortedByPerformance.length - 1].name,
      profit_loss_percentage: sortedByPerformance[sortedByPerformance.length - 1].profit_loss_percentage
    } : { symbol: 'N/A', name: 'N/A', profit_loss_percentage: 0 }

    // Find largest holding
    const sortedByValue = [...holdingsData].sort((a, b) => b.total_value - a.total_value)
    const largestHolding = sortedByValue[0] ? {
      symbol: sortedByValue[0].symbol,
      name: sortedByValue[0].name,
      percentage: totalValue > 0 ? (sortedByValue[0].total_value / totalValue) * 100 : 0,
      value: sortedByValue[0].total_value
    } : { symbol: 'N/A', name: 'N/A', percentage: 0, value: 0 }

    // Allocation by crypto
    const allocationByCrypto: AllocationData[] = holdingsData.map((holding, index) => ({
      name: holding.name,
      symbol: holding.symbol,
      value: holding.total_value,
      percentage: totalValue > 0 ? (holding.total_value / totalValue) * 100 : 0,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
      profit_loss: holding.profit_loss,
      profit_loss_percentage: holding.profit_loss_percentage
    }))

    // Mock allocation by category
    const allocationByCategory: AllocationData[] = [
      { name: 'Bitcoin', value: totalValue * 0.45, percentage: 45, color: 'hsl(var(--chart-1))' },
      { name: 'Ethereum', value: totalValue * 0.25, percentage: 25, color: 'hsl(var(--chart-2))' },
      { name: 'Altcoins', value: totalValue * 0.20, percentage: 20, color: 'hsl(var(--chart-3))' },
      { name: 'DeFi', value: totalValue * 0.10, percentage: 10, color: 'hsl(var(--chart-4))' }
    ]

    // Mock performance history
    const performanceHistory: PerformanceData[] = [
      { date: '2024-01-01', value: totalValue * 0.8, profit_loss: totalProfitLoss * 0.5, profit_loss_percentage: totalProfitLossPercentage * 0.5 },
      { date: '2024-01-15', value: totalValue * 0.9, profit_loss: totalProfitLoss * 0.7, profit_loss_percentage: totalProfitLossPercentage * 0.7 },
      { date: '2024-01-30', value: totalValue, profit_loss: totalProfitLoss, profit_loss_percentage: totalProfitLossPercentage }
    ]

    return {
      total_value: totalValue,
      total_cost: totalCost,
      total_profit_loss: totalProfitLoss,
      total_profit_loss_percentage: totalProfitLossPercentage,
      daily_change: totalValue * 0.025, // Mock 2.5% daily change
      daily_change_percentage: 2.5,
      weekly_change: totalValue * 0.08,
      weekly_change_percentage: 8.0,
      monthly_change: totalValue * 0.15,
      monthly_change_percentage: 15.0,
      best_performer: bestPerformer,
      worst_performer: worstPerformer,
      largest_holding: largestHolding,
      allocation_by_crypto: allocationByCrypto,
      allocation_by_category: allocationByCategory,
      performance_history: performanceHistory
    }
  }, [])

  /**
   * Calculate risk metrics
   */
  const calculateRiskMetrics = useCallback((
    holdingsData: CryptoHolding[],
    portfolioMetrics: CryptoPortfolioMetrics
  ): RiskMetrics => {
    // Mock risk calculations (in real app these would be complex calculations)
    return {
      portfolio_var: portfolioMetrics.total_value * 0.05, // 5% VaR
      sharpe_ratio: 1.8,
      sortino_ratio: 2.1,
      max_drawdown: -15.5,
      beta_to_btc: 0.85,
      correlation_matrix: [
        { crypto1: 'BTC', crypto2: 'ETH', correlation: 0.75 },
        { crypto1: 'BTC', crypto2: 'ADA', correlation: 0.65 },
        { crypto1: 'ETH', crypto2: 'ADA', correlation: 0.70 }
      ],
      risk_score: 65,
      risk_level: 'medium',
      diversification_score: 72
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
        fetchHoldings(),
        fetchTransactions(),
        fetchWallets(),
        fetchMarketData()
      ])
      
      // Set mock data for demo
      setWatchlist(mockWatchlist)
      setAlerts(mockAlerts)
      setDefiPositions(mockDeFiPositions)
      setNftCollections(mockNFTCollections)
    } catch (err) {
      console.error('Error refreshing data:', err)
      setError('Failed to refresh crypto data')
    } finally {
      setLoading(false)
    }
  }, [fetchHoldings, fetchTransactions, fetchWallets, fetchMarketData])

  /**
   * Individual refresh functions
   */
  const refreshHoldings = useCallback(async () => {
    await fetchHoldings()
  }, [fetchHoldings])

  const refreshTransactions = useCallback(async () => {
    await fetchTransactions()
  }, [fetchTransactions])

  const refreshMarketData = useCallback(async () => {
    await fetchMarketData()
  }, [fetchMarketData])

  /**
   * Calculate metrics whenever data changes
   */
  useEffect(() => {
    if (holdings.length > 0) {
      const calculatedMetrics = calculatePortfolioMetrics(holdings, transactions)
      setPortfolioMetrics(calculatedMetrics)
      
      const calculatedRiskMetrics = calculateRiskMetrics(holdings, calculatedMetrics)
      setRiskMetrics(calculatedRiskMetrics)
    }
  }, [holdings, transactions, calculatePortfolioMetrics, calculateRiskMetrics])

  /**
   * Initial data fetch
   */
  useEffect(() => {
    if (user?.company_id) {
      refreshAll()
    }
  }, [user?.company_id, refreshAll])

  return {
    holdings,
    transactions,
    wallets,
    watchlist,
    alerts,
    marketPrices,
    portfolioMetrics,
    defiPositions,
    nftCollections,
    riskMetrics,
    loading,
    error,
    refreshAll,
    refreshHoldings,
    refreshTransactions,
    refreshMarketData
  }
}