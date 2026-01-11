import { Card, CardContent, CardHeader, CardTitle, Skeleton, Badge } from '@vibethink/ui'
import { 
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@vibethink/ui'
import { useState } from 'react'
import { CashFlowChartProps, CashFlowData } from '../types'
import { TrendingUp, TrendingDown, Activity, BarChart3, LineChart as LineChartIcon, Wallet } from "@vibethink/ui/icons"

/**
 * CashFlowChart Component
 * 
 * Displays cash flow analysis with multiple visualization options.
 * Shows cash in, cash out, net flow, and running balance over time.
 * 
 * Features:
 * - Multiple chart types (area, bar, line)
 * - Period selection (weekly, monthly, quarterly)
 * - Cash flow trends and analysis
 * - Net cash flow calculations
 * - Running balance tracking
 * - Positive/negative flow indicators
 * - Responsive design with loading states
 * - HSL color variables for theme compatibility
 */
export function CashFlowChart({ 
  data, 
  title = "Cash Flow Analysis", 
  className, 
  height = 350 
}: CashFlowChartProps) {
  const [viewType, setViewType] = useState<'overview' | 'detailed' | 'trends'>('overview')
  const [period, setPeriod] = useState('monthly')

  // Mock data with extended periods
  const mockCashFlowData = {
    weekly: [
      { period: 'Week 1', cash_in: 89000, cash_out: 65000, net_flow: 24000, running_balance: 450000 },
      { period: 'Week 2', cash_in: 95000, cash_out: 72000, net_flow: 23000, running_balance: 473000 },
      { period: 'Week 3', cash_in: 87000, cash_out: 68000, net_flow: 19000, running_balance: 492000 },
      { period: 'Week 4', cash_in: 104000, cash_out: 78000, net_flow: 26000, running_balance: 518000 }
    ],
    monthly: [
      { period: 'Aug', cash_in: 285000, cash_out: 220000, net_flow: 65000, running_balance: 390000 },
      { period: 'Sep', cash_in: 310000, cash_out: 245000, net_flow: 65000, running_balance: 455000 },
      { period: 'Oct', cash_in: 295000, cash_out: 225000, net_flow: 70000, running_balance: 525000 },
      { period: 'Nov', cash_in: 340000, cash_out: 275000, net_flow: 65000, running_balance: 590000 },
      { period: 'Dec', cash_in: 325000, cash_out: 285000, net_flow: 40000, running_balance: 630000 },
      { period: 'Jan', cash_in: 380000, cash_out: 295000, net_flow: 85000, running_balance: 715000 }
    ],
    quarterly: [
      { period: 'Q2 2023', cash_in: 890000, cash_out: 720000, net_flow: 170000, running_balance: 320000 },
      { period: 'Q3 2023', cash_in: 945000, cash_out: 745000, net_flow: 200000, running_balance: 520000 },
      { period: 'Q4 2023', cash_in: 1045000, cash_out: 825000, net_flow: 220000, running_balance: 740000 },
      { period: 'Q1 2024', cash_in: 1085000, cash_out: 865000, net_flow: 220000, running_balance: 960000 }
    ]
  }

  const getCurrentData = () => {
    if (data && data.length > 0) return data
    return mockCashFlowData[period as keyof typeof mockCashFlowData] || mockCashFlowData.monthly
  }

  const chartData = getCurrentData()
  const loading = !data

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
    const nameMap = {
      cash_in: 'Cash In',
      cash_out: 'Cash Out',
      net_flow: 'Net Flow',
      running_balance: 'Running Balance'
    }
    return [formatCurrency(value), nameMap[name as keyof typeof nameMap] || name]
  }

  // Calculate summary metrics
  const totalCashIn = chartData.reduce((sum, item) => sum + item.cash_in, 0)
  const totalCashOut = chartData.reduce((sum, item) => sum + item.cash_out, 0)
  const totalNetFlow = chartData.reduce((sum, item) => sum + item.net_flow, 0)
  const currentBalance = chartData[chartData.length - 1]?.running_balance || 0
  const previousBalance = chartData[0]?.running_balance || 0
  const balanceChange = currentBalance - previousBalance
  const balanceChangePercent = previousBalance > 0 ? (balanceChange / previousBalance) * 100 : 0

  // Analyze trends
  const positiveFlowPeriods = chartData.filter(item => item.net_flow > 0).length
  const averageNetFlow = totalNetFlow / chartData.length
  const isPositiveTrend = averageNetFlow > 0

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
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
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={viewType} onValueChange={(value: any) => setViewType(value)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center space-x-2">
              <LineChartIcon className="h-4 w-4" />
              <span>Detailed</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trends</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview - Area Chart with Net Flow */}
          <TabsContent value="overview" className="space-y-4">
            <ResponsiveContainer width="100%" height={height}>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="netFlowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/>
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
                <YAxis 
                  yAxisId="balance"
                  orientation="right"
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
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                <Area
                  type="monotone"
                  dataKey="net_flow"
                  stroke="hsl(var(--chart-3))"
                  fillOpacity={1}
                  fill="url(#netFlowGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="running_balance"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#balanceGradient)"
                  strokeWidth={1}
                  yAxisId="balance"
                />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Overview Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-3))]"></div>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(averageNetFlow)}</p>
                </div>
                <p className="text-xs text-muted-foreground">Avg Net Flow</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Wallet className="h-4 w-4 text-blue-600" />
                  <p className="text-lg font-bold text-foreground">{formatCurrency(currentBalance)}</p>
                </div>
                <p className="text-xs text-muted-foreground">Current Balance</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {isPositiveTrend ? 
                    <TrendingUp className="h-4 w-4 text-green-600" /> : 
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  }
                  <p className={`text-lg font-bold ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositiveTrend ? '+' : ''}{balanceChangePercent.toFixed(1)}%
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Balance Change</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {positiveFlowPeriods}/{chartData.length}
                </p>
                <p className="text-xs text-muted-foreground">Positive Periods</p>
              </div>
            </div>
          </TabsContent>

          {/* Detailed - Bar Chart with Cash In/Out */}
          <TabsContent value="detailed" className="space-y-4">
            <ResponsiveContainer width="100%" height={height}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  dataKey="cash_in" 
                  name="cash_in"
                  fill="hsl(var(--chart-1))"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="cash_out" 
                  name="cash_out"
                  fill="hsl(var(--chart-2))"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Detailed Legend and Summary */}
            <div className="space-y-4">
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]"></div>
                  <span className="text-sm text-muted-foreground">Cash In</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]"></div>
                  <span className="text-sm text-muted-foreground">Cash Out</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(totalCashIn)}</p>
                  <p className="text-xs text-muted-foreground">Total Cash In</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-600">{formatCurrency(totalCashOut)}</p>
                  <p className="text-xs text-muted-foreground">Total Cash Out</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${totalNetFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalNetFlow)}
                  </p>
                  <p className="text-xs text-muted-foreground">Net Total</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Trends - Line Chart with Running Balance */}
          <TabsContent value="trends" className="space-y-4">
            <ResponsiveContainer width="100%" height={height}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  dataKey="running_balance"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 5 }}
                  name="running_balance"
                />
                <Line
                  type="monotone"
                  dataKey="net_flow"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
                  name="net_flow"
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Trends Analysis */}
            <div className="space-y-4">
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]"></div>
                  <span className="text-sm text-muted-foreground">Running Balance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-3))]"></div>
                  <span className="text-sm text-muted-foreground">Net Flow</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className={`text-lg font-bold ${balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balanceChange >= 0 ? '+' : ''}{formatCurrency(balanceChange)}
                  </p>
                  <p className="text-xs text-muted-foreground">Balance Change</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">
                    {chartData.length > 1 
                      ? ((chartData[chartData.length - 1].net_flow - chartData[0].net_flow) / Math.abs(chartData[0].net_flow) * 100).toFixed(1)
                      : '0'
                    }%
                  </p>
                  <p className="text-xs text-muted-foreground">Flow Trend</p>
                </div>
                <div className="text-center">
                  <Badge variant={isPositiveTrend ? "default" : "destructive"} className="text-xs">
                    {isPositiveTrend ? 'Growing' : 'Declining'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Overall Trend</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">
                    {Math.round(currentBalance / Math.abs(averageNetFlow))}
                  </p>
                  <p className="text-xs text-muted-foreground">Months Runway</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
