#!/usr/bin/env node

/**
 * NPM Install Validator - VibeThink Orchestrator
 * AI-agnostic validator to prevent incorrect npm installations in monorepo
 */

const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  title: (msg) => console.log(`${colors.cyan}${colors.bold}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}📋 ${msg}${colors.reset}`)
};

class NpmInstallValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.errors = [];
    this.warnings = [];
    this.successes = [];
    
    // Dependencias que SIEMPRE deben estar en raíz
    this.rootOnlyDeps = [
      'react',
      'react-dom',
      'next',
      'typescript',
      'eslint',
      'prettier',
      'tailwindcss',
      'postcss',
      'autoprefixer',
      '@types/react',
      '@types/react-dom',
      '@types/node',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      '@supabase/supabase-js',
      'zod',
      'zustand'
    ];
    
    // Apps que pueden tener excepciones
    this.marketingApps = ['website'];
    
    // Dependencias permitidas por app específica
    this.appSpecificDeps = {
      'dashboard': [
        '@fullcalendar/core',
        '@fullcalendar/daygrid',
        '@fullcalendar/interaction',
        '@fullcalendar/list',
        '@fullcalendar/react',
        '@fullcalendar/timegrid',
        'recharts',
        '@hello-pangea/dnd'
      ],
      'website': [
        'framer-motion',
        'motion',
        'embla-carousel-react',
        'react-use-measure'
      ],
      'admin': [],
      'login': [],
      'helpdesk': [],
      'main-app': []
    };
  }

  async validate() {
    log.title('\n🔍 NPM INSTALL VALIDATOR - VibeThink Orchestrator');
    log.title('================================================\n');
    
    try {
      await this.checkRootPackageJson();
      await this.checkAppPackageJsons();
      await this.checkForDuplicates();
      await this.validateInstallLocation();
      
      this.printReport();
      return this.errors.length === 0;
    } catch (error) {
      log.error(`Error durante validación: ${error.message}`);
      return false;
    }
  }

  async checkRootPackageJson() {
    log.info('Verificando package.json raíz...');
    
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packagePath)) {
      this.errors.push('package.json raíz no encontrado');
      return;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const allDeps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };
    
    // Verificar que las dependencias críticas estén en raíz
    const missingInRoot = this.rootOnlyDeps.filter(dep => !allDeps[dep]);
    if (missingInRoot.length > 0) {
      this.warnings.push(`Dependencias faltantes en raíz: ${missingInRoot.join(', ')}`);
    } else {
      this.successes.push('Todas las dependencias críticas están en raíz');
    }
  }

  async checkAppPackageJsons() {
    log.info('Verificando package.json de apps...');
    
    const appsDir = path.join(this.projectRoot, 'apps');
    if (!fs.existsSync(appsDir)) {
      this.warnings.push('Directorio apps/ no encontrado');
      return;
    }
    
    const apps = fs.readdirSync(appsDir).filter(app => 
      fs.statSync(path.join(appsDir, app)).isDirectory()
    );
    
    for (const app of apps) {
      const packagePath = path.join(appsDir, app, 'package.json');
      if (!fs.existsSync(packagePath)) continue;
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const allDeps = {
        ...packageJson.dependencies || {},
        ...packageJson.devDependencies || {}
      };
      
      // Verificar duplicaciones no permitidas
      for (const [dep, version] of Object.entries(allDeps)) {
        if (this.rootOnlyDeps.includes(dep)) {
          // Excepción para marketing apps con React 19
          if (this.marketingApps.includes(app) && dep === 'react' && version.includes('19')) {
            this.successes.push(`${app}: React 19 permitido en marketing app`);
          } else if (this.marketingApps.includes(app) && dep === 'react-dom' && version.includes('19')) {
            this.successes.push(`${app}: React-DOM 19 permitido en marketing app`);
          } else {
            this.errors.push(`${app}: "${dep}" debe estar solo en raíz, no en apps/${app}`);
          }
        } else if (this.isAppSpecificDep(dep, app)) {
          this.successes.push(`${app}: "${dep}" correctamente instalado en app específica`);
        }
      }
    }
  }

  isAppSpecificDep(dep, app) {
    // Verificar si la dependencia es específica de esa app
    const allowedDeps = this.appSpecificDeps[app] || [];
    return allowedDeps.some(allowed => dep.includes(allowed));
  }

  async checkForDuplicates() {
    log.info('Buscando duplicaciones de dependencias...');
    
    const rootPackage = path.join(this.projectRoot, 'package.json');
    const rootDeps = this.getPackageDeps(rootPackage);
    
    const appsDir = path.join(this.projectRoot, 'apps');
    if (!fs.existsSync(appsDir)) return;
    
    const duplicates = new Map();
    
    const apps = fs.readdirSync(appsDir).filter(app => 
      fs.statSync(path.join(appsDir, app)).isDirectory()
    );
    
    for (const app of apps) {
      const packagePath = path.join(appsDir, app, 'package.json');
      if (!fs.existsSync(packagePath)) continue;
      
      const appDeps = this.getPackageDeps(packagePath);
      
      for (const dep of appDeps) {
        if (rootDeps.has(dep) && !this.marketingApps.includes(app)) {
          if (!duplicates.has(dep)) {
            duplicates.set(dep, []);
          }
          duplicates.set(dep, [...duplicates.get(dep), app]);
        }
      }
    }
    
    duplicates.forEach((apps, dep) => {
      if (!['react', 'react-dom'].includes(dep)) { // Excepciones conocidas
        this.warnings.push(`"${dep}" duplicado en: raíz y ${apps.join(', ')}`);
      }
    });
    
    if (duplicates.size === 0) {
      this.successes.push('No hay duplicaciones problemáticas');
    }
  }

  getPackageDeps(packagePath) {
    if (!fs.existsSync(packagePath)) return new Set();
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const deps = new Set();
    
    Object.keys(packageJson.dependencies || {}).forEach(dep => deps.add(dep));
    Object.keys(packageJson.devDependencies || {}).forEach(dep => deps.add(dep));
    
    return deps;
  }

  async validateInstallLocation() {
    log.info('Validando ubicación de instalaciones...');
    
    // Verificar que no haya node_modules anidados problemáticos
    const appsDir = path.join(this.projectRoot, 'apps');
    if (!fs.existsSync(appsDir)) return;
    
    const apps = fs.readdirSync(appsDir).filter(app => 
      fs.statSync(path.join(appsDir, app)).isDirectory()
    );
    
    for (const app of apps) {
      const nodeModulesPath = path.join(appsDir, app, 'node_modules');
      if (fs.existsSync(nodeModulesPath)) {
        // Verificar si tiene React/Next local
        const problematicModules = ['react', 'next', 'typescript'].filter(mod => 
          fs.existsSync(path.join(nodeModulesPath, mod))
        );
        
        if (problematicModules.length > 0 && !this.marketingApps.includes(app)) {
          this.errors.push(`${app}: node_modules local contiene: ${problematicModules.join(', ')}`);
        }
      }
    }
  }

  printReport() {
    log.title('\n📊 REPORTE DE VALIDACIÓN NPM');
    log.title('============================\n');
    
    // Éxitos
    if (this.successes.length > 0) {
      log.title('✅ ÉXITOS:');
      this.successes.forEach(msg => log.success(msg));
    }
    
    // Advertencias
    if (this.warnings.length > 0) {
      log.title('\n⚠️ ADVERTENCIAS:');
      this.warnings.forEach(msg => log.warning(msg));
    }
    
    // Errores
    if (this.errors.length > 0) {
      log.title('\n❌ ERRORES CRÍTICOS:');
      this.errors.forEach(msg => log.error(msg));
      
      log.title('\n🔧 CÓMO CORREGIR:');
      log.info('1. Para dependencias duplicadas en apps:');
      log.info('   cd apps/[nombre-app] && npm uninstall [dependencia]');
      log.info('   cd ../.. && npm install [dependencia]');
      log.info('');
      log.info('2. Para dependencias app-específicas:');
      log.info('   cd apps/[nombre-app] && npm install [dependencia-especifica]');
    }
    
    // Resultado final
    log.title('\n🎯 RESULTADO:');
    if (this.errors.length === 0) {
      log.success('✅ NPM INSTALL VALIDATION: PASSED');
    } else {
      log.error(`❌ NPM INSTALL VALIDATION: FAILED - ${this.errors.length} errores críticos`);
    }
    
    log.info(`\nTotal: ${this.successes.length} éxitos, ${this.warnings.length} advertencias, ${this.errors.length} errores`);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const validator = new NpmInstallValidator();
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = NpmInstallValidator;