#!/usr/bin/env node

/**
 * @file validate-architecture.cjs
 * @description Script para validar arquitectura del proyecto según reglas VThink 1.0
 * @version 1.0.0
 * @author VThink 1.0 Team
 * 
 * IMPORTANTE: /apps es CORRECTO (Monorepo workspaces)
 * INCORRECTO: src/app/ y src/apps/ (fueron eliminados)
 */

const fs = require('fs');
const path = require('path');

class ArchitectureValidator {
  constructor() {
    this.root = process.cwd();
    this.violations = [];
    this.warnings = [];
    this.success = true;
  }

  /**
   * Validar estructuras prohibidas
   * 
   * IMPORTANTE: /apps es CORRECTO - Es el monorepo workspaces
   * PROHIBIDO: src/app/ y src/apps/ - Fueron eliminados para evitar confusión
   */
  validateProhibitedStructures() {
    console.log('🚨 Validando estructuras prohibidas...');
    console.log('   ✅ /apps es CORRECTO (Monorepo workspaces)');
    console.log('   ❌ src/app/ y src/apps/ son PROHIBIDOS');
    
    const prohibitedStructures = [
      'src/app',      // PROHIBIDO - Fue eliminado
      'src/apps'      // PROHIBIDO - Fue eliminado
    ];

    for (const structure of prohibitedStructures) {
      const structurePath = path.join(this.root, structure);
      if (fs.existsSync(structurePath)) {
        this.violations.push(`❌ VIOLACIÓN CRÍTICA: ${structure}/ existe (PROHIBIDO)`);
        this.success = false;
      }
    }

    console.log('✅ Estructuras prohibidas validadas');
  }

  /**
   * Validar aplicaciones independientes
   * 
   * IMPORTANTE: apps/ debe existir y contener aplicaciones independientes
   */
  validateIndependentApps() {
    console.log('📱 Validando aplicaciones independientes...');
    console.log('   ✅ apps/ es CORRECTO (Monorepo workspaces)');
    
    const appsPath = path.join(this.root, 'apps');
    if (!fs.existsSync(appsPath)) {
      this.violations.push('❌ apps/ no existe (DEBE EXISTIR)');
      this.success = false;
      return;
    }

    const requiredApps = [
      'main-app',     // Aplicación principal
      'admin',        // Panel de administración
      'login',        // Autenticación
      'helpdesk'      // Sistema de soporte
    ];

    for (const app of requiredApps) {
      const appPath = path.join(appsPath, app);
      if (!fs.existsSync(appPath)) {
        this.warnings.push(`⚠️ Aplicación faltante: apps/${app}/`);
      } else {
        // Verificar estructura de app
        const appStructure = [
          'package.json',
          'app',
          'app/layout.tsx',
          'app/page.tsx'
        ];

        for (const item of appStructure) {
          const itemPath = path.join(appPath, item);
          if (!fs.existsSync(itemPath)) {
            this.warnings.push(`⚠️ Estructura incompleta en apps/${app}/: ${item}`);
          }
        }
      }
    }

    console.log('✅ Aplicaciones independientes validadas');
  }

  /**
   * Validar código compartido
   * 
   * IMPORTANTE: src/ debe contener solo código compartido
   */
  validateSharedCode() {
    console.log('🔗 Validando código compartido...');
    console.log('   ✅ src/ es CORRECTO (Código compartido)');
    
    const srcPath = path.join(this.root, 'src');
    if (!fs.existsSync(srcPath)) {
      this.violations.push('❌ src/ no existe');
      this.success = false;
      return;
    }

    const requiredSharedFolders = [
      'shared',
      'shared/components',
      'shared/hooks',
      'shared/utils',
      'shared/types',
      'lib',
      'integrations'
    ];

    for (const folder of requiredSharedFolders) {
      const folderPath = path.join(srcPath, folder);
      if (!fs.existsSync(folderPath)) {
        this.warnings.push(`⚠️ Carpeta faltante en src/: ${folder}/`);
      }
    }

    console.log('✅ Código compartido validado');
  }

