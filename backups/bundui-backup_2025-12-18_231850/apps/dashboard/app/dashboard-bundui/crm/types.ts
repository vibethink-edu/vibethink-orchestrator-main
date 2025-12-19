// CRM Dashboard TypeScript Definitions
// Following VThink 1.0 methodology with strict typing

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: CustomerStatus
  value: number
  avatar?: string
  created_at: string
  updated_at: string
  company_id: string // CRITICAL: Multi-tenant security
  
  // Optional fields for extended customer data
  address?: CustomerAddress
  tags?: string[]
  notes?: string
  last_contact?: string
  assigned_to?: string
}

export interface Deal {
  id: string
  title: string
  description?: string
  customer_id: string
  customer_name: string
  value: number
  stage: DealStage
  probability: number
  close_date: string
  created_at: string
  updated_at: string
  company_id: string // CRITICAL: Multi-tenant security
  
  // Optional fields for extended deal data
  tags?: string[]
  notes?: string
  assigned_to?: string
  source?: string
  competitors?: string[]
}

export interface CustomerAddress {
  street: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface CrmActivity {
  id: string
  type: ActivityType
  title: string
  description: string
  customer_id?: string
  deal_id?: string
  created_at: string
  created_by: string
  company_id: string // CRITICAL: Multi-tenant security
  
  // Activity-specific data
  metadata?: Record<string, any>
}

export interface CrmMetrics {
  totalCustomers: number
  totalRevenue: number
  activeDeals: number
  conversionRate: number
  averageDealSize: number
  salesCycleLength: number
  topPerformers: {
    customer: Customer | null
    deal: Deal | null
  }
  monthlyGrowth: {
    customers: number
    revenue: number
  }
}

export interface CrmFilters {
  searchQuery: string
  customerStatus: CustomerStatus | 'all'
  dealStage: DealStage | 'all'
  dateRange: DateRange
  valueRange: {
    min: number | null
    max: number | null
  }
  assignedTo?: string | 'all'
  tags?: string[]
}

export interface CrmDashboardData {
  customers: Customer[]
  deals: Deal[]
  activities: CrmActivity[]
  metrics: CrmMetrics
  loading: boolean
  error: string | null
}

// Enums and Union Types

export type CustomerStatus = 
  | 'active'      // Paying customer
  | 'lead'        // Qualified lead
  | 'prospect'    // Potential customer
  | 'inactive'    // Dormant customer
  | 'churned'     // Lost customer

export type DealStage = 
  | 'discovery'   // Initial contact
  | 'qualified'   // Qualified opportunity
  | 'proposal'    // Proposal sent
  | 'negotiation' // In negotiation
  | 'closed'      // Deal won
  | 'lost'        // Deal lost

export type ActivityType = 
  | 'call'
  | 'email'
  | 'meeting'
  | 'note'
  | 'task'
  | 'deal_created'
  | 'deal_updated'
  | 'customer_created'
  | 'customer_updated'
  | 'proposal_sent'
  | 'contract_signed'

export type DateRange = 
  | 'all'
  | 'today'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom'

export type CrmChartType = 
  | 'customer_growth'
  | 'sales_funnel'
  | 'revenue_trends'
  | 'conversion_rate'
  | 'deal_pipeline'
  | 'activity_timeline'

// API Response Types

export interface CrmApiResponse<T> {
  data: T
  error: string | null
  loading: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Form Types

export interface CreateCustomerForm {
  name: string
  email: string
  phone: string
  company: string
  status: CustomerStatus
  value?: number
  address?: Partial<CustomerAddress>
  tags?: string[]
  notes?: string
}

export interface CreateDealForm {
  title: string
  description?: string
  customer_id: string
  value: number
  stage: DealStage
  probability: number
  close_date: string
  tags?: string[]
  notes?: string
}

export interface UpdateDealForm extends Partial<CreateDealForm> {
  id: string
}

export interface UpdateCustomerForm extends Partial<CreateCustomerForm> {
  id: string
}

// Chart Data Types

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  metadata?: Record<string, any>
}

export interface CrmChartData {
  customerGrowth: ChartDataPoint[]
  salesFunnel: ChartDataPoint[]
  revenueTrends: ChartDataPoint[]
  conversionRates: ChartDataPoint[]
}

// Component Props Types

export interface CrmTableProps {
  data: Customer[] | Deal[]
  loading?: boolean
  onRowClick?: (item: Customer | Deal) => void
  onEdit?: (item: Customer | Deal) => void
  onDelete?: (id: string) => void
  className?: string
}

export interface CrmMetricsProps {
  metrics: CrmMetrics
  loading?: boolean
  className?: string
}

export interface CrmChartProps {
  data: ChartDataPoint[]
  type: CrmChartType
  title: string
  className?: string
  height?: number
}

// Hook Return Types

export interface UseCrmDataReturn {
  customers: Customer[]
  deals: Deal[]
  activities: CrmActivity[]
  metrics: CrmMetrics | null
  loading: boolean
  error: string | null
  refreshCustomers: () => Promise<void>
  refreshDeals: () => Promise<void>
  refreshActivities: () => Promise<void>
  refreshAll: () => Promise<void>
}

export interface UseCrmFiltersReturn {
  filters: CrmFilters
  updateFilter: <K extends keyof CrmFilters>(key: K, value: CrmFilters[K]) => void
  resetFilters: () => void
  filterCustomers: (customers: Customer[]) => Customer[]
  filterDeals: (deals: Deal[]) => Deal[]
  hasActiveFilters: boolean
  getFilterSummary: () => string[]
}

// Error Types

export interface CrmError {
  code: string
  message: string
  details?: Record<string, any>
}

// Constants

export const CUSTOMER_STATUSES: Record<CustomerStatus, string> = {
  active: 'Active',
  lead: 'Lead',
  prospect: 'Prospect',
  inactive: 'Inactive',
  churned: 'Churned'
}

export const DEAL_STAGES: Record<DealStage, string> = {
  discovery: 'Discovery',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed: 'Closed Won',
  lost: 'Closed Lost'
}

export const ACTIVITY_TYPES: Record<ActivityType, string> = {
  call: 'Phone Call',
  email: 'Email',
  meeting: 'Meeting',
  note: 'Note',
  task: 'Task',
  deal_created: 'Deal Created',
  deal_updated: 'Deal Updated',
  customer_created: 'Customer Created',
  customer_updated: 'Customer Updated',
  proposal_sent: 'Proposal Sent',
  contract_signed: 'Contract Signed'
}

// Theme-specific color definitions following DOI Principle
export const CRM_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
  
  // Chart colors using HSL variables for theme compatibility
  chart1: 'hsl(var(--chart-1))',  // Customers
  chart2: 'hsl(var(--chart-2))',  // Revenue
  chart3: 'hsl(var(--chart-3))',  // Pipeline
  chart4: 'hsl(var(--chart-4))',  // Activities
  chart5: 'hsl(var(--chart-5))',  // Additional metrics
} as const