/**
 * Check Authentication Users and Profiles
 * 
 * Script para verificar usuarios de autenticación y perfiles
 * 
 * @author AI Pair Platform - Backend Team
 * @version 1.0.0
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const SUPABASE_URL = "https://pikywaoqlekupfynnclg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpa3l3YW9xbGVrdXBmeW5uY2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NTE3NTgsImV4cCI6MjA2NTUyNzc1OH0.jt_uLXm-GhrcrPd4VXe4ZcEHIdKH35sj5o8aABCUutE";

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
      console.log(`✅ Auth users found: ${users?.length || 0}`);
      users?.forEach((user, index) => {
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
          console.log(`      User ID: ${profile.user_id}`);
          console.log(`      Email: ${profile.email}`);
          console.log(`      Role: ${profile.role}`);
          console.log(`      Company ID: ${profile.company_id}`);
          console.log(`      Created: ${profile.created_at}`);
          console.log(`      Status: ${profile.status}`);
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
          console.log(`      Status: ${company.status}`);
          console.log(`      Plan: ${company.subscription_plan}`);
          console.log(`      Created: ${company.created_at}`);
        });
      }
    }
  } catch (err) {
    console.log(`❌ Companies check error: ${err.message}`);
  }

  // 5. Análisis de la situación
  console.log('\n📊 Analysis:');
  console.log('='.repeat(50));
  
  console.log('🔍 What you should see:');
  console.log('   - User profiles in user_profiles table ✅');
  console.log('   - Companies in companies table ✅');
  console.log('   - Auth users (limited access) ⚠️');
  
  console.log('\n💡 Why you might not see auth users:');
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
    console.log('\n✨ Check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  }); 