#!/usr/bin/env node

/**
 * Script Organization Tool - VTK v4.2 Compliant
 * 
 * Organiza scripts por función según VTK Meta-Prompt Brain v4.2:
 * - methodology/ : Tools, validation, documentation automation (universal)
 * - project/     : VibeThink operations, deployment, setup (specific)
 * - build/       : Build, compilation, asset processing
 * - testing/     : Tests, QA, validation scenarios
 * 
 * @author VTK Framework
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';

class ScriptOrganizer {
  constructor() {
    this.srcScriptsPath = 'src/scripts';
    this.targetScriptsPath = 'scripts';
    this.categories = {
      methodology: [],
      project: [],
      build: [],
      testing: []
    };
    
    // Patrones de clasificación por función (no por tecnología)
    this.patterns = {
      methodology: [
        // Tools y automation universales
        /^document.*automation/i,
        /^generate-documentation/i,
        /^auto-version-docs/i,
        /^validate-golden-rules/i,
        /^validate-documentVTK/i,
        /^VTK-.*workflow/i,
        /^migrate-to-VTK-structure/i,
        /^requirement-processor/i,
        /^knowledge-base-strategy/i,
        // VTK y metodología
        /DocumentVTK/i,
        /VTK/i,
        /methodology/i,
        /^validate-.*architecture/i,
        /^validate-constitutional/i,
        /^validate-etiquette/i,
        /naming.*conventions/i,
        /signatures/i
      ],
      
      project: [
        // Operaciones específicas VibeThink
        /VibeThink/i,
        /supabase/i,
        /strapi/i,
        /billing/i,
        /compliance/i,
        /country/i,
        /crm/i,
        /siigo/i,
        /knotie/i,
        /departmental/i,
        // Deployment y setup
        /^deploy/i,
        /^setup-(?!test)/i,
        /^init-.*session/i,
        /migration/i,
        /database/i,
        /backup/i,
        /rollback/i,
        /^create-.*users/i,
        /monitoring/i,
        /security-audit/i,
        /auth.*users/i,
        /rls.*policies/i,
        /install/i,
        /^setup-(?!test)/i
      ],
      
      build: [
        // Build y assets
        /^build/i,
        /css/i,
        /ui-components/i,
        /shadcn/i,
        /styles/i,
        /^sync/i,
        /tiptap/i,
        /route-map/i,
        /types/i,
        /^generate-(?!documentation)/i,
        /dependency.*inventory/i,
        /version.*automation/i,
        /version.*control/i
      ],
      
      testing: [
        // Tests y QA
        /^test/i,
        /^check/i,
        /^validate-(?!.*architecture|.*constitutional|.*etiquette|.*golden|.*documentVTK)/i,
        /debug/i,
        /stress.*testing/i,
        /wcag/i,
        /quick.*test/i,
        /real.*world.*test/i,
        /hierarchical.*test/i,
        /health.*check/i,
        /^verify/i,
        /scenarios/i,
        /^improved.*test/i,
        /mock/i,
        /^clean.*test/i,
        /^disable.*rls.*testing/i
      ]
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type];
    
    console.log(`${timestamp} ${prefix} ${message}`);
  }

  classifyScript(filename) {
    // Casos especiales primero
    if (filename === 'DocumentVTK.js') return 'methodology';
    if (filename.includes('backup') && filename.includes('DocumentVTK')) return 'methodology';
    if (filename === 'README.md') return null; // Mantener en root
    
    // Clasificar por patrones de función
    for (const [category, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        if (pattern.test(filename)) {
          return category;
        }
      }
    }
    
    // Casos por extensión específica
    if (filename.endsWith('.sql')) {
      if (filename.includes('migration') || filename.includes('fix')) {
        return 'project';
      }
      if (filename.includes('test') || filename.includes('disable')) {
        return 'testing';
      }
    }
    
    if (filename.endsWith('.ps1')) {
      if (filename.includes('deploy') || filename.includes('backup') || filename.includes('setup')) {
        return 'project';
      }
      if (filename.includes('test') || filename.includes('check')) {
        return 'testing';
      }
    }
    
    // Default: project (operaciones específicas)
    return 'project';
  }

  async organizeScripts() {
    this.log('🚀 Iniciando organización de scripts según VTK v4.2');
    this.log('='.repeat(60));
    
    try {
      // Leer scripts actuales
      const scripts = fs.readdirSync(this.srcScriptsPath);
      this.log(`📂 Encontrados ${scripts.length} elementos en ${this.srcScriptsPath}`);
      
      // Clasificar scripts
      for (const script of scripts) {
        const scriptPath = path.join(this.srcScriptsPath, script);
        const stats = fs.statSync(scriptPath);
        
        // Saltar directorios y archivos especiales
        if (stats.isDirectory()) {
          this.log(`📁 Saltando directorio: ${script}`, 'warning');
          continue;
        }
        
        const category = this.classifyScript(script);
        if (category) {
          this.categories[category].push(script);
        } else {
          this.log(`⏭️ Manteniendo en root: ${script}`, 'info');
        }
      }
      
      // Mostrar clasificación
      this.log('\n📊 CLASIFICACIÓN POR FUNCIÓN:');
      for (const [category, scripts] of Object.entries(this.categories)) {
        this.log(`${category.toUpperCase()}: ${scripts.length} scripts`);
        scripts.forEach(script => {
          console.log(`  - ${script}`);
        });
        console.log('');
      }
      
      // Confirmar antes de mover
      this.log('⚠️ REVISAR CLASIFICACIÓN ANTES DE CONTINUAR');
      this.log('✅ Si la clasificación es correcta, ejecutar con --execute');
      
      return this.categories;
      
    } catch (error) {
      this.log(`Error organizando scripts: ${error.message}`, 'error');
      throw error;
    }
  }

  async executeMove() {
    this.log('🔄 Ejecutando movimiento de scripts...');
    
    let movedCount = 0;
    
    for (const [category, scripts] of Object.entries(this.categories)) {
      if (scripts.length === 0) continue;
      
      const targetDir = path.join(this.targetScriptsPath, category);
      
      // Crear directorio si no existe
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        this.log(`📁 Creado directorio: ${targetDir}`);
      }
      
      // Mover scripts
      for (const script of scripts) {
        const sourcePath = path.join(this.srcScriptsPath, script);
        const targetPath = path.join(targetDir, script);
        
        try {
          fs.renameSync(sourcePath, targetPath);
          this.log(`📄 Movido: ${script} → ${category}/`);
          movedCount++;
        } catch (error) {
          this.log(`❌ Error moviendo ${script}: ${error.message}`, 'error');
        }
      }
    }
    
    this.log(`\n✅ Movidos ${movedCount} scripts exitosamente`);
    return movedCount;
  }

  async createCategoryREADMEs() {
    this.log('📝 Creando READMEs para cada categoría...');
    
    const readmeContent = {
      methodology: `# Methodology Scripts

Scripts universales de metodología VTK y herramientas de automatización.

## Contenido
- DocumentVTK y herramientas de documentación
- Validadores de arquitectura y reglas doradas
- Procesadores de requerimientos
- Automatización de versionado
- Herramientas VTK workflow

## Uso
Estos scripts son universales y pueden ser reutilizados en otros proyectos.
`,

      project: `# Project Scripts  

Scripts específicos del proyecto AI Pair Orchestrator Pro.

## Contenido
- Operaciones de deployment y setup
- Configuración de base de datos y migraciones
- Integraciones específicas (Supabase, Strapi, Siigo, etc.)
- Scripts de backup y rollback
- Configuración de usuarios y permisos
- Monitoring y auditorías

## Uso
Estos scripts son específicos del proyecto VibeThink.
`,

      build: `# Build Scripts

Scripts de construcción, compilación y procesamiento de assets.

## Contenido
- Build de CSS y estilos
- Generación de tipos TypeScript
- Sincronización de componentes UI
- Mapeo de rutas
- Gestión de dependencias
- Automatización de versionado

## Uso
Scripts para el proceso de build y desarrollo.
`,

      testing: `# Testing Scripts

Scripts de testing, QA y validación.

## Contenido  
- Tests unitarios e integración
- Validadores de código y estructura
- Tests de stress y rendimiento
- Verificación de accesibilidad (WCAG)
- Debug y diagnóstico
- Escenarios de prueba

## Uso
Scripts para testing y quality assurance.
`
    };
    
    for (const [category, content] of Object.entries(readmeContent)) {
      const readmePath = path.join(this.targetScriptsPath, category, 'README.md');
      fs.writeFileSync(readmePath, content);
      this.log(`📄 Creado README: ${category}/README.md`);
    }
  }
}

// Ejecutar
async function main() {
  const organizer = new ScriptOrganizer();
  const executeFlag = process.argv.includes('--execute');
  
  try {
    const classification = await organizer.organizeScripts();
    
    if (executeFlag) {
      const moved = await organizer.executeMove();
      await organizer.createCategoryREADMEs();
      
      console.log('\n' + '='.repeat(60));
      console.log('🎉 ORGANIZACIÓN COMPLETADA EXITOSAMENTE');
      console.log(`📊 Total scripts organizados: ${moved}`);
      console.log('📁 Nueva estructura:');
      console.log('  scripts/methodology/ - Herramientas universales VTK');
      console.log('  scripts/project/     - Operaciones específicas VibeThink');  
      console.log('  scripts/build/       - Scripts de construcción');
      console.log('  scripts/testing/     - Scripts de testing y QA');
      console.log('');
      console.log('✅ Listos para siguiente fase de reorganización');
    } else {
      console.log('\n⚠️ DRY RUN COMPLETADO');
      console.log('✅ Para ejecutar el movimiento, usar: --execute');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}

export { ScriptOrganizer };
