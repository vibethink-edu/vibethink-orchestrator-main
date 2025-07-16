#!/usr/bin/env node

/**
 * Validador de Cumplimiento Constitucional Arquitectónico
 * 
 * Verifica que los componentes cumplan con la CONSTITUCIÓN ARQUITECTÓNICA:
 * - Separación absoluta de responsabilidades
 * - Sin interferencia entre componentes
 * - Sin duplicación de funcionalidades
 * 
 * Uso: node scripts/validate-constitutional-compliance.js [componente]
 */

const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// CONSTITUCIÓN ARQUITECTÓNICA - REGLAS FUNDAMENTALES
const CONSTITUTION = {
  // Responsabilidades definidas por componente
  responsibilities: {
    posthog: {
      name: 'PostHog Analytics/CDP',
      functions: [
        'user tracking',
        'event capture',
        'data analysis',
        'cdp feeding',
        'analytics dashboard',
        'a/b testing',
        'funnel analysis',
        'cohort analysis'
      ],
      forbidden: [
        'content scheduling',
        'campaign management',
        'social media posting',
        'content calendar',
        'marketing strategy'
      ]
    },
    postiz: {
      name: 'Postiz Clone Social Media',
      functions: [
        'content scheduling',
        'campaign management',
        'multi-platform posting',
        'content calendar',
        'marketing strategy',
        'social media automation'
      ],
      forbidden: [
        'user tracking',
        'event capture',
        'data analysis',
        'cdp feeding',
        'analytics dashboard'
      ]
    },
    cdp: {
      name: 'CDP (Tracardi)',
      functions: [
        'data aggregation',
        'customer profiles',
        'data export',
        'privacy compliance',
        'data unification'
      ],
      forbidden: [
        'user tracking',
        'content scheduling',
        'campaign management',
        'social media posting'
      ]
    }
  },
  
  // Reglas constitucionales
  rules: {
    separation: 'Separación absoluta de responsabilidades',
    noInterference: 'Sin interferencia entre componentes',
    noDuplication: 'Sin duplicación de funcionalidades',
    apiOnly: 'Comunicación solo vía APIs'
  }
};

/**
 * Valida un componente contra la constitución
 */
