'use client'

;

import { SalesHeader } from './components/SalesHeader'
import { SalesMetrics } from './components/SalesMetrics'
import { SalesPipelineChart } from './components/SalesPipelineChart'
import { RevenueChart } from './components/RevenueChart'
import { SalesTable } from './components/SalesTable'
import { TopPerformers } from './components/TopPerformers'
import { SalesTargets } from './components/SalesTargets'
import { RecentDeals } from './components/RecentDeals'

/**
 * Sales Dashboard Page
 * 
 * Complete sales dashboard with metrics, pipeline visualization, 
 * performance tracking, and sales management tools.
 * 
 * Features:
 * - Real-time sales metrics and KPIs
 * - Interactive sales pipeline chart
 * - Revenue trends and forecasting
 * - Sales rep performance tracking
 * - Target vs achievement monitoring
 * - Recent deals and activity feed
 * 
 * Security: Multi-tenant with company_id filtering
 * Layout: Responsive grid with sidebar integration
 * Charts: Recharts with HSL color variables
 */
export default function SalesDashboardPage() {
  return (
    <div className="space-y-6">
        {/* Header with filters and quick actions */}
        <SalesHeader />
        
        <div className="grid gap-6">
          {/* Key metrics overview */}
          <SalesMetrics />
          
          {/* Main content area with responsive layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Primary content: Charts and data tables */}
            <div className="lg:col-span-2 space-y-6">
              <SalesPipelineChart />
              <RevenueChart />
              <SalesTable />
            </div>
            
            {/* Sidebar content: Widgets and quick info */}
            <div className="space-y-6">
              <SalesTargets />
              <TopPerformers />
              <RecentDeals />
            </div>
          </div>
        </div>
      </div>
  )
}
