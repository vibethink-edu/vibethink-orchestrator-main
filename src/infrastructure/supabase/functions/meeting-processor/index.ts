import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface MeetingProcessRequest {
  file_name: string
  file_data: string // base64 encoded audio file
  file_type: string // audio/wav, audio/mp3, etc.
  meeting_title?: string
  meeting_date?: string
  attendees?: string[]
  company_id: string
}

interface MeetingProcessResponse {
  success: boolean
  data?: {
    transcription: string
    meeting_minutes: {
      title: string
      date: string
      attendees: string[]
      summary: string
      key_points: string[]
      action_items: Array<{
        task: string
        assignee?: string
        due_date?: string
        priority: 'high' | 'medium' | 'low'
      }>
      decisions: string[]
      next_steps: string[]
    }
    usage: {
      transcription_duration: number
      ai_tokens_used: number
      cost_estimate: number
    }
  }
  error?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const requestData: MeetingProcessRequest = await req.json()
    
    // Validate required fields
    if (!requestData.file_data || !requestData.file_type || !requestData.company_id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: file_data, file_type, company_id' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify user belongs to the company
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user profile and verify company access
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, company_id, role')
      .eq('id', user.id)
      .eq('company_id', requestData.company_id)
      .single()

    if (profileError || !userProfile) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'User does not have access to this company' 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check company limits and current usage
    const { data: companyLimits, error: limitsError } = await supabase
      .rpc('get_company_limits', { company_id: requestData.company_id })

    if (limitsError) {
      console.error('Error fetching company limits:', limitsError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to check company limits' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check AI request limits
    if (companyLimits.current_usage.ai_requests >= companyLimits.max_monthly_ai_requests) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Monthly AI request limit exceeded. Please upgrade your plan.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Convert base64 to blob for OpenAI
    const audioData = Uint8Array.from(atob(requestData.file_data), c => c.charCodeAt(0))
    const audioBlob = new Blob([audioData], { type: requestData.file_type })

    // Step 1: Transcribe audio with OpenAI Whisper
    console.log('Starting transcription with Whisper...')
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!
    
    const transcriptionFormData = new FormData()
    transcriptionFormData.append('file', audioBlob, requestData.file_name)
    transcriptionFormData.append('model', 'whisper-1')
    transcriptionFormData.append('language', 'es') // Support Spanish and English
    transcriptionFormData.append('response_format', 'verbose_json')

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: transcriptionFormData,
    })

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.text()
      console.error('Whisper transcription failed:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Transcription failed. Please try again.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const transcriptionResult = await transcriptionResponse.json()
    const transcription = transcriptionResult.text
    const transcriptionDuration = transcriptionResult.duration || 0

    console.log('Transcription completed. Starting analysis with GPT-4o...')

    // Step 2: Analyze transcription with GPT-4o for structured minutes
    const analysisPrompt = `
Analiza la siguiente transcripción de una reunión y genera minutos estructurados en español.

TRANSCRIPCIÓN:
${transcription}

INFORMACIÓN ADICIONAL:
- Título: ${requestData.meeting_title || 'Reunión sin título'}
- Fecha: ${requestData.meeting_date || new Date().toISOString().split('T')[0]}
- Asistentes: ${requestData.attendees?.join(', ') || 'No especificados'}

Por favor, genera un JSON con la siguiente estructura:
{
  "title": "Título descriptivo de la reunión",
  "date": "Fecha de la reunión (YYYY-MM-DD)",
  "attendees": ["Lista", "de", "asistentes"],
  "summary": "Resumen ejecutivo en 2-3 oraciones",
  "key_points": [
    "Punto clave 1",
    "Punto clave 2",
    "..."
  ],
  "action_items": [
    {
      "task": "Descripción de la tarea",
      "assignee": "Persona responsable (opcional)",
      "due_date": "Fecha límite (opcional, YYYY-MM-DD)",
      "priority": "high|medium|low"
    }
  ],
  "decisions": [
    "Decisión tomada 1",
    "Decisión tomada 2"
  ],
  "next_steps": [
    "Próximo paso 1",
    "Próximo paso 2"
  ]
}

IMPORTANTE: 
- Responde SOLO con el JSON válido, sin texto adicional
- Extrae información específica de la transcripción
- Si no hay información para una sección, usa arrays vacíos []
- Usa español para todo el contenido
`

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente experto en análisis de reuniones y generación de minutos estructurados. Siempre respondes con JSON válido.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!analysisResponse.ok) {
      const error = await analysisResponse.text()
      console.error('GPT-4o analysis failed:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Analysis failed. Please try again.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const analysisResult = await analysisResponse.json()
    const analysisContent = analysisResult.choices[0].message.content

    // Parse the JSON response from GPT-4o
    let meetingMinutes
    try {
      meetingMinutes = JSON.parse(analysisContent)
    } catch (parseError) {
      console.error('Failed to parse GPT-4o response:', parseError)
      console.error('Raw response:', analysisContent)
      
      // Fallback: create basic structure from transcription
      meetingMinutes = {
        title: requestData.meeting_title || 'Reunión Procesada',
        date: requestData.meeting_date || new Date().toISOString().split('T')[0],
        attendees: requestData.attendees || [],
        summary: 'Resumen no disponible debido a error de procesamiento.',
        key_points: [],
        action_items: [],
        decisions: [],
        next_steps: []
      }
    }

    // Calculate usage metrics
    const aiTokensUsed = (transcriptionResult.segments?.length || 0) + (analysisResult.usage?.total_tokens || 0)
    const costEstimate = (transcriptionDuration * 0.006) + (aiTokensUsed * 0.00002) // Rough OpenAI pricing

    // Track usage in database
    const { error: usageError } = await supabase
      .from('ai_usage_logs')
      .insert({
        company_id: requestData.company_id,
        user_id: user.id,
        operation_type: 'meeting_processing',
        tokens_used: aiTokensUsed,
        cost_estimate: costEstimate,
        metadata: {
          transcription_duration: transcriptionDuration,
          file_type: requestData.file_type,
          file_size: requestData.file_data.length
        }
      })

    if (usageError) {
      console.error('Failed to log usage:', usageError)
      // Don't fail the request, just log the error
    }

    // Store meeting data in database
    const { data: meetingRecord, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        company_id: requestData.company_id,
        created_by: user.id,
        title: meetingMinutes.title,
        meeting_date: meetingMinutes.date,
        attendees: meetingMinutes.attendees,
        transcription: transcription,
        meeting_minutes: meetingMinutes,
        processing_metadata: {
          transcription_duration: transcriptionDuration,
          ai_tokens_used: aiTokensUsed,
          cost_estimate: costEstimate
        }
      })
      .select()
      .single()

    if (meetingError) {
      console.error('Failed to store meeting:', meetingError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to store meeting data' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prepare response
    const response: MeetingProcessResponse = {
      success: true,
      data: {
        transcription,
        meeting_minutes: meetingMinutes,
        usage: {
          transcription_duration: transcriptionDuration,
          ai_tokens_used: aiTokensUsed,
          cost_estimate: costEstimate
        }
      }
    }

    console.log('Meeting processing completed successfully')

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
