# Mocking Patterns - VibeThink Orchestrator

## Resumen

Esta guía describe los patrones de mocking utilizados en VibeThink Orchestrator para testing unitario, de integración y E2E. Los mocks son esenciales para aislar componentes y simular servicios externos.

## Arquitectura de Mocking

### Stack de Mocking

- **MSW (Mock Service Worker)**: Para interceptar requests HTTP
- **Vitest Mocks**: Para mocking de módulos y funciones
- **Playwright Route Handlers**: Para mocking en tests E2E
- **Custom Mock Factories**: Para datos de prueba consistentes

### Estrategia de Mocking

```
┌─────────────────────────────────────────────────────────┐
│                    Application                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   React     │  │   Hooks     │  │  Services   │     │
│  │ Components  │  │             │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├─────────────────────────────────────────────────────────┤
│                    MSW Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Supabase   │  │   OpenAI    │  │   Google    │     │
│  │    API      │  │    API      │  │  Workspace  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

## MSW (Mock Service Worker)

### Configuración Base

```typescript
// tests/mocks/server.ts
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

  // User profiles endpoints
  http.get('https://test.supabase.co/rest/v1/user_profiles', () => {
    return HttpResponse.json([
      createMockUser(),
      createMockUser({ id: 'test-user-2', email: 'test2@example.com' }),
    ]);
  }),

  // Platform configurations endpoints
  http.get('https://test.supabase.co/rest/v1/platform_configurations', () => {
    return HttpResponse.json([
      {
        id: 'test-config-id',
        category: 'ai_models',
        config_key: 'openai_models',
        config_value: { models: ['gpt-4', 'gpt-3.5-turbo'] },
        description: 'Test configuration',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ]);
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

// Export mock data factories
export { createMockUser, createMockCompany };
```

### Setup en Tests

```typescript
// tests/setup/vitest-setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@mocks/server';

// Setup MSW before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
```

## Patrones de Mocking por Tipo

### 1. Mocking de Autenticación

```typescript
// tests/mocks/auth-mocks.ts
import { http, HttpResponse } from 'msw';

export const authMocks = {
  // Mock successful login
  successfulLogin: http.post('https://test.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'ADMIN',
        company_id: 'test-company-id',
      },
    });
  }),

  // Mock failed login
  failedLogin: http.post('https://test.supabase.co/auth/v1/token', () => {
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Mock network error
  networkError: http.post('https://test.supabase.co/auth/v1/token', () => {
    return HttpResponse.error();
  }),

  // Mock session validation
  validSession: http.get('https://test.supabase.co/auth/v1/user', () => {
    return HttpResponse.json({
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'ADMIN',
      company_id: 'test-company-id',
    });
  }),

  // Mock expired session
  expiredSession: http.get('https://test.supabase.co/auth/v1/user', () => {
    return HttpResponse.json(
      { error: 'Session expired' },
      { status: 401 }
    );
  }),
};
```

### 2. Mocking de Datos Multi-Tenant

```typescript
// tests/mocks/multi-tenant-mocks.ts
import { http, HttpResponse } from 'msw';

export const multiTenantMocks = {
  // Mock company data with isolation
  companyData: (companyId: string) => http.get(
    `https://test.supabase.co/rest/v1/companies/${companyId}`,
    () => {
      return HttpResponse.json({
        id: companyId,
        name: `Company ${companyId}`,
        slug: `company-${companyId}`,
        status: 'ACTIVE',
        subscription_plan: 'PROFESSIONAL',
        max_users: 25,
        max_monthly_ai_requests: 10000,
      });
    }
  ),

  // Mock users filtered by company
  companyUsers: (companyId: string) => http.get(
    'https://test.supabase.co/rest/v1/user_profiles',
    ({ request }) => {
      const url = new URL(request.url);
      const filterCompanyId = url.searchParams.get('company_id');
      
      if (filterCompanyId !== companyId) {
        return HttpResponse.json([], { status: 403 });
      }
      
      return HttpResponse.json([
        {
          id: 'user-1',
          email: 'user1@company.com',
          role: 'ADMIN',
          company_id: companyId,
        },
        {
          id: 'user-2',
          email: 'user2@company.com',
          role: 'EMPLOYEE',
          company_id: companyId,
        },
      ]);
    }
  ),

  // Mock cross-company access prevention
  preventCrossCompanyAccess: http.get(
    'https://test.supabase.co/rest/v1/companies/:id',
    ({ params, request }) => {
      const url = new URL(request.url);
      const userCompanyId = url.searchParams.get('user_company_id');
      const requestedCompanyId = params.id;
      
      if (userCompanyId !== requestedCompanyId) {
        return HttpResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }
      
      return HttpResponse.json({
        id: requestedCompanyId,
        name: `Company ${requestedCompanyId}`,
      });
    }
  ),
};
```

### 3. Mocking de Integración de IA

```typescript
// tests/mocks/ai-integration-mocks.ts
import { http, HttpResponse } from 'msw';

export const aiIntegrationMocks = {
  // Mock OpenAI chat completion
  openAIChatCompletion: http.post('https://api.openai.com/v1/chat/completions', async ({ request }) => {
    const body = await request.json();
    
    // Simulate different responses based on input
    let responseContent = 'This is a default AI response.';
    
    if (body.messages?.some((msg: any) => msg.content.includes('summarize'))) {
      responseContent = 'This is a summary of the provided content.';
    } else if (body.messages?.some((msg: any) => msg.content.includes('translate'))) {
      responseContent = 'This is the translated content.';
    }
    
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
            content: responseContent,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: body.messages?.length * 10 || 10,
        completion_tokens: responseContent.split(' ').length,
        total_tokens: (body.messages?.length * 10 || 10) + responseContent.split(' ').length,
      },
    });
  }),

  // Mock OpenAI rate limiting
  openAIRateLimit: http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json(
      { error: { message: 'Rate limit exceeded' } },
      { status: 429 }
    );
  }),

  // Mock OpenAI API key error
  openAIInvalidKey: http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json(
      { error: { message: 'Invalid API key' } },
      { status: 401 }
    );
  }),

  // Mock usage tracking
  trackUsage: http.post('https://test.supabase.co/rest/v1/rpc/track_usage', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      id: 'test-usage-id',
      company_id: body.company_id,
      user_id: body.user_id,
      service_name: body.service_name,
      usage_type: body.usage_type,
      amount: body.amount,
      cost_usd: body.cost_usd,
      created_at: new Date().toISOString(),
    });
  }),

  // Mock company limits check
  checkCompanyLimits: http.post('https://test.supabase.co/rest/v1/rpc/get_company_limits', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      max_users: 25,
      max_monthly_ai_requests: 10000,
      max_monthly_scraping_pages: 1000,
      current_ai_requests: 5000,
      current_scraping_pages: 500,
      can_make_ai_request: true,
      can_scrape_page: true,
    });
  }),
};
```

### 4. Mocking de Google Workspace

```typescript
// tests/mocks/google-workspace-mocks.ts
import { http, HttpResponse } from 'msw';

