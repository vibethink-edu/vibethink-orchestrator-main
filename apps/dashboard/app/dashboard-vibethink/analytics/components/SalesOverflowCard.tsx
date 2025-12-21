'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { TrendingUp, TrendingDown, ShoppingCart, Target, AlertTriangle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@vibethink/ui/components/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@vibethink/ui/components/chart'
import { Badge } from '@vibethink/ui/components/badge'
import { Progress } from '@vibethink/ui/components/progress'
import { Skeleton } from '@vibethink/ui/components/skeleton'
import { useAnalyticsData } from '../hooks'
import { AnalyticsCardProps } from '../types'

// Chart configuration
const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))'
  },
  target: {
    label: 'Target',
    color: 'hsl(var(--chart-2))'
  },
  overflow: {
    label: 'Overflow',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig

// Mock sales overflow data
const salesOverflowData = [
  { period: 'Week 1', sales: 12000, target: 10000, overflow: 2000 },
  { period: 'Week 2', sales: 15000, target: 12000, overflow: 3000 },
  { period: 'Week 3', sales: 8000, target: 11000, overflow: 0 },
  { period: 'Week 4', sales: 18000, target: 13000, overflow: 5000 },
  { period: 'Week 5', sales: 14000, target: 12000, overflow: 2000 },
  { period: 'Week 6', sales: 20000, target: 15000, overflow: 5000 }
]

/**
 * Sales Overflow Card Component
 * 
 * Displays sales performance against targets:
 * - Sales vs target comparison
 * - Overflow metrics (sales exceeding targets)
 * - Performance indicators and trends
 * - Weekly breakdown with visualization
 * 
 * Shows both positive overflow (exceeding targets) and negative overflow (missing targets)
 */
export function SalesOverflowCard({
  className = '',
  isLoading: externalLoading = false,
  error: externalError = null
}: AnalyticsCardProps) {
  const { salesAnalytics, isLoading, error } = useAnalyticsData()

  const loading = isLoading || externalLoading
  const errorState = error || externalError

  // Calculate metrics
  const totalSales = salesOverflowData.reduce((sum, item) => sum + item.sales, 0)
  const totalTarget = salesOverflowData.reduce((sum, item) => sum + item.target, 0)
  const totalOverflow = salesOverflowData.reduce((sum, item) => sum + Math.max(0, item.overflow), 0)
  const targetAchievement = (totalSales / totalTarget) * 100
  const overflowPercentage = ((totalSales - totalTarget) / totalTarget) * 100

  // Performance classification
  const getPerformanceStatus = () => {
    if (targetAchievement >= 110) return { status: 'excellent', color: 'text-green-600', icon: TrendingUp }
    if (targetAchievement >= 100) return { status: 'good', color: 'text-green-500', icon: TrendingUp }
    if (targetAchievement >= 90) return { status: 'warning', color: 'text-yellow-500', icon: AlertTriangle }
    return { status: 'poor', color: 'text-red-500', icon: TrendingDown }
  }

  const performance = getPerformanceStatus()
  const IconComponent = performance.icon

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

  if (loading) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (errorState) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Sales Data</CardTitle>
          <CardDescription>
            {errorState.message || 'Failed to load sales overflow data'}
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
            <ShoppingCart className="h-5 w-5 text-chart-1" />
            Sales Performance
          </CardTitle>
          <Badge
            variant="outline"
            className={`gap-1 ${performance.color}`}
          >
            <IconComponent className="h-3 w-3" />
            {targetAchievement.toFixed(1)}%
          </Badge>
        </div>

        <CardDescription>
          Sales vs targets with overflow analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Performance Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Target Achievement</span>
            <span className={`font-medium ${performance.color}`}>
              {targetAchievement.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.min(targetAchievement, 120)}
            className="h-2"
          />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total Sales</div>
              <div className="font-medium">{formatCurrency(totalSales)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Target</div>
              <div className="font-medium">{formatCurrency(totalTarget)}</div>
            </div>
          </div>
        </div>

        {/* Sales Overflow Chart */}
        <div className="h-32">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesOverflowData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => value.replace('Week ', 'W')}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar
                  dataKey="target"
                  fill="hsl(var(--chart-2))"
                  radius={[2, 2, 2, 2]}
                  barSize={30}
                  opacity={0.6}
                />
                <Bar
                  dataKey="sales"
                  fill="hsl(var(--chart-1))"
                  radius={[2, 2, 2, 2]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          {/* Overflow Analysis */}
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-chart-3" />
                <span className="text-sm font-medium">Sales Overflow</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">
                  {formatCurrency(Math.max(0, totalSales - totalTarget))}
                </div>
                <div className={`text-xs ${overflowPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(overflowPercentage)}
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Performance Indicators */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Weekly Performance</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {salesOverflowData.slice(-4).map((week, index) => {
                const achievement = (week.sales / week.target) * 100
                const isGood = achievement >= 100

                return (
                  <div key={index} className="flex items-center justify-between rounded px-2 py-1 bg-muted/30">
                    <span>{week.period}</span>
                    <div className="flex items-center gap-1">
                      <span className={isGood ? 'text-green-600' : 'text-red-600'}>
                        {achievement.toFixed(0)}%
                      </span>
                      {isGood ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2 mb-2">
            <IconComponent className={`h-4 w-4 ${performance.color}`} />
            <span className="text-sm font-medium capitalize">
              {performance.status} Performance
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {performance.status === 'excellent' && 'Outstanding performance! Sales significantly exceed targets.'}
            {performance.status === 'good' && 'Good performance! Sales are meeting or exceeding targets.'}
            {performance.status === 'warning' && 'Caution: Sales are close to targets but need improvement.'}
            {performance.status === 'poor' && 'Action needed: Sales are significantly below targets.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
