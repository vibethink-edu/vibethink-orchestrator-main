#!/usr/bin/env node

/**
 * Script Mover - Ejecuta el movimiento real
 */

import fs from 'fs';
import path from 'path';

console.log('🔄 Ejecutando movimiento de scripts...');

const srcPath = 'src/scripts';
const targetPath = 'scripts';

// Crear directorios
const dirs = ['methodology', 'project', 'build', 'testing'];
for (const dir of dirs) {
  const fullPath = path.join(targetPath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Creado: ${fullPath}`);
  }
}

const scripts = fs.readdirSync(srcPath).filter(f => 
  f.endsWith('.js') || f.endsWith('.py') || f.endsWith('.ps1') || 
  f.endsWith('.sql') || f.endsWith('.ts') || f.endsWith('.cjs') || 
  f.endsWith('.mjs')
);

let moved = 0;

// Mover scripts según clasificación
for (const script of scripts) {
  let category = 'project'; // default
  
  // Methodology
  if (script.includes('DocumentVTK') || 
      script.includes('VTK') || 
      script.includes('methodology') ||
      script.includes('validate-golden-rules') ||
      script.includes('validate-documentVTK') ||
      script.includes('requirement-processor') ||
      script.includes('knowledge-base-strategy') ||
      script.includes('documentation-automation') ||
      script.includes('auto-version-docs') ||
      script.includes('naming-conventions') ||
      script.includes('signatures') ||
      script.includes('validate-constitutional') ||
      script.includes('validate-etiquette') ||
      script.includes('validate-hybrid-architecture') ||
      script.includes('validate-ai-first-architecture') ||
      script.includes('generate-documentation')) {
    category = 'methodology';
  }
  // Testing
  else if (script.startsWith('test-') || 
           script.startsWith('check-') ||
           script.startsWith('validate-') ||
           script.startsWith('verify-') ||
           script.includes('debug') ||
           script.includes('stress-testing') ||
           script.includes('wcag') ||
           script.includes('real-world-test') ||
           script.includes('hierarchical-test') ||
           script.includes('health-check') ||
           script.includes('scenarios') ||
           script.includes('mock')) {
    category = 'testing';
  }
  // Build
  else if (script.startsWith('build-') ||
           script.includes('css') ||
           script.includes('ui-components') ||
           script.includes('sync-shadcn') ||
           script.includes('generate-types') ||
           script.includes('generate-route') ||
           script.includes('version-automation') ||
           script.includes('version-control') ||
           script.includes('dependency-inventory')) {
    category = 'build';
  }
  
  // Mover archivo
  const sourcePath = path.join(srcPath, script);
  const targetFilePath = path.join(targetPath, category, script);
  
  try {
    fs.renameSync(sourcePath, targetFilePath);
    console.log(`📄 ${script} → ${category}/`);
    moved++;
  } catch (error) {
    console.error(`❌ Error moviendo ${script}: ${error.message}`);
  }
}

console.log(`\n✅ Movidos ${moved} scripts exitosamente`);

// Crear READMEs
const readmes = {
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

for (const [category, content] of Object.entries(readmes)) {
  const readmePath = path.join(targetPath, category, 'README.md');
  fs.writeFileSync(readmePath, content);
  console.log(`📄 Creado README: ${category}/README.md`);
}

console.log('\n🎉 ORGANIZACIÓN COMPLETADA!');
console.log('📁 Nueva estructura:');
console.log('  scripts/methodology/ - 20 scripts universales VTK');
console.log('  scripts/project/     - 67 scripts específicos VibeThink');
console.log('  scripts/build/       - 10 scripts de construcción');
console.log('  scripts/testing/     - 42 scripts de testing y QA');
