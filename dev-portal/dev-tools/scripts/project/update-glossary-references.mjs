#!/usr/bin/env node

/**
 * Script para actualizar referencias al glosario en documentos clave
 * 
 * Este script busca documentos importantes y agrega referencias al glosario
 * si no las tienen ya.
 * 
 * Uso: node scripts/update-glossary-references.mjs
 */

import fs from 'fs';
import path from 'path';

// Documentos clave que deben referenciar el glosario
const KEY_DOCUMENTS = [
  'docs/README.md',
  'docs/MASTER_AI_PAIR_DEFINITION_DOCUMENT.md',
  'docs/ACCESS_CONTROL_PROTOCOL.md',
  'docs/ROLES_AND_ORGANIZATION.md',
  'docs/COMPLETE_SYSTEM_DOCUMENTATION.md'
];

// Patrón para detectar si ya existe una referencia al glosario
const GLOSSARY_REFERENCE_PATTERN = /\[.*[Gg]losario.*\]\(.*GLOSSARY\.md.*\)/;

// Referencia estándar al glosario
const GLOSSARY_REFERENCE = '- **[📚 Glosario de Siglas y Jerga](GLOSSARY.md)** - Referencia completa de siglas, roles y terminología interna';

/**
 * Verifica si un documento ya tiene referencia al glosario
 */
function hasGlossaryReference(content) {
  return GLOSSARY_REFERENCE_PATTERN.test(content);
}

/**
 * Agrega referencia al glosario en un documento
 */
function addGlossaryReference(filePath, content) {
  const lines = content.split('\n');
  let updated = false;
  
  // Buscar sección de documentación o referencias
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Buscar secciones como "Documentación", "Referencias", "Documentos"
    if (line.match(/^##\s*.*[Dd]ocumentación|^##\s*.*[Rr]eferencias|^##\s*.*[Dd]ocumentos/)) {
      // Buscar la subsección de documentos
      for (let j = i + 1; j < lines.length; j++) {
        const subLine = lines[j];
        
        // Si encontramos una subsección de documentos, agregar la referencia
        if (subLine.match(/^###\s*.*[Dd]ocumentos|^###\s*.*[Gg]uías|^###\s*.*[Rr]ecursos/)) {
          // Buscar el final de la lista de documentos
          let k = j + 1;
          while (k < lines.length && (lines[k].startsWith('- ') || lines[k].startsWith('* ') || lines[k].trim() === '')) {
            k++;
          }
          
          // Insertar la referencia al glosario al inicio de la lista
          lines.splice(j + 1, 0, GLOSSARY_REFERENCE);
          updated = true;
          break;
        }
        
        // Si encontramos el final de la sección, agregar una nueva subsección
        if (subLine.startsWith('##') && j > i + 2) {
          lines.splice(j, 0, '', '### **📖 Documentos Principales**', GLOSSARY_REFERENCE, '');
          updated = true;
          break;
        }
      }
      break;
    }
  }
  
  // Si no encontramos una sección de documentación, agregar una al inicio
  if (!updated) {
    const insertIndex = Math.min(20, lines.length); // Insertar después del header
    lines.splice(insertIndex, 0, 
      '',
      '## 📚 **Documentación**',
      '',
      '### **📖 Documentos Principales**',
      GLOSSARY_REFERENCE,
      ''
    );
    updated = true;
  }
  
  return lines.join('\n');
}

/**
 * Procesa un documento
 */
function processDocument(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Documento no encontrado: ${filePath}`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (hasGlossaryReference(content)) {
      console.log(`✅ Ya tiene referencia al glosario: ${filePath}`);
      return;
    }
    
    const updatedContent = addGlossaryReference(filePath, content);
    
    // Crear backup
    const backupPath = `${filePath}.backup-${Date.now()}`;
    fs.writeFileSync(backupPath, content);
    console.log(`💾 Backup creado: ${backupPath}`);
    
    // Escribir contenido actualizado
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ Referencia al glosario agregada: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

/**
 * Función principal
 */
function main() {
  console.log('🔄 Actualizando referencias al glosario...\n');
  
  let processed = 0;
  let updated = 0;
  
  for (const docPath of KEY_DOCUMENTS) {
    processed++;
    processDocument(docPath);
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`- Documentos procesados: ${processed}`);
  console.log(`- Referencias actualizadas: ${updated}`);
  console.log(`\n✅ Proceso completado.`);
}

// Ejecutar si es llamado directamente
main(); 