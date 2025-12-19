'use client'

import { useQuery } from './mockReactQuery'
import { useState } from 'react'
import { supabase } from './mockSupabase'
import { useAuth } from './useAuth'
import { 
  WebsiteMetrics, 
  SalesAnalytics, 
  EarningReport, 
  SupportTickets,
  CampaignMetrics,
  CountrySales,
  DailySalesData,
  UseAnalyticsDataReturn,
  AnalyticsError,
  AnalyticsFilters
} from '../types'

/**
 * Custom hook for fetching website analytics data
 * 
 * Features:
 * - Multi-tenant security with company_id filtering
 * - React Query for caching and background updates
 * - Error handling and loading states
 * - Real-time data refetching
 * 
 * SECURITY: ALL queries MUST filter by company_id
 */
export const useAnalyticsData = (filters?: AnalyticsFilters): UseAnalyticsDataReturn => {
  const { user } = useAuth()
  const [error, setError] = useState<AnalyticsError | null>(null)

  // Website metrics query
  const { 
    data: websiteMetrics = [], 
    isLoading: websiteLoading,
    isError: websiteError,
    refetch: refetchWebsite
  } = useQuery({
    queryKey: ['analytics-website', user?.company_id, filters],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error('No company_id available')
      }

      let query = supabase
        .from('website_analytics')
        .select('*')
        .eq('company_id', user.company_id) // ✅ CRITICAL: Multi-tenant filter
        .order('date', { ascending: false })

      // Apply date range filter if provided
      if (filters?.dateRange) {
        query = query
          .gte('date', filters.dateRange.from.toISOString())
          .lte('date', filters.dateRange.to.toISOString())
      }

      const { data, error } = await query.limit(30)
      
      if (error) {
        setError({ code: 'WEBSITE_FETCH_ERROR', message: error.message })
        throw error
      }
      
      return (data as WebsiteMetrics[]) || []
    },
    enabled: !!user?.company_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  })

  // Sales analytics query
  const { 
    data: salesAnalytics = [], 
    isLoading: salesLoading,
    isError: salesError,
    refetch: refetchSales
  } = useQuery({
    queryKey: ['analytics-sales', user?.company_id, filters],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error('No company_id available')
      }

      let query = supabase
        .from('sales_analytics')
        .select('*')
        .eq('company_id', user.company_id) // ✅ CRITICAL: Multi-tenant filter
        .order('date', { ascending: false })

      // Apply filters
      if (filters?.dateRange) {
        query = query
          .gte('date', filters.dateRange.from.toISOString())
          .lte('date', filters.dateRange.to.toISOString())
      }

      if (filters?.country) {
        query = query.eq('country', filters.country)
      }

      const { data, error } = await query.limit(30)
      
      if (error) {
        setError({ code: 'SALES_FETCH_ERROR', message: error.message })
        throw error
      }
      
      return (data as SalesAnalytics[]) || []
    },
    enabled: !!user?.company_id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  // Earning reports query
  const { 
    data: earningReports = [], 
    isLoading: earningLoading,
    isError: earningError,
    refetch: refetchEarnings
  } = useQuery({
    queryKey: ['analytics-earnings', user?.company_id, filters],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error('No company_id available')
      }

      let query = supabase
        .from('earning_reports')
        .select('*')
        .eq('company_id', user.company_id) // ✅ CRITICAL: Multi-tenant filter
        .order('date', { ascending: false })

      if (filters?.dateRange) {
        query = query
          .gte('date', filters.dateRange.from.toISOString())
          .lte('date', filters.dateRange.to.toISOString())
      }

      const { data, error } = await query.limit(12) // Last 12 months
      
      if (error) {
        setError({ code: 'EARNINGS_FETCH_ERROR', message: error.message })
        throw error
      }
      
      return (data as EarningReport[]) || []
    },
    enabled: !!user?.company_id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  // Support tickets query
  const { 
    data: supportTickets = [], 
    isLoading: ticketsLoading,
    isError: ticketsError,
    refetch: refetchTickets
  } = useQuery({
    queryKey: ['analytics-tickets', user?.company_id, filters],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error('No company_id available')
      }

      let query = supabase
        .from('support_tickets_analytics')
        .select('*')
        .eq('company_id', user.company_id) // ✅ CRITICAL: Multi-tenant filter
        .order('date', { ascending: false })

      if (filters?.dateRange) {
        query = query
          .gte('date', filters.dateRange.from.toISOString())
          .lte('date', filters.dateRange.to.toISOString())
      }

      const { data, error } = await query.limit(30)
      
      if (error) {
        setError({ code: 'TICKETS_FETCH_ERROR', message: error.message })
        throw error
      }
      
      return (data as SupportTickets[]) || []
    },
    enabled: !!user?.company_id,
    staleTime: 2 * 60 * 1000, // 2 minutes for tickets (more real-time)
    gcTime: 5 * 60 * 1000
  })

  // Campaign metrics query
  const { 
    data: campaignMetrics = [], 
    isLoading: campaignLoading,
    isError: campaignError,
    refetch: refetchCampaigns
  } = useQuery({
    queryKey: ['analytics-campaigns', user?.company_id, filters],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error('No company_id available')
      }

      let query = supabase
        .from('campaign_analytics')
        .select('*')
        .eq('company_id', user.company_id) // ✅ CRITICAL: Multi-tenant filter
        .order('start_date', { ascending: false })

      if (filters?.campaign) {
        query = query.eq('campaign_name', filters.campaign)
      }

      const { data, error } = await query.limit(20)
      
      if (error) {
        setError({ code: 'CAMPAIGNS_FETCH_ERROR', message: error.message })
        throw error
      }
      
      return (data as CampaignMetrics[]) || []
    },
    enabled: !!user?.company_id,
    staleTime: 10 * 60 * 1000, // 10 minutes for campaigns
    gcTime: 15 * 60 * 1000
  })

  // Country sales query
  const { 
    data: countrySales = [], 
    isLoading: countryLoading,
    isError: countryError,
    refetch: refetchCountry
  } = useQuery({
    queryKey: ['analytics-country-sales', user?.company_id, filters],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error('No company_id available')
      }

      let query = supabase
        .from('country_sales_analytics')
        .select('*')
        .eq('company_id', user.company_id) // ✅ CRITICAL: Multi-tenant filter
        .order('sales_amount', { ascending: false })

      if (filters?.dateRange) {
        query = query
          .gte('date', filters.dateRange.from.toISOString())
          .lte('date', filters.dateRange.to.toISOString())
      }

      const { data, error } = await query.limit(20)
      
      if (error) {
        setError({ code: 'COUNTRY_SALES_FETCH_ERROR', message: error.message })
        throw error
      }
      
      return (data as CountrySales[]) || []
    },
    enabled: !!user?.company_id,
    staleTime: 15 * 60 * 1000, // 15 minutes for geographic data
    gcTime: 30 * 60 * 1000
  })

  // Daily sales query
  const { 
    data: dailySales = [], 
    isLoading: dailyLoading,
    isError: dailyError,
    refetch: refetchDaily
  } = useQuery({
    queryKey: ['analytics-daily-sales', user?.company_id, filters],
    queryFn: async () => {
      if (!user?.company_id) {
        throw new Error('No company_id available')
      }

      let query = supabase
        .from('daily_sales_analytics')
        .select('*')
        .eq('company_id', user.company_id) // ✅ CRITICAL: Multi-tenant filter
        .order('date', { ascending: false })

      if (filters?.dateRange) {
        query = query
          .gte('date', filters.dateRange.from.toISOString())
          .lte('date', filters.dateRange.to.toISOString())
      }

      const { data, error } = await query.limit(90) // Last 90 days
      
      if (error) {
        setError({ code: 'DAILY_SALES_FETCH_ERROR', message: error.message })
        throw error
      }
      
      return (data as DailySalesData[]) || []
    },
    enabled: !!user?.company_id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  // Global refetch function
  const refetch = () => {
    refetchWebsite()
    refetchSales()
    refetchEarnings()
    refetchTickets()
    refetchCampaigns()
    refetchCountry()
    refetchDaily()
  }

  // Combine loading states
  const isLoading = websiteLoading || salesLoading || earningLoading || 
                   ticketsLoading || campaignLoading || countryLoading || dailyLoading

  // Combine error states
  const isError = websiteError || salesError || earningError || 
                 ticketsError || campaignError || countryError || dailyError

  return {
    websiteMetrics,
    salesAnalytics,
    earningReports,
    supportTickets,
    campaignMetrics,
    countrySales,
    dailySales,
    isLoading,
    isError,
    error,
    refetch
  }
}