#!/usr/bin/env node

/**
 * VHelp Enhanced - Sistema de ayuda con seguridad integrada para VibeThink Orchestrator
 * Incluye warnings, confirmaciones y análisis de riesgo para comandos
 * 
 * @author AI Assistant
 * @version 2.0.0 (Enhanced Security)
 * @date 2025-01-27
 */

const fs = require('fs');
const path = require('path');

// Importar configuración de seguridad (simular ES6 import en CommonJS)
const securityConfig = (() => {
  try {
    // En entorno de producción esto sería una importación real
    // Por ahora incluimos la lógica directamente
    const RISK_LEVELS = {
      SAFE: 'safe',
      MODERATE: 'moderate', 
      DANGEROUS: 'dangerous'
    };

    const commandRisks = {
      [RISK_LEVELS.SAFE]: [
        'vhelp', 'validate:quick', 'validate:universal', 'validate:architecture',
        'validate:ecosystem', 'validate:cross-app-compatibility', 'validate:shared-component-impact',
        'validate:external-update', 'validate:security', 'validate:performance', 'validate:multilang',
        'validate:npm-install', 'validate:duplication', 'validate:integration', 'validate:ui-generic',
        'validate:guard', 'lint', 'type-check', 'test', 'test:dashboard', 'dev:dashboard',
        'dev:admin', 'dev:login', 'dev:helpdesk', 'dev:all', 'dev'
      ],
      [RISK_LEVELS.MODERATE]: [
        'fix:npm-duplications', 'ai:safe-commit', 'ai:before-changes', 'ai:after-changes',
        'ai:recovery', 'install:all', 'setup', 'build', 'build:dashboard', 'build:admin',
        'build:website', 'build:all'
      ],
      [RISK_LEVELS.DANGEROUS]: [
        'clean', 'clean:all', 'clean:force', 'clean:win', 'clean:unix', 'clean:next'
      ]
    };

    const riskStyling = {
      [RISK_LEVELS.SAFE]: { emoji: '🟢', color: '\x1b[32m', label: 'SEGURO' },
      [RISK_LEVELS.MODERATE]: { emoji: '🟡', color: '\x1b[33m', label: 'MODERADO' },
      [RISK_LEVELS.DANGEROUS]: { emoji: '🔴', color: '\x1b[31m', label: 'PELIGROSO' }
    };

    function getRiskLevel(command) {
      for (const [risk, commands] of Object.entries(commandRisks)) {
        if (commands.includes(command)) {
          return risk;
        }
      }
      return RISK_LEVELS.SAFE;
    }

    function getRiskStyling(risk) {
      return riskStyling[risk] || riskStyling[RISK_LEVELS.SAFE];
    }

    return { RISK_LEVELS, commandRisks, getRiskLevel, getRiskStyling };
  } catch (error) {
    console.error('Error loading security config:', error);
    return null;
  }
})();

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
  dim: '\x1b[2m',
  bright_red: '\x1b[91m'
};

const log = {
  title: (msg) => console.log(`${colors.cyan}${colors.bold}${msg}${colors.reset}`),
  subtitle: (msg) => console.log(`${colors.magenta}${colors.bold}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}📋 ${msg}${colors.reset}`),
  command: (cmd, desc) => console.log(`${colors.white}  ${cmd.padEnd(35)} ${colors.dim}# ${desc}${colors.reset}`),
  commandSecure: (cmd, desc, securityBadge) => console.log(`${colors.white}  ${cmd.padEnd(30)} ${securityBadge} ${colors.dim}# ${desc}${colors.reset}`),
  section: (title) => console.log(`\n${colors.yellow}${colors.bold}📂 ${title.toUpperCase()}${colors.reset}`)
};

