#!/usr/bin/env node

/**
 * VHelp - Comando genérico de ayuda para VibeThink Orchestrator
 * Muestra todos los comandos disponibles organizados por categorías
 * AI-agnostic: funciona con cualquier AI (Claude, OpenAI, Gemini, etc.)
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
  white: '\x1b[37m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

const log = {
  title: (msg) => console.log(`${colors.cyan}${colors.bold}${msg}${colors.reset}`),
  subtitle: (msg) => console.log(`${colors.magenta}${colors.bold}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}📋 ${msg}${colors.reset}`),
  command: (cmd, desc) => console.log(`${colors.white}  ${cmd.padEnd(35)} ${colors.dim}# ${desc}${colors.reset}`),
  section: (title) => console.log(`\n${colors.yellow}${colors.bold}📂 ${title.toUpperCase()}${colors.reset}`)
};

class VThinkHelper {
  constructor() {
    this.projectRoot = process.cwd();
    this.commands = new Map();
    this.categories = {
      development: {
        title: 'Desarrollo y Construcción',
        keywords: ['dev', 'build', 'start', 'serve'],
        icon: '🚀'
      },
      validation: {
        title: 'Validación y Calidad',
        keywords: ['validate', 'lint', 'test', 'check'],
        icon: '🔍'
      },
      fixing: {
        title: 'Corrección Automática',
        keywords: ['fix', 'clean', 'repair', 'setup'],
        icon: '🔧'
      },
      ai: {
        title: 'Comandos AI-Específicos',
        keywords: ['ai:', 'pre-commit'],
        icon: '🤖'
      },
      maintenance: {
        title: 'Mantenimiento y Utilidades',
        keywords: ['install', 'clean', 'setup', 'migration'],
        icon: '🛠️'
      },
      documentation: {
        title: 'Documentación y Sitios',
        keywords: ['start:sites', 'create:sites', 'migrate:docs'],
        icon: '📚'
      }
    };
  }

  async showHelp() {
    this.printHeader();
    await this.loadCommands();
    this.categorizeCommands();
    this.printCommands();
    this.printFooter();
  }

  printHeader() {
    console.log('');
    log.title('🛠️  VHELP - VibeThink Orchestrator');
    log.title('='.repeat(50));
    log.info('Comando de ayuda universal con todos los scripts disponibles');
    console.log('');
  }

  async loadCommands() {
    const packagePath = path.join(this.projectRoot, 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      log.error('package.json no encontrado en la raíz del proyecto');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const scripts = packageJson.scripts || {};

    // Agregar comandos desde package.json
    Object.entries(scripts).forEach(([command, script]) => {
      this.commands.set(`npm run ${command}`, {
        script,
        description: this.generateDescription(command, script),
        category: this.determineCategory(command)
      });
    });

    // Agregar comandos adicionales manualmente conocidos
    this.addManualCommands();
  }

  generateDescription(command, script) {
    const descriptions = {
      // Desarrollo
      'dev': 'Inicia servidor de desarrollo (Dashboard)',
      'dev:dashboard': 'Servidor de desarrollo - Dashboard',
      'dev:admin': 'Servidor de desarrollo - Admin',
      'dev:login': 'Servidor de desarrollo - Login',
      'dev:helpdesk': 'Servidor de desarrollo - Helpdesk',
      'dev:all': 'Inicia todos los servidores de desarrollo',
      
      // Build
      'build': 'Construye todas las aplicaciones',
      'build:dashboard': 'Construye aplicación Dashboard',
      'build:admin': 'Construye aplicación Admin',
      'build:website': 'Construye sitio web de marketing',
      'build:all': 'Construye todas las aplicaciones del monorepo',
      
      // Validación - 4 NIVELES JERARQUICOS (AI_UNIFIED_RULES.md)
      'validate:quick': 'NIVEL 1 - Validación rápida (antes de empezar trabajo)',
      'validate:universal': 'NIVEL 2 - Validación completa (antes de commit)',
      'validate:guard': 'NIVEL 3 - Protección emergencia (cuando algo se rompe)',
      'validate:ecosystem': 'NIVEL 4 - Validación ecosistema completo (CI/CD)',
      
      // Validaciones especializadas
      'validate:cross-app-compatibility': 'Validación entre aplicaciones',
      'validate:shared-component-impact': 'Análisis de impacto de componentes compartidos',
      'validate:external-update': 'Evaluación de riesgo para actualizaciones externas',
      'validate:security': 'Validación de cumplimiento de seguridad',
      'validate:performance': 'Validación de métricas de rendimiento',
      'validate:architecture': 'Validación de arquitectura y estructura',
      'validate:multilang': 'Validación de reglas multiidioma',
      'validate:npm-install': 'Validación de instalaciones NPM',
      'validate:duplication': 'Detección de código y dependencias duplicadas',
      'validate:integration': 'Validación de integración entre componentes',
      'validate:ui-generic': 'Validación de componentes UI genéricos',
      
      // Corrección
      'fix:npm-duplications': 'Corrige automáticamente duplicaciones NPM',
      
      // AI
      'ai:before-changes': 'Ejecutar antes de hacer cambios (AI)',
      'ai:after-changes': 'Ejecutar después de hacer cambios (AI)',
      'ai:safe-commit': 'Commit seguro con validación',
      'ai:recovery': 'Procedimiento de recuperación de errores',
      
      // Testing
      'test': 'Ejecuta todas las pruebas',
      'test:dashboard': 'Pruebas específicas del Dashboard',
      'lint': 'Ejecuta linting en todas las apps',
      'type-check': 'Verificación de tipos TypeScript',
      
      // Limpieza - Cross-platform
      'clean': 'Limpieza inteligente (Windows con manejo de errores)',
      'clean:all': 'Limpieza completa (alias de clean)',
      'clean:win': 'Limpieza Windows con manejo de archivos bloqueados', 
      'clean:unix': 'Limpieza Unix/Linux (rm -rf)',
      'clean:next': 'Limpia solo archivos .next build',
      'clean:force': 'Limpieza forzada (mata procesos Node)',
      
      // Mantenimiento  
      'install:all': 'Instala dependencias en root y apps',
      'setup': 'Configuración inicial completa del proyecto'
    };

    return descriptions[command] || this.inferDescription(command, script);
  }

  inferDescription(command, script) {
    if (script.includes('next dev')) return 'Servidor de desarrollo Next.js';
    if (script.includes('next build')) return 'Construcción de producción Next.js';
    if (script.includes('eslint')) return 'Verificación de código con ESLint';
    if (script.includes('validate')) return 'Validación del proyecto';
    if (script.includes('clean')) return 'Limpieza de archivos generados';
    if (script.includes('install')) return 'Instalación de dependencias';
    if (script.includes('test')) return 'Ejecución de pruebas';
    
    return 'Comando personalizado del proyecto';
  }

  determineCategory(command) {
    for (const [categoryKey, category] of Object.entries(this.categories)) {
      if (category.keywords.some(keyword => command.includes(keyword))) {
        return categoryKey;
      }
    }
    return 'maintenance'; // categoría por defecto
  }

  addManualCommands() {
    // Comandos PowerShell (si están disponibles)
    const powerShellCommands = [
      { cmd: 'vhelp', desc: 'Muestra esta ayuda (PowerShell)', cat: 'ai' },
      { cmd: 'vthink', desc: 'Navegar a raíz del proyecto (PowerShell)', cat: 'development' },
      { cmd: 'vdash', desc: 'Navegar a dashboard (PowerShell)', cat: 'development' },
      { cmd: 'vdev', desc: 'Servidor optimizado rápido (PowerShell)', cat: 'development' },
      { cmd: 'vreset', desc: 'Reset completo del proyecto (PowerShell)', cat: 'maintenance' }
    ];

    powerShellCommands.forEach(({cmd, desc, cat}) => {
      this.commands.set(cmd, {
        script: 'PowerShell Alias',
        description: desc,
        category: cat
      });
    });

    // Comandos Node.js directos
    this.commands.set('node vhelp.cjs', {
      script: 'this file',
      description: 'Muestra esta ayuda completa',
      category: 'ai'
    });
  }

  categorizeCommands() {
    this.categorizedCommands = {};
    
    // Inicializar categorías
    Object.keys(this.categories).forEach(key => {
      this.categorizedCommands[key] = [];
    });

    // Categorizar comandos
    this.commands.forEach((details, command) => {
      const category = details.category;
      this.categorizedCommands[category].push({
        command,
        ...details
      });
    });

    // Ordenar comandos dentro de cada categoría
    Object.keys(this.categorizedCommands).forEach(category => {
      this.categorizedCommands[category].sort((a, b) => a.command.localeCompare(b.command));
    });
  }

  printCommands() {
    // Mostrar solo las categorías más importantes primero
    const priorityCategories = ['development', 'validation', 'fixing', 'ai'];
    
    priorityCategories.forEach(categoryKey => {
      const categoryInfo = this.categories[categoryKey];
      const commands = this.categorizedCommands[categoryKey];
      
      if (commands && commands.length > 0) {
        log.section(`${categoryInfo.icon} ${categoryInfo.title}`);
        
        // Mostrar solo los comandos más relevantes
        const relevantCommands = this.filterRelevantCommands(commands, categoryKey);
        relevantCommands.forEach(({command, description}) => {
          log.command(command, description);
        });
      }
    });
  }

  filterRelevantCommands(commands, category) {
    const maxCommands = {
      development: 8,
      validation: 10,
      fixing: 5,
      ai: 6
    };

    const max = maxCommands[category] || commands.length;
    
    // Filtrar comandos más importantes por categoría
    const priorities = {
      development: ['npm run dev', 'npm run build', 'npm run dev:dashboard', 'npm run build:all'],
      validation: ['npm run validate:quick', 'npm run validate:universal', 'npm run validate:guard', 'npm run validate:ecosystem', 'npm run lint'],
      fixing: ['npm run fix:npm-duplications', 'npm run clean', 'npm run clean:force', 'npm run clean:next', 'npm run setup'],
      ai: ['npm run ai:before-changes', 'npm run ai:after-changes', 'npm run vhelp', 'npm run pre-commit']
    };

    const categoryPriorities = priorities[category] || [];
    
    // Primero los prioritarios, luego el resto hasta el límite
    const priorityCommands = commands.filter(cmd => 
      categoryPriorities.some(priority => cmd.command.includes(priority.replace('npm run ', '')))
    );
    
    const remainingCommands = commands.filter(cmd => 
      !categoryPriorities.some(priority => cmd.command.includes(priority.replace('npm run ', '')))
    ).slice(0, max - priorityCommands.length);
    
    return [...priorityCommands, ...remainingCommands].slice(0, max);
  }

  printFooter() {
    log.title('\n🎯 COMANDOS ESENCIALES DIARIOS:');
    log.command('npm run dev', 'Iniciar servidor de desarrollo');
    log.command('npm run validate:quick', 'Validación rápida (empezar trabajo)');
    log.command('npm run validate:universal', 'Validación completa (pre-commit)');
    log.command('npm run fix:npm-duplications', 'Corregir errores de dependencias');
    log.command('npm run vhelp', 'Mostrar esta ayuda completa');
    
    log.title('\n🚨 WORKFLOW AI - 4 NIVELES VALIDACIÓN (Claude, OpenAI, etc.):');
    log.command('🟢 NIVEL 1: npm run validate:quick', 'Antes de empezar trabajo');
    log.command('🔧 [IMPLEMENTAR CAMBIOS]', '');  
    log.command('🟡 NIVEL 2: npm run validate:universal', 'Antes de commit');
    log.command('💾 git commit', 'Commit con pre-commit hook automático');
    log.command('🔴 NIVEL 3: npm run validate:guard', 'Solo si algo se rompe');
    log.command('🚀 NIVEL 4: npm run validate:ecosystem', 'CI/CD y releases');
    
    log.title('\n📖 DOCUMENTACIÓN CRÍTICA:');
    log.info('• AI_UNIFIED_RULES.md - SINGLE SOURCE OF TRUTH (todas las reglas)');
    log.info('• CLAUDE.md - Guías específicas para AI y contexto proyecto');
    log.info('• README.md - Overview y setup inicial del proyecto');
    log.info('• FILE_PLACEMENT_QUICK_REFERENCE.md - Ubicación correcta archivos');
    
    console.log(`\n${colors.green}✅ Total: ${this.commands.size} comandos disponibles${colors.reset}`);
    console.log(`${colors.dim}💡 Tip: Ejecuta "npm run vhelp" desde cualquier directorio${colors.reset}\n`);
  }
}

// Ejecutar
if (require.main === module) {
  const helper = new VThinkHelper();
  helper.showHelp().catch(error => {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = VThinkHelper;