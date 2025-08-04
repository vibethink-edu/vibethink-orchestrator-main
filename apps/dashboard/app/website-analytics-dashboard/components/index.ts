/**
 * Website Analytics Components - Barrel Exports
 * 
 * Centralized exports for all analytics dashboard components
 * Simplifies imports across the application
 */

// Header and Layout Components
export { AnalyticsHeader, AnalyticsHeaderCompact } from './AnalyticsHeader'

// Core Analytics Components
export { WebsiteAnalyticsCard } from './WebsiteAnalyticsCard'
export { TotalEarningCard } from './TotalEarningCard'
export { EarningReportsCard } from './EarningReportsCard'

// Performance and Sales Components
export { SalesOverflowCard } from './SalesOverflowCard'
export { SalesByCountriesCard } from './SalesByCountriesCard'
export { AverageDailySales } from './AverageDailySales'

// Campaign and Support Components
export { MonthlyCampaignState } from './MonthlyCampaignState'
export { TicketsCard } from './TicketsCard'

// Re-export types for convenience
export type { 
  AnalyticsCardProps,
  ChartComponentProps,
  MetricsCardProps 
} from '../types'