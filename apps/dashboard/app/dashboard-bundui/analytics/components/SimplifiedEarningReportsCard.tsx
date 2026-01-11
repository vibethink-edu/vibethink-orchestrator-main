'use client'

import { TrendingUp, DollarSign, BarChart3 } from "@vibethink/ui/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vibethink/ui/components/card'
import { Badge } from '@vibethink/ui/components/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vibethink/ui/components/tabs'
import { Skeleton } from '@vibethink/ui/components/skeleton'
import { useAnalyticsData } from '../hooks'
import { AnalyticsCardProps } from '../types'

// Mock earnings data for demonstration
const earningsData = [
  { month: 'Jan', revenue: 125000, profit: 45000, expenses: 80000, growthRate: 12.5 },
  { month: 'Feb', revenue: 142000, profit: 52000, expenses: 90000, growthRate: 13.6 },
  { month: 'Mar', revenue: 138000, profit: 48000, expenses: 90000, growthRate: 10.4 },
  { month: 'Apr', revenue: 156000, profit: 58000, expenses: 98000, growthRate: 13.0 },
  { month: 'May', revenue: 165000, profit: 62000, expenses: 103000, growthRate: 5.8 },
  { month: 'Jun', revenue: 178000, profit: 68000, expenses: 110000, growthRate: 7.9 }
]

/**
 * Simplified Earning Reports Card Component
 * 
 * Displays earning analysis with CSS-based visualizations
 */
export function EarningReportsCard({
  className = '',
  isLoading: externalLoading = false,
  error: externalError = null
}: AnalyticsCardProps) {
  const { earningReports, isLoading, error } = useAnalyticsData()

  const loading = isLoading || externalLoading
  const errorState = error || externalError

  // Calculate summary metrics
  const totalRevenue = earningsData.reduce((sum, item) => sum + item.revenue, 0)
  const totalProfit = earningsData.reduce((sum, item) => sum + item.profit, 0)
  const averageGrowthRate = earningsData.reduce((sum, item) => sum + item.growthRate, 0) / earningsData.length
  const profitMargin = (totalProfit / totalRevenue) * 100

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-4 h-8 w-full" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (errorState) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Reports</CardTitle>
          <CardDescription>
            {errorState.message || 'Failed to load earning reports'}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-chart-1" />
            Earning Reports
          </CardTitle>
          <Badge variant="outline" className="text-green-600">
            <TrendingUp className="mr-1 h-3 w-3" />
            {averageGrowthRate.toFixed(1)}% Avg Growth
          </Badge>
        </div>

        <CardDescription>
          Revenue analysis and profit trends
        </CardDescription>

        {/* Summary Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-lg font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{formatCurrency(totalProfit)}</div>
            <div className="text-xs text-muted-foreground">Net Profit</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{profitMargin.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Profit Margin</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Revenue Chart - CSS Visualization */}
        <div className="h-64 p-4">
          <div className="flex h-full items-end justify-between gap-2">
            {earningsData.map((item, index) => {
              const maxValue = Math.max(...earningsData.map(d => d.revenue))
              const height = (item.revenue / maxValue) * 100
              const profitHeight = (item.profit / maxValue) * 100

              return (
                <div key={item.month} className="flex flex-col items-center flex-1">
                  <div className="flex flex-col w-full h-full justify-end relative">
                    {/* Revenue Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm"
                      style={{ height: `${height}%` }}
                      title={`${item.month} Revenue: ${formatCurrency(item.revenue)}`}
                    />
                    {/* Profit Bar */}
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-sm opacity-80"
                      style={{ height: `${profitHeight}%` }}
                      title={`${item.month} Profit: ${formatCurrency(item.profit)}`}
                    />
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {item.month}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Monthly Data Table */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Monthly Breakdown</h4>
          <div className="space-y-1">
            {earningsData.slice(-3).map((item) => (
              <div key={item.month} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                <span className="font-medium">{item.month}</span>
                <div className="flex items-center gap-4">
                  <span>Revenue: {formatCurrency(item.revenue)}</span>
                  <span>Profit: {formatCurrency(item.profit)}</span>
                  <span className={`font-medium ${item.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.growthRate > 0 ? '+' : ''}{item.growthRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
