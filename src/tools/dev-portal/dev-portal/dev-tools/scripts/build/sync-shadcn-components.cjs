#!/usr/bin/env node

/**
 * ShadCN UI Components Sync Script
 * Sincroniza componentes de shadcn/ui con el sistema de versionado
 * 
 * @author Marcelo Developer
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const CONFIG = {
  baseDir: path.join(process.cwd(), 'integrations'),
  shadcnDir: path.join(process.cwd(), 'integrations', 'ui-components', 'shadcn-ui'),
  srcComponentsDir: path.join(process.cwd(), 'src', 'components', 'ui'),
  registryFile: path.join(process.cwd(), 'integrations', 'component-registry.json')
};

// Componentes shadcn/ui disponibles
const SHADCN_COMPONENTS = [
  'accordion', 'alert', 'alert-dialog', 'aspect-ratio', 'avatar', 'badge',
  'button', 'calendar', 'card', 'carousel', 'checkbox', 'collapsible',
  'command', 'context-menu', 'dialog', 'dropdown-menu', 'drawer',
  'form', 'hover-card', 'input', 'input-otp', 'label', 'menubar',
  'navigation-menu', 'pagination', 'popover', 'progress', 'radio-group',
  'resizable', 'scroll-area', 'select', 'separator', 'sheet', 'skeleton',
  'slider', 'sonner', 'switch', 'table', 'tabs', 'textarea', 'toast',
  'toaster', 'toggle', 'toggle-group', 'tooltip'
];

class ShadCNComponentsSync {
  constructor() {
    this.registry = {};
    this.installedComponents = [];
  }

  /**
   * Inicializar el sistema
   */
  async initialize() {
    console.log('🚀 Inicializando Sincronización de ShadCN Components');
    
    try {
      await this.loadRegistry();
      await this.scanInstalledComponents();
      console.log('✅ Sistema inicializado');
    } catch (error) {
      console.error('❌ Error al inicializar:', error.message);
      throw error;
    }
  }

  /**
   * Cargar registro de componentes
   */
  async loadRegistry() {
    try {
      const data = await fs.readFile(CONFIG.registryFile, 'utf8');
      this.registry = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.registry = {};
      } else {
        throw error;
      }
    }
  }

  /**
   * Escanear componentes instalados
   */
  async scanInstalledComponents() {
    try {
      const files = await fs.readdir(CONFIG.srcComponentsDir);
      this.installedComponents = files
        .filter(file => file.endsWith('.tsx'))
        .map(file => file.replace('.tsx', ''));
      
      console.log(`📋 Componentes instalados: ${this.installedComponents.length}`);
    } catch (error) {
      console.warn('⚠️  No se pudo escanear componentes instalados:', error.message);
      this.installedComponents = [];
    }
  }

  /**
   * Instalar componente shadcn/ui
   */
  async installComponent(componentName) {
    if (!SHADCN_COMPONENTS.includes(componentName)) {
      throw new Error(`Componente no válido: ${componentName}`);
    }

    console.log(`📦 Instalando componente: ${componentName}`);

    try {
      // Instalar con shadcn CLI
      execSync(`npx shadcn@latest add ${componentName} --yes`, {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      // Registrar en el sistema de versionado
      await this.registerComponent(componentName);

      console.log(`✅ Componente instalado: ${componentName}`);
      return true;
    } catch (error) {
      console.error(`❌ Error al instalar ${componentName}:`, error.message);
      return false;
    }
  }

  /**
   * Registrar componente en el sistema de versionado
   */
  async registerComponent(componentName) {
    const componentId = `shadcn-${componentName}`;
    
    if (!this.registry[componentId]) {
      this.registry[componentId] = {
        id: componentId,
        type: 'shadcn-ui',
        currentVersion: '1.0.0',
        pureVersion: '1.0.0',
        patches: [],
        dependencies: [],
        lastUpdate: new Date().toISOString(),
        status: 'up-to-date',
        metadata: {
          description: `Componente ${componentName} de shadcn/ui`,
          author: 'shadcn',
          license: 'MIT',
          source: 'https://ui.shadcn.com'
        }
      };

      await this.saveRegistry();
      console.log(`📋 Componente registrado: ${componentId}`);
    }
  }

  /**
   * Guardar registro
   */
  async saveRegistry() {
    await fs.writeFile(CONFIG.registryFile, JSON.stringify(this.registry, null, 2));
  }

  /**
   * Sincronizar todos los componentes
   */
  async syncAllComponents() {
    console.log('🔄 Sincronizando todos los componentes shadcn/ui');
    
    const results = {
      installed: [],
      failed: [],
      skipped: []
    };

    for (const component of SHADCN_COMPONENTS) {
      if (this.installedComponents.includes(component)) {
        console.log(`⏭️  Saltando ${component} (ya instalado)`);
        results.skipped.push(component);
        continue;
      }

      const success = await this.installComponent(component);
      if (success) {
        results.installed.push(component);
      } else {
        results.failed.push(component);
      }
    }

    return results;
  }

  /**
   * Actualizar componente específico
   */
  async updateComponent(componentName) {
    if (!this.installedComponents.includes(componentName)) {
      throw new Error(`Componente no instalado: ${componentName}`);
    }

    console.log(`🔄 Actualizando componente: ${componentName}`);

    try {
      // Reinstalar componente
      execSync(`npx shadcn@latest add ${componentName} --yes --overwrite`, {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      // Actualizar registro
      const componentId = `shadcn-${componentName}`;
      if (this.registry[componentId]) {
        this.registry[componentId].lastUpdate = new Date().toISOString();
        await this.saveRegistry();
      }

      console.log(`✅ Componente actualizado: ${componentName}`);
      return true;
    } catch (error) {
      console.error(`❌ Error al actualizar ${componentName}:`, error.message);
      return false;
    }
  }

  /**
   * Generar patch para componente
   */
  async generatePatch(componentName, patchName) {
    const componentPath = path.join(CONFIG.srcComponentsDir, `${componentName}.tsx`);
    const patchDir = path.join(CONFIG.shadcnDir, 'patches', patchName);

    try {
      // Crear directorio de patch
      await fs.mkdir(patchDir, { recursive: true });

      // Copiar componente actual
      const patchFile = path.join(patchDir, `${componentName}.tsx`);
      await fs.copyFile(componentPath, patchFile);

      // Crear metadata del patch
      const patchMetadata = {
        id: patchName,
        componentId: `shadcn-${componentName}`,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        author: 'AIPAIR Team',
        description: `Patch personalizado para ${componentName}`
      };

      const metadataFile = path.join(patchDir, 'patch.json');
      await fs.writeFile(metadataFile, JSON.stringify(patchMetadata, null, 2));

      console.log(`✅ Patch generado: ${patchName} para ${componentName}`);
    } catch (error) {
      console.error(`❌ Error al generar patch:`, error.message);
      throw error;
    }
  }

  /**
   * Mostrar estado de componentes
   */
  showStatus() {
    console.log('\n📊 Estado de Componentes ShadCN UI');
    console.log('='.repeat(50));
    
    console.log(`Total disponibles: ${SHADCN_COMPONENTS.length}`);
    console.log(`Instalados: ${this.installedComponents.length}`);
    console.log(`Pendientes: ${SHADCN_COMPONENTS.length - this.installedComponents.length}`);
    
    console.log('\nComponentes instalados:');
    this.installedComponents.forEach(component => {
      console.log(`✅ ${component}`);
    });
    
    console.log('\nComponentes pendientes:');
    const pending = SHADCN_COMPONENTS.filter(c => !this.installedComponents.includes(c));
    pending.forEach(component => {
      console.log(`⏳ ${component}`);
    });
  }

  /**
   * Validar componentes instalados
   */
  async validateComponents() {
    console.log('🔍 Validando componentes instalados');
    
    const issues = [];
    
    for (const component of this.installedComponents) {
      const componentPath = path.join(CONFIG.srcComponentsDir, `${component}.tsx`);
      
      try {
        await fs.access(componentPath);
      } catch {
        issues.push({
          component,
          issue: 'Archivo no encontrado'
        });
      }
    }
    
    if (issues.length > 0) {
      console.log('⚠️  Problemas encontrados:');
      issues.forEach(issue => {
        console.log(`  - ${issue.component}: ${issue.issue}`);
      });
    } else {
      console.log('✅ Todos los componentes están correctos');
    }
    
    return issues;
  }
}

/**
 * Función principal
 */
async function main() {
  const sync = new ShadCNComponentsSync();
  
  try {
    await sync.initialize();
    
    const command = process.argv[2];
    
    switch (command) {
      case 'status':
        sync.showStatus();
        break;
        
      case 'install':
        const component = process.argv[3];
        if (component) {
          await sync.installComponent(component);
        } else {
          console.log('❌ Especifica un componente: node sync-shadcn-components.cjs install <component>');
        }
        break;
        
      case 'sync-all':
        const results = await sync.syncAllComponents();
        console.log('\n📊 Resultados de sincronización:');
        console.log(`✅ Instalados: ${results.installed.length}`);
        console.log(`❌ Fallidos: ${results.failed.length}`);
        console.log(`⏭️  Saltados: ${results.skipped.length}`);
        break;
        
      case 'update':
        const updateComponent = process.argv[3];
        if (updateComponent) {
          await sync.updateComponent(updateComponent);
        } else {
          console.log('❌ Especifica un componente: node sync-shadcn-components.cjs update <component>');
        }
        break;
        
      case 'patch':
        const patchComponent = process.argv[3];
        const patchName = process.argv[4];
        if (patchComponent && patchName) {
          await sync.generatePatch(patchComponent, patchName);
        } else {
          console.log('❌ Especifica componente y nombre del patch: node sync-shadcn-components.cjs patch <component> <patch-name>');
        }
        break;
        
      case 'validate':
        await sync.validateComponents();
        break;
        
      default:
        console.log('📋 Comandos disponibles:');
        console.log('  status     - Mostrar estado de componentes');
        console.log('  install    - Instalar componente específico');
        console.log('  sync-all   - Sincronizar todos los componentes');
        console.log('  update     - Actualizar componente específico');
        console.log('  patch      - Generar patch para componente');
        console.log('  validate   - Validar componentes instalados');
        break;
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ShadCNComponentsSync, SHADCN_COMPONENTS }; 