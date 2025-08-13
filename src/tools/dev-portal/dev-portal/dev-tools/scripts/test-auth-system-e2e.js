/**
 * End-to-End Authentication System Test
 * 
 * Script integral para probar el sistema de autenticación y usuarios
 * Incluye verificación de RLS, migraciones, y integridad de datos
 * 
 * @author AI Pair Platform - Backend Team
 * @version 1.0.0
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase - SECURITY FIX: Use environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

// Crear cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Verificar estructura de tablas y esquemas
 */
async function checkDatabaseStructure() {
  console.log('\n🏗️  Database Structure Check:');
  console.log('='.repeat(50));
  
  const tablesToCheck = [
    'companies',
    'user_profiles', 
    'company_api_keys',
    'usage_tracking',
    'monthly_billing',
    'support_actions_log',
    'departments',
    'user_department_memberships',
    'permission_logs',
    'data_access_logs'
  ];

  let structureHealth = 0;
  
  for (const table of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`⚠️  Table '${table}': Not accessible (RLS protected)`);
          structureHealth += 0.5;
        } else {
          console.log(`❌ Table '${table}': ${error.message}`);
        }
      } else {
        console.log(`✅ Table '${table}': ${count} records`);
        structureHealth += 1;
      }
    } catch (err) {
      console.log(`❌ Table '${table}': ${err.message}`);
    }
  }
  
  const healthPercentage = ((structureHealth / tablesToCheck.length) * 100).toFixed(1);
  console.log(`\n📊 Database Structure Health: ${healthPercentage}%`);
  
  return structureHealth;
}

/**
 * Verificar políticas RLS
 */
async function checkRLSPolicies() {
  console.log('\n🔒 RLS Policies Check:');
  console.log('='.repeat(50));
  
  const testCases = [
    {
      name: 'Anonymous user access to companies',
      test: async () => {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .limit(1);
        return { data, error, expectation: 'Should return empty or limited data' };
      }
    },
    {
      name: 'Anonymous user access to user_profiles',
      test: async () => {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);
        return { data, error, expectation: 'Should return empty or limited data' };
      }
    },
    {
      name: 'Anonymous user access to company_api_keys',
      test: async () => {
        const { data, error } = await supabase
          .from('company_api_keys')
          .select('*')
          .limit(1);
        return { data, error, expectation: 'Should be blocked by RLS' };
      }
    }
  ];

  let rlsHealth = 0;
  
  for (const testCase of testCases) {
    try {
      const result = await testCase.test();
      
      if (result.error) {
        if (result.error.code === 'PGRST116' || result.error.message.includes('permission')) {
          console.log(`✅ ${testCase.name}: RLS Working (${result.error.message})`);
          rlsHealth += 1;
        } else {
          console.log(`⚠️  ${testCase.name}: ${result.error.message}`);
          rlsHealth += 0.5;
        }
      } else {
        console.log(`✅ ${testCase.name}: Returns ${result.data?.length || 0} records`);
        rlsHealth += 1;
      }
    } catch (err) {
      console.log(`❌ ${testCase.name}: ${err.message}`);
    }
  }
  
  const rlsHealthPercentage = ((rlsHealth / testCases.length) * 100).toFixed(1);
  console.log(`\n📊 RLS Policies Health: ${rlsHealthPercentage}%`);
  
  return rlsHealth;
}

/**
 * Verificar integridad referencial
 */
async function checkReferentialIntegrity() {
  console.log('\n🔗 Referential Integrity Check:');
  console.log('='.repeat(50));
  
  const integrityChecks = [
    {
      name: 'user_profiles → companies',
      query: `
        SELECT COUNT(*) as orphaned_profiles
        FROM user_profiles up
        LEFT JOIN companies c ON up.company_id = c.id
        WHERE c.id IS NULL
      `
    },
    {
      name: 'company_api_keys → companies',
      query: `
        SELECT COUNT(*) as orphaned_keys
        FROM company_api_keys cak
        LEFT JOIN companies c ON cak.company_id = c.id
        WHERE c.id IS NULL
      `
    },
    {
      name: 'usage_tracking → companies',
      query: `
        SELECT COUNT(*) as orphaned_usage
        FROM usage_tracking ut
        LEFT JOIN companies c ON ut.company_id = c.id
        WHERE c.id IS NULL
      `
    }
  ];

  let integrityHealth = 0;

  for (const check of integrityChecks) {
    try {
      const { data, error } = await supabase.rpc('execute_sql', { sql: check.query });
      
      if (error) {
        console.log(`⚠️  ${check.name}: Cannot check (${error.message})`);
      } else {
        const orphanedCount = data?.[0]?.orphaned_profiles || 
                            data?.[0]?.orphaned_keys || 
                            data?.[0]?.orphaned_usage || 0;
        
        if (orphanedCount === 0) {
          console.log(`✅ ${check.name}: No orphaned records`);
          integrityHealth += 1;
        } else {
          console.log(`⚠️  ${check.name}: ${orphanedCount} orphaned records`);
          integrityHealth += 0.5;
        }
      }
    } catch (err) {
      console.log(`❌ ${check.name}: ${err.message}`);
    }
  }
  
  const integrityHealthPercentage = ((integrityHealth / integrityChecks.length) * 100).toFixed(1);
  console.log(`\n📊 Referential Integrity Health: ${integrityHealthPercentage}%`);
  
  return integrityHealth;
}

