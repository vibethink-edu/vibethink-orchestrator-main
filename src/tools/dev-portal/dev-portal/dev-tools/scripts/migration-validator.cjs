#!/usr/bin/env node

/**
 * ✅ Validador de Migración
 * 
 * Este script valida que una migración de porte cumple con todos los
 * estándares y requisitos del framework VThink 1.0. Ejecuta verificaciones
 * técnicas, de calidad y de integración.
 * 
 * Uso: node scripts/migration-validator.js [modulo]
 * 
 * VThink 1.0 - Framework de Porte
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class MigrationValidator {
  constructor(moduleName) {
    this.moduleName = moduleName;
    this.appDir = path.join('src', 'apps', moduleName);
    this.componentDir = path.join('src', 'components', moduleName);
    this.timestamp = new Date().toISOString();
    this.validationResults = {
      passed: [],
      failed: [],
      warnings: [],
      overall: false
    };
  }

  async validateMigration() {
    console.log(`✅ Iniciando validación de migración: ${this.moduleName}`);
    
    try {
      // 1. Validar estructura de directorios
      await this.validateDirectoryStructure();
      
      // 2. Validar configuración
      await this.validateConfiguration();
      
      // 3. Validar código TypeScript
      await this.validateTypeScript();
      
      // 4. Validar tests
      await this.validateTests();
      
      // 5. Validar integración
      await this.validateIntegration();
      
      // 6. Validar documentación
      await this.validateDocumentation();
      
      // 7. Validar performance
      await this.validatePerformance();
      
      // 8. Generar reporte final
      await this.generateValidationReport();
      
      // 9. Mostrar resultados
      this.showResults();
      
    } catch (error) {
      console.error('❌ Error durante la validación:', error.message);
      process.exit(1);
    }
  }

  async validateDirectoryStructure() {
    console.log('📁 Validando estructura de directorios...');
    
    const requiredDirs = [
      this.appDir,
      path.join(this.appDir, 'src'),
      path.join(this.appDir, 'src', 'components'),
      path.join(this.appDir, 'src', 'pages'),
      path.join(this.appDir, 'src', 'hooks'),
      path.join(this.appDir, 'src', 'services'),
      path.join(this.appDir, 'src', 'types'),
      path.join(this.appDir, 'src', 'utils'),
      path.join(this.appDir, 'src', 'config'),
      path.join(this.appDir, 'tests'),
      this.componentDir
    ];

    for (const dir of requiredDirs) {
      try {
        await fs.access(dir);
        this.addResult('passed', `Directory exists: ${dir}`);
      } catch (error) {
        this.addResult('failed', `Missing directory: ${dir}`);
      }
    }

    // Validar archivos obligatorios
    const requiredFiles = [
      path.join(this.appDir, 'package.json'),
      path.join(this.appDir, 'tsconfig.json'),
      path.join(this.appDir, 'vite.config.ts'),
      path.join(this.appDir, 'vitest.config.ts'),
      path.join(this.appDir, 'tailwind.config.js'),
      path.join(this.appDir, 'src', 'main.tsx'),
      path.join(this.appDir, 'src', 'App.tsx'),
      path.join(this.appDir, 'src', 'index.css')
    ];

    for (const file of requiredFiles) {
      try {
        await fs.access(file);
        this.addResult('passed', `Required file exists: ${path.basename(file)}`);
      } catch (error) {
        this.addResult('failed', `Missing required file: ${file}`);
      }
    }
  }

  async validateConfiguration() {
    console.log('⚙️  Validando configuración...');
    
    try {
      // Validar package.json
      const packagePath = path.join(this.appDir, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      // Verificar dependencias requeridas
      const requiredDeps = [
        'react',
        'react-dom',
        'react-router-dom',
        '@supabase/supabase-js',
        'tailwind-merge',
        'class-variance-authority',
        'lucide-react'
      ];

      for (const dep of requiredDeps) {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.addResult('passed', `Required dependency: ${dep}`);
        } else {
          this.addResult('failed', `Missing required dependency: ${dep}`);
        }
      }

      // Verificar scripts obligatorios
      const requiredScripts = ['dev', 'build', 'test', 'lint', 'type-check'];
      for (const script of requiredScripts) {
        if (packageJson.scripts && packageJson.scripts[script]) {
          this.addResult('passed', `Required script: ${script}`);
        } else {
          this.addResult('failed', `Missing required script: ${script}`);
        }
      }

      // Validar tsconfig.json
      const tsconfigPath = path.join(this.appDir, 'tsconfig.json');
      const tsconfigContent = await fs.readFile(tsconfigPath, 'utf8');
      const tsconfig = JSON.parse(tsconfigContent);
      
      if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
        this.addResult('passed', 'TypeScript strict mode enabled');
      } else {
        this.addResult('failed', 'TypeScript strict mode not enabled');
      }

      if (tsconfig.compilerOptions && tsconfig.compilerOptions.jsx === 'react-jsx') {
        this.addResult('passed', 'React JSX transform configured');
      } else {
        this.addResult('failed', 'React JSX transform not configured properly');
      }

    } catch (error) {
      this.addResult('failed', `Configuration validation error: ${error.message}`);
    }
  }

  async validateTypeScript() {
    console.log('📘 Validando TypeScript...');
    
    try {
      // Ejecutar type check
      const typeCheckResult = execSync(
        `cd "${this.appDir}" && npm run type-check`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      this.addResult('passed', 'TypeScript type checking passed');
      
    } catch (error) {
      this.addResult('failed', `TypeScript type checking failed: ${error.message}`);
    }

    // Verificar cobertura de TypeScript
    try {
      const srcFiles = await this.getAllSourceFiles();
      let tsFiles = 0;
      let jsFiles = 0;

      for (const file of srcFiles) {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          tsFiles++;
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
          jsFiles++;
        }
      }

      const tsPercentage = (tsFiles / (tsFiles + jsFiles)) * 100;
      
      if (tsPercentage >= 95) {
        this.addResult('passed', `TypeScript coverage: ${tsPercentage.toFixed(1)}%`);
      } else if (tsPercentage >= 80) {
        this.addResult('warnings', `TypeScript coverage below 95%: ${tsPercentage.toFixed(1)}%`);
      } else {
        this.addResult('failed', `TypeScript coverage too low: ${tsPercentage.toFixed(1)}%`);
      }

    } catch (error) {
      this.addResult('warnings', `Could not calculate TypeScript coverage: ${error.message}`);
    }
  }

  async validateTests() {
    console.log('🧪 Validando tests...');
    
    try {
      // Verificar si existen archivos de test
      const testFiles = await this.getTestFiles();
      
      if (testFiles.length === 0) {
        this.addResult('failed', 'No test files found');
        return;
      }

      this.addResult('passed', `Found ${testFiles.length} test files`);

      // Ejecutar tests
      try {
        const testResult = execSync(
          `cd "${this.appDir}" && npm run test -- --run`,
          { encoding: 'utf8', stdio: 'pipe' }
        );
        this.addResult('passed', 'All tests passing');
        
        // Verificar cobertura si está disponible
        try {
          const coverageResult = execSync(
            `cd "${this.appDir}" && npm run test:coverage -- --run --reporter=json`,
            { encoding: 'utf8', stdio: 'pipe' }
          );
          
          // Parsear resultados de cobertura (simplificado)
          if (coverageResult.includes('"pct"')) {
            const coverage = coverageResult.match(/"pct":\s*(\d+(?:\.\d+)?)/);
            if (coverage) {
              const coveragePercent = parseFloat(coverage[1]);
              if (coveragePercent >= 80) {
                this.addResult('passed', `Test coverage: ${coveragePercent}%`);
              } else {
                this.addResult('warnings', `Test coverage below 80%: ${coveragePercent}%`);
              }
            }
          }
        } catch (coverageError) {
          this.addResult('warnings', 'Could not determine test coverage');
        }
        
      } catch (testError) {
        this.addResult('failed', `Tests failing: ${testError.message}`);
      }

    } catch (error) {
      this.addResult('failed', `Test validation error: ${error.message}`);
    }
  }

  async validateIntegration() {
    console.log('🔗 Validando integración...');
    
    // Verificar integración con Supabase
    try {
      const supabaseConfigPath = path.join(this.appDir, 'src', 'config', 'supabase.ts');
      await fs.access(supabaseConfigPath);
      
      const supabaseConfig = await fs.readFile(supabaseConfigPath, 'utf8');
      if (supabaseConfig.includes('createClient') && supabaseConfig.includes('Database')) {
        this.addResult('passed', 'Supabase integration configured');
      } else {
        this.addResult('failed', 'Supabase integration incomplete');
      }
      
    } catch (error) {
      this.addResult('failed', 'Supabase configuration missing');
    }

    // Verificar providers
    try {
      const authProviderPath = path.join(this.appDir, 'src', 'providers', 'AuthProvider.tsx');
      const tenantProviderPath = path.join(this.appDir, 'src', 'providers', 'TenantProvider.tsx');
      
      await fs.access(authProviderPath);
      await fs.access(tenantProviderPath);
      
      this.addResult('passed', 'Auth and Tenant providers configured');
      
    } catch (error) {
      this.addResult('failed', 'Required providers missing');
    }

    // Verificar shadcn/ui integration
    try {
      const componentsConfigPath = path.join('components.json');
      await fs.access(componentsConfigPath);
      
      this.addResult('passed', 'shadcn/ui configuration found');
      
    } catch (error) {
      this.addResult('warnings', 'shadcn/ui configuration not found in root');
    }
  }

  async validateDocumentation() {
    console.log('📚 Validando documentación...');
    
    // Verificar README del módulo
    try {
      const readmePath = path.join(this.appDir, 'README.md');
      await fs.access(readmePath);
      
      const readmeContent = await fs.readFile(readmePath, 'utf8');
      if (readmeContent.length > 100) {
        this.addResult('passed', 'Module README exists and has content');
      } else {
        this.addResult('warnings', 'Module README is too short');
      }
      
    } catch (error) {
      this.addResult('failed', 'Module README missing');
    }

    // Verificar documentación de porte
    try {
      const porteDocPath = path.join('docs', 'PROJECT', '08_TOOLCHAIN_AND_SETUP', `${this.moduleName.toUpperCase()}_PORTE_COMPLETE.md`);
      await fs.access(porteDocPath);
      
      this.addResult('passed', 'Porte documentation exists');
      
    } catch (error) {
      this.addResult('failed', 'Porte documentation missing');
    }

    // Verificar análisis de componente
    try {
      const analysisDir = path.join('src', 'modules', `${this.moduleName}-analysis`);
      await fs.access(analysisDir);
      
      this.addResult('passed', 'Component analysis directory exists');
      
    } catch (error) {
      this.addResult('warnings', 'Component analysis directory not found');
    }
  }

  async validatePerformance() {
    console.log('⚡ Validando performance...');
    
    try {
      // Intentar build de producción
      const buildResult = execSync(
        `cd "${this.appDir}" && npm run build`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      this.addResult('passed', 'Production build successful');
      
      // Verificar tamaño de bundles
      const distDir = path.join(this.appDir, 'dist');
      try {
        const distStats = await fs.stat(distDir);
        if (distStats.isDirectory()) {
          this.addResult('passed', 'Build artifacts generated');
        }
      } catch (error) {
        this.addResult('warnings', 'Could not verify build artifacts');
      }
      
    } catch (error) {
      this.addResult('failed', `Production build failed: ${error.message}`);
    }

    // Verificar dependencias
    try {
      const packagePath = path.join(this.appDir, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      const depCount = Object.keys(packageJson.dependencies || {}).length;
      const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
      
      if (depCount < 50) {
        this.addResult('passed', `Reasonable dependency count: ${depCount} production deps`);
      } else {
        this.addResult('warnings', `High dependency count: ${depCount} production deps`);
      }
      
    } catch (error) {
      this.addResult('warnings', 'Could not analyze dependencies');
    }
  }

  async getAllSourceFiles() {
    const files = [];
    const srcDir = path.join(this.appDir, 'src');
    
    async function walkDir(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await walkDir(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    }
    
    try {
      await walkDir(srcDir);
    } catch (error) {
      // Directory might not exist
    }
    
    return files;
  }

  async getTestFiles() {
    const files = [];
    const testDirs = [
      path.join(this.appDir, 'tests'),
      path.join(this.appDir, 'src')
    ];
    
    async function walkDir(dir) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await walkDir(fullPath);
          } else if (entry.isFile()) {
            const name = entry.name;
            if (name.includes('.test.') || name.includes('.spec.') || name.endsWith('.test.ts') || name.endsWith('.spec.ts')) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Directory might not exist
      }
    }
    
    for (const testDir of testDirs) {
      await walkDir(testDir);
    }
    
    return files;
  }

  addResult(type, message) {
    this.validationResults[type].push({
      message,
      timestamp: new Date().toISOString()
    });
  }

  async generateValidationReport() {
    const report = {
      module: this.moduleName,
      validation_date: this.timestamp,
      framework_version: 'VThink 1.0',
      summary: {
        total_checks: this.validationResults.passed.length + this.validationResults.failed.length + this.validationResults.warnings.length,
        passed: this.validationResults.passed.length,
        failed: this.validationResults.failed.length,
        warnings: this.validationResults.warnings.length,
        overall_status: this.validationResults.failed.length === 0 ? 'PASSED' : 'FAILED'
      },
      results: this.validationResults,
      recommendations: this.generateRecommendations()
    };

    this.validationResults.overall = report.summary.overall_status === 'PASSED';

    const reportPath = path.join(this.appDir, 'validation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`📊 Reporte de validación generado: ${reportPath}`);
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.validationResults.failed.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        message: 'Resolver todos los errores críticos antes de proceder con el deployment'
      });
    }

    if (this.validationResults.warnings.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        message: 'Revisar y resolver advertencias para mejorar la calidad del código'
      });
    }

    if (this.validationResults.failed.length === 0 && this.validationResults.warnings.length === 0) {
      recommendations.push({
        priority: 'LOW',
        message: 'Migración completada exitosamente. Proceder con deployment a staging'
      });
    }

    return recommendations;
  }

  showResults() {
    console.log('\n📋 RESULTADOS DE VALIDACIÓN:');
    console.log('==============================');
    
    const { passed, failed, warnings } = this.validationResults;
    
    console.log(`✅ Pasados: ${passed.length}`);
    console.log(`❌ Fallidos: ${failed.length}`);
    console.log(`⚠️  Advertencias: ${warnings.length}`);
    
    if (failed.length > 0) {
      console.log('\n❌ ERRORES CRÍTICOS:');
      failed.forEach(result => {
        console.log(`   • ${result.message}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  ADVERTENCIAS:');
      warnings.forEach(result => {
        console.log(`   • ${result.message}`);
      });
    }
    
    console.log(`\n🎯 ESTADO GENERAL: ${this.validationResults.overall ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (this.validationResults.overall) {
      console.log('\n🚀 La migración está lista para deployment!');
    } else {
      console.log('\n🔧 Corrija los errores antes de proceder con el deployment.');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const [,, moduleName] = process.argv;

  if (!moduleName) {
    console.error('❌ Uso: node scripts/migration-validator.js [modulo]');
    console.error('   Ejemplo: node scripts/migration-validator.js social-media');
    process.exit(1);
  }

  const validator = new MigrationValidator(moduleName);
  validator.validateMigration().then(() => {
    process.exit(validator.validationResults.overall ? 0 : 1);
  });
}

module.exports = MigrationValidator;
