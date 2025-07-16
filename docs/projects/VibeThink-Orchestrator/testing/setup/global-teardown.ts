/**
 * Playwright Global Teardown
 * 
 * Cleanup tasks that run once after all tests:
 * - Database cleanup
 * - Test data removal
 * - Environment cleanup
 * - Resource cleanup
 * 
 * @author AI Pair Platform - Testing Team
 * @version 1.0.0
 */

import { FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test cleanup...');

  // Initialize Supabase client for cleanup
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
    // Don't throw error in teardown to avoid masking test failures
  }
}

async function cleanupTestData(supabase: any) {
  console.log('🗑️ Cleaning up test data...');

  // Cleanup usage tracking
  const { error: usageError } = await supabase
    .from('usage_tracking')
    .delete()
    .like('company_id', 'test-%');
  
  if (usageError) {
    console.warn('Warning: Could not cleanup usage data:', usageError.message);
  }

  // Cleanup monthly billing
  const { error: billingError } = await supabase
    .from('monthly_billing')
    .delete()
    .like('company_id', 'test-%');
  
  if (billingError) {
    console.warn('Warning: Could not cleanup billing data:', billingError.message);
  }

  // Cleanup configuration overrides
  const { error: configError } = await supabase
    .from('company_configuration_overrides')
    .delete()
    .like('company_id', 'test-%');
  
  if (configError) {
    console.warn('Warning: Could not cleanup configuration overrides:', configError.message);
  }

  // Cleanup audit logs
  const { error: auditError } = await supabase
    .from('configuration_audit_log')
    .delete()
    .like('company_id', 'test-%');
  
  if (auditError) {
    console.warn('Warning: Could not cleanup audit logs:', auditError.message);
  }
}

async function cleanupTestUsers(supabase: any) {
  console.log('👥 Cleaning up test users...');

  const testUserIds = [
    'test-admin-user',
    'test-employee-user',
    'test-owner-user',
  ];

  for (const userId of testUserIds) {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.warn(`Warning: Could not cleanup user ${userId}:`, error.message);
    }
  }
}

async function cleanupTestCompanies(supabase: any) {
  console.log('🏢 Cleaning up test companies...');

  const testCompanySlugs = [
    'test-company-a',
    'test-company-b',
  ];

  for (const slug of testCompanySlugs) {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('slug', slug);
    
    if (error) {
      console.warn(`Warning: Could not cleanup company ${slug}:`, error.message);
    }
  }
}

export default globalTeardown; 