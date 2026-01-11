/**
 * Crypto Dashboard Page
 * VibeThink Orchestrator - Multi-tenant Cryptocurrency Management
 * 
 * Complete crypto dashboard with portfolio management, trading features, DeFi integration, and NFT tracking
 * Following VThink 1.0 methodology with multi-tenant security and DashboardLayout
 */

'use client'

import React, { useState } from 'react'
  ;
import { Tabs, TabsContent, TabsList, TabsTrigger, Card, CardContent } from '@vibethink/ui'
import { formatCurrency } from '@vibethink/utils';
import {
  Bitcoin,
  TrendingUp,
  Wallet,
  PieChart,
  Target,
  AlertTriangle,
  BarChart3,
  Settings,
  DollarSign,
  Shield,
  Zap,
  Activity,
  Globe,
  Bell,
  Star,
  ArrowUpDown,
  Coins,
  TrendingDown
} from 'lucide-react'

// Import crypto components
import { PortfolioOverview } from './components/PortfolioOverview'
import { CryptoTable } from './components/CryptoTable'
import { PriceChart } from './components/PriceChart'
import { AllocationChart } from './components/AllocationChart'
import { WatchlistWidget } from './components/WatchlistWidget'
import { NewsWidget } from './components/NewsWidget'
import { AlertsManager } from './components/AlertsManager'
import { TradingInterface } from './components/TradingInterface'
import { RiskAnalysis } from './components/RiskAnalysis'
import { DeFiDashboard } from './components/DeFiDashboard'
import { NFTGallery } from './components/NFTGallery'
import { CryptoHeader } from './components/CryptoHeader'
import { MarketOverview } from './components/MarketOverview'
import { PerformanceMetrics } from './components/PerformanceMetrics'
import { TransactionHistory } from './components/TransactionHistory'

// Import hooks for data management
import { useCryptoData } from './hooks/useCryptoData'
import { useCryptoFilters } from './hooks/useCryptoFilters'
import { useMarketData } from './hooks/useMarketData'
import { useTrading } from './hooks/useTrading'

