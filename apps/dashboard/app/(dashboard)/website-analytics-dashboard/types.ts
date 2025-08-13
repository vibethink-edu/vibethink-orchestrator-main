/**
 * Website Analytics Types
 * 
 * TypeScript interfaces for all website analytics data structures
 * Used across components, hooks, and API responses
 * 
 * Security: All interfaces include company_id for multi-tenant isolation
 */

export interface WebsiteMetrics {
  id: string
  company_id: string
  date: string
  page_views: number
  unique_visitors: number
  bounce_rate: number
  session_duration: number
  conversion_rate: number
  direct_traffic: number
  organic_traffic: number
  referral_traffic: number
  social_traffic: number
  created_at?: string
  updated_at?: string
}

export interface SalesAnalytics {
  id: string
  company_id: string
  date: string
  revenue: number
  orders: number
  average_order_value: number
  conversion_rate: number
  country: string
  campaign_source?: string
  channel?: string
  created_at?: string
  updated_at?: string
}

export interface EarningReport {
  id: string
  company_id: string
  date: string
  total_earnings: number
  revenue_breakdown: {
    subscription: number
    one_time_payment: number
    commission: number
    affiliate: number
  }
  profit_margin: number
  expenses: number
  net_profit: number
  growth_percentage: number
  created_at?: string
  updated_at?: string
}

export interface SupportTickets {
  id: string
  company_id: string
  date: string
  total_tickets: number
  open_tickets: number
  resolved_tickets: number
  pending_tickets: number
  average_response_time: number
  satisfaction_score: number
  priority_breakdown: {
    high: number
    medium: number
    low: number
  }
  created_at?: string
  updated_at?: string
}

export interface CampaignMetrics {
  id: string
  company_id: string
  campaign_name: string
  campaign_type: string
  start_date: string
  end_date: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number // Click-through rate
  cpc: number // Cost per click
  conversions: number
  conversion_rate: number
  roi: number // Return on investment
  created_at?: string
  updated_at?: string
}

export interface CountrySales {
  id: string
  company_id: string
  country_code: string
  country_name: string
  sales_amount: number
  order_count: number
  percentage_of_total: number
  growth_rate: number
  date: string
  created_at?: string
  updated_at?: string
}

export interface DailySalesData {
  id: string
  company_id: string
  date: string
  sales_amount: number
  order_count: number
  average_order_value: number
  new_customers: number
  returning_customers: number
  conversion_rate: number
  created_at?: string
  updated_at?: string
}

// Chart data interfaces for Recharts
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface BarChartData {
  name: string
  value: number
  label?: string
  color?: string
}

export interface LineChartData {
  date: string
  revenue: number
  orders: number
  visitors: number
}

export interface PieChartData {
  name: string
  value: number
  percentage: number
  color?: string
}

// Filter and configuration interfaces
export interface AnalyticsDateRange {
  from: Date
  to: Date
}

export interface AnalyticsFilters {
  dateRange: AnalyticsDateRange
  country?: string
  campaign?: string
  channel?: string
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year'
}

export interface AnalyticsConfig {
  refreshInterval: number
  autoRefresh: boolean
  currency: string
  timezone: string
  dateFormat: string
}

// API Response interfaces
export interface AnalyticsApiResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    company_id: string
  }
  success: boolean
  message?: string
}

export interface AnalyticsError {
  code: string
  message: string
  details?: any
}

// Hook return types
export interface UseAnalyticsDataReturn {
  websiteMetrics: WebsiteMetrics[]
  salesAnalytics: SalesAnalytics[]
  earningReports: EarningReport[]
  supportTickets: SupportTickets[]
  campaignMetrics: CampaignMetrics[]
  countrySales: CountrySales[]
  dailySales: DailySalesData[]
  isLoading: boolean
  isError: boolean
  error: AnalyticsError | null
  refetch: () => void
}

export interface UseAnalyticsFiltersReturn {
  filters: AnalyticsFilters
  setFilters: (filters: Partial<AnalyticsFilters>) => void
  resetFilters: () => void
  applyDateRange: (range: AnalyticsDateRange) => void
  applyPresetRange: (preset: string) => void
  getDateRangeLabel: () => string
  isDefaultFilters: () => boolean
}

// Component prop interfaces
export interface AnalyticsCardProps {
  className?: string
  isLoading?: boolean
  error?: AnalyticsError | null
}

export interface ChartComponentProps extends AnalyticsCardProps {
  data: any[]
  height?: number
  showTooltip?: boolean
  showGrid?: boolean
}

export interface MetricsCardProps extends AnalyticsCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ComponentType
}