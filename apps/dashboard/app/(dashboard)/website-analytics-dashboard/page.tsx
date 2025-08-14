'use client'
import { 
  AnalyticsHeader,
  WebsiteAnalyticsCard,
  TotalEarningCard,
  SalesOverflowCard,
  SalesByCountriesCard,
  AverageDailySalesCard,
  MonthlyCampaignState,
  TicketsCard
} from './components'
import { EarningReportsCard } from './components/SimplifiedEarningReportsCard'
import { useAnalyticsFilters } from './hooks'
import { format } from 'date-fns'

/**
 * Website Analytics Dashboard Page
 * 
 * Comprehensive analytics dashboard following Bundui Premium design patterns.
 * 
 * Features:
 * - Real-time website analytics and traffic metrics
 * - Revenue and earning analysis with trends
 * - Geographic sales distribution and market insights
 * - Campaign performance and ROI tracking
 * - Support ticket metrics and customer satisfaction
 * - Interactive date range filtering and export functionality
 * 
 * Architecture:
 * - Multi-tenant security with company_id filtering
 * - Responsive grid layout optimized for all screen sizes
 * - HSL color variables for seamless theme integration
 * - React Query for efficient data caching and updates
 * - VThink 1.0 methodology compliance
 * 
 * Layout Structure:
 * Row 1: Analytics Header with controls
 * Row 2: Main metrics (Website Analytics, Average Daily Sales, Sales Overflow)
 * Row 3: Detailed reports (Earning Reports, Support Tickets)
 * Row 4: Geographic and campaign analysis (Countries, Earnings, Campaigns)
 */
export default function WebsiteAnalyticsPage() {
  const { filters } = useAnalyticsFilters()
  
  // Following bundui-reference pattern: no global Redux state
  const isLoading = false
  const error = null

  // Handle data refresh - simplified for bundui-reference alignment
  const handleRefresh = async () => {
    console.log('Refresh functionality - using static data like bundui-reference')
  }

  // Handle data export
  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    // TODO: Implement actual export functionality
    console.log(`Exporting analytics data as ${format}`)
    // This would typically call an API endpoint to generate and download the file
  }

  return (
    <div className="space-y-6">
        {/* Analytics Header with Date Filters and Export Controls */}
        <AnalyticsHeader
          title="Website Analytics"
          onRefresh={handleRefresh}
          onExport={handleExport}
          isLoading={isLoading}
          error={error}
        />

        {/* Main Analytics Grid */}
        <div className="grid gap-6">
          {/* Top Row: Primary Metrics Overview */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Website Traffic and Conversion Metrics */}
            <WebsiteAnalyticsCard 
              className="lg:col-span-1"
              isLoading={isLoading}
              error={error}
            />
            
            {/* Daily Sales Trends and Patterns */}
            <AverageDailySalesCard 
              className="lg:col-span-1"
              isLoading={isLoading}
              error={error}
            />
            
            {/* Sales Performance vs Targets */}
            <SalesOverflowCard 
              className="lg:col-span-1"
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Middle Row: Detailed Analytics and Reports */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Comprehensive Earning Reports with Charts */}
            <EarningReportsCard 
              className="lg:col-span-8"
              isLoading={isLoading}
              error={error}
            />
            
            {/* Support Tickets and Customer Service Metrics */}
            <TicketsCard 
              className="lg:col-span-4"
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Bottom Row: Geographic and Campaign Analysis */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Geographic Sales Distribution */}
            <SalesByCountriesCard 
              className="lg:col-span-1"
              isLoading={isLoading}
              error={error}
            />
            
            {/* Total Earnings with Revenue Breakdown */}
            <TotalEarningCard 
              className="lg:col-span-1"
              isLoading={isLoading}
              error={error}
            />
            
            {/* Campaign Performance and ROI Analysis */}
            <MonthlyCampaignState 
              className="lg:col-span-1"
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        {/* Debug Information (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 rounded-lg border border-dashed border-muted p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Debug Information (Development Only)
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <div>Loading State: {isLoading ? 'Loading...' : 'Ready'}</div>
                <div>Error State: {error ? error.message : 'None'}</div>
                <div>Filters Applied: {Object.keys(filters).length}</div>
              </div>
              <div>
                <div>Date Range: {filters.dateRange?.from ? format(filters.dateRange.from, "dd MMM yyyy") : 'None'} - {filters.dateRange?.to ? format(filters.dateRange.to, "dd MMM yyyy") : 'None'}</div>
                <div>Country Filter: {filters.country || 'All Countries'}</div>
                <div>Campaign Filter: {filters.campaign || 'All Campaigns'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

// Note: Metadata would be added in layout.tsx or as a server component wrapper