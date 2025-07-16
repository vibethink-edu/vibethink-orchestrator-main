#!/usr/bin/env node

/**
 * Script de Estandarización de Naming Conventions y Créditos
 * 
 * Este script realiza una corrección sistemática de todas las referencias
 * a nombres antiguos y créditos en el proyecto, estandarizando:
 * 
 * - AI Pair Platform → Vita Asistente AI de Marcelo
 * - AI Pair Orchestrator → VibeThink Orchestrator
 * - Créditos y autores en archivos
 * - Naming conventions en código y documentación
 * 
 * @author Vita Asistente AI de Marcelo
 * @version 1.0.0
 * @date 2025-01-25
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración de reemplazos
const REPLACEMENTS = {
  // Nombres principales
  'AI Pair Platform': 'Vita Asistente AI de Marcelo',
  'AI Pair Orchestrator': 'VibeThink Orchestrator',
  'ai-pair-orchestrator': 'vibethink-orchestrator',
  'ai_pair_orchestrator': 'vibethink_orchestrator',
  
  // Créditos y autores
  '@author AI Pair Platform': '@author Vita Asistente AI de Marcelo',
  'Author: AI Pair Platform': 'Author: Vita Asistente AI de Marcelo',
  'Autor: AI Pair Platform': 'Autor: Vita Asistente AI de Marcelo',
  
  // Equipos específicos
  '@author AI Pair Platform - Testing Team': '@author Vita Asistente AI de Marcelo - Testing Team',
  '@author AI Pair Platform - Backend Team': '@author Vita Asistente AI de Marcelo - Backend Team',
  '@author AI Pair Platform - Frontend Team': '@author Vita Asistente AI de Marcelo - Frontend Team',
  '@author AI Pair Platform - UI Team': '@author Vita Asistente AI de Marcelo - UI Team',
  '@author AI Pair Platform - Core Team': '@author Vita Asistente AI de Marcelo - Core Team',
  '@author AI Pair Platform - Security Team': '@author Vita Asistente AI de Marcelo - Security Team',
  '@author AI Pair Platform - Developer Experience Team': '@author Vita Asistente AI de Marcelo - Developer Experience Team',
  '@author AI Pair Platform - Quality Standards Team': '@author Vita Asistente AI de Marcelo - Quality Standards Team',
  '@author AI Pair Platform - Voice Integration Team': '@author Vita Asistente AI de Marcelo - Voice Integration Team',
  '@author AI Pair Platform - Knotie Integration Team': '@author Vita Asistente AI de Marcelo - Knotie Integration Team',
  
  // Comentarios en SQL
  '-- Author: AI Pair Platform': '-- Author: Vita Asistente AI de Marcelo',
  '-- Autor: AI Pair Platform': '-- Autor: Vita Asistente AI de Marcelo',
  '-- Author: AI Pair Platform Team': '-- Author: Vita Asistente AI de Marcelo Team',
  '-- Author: AI Pair Platform - Security Team': '-- Author: Vita Asistente AI de Marcelo - Security Team',
  '-- Author: AI Pair Platform - Backend Team': '-- Author: Vita Asistente AI de Marcelo - Backend Team',
  
  // Referencias en comentarios
  'AI Pair Platform': 'Vita Asistente AI de Marcelo',
  'AI Pair platform': 'Vita Asistente AI de Marcelo',
  'ai-pair-platform': 'vibethink-platform',
  'ai_pair_platform': 'vibethink_platform',
  
  // Configuraciones y constantes
  'name: \'AI Pair Platform\'': 'name: \'Vita Asistente AI de Marcelo\'',
  'company: \'AI Pair Platform\'': 'company: \'Vita Asistente AI de Marcelo\'',
  
  // Referencias en documentación
  'AI Pair Platform Team': 'Vita Asistente AI de Marcelo Team',
  'AI Pair Platform - Testing Team': 'Vita Asistente AI de Marcelo - Testing Team',
  'AI Pair Platform - Backend Team': 'Vita Asistente AI de Marcelo - Backend Team',
  'AI Pair Platform - Frontend Team': 'Vita Asistente AI de Marcelo - Frontend Team',
  'AI Pair Platform - UI Team': 'Vita Asistente AI de Marcelo - UI Team',
  'AI Pair Platform - Core Team': 'Vita Asistente AI de Marcelo - Core Team',
  'AI Pair Platform - Security Team': 'Vita Asistente AI de Marcelo - Security Team',
  'AI Pair Platform - Developer Experience Team': 'Vita Asistente AI de Marcelo - Developer Experience Team',
  'AI Pair Platform - Quality Standards Team': 'Vita Asistente AI de Marcelo - Quality Standards Team',
  'AI Pair Platform - Voice Integration Team': 'Vita Asistente AI de Marcelo - Voice Integration Team',
  'AI Pair Platform - Knotie Integration Team': 'Vita Asistente AI de Marcelo - Knotie Integration Team'
};

// Extensiones de archivos a procesar
const FILE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', 
  '.sql', '.yml', '.yaml', '.html', '.css', '.scss'
];

// Directorios a excluir
const EXCLUDE_DIRS = [
  'node_modules', '.git', 'dist', 'build', 'coverage',
  'backups', 'archives', 'repo_archive', 'src.old'
];

// Estadísticas del proceso
let stats = {
  filesProcessed: 0,
  filesModified: 0,
  replacementsMade: 0,
  errors: []
};

/**
 * Verifica si un archivo debe ser procesado
 */
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Verificar extensión
  if (!FILE_EXTENSIONS.includes(ext)) {
    return false;
  }
  
  // Verificar directorios excluidos
  for (const excludeDir of EXCLUDE_DIRS) {
    if (relativePath.includes(excludeDir)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Procesa un archivo individual
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let fileModified = false;
    let fileReplacements = 0;
    
    // Aplicar todos los reemplazos
    for (const [oldText, newText] of Object.entries(REPLACEMENTS)) {
      const regex = new RegExp(oldText, 'g');
      const matches = (modifiedContent.match(regex) || []).length;
      
      if (matches > 0) {
        modifiedContent = modifiedContent.replace(regex, newText);
        fileReplacements += matches;
        fileModified = true;
      }
    }
    
    // Guardar archivo si fue modificado
    if (fileModified) {
      fs.writeFileSync(filePath, modifiedContent, 'utf8');
      stats.filesModified++;
      stats.replacementsMade += fileReplacements;
      
      console.log(`✅ ${filePath} - ${fileReplacements} reemplazos`);
    }
    
    stats.filesProcessed++;
    
  } catch (error) {
    stats.errors.push({
      file: filePath,
      error: error.message
    });
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

/**
 * Recorre directorios recursivamente
 */
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile()) {
      if (shouldProcessFile(fullPath)) {
        processFile(fullPath);
      }
    }
  }
}

