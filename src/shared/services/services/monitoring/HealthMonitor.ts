/**
 * Sistema de Monitoreo de Salud de Servicios
 * Monitoreo inteligente de todos los componentes de la plataforma
 */

import { logger } from '../logging/LoggingService';
import { LogCategory, LogLevel } from '../logging/LoggingService';

export enum ServiceStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  UNKNOWN = 'unknown'
}

export interface ServiceHealth {
  service: string;
  status: ServiceStatus;
  timestamp: Date;
  responseTime: number;
  errorRate: number;
  uptime: number;
  lastCheck: Date;
  details?: any;
  dependencies?: string[];
}

export interface HealthCheck {
  name: string;
  service: string;
  check: () => Promise<boolean>;
  timeout: number;
  interval: number;
  critical: boolean;
}

export class HealthMonitor {
  private static instance: HealthMonitor;
  private healthChecks: Map<string, HealthCheck> = new Map();
  private serviceHealth: Map<string, ServiceHealth> = new Map();
  private checkIntervals: Map<string, NodeJS.Timeout> = new Map();
  private alertCallbacks: Array<(service: string, status: ServiceStatus) => void> = [];

  private constructor() {
    this.initializeDefaultChecks();
  }

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  /**
   * Inicializar checks por defecto
   */
  private initializeDefaultChecks(): void {
    // Auth Service
    this.addHealthCheck({
      name: 'auth-service',
      service: 'auth',
      check: this.checkAuthService.bind(this),
      timeout: 5000,
      interval: 30000,
      critical: true
    });

    // Payment Service
    this.addHealthCheck({
      name: 'payment-service',
      service: 'payments',
      check: this.checkPaymentService.bind(this),
      timeout: 10000,
      interval: 60000,
      critical: true
    });

    // Database
    this.addHealthCheck({
      name: 'database',
      service: 'database',
      check: this.checkDatabase.bind(this),
      timeout: 5000,
      interval: 30000,
      critical: true
    });

    // AI Providers
    this.addHealthCheck({
      name: 'ai-providers',
      service: 'ai_providers',
      check: this.checkAIProviders.bind(this),
      timeout: 15000,
      interval: 60000,
      critical: false
    });

    // API Gateway
    this.addHealthCheck({
      name: 'api-gateway',
      service: 'api_gateway',
      check: this.checkAPIGateway.bind(this),
      timeout: 5000,
      interval: 30000,
      critical: true
    });

    // CRM Service
    this.addHealthCheck({
      name: 'crm-service',
      service: 'crm',
      check: this.checkCRMService.bind(this),
      timeout: 10000,
      interval: 60000,
      critical: false
    });

    // Help Desk Service
    this.addHealthCheck({
      name: 'helpdesk-service',
      service: 'help_desk',
      check: this.checkHelpDeskService.bind(this),
      timeout: 10000,
      interval: 60000,
      critical: false
    });

    // Recruiting Service
    this.addHealthCheck({
      name: 'recruiting-service',
      service: 'recruiting',
      check: this.checkRecruitingService.bind(this),
      timeout: 10000,
      interval: 60000,
      critical: false
    });
  }

  /**
   * Agregar health check personalizado
   */
  addHealthCheck(check: HealthCheck): void {
    this.healthChecks.set(check.name, check);
    this.startHealthCheck(check);
  }

  /**
   * Iniciar health check
   */
  private startHealthCheck(check: HealthCheck): void {
    const interval = setInterval(async () => {
      await this.runHealthCheck(check);
    }, check.interval);

    this.checkIntervals.set(check.name, interval);
    
    // Ejecutar check inicial
    this.runHealthCheck(check);
  }

