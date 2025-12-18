#!/usr/bin/env node

/**
 * Dashboard Migration Guard - VibeThink Orchestrator
 * Guardrails para prevenir rotura de estilos durante migraciones de dashboards
 * 
 * Valida:
 * - Imports correctos (@vibethink/ui)
 * - Uso de variables CSS semánticas
 * - No hardcoded colors/values
 * - Estructura correcta
 * - No duplicación de estilos
 */

const fs = require('fs');
const path = require('path');

class DashboardMigrationGuard {
  constructor(dashboardPath) {
    this.projectRoot = process.cwd();
    this.dashboardPath = dashboardPath || process.argv[2];
    this.errors = [];
    this.warnings = [];
    this.success = [];
    
    // Rutas importantes
    this.dashboardFullPath = path.join(
      this.projectRoot,
      'apps',
      'dashboard',
      'app',
      'dashboard-bundui',
      this.dashboardPath
    );
    
    this.globalsCssPath = path.join(
      this.projectRoot,
      'apps',
      'dashboard',
      'app',
      'globals.css'
    );
  }

  async validate() {
    console.log(`🛡️  Dashboard Migration Guard - Validando: ${this.dashboardPath}\n`);
    
    if (!this.dashboardPath) {
      console.error('❌ Error: Debe especificar el nombre del dashboard');
      console.log('Uso: node dashboard-migration-guard.cjs <dashboard-name>');
      return false;
    }

    try {
      await this.checkDashboardExists();
      await this.checkImports();
      await this.checkStyleUsage();
      await this.checkHardcodedValues();
      await this.checkStructure();
      await this.checkDuplication();
      await this.checkCSSVariables();
      await this.checkAssets();
      
      this.printResults();
      return this.errors.length === 0;
    } catch (error) {
      console.error('❌ Error durante validación:', error.message);
      return false;
    }
  }

  async checkDashboardExists() {
    console.log('📁 Verificando existencia del dashboard...');
    
    if (!fs.existsSync(this.dashboardFullPath)) {
      this.errors.push(`❌ Dashboard no encontrado: ${this.dashboardFullPath}`);
      return;
    }
    
    this.success.push(`✅ Dashboard encontrado: ${this.dashboardPath}`);
  }

