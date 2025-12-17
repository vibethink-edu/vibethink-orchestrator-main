import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { FinancialSummaryCardsProps } from '../types'
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Target, AlertTriangle, Activity } from 'lucide-react'

/**
 * FinancialSummaryCards Component
 * 
 * Displays key financial metrics in a responsive card grid.
 * Shows revenue, expenses, profit, cash balance, and other key indicators.
 * 
 * Features:
 * - Real-time financial metrics display
 * - Trend indicators with color coding
 * - Currency formatting
 * - Loading states with skeletons
 * - Responsive grid layout
 * - HSL color variables for theme compatibility
 */
export function FinancialSummaryCards({ metrics, loading, className }: FinancialSummaryCardsProps) {
  if (loading || !metrics) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className || ''}`}>
        {Array.from({ length: 8 }, (_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px] mb-2" />
              <Skeleton className="h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getTrendIcon = (value: number, isReversed = false) => {
    const isPositive = isReversed ? value < 0 : value > 0
    const TrendIcon = isPositive ? TrendingUp : TrendingDown
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600'
    return <TrendIcon className={`h-4 w-4 ${colorClass}`} />
  }

  const getTrendBadgeVariant = (value: number, isReversed = false) => {
    const isPositive = isReversed ? value < 0 : value > 0
    return isPositive ? 'default' : 'destructive'
  }

  const getHealthStatus = (ratio: number, thresholds: { healthy: number; warning: number }) => {
    if (ratio >= thresholds.healthy) return { color: 'text-green-600', status: 'Healthy' }
    if (ratio >= thresholds.warning) return { color: 'text-yellow-600', status: 'Warning' }
    return { color: 'text-red-600', status: 'Critical' }
  }

  const profitMarginHealth = getHealthStatus(metrics.profit_margin, { healthy: 20, warning: 10 })
  const runwayHealth = getHealthStatus(metrics.runway_months, { healthy: 12, warning: 6 })

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className || ''}`}>
      {/* Total Revenue */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(metrics.total_revenue)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {getTrendIcon(metrics.monthly_growth.revenue)}
            <Badge variant={getTrendBadgeVariant(metrics.monthly_growth.revenue)} className="text-xs">
              {formatPercentage(metrics.monthly_growth.revenue)}
            </Badge>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-3xl" />
      </Card>

      {/* Total Expenses */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-red-600" />
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(metrics.total_expenses)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {getTrendIcon(metrics.monthly_growth.expenses, true)}
            <Badge variant={getTrendBadgeVariant(metrics.monthly_growth.expenses, true)} className="text-xs">
              {formatPercentage(metrics.monthly_growth.expenses)}
            </Badge>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-3xl" />
      </Card>

      {/* Net Profit */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            Net Profit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(metrics.net_profit)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {getTrendIcon(metrics.monthly_growth.profit)}
            <Badge variant={getTrendBadgeVariant(metrics.monthly_growth.profit)} className="text-xs">
              {formatPercentage(metrics.monthly_growth.profit)}
            </Badge>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-3xl" />
      </Card>

      {/* Cash Balance */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-purple-600" />
            Cash Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(metrics.cash_balance)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {metrics.runway_months} months runway
            </span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-3xl" />
      </Card>

      {/* Profit Margin */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-600" />
            Profit Margin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {metrics.profit_margin.toFixed(1)}%
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${profitMarginHealth.color.replace('text-', 'bg-')}`} />
            <span className={`text-xs font-medium ${profitMarginHealth.color}`}>
              {profitMarginHealth.status}
            </span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-3xl" />
      </Card>

      {/* Growth Rate */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Growth Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatPercentage(metrics.growth_rate)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">
              YoY revenue growth
            </span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-3xl" />
      </Card>

      {/* Burn Rate */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            Monthly Burn Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(metrics.burn_rate)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${runwayHealth.color.replace('text-', 'bg-')}`} />
            <span className={`text-xs font-medium ${runwayHealth.color}`}>
              {runwayHealth.status}
            </span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-3xl" />
      </Card>

      {/* Budget Variance */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-cyan-600" />
            Budget Variance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatPercentage(metrics.budget_variance.overall)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {getTrendIcon(metrics.budget_variance.overall)}
            <span className="text-xs text-muted-foreground">
              vs planned budget
            </span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-3xl" />
      </Card>
    </div>
  )
}
