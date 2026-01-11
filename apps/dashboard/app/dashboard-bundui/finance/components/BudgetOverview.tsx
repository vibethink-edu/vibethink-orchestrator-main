import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Skeleton } from '@vibethink/ui'
import { BudgetOverviewProps, Budget } from '../types'
import { Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Plus, Edit } from "@vibethink/ui/icons"

/**
 * BudgetOverview Component
 * 
 * Displays budget overview with progress tracking and status indicators.
 * Shows budget utilization, remaining amounts, and performance metrics.
 * 
 * Features:
 * - Budget progress bars
 * - Utilization percentages
 * - Status indicators (on track, over budget, under budget)
 * - Remaining budget calculations
 * - Category-wise breakdown
 * - Add/edit budget actions
 * - Visual progress indicators
 * - Alert thresholds
 * - Loading states with skeletons
 * - HSL color variables for theme compatibility
 */
export function BudgetOverview({ 
  budgets, 
  loading = false, 
  className 
}: BudgetOverviewProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-[180px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-[80px]" />
                <Skeleton className="h-3 w-[50px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getBudgetStatus = (budget: Budget) => {
    const utilization = budget.budgeted_amount > 0 
      ? (budget.actual_amount / budget.budgeted_amount) * 100 
      : 0

    if (utilization >= 100) return 'over'
    if (utilization >= 90) return 'warning'
    if (utilization >= 70) return 'on_track'
    return 'under'
  }

  const getBudgetUtilization = (budget: Budget) => {
    return budget.budgeted_amount > 0 
      ? (budget.actual_amount / budget.budgeted_amount) * 100 
      : 0
  }

  const getRemainingBudget = (budget: Budget) => {
    return Math.max(0, budget.budgeted_amount - budget.actual_amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'under':
        return <TrendingDown className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over':
        return 'text-red-600'
      case 'warning':
        return 'text-yellow-600'
      case 'on_track':
        return 'text-green-600'
      case 'under':
        return 'text-blue-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getProgressColor = (utilization: number) => {
    if (utilization >= 100) return 'bg-red-500'
    if (utilization >= 90) return 'bg-yellow-500'
    if (utilization >= 70) return 'bg-green-500'
    return 'bg-blue-500'
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'over':
        return 'destructive'
      case 'warning':
        return 'secondary'
      case 'on_track':
        return 'default'
      case 'under':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const categoryDisplayNames: Record<string, string> = {
    marketing: 'Marketing & Advertising',
    salaries: 'Salaries & Benefits',
    software: 'Software & Subscriptions',
    operations: 'Operations',
    travel: 'Travel & Transportation',
    equipment: 'Equipment & Hardware',
    supplies: 'Office Supplies',
    rent: 'Rent & Facilities',
    utilities: 'Utilities',
    legal: 'Legal & Professional',
    other: 'Other Expenses'
  }

  // Calculate summary statistics
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted_amount, 0)
  const totalActual = budgets.reduce((sum, budget) => sum + budget.actual_amount, 0)
  const totalRemaining = budgets.reduce((sum, budget) => sum + getRemainingBudget(budget), 0)
  const overallUtilization = totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0

  const budgetsByStatus = {
    over: budgets.filter(b => getBudgetStatus(b) === 'over').length,
    warning: budgets.filter(b => getBudgetStatus(b) === 'warning').length,
    on_track: budgets.filter(b => getBudgetStatus(b) === 'on_track').length,
    under: budgets.filter(b => getBudgetStatus(b) === 'under').length
  }

  const handleAddBudget = () => {
    console.log('Add new budget')
    // TODO: Implement add budget functionality
  }

  const handleEditBudget = (budget: Budget) => {
    console.log('Edit budget:', budget.id)
    // TODO: Implement edit budget functionality
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Budget Overview
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant={overallUtilization > 100 ? "destructive" : overallUtilization > 90 ? "secondary" : "default"} 
            className="text-xs"
          >
            {overallUtilization.toFixed(0)}% utilized
          </Badge>
          <Button variant="outline" size="sm" onClick={handleAddBudget} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Budget
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(totalBudgeted)}
            </p>
            <p className="text-xs text-muted-foreground">Total Budgeted</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-600">
              {formatCurrency(totalActual)}
            </p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(totalRemaining)}
            </p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <div>
              <p className="font-semibold text-red-600">{budgetsByStatus.over}</p>
              <p className="text-xs text-red-600/80">Over Budget</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-600">{budgetsByStatus.warning}</p>
              <p className="text-xs text-yellow-600/80">Warning</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <p className="font-semibold text-green-600">{budgetsByStatus.on_track}</p>
              <p className="text-xs text-green-600/80">On Track</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <TrendingDown className="h-4 w-4 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-600">{budgetsByStatus.under}</p>
              <p className="text-xs text-blue-600/80">Under Budget</p>
            </div>
          </div>
        </div>

        {/* Individual Budget Items */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Budget Details</h4>
          {budgets.map((budget) => {
            const status = getBudgetStatus(budget)
            const utilization = getBudgetUtilization(budget)
            const remaining = getRemainingBudget(budget)
            const isOver = utilization > 100

            return (
              <div 
                key={budget.id} 
                className="p-4 border rounded-lg space-y-3 hover:bg-muted/20 transition-colors"
              >
                {/* Budget Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <div>
                      <h5 className="font-medium text-foreground">
                        {budget.name}
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {categoryDisplayNames[budget.category] || budget.category}
                        {budget.department && ` • ${budget.department}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(status)} className="text-xs capitalize">
                      {status === 'on_track' ? 'On Track' : status}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditBudget(budget)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(budget.actual_amount)} of {formatCurrency(budget.budgeted_amount)}
                    </span>
                    <span className={getStatusColor(status)}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(utilization, 100)} 
                    className="h-2"
                  />
                  {isOver && (
                    <div className="flex justify-end">
                      <Badge variant="destructive" className="text-xs">
                        Over by {formatCurrency(budget.actual_amount - budget.budgeted_amount)}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Budget Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Period</p>
                    <p className="font-medium capitalize">{budget.period}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{budget.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className={`font-medium ${isOver ? 'text-red-600' : 'text-green-600'}`}>
                      {isOver ? 'Over Budget' : formatCurrency(remaining)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Currency</p>
                    <p className="font-medium">{budget.currency}</p>
                  </div>
                </div>

                {/* Budget Notes */}
                {budget.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {budget.notes}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Overall Progress */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-foreground">Overall Budget Progress</h4>
            <Badge 
              variant={overallUtilization > 100 ? "destructive" : overallUtilization > 90 ? "secondary" : "default"}
              className="text-xs"
            >
              {overallUtilization.toFixed(1)}% of total budget
            </Badge>
          </div>
          <Progress value={Math.min(overallUtilization, 100)} className="h-3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{budgets.length}</p>
              <p className="text-xs text-muted-foreground">Active Budgets</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">
                {Math.round(((budgetsByStatus.on_track + budgetsByStatus.under) / budgets.length) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">Healthy Rate</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(totalBudgeted / budgets.length)}
              </p>
              <p className="text-xs text-muted-foreground">Avg Budget</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${overallUtilization > 100 ? 'text-red-600' : 'text-green-600'}`}>
                {overallUtilization > 100 
                  ? formatCurrency(totalActual - totalBudgeted) + ' over'
                  : formatCurrency(totalRemaining) + ' left'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {overallUtilization > 100 ? 'Over Budget' : 'Remaining'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
