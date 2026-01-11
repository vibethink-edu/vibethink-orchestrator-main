'use client'

// Charts temporarily replaced with CSS visualizations
import { ChevronUpIcon, DollarSign, Coins, TrendingDown } from "@vibethink/ui/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vibethink/ui/components/card'
import {
  ChartConfig,
  ChartContainer
} from '@vibethink/ui/components/chart'
import { Badge } from '@vibethink/ui/components/badge'
import { Skeleton } from '@vibethink/ui/components/skeleton'
import { useTranslation } from '@/lib/i18n'
import { useAnalyticsData } from '../hooks'
import { AnalyticsCardProps } from '../types'

// Chart configuration with HSL color variables
const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))'
  },
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

// Mock chart data - in production this would come from analytics data
const chartData = [
  { month: 'Jan', revenue: 18600, profit: 8000 },
  { month: 'Feb', revenue: 30500, profit: 20000 },
  { month: 'Mar', revenue: 23700, profit: 12000 },
  { month: 'Apr', revenue: 7300, profit: 19000 },
  { month: 'May', revenue: 20900, profit: 13000 },
  { month: 'Jun', revenue: 21400, profit: 14000 }
]

/**
 * Total Earning Card Component
 * 
 * Displays comprehensive earning metrics with trends:
 * - Total earnings with percentage change
 * - Revenue vs profit comparison chart
 * - Breakdown of revenue sources
 * - Growth indicators and trends
 * 
 * Uses Recharts with HSL color variables for theming compatibility
 */
export function TotalEarningCard({
  className = '',
  isLoading: externalLoading = false,
  error: externalError = null
}: AnalyticsCardProps) {
  const { t } = useTranslation('analytics')
  const { earningReports, salesAnalytics, isLoading, error } = useAnalyticsData()

  const loading = isLoading || externalLoading
  const errorState = error || externalError

  // Calculate earnings metrics from data
  const latestEarnings = earningReports[0] || {
    total_earnings: 126840,
    growth_percentage: 24.2,
    profit_margin: 0.83,
    revenue_breakdown: {
      subscription: 85600,
      one_time_payment: 32400,
      commission: 6890,
      affiliate: 1950
    }
  }

  // Calculate total revenue and sales from sales analytics
  const totalRevenue = salesAnalytics.reduce((sum, sale) => sum + sale.revenue, 0) || 156742
  const totalRefunds = salesAnalytics.reduce((sum, sale) => sum + (sale.revenue * 0.02), 0) || 3134 // 2% refund rate

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getTrendIcon = (change: number) => {
    return change > 0 ? <ChevronUpIcon className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  const getTrendColor = (change: number) => {
    return change > 0 ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader>
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-4 h-32 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (errorState) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader>
          <CardTitle className="text-red-600">{t('error')}</CardTitle>
          <CardDescription>
            {errorState.message || t('noData')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              {t('pleaseWait')}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-chart-1" />
            {t('cards.totalEarning.title')}
          </CardDescription>
          <Badge
            variant="outline"
            className={`gap-1 ${getTrendColor(latestEarnings.growth_percentage)}`}
          >
            {getTrendIcon(latestEarnings.growth_percentage)}
            {formatPercentage(latestEarnings.growth_percentage)}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-display text-2xl font-bold lg:text-3xl">
            {Math.round(latestEarnings.profit_margin * 100)}%
          </div>
          <div className="text-muted-foreground text-sm">
            {t('cards.totalEarning.profitMargin')}
          </div>
        </div>

        <div className="text-muted-foreground text-sm">
          {formatCurrency(latestEarnings.total_earnings)} {t('cards.totalEarning.totalEarningsThisPeriod')}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Earnings Chart - CSS Visualization */}
        <div className="h-32">
          <div className="flex h-full items-end justify-between gap-1 p-2">
            {chartData.map((item, index) => {
              const maxValue = Math.max(...chartData.map(d => d.revenue))
              const height = (item.revenue / maxValue) * 100
              return (
                <div key={item.month} className="flex flex-col items-center flex-1">
                  <div className="flex flex-col w-full h-full justify-end">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm"
                      style={{ height: `${height}%` }}
                      title={`${item.month}: ${formatCurrency(item.revenue)}`}
                    />
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {item.month.slice(0, 3)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Revenue Sources */}
        <div className="space-y-4">
          {/* Total Revenue */}
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full border">
              <Coins className="size-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{t('cards.totalEarning.totalRevenue')}</div>
              <div className="text-xs text-muted-foreground">{t('cards.totalEarning.clientPayments')}</div>
            </div>
            <div className="text-sm font-bold text-green-600">
              +{formatCurrency(totalRevenue)}
            </div>
          </div>

          {/* Total Refunds */}
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background">
              <DollarSign className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{t('cards.totalEarning.refundsReturns')}</div>
              <div className="text-xs text-muted-foreground">{t('cards.totalEarning.customerReturns')}</div>
            </div>
            <div className="text-sm font-bold text-red-600">
              -{formatCurrency(totalRefunds)}
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{t('cards.totalEarning.revenueSources')}</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-1"></div>
                <span>{t('cards.totalEarning.subscriptions')}</span>
              </div>
              <span className="font-medium">
                {formatCurrency(latestEarnings.revenue_breakdown.subscription)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-2"></div>
                <span>{t('cards.totalEarning.oneTimeSales')}</span>
              </div>
              <span className="font-medium">
                {formatCurrency(latestEarnings.revenue_breakdown.one_time_payment)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-3"></div>
                <span>{t('cards.totalEarning.commissions')}</span>
              </div>
              <span className="font-medium">
                {formatCurrency(latestEarnings.revenue_breakdown.commission)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-4"></div>
                <span>{t('cards.totalEarning.affiliate')}</span>
              </div>
              <span className="font-medium">
                {formatCurrency(latestEarnings.revenue_breakdown.affiliate)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
