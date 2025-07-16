#!/usr/bin/env node

/**
 * Script para aplicar automáticamente el aviso de confidencialidad
 * a todos los documentos ADR que no lo tengan
 * 
 * Autor: Marcelo Escallón, CEO de Euphorianet
 * Fecha: 22 de junio de 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIDENTIALITY_NOTICE = `---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---

`;

function findADRFiles(dir) {
    const files = [];
    
    function scanDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                scanDirectory(fullPath);
            } else if (stat.isFile() && item.endsWith('.md') && item.startsWith('ADR-')) {
                files.push(fullPath);
            }
        }
    }
    
    scanDirectory(dir);
    return files;
}

function hasConfidentialityNotice(content) {
    return content.includes('## 📋 AVISO DE CONFIDENCIALIDAD') && 
           content.includes('PROPIEDAD DE EUPHORIANET');
}

function applyConfidentialityNotice(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (hasConfidentialityNotice(content)) {
            console.log(`✅ ${path.basename(filePath)} - Ya tiene aviso de confidencialidad`);
            return false;
        }
        
        // Encontrar la posición después del título principal
        const lines = content.split('\n');
        let insertIndex = 1; // Después del título
        
        // Buscar la primera línea que no sea el título
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() !== '' && !lines[i].startsWith('**')) {
                insertIndex = i;
                break;
            }
        }
        
        // Insertar el aviso de confidencialidad
        lines.splice(insertIndex, 0, CONFIDENTIALITY_NOTICE);
        
        // Escribir el archivo actualizado
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        
        console.log(`✅ ${path.basename(filePath)} - Aviso de confidencialidad aplicado`);
        return true;
        
    } catch (error) {
        console.error(`❌ Error procesando ${filePath}:`, error.message);
        return false;
    }
}

function main() {
    console.log('🔒 Aplicando aviso de confidencialidad a documentos ADR...\n');
    
    const docsDir = path.join(__dirname, '..', 'docs');
    const adrFiles = findADRFiles(docsDir);
    
    console.log(`📁 Encontrados ${adrFiles.length} archivos ADR\n`);
    
    let updatedCount = 0;
    let alreadyHaveCount = 0;
    
    for (const filePath of adrFiles) {
        const wasUpdated = applyConfidentialityNotice(filePath);
        if (wasUpdated) {
            updatedCount++;
        } else {
            alreadyHaveCount++;
        }
    }
    
    console.log('\n📊 Resumen:');
    console.log(`   ✅ Archivos actualizados: ${updatedCount}`);
    console.log(`   ℹ️  Archivos que ya tenían aviso: ${alreadyHaveCount}`);
    console.log(`   📄 Total procesados: ${adrFiles.length}`);
    
    if (updatedCount > 0) {
        console.log('\n🎉 Proceso completado exitosamente');
    } else {
        console.log('\nℹ️  Todos los documentos ya tienen el aviso de confidencialidad');
    }
}

main();

export {
    findADRFiles,
    hasConfidentialityNotice,
    applyConfidentialityNotice
}; 