/**
 * Finance Dashboard Page
 * VibeThink Orchestrator
 * 
 * Complete finance dashboard with financial metrics, charts, budgets, expenses, and insights
 * Following VThink 1.0 methodology with multi-tenant security and DashboardLayout
 */

'use client'

import React, { useState } from 'react'
import BunduiCompleteLayout from '@/shared/components/bundui-premium/components/layout/BunduiCompleteLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Card, CardContent } from '@/shared/components/ui/card'
import { 
  DollarSign,
  TrendingUp,
  Calculator,
  PieChart,
  Target,
  Receipt,
  BarChart3,
  Settings,
  CreditCard,
  Wallet
} from 'lucide-react'

// Import finance components
import { FinancialSummaryCards } from './components/FinancialSummaryCards'
import { RevenueChart } from './components/RevenueChart'
import { ExpenseBreakdownChart } from './components/ExpenseBreakdownChart'
import { CashFlowChart } from './components/CashFlowChart'
import { BudgetVsActualChart } from './components/BudgetVsActualChart'
import { ProfitLossStatement } from './components/ProfitLossStatement'
import { ExpenseTable } from './components/ExpenseTable'
import { BudgetOverview } from './components/BudgetOverview'
import { FinancialInsights } from './components/FinancialInsights'
import { FinanceHeader } from './components/FinanceHeader'

// Import hooks for data management
import { useFinanceData } from './hooks/useFinanceData'
import { useFinanceFilters } from './hooks/useFinanceFilters'
import { useBudgetData } from './hooks/useBudgetData'

