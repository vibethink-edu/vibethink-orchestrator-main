# Testing Strategy - VibeThink Orchestrator

## Resumen Ejecutivo

Este documento describe la estrategia completa de testing para VibeThink Orchestrator, una plataforma SaaS multi-tenant con integración de IA. La estrategia abarca testing unitario, de integración, E2E, de performance y de seguridad.

## Arquitectura de Testing

### Pirámide de Testing

```
                    ┌─────────────────┐
                    │   E2E Tests     │  ← 10% (Critical User Journeys)
                    └─────────────────┘
                ┌─────────────────────┐
                │ Integration Tests   │  ← 20% (API & Service Integration)
                └─────────────────────┘
    ┌─────────────────────────────────────────┐
    │           Unit Tests                    │  ← 70% (Components & Functions)
    └─────────────────────────────────────────┘
```

### Stack de Testing

- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **Performance Testing**: k6
- **Security Testing**: Custom k6 scripts + Snyk
- **Mocking**: MSW (Mock Service Worker)
- **Coverage**: Vitest Coverage
- **CI/CD**: GitHub Actions

## Tipos de Testing

### 1. Unit Testing (70%)

#### Objetivos
- Validar lógica de negocio individual
- Probar componentes React de forma aislada
- Verificar utilidades y helpers
- Asegurar cobertura de código crítica

#### Cobertura Objetivo
- **Líneas**: 80%
- **Funciones**: 80%
- **Branches**: 80%
- **Statements**: 80%

#### Patrones de Testing

```typescript
// Ejemplo: Testing de Hook Personalizado
describe('useAuth Hook', () => {
  it('should return unauthenticated state initially', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle authentication errors gracefully', async () => {
    // Mock error scenario
    server.use(
      http.post('/auth/v1/token', () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useAuth());
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
```

#### Componentes Críticos para Testing

1. **Hooks de Autenticación**
   - `useAuth`
   - `useCompanyData`
   - `useCompanyLimits`

2. **Componentes de UI**
   - Formularios de autenticación
   - Tablas de datos
   - Modales y diálogos

3. **Utilidades**
   - `queryBuilder`
   - `inputValidators`
   - `dataFormatters`

### 2. Integration Testing (20%)

#### Objetivos
- Probar integración entre componentes
- Validar flujos de datos
- Verificar integración con APIs externas
- Probar patrones multi-tenant

#### Patrones de Testing

```typescript
// Ejemplo: Testing de Integración Multi-Tenant
describe('Multi-Tenant Integration', () => {
  it('should isolate company data correctly', async () => {
    const companyAUser = createMockUser({ company_id: 'company-a' });
    const companyBUser = createMockUser({ company_id: 'company-b' });

    // Test data isolation
    const companyAData = await fetchCompanyData(companyAUser);
    const companyBData = await fetchCompanyData(companyBUser);

    expect(companyAData).not.toContain(companyBData);
  });
});
```

#### Integraciones Críticas

1. **Supabase Integration**
   - Autenticación
   - RLS (Row Level Security)
   - Real-time subscriptions

2. **OpenAI Integration**
   - API calls
   - Error handling
   - Rate limiting

3. **Google Workspace Integration**
   - OAuth flow
   - Document processing
   - Drive operations

### 3. E2E Testing (10%)

#### Objetivos
- Validar flujos completos de usuario
- Probar funcionalidad multi-tenant
- Verificar seguridad end-to-end
- Asegurar accesibilidad

#### User Journeys Críticos

1. **Autenticación y Autorización**
   - Login/logout
   - Role-based access
   - Multi-tenant isolation

2. **Gestión de Empresas**
   - Creación de empresa
   - Configuración de límites
   - Gestión de usuarios

3. **Integración de IA**
   - Generación de contenido
   - Procesamiento de documentos
   - Tracking de uso

#### Patrones de Testing

```typescript
// Ejemplo: E2E Multi-Tenant
test('should isolate company data in UI', async ({ page }) => {
  // Login as Company A admin
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'admin@company-a.com');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="signin-button"]');

  // Verify only Company A data is visible
  await expect(page.locator('[data-testid="company-name"]'))
    .toHaveText('Company A');
  await expect(page.locator('[data-testid="company-b-data"]'))
    .not.toBeVisible();
});
```

### 4. Performance Testing

#### Objetivos
- Validar rendimiento bajo carga
- Identificar cuellos de botella
- Asegurar escalabilidad
- Monitorear métricas clave

#### Métricas Objetivo

- **Response Time**: < 2s (95th percentile)
- **Throughput**: 100+ concurrent users
- **Error Rate**: < 1%
- **Authentication**: < 1s
- **Dashboard Load**: < 3s

#### Escenarios de Carga

```javascript
// k6 Load Test Configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up
    { duration: '5m', target: 10 },   // Steady load
    { duration: '2m', target: 50 },   // Peak load
    { duration: '5m', target: 50 },   // Sustained peak
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};
```

### 5. Security Testing

#### Objetivos
- Prevenir vulnerabilidades OWASP Top 10
- Validar aislamiento multi-tenant
- Probar autenticación y autorización
- Verificar protección contra ataques comunes

#### Tipos de Testing de Seguridad

1. **Authentication Security**
   - Brute force protection
   - Weak password detection
   - Session management

2. **Authorization Security**
   - Role-based access control
   - Cross-company access prevention
   - Privilege escalation prevention

3. **Input Validation**
   - SQL injection prevention
   - XSS prevention
   - Path traversal prevention

4. **API Security**
   - Rate limiting
   - CSRF protection
   - Input sanitization

