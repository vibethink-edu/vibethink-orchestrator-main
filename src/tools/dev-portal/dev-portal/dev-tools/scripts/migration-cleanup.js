#!/usr/bin/env node

/**
 * Consolidación Segura de Reportes
 * Fusiona src/reports/ con docs/PROJECT/07_REPORTS_AND_METRICS/
 */

import fs from 'fs';
import path from 'path';

console.log('🔄 Consolidando reportes...');

const srcDir = 'src/reports';
const targetDir = 'docs/PROJECT/07_REPORTS_AND_METRICS';

function consolidateDirectory(source, target) {
  const items = fs.readdirSync(source);
  let moved = 0;
  let skipped = 0;
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      // Crear directorio si no existe
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
        console.log(`📁 Creado directorio: ${item}`);
      }
      
      // Recursivamente consolidar
      const subResult = consolidateDirectory(sourcePath, targetPath);
      moved += subResult.moved;
      skipped += subResult.skipped;
      
      // Eliminar directorio fuente si está vacío
      try {
        fs.rmdirSync(sourcePath);
        console.log(`🗑️ Eliminado directorio vacío: ${item}`);
      } catch (error) {
        // Directorio no vacío, dejar como está
      }
      
    } else {
      // Archivo
      if (!fs.existsSync(targetPath)) {
        fs.renameSync(sourcePath, targetPath);
        console.log(`📄 Movido: ${item}`);
        moved++;
      } else {
        // Verificar si son idénticos
        const sourceContent = fs.readFileSync(sourcePath);
        const targetContent = fs.readFileSync(targetPath);
        
        if (sourceContent.equals(targetContent)) {
          fs.unlinkSync(sourcePath);
          console.log(`🔄 Eliminado duplicado idéntico: ${item}`);
          skipped++;
        } else {
          // Renombrar con timestamp
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const newName = `${path.parse(item).name}-${timestamp}${path.parse(item).ext}`;
          const newTargetPath = path.join(target, newName);
          
          fs.renameSync(sourcePath, newTargetPath);
          console.log(`📄 Movido con nuevo nombre: ${item} → ${newName}`);
          moved++;
        }
      }
    }
  }
  
  return { moved, skipped };
}

try {
  const result = consolidateDirectory(srcDir, targetDir);
  
  console.log(`\n✅ Consolidación completada:`);
  console.log(`📄 Archivos movidos: ${result.moved}`);
  console.log(`⏭️ Duplicados eliminados: ${result.skipped}`);
  
  // Eliminar directorio fuente si está vacío
  try {
    fs.rmdirSync(srcDir);
    console.log(`🗑️ Eliminado directorio fuente vacío: ${srcDir}`);
  } catch (error) {
    console.log(`📁 Directorio fuente mantiene algunos archivos: ${srcDir}`);
  }
  
} catch (error) {
  console.error('❌ Error en consolidación:', error.message);
}