class VThinkHelperEnhanced {
  constructor() {
    this.projectRoot = process.cwd();
    this.commands = new Map();
    this.securityEnabled = !!securityConfig;
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
        keywords: ['fix', 'clean', 'install'],
        icon: '🔧'
      },
      ai: {
        title: 'Comandos AI-Específicos',
        keywords: ['ai:'],
        icon: '🤖'
      }
    };
  }

  async run() {
    try {
      this.printHeader();
      await this.loadCommands();
      this.printCommands();
      this.printFooter();
    } catch (error) {
      log.error(`Error ejecutando VHelp: ${error.message}`);
      process.exit(1);
    }
  }

  printHeader() {
    log.title('\n🛠️  VHELP Enhanced - VibeThink Orchestrator Command Center 🛡️');
    
    if (this.securityEnabled) {
      log.subtitle('🔒 Sistema de Seguridad Activado - Análisis de Riesgo Incluido');
    } else {
      log.warning('⚠️  Sistema de Seguridad No Disponible - Modo Básico');
    }

    console.log(`${colors.dim}📍 Directorio: ${this.projectRoot}${colors.reset}`);
    console.log(`${colors.dim}📅 Fecha: ${new Date().toLocaleDateString('es-ES')}${colors.reset}`);
    
    if (this.securityEnabled) {
      console.log(`\n${colors.bold}🛡️  NIVELES DE SEGURIDAD:${colors.reset}`);
      console.log(`   🟢 ${colors.green}SEGURO${colors.reset}    - Solo lectura, validación, análisis`);
      console.log(`   🟡 ${colors.yellow}MODERADO${colors.reset}  - Modificaciones controladas`);
      console.log(`   🔴 ${colors.red}PELIGROSO${colors.reset} - Borrado de archivos, cambios mayores`);
    }

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
      const securityInfo = this.getSecurityInfo(command);
      this.commands.set(`npm run ${command}`, {
        script,
        description: this.generateDescription(command, script),
        category: this.determineCategory(command),
        security: securityInfo
      });
    });

    // Agregar comandos adicionales manualmente conocidos
    this.addManualCommands();
  }

  getSecurityInfo(command) {
    if (!this.securityEnabled) return null;

    const risk = securityConfig.getRiskLevel(command);
    const styling = securityConfig.getRiskStyling(risk);
    
    return {
      risk,
      badge: `${styling.emoji} ${styling.color}${styling.label}${colors.reset}`,
      requiresConfirmation: risk === securityConfig.RISK_LEVELS.DANGEROUS,
      isModerate: risk === securityConfig.RISK_LEVELS.MODERATE,
      isDangerous: risk === securityConfig.RISK_LEVELS.DANGEROUS
    };
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
      
      // Validación - 4 NIVELES JERARQUICOS
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
    for (const [key, category] of Object.entries(this.categories)) {
      if (category.keywords.some(keyword => command.includes(keyword))) {
        return key;
      }
    }
    return 'others';
  }

  addManualCommands() {
    // Agregar comandos adicionales que no están en package.json
    this.commands.set('npm install', {
      script: 'npm install',
      description: 'Instala dependencias del proyecto',
      category: 'fixing',
      security: this.getSecurityInfo('install')
    });
  }

  printCommands() {
    const groupedCommands = this.groupCommandsByCategory();
    
    Object.entries(groupedCommands).forEach(([category, commands]) => {
      const categoryConfig = this.categories[category];
      if (categoryConfig && commands.length > 0) {
        log.section(`${categoryConfig.icon} ${categoryConfig.title}`);
        
        // Sort commands by security risk (safe first, dangerous last)
        commands.sort((a, b) => {
          if (!this.securityEnabled) return 0;
          
          const getRiskPriority = (cmd) => {
            const risk = cmd.security?.risk;
            if (risk === securityConfig.RISK_LEVELS.SAFE) return 0;
            if (risk === securityConfig.RISK_LEVELS.MODERATE) return 1;
            if (risk === securityConfig.RISK_LEVELS.DANGEROUS) return 2;
            return 0;
          };
          
          return getRiskPriority(a) - getRiskPriority(b);
        });
        
        commands.forEach(({ command, description, security }) => {
          if (this.securityEnabled && security) {
            log.commandSecure(command, description, security.badge);
            
            // Add security note for dangerous commands
            if (security.isDangerous) {
              console.log(`${colors.dim}       ⚠️  REQUIERE CONFIRMACIÓN MANUAL${colors.reset}`);
            } else if (security.isModerate) {
              console.log(`${colors.dim}       ℹ️  Revisa antes de ejecutar${colors.reset}`);
            }
          } else {
            log.command(command, description);
          }
        });
      }
    });

    // Show commands without category (others)
    if (groupedCommands.others && groupedCommands.others.length > 0) {
      log.section('🔧 Otros Comandos');
      groupedCommands.others.forEach(({ command, description, security }) => {
        if (this.securityEnabled && security) {
          log.commandSecure(command, description, security.badge);
        } else {
          log.command(command, description);
        }
      });
    }
  }

  groupCommandsByCategory() {
    const grouped = {};
    
    this.commands.forEach((commandInfo, command) => {
      const category = commandInfo.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push({
        command,
        description: commandInfo.description,
        security: commandInfo.security
      });
    });
    
    return grouped;
  }

  printFooter() {
    console.log('\n' + '='.repeat(70));
    log.title('🚨 COMANDOS ESENCIALES DIARIOS');
    console.log('='.repeat(70));

    if (this.securityEnabled) {
      log.commandSecure('npm run validate:quick', 'Validación rápida (empezar trabajo)', '🟢 SEGURO');
      log.commandSecure('npm run validate:universal', 'Validación completa (antes de commit)', '🟢 SEGURO');
      log.commandSecure('npm run dev:dashboard', 'Servidor desarrollo dashboard', '🟢 SEGURO');
      log.commandSecure('npm run clean', 'Limpieza de archivos build', '🔴 PELIGROSO');
    } else {
      log.command('npm run validate:quick', 'Validación rápida (empezar trabajo)');
      log.command('npm run validate:universal', 'Validación completa (antes de commit)');
      log.command('npm run dev:dashboard', 'Servidor desarrollo dashboard');
      log.command('npm run clean', 'Limpieza de archivos build');
    }

    console.log('\n' + '='.repeat(70));
    log.title('🚨 WORKFLOW AI - 4 NIVELES VALIDACIÓN');
    console.log('='.repeat(70));

    log.info('🟢 NIVEL 1: validate:quick    # Antes de empezar trabajo');
    log.info('🔧 [IMPLEMENTAR CAMBIOS]      # Desarrollo');
    log.info('🟡 NIVEL 2: validate:universal # Antes de commit');
    log.info('🔴 NIVEL 3: validate:guard     # Si algo se rompe');
    log.info('🚀 NIVEL 4: validate:ecosystem # CI/CD completo');

    if (this.securityEnabled) {
      console.log('\n' + '='.repeat(70));
      log.title('🛡️  SISTEMA DE SEGURIDAD');
      console.log('='.repeat(70));
      
      log.warning('Los comandos 🔴 PELIGROSOS requieren confirmación manual');
      log.info('Los comandos 🟡 MODERADOS muestran información antes de ejecutar');
      log.success('Los comandos 🟢 SEGUROS se ejecutan sin restricciones');
      
      console.log(`\n${colors.cyan}💡 Consejo:${colors.reset} Para ejecutar comandos peligrosos sin confirmación:`);
      console.log(`${colors.dim}   Usa el flag --force (cuando esté disponible)${colors.reset}`);
    }

    console.log('\n' + '='.repeat(70));
    log.title('📚 DOCUMENTACIÓN CRÍTICA');
    console.log('='.repeat(70));

    log.info('• AI_UNIFIED_RULES.md - SINGLE SOURCE OF TRUTH');
    log.info('• ROOT_CLEANUP_SUCCESS_REPORT.md - Estado del repositorio');
    log.info('• docs/development/VHELP_UPDATE_PROCESS.md - Actualizar vhelp');

    console.log(`\n${colors.dim}🤖 AI-Friendly: Este comando funciona con cualquier AI (Claude, OpenAI, Gemini)${colors.reset}`);
    console.log(`${colors.dim}📍 Ejecutado desde: ${this.projectRoot}${colors.reset}\n`);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  const helper = new VThinkHelperEnhanced();
  helper.run().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

module.exports = VThinkHelperEnhanced;