function validateConstitutionalCompliance(componentName, evaluationData) {
  console.log(`${colors.cyan}${colors.bright}🏛️  Validando Cumplimiento Constitucional: ${componentName}${colors.reset}\n`);
  
  const component = CONSTITUTION.responsibilities[componentName];
  if (!component) {
    console.error(`${colors.red}❌ Componente no definido en la constitución: ${componentName}${colors.reset}`);
    return false;
  }
  
  let allPassed = true;
  const violations = [];
  
  // 1. Validar responsabilidad única
  console.log(`${colors.blue}📋 Validando Responsabilidad Única:${colors.reset}`);
  if (evaluationData.responsibility && evaluationData.responsibility.length > 1) {
    console.log(`  ${colors.red}❌ Múltiples responsabilidades detectadas${colors.reset}`);
    violations.push('Múltiples responsabilidades');
    allPassed = false;
  } else {
    console.log(`  ${colors.green}✅ Responsabilidad única confirmada${colors.reset}`);
  }
  
  // 2. Validar funciones permitidas
  console.log(`\n${colors.blue}🔍 Validando Funciones Permitidas:${colors.reset}`);
  const declaredFunctions = evaluationData.functions || [];
  const forbiddenFunctions = component.forbidden;
  
  for (const func of declaredFunctions) {
    if (forbiddenFunctions.some(forbidden => func.toLowerCase().includes(forbidden.toLowerCase()))) {
      console.log(`  ${colors.red}❌ Función prohibida: ${func}${colors.reset}`);
      violations.push(`Función prohibida: ${func}`);
      allPassed = false;
    } else {
      console.log(`  ${colors.green}✅ Función permitida: ${func}${colors.reset}`);
    }
  }
  
  // 3. Validar interferencia con otros componentes
  console.log(`\n${colors.blue}🚫 Validando No Interferencia:${colors.reset}`);
  const otherComponents = Object.keys(CONSTITUTION.responsibilities).filter(name => name !== componentName);
  
  for (const otherComponent of otherComponents) {
    const otherFunctions = CONSTITUTION.responsibilities[otherComponent].functions;
    const interference = declaredFunctions.filter(func => 
      otherFunctions.some(otherFunc => func.toLowerCase().includes(otherFunc.toLowerCase()))
    );
    
    if (interference.length > 0) {
      console.log(`  ${colors.red}❌ Interferencia con ${otherComponent}: ${interference.join(', ')}${colors.reset}`);
      violations.push(`Interferencia con ${otherComponent}`);
      allPassed = false;
    } else {
      console.log(`  ${colors.green}✅ Sin interferencia con ${otherComponent}${colors.reset}`);
    }
  }
  
  // 4. Validar comunicación vía APIs
  console.log(`\n${colors.blue}📡 Validando Comunicación vía APIs:${colors.reset}`);
  if (evaluationData.communication && evaluationData.communication.includes('API')) {
    console.log(`  ${colors.green}✅ Comunicación vía APIs confirmada${colors.reset}`);
  } else {
    console.log(`  ${colors.yellow}⚠️  Comunicación vía APIs no especificada${colors.reset}`);
  }
  
  // Mostrar resultado final
  console.log(`\n${colors.bright}📊 RESULTADO DE VALIDACIÓN CONSTITUCIONAL:${colors.reset}`);
  
  if (allPassed) {
    console.log(`${colors.green}${colors.bright}🎉 CUMPLE CON LA CONSTITUCIÓN ARQUITECTÓNICA${colors.reset}`);
    console.log(`${colors.green}✅ Componente aprobado para implementación${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bright}🚨 VIOLA LA CONSTITUCIÓN ARQUITECTÓNICA${colors.reset}`);
    console.log(`${colors.red}❌ Componente OMITIDO del stack tecnológico${colors.reset}`);
    
    console.log(`\n${colors.yellow}${colors.bright}📝 Violaciones detectadas:${colors.reset}`);
    violations.forEach(violation => {
      console.log(`  ❌ ${violation}`);
    });
    
    console.log(`\n${colors.red}${colors.bright}SANCIÓN CONSTITUCIONAL:${colors.reset}`);
    console.log(`${colors.red}El componente será OMITIDO COMPLETAMENTE del stack tecnológico.${colors.reset}`);
  }
  
  return allPassed;
}

/**
 * Valida todos los componentes del stack
 */
function validateAllComponents() {
  console.log(`${colors.cyan}${colors.bright}🏛️  VALIDACIÓN CONSTITUCIONAL COMPLETA DEL STACK${colors.reset}\n`);
  
  const components = Object.keys(CONSTITUTION.responsibilities);
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const component of components) {
    // Simular datos de evaluación (en implementación real, leer de archivos)
    const evaluationData = {
      responsibility: [CONSTITUTION.responsibilities[component].name],
      functions: CONSTITUTION.responsibilities[component].functions,
      communication: 'API-based communication'
    };
    
    const passed = validateConstitutionalCompliance(component, evaluationData);
    
    if (passed) {
      totalPassed++;
    } else {
      totalFailed++;
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  }
  
  // Resumen final
  console.log(`${colors.bright}📊 RESUMEN CONSTITUCIONAL:${colors.reset}`);
  console.log(`${colors.green}✅ Componentes que cumplen: ${totalPassed}${colors.reset}`);
  console.log(`${colors.red}❌ Componentes que violan: ${totalFailed}${colors.reset}`);
  
  if (totalFailed === 0) {
    console.log(`\n${colors.green}${colors.bright}🎉 TODO EL STACK CUMPLE CON LA CONSTITUCIÓN${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bright}⚠️  STACK REQUIERE REVISIÓN CONSTITUCIONAL${colors.reset}`);
  }
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Validar componente específico
    const componentName = args[0].toLowerCase();
    const evaluationData = {
      responsibility: [CONSTITUTION.responsibilities[componentName]?.name || 'Unknown'],
      functions: CONSTITUTION.responsibilities[componentName]?.functions || [],
      communication: 'API-based communication'
    };
    
    validateConstitutionalCompliance(componentName, evaluationData);
  } else {
    // Validar todos los componentes
    validateAllComponents();
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = {
  validateConstitutionalCompliance,
  validateAllComponents,
  CONSTITUTION
}; 