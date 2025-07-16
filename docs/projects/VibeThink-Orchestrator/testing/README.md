# Testing Documentation - VibeThink Orchestrator

## Resumen

Esta documentación proporciona una guía completa para el sistema de testing enterprise de VibeThink Orchestrator. Incluye estrategias, patrones, herramientas y mejores prácticas para asegurar la calidad del código.

## 📚 Documentación Disponible

### [Testing Strategy](./testing-strategy.md)
Estrategia completa de testing incluyendo:
- Pirámide de testing (Unit 70%, Integration 20%, E2E 10%)
- Stack de herramientas (Vitest, Playwright, k6, MSW)
- Patrones de testing multi-tenant
- Quality gates y métricas

### [E2E Testing Guide](./e2e-testing-guide.md)
Guía completa para testing end-to-end:
- Configuración de Playwright
- Patrones de testing E2E
- Setup y teardown global
- Debugging y troubleshooting

### [Mocking Patterns](./mocking-patterns.md)
Patrones de mocking para testing:
- MSW (Mock Service Worker) setup
- Factories de datos de prueba
- Mocking de APIs externas
- Mejores prácticas

### [CI/CD Integration](./ci-cd-integration.md)
Integración de testing en CI/CD:
- GitHub Actions workflows
- Quality gates
- Reporting y notificaciones
- Deployment strategies

## 🚀 Quick Start

### Instalación

```bash
# Instalar dependencias de testing
npm install

# Setup de Playwright
npm run test:setup

# Setup de base de datos de test
npm run test:db:setup
```

### Comandos Básicos

```bash
# Unit Tests
npm run test                    # Ejecutar tests unitarios
npm run test:watch             # Modo watch
npm run test:coverage          # Con cobertura

# E2E Tests
npm run test:e2e               # Ejecutar tests E2E
npm run test:e2e:ui            # Con UI de Playwright
npm run test:e2e:headed        # Con navegador visible

# Performance Tests
npm run test:performance       # Tests de performance

# Security Tests
npm run test:security          # Tests de seguridad

# Todos los tests
npm run test:all               # Ejecutar todo
npm run test:ci                # Para CI/CD
```

## 🏗️ Arquitectura de Testing

### Stack de Herramientas

```
┌─────────────────────────────────────────────────────────┐
│                    Testing Stack                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Vitest    │  │ Playwright  │  │     k6      │     │
│  │   (Unit)    │  │    (E2E)    │  │(Performance)│     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │     MSW     │  │   Snyk      │  │  Codecov    │     │
│  │  (Mocking)  │  │(Security)   │  │(Coverage)   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Estructura de Archivos

```
tests/
├── unit/                    # Tests unitarios
│   ├── components/         # Tests de componentes
│   ├── hooks/              # Tests de hooks
│   ├── utils/              # Tests de utilidades
│   └── services/           # Tests de servicios
├── e2e/                    # Tests end-to-end
│   ├── auth.spec.ts        # Tests de autenticación
│   ├── multi-tenant.spec.ts # Tests multi-tenant
│   ├── admin.spec.ts       # Tests de admin
│   └── ai-integration.spec.ts # Tests de IA
├── performance/            # Tests de performance
│   ├── load-test.js        # Test de carga
│   └── stress-test.js      # Test de estrés
├── security/               # Tests de seguridad
│   └── security-test.js    # Tests de seguridad
├── mocks/                  # Mocks y datos de prueba
│   ├── server.ts           # Servidor MSW
│   ├── factories/          # Factories de datos
│   └── handlers/           # Handlers de MSW
└── setup/                  # Configuración
    ├── vitest-setup.ts     # Setup de Vitest
    ├── global-setup.ts     # Setup global E2E
    └── global-teardown.ts  # Teardown global E2E
```

## 📊 Métricas y Quality Gates

### Cobertura Objetivo

- **Líneas**: 80%
- **Funciones**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Performance Targets

- **Response Time**: < 2s (95th percentile)
- **Authentication**: < 1s
- **Dashboard Load**: < 3s
- **Error Rate**: < 1%

### Security Requirements

- **Vulnerabilidades Críticas**: 0
- **Auth Bypass**: 0%
- **SQL Injection**: 0%
- **XSS Attempts**: 0%

## 🔧 Configuración

### Variables de Entorno

```bash
# Testing
NODE_ENV=test
VITE_SUPABASE_URL=https://test.supabase.co
VITE_SUPABASE_ANON_KEY=test-anon-key
VITE_OPENAI_API_KEY=test-openai-key

