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
  // TODO: log '🔐 Checking Authentication Users and Profiles...\n'
  
  // 1. Verificar sesión actual
  // TODO: log '📋 Current Session:'
  // TODO: log '='.repeat(50)
  
  try {
    const { data: session, error } = await supabase.auth.getSession();
    
    if (error) {
      // TODO: log `❌ Session error: ${error.message}`
    } else if (session.session) {
      // TODO: log '✅ User authenticated:'
      // TODO: log `   User ID: ${session.session.user.id}`
      // TODO: log `   Email: ${session.session.user.email}`
      // TODO: log `   Created: ${session.session.user.created_at}`
    } else {
      // TODO: log 'ℹ️  No user authenticated (this is normal)'
    }
  } catch (err) {
    // TODO: log `❌ Session check error: ${err.message}`
  }

  // 2. Verificar usuarios en auth.users (solo si tienes permisos)
  // TODO: log '\n👥 Auth Users (if accessible):'
  // TODO: log '='.repeat(50)
  
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      // TODO: log `❌ Auth users error: ${error.message}`
      // TODO: log '   → This is normal - anon key cannot access auth.users'
    } else {
      // TODO: log `✅ Auth users found: ${users?.length || 0}`
      // TODO: log `   ${index + 1}. ${user.email} (${user.id})`
    }
  } catch (err) {
    // TODO: log `❌ Auth users check error: ${err.message}`
    // TODO: log '   → This is expected - anon key has limited access'
  }

  // 3. Verificar perfiles de usuario
  // TODO: log '\n👤 User Profiles:'
  // TODO: log '='.repeat(50)
  
  try {
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // TODO: log `❌ Profiles error: ${error.message}`
    } else {
      // TODO: log `✅ User profiles found: ${profiles?.length || 0}`
      
      if (profiles && profiles.length > 0) {
        // TODO: log `\n   ${index + 1}. Profile Details:`
        // TODO: log `      ID: ${profile.id}`
        // TODO: log `      User ID: ${profile.user_id}`
        // TODO: log `      Email: ${profile.email}`
        // TODO: log `      Role: ${profile.role}`
        // TODO: log `      Company ID: ${profile.company_id}`
        // TODO: log `      Created: ${profile.created_at}`
        // TODO: log `      Status: ${profile.status}`
      }
    }
  } catch (err) {
    // TODO: log `❌ Profiles check error: ${err.message}`
  }

  // 4. Verificar empresas
  // TODO: log '\n🏢 Companies:'
  // TODO: log '='.repeat(50)
  
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // TODO: log `❌ Companies error: ${error.message}`
    } else {
      // TODO: log `✅ Companies found: ${companies?.length || 0}`
      
      if (companies && companies.length > 0) {
        // TODO: log `\n   ${index + 1}. Company Details:`
        // TODO: log `      ID: ${company.id}`
        // TODO: log `      Name: ${company.name}`
        // TODO: log `      Status: ${company.status}`
        // TODO: log `      Plan: ${company.subscription_plan}`
        // TODO: log `      Created: ${company.created_at}`
      }
    }
  } catch (err) {
    // TODO: log `❌ Companies check error: ${err.message}`
  }

  // 5. Análisis de la situación
  // TODO: log '\n📊 Analysis:'
  // TODO: log '='.repeat(50)
  
  // TODO: log '🔍 What you should see:'
  // TODO: log '   - User profiles in user_profiles table ✅'
  // TODO: log '   - Companies in companies table ✅'
  // TODO: log '   - Auth users (limited access) ⚠️'
  
  // TODO: log '\n💡 Why you might not see auth users:'
  // TODO: log '   1. Anon key has limited access to auth.users'
  // TODO: log '   2. Users need to register/login first'
  // TODO: log '   3. RLS policies might be blocking access'
  // TODO: log '   4. You need to authenticate to see user data'
  
  // TODO: log '\n🚀 Next steps:'
  // TODO: log '   1. Open http://localhost:8080'
  // TODO: log '   2. Try to register/login'
  // TODO: log '   3. Check if users appear in auth system'

  // TODO: log '\n' + '='.repeat(50)
  // TODO: log '📊 AUTH USERS CHECK COMPLETED'
  // TODO: log '='.repeat(50)
}

// Ejecutar el check
checkAuthUsers()
  .then(() => {
    // TODO: log '\n✨ Check completed!'
    process.exit(0);
  })
  .catch((error) => {
    // TODO: log '💥 Check failed:' error
    process.exit(1);
  }); 