export default function FinanceDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Data hooks with multi-tenant security
  const { 
    revenues, 
    expenses, 
    budgets, 
    cashFlows, 
    accounts, 
    metrics, 
    loading, 
    error, 
    refreshAll 
  } = useFinanceData()
  
  const { 
    filters, 
    updateFilter, 
    resetFilters, 
    filterRevenues, 
    filterExpenses, 
    hasActiveFilters 
  } = useFinanceFilters()
  
  const { 
    budgetComparisons, 
    loading: budgetLoading 
  } = useBudgetData()

  // Filter data based on current filters
  const filteredRevenues = filterRevenues(revenues)
  const filteredExpenses = filterExpenses(expenses)

  const handleFiltersChange = (newFilters: any) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      updateFilter(key as any, value)
    })
  }

  const handleExport = () => {
    console.log('Export financial data')
    // TODO: Implement export functionality
  }

  const handleAddExpense = () => {
    console.log('Add new expense')
    // TODO: Implement add expense dialog
  }

  const handleAddRevenue = () => {
    console.log('Add new revenue')
    // TODO: Implement add revenue dialog
  }

  if (error) {
    return (
      <BunduiCompleteLayout>
        <div className="flex items-center justify-center h-96">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="text-red-500 text-2xl">⚠️</div>
                <h3 className="text-lg font-semibold">Error Loading Financial Data</h3>
                <p className="text-muted-foreground">{error}</p>
                <button 
                  onClick={refreshAll}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </BunduiCompleteLayout>
    )
  }

  return (
    <BunduiCompleteLayout>
      <div className="space-y-6">
        {/* Header with filters and actions */}
        <FinanceHeader
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
          onAddExpense={handleAddExpense}
          onAddRevenue={handleAddRevenue}
        />

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Budgets</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Financial Summary Cards */}
            <FinancialSummaryCards metrics={metrics} loading={loading} />

            {/* Main Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueChart data={metrics?.revenue_trend || []} />
              </div>
              <div>
                <FinancialInsights 
                  insights={[
                    {
                      id: '1',
                      type: 'revenue_opportunity',
                      title: 'Revenue Growth Opportunity',
                      description: 'Q1 revenue is trending 12% above target. Consider expanding marketing efforts.',
                      impact: 'high',
                      priority: 'important',
                      category: 'revenue',
                      percentage: 12,
                      trend: 'positive',
                      action_required: true,
                      action_suggestion: 'Increase marketing budget by 15%',
                      created_at: new Date().toISOString()
                    },
                    {
                      id: '2',
                      type: 'cost_optimization',
                      title: 'Software Costs Rising',
                      description: 'Software expenses increased 25% this quarter. Review subscriptions.',
                      impact: 'medium',
                      priority: 'normal',
                      category: 'expenses',
                      percentage: 25,
                      trend: 'negative',
                      action_required: true,
                      action_suggestion: 'Audit and consolidate software subscriptions',
                      created_at: new Date().toISOString()
                    }
                  ]} 
                  loading={loading}
                />
              </div>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
              <ExpenseBreakdownChart 
                data={metrics?.top_expense_categories || []} 
              />
              <CashFlowChart 
                data={metrics?.cash_flow_trend || []} 
              />
              <BudgetVsActualChart 
                data={budgetComparisons || []} 
                loading={budgetLoading}
              />
            </div>

            {/* Profit & Loss and Recent Transactions */}
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <ExpenseTable 
                  data={filteredExpenses.slice(0, 10)} 
                  loading={loading}
                />
              </div>
              <ProfitLossStatement 
                revenues={filteredRevenues}
                expenses={filteredExpenses}
                loading={loading}
              />
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            {/* Revenue Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">
                        ${metrics?.total_revenue.toLocaleString() || '0'}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                      <p className="text-2xl font-bold text-green-600">
                        +{metrics?.monthly_growth.revenue.toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                      <p className="text-2xl font-bold">
                        {revenues.filter(r => r.status === 'received').length}
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Deal Size</p>
                      <p className="text-2xl font-bold">
                        ${revenues.length > 0 
                          ? Math.round(revenues.reduce((sum, r) => sum + r.amount, 0) / revenues.length).toLocaleString()
                          : '0'
                        }
                      </p>
                    </div>
                    <Calculator className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueChart data={metrics?.revenue_trend || []} />
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Revenue by Category</h3>
                  <div className="space-y-3">
                    {metrics?.top_revenue_sources.slice(0, 5).map((source, index) => (
                      <div key={source.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: source.color }}
                          />
                          <span className="text-sm font-medium capitalize">
                            {source.category.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            ${source.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {source.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            {/* Expense Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                      <p className="text-2xl font-bold">
                        ${metrics?.total_expenses.toLocaleString() || '0'}
                      </p>
                    </div>
                    <CreditCard className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Change</p>
                      <p className="text-2xl font-bold text-red-600">
                        +{metrics?.monthly_growth.expenses.toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                      <p className="text-2xl font-bold">
                        {expenses.filter(e => e.status === 'pending').length}
                      </p>
                    </div>
                    <Receipt className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Expense</p>
                      <p className="text-2xl font-bold">
                        ${expenses.length > 0 
                          ? Math.round(expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length).toLocaleString()
                          : '0'
                        }
                      </p>
                    </div>
                    <Calculator className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expense Analysis */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ExpenseBreakdownChart data={metrics?.top_expense_categories || []} />
              <ExpenseTable data={filteredExpenses} loading={loading} />
            </div>
          </TabsContent>

          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6">
            {/* Budget Summary */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                      <p className="text-2xl font-bold">
                        ${budgets.reduce((sum, b) => sum + b.budgeted_amount, 0).toLocaleString()}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Actual Spent</p>
                      <p className="text-2xl font-bold">
                        ${budgets.reduce((sum, b) => sum + b.actual_amount, 0).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Budget Variance</p>
                      <p className="text-2xl font-bold text-green-600">
                        +{metrics?.budget_variance.overall.toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Budgets</p>
                      <p className="text-2xl font-bold">{budgets.length}</p>
                    </div>
                    <PieChart className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Analysis */}
            <div className="grid gap-6 lg:grid-cols-2">
              <BudgetVsActualChart data={budgetComparisons || []} loading={budgetLoading} />
              <BudgetOverview budgets={budgets} loading={loading} />
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProfitLossStatement 
                  revenues={filteredRevenues}
                  expenses={filteredExpenses}
                  loading={loading}
                />
              </div>
              <CashFlowChart data={metrics?.cash_flow_trend || []} />
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueChart data={metrics?.revenue_trend || []} title="Revenue Trends Report" />
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Financial Health Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Profit Margin</span>
                      <span className="font-medium">{metrics?.profit_margin.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Ratio</span>
                      <span className="font-medium">{metrics?.current_ratio.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Quick Ratio</span>
                      <span className="font-medium">{metrics?.quick_ratio.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cash Runway</span>
                      <span className="font-medium">{metrics?.runway_months} months</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Growth Rate</span>
                      <span className="font-medium text-green-600">+{metrics?.growth_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-lg font-medium">Loading financial data...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </BunduiCompleteLayout>
  )
}