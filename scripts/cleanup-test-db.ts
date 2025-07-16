#!/usr/bin/env tsx

/**
 * Test Database Cleanup Script
 * 
 * Limpia la base de datos de test removiendo:
 * - Datos de prueba
 * - Usuarios de test
 * - Configuraciones temporales
 * 
 * @author AI Pair Platform - Testing Team
 * @version 1.0.0
 */

import { createClient } from '@supabase/supabase-js';

async function main() {
  console.log('🧹 Cleaning up test database...');

  // Verificar variables de entorno
  const supabaseUrl = process.env.TEST_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.TEST_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Please set TEST_SUPABASE_URL and TEST_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  // Inicializar cliente Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Verificar conexión
    const { data: healthCheck, error: healthError } = await supabase
      .from('companies')
      .select('count')
      .limit(1);

    if (healthError) {
      console.error('❌ Database connection failed:', healthError.message);
      process.exit(1);
    }

    console.log('✅ Database connection successful');

    // Cleanup test data
    await cleanupTestData(supabase);

    console.log('✅ Test database cleanup completed successfully');
  } catch (error) {
    console.error('❌ Test database cleanup failed:', error);
    process.exit(1);
  }
}

async function cleanupTestData(supabase: any) {
  console.log('🗑️ Removing test data...');

  // Cleanup usage tracking
  console.log('📊 Cleaning up usage tracking...');
  const { error: usageError } = await supabase
    .from('usage_tracking')
    .delete()
    .like('company_id', 'test-%');

  if (usageError) {
    console.warn('⚠️ Warning: Could not cleanup usage data:', usageError.message);
  } else {
    console.log('✅ Usage tracking cleaned up');
  }

  // Cleanup monthly billing
  console.log('💰 Cleaning up monthly billing...');
  const { error: billingError } = await supabase
    .from('monthly_billing')
    .delete()
    .like('company_id', 'test-%');

  if (billingError) {
    console.warn('⚠️ Warning: Could not cleanup billing data:', billingError.message);
  } else {
    console.log('✅ Monthly billing cleaned up');
  }

  // Cleanup configuration overrides
  console.log('⚙️ Cleaning up configuration overrides...');
  const { error: configError } = await supabase
    .from('company_configuration_overrides')
    .delete()
    .like('company_id', 'test-%');

  if (configError) {
    console.warn('⚠️ Warning: Could not cleanup configuration overrides:', configError.message);
  } else {
    console.log('✅ Configuration overrides cleaned up');
  }

  // Cleanup audit logs
  console.log('📝 Cleaning up audit logs...');
  const { error: auditError } = await supabase
    .from('configuration_audit_log')
    .delete()
    .like('company_id', 'test-%');

  if (auditError) {
    console.warn('⚠️ Warning: Could not cleanup audit logs:', auditError.message);
  } else {
    console.log('✅ Audit logs cleaned up');
  }

  // Cleanup users
  console.log('👥 Cleaning up test users...');
  const testUserIds = [
    'test-admin-user',
    'test-employee-user',
    'test-manager-user',
    'test-owner-user',
    'test-super-admin',
  ];

  for (const userId of testUserIds) {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.warn(`⚠️ Warning: Could not cleanup user ${userId}:`, error.message);
    } else {
      console.log(`✅ Cleaned up user: ${userId}`);
    }
  }

  // Cleanup companies
  console.log('🏢 Cleaning up test companies...');
  const testCompanySlugs = [
    'test-company-a',
    'test-company-b',
    'test-company-c',
  ];

  for (const slug of testCompanySlugs) {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.warn(`⚠️ Warning: Could not cleanup company ${slug}:`, error.message);
    } else {
      console.log(`✅ Cleaned up company: ${slug}`);
    }
  }

  // Cleanup test configurations
  console.log('🔧 Cleaning up test configurations...');
  const testConfigKeys = [
    'test_openai_models',
    'test_google_workspace',
    'test_password_policy',
    'test_subscription_plans',
  ];

  for (const configKey of testConfigKeys) {
    const { error } = await supabase
      .from('platform_configurations')
      .delete()
      .eq('config_key', configKey);

    if (error) {
      console.warn(`⚠️ Warning: Could not cleanup configuration ${configKey}:`, error.message);
    } else {
      console.log(`✅ Cleaned up configuration: ${configKey}`);
    }
  }

  // Cleanup any remaining test data
  console.log('🧹 Cleaning up any remaining test data...');
  
  // Cleanup any data with test prefixes
  const tablesToClean = [
    'usage_tracking',
    'monthly_billing',
    'user_profiles',
    'companies',
  ];

  for (const table of tablesToClean) {
    try {
      // Get all records with test prefixes
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .or('id.like.test-%,company_id.like.test-%,email.like.test%@%');

      if (error) {
        console.warn(`⚠️ Warning: Could not query ${table}:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        console.log(`Found ${data.length} test records in ${table}`);
        
        // Delete test records
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .or('id.like.test-%,company_id.like.test-%,email.like.test%@%');

        if (deleteError) {
          console.warn(`⚠️ Warning: Could not cleanup ${table}:`, deleteError.message);
        } else {
          console.log(`✅ Cleaned up ${data.length} records from ${table}`);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Warning: Error cleaning up ${table}:`, error);
    }
  }

  console.log('✅ All test data cleanup completed');
}