/**
 * Genera reporte de estadísticas
 */
function generateReport() {
  const replacementsList = Object.entries(REPLACEMENTS)
    .map(([old, new]) => `- "${old}" → "${new}"`)
    .join('\n');

  const report = `
# Reporte de Estandarización de Naming Conventions

## Resumen Ejecutivo
- **Archivos procesados**: ${stats.filesProcessed}
- **Archivos modificados**: ${stats.filesModified}
- **Reemplazos realizados**: ${stats.replacementsMade}
- **Errores encontrados**: ${stats.errors.length}

## Detalles de Reemplazos
${replacementsList}

## Archivos Modificados
${stats.filesModified > 0 ? '✅ Proceso completado exitosamente' : '⚠️ No se encontraron archivos para modificar'}

## Errores (si los hay)
${stats.errors.length > 0 ? stats.errors.map(e => `- ${e.file}: ${e.error}`).join('\n') : '✅ Sin errores'}

## Validación Post-Proceso
Para verificar que los cambios se aplicaron correctamente:

1. **Buscar referencias restantes**:
   \`\`\`bash
   grep -r "AI Pair Platform" src/ --exclude-dir=node_modules
   grep -r "ai-pair-orchestrator" src/ --exclude-dir=node_modules
   \`\`\`

2. **Verificar naming conventions**:
   \`\`\`bash
   grep -r "Vita Asistente AI de Marcelo" src/ --exclude-dir=node_modules
   grep -r "VibeThink Orchestrator" src/ --exclude-dir=node_modules
   \`\`\`

## Próximos Pasos
1. Revisar manualmente los archivos críticos
2. Ejecutar tests para verificar funcionalidad
3. Actualizar documentación si es necesario
4. Commit de los cambios con mensaje descriptivo

---
*Reporte generado automáticamente por el script de estandarización*
`;

  return report;
}

/**
 * Función principal
 */
function main() {
  console.log('🚀 Iniciando estandarización de naming conventions...\n');
  
  const startTime = Date.now();
  
  try {
    // Procesar directorio raíz
    processDirectory(process.cwd());
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 ESTADÍSTICAS FINALES');
    console.log('='.repeat(60));
    console.log(`⏱️  Tiempo total: ${duration}s`);
    console.log(`📁 Archivos procesados: ${stats.filesProcessed}`);
    console.log(`✏️  Archivos modificados: ${stats.filesModified}`);
    console.log(`🔄 Reemplazos realizados: ${stats.replacementsMade}`);
    console.log(`❌ Errores: ${stats.errors.length}`);
    
    // Generar reporte
    const reportPath = path.join(process.cwd(), 'reports', 'naming-standardization-report.md');
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, generateReport());
    console.log(`\n📄 Reporte guardado en: ${reportPath}`);
    
    if (stats.errors.length > 0) {
      console.log('\n⚠️  Se encontraron errores. Revisa el reporte para más detalles.');
      process.exit(1);
    } else {
      console.log('\n✅ Estandarización completada exitosamente!');
    }
    
  } catch (error) {
    console.error('💥 Error crítico:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  REPLACEMENTS,
  processFile,
  processDirectory,
  generateReport
}; 