# E2E Testing Guide - VibeThink Orchestrator

## Resumen

Esta guía detalla cómo implementar y ejecutar tests end-to-end (E2E) para VibeThink Orchestrator usando Playwright. Los tests E2E validan flujos completos de usuario y funcionalidad multi-tenant.

## Configuración de Playwright

### Instalación

```bash
# Instalar Playwright
npm install -D @playwright/test

# Instalar navegadores
npx playwright install

# Verificar instalación
npx playwright --version
```

### Configuración Básica

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## Estructura de Tests E2E

### Organización de Archivos

```
tests/e2e/
├── auth.spec.ts              # Tests de autenticación
├── multi-tenant.spec.ts      # Tests multi-tenant
├── admin.spec.ts             # Tests de panel admin
├── ai-integration.spec.ts    # Tests de integración IA
├── performance.spec.ts       # Tests de performance
├── accessibility.spec.ts     # Tests de accesibilidad
├── setup/
│   ├── global-setup.ts       # Setup global
│   └── global-teardown.ts    # Teardown global
└── utils/
    ├── test-helpers.ts       # Helpers de testing
    └── mock-data.ts          # Datos de prueba
```

### Patrones de Testing

#### 1. Test de Autenticación

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange
    const email = 'admin@testcompany.com';
    const password = '12345';

    // Act
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();

    // Assert
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Arrange
    const email = 'wrong@example.com';
    const password = 'wrongpassword';

    // Act
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();

    // Assert
    await expect(page.getByText(/error signing in/i)).toBeVisible();
  });
});
```

#### 2. Test Multi-Tenant

```typescript
// tests/e2e/multi-tenant.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Multi-Tenant Security', () => {
  test('should isolate company data', async ({ page }) => {
    // Login as Company A admin
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@testcompany.com');
    await page.getByLabel(/password/i).fill('12345');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/dashboard');

    // Navigate to admin panel
    await page.getByRole('link', { name: /admin/i }).click();

    // Should only show Company A data
    await expect(page.getByText(/test company a/i)).toBeVisible();
    await expect(page.getByText(/test company b/i)).not.toBeVisible();
  });

  test('should prevent cross-company access', async ({ page }) => {
    // Login as Company A admin
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@testcompany.com');
    await page.getByLabel(/password/i).fill('12345');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Try to access Company B data directly
    await page.goto('/admin/companies/test-company-b');

    // Should show access denied
    await expect(page.getByText(/access denied/i)).toBeVisible();
  });
});
```

#### 3. Test de Panel Admin

```typescript
// tests/e2e/admin.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@testcompany.com');
    await page.getByLabel(/password/i).fill('12345');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should manage users correctly', async ({ page }) => {
    // Navigate to user management
    await page.getByRole('link', { name: /admin/i }).click();
    await page.getByRole('link', { name: /users/i }).click();

    // Should show user list
    await expect(page.getByText(/user management/i)).toBeVisible();
    await expect(page.getByText(/admin@testcompany.com/i)).toBeVisible();

    // Test user creation
    await page.getByRole('button', { name: /add user/i }).click();
    await page.getByLabel(/email/i).fill('newuser@testcompany.com');
    await page.getByLabel(/full name/i).fill('New User');
    await page.getByLabel(/role/i).selectOption('EMPLOYEE');
    await page.getByRole('button', { name: /create/i }).click();

    // Should show success message
    await expect(page.getByText(/user created successfully/i)).toBeVisible();
  });

  test('should manage company limits', async ({ page }) => {
    // Navigate to limits management
    await page.getByRole('link', { name: /admin/i }).click();
    await page.getByText(/limits and configuration/i).click();

    // Should show current limits
    await expect(page.getByText(/max users/i)).toBeVisible();
    await expect(page.getByText(/max monthly ai requests/i)).toBeVisible();

    // Test limit update
    await page.getByLabel(/max users/i).fill('50');
    await page.getByRole('button', { name: /save/i }).click();

    // Should show success message
    await expect(page.getByText(/limits updated successfully/i)).toBeVisible();
  });
});
```

## Setup y Teardown Global

### Global Setup

```typescript
// tests/setup/global-setup.ts
import { FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');

  // Setup test environment
  process.env.NODE_ENV = 'test';
  process.env.VITE_SUPABASE_URL = process.env.TEST_SUPABASE_URL || 'https://test.supabase.co';
  process.env.VITE_SUPABASE_ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY || 'test-anon-key';

  // Initialize Supabase client
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );

  try {
    // Setup test database
    await setupTestDatabase(supabase);
    
    // Setup test authentication
    await setupTestAuthentication();
    
    // Setup test data
    await setupTestData(supabase);
    
    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

async function setupTestDatabase(supabase: any) {
  // Create test companies
  const testCompanies = [
    {
      name: 'Test Company A',
      slug: 'test-company-a',
      status: 'ACTIVE',
      subscription_plan: 'PROFESSIONAL',
      max_users: 25,
      max_monthly_ai_requests: 10000,
    },
    {
      name: 'Test Company B',
      slug: 'test-company-b',
      status: 'TRIAL',
      subscription_plan: 'STARTER',
      max_users: 5,
      max_monthly_ai_requests: 1000,
    },
  ];

  for (const company of testCompanies) {
    await supabase
      .from('companies')
      .upsert(company, { onConflict: 'slug' });
  }

  // Create test users
  const testUsers = [
    {
      id: 'test-admin-user',
      email: 'admin@testcompany.com',
      full_name: 'Test Admin',
      role: 'ADMIN',
      company_id: 'test-company-a',
      is_active: true,
    },
    {
      id: 'test-employee-user',
      email: 'employee@testcompany.com',
      full_name: 'Test Employee',
      role: 'EMPLOYEE',
      company_id: 'test-company-a',
      is_active: true,
    },
  ];

  for (const user of testUsers) {
    await supabase
      .from('user_profiles')
      .upsert(user, { onConflict: 'id' });
  }
}

export default globalSetup;
```

### Global Teardown

```typescript
// tests/setup/global-teardown.ts
import { FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test cleanup...');

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );

  try {
    // Cleanup test data
    await cleanupTestData(supabase);
    
    // Cleanup test users
    await cleanupTestUsers(supabase);
    
    // Cleanup test companies
    await cleanupTestCompanies(supabase);
    
    console.log('✅ Global cleanup completed successfully');
  } catch (error) {
    console.error('❌ Global cleanup failed:', error);
  }
}

