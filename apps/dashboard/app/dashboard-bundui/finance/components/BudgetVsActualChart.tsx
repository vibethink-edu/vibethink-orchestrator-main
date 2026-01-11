import { Card, CardContent, CardHeader, CardTitle, Skeleton, Badge } from '@vibethink/ui'
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Line
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vibethink/ui'
import { useState } from 'react'
import { BudgetVsActualChartProps, BudgetComparison } from '../types'
import { Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3, Activity } from "@vibethink/ui/icons"

/**
 * BudgetVsActualChart Component
 * 
 * Displays budget vs actual spending comparison with variance analysis.
 * Shows over/under budget categories with detailed insights.
 * 
 * Features:
 * - Budget vs actual comparison charts
 * - Variance percentage indicators
 * - Over/under budget status
 * - Category-wise breakdown
 * - Performance indicators
 * - Trend analysis
 * - Status badges and alerts
 * - Responsive design with loading states
 * - HSL color variables for theme compatibility
 */
export function BudgetVsActualChart({ 
  data, 
  title = "Budget vs Actual", 
  className, 
  height = 350,
  loading = false
}: BudgetVsActualChartProps) {
  const [viewType, setViewType] = useState<'comparison' | 'variance' | 'status'>('comparison')

  // Mock data if none provided
  const mockData: BudgetComparison[] = [
    {
      category: 'Marketing',
      budgeted: 50000,
      actual: 42500,
      variance: -7500,
      variance_percentage: -15.0,
      status: 'under'
    },
    {
      category: 'Salaries',
      budgeted: 180000,
      actual: 185000,
      variance: 5000,
      variance_percentage: 2.8,
      status: 'over'
    },
    {
      category: 'Software',
      budgeted: 25000,
      actual: 28500,
      variance: 3500,
      variance_percentage: 14.0,
      status: 'over'
    },
    {
      category: 'Operations',
      budgeted: 40000,
      actual: 38900,
      variance: -1100,
      variance_percentage: -2.8,
      status: 'on_track'
    },
    {
      category: 'Travel',
      budgeted: 15000,
      actual: 18500,
      variance: 3500,
      variance_percentage: 23.3,
      status: 'over'
    },
    {
      category: 'Equipment',
      budgeted: 30000,
      actual: 22000,
      variance: -8000,
      variance_percentage: -26.7,
      status: 'under'
    }
  ]

  const chartData = data && data.length > 0 ? data : mockData

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

  const formatCurrency = (value: number) => `$${(Math.abs(value) / 1000).toFixed(0)}K`
  const formatTooltip = (value: any, name: string) => {
    const nameMap = {
      budgeted: 'Budgeted',
      actual: 'Actual',
      variance: 'Variance',
      variance_percentage: 'Variance %'
    }
    if (name === 'variance_percentage') {
      return [`${value}%`, nameMap[name] || name]
    }
    return [formatCurrency(value), nameMap[name as keyof typeof nameMap] || name]
  }

  // Calculate summary metrics
  const totalBudgeted = chartData.reduce((sum, item) => sum + item.budgeted, 0)
  const totalActual = chartData.reduce((sum, item) => sum + item.actual, 0)
  const totalVariance = totalActual - totalBudgeted
  const totalVariancePercent = totalBudgeted > 0 ? (totalVariance / totalBudgeted) * 100 : 0
  
  const overBudgetCategories = chartData.filter(item => item.status === 'over').length
  const underBudgetCategories = chartData.filter(item => item.status === 'under').length
  const onTrackCategories = chartData.filter(item => item.status === 'on_track').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'under':
        return <TrendingDown className="h-4 w-4 text-blue-600" />
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over':
        return 'text-red-600'
      case 'under':
        return 'text-blue-600'
      case 'on_track':
        return 'text-green-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600'
    if (variance < 0) return 'text-blue-600'
    return 'text-green-600'
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant={totalVariancePercent > 5 ? "destructive" : totalVariancePercent < -5 ? "secondary" : "default"} 
            className="text-xs"
          >
            {totalVariancePercent >= 0 ? '+' : ''}{totalVariancePercent.toFixed(1)}% overall
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={viewType} onValueChange={(value: any) => setViewType(value)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Comparison</span>
            </TabsTrigger>
            <TabsTrigger value="variance" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Variance</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Status</span>
            </TabsTrigger>
          </TabsList>

          {/* Comparison View - Budget vs Actual Bars */}
          <TabsContent value="comparison" className="space-y-4">
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
                  dataKey="budgeted" 
                  name="budgeted"
                  fill="hsl(var(--chart-4))"
                  radius={[2, 2, 0, 0]}
                  opacity={0.7}
                />
                <Bar 
                  dataKey="actual" 
                  name="actual"
                  fill="hsl(var(--chart-1))"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Comparison Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatCurrency(totalBudgeted)}</p>
                <p className="text-xs text-muted-foreground">Total Budgeted</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatCurrency(totalActual)}</p>
                <p className="text-xs text-muted-foreground">Total Actual</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${getVarianceColor(totalVariance)}`}>
                  {totalVariance >= 0 ? '+' : ''}{formatCurrency(totalVariance)}
                </p>
                <p className="text-xs text-muted-foreground">Net Variance</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${getVarianceColor(totalVariance)}`}>
                  {totalVariancePercent >= 0 ? '+' : ''}{totalVariancePercent.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Variance %</p>
              </div>
            </div>
          </TabsContent>

          {/* Variance View - Variance Percentages */}
          <TabsContent value="variance" className="space-y-4">
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
                  tickFormatter={(value) => `${value}%`}
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
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                <Bar 
                  dataKey="variance_percentage" 
                  name="variance_percentage"
                  fill="hsl(var(--chart-1))"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Variance Analysis */}
            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div 
                  key={item.category} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.budgeted)} budgeted
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${getStatusColor(item.status)}`}>
                      {formatCurrency(item.actual)}
                    </p>
                    <div className="flex items-center gap-1">
                      {item.variance > 0 ? (
                        <TrendingUp className="h-3 w-3 text-red-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-blue-600" />
                      )}
                      <span 
                        className={`text-xs font-medium ${getVarianceColor(item.variance)}`}
                      >
                        {item.variance >= 0 ? '+' : ''}{item.variance_percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      variant={item.status === 'over' ? 'destructive' : item.status === 'under' ? 'secondary' : 'default'}
                      className="text-xs capitalize"
                    >
                      {item.status === 'on_track' ? 'On Track' : item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Status View - Category Status Overview */}
          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Over Budget */}
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Over Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {overBudgetCategories}
                  </div>
                  <div className="space-y-2">
                    {chartData
                      .filter(item => item.status === 'over')
                      .slice(0, 3)
                      .map(item => (
                        <div key={item.category} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-xs text-red-600 font-medium">
                            +{item.variance_percentage.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* On Track */}
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    On Track
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {onTrackCategories}
                  </div>
                  <div className="space-y-2">
                    {chartData
                      .filter(item => item.status === 'on_track')
                      .slice(0, 3)
                      .map(item => (
                        <div key={item.category} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-xs text-green-600 font-medium">
                            {item.variance_percentage.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Under Budget */}
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-blue-600" />
                    Under Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {underBudgetCategories}
                  </div>
                  <div className="space-y-2">
                    {chartData
                      .filter(item => item.status === 'under')
                      .slice(0, 3)
                      .map(item => (
                        <div key={item.category} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-xs text-blue-600 font-medium">
                            {item.variance_percentage.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overall Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{chartData.length}</p>
                <p className="text-xs text-muted-foreground">Total Categories</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {Math.round((onTrackCategories / chartData.length) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">On Track Rate</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(
                    chartData
                      .filter(item => item.status === 'over')
                      .reduce((sum, item) => sum + item.variance, 0)
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Over Budget Total</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(
                    Math.abs(chartData
                      .filter(item => item.status === 'under')
                      .reduce((sum, item) => sum + item.variance, 0))
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Under Budget Total</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
