#!/usr/bin/env node

/**
 * 📊 AI Pair Orchestrator Pro - Stack Registry System
 * 
 * Sistema de registro y versionado del stack tecnológico oficial
 * Mantiene AP_STACK_PROD y AP_STACK_DEV sincronizados y documentados
 * 
 * VThink 1.0 - Stack Management System
 */

const fs = require('fs').promises;
const path = require('path');

class StackRegistry {
  constructor() {
    this.stacksDir = path.join('docs', 'PROJECT', '08_TOOLCHAIN_AND_SETUP', 'STACKS');
    this.currentDate = new Date().toISOString();
  }

  async initializeStackRegistry() {
    console.log('🔧 Inicializando Stack Registry System...');
    
    try {
      // 1. Crear estructura de directorios
      await this.createDirectoryStructure();
      
      // 2. Crear stack de producción actual
      await this.createProductionStack();
      
      // 3. Crear stack de desarrollo actual
      await this.createDevelopmentStack();
      
      // 4. Crear sistema de versionado
      await this.createVersioningSystem();
      
      // 5. Crear herramientas de gestión
      await this.createStackTools();
      
      console.log('✅ Stack Registry System inicializado correctamente');
      console.log(`📁 Ubicación: ${this.stacksDir}`);
      
    } catch (error) {
      console.error('❌ Error inicializando Stack Registry:', error.message);
      process.exit(1);
    }
  }

  async createDirectoryStructure() {
    const dirs = [
      this.stacksDir,
      path.join(this.stacksDir, 'current'),
      path.join(this.stacksDir, 'history'),
      path.join(this.stacksDir, 'comparisons'),
      path.join(this.stacksDir, 'evaluations')
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }

    console.log('📁 Estructura de directorios creada');
  }

  async createProductionStack() {
    const prodStack = {
      environment: "PRODUCTION",
      version: "1.0.0",
      last_updated: this.currentDate,
      status: "STABLE",
      description: "Stack de producción estable y probado",
      
      frontend: {
        framework: {
          name: "React",
          version: "18.2.0",
          rationale: "Framework principal para UI, estable y maduro"
        },
        language: {
          name: "TypeScript",
          version: "5.2.2",
          rationale: "Type safety y mejor DX"
        },
        build_tool: {
          name: "Vite",
          version: "5.0.8",
          rationale: "Build tool rápido y moderno"
        },
        ui_library: {
          name: "shadcn/ui",
          version: "latest",
          rationale: "Componentes consistentes y customizables"
        },
        styling: {
          name: "Tailwind CSS",
          version: "3.3.6",
          rationale: "Utility-first CSS framework"
        },
        routing: {
          name: "React Router",
          version: "6.8.0",
          rationale: "Routing estándar para React"
        },
        state_management: {
          name: "TanStack Query",
          version: "5.8.4",
          rationale: "Server state management"
        },
        forms: {
          name: "React Hook Form",
          version: "7.48.2",
          rationale: "Form handling performante"
        },
        validation: {
          name: "Zod",
          version: "3.22.4",
          rationale: "Schema validation"
        }
      },
      
      backend: {
        database: {
          name: "Supabase PostgreSQL",
          version: "15.x",
          rationale: "Base de datos principal con realtime"
        },
        auth: {
          name: "FusionAuth",
          version: "1.48.x",
          rationale: "Sistema de autenticación enterprise"
        },
        api: {
          name: "Supabase API",
          version: "2.38.0",
          rationale: "Auto-generated REST/GraphQL APIs"
        },
        realtime: {
          name: "Supabase Realtime",
          version: "latest",
          rationale: "Real-time subscriptions"
        },
        storage: {
          name: "Supabase Storage",
          version: "latest",
          rationale: "File storage y CDN"
        }
      },
      
      infrastructure: {
        containerization: {
          name: "Docker",
          version: "24.x",
          rationale: "Containerización estándar"
        },
        orchestration: {
          name: "Docker Compose",
          version: "2.x",
          rationale: "Multi-container deployment"
        },
        ci_cd: {
          name: "GitHub Actions",
          version: "latest",
          rationale: "CI/CD integrado con GitHub"
        },
        monitoring: {
          name: "Built-in logging",
          version: "custom",
          rationale: "Logging personalizado"
        }
      },
      
      development: {
        testing: {
          name: "Vitest",
          version: "1.0.4",
          rationale: "Testing framework rápido"
        },
        e2e_testing: {
          name: "Playwright",
          version: "1.40.0",
          rationale: "E2E testing cross-browser"
        },
        linting: {
          name: "ESLint",
          version: "8.55.0",
          rationale: "Code quality y consistency"
        },
        formatting: {
          name: "Prettier",
          version: "3.1.0",
          rationale: "Code formatting automático"
        }
      },
      
      architecture_patterns: {
        multi_tenancy: {
          implemented: true,
          approach: "Shared database, tenant isolation",
          rationale: "Escalabilidad y eficiencia de recursos"
        },
        component_architecture: {
          pattern: "Modular components with shadcn/ui",
          rationale: "Reutilización y consistencia"
        },
        data_access: {
          pattern: "Repository pattern with Supabase client",
          rationale: "Abstracción de data layer"
        },
        authentication: {
          pattern: "JWT + FusionAuth integration",
          rationale: "Security y escalabilidad"
        }
      },
      
      constraints: {
        license_compatibility: ["MIT", "Apache-2.0", "BSD-3-Clause"],
        browser_support: ["Chrome 90+", "Firefox 88+", "Safari 14+", "Edge 90+"],
        performance_requirements: {
          initial_load: "< 3s",
          navigation: "< 500ms",
          api_response: "< 1s"
        },
        security_requirements: [
          "JWT token validation",
          "Multi-tenant data isolation",
          "HTTPS only",
          "XSS protection",
          "CSRF protection"
        ]
      }
    };

    await fs.writeFile(
      path.join(this.stacksDir, 'current', 'AP_STACK_PROD.json'),
      JSON.stringify(prodStack, null, 2)
    );

    console.log('✅ Stack de producción documentado');
  }

