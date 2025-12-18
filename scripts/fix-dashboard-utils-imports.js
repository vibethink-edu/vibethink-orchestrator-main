#!/usr/bin/env node

/**
 * Script para corregir imports de utils en dashboards
 * 
 * Reemplaza:
 * - @/shared/lib/utils → @/lib/utils
 * 
 * Usage:
 *   node scripts/fix-dashboard-utils-imports.js
 */

const fs = require('fs').promises
const path = require('path')

// Directorio a procesar
const TARGET_DIR = path.join(__dirname, '../apps/dashboard/app/dashboard-bundui')

async function replaceImportsInFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf-8')
    let modified = false
    const originalContent = content

    // Reemplazar imports de @/shared/lib/utils con @/lib/utils
    const utilsPattern = /from\s+['"]@\/shared\/lib\/utils['"]/g
    if (utilsPattern.test(content)) {
      content = content.replace(utilsPattern, `from '@/lib/utils'`)
      modified = true
    }

    if (modified && content !== originalContent) {
      await fs.writeFile(filePath, content, 'utf-8')
      return true
    }
    return false
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message)
    return false
  }
}

async function processDirectory(dir) {
  const files = []
  
  async function walkDir(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name)
        
        // Ignorar node_modules, .next, dist, etc.
        if (entry.name.startsWith('.') || 
            entry.name === 'node_modules' || 
            entry.name === '.next' || 
            entry.name === 'dist' ||
            entry.name === 'components.json') {
          continue
        }
        
        if (entry.isDirectory()) {
          await walkDir(fullPath)
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
          files.push(fullPath)
        }
      }
    } catch (error) {
      // Ignorar errores de acceso a directorios
      if (error.code !== 'ENOENT') {
        console.warn(`⚠️  No se pudo leer directorio ${currentDir}:`, error.message)
      }
    }
  }
  
  await walkDir(dir)
  return files
}

async function main() {
  console.log('🔧 Corrigiendo imports de utils en dashboards...\n')
  console.log(`📁 Directorio objetivo: ${TARGET_DIR}\n`)
  
  try {
    await fs.access(TARGET_DIR)
  } catch (error) {
    console.error(`❌ El directorio ${TARGET_DIR} no existe`)
    process.exit(1)
  }

  const files = await processDirectory(TARGET_DIR)
  console.log(`📄 Archivos encontrados: ${files.length}\n`)

  let modifiedFiles = 0
  
  for (const file of files) {
    const modified = await replaceImportsInFile(file)
    if (modified) {
      modifiedFiles++
      const relativePath = path.relative(TARGET_DIR, file)
      console.log(`  ✅ ${relativePath}`)
    }
  }
  
  console.log(`\n📊 Resumen:`)
  console.log(`   Total archivos procesados: ${files.length}`)
  console.log(`   Archivos modificados: ${modifiedFiles}`)
  console.log(`\n💡 Próximos pasos:`)
  console.log(`   1. Revisar cambios: git diff`)
  console.log(`   2. Verificar errores: cd apps/dashboard && npx tsc --noEmit`)
}

main().catch(console.error)