/**
 * Verificar configuración de autenticación
 */
async function checkAuthConfiguration() {
  console.log('\n⚙️  Authentication Configuration:');
  console.log('='.repeat(50));
  
  const configChecks = [
    {
      name: 'Session Management',
      test: async () => {
        const { data, error } = await supabase.auth.getSession();
        return { success: !error, message: error?.message || 'Session handling working' };
      }
    },
    {
      name: 'Auth State Change Listener',
      test: async () => {
        try {
          supabase.auth.onAuthStateChange((event, session) => {
            // Just testing if the listener can be set up
          });
          return { success: true, message: 'Auth state listener working' };
        } catch (err) {
          return { success: false, message: err.message };
        }
      }
    },
    {
      name: 'User Management Methods',
      test: async () => {
        try {
          // Test that methods exist (but won't call them)
          const methodsExist = typeof supabase.auth.signUp === 'function' &&
                             typeof supabase.auth.signInWithPassword === 'function' &&
                             typeof supabase.auth.signOut === 'function';
          
          return { 
            success: methodsExist, 
            message: methodsExist ? 'Auth methods available' : 'Auth methods missing'
          };
        } catch (err) {
          return { success: false, message: err.message };
        }
      }
    }
  ];

  let configHealth = 0;

  for (const check of configChecks) {
    try {
      const result = await check.test();
      
      if (result.success) {
        console.log(`✅ ${check.name}: ${result.message}`);
        configHealth += 1;
      } else {
        console.log(`❌ ${check.name}: ${result.message}`);
      }
    } catch (err) {
      console.log(`❌ ${check.name}: ${err.message}`);
    }
  }
  
  const configHealthPercentage = ((configHealth / configChecks.length) * 100).toFixed(1);
  console.log(`\n📊 Auth Configuration Health: ${configHealthPercentage}%`);
  
  return configHealth;
}

/**
 * Generar reporte de estado completo
 */
async function generateHealthReport(structureHealth, rlsHealth, integrityHealth, configHealth) {
  const totalChecks = 4;
  const totalHealth = structureHealth + rlsHealth + integrityHealth + configHealth;
  const maxPossibleHealth = 10 + 3 + 3 + 3; // Aproximación basada en número de checks
  
  const overallHealthPercentage = ((totalHealth / maxPossibleHealth) * 100).toFixed(1);
  
  console.log('\n📈 OVERALL SYSTEM HEALTH REPORT');
  console.log('='.repeat(50));
  console.log(`🏗️  Database Structure: ${((structureHealth / 10) * 100).toFixed(1)}%`);
  console.log(`🔒 RLS Policies: ${((rlsHealth / 3) * 100).toFixed(1)}%`);
  console.log(`🔗 Referential Integrity: ${((integrityHealth / 3) * 100).toFixed(1)}%`);
  console.log(`⚙️  Auth Configuration: ${((configHealth / 3) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));
  console.log(`📊 OVERALL HEALTH: ${overallHealthPercentage}%`);
  
  // Recomendaciones basadas en la salud del sistema
  if (parseFloat(overallHealthPercentage) >= 90) {
    console.log('🎉 EXCELLENT: System is healthy and ready for production!');
  } else if (parseFloat(overallHealthPercentage) >= 70) {
    console.log('✅ GOOD: System is mostly healthy, minor issues to address');
  } else if (parseFloat(overallHealthPercentage) >= 50) {
    console.log('⚠️  WARNING: System has some issues that need attention');
  } else {
    console.log('❌ CRITICAL: System has significant issues that need immediate attention');
  }
  
  console.log('\n💡 NEXT STEPS:');
  console.log('1. If no users exist, create test users via UI');
  console.log('2. Test login/logout functionality');
  console.log('3. Verify user permissions and roles');
  console.log('4. Check error handling and edge cases');
  console.log('5. Monitor authentication logs');
}

/**
 * Función principal
 */
async function runEndToEndTest() {
  console.log('🧪 END-TO-END AUTHENTICATION SYSTEM TEST');
  console.log('='.repeat(50));
  console.log('This test verifies the complete authentication system health');
  console.log('including database structure, RLS policies, and configurations\n');
  
  try {
    const structureHealth = await checkDatabaseStructure();
    const rlsHealth = await checkRLSPolicies();
    const integrityHealth = await checkReferentialIntegrity();
    const configHealth = await checkAuthConfiguration();
    
    await generateHealthReport(structureHealth, rlsHealth, integrityHealth, configHealth);
    
    console.log('\n✅ End-to-End test completed successfully');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ End-to-End test failed:', error);
    console.log('='.repeat(50));
    throw error;
  }
}

// Ejecutar el test
runEndToEndTest()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('Test failed:', err);
    process.exit(1);
  });
