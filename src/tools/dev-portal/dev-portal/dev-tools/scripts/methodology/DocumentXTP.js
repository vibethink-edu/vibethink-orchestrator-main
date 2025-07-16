#!/usr/bin/env node

/**
 * DocumentVTK - Wrapper de Compatibilidad
 * 
 * DEPRECATED: Este archivo mantiene compatibilidad con la interfaz anterior.
 * La nueva implementación está separada en:
 * - Universal: docs/VTK_METHODOLOGY/04_TOOLS/DocumentVTK-core.js
 * - VibeThink: docs/PROJECT/08_TOOLCHAIN_AND_SETUP/DocumentVTK-VibeThink-config.js
 * 
 * @author AI Pair Platform
 * @version 2.1.0-compatibility
 * @deprecated Use DocumentVTK-core.js or DocumentVTK-VibeThink-config.js
 */

import { DocumentVTKVibeThink } from '../../docs/PROJECT/08_TOOLCHAIN_AND_SETUP/DocumentVTK-VibeThink-config.js';

// Función principal compatible
async function main() {
  console.log('⚠️ DEPRECATION NOTICE: Using compatibility wrapper');
  console.log('💡 Consider migrating to DocumentVTK-core.js or DocumentVTK-VibeThink-config.js');
  
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
  const documentVTK = new DocumentVTKVibeThink(options);
  await documentVTK.execute();
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main().catch(console.error);
}