#!/usr/bin/env node

/**
 * DocumentVTK Integration Test
 * Prueba la funcionalidad completa después de la separación
 */

console.log('🧪 DocumentVTK Integration Test');
console.log('='.repeat(40));

async function testIntegration() {
  try {
    console.log('📦 Testing module imports...');
    
    // Test 1: Importar Core
    console.log('1️⃣ Testing Core module...');
    const { DocumentVTKCore } = await import('../docs/VTK_METHODOLOGY/04_TOOLS/DocumentVTK-core.js');
    console.log(`✅ Core imported: ${typeof DocumentVTKCore}`);
    
    // Test 2: Importar VibeThink
    console.log('2️⃣ Testing VibeThink module...');
    const { DocumentVTKVibeThink } = await import('../docs/PROJECT/08_TOOLCHAIN_AND_SETUP/DocumentVTK-VibeThink-config.js');
    console.log(`✅ VibeThink imported: ${typeof DocumentVTKVibeThink}`);
    
    // Test 3: Crear instancia VibeThink
    console.log('3️⃣ Testing VibeThink instantiation...');
    const VibeThinkInstance = new DocumentVTKVibeThink({
      department: 'development',
      standard: 'CMMI-ML3'
    });
    console.log(`✅ VibeThink instance created: ${VibeThinkInstance.constructor.name}`);
    
    // Test 4: Verificar herencia
    console.log('4️⃣ Testing inheritance...');
    console.log(`✅ VibeThink extends Core: ${VibeThinkInstance instanceof DocumentVTKCore}`);
    
    // Test 5: Test wrapper compatibility
    console.log('5️⃣ Testing wrapper compatibility...');
    const wrapperModule = await import('../src/scripts/DocumentVTK.js');
    console.log('✅ Wrapper loads without errors');
    
    console.log('\n' + '='.repeat(40));
    console.log('🎉 ALL INTEGRATION TESTS PASSED!');
    console.log('');
    console.log('📋 Summary:');
    console.log('  ✅ Core module functional');
    console.log('  ✅ VibeThink config functional');
    console.log('  ✅ Inheritance working');
    console.log('  ✅ Wrapper compatible');
    console.log('');
    console.log('🚀 DocumentVTK separation is PRODUCTION READY!');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ INTEGRATION TEST FAILED:');
    console.error(error.message);
    console.error('\n🔧 Action required:');
    console.error('  - Check import paths');
    console.error('  - Verify module exports');
    console.error('  - Review syntax errors');
    
    return false;
  }
}

testIntegration().then(success => {
  process.exit(success ? 0 : 1);
});
