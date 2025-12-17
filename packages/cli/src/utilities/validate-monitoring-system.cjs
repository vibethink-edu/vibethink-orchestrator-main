#!/usr/bin/env node

/**
 * Script de Validación del Sistema de Monitoreo
 * Verifica que todos los componentes estén funcionando correctamente
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuración
const CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  requiredFiles: [
    'src/services/logging/LoggingService.ts',
    'src/services/monitoring/HealthMonitor.ts',
    'src/services/analytics/MetricsCollector.ts',
    'src/components/admin/IntelligentControlDashboard.tsx',
    'src/pages/api/monitoring/health.ts',
    'scripts/monitoring/health-checker.js',
    'docs/MONITORING_SYSTEM_GUIDE.md',
    'docs/QUICK_REFERENCE_GUIDE.md'
  ],
  requiredEndpoints: [
    '/api/monitoring/health',
    '/api/monitoring/health?detailed=true',
    '/api/monitoring/metrics',
    '/api/monitoring/logs'
  ],
  requiredServices: [
    'auth',
    'payments',
    'database',
    'api_gateway',
    'ai_providers',
    'crm',
    'help_desk',
    'recruiting'
  ]
};

class MonitoringSystemValidator {
  constructor() {
    this.results = {
      files: { passed: 0, failed: 0, details: [] },
      endpoints: { passed: 0, failed: 0, details: [] },
      services: { passed: 0, failed: 0, details: [] },
      configuration: { passed: 0, failed: 0, details: [] },
      overall: { passed: 0, total: 0 }
    };
  }

  /**
   * Ejecutar todas las validaciones
   */
  async validate() {
    console.log('🔍 Validando Sistema de Monitoreo...\n');

    await this.validateFiles();
    await this.validateEndpoints();
    await this.validateServices();
    await this.validateConfiguration();

    this.calculateOverallResults();
    this.printResults();
    
    return this.results.overall.passed === this.results.overall.total;
  }

  /**
   * Validar archivos requeridos
   */
  async validateFiles() {
    console.log('📁 Validando archivos del sistema...');
    
    for (const file of CONFIG.requiredFiles) {
      this.results.overall.total++;
      
      if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
        this.results.files.passed++;
        this.results.files.details.push({ file, status: 'exists' });
      } else {
        console.log(`  ❌ ${file} - NO ENCONTRADO`);
        this.results.files.failed++;
        this.results.files.details.push({ file, status: 'missing' });
      }
    }
  }

  /**
   * Validar endpoints de API
   */
  async validateEndpoints() {
    console.log('\n🔌 Validando endpoints de API...');
    
    for (const endpoint of CONFIG.requiredEndpoints) {
      this.results.overall.total++;
      
      try {
        const response = await this.makeRequest(endpoint);
        
        if (response.statusCode === 200) {
          console.log(`  ✅ ${endpoint}`);
          this.results.endpoints.passed++;
          this.results.endpoints.details.push({ 
            endpoint, 
            status: 'working', 
            responseTime: response.responseTime 
          });
        } else {
          console.log(`  ❌ ${endpoint} - HTTP ${response.statusCode}`);
          this.results.endpoints.failed++;
          this.results.endpoints.details.push({ 
            endpoint, 
            status: 'error', 
            statusCode: response.statusCode 
          });
        }
      } catch (error) {
        console.log(`  ❌ ${endpoint} - ERROR: ${error.message}`);
        this.results.endpoints.failed++;
        this.results.endpoints.details.push({ 
          endpoint, 
          status: 'error', 
          error: error.message 
        });
      }
    }
  }

  /**
   * Validar servicios monitoreados
   */
  async validateServices() {
    console.log('\n🔍 Validando servicios monitoreados...');
    
    try {
      const response = await this.makeRequest('/api/monitoring/health?detailed=true');
      
      if (response.statusCode === 200) {
        const data = JSON.parse(response.data);
        const services = data.details?.services || [];
        
        for (const service of CONFIG.requiredServices) {
          this.results.overall.total++;
          
          const serviceData = services.find(s => s.service === service);
          
          if (serviceData) {
            console.log(`  ✅ ${service} - ${serviceData.status}`);
            this.results.services.passed++;
            this.results.services.details.push({ 
              service, 
              status: serviceData.status,
              responseTime: serviceData.responseTime 
            });
          } else {
            console.log(`  ❌ ${service} - NO MONITOREADO`);
            this.results.services.failed++;
            this.results.services.details.push({ 
              service, 
              status: 'not_monitored' 
            });
          }
        }
      } else {
        console.log('  ❌ No se pudo obtener datos de servicios');
        this.results.services.failed += CONFIG.requiredServices.length;
        this.results.overall.total += CONFIG.requiredServices.length;
      }
    } catch (error) {
      console.log(`  ❌ Error validando servicios: ${error.message}`);
      this.results.services.failed += CONFIG.requiredServices.length;
      this.results.overall.total += CONFIG.requiredServices.length;
    }
  }

  /**
   * Validar configuración
   */
  async validateConfiguration() {
    console.log('\n⚙️ Validando configuración...');
    
    const configChecks = [
      { name: 'API_BASE_URL', value: process.env.API_BASE_URL, required: false },
      { name: 'ALERT_EMAIL', value: process.env.ALERT_EMAIL, required: false },
      { name: 'SLACK_WEBHOOK_URL', value: process.env.SLACK_WEBHOOK_URL, required: false },
      { name: 'HEALTH_CHECK_INTERVAL', value: process.env.HEALTH_CHECK_INTERVAL, required: false },
      { name: 'LOG_LEVEL', value: process.env.LOG_LEVEL, required: false }
    ];

    for (const check of configChecks) {
      this.results.overall.total++;
      
      if (check.value) {
        console.log(`  ✅ ${check.name} configurado`);
        this.results.configuration.passed++;
        this.results.configuration.details.push({ 
          config: check.name, 
          status: 'configured' 
        });
      } else if (check.required) {
        console.log(`  ❌ ${check.name} NO CONFIGURADO (requerido)`);
        this.results.configuration.failed++;
        this.results.configuration.details.push({ 
          config: check.name, 
          status: 'missing_required' 
        });
      } else {
        console.log(`  ⚠️ ${check.name} no configurado (opcional)`);
        this.results.configuration.passed++;
        this.results.configuration.details.push({ 
          config: check.name, 
          status: 'not_configured_optional' 
        });
      }
    }

    // Verificar archivo .env
    this.results.overall.total++;
    if (fs.existsSync('.env')) {
      console.log('  ✅ Archivo .env encontrado');
      this.results.configuration.passed++;
      this.results.configuration.details.push({ 
        config: '.env', 
        status: 'exists' 
      });
    } else {
      console.log('  ⚠️ Archivo .env no encontrado');
      this.results.configuration.passed++;
      this.results.configuration.details.push({ 
        config: '.env', 
        status: 'missing' 
      });
    }
  }

  /**
   * Calcular resultados generales
   */
  calculateOverallResults() {
    this.results.overall.passed = 
      this.results.files.passed +
      this.results.endpoints.passed +
      this.results.services.passed +
      this.results.configuration.passed;
  }

  /**
   * Imprimir resultados
   */
  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 RESULTADOS DE VALIDACIÓN DEL SISTEMA DE MONITOREO');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Pruebas pasadas: ${this.results.overall.passed}/${this.results.overall.total}`);
    
    console.log('\n📁 Archivos:');
    console.log(`  ✅ Pasados: ${this.results.files.passed}`);
    console.log(`  ❌ Fallidos: ${this.results.files.failed}`);
    
    console.log('\n🔌 Endpoints:');
    console.log(`  ✅ Pasados: ${this.results.endpoints.passed}`);
    console.log(`  ❌ Fallidos: ${this.results.endpoints.failed}`);
    
    console.log('\n🔍 Servicios:');
    console.log(`  ✅ Pasados: ${this.results.services.passed}`);
    console.log(`  ❌ Fallidos: ${this.results.services.failed}`);
    
    console.log('\n⚙️ Configuración:');
    console.log(`  ✅ Pasados: ${this.results.configuration.passed}`);
    console.log(`  ❌ Fallidos: ${this.results.configuration.failed}`);
    
    if (this.results.overall.passed === this.results.overall.total) {
      console.log('\n🎉 ¡Sistema de monitoreo validado exitosamente!');
      console.log('✅ Todos los componentes están funcionando correctamente');
      console.log('✅ El sistema está listo para agentes humanos y agentes IA');
    } else {
      console.log('\n❌ El sistema de monitoreo tiene problemas');
      console.log('🔧 Revisa los errores y corrige los problemas antes de continuar');
      
      // Mostrar detalles de errores
      this.printErrorDetails();
    }
  }

  /**
   * Imprimir detalles de errores
   */
  printErrorDetails() {
    console.log('\n🔍 DETALLES DE ERRORES:');
    
    if (this.results.files.failed > 0) {
      console.log('\n📁 Archivos faltantes:');
      this.results.files.details
        .filter(d => d.status === 'missing')
        .forEach(d => console.log(`  • ${d.file}`));
    }
    
    if (this.results.endpoints.failed > 0) {
      console.log('\n🔌 Endpoints con problemas:');
      this.results.endpoints.details
        .filter(d => d.status === 'error')
        .forEach(d => console.log(`  • ${d.endpoint}: ${d.error || `HTTP ${d.statusCode}`}`));
    }
    
    if (this.results.services.failed > 0) {
      console.log('\n🔍 Servicios no monitoreados:');
      this.results.services.details
        .filter(d => d.status === 'not_monitored')
        .forEach(d => console.log(`  • ${d.service}`));
    }
    
    if (this.results.configuration.failed > 0) {
      console.log('\n⚙️ Configuración faltante:');
      this.results.configuration.details
        .filter(d => d.status === 'missing_required')
        .forEach(d => console.log(`  • ${d.config}`));
    }
  }

  /**
   * Realizar request HTTP
   */
  async makeRequest(path) {
    const url = path.startsWith('http') ? path : `${CONFIG.baseUrl}${path}`;
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: CONFIG.timeout
    };

    return new Promise((resolve, reject) => {
      const client = urlObj.protocol === 'https:' ? https : http;
      const startTime = Date.now();

      const req = client.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          
          resolve({
            statusCode: res.statusCode,
            data,
            responseTime
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }
}

// Ejecutar validación
async function main() {
  const validator = new MonitoringSystemValidator();
  const success = await validator.validate();
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = MonitoringSystemValidator; 