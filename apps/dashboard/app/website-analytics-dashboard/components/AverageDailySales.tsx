'use client'

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { BarChart3, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/shared/components/ui/chart'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useAnalyticsData } from '../hooks'
import { AnalyticsCardProps } from '../types'

// Chart configuration
const chartConfig = {
  sales: {
    label: 'Daily Sales',
    color: 'hsl(var(--chart-1))'
  },
  average: {
    label: 'Average',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

// Mock daily sales data for the last 30 days
const dailySalesData = [
  { date: '2024-01-01', sales: 4200, day: 'Mon' },
  { date: '2024-01-02', sales: 3800, day: 'Tue' },
  { date: '2024-01-03', sales: 4500, day: 'Wed' },
  { date: '2024-01-04', sales: 5200, day: 'Thu' },
  { date: '2024-01-05', sales: 4800, day: 'Fri' },
  { date: '2024-01-06', sales: 3200, day: 'Sat' },
  { date: '2024-01-07', sales: 2800, day: 'Sun' },
  { date: '2024-01-08', sales: 4400, day: 'Mon' },
  { date: '2024-01-09', sales: 4100, day: 'Tue' },
  { date: '2024-01-10', sales: 4700, day: 'Wed' },
  { date: '2024-01-11', sales: 5500, day: 'Thu' },
  { date: '2024-01-12', sales: 5100, day: 'Fri' },
  { date: '2024-01-13', sales: 3600, day: 'Sat' },
  { date: '2024-01-14', sales: 3100, day: 'Sun' },
  { date: '2024-01-15', sales: 4600, day: 'Mon' },
  { date: '2024-01-16', sales: 4300, day: 'Tue' },
  { date: '2024-01-17', sales: 4900, day: 'Wed' },
  { date: '2024-01-18', sales: 5800, day: 'Thu' },
  { date: '2024-01-19', sales: 5400, day: 'Fri' },
  { date: '2024-01-20', sales: 3900, day: 'Sat' },
  { date: '2024-01-21', sales: 3300, day: 'Sun' },
  { date: '2024-01-22', sales: 4800, day: 'Mon' },
  { date: '2024-01-23', sales: 4500, day: 'Tue' },
  { date: '2024-01-24', sales: 5100, day: 'Wed' },
  { date: '2024-01-25', sales: 6200, day: 'Thu' },
  { date: '2024-01-26', sales: 5800, day: 'Fri' },
  { date: '2024-01-27', sales: 4100, day: 'Sat' },
  { date: '2024-01-28', sales: 3500, day: 'Sun' },
  { date: '2024-01-29', sales: 5000, day: 'Mon' },
  { date: '2024-01-30', sales: 4700, day: 'Tue' }
]

/**
 * Average Daily Sales Component
 * 
 * Displays daily sales trends and averages:
 * - Line chart showing daily sales over time
 * - Average sales calculation and trends
 * - Weekly pattern analysis
 * - Performance indicators
 * 
 * Helps identify sales patterns and seasonal trends
 */
export function AverageDailySales({ 
  className = '',
  isLoading: externalLoading = false,
  error: externalError = null
}: AnalyticsCardProps) {
  const { dailySales, isLoading, error } = useAnalyticsData()
  
  const loading = isLoading || externalLoading
  const errorState = error || externalError

  // Calculate metrics
  const totalSales = dailySalesData.reduce((sum, day) => sum + day.sales, 0)
  const averageDailySales = totalSales / dailySalesData.length
  const highestSales = Math.max(...dailySalesData.map(day => day.sales))
  const lowestSales = Math.min(...dailySalesData.map(day => day.sales))
  
  // Calculate week-over-week growth
  const lastWeekSales = dailySalesData.slice(-7).reduce((sum, day) => sum + day.sales, 0) / 7
  const previousWeekSales = dailySalesData.slice(-14, -7).reduce((sum, day) => sum + day.sales, 0) / 7
  const weeklyGrowth = ((lastWeekSales - previousWeekSales) / previousWeekSales) * 100

  // Weekly averages by day of week
  const weeklyAverages = dailySalesData.reduce((acc, day) => {
    if (!acc[day.day]) acc[day.day] = []
    acc[day.day].push(day.sales)
    return acc
  }, {} as Record<string, number[]>)

  const weeklyPattern = Object.entries(weeklyAverages).map(([day, sales]) => ({
    day,
    average: sales.reduce((sum, s) => sum + s, 0) / sales.length
  }))

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
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
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-48 w-full" />
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
            {errorState.message || 'Failed to load daily sales data'}
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
            Average Daily Sales
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`gap-1 ${weeklyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            <TrendingUp className="h-3 w-3" />
            {weeklyGrowth > 0 ? '+' : ''}{weeklyGrowth.toFixed(1)}%
          </Badge>
        </div>
        
        <CardDescription>
          Daily sales trends and performance analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center rounded-lg bg-muted/50 p-3">
            <div className="text-lg font-bold">{formatCurrency(averageDailySales)}</div>
            <div className="text-xs text-muted-foreground">Daily Average</div>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
            <div className="text-lg font-bold text-green-600">{formatCurrency(highestSales)}</div>
            <div className="text-xs text-muted-foreground">Highest Day</div>
          </div>
          <div className="text-center rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
            <div className="text-lg font-bold text-red-600">{formatCurrency(lowestSales)}</div>
            <div className="text-xs text-muted-foreground">Lowest Day</div>
          </div>
        </div>

        {/* Daily Sales Chart */}
        <div className="h-64">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={dailySalesData} 
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [
                      formatCurrency(value as number),
                      'Daily Sales'
                    ]}
                    labelFormatter={(label) => {
                      const date = new Date(label)
                      return date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    }}
                  />} 
                />
                {/* Average line */}
                <Line
                  type="monotone"
                  dataKey={() => averageDailySales}
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Average"
                />
                {/* Daily sales line */}
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, stroke: 'hsl(var(--chart-1))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Weekly Pattern Analysis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-chart-1" />
            <h4 className="text-sm font-medium">Weekly Sales Pattern</h4>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const dayData = weeklyPattern.find(p => p.day === day)
              const average = dayData?.average || 0
              const percentage = (average / averageDailySales) * 100
              
              return (
                <div key={day} className="text-center">
                  <div className="text-muted-foreground mb-1">{day}</div>
                  <div className="h-12 bg-muted rounded flex items-end justify-center relative">
                    <div 
                      className="w-full bg-chart-1 rounded"
                      style={{ 
                        height: `${Math.max(percentage, 10)}%`,
                        backgroundColor: 'hsl(var(--chart-1))',
                        opacity: 0.7
                      }}
                    />
                  </div>
                  <div className="mt-1 font-medium">
                    {formatCurrency(average).replace('$', '$').replace(',', 'K').replace('000', '')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">30-Day Performance</span>
            <span className="font-medium">{formatCurrency(totalSales)} total</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>• Best performing days: Thursday & Friday</p>
            <p>• Weekend sales typically 25% lower than weekdays</p>
            <p>• {weeklyGrowth > 0 ? 'Positive' : 'Negative'} week-over-week trend</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}