// Función para verificar si hay datos de test
export async function checkTestData(supabase: any): Promise<boolean> {
  try {
    // Check for test companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('count')
      .like('slug', 'test-%');

    if (companiesError) {
      console.warn('Warning: Could not check for test companies:', companiesError.message);
    } else if (companies && companies.length > 0) {
      console.log(`Found ${companies.length} test companies`);
      return true;
    }

    // Check for test users
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('count')
      .like('id', 'test-%');

    if (usersError) {
      console.warn('Warning: Could not check for test users:', usersError.message);
    } else if (users && users.length > 0) {
      console.log(`Found ${users.length} test users`);
      return true;
    }

    // Check for test usage data
    const { data: usage, error: usageError } = await supabase
      .from('usage_tracking')
      .select('count')
      .like('company_id', 'test-%');

    if (usageError) {
      console.warn('Warning: Could not check for test usage data:', usageError.message);
    } else if (usage && usage.length > 0) {
      console.log(`Found ${usage.length} test usage records`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking for test data:', error);
    return false;
  }
}

// Función para listar datos de test
export async function listTestData(supabase: any) {
  console.log('📋 Listing test data...');

  try {
    // List test companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .like('slug', 'test-%');

    if (companiesError) {
      console.warn('Warning: Could not list test companies:', companiesError.message);
    } else {
      console.log(`\n🏢 Test Companies (${companies?.length || 0}):`);
      companies?.forEach(company => {
        console.log(`  - ${company.name} (${company.slug}) - ${company.status}`);
      });
    }

    // List test users
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('*')
      .like('id', 'test-%');

    if (usersError) {
      console.warn('Warning: Could not list test users:', usersError.message);
    } else {
      console.log(`\n👥 Test Users (${users?.length || 0}):`);
      users?.forEach(user => {
        console.log(`  - ${user.full_name} (${user.email}) - ${user.role}`);
      });
    }

    // List test usage data
    const { data: usage, error: usageError } = await supabase
      .from('usage_tracking')
      .select('*')
      .like('company_id', 'test-%');

    if (usageError) {
      console.warn('Warning: Could not list test usage data:', usageError.message);
    } else {
      console.log(`\n📊 Test Usage Data (${usage?.length || 0}):`);
      usage?.forEach(record => {
        console.log(`  - ${record.service_name}: ${record.amount} ($${record.cost_usd})`);
      });
    }

  } catch (error) {
    console.error('Error listing test data:', error);
  }
}

// Ejecutar el script
if (require.main === module) {
  main().catch(console.error);
} 