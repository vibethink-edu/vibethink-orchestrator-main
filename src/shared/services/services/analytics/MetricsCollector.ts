/**
 * Sistema de Recolección de Métricas y Analytics
 * Métricas en tiempo real para análisis de performance y comportamiento
 */

import { logger } from '../logging/LoggingService';
import { LogCategory, LogLevel } from '../logging/LoggingService';

export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
  metadata?: any;
}

export interface MetricAggregation {
  name: string;
  count: number;
  sum: number;
  min: number;
  max: number;
  avg: number;
  p95: number;
  p99: number;
  timestamp: Date;
  tags: Record<string, string>;
}

export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  TIMER = 'timer'
}

export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: Map<string, Metric[]> = new Map();
  private aggregations: Map<string, MetricAggregation[]> = new Map();
  private flushInterval = 60000; // 1 minuto
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.startPeriodicFlush();
  }

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  /**
   * Registrar métrica
   */
  recordMetric(
    name: string,
    value: number,
    tags: Record<string, string> = {},
    metadata?: any
  ): void {
    const metric: Metric = {
      name,
      value,
      timestamp: new Date(),
      tags,
      metadata
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push(metric);

    // Limpiar métricas antiguas (mantener solo últimas 1000)
    const metrics = this.metrics.get(name)!;
    if (metrics.length > 1000) {
      this.metrics.set(name, metrics.slice(-1000));
    }
  }

  /**
   * Incrementar contador
   */
  incrementCounter(name: string, tags: Record<string, string> = {}): void {
    this.recordMetric(name, 1, tags);
  }

  /**
   * Registrar tiempo de respuesta
   */
  recordResponseTime(
    operation: string,
    duration: number,
    tags: Record<string, string> = {}
  ): void {
    this.recordMetric(`${operation}_response_time`, duration, tags);
  }

  /**
   * Registrar tasa de error
   */
  recordErrorRate(
    service: string,
    errorRate: number,
    tags: Record<string, string> = {}
  ): void {
    this.recordMetric(`${service}_error_rate`, errorRate, { service, ...tags });
  }

  /**
   * Registrar uso de recursos
   */
  recordResourceUsage(
    resource: string,
    usage: number,
    unit: string,
    tags: Record<string, string> = {}
  ): void {
    this.recordMetric(`${resource}_usage`, usage, { unit, ...tags });
  }

  /**
   * Registrar métricas de usuario
   */
  recordUserMetric(
    action: string,
    userId: string,
    companyId: string,
    metadata?: any
  ): void {
    this.recordMetric(`user_${action}`, 1, {
      userId,
      companyId,
      action
    }, metadata);
  }

  /**
   * Registrar métricas de AI
   */
  recordAIMetric(
    provider: string,
    operation: string,
    duration: number,
    tokens: number,
    cost: number,
    success: boolean
  ): void {
    this.recordMetric('ai_operation_duration', duration, {
      provider,
      operation,
      success: success.toString()
    });

    this.recordMetric('ai_tokens_used', tokens, {
      provider,
      operation
    });

    this.recordMetric('ai_cost', cost, {
      provider,
      operation
    });

    this.recordMetric('ai_success_rate', success ? 1 : 0, {
      provider,
      operation
    });
  }

  /**
   * Registrar métricas de performance
   */
  recordPerformanceMetric(
    component: string,
    metric: string,
    value: number,
    tags: Record<string, string> = {}
  ): void {
    this.recordMetric(`${component}_${metric}`, value, {
      component,
      ...tags
    });
  }

  /**
   * Obtener métricas por nombre
   */
  getMetrics(name: string, timeRange: { start: Date; end: Date }): Metric[] {
    const metrics = this.metrics.get(name) || [];
    return metrics.filter(m => 
      m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
    );
  }

  /**
   * Obtener agregaciones de métricas
   */
  getMetricAggregations(
    name: string,
    timeRange: { start: Date; end: Date },
    groupBy: string = 'hour'
  ): MetricAggregation[] {
    const metrics = this.getMetrics(name, timeRange);
    const grouped = this.groupMetricsByTime(metrics, groupBy);
    
    return grouped.map(group => this.calculateAggregation(name, group));
  }

  /**
   * Agrupar métricas por tiempo
   */
  private groupMetricsByTime(metrics: Metric[], groupBy: string): Metric[][] {
    const groups: Map<string, Metric[]> = new Map();

    metrics.forEach(metric => {
      const key = this.getTimeKey(metric.timestamp, groupBy);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(metric);
    });

    return Array.from(groups.values());
  }

  /**
   * Obtener clave de tiempo para agrupación
   */
  private getTimeKey(timestamp: Date, groupBy: string): string {
    switch (groupBy) {
      case 'minute':
        return timestamp.toISOString().substring(0, 16);
      case 'hour':
        return timestamp.toISOString().substring(0, 13);
      case 'day':
        return timestamp.toISOString().substring(0, 10);
      default:
        return timestamp.toISOString().substring(0, 13);
    }
  }

  /**
   * Calcular agregación de métricas
   */
  private calculateAggregation(name: string, metrics: Metric[]): MetricAggregation {
    const values = metrics.map(m => m.value).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = count > 0 ? sum / count : 0;
    const min = values[0] || 0;
    const max = values[values.length - 1] || 0;
    const p95 = values[Math.floor(count * 0.95)] || 0;
    const p99 = values[Math.floor(count * 0.99)] || 0;

    return {
      name,
      count,
      sum,
      min,
      max,
      avg,
      p95,
      p99,
      timestamp: new Date(),
      tags: metrics[0]?.tags || {}
    };
  }

  /**
   * Obtener métricas de sistema
   */
  getSystemMetrics(): {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    activeUsers: number;
    aiOperations: number;
    databaseConnections: number;
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);

    const requests = this.getMetrics('api_requests', { start: oneHourAgo, end: now });
    const responseTimes = this.getMetrics('api_response_time', { start: oneHourAgo, end: now });
    const errors = this.getMetrics('api_errors', { start: oneHourAgo, end: now });
    const users = this.getMetrics('active_users', { start: oneHourAgo, end: now });
    const aiOps = this.getMetrics('ai_operation_duration', { start: oneHourAgo, end: now });
    const dbConn = this.getMetrics('database_connections', { start: oneHourAgo, end: now });

    return {
      totalRequests: requests.reduce((sum, m) => sum + m.value, 0),
      averageResponseTime: responseTimes.length > 0 
        ? responseTimes.reduce((sum, m) => sum + m.value, 0) / responseTimes.length 
        : 0,
      errorRate: requests.length > 0 
        ? (errors.reduce((sum, m) => sum + m.value, 0) / requests.reduce((sum, m) => sum + m.value, 0)) * 100 
        : 0,
      activeUsers: users.length > 0 ? Math.max(...users.map(m => m.value)) : 0,
      aiOperations: aiOps.reduce((sum, m) => sum + m.value, 0),
      databaseConnections: dbConn.length > 0 ? Math.max(...dbConn.map(m => m.value)) : 0
    };
  }

  /**
   * Obtener métricas de AI
   */
  getAIMetrics(): {
    totalOperations: number;
    averageResponseTime: number;
    totalTokens: number;
    totalCost: number;
    successRate: number;
    providerBreakdown: Record<string, any>;
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);

    const operations = this.getMetrics('ai_operation_duration', { start: oneHourAgo, end: now });
    const tokens = this.getMetrics('ai_tokens_used', { start: oneHourAgo, end: now });
    const costs = this.getMetrics('ai_cost', { start: oneHourAgo, end: now });
    const success = this.getMetrics('ai_success_rate', { start: oneHourAgo, end: now });

    const providerBreakdown = this.getAIProviderBreakdown(oneHourAgo, now);

    return {
      totalOperations: operations.length,
      averageResponseTime: operations.length > 0 
        ? operations.reduce((sum, m) => sum + m.value, 0) / operations.length 
        : 0,
      totalTokens: tokens.reduce((sum, m) => sum + m.value, 0),
      totalCost: costs.reduce((sum, m) => sum + m.value, 0),
      successRate: success.length > 0 
        ? (success.reduce((sum, m) => sum + m.value, 0) / success.length) * 100 
        : 0,
      providerBreakdown
    };
  }

  /**
   * Obtener desglose por proveedor de AI
   */
  private getAIProviderBreakdown(start: Date, end: Date): Record<string, any> {
    const operations = this.getMetrics('ai_operation_duration', { start, end });
    const providers = new Set(operations.map(m => m.tags.provider).filter(Boolean));

    const breakdown: Record<string, any> = {};

    providers.forEach(provider => {
      const providerOps = operations.filter(m => m.tags.provider === provider);
      const providerTokens = this.getMetrics('ai_tokens_used', { start, end })
        .filter(m => m.tags.provider === provider);
      const providerCosts = this.getMetrics('ai_cost', { start, end })
        .filter(m => m.tags.provider === provider);

      breakdown[provider] = {
        operations: providerOps.length,
        averageResponseTime: providerOps.length > 0 
          ? providerOps.reduce((sum, m) => sum + m.value, 0) / providerOps.length 
          : 0,
        totalTokens: providerTokens.reduce((sum, m) => sum + m.value, 0),
        totalCost: providerCosts.reduce((sum, m) => sum + m.value, 0)
      };
    });

    return breakdown;
  }

  /**
   * Flush periódico de métricas
   */
  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flushMetrics();
    }, this.flushInterval);
  }

  private flushMetrics(): void {
    // Enviar métricas a sistema de monitoreo
    const systemMetrics = this.getSystemMetrics();
    const aiMetrics = this.getAIMetrics();

    logger.info(LogCategory.PERFORMANCE, 'metrics-collector', 
      'System metrics flushed', { systemMetrics, aiMetrics });

    // Aquí se enviarían a sistemas externos como Prometheus, DataDog, etc.
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushMetrics(); // Flush final
  }
}

// Exportar instancia singleton
export const metricsCollector = MetricsCollector.getInstance(); 