  async checkImports() {
    console.log('📦 Validando imports...');
    
    const componentsPath = path.join(this.dashboardFullPath, 'components');
    if (!fs.existsSync(componentsPath)) {
      this.warnings.push('⚠️  No se encontró directorio components/');
      return;
    }

    const files = this.getAllTsxFiles(componentsPath);
    const importPatterns = {
      correct: /from ['"]@vibethink\/ui['"]/g,
      incorrect: [
        /from ['"]@vibethink\/ui[a-z-]+['"]/g,  // @vibethink/uicard, etc.
        /from ['"]@\/components\/ui\//g,         // @/components/ui/calendar, etc. (ERROR CRÍTICO)
        /from ['"]@\/components\//g,            // Imports locales incorrectos
        /from ['"]\.\.\/bundui/g,               // Imports de bundui-reference
      ]
    };

    let correctImports = 0;
    let incorrectImports = 0;

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(this.projectRoot, file);
      
      // Verificar imports correctos
      const correctMatches = content.match(importPatterns.correct);
      if (correctMatches) {
        correctImports += correctMatches.length;
      }

      // Verificar imports incorrectos
      importPatterns.incorrect.forEach((pattern, index) => {
        const matches = content.match(pattern);
        if (matches) {
          incorrectImports += matches.length;
          // Mensaje más específico para @/components/ui/
          if (index === 1) { // @/components/ui/ pattern
            this.errors.push(`❌ Import incorrecto en ${relativePath}: ${matches[0]}`);
            this.errors.push(`   💡 Debe ser: from '@vibethink/ui' (no @/components/ui/...)`);
          } else {
            this.errors.push(`❌ Import incorrecto en ${relativePath}: ${matches[0]}`);
          }
        }
      });
    });

    if (correctImports > 0) {
      this.success.push(`✅ ${correctImports} imports correctos de @vibethink/ui`);
    }
    
    if (incorrectImports === 0) {
      this.success.push('✅ No se encontraron imports incorrectos');
    }
  }

  async checkStyleUsage() {
    console.log('🎨 Validando uso de estilos...');
    
    const componentsPath = path.join(this.dashboardFullPath, 'components');
    if (!fs.existsSync(componentsPath)) return;

    const files = this.getAllTsxFiles(componentsPath);
    const styleIssues = [];

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(this.projectRoot, file);
      
      // Verificar uso de className (correcto) vs style (peligroso)
      const inlineStyles = content.match(/style=\{[^}]*\}/g);
      if (inlineStyles && inlineStyles.length > 0) {
        styleIssues.push({
          file: relativePath,
          issue: 'Uso de inline styles (preferir className)',
          count: inlineStyles.length
        });
      }

      // Verificar imports de CSS
      const cssImports = content.match(/import ['"].*\.css['"]/g);
      if (cssImports) {
        styleIssues.push({
          file: relativePath,
          issue: 'Import de archivo CSS (debe usar globals.css o variables CSS)',
          imports: cssImports
        });
      }
    });

    if (styleIssues.length > 0) {
      styleIssues.forEach(issue => {
        this.warnings.push(`⚠️  ${issue.file}: ${issue.issue}`);
      });
    } else {
      this.success.push('✅ Uso correcto de estilos (className, sin CSS local)');
    }
  }

  async checkHardcodedValues() {
    console.log('🔍 Buscando valores hardcodeados...');
    
    const componentsPath = path.join(this.dashboardFullPath, 'components');
    if (!fs.existsSync(componentsPath)) return;

    const files = this.getAllTsxFiles(componentsPath);
    const hardcodedPatterns = [
      /#[0-9a-fA-F]{3,6}/g,                    // Colores hex
      /rgb\([^)]+\)/g,                         // RGB
      /rgba\([^)]+\)/g,                        // RGBA
      /hsl\([^)]+\)/g,                         // HSL
      /hsla\([^)]+\)/g,                        // HSLA
      /className=["'][^"']*\b(bg-|text-|border-)(white|black|red|blue|green|yellow|purple|pink|orange|gray|grey)[^"']*["']/g  // Clases de color hardcodeadas
    ];

    let hardcodedCount = 0;

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(this.projectRoot, file);
      
      hardcodedPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          hardcodedCount += matches.length;
          // Filtrar falsos positivos (comentarios, strings de ejemplo)
          const realMatches = matches.filter(m => 
            !m.includes('//') && 
            !m.includes('/*') && 
            !m.includes('example') &&
            !m.includes('TODO')
          );
          
