#!/usr/bin/env node

/**
 * Script de Monitoreo Automático de Salud
 * Se ejecuta periódicamente para verificar todos los servicios
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  checkInterval: 30000, // 30 segundos
  timeout: 10000, // 10 segundos
  retryAttempts: 3,
  alertThresholds: {
    errorRate: 5, // 5%
    responseTime: 2000, // 2 segundos
    criticalServices: ['auth', 'payments', 'database', 'api_gateway']
  },
  notificationChannels: {
    email: process.env.ALERT_EMAIL,
    slack: process.env.SLACK_WEBHOOK_URL,
    webhook: process.env.ALERT_WEBHOOK_URL
  }
};

class HealthChecker {
  constructor() {
    this.healthHistory = [];
    this.lastAlertTime = new Map();
    this.alertCooldown = 300000; // 5 minutos
  }

  /**
   * Iniciar monitoreo continuo
   */
  start() {
    console.log('🔍 Iniciando monitoreo de salud...');
    console.log(`📡 Base URL: ${CONFIG.baseUrl}`);
    console.log(`⏱️  Intervalo: ${CONFIG.checkInterval}ms`);
    
    // Verificación inicial
    this.performHealthCheck();
    
    // Verificación periódica
    setInterval(() => {
      this.performHealthCheck();
    }, CONFIG.checkInterval);
  }

  /**
   * Realizar verificación de salud
   */
  async performHealthCheck() {
    const startTime = Date.now();
    
    try {
      console.log(`\n🔄 Verificación de salud - ${new Date().toLocaleString()}`);
      
      // Verificación básica
      const basicHealth = await this.checkBasicHealth();
      
      // Verificación detallada
      const detailedHealth = await this.checkDetailedHealth();
      
      // Verificación de servicios críticos
      const criticalHealth = await this.checkCriticalServices();
      
      // Análisis de resultados
      const analysis = this.analyzeHealthResults(basicHealth, detailedHealth, criticalHealth);
      
      // Registrar resultados
      this.recordHealthCheck(analysis);
      
      // Verificar alertas
      await this.checkAlerts(analysis);
      
      const duration = Date.now() - startTime;
      console.log(`✅ Verificación completada en ${duration}ms`);
      
    } catch (error) {
      console.error('❌ Error en verificación de salud:', error);
      await this.sendAlert('CRITICAL', 'Health check failed', { error: error.message });
    }
  }

  /**
   * Verificación básica de salud
   */
  async checkBasicHealth() {
    try {
      const response = await this.makeRequest('/api/monitoring/health');
      return {
        status: response.status,
        responseTime: response.responseTime,
        timestamp: new Date(),
        success: true
      };
    } catch (error) {
      return {
        status: 'error',
        responseTime: 0,
        timestamp: new Date(),
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificación detallada de salud
   */
  async checkDetailedHealth() {
    try {
      const response = await this.makeRequest('/api/monitoring/health?detailed=true');
      return {
        services: response.details?.services || [],
        systemMetrics: response.details?.systemMetrics || {},
        aiMetrics: response.details?.aiMetrics || {},
        timestamp: new Date(),
        success: true
      };
    } catch (error) {
      return {
        services: [],
        systemMetrics: {},
        aiMetrics: {},
        timestamp: new Date(),
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificación de servicios críticos
   */
  async checkCriticalServices() {
    const results = {};
    
    for (const service of CONFIG.alertThresholds.criticalServices) {
      try {
        const response = await this.makeRequest(`/api/monitoring/health?services=${service}&detailed=true`);
        results[service] = {
          status: response.details?.services?.[0]?.status || 'unknown',
          responseTime: response.details?.services?.[0]?.responseTime || 0,
          uptime: response.details?.services?.[0]?.uptime || 0,
          success: true
        };
      } catch (error) {
        results[service] = {
          status: 'error',
          responseTime: 0,
          uptime: 0,
          success: false,
          error: error.message
        };
      }
    }
    
    return results;
  }

  /**
   * Analizar resultados de salud
   */
  analyzeHealthResults(basicHealth, detailedHealth, criticalHealth) {
    const analysis = {
      timestamp: new Date(),
      overallStatus: 'healthy',
      issues: [],
      warnings: [],
      metrics: {
        totalServices: 0,
        healthyServices: 0,
        degradedServices: 0,
        unhealthyServices: 0,
        averageResponseTime: 0,
        errorRate: 0
      },
      criticalServices: criticalHealth
    };

    // Analizar servicios
    if (detailedHealth.success && detailedHealth.services) {
      analysis.metrics.totalServices = detailedHealth.services.length;
      analysis.metrics.healthyServices = detailedHealth.services.filter(s => s.status === 'healthy').length;
      analysis.metrics.degradedServices = detailedHealth.services.filter(s => s.status === 'degraded').length;
      analysis.metrics.unhealthyServices = detailedHealth.services.filter(s => s.status === 'unhealthy').length;
      
      // Calcular métricas promedio
      const responseTimes = detailedHealth.services.map(s => s.responseTime).filter(t => t > 0);
      analysis.metrics.averageResponseTime = responseTimes.length > 0 
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
        : 0;
    }

    // Analizar servicios críticos
    Object.entries(criticalHealth).forEach(([service, health]) => {
      if (!health.success || health.status === 'unhealthy') {
        analysis.issues.push(`Servicio crítico ${service} no disponible`);
        analysis.overallStatus = 'unhealthy';
      } else if (health.status === 'degraded') {
        analysis.warnings.push(`Servicio crítico ${service} degradado`);
        if (analysis.overallStatus === 'healthy') {
          analysis.overallStatus = 'degraded';
        }
      }
    });

    // Verificar umbrales
    if (analysis.metrics.averageResponseTime > CONFIG.alertThresholds.responseTime) {
      analysis.warnings.push(`Tiempo de respuesta alto: ${analysis.metrics.averageResponseTime}ms`);
    }

    if (analysis.metrics.unhealthyServices > 0) {
      analysis.issues.push(`${analysis.metrics.unhealthyServices} servicios no saludables`);
    }

    return analysis;
  }

  /**
   * Registrar verificación de salud
   */
  recordHealthCheck(analysis) {
    this.healthHistory.push(analysis);
    
    // Mantener solo últimas 100 verificaciones
    if (this.healthHistory.length > 100) {
      this.healthHistory = this.healthHistory.slice(-100);
    }

    // Guardar en archivo de log
    const logEntry = {
      timestamp: analysis.timestamp.toISOString(),
      status: analysis.overallStatus,
      issues: analysis.issues.length,
      warnings: analysis.warnings.length,
      metrics: analysis.metrics
    };

    const logFile = path.join(__dirname, '../logs/health-checks.json');
    const logs = this.loadLogs(logFile);
    logs.push(logEntry);
    
    // Mantener solo últimas 1000 entradas
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  }

  /**
   * Verificar alertas
   */
  async checkAlerts(analysis) {
    const alerts = [];

    // Alertas críticas
    if (analysis.overallStatus === 'unhealthy') {
      alerts.push({
        level: 'CRITICAL',
        message: 'Sistema no saludable',
        details: analysis.issues
      });
    }

    // Alertas de advertencia
    if (analysis.overallStatus === 'degraded') {
      alerts.push({
        level: 'WARNING',
        message: 'Sistema degradado',
        details: analysis.warnings
      });
    }

    // Alertas de servicios críticos
    Object.entries(analysis.criticalServices).forEach(([service, health]) => {
      if (!health.success || health.status === 'unhealthy') {
        alerts.push({
          level: 'CRITICAL',
          message: `Servicio crítico ${service} no disponible`,
          details: { service, health }
        });
      }
    });

    // Enviar alertas
    for (const alert of alerts) {
      await this.sendAlert(alert.level, alert.message, alert.details);
    }
  }

  /**
   * Enviar alerta
   */
  async sendAlert(level, message, details) {
    const alertKey = `${level}-${message}`;
    const now = Date.now();
    const lastAlert = this.lastAlertTime.get(alertKey) || 0;

    // Verificar cooldown
    if (now - lastAlert < this.alertCooldown) {
      return;
    }

    this.lastAlertTime.set(alertKey, now);

    const alert = {
      level,
      message,
      details,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };

    console.log(`🚨 ALERTA ${level}: ${message}`);

    // Enviar por diferentes canales
    await Promise.all([
      this.sendEmailAlert(alert),
      this.sendSlackAlert(alert),
      this.sendWebhookAlert(alert)
    ]);
  }

  /**
   * Enviar alerta por email
   */
  async sendEmailAlert(alert) {
    if (!CONFIG.notificationChannels.email) return;

    // Implementar envío de email
    console.log(`📧 Email alert sent to ${CONFIG.notificationChannels.email}`);
  }

  /**
   * Enviar alerta por Slack
   */
  async sendSlackAlert(alert) {
    if (!CONFIG.notificationChannels.slack) return;

    try {
      const message = {
        text: `🚨 *${alert.level}*: ${alert.message}`,
        attachments: [{
          fields: [
            {
              title: 'Detalles',
              value: JSON.stringify(alert.details, null, 2),
              short: false
            },
            {
              title: 'Timestamp',
              value: alert.timestamp,
              short: true
            },
            {
              title: 'Environment',
              value: alert.environment,
              short: true
            }
          ]
        }]
      };

      await this.makeRequest(CONFIG.notificationChannels.slack, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });

      console.log('💬 Slack alert sent');
    } catch (error) {
      console.error('Error sending Slack alert:', error);
    }
  }

  /**
   * Enviar alerta por webhook
   */
  async sendWebhookAlert(alert) {
    if (!CONFIG.notificationChannels.webhook) return;

    try {
      await this.makeRequest(CONFIG.notificationChannels.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });

      console.log('🔗 Webhook alert sent');
    } catch (error) {
      console.error('Error sending webhook alert:', error);
    }
  }

  /**
   * Realizar request HTTP
   */
  async makeRequest(path, options = {}) {
    const url = path.startsWith('http') ? path : `${CONFIG.baseUrl}${path}`;
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
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
          
          try {
            const jsonData = JSON.parse(data);
            resolve({
              ...jsonData,
              responseTime,
              statusCode: res.statusCode
            });
          } catch (error) {
            resolve({
              data,
              responseTime,
              statusCode: res.statusCode
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  }

  /**
   * Cargar logs existentes
   */
  loadLogs(logFile) {
    try {
      if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
    return [];
  }

  /**
   * Obtener estadísticas de salud
   */
  getHealthStats() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    const oneDayAgo = now - 86400000;

    const recentChecks = this.healthHistory.filter(h => h.timestamp.getTime() > oneHourAgo);
    const dailyChecks = this.healthHistory.filter(h => h.timestamp.getTime() > oneDayAgo);

    return {
      recent: {
        total: recentChecks.length,
        healthy: recentChecks.filter(h => h.overallStatus === 'healthy').length,
        degraded: recentChecks.filter(h => h.overallStatus === 'degraded').length,
        unhealthy: recentChecks.filter(h => h.overallStatus === 'unhealthy').length
      },
      daily: {
        total: dailyChecks.length,
        healthy: dailyChecks.filter(h => h.overallStatus === 'healthy').length,
        degraded: dailyChecks.filter(h => h.overallStatus === 'degraded').length,
        unhealthy: dailyChecks.filter(h => h.overallStatus === 'unhealthy').length
      }
    };
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  const checker = new HealthChecker();
  checker.start();

  // Manejar señales de terminación
  process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo monitoreo...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Deteniendo monitoreo...');
    process.exit(0);
  });
}

module.exports = HealthChecker; 