import { test, expect } from '@playwright/test';

/**
 * Script genérico de Playwright para pruebas E2E de UI.
 * - Modifica las rutas y selectores según tu proyecto.
 * - Ejecuta con: npx playwright test tests/e2e/playwright-generic-template.spec.ts
 */

test('Login, navegación a settings y cambio de tema', async ({ page }) => {
  // 1. Ir a la página de login
  await page.goto('http://localhost:3000/login');

  // 2. Completar login (ajusta los selectores según tu formulario)
  await page.fill('input[name="email"]', 'usuario@demo.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // 3. Esperar a que cargue el dashboard
  await page.waitForURL('**/dashboard');

  // 4. Abrir menú de usuario (ajusta el selector según tu UI)
  await page.click('[data-testid="user-avatar"]');

  // 5. Ir a la pantalla de settings
  await page.click('text=Configuración Avanzada');
  await page.waitForURL('**/settings');

  // 6. Cambiar el tema (ajusta el selector según tu ThemeSwitcher)
  await page.click('[data-testid="theme-switcher"]');
  await page.click('text=Blue'); // Ejemplo: seleccionar tema "Blue"

  // 7. Validar que el tema cambió (puedes validar una clase, color, etc.)
  // await expect(page.locator('body')).toHaveClass(/theme-blue/);

  // 8. (Opcional) Validar persistencia tras recarga
  await page.reload();
  // await expect(page.locator('body')).toHaveClass(/theme-blue/);
}); 