          if (realMatches.length > 0) {
            this.warnings.push(`⚠️  ${relativePath}: Valores hardcodeados encontrados (${realMatches.length})`);
            this.warnings.push(`   Ejemplos: ${realMatches.slice(0, 3).join(', ')}`);
          }
        }
      });
    });

    if (hardcodedCount === 0) {
      this.success.push('✅ No se encontraron valores hardcodeados');
    } else {
      this.warnings.push(`⚠️  Total de valores hardcodeados encontrados: ${hardcodedCount}`);
      this.warnings.push('   💡 Usar variables CSS semánticas: var(--background), var(--foreground), etc.');
    }
  }

  async checkStructure() {
    console.log('🏗️  Validando estructura...');
    
    const requiredFiles = [
      'page.tsx'
    ];
    
    // components/index.ts es opcional (puede causar loops de importación)
    const optionalFiles = [
      'components/index.ts'
    ];

    requiredFiles.forEach(required => {
      const filePath = path.join(this.dashboardFullPath, required);
      if (fs.existsSync(filePath)) {
        this.success.push(`✅ ${required} presente`);
      } else {
        this.errors.push(`❌ Archivo requerido faltante: ${required}`);
      }
    });
    
    // Verificar archivos opcionales
    optionalFiles.forEach(optional => {
      const filePath = path.join(this.dashboardFullPath, optional);
      if (fs.existsSync(filePath)) {
        this.success.push(`✅ ${optional} presente (opcional)`);
      } else {
        this.warnings.push(`⚠️  ${optional} no encontrado (opcional, puede evitar loops de importación)`);
      }
    });

    // Verificar que components/ existe (opcional para páginas simples)
    const componentsPath = path.join(this.dashboardFullPath, 'components');
    if (fs.existsSync(componentsPath)) {
      this.success.push('✅ Directorio components/ presente');

      // Verificar que hay componentes
      const componentFiles = this.getAllTsxFiles(componentsPath);
      if (componentFiles.length > 0) {
        this.success.push(`✅ ${componentFiles.length} componentes encontrados`);
      } else {
        this.warnings.push('⚠️  Directorio components/ vacío');
      }
    } else {
      // components/ es opcional (páginas simples como empty states no lo requieren)
      this.warnings.push('⚠️  Directorio components/ no encontrado (opcional para páginas simples)');
    }
  }

  async checkDuplication() {
    console.log('🔍 Verificando duplicación de estilos...');
    
    // Verificar que no hay archivos CSS locales
    const cssFiles = this.getAllFiles(this.dashboardFullPath, '.css');
    if (cssFiles.length > 0) {
      cssFiles.forEach(cssFile => {
        const relativePath = path.relative(this.projectRoot, cssFile);
        this.errors.push(`❌ Archivo CSS local encontrado: ${relativePath}`);
        this.errors.push('   💡 Los estilos deben estar en globals.css o usar variables CSS');
      });
    } else {
      this.success.push('✅ No se encontraron archivos CSS locales (correcto)');
    }
  }

  async checkCSSVariables() {
    console.log('🎨 Verificando uso de variables CSS...');
    
    const componentsPath = path.join(this.dashboardFullPath, 'components');
    if (!fs.existsSync(componentsPath)) return;

    const files = this.getAllTsxFiles(componentsPath);
    const cssVarPattern = /var\(--[a-z-]+\)/g;
    const semanticVars = [
      '--background',
      '--foreground',
      '--card',
      '--primary',
      '--secondary',
      '--muted',
      '--accent',
      '--border',
      '--ring'
    ];

    let varUsage = 0;
    let semanticVarUsage = 0;

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Contar uso de variables CSS
      const matches = content.match(cssVarPattern);
      if (matches) {
        varUsage += matches.length;
        
        // Verificar uso de variables semánticas
        semanticVars.forEach(semVar => {
          if (content.includes(semVar)) {
            semanticVarUsage++;
          }
        });
      }
    });

    if (varUsage > 0) {
      this.success.push(`✅ Uso de variables CSS detectado (${varUsage} usos)`);
    }
    
    if (semanticVarUsage > 0) {
      this.success.push(`✅ Uso de variables semánticas detectado (${semanticVarUsage} variables diferentes)`);
    } else {
      this.warnings.push('⚠️  No se detectó uso de variables CSS semánticas');
      this.warnings.push('   💡 Usar: var(--background), var(--foreground), var(--primary), etc.');
    }
  }

  async checkAssets() {
    console.log('🖼️  Validando assets (imágenes)...');
    
    const publicImagesPath = path.join(this.projectRoot, 'apps', 'dashboard', 'public', 'images');
    const componentsPath = path.join(this.dashboardFullPath, 'components');
    const pagePath = path.join(this.dashboardFullPath, 'page.tsx');
    
    // Obtener todos los archivos a verificar
    const filesToCheck = [];
    if (fs.existsSync(componentsPath)) {
      filesToCheck.push(...this.getAllTsxFiles(componentsPath));
    }
    if (fs.existsSync(pagePath)) {
      filesToCheck.push(pagePath);
    }
    
    if (filesToCheck.length === 0) {
      this.warnings.push('⚠️  No se encontraron archivos para verificar assets');
      return;
    }

    // Patrones para detectar referencias a imágenes
    const imagePatterns = {
      local: /['"`](?:\/images\/[^'"`]+|images\/[^'"`]+)['"`]/g,
      external: /https?:\/\/[^'"`\s]+\.(?:png|jpg|jpeg|gif|svg|webp)/gi,
      bunduiExternal: /bundui-images\.netlify\.app/gi
    };

    let localImageRefs = [];
    let externalImageRefs = [];
    let bunduiExternalRefs = [];
    let missingImages = [];

    filesToCheck.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(this.projectRoot, file);
      
      // Detectar imágenes locales
      const localMatches = content.match(imagePatterns.local);
      if (localMatches) {
        localMatches.forEach(match => {
          // Limpiar comillas
          const cleanPath = match.replace(/['"`]/g, '');
          // Normalizar ruta (asegurar que empiece con /images/)
          const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
          localImageRefs.push({ file: relativePath, path: normalizedPath });
        });
      }
      
      // Detectar URLs externas
      const externalMatches = content.match(imagePatterns.external);
      if (externalMatches) {
        externalMatches.forEach(match => {
          externalImageRefs.push({ file: relativePath, url: match });
        });
      }
      
      // Detectar específicamente bundui-images.netlify.app
      const bunduiMatches = content.match(imagePatterns.bunduiExternal);
      if (bunduiMatches) {
        bunduiMatches.forEach(() => {
          bunduiExternalRefs.push({ file: relativePath });
        });
      }
    });

    // Verificar que las imágenes locales existan
    if (localImageRefs.length > 0) {
      const uniquePaths = [...new Set(localImageRefs.map(ref => ref.path))];
      
      uniquePaths.forEach(imagePath => {
        // Convertir ruta web a ruta de archivo
        // /images/products/01.jpeg -> apps/dashboard/public/images/products/01.jpeg
        const filePath = path.join(this.projectRoot, 'apps', 'dashboard', 'public', imagePath.replace(/^\//, ''));
        
        if (!fs.existsSync(filePath)) {
          missingImages.push(imagePath);
          const filesUsing = localImageRefs
            .filter(ref => ref.path === imagePath)
            .map(ref => ref.file);
          this.errors.push(`❌ Imagen faltante: ${imagePath}`);
          this.errors.push(`   Usada en: ${filesUsing.join(', ')}`);
          this.errors.push(`   💡 Copiar desde bundui-reference/public/images/`);
        }
      });
      
      if (missingImages.length === 0) {
        this.success.push(`✅ ${uniquePaths.length} referencias a imágenes locales verificadas`);
      }
    }

    // Advertir sobre URLs externas
    if (externalImageRefs.length > 0) {
      const uniqueUrls = [...new Set(externalImageRefs.map(ref => ref.url))];
      this.warnings.push(`⚠️  ${uniqueUrls.length} URL(s) externa(s) detectada(s)`);
      uniqueUrls.slice(0, 3).forEach(url => {
        this.warnings.push(`   ${url}`);
      });
      this.warnings.push('   💡 Considerar usar rutas locales (/images/...) para mejor rendimiento');
    }

    // Error crítico para bundui-images.netlify.app
    if (bunduiExternalRefs.length > 0) {
      const uniqueFiles = [...new Set(bunduiExternalRefs.map(ref => ref.file))];
      this.errors.push(`❌ URLs de bundui-images.netlify.app detectadas (${uniqueFiles.length} archivo(s))`);
      uniqueFiles.forEach(file => {
        this.errors.push(`   ${file}`);
      });
      this.errors.push('   💡 Reemplazar con rutas locales: /images/avatars/... o /images/products/...');
    }

    // Verificar estructura de public/images
    if (!fs.existsSync(publicImagesPath)) {
      this.warnings.push('⚠️  Directorio public/images/ no existe');
      this.warnings.push('   💡 Crear: apps/dashboard/public/images/');
    } else {
      const avatarsPath = path.join(publicImagesPath, 'avatars');
      const productsPath = path.join(publicImagesPath, 'products');
      
      if (fs.existsSync(avatarsPath)) {
        const avatarCount = fs.readdirSync(avatarsPath).filter(f => 
          f.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)
        ).length;
        this.success.push(`✅ ${avatarCount} avatares encontrados en public/images/avatars/`);
      }
      
      if (fs.existsSync(productsPath)) {
        const productCount = fs.readdirSync(productsPath).filter(f => 
          f.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)
        ).length;
        this.success.push(`✅ ${productCount} productos encontrados en public/images/products/`);
      }
    }

    if (localImageRefs.length === 0 && externalImageRefs.length === 0) {
      this.success.push('✅ No se encontraron referencias a imágenes (puede ser normal)');
    }
  }

  // Helpers
  getAllTsxFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllTsxFiles(fullPath));
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  getAllFiles(dir, extension) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath, extension));
      } else if (item.endsWith(extension)) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTADOS DE VALIDACIÓN');
    console.log('='.repeat(60) + '\n');

    if (this.success.length > 0) {
      console.log('✅ ÉXITOS:');
      this.success.forEach(msg => console.log(`  ${msg}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  ADVERTENCIAS:');
      this.warnings.forEach(msg => console.log(`  ${msg}`));
      console.log('');
    }

    if (this.errors.length > 0) {
      console.log('❌ ERRORES:');
      this.errors.forEach(msg => console.log(`  ${msg}`));
      console.log('');
      console.log('🚨 MIGRACIÓN BLOQUEADA - Corregir errores antes de continuar');
    } else {
      console.log('✅ VALIDACIÓN EXITOSA - Dashboard listo para migración');
    }

    console.log('='.repeat(60) + '\n');
  }

  /**
   * Validación global de componentes compartidos
   * Detecta imports incorrectos en src/shared/components/
   */
  async validateSharedComponents() {
    console.log('🌐 Validando componentes compartidos (src/shared/components/)...\n');
    
    const sharedComponentsPath = path.join(this.projectRoot, 'src', 'shared', 'components');
    if (!fs.existsSync(sharedComponentsPath)) {
      console.log('⚠️  Directorio src/shared/components/ no encontrado');
      return { errors: 0, warnings: 0 };
    }

    const files = this.getAllTsxFiles(sharedComponentsPath);
    const errors = [];
    const warnings = [];
    let totalIncorrect = 0;

    const incorrectPatterns = [
      {
        pattern: /from ['"]@\/components\/ui\//g,
        message: 'Import de @/components/ui/ debe ser @vibethink/ui',
        severity: 'error'
      },
      {
        pattern: /from ['"]@vibethink\/ui[a-z-]+['"]/g,
        message: 'Import específico de componente debe ser @vibethink/ui',
        severity: 'error'
      }
    ];

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(this.projectRoot, file);
      
      incorrectPatterns.forEach(({ pattern, message, severity }) => {
        const matches = content.match(pattern);
        if (matches) {
          totalIncorrect += matches.length;
          const issue = {
            file: relativePath,
            matches: [...new Set(matches)], // Unique matches
            message
          };
          
          if (severity === 'error') {
            errors.push(issue);
          } else {
            warnings.push(issue);
          }
        }
      });
    });

    if (errors.length > 0) {
      console.log('❌ ERRORES ENCONTRADOS:');
      errors.forEach(({ file, matches, message }) => {
        console.log(`  ${file}:`);
        matches.forEach(match => {
          console.log(`    - ${match} → ${message}`);
        });
      });
      console.log('');
    }

    if (warnings.length > 0) {
      console.log('⚠️  ADVERTENCIAS:');
      warnings.forEach(({ file, matches, message }) => {
        console.log(`  ${file}: ${message}`);
      });
      console.log('');
    }

    if (totalIncorrect === 0) {
      console.log('✅ No se encontraron imports incorrectos en componentes compartidos\n');
    } else {
      console.log(`📊 Total de imports incorrectos: ${totalIncorrect}\n`);
    }

    return { errors: errors.length, warnings: warnings.length, total: totalIncorrect };
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === '--global' || command === '-g') {
    // Validación global de componentes compartidos
    const guard = new DashboardMigrationGuard();
    guard.validateSharedComponents().then(({ errors, total }) => {
      process.exit(errors > 0 || total > 0 ? 1 : 0);
    });
  } else {
    // Validación de dashboard específico
    const guard = new DashboardMigrationGuard(command);
    guard.validate().then(success => {
      process.exit(success ? 0 : 1);
    });
  }
}

module.exports = DashboardMigrationGuard;

