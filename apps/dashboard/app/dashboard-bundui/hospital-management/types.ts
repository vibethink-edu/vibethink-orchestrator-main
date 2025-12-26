/**
 * Hospital Management Types
 * VibeThink Orchestrator - Architecture Upgrade Phase 4
 * 
 * TypeScript types for Hospital Management Dashboard
 * Multi-tenant ready with company_id
 */

/**
 * Base entity with multi-tenant support
 */
export interface BaseEntity {
  id: string
  company_id: string  // ⭐ CRITICAL: Multi-tenant security
  created_at: string
  updated_at: string
}

/**
 * Patient entity
 */
export interface Patient extends BaseEntity {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  phone: string
  email: string
  address: string
  medical_record_number: string
  last_visit_date: string
  next_appointment_date?: string
  department: string
  status: 'active' | 'inactive' | 'critical'
}

/**
 * Appointment entity
 */
export interface Appointment extends BaseEntity {
  patient_id: string
  patient_name: string
  doctor_id: string
  doctor_name: string
  department: string
  date: string
  time: string
  duration_minutes: number
  type: 'consultation' | 'follow-up' | 'emergency' | 'surgery'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
}

/**
 * Medical Procedure entity
 */
export interface Procedure extends BaseEntity {
  patient_id: string
  patient_name: string
  name: string
  description: string
  department: string
  performed_by: string
  performed_at: string
  duration_minutes: number
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  cost: number
  notes?: string
}

/**
 * Department entity
 */
export interface Department extends BaseEntity {
  name: string
  description: string
  head_doctor: string
  total_staff: number
  total_patients: number
  capacity: number
  current_occupancy: number
}

/**
 * Hospital Summary Stats
 */
export interface HospitalStats {
  company_id: string
  total_patients: number
  total_appointments: number
  total_procedures: number
  active_patients: number
  upcoming_appointments: number
  patients_by_department: Record<string, number>
  patients_by_gender: {
    male: number
    female: number
    other: number
  }
  revenue_this_month: number
  appointments_this_week: number
}

/**
 * Note entity (for notes system)
 */
export interface Note extends BaseEntity {
  title: string
  content: string
  author_id: string
  author_name: string
  category: 'general' | 'patient' | 'reminder' | 'urgent'
  related_patient_id?: string
  due_date?: string
  is_completed: boolean
}

/**
 * Report entity
 */
export interface Report extends BaseEntity {
  title: string
  type: 'financial' | 'operational' | 'patient-care' | 'staff'
  period_start: string
  period_end: string
  generated_by: string
  file_url: string
  summary: string
}

/**
 * Filters for Hospital Data
 */
export interface HospitalFilters {
  date_range: {
    from: Date
    to: Date
  }
  department?: string
  status?: string
  search_query?: string
}










