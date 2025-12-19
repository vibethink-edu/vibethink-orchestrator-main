// Finance Dashboard TypeScript Definitions
// Following VThink 1.0 methodology with strict typing and multi-tenant security

export interface Revenue {
  id: string
  company_id: string // CRITICAL: Multi-tenant security
  amount: number
  currency: string
  category: RevenueCategory
  source: string
  date: string
  description: string
  recurring: boolean
  invoice_id?: string
  customer_id?: string
  customer_name?: string
  payment_method?: PaymentMethod
  status: 'pending' | 'received' | 'overdue' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  company_id: string // CRITICAL: Multi-tenant security
  amount: number
  currency: string
  category: ExpenseCategory
  vendor: string
  vendor_id?: string
  date: string
  description: string
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  receipt_url?: string
  payment_method?: PaymentMethod
  approval_required: boolean
  approved_by?: string
  approved_at?: string
  tags?: string[]
  department?: string
  project_id?: string
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  company_id: string // CRITICAL: Multi-tenant security
  name: string
  category: ExpenseCategory | RevenueCategory
  type: 'revenue' | 'expense'
  budgeted_amount: number
  actual_amount: number
  currency: string
  period: BudgetPeriod
  fiscal_year: number
  start_date: string
  end_date: string
  department?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CashFlow {
  id: string
  company_id: string // CRITICAL: Multi-tenant security
  date: string
  cash_in: number
  cash_out: number
  net_cash_flow: number
  opening_balance: number
  closing_balance: number
  currency: string
  period: 'daily' | 'weekly' | 'monthly'
  created_at: string
}

export interface FinancialAccount {
  id: string
  company_id: string // CRITICAL: Multi-tenant security
  name: string
  type: AccountType
  balance: number
  currency: string
  bank_name?: string
  account_number?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FinancialMetrics {
  total_revenue: number
  total_expenses: number
  net_profit: number
  profit_margin: number
  gross_margin: number
  cash_balance: number
  current_ratio: number
  quick_ratio: number
  burn_rate: number
  runway_months: number
  growth_rate: number
  
  // Monthly comparisons
  monthly_growth: {
    revenue: number
    expenses: number
    profit: number
  }
  
  // Budget tracking
  budget_variance: {
    revenue: number
    expenses: number
    overall: number
  }
  
  // Top categories
  top_revenue_sources: CategoryData[]
  top_expense_categories: CategoryData[]
  
  // Cash flow data
  cash_flow_trend: CashFlowData[]
  revenue_trend: RevenueData[]
  expense_trend: ExpenseData[]
}

export interface CategoryData {
  category: string
  amount: number
  percentage: number
  count: number
  color: string
}

export interface CashFlowData {
  period: string
  cash_in: number
  cash_out: number
  net_flow: number
  running_balance: number
}

export interface RevenueData {
  period: string
  revenue: number
  count: number
  target?: number
  forecast?: number
}

export interface ExpenseData {
  period: string
  expenses: number
  count: number
  budget?: number
}

export interface BudgetComparison {
  category: string
  budgeted: number
  actual: number
  variance: number
  variance_percentage: number
  status: 'over' | 'under' | 'on_track'
}

export interface FinancialInsight {
  id: string
  type: InsightType
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  priority: 'urgent' | 'important' | 'normal'
  category: string
  value?: number
  percentage?: number
  trend: 'positive' | 'negative' | 'neutral'
  action_required: boolean
  action_suggestion?: string
  created_at: string
}

export interface FinanceFilters {
  searchQuery: string
  category: string | 'all'
  dateRange: DateRange
  amountRange: {
    min: number | null
    max: number | null
  }
  status: string | 'all'
  department: string | 'all'
  currency: string | 'all'
  tags?: string[]
}

// Enums and Union Types

export type RevenueCategory = 
  | 'sales'
  | 'services'
  | 'subscriptions'
  | 'licensing'
  | 'consulting'
  | 'commission'
  | 'interest'
  | 'dividends'
  | 'grants'
  | 'other'

export type ExpenseCategory = 
  | 'operations'
  | 'marketing'
  | 'salaries'
  | 'benefits'
  | 'rent'
  | 'utilities'
  | 'travel'
  | 'software'
  | 'equipment'
  | 'supplies'
  | 'legal'
  | 'accounting'
  | 'insurance'
  | 'taxes'
  | 'research'
  | 'development'
  | 'training'
  | 'entertainment'
  | 'other'

export type PaymentMethod = 
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'check'
  | 'paypal'
  | 'stripe'
  | 'other'

export type BudgetPeriod = 
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'custom'

export type AccountType = 
  | 'checking'
  | 'savings'
  | 'credit'
  | 'loan'
  | 'investment'
  | 'paypal'
  | 'other'

export type DateRange = 
  | 'all'
  | 'today'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom'

export type InsightType = 
  | 'cost_optimization'
  | 'revenue_opportunity'
  | 'cash_flow_warning'
  | 'budget_variance'
  | 'trend_analysis'
  | 'compliance'
  | 'forecast'

export type FinancialChartType = 
  | 'revenue_trends'
  | 'expense_breakdown'
  | 'cash_flow'
  | 'budget_vs_actual'
  | 'profit_loss'
  | 'balance_sheet'

// Component Props Types

export interface FinancialSummaryCardsProps {
  metrics: FinancialMetrics
  loading?: boolean
  className?: string
}

export interface RevenueChartProps {
  data: RevenueData[]
  title?: string
  className?: string
  height?: number
}

export interface ExpenseBreakdownChartProps {
  data: CategoryData[]
  title?: string
  className?: string
  height?: number
}

export interface CashFlowChartProps {
  data: CashFlowData[]
  title?: string
  className?: string
  height?: number
}

export interface BudgetVsActualChartProps {
  data: BudgetComparison[]
  title?: string
  className?: string
  height?: number
  loading?: boolean
}

export interface ExpenseTableProps {
  data: Expense[]
  loading?: boolean
  onRowClick?: (expense: Expense) => void
  onEdit?: (expense: Expense) => void
  onDelete?: (id: string) => void
  onApprove?: (id: string) => void
  className?: string
}

export interface BudgetOverviewProps {
  budgets: Budget[]
  loading?: boolean
  className?: string
}

export interface FinancialInsightsProps {
  insights: FinancialInsight[]
  loading?: boolean
  className?: string
}

export interface FinanceHeaderProps {
  onFiltersChange?: (filters: Partial<FinanceFilters>) => void
  onExport?: () => void
  onAddExpense?: () => void
  onAddRevenue?: () => void
  className?: string
}

// Hook Return Types

export interface UseFinanceDataReturn {
  revenues: Revenue[]
  expenses: Expense[]
  budgets: Budget[]
  cashFlows: CashFlow[]
  accounts: FinancialAccount[]
  metrics: FinancialMetrics | null
  loading: boolean
  error: string | null
  refreshRevenues: () => Promise<void>
  refreshExpenses: () => Promise<void>
  refreshBudgets: () => Promise<void>
  refreshCashFlows: () => Promise<void>
  refreshAll: () => Promise<void>
}

export interface UseFinanceFiltersReturn {
  filters: FinanceFilters
  updateFilter: <K extends keyof FinanceFilters>(key: K, value: FinanceFilters[K]) => void
  resetFilters: () => void
  filterRevenues: (revenues: Revenue[]) => Revenue[]
  filterExpenses: (expenses: Expense[]) => Expense[]
  hasActiveFilters: boolean
  getFilterSummary: () => string[]
}

export interface UseBudgetDataReturn {
  budgets: Budget[]
  budgetComparisons: BudgetComparison[]
  loading: boolean
  error: string | null
  createBudget: (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>
  deleteBudget: (id: string) => Promise<void>
  refreshBudgets: () => Promise<void>
}

// API Response Types

export interface FinanceApiResponse<T> {
  data: T
  error: string | null
  loading: boolean
}

export interface PaginatedFinanceResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Form Types

export interface CreateRevenueForm {
  amount: number
  currency: string
  category: RevenueCategory
  source: string
  date: string
  description: string
  recurring: boolean
  customer_name?: string
}

export interface CreateExpenseForm {
  amount: number
  currency: string
  category: ExpenseCategory
  vendor: string
  date: string
  description: string
  payment_method?: PaymentMethod
  receipt_url?: string
  tags?: string[]
}

export interface CreateBudgetForm {
  name: string
  category: ExpenseCategory | RevenueCategory
  type: 'revenue' | 'expense'
  budgeted_amount: number
  currency: string
  period: BudgetPeriod
  start_date: string
  end_date: string
  department?: string
}

// Chart Data Types

export interface FinanceChartDataPoint {
  label: string
  value: number
  count?: number
  color?: string
  percentage?: number
  metadata?: Record<string, any>
}

export interface FinanceChartData {
  revenueData: FinanceChartDataPoint[]
  expenseData: FinanceChartDataPoint[]
  cashFlowData: FinanceChartDataPoint[]
  budgetData: FinanceChartDataPoint[]
}

// Constants and Mappings

export const REVENUE_CATEGORIES: Record<RevenueCategory, string> = {
  sales: 'Product Sales',
  services: 'Service Revenue',
  subscriptions: 'Subscription Revenue',
  licensing: 'Licensing Fees',
  consulting: 'Consulting Services',
  commission: 'Commission Income',
  interest: 'Interest Income',
  dividends: 'Dividend Income',
  grants: 'Grants & Funding',
  other: 'Other Revenue'
}

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, string> = {
  operations: 'Operations',
  marketing: 'Marketing & Advertising',
  salaries: 'Salaries & Wages',
  benefits: 'Employee Benefits',
  rent: 'Rent & Facilities',
  utilities: 'Utilities',
  travel: 'Travel & Transportation',
  software: 'Software & Subscriptions',
  equipment: 'Equipment & Hardware',
  supplies: 'Office Supplies',
  legal: 'Legal & Professional',
  accounting: 'Accounting & Finance',
  insurance: 'Insurance',
  taxes: 'Taxes & Fees',
  research: 'Research & Development',
  development: 'Product Development',
  training: 'Training & Education',
  entertainment: 'Entertainment & Events',
  other: 'Other Expenses'
}

export const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  bank_transfer: 'Bank Transfer',
  check: 'Check',
  paypal: 'PayPal',
  stripe: 'Stripe',
  other: 'Other'
}

// Theme-specific color definitions following DOI Principle
export const FINANCE_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
  
