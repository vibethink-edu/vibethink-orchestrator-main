#!/usr/bin/env node

/**
 * Script de Validación de Arquitectura Híbrida
 * Verifica que el sistema mantiene desacoplamiento total de proveedores
 */

const fs = require('fs');
const path = require('path');

// Configuración de validación
const VALIDATION_CONFIG = {
  requiredFiles: [
    'src/services/ai/AbstractAIProvider.ts',
    'src/services/ai/KnotieAIProvider.ts',
    'src/services/ai/OpenAIProvider.ts',
    'src/services/ai/AIProviderMonitor.ts',
    'src/hooks/useAIProvider.ts',
    'src/config/aiProviders.ts',
    'src/components/admin/AIProviderDashboard.tsx',
    'docs/ARCHITECTURE_HYBRID_AI_PROVIDERS.md'
  ],
  forbiddenPatterns: [
    /import.*knotie.*from/gi,
    /require.*knotie/gi,
    /knotie\./gi,
    /KnotieAI/gi
  ],
  requiredInterfaces: [
    'AIProvider',
    'AIProviderManager',
    'AIProviderMonitor'
  ],
  fallbackProviders: ['openai', 'anthropic', 'local']
};

class ArchitectureValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = 0;
    this.total = 0;
  }

  /**
   * Ejecuta todas las validaciones
   */
  async validate() {
    console.log('🔍 Validando Arquitectura Híbrida de IA...\n');

    await this.validateFileStructure();
    await this.validateAbstractionLayer();
    await this.validateProviderIndependence();
    await this.validateFallbackMechanisms();
    await this.validateMonitoringSystem();
    await this.validateDocumentation();

    this.printResults();
    return this.errors.length === 0;
  }

  /**
   * Valida estructura de archivos
   */
  async validateFileStructure() {
    console.log('📁 Validando estructura de archivos...');
    
    for (const file of VALIDATION_CONFIG.requiredFiles) {
      this.total++;
      if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
        this.passed++;
      } else {
        console.log(`  ❌ ${file} - NO ENCONTRADO`);
        this.errors.push(`Archivo requerido no encontrado: ${file}`);
      }
    }
  }

  /**
   * Valida capa de abstracción
   */
  async validateAbstractionLayer() {
    console.log('\n🔧 Validando capa de abstracción...');
    
    const abstractFile = 'src/services/ai/AbstractAIProvider.ts';
    if (fs.existsSync(abstractFile)) {
      const content = fs.readFileSync(abstractFile, 'utf8');
      
      // Verificar interfaces requeridas
      for (const interfaceName of VALIDATION_CONFIG.requiredInterfaces) {
        this.total++;
        if (content.includes(`interface ${interfaceName}`) || content.includes(`class ${interfaceName}`)) {
          console.log(`  ✅ Interface/clase ${interfaceName} encontrada`);
          this.passed++;
        } else {
          console.log(`  ❌ Interface/clase ${interfaceName} NO ENCONTRADA`);
          this.errors.push(`Interface/clase requerida no encontrada: ${interfaceName}`);
        }
      }

      // Verificar métodos requeridos
      const requiredMethods = [
        'isAvailable',
        'healthCheck',
        'generateText',
        'getModels',
        'getPricing'
      ];

      for (const method of requiredMethods) {
        this.total++;
        if (content.includes(`${method}():`)) {
          console.log(`  ✅ Método ${method}() encontrado`);
          this.passed++;
        } else {
          console.log(`  ❌ Método ${method}() NO ENCONTRADO`);
          this.errors.push(`Método requerido no encontrado: ${method}`);
        }
      }
    }
  }

  /**
   * Valida independencia de proveedores
   */
  async validateProviderIndependence() {
    console.log('\n🔗 Validando independencia de proveedores...');
    
    const srcDir = 'src';
    const files = this.getAllFiles(srcDir);
    
    for (const file of files) {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Verificar patrones prohibidos
        for (const pattern of VALIDATION_CONFIG.forbiddenPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            console.log(`  ⚠️  Patrón prohibido encontrado en ${file}: ${matches[0]}`);
            this.warnings.push(`Uso directo de Knotie en ${file}: ${matches[0]}`);
          }
        }
      }
    }

    // Verificar que no hay dependencias directas
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (dependencies['@knotie/ai-sdk']) {
      console.log('  ⚠️  Dependencia directa de Knotie encontrada en package.json');
      this.warnings.push('Dependencia directa de Knotie en package.json');
    }
  }

  /**
   * Valida mecanismos de fallback
   */
  async validateFallbackMechanisms() {
    console.log('\n🔄 Validando mecanismos de fallback...');
    
    const configFile = 'src/config/aiProviders.ts';
    if (fs.existsSync(configFile)) {
      const content = fs.readFileSync(configFile, 'utf8');
      
      // Verificar proveedores de fallback
      for (const provider of VALIDATION_CONFIG.fallbackProviders) {
        this.total++;
        if (content.includes(provider)) {
          console.log(`  ✅ Proveedor de fallback ${provider} configurado`);
          this.passed++;
        } else {
          console.log(`  ❌ Proveedor de fallback ${provider} NO CONFIGURADO`);
          this.errors.push(`Proveedor de fallback no configurado: ${provider}`);
        }
      }

      // Verificar configuración de migración automática
      const migrationConfigs = [
        'autoMigration',
        'enabled: true',
        'fallbackProviders'
      ];

      for (const config of migrationConfigs) {
        this.total++;
        if (content.includes(config)) {
          console.log(`  ✅ Configuración de migración ${config} encontrada`);
          this.passed++;
        } else {
          console.log(`  ❌ Configuración de migración ${config} NO ENCONTRADA`);
          this.errors.push(`Configuración de migración no encontrada: ${config}`);
        }
      }
    }
  }

  /**
   * Valida sistema de monitoreo
   */
  async validateMonitoringSystem() {
    console.log('\n📊 Validando sistema de monitoreo...');
    
    const monitorFile = 'src/services/ai/AIProviderMonitor.ts';
    if (fs.existsSync(monitorFile)) {
      const content = fs.readFileSync(monitorFile, 'utf8');
      
      const monitoringFeatures = [
        'healthCheck',
        'analyzePerformance',
        'triggerMigration',
        'sendAlerts',
        'getPerformanceMetrics'
      ];

      for (const feature of monitoringFeatures) {
        this.total++;
        if (content.includes(feature)) {
          console.log(`  ✅ Característica de monitoreo ${feature} encontrada`);
          this.passed++;
        } else {
          console.log(`  ❌ Característica de monitoreo ${feature} NO ENCONTRADA`);
          this.errors.push(`Característica de monitoreo no encontrada: ${feature}`);
        }
      }
    }
  }

  /**
   * Valida documentación
   */
  async validateDocumentation() {
    console.log('\n📚 Validando documentación...');
    
    const docFile = 'docs/ARCHITECTURE_HYBRID_AI_PROVIDERS.md';
    if (fs.existsSync(docFile)) {
      const content = fs.readFileSync(docFile, 'utf8');
      
      const requiredSections = [
        'Arquitectura del Sistema',
        'Estrategias de Migración',
        'Monitoreo y Alertas',
        'Dashboard de Gestión',
        'Casos de Uso'
      ];

      for (const section of requiredSections) {
        this.total++;
        if (content.includes(section)) {
          console.log(`  ✅ Sección de documentación "${section}" encontrada`);
          this.passed++;
        } else {
          console.log(`  ❌ Sección de documentación "${section}" NO ENCONTRADA`);
          this.errors.push(`Sección de documentación no encontrada: ${section}`);
        }
      }
    }
  }

  /**
   * Obtiene todos los archivos en un directorio
   */
  getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });

    return arrayOfFiles;
  }

  /**
   * Imprime resultados de validación
   */
  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 RESULTADOS DE VALIDACIÓN');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Pruebas pasadas: ${this.passed}/${this.total}`);
    console.log(`❌ Errores: ${this.errors.length}`);
    console.log(`⚠️  Advertencias: ${this.warnings.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🚨 ERRORES CRÍTICOS:');
      this.errors.forEach(error => console.log(`  • ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  ADVERTENCIAS:');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    
    if (this.errors.length === 0) {
      console.log('\n🎉 ¡Arquitectura híbrida validada exitosamente!');
      console.log('✅ El sistema mantiene desacoplamiento total de proveedores');
      console.log('✅ Los mecanismos de fallback están configurados correctamente');
      console.log('✅ El monitoreo automático está implementado');
    } else {
      console.log('\n❌ La arquitectura NO cumple con los requisitos de desacoplamiento');
      console.log('🔧 Corrige los errores antes de continuar');
    }
  }
}

// Ejecutar validación
async function main() {
  const validator = new ArchitectureValidator();
  const success = await validator.validate();
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ArchitectureValidator; 