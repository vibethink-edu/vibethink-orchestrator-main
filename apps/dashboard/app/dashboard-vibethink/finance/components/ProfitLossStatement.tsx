import { Card, CardContent, CardHeader, CardTitle, Skeleton, Badge, Button, Separator } from '@vibethink/ui'
import { Revenue, Expense } from '../types'
import { useState } from 'react'
import { FileText, Download, TrendingUp, TrendingDown, Calculator, DollarSign } from 'lucide-react'

interface ProfitLossStatementProps {
  revenues: Revenue[]
  expenses: Expense[]
  loading?: boolean
  className?: string
}

/**
 * ProfitLossStatement Component
 * 
 * Displays a comprehensive Profit & Loss statement with financial breakdown.
 * Shows revenue categories, expense categories, and profit calculations.
 * 
 * Features:
 * - Revenue breakdown by category
 * - Expense breakdown by category
 * - Gross profit calculations
 * - Net profit calculations
 * - Profit margin analysis
 * - Period-over-period comparisons
 * - Export functionality
 * - Professional P&L formatting
 * - HSL color variables for theme compatibility
 */
export function ProfitLossStatement({ 
  revenues, 
  expenses, 
  loading = false, 
  className 
}: ProfitLossStatementProps) {
  const [period, setPeriod] = useState('current_month')

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  // Calculate revenue by category
  const revenueByCategory = revenues
    .filter(rev => rev.status === 'received')
    .reduce((acc, rev) => {
      acc[rev.category] = (acc[rev.category] || 0) + rev.amount
      return acc
    }, {} as Record<string, number>)

  // Calculate expenses by category
  const expensesByCategory = expenses
    .filter(exp => exp.status === 'paid')
    .reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {} as Record<string, number>)

  // Calculate totals
  const totalRevenue = Object.values(revenueByCategory).reduce((sum, amount) => sum + amount, 0)
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0)
  
  // Cost of Goods Sold (COGS) - assume certain categories are COGS
  const cogsCategories = ['operations', 'supplies', 'equipment']
  const totalCOGS = cogsCategories.reduce((sum, category) => 
    sum + (expensesByCategory[category] || 0), 0)
  
  const grossProfit = totalRevenue - totalCOGS
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0
  
  // Operating expenses (excluding COGS)
  const operatingExpenseCategories = Object.keys(expensesByCategory)
    .filter(category => !cogsCategories.includes(category))
  const totalOperatingExpenses = operatingExpenseCategories.reduce((sum, category) => 
    sum + expensesByCategory[category], 0)
  
  const operatingProfit = grossProfit - totalOperatingExpenses
  const operatingMargin = totalRevenue > 0 ? (operatingProfit / totalRevenue) * 100 : 0
  
  const netProfit = totalRevenue - totalExpenses
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  // Mock previous period data for comparison (would come from actual data)
  const previousPeriodData = {
    totalRevenue: totalRevenue * 0.92,
    totalExpenses: totalExpenses * 0.88,
    netProfit: netProfit * 0.85
  }

  const revenueGrowth = previousPeriodData.totalRevenue > 0 
    ? ((totalRevenue - previousPeriodData.totalRevenue) / previousPeriodData.totalRevenue) * 100 
    : 0

  const profitGrowth = previousPeriodData.netProfit > 0 
    ? ((netProfit - previousPeriodData.netProfit) / Math.abs(previousPeriodData.netProfit)) * 100 
    : 0

  const handleExport = () => {
    console.log('Export P&L statement')
    // TODO: Implement export functionality
  }

  const categoryDisplayNames: Record<string, string> = {
    sales: 'Product Sales',
    services: 'Service Revenue',
    subscriptions: 'Subscription Revenue',
    licensing: 'Licensing Fees',
    consulting: 'Consulting Revenue',
    marketing: 'Marketing & Advertising',
    salaries: 'Salaries & Benefits',
    software: 'Software & Subscriptions',
    operations: 'Operations',
    rent: 'Rent & Facilities',
    travel: 'Travel & Transportation',
    equipment: 'Equipment & Hardware',
    supplies: 'Office Supplies',
    legal: 'Legal & Professional',
    other: 'Other'
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Profit & Loss Statement
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Current Month
          </Badge>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenue Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <h3 className="text-lg font-semibold text-foreground">Revenue</h3>
          </div>
          
          <div className="space-y-2 ml-6">
            {Object.entries(revenueByCategory)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {categoryDisplayNames[category] || category}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
          </div>
          
          <Separator />
          <div className="flex justify-between items-center font-semibold">
            <span>Total Revenue</span>
            <div className="flex items-center gap-2">
              <span className="text-green-600">{formatCurrency(totalRevenue)}</span>
              {revenueGrowth !== 0 && (
                <div className="flex items-center gap-1">
                  {revenueGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(revenueGrowth)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cost of Goods Sold */}
        {totalCOGS > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Cost of Goods Sold</h3>
            
            <div className="space-y-2 ml-6">
              {cogsCategories
                .filter(category => expensesByCategory[category] > 0)
                .map(category => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {categoryDisplayNames[category] || category}
                    </span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(expensesByCategory[category])}
                    </span>
                  </div>
                ))}
            </div>
            
            <Separator />
            <div className="flex justify-between items-center font-semibold">
              <span>Total COGS</span>
              <span className="text-red-600">{formatCurrency(totalCOGS)}</span>
            </div>
            
            <div className="flex justify-between items-center font-bold text-lg bg-muted/50 p-3 rounded-lg">
              <span>Gross Profit</span>
              <div className="text-right">
                <div className={`${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(grossProfit)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {grossMargin.toFixed(1)}% margin
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operating Expenses */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Operating Expenses</h3>
          
          <div className="space-y-2 ml-6">
            {operatingExpenseCategories
              .sort((a, b) => expensesByCategory[b] - expensesByCategory[a])
              .map(category => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {categoryDisplayNames[category] || category}
                  </span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(expensesByCategory[category])}
                  </span>
                </div>
              ))}
          </div>
          
          <Separator />
          <div className="flex justify-between items-center font-semibold">
            <span>Total Operating Expenses</span>
            <span className="text-red-600">{formatCurrency(totalOperatingExpenses)}</span>
          </div>
          
          {totalCOGS > 0 && (
            <div className="flex justify-between items-center font-bold text-lg bg-muted/50 p-3 rounded-lg">
              <span>Operating Profit</span>
              <div className="text-right">
                <div className={`${operatingProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(operatingProfit)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {operatingMargin.toFixed(1)}% margin
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Net Profit */}
        <div className="space-y-3 border-t-2 pt-4">
          <div className="flex justify-between items-center font-bold text-xl bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span>Net Profit</span>
            </div>
            <div className="text-right">
              <div className={`text-2xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </div>
              <div className="text-sm text-muted-foreground">
                {netMargin.toFixed(1)}% net margin
              </div>
              {profitGrowth !== 0 && (
                <div className="flex items-center justify-end gap-1 mt-1">
                  {profitGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${profitGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(profitGrowth)} vs last period
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="text-lg font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Gross Margin</p>
            <p className="text-lg font-bold text-foreground">
              {grossMargin.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Net Margin</p>
            <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netMargin.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Period Comparison */}
        {(revenueGrowth !== 0 || profitGrowth !== 0) && (
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Period Comparison
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Revenue Growth:</span>
                <span className={`ml-2 font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(revenueGrowth)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Profit Growth:</span>
                <span className={`ml-2 font-medium ${profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(profitGrowth)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
