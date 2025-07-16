#!/usr/bin/env node

/**
 * Script de diagnóstico para verificar el estado de los paneles laterales
 * Ayuda a identificar por qué los paneles no se muestran
 */

console.log('🔍 Diagnóstico de paneles laterales...\n');

// Simular el estado del navegador
const mockWindowWidth = 1920; // Simular pantalla desktop
const mockWindowHeight = 1080;

console.log('📱 Información de pantalla:');
console.log(`  Ancho: ${mockWindowWidth}px`);
console.log(`  Alto: ${mockWindowHeight}px`);

// Simular breakpoints
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const isMobile = mockWindowWidth < MOBILE_BREAKPOINT;
const isTablet = mockWindowWidth >= MOBILE_BREAKPOINT && mockWindowWidth < TABLET_BREAKPOINT;
const isDesktop = !isMobile && !isTablet;

console.log('\n📊 Detección de tamaño de pantalla:');
console.log(`  Mobile (< ${MOBILE_BREAKPOINT}px): ${isMobile ? '✅' : '❌'}`);
console.log(`  Tablet (${MOBILE_BREAKPOINT}-${TABLET_BREAKPOINT}px): ${isTablet ? '✅' : '❌'}`);
console.log(`  Desktop (> ${TABLET_BREAKPOINT}px): ${isDesktop ? '✅' : '❌'}`);

// Simular estado del usuario
const mockUser = {
  email: 'superadmin@VibeThink.co',
  profile: {
    role: 'SUPER_ADMIN'
  },
  company: {
    slug: 'VibeThink-platform'
  }
};

console.log('\n👤 Estado del usuario:');
console.log(`  Email: ${mockUser.email}`);
console.log(`  Role: ${mockUser.profile.role}`);
console.log(`  Company: ${mockUser.company.slug}`);

// Verificar si es super admin
const superAdminEmails = [
  'admin@VibeThink.co',
  'superadmin@VibeThink.co',
  'root@VibeThink.co'
];

const isSuperAdminUser = superAdminEmails.includes(mockUser.email.toLowerCase());
const isPlatformOwner = mockUser.profile.role === 'OWNER' && mockUser.company.slug === 'VibeThink-platform';
const isSuperAdmin = !!(isSuperAdminUser || isPlatformOwner);

console.log('\n🔐 Verificación de Super Admin:');
console.log(`  Email en lista: ${isSuperAdminUser ? '✅' : '❌'}`);
console.log(`  Platform owner: ${isPlatformOwner ? '✅' : '❌'}`);
console.log(`  Es Super Admin: ${isSuperAdmin ? '✅' : '❌'}`);

// Simular estado de los paneles
const showSuperAdminPanel = false; // Estado inicial
const showRightPanel = true; // Estado inicial

console.log('\n🎛️ Estado de los paneles:');
console.log(`  showRightPanel: ${showRightPanel ? '✅ true' : '❌ false'}`);
console.log(`  showSuperAdminPanel: ${showSuperAdminPanel ? '✅ true' : '❌ false'}`);

// Calcular si algún panel derecho está visible
const anyRightPanelVisible = showRightPanel || (isSuperAdmin && showSuperAdminPanel);

console.log('\n📋 Cálculo de visibilidad:');
console.log(`  showRightPanel: ${showRightPanel}`);
console.log(`  isSuperAdmin && showSuperAdminPanel: ${isSuperAdmin && showSuperAdminPanel}`);
console.log(`  anyRightPanelVisible: ${anyRightPanelVisible ? '✅ true' : '❌ false'}`);

// Verificar layout
if (isMobile) {
  console.log('\n📱 Layout detectado: MOBILE');
  console.log('  ❌ Se mostrará MobileDashboardLayout');
  console.log('  ❌ No se mostrarán paneles laterales');
} else {
  console.log('\n🖥️ Layout detectado: DESKTOP');
  console.log('  ✅ Se mostrará DashboardLayout normal');
  
  if (anyRightPanelVisible) {
    console.log('  ✅ Paneles laterales visibles');
    if (showRightPanel) {
      console.log('    - Panel derecho regular');
    }
    if (isSuperAdmin && showSuperAdminPanel) {
      console.log('    - Panel de Super Admin');
    }
  } else {
    console.log('  ❌ No hay paneles laterales visibles');
  }
}

console.log('\n🔧 Posibles problemas:');
console.log('1. Hook useResponsiveLayout detectando pantalla como móvil');
console.log('2. Estado inicial de showRightPanel en false');
console.log('3. Error en el renderizado de los componentes de panel');
console.log('4. Problemas de CSS que ocultan los paneles');

console.log('\n💡 Soluciones sugeridas:');
console.log('1. Verificar en DevTools si hay errores de JavaScript');
console.log('2. Verificar en DevTools si los elementos están en el DOM pero ocultos');
console.log('3. Verificar el estado de los hooks en React DevTools');
console.log('4. Reiniciar el servidor de desarrollo');

console.log('\n📝 Comandos para probar:');
console.log('1. Abrir DevTools (F12)');
console.log('2. Ir a la pestaña Console');
console.log('3. Buscar errores de JavaScript');
console.log('4. Ir a la pestaña Elements');
console.log('5. Buscar elementos con clase "w-80" (paneles)');
console.log('6. Verificar si están presentes pero con display: none'); 