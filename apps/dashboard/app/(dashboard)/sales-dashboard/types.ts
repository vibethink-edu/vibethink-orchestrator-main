// Sales Dashboard TypeScript Definitions
// Following VThink 1.0 methodology with strict typing and multi-tenant security

export interface SalesRep {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: SalesRole
  territory?: string
  commission_rate: number
  created_at: string
  updated_at: string
  company_id: string // CRITICAL: Multi-tenant security
  
  // Performance metrics
  monthly_quota: number
  deals_closed: number
  total_revenue: number
  conversion_rate: number
  last_activity?: string
}

export interface Sale {
  id: string
  title: string
  description?: string
  customer_name: string
  customer_email: string
  customer_company?: string
  amount: number
  stage: SaleStage
  probability: number
  close_date: string
  created_at: string
  updated_at: string
  company_id: string // CRITICAL: Multi-tenant security
  
  // Relationships
  sales_rep_id: string
  sales_rep_name: string
  product_id?: string
  
  // Additional fields
  source: SalesSource
  tags?: string[]
  notes?: string
  next_action?: string
  competitors?: string[]
  deal_history?: SaleActivity[]
}

export interface SaleActivity {
  id: string
  sale_id: string
  type: SalesActivityType
  title: string
  description: string
  created_at: string
  created_by: string
  company_id: string // CRITICAL: Multi-tenant security
  
  // Activity-specific data
  metadata?: Record<string, any>
  previous_stage?: SaleStage
  new_stage?: SaleStage
  amount_change?: number
}

export interface SalesTarget {
  id: string
  sales_rep_id: string
  period: SalesTargetPeriod
  quota: number
  achieved: number
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  company_id: string // CRITICAL: Multi-tenant security
  
  // Calculated fields
  progress_percentage: number
  remaining_quota: number
  days_remaining: number
  projected_achievement: number
}

export interface SalesMetrics {
  totalRevenue: number
  dealsClosed: number
  conversionRate: number
  activeProspects: number
  averageDealSize: number
  salesCycleLength: number
  pipelineValue: number
  quotaAttainment: number
  
  // Growth metrics
  monthlyGrowth: {
    revenue: number
    deals: number
    prospects: number
  }
  
  // Top performers
  topPerformers: SalesRep[]
  bestDeals: Sale[]
  
  // Pipeline breakdown
  pipelineByStage: PipelineStageData[]
  revenueByPeriod: RevenueData[]
}

export interface PipelineStageData {
  stage: SaleStage
  count: number
  value: number
  percentage: number
  color: string
}

export interface RevenueData {
  period: string
  revenue: number
  deals: number
  target?: number
}

export interface SalesFilters {
  searchQuery: string
  salesRep: string | 'all'
  stage: SaleStage | 'all'
  dateRange: DateRange
  amountRange: {
    min: number | null
    max: number | null
  }
  source: SalesSource | 'all'
  probability: {
    min: number
    max: number
  }
  tags?: string[]
}

export interface SalesDashboardData {
  sales: Sale[]
  salesReps: SalesRep[]
  activities: SaleActivity[]
  targets: SalesTarget[]
  metrics: SalesMetrics
  loading: boolean
  error: string | null
}

// Enums and Union Types

export type SalesRole = 
  | 'junior'      // Junior sales rep
  | 'senior'      // Senior sales rep
  | 'manager'     // Sales manager
  | 'director'    // Sales director
  | 'vp'          // VP of Sales

export type SaleStage = 
  | 'prospecting'  // Initial contact and research
  | 'qualifying'   // Qualifying the lead
  | 'demo'         // Product demonstration
  | 'proposal'     // Proposal sent
  | 'negotiating'  // Price/terms negotiation
  | 'closing'      // Final stages
  | 'won'          // Deal won
  | 'lost'         // Deal lost

export type SalesSource = 
  | 'inbound'      // Marketing generated
  | 'outbound'     // Sales generated
  | 'referral'     // Customer referral
  | 'partner'      // Partner referral
  | 'event'        // Trade show/event
  | 'social'       // Social media
  | 'cold_call'    // Cold calling
  | 'website'      // Direct website

export type SalesActivityType = 
  | 'call'
  | 'email'
  | 'meeting'
  | 'demo'
  | 'proposal_sent'
  | 'contract_sent'
  | 'stage_change'
  | 'amount_change'
  | 'note'
  | 'task'
  | 'follow_up'

export type SalesTargetPeriod = 
  | 'monthly'
  | 'quarterly'
  | 'yearly'

export type DateRange = 
  | 'all'
  | 'today'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom'

export type SalesChartType = 
  | 'pipeline'
  | 'revenue_trends'
  | 'sales_funnel'
  | 'rep_performance'
  | 'conversion_rates'
  | 'quota_attainment'

// API Response Types

export interface SalesApiResponse<T> {
  data: T
  error: string | null
  loading: boolean
}

export interface PaginatedSalesResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Form Types

export interface CreateSaleForm {
  title: string
  description?: string
  customer_name: string
  customer_email: string
  customer_company?: string
  amount: number
  stage: SaleStage
  probability: number
  close_date: string
  sales_rep_id: string
  source: SalesSource
  tags?: string[]
  notes?: string
}

export interface UpdateSaleForm extends Partial<CreateSaleForm> {
  id: string
}

export interface CreateSalesRepForm {
  name: string
  email: string
  phone?: string
  role: SalesRole
  territory?: string
  commission_rate: number
  monthly_quota: number
}

export interface UpdateSalesRepForm extends Partial<CreateSalesRepForm> {
  id: string
}