  /**
   * Ejecutar health check individual
   */
  private async runHealthCheck(check: HealthCheck): Promise<void> {
    const startTime = Date.now();
    let success = false;
    let error: string | null = null;

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), check.timeout);
      });

      success = await Promise.race([
        check.check(),
        timeoutPromise
      ]);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
      success = false;
    }

    const responseTime = Date.now() - startTime;
    const status = this.determineStatus(success, responseTime, check.timeout);

    // Actualizar estado del servicio
    const health: ServiceHealth = {
      service: check.service,
      status,
      timestamp: new Date(),
      responseTime,
      errorRate: success ? 0 : 100,
      uptime: this.calculateUptime(check.service, success),
      lastCheck: new Date(),
      details: {
        error,
        timeout: check.timeout,
        critical: check.critical
      }
    };

    this.serviceHealth.set(check.service, health);

    // Log del resultado
    if (success) {
      logger.info(LogCategory.INFRASTRUCTURE, 'health-monitor', 
        `Health check passed: ${check.name}`, { responseTime });
    } else {
      logger.error(LogCategory.INFRASTRUCTURE, 'health-monitor', 
        `Health check failed: ${check.name}`, { error, responseTime });
    }

    // Alertar si es crítico y falló
    if (check.critical && !success) {
      this.triggerAlert(check.service, status);
    }
  }

  /**
   * Determinar estado basado en resultado y tiempo de respuesta
   */
  private determineStatus(success: boolean, responseTime: number, timeout: number): ServiceStatus {
    if (!success) return ServiceStatus.UNHEALTHY;
    
    const responseTimeRatio = responseTime / timeout;
    if (responseTimeRatio > 0.8) return ServiceStatus.DEGRADED;
    if (responseTimeRatio > 0.5) return ServiceStatus.DEGRADED;
    
    return ServiceStatus.HEALTHY;
  }

  /**
   * Calcular uptime del servicio
   */
  private calculateUptime(service: string, currentSuccess: boolean): number {
    const current = this.serviceHealth.get(service);
    if (!current) return currentSuccess ? 100 : 0;

    // Implementar cálculo de uptime basado en historial
    return currentSuccess ? Math.min(100, current.uptime + 1) : Math.max(0, current.uptime - 5);
  }

  /**
   * Obtener estado de todos los servicios
   */
  getAllServicesHealth(): ServiceHealth[] {
    return Array.from(this.serviceHealth.values());
  }

  /**
   * Obtener estado de un servicio específico
   */
  getServiceHealth(service: string): ServiceHealth | undefined {
    return this.serviceHealth.get(service);
  }

  /**
   * Obtener resumen de salud general
   */
  getOverallHealth(): {
    status: ServiceStatus;
    healthyServices: number;
    totalServices: number;
    criticalIssues: number;
    degradedServices: string[];
    unhealthyServices: string[];
  } {
    const services = this.getAllServicesHealth();
    const criticalChecks = Array.from(this.healthChecks.values()).filter(c => c.critical);
    
    const healthyServices = services.filter(s => s.status === ServiceStatus.HEALTHY).length;
    const degradedServices = services.filter(s => s.status === ServiceStatus.DEGRADED);
    const unhealthyServices = services.filter(s => s.status === ServiceStatus.UNHEALTHY);
    
    const criticalIssues = criticalChecks.filter(check => {
      const health = this.serviceHealth.get(check.service);
      return health && health.status !== ServiceStatus.HEALTHY;
    }).length;

    let overallStatus = ServiceStatus.HEALTHY;
    if (criticalIssues > 0) overallStatus = ServiceStatus.UNHEALTHY;
    else if (degradedServices.length > 0) overallStatus = ServiceStatus.DEGRADED;

    return {
      status: overallStatus,
      healthyServices,
      totalServices: services.length,
      criticalIssues,
      degradedServices: degradedServices.map(s => s.service),
      unhealthyServices: unhealthyServices.map(s => s.service)
    };
  }

  /**
   * Registrar callback para alertas
   */
  onAlert(callback: (service: string, status: ServiceStatus) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Disparar alerta
   */
  private triggerAlert(service: string, status: ServiceStatus): void {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(service, status);
      } catch (error) {
        logger.error(LogCategory.INFRASTRUCTURE, 'health-monitor', 
          'Error in alert callback', { error, service, status });
      }
    });
  }

  /**
   * Health Checks específicos por servicio
   */
  private async checkAuthService(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkPaymentService(): Promise<boolean> {
    try {
      const response = await fetch('/api/payments/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      // Verificar conexión a base de datos
      const response = await fetch('/api/health/database', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkAIProviders(): Promise<boolean> {
    try {
      // Verificar al menos un proveedor de IA disponible
      const response = await fetch('/api/health/ai-providers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return data.availableProviders > 0;
    } catch {
      return false;
    }
  }

  private async checkAPIGateway(): Promise<boolean> {
    try {
      const response = await fetch('/api/health/gateway', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkCRMService(): Promise<boolean> {
    try {
      const response = await fetch('/api/crm/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkHelpDeskService(): Promise<boolean> {
    try {
      const response = await fetch('/api/helpdesk/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkRecruitingService(): Promise<boolean> {
    try {
      const response = await fetch('/api/recruiting/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.checkIntervals.forEach(interval => clearInterval(interval));
    this.checkIntervals.clear();
  }
}

// Exportar instancia singleton
export const healthMonitor = HealthMonitor.getInstance(); 