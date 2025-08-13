/**
 * Check Authentication Users and Profiles
 * 
 * Script para verificar usuarios de autenticación y perfiles
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
 * Verificar usuarios de autenticación y perfiles
 */
async function checkAuthUsers() {
  console.log('🔐 Checking Authentication Users and Profiles...\n');
  
  // 1. Verificar sesión actual
  console.log('📋 Current Session:');
  console.log('='.repeat(50));
  
  try {
    const { data: session, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log(`❌ Session error: ${error.message}`);
    } else if (session.session) {
      console.log('✅ User authenticated:');
      console.log(`   User ID: ${session.session.user.id}`);
      console.log(`   Email: ${session.session.user.email}`);
      console.log(`   Created: ${session.session.user.created_at}`);
    } else {
      console.log('ℹ️  No user authenticated (this is normal)');
    }
  } catch (err) {
    console.log(`❌ Session check error: ${err.message}`);
  }

  // 2. Verificar usuarios en auth.users (solo si tienes permisos)
  console.log('\n👥 Auth Users (if accessible):');
  console.log('='.repeat(50));
  
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log(`❌ Auth users error: ${error.message}`);
      console.log('   → This is normal - anon key cannot access auth.users');
    } else {
      console.log(`✅ Auth users found: ${users?.users?.length || 0}`);
      users?.users?.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.id})`);
      });
    }
  } catch (err) {
    console.log(`❌ Auth users check error: ${err.message}`);
    console.log('   → This is expected - anon key has limited access');
  }

  // 3. Verificar perfiles de usuario
  console.log('\n👤 User Profiles:');
  console.log('='.repeat(50));
  
  try {
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log(`❌ Profiles error: ${error.message}`);
    } else {
      console.log(`✅ User profiles found: ${profiles?.length || 0}`);
      
      if (profiles && profiles.length > 0) {
        profiles.forEach((profile, index) => {
          console.log(`\n   ${index + 1}. Profile Details:`);
          console.log(`      ID: ${profile.id}`);
          console.log(`      Email: ${profile.email}`);
          console.log(`      Full Name: ${profile.full_name}`);
          console.log(`      Role: ${profile.role}`);
          console.log(`      Company ID: ${profile.company_id}`);
          console.log(`      Active: ${profile.is_active}`);
          console.log(`      Created: ${profile.created_at}`);
        });
      }
    }
  } catch (err) {
    console.log(`❌ Profiles check error: ${err.message}`);
  }

  // 4. Verificar empresas
  console.log('\n🏢 Companies:');
  console.log('='.repeat(50));
  
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log(`❌ Companies error: ${error.message}`);
    } else {
      console.log(`✅ Companies found: ${companies?.length || 0}`);
      
      if (companies && companies.length > 0) {
        companies.forEach((company, index) => {
          console.log(`\n   ${index + 1}. Company Details:`);
          console.log(`      ID: ${company.id}`);
          console.log(`      Name: ${company.name}`);
          console.log(`      Slug: ${company.slug}`);
          console.log(`      Status: ${company.status}`);
          console.log(`      Plan: ${company.subscription_plan}`);
          console.log(`      Max Users: ${company.max_users}`);
          console.log(`      Created: ${company.created_at}`);
        });
      }
    }
  } catch (err) {
    console.log(`❌ Companies check error: ${err.message}`);
  }

  // 5. Verificar migraciones aplicadas
  console.log('\n📋 Database Status:');
  console.log('='.repeat(50));
  
  try {
    // Verificar algunas tablas clave
    const tables = ['companies', 'user_profiles', 'usage_tracking'];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`);
        } else {
          console.log(`✅ Table '${table}': ${count} records`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`);
      }
    }
  } catch (err) {
    console.log(`❌ Database status error: ${err.message}`);
  }

  // Resumen y próximos pasos
  console.log('\n💡 Summary:');
  console.log('='.repeat(50));
  console.log('   1. Anon key has limited access to auth.users');
  console.log('   2. Users need to register/login first');
  console.log('   3. RLS policies might be blocking access');
  console.log('   4. You need to authenticate to see user data');
  
  console.log('\n🚀 Next steps:');
  console.log('   1. Open http://localhost:8080');
  console.log('   2. Try to register/login');
  console.log('   3. Check if users appear in auth system');

  console.log('\n' + '='.repeat(50));
  console.log('📊 AUTH USERS CHECK COMPLETED');
  console.log('='.repeat(50));
}

// Ejecutar el check
checkAuthUsers()
  .then(() => {
    console.log('\n✅ Check completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Check failed:', err);
    process.exit(1);
  });
