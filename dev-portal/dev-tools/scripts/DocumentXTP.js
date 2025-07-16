#!/usr/bin/env node

/**
 * DocumentVTK - Legacy Compatibility Wrapper
 * 
 * NOTA: Este wrapper redirige a la nueva ubicación organizada.
 * La implementación real está en scripts/methodology/DocumentVTK.js
 * 
 * @deprecated Use scripts/methodology/DocumentVTK.js directamente
 * @version 3.0.0-legacy-compat
 * @author VTK Framework v4.3
 */

console.log('⚠️ LEGACY WRAPPER NOTICE:');
console.log('📍 DocumentVTK se ha movido a: scripts/methodology/DocumentVTK.js');
console.log('💡 Para mejor rendimiento, usar directamente la nueva ubicación');
console.log('🔄 Redirigiendo automáticamente...\n');

try {
  // Importar dinámicamente desde la nueva ubicación
  const { DocumentVTKVibeThink } = await import('../../scripts/methodology/DocumentVTK.js');
  
  // Función principal compatible
  async function main() {
    const args = process.argv.slice(2);
    const options = {};
    
    // Parsear argumentos (mantener compatibilidad)
    for (let i = 0; i < args.length; i += 2) {
      if (args[i] === '--department') {
        options.department = args[i + 1];
      } else if (args[i] === '--standard') {
        options.standard = args[i + 1];
      } else if (args[i] === '--company') {
        options.companyName = args[i + 1];
      }
    }
    
    // Usar configuración VibeThink por defecto
    console.log('🚀 Ejecutando DocumentVTK desde nueva ubicación...');
    const documentVTK = new DocumentVTKVibeThink(options);
    await documentVTK.execute();
  }
  
  // Ejecutar
  await main();
  
} catch (error) {
  console.error('❌ Error ejecutando DocumentVTK:', error.message);
  console.log('\n💡 SOLUCIÓN:');
  console.log('   Usar directamente: node scripts/methodology/DocumentVTK.js');
  console.log('   O verificar que la nueva estructura esté completa');
  process.exit(1);
}
