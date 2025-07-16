/**
 * Sistema de Monitoreo para Proveedores de IA
 * Detecta problemas de performance y dispare migraciones automáticas
 */

import { AIProviderManager } from './AbstractAIProvider';

export interface MonitoringConfig {
  performanceThresholds: {
    maxLatency: number; // ms
    maxErrorRate: number; // porcentaje
    maxDowntime: number; // segundos
  };
  alertChannels: {
    email?: string;
    slack?: string;
    webhook?: string;
  };
  autoMigration: {
    enabled: boolean;
    cooldownPeriod: number; // segundos
    maxMigrationsPerHour: number;
  };
}

export interface PerformanceMetrics {
  provider: string;
  timestamp: Date;
  latency: number;
  errorRate: number;
  availability: number;
  costPerRequest: number;
  totalRequests: number;
}

export class AIProviderMonitor {
  private metrics: PerformanceMetrics[] = [];
  private lastMigrationTime: Date | null = null;
  private migrationsThisHour = 0;
  private lastHourReset = new Date();

  constructor(
    private providerManager: AIProviderManager,
    private config: MonitoringConfig
  ) {
    this.startMonitoring();
  }

  /**
   * Inicia el monitoreo continuo
   */
  private startMonitoring(): void {
    // Monitoreo cada 30 segundos
    setInterval(() => {
      this.collectMetrics();
    }, 30000);

    // Reset de contador de migraciones cada hora
    setInterval(() => {
      this.resetHourlyCounters();
    }, 3600000);
  }

  /**
   * Recolecta métricas de performance
   */
  private async collectMetrics(): Promise<void> {
    try {
      const provider = await this.providerManager.getCurrentProvider();
      const health = await provider.healthCheck();
      
      const metrics: PerformanceMetrics = {
        provider: provider.name,
        timestamp: new Date(),
        latency: health.latency,
        errorRate: this.calculateErrorRate(),
        availability: health.status === 'healthy' ? 100 : health.status === 'degraded' ? 50 : 0,
        costPerRequest: await this.calculateCostPerRequest(),
        totalRequests: this.getTotalRequests()
      };

      this.metrics.push(metrics);
      this.analyzePerformance(metrics);
    } catch (error) {
      // TODO: log Error collecting metrics en desarrollo
    }
  }

  /**
   * Analiza performance y dispara migración si es necesario
   */
  private analyzePerformance(metrics: PerformanceMetrics): void {
    const shouldMigrate = this.shouldTriggerMigration(metrics);
    
    if (shouldMigrate) {
      this.triggerMigration(metrics);
    }
  }

  /**
   * Determina si se debe disparar una migración
   */
  private shouldTriggerMigration(metrics: PerformanceMetrics): boolean {
    if (!this.config.autoMigration.enabled) return false;

    // Verificar límites de migración
    if (this.migrationsThisHour >= this.config.autoMigration.maxMigrationsPerHour) {
      return false;
    }

    // Verificar período de cooldown
    if (this.lastMigrationTime && 
        Date.now() - this.lastMigrationTime.getTime() < this.config.autoMigration.cooldownPeriod * 1000) {
      return false;
    }

    // Verificar umbrales de performance
    const { maxLatency, maxErrorRate, maxDowntime } = this.config.performanceThresholds;
    
    return (
      metrics.latency > maxLatency ||
      metrics.errorRate > maxErrorRate ||
      metrics.availability === 0
    );
  }

