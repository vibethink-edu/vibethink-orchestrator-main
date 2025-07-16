#!/usr/bin/env node

/**
 * Kestra Integration Script
 * Gestiona la integración de Kestra con AIPAIR
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
  kestraDir: path.join(process.cwd(), 'integrations', 'workflow-engines', 'kestra'),
  registryFile: path.join(process.cwd(), 'integrations', 'component-registry.json'),
  dockerComposeFile: path.join(process.cwd(), 'docker-compose.kestra.yml')
};

// Versiones de Kestra disponibles
const KESTRA_VERSIONS = [
  '0.12.0', '0.11.0', '0.10.0', '0.9.0'
];

class KestraIntegration {
  constructor() {
    this.registry = {};
    this.currentVersion = null;
  }

  /**
   * Inicializar el sistema
   */
  async initialize() {
    console.log('🚀 Inicializando Integración de Kestra');
    
    try {
      await this.loadRegistry();
      await this.detectCurrentVersion();
      console.log('✅ Sistema inicializado');
    } catch (error) {
      console.error('❌ Error al inicializar:', error.message);
      throw error;
    }
  }

  /**
   * Cargar registro
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
   * Detectar versión actual
   */
  async detectCurrentVersion() {
    const componentId = 'kestra-engine';
    if (this.registry[componentId]) {
      this.currentVersion = this.registry[componentId].currentVersion;
    }
  }

  /**
   * Descargar versión específica de Kestra
   */
  async downloadVersion(version) {
    if (!KESTRA_VERSIONS.includes(version)) {
      throw new Error(`Versión no válida: ${version}`);
    }

    console.log(`📥 Descargando Kestra v${version}`);

    const versionDir = path.join(CONFIG.kestraDir, 'versions', `${version}-pure`);
    
    try {
      // Crear directorio
      await fs.mkdir(versionDir, { recursive: true });

      // Clonar repositorio
      execSync(`git clone https://github.com/kestra-io/kestra.git .`, {
        cwd: versionDir,
        stdio: 'pipe'
      });

      // Cambiar a versión específica
      execSync(`git checkout v${version}`, {
        cwd: versionDir,
        stdio: 'pipe'
      });

      console.log(`✅ Kestra v${version} descargado en: ${versionDir}`);
      return versionDir;
    } catch (error) {
      console.error(`❌ Error al descargar Kestra v${version}:`, error.message);
      throw error;
    }
  }

  /**
   * Crear versión demo con workflows de ejemplo
   */
  async createDemoVersion(version) {
    console.log(`🎭 Creando versión demo para Kestra v${version}`);

    const pureDir = path.join(CONFIG.kestraDir, 'versions', `${version}-pure`);
    const demoDir = path.join(CONFIG.kestraDir, 'versions', `${version}-demo`);

    try {
      // Copiar versión pura
      await this.copyDirectory(pureDir, demoDir);

      // Crear workflows de ejemplo
      await this.createExampleWorkflows(demoDir);

      console.log(`✅ Versión demo creada: ${demoDir}`);
      return demoDir;
    } catch (error) {
      console.error(`❌ Error al crear demo:`, error.message);
      throw error;
    }
  }

  /**
   * Copiar directorio recursivamente
   */
  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  /**
   * Crear workflows de ejemplo
   */
  async createExampleWorkflows(demoDir) {
    const workflowsDir = path.join(demoDir, 'examples', 'workflows');
    await fs.mkdir(workflowsDir, { recursive: true });

    // Workflow de ejemplo: Email Automation
    const emailWorkflow = {
      id: 'email-automation',
      namespace: 'aipair.examples',
      tasks: [
        {
          id: 'send-welcome-email',
          type: 'io.kestra.plugin.notifications.email.EmailSend',
          to: '{{ inputs.email }}',
          subject: 'Bienvenido a AIPAIR',
          htmlBodyContent: '<h1>¡Bienvenido!</h1><p>Gracias por unirte a AIPAIR.</p>'
        }
      ]
    };

    const emailWorkflowFile = path.join(workflowsDir, 'email-automation.yml');
    await fs.writeFile(emailWorkflowFile, JSON.stringify(emailWorkflow, null, 2));

    // Workflow de ejemplo: Data Processing
    const dataWorkflow = {
      id: 'data-processing',
      namespace: 'aipair.examples',
      tasks: [
        {
          id: 'fetch-data',
          type: 'io.kestra.plugin.core.http.Request',
          uri: 'https://api.example.com/data'
        },
        {
          id: 'process-data',
          type: 'io.kestra.plugin.core.script.Script',
          script: 'echo "Processing data..."'
        }
      ]
    };

    const dataWorkflowFile = path.join(workflowsDir, 'data-processing.yml');
    await fs.writeFile(dataWorkflowFile, JSON.stringify(dataWorkflow, null, 2));

    console.log('✅ Workflows de ejemplo creados');
  }

  /**
   * Crear versión AIPAIR con parches
   */
  async createAIPAIRVersion(version) {
    console.log(`🔧 Creando versión AIPAIR para Kestra v${version}`);

    const demoDir = path.join(CONFIG.kestraDir, 'versions', `${version}-demo`);
    const aipairDir = path.join(CONFIG.kestraDir, 'versions', `${version}-aipair`);

    try {
      // Copiar versión demo
      await this.copyDirectory(demoDir, aipairDir);

      // Aplicar parches
      await this.applyPatches(aipairDir);

      console.log(`✅ Versión AIPAIR creada: ${aipairDir}`);
      return aipairDir;
    } catch (error) {
      console.error(`❌ Error al crear versión AIPAIR:`, error.message);
      throw error;
    }
  }

  /**
   * Aplicar parches a la versión
   */
  async applyPatches(versionDir) {
    const patchesDir = path.join(CONFIG.kestraDir, 'patches');
    
    try {
      const patches = await fs.readdir(patchesDir);
      
      for (const patch of patches) {
        if (patch.startsWith('.')) continue;
        
        console.log(`🔧 Aplicando patch: ${patch}`);
        await this.applyPatch(versionDir, patch);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Aplicar patch específico
   */
  async applyPatch(versionDir, patchName) {
    const patchDir = path.join(CONFIG.kestraDir, 'patches', patchName);
    
    try {
      const patchFiles = await fs.readdir(patchDir);
      
      for (const file of patchFiles) {
        if (file === 'patch.json') continue;
        
        const srcFile = path.join(patchDir, file);
        const destFile = path.join(versionDir, file);
        
        await fs.copyFile(srcFile, destFile);
      }
      
      console.log(`✅ Patch aplicado: ${patchName}`);
    } catch (error) {
      console.error(`❌ Error al aplicar patch ${patchName}:`, error.message);
    }
  }

  /**
   * Generar Docker Compose para Kestra
   */
  async generateDockerCompose(version = '0.12.0') {
    console.log(`🐳 Generando Docker Compose para Kestra v${version}`);

    const dockerCompose = {
      version: '3.8',
      services: {
        kestra: {
          image: `kestra/kestra:${version}`,
          container_name: 'aipair-kestra',
          ports: ['8080:8080'],
          environment: {
            KESTRA_CONFIGURATION: 'kestra.configuration.storage=local',
            KESTRA_CONFIGURATION_LOCAL_BASE_PATH: '/tmp/kestra'
          },
          volumes: [
            './kestra-data:/tmp/kestra',
            './workflows:/opt/kestra/workflows'
          ],
          restart: 'unless-stopped'
        },
        postgres: {
          image: 'postgres:15',
          container_name: 'aipair-kestra-postgres',
          environment: {
            POSTGRES_DB: 'kestra',
            POSTGRES_USER: 'kestra',
            POSTGRES_PASSWORD: 'kestra'
          },
          volumes: ['./postgres-data:/var/lib/postgresql/data'],
          restart: 'unless-stopped'
        }
      },
      volumes: {
        'kestra-data': null,
        'postgres-data': null
      }
    };

    await fs.writeFile(CONFIG.dockerComposeFile, JSON.stringify(dockerCompose, null, 2));
    console.log(`✅ Docker Compose generado: ${CONFIG.dockerComposeFile}`);
  }

  /**
   * Iniciar Kestra con Docker
   */
  async startKestra() {
    console.log('🚀 Iniciando Kestra con Docker');

    try {
      execSync(`docker-compose -f ${CONFIG.dockerComposeFile} up -d`, {
        stdio: 'inherit'
      });
      
      console.log('✅ Kestra iniciado correctamente');
      console.log('🌐 Accede a: http://localhost:8080');
    } catch (error) {
      console.error('❌ Error al iniciar Kestra:', error.message);
      throw error;
    }
  }

  /**
   * Detener Kestra
   */
  async stopKestra() {
    console.log('🛑 Deteniendo Kestra');

    try {
      execSync(`docker-compose -f ${CONFIG.dockerComposeFile} down`, {
        stdio: 'inherit'
      });
      
      console.log('✅ Kestra detenido');
    } catch (error) {
      console.error('❌ Error al detener Kestra:', error.message);
      throw error;
    }
  }

  /**
   * Crear patch para Kestra
   */
  async createPatch(patchName, description = '') {
    console.log(`🔧 Creando patch: ${patchName}`);

    const patchDir = path.join(CONFIG.kestraDir, 'patches', patchName);
    
    try {
      await fs.mkdir(patchDir, { recursive: true });

      const patchMetadata = {
        id: patchName,
        description,
        createdAt: new Date().toISOString(),
        author: 'AIPAIR Team',
        version: this.currentVersion || '0.12.0'
      };

      const metadataFile = path.join(patchDir, 'patch.json');
      await fs.writeFile(metadataFile, JSON.stringify(patchMetadata, null, 2));

      console.log(`✅ Patch creado: ${patchDir}`);
      console.log('📝 Edita los archivos en el directorio del patch');
    } catch (error) {
      console.error('❌ Error al crear patch:', error.message);
      throw error;
    }
  }

  /**
   * Mostrar estado de Kestra
   */
  showStatus() {
    console.log('\n📊 Estado de Integración Kestra');
    console.log('='.repeat(50));
    
    console.log(`Versión actual: ${this.currentVersion || 'No configurada'}`);
    console.log(`Versiones disponibles: ${KESTRA_VERSIONS.join(', ')}`);
    
    const versionsDir = path.join(CONFIG.kestraDir, 'versions');
    fs.readdir(versionsDir).then(files => {
      console.log('\nVersiones instaladas:');
      files.forEach(file => {
        console.log(`📁 ${file}`);
      });
    }).catch(() => {
      console.log('\nNo hay versiones instaladas');
    });
  }

  /**
   * Registrar Kestra en el sistema de versionado
   */
  async registerKestra(version) {
    const componentId = 'kestra-engine';
    
    this.registry[componentId] = {
      id: componentId,
      type: 'kestra',
      currentVersion: version,
      pureVersion: version,
      patches: [],
      dependencies: ['postgres'],
      lastUpdate: new Date().toISOString(),
      status: 'up-to-date',
      metadata: {
        description: 'Motor de workflows Kestra',
        author: 'Kestra Team',
        license: 'Apache 2.0',
        source: 'https://github.com/kestra-io/kestra'
      }
    };

    await this.saveRegistry();
    console.log(`✅ Kestra registrado: v${version}`);
  }

  /**
   * Guardar registro
   */
  async saveRegistry() {
    await fs.writeFile(CONFIG.registryFile, JSON.stringify(this.registry, null, 2));
  }
}

/**
 * Función principal
 */
async function main() {
  const kestra = new KestraIntegration();
  
  try {
    await kestra.initialize();
    
    const command = process.argv[2];
    
    switch (command) {
      case 'status':
        kestra.showStatus();
        break;
        
      case 'download':
        const version = process.argv[3] || '0.12.0';
        await kestra.downloadVersion(version);
        break;
        
      case 'demo':
        const demoVersion = process.argv[3] || '0.12.0';
        await kestra.createDemoVersion(demoVersion);
        break;
        
      case 'aipair':
        const aipairVersion = process.argv[3] || '0.12.0';
        await kestra.createAIPAIRVersion(aipairVersion);
        break;
        
      case 'docker':
        const dockerVersion = process.argv[3] || '0.12.0';
        await kestra.generateDockerCompose(dockerVersion);
        break;
        
      case 'start':
        await kestra.startKestra();
        break;
        
      case 'stop':
        await kestra.stopKestra();
        break;
        
      case 'patch':
        const patchName = process.argv[3];
        const description = process.argv[4] || '';
        if (patchName) {
          await kestra.createPatch(patchName, description);
        } else {
          console.log('❌ Especifica nombre del patch: node kestra-integration.cjs patch <patch-name> [description]');
        }
        break;
        
      case 'register':
        const regVersion = process.argv[3] || '0.12.0';
        await kestra.registerKestra(regVersion);
        break;
        
      default:
        console.log('📋 Comandos disponibles:');
        console.log('  status     - Mostrar estado de Kestra');
        console.log('  download   - Descargar versión específica');
        console.log('  demo       - Crear versión demo');
        console.log('  aipair     - Crear versión AIPAIR');
        console.log('  docker     - Generar Docker Compose');
        console.log('  start      - Iniciar Kestra');
        console.log('  stop       - Detener Kestra');
        console.log('  patch      - Crear patch');
        console.log('  register   - Registrar en sistema de versionado');
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

module.exports = { KestraIntegration, KESTRA_VERSIONS }; 