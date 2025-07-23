# Guía de Usuario - Testing VibeThink Orchestrator

## Resumen

Esta guía está diseñada para desarrolladores que quieren contribuir al proyecto VibeThink Orchestrator. Incluye instrucciones paso a paso para ejecutar tests, contribuir con nuevos tests y mantener la calidad del código.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/your-org/ai-pair-orchestrator-pro.git
cd ai-pair-orchestrator-pro

# Instalar dependencias
npm install

# Setup de testing
npm run test:setup
```

### Verificar Instalación

```bash
# Ejecutar tests básicos
npm run test

# Verificar que todo funciona
npm run test:all
```

## 📋 Comandos de Testing

### Tests Unitarios

```bash
# Ejecutar todos los tests unitarios
npm run test

# Ejecutar en modo watch (desarrollo)
npm run test:watch

# Ejecutar con cobertura
npm run test:coverage

# Ejecutar tests específicos
npm run test -- auth.test.ts
npm run test -- --grep "authentication"
```

### Tests E2E

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar con UI de Playwright
npm run test:e2e:ui

# Ejecutar con navegador visible
npm run test:e2e:headed

# Ejecutar tests específicos
npx playwright test auth.spec.ts

# Ejecutar en navegador específico
npx playwright test --project=chromium
```

### Tests de Performance

```bash
# Ejecutar tests de performance
npm run test:performance

# Ejecutar con parámetros específicos
k6 run tests/performance/load-test.js --env BASE_URL=http://localhost:5173
```

### Tests de Seguridad

```bash
# Ejecutar auditoría de dependencias
npm run test:security:audit

# Ejecutar escaneo de vulnerabilidades
npm run test:security:scan

# Ejecutar tests de seguridad completos
npm run test:security
```

## 🧪 Escribiendo Tests

### Tests Unitarios

#### Estructura de un Test Unitario

```typescript
// tests/unit/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    // Setup antes de cada test
  });

  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

#### Testing de Hooks

```typescript
// tests/unit/hooks/useMyHook.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMyHook } from '@/hooks/useMyHook';

describe('useMyHook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useMyHook());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeDefined();
  });
});
```

#### Testing de Utilidades

```typescript
// tests/unit/utils/myUtil.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, validateEmail } from '@/utils/myUtil';

describe('myUtil', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-01');
      expect(formatDate(date)).toBe('01/01/2024');
    });

    it('should handle invalid date', () => {
      expect(formatDate(null)).toBe('Invalid Date');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });
});
```

### Tests E2E

#### Estructura de un Test E2E

```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Setup antes de cada test
    await page.goto('/my-feature');
  });

  test('should display feature correctly', async ({ page }) => {
    // Verificar que el elemento esté presente
    await expect(page.getByText('My Feature')).toBeVisible();
    
    // Verificar que el botón esté habilitado
    await expect(page.getByRole('button', { name: /submit/i })).toBeEnabled();
  });

  test('should handle form submission', async ({ page }) => {
    // Llenar formulario
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    
    // Enviar formulario
    await page.getByRole('button', { name: /submit/i }).click();
    
    // Verificar resultado
    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
```

#### Testing Multi-Tenant

```typescript
// tests/e2e/multi-tenant.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Multi-Tenant Security', () => {
  test('should isolate company data', async ({ page }) => {
    // Login como usuario de Company A
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@company-a.com');
    await page.getByLabel(/password/i).fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verificar que solo vea datos de Company A
    await expect(page.getByText(/company a/i)).toBeVisible();
    await expect(page.getByText(/company b/i)).not.toBeVisible();
  });

  test('should prevent cross-company access', async ({ page }) => {
    // Login como usuario de Company A
    await loginAsCompanyA(page);
    
    // Intentar acceder a datos de Company B
    await page.goto('/admin/companies/company-b');
    
    // Verificar que se deniegue el acceso
    await expect(page.getByText(/access denied/i)).toBeVisible();
  });
});
```

## 🔧 Configuración de Entorno

### Variables de Entorno

Crea un archivo `.env.test` para configuración de testing:

```bash
# .env.test
NODE_ENV=test
VITE_SUPABASE_URL=https://test.supabase.co
VITE_SUPABASE_ANON_KEY=test-anon-key
VITE_OPENAI_API_KEY=test-openai-key
BASE_URL=http://localhost:5173
```

### Configuración de Base de Datos

```bash
# Setup de base de datos de test
npm run test:db:setup

# Limpiar datos de test
npm run test:db:cleanup

# Verificar datos de test
npm run test:db:check
```

## 📊 Cobertura de Código

### Verificar Cobertura

```bash
# Ejecutar tests con cobertura
npm run test:coverage

# Ver reporte en navegador
open coverage/index.html
```

### Métricas de Cobertura

- **Líneas**: 80% mínimo
- **Funciones**: 80% mínimo
- **Branches**: 80% mínimo
- **Statements**: 80% mínimo

### Mejorar Cobertura

Si la cobertura está baja:

1. **Identificar archivos con baja cobertura**:
   ```bash
   npm run test:coverage
   ```

2. **Agregar tests para funciones no cubiertas**:
   ```typescript
   // Ejemplo: Agregar test para edge case
   it('should handle empty array', () => {
     expect(processData([])).toEqual([]);
   });
   ```

3. **Verificar que los tests cubran todos los branches**:
   ```typescript
   // Ejemplo: Test para diferentes condiciones
   it('should handle success case', () => {
     expect(processData(validData)).toEqual(expectedResult);
   });

   it('should handle error case', () => {
     expect(processData(invalidData)).toThrow();
   });
   ```

## 🐛 Debugging

### Debug Tests Unitarios

```bash
# Debug con Vitest
npm run test -- --debug

