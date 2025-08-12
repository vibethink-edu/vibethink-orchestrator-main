/**
 * VHELP Security Configuration
 * Defines risk levels, warnings, and safety measures for all commands
 * 
 * @author AI Assistant
 * @version 1.0.0
 * @date 2025-01-27
 */

/**
 * Command risk classifications
 */
export const RISK_LEVELS = {
  SAFE: 'safe',           // 🟢 Read-only operations, validation, analysis
  MODERATE: 'moderate',   // 🟡 Controlled modifications, installs, builds
  DANGEROUS: 'dangerous'  // 🔴 File deletion, process killing, major changes
};

/**
 * Risk-based command categorization
 */
export const commandRisks = {
  // 🟢 SAFE COMMANDS - Read-only, validation, analysis
  [RISK_LEVELS.SAFE]: [
    'vhelp',
    'validate:quick',
    'validate:universal', 
    'validate:architecture',
    'validate:ecosystem',
    'validate:cross-app-compatibility',
    'validate:shared-component-impact',
    'validate:external-update',
    'validate:security',
    'validate:performance',
    'validate:multilang',
    'validate:npm-install',
    'validate:duplication',
    'validate:integration',
    'validate:ui-generic',
    'validate:guard',
    'lint',
    'type-check',
    'test',
    'test:dashboard',
    'dev:dashboard',
    'dev:admin',
    'dev:login', 
    'dev:helpdesk',
    'dev:all',
    'dev'
  ],

  // 🟡 MODERATE COMMANDS - Controlled modifications
  [RISK_LEVELS.MODERATE]: [
    'fix:npm-duplications',
    'ai:safe-commit',
    'ai:before-changes',
    'ai:after-changes',
    'ai:recovery',
    'install:all',
    'setup',
    'build',
    'build:dashboard',
    'build:admin',
    'build:website',
    'build:all'
  ],

  // 🔴 DANGEROUS COMMANDS - File deletion, major changes
  [RISK_LEVELS.DANGEROUS]: [
    'clean',
    'clean:all',
    'clean:force',
    'clean:win',
    'clean:unix',
    'clean:next'
  ]
};

/**
 * Enhanced descriptions with security information
 */