export const googleWorkspaceMocks = {
  // Mock OAuth flow
  oauthToken: http.post('https://www.googleapis.com/oauth2/v4/token', () => {
    return HttpResponse.json({
      access_token: 'test-google-access-token',
      refresh_token: 'test-google-refresh-token',
      expires_in: 3600,
      token_type: 'Bearer',
    });
  }),

  // Mock user info
  userInfo: http.get('https://www.googleapis.com/oauth2/v2/userinfo', () => {
    return HttpResponse.json({
      id: 'test-google-user-id',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg',
      verified_email: true,
    });
  }),

  // Mock Google Docs operations
  createDocument: http.post('https://docs.googleapis.com/v1/documents', async ({ request }) => {
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

  // Mock Google Drive operations
  uploadFile: http.post('https://drive.googleapis.com/drive/v3/files', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      id: 'test-file-id',
      name: body.name || 'Test File',
      mimeType: body.mimeType || 'application/vnd.google-apps.document',
      webViewLink: 'https://docs.google.com/document/d/test-file-id/edit',
      size: '1024',
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    });
  }),

  // Mock file list
  listFiles: http.get('https://drive.googleapis.com/drive/v3/files', () => {
    return HttpResponse.json({
      files: [
        {
          id: 'file-1',
          name: 'Document 1',
          mimeType: 'application/vnd.google-apps.document',
          webViewLink: 'https://docs.google.com/document/d/file-1/edit',
        },
        {
          id: 'file-2',
          name: 'Document 2',
          mimeType: 'application/vnd.google-apps.document',
          webViewLink: 'https://docs.google.com/document/d/file-2/edit',
        },
      ],
      nextPageToken: null,
    });
  }),
};
```

## Mocking en Tests Unitarios

### Mocking de Módulos

```typescript
// tests/unit/hooks/useAuth.test.tsx
import { vi } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Test implementation
describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle authentication state', async () => {
    // Mock successful authentication
    vi.mocked(require('@/integrations/supabase/client').supabase.auth.getSession)
      .mockResolvedValue({
        data: { session: { user: createMockUser() } },
        error: null,
      });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

