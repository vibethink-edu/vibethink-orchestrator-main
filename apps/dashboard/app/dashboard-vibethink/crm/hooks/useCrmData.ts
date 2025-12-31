'use client'

import { useState, useEffect } from 'react'


// Mock Supabase client for demo - replace with real implementation
const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: string) => ({
        order: (column: string, options: any) => Promise.resolve({ data: [], error: null })
      })
    })
  })
}

// Mock user for now - in real implementation, get from auth context
const mockUser = {
  id: '1',
  company_id: 'company_1',
  role: 'ADMIN'
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'active' | 'lead' | 'prospect' | 'inactive'
  value: number
  created_at: string
  company_id: string
}

interface Deal {
  id: string
  title: string
  customer_id: string
  customer_name: string
  value: number
  stage: 'discovery' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost'
  probability: number
  close_date: string
  created_at: string
  company_id: string
}

interface CrmMetrics {
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

export function useCrmData() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [metrics, setMetrics] = useState<CrmMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch customers with company_id filtering - CRITICAL for multi-tenant security
  const fetchCustomers = async () => {
    try {
      const { data, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('company_id', mockUser.company_id) // ✅ CRITICAL: Always filter by company_id
        .order('created_at', { ascending: false })

      if (customerError) throw customerError

      // For demo purposes, return mock data if no real data
      if (!data || data.length === 0) {
        return [
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1 (555) 123-4567',
            company: 'Tech Corp',
            status: 'active' as const,
            value: 12450,
            created_at: new Date().toISOString(),
            company_id: mockUser.company_id
          },
          {
            id: '2',
            name: 'Mike Chen',
            email: 'mike@example.com',
            phone: '+1 (555) 234-5678',
            company: 'Design Studio',
            status: 'lead' as const,
            value: 8200,
            created_at: new Date().toISOString(),
            company_id: mockUser.company_id
          },
          {
            id: '3',
            name: 'Emma Davis',
            email: 'emma@example.com',
            phone: '+1 (555) 345-6789',
            company: 'Marketing Inc',
            status: 'active' as const,
            value: 15750,
            created_at: new Date().toISOString(),
            company_id: mockUser.company_id
          }
        ]
      }

      return data as Customer[]
    } catch (err) {
      console.error('Error fetching customers:', err)
      throw err
    }
  }

  // Fetch deals with company_id filtering - CRITICAL for multi-tenant security
  const fetchDeals = async () => {
    try {
      const { data, error: dealsError } = await supabase
        .from('deals')
        .select(`
          *,
          customer:customers(name)
        `)
        .eq('company_id', mockUser.company_id) // ✅ CRITICAL: Always filter by company_id
        .order('created_at', { ascending: false })

      if (dealsError) throw dealsError

      // For demo purposes, return mock data if no real data
      if (!data || data.length === 0) {
        return [
          {
            id: '1',
            title: 'Enterprise Software License',
            customer_id: '1',
            customer_name: 'Tech Corp',
            value: 45000,
            stage: 'negotiation' as const,
            probability: 75,
            close_date: '2024-02-15',
            created_at: new Date().toISOString(),
            company_id: mockUser.company_id
          },
          {
            id: '2',
            title: 'Website Redesign Project',
            customer_id: '2',
            customer_name: 'Design Studio',
            value: 12500,
            stage: 'proposal' as const,
            probability: 60,
            close_date: '2024-02-20',
            created_at: new Date().toISOString(),
            company_id: mockUser.company_id
          }
        ]
      }

      return data.map(deal => ({
        ...deal,
        customer_name: deal.customer?.name || 'Unknown'
      })) as Deal[]
    } catch (err) {
      console.error('Error fetching deals:', err)
      throw err
    }
  }

  // Calculate CRM metrics
  const calculateMetrics = (customers: Customer[], deals: Deal[]): CrmMetrics => {
    const totalCustomers = customers.length
    const closedDeals = deals.filter(deal => deal.stage === 'closed')
    const totalRevenue = closedDeals.reduce((sum, deal) => sum + deal.value, 0)
    const activeDeals = deals.filter(deal => deal.stage !== 'closed' && deal.stage !== 'lost').length

    // Calculate conversion rate
    const conversionRate = deals.length > 0 ?
      (closedDeals.length / deals.length) * 100 : 0

    // Calculate average deal size
    const averageDealSize = deals.length > 0 ?
      deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length : 0

    return {
      totalCustomers,
      totalRevenue,
      activeDeals,
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageDealSize: Math.round(averageDealSize),
      salesCycleLength: 30, // Mock - average days
      topPerformers: {
        customer: customers.length > 0 ? customers[0] : null,
        deal: deals.length > 0 ? deals[0] : null
      },
      monthlyGrowth: {
        customers: 12, // Mock growth percentage
        revenue: 25    // Mock growth percentage
      }
    }
  }

  // Load all CRM data
  const loadCrmData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [customersData, dealsData] = await Promise.all([
        fetchCustomers(),
        fetchDeals()
      ])

      setCustomers(customersData)
      setDeals(dealsData)
      setMetrics(calculateMetrics(customersData, dealsData))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load CRM data')
      console.error('Error loading CRM data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Refresh specific data types
  const refreshCustomers = () => fetchCustomers().then(setCustomers)
  const refreshDeals = () => fetchDeals().then(setDeals)

  // Initial data load
  useEffect(() => {
    loadCrmData()
  }, [])

  return {
    customers,
    deals,
    metrics,
    loading,
    error,
    refreshCustomers,
    refreshDeals,
    refreshAll: loadCrmData
  }
}