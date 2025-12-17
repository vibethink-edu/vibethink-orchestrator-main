'use client'

import { Area, AreaChart, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { 
  ChartConfig, 
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@vibethink/ui'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useAnalyticsData } from '../hooks'
import { AnalyticsCardProps } from '../types'

// Chart configuration with HSL variables
const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))'
  },
  profit: {
    label: 'Net Profit',
    color: 'hsl(var(--chart-2))'
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-3))'
  },
  growth: {
    label: 'Growth Rate',
    color: 'hsl(var(--chart-4))'
  }
} satisfies ChartConfig

// Mock earnings data for demonstration
const earningsData = [
  { month: 'Jan', revenue: 125000, profit: 45000, expenses: 80000, growthRate: 12.5 },
  { month: 'Feb', revenue: 142000, profit: 52000, expenses: 90000, growthRate: 13.6 },
  { month: 'Mar', revenue: 138000, profit: 48000, expenses: 90000, growthRate: 10.4 },
  { month: 'Apr', revenue: 156000, profit: 58000, expenses: 98000, growthRate: 13.0 },
  { month: 'May', revenue: 165000, profit: 62000, expenses: 103000, growthRate: 5.8 },
  { month: 'Jun', revenue: 178000, profit: 68000, expenses: 110000, growthRate: 7.9 },
  { month: 'Jul', revenue: 192000, profit: 75000, expenses: 117000, growthRate: 7.9 },
  { month: 'Aug', revenue: 185000, profit: 71000, expenses: 114000, growthRate: -3.6 },
  { month: 'Sep', revenue: 198000, profit: 78000, expenses: 120000, growthRate: 7.0 },
  { month: 'Oct', revenue: 210000, profit: 84000, expenses: 126000, growthRate: 6.1 },
  { month: 'Nov', revenue: 225000, profit: 92000, expenses: 133000, growthRate: 7.1 },
  { month: 'Dec', revenue: 240000, profit: 98000, expenses: 142000, growthRate: 6.7 }
]

// Quarterly breakdown data
const quarterlyData = [
  { quarter: 'Q1 2024', revenue: 405000, profit: 145000, expenses: 260000, margin: 35.8 },
  { quarter: 'Q2 2024', revenue: 499000, profit: 188000, expenses: 311000, margin: 37.7 },
  { quarter: 'Q3 2024', revenue: 575000, profit: 224000, expenses: 351000, margin: 39.0 },
  { quarter: 'Q4 2024', revenue: 675000, profit: 274000, expenses: 401000, margin: 40.6 }
]

/**
 * Earning Reports Card Component
 * 
 * Comprehensive earning analysis with multiple views:
 * - Monthly revenue, profit, and expense trends
 * - Quarterly performance comparison
 * - Growth rate analysis
 * - Profit margin calculations
 * 
 * Features interactive tabs for different data views
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

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              {formatPercentage(averageGrowthRate)} Avg Growth
            </Badge>
          </div>
        </div>
        
        <CardDescription>
          Detailed revenue analysis and profit trends
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
            <div className="text-lg font-bold">{formatPercentage(profitMargin)}</div>
            <div className="text-xs text-muted-foreground">Profit Margin</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="growth">Growth Rate</TabsTrigger>
          </TabsList>
          
          {/* Monthly Revenue and Profit Chart */}
          <TabsContent value="monthly" className="space-y-4">
            <div className="h-64">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="month" 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="url(#fillRevenue)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stackId="2"
                      stroke="hsl(var(--chart-2))"
                      fill="url(#fillProfit)"
                      strokeWidth={2}
                    />
                    <ChartLegend />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          
          {/* Quarterly Comparison */}
          <TabsContent value="quarterly" className="space-y-4">
            <div className="h-64">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={quarterlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="quarter" 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                    />
                    <ChartLegend />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          
          {/* Growth Rate Analysis */}
          <TabsContent value="growth" className="space-y-4">
            <div className="h-64">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="month" 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="growthRate"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--chart-4))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
