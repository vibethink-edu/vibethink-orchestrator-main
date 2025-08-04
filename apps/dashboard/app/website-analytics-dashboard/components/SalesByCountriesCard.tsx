'use client'

import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts'
import { Globe, TrendingUp, TrendingDown, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/shared/components/ui/chart'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useAnalyticsData } from '../hooks'
import { AnalyticsCardProps } from '../types'

// Chart configuration with country colors
const chartConfig = {
  usa: {
    label: 'United States',
    color: 'hsl(var(--chart-1))'
  },
  canada: {
    label: 'Canada',
    color: 'hsl(var(--chart-2))'
  },
  uk: {
    label: 'United Kingdom',
    color: 'hsl(var(--chart-3))'
  },
  germany: {
    label: 'Germany',
    color: 'hsl(var(--chart-4))'
  },
  australia: {
    label: 'Australia',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig

// Mock country sales data
const countrySalesData = [
  { 
    country: 'United States',
    code: 'US',
    sales: 124500,
    percentage: 42.3,
    growth: 12.5,
    orders: 1245,
    flag: '🇺🇸'
  },
  { 
    country: 'Canada',
    code: 'CA',
    sales: 85200,
    percentage: 28.9,
    growth: 8.7,
    orders: 890,
    flag: '🇨🇦'
  },
  { 
    country: 'United Kingdom',
    code: 'GB',
    sales: 45600,
    percentage: 15.5,
    growth: -2.3,
    orders: 567,
    flag: '🇬🇧'
  },
  { 
    country: 'Germany',
    code: 'DE',
    sales: 24800,
    percentage: 8.4,
    growth: 15.2,
    orders: 298,
    flag: '🇩🇪'
  },
  { 
    country: 'Australia',
    code: 'AU',
    sales: 14300,
    percentage: 4.9,
    growth: 5.1,
    orders: 156,
    flag: '🇦🇺'
  }
]

// Colors for pie chart
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
]

/**
 * Sales by Countries Card Component
 * 
 * Displays geographic sales distribution:
 * - Pie chart showing sales percentage by country
 * - Country-wise sales breakdown with growth rates
 * - Performance indicators for each market
 * - Total sales and order metrics
 * 
 * Provides insights into market performance and geographic trends
 */
export function SalesByCountriesCard({ 
  className = '',
  isLoading: externalLoading = false,
  error: externalError = null
}: AnalyticsCardProps) {
  const { countrySales, isLoading, error } = useAnalyticsData()
  
  const loading = isLoading || externalLoading
  const errorState = error || externalError

  // Calculate totals
  const totalSales = countrySalesData.reduce((sum, country) => sum + country.sales, 0)
  const totalOrders = countrySalesData.reduce((sum, country) => sum + country.orders, 0)
  const averageGrowth = countrySalesData.reduce((sum, country) => sum + country.growth, 0) / countrySalesData.length

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

  const getTrendIcon = (growth: number) => {
    return growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
  }

  const getTrendColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600'
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
            <Skeleton className="h-32 w-full" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
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
          <CardTitle className="text-red-600">Error Loading Country Data</CardTitle>
          <CardDescription>
            {errorState.message || 'Failed to load sales by countries data'}
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
            <Globe className="h-5 w-5 text-chart-1" />
            Sales by Countries
          </CardTitle>
          <Badge variant="outline" className={`gap-1 ${getTrendColor(averageGrowth)}`}>
            {getTrendIcon(averageGrowth)}
            {formatPercentage(averageGrowth)} Avg
          </Badge>
        </div>
        
        <CardDescription>
          Geographic distribution of sales and revenue
        </CardDescription>
        
        {/* Summary Stats */}
        <div className="flex items-center justify-between pt-2 text-sm">
          <div>
            <div className="font-medium">{formatCurrency(totalSales)}</div>
            <div className="text-muted-foreground">Total Sales</div>
          </div>
          <div className="text-right">
            <div className="font-medium">{totalOrders.toLocaleString()}</div>
            <div className="text-muted-foreground">Total Orders</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Geographic Distribution Chart */}
        <div className="h-48">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countrySalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                  label={({ percentage }) => `${percentage.toFixed(1)}%`}
                >
                  {countrySalesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name, props) => [
                      formatCurrency(value as number),
                      props.payload.country
                    ]}
                  />} 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Country Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Market Performance</h4>
          <div className="space-y-3">
            {countrySalesData.map((country, index) => (
              <div key={country.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-lg">{country.flag}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{country.country}</div>
                      <div className="text-xs text-muted-foreground">
                        {country.orders} orders
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(country.sales)}
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${getTrendColor(country.growth)}`}>
                      {getTrendIcon(country.growth)}
                      {formatPercentage(country.growth)}
                    </div>
                  </div>
                </div>
                <Progress 
                  value={country.percentage} 
                  className="h-1.5"
                  style={{
                    backgroundColor: 'hsl(var(--muted))'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-chart-1" />
            <span className="text-sm font-medium">Market Insights</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• North America dominates with 71% of total sales</p>
            <p>• Germany shows strongest growth at +15.2%</p>
            <p>• UK market experiencing temporary decline</p>
            <p>• Average order value varies by region</p>
          </div>
        </div>

        {/* Top Markets Summary */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
            <div className="text-sm font-bold text-green-600">
              Top Market
            </div>
            <div className="text-xs text-muted-foreground">
              🇺🇸 United States
            </div>
            <div className="text-sm font-medium">
              {formatCurrency(countrySalesData[0].sales)}
            </div>
          </div>
          
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
            <div className="text-sm font-bold text-blue-600">
              Fastest Growing
            </div>
            <div className="text-xs text-muted-foreground">
              🇩🇪 Germany
            </div>
            <div className="text-sm font-medium">
              +15.2% growth
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}