### Mocking de Funciones

```typescript
// tests/unit/utils/queryBuilder.test.ts
import { vi } from 'vitest';
import { QueryBuilders } from '@/utils/queryBuilder';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => ({
          execute: vi.fn(),
        })),
      })),
    })),
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

describe('QueryBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should build company query with proper filters', async () => {
    const mockExecute = vi.fn().mockResolvedValue({
      data: createMockCompany(),
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({
            execute: mockExecute,
          }),
        }),
      }),
    });

    const result = await QueryBuilders.companies()
      .eq('company_id', 'test-company-id')
      .select('id, name, status')
      .execute();

    expect(mockSupabase.from).toHaveBeenCalledWith('companies');
    expect(mockExecute).toHaveBeenCalled();
  });
});
```

## Mocking en Tests E2E

### Playwright Route Handlers

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/auth/v1/token', route => {
      route.abort('failed');
    });
    
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@testcompany.com');
    await page.getByLabel(/password/i).fill('12345');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/network error/i)).toBeVisible();
  });

  test('should handle rate limiting', async ({ page }) => {
    // Mock rate limiting
    await page.route('**/auth/v1/token', route => {
      route.fulfill({
        status: 429,
        body: JSON.stringify({ error: 'Rate limit exceeded' }),
      });
    });
    
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@testcompany.com');
    await page.getByLabel(/password/i).fill('12345');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show rate limit message
    await expect(page.getByText(/rate limit exceeded/i)).toBeVisible();
  });
});
```

### Mocking de APIs Externas

```typescript
// tests/e2e/ai-integration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('AI Integration', () => {
  test('should handle OpenAI API responses', async ({ page }) => {
    // Mock OpenAI API
    await page.route('**/api.openai.com/v1/chat/completions', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-completion-id',
          choices: [
            {
              message: {
                content: 'This is a test AI response.',
              },
            },
          ],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 20,
            total_tokens: 30,
          },
        }),
      });
    });

    // Login and navigate to AI feature
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@testcompany.com');
    await page.getByLabel(/password/i).fill('12345');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.getByRole('link', { name: /ai tools/i }).click();
    await page.getByRole('button', { name: /generate content/i }).click();
    
    // Should show AI response
    await expect(page.getByText(/this is a test ai response/i)).toBeVisible();
  });
});
```

## Factories de Datos de Prueba

### User Factories

```typescript
// tests/mocks/factories/user-factories.ts
export const createMockUser = (overrides = {}) => ({
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

export const createMockUserWithRole = (role: string) => createMockUser({ role });

export const createMockUserForCompany = (companyId: string) => createMockUser({ company_id: companyId });

export const createMockSuperAdmin = () => createMockUser({
  email: 'admin@VibeThink.co',
  role: 'SUPER_ADMIN',
  company_id: 'VibeThink-platform',
});

export const createMockCompanyOwner = (companyId: string) => createMockUser({
  role: 'OWNER',
  company_id: companyId,
});

export const createMockEmployee = (companyId: string) => createMockUser({
  role: 'EMPLOYEE',
  company_id: companyId,
});
```

### Company Factories

```typescript
// tests/mocks/factories/company-factories.ts
export const createMockCompany = (overrides = {}) => ({
  id: 'test-company-id',
  name: 'Test Company',
  slug: 'test-company',
  status: 'ACTIVE',
  subscription_plan: 'PROFESSIONAL',
  max_users: 25,
  max_monthly_ai_requests: 10000,
  max_monthly_scraping_pages: 1000,
  max_storage_gb: 10,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockStarterCompany = () => createMockCompany({
  subscription_plan: 'STARTER',
  max_users: 5,
  max_monthly_ai_requests: 1000,
  max_monthly_scraping_pages: 100,
  max_storage_gb: 1,
});

export const createMockEnterpriseCompany = () => createMockCompany({
  subscription_plan: 'ENTERPRISE',
  max_users: 100,
  max_monthly_ai_requests: 100000,
  max_monthly_scraping_pages: 10000,
  max_storage_gb: 100,
});

export const createMockTrialCompany = () => createMockCompany({
  status: 'TRIAL',
  subscription_plan: 'STARTER',
});

export const createMockSuspendedCompany = () => createMockCompany({
  status: 'SUSPENDED',
});
```

### Configuration Factories

```typescript
// tests/mocks/factories/configuration-factories.ts
export const createMockConfiguration = (overrides = {}) => ({
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

export const createMockAIConfiguration = () => createMockConfiguration({
  category: 'ai_models',
  config_key: 'openai_models',
  config_value: {
    models: ['gpt-4', 'gpt-3.5-turbo'],
    default_model: 'gpt-4',
    max_tokens: 4000,
  },
});

export const createMockIntegrationConfiguration = () => createMockConfiguration({
  category: 'integrations',
  config_key: 'google_workspace',
  config_value: {
    enabled: true,
    scopes: ['drive', 'docs'],
    redirect_uri: 'https://app.example.com/auth/google/callback',
  },
});

export const createMockSecurityConfiguration = () => createMockConfiguration({
  category: 'security',
  config_key: 'password_policy',
  config_value: {
    min_length: 8,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_special_chars: true,
  },
});
```

## Mejores Prácticas

### 1. Organización de Mocks

```typescript
// ✅ Bueno - Mocks organizados por dominio
// tests/mocks/
// ├── auth-mocks.ts
// ├── company-mocks.ts
// ├── ai-mocks.ts
// ├── google-mocks.ts
// └── factories/
//     ├── user-factories.ts
//     ├── company-factories.ts
//     └── configuration-factories.ts

// ❌ Malo - Mocks mezclados
// tests/mocks/server.ts (todo en un archivo)
```

### 2. Naming de Mocks

```typescript
// ✅ Bueno - Nombres descriptivos
const successfulLoginMock = http.post('/auth/v1/token', () => {
  return HttpResponse.json({ access_token: 'test-token' });
});

const failedLoginMock = http.post('/auth/v1/token', () => {
  return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
});

// ❌ Malo - Nombres genéricos
const mock1 = http.post('/auth/v1/token', () => {
  return HttpResponse.json({ token: 'test' });
});
```

### 3. Reutilización de Mocks

```typescript
// ✅ Bueno - Mocks reutilizables
export const createAuthMock = (success: boolean) => {
  return http.post('/auth/v1/token', () => {
    if (success) {
      return HttpResponse.json({ access_token: 'test-token' });
    } else {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  });
};

// ❌ Malo - Mocks duplicados
const successMock = http.post('/auth/v1/token', () => {
  return HttpResponse.json({ access_token: 'test-token' });
});

const failureMock = http.post('/auth/v1/token', () => {
  return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
});
```

### 4. Cleanup de Mocks

```typescript
// ✅ Bueno - Cleanup apropiado
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

// ❌ Malo - Sin cleanup
// Los mocks persisten entre tests
```

## Troubleshooting

### Problemas Comunes

1. **Mocks no funcionando**
   - Verificar que MSW esté configurado correctamente
   - Verificar que los handlers estén registrados
   - Verificar que las URLs coincidan exactamente

2. **Tests flaky**
   - Usar `server.resetHandlers()` después de cada test
   - Verificar que los mocks no interfieran entre tests
   - Usar `vi.clearAllMocks()` para limpiar mocks de Vitest

3. **Mocks en E2E**
   - Verificar que las rutas coincidan con las URLs reales
   - Usar `page.route()` para interceptar requests
   - Verificar que los mocks se apliquen antes de las acciones

### Debugging

```typescript
// Debug helpers para mocks
const debugMock = (handler: any) => {
  console.log('Mock handler:', handler);
  console.log('Mock URL:', handler.info.header);
};

// Usar en tests
test('debug mock', () => {
  const mock = createAuthMock(true);
  debugMock(mock);
});
```

## Conclusión

Los patrones de mocking descritos en esta guía proporcionan una base sólida para testing efectivo en VibeThink Orchestrator. Los mocks permiten aislar componentes, simular servicios externos y crear escenarios de prueba consistentes y predecibles.

La clave es mantener los mocks organizados, reutilizables y actualizados con los cambios en la aplicación. Esto asegura que los tests sean mantenibles y confiables a largo plazo. 