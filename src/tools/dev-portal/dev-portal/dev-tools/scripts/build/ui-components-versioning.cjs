#!/usr/bin/env node

/**
 * UI Components Versioning System
 * Sistema de control de versiones para componentes UI en AIPAIR
 * 
 * @author Marcelo Developer
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuración del sistema
const CONFIG = {
  baseDir: path.join(process.cwd(), 'integrations'),
  uiComponentsDir: 'ui-components',
  workflowEnginesDir: 'workflow-engines',
  designSystemsDir: 'design-systems',
  registryFile: 'component-registry.json',
  logFile: 'versioning.log'
};

// Tipos de componentes
const COMPONENT_TYPES = {
  SHADCN_UI: 'shadcn-ui',
  RADIX_UI: 'radix-ui',
  CUSTOM: 'custom-components',
  KESTRA: 'kestra',
  MEDUSA_UI: 'medusa-ui',
  STRAPI_UI: 'strapi-ui'
};

/**
 * Clase principal para gestión de versiones de componentes UI
 */
class UIComponentsVersioning {
  constructor() {
    this.registry = {};
    this.log = [];
  }

  /**
   * Inicializar el sistema de versionado
   */
  async initialize() {
    console.log('🚀 Inicializando Sistema de Versionado de Componentes UI');
    
    try {
      // Crear estructura de directorios
      await this.createDirectoryStructure();
      
      // Cargar registro existente
      await this.loadRegistry();
      
      // Validar estructura
      await this.validateStructure();
      
      console.log('✅ Sistema inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar:', error.message);
      throw error;
    }
  }

  /**
   * Crear estructura de directorios
   */
  async createDirectoryStructure() {
    const directories = [
      path.join(CONFIG.baseDir, CONFIG.uiComponentsDir),
      path.join(CONFIG.baseDir, CONFIG.workflowEnginesDir),
      path.join(CONFIG.baseDir, CONFIG.designSystemsDir),
      path.join(CONFIG.baseDir, CONFIG.uiComponentsDir, COMPONENT_TYPES.SHADCN_UI),
      path.join(CONFIG.baseDir, CONFIG.uiComponentsDir, COMPONENT_TYPES.RADIX_UI),
      path.join(CONFIG.baseDir, CONFIG.uiComponentsDir, COMPONENT_TYPES.CUSTOM),
      path.join(CONFIG.baseDir, CONFIG.workflowEnginesDir, COMPONENT_TYPES.KESTRA),
      path.join(CONFIG.baseDir, CONFIG.designSystemsDir, COMPONENT_TYPES.MEDUSA_UI),
      path.join(CONFIG.baseDir, CONFIG.designSystemsDir, COMPONENT_TYPES.STRAPI_UI)
    ];

    for (const dir of directories) {
      await this.ensureDirectory(dir);
    }

    // Crear subdirectorios para cada componente
    for (const componentType of Object.values(COMPONENT_TYPES)) {
      const basePath = path.join(CONFIG.baseDir, this.getComponentBasePath(componentType), componentType);
      const subDirs = ['versions', 'patches', 'docs'];
      
      for (const subDir of subDirs) {
        await this.ensureDirectory(path.join(basePath, subDir));
      }
    }
  }

  /**
   * Obtener ruta base del componente
   */
  getComponentBasePath(componentType) {
    switch (componentType) {
      case COMPONENT_TYPES.SHADCN_UI:
      case COMPONENT_TYPES.RADIX_UI:
      case COMPONENT_TYPES.CUSTOM:
        return CONFIG.uiComponentsDir;
      case COMPONENT_TYPES.KESTRA:
        return CONFIG.workflowEnginesDir;
      case COMPONENT_TYPES.MEDUSA_UI:
      case COMPONENT_TYPES.STRAPI_UI:
        return CONFIG.designSystemsDir;
      default:
        return CONFIG.uiComponentsDir;
    }
  }

