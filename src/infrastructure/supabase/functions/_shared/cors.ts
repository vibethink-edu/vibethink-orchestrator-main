/**
 * Shared CORS Headers for Supabase Edge Functions
 * 
 * Provides consistent CORS configuration across all Edge Functions
 * 
 * @author AI Pair Platform - Backend Team
 * @version 1.0.0
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 
    'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours
}

/**
 * Creates a CORS response for preflight requests
 */
export function createCORSResponse(): Response {
  return new Response('ok', { 
    headers: corsHeaders,
    status: 200 
  })
}

/**
 * Adds CORS headers to an existing response
 */
export function addCORSHeaders(response: Response): Response {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
} 