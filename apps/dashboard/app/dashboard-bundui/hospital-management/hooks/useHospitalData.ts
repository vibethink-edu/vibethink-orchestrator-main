/**
 * useHospitalData Hook
 * VibeThink Orchestrator - Architecture Upgrade Phase 4
 * 
 * Data fetching hook for Hospital Management Dashboard
 * Implements multi-tenant security with company_id filtering
 * 
 * VThink 1.0 Pattern: Separation of Concerns
 * - Data fetching (this hook)
 * - Filtering (useHospitalFilters)
 * - Operations (useHospitalOperations - futuro)
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import type {
  Patient,
  Appointment,
  Procedure,
  Department,
  HospitalStats,
  Note,
  Report
} from '../types'

/**
 * Return type for useHospitalData
 */
export interface UseHospitalDataReturn {
  // Data
  patients: Patient[]
  appointments: Appointment[]
  procedures: Procedure[]
  departments: Department[]
  stats: HospitalStats | null
  notes: Note[]
  reports: Report[]
  
  // Loading states
  isLoading: boolean
  isError: boolean
  error: Error | null
  
  // Meta
  company_id: string | null
  lastUpdated: Date | null
  
  // Actions
  refresh: () => Promise<void>
}

/**
 * useHospitalData Hook
 * 
 * Fetches all hospital data with multi-tenant filtering
 * 
 * Usage:
 * ```tsx
 * const { patients, appointments, stats, isLoading } = useHospitalData()
 * 
 * if (isLoading) return <Loading />
 * return <Dashboard data={{ patients, appointments, stats }} />
 * ```
 */
export function useHospitalData(): UseHospitalDataReturn {
  const { company_id } = useAuth()
  
  // State
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [stats, setStats] = useState<HospitalStats | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [reports, setReports] = useState<Report[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  
  // Fetch data
  const fetchData = async () => {
    if (!company_id) {
      console.warn('useHospitalData: company_id not available')
      return
    }
    
    setIsLoading(true)
    setIsError(false)
    setError(null)
    
    try {
      // ⭐ CRITICAL: All API calls include company_id
      
      // TODO: Replace with actual API calls
      // const [patientsRes, appointmentsRes, statsRes] = await Promise.all([
      //   fetch(`/api/hospital/patients?company_id=${company_id}`),
      //   fetch(`/api/hospital/appointments?company_id=${company_id}`),
      //   fetch(`/api/hospital/stats?company_id=${company_id}`)
      // ])
      
      // Mock data for development
      const mockPatients: Patient[] = Array.from({ length: 50 }, (_, i) => ({
        id: `patient_${i + 1}`,
        company_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: `Patient ${i + 1}`,
        age: 20 + Math.floor(Math.random() * 60),
        gender: ['male', 'female', 'other'][Math.floor(Math.random() * 3)] as any,
        phone: `+1-555-${String(i).padStart(4, '0')}`,
        email: `patient${i + 1}@example.com`,
        address: `123 Main St #${i + 1}`,
        medical_record_number: `MRN-${String(i + 1).padStart(6, '0')}`,
        last_visit_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        next_appointment_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        department: ['Cardiology', 'Neurology', 'Pediatrics', 'Emergency'][Math.floor(Math.random() * 4)],
        status: ['active', 'inactive', 'critical'][Math.floor(Math.random() * 3)] as any
      }))
      
      const mockAppointments: Appointment[] = Array.from({ length: 30 }, (_, i) => ({
        id: `appointment_${i + 1}`,
        company_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        patient_id: `patient_${Math.floor(Math.random() * 50) + 1}`,
        patient_name: `Patient ${Math.floor(Math.random() * 50) + 1}`,
        doctor_id: `doctor_${Math.floor(Math.random() * 10) + 1}`,
        doctor_name: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 4)]}`,
        department: ['Cardiology', 'Neurology', 'Pediatrics', 'Emergency'][Math.floor(Math.random() * 4)],
        date: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        time: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:00`,
        duration_minutes: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
        type: ['consultation', 'follow-up', 'emergency', 'surgery'][Math.floor(Math.random() * 4)] as any,
        status: ['scheduled', 'completed', 'cancelled'][Math.floor(Math.random() * 3)] as any,
        notes: i % 3 === 0 ? `Note for appointment ${i + 1}` : undefined
      }))
      
      const mockStats: HospitalStats = {
        company_id,
        total_patients: mockPatients.length,
        total_appointments: mockAppointments.length,
        total_procedures: 120,
        active_patients: mockPatients.filter(p => p.status === 'active').length,
        upcoming_appointments: mockAppointments.filter(a => a.status === 'scheduled').length,
        patients_by_department: {
          'Cardiology': mockPatients.filter(p => p.department === 'Cardiology').length,
          'Neurology': mockPatients.filter(p => p.department === 'Neurology').length,
          'Pediatrics': mockPatients.filter(p => p.department === 'Pediatrics').length,
          'Emergency': mockPatients.filter(p => p.department === 'Emergency').length
        },
        patients_by_gender: {
          male: mockPatients.filter(p => p.gender === 'male').length,
          female: mockPatients.filter(p => p.gender === 'female').length,
          other: mockPatients.filter(p => p.gender === 'other').length
        },
        revenue_this_month: 125000,
        appointments_this_week: 45
      }
      
      // Set data
      setPatients(mockPatients)
      setAppointments(mockAppointments)
      setStats(mockStats)
      setLastUpdated(new Date())
      
      console.log('✅ Hospital data loaded:', {
        company_id,
        patients: mockPatients.length,
        appointments: mockAppointments.length
      })
    } catch (err) {
      console.error('❌ Failed to load hospital data:', err)
      setIsError(true)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }
  
  // Load on mount and when company_id changes
  useEffect(() => {
    fetchData()
  }, [company_id])
  
  return {
    // Data
    patients,
    appointments,
    procedures,
    departments,
    stats,
    notes,
    reports,
    
    // Loading states
    isLoading,
    isError,
    error,
    
    // Meta
    company_id,
    lastUpdated,
    
    // Actions
    refresh: fetchData
  }
}