  /**
   * Dispara migración automática
   */
  private async triggerMigration(metrics: PerformanceMetrics): Promise<void> {
    try {
      // TODO: log Triggering automatic migration en desarrollo
      // Forzar cambio de proveedor
      await this.providerManager.switchToFallbackProvider();
      
      // Actualizar contadores
      this.lastMigrationTime = new Date();
      this.migrationsThisHour++;

      // Enviar alertas
      await this.sendAlerts({
        type: 'migration',
        provider: metrics.provider,
        reason: this.getMigrationReason(metrics),
        timestamp: new Date()
      });

    } catch (error) {
      // TODO: log Failed to trigger migration en desarrollo
      await this.sendAlerts({
        type: 'migration_failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  }

  /**
   * Envía alertas por diferentes canales
   */
  private async sendAlerts(alert: {
    type: string;
    provider?: string;
    reason?: string;
    error?: string;
    timestamp: Date;
  }): Promise<void> {
    const message = this.formatAlertMessage(alert);

    // Email
    if (this.config.alertChannels.email) {
      await this.sendEmailAlert(this.config.alertChannels.email, message);
    }

    // Slack
    if (this.config.alertChannels.slack) {
      await this.sendSlackAlert(this.config.alertChannels.slack, message);
    }

    // Webhook
    if (this.config.alertChannels.webhook) {
      await this.sendWebhookAlert(this.config.alertChannels.webhook, alert);
    }
  }

  /**
   * Formatea mensaje de alerta
   */
  private formatAlertMessage(alert: any): string {
    switch (alert.type) {
      case 'migration':
        return `🚨 AI Provider Migration Triggered\nProvider: ${alert.provider}\nReason: ${alert.reason}\nTime: ${alert.timestamp.toISOString()}`;
      case 'migration_failed':
        return `❌ AI Provider Migration Failed\nError: ${alert.error}\nTime: ${alert.timestamp.toISOString()}`;
      default:
        return `⚠️ AI Provider Alert\nType: ${alert.type}\nTime: ${alert.timestamp.toISOString()}`;
    }
  }

  /**
   * Envía alerta por email
   */
  private async sendEmailAlert(email: string, message: string): Promise<void> {
    // Implementar envío de email usando el servicio existente
    // TODO: log Sending email alert en desarrollo
  }

  /**
   * Envía alerta por Slack
   */
  private async sendSlackAlert(webhookUrl: string, message: string): Promise<void> {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      });
    } catch (error) {
      // TODO: log Failed to send Slack alert en desarrollo
    }
  }

  /**
   * Envía alerta por webhook
   */
  private async sendWebhookAlert(webhookUrl: string, data: any): Promise<void> {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      // TODO: log Failed to send webhook alert en desarrollo
    }
  }

  /**
   * Obtiene razón de migración
   */
  private getMigrationReason(metrics: PerformanceMetrics): string {
    const reasons = [];
    
    if (metrics.latency > this.config.performanceThresholds.maxLatency) {
      reasons.push(`High latency: ${metrics.latency}ms`);
    }
    
    if (metrics.errorRate > this.config.performanceThresholds.maxErrorRate) {
      reasons.push(`High error rate: ${metrics.errorRate}%`);
    }
    
    if (metrics.availability === 0) {
      reasons.push('Service unavailable');
    }
    
    return reasons.join(', ');
  }

  /**
   * Calcula tasa de error
   */
  private calculateErrorRate(): number {
    // Implementar cálculo de tasa de error basado en métricas recientes
    return 0;
  }

  /**
   * Calcula costo por request
   */
  private async calculateCostPerRequest(): Promise<number> {
    // Implementar cálculo de costo por request
    return 0;
  }

  /**
   * Obtiene total de requests
   */
  private getTotalRequests(): number {
    // Implementar contador de requests
    return 0;
  }

  /**
   * Resetea contadores horarios
   */
  private resetHourlyCounters(): void {
    this.migrationsThisHour = 0;
    this.lastHourReset = new Date();
  }

  /**
   * Obtiene métricas de performance
   */
  getPerformanceMetrics(timeframe: 'hour' | 'day' | 'week' = 'hour'): PerformanceMetrics[] {
    const now = new Date();
    const cutoff = new Date(now.getTime() - this.getTimeframeMs(timeframe));
    
    return this.metrics.filter(m => m.timestamp > cutoff);
  }

  /**
   * Obtiene milisegundos para timeframe
   */
  private getTimeframeMs(timeframe: 'hour' | 'day' | 'week'): number {
    switch (timeframe) {
      case 'hour': return 3600000;
      case 'day': return 86400000;
      case 'week': return 604800000;
      default: return 3600000;
    }
  }

  /**
   * Obtiene estadísticas de migración
   */
  getMigrationStats(): {
    totalMigrations: number;
    lastMigration?: Date;
    migrationsThisHour: number;
    averageTimeBetweenMigrations: number;
  } {
    const migrations = this.metrics.filter(m => m.availability === 0);
    
    return {
      totalMigrations: migrations.length,
      lastMigration: migrations[migrations.length - 1]?.timestamp,
      migrationsThisHour: this.migrationsThisHour,
      averageTimeBetweenMigrations: this.calculateAverageTimeBetweenMigrations()
    };
  }

  /**
   * Calcula tiempo promedio entre migraciones
   */
  private calculateAverageTimeBetweenMigrations(): number {
    const migrations = this.metrics.filter(m => m.availability === 0);
    if (migrations.length < 2) return 0;

    let totalTime = 0;
    for (let i = 1; i < migrations.length; i++) {
      totalTime += migrations[i].timestamp.getTime() - migrations[i-1].timestamp.getTime();
    }

    return totalTime / (migrations.length - 1);
  }
} 