# Debug test específico
npm run test -- --debug auth.test.ts
```

### Debug Tests E2E

```bash
# Debug con Playwright
npm run test:e2e -- --debug

# Debug con navegador visible
npm run test:e2e:headed

# Debug test específico
npx playwright test auth.spec.ts --debug
```

### Debug Performance Tests

```bash
# Debug con k6
k6 run --inspect tests/performance/load-test.js
```

### Logs y Console

```typescript
// En tests unitarios
console.log('Debug info:', data);

// En tests E2E
await page.evaluate(() => {
  console.log('Browser console:', 'debug info');
});
```

## 🔒 Testing de Seguridad

### Auditoría de Dependencias

```bash
# Verificar vulnerabilidades
npm run test:security:audit

# Verificar vulnerabilidades críticas
npm audit --audit-level critical
```

### Escaneo de Vulnerabilidades

```bash
# Escaneo con Snyk
npm run test:security:scan

# Ver reporte detallado
snyk test --json
```

### Tests de Seguridad Personalizados

```typescript
// tests/security/authentication.test.ts
test('should prevent SQL injection', async ({ page }) => {
  const maliciousInput = "'; DROP TABLE users; --";
  
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(maliciousInput);
  await page.getByLabel(/password/i).fill('password');
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Verificar que no se ejecute la inyección
  await expect(page.getByText(/error/i)).not.toBeVisible();
});
```

## 📈 Performance Testing

### Tests de Carga

```bash
# Ejecutar test de carga básico
npm run test:performance

# Ejecutar con parámetros específicos
k6 run tests/performance/load-test.js \
  --env BASE_URL=http://localhost:5173 \
  --env USERS=50 \
  --env DURATION=5m
```

### Métricas de Performance

- **Response Time**: < 2s (95th percentile)
- **Throughput**: 100+ usuarios concurrentes
- **Error Rate**: < 1%
- **Authentication**: < 1s

### Interpretar Resultados

```bash
# Ver métricas en tiempo real
k6 run --out influxdb=http://localhost:8086/k6 tests/performance/load-test.js

# Ver reporte HTML
k6 run --out json=results.json tests/performance/load-test.js
k6 run --out html=report.html tests/performance/load-test.js
```

## 🤝 Contribución

### Antes de Contribuir

1. **Ejecutar tests existentes**:
   ```bash
   npm run test:all
   ```

2. **Verificar cobertura**:
   ```bash
   npm run test:coverage
   ```

3. **Ejecutar linting**:
   ```bash
   npm run lint
   ```

4. **Verificar tipos**:
   ```bash
   npm run type-check
   ```

### Agregar Nuevos Tests

1. **Crear archivo de test**:
   ```bash
   touch tests/unit/components/NewComponent.test.tsx
   ```

2. **Escribir tests siguiendo patrones**:
   ```typescript
   import { render, screen } from '@testing-library/react';
   import { describe, it, expect } from 'vitest';
   import { NewComponent } from '@/components/NewComponent';

   describe('NewComponent', () => {
     it('should render correctly', () => {
       render(<NewComponent />);
       expect(screen.getByText('New Component')).toBeInTheDocument();
     });
   });
   ```

3. **Verificar que pasen**:
   ```bash
   npm run test NewComponent.test.tsx
   ```

### Estándares de Testing

- **Naming**: Tests descriptivos y específicos
- **Organization**: Tests organizados por funcionalidad
- **Coverage**: 80% mínimo de cobertura
- **Mocking**: Usar factories y mocks reutilizables
- **Cleanup**: Limpiar estado después de cada test

### Checklist de Testing

- [ ] Tests unitarios para nueva funcionalidad
- [ ] Tests E2E para flujos críticos
- [ ] Tests de performance si aplica
- [ ] Tests de seguridad para endpoints
- [ ] Mocks actualizados
- [ ] Cobertura mantenida > 80%
- [ ] Tests pasando en CI/CD

## 📞 Soporte

### Problemas Comunes

1. **Tests Flaky**:
   - Usar `waitFor` en lugar de `setTimeout`
   - Verificar selectores únicos
   - Limpiar estado entre tests

2. **Mocks no funcionando**:
   - Verificar configuración de MSW
   - Verificar que los handlers estén registrados
   - Verificar que las URLs coincidan exactamente

3. **Performance tests fallando**:
   - Verificar infraestructura de test
   - Ajustar thresholds según ambiente
   - Monitorear recursos del sistema

4. **Security tests false positives**:
   - Verificar configuración de mocks
   - Validar headers de seguridad
   - Revisar políticas de CORS

### Recursos Adicionales

- [Documentación de Vitest](https://vitest.dev/)
- [Documentación de Playwright](https://playwright.dev/)
- [Documentación de k6](https://k6.io/docs/)
- [Documentación de MSW](https://mswjs.io/)

### Contacto

- **Issues**: [GitHub Issues](https://github.com/your-org/ai-pair-orchestrator-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/ai-pair-orchestrator-pro/discussions)
- **Documentación**: [Docs](./)

---

**Testing Team** - VibeThink Orchestrator 🧪 