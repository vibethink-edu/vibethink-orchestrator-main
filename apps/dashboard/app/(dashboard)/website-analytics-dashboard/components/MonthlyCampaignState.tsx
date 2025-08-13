'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Megaphone, Target, TrendingUp, Eye, MousePointer } from 'lucide-react'
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

// Chart configuration
const chartConfig = {
  impressions: {
    label: 'Impressions',
    color: 'hsl(var(--chart-1))'
  },
  clicks: {
    label: 'Clicks',
    color: 'hsl(var(--chart-2))'
  },
  conversions: {
    label: 'Conversions',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig

// Mock campaign data
const campaignData = [
  {
    month: 'Jan',
    impressions: 125000,
    clicks: 3200,
    conversions: 156,
    spend: 4500,
    revenue: 12400
  },
  {
    month: 'Feb', 
    impressions: 142000,
    clicks: 3800,
    conversions: 189,
    spend: 5200,
    revenue: 15600
  },
  {
    month: 'Mar',
    impressions: 158000,
    clicks: 4200,
    conversions: 198,
    spend: 5800,
    revenue: 16800
  },
  {
    month: 'Apr',
    impressions: 134000,
    clicks: 3600,
    conversions: 172,
    spend: 5100,
    revenue: 14200
  },
  {
    month: 'May',
    impressions: 168000,
    clicks: 4600,
    conversions: 234,
    spend: 6200,
    revenue: 19800
  },
  {
    month: 'Jun',
    impressions: 178000,
    clicks: 4900,
    conversions: 256,
    spend: 6800,
    revenue: 22400
  }
]

/**
 * Monthly Campaign State Component
 * 
 * Displays campaign performance metrics:
 * - Monthly campaign trends (impressions, clicks, conversions)
 * - ROI and ROAS calculations
 * - CTR and conversion rate analysis
 * - Campaign budget vs performance
 * 
 * Provides insights into marketing campaign effectiveness
 */
export function MonthlyCampaignState({ 
  className = '',
  isLoading: externalLoading = false,
  error: externalError = null
}: AnalyticsCardProps) {
  const { campaignMetrics, isLoading, error } = useAnalyticsData()
  
  const loading = isLoading || externalLoading
  const errorState = error || externalError

  // Calculate campaign metrics
  const totalSpend = campaignData.reduce((sum, month) => sum + month.spend, 0)
  const totalRevenue = campaignData.reduce((sum, month) => sum + month.revenue, 0)
  const totalImpressions = campaignData.reduce((sum, month) => sum + month.impressions, 0)
  const totalClicks = campaignData.reduce((sum, month) => sum + month.clicks, 0)
  const totalConversions = campaignData.reduce((sum, month) => sum + month.conversions, 0)

  // Key performance indicators
  const roas = totalRevenue / totalSpend // Return on Ad Spend
  const ctr = (totalClicks / totalImpressions) * 100 // Click-through Rate
  const conversionRate = (totalConversions / totalClicks) * 100
  const cpc = totalSpend / totalClicks // Cost per Click
  const cpa = totalSpend / totalConversions // Cost per Acquisition

  // Month-over-month growth (last month vs previous)
  const lastMonth = campaignData[campaignData.length - 1]
  const previousMonth = campaignData[campaignData.length - 2]
  const revenueGrowth = ((lastMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
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
          <CardTitle className="text-red-600">Error Loading Campaign Data</CardTitle>
          <CardDescription>
            {errorState.message || 'Failed to load campaign metrics'}
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
            <Megaphone className="h-5 w-5 text-chart-1" />
            Campaign Performance
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`gap-1 ${revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            <TrendingUp className="h-3 w-3" />
            ROAS {roas.toFixed(1)}x
          </Badge>
        </div>
        
        <CardDescription>
          Monthly campaign metrics and ROI analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-chart-1" />
              <span className="text-xs font-medium">CTR</span>
            </div>
            <div className="text-lg font-bold">{formatPercentage(ctr)}</div>
            <div className="text-xs text-muted-foreground">
              {formatNumber(totalClicks)} clicks
            </div>
          </div>
          
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <MousePointer className="h-4 w-4 text-chart-2" />
              <span className="text-xs font-medium">Conversion Rate</span>
            </div>
            <div className="text-lg font-bold">{formatPercentage(conversionRate)}</div>
            <div className="text-xs text-muted-foreground">
              {totalConversions} conversions
            </div>
          </div>
        </div>

        {/* Campaign Performance Chart */}
        <div className="h-32">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={campaignData} 
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [
                      name === 'impressions' ? formatNumber(value as number) :
                      name === 'clicks' ? formatNumber(value as number) :
                      formatNumber(value as number),
                      name === 'impressions' ? 'Impressions' :
                      name === 'clicks' ? 'Clicks' : 'Conversions'
                    ]}
                  />} 
                />
                <Bar
                  dataKey="impressions"
                  fill="hsl(var(--chart-1))"
                  radius={[2, 2, 0, 0]}
                  barSize={20}
                  opacity={0.8}
                />
                <Bar
                  dataKey="clicks"
                  fill="hsl(var(--chart-2))"
                  radius={[2, 2, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* ROI Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">ROI Metrics</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Total Ad Spend</span>
              <span className="font-medium">{formatCurrency(totalSpend)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Revenue Generated</span>
              <span className="font-medium text-green-600">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Return on Ad Spend (ROAS)</span>
              <span className="font-bold">{roas.toFixed(1)}x</span>
            </div>
          </div>
          
          <Progress value={Math.min((roas / 5) * 100, 100)} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Target ROAS: 3.0x • Current: {roas.toFixed(1)}x
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-chart-3" />
              <span className="text-xs font-medium">Cost per Click</span>
            </div>
            <div className="text-sm font-bold">{formatCurrency(cpc)}</div>
            <div className="text-xs text-muted-foreground">
              Avg. CPC
            </div>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-chart-4" />
              <span className="text-xs font-medium">Cost per Acquisition</span>
            </div>
            <div className="text-sm font-bold">{formatCurrency(cpa)}</div>
            <div className="text-xs text-muted-foreground">
              Avg. CPA
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Campaign Insights</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• {formatPercentage(revenueGrowth)} revenue growth month-over-month</p>
            <p>• CTR above industry average of 2.1%</p>
            <p>• Strong ROAS indicates effective targeting</p>
            <p>• Consistent conversion rate across all campaigns</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}