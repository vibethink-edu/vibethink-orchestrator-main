/**
 * Multi-Tenant E2E Tests
 * 
 * End-to-end tests for multi-tenant functionality including:
 * - Company data isolation
 * - Cross-company access prevention
 * - Role-based permissions across companies
 * - Super admin functionality
 * 
 * @author AI Pair Platform - Testing Team
 * @version 1.0.0
 */

import { test, expect } from '@playwright/test';

test.describe('Multi-Tenant Security', () => {
  test.describe('Company Data Isolation', () => {
    test('should isolate company data for regular users', async ({ page }) => {
      // Login as admin from company A
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Navigate to admin panel
      await page.getByRole('link', { name: /admin/i }).click();
      
      // Should only show company A data
      await expect(page.getByText(/test company a/i)).toBeVisible();
      await expect(page.getByText(/test company b/i)).not.toBeVisible();
      
      // Check user management shows only company A users
      await page.getByRole('link', { name: /users/i }).click();
      await expect(page.getByText(/admin@testcompany.com/i)).toBeVisible();
      await expect(page.getByText(/employee@testcompany.com/i)).toBeVisible();
      await expect(page.getByText(/owner@testcompany.com/i)).not.toBeVisible();
    });

    test('should prevent URL manipulation for cross-company access', async ({ page }) => {
      // Login as admin from company A
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Try to access company B data directly via URL
      await page.goto('/admin/companies/test-company-b');
      
      // Should show access denied or redirect
      await expect(page.getByText(/access denied/i)).toBeVisible();
    });

    test('should isolate usage data between companies', async ({ page }) => {
      // Login as admin from company A
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Navigate to usage/billing section
      await page.getByRole('link', { name: /admin/i }).click();
      await page.getByText(/limits and configuration/i).click();
      
      // Should only show company A usage data
      await expect(page.getByText(/test company a/i)).toBeVisible();
      await expect(page.getByText(/test company b/i)).not.toBeVisible();
    });
  });

  test.describe('Super Admin Functionality', () => {
    test('should allow super admin to access all companies', async ({ page }) => {
      // Login as super admin
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@VibeThink.co');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Should show super admin navigation
      await expect(page.getByRole('link', { name: /super admin/i })).toBeVisible();
      
      // Navigate to super admin panel
      await page.getByRole('link', { name: /super admin/i }).click();
      
      // Should show all companies
      await expect(page.getByText(/test company a/i)).toBeVisible();
      await expect(page.getByText(/test company b/i)).toBeVisible();
    });

    test('should allow super admin to manage all companies', async ({ page }) => {
      // Login as super admin
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@VibeThink.co');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Navigate to super admin panel
      await page.getByRole('link', { name: /super admin/i }).click();
      
      // Should be able to view company A details
      await page.getByText(/test company a/i).click();
      await expect(page.getByText(/company management/i)).toBeVisible();
      
      // Should be able to view company B details
      await page.getByText(/test company b/i).click();
      await expect(page.getByText(/company management/i)).toBeVisible();
    });

    test('should allow super admin to manage platform configurations', async ({ page }) => {
      // Login as super admin
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@VibeThink.co');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Navigate to super admin panel
      await page.getByRole('link', { name: /super admin/i }).click();
      
      // Should show global configuration options
      await expect(page.getByText(/global configuration/i)).toBeVisible();
      await expect(page.getByText(/platform configurations/i)).toBeVisible();
    });
  });

  test.describe('Role-Based Access Across Companies', () => {
    test('should enforce role permissions within company', async ({ page }) => {
      // Login as employee (lower role)
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('employee@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Should not show admin navigation
      await expect(page.getByRole('link', { name: /admin/i })).not.toBeVisible();
      
      // Try to access admin URL directly
      await page.goto('/admin');
      
      // Should show access denied
      await expect(page.getByText(/access denied/i)).toBeVisible();
    });

    test('should allow owner to manage company settings', async ({ page }) => {
      // Login as owner
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('owner@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Should show admin navigation
      await expect(page.getByRole('link', { name: /admin/i })).toBeVisible();
      
      // Navigate to admin panel
      await page.getByRole('link', { name: /admin/i }).click();
      
      // Should be able to access all admin features
      await expect(page.getByText(/user management/i)).toBeVisible();
      await expect(page.getByText(/permissions and roles/i)).toBeVisible();
      await expect(page.getByText(/limits and configuration/i)).toBeVisible();
    });
  });

  test.describe('Data Validation and Security', () => {
    test('should validate company_id in all API requests', async ({ page }) => {
      // Login as admin
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Intercept API requests to verify company_id is included
      const requests: string[] = [];
      page.on('request', request => {
        if (request.url().includes('/rest/v1/')) {
          requests.push(request.url());
        }
      });
      
      // Navigate to admin panel to trigger API calls
      await page.getByRole('link', { name: /admin/i }).click();
      
      // Verify requests include company filtering
      expect(requests.some(req => req.includes('company_id'))).toBe(true);
    });

    test('should prevent SQL injection attempts', async ({ page }) => {
      // Login as admin
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Try to inject malicious data in search fields
      const maliciousInput = "'; DROP TABLE companies; --";
      
      // Navigate to admin panel
      await page.getByRole('link', { name: /admin/i }).click();
      
      // Try to use malicious input in search
      await page.getByPlaceholder(/search/i).fill(maliciousInput);
      await page.keyboard.press('Enter');
      
      // Should handle gracefully without errors
      await expect(page.getByText(/error/i)).not.toBeVisible();
    });

    test('should handle concurrent access from different companies', async ({ page, context }) => {
      // Create second page for concurrent access
      const page2 = await context.newPage();
      
      // Login as admin from company A on first page
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      // Login as owner from company B on second page
      await page2.goto('/login');
      await page2.getByLabel(/email/i).fill('owner@testcompany.com');
      await page2.getByLabel(/password/i).fill('12345');
      await page2.getByRole('button', { name: /sign in/i }).click();
      
      // Both should be able to access their respective data
      await expect(page.getByText(/test company a/i)).toBeVisible();
      await expect(page2.getByText(/test company b/i)).toBeVisible();
      
      // Company A should not see Company B data
      await expect(page.getByText(/test company b/i)).not.toBeVisible();
      
      // Company B should not see Company A data
      await expect(page2.getByText(/test company a/i)).not.toBeVisible();
      
      await page2.close();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle missing company_id gracefully', async ({ page }) => {
      // Mock user without company_id
      await page.addInitScript(() => {
        localStorage.setItem('test-user-no-company', JSON.stringify({
          id: 'test-user-no-company',
          email: 'nocompany@example.com',
          role: 'ADMIN'
        }));
      });
      
      // Try to access dashboard without company
      await page.goto('/dashboard');
      
      // Should show appropriate error or redirect
      await expect(page.getByText(/company not found/i)).toBeVisible();
    });

    test('should handle company status changes', async ({ page }) => {
      // Login as admin
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Mock company status change to SUSPENDED
      await page.evaluate(() => {
        const user = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
        user.company = { ...user.company, status: 'SUSPENDED' };
        localStorage.setItem('supabase.auth.token', JSON.stringify(user));
      });
      
      // Refresh page
      await page.reload();
      
      // Should show suspended company message
      await expect(page.getByText(/company suspended/i)).toBeVisible();
    });

    test('should handle network errors during company data fetch', async ({ page }) => {
      // Login as admin
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Mock network error for company data
      await page.route('**/rest/v1/companies**', route => {
        route.abort('failed');
      });
      
      // Navigate to admin panel
      await page.getByRole('link', { name: /admin/i }).click();
      
      // Should show error message
      await expect(page.getByText(/error loading data/i)).toBeVisible();
    });
  });
}); 