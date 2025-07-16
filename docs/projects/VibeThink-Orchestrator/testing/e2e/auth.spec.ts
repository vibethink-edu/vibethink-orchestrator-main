/**
 * Authentication E2E Tests
 * 
 * End-to-end tests for authentication flows including:
 * - Login/logout functionality
 * - Role-based access control
 * - Multi-tenant security
 * - Error handling
 * 
 * @author AI Pair Platform - Testing Team
 * @version 1.0.0
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test.describe('Login Flow', () => {
    test('should display login form correctly', async ({ page }) => {
      // Check form elements are present
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
      
      // Check form validation
      await expect(page.getByText(/enter your email and password/i)).toBeVisible();
    });

    test('should validate form inputs', async ({ page }) => {
      // Test empty form submission
      await page.getByRole('button', { name: /sign in/i }).click();
      
      // Should show validation errors
      await expect(page.getByText(/email is required/i)).toBeVisible();
      await expect(page.getByText(/password is required/i)).toBeVisible();
    });

    test('should show error for invalid email format', async ({ page }) => {
      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page.getByText(/enter a valid email/i)).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      // Use test credentials
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard');
      
      // Should show user information
      await expect(page.getByText(/welcome/i)).toBeVisible();
      await expect(page.getByText(/test company a/i)).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.getByLabel(/email/i).fill('wrong@example.com');
      await page.getByLabel(/password/i).fill('wrongpassword');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      // Should show error message
      await expect(page.getByText(/error signing in/i)).toBeVisible();
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network error
      await page.route('**/auth/v1/token', route => {
        route.abort('failed');
      });
      
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      // Should show error message
      await expect(page.getByText(/network error/i)).toBeVisible();
    });
  });

  test.describe('Logout Flow', () => {
    test('should logout successfully', async ({ page }) => {
      // Login first
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      // Wait for dashboard to load
      await expect(page).toHaveURL('/dashboard');
      
      // Click logout
      await page.getByRole('button', { name: /user menu/i }).click();
      await page.getByRole('button', { name: /sign out/i }).click();
      
      // Should redirect to login page
      await expect(page).toHaveURL('/login');
      
      // Should not show user information
      await expect(page.getByText(/welcome/i)).not.toBeVisible();
    });
  });

  test.describe('Role-Based Access Control', () => {
    test('should show admin features for admin user', async ({ page }) => {
      // Login as admin
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Should show admin navigation
      await expect(page.getByRole('link', { name: /admin/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /users/i })).toBeVisible();
    });

    test('should show employee features for employee user', async ({ page }) => {
      // Login as employee
      await page.getByLabel(/email/i).fill('employee@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Should not show admin navigation
      await expect(page.getByRole('link', { name: /admin/i })).not.toBeVisible();
      await expect(page.getByRole('link', { name: /users/i })).not.toBeVisible();
    });

    test('should show owner features for owner user', async ({ page }) => {
      // Login as owner
      await page.getByLabel(/email/i).fill('owner@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Should show all navigation options
      await expect(page.getByRole('link', { name: /admin/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /users/i })).toBeVisible();
    });
  });

  test.describe('Multi-Tenant Security', () => {
    test('should isolate company data', async ({ page }) => {
      // Login as admin from company A
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Should show company A data
      await expect(page.getByText(/test company a/i)).toBeVisible();
      
      // Should not show company B data
      await expect(page.getByText(/test company b/i)).not.toBeVisible();
    });

    test('should prevent cross-company data access', async ({ page }) => {
      // Login as admin from company A
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Try to access company B data via URL manipulation
      await page.goto('/admin/companies/test-company-b');
      
      // Should show access denied or redirect
      await expect(page.getByText(/access denied/i)).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      // Try to access protected route without login
      await page.goto('/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL('/login');
    });

    test('should redirect to dashboard after successful login', async ({ page }) => {
      // Try to access protected route
      await page.goto('/admin');
      
      // Should redirect to login
      await expect(page).toHaveURL('/login');
      
      // Login
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      // Should redirect to originally requested page
      await expect(page).toHaveURL('/admin');
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      // Login
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Refresh page
      await page.reload();
      
      // Should still be logged in
      await expect(page).toHaveURL('/dashboard');
      await expect(page.getByText(/welcome/i)).toBeVisible();
    });

    test('should handle expired sessions gracefully', async ({ page }) => {
      // Login
      await page.getByLabel(/email/i).fill('admin@testcompany.com');
      await page.getByLabel(/password/i).fill('12345');
      await page.getByRole('button', { name: /sign in/i }).click();
      
      await expect(page).toHaveURL('/dashboard');
      
      // Mock session expiration
      await page.evaluate(() => {
        localStorage.removeItem('supabase.auth.token');
      });
      
      // Refresh page
      await page.reload();
      
      // Should redirect to login
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Navigate to email field
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/email/i)).toBeFocused();
      
      // Navigate to password field
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/password/i)).toBeFocused();
      
      // Navigate to submit button
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: /sign in/i })).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check form labels
      await expect(page.getByLabel(/email/i)).toHaveAttribute('aria-required', 'true');
      await expect(page.getByLabel(/password/i)).toHaveAttribute('aria-required', 'true');
      
      // Check button labels
      await expect(page.getByRole('button', { name: /sign in/i })).toHaveAttribute('type', 'submit');
    });

    test('should show error messages with proper ARIA attributes', async ({ page }) => {
      // Submit empty form
      await page.getByRole('button', { name: /sign in/i }).click();
      
      // Check error messages have proper ARIA attributes
      await expect(page.getByText(/email is required/i)).toHaveAttribute('role', 'alert');
      await expect(page.getByText(/password is required/i)).toHaveAttribute('role', 'alert');
    });
  });
}); 