  async createDevelopmentStack() {
    const devStack = {
      environment: "DEVELOPMENT",
      version: "1.1.0-dev",
      last_updated: this.currentDate,
      status: "EVOLVING",
      description: "Stack de desarrollo con nuevas tecnologías y experimentos",
      
      frontend: {
        framework: {
          name: "React",
          version: "18.2.0",
          rationale: "Mantenemos misma versión que prod por estabilidad",
          experimental_features: ["Concurrent features", "Suspense"]
        },
        language: {
          name: "TypeScript",
          version: "5.3.0",
          rationale: "Versión más reciente para nuevas features",
          experimental_features: ["Decorators", "Stage 3 proposals"]
        },
        build_tool: {
          name: "Vite",
          version: "5.0.8",
          rationale: "Build tool principal",
          experimental_plugins: ["vite-plugin-pwa", "vite-plugin-windicss"]
        },
        ui_library: {
          name: "shadcn/ui",
          version: "latest",
          rationale: "Componentes base obligatorios",
          extensions: ["Custom components", "Theme variants"]
        },
        styling: {
          name: "Tailwind CSS",
          version: "3.4.0",
          rationale: "Versión más reciente",
          plugins: ["@tailwindcss/forms", "@tailwindcss/typography", "tailwindcss-animate"]
        },
        routing: {
          name: "React Router",
          version: "6.20.0",
          rationale: "Versión más reciente",
          experimental_features: ["Data loading", "Deferred data"]
        },
        state_management: {
          name: "TanStack Query",
          version: "5.8.4",
          rationale: "Server state management",
          alternatives_under_evaluation: ["Zustand", "Jotai"]
        },
        forms: {
          name: "React Hook Form",
          version: "7.48.2",
          rationale: "Form handling principal",
          integrations: ["Zod resolver", "Custom validators"]
        },
        validation: {
          name: "Zod",
          version: "3.22.4",
          rationale: "Schema validation principal",
          experimental_features: ["Custom error messages", "Async validation"]
        }
      },
      
      backend: {
        database: {
          name: "Supabase PostgreSQL",
          version: "15.x",
          rationale: "Base de datos principal",
          experimental_features: ["Edge functions", "Custom types"]
        },
        auth: {
          name: "FusionAuth",
          version: "1.48.x",
          rationale: "Sistema de autenticación principal",
          experimental_features: ["SSO integrations", "Advanced MFA"]
        },
        api: {
          name: "Supabase API",
          version: "2.38.0",
          rationale: "API principal",
          experimental_features: ["GraphQL subscriptions", "Custom functions"]
        },
        realtime: {
          name: "Supabase Realtime",
          version: "latest",
          rationale: "Real-time principal",
          experimental_features: ["Presence", "Broadcast"]
        },
        storage: {
          name: "Supabase Storage",
          version: "latest",
          rationale: "Storage principal",
          experimental_features: ["Image transformations", "Video processing"]
        }
      },
      
      infrastructure: {
        containerization: {
          name: "Docker",
          version: "24.x",
          rationale: "Containerización estándar",
          experimental_features: ["Multi-stage builds", "BuildKit"]
        },
        orchestration: {
          name: "Docker Compose",
          version: "2.x",
          rationale: "Local development",
          alternatives_under_evaluation: ["Kubernetes", "Docker Swarm"]
        },
        ci_cd: {
          name: "GitHub Actions",
          version: "latest",
          rationale: "CI/CD principal",
          experimental_workflows: ["Matrix builds", "Reusable workflows"]
        },
        monitoring: {
          name: "Enhanced logging",
          version: "custom",
          rationale: "Logging mejorado",
          under_evaluation: ["Sentry", "LogRocket", "DataDog"]
        }
      },
      
      development: {
        testing: {
          name: "Vitest",
          version: "1.0.4",
          rationale: "Testing framework principal",
          experimental_features: ["UI mode", "Coverage reporting"]
        },
        e2e_testing: {
          name: "Playwright",
          version: "1.40.0",
          rationale: "E2E testing principal",
          experimental_features: ["Visual comparisons", "Mobile testing"]
        },
        linting: {
          name: "ESLint",
          version: "8.55.0",
          rationale: "Linting principal",
          experimental_rules: ["Custom rules", "Performance rules"]
        },
        formatting: {
          name: "Prettier",
          version: "3.1.0",
          rationale: "Formatting principal",
          experimental_plugins: ["Tailwind plugin", "Organize imports"]
        }
      },
      
      experimental_technologies: {
        ai_integration: {
          status: "EVALUATING",
          candidates: ["OpenAI API", "Anthropic Claude", "Local LLMs"],
          rationale: "Para features de AI en la plataforma"
        },
        performance_optimization: {
          status: "TESTING",
          candidates: ["Web Workers", "Service Workers", "WASM"],
          rationale: "Para optimización de performance"
        },
        mobile_support: {
          status: "RESEARCHING",
          candidates: ["PWA", "Capacitor", "React Native"],
          rationale: "Para soporte móvil nativo"
        }
      },
      
      architecture_patterns: {
        multi_tenancy: {
          implemented: true,
          approach: "Shared database, tenant isolation",
          rationale: "Escalabilidad y eficiencia",
          experimental_improvements: ["Row-level security", "Schema per tenant"]
        },
        component_architecture: {
          pattern: "Modular components with shadcn/ui",
          rationale: "Consistencia y reutilización",
          experimental_patterns: ["Compound components", "Renderless components"]
        },
        data_access: {
          pattern: "Repository pattern with Supabase",
          rationale: "Abstracción de data layer",
          experimental_patterns: ["GraphQL federation", "Event sourcing"]
        },
        authentication: {
          pattern: "JWT + FusionAuth",
          rationale: "Security y escalabilidad",
          experimental_features: ["Passwordless auth", "Biometric auth"]
        }
      },
      
      constraints: {
        license_compatibility: ["MIT", "Apache-2.0", "BSD-3-Clause"],
        browser_support: ["Chrome 90+", "Firefox 88+", "Safari 14+", "Edge 90+"],
        performance_requirements: {
          initial_load: "< 2s (objetivo de mejora)",
          navigation: "< 300ms (objetivo de mejora)",
          api_response: "< 800ms (objetivo de mejora)"
        },
        security_requirements: [
          "JWT token validation",
          "Multi-tenant data isolation",
          "HTTPS only",
          "XSS protection",
          "CSRF protection",
          "Content Security Policy (experimental)"
        ]
      },
      
      evaluation_criteria: {
        integration_decision_matrix: {
          porte_threshold: 80,
          integration_threshold: 60,
          inspiration_threshold: 40,
          rejection_threshold: 20
        },
        compatibility_weights: {
          frontend_compatibility: 30,
          backend_compatibility: 25,
          architecture_alignment: 20,
          license_compatibility: 15,
          maintenance_complexity: 10
        }
      }
    };

    await fs.writeFile(
      path.join(this.stacksDir, 'current', 'AP_STACK_DEV.json'),
      JSON.stringify(devStack, null, 2)
    );

    console.log('✅ Stack de desarrollo documentado');
  }

