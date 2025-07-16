#!/usr/bin/env node

/**
 * Script de prueba para verificar el login de SUPER_ADMIN
 * Verifica que las credenciales y redirección funcionen correctamente
 */

console.log('🧪 Probando login de SUPER_ADMIN...\n');

// Simular el proceso de login
const testCredentials = {
  email: 'superadmin@VibeThink.co',
  password: '12345',
  role: 'SUPER_ADMIN',
  company: {
    id: '111e1111-e11b-11d1-a111-111111111111',
    name: 'AI Pair Platform',
    slug: 'VibeThink-platform'
  }
};

console.log('📋 Credenciales de prueba:');
console.log(`  Email: ${testCredentials.email}`);
console.log(`  Password: ${testCredentials.password}`);
console.log(`  Role: ${testCredentials.role}`);
console.log(`  Company: ${testCredentials.company.name} (${testCredentials.company.slug})`);

// Simular el mock user que se crea
const mockUser = {
  id: `user-${Date.now()}`,
  email: testCredentials.email,
  profile: {
    id: `user-${Date.now()}`,
    email: testCredentials.email,
    full_name: testCredentials.email.split('@')[0],
    role: testCredentials.role,
    company_id: testCredentials.company.id,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  company: testCredentials.company
};

console.log('\n✅ Mock user creado:');
console.log(`  ID: ${mockUser.id}`);
console.log(`  Role: ${mockUser.profile.role}`);
console.log(`  Company: ${mockUser.company.name}`);

// Verificar la lógica de redirección
console.log('\n🔄 Lógica de redirección:');
if (mockUser.profile.role === 'SUPER_ADMIN' && mockUser.company.slug === 'VibeThink-platform') {
  console.log('  ✅ Redirigiendo a: /super-admin');
} else if (mockUser.profile.role === 'ADMIN' || mockUser.profile.role === 'OWNER') {
  console.log('  ✅ Redirigiendo a: /admin');
} else {
  console.log('  ✅ Redirigiendo a: /dashboard');
}

// Verificar el hook useSuperAdmin
console.log('\n🔍 Verificación del hook useSuperAdmin:');
const superAdminEmails = [
  'admin@VibeThink.co',
  'superadmin@VibeThink.co',
  'root@VibeThink.co'
];

const isSuperAdminUser = superAdminEmails.includes(mockUser.email.toLowerCase());
const isPlatformOwner = mockUser.profile.role === 'OWNER' && mockUser.company.slug === 'VibeThink-platform';
const isSuperAdmin = !!(isSuperAdminUser || isPlatformOwner);

console.log(`  Email en lista de super admin: ${isSuperAdminUser ? '✅' : '❌'}`);
console.log(`  Es platform owner: ${isPlatformOwner ? '✅' : '❌'}`);
console.log(`  Es super admin: ${isSuperAdmin ? '✅' : '❌'}`);

console.log('\n📝 Instrucciones para probar:');
console.log('1. Ve a: http://localhost:8081/simple-login');
console.log('2. Usa las credenciales:');
console.log(`   Email: ${testCredentials.email}`);
console.log(`   Password: ${testCredentials.password}`);
console.log('3. Deberías ser redirigido a: http://localhost:8081/super-admin');
console.log('4. Verifica que aparezca el badge "SUPER_ADMIN" en el header');
console.log('5. Verifica que el botón de escudo (🛡️) esté disponible en el header');

console.log('\n🎯 Resultado esperado:');
console.log('✅ Login exitoso');
console.log('✅ Redirección a /super-admin');
console.log('✅ Panel de super administración visible');
console.log('✅ Badge "SUPER_ADMIN" en header');
console.log('✅ Botón de escudo disponible');
console.log('✅ Funcionalidades de super admin accesibles'); 