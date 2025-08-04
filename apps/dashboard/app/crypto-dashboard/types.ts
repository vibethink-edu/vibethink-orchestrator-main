/**
 * Crypto Dashboard Types
 * VibeThink Orchestrator - Multi-tenant Cryptocurrency Management
 * 
 * Following VThink 1.0 methodology with strict TypeScript compliance
 * All interfaces include company_id for multi-tenant security
 */

// =============================================================================
// CORE CRYPTO TYPES
// =============================================================================

export interface CryptoCurrency {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_7d: number
  price_change_percentage_30d: number
  volume_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number | null
  last_updated: string
  image: string
  sparkline_7d?: number[]
}

export interface CryptoHolding {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  crypto_id: string
  symbol: string
  name: string
  amount: number
  average_cost: number
  current_price: number
  total_value: number
  profit_loss: number
  profit_loss_percentage: number
  wallet_address?: string
  platform: string // 'binance', 'coinbase', 'metamask', 'hardware', etc.
  notes?: string
  created_at: string
  updated_at: string
}

export interface CryptoTransaction {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  crypto_id: string
  symbol: string
  type: 'buy' | 'sell' | 'transfer' | 'stake' | 'unstake' | 'reward' | 'airdrop'
  amount: number
  price: number
  total_value: number
  fee: number
  fee_currency: string
  platform: string
  wallet_from?: string
  wallet_to?: string
  transaction_hash?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  date: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CryptoWallet {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  name: string
  type: 'hot' | 'cold' | 'exchange' | 'defi'
  platform: string
  address?: string
  balance_usd: number
  holdings_count: number
  last_sync: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CryptoWatchlist {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  crypto_id: string
  symbol: string
  name: string
  target_price?: number
  alert_type: 'price_above' | 'price_below' | 'volume_spike' | 'news_alert'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CryptoPriceAlert {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  crypto_id: string
  symbol: string
  alert_type: 'price_above' | 'price_below' | 'percentage_change' | 'volume_change'
  target_value: number
  current_value: number
  is_triggered: boolean
  is_active: boolean
  notification_method: 'email' | 'push' | 'sms' | 'all'
  created_at: string
  triggered_at?: string
}

export interface DeFiPosition {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  protocol: string
  position_type: 'lending' | 'borrowing' | 'staking' | 'liquidity_pool' | 'farming'
  crypto_symbol: string
  amount: number
  apy: number
  rewards_earned: number
  total_value: number
  start_date: string
  end_date?: string
  status: 'active' | 'completed' | 'liquidated'
  created_at: string
  updated_at: string
}

export interface NFTCollection {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  collection_name: string
  contract_address: string
  blockchain: string
  token_count: number
  floor_price: number
  total_value: number
  last_updated: string
  created_at: string
}

// =============================================================================
// ANALYTICS AND METRICS
// =============================================================================

export interface CryptoPortfolioMetrics {
  total_value: number
  total_cost: number
  total_profit_loss: number
  total_profit_loss_percentage: number
  daily_change: number
  daily_change_percentage: number
  weekly_change: number
  weekly_change_percentage: number
  monthly_change: number
  monthly_change_percentage: number
  best_performer: {
    symbol: string
    name: string
    profit_loss_percentage: number
  }
  worst_performer: {
    symbol: string
    name: string
    profit_loss_percentage: number
  }
  largest_holding: {
    symbol: string
    name: string
    percentage: number
    value: number
  }
  allocation_by_crypto: AllocationData[]
  allocation_by_category: AllocationData[]
  performance_history: PerformanceData[]
}

export interface AllocationData {
  name: string
  symbol?: string
  value: number
  percentage: number
  color: string
  profit_loss?: number
  profit_loss_percentage?: number
}

export interface PerformanceData {
  date: string
  value: number
  profit_loss: number
  profit_loss_percentage: number
}

export interface PriceHistoryData {
  timestamp: string
  price: number
  volume: number
  market_cap: number
}

export interface TechnicalIndicator {
  name: string
  value: number
  signal: 'buy' | 'sell' | 'hold'
  confidence: number
}

// =============================================================================
// NEWS AND MARKET DATA
// =============================================================================

export interface CryptoNews {
  id: string
  title: string
  description: string
  url: string
  source: string
  published_at: string
  image_url?: string
  sentiment: 'positive' | 'negative' | 'neutral'
  relevance_score: number
  related_cryptos: string[]
}

export interface MarketSentiment {
  fear_greed_index: number
  fear_greed_classification: string
  market_cap_change_24h: number
  volume_change_24h: number
  bitcoin_dominance: number
  active_cryptocurrencies: number
  market_cap_total: number
  last_updated: string
}

// =============================================================================
// TRADING AND STRATEGY
// =============================================================================

export interface TradingStrategy {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  name: string
  description: string
  crypto_symbols: string[]
  strategy_type: 'dca' | 'grid' | 'momentum' | 'mean_reversion' | 'custom'
  parameters: Record<string, any>
  is_active: boolean
  performance: {
    total_trades: number
    win_rate: number
    total_return: number
    sharpe_ratio: number
  }
  created_at: string
  updated_at: string
}

export interface DCATrade {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  strategy_id: string
  crypto_symbol: string
  amount_usd: number
  interval: 'daily' | 'weekly' | 'monthly'
  next_execution: string
  total_invested: number
  total_tokens: number
  average_price: number
  is_active: boolean
  created_at: string
}

// =============================================================================
// RISK MANAGEMENT
// =============================================================================

export interface RiskMetrics {
  portfolio_var: number // Value at Risk
  sharpe_ratio: number
  sortino_ratio: number
  max_drawdown: number
  beta_to_btc: number
  correlation_matrix: Array<{
    crypto1: string
    crypto2: string
    correlation: number
  }>
  risk_score: number // 1-100
  risk_level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  diversification_score: number
}

export interface PortfolioRebalancing {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  target_allocation: AllocationData[]
  current_allocation: AllocationData[]
  rebalancing_actions: Array<{
    symbol: string
    action: 'buy' | 'sell'
    amount: number
    percentage: number
  }>
  rebalancing_threshold: number
  auto_rebalance: boolean
  last_rebalanced: string
  created_at: string
  updated_at: string
}

// =============================================================================
// TAX AND REPORTING
// =============================================================================

export interface TaxReport {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  user_id: string
  tax_year: number
  total_capital_gains: number
  total_capital_losses: number
  net_capital_gains: number
  short_term_gains: number
  long_term_gains: number
  total_income: number // from staking, mining, etc.
  deductible_expenses: number
  transactions_included: number
  report_status: 'draft' | 'final' | 'filed'
  generated_at: string
}

export interface CapitalGainLoss {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  transaction_id: string
  crypto_symbol: string
  buy_date: string
  sell_date: string
  buy_price: number
  sell_price: number
  amount: number
  gain_loss: number
  holding_period: number // days
  gain_loss_type: 'short_term' | 'long_term'
  cost_basis_method: 'fifo' | 'lifo' | 'specific_identification'
}

// =============================================================================
// INSTITUTIONAL FEATURES
// =============================================================================

export interface InstitutionalAccount {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  account_name: string
  account_type: 'corporate' | 'fund' | 'treasury' | 'trading'
  custodian: string
  aum: number // Assets Under Management
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive'
  compliance_status: 'compliant' | 'pending' | 'non_compliant'
  reporting_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  managers: string[]
  created_at: string
  updated_at: string
}

export interface ComplianceRule {
  id: string
  company_id: string // 🔒 CRITICAL: Multi-tenant security
  rule_name: string
  rule_type: 'allocation_limit' | 'holding_period' | 'volatility_limit' | 'counterparty_limit'
  parameters: Record<string, any>
  is_active: boolean
  violation_count: number
  last_checked: string
  created_at: string
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

export interface UseCryptoDataReturn {
  // Core data
  holdings: CryptoHolding[]
  transactions: CryptoTransaction[]
  wallets: CryptoWallet[]
  watchlist: CryptoWatchlist[]
  alerts: CryptoPriceAlert[]
  
  // Market data
  marketPrices: CryptoCurrency[]
  portfolioMetrics: CryptoPortfolioMetrics | null
  
  // DeFi & NFTs
  defiPositions: DeFiPosition[]
  nftCollections: NFTCollection[]
  
  // Analytics
  riskMetrics: RiskMetrics | null
  
  // State
  loading: boolean
  error: string | null
  
  // Actions
  refreshAll: () => Promise<void>
  refreshHoldings: () => Promise<void>
  refreshTransactions: () => Promise<void>
  refreshMarketData: () => Promise<void>
}

export interface UseCryptoFiltersReturn {
  filters: {
    crypto_symbols: string[]
    platforms: string[]
    date_range: { start: string; end: string }
    transaction_types: string[]
    min_value: number
    max_value: number
    profit_loss_filter: 'all' | 'profit' | 'loss'
  }
  updateFilter: (key: keyof UseCryptoFiltersReturn['filters'], value: any) => void
  resetFilters: () => void
  filterHoldings: (holdings: CryptoHolding[]) => CryptoHolding[]
  filterTransactions: (transactions: CryptoTransaction[]) => CryptoTransaction[]
  hasActiveFilters: boolean
}

export interface UseMarketDataReturn {
  cryptocurrencies: CryptoCurrency[]
  marketSentiment: MarketSentiment | null
  news: CryptoNews[]
  loading: boolean
  error: string | null
  refreshMarketData: () => Promise<void>
  refreshNews: () => Promise<void>
}

export interface UseTradingReturn {
  strategies: TradingStrategy[]
  dcaTrades: DCATrade[]
  loading: boolean
  error: string | null
  createStrategy: (strategy: Omit<TradingStrategy, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateStrategy: (id: string, updates: Partial<TradingStrategy>) => Promise<void>
  deleteStrategy: (id: string) => Promise<void>
  createDCATrade: (trade: Omit<DCATrade, 'id' | 'created_at'>) => Promise<void>
  refreshAll: () => Promise<void>
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface CryptoHeaderProps {
  onFiltersChange: (filters: any) => void
  onExport: () => void
  onAddTransaction: () => void
  onAddAlert: () => void
  onSync: () => void
  loading?: boolean
}

export interface PortfolioOverviewProps {
  metrics: CryptoPortfolioMetrics | null
  loading?: boolean
}

export interface CryptoTableProps {
  holdings: CryptoHolding[]
  loading?: boolean
  onEdit?: (holding: CryptoHolding) => void
  onDelete?: (id: string) => void
}

export interface PriceChartProps {
  symbol: string
  data: PriceHistoryData[]
  indicators?: TechnicalIndicator[]
  loading?: boolean
}

export interface AllocationChartProps {
  data: AllocationData[]
  title?: string
  showLegend?: boolean
  loading?: boolean
}

export interface WatchlistProps {
  watchlist: CryptoWatchlist[]
  marketPrices: CryptoCurrency[]
  loading?: boolean
  onAddCrypto: () => void
  onRemoveCrypto: (id: string) => void
}

export interface NewsWidgetProps {
  news: CryptoNews[]
  loading?: boolean
  maxItems?: number
}

export interface AlertsManagerProps {
  alerts: CryptoPriceAlert[]
  loading?: boolean
  onCreateAlert: (alert: Omit<CryptoPriceAlert, 'id' | 'created_at'>) => void
  onUpdateAlert: (id: string, updates: Partial<CryptoPriceAlert>) => void
  onDeleteAlert: (id: string) => void
}

export interface TradingInterfaceProps {
  strategies: TradingStrategy[]
  loading?: boolean
  onCreateStrategy: (strategy: Omit<TradingStrategy, 'id' | 'created_at' | 'updated_at'>) => void
  onUpdateStrategy: (id: string, updates: Partial<TradingStrategy>) => void
}

export interface RiskAnalysisProps {
  riskMetrics: RiskMetrics | null
  portfolioMetrics: CryptoPortfolioMetrics | null
  loading?: boolean
}

export interface DeFiDashboardProps {
  positions: DeFiPosition[]
  loading?: boolean
  onStake: () => void
  onUnstake: () => void
  onClaimRewards: () => void
}