  async createVersioningSystem() {
    const versioningDoc = `# 📊 Stack Versioning System - AI Pair Orchestrator Pro

## 🎯 **Propósito**

Sistema de versionado y gestión de stack tecnológico que mantiene:
- **AP_STACK_PROD**: Stack de producción (estable, probado)
- **AP_STACK_DEV**: Stack de desarrollo (evolutivo, experimental)
- **Historial completo** de cambios y evolución
- **Proceso de promoción** de tecnologías de DEV a PROD

## 📋 **Estructura**

\`\`\`
STACKS/
├── current/
│   ├── AP_STACK_PROD.json      # Stack actual de producción
│   └── AP_STACK_DEV.json       # Stack actual de desarrollo
├── history/
│   ├── prod/
│   │   ├── v1.0.0.json
│   │   └── v1.1.0.json
│   └── dev/
│       ├── v1.1.0-dev.json
│       └── v1.2.0-dev.json
├── comparisons/
│   └── [component-name]/
│       ├── stack-analysis.json
│       ├── compatibility-report.json
│       └── decision-rationale.md
└── evaluations/
    └── [evaluation-date]/
        ├── candidate-analysis.json
        ├── stack-comparison.json
        └── integration-decision.json
\`\`\`

## 🔄 **Flujo de Trabajo**

### 1. Evaluación de Componentes
- Todas las evaluaciones se hacen contra **AP_STACK_DEV**
- Se genera reporte de compatibilidad
- Se documenta decisión: PORTE / INTEGRACIÓN / INSPIRACIÓN

### 2. Experimentación en DEV
- Nuevas tecnologías se prueban primero en DEV
- Se documentan resultados y métricas
- Se evalúa impacto en stack existente

### 3. Promoción a PROD
- Tecnologías estables pasan de DEV a PROD
- Se actualiza versión de stack PROD
- Se archiva versión anterior

## 📊 **Criterios de Decisión**

### Puntuación de Compatibilidad
- **80-100**: PORTE (adaptación completa al stack)
- **60-79**: INTEGRACIÓN (uso como servicio/librería)
- **40-59**: INSPIRACIÓN (tomar ideas para desarrollo propio)
- **0-39**: RECHAZO (incompatible o no justificado)

### Matriz de Evaluación
| Criterio | Peso | Descripción |
|----------|------|-------------|
| Frontend Compatibility | 30% | Compatibilidad con React + TypeScript |
| Backend Compatibility | 25% | Compatibilidad con Supabase + FusionAuth |
| Architecture Alignment | 20% | Alineación con patrones arquitectónicos |
| License Compatibility | 15% | Licencia compatible |
| Maintenance Complexity | 10% | Complejidad de mantenimiento |

## 🛠️ **Comandos**

\`\`\`bash
# Inicializar sistema
node scripts/stack-registry.cjs init

# Evaluar componente
node scripts/stack-registry.cjs evaluate [component-name] [repo-url]

# Comparar stacks
node scripts/stack-registry.cjs compare [component-name]

# Actualizar stack DEV
node scripts/stack-registry.cjs update-dev [changes]

# Promover a PROD
node scripts/stack-registry.cjs promote-to-prod [version]

# Ver historial
node scripts/stack-registry.cjs history [prod|dev]
\`\`\`

## 📝 **Registro de Cambios**

Cada cambio en el stack debe incluir:
- Fecha y versión
- Tecnología añadida/modificada/removida
- Razón del cambio
- Impacto estimado
- Métricas de validación

---

*Generado por AI Pair Orchestrator Pro - VThink 1.0*  
*Stack Registry System - Versión 1.0*  
*Fecha: ${this.currentDate}*
`;

    await fs.writeFile(
      path.join(this.stacksDir, 'README.md'),
      versioningDoc
    );

    console.log('📖 Sistema de versionado documentado');
  }

