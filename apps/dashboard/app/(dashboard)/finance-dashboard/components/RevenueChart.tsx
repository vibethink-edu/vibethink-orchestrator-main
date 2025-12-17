import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import { useFinanceData } from '../hooks/useFinanceData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Badge } from '@/shared/components/ui/badge'
import { useState } from 'react'
import { RevenueChartProps } from '../types'
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react'

/**
 * RevenueChart Component
 * 
 * Displays revenue trends and analysis with multiple visualization options.
 * Shows revenue over time, targets vs actual, and forecasting.
 * 
 * Features:
 * - Multiple chart types (area, bar, line)
 * - Period selection (weekly, monthly, quarterly)
 * - Revenue vs target comparison
 * - Trend analysis and growth metrics
 * - Responsive design with loading states
 * - HSL color variables for theme compatibility
 */
export function RevenueChart({ data, title = "Revenue Analysis", className, height = 350 }: RevenueChartProps) {
  const { loading } = useFinanceData()
  const [period, setPeriod] = useState('monthly')

  // Mock revenue data with extended periods
  const mockRevenueData = {
    weekly: [
      { period: 'Week 1', revenue: 89000, target: 85000, count: 23, forecast: 91000 },
      { period: 'Week 2', revenue: 95000, target: 85000, count: 28, forecast: 93000 },
      { period: 'Week 3', revenue: 87000, target: 85000, count: 21, forecast: 89000 },
      { period: 'Week 4', revenue: 104000, target: 85000, count: 31, forecast: 102000 }
    ],
    monthly: [
      { period: 'Sep', revenue: 285000, target: 275000, count: 89, forecast: 285000 },
      { period: 'Oct', revenue: 310000, target: 285000, count: 98, forecast: 305000 },
      { period: 'Nov', revenue: 295000, target: 290000, count: 92, forecast: 298000 },
      { period: 'Dec', revenue: 340000, target: 295000, count: 112, forecast: 335000 },
      { period: 'Jan', revenue: 325000, target: 300000, count: 105, forecast: 330000 },
      { period: 'Feb', revenue: 380000, target: 310000, count: 118, forecast: 375000 }
    ],
    quarterly: [
      { period: 'Q3 2023', revenue: 890000, target: 850000, count: 279, forecast: 890000 },
      { period: 'Q4 2023', revenue: 1045000, target: 900000, count: 322, forecast: 1040000 },
      { period: 'Q1 2024', revenue: 1085000, target: 950000, count: 335, forecast: 1090000 }
    ]
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-[180px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className={`h-[${height}px] w-full`} />
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}K`
  const formatTooltip = (value: any, name: string) => {
    if (name === 'revenue' || name === 'target' || name === 'forecast') {
      return [formatCurrency(value), name === 'revenue' ? 'Revenue' : name === 'target' ? 'Target' : 'Forecast']
    }
    if (name === 'count') {
      return [`${value} transactions`, 'Transaction Count']
    }
    return [value, name]
  }

  const getCurrentData = () => {
    return mockRevenueData[period as keyof typeof mockRevenueData] || mockRevenueData.monthly
  }

  const currentData = getCurrentData()

  // Calculate summary metrics
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0)
  const totalTarget = currentData.reduce((sum, item) => sum + item.target, 0)
  const achievement = totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0
  const averageRevenue = totalRevenue / currentData.length
  const growth = currentData.length >= 2 
    ? ((currentData[currentData.length - 1].revenue - currentData[0].revenue) / currentData[0].revenue) * 100 
    : 0

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          {title}
        </CardTitle>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
            <TabsTrigger value="performance">vs Target</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          {/* Revenue Trends - Area Chart */}
          <TabsContent value="trends" className="space-y-4">
            <ResponsiveContainer width="100%" height={height}>
              <AreaChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="period" 
                  className="text-xs fill-muted-foreground" 
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Period: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Trend Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatCurrency(averageRevenue)}</p>
                <p className="text-xs text-muted-foreground">Average</p>
              </div>
              <div className="text-center flex items-center justify-center gap-2">
                {growth >= 0 ? 
                  <TrendingUp className="h-4 w-4 text-green-600" /> : 
                  <TrendingDown className="h-4 w-4 text-red-600" />
                }
                <div>
                  <p className={`text-lg font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Growth</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{currentData[currentData.length - 1]?.count || 0}</p>
                <p className="text-xs text-muted-foreground">Latest Count</p>
              </div>
            </div>
          </TabsContent>

          {/* Revenue vs Target - Bar Chart */}
          <TabsContent value="performance" className="space-y-4">
            <ResponsiveContainer width="100%" height={height}>
              <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="period" 
                  className="text-xs fill-muted-foreground" 
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Period: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  name="revenue"
                  fill="hsl(var(--chart-1))"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="target" 
                  name="target"
                  fill="hsl(var(--chart-2))"
                  radius={[2, 2, 0, 0]}
                  opacity={0.7}
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Performance Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <p className={`text-lg font-bold ${achievement >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                    {achievement.toFixed(0)}%
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Target Achievement</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(totalRevenue - totalTarget)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalRevenue >= totalTarget ? 'Above' : 'Below'} Target
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {currentData.filter(item => item.revenue >= item.target).length}/{currentData.length}
                </p>
                <p className="text-xs text-muted-foreground">Periods Over Target</p>
              </div>
              <div className="text-center">
                <Badge variant={achievement >= 100 ? "default" : "destructive"} className="text-xs">
                  {achievement >= 100 ? 'On Track' : 'Behind Target'}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">Status</p>
              </div>
            </div>
          </TabsContent>

          {/* Forecast - Line Chart with Prediction */}
          <TabsContent value="forecast" className="space-y-4">
            <ResponsiveContainer width="100%" height={height}>
              <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="period" 
                  className="text-xs fill-muted-foreground" 
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Period: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 5 }}
                  name="revenue"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  strokeDasharray="8 8"
                  dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
                  name="forecast"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={1}
                  dot={false}
                  name="target"
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Forecast Legend and Info */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]"></div>
                  <span className="text-sm text-muted-foreground">Actual Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 border-dashed border-2 border-[hsl(var(--chart-3))]"></div>
                  <span className="text-sm text-muted-foreground">Forecast</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[hsl(var(--chart-2))]"></div>
                  <span className="text-sm text-muted-foreground">Target</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Forecast based on historical trends and current performance patterns
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