export const securityEnhancedDescriptions = {
  // 🔴 DANGEROUS COMMANDS
  'clean': {
    description: 'Limpieza inteligente (Windows con manejo de errores)',
    risk: RISK_LEVELS.DANGEROUS,
    warning: '🚨 PELIGROSO: Borrará archivos .next y node_modules',
    affects: [
      'Archivos de build (.next)',
      'Dependencias instaladas (node_modules)',
      'Cache de compilación'
    ],
    canRecover: true,
    recoverySteps: [
      'Ejecutar "npm install" para restaurar dependencias',
      'Ejecutar "npm run build" para regenerar builds'
    ],
    estimatedTime: '2-5 minutos',
    confirmRequired: true,
    dangerLevel: 'HIGH'
  },

  'clean:force': {
    description: 'Limpieza forzada (mata procesos Node)',
    risk: RISK_LEVELS.DANGEROUS,
    warning: '🚨🚨 MUY PELIGROSO: Matará procesos Node + limpieza completa',
    affects: [
      'Todos los procesos Node.js activos',
      'Servidores de desarrollo en ejecución',
      'Archivos de build y dependencias'
    ],
    canRecover: true,
    recoverySteps: [
      'Ejecutar "npm install" para restaurar dependencias',
      'Reiniciar servidores de desarrollo',
      'Regenerar builds si es necesario'
    ],
    estimatedTime: '3-7 minutos',
    confirmRequired: true,
    dangerLevel: 'CRITICAL'
  },

  'clean:all': {
    description: 'Limpieza completa (alias de clean)',
    risk: RISK_LEVELS.DANGEROUS,
    warning: '🚨 PELIGROSO: Limpieza completa del proyecto',
    affects: [
      'Todos los archivos de build',
      'Todas las dependencias instaladas',
      'Cache del sistema'
    ],
    canRecover: true,
    recoverySteps: [
      'Ejecutar "npm install" para restaurar dependencias',
      'Regenerar todos los builds'
    ],
    estimatedTime: '3-6 minutos',
    confirmRequired: true,
    dangerLevel: 'HIGH'
  },

  // 🟡 MODERATE COMMANDS
  'fix:npm-duplications': {
    description: 'Corrige automáticamente duplicaciones NPM',
    risk: RISK_LEVELS.MODERATE,
    warning: '⚠️ MODERADO: Modificará archivos package.json',
    affects: [
      'package.json en root',
      'package.json en apps (si existen)',
      'Estructura de dependencias'
    ],
    canRecover: true,
    recoverySteps: [
      'Git restore para revertir cambios',
      'Revisión manual de package.json'
    ],
    estimatedTime: '30 segundos - 2 minutos',
    confirmRequired: true,
    dangerLevel: 'MEDIUM'
  },

  'ai:safe-commit': {
    description: 'Commit seguro con validación',
    risk: RISK_LEVELS.MODERATE,
    warning: '⚠️ MODERADO: Creará commits en Git',
    affects: [
      'Historial de Git',
      'Branch actual',
      'Archivos staged'
    ],
    canRecover: true,
    recoverySteps: [
      'git reset HEAD~1 para deshacer último commit',
      'git reflog para recuperar cambios'
    ],
    estimatedTime: '1-3 minutos',
    confirmRequired: false, // Es "safe" por diseño
    dangerLevel: 'LOW'
  },

  'install:all': {
    description: 'Instala dependencias en root y apps',
    risk: RISK_LEVELS.MODERATE,
    warning: '⚠️ MODERADO: Instalará nuevas dependencias',
    affects: [
      'node_modules en root',
      'package-lock.json',
      'Espacio en disco'
    ],
    canRecover: true,
    recoverySteps: [
      'npm ci para instalación limpia',
      'Verificar con validate:npm-install'
    ],
    estimatedTime: '2-5 minutos',
    confirmRequired: false, // Generalmente seguro
    dangerLevel: 'LOW'
  }
};

/**
 * Risk level styling configuration
 */
export const riskStyling = {
  [RISK_LEVELS.SAFE]: {
    emoji: '🟢',
    color: '\x1b[32m', // Green
    label: 'SEGURO'
  },
  [RISK_LEVELS.MODERATE]: {
    emoji: '🟡', 
    color: '\x1b[33m', // Yellow
    label: 'MODERADO'
  },
  [RISK_LEVELS.DANGEROUS]: {
    emoji: '🔴',
    color: '\x1b[31m', // Red
    label: 'PELIGROSO'
  }
};

/**
 * Danger level styling
 */
export const dangerStyling = {
  'LOW': { emoji: '⚡', color: '\x1b[36m' },      // Cyan
  'MEDIUM': { emoji: '⚠️', color: '\x1b[33m' },   // Yellow  
  'HIGH': { emoji: '🚨', color: '\x1b[31m' },     // Red
  'CRITICAL': { emoji: '🚨🚨', color: '\x1b[91m' } // Bright Red
};

/**
 * Get risk level for a command
 */
export function getRiskLevel(command) {
  for (const [risk, commands] of Object.entries(commandRisks)) {
    if (commands.includes(command)) {
      return risk;
    }
  }
  return RISK_LEVELS.SAFE; // Default to safe
}

/**
 * Check if command requires confirmation
 */
export function requiresConfirmation(command) {
  const enhanced = securityEnhancedDescriptions[command];
  if (enhanced) {
    return enhanced.confirmRequired;
  }
  
  // Default behavior based on risk level
  const risk = getRiskLevel(command);
  return risk === RISK_LEVELS.DANGEROUS;
}

/**
 * Get enhanced security information for a command
 */
export function getSecurityInfo(command) {
  return securityEnhancedDescriptions[command] || null;
}