# Performance Testing
BASE_URL=http://localhost:5173
PERFORMANCE_TEST_URL=http://localhost:5173

# Security Testing
SNYK_TOKEN=your-snyk-token
```

### Configuración de Vitest

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest-setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});
```

### Configuración de Playwright

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## 🧪 Patrones de Testing

### Unit Testing

```typescript
// Ejemplo: Testing de Hook
describe('useAuth Hook', () => {
  it('should return unauthenticated state initially', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle authentication errors gracefully', async () => {
    server.use(authMocks.failedLogin);
    const { result } = renderHook(() => useAuth());
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
```

### E2E Testing

```typescript
// Ejemplo: Testing Multi-Tenant
test('should isolate company data', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('admin@testcompany.com');
  await page.getByLabel(/password/i).fill('12345');
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText(/test company a/i)).toBeVisible();
  await expect(page.getByText(/test company b/i)).not.toBeVisible();
});
```

### Performance Testing

```javascript
// Ejemplo: k6 Load Test
export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 10 },
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};
```

## 🔒 Testing de Seguridad

### OWASP Top 10 Testing

```javascript
// Ejemplo: SQL Injection Test
test('should prevent SQL injection', async ({ page }) => {
  const maliciousInput = "'; DROP TABLE companies; --";
  
  await page.goto('/admin');
  await page.getByPlaceholder(/search/i).fill(maliciousInput);
  await page.keyboard.press('Enter');
  
  await expect(page.getByText(/error/i)).not.toBeVisible();
});
```

### Multi-Tenant Security

```typescript
// Ejemplo: Cross-Company Access Prevention
test('should prevent cross-company access', async ({ page }) => {
  await loginAsCompanyA(page);
  await page.goto('/admin/companies/test-company-b');
  
  await expect(page.getByText(/access denied/i)).toBeVisible();
});
```

## 📈 CI/CD Integration

### GitHub Actions Workflow

```yaml
# Ejemplo: Quality Gates
- name: Run quality gates
  run: |
    npm run lint
    npm run test:coverage
    npm run test:security
    npm run type-check
```

### Quality Gates

- ✅ **Linting**: 0 errores de ESLint
- ✅ **Coverage**: 80%+ cobertura
- ✅ **Security**: 0 vulnerabilidades críticas
- ✅ **Type Check**: Sin errores de TypeScript
- ✅ **E2E Tests**: 100% de flujos críticos pasando

## 🐛 Debugging

### Debug Unit Tests

```bash
# Debug con Vitest
npm run test -- --debug

# Debug específico
npm run test -- --debug auth.test.ts
```

### Debug E2E Tests

```bash
# Debug con Playwright
npm run test:e2e -- --debug

# Debug con navegador visible
npm run test:e2e:headed
```

### Debug Performance Tests

```bash
# Debug con k6
k6 run --inspect tests/performance/load-test.js
```

## 📊 Reporting

### Coverage Reports

```bash
# Generar reporte HTML
npm run test:coverage

# Ver reporte
open coverage/index.html
```

### E2E Reports

```bash
# Ver reporte de Playwright
npx playwright show-report
```

### Performance Reports

```bash
# Ver métricas de performance
open performance-results/index.html
```

## 🤝 Contribución

### Antes de Contribuir

1. **Ejecutar tests**: `npm run test:all`
2. **Verificar cobertura**: `npm run test:coverage`
3. **Linting**: `npm run lint`
4. **Type check**: `npm run type-check`

### Estándares de Testing

- **Naming**: Tests descriptivos y específicos
- **Organization**: Tests organizados por funcionalidad
- **Mocking**: Usar factories y mocks reutilizables
- **Cleanup**: Limpiar estado después de cada test
- **Documentation**: Comentar tests complejos

### Testing Checklist

- [ ] Tests unitarios para nueva funcionalidad
- [ ] Tests E2E para flujos críticos
- [ ] Tests de performance si aplica
- [ ] Tests de seguridad para endpoints
- [ ] Mocks actualizados
- [ ] Cobertura mantenida > 80%
- [ ] Tests pasando en CI/CD

## 📞 Soporte

### Problemas Comunes

1. **Tests Flaky**: Usar `waitFor` en lugar de `setTimeout`
2. **Mocks no funcionando**: Verificar configuración de MSW
3. **Performance tests fallando**: Verificar infraestructura
4. **Security tests false positives**: Verificar configuración

### Recursos Adicionales

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [k6 Documentation](https://k6.io/docs/)
- [MSW Documentation](https://mswjs.io/)

---

**Testing Team** - VibeThink Orchestrator 🧪 