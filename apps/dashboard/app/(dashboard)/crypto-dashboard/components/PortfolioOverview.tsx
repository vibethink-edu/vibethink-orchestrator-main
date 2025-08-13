/**
 * Portfolio Overview Component
 * Displays main portfolio metrics and summary cards
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Wallet,
  Activity,
  BarChart3,
  Percent
} from 'lucide-react'
import { PortfolioOverviewProps } from '../types'

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ 
  metrics, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                <div className="h-8 w-32 bg-muted rounded mb-2"></div>
                <div className="h-4 w-16 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No portfolio data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number, showSign = true) => {
    const sign = showSign && value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Portfolio Value */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">
                {formatCurrency(metrics.total_value)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cost: {formatCurrency(metrics.total_cost)}
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 24h Change */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">24h Change</p>
              <p className={`text-2xl font-bold ${
                metrics.daily_change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(metrics.daily_change_percentage)}
              </p>
              <p className={`text-xs mt-1 ${
                metrics.daily_change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.daily_change >= 0 ? '+' : ''}{formatCurrency(metrics.daily_change)}
              </p>
            </div>
            <div className={`p-2 rounded-full ${
              metrics.daily_change >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {metrics.daily_change >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total P&L */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total P&L</p>
              <p className={`text-2xl font-bold ${
                metrics.total_profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.total_profit_loss >= 0 ? '+' : ''}{formatCurrency(metrics.total_profit_loss)}
              </p>
              <p className={`text-xs mt-1 ${
                metrics.total_profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(metrics.total_profit_loss_percentage)}
              </p>
            </div>
            <div className={`p-2 rounded-full ${
              metrics.total_profit_loss >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Target className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Performer */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Best Performer</p>
              <p className="text-lg font-bold">
                {metrics.best_performer.symbol}
              </p>
              <p className="text-xs text-green-600 mt-1">
                +{formatPercentage(metrics.best_performer.profit_loss_percentage, false)}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Change */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">7d Change</p>
              <p className={`text-xl font-bold ${
                metrics.weekly_change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(metrics.weekly_change_percentage)}
              </p>
              <p className={`text-xs mt-1 ${
                metrics.weekly_change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.weekly_change >= 0 ? '+' : ''}{formatCurrency(metrics.weekly_change)}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Change */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">30d Change</p>
              <p className={`text-xl font-bold ${
                metrics.monthly_change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(metrics.monthly_change_percentage)}
              </p>
              <p className={`text-xs mt-1 ${
                metrics.monthly_change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.monthly_change >= 0 ? '+' : ''}{formatCurrency(metrics.monthly_change)}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Largest Holding */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Largest Holding</p>
              <p className="text-lg font-bold">
                {metrics.largest_holding.symbol}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercentage(metrics.largest_holding.percentage, false)} of portfolio
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <Percent className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Worst Performer */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Worst Performer</p>
              <p className="text-lg font-bold">
                {metrics.worst_performer.symbol}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {formatPercentage(metrics.worst_performer.profit_loss_percentage)}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}