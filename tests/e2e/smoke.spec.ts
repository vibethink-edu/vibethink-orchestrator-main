import { test, expect } from '@playwright/test';

const WEBSITE = process.env.WEBSITE_URL || 'http://localhost:3000';
const DASHBOARD = process.env.DASHBOARD_URL || 'http://localhost:3001';

const dashboardRoutes = [
  '/ai-chat-dashboard',
  '/calendar-dashboard',
  '/crm-dashboard',
  '/crypto-dashboard',
  '/file-manager-dashboard',
  '/finance-dashboard',
  '/kanban-dashboard',
  '/mail-dashboard',
  '/notes-dashboard',
  '/pos-system-dashboard',
  '/project-management-dashboard',
  '/sales-dashboard',
  '/tasks-dashboard',
  '/website-analytics-dashboard',
];

test.describe('Smoke - Website', () => {
  test('home renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    const res = await page.goto(WEBSITE, { waitUntil: 'domcontentloaded' });
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    expect(errors, errors.join('\n')).toHaveLength(0);
  });
});

test.describe('Smoke - Dashboard routes', () => {
  for (const route of dashboardRoutes) {
    test(route, async ({ page }) => {
      const url = `${DASHBOARD}${route}`;
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      const res = await page.goto(url, { waitUntil: 'domcontentloaded' });
      expect(res?.ok()).toBeTruthy();
      await expect(page.locator('body')).toBeVisible();
      expect(errors, errors.join('\n')).toHaveLength(0);
    });
  }
});






