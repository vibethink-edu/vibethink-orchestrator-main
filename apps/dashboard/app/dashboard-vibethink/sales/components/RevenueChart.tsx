import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Skeleton, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@vibethink/ui'
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
import { useSalesData } from '../hooks/useSalesData'
import { useState } from 'react'

interface RevenueChartProps {
  className?: string
}

// Sample revenue data - in real app this would come from useSalesData hook
const monthlyRevenueData = [
  { month: 'Jan', revenue: 285000, target: 300000, deals: 23, forecast: 285000 },
  { month: 'Feb', revenue: 310000, target: 320000, deals: 28, forecast: 305000 },
  { month: 'Mar', revenue: 295000, target: 315000, deals: 25, forecast: 298000 },
  { month: 'Apr', revenue: 340000, target: 325000, deals: 31, forecast: 335000 },
  { month: 'May', revenue: 325000, target: 330000, deals: 29, forecast: 330000 },
  { month: 'Jun', revenue: 380000, target: 340000, deals: 34, forecast: 375000 },
  { month: 'Jul', revenue: 395000, target: 350000, deals: 36, forecast: 390000 },
  { month: 'Aug', revenue: 360000, target: 355000, deals: 32, forecast: 365000 },
  { month: 'Sep', revenue: 425000, target: 365000, deals: 38, forecast: 420000 },
  { month: 'Oct', revenue: 440000, target: 370000, deals: 41, forecast: 435000 },
  { month: 'Nov', revenue: 465000, target: 380000, deals: 43, forecast: 460000 },
  { month: 'Dec', revenue: 490000, target: 390000, deals: 45, forecast: 485000 }
]

const quarterlyData = [
  { quarter: 'Q1 2024', revenue: 890000, target: 935000, deals: 76 },
  { quarter: 'Q2 2024', revenue: 1045000, target: 995000, deals: 94 },
  { quarter: 'Q3 2024', revenue: 1180000, target: 1070000, deals: 106 },
  { quarter: 'Q4 2024', revenue: 1395000, target: 1160000, deals: 129 }
]

const weeklyData = [
  { week: 'Week 1', revenue: 89000, target: 92000, deals: 8 },
  { week: 'Week 2', revenue: 95000, target: 92000, deals: 9 },
  { week: 'Week 3', revenue: 87000, target: 92000, deals: 7 },
  { week: 'Week 4', revenue: 104000, target: 92000, deals: 11 }
]

export function RevenueChart({ className }: RevenueChartProps) {
  const { loading } = useSalesData()
  const [period, setPeriod] = useState('monthly')

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}K`
  const formatTooltip = (value: any, name: string) => {
    if (name === 'revenue' || name === 'target' || name === 'forecast') {
      return [formatCurrency(value), name === 'revenue' ? 'Revenue' : name === 'target' ? 'Target' : 'Forecast']
    }
    if (name === 'deals') {
      return [`${value} deals`, 'Deals Closed']
    }
    return [value, name]
  }

  const getCurrentData = () => {
    switch (period) {
      case 'weekly': return weeklyData
      case 'quarterly': return quarterlyData
      case 'monthly':
      default: return monthlyRevenueData
    }
  }

  const currentData = getCurrentData()

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue Analysis</CardTitle>
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

          {/* Revenue Trends - Line Chart */}
          <TabsContent value="trends" className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey={period === 'weekly' ? 'week' : period === 'quarterly' ? 'quarter' : 'month'} 
                  className="text-xs" 
                />
                <YAxis 
                  className="text-xs"
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Period: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
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
          </TabsContent>

          {/* Revenue vs Target - Bar Chart */}
          <TabsContent value="performance" className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey={period === 'weekly' ? 'week' : period === 'quarterly' ? 'quarter' : 'month'} 
                  className="text-xs" 
                />
                <YAxis 
                  className="text-xs"
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Period: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
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
            
            {/* Performance summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">112%</p>
                <p className="text-xs text-muted-foreground">Avg Target Achievement</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">$185K</p>
                <p className="text-xs text-muted-foreground">Above Target</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">9/12</p>
                <p className="text-xs text-muted-foreground">Months Over Target</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">23%</p>
                <p className="text-xs text-muted-foreground">YoY Growth</p>
              </div>
            </div>
          </TabsContent>

          {/* Forecast - Line Chart with Prediction */}
          <TabsContent value="forecast" className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey={period === 'weekly' ? 'week' : period === 'quarterly' ? 'quarter' : 'month'} 
                  className="text-xs" 
                />
                <YAxis 
                  className="text-xs"
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Period: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                  name="revenue"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
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
            
            <div className="flex justify-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }}></div>
                <span className="text-sm text-muted-foreground">Actual Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 border-dashed border-2" style={{ borderColor: 'hsl(var(--chart-3))' }}></div>
                <span className="text-sm text-muted-foreground">Forecast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5" style={{ backgroundColor: 'hsl(var(--chart-2))' }}></div>
                <span className="text-sm text-muted-foreground">Target</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