export default function CryptoDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Data hooks with multi-tenant security
  const {
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
    refreshAll
  } = useCryptoData()

  const {
    filters,
    updateFilter,
    resetFilters,
    filterHoldings,
    filterTransactions,
    hasActiveFilters
  } = useCryptoFilters()

  const {
    cryptocurrencies,
    marketSentiment,
    news,
    loading: marketLoading,
    refreshMarketData,
    refreshNews
  } = useMarketData()

  const {
    strategies,
    dcaTrades,
    loading: tradingLoading,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    createDCATrade
  } = useTrading()

  // Filter data based on current filters
  const filteredHoldings = filterHoldings(holdings)
  const filteredTransactions = filterTransactions(transactions)

  const handleFiltersChange = (newFilters: any) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      updateFilter(key as any, value)
    })
  }

  const handleExport = () => {
    console.log('Export crypto data')
    // TODO: Implement export functionality
  }

  const handleAddTransaction = () => {
    console.log('Add new transaction')
    // TODO: Implement add transaction dialog
  }

  const handleAddAlert = () => {
    console.log('Add new price alert')
    // TODO: Implement add alert dialog
  }

  const handleSync = async () => {
    console.log('Sync all data')
    await refreshAll()
    await refreshMarketData()
    await refreshNews()
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-2xl">⚠️</div>
              <h3 className="text-lg font-semibold">Error Loading Crypto Data</h3>
              <p className="text-muted-foreground">{error}</p>
              <button
                onClick={refreshAll}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with filters and actions */}
      <CryptoHeader
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        onAddTransaction={handleAddTransaction}
        onAddAlert={handleAddAlert}
        onSync={handleSync}
        loading={loading}
      />

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center space-x-2">
            <Wallet className="h-4 w-4" />
            <span>Portfolio</span>
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4" />
            <span>Trading</span>
          </TabsTrigger>
          <TabsTrigger value="defi" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>DeFi</span>
          </TabsTrigger>
          <TabsTrigger value="nft" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>NFTs</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Portfolio Overview Cards */}
          <PortfolioOverview metrics={portfolioMetrics} loading={loading} />

          {/* Market Overview */}
          <MarketOverview
            sentiment={marketSentiment || undefined}
            topCryptos={cryptocurrencies.slice(0, 10)}
            loading={marketLoading}
          />

          {/* Main Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Portfolio Performance</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">24h</span>
                      <span className={`text-sm font-medium ${(portfolioMetrics?.daily_change_percentage ?? 0) > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}>
                        {(portfolioMetrics?.daily_change_percentage ?? 0) > 0 ? '+' : ''}
                        {portfolioMetrics?.daily_change_percentage?.toFixed(2) ?? '0.00'}%
                      </span>
                    </div>
                  </div>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Portfolio Performance Chart
                    <br />
                    <small className="text-xs">(Chart implementation pending)</small>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <WatchlistWidget
                watchlist={watchlist}
                marketPrices={marketPrices}
                loading={loading}
                onAddCrypto={() => console.log('Add crypto to watchlist')}
                onRemoveCrypto={(id) => console.log('Remove crypto:', id)}
              />
            </div>
          </div>

          {/* Secondary Row */}
          <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
            <AllocationChart
              data={portfolioMetrics?.allocation_by_crypto || []}
              title="Portfolio Allocation"
              loading={loading}
            />
            <PerformanceMetrics
              metrics={portfolioMetrics}
              riskMetrics={riskMetrics}
              loading={loading}
            />
            <NewsWidget
              news={news.slice(0, 5)}
              loading={marketLoading}
              maxItems={5}
            />
          </div>

          {/* Holdings and Transactions */}
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <CryptoTable
                holdings={filteredHoldings.slice(0, 10)}
                loading={loading}
                onEdit={(holding) => console.log('Edit holding:', holding)}
                onDelete={(id) => console.log('Delete holding:', id)}
              />
            </div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Assets</span>
                    <span className="font-medium">{holdings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Wallets</span>
                    <span className="font-medium">{wallets.filter(w => w.is_active).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price Alerts</span>
                    <span className="font-medium">{alerts.filter(a => a.is_active).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">DeFi Positions</span>
                    <span className="font-medium">{defiPositions.filter(p => p.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">NFT Collections</span>
                    <span className="font-medium">{nftCollections.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          {/* Portfolio Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(portfolioMetrics?.total_value ?? 0)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">24h Change</p>
                    <p className={`text-2xl font-bold ${(portfolioMetrics?.daily_change_percentage ?? 0) > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                      }`}>
                      {(portfolioMetrics?.daily_change_percentage ?? 0) > 0 ? '+' : ''}
                      {portfolioMetrics?.daily_change_percentage?.toFixed(2) ?? '0.00'}%
                    </p>
                  </div>
                  {(portfolioMetrics?.daily_change_percentage ?? 0) > 0 ? (
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total P&L</p>
                    <p className={`text-2xl font-bold ${(portfolioMetrics?.total_profit_loss ?? 0) > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                      }`}>
                      {(portfolioMetrics?.total_profit_loss ?? 0) > 0 ? '+' : ''}
                      {formatCurrency(portfolioMetrics?.total_profit_loss ?? 0)}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Best Performer</p>
                    <p className="text-lg font-bold">
                      {portfolioMetrics?.best_performer?.symbol || 'N/A'}
                    </p>
                    <p className="text-sm text-green-600">
                      +{portfolioMetrics?.best_performer?.profit_loss_percentage?.toFixed(2) || '0'}%
                    </p>
                  </div>
                  <Bitcoin className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Analysis */}
          <div className="grid gap-6 lg:grid-cols-2">
            <AllocationChart
              data={portfolioMetrics?.allocation_by_crypto || []}
              title="Holdings by Cryptocurrency"
              loading={loading}
            />
            <AllocationChart
              data={portfolioMetrics?.allocation_by_category || []}
              title="Holdings by Category"
              loading={loading}
            />
          </div>

          {/* Holdings Table */}
          <CryptoTable
            holdings={filteredHoldings}
            loading={loading}
            onEdit={(holding) => console.log('Edit holding:', holding)}
            onDelete={(id) => console.log('Delete holding:', id)}
          />
        </TabsContent>

        {/* Trading Tab */}
        <TabsContent value="trading" className="space-y-6">
          <TradingInterface
            strategies={strategies}
            loading={tradingLoading}
            onCreateStrategy={createStrategy}
            onUpdateStrategy={updateStrategy}
          />

          <TransactionHistory
            transactions={filteredTransactions}
            loading={loading}
          />
        </TabsContent>

        {/* DeFi Tab */}
        <TabsContent value="defi" className="space-y-6">
          <DeFiDashboard
            positions={defiPositions}
            loading={loading}
            onStake={() => console.log('Stake tokens')}
            onUnstake={() => console.log('Unstake tokens')}
            onClaimRewards={() => console.log('Claim rewards')}
          />
        </TabsContent>

        {/* NFT Tab */}
        <TabsContent value="nft" className="space-y-6">
          <NFTGallery
            collections={nftCollections}
            loading={loading}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <RiskAnalysis
            riskMetrics={riskMetrics}
            portfolioMetrics={portfolioMetrics}
            loading={loading}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <PerformanceMetrics
              metrics={portfolioMetrics}
              riskMetrics={riskMetrics}
              loading={loading}
            />
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Technical Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">RSI (14)</span>
                    <span className="font-medium">65.4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">MACD</span>
                    <span className="font-medium text-green-600">Bullish</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">SMA (50)</span>
                    <span className="font-medium">$42,850</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volume</span>
                    <span className="font-medium">Above Average</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Support Level</span>
                    <span className="font-medium">$41,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Resistance Level</span>
                    <span className="font-medium">$45,800</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <AlertsManager
              alerts={alerts}
              loading={loading}
              onCreateAlert={(alert) => console.log('Create alert:', alert)}
              onUpdateAlert={(id, updates) => console.log('Update alert:', id, updates)}
              onDeleteAlert={(id) => console.log('Delete alert:', id)}
            />

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Portfolio Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Auto-sync Wallets</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Email Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Push Notifications</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Risk Alerts</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tax Reporting</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-lg font-medium">Loading crypto data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
