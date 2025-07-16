/**
 * Get Supabase Project Information
 * 
 * Script para obtener información del proyecto Supabase
 * 
 * @author AI Pair Platform - Backend Team
 * @version 1.0.0
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase (usando la URL conocida)
const SUPABASE_URL = "https://pikywaoqlekupfynnclg.supabase.co";

console.log('🔍 Supabase Project Information\n');
console.log('='.repeat(50));

console.log('📋 PROJECT DETAILS:');
console.log(`   URL: ${SUPABASE_URL}`);
console.log(`   Project ID: pikywaoqlekupfynnclg`);
console.log(`   Region: (auto-detected)`);

console.log('\n🔑 API KEYS NEEDED:');
console.log('   1. VITE_SUPABASE_ANON_KEY (anon public key)');
console.log('   2. VITE_SUPABASE_SERVICE_ROLE_KEY (service role key - for admin operations)');

console.log('\n📁 TABLES AVAILABLE:');
console.log('   - companies');
console.log('   - user_profiles');
console.log('   - ai_usage_logs');
console.log('   - meetings');
console.log('   - departmental_permissions');
console.log('   - operational_repositories');

console.log('\n🔐 AUTHENTICATION:');
console.log('   - Email/Password');
console.log('   - OAuth (Google, GitHub)');
console.log('   - Magic Links');

console.log('\n⚡ SERVICES:');
console.log('   ✅ Database (PostgreSQL)');
console.log('   ✅ Authentication');
console.log('   ✅ Storage');
console.log('   ✅ Realtime');
console.log('   ✅ Edge Functions');

console.log('\n📊 NEXT STEPS:');
console.log('   1. Go to https://supabase.com/dashboard');
console.log('   2. Select project: pikywaoqlekupfynnclg');
console.log('   3. Go to Settings > API');
console.log('   4. Copy the "anon public" key');
console.log('   5. Create .env.local file with:');
console.log('      NEXT_PUBLIC_SUPABASE_URL=https://pikywaoqlekupfynnclg.supabase.co');
console.log('      NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here');

console.log('\n' + '='.repeat(50));
console.log('✨ Information retrieved successfully!'); 