async function cleanupTestData(supabase: any) {
  // Cleanup usage tracking
  await supabase
    .from('usage_tracking')
    .delete()
    .like('company_id', 'test-%');

  // Cleanup monthly billing
  await supabase
    .from('monthly_billing')
    .delete()
    .like('company_id', 'test-%');
}

export default globalTeardown;
```

## Helpers y Utilidades

### Test Helpers

```typescript
// tests/e2e/utils/test-helpers.ts
import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.goto('/login');
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
    await expect(this.page).toHaveURL('/dashboard');
  }

  async logout() {
    await this.page.getByRole('button', { name: /user menu/i }).click();
    await this.page.getByRole('button', { name: /sign out/i }).click();
    await expect(this.page).toHaveURL('/login');
  }

  async navigateToAdmin() {
    await this.page.getByRole('link', { name: /admin/i }).click();
    await expect(this.page.getByText(/admin panel/i)).toBeVisible();
  }

  async createUser(userData: {
    email: string;
    fullName: string;
    role: string;
  }) {
    await this.page.getByRole('button', { name: /add user/i }).click();
    await this.page.getByLabel(/email/i).fill(userData.email);
    await this.page.getByLabel(/full name/i).fill(userData.fullName);
    await this.page.getByLabel(/role/i).selectOption(userData.role);
    await this.page.getByRole('button', { name: /create/i }).click();
    
    await expect(this.page.getByText(/user created successfully/i)).toBeVisible();
  }

  async updateCompanyLimits(limits: {
    maxUsers?: number;
    maxAIRequests?: number;
    maxScrapingPages?: number;
  }) {
    if (limits.maxUsers) {
      await this.page.getByLabel(/max users/i).fill(limits.maxUsers.toString());
    }
    if (limits.maxAIRequests) {
      await this.page.getByLabel(/max monthly ai requests/i).fill(limits.maxAIRequests.toString());
    }
    if (limits.maxScrapingPages) {
      await this.page.getByLabel(/max monthly scraping pages/i).fill(limits.maxScrapingPages.toString());
    }
    
    await this.page.getByRole('button', { name: /save/i }).click();
    await expect(this.page.getByText(/limits updated successfully/i)).toBeVisible();
  }
}
```

### Mock Data

```typescript
// tests/e2e/utils/mock-data.ts
export const testUsers = {
  admin: {
    email: 'admin@testcompany.com',
    password: '12345',
    role: 'ADMIN',
    company: 'test-company-a',
  },
  employee: {
    email: 'employee@testcompany.com',
    password: '12345',
    role: 'EMPLOYEE',
    company: 'test-company-a',
  },
  owner: {
    email: 'owner@testcompany.com',
    password: '12345',
    role: 'OWNER',
    company: 'test-company-b',
  },
  superAdmin: {
    email: 'admin@VibeThink.co',
    password: '12345',
    role: 'SUPER_ADMIN',
    company: 'VibeThink-platform',
  },
};

