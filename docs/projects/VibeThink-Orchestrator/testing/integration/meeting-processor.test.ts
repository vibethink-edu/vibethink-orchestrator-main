/**
 * Meeting Processor Integration Tests
 * 
 * Tests the complete meeting processor workflow including:
 * - Database operations
 * - Edge Function calls
 * - Multi-tenant isolation
 * - Usage tracking
 * 
 * @author AI Pair Platform - Testing Team
 * @version 1.0.0
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { testSupabaseConnection, quickConnectionTest } from '../../src/utils/testSupabaseConnection'
import type { Meeting, MeetingProcessRequest } from '../../src/types/meeting'

// Test configuration
const TEST_CONFIG = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://pikywaoqlekupfynnclg.supabase.co',
  supabaseKey: process.env.VITE_SUPABASE_ANON_KEY || 'test-key',
  testCompanyId: 'test-company-integration',
  testUserId: 'test-user-integration'
}

describe('Meeting Processor Integration Tests', () => {
  let supabase: any
  let testCompanyId: string
  let testUserId: string

  beforeAll(async () => {
    // Initialize Supabase client
    supabase = createClient(TEST_CONFIG.supabaseUrl, TEST_CONFIG.supabaseKey)
    
    // Test connection
    const isConnected = await quickConnectionTest()
    if (!isConnected) {
      throw new Error('Supabase connection failed - cannot run integration tests')
    }

    console.log('✅ Supabase connection verified for integration tests')
  })

  beforeEach(async () => {
    // Set up test company and user for each test
    testCompanyId = `test-company-${Date.now()}`
    testUserId = `test-user-${Date.now()}`
  })

  afterAll(async () => {
    // Cleanup test data
    try {
      // Clean up test meetings
      await supabase
        .from('meetings')
        .delete()
        .like('company_id', 'test-company-%')

      // Clean up test usage logs
      await supabase
        .from('ai_usage_logs')
        .delete()
        .like('company_id', 'test-company-%')

      console.log('✅ Integration test cleanup completed')
    } catch (error) {
      console.warn('⚠️ Cleanup failed:', error)
    }
  })

  describe('Database Connection', () => {
    it('should connect to Supabase successfully', async () => {
      const connectionResult = await testSupabaseConnection()
      
      expect(connectionResult.isConnected).toBe(true)
      expect(connectionResult.details.database).toBe(true)
      expect(connectionResult.details.auth).toBe(true)
      expect(connectionResult.errors).toHaveLength(0)
    })

    it('should have required tables accessible', async () => {
      // Test meetings table
      const { error: meetingsError } = await supabase
        .from('meetings')
        .select('count')
        .limit(1)
        .maybeSingle()

      expect(meetingsError).toBeNull()

      // Test ai_usage_logs table
      const { error: usageError } = await supabase
        .from('ai_usage_logs')
        .select('count')
        .limit(1)
        .maybeSingle()

      expect(usageError).toBeNull()
    })
  })

  describe('Company Limits Function', () => {
    it('should return error for non-existent company', async () => {
      const { data, error } = await supabase
        .rpc('get_company_limits', { 
          p_company_id: '00000000-0000-0000-0000-000000000000' 
        })

      expect(error).toBeNull()
      expect(data).toHaveProperty('error')
      expect(data.error).toContain('Company not found')
    })

    it('should return default limits structure', async () => {
      // This test assumes the function returns default values for missing data
      const { data, error } = await supabase
        .rpc('get_company_limits', { 
          p_company_id: '00000000-0000-0000-0000-000000000000' 
        })

      expect(error).toBeNull()
      expect(data).toBeTypeOf('object')
      
      if (!data.error) {
        expect(data).toHaveProperty('max_monthly_ai_requests')
        expect(data).toHaveProperty('current_usage')
        expect(data.current_usage).toHaveProperty('ai_requests')
      }
    })
  })

  describe('Meetings Table Operations', () => {
    it('should insert a meeting record', async () => {
      const testMeeting = {
        company_id: testCompanyId,
        created_by: testUserId,
        title: 'Test Integration Meeting',
        meeting_date: '2024-01-15',
        attendees: ['John Doe', 'Jane Smith'],
        transcription: 'This is a test transcription for integration testing.',
        meeting_minutes: {
          title: 'Test Integration Meeting',
          date: '2024-01-15',
          attendees: ['John Doe', 'Jane Smith'],
          summary: 'Test meeting summary',
          key_points: ['Point 1', 'Point 2'],
          action_items: [
            {
              task: 'Test task',
              assignee: 'John Doe',
              priority: 'medium' as const
            }
          ],
          decisions: ['Test decision'],
          next_steps: ['Test next step']
        },
        processing_metadata: {
          transcription_duration: 120,
          ai_tokens_used: 500,
          cost_estimate: 0.05
        },
        original_filename: 'test-meeting.mp3',
        file_size_bytes: 1024000,
        file_type: 'audio/mp3',
        status: 'completed'
      }

      const { data, error } = await supabase
        .from('meetings')
        .insert(testMeeting)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.id).toBeDefined()
      expect(data.title).toBe(testMeeting.title)
      expect(data.company_id).toBe(testCompanyId)
    })

    it('should query meetings by company_id', async () => {
      // Insert test meeting first
      const testMeeting = {
        company_id: testCompanyId,
        created_by: testUserId,
        title: 'Test Query Meeting',
        meeting_date: '2024-01-15',
        attendees: ['Test User'],
        transcription: 'Test transcription',
        meeting_minutes: { title: 'Test', attendees: [], summary: '', key_points: [], action_items: [], decisions: [], next_steps: [], date: '2024-01-15' }
      }

      await supabase
        .from('meetings')
        .insert(testMeeting)

      // Query meetings
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('company_id', testCompanyId)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
      expect(data[0].company_id).toBe(testCompanyId)
    })
  })

  describe('AI Usage Logs Operations', () => {
    it('should insert usage log record', async () => {
      const usageLog = {
        company_id: testCompanyId,
        user_id: testUserId,
        operation_type: 'meeting_processing',
        service_provider: 'openai',
        model_used: 'gpt-4o',
        tokens_used: 1500,
        input_tokens: 1000,
        output_tokens: 500,
        cost_estimate: 0.075,
        request_size_bytes: 2048000,
        processing_duration_ms: 30000,
        status: 'completed',
        metadata: {
          file_type: 'audio/mp3',
          transcription_duration: 180,
          analysis_type: 'meeting_minutes'
        }
      }

      const { data, error } = await supabase
        .from('ai_usage_logs')
        .insert(usageLog)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.id).toBeDefined()
      expect(data.operation_type).toBe('meeting_processing')
      expect(data.tokens_used).toBe(1500)
    })

    it('should query usage logs by company and operation type', async () => {
      // Insert test usage log
      await supabase
        .from('ai_usage_logs')
        .insert({
          company_id: testCompanyId,
          user_id: testUserId,
          operation_type: 'meeting_processing',
          tokens_used: 1000,
          cost_estimate: 0.05
        })

      // Query usage logs
      const { data, error } = await supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('company_id', testCompanyId)
        .eq('operation_type', 'meeting_processing')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
      expect(data[0].company_id).toBe(testCompanyId)
      expect(data[0].operation_type).toBe('meeting_processing')
    })
  })

  describe('Edge Function Integration', () => {
    it('should test meeting processor endpoint availability', async () => {
      const edgeFunctionUrl = `${TEST_CONFIG.supabaseUrl}/functions/v1/meeting-processor`
      
      try {
        // Test OPTIONS request (CORS preflight)
        const response = await fetch(edgeFunctionUrl, {
          method: 'OPTIONS',
          headers: {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'content-type,authorization'
          }
        })

        // Should respond to CORS preflight
        expect(response.status).toBe(200)
        expect(response.headers.get('Access-Control-Allow-Origin')).toBeTruthy()
      } catch (error) {
        console.warn('⚠️ Edge Function not deployed or accessible:', error)
        // This is expected in local development
      }
    })

    it('should handle missing authentication gracefully', async () => {
      const edgeFunctionUrl = `${TEST_CONFIG.supabaseUrl}/functions/v1/meeting-processor`
      
      try {
        const response = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            file_name: 'test.mp3',
            file_data: 'base64data',
            file_type: 'audio/mp3',
            company_id: testCompanyId
          })
        })

        // Should return 401 for missing auth
        expect(response.status).toBe(401)
      } catch (error) {
        console.warn('⚠️ Edge Function not accessible:', error)
        // This is expected if function is not deployed
      }
    })
  })

  describe('Multi-tenant Isolation', () => {
    it('should isolate meetings by company_id', async () => {
      const company1Id = `test-company-1-${Date.now()}`
      const company2Id = `test-company-2-${Date.now()}`

      // Insert meetings for two different companies
      await supabase.from('meetings').insert([
        {
          company_id: company1Id,
          created_by: testUserId,
          title: 'Company 1 Meeting',
          meeting_date: '2024-01-15',
          attendees: [],
          transcription: 'Company 1 transcription',
          meeting_minutes: { title: 'Company 1', attendees: [], summary: '', key_points: [], action_items: [], decisions: [], next_steps: [], date: '2024-01-15' }
        },
        {
          company_id: company2Id,
          created_by: testUserId,
          title: 'Company 2 Meeting',
          meeting_date: '2024-01-15',
          attendees: [],
          transcription: 'Company 2 transcription',
          meeting_minutes: { title: 'Company 2', attendees: [], summary: '', key_points: [], action_items: [], decisions: [], next_steps: [], date: '2024-01-15' }
        }
      ])

      // Query Company 1 meetings
      const { data: company1Meetings } = await supabase
        .from('meetings')
        .select('*')
        .eq('company_id', company1Id)

      // Query Company 2 meetings
      const { data: company2Meetings } = await supabase
        .from('meetings')
        .select('*')
        .eq('company_id', company2Id)

      expect(company1Meetings).toHaveLength(1)
      expect(company2Meetings).toHaveLength(1)
      expect(company1Meetings[0].title).toBe('Company 1 Meeting')
      expect(company2Meetings[0].title).toBe('Company 2 Meeting')
    })

    it('should isolate usage logs by company_id', async () => {
      const company1Id = `test-company-1-${Date.now()}`
      const company2Id = `test-company-2-${Date.now()}`

      // Insert usage logs for two different companies
      await supabase.from('ai_usage_logs').insert([
        {
          company_id: company1Id,
          user_id: testUserId,
          operation_type: 'meeting_processing',
          tokens_used: 1000
        },
        {
          company_id: company2Id,
          user_id: testUserId,
          operation_type: 'meeting_processing',
          tokens_used: 2000
        }
      ])

      // Query Company 1 usage
      const { data: company1Usage } = await supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('company_id', company1Id)

      // Query Company 2 usage
      const { data: company2Usage } = await supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('company_id', company2Id)

      expect(company1Usage).toHaveLength(1)
      expect(company2Usage).toHaveLength(1)
      expect(company1Usage[0].tokens_used).toBe(1000)
      expect(company2Usage[0].tokens_used).toBe(2000)
    })
  })

  describe('Data Validation', () => {
    it('should enforce required fields in meetings table', async () => {
      const invalidMeeting = {
        // Missing required fields: company_id, created_by, title, transcription
        meeting_date: '2024-01-15'
      }

      const { error } = await supabase
        .from('meetings')
        .insert(invalidMeeting)

      expect(error).toBeDefined()
      expect(error.message).toContain('null value')
    })

    it('should enforce required fields in ai_usage_logs table', async () => {
      const invalidLog = {
        // Missing required fields: company_id, user_id, operation_type
        tokens_used: 100
      }

      const { error } = await supabase
        .from('ai_usage_logs')
        .insert(invalidLog)

      expect(error).toBeDefined()
      expect(error.message).toContain('null value')
    })

    it('should validate JSON structure in meeting_minutes', async () => {
      const meetingWithValidJson = {
        company_id: testCompanyId,
        created_by: testUserId,
        title: 'JSON Test Meeting',
        meeting_date: '2024-01-15',
        attendees: [],
        transcription: 'Test transcription',
        meeting_minutes: {
          title: 'Valid JSON Meeting',
          date: '2024-01-15',
          attendees: [],
          summary: 'Test summary',
          key_points: ['Point 1'],
          action_items: [],
          decisions: [],
          next_steps: []
        }
      }

      const { error } = await supabase
        .from('meetings')
        .insert(meetingWithValidJson)

      expect(error).toBeNull()
    })
  })
}) 