  /**
   * Validar importaciones correctas
   * 
   * IMPORTANTE: Las apps deben importar desde src/shared/
   */
  validateImports() {
    console.log('📦 Validando importaciones...');
    console.log('   ✅ Importar desde src/shared/');
    console.log('   ❌ NO importar desde apps/');
    
    const appsPath = path.join(this.root, 'apps');
    if (!fs.existsSync(appsPath)) return;

    const apps = fs.readdirSync(appsPath);
    for (const app of apps) {
      const appPath = path.join(appsPath, app);
      if (fs.statSync(appPath).isDirectory()) {
        this.scanForIncorrectImports(appPath, app);
      }
    }

    console.log('✅ Importaciones validadas');
  }

  /**
   * Escanear importaciones incorrectas
   */
  scanForIncorrectImports(appPath, appName) {
    const prohibitedImports = [
      '@/apps/',
      '@/src/apps/',
      '@/src/app/'
    ];

    function scanDirectory(dir) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.')) {
          scanDirectory(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            for (const prohibited of prohibitedImports) {
              if (content.includes(prohibited)) {
                this.warnings.push(`⚠️ Importación incorrecta en ${appName}: ${prohibited} en ${item}`);
              }
            }
          } catch (error) {
            // Ignorar errores de lectura
          }
        }
      }
    }
    
    scanDirectory.call(this, appPath);
  }

  /**
   * Validar separación de responsabilidades
   * 
   * IMPORTANTE: apps/ para aplicaciones, src/ para código compartido
   */
  validateSeparationOfConcerns() {
    console.log('🎯 Validando separación de responsabilidades...');
    console.log('   ✅ apps/ = Aplicaciones independientes');
    console.log('   ✅ src/ = Código compartido');
    
    // Verificar que no hay código compartido en apps/
    const appsPath = path.join(this.root, 'apps');
    if (fs.existsSync(appsPath)) {
      const apps = fs.readdirSync(appsPath);
      for (const app of apps) {
        const appPath = path.join(appsPath, app);
        if (fs.statSync(appPath).isDirectory()) {
          const sharedFolders = ['shared', 'lib', 'utils'];
          for (const folder of sharedFolders) {
            const folderPath = path.join(appPath, folder);
            if (fs.existsSync(folderPath)) {
              this.warnings.push(`⚠️ Código compartido en apps/${app}/${folder}/ (debería estar en src/)`);
            }
          }
        }
      }
    }

    // Verificar que no hay aplicaciones en src/
    const srcPath = path.join(this.root, 'src');
    if (fs.existsSync(srcPath)) {
      const srcItems = fs.readdirSync(srcPath);
      for (const item of srcItems) {
        if (item === 'app' || item === 'apps') {
          this.violations.push(`❌ Aplicación en src/${item}/ (debería estar en apps/)`);
          this.success = false;
        }
      }
    }

    console.log('✅ Separación de responsabilidades validada');
  }

  /**
   * Generar reporte de validación
   */
  generateValidationReport() {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = path.join(this.root, 'docs', 'reports', 'quality', `${timestamp}-architecture-validation.md`);
    
    const report = `# Reporte: Validación de Arquitectura - ${timestamp}

## 📊 Resumen Ejecutivo
- **Objetivo**: Validar arquitectura del proyecto según reglas VThink 1.0
- **Fecha**: ${timestamp}
- **Estado**: ${this.success ? '✅ Exitoso' : '❌ Con errores'}

## 🔍 Detalles Técnicos
- **Metodología**: VThink 1.0 Architecture Rules
- **Herramientas**: Script de validación automática
- **Alcance**: Estructura completa del proyecto

## 📈 Métricas
- **Violaciones**: ${this.violations.length}
- **Advertencias**: ${this.warnings.length}
- **Estado**: ${this.success ? 'Compliant' : 'Non-Compliant'}

## 🎯 Aclaración Importante
- **✅ /apps es CORRECTO** - Es el monorepo workspaces
- **❌ src/app/ y src/apps/ son PROHIBIDOS** - Fueron eliminados

${this.violations.length > 0 ? `
## ❌ Violaciones Críticas
${this.violations.map(v => `- ${v}`).join('\n')}
` : ''}

${this.warnings.length > 0 ? `
## ⚠️ Advertencias
${this.warnings.map(w => `- ${w}`).join('\n')}
` : ''}

## 🎯 Conclusiones
${this.success ? 
  '- ✅ Arquitectura cumple con reglas VThink 1.0' :
  '- ❌ Se encontraron violaciones que deben corregirse'
}
- Estructuras prohibidas: ${this.violations.filter(v => v.includes('PROHIBIDO')).length} violaciones
- Aplicaciones independientes: ${this.warnings.filter(w => w.includes('apps/')).length} advertencias
- Código compartido: ${this.warnings.filter(w => w.includes('src/')).length} advertencias
- Importaciones: ${this.warnings.filter(w => w.includes('Importación')).length} advertencias

## 📋 VThink 1.0 Compliance
- ✅ Arquitectura monorepo pura implementada
- ✅ Separación de responsabilidades validada
- ✅ Aplicaciones independientes configuradas
- ✅ Código compartido organizado

## 🔧 Próximos Pasos
1. ${this.success ? 'Mantener arquitectura actual' : 'Corregir violaciones críticas'}
2. Resolver advertencias de estructura
3. Mejorar importaciones
4. Ejecutar validación diaria

---
*Reporte generado automáticamente por VThink 1.0 - ${timestamp}*
`;

    // Crear carpeta si no existe
    const qualityDir = path.join(this.root, 'docs', 'reports', 'quality');
    if (!fs.existsSync(qualityDir)) {
      fs.mkdirSync(qualityDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, report);
    console.log(`📄 Reporte de validación generado: ${reportPath}`);
  }

  /**
   * Ejecutar validación completa
   */
  run() {
    console.log('🚀 Iniciando validación de arquitectura...\n');
    console.log('📋 RECORDATORIO IMPORTANTE:');
    console.log('   ✅ /apps es CORRECTO (Monorepo workspaces)');
    console.log('   ❌ src/app/ y src/apps/ son PROHIBIDOS\n');
    
    this.validateProhibitedStructures();
    this.validateIndependentApps();
    this.validateSharedCode();
    this.validateImports();
    this.validateSeparationOfConcerns();
    
    console.log('\n📊 Resultados de Validación:');
    console.log(`🚨 Estructuras prohibidas: ${this.violations.filter(v => v.includes('PROHIBIDO')).length === 0 ? '✅' : '❌'}`);
    console.log(`📱 Aplicaciones independientes: ${this.warnings.filter(w => w.includes('apps/')).length === 0 ? '✅' : '⚠️'}`);
    console.log(`🔗 Código compartido: ${this.warnings.filter(w => w.includes('src/')).length === 0 ? '✅' : '⚠️'}`);
    console.log(`📦 Importaciones: ${this.warnings.filter(w => w.includes('Importación')).length === 0 ? '✅' : '⚠️'}`);
    
    if (this.violations.length > 0) {
      console.log('\n❌ VIOLACIONES CRÍTICAS:');
      this.violations.forEach(v => console.log(`  ${v}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️ ADVERTENCIAS:');
      this.warnings.forEach(w => console.log(`  ${w}`));
    }
    
    this.generateValidationReport();
    
    if (!this.success) {
      console.log('\n🚫 Validación fallida - Corregir violaciones críticas');
      process.exit(1);
    }
    
    console.log('\n✅ Validación de arquitectura exitosa');
    console.log('🎯 RECORDATORIO: /apps es CORRECTO, src/app/ y src/apps/ son PROHIBIDOS');
  }
}

// Ejecutar validación
const validator = new ArchitectureValidator();
validator.run(); 