## Estrategia Multi-Tenant

### Aislamiento de Datos

```typescript
// Patrón de Testing Multi-Tenant
describe('Multi-Tenant Data Isolation', () => {
  it('should enforce company_id filtering', async () => {
    const companyAQuery = await QueryBuilders.companies()
      .eq('company_id', 'company-a')
      .execute();

    const companyBQuery = await QueryBuilders.companies()
      .eq('company_id', 'company-b')
      .execute();

    // Verify no cross-contamination
    expect(companyAQuery.data).not.toContain(companyBQuery.data);
  });
});
```

### Testing de Roles y Permisos

```typescript
// Testing de Jerarquía de Roles
const roleHierarchy = {
  EMPLOYEE: ['EMPLOYEE'],
  MANAGER: ['EMPLOYEE', 'MANAGER'],
  ADMIN: ['EMPLOYEE', 'MANAGER', 'ADMIN'],
  OWNER: ['EMPLOYEE', 'MANAGER', 'ADMIN', 'OWNER'],
  SUPER_ADMIN: ['EMPLOYEE', 'MANAGER', 'ADMIN', 'OWNER', 'SUPER_ADMIN'],
};

Object.entries(roleHierarchy).forEach(([role, permissions]) => {
  test(`${role} should have correct permissions`, () => {
    const user = createMockUser({ role });
    permissions.forEach(permission => {
      expect(hasPermission(user, permission)).toBe(true);
    });
  });
});
```

## Mocking Strategy

### MSW (Mock Service Worker)

```typescript
// Mock Configuration
export const handlers = [
  // Supabase Auth
  http.post('https://test.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'test-token',
      user: createMockUser(),
    });
  }),

  // OpenAI API
  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json({
      choices: [{ message: { content: 'Mock AI response' } }],
    });
  }),

  // Google Workspace
  http.get('https://www.googleapis.com/oauth2/v2/userinfo', () => {
    return HttpResponse.json(createMockGoogleUser());
  }),
];
```

### Test Data Factories

```typescript
// Factories para Testing
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'ADMIN',
  company_id: 'test-company-id',
  ...overrides,
});

export const createMockCompany = (overrides = {}) => ({
  id: 'test-company-id',
  name: 'Test Company',
  subscription_plan: 'PROFESSIONAL',
  ...overrides,
});
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Testing Pipeline

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:e2e

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: grafana/k6-action@v0.2.0
        with:
          filename: tests/performance/load-test.js
```

### Quality Gates

- **Unit Tests**: 80% coverage mínimo
- **E2E Tests**: 100% de flujos críticos pasando
- **Performance**: < 2s response time (95th percentile)
- **Security**: 0 vulnerabilidades críticas
- **Linting**: 0 errores de ESLint

## Métricas y Reporting

### Dashboard de Testing

```typescript
// Métricas de Testing
interface TestingMetrics {
  coverage: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
  performance: {
    responseTime: number;
    throughput: number;
    errorRate: number;
  };
  security: {
    vulnerabilities: number;
    authFailures: number;
    injectionAttempts: number;
  };
}
```

### Alertas y Notificaciones

- **Coverage Drop**: < 80%
- **Performance Degradation**: > 2s response time
- **Security Issues**: Cualquier vulnerabilidad crítica
- **Test Failures**: Cualquier test fallando en main

## Mejores Prácticas

### 1. Test Naming

```typescript
// ✅ Bueno
describe('useAuth Hook', () => {
  it('should return unauthenticated state when user is not logged in', () => {
    // test implementation
  });
});

// ❌ Malo
describe('useAuth', () => {
  it('test1', () => {
    // test implementation
  });
});
```

### 2. Test Organization

```typescript
// Estructura recomendada
describe('Component/Feature Name', () => {
  describe('when condition A', () => {
    it('should behave in way X', () => {
      // test implementation
    });
  });

  describe('when condition B', () => {
    it('should behave in way Y', () => {
      // test implementation
    });
  });
});
```

### 3. Test Data Management

```typescript
// ✅ Usar factories
const user = createMockUser({ role: 'ADMIN' });

// ❌ Datos hardcodeados
const user = {
  id: '123',
  email: 'test@example.com',
  // ... más datos
};
```

### 4. Async Testing

```typescript
// ✅ Usar waitFor para async operations
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// ❌ Usar setTimeout
setTimeout(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
}, 1000);
```

## Troubleshooting

### Problemas Comunes

1. **Tests Flaky**
   - Usar `waitFor` en lugar de `setTimeout`
   - Limpiar estado entre tests
   - Mock external dependencies

2. **Performance Tests Failing**
   - Verificar infraestructura de test
   - Ajustar thresholds según ambiente
   - Monitorear recursos del sistema

3. **Security Tests False Positives**
   - Verificar configuración de mocks
   - Validar headers de seguridad
   - Revisar políticas de CORS

### Debugging

```typescript
// Debug helpers
const debugElement = (element: HTMLElement) => {
  console.log('Element HTML:', element.outerHTML);
  console.log('Element attributes:', element.attributes);
};

// Usar en tests
test('debug test', () => {
  const button = screen.getByRole('button');
  debugElement(button);
});
```

## Conclusión

Esta estrategia de testing proporciona una base sólida para mantener la calidad y seguridad de VibeThink Orchestrator. La combinación de testing unitario, de integración, E2E, de performance y de seguridad asegura que la plataforma sea robusta, escalable y segura para uso en producción.

La implementación de esta estrategia debe ser iterativa, mejorando continuamente basándose en métricas y feedback del equipo de desarrollo. 