export const testCompanies = {
  companyA: {
    name: 'Test Company A',
    slug: 'test-company-a',
    status: 'ACTIVE',
    subscription_plan: 'PROFESSIONAL',
    max_users: 25,
    max_monthly_ai_requests: 10000,
  },
  companyB: {
    name: 'Test Company B',
    slug: 'test-company-b',
    status: 'TRIAL',
    subscription_plan: 'STARTER',
    max_users: 5,
    max_monthly_ai_requests: 1000,
  },
};
```

## Ejecución de Tests

### Comandos Básicos

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar tests en modo UI
npm run test:e2e:ui

# Ejecutar tests con navegador visible
npm run test:e2e:headed

# Ejecutar tests específicos
npx playwright test auth.spec.ts

# Ejecutar tests en navegador específico
npx playwright test --project=chromium

# Ejecutar tests con retry
npx playwright test --retries=3
```

### Variables de Entorno

```bash
# Configurar URL base
BASE_URL=http://localhost:5173 npx playwright test

# Configurar credenciales de test
TEST_SUPABASE_URL=https://test.supabase.co npx playwright test

# Configurar modo CI
CI=true npx playwright test
```

### Configuración de CI/CD

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          TEST_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          TEST_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Debugging

### Debug Mode

```bash
# Ejecutar en modo debug
npx playwright test --debug

# Ejecutar test específico en debug
npx playwright test auth.spec.ts --debug
```

### Screenshots y Videos

```typescript
// Tomar screenshot manual
await page.screenshot({ path: 'debug-screenshot.png' });

// Grabar video
await page.video()?.saveAs('debug-video.webm');

// Capturar trace
await page.context.tracing.start({ screenshots: true, snapshots: true });
// ... test actions ...
await page.context.tracing.stop({ path: 'trace.zip' });
```

### Logs y Console

```typescript
// Interceptar requests
page.on('request', request => {
  console.log('Request:', request.url());
});

page.on('response', response => {
  console.log('Response:', response.url(), response.status());
});

// Interceptar console logs
page.on('console', msg => {
  console.log('Browser console:', msg.text());
});
```

## Mejores Prácticas

### 1. Selectores Robustos

```typescript
// ✅ Bueno - Selectores semánticos
await page.getByRole('button', { name: /sign in/i }).click();
await page.getByLabel(/email/i).fill(email);
await page.getByTestId('user-email').fill(email);

// ❌ Malo - Selectores frágiles
await page.click('.btn-primary');
await page.fill('#email', email);
await page.click('button:nth-child(2)');
```

### 2. Esperas Inteligentes

```typescript
// ✅ Bueno - Esperas específicas
await expect(page.getByText('Success')).toBeVisible();
await page.waitForURL('/dashboard');

// ❌ Malo - Esperas fijas
await page.waitForTimeout(1000);
```

### 3. Organización de Tests

```typescript
// ✅ Bueno - Tests organizados
test.describe('User Management', () => {
  test.describe('when creating a new user', () => {
    test('should validate required fields', async ({ page }) => {
      // test implementation
    });
    
    test('should create user successfully', async ({ page }) => {
      // test implementation
    });
  });
});
```

### 4. Datos de Test

```typescript
// ✅ Bueno - Datos centralizados
const testUser = testUsers.admin;
await helpers.login(testUser.email, testUser.password);

// ❌ Malo - Datos hardcodeados
await helpers.login('admin@testcompany.com', '12345');
```

## Troubleshooting

### Problemas Comunes

1. **Tests Flaky**
   - Usar `waitFor` en lugar de `setTimeout`
   - Verificar selectores únicos
   - Limpiar estado entre tests

2. **Timeouts**
   - Aumentar `actionTimeout` y `navigationTimeout`
   - Verificar conectividad de red
   - Optimizar selectores

3. **Screenshots Fallidos**
   - Verificar permisos de escritura
   - Limpiar directorio de screenshots
   - Verificar espacio en disco

### Debugging Avanzado

```typescript
// Debug helpers
const debugPage = async (page: Page, name: string) => {
  await page.screenshot({ path: `debug-${name}.png` });
  console.log('Page URL:', page.url());
  console.log('Page title:', await page.title());
};

// Usar en tests
test('debug test', async ({ page }) => {
  await page.goto('/login');
  await debugPage(page, 'login-page');
});
```

## Conclusión

Esta guía proporciona una base sólida para implementar tests E2E efectivos en VibeThink Orchestrator. Los tests E2E son cruciales para validar flujos completos de usuario y asegurar que la funcionalidad multi-tenant funcione correctamente en producción.

Recuerda mantener los tests actualizados con los cambios en la aplicación y revisar regularmente los resultados para identificar áreas de mejora. 