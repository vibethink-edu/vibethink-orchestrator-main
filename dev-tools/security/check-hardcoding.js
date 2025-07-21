#!/usr/bin/env node

/**
 * Script de Detección de Hardcoding - AI Pair Orchestrator Pro
 * 
 * Este script detecta automáticamente violaciones de hardcoding en el código
 * y las clasifica por criticidad (crítica, alta, media, baja).
 * 
 * Uso:
 *   node scripts/check-hardcoding.js [directorio]
 * 
 * Ejemplo:
 *   node scripts/check-hardcoding.js ./src
 *   npm run check-hardcoding
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HardcodingDetector {
  constructor() {
    this.violations = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };
    
    // Patrones de detección organizados por criticidad
    this.patterns = {
      // CRÍTICO - Bloquea commit
      credentials: [
        /api[_-]?key\s*[:=]\s*["'][^"']+["']/gi,
        /password\s*[:=]\s*["'][^"']+["']/gi,
        /secret\s*[:=]\s*["'][^"']+["']/gi,
        /token\s*[:=]\s*["'][^"']+["']/gi,
        /auth[_-]?key\s*[:=]\s*["'][^"']+["']/gi,
        /private[_-]?key\s*[:=]\s*["'][^"']+["']/gi,
        /access[_-]?key\s*[:=]\s*["'][^"']+["']/gi
      ],
      
      // ALTO - Alerta inmediata
      urls: [
        /https?:\/\/[^\s"']+/g,
        /localhost:\d+/g,
        /127\.0\.0\.1:\d+/g,
        /api\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
      ],
      
      // MEDIO - Advertencia
      specificEntities: [
        'colombia', 'usa', 'mexico', 'spain', 'argentina', 'brazil', 'chile',
        'fedex', 'dhl', 'ups', 'servientrega', 'interrapidisimo',
        'admin', 'manager', 'employee', 'owner', 'super_admin',
        'production', 'development', 'staging', 'test',
        'mysql', 'postgresql', 'mongodb', 'redis'
      ],
      
      // MEDIO - Configuraciones hardcodeadas
      hardcodedConfig: [
        /is[_-]?production\s*[:=]\s*(true|false)/gi,
        /debug[_-]?mode\s*[:=]\s*(true|false)/gi,
        /log[_-]?level\s*[:=]\s*["'][^"']+["']/gi,
        /port\s*[:=]\s*\d+/g,
        /host\s*[:=]\s*["'][^"']+["']/gi,
        /database\s*[:=]\s*["'][^"']+["']/gi
      ],
      
      // MEDIO - Límites de negocio hardcodeados
      businessLimits: [
        /max[_-]?file[_-]?size\s*[:=]\s*\d+/gi,
        /max[_-]?uploads\s*[:=]\s*\d+/gi,
        /session[_-]?timeout\s*[:=]\s*\d+/gi,
        /rate[_-]?limit\s*[:=]\s*\d+/gi,
        /timeout\s*[:=]\s*\d+/gi
      ],
      
      // BAJO - Textos hardcodeados
      hardcodedText: [
        /"El email no es válido"/g,
        /"La contraseña es requerida"/g,
        /"Error interno del servidor"/g,
        /"Usuario no encontrado"/g,
        /"Acceso denegado"/g
      ],
      
      // BAJO - Datos de prueba hardcodeados
      testData: [
        /"john@example\.com"/g,
        /"admin@test\.com"/g,
        /"123456789"/g,
        /"test123"/g,
        /"John Doe"/g,
        /"Jane Smith"/g
      ]
    };
  }

  /**
   * Escanea un archivo en busca de violaciones de hardcoding
   */
  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        this.checkLine(line, filePath, index + 1);
      });
    } catch (error) {
      // TODO: log `⚠️  No se pudo leer el archivo: ${filePath}`
    }
  }

  /**
   * Verifica una línea específica en busca de violaciones
   */
  checkLine(line, filePath, lineNumber) {
    // Ignorar comentarios y líneas vacías
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim() === '') {
      return;
    }

    // Verificar credenciales (CRÍTICO)
    this.patterns.credentials.forEach(pattern => {
      if (pattern.test(line)) {
        this.violations.critical.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          type: 'CREDENTIALS',
          message: 'Credenciales hardcodeadas detectadas',
          suggestion: 'Usa variables de entorno (process.env)'
        });
      }
    });

    // Verificar URLs (ALTO)
    this.patterns.urls.forEach(pattern => {
      if (pattern.test(line)) {
        this.violations.high.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          type: 'URLS',
          message: 'URLs hardcodeadas detectadas',
          suggestion: 'Usa variables de entorno para configuraciones'
        });
      }
    });

    // Verificar entidades específicas (MEDIO)
    this.patterns.specificEntities.forEach(entity => {
      const regex = new RegExp(`\\b${entity}\\b`, 'gi');
      if (regex.test(line)) {
        this.violations.medium.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          type: 'SPECIFIC_ENTITY',
          message: `Entidad específica "${entity}" detectada`,
          suggestion: 'Usa nombres paramétricos y configuración dinámica'
        });
      }
    });

    // Verificar configuraciones hardcodeadas (MEDIO)
    this.patterns.hardcodedConfig.forEach(pattern => {
      if (pattern.test(line)) {
        this.violations.medium.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          type: 'HARDCODED_CONFIG',
          message: 'Configuración hardcodeada detectada',
          suggestion: 'Usa variables de entorno o configuración paramétrica'
        });
      }
    });

    // Verificar límites de negocio (MEDIO)
    this.patterns.businessLimits.forEach(pattern => {
      if (pattern.test(line)) {
        this.violations.medium.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          type: 'BUSINESS_LIMITS',
          message: 'Límites de negocio hardcodeados detectados',
          suggestion: 'Usa configuración paramétrica por país/industria'
        });
      }
    });

    // Verificar textos hardcodeados (BAJO)
    this.patterns.hardcodedText.forEach(pattern => {
      if (pattern.test(line)) {
        this.violations.low.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          type: 'HARDCODED_TEXT',
          message: 'Texto hardcodeado detectado',
          suggestion: 'Usa sistema de internacionalización (i18n)'
        });
      }
    });

    // Verificar datos de prueba (BAJO)
    this.patterns.testData.forEach(pattern => {
      if (pattern.test(line)) {
        this.violations.low.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          type: 'TEST_DATA',
          message: 'Datos de prueba hardcodeados detectados',
          suggestion: 'Usa generadores de datos de prueba'
        });
      }
    });
  }

  /**
   * Escanea un directorio completo
   */
  async scanDirectory(dir) {
    // TODO: log `🔍 Escaneando directorio: ${dir}`
    
    const files = await this.getFiles(dir);
    // TODO: log `📁 Encontrados ${files.length} archivos para escanear`
    
    for (const file of files) {
      if (this.shouldScanFile(file)) {
        await this.scanFile(file);
      }
    }
  }

  /**
   * Determina si un archivo debe ser escaneado
   */
  shouldScanFile(filePath) {
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.env.example'];
    const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
    const excludeFiles = ['package-lock.json', 'yarn.lock', '.env.local'];
    
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath);
    const shouldExclude = excludeDirs.some(dir => filePath.includes(dir)) ||
                         excludeFiles.includes(fileName);
    
    return extensions.includes(ext) && !shouldExclude;
  }

  /**
   * Obtiene todos los archivos de un directorio recursivamente
   */
  async getFiles(dir) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...await this.getFiles(fullPath));
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // TODO: log `⚠️  No se pudo acceder al directorio: ${dir}`
    }
    
    return files;
  }

  /**
   * Genera el reporte completo de violaciones
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        critical: this.violations.critical.length,
        high: this.violations.high.length,
        medium: this.violations.medium.length,
        low: this.violations.low.length,
        total: this.violations.critical.length + this.violations.high.length + 
               this.violations.medium.length + this.violations.low.length
      },
      violations: this.violations,
      recommendations: this.generateRecommendations(),
      metadata: {
        version: '1.0.0',
        tool: 'AI Pair Hardcoding Detector'
      }
    };

    return report;
  }

  /**
   * Genera recomendaciones basadas en las violaciones encontradas
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.violations.critical.length > 0) {
      recommendations.push({
        priority: 'CRÍTICA',
        message: '🚨 BLOQUEA COMMIT - Corrige credenciales hardcodeadas inmediatamente',
        action: 'Usa variables de entorno para todas las credenciales',
        examples: [
          '❌ const API_KEY = "sk-123...";',
          '✅ const API_KEY = process.env.REACT_APP_API_KEY;'
        ]
      });
    }

    if (this.violations.high.length > 0) {
      recommendations.push({
        priority: 'ALTA',
        message: '⚠️ ALERTA INMEDIATA - Corrige URLs hardcodeadas',
        action: 'Usa variables de entorno para configuraciones',
        examples: [
          '❌ const API_URL = "https://api.example.com";',
          '✅ const API_URL = process.env.REACT_APP_API_URL;'
        ]
      });
    }

    if (this.violations.medium.length > 0) {
      recommendations.push({
        priority: 'MEDIA',
        message: '📝 ADVERTENCIA - Considera parametrizar entidades específicas',
        action: 'Usa nombres paramétricos y configuración dinámica',
        examples: [
          '❌ const colombia = "CO";',
          '✅ const currentCountry = getCountryCode();'
        ]
      });
    }

    if (this.violations.low.length > 0) {
      recommendations.push({
        priority: 'BAJA',
        message: '💡 SUGERENCIA - Mejora la internacionalización',
        action: 'Usa sistema de traducciones y generadores de datos',
        examples: [
          '❌ const message = "Error interno";',
          '✅ const message = t("errors.internal");'
        ]
      });
    }

    return recommendations;
  }

  /**
   * Guarda el reporte en un archivo JSON
   */
  saveReport(report, outputPath = 'hardcoding-report.json') {
    try {
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
      // TODO: log `📄 Reporte guardado en: ${outputPath}`
    } catch (error) {
      // TODO: log `❌ Error al guardar el reporte: ${error.message}`
    }
  }

  /**
   * Muestra el reporte en consola
   */
  displayReport(report) {
    // TODO: log '\n🔍 REPORTE DE DETECCIÓN DE HARDCODING'
    // TODO: log '====================================='
    // TODO: log `📊 Resumen:`
    // TODO: log `   Críticas: ${report.summary.critical} 🚨`
    // TODO: log `   Altas: ${report.summary.high} ⚠️`
    // TODO: log `   Medias: ${report.summary.medium} 📝`
    // TODO: log `   Bajas: ${report.summary.low} 💡`
    // TODO: log `   Total: ${report.summary.total}`
    
    // Mostrar violaciones críticas (bloquean commit)
    if (report.violations.critical.length > 0) {
      // TODO: log '\n❌ VIOLACIONES CRÍTICAS (BLOQUEAN COMMIT):'
      report.violations.critical.forEach((v, index) => {
        // TODO: log `   ${index + 1}. ${v.file}:${v.line}`
        // TODO: log `      Tipo: ${v.type}`
        // TODO: log `      Mensaje: ${v.message}`
        // TODO: log `      Código: ${v.code}`
        // TODO: log `      Sugerencia: ${v.suggestion}`
        // TODO: log ``
      });
    }
    
    // Mostrar violaciones altas
    if (report.violations.high.length > 0) {
      // TODO: log '\n⚠️  VIOLACIONES ALTAS:'
      report.violations.high.forEach((v, index) => {
        // TODO: log `   ${index + 1}. ${v.file}:${v.line} - ${v.message}`
      });
    }
    
    // Mostrar violaciones medias
    if (report.violations.medium.length > 0) {
      // TODO: log '\n📝 VIOLACIONES MEDIAS:'
      report.violations.medium.forEach((v, index) => {
        // TODO: log `   ${index + 1}. ${v.file}:${v.line} - ${v.message}`
      });
    }
    
    // Mostrar recomendaciones
    if (report.recommendations.length > 0) {
      // TODO: log '\n💡 RECOMENDACIONES:'
      report.recommendations.forEach((r, index) => {
        // TODO: log `   ${index + 1}. ${r.priority}: ${r.message}`
        // TODO: log `      Acción: ${r.action}`
        if (r.examples) {
          r.examples.forEach(example => {
            // TODO: log `      ${example}`
            // TODO: log ``
          });
        }
      });
    }
    
    // Mostrar resultado final
    if (report.summary.critical > 0) {
      // TODO: log '🚨 RESULTADO: COMMIT BLOQUEADO - Corrige las violaciones críticas'
      return false; // Indica que hay violaciones críticas
    } else if (report.summary.high > 0) {
      // TODO: log '⚠️  RESULTADO: ADVERTENCIAS - Considera corregir las violaciones altas'
      return true; // Permite commit pero con advertencias
    } else {
      // TODO: log '✅ RESULTADO: SIN VIOLACIONES CRÍTICAS - Commit permitido'
      return true; // Permite commit
    }
  }
}

/**
 * Función principal del script
 */
async function main() {
  const args = process.argv.slice(2);
  const targetDir = args[0] || './src';
  
  // TODO: log '🔍 AI Pair Hardcoding Detector v1.0.0'
  // TODO: log '====================================='
  
  const detector = new HardcodingDetector();
  
  try {
    await detector.scanDirectory(targetDir);
    
    const report = detector.generateReport();
    
    // Guardar reporte en archivo
    detector.saveReport(report);
    
    // Mostrar reporte en consola
    const canCommit = detector.displayReport(report);
    
    // Salir con código de error si hay violaciones críticas
    if (!canCommit) {
      process.exit(1);
    }
    
  } catch (error) {
    // TODO: log '❌ Error durante la detección:' error.message
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default HardcodingDetector; 