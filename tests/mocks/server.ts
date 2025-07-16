/**
 * Mock Service Worker Server Configuration
 * 
 * Centralized mock server for all external API calls including:
 * - Supabase API endpoints
 * - OpenAI API endpoints
 * - Google Workspace API endpoints
 * - Custom edge functions
 * 
 * @author AI Pair Platform - Testing Team
 * @version 1.0.0
 */

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock data factories
const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  role: 'ADMIN',
  company_id: 'test-company-id',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

const createMockCompany = (overrides = {}) => ({
  id: 'test-company-id',
  name: 'Test Company',
  slug: 'test-company',
  status: 'ACTIVE',
  subscription_plan: 'PROFESSIONAL',
  max_users: 25,
  max_monthly_ai_requests: 10000,
  max_monthly_scraping_pages: 1000,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

const createMockConfiguration = (overrides = {}) => ({
  id: 'test-config-id',
  category: 'ai_models',
  config_key: 'openai_models',
  config_value: { models: ['gpt-4', 'gpt-3.5-turbo'] },
  description: 'Test configuration',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Supabase API Mocks
const supabaseHandlers = [
  // Auth endpoints
  http.post('https://test.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: createMockUser(),
    });
  }),

  http.get('https://test.supabase.co/auth/v1/user', () => {
    return HttpResponse.json(createMockUser());
  }),

  // Companies endpoints
  http.get('https://test.supabase.co/rest/v1/companies', () => {
    return HttpResponse.json([
      createMockCompany(),
      createMockCompany({ id: 'test-company-2', name: 'Test Company 2' }),
    ]);
  }),

  http.get('https://test.supabase.co/rest/v1/companies/:id', ({ params }) => {
    return HttpResponse.json(createMockCompany({ id: params.id }));
  }),

  http.post('https://test.supabase.co/rest/v1/companies', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(createMockCompany(body));
  }),

  http.patch('https://test.supabase.co/rest/v1/companies/:id', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(createMockCompany(body));
  }),

  // User profiles endpoints
  http.get('https://test.supabase.co/rest/v1/user_profiles', () => {
    return HttpResponse.json([
      createMockUser(),
      createMockUser({ id: 'test-user-2', email: 'test2@example.com' }),
    ]);
  }),

  http.get('https://test.supabase.co/rest/v1/user_profiles/:id', ({ params }) => {
    return HttpResponse.json(createMockUser({ id: params.id }));
  }),

  // Platform configurations endpoints
  http.get('https://test.supabase.co/rest/v1/platform_configurations', () => {
    return HttpResponse.json([
      createMockConfiguration(),
      createMockConfiguration({ 
        id: 'test-config-2', 
        category: 'integrations',
        config_key: 'google_workspace'
      }),
    ]);
  }),

  http.post('https://test.supabase.co/rest/v1/platform_configurations', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(createMockConfiguration(body));
  }),

  // Usage tracking endpoints
  http.get('https://test.supabase.co/rest/v1/usage_tracking', () => {
    return HttpResponse.json([
      {
        id: 'test-usage-1',
        company_id: 'test-company-id',
        user_id: 'test-user-id',
        service_name: 'openai',
        usage_type: 'ai_generation',
        amount: 100,
        cost_usd: 0.02,
        created_at: '2024-01-01T00:00:00Z',
      },
    ]);
  }),

  // RPC endpoints
  http.post('https://test.supabase.co/rest/v1/rpc/get_company_limits', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      max_users: 25,
      max_monthly_ai_requests: 10000,
      max_monthly_scraping_pages: 1000,
      max_storage_gb: 10,
      features: ['ai_generation', 'document_processing'],
    });
  }),

  http.post('https://test.supabase.co/rest/v1/rpc/track_usage', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'test-usage-id',
      ...body,
      created_at: new Date().toISOString(),
    });
  }),
];

// OpenAI API Mocks
const openaiHandlers = [
  http.post('https://api.openai.com/v1/chat/completions', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      id: 'test-completion-id',
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: body.model || 'gpt-4',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'This is a test response from the mocked OpenAI API.',
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30,
      },
    });
  }),

  http.post('https://api.openai.com/v1/embeddings', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      object: 'list',
      data: [
        {
          object: 'embedding',
          embedding: Array(1536).fill(0.1), // Mock embedding vector
          index: 0,
        },
      ],
      model: body.model || 'text-embedding-ada-002',
      usage: {
        prompt_tokens: 10,
        total_tokens: 10,
      },
    });
  }),
];

// Google Workspace API Mocks
const googleWorkspaceHandlers = [
  http.get('https://www.googleapis.com/oauth2/v2/userinfo', () => {
    return HttpResponse.json({
      id: 'test-google-user-id',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg',
    });
  }),

  http.post('https://www.googleapis.com/oauth2/v4/token', () => {
    return HttpResponse.json({
      access_token: 'test-google-access-token',
      refresh_token: 'test-google-refresh-token',
      expires_in: 3600,
      token_type: 'Bearer',
    });
  }),

  http.post('https://docs.googleapis.com/v1/documents', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      documentId: 'test-document-id',
      title: body.title || 'Test Document',
      body: {
        content: [
          {
            paragraph: {
              elements: [
                {
                  textRun: {
                    content: 'Test content',
                  },
                },
              ],
            },
          },
        ],
      },
    });
  }),

  http.post('https://drive.googleapis.com/drive/v3/files', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      id: 'test-file-id',
      name: body.name || 'Test File',
      mimeType: body.mimeType || 'application/vnd.google-apps.document',
      webViewLink: 'https://docs.google.com/document/d/test-file-id/edit',
    });
  }),
];

// Custom Edge Functions Mocks
const edgeFunctionHandlers = [
  http.post('https://test.supabase.co/functions/v1/meeting-processor', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      success: true,
      transcription: 'This is a test transcription from the meeting processor.',
      summary: 'Test meeting summary',
      action_items: ['Action item 1', 'Action item 2'],
      metadata: {
        duration: 300,
        participants: 5,
        language: 'en',
      },
    });
  }),

  http.post('https://test.supabase.co/functions/v1/resource-scraper', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      success: true,
      content: 'This is scraped content from the test URL.',
      metadata: {
        title: 'Test Page Title',
        description: 'Test page description',
        url: body.url,
        scraped_at: new Date().toISOString(),
      },
    });
  }),
];

// Combine all handlers
export const handlers = [
  ...supabaseHandlers,
  ...openaiHandlers,
  ...googleWorkspaceHandlers,
  ...edgeFunctionHandlers,
];

// Create and export the server
export const server = setupServer(...handlers);

// Export mock data factories for use in tests
export { createMockUser, createMockCompany, createMockConfiguration }; 