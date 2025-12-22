/**
 * useHospitalFilters Hook
 * VibeThink Orchestrator - Architecture Upgrade Phase 4
 * 
 * Filtering logic for Hospital Management Dashboard
 * Separates filter state and logic from components
 * 
 * VThink 1.0 Pattern: Separation of Concerns
 * - Data fetching (useHospitalData)
 * - Filtering (this hook)
 * - Operations (useHospitalOperations - futuro)
 */

'use client'

import { useState, useMemo } from 'react'
import type {
  Patient,
  Appointment,
  Procedure,
  HospitalFilters
} from '../types'

/**
 * Return type for useHospitalFilters
 */
export interface UseHospitalFiltersReturn {
  // Filter state
  filters: HospitalFilters
  
  // Filter actions
  setDateRange: (from: Date, to: Date) => void
  setDepartment: (department: string | undefined) => void
  setStatus: (status: string | undefined) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
  
  // Filtered data helpers
  filterPatients: (patients: Patient[]) => Patient[]
  filterAppointments: (appointments: Appointment[]) => Appointment[]
  filterProcedures: (procedures: Procedure[]) => Procedure[]
  
  // Stats
  activeFiltersCount: number
}

/**
 * Default filters
 */
const DEFAULT_FILTERS: HospitalFilters = {
  date_range: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date()
  },
  department: undefined,
  status: undefined,
  search_query: undefined
}

/**
 * useHospitalFilters Hook
 * 
 * Manages filter state and provides filtered data
 * 
 * Usage:
 * ```tsx
 * const { filters, filterPatients, setDepartment } = useHospitalFilters()
 * const { patients } = useHospitalData()
 * 
 * const filteredPatients = filterPatients(patients)
 * 
 * <Select onValueChange={setDepartment}>
 *   <SelectItem value="Cardiology">Cardiology</SelectItem>
 * </Select>
 * ```
 */
export function useHospitalFilters(): UseHospitalFiltersReturn {
  const [filters, setFilters] = useState<HospitalFilters>(DEFAULT_FILTERS)
  
  // Update filter functions
  const setDateRange = (from: Date, to: Date) => {
    setFilters(prev => ({
      ...prev,
      date_range: { from, to }
    }))
  }
  
  const setDepartment = (department: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      department
    }))
  }
  
  const setStatus = (status: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      status
    }))
  }
  
  const setSearchQuery = (query: string) => {
    setFilters(prev => ({
      ...prev,
      search_query: query || undefined
    }))
  }
  
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }
  
  // Filter functions
  const filterPatients = (patients: Patient[]): Patient[] => {
    let filtered = [...patients]
    
    // Filter by department
    if (filters.department) {
      filtered = filtered.filter(p => p.department === filters.department)
    }
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status)
    }
    
    // Filter by search query (name, email, medical record number)
    if (filters.search_query) {
      const query = filters.search_query.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.medical_record_number.toLowerCase().includes(query)
      )
    }
    
    // Filter by date range (last visit date)
    filtered = filtered.filter(p => {
      const lastVisit = new Date(p.last_visit_date)
      return lastVisit >= filters.date_range.from && lastVisit <= filters.date_range.to
    })
    
    return filtered
  }
  
  const filterAppointments = (appointments: Appointment[]): Appointment[] => {
    let filtered = [...appointments]
    
    // Filter by department
    if (filters.department) {
      filtered = filtered.filter(a => a.department === filters.department)
    }
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(a => a.status === filters.status)
    }
    
    // Filter by search query (patient name, doctor name)
    if (filters.search_query) {
      const query = filters.search_query.toLowerCase()
      filtered = filtered.filter(a =>
        a.patient_name.toLowerCase().includes(query) ||
        a.doctor_name.toLowerCase().includes(query)
      )
    }
    
    // Filter by date range
    filtered = filtered.filter(a => {
      const appointmentDate = new Date(a.date)
      return appointmentDate >= filters.date_range.from && appointmentDate <= filters.date_range.to
    })
    
    return filtered
  }
  
  const filterProcedures = (procedures: Procedure[]): Procedure[] => {
    let filtered = [...procedures]
    
    // Filter by department
    if (filters.department) {
      filtered = filtered.filter(p => p.department === filters.department)
    }
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status)
    }
    
    // Filter by search query (patient name, procedure name)
    if (filters.search_query) {
      const query = filters.search_query.toLowerCase()
      filtered = filtered.filter(p =>
        p.patient_name.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query)
      )
    }
    
    // Filter by date range
    filtered = filtered.filter(p => {
      const procedureDate = new Date(p.performed_at)
      return procedureDate >= filters.date_range.from && procedureDate <= filters.date_range.to
    })
    
    return filtered
  }
  
  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.department) count++
    if (filters.status) count++
    if (filters.search_query) count++
    // Note: date_range is always active, so we don't count it
    return count
  }, [filters])
  
  return {
    // Filter state
    filters,
    
    // Filter actions
    setDateRange,
    setDepartment,
    setStatus,
    setSearchQuery,
    resetFilters,
    
    // Filtered data helpers
    filterPatients,
    filterAppointments,
    filterProcedures,
    
    // Stats
    activeFiltersCount
  }
}





