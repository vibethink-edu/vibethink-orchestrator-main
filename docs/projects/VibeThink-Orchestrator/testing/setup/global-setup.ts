/**
 * Playwright Global Setup
 * 
 * Setup tasks that run once before all tests:
 * - Database setup and seeding
 * - Authentication setup
 * - Environment configuration
 * - Test data preparation
 * 
 * @author AI Pair Platform - Testing Team
 * @version 1.0.0
 */

import { chromium, FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');

  // Setup test environment variables
  process.env.NODE_ENV = 'test';
  process.env.VITE_SUPABASE_URL = process.env.TEST_SUPABASE_URL || 'https://test.supabase.co';
  process.env.VITE_SUPABASE_ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY || 'test-anon-key';

  // Initialize Supabase client for test data setup
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );

  try {
    // Setup test database
    await setupTestDatabase(supabase);
    
    // Setup test authentication
    await setupTestAuthentication();
    
    // Setup test companies and users
    await setupTestData(supabase);
    
    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

async function setupTestDatabase(supabase: any) {
  console.log('📊 Setting up test database...');

  // Create test companies
  const testCompanies = [
    {
      name: 'Test Company A',
      slug: 'test-company-a',
      status: 'ACTIVE',
      subscription_plan: 'PROFESSIONAL',
      max_users: 25,
      max_monthly_ai_requests: 10000,
      max_monthly_scraping_pages: 1000,
    },
    {
      name: 'Test Company B',
      slug: 'test-company-b',
      status: 'TRIAL',
      subscription_plan: 'STARTER',
      max_users: 5,
      max_monthly_ai_requests: 1000,
      max_monthly_scraping_pages: 100,
    },
  ];

  for (const company of testCompanies) {
    const { error } = await supabase
      .from('companies')
      .upsert(company, { onConflict: 'slug' });
    
    if (error) {
      console.warn(`Warning: Could not setup company ${company.slug}:`, error.message);
    }
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
    {
      id: 'test-owner-user',
      email: 'owner@testcompany.com',
      full_name: 'Test Owner',
      role: 'OWNER',
      company_id: 'test-company-b',
      is_active: true,
    },
  ];

  for (const user of testUsers) {
    const { error } = await supabase
      .from('user_profiles')
      .upsert(user, { onConflict: 'id' });
    
    if (error) {
      console.warn(`Warning: Could not setup user ${user.email}:`, error.message);
    }
  }

  // Create test configurations
  const testConfigurations = [
    {
      category: 'ai_models',
      config_key: 'openai_models',
      config_value: { models: ['gpt-4', 'gpt-3.5-turbo'] },
      description: 'Available OpenAI models',
      is_active: true,
    },
    {
      category: 'integrations',
      config_key: 'google_workspace',
      config_value: { enabled: true, scopes: ['drive', 'docs'] },
      description: 'Google Workspace integration settings',
      is_active: true,
    },
  ];

  for (const config of testConfigurations) {
    const { error } = await supabase
      .from('platform_configurations')
      .upsert(config, { onConflict: 'category,config_key' });
    
    if (error) {
      console.warn(`Warning: Could not setup configuration ${config.config_key}:`, error.message);
    }
  }
}

async function setupTestAuthentication() {
  console.log('🔐 Setting up test authentication...');

  // Create test authentication tokens
  const testTokens = {
    'admin@testcompany.com': 'test-admin-token',
    'employee@testcompany.com': 'test-employee-token',
    'owner@testcompany.com': 'test-owner-token',
  };

  // Store tokens in environment for tests to use
  process.env.TEST_TOKENS = JSON.stringify(testTokens);
}

async function setupTestData(supabase: any) {
  console.log('📝 Setting up test data...');

  // Create test usage data
  const testUsage = [
    {
      company_id: 'test-company-a',
      user_id: 'test-admin-user',
      service_name: 'openai',
      usage_type: 'ai_generation',
      amount: 500,
      cost_usd: 0.01,
    },
    {
      company_id: 'test-company-a',
      user_id: 'test-employee-user',
      service_name: 'openai',
      usage_type: 'ai_generation',
      amount: 200,
      cost_usd: 0.004,
    },
  ];

  for (const usage of testUsage) {
    const { error } = await supabase
      .from('usage_tracking')
      .insert(usage);
    
    if (error) {
      console.warn(`Warning: Could not setup usage data:`, error.message);
    }
  }

  // Create test monthly billing
  const testBilling = [
    {
      company_id: 'test-company-a',
      billing_month: '2024-01-01',
      total_cost_usd: 0.014,
      ai_tokens_used: 700,
      scraping_pages_used: 50,
      storage_mb_used: 100,
      status: 'PENDING',
    },
  ];

  for (const billing of testBilling) {
    const { error } = await supabase
      .from('monthly_billing')
      .upsert(billing, { onConflict: 'company_id,billing_month' });
    
    if (error) {
      console.warn(`Warning: Could not setup billing data:`, error.message);
    }
  }
}

export default globalSetup; 