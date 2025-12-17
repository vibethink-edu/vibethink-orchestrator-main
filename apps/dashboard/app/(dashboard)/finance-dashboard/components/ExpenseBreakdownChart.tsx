import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Badge } from '@/shared/components/ui/badge'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useState } from 'react'
import { ExpenseBreakdownChartProps, CategoryData } from '../types'
import { PieChart as PieChartIcon, BarChart3, TrendingUp, TrendingDown, CreditCard } from 'lucide-react'

/**
 * ExpenseBreakdownChart Component
 * 
 * Displays expense breakdown by category with multiple visualization options.
 * Shows pie chart, bar chart, and detailed category analysis.
 * 
 * Features:
 * - Multiple chart types (pie, bar)
 * - Interactive tooltips
 * - Category details with trends
 * - Percentage and amount breakdowns
 * - Top expense categories
 * - Color-coded categories
 * - Loading states with skeletons
 * - HSL color variables for theme compatibility
 */
export function ExpenseBreakdownChart({ 
  data, 
  title = "Expense Breakdown", 
  className, 
  height = 350 
}: ExpenseBreakdownChartProps) {
  const [viewType, setViewType] = useState<'pie' | 'bar' | 'details'>('pie')

  // Mock data if none provided
  const mockData: CategoryData[] = [
    { category: 'Salaries', amount: 125000, percentage: 45.5, count: 12, color: 'hsl(var(--chart-1))' },
    { category: 'Marketing', amount: 42500, percentage: 15.5, count: 28, color: 'hsl(var(--chart-2))' },
    { category: 'Software', amount: 38000, percentage: 13.8, count: 15, color: 'hsl(var(--chart-3))' },
    { category: 'Operations', amount: 35000, percentage: 12.7, count: 22, color: 'hsl(var(--chart-4))' },
    { category: 'Travel', amount: 18500, percentage: 6.7, count: 18, color: 'hsl(var(--chart-5))' },
    { category: 'Equipment', amount: 15000, percentage: 5.5, count: 8, color: 'hsl(142 76% 36%)' },
    { category: 'Other', amount: 1000, percentage: 0.4, count: 3, color: 'hsl(213 9% 47%)' }
  ]

  const chartData = data && data.length > 0 ? data : mockData
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
    if (name === 'amount') {
      return [`$${value.toLocaleString()}`, 'Amount']
    }
    if (name === 'count') {
      return [`${value} transactions`, 'Count']
    }
    return [value, name]
  }

  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0)
  const totalCount = chartData.reduce((sum, item) => sum + item.count, 0)
  const averageExpense = totalCount > 0 ? totalAmount / totalCount : 0

  // Calculate month-over-month trends (mock data)
  const trendsData = chartData.map((item, index) => ({
    ...item,
    trend: index % 2 === 0 ? Math.random() * 10 + 2 : -(Math.random() * 5 + 1),
    previousAmount: item.amount * (0.9 + Math.random() * 0.2)
  }))

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-red-600" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {chartData.length} categories
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={viewType} onValueChange={(value: any) => setViewType(value)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pie" className="flex items-center space-x-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Pie Chart</span>
            </TabsTrigger>
            <TabsTrigger value="bar" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Bar Chart</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
          </TabsList>

          {/* Pie Chart View */}
          <TabsContent value="pie" className="space-y-4">
            <ResponsiveContainer width="100%" height={height}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={formatTooltip}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Pie Chart Legend */}
            <div className="grid grid-cols-2 gap-2">
              {chartData.slice(0, 6).map((item, index) => (
                <div key={item.category} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Bar Chart View */}
          <TabsContent value="bar" className="space-y-4">
            <ResponsiveContainer width="100%" height={height}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="category" 
                  className="text-xs fill-muted-foreground"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Category: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  name="amount"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Bar Chart Summary */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatCurrency(totalAmount)}</p>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{totalCount}</p>
                <p className="text-xs text-muted-foreground">Total Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatCurrency(averageExpense)}</p>
                <p className="text-xs text-muted-foreground">Average per Transaction</p>
              </div>
            </div>
          </TabsContent>

          {/* Details View */}
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-3">
              {trendsData.map((item, index) => (
                <div 
                  key={item.category} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.count} transactions
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">
                      ${item.amount.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1">
                      {item.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-red-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-green-600" />
                      )}
                      <span 
                        className={`text-xs font-medium ${
                          item.trend > 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {item.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Details Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">
                  {trendsData.filter(item => item.trend > 0).length}
                </p>
                <p className="text-xs text-muted-foreground">Categories Increasing</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {trendsData.filter(item => item.trend < 0).length}
                </p>
                <p className="text-xs text-muted-foreground">Categories Decreasing</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {chartData[0]?.category || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">Largest Category</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  ${Math.round(totalAmount / chartData.length).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Average per Category</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
