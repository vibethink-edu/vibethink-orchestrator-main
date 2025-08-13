import { useCallback } from 'react'
import { 
  Sale, 
  SalesRep, 
  SalesTarget, 
  SalesMetrics,
  PipelineStageData,
  RevenueData,
  UseSalesMetricsReturn,
  STAGE_PROBABILITIES,
  SALES_COLORS
} from '../types'

/**
 * Custom hook for calculating sales metrics and analytics
 * 
 * Features:
 * - Comprehensive metrics calculation
 * - Pipeline analysis
 * - Revenue trend analysis
 * - Performance ranking
 * - Conversion rate tracking
 * - Real-time calculations
 */
export const useSalesMetrics = (): UseSalesMetricsReturn => {

  /**
   * Calculate comprehensive sales metrics
   */
  const calculateMetrics = useCallback((
    sales: Sale[], 
    reps: SalesRep[], 
    targets: SalesTarget[]
  ): SalesMetrics => {
    // Revenue calculations
    const wonDeals = sales.filter(sale => sale.stage === 'won')
    const totalRevenue = wonDeals.reduce((sum, sale) => sum + sale.amount, 0)
    const dealsClosed = wonDeals.length

    // Active prospects (not won or lost)
    const activeProspects = sales.filter(sale => 
      !['won', 'lost'].includes(sale.stage)
    ).length

    // Conversion rate calculation
    const totalDeals = sales.length
    const conversionRate = totalDeals > 0 ? (dealsClosed / totalDeals) * 100 : 0

    // Average deal size
    const averageDealSize = dealsClosed > 0 ? totalRevenue / dealsClosed : 0

    // Sales cycle length (average days from creation to close)
    const closedDealsWithDates = wonDeals.filter(sale => sale.created_at && sale.close_date)
    const salesCycleLength = closedDealsWithDates.length > 0 
      ? closedDealsWithDates.reduce((sum, sale) => {
          const created = new Date(sale.created_at)
          const closed = new Date(sale.close_date)
          const days = Math.abs(closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
          return sum + days
        }, 0) / closedDealsWithDates.length
      : 0

    // Pipeline value (weighted by probability)
    const activeSales = sales.filter(sale => !['won', 'lost'].includes(sale.stage))
    const pipelineValue = activeSales.reduce((sum, sale) => {
      return sum + (sale.amount * (sale.probability / 100))
    }, 0)

    // Quota attainment calculation
    const totalQuota = targets.reduce((sum, target) => sum + target.quota, 0)
    const totalAchieved = targets.reduce((sum, target) => sum + target.achieved, 0)
    const quotaAttainment = totalQuota > 0 ? (totalAchieved / totalQuota) * 100 : 0

    // Growth metrics (mock data - in real app, compare with historical data)
    const monthlyGrowth = {
      revenue: calculateGrowthRate(totalRevenue, totalRevenue * 0.87), // Mock 15% growth
      deals: calculateGrowthRate(dealsClosed, Math.floor(dealsClosed * 0.92)), // Mock 8% growth
      prospects: calculateGrowthRate(activeProspects, Math.floor(activeProspects * 0.89)) // Mock 12% growth
    }

    // Top performers (sorted by total revenue)
    const topPerformers = reps
      .slice()
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 5)

    // Best deals (highest value deals)
    const bestDeals = sales
      .slice()
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Pipeline breakdown by stage
    const pipelineByStage = getPipelineData(sales)

    // Revenue by period (mock data - in real app, aggregate by actual periods)
    const revenueByPeriod = getRevenueData(sales, 'month')

    return {
      totalRevenue: Math.round(totalRevenue),
      dealsClosed,
      conversionRate: Math.round(conversionRate * 10) / 10,
      activeProspects,
      averageDealSize: Math.round(averageDealSize),
      salesCycleLength: Math.round(salesCycleLength),
      pipelineValue: Math.round(pipelineValue),
      quotaAttainment: Math.round(quotaAttainment * 10) / 10,
      monthlyGrowth,
      topPerformers,
      bestDeals,
      pipelineByStage,
      revenueByPeriod
    }
  }, [])

  /**
   * Generate pipeline data breakdown by stage
   */
  const getPipelineData = useCallback((sales: Sale[]): PipelineStageData[] => {
    const stages = ['prospecting', 'qualifying', 'demo', 'proposal', 'negotiating', 'closing'] as const
    const totalDeals = sales.filter(sale => stages.includes(sale.stage as any)).length
    
    return stages.map(stage => {
      const stageDeals = sales.filter(sale => sale.stage === stage)
      const count = stageDeals.length
      const value = stageDeals.reduce((sum, sale) => sum + sale.amount, 0)
      const percentage = totalDeals > 0 ? Math.round((count / totalDeals) * 100) : 0
      
      return {
        stage,
        count,
        value,
        percentage,
        color: SALES_COLORS[stage] || SALES_COLORS.primary
      }
    })
  }, [])

  /**
   * Generate revenue data by period
   */
  const getRevenueData = useCallback((
    sales: Sale[], 
    period: 'month' | 'quarter' | 'year'
  ): RevenueData[] => {
    const wonDeals = sales.filter(sale => sale.stage === 'won')
    
    // Group deals by period (mock implementation)
    // In real app, this would aggregate actual data by date periods
    const periods = period === 'month' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : period === 'quarter'
      ? ['Q1', 'Q2', 'Q3', 'Q4']
      : ['2022', '2023', '2024']

    return periods.map((periodName, index) => {
      // Mock data generation based on actual deals
      const baseRevenue = wonDeals.reduce((sum, sale) => sum + sale.amount, 0) / periods.length
      const variance = (Math.random() - 0.5) * 0.4 // ±20% variance
      const revenue = Math.round(baseRevenue * (1 + variance))
      
      const baseDeals = Math.ceil(wonDeals.length / periods.length)
      const deals = Math.max(1, baseDeals + Math.floor((Math.random() - 0.5) * 6))
      
      const target = Math.round(revenue * (0.9 + Math.random() * 0.2)) // Target ±10% of revenue
      
      return {
        period: periodName,
        revenue,
        deals,
        target
      }
    })
  }, [])

  /**
   * Get top performing sales reps
   */
  const getTopPerformers = useCallback((reps: SalesRep[], limit: number = 5): SalesRep[] => {
    return reps
      .slice()
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, limit)
  }, [])

  /**
   * Calculate conversion rate for a set of sales
   */
  const getConversionRate = useCallback((sales: Sale[]): number => {
    const totalDeals = sales.length
    const wonDeals = sales.filter(sale => sale.stage === 'won').length
    
    return totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0
  }, [])

  /**
   * Calculate average deal size
   */
  const getAverageDealSize = useCallback((sales: Sale[]): number => {
    const wonDeals = sales.filter(sale => sale.stage === 'won')
    const totalRevenue = wonDeals.reduce((sum, sale) => sum + sale.amount, 0)
    
    return wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0
  }, [])

  return {
    calculateMetrics,
    getPipelineData,
    getRevenueData,
    getTopPerformers,
    getConversionRate,
    getAverageDealSize
  }
}

/**
 * Helper function to calculate growth rate percentage
 */
function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}