  async createStackTools() {
    // Crear herramientas de gestión del stack
    const stackManagerScript = `#!/usr/bin/env node

/**
 * 🔧 Stack Manager - AI Pair Orchestrator Pro
 * 
 * Herramientas para gestión del stack tecnológico
 * Permite comparar, evaluar y actualizar stacks
 */

const fs = require('fs').promises;
const path = require('path');

class StackManager {
  constructor() {
    this.stacksDir = path.join('docs', 'PROJECT', '08_TOOLCHAIN_AND_SETUP', 'STACKS');
  }

  async loadStack(environment) {
    const stackPath = path.join(this.stacksDir, 'current', \`AP_STACK_\${environment.toUpperCase()}.json\`);
    const stackData = await fs.readFile(stackPath, 'utf8');
    return JSON.parse(stackData);
  }

  async compareStacks() {
    const prodStack = await this.loadStack('prod');
    const devStack = await this.loadStack('dev');
    
    console.log('📊 Comparación de Stacks PROD vs DEV\\n');
    
    // Comparar versiones principales
    this.compareSection('Frontend Framework', prodStack.frontend.framework, devStack.frontend.framework);
    this.compareSection('TypeScript', prodStack.frontend.language, devStack.frontend.language);
    this.compareSection('Build Tool', prodStack.frontend.build_tool, devStack.frontend.build_tool);
    
    // Mostrar experimentales solo en DEV
    if (devStack.experimental_technologies) {
      console.log(\`\\n🧪 Tecnologías Experimentales en DEV:\`);
      for (const [tech, details] of Object.entries(devStack.experimental_technologies)) {
        console.log(\`   • \${tech}: \${details.status} - \${details.rationale}\`);
      }
    }
  }

  compareSection(name, prodTech, devTech) {
    const prodVersion = prodTech.version;
    const devVersion = devTech.version;
    
    if (prodVersion === devVersion) {
      console.log(\`✅ \${name}: \${prodVersion} (sincronizado)\`);
    } else {
      console.log(\`🔄 \${name}: PROD(\${prodVersion}) → DEV(\${devVersion})\`);
    }
  }

  async evaluateComponent(componentName, repoUrl) {
    console.log(\`🔍 Evaluando componente: \${componentName}\`);
    console.log(\`📂 Repositorio: \${repoUrl}\\n\`);
    
    // Cargar stack de referencia (DEV)
    const devStack = await this.loadStack('dev');
    
    console.log('📋 Stack de referencia: AP_STACK_DEV');
    console.log(\`📅 Versión: \${devStack.version}\`);
    console.log(\`📊 Última actualización: \${devStack.last_updated}\\n\`);
    
    // Aquí se haría el análisis real del componente
    console.log('⚠️  Análisis automático del repositorio aún no implementado');
    console.log('📝 Para análisis completo, usar: node scripts/generate-porte-analysis.cjs');
  }
}

// Ejecutar comandos
if (require.main === module) {
  const [,, command, ...args] = process.argv;
  const manager = new StackManager();

  switch (command) {
    case 'compare':
      manager.compareStacks();
      break;
    case 'evaluate':
      const [componentName, repoUrl] = args;
      if (!componentName || !repoUrl) {
        console.error('❌ Uso: node stack-manager.cjs evaluate [component-name] [repo-url]');
        process.exit(1);
      }
      manager.evaluateComponent(componentName, repoUrl);
      break;
    default:
      console.log('🔧 Stack Manager - AI Pair Orchestrator Pro\\n');
      console.log('Comandos disponibles:');
      console.log('  compare              - Comparar stacks PROD vs DEV');
      console.log('  evaluate [name] [url] - Evaluar componente candidato');
      console.log(\`\\nEjemplos:\`);
      console.log('  node stack-manager.cjs compare');
      console.log('  node stack-manager.cjs evaluate "postiz" "https://github.com/gitroomhq/postiz-app"');
  }
}

module.exports = StackManager;
`;

    await fs.writeFile(
      path.join('scripts', 'stack-manager.cjs'),
      stackManagerScript
    );

    console.log('🛠️ Herramientas de gestión creadas');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const registry = new StackRegistry();
  registry.initializeStackRegistry();
}

module.exports = StackRegistry;
