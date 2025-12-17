#!/usr/bin/env node

/**
 * Security Validator - VibeThink Orchestrator
 * Validates security standards for multi-tenant SaaS platform
 */

const fs = require('fs');
const path = require('path');

class SecurityValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.errors = [];
    this.warnings = [];
    this.success = [];
    
    // Apps that don't require multi-tenant security (marketing/reference)
    this.STANDALONE_APPS = ['website', 'bundui-reference'];
  }

  /**
   * Check if a file path should be excluded from multitenant security checks
   */
  shouldSkipMultiTenantChecks(filePath) {
    const relativePath = path.relative(this.projectRoot, filePath);
    return this.STANDALONE_APPS.some(app => 
      relativePath.includes(`apps/${app}/`) || 
      relativePath.includes(`apps\\${app}\\`)
    );
  }

  async validate() {
    console.log('🚀 Iniciando validación de seguridad...\n');
    
    try {
      await this.checkMultiTenantSecurity();
      await this.checkEnvironmentVariables();
      await this.checkAuthenticationSetup();
      await this.checkDatabaseSecurity();
      await this.checkAPISecurityPatterns();
      await this.checkSecretManagement();
      await this.checkCORSConfiguration();
      await this.generateReport();
      
      this.printResults();
      return this.errors.length === 0;
    } catch (error) {
      console.error('❌ Error durante validación:', error.message);
      return false;
    }
  }

  async checkMultiTenantSecurity() {
    console.log('🏢 Verificando seguridad multi-tenant...');
    
    const srcPath = path.join(this.projectRoot, 'src');
    const appsPath = path.join(this.projectRoot, 'apps');
    
    let companyIdFiltering = 0;
    let unsafeQueries = 0;
    let totalQueries = 0;
    
    const scanForQueries = (dirPath) => {
      if (!fs.existsSync(dirPath)) return;
      
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanForQueries(itemPath);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
          // Skip multitenant security checks for standalone apps
          if (this.shouldSkipMultiTenantChecks(itemPath)) {
            return;
          }
          
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Buscar queries de Supabase
          const supabaseQueries = content.match(/supabase\s*\.\s*from\s*\(\s*['"`][^'"`]+['"`]\s*\)/g) || [];
          totalQueries += supabaseQueries.length;
          
          for (const query of supabaseQueries) {
            const lines = content.split('\n');
            const queryLineIndex = lines.findIndex(line => line.includes(query));
            
            if (queryLineIndex !== -1) {
              // Verificar las siguientes líneas para company_id filtering
              const nextLines = lines.slice(queryLineIndex, queryLineIndex + 5).join('\n');
              
              if (nextLines.includes('company_id') || nextLines.includes('companyId')) {
                companyIdFiltering++;
              } else {
                unsafeQueries++;
                const relativePath = path.relative(this.projectRoot, itemPath);
                this.errors.push(`❌ Query sin company_id filtering en ${relativePath}:${queryLineIndex + 1}`);
              }
            }
          }
        }
      }
    };
    
    scanForQueries(srcPath);
    scanForQueries(appsPath);
    
    if (totalQueries === 0) {
      this.warnings.push('⚠️ No se detectaron queries de Supabase');
    } else {
      const securityPercentage = Math.round((companyIdFiltering / totalQueries) * 100);
      
      if (securityPercentage === 100) {
        this.success.push(`✅ 100% de queries tienen company_id filtering (${totalQueries} queries)`);
      } else if (securityPercentage >= 90) {
        this.warnings.push(`⚠️ ${securityPercentage}% de queries con company_id filtering`);
      } else {
        this.errors.push(`❌ Solo ${securityPercentage}% de queries tienen company_id filtering`);
      }
    }
  }

  async checkEnvironmentVariables() {
    console.log('🔐 Verificando variables de entorno...');
    
    const envFiles = [
      '.env',
      '.env.example',
      '.env.local',
      '.env.development',
      '.env.production'
    ];

    let envExampleFound = false;
    let prodEnvFound = false;
    const sensitiveVarsInCode = [];
    
    for (const envFile of envFiles) {
      const envPath = path.join(this.projectRoot, envFile);
      
      if (fs.existsSync(envPath)) {
        if (envFile === '.env.example') {
          envExampleFound = true;
          this.success.push('✅ .env.example encontrado');
        } else if (envFile === '.env.production') {
          prodEnvFound = true;
          this.warnings.push('⚠️ .env.production presente - verificar que no se commite');
        }
        
        // Verificar contenido del archivo .env
        const content = fs.readFileSync(envPath, 'utf8');
        
        // Verificar variables críticas
        const criticalVars = [
          'SUPABASE_URL',
          'SUPABASE_ANON_KEY',
          'NEXTAUTH_SECRET',
          'NEXTAUTH_URL'
        ];
        
        for (const varName of criticalVars) {
          if (content.includes(`${varName}=`)) {
            this.success.push(`✅ ${varName} configurado en ${envFile}`);
          } else if (envFile === '.env.example') {
            this.warnings.push(`⚠️ ${varName} faltante en .env.example`);
          }
        }
        
        // Verificar que no hay valores reales en .env.example
        if (envFile === '.env.example') {
          const hasRealValues = content.match(/=(?!your_|example_|placeholder_|\[|\{|#)[\w\-\.]+/);
          if (hasRealValues) {
            this.warnings.push('⚠️ .env.example podría contener valores reales');
          }
        }
      }
    }
    
    if (!envExampleFound) {
      this.errors.push('❌ .env.example no encontrado - crítico para documentar variables');
    }
    
    // Verificar hardcoded secrets en código
    await this.checkHardcodedSecrets();
  }

  async checkHardcodedSecrets() {
    console.log('🔍 Buscando secrets hardcodeados...');
    
    const srcPath = path.join(this.projectRoot, 'src');
    const appsPath = path.join(this.projectRoot, 'apps');
    
    const suspiciousPatterns = [
      /supabase_url\s*=\s*['"`]https:\/\/[^'"`]+['"`]/gi,
      /supabase.*key\s*=\s*['"`][a-zA-Z0-9]{20,}['"`]/gi,
      /secret\s*=\s*['"`][a-zA-Z0-9]{20,}['"`]/gi,
      /password\s*=\s*['"`][^'"`]+['"`]/gi,
      /api_key\s*=\s*['"`][a-zA-Z0-9]{20,}['"`]/gi
    ];
    
    const scanForSecrets = (dirPath) => {
      if (!fs.existsSync(dirPath)) return;
      
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanForSecrets(itemPath);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js')) {
          const content = fs.readFileSync(itemPath, 'utf8');
          
          for (const pattern of suspiciousPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              const relativePath = path.relative(this.projectRoot, itemPath);
              this.errors.push(`❌ Posible secret hardcodeado en ${relativePath}`);
            }
          }
        }
      }
    };
    
    scanForSecrets(srcPath);
    scanForSecrets(appsPath);
  }

  async checkAuthenticationSetup() {
    console.log('🔒 Verificando configuración de autenticación...');
    
    // Verificar middleware de autenticación
    const middlewarePath = path.join(this.projectRoot, 'middleware.ts');
    const middlewareJsPath = path.join(this.projectRoot, 'middleware.js');
    
    let hasMiddleware = false;
    
    if (fs.existsSync(middlewarePath)) {
      hasMiddleware = true;
      const content = fs.readFileSync(middlewarePath, 'utf8');
      
      if (content.includes('NextRequest') && content.includes('NextResponse')) {
        this.success.push('✅ Middleware de autenticación configurado');
      } else {
        this.warnings.push('⚠️ middleware.ts presente pero sin patrones de auth detectados');
      }
    } else if (fs.existsSync(middlewareJsPath)) {
      hasMiddleware = true;
      this.success.push('✅ middleware.js encontrado');
    }
    
    if (!hasMiddleware) {
      this.warnings.push('⚠️ Middleware de autenticación no encontrado');
    }
    
    // Verificar configuración de Supabase auth
    const supabaseClientPath = path.join(this.projectRoot, 'src', 'integrations', 'supabase', 'client.ts');
    if (fs.existsSync(supabaseClientPath)) {
      const content = fs.readFileSync(supabaseClientPath, 'utf8');
      
      if (content.includes('createBrowserClient') || content.includes('createServerClient')) {
        this.success.push('✅ Cliente de Supabase configurado correctamente');
      } else {
        this.warnings.push('⚠️ Configuración de cliente Supabase no estándar');
      }
    } else {
      this.warnings.push('⚠️ Cliente de Supabase no encontrado en ubicación esperada');
    }
  }

  async checkDatabaseSecurity() {
    console.log('🗄️ Verificando seguridad de base de datos...');
    
    // Verificar migraciones de Supabase
    const migrationsPath = path.join(this.projectRoot, 'supabase', 'migrations');
    if (fs.existsSync(migrationsPath)) {
      const migrations = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql'));
      
      if (migrations.length > 0) {
        this.success.push(`✅ ${migrations.length} migraciones de Supabase encontradas`);
        
        // Verificar RLS policies en migraciones
        let rlsCount = 0;
        for (const migration of migrations) {
          const migrationPath = path.join(migrationsPath, migration);
          const content = fs.readFileSync(migrationPath, 'utf8');
          
          if (content.includes('ROW LEVEL SECURITY') || content.includes('CREATE POLICY')) {
            rlsCount++;
          }
        }
        
        if (rlsCount > 0) {
          this.success.push(`✅ ${rlsCount} migraciones con RLS policies`);
        } else {
          this.errors.push('❌ No se encontraron RLS policies en migraciones');
        }
      } else {
        this.warnings.push('⚠️ No se encontraron migraciones de Supabase');
      }
    } else {
      this.warnings.push('⚠️ Directorio de migraciones de Supabase no encontrado');
    }
    
    // Verificar tipos de Supabase
    const typesPath = path.join(this.projectRoot, 'src', 'integrations', 'supabase', 'types.ts');
    if (fs.existsSync(typesPath)) {
      this.success.push('✅ Tipos de Supabase generados');
    } else {
      this.warnings.push('⚠️ Tipos de Supabase no encontrados - ejecutar supabase gen types');
    }
  }

  async checkAPISecurityPatterns() {
    console.log('🌐 Verificando patrones de seguridad en API...');
    
    const apiPaths = [
      path.join(this.projectRoot, 'src', 'app', 'api'),
      path.join(this.projectRoot, 'apps'),
    ];
    
    let apiRoutes = 0;
    let secureRoutes = 0;
    
    const scanAPIRoutes = (dirPath) => {
      if (!fs.existsSync(dirPath)) return;
      
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanAPIRoutes(itemPath);
        } else if (item === 'route.ts' || item === 'route.js') {
          apiRoutes++;
          
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Verificar patrones de seguridad
          const hasAuth = content.includes('authenticate') || 
                         content.includes('getServerSession') ||
                         content.includes('auth') ||
                         content.includes('user') ||
                         content.includes('company_id');
          
          const hasValidation = content.includes('zod') || 
                               content.includes('validate') ||
                               content.includes('schema');
          
          const hasErrorHandling = content.includes('try') && content.includes('catch');
          
          if (hasAuth && hasValidation && hasErrorHandling) {
            secureRoutes++;
          } else {
            const relativePath = path.relative(this.projectRoot, itemPath);
            const missing = [];
            if (!hasAuth) missing.push('autenticación');
            if (!hasValidation) missing.push('validación');
            if (!hasErrorHandling) missing.push('manejo de errores');
            
            this.warnings.push(`⚠️ ${relativePath}: falta ${missing.join(', ')}`);
          }
        }
      }
    };
    
    for (const apiPath of apiPaths) {
      scanAPIRoutes(apiPath);
    }
    
    if (apiRoutes === 0) {
      this.warnings.push('⚠️ No se encontraron rutas de API');
    } else {
      const securityPercentage = Math.round((secureRoutes / apiRoutes) * 100);
      
      if (securityPercentage === 100) {
        this.success.push(`✅ 100% de rutas API con patrones de seguridad (${apiRoutes} rutas)`);
      } else if (securityPercentage >= 80) {
        this.warnings.push(`⚠️ ${securityPercentage}% de rutas API seguras`);
      } else {
        this.errors.push(`❌ Solo ${securityPercentage}% de rutas API tienen patrones de seguridad`);
      }
    }
  }

  async checkSecretManagement() {
    console.log('🔑 Verificando gestión de secrets...');
    
    // Verificar .gitignore
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, 'utf8');
      
      const envPatterns = ['.env.local', '.env*.local', '.env.production'];
      let envIgnored = 0;
      
      for (const pattern of envPatterns) {
        if (content.includes(pattern)) {
          envIgnored++;
        }
      }
      
      if (envIgnored > 0) {
        this.success.push(`✅ Archivos .env ignorados en Git (${envIgnored} patrones)`);
      } else {
        this.errors.push('❌ Archivos .env no ignorados en .gitignore');
      }
      
      // Verificar otros patrones de seguridad
      const securityPatterns = ['*.key', '*.pem', '*.p12', '.vscode/settings.json'];
      let securityIgnored = 0;
      
      for (const pattern of securityPatterns) {
        if (content.includes(pattern)) {
          securityIgnored++;
        }
      }
      
      if (securityIgnored > 0) {
        this.success.push(`✅ Archivos sensibles ignorados (${securityIgnored} patrones)`);
      }
    } else {
      this.errors.push('❌ .gitignore no encontrado');
    }
  }

  async checkCORSConfiguration() {
    console.log('🌍 Verificando configuración CORS...');
    
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    const nextConfigMjsPath = path.join(this.projectRoot, 'next.config.mjs');
    
    let hasNextConfig = false;
    let hasCORS = false;
    
    if (fs.existsSync(nextConfigPath)) {
      hasNextConfig = true;
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      hasCORS = this.checkCORSInConfig(content);
    } else if (fs.existsSync(nextConfigMjsPath)) {
      hasNextConfig = true;
      const content = fs.readFileSync(nextConfigMjsPath, 'utf8');
      hasCORS = this.checkCORSInConfig(content);
    }
    
    if (hasNextConfig) {
      if (hasCORS) {
        this.success.push('✅ Configuración CORS encontrada en next.config');
      } else {
        this.warnings.push('⚠️ Configuración CORS no detectada en next.config');
      }
    } else {
      this.warnings.push('⚠️ next.config no encontrado - usando defaults');
    }
  }

  checkCORSInConfig(content) {
    return content.includes('headers') && 
           (content.includes('Access-Control-Allow-Origin') || 
            content.includes('cors'));
  }

  async generateReport() {
    const reportPath = path.join(this.projectRoot, 'docs', 'reports', 'quality');
    
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    const reportFile = path.join(reportPath, `${timestamp}-security-validation.md`);
    
    const report = `# Security Validation Report - ${timestamp}

## 📊 Resumen de Seguridad
- ✅ Validaciones exitosas: ${this.success.length}
- ⚠️ Advertencias: ${this.warnings.length}  
- ❌ Errores críticos: ${this.errors.length}

## ✅ Validaciones Exitosas
${this.success.map(item => `- ${item}`).join('\n')}

## ⚠️ Advertencias de Seguridad
${this.warnings.map(item => `- ${item}`).join('\n')}

## ❌ Errores Críticos de Seguridad
${this.errors.map(item => `- ${item}`).join('\n')}

## 🛡️ Estándares de Seguridad VibeThink Orchestrator

### Multi-tenant Security (CRÍTICO)
\`\`\`typescript
// ✅ SIEMPRE filtrar por company_id
const data = await supabase
  .from('users')
  .select('*')
  .eq('company_id', user.company_id);

// ❌ NUNCA queries sin company_id
const data = await supabase.from('users').select('*');
\`\`\`

### Environment Variables
- ✅ Usar .env.example para documentar variables
- ✅ Ignorar .env.local en .gitignore
- ✅ Nunca commitear secrets reales
- ✅ Usar process.env.VARIABLE_NAME

### Authentication
- ✅ Middleware de autenticación en todas las rutas protegidas
- ✅ Validación de sesión en API routes
- ✅ RLS policies en Supabase
- ✅ Tipos generados de Supabase

### API Security
- ✅ Validación de input con Zod
- ✅ Manejo de errores apropiado
- ✅ Rate limiting cuando sea necesario
- ✅ CORS configuration

---
*Generado automáticamente por VibeThink Orchestrator Security Validator*
`;

    fs.writeFileSync(reportFile, report);
    console.log(`📄 Reporte generado: ${reportFile}`);
  }

  printResults() {
    console.log('\n📊 Resultados de Validación de Seguridad:');
    console.log(`✅ Validaciones exitosas: ${this.success.length}`);
    console.log(`⚠️ Advertencias: ${this.warnings.length}`);
    console.log(`❌ Errores críticos: ${this.errors.length}`);
    
    if (this.errors.length === 0) {
      console.log('\n✅ Seguridad cumple con estándares VibeThink Orchestrator');
    } else {
      console.log('\n❌ Se encontraron vulnerabilidades críticas - resolver inmediatamente');
    }
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const validator = new SecurityValidator();
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

module.exports = SecurityValidator;