  // Financial metric colors using HSL variables for theme compatibility
  revenue: 'hsl(var(--chart-1))',        // Green - income
  expenses: 'hsl(var(--chart-2))',       // Red - outgoing
  profit: 'hsl(var(--chart-3))',         // Blue - profit
  budget: 'hsl(var(--chart-4))',         // Purple - planning
  cash_flow: 'hsl(var(--chart-5))',      // Teal - liquidity
  
  // Status colors
  positive: 'hsl(142 76% 36%)',          // Green - positive trends
  negative: 'hsl(0 84% 60%)',            // Red - negative trends
  neutral: 'hsl(213 9% 47%)',            // Gray - neutral
  
  // Category colors for charts
  category_1: 'hsl(var(--chart-1))',
  category_2: 'hsl(var(--chart-2))',
  category_3: 'hsl(var(--chart-3))',
  category_4: 'hsl(var(--chart-4))',
  category_5: 'hsl(var(--chart-5))',
} as const

// Default currency and formatting
export const DEFAULT_CURRENCY = 'USD'
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
}

// Financial thresholds and limits
export const FINANCE_THRESHOLDS = {
  HIGH_EXPENSE_AMOUNT: 10000,
  BUDGET_WARNING_PERCENTAGE: 80,
  BUDGET_CRITICAL_PERCENTAGE: 95,
  CASH_FLOW_WARNING_DAYS: 30,
  PROFIT_MARGIN_HEALTHY: 20,
  PROFIT_MARGIN_WARNING: 10,
} as const

// Error Types

export interface FinanceError {
  code: string
  message: string
  details?: Record<string, any>
}