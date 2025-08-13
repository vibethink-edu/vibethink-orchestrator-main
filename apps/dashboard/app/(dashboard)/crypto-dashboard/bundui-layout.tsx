/**
 * Crypto Dashboard - Bundui Premium Inspired Layout
 * Simplified layout matching the Bundui Premium crypto dashboard reference
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React from 'react'
import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'

// Import Bundui-inspired components
import { 
  CryptoOverviewCard,
  DigitalWalletsCard,
  TradingCard,
  ChartBalanceSummary,
  RecentActivities
} from './components'

// Import hooks for data management
import { useCryptoData } from './hooks/useCryptoData'
import { useCryptoFilters } from './hooks/useCryptoFilters'

export default function CryptoDashboardBunduiLayout() {
  // Data hooks with multi-tenant security
  const { 
    holdings, 
    transactions, 
    wallets, 
    portfolioMetrics,
    loading, 
    error, 
    refreshAll 
  } = useCryptoData()
  
  const handleDownload = () => {
    console.log('Download crypto data')
    // TODO: Implement download functionality
  }

  const handleBuyClick = () => {
    console.log('Buy crypto clicked')
    // TODO: Open trading modal or navigate to trading interface
  }

  const handleWalletClick = (wallet: any) => {
    console.log('Wallet clicked:', wallet)
    // TODO: Open wallet details
  }

  const handleAddWallet = () => {
    console.log('Add wallet clicked')
    // TODO: Open add wallet dialog
  }

  const handleTrade = (data: any) => {
    console.log('Trade submitted:', data)
    // TODO: Process trade
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-2xl">⚠️</div>
            <h3 className="text-lg font-semibold">Error Loading Crypto Data</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={refreshAll}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 p-6">
        {/* Header */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            Crypto Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Top Row - Overview Cards */}
          <div className="gap-4 space-y-4 lg:grid lg:grid-cols-6 lg:space-y-0">
            <div className="lg:col-span-12 xl:col-span-2">
              <CryptoOverviewCard
                metrics={portfolioMetrics}
                loading={loading}
                onBuyClick={handleBuyClick}
                onViewDetails={() => console.log('View portfolio details')}
              />
            </div>
            <div className="lg:col-span-6 xl:col-span-2">
              <DigitalWalletsCard
                wallets={wallets}
                loading={loading}
                onWalletClick={handleWalletClick}
                onAddWallet={handleAddWallet}
              />
            </div>
            <div className="lg:col-span-6 xl:col-span-2">
              <TradingCard
                loading={loading}
                availableBalance={portfolioMetrics?.total_value || 46200}
                onTrade={handleTrade}
              />
            </div>
          </div>

          {/* Bottom Row - Charts and Activities */}
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <RecentActivities
                transactions={transactions.slice(0, 5)}
                loading={loading}
              />
            </div>
            <div className="xl:col-span-2">
              <ChartBalanceSummary
                loading={loading}
                onExport={() => console.log('Export balance summary')}
              />
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex items-center space-x-4 bg-background p-6 rounded-lg border shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-lg font-medium">Loading crypto data...</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}