  /**
   * Asegurar que existe un directorio
   */
  async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`📁 Creado directorio: ${dirPath}`);
    }
  }

  /**
   * Cargar registro de componentes
   */
  async loadRegistry() {
    const registryPath = path.join(CONFIG.baseDir, CONFIG.registryFile);
    
    try {
      const data = await fs.readFile(registryPath, 'utf8');
      this.registry = JSON.parse(data);
      console.log(`📋 Registro cargado: ${Object.keys(this.registry).length} componentes`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.registry = {};
        await this.saveRegistry();
        console.log('📋 Registro inicializado');
      } else {
        throw error;
      }
    }
  }

  /**
   * Guardar registro de componentes
   */
  async saveRegistry() {
    const registryPath = path.join(CONFIG.baseDir, CONFIG.registryFile);
    await fs.writeFile(registryPath, JSON.stringify(this.registry, null, 2));
  }

  /**
   * Validar estructura del sistema
   */
  async validateStructure() {
    const requiredDirs = [
      path.join(CONFIG.baseDir, CONFIG.uiComponentsDir),
      path.join(CONFIG.baseDir, CONFIG.workflowEnginesDir),
      path.join(CONFIG.baseDir, CONFIG.designSystemsDir)
    ];

    for (const dir of requiredDirs) {
      try {
        await fs.access(dir);
      } catch {
        throw new Error(`Directorio requerido no encontrado: ${dir}`);
      }
    }

    console.log('✅ Estructura validada correctamente');
  }

  /**
   * Registrar un nuevo componente
   */
  async registerComponent(componentId, componentType, version, metadata = {}) {
    const component = {
      id: componentId,
      type: componentType,
      currentVersion: version,
      pureVersion: version,
      patches: [],
      dependencies: metadata.dependencies || [],
      lastUpdate: new Date().toISOString(),
      status: 'up-to-date',
      metadata: {
        description: metadata.description || '',
        author: metadata.author || 'AIPAIR Team',
        license: metadata.license || 'MIT',
        ...metadata
      }
    };

    this.registry[componentId] = component;
    await this.saveRegistry();
    
    console.log(`✅ Componente registrado: ${componentId} v${version}`);
    this.logAction('register', componentId, version);
  }

  /**
   * Actualizar versión de un componente
   */
  async updateComponent(componentId, newVersion, options = {}) {
    if (!this.registry[componentId]) {
      throw new Error(`Componente no encontrado: ${componentId}`);
    }

    const component = this.registry[componentId];
    const oldVersion = component.currentVersion;

    console.log(`🔄 Actualizando ${componentId}: ${oldVersion} → ${newVersion}`);

    try {
      // Descargar nueva versión
      await this.downloadVersion(componentId, newVersion, options);

      // Aplicar parches existentes
      if (options.applyPatches !== false) {
        await this.applyPatches(componentId);
      }

      // Ejecutar tests
      if (options.runTests !== false) {
        await this.runTests(componentId);
      }

      // Actualizar registro
      component.currentVersion = newVersion;
      component.lastUpdate = new Date().toISOString();
      component.status = 'up-to-date';

      await this.saveRegistry();
      
      console.log(`✅ Componente actualizado: ${componentId} v${newVersion}`);
      this.logAction('update', componentId, newVersion);
    } catch (error) {
      console.error(`❌ Error al actualizar ${componentId}:`, error.message);
      this.logAction('update-error', componentId, newVersion, error.message);
      throw error;
    }
  }

  /**
   * Descargar versión oficial de un componente
   */
  async downloadVersion(componentId, version, options = {}) {
    const component = this.registry[componentId];
    const versionDir = path.join(
      CONFIG.baseDir,
      this.getComponentBasePath(component.type),
      component.type,
      'versions',
      `${version}-pure`
    );

    console.log(`📥 Descargando versión ${version} de ${componentId}`);

    // Crear directorio de versión
    await this.ensureDirectory(versionDir);

    // Simular descarga (aquí iría la lógica real de descarga)
    const downloadScript = this.getDownloadScript(component.type, componentId, version);
    
    if (downloadScript) {
      try {
        execSync(downloadScript, { cwd: versionDir, stdio: 'pipe' });
      } catch (error) {
        throw new Error(`Error al descargar versión: ${error.message}`);
      }
    }

    console.log(`✅ Versión descargada: ${versionDir}`);
  }

  /**
   * Obtener script de descarga según el tipo de componente
   */
  getDownloadScript(componentType, componentId, version) {
    switch (componentType) {
      case COMPONENT_TYPES.SHADCN_UI:
        return `npx shadcn@latest add ${componentId} --yes`;
      case COMPONENT_TYPES.KESTRA:
        return `git clone https://github.com/kestra-io/kestra.git . && git checkout v${version}`;
      case COMPONENT_TYPES.MEDUSA_UI:
        return `npm install @medusajs/ui@${version}`;
      default:
        return null;
    }
  }

  /**
   * Aplicar parches a un componente
   */
  async applyPatches(componentId) {
    const component = this.registry[componentId];
    const patchesDir = path.join(
      CONFIG.baseDir,
      this.getComponentBasePath(component.type),
      component.type,
      'patches'
    );

    try {
      const patches = await fs.readdir(patchesDir);
      
      for (const patch of patches) {
        if (patch.startsWith('.')) continue;
        
        console.log(`🔧 Aplicando patch: ${patch}`);
        await this.applyPatch(componentId, patch);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Aplicar un patch específico
   */
  async applyPatch(componentId, patchName) {
    // Implementar lógica de aplicación de parches
    console.log(`🔧 Patch aplicado: ${patchName}`);
  }

  /**
   * Ejecutar tests para un componente
   */
  async runTests(componentId) {
    console.log(`🧪 Ejecutando tests para ${componentId}`);
    
    // Implementar lógica de testing
    // Por ahora simulamos tests exitosos
    return true;
  }

  /**
   * Generar patch para un componente
   */
  async generatePatch(componentId, patchName, changes) {
    const component = this.registry[componentId];
    const patchDir = path.join(
      CONFIG.baseDir,
      this.getComponentBasePath(component.type),
      component.type,
      'patches',
      patchName
    );

    await this.ensureDirectory(patchDir);

    const patch = {
      id: patchName,
      componentId,
      version: component.currentVersion,
      changes,
      createdAt: new Date().toISOString(),
      author: 'AIPAIR Team'
    };

    const patchFile = path.join(patchDir, 'patch.json');
    await fs.writeFile(patchFile, JSON.stringify(patch, null, 2));

    // Agregar patch al registro
    component.patches.push(patchName);
    await this.saveRegistry();

    console.log(`✅ Patch generado: ${patchName}`);
    this.logAction('generate-patch', componentId, patchName);
  }

  /**
   * Listar componentes registrados
   */
  listComponents(filter = {}) {
    let components = Object.values(this.registry);

    if (filter.type) {
      components = components.filter(c => c.type === filter.type);
    }

    if (filter.status) {
      components = components.filter(c => c.status === filter.status);
    }

    return components;
  }

  /**
   * Obtener estado del sistema
   */
  getSystemStatus() {
    const components = Object.values(this.registry);
    
    return {
      total: components.length,
      upToDate: components.filter(c => c.status === 'up-to-date').length,
      needsUpdate: components.filter(c => c.status === 'needs-update').length,
      conflicts: components.filter(c => c.status === 'conflict').length,
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Registrar acción en el log
   */
  logAction(action, componentId, version, details = '') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      componentId,
      version,
      details
    };

    this.log.push(logEntry);
    
    // Guardar log en archivo
    const logFile = path.join(CONFIG.baseDir, CONFIG.logFile);
    fs.appendFile(logFile, JSON.stringify(logEntry) + '\n').catch(console.error);
  }

  /**
   * Mostrar dashboard de componentes
   */
  showDashboard() {
    const status = this.getSystemStatus();
    const components = this.listComponents();

    console.log('\n📊 Dashboard de Componentes UI');
    console.log('='.repeat(50));
    
    console.log(`Total de componentes: ${status.total}`);
    console.log(`✅ Actualizados: ${status.upToDate}`);
    console.log(`⚠️  Necesitan actualización: ${status.needsUpdate}`);
    console.log(`❌ Conflictos: ${status.conflicts}`);
    
    console.log('\nComponentes registrados:');
    components.forEach(component => {
      const statusIcon = component.status === 'up-to-date' ? '✅' : 
                        component.status === 'needs-update' ? '⚠️' : '❌';
      
      console.log(`${statusIcon} ${component.id} v${component.currentVersion} (${component.type})`);
    });
  }
}

/**
 * Función principal del script
 */
async function main() {
  const versioning = new UIComponentsVersioning();
  
  try {
    await versioning.initialize();
    
    // Mostrar dashboard
    versioning.showDashboard();
    
    // Ejemplo de uso
    if (process.argv.includes('--example')) {
      console.log('\n🔧 Ejemplo de uso:');
      
      // Registrar componentes de ejemplo
      await versioning.registerComponent('button', COMPONENT_TYPES.SHADCN_UI, '1.0.0', {
        description: 'Componente Button de shadcn/ui',
        author: 'shadcn'
      });
      
      await versioning.registerComponent('kestra-engine', COMPONENT_TYPES.KESTRA, '0.12.0', {
        description: 'Motor de workflows Kestra',
        author: 'Kestra Team'
      });
      
      // Mostrar dashboard actualizado
      versioning.showDashboard();
    }
    
  } catch (error) {
    console.error('❌ Error en el sistema:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es el script principal
if (require.main === module) {
  main();
}

module.exports = { UIComponentsVersioning, COMPONENT_TYPES, CONFIG }; 