export interface CreateTargetForm {
  sales_rep_id: string
  period: SalesTargetPeriod
  quota: number
  start_date: string
  end_date: string
}

// Chart Data Types

export interface SalesChartDataPoint {
  label: string
  value: number
  count?: number
  color?: string
  metadata?: Record<string, any>
}

export interface SalesChartData {
  pipelineData: SalesChartDataPoint[]
  revenueData: SalesChartDataPoint[]
  performanceData: SalesChartDataPoint[]
  conversionData: SalesChartDataPoint[]
}

// Component Props Types

export interface SalesTableProps {
  data: Sale[]
  loading?: boolean
  onRowClick?: (sale: Sale) => void
  onEdit?: (sale: Sale) => void
  onDelete?: (id: string) => void
  className?: string
}

export interface SalesMetricsProps {
  metrics: SalesMetrics
  loading?: boolean
  className?: string
}

export interface SalesChartProps {
  data: SalesChartDataPoint[]
  type: SalesChartType
  title: string
  className?: string
  height?: number
}

export interface SalesHeaderProps {
  onFiltersChange?: (filters: Partial<SalesFilters>) => void
  onExport?: () => void
  onAddSale?: () => void
  className?: string
}

// Hook Return Types

export interface UseSalesDataReturn {
  sales: Sale[]
  salesReps: SalesRep[]
  activities: SaleActivity[]
  targets: SalesTarget[]
  metrics: SalesMetrics | null
  loading: boolean
  error: string | null
  refreshSales: () => Promise<void>
  refreshReps: () => Promise<void>
  refreshTargets: () => Promise<void>
  refreshActivities: () => Promise<void>
  refreshAll: () => Promise<void>
}

export interface UseSalesFiltersReturn {
  filters: SalesFilters
  updateFilter: <K extends keyof SalesFilters>(key: K, value: SalesFilters[K]) => void
  resetFilters: () => void
  filterSales: (sales: Sale[]) => Sale[]
  hasActiveFilters: boolean
  getFilterSummary: () => string[]
}

export interface UseSalesMetricsReturn {
  calculateMetrics: (sales: Sale[], reps: SalesRep[], targets: SalesTarget[]) => SalesMetrics
  getPipelineData: (sales: Sale[]) => PipelineStageData[]
  getRevenueData: (sales: Sale[], period: 'month' | 'quarter' | 'year') => RevenueData[]
  getTopPerformers: (reps: SalesRep[], limit?: number) => SalesRep[]
  getConversionRate: (sales: Sale[]) => number
  getAverageDealSize: (sales: Sale[]) => number
}

// Error Types

export interface SalesError {
  code: string
  message: string
  details?: Record<string, any>
}

// Constants

export const SALES_ROLES: Record<SalesRole, string> = {
  junior: 'Junior Sales Rep',
  senior: 'Senior Sales Rep',
  manager: 'Sales Manager',
  director: 'Sales Director',
  vp: 'VP of Sales'
}

export const SALE_STAGES: Record<SaleStage, string> = {
  prospecting: 'Prospecting',
  qualifying: 'Qualifying',
  demo: 'Demo/Presentation',
  proposal: 'Proposal',
  negotiating: 'Negotiating',
  closing: 'Closing',
  won: 'Closed Won',
  lost: 'Closed Lost'
}

export const SALES_SOURCES: Record<SalesSource, string> = {
  inbound: 'Inbound Marketing',
  outbound: 'Outbound Sales',
  referral: 'Customer Referral',
  partner: 'Partner Referral',
  event: 'Event/Trade Show',
  social: 'Social Media',
  cold_call: 'Cold Calling',
  website: 'Direct Website'
}

export const SALES_ACTIVITY_TYPES: Record<SalesActivityType, string> = {
  call: 'Phone Call',
  email: 'Email',
  meeting: 'Meeting',
  demo: 'Product Demo',
  proposal_sent: 'Proposal Sent',
  contract_sent: 'Contract Sent',
  stage_change: 'Stage Changed',
  amount_change: 'Amount Updated',
  note: 'Note Added',
  task: 'Task Created',
  follow_up: 'Follow-up Scheduled'
}

// Theme-specific color definitions following DOI Principle
export const SALES_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
  
  // Sales pipeline stage colors using HSL variables for theme compatibility
  prospecting: 'hsl(var(--chart-1))',    // Blue - early stage
  qualifying: 'hsl(var(--chart-2))',     // Yellow - evaluation
  demo: 'hsl(var(--chart-3))',           // Orange - presentation
  proposal: 'hsl(var(--chart-4))',       // Purple - formal proposal
  negotiating: 'hsl(var(--chart-5))',    // Teal - negotiation
  closing: 'hsl(142 76% 36%)',           // Green - near close
  won: 'hsl(142 86% 28%)',               // Dark green - success
  lost: 'hsl(0 84% 60%)',                // Red - lost deal
  
  // Chart colors for different metrics
  revenue: 'hsl(var(--chart-1))',
  deals: 'hsl(var(--chart-2))',
  targets: 'hsl(var(--chart-3))',
  performance: 'hsl(var(--chart-4))',
} as const

// Sales stage progression and probabilities
export const STAGE_PROBABILITIES: Record<SaleStage, number> = {
  prospecting: 10,
  qualifying: 25,
  demo: 40,
  proposal: 60,
  negotiating: 80,
  closing: 90,
  won: 100,
  lost: 0
}

// Default sales quotas by role (monthly)
export const DEFAULT_QUOTAS: Record<SalesRole, number> = {
  junior: 50000,
  senior: 100000,
  manager: 150000,
  director: 250000,
  vp: 500000
}