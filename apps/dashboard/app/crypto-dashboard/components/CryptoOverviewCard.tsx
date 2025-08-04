/**
 * Crypto Overview Card Component - Bundui Premium Inspired
 * Main overview card with portfolio summary and key metrics
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { 
  ArrowUpRight, 
  ChevronRight, 
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  Target
} from 'lucide-react'
import { CryptoPortfolioMetrics } from '../types'

interface CryptoOverviewCardProps {
  metrics?: CryptoPortfolioMetrics | null
  loading?: boolean
  onBuyClick?: () => void
  onViewDetails?: () => void
}

export const CryptoOverviewCard: React.FC<CryptoOverviewCardProps> = ({
  metrics,
  loading = false,
  onBuyClick,
  onViewDetails
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number, showSign = true) => {
    const sign = showSign && value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  const formatCrypto = (amount: number, symbol: string) => {
    return `${amount.toFixed(6)} ${symbol}`
  }

  if (loading) {
    return (
      <Card className="from-chart-1/40 to-chart-2/60 h-full gap-2 space-y-0 overflow-hidden border-0 bg-gradient-to-r py-0">
        <CardHeader className="pt-6 pb-0">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-white/20 rounded"></div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="bg-background space-y-6 rounded-lg p-4">
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-10 w-16 bg-muted rounded"></div>
                  <div className="h-4 w-20 bg-muted rounded"></div>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <div className="h-8 w-8 bg-muted-foreground/20 rounded"></div>
                  <div className="h-4 w-12 bg-muted-foreground/20 rounded mt-2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-32 bg-muted rounded"></div>
                <div className="h-4 w-24 bg-muted rounded"></div>
              </div>
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mock data if no metrics provided
  const mockMetrics = {
    total_transactions: 150,
    active_wallets: 3,
    total_value: 46200,
    primary_crypto_amount: 4.620910,
    primary_crypto_symbol: 'USDT',
    daily_change_percentage: 12
  }

  const displayMetrics = metrics ? {
    total_transactions: 150, // This would come from transaction count
    active_wallets: 3, // This would come from wallet count
    total_value: metrics.total_value,
    primary_crypto_amount: 4.620910, // This would be calculated from largest holding
    primary_crypto_symbol: metrics.largest_holding?.symbol || 'USDT',
    daily_change_percentage: metrics.daily_change_percentage
  } : mockMetrics

  return (
    <Card className="from-chart-1/40 to-chart-2/60 h-full gap-2 space-y-0 overflow-hidden border-0 bg-gradient-to-r py-0">
      <CardHeader className="pt-6 pb-0">
        <h2 className="text-2xl font-bold text-white">Overview</h2>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-background space-y-6 rounded-lg p-4">
          {/* Top Stats Row */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-4xl font-semibold">{displayMetrics.total_transactions}</h3>
              <p className="text-muted-foreground">Transactions</p>
            </div>
            <div className="bg-muted flex flex-col items-center justify-center rounded-xl p-3 min-w-[80px]">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="text-2xl font-semibold">{displayMetrics.active_wallets}</h3>
              </div>
              <p className="text-muted-foreground text-xs text-center">Active<br />Wallets</p>
            </div>
          </div>

          {/* Portfolio Value */}
          <div className="space-y-1">
            <h3 className="font-display text-3xl lg:text-4xl font-bold">
              {formatCurrency(displayMetrics.total_value)}
            </h3>
            <p className="text-muted-foreground">Current portfolio value</p>
            {metrics && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">P&L:</span>
                <span className={`font-medium ${
                  metrics.total_profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.total_profit_loss >= 0 ? '+' : ''}{formatCurrency(metrics.total_profit_loss)}
                </span>
                <Badge 
                  variant="outline" 
                  className={`${
                    metrics.total_profit_loss >= 0 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-red-100 text-red-700 border-red-200'
                  }`}
                >
                  {metrics.total_profit_loss >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {formatPercentage(metrics.total_profit_loss_percentage)}
                </Badge>
              </div>
            )}
          </div>

          {/* Primary Crypto and Actions */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">
                {displayMetrics.primary_crypto_amount.toLocaleString()}
              </span>
              <span className="text-muted-foreground">{displayMetrics.primary_crypto_symbol}</span>
              <Badge className={`${
                displayMetrics.daily_change_percentage >= 0
                  ? 'bg-green-100 text-green-600 border-green-200'
                  : 'bg-red-100 text-red-600 border-red-200'
              }`}>
                <ArrowUpRight className="mr-0.5 size-3" />
                {Math.abs(displayMetrics.daily_change_percentage)}%
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={onBuyClick}
                className="bg-primary hover:bg-primary/90"
              >
                Buy
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Additional Stats */}
          {metrics && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {metrics.best_performer?.symbol || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Best Performer</div>
                <div className="text-xs text-green-600">
                  +{metrics.best_performer?.profit_loss_percentage?.toFixed(1) || '0'}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {formatPercentage(metrics.weekly_change_percentage, false)}
                </div>
                <div className="text-xs text-muted-foreground">7-Day Change</div>
                <div className={`text-xs ${
                  metrics.weekly_change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(Math.abs(metrics.weekly_change))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onViewDetails}
              className="flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              View Portfolio
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Target className="h-4 w-4" />
              Set Alerts
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}