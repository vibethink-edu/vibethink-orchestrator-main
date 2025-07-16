import { supabase } from '@/integrations/supabase/client';
import { timelineService } from './TimelineService';
import { planLimitService } from './PlanLimitService';

// Tipos para monitoreo
export interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: 'PERFORMANCE' | 'USAGE' | 'ERROR' | 'BUSINESS';
  timestamp: Date;
  companyId?: string;
  metadata?: any;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'NOT_EQUALS';
  threshold: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actions: string[];
  isActive: boolean;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemAlert {
  id: string;
  ruleId: string;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  metricValue: number;
  threshold: number;
  timestamp: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  metadata?: any;
}

export interface HealthCheck {
  component: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  responseTime: number;
  lastCheck: Date;
  error?: string;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  requestsPerMinute: number;
  errorRate: number;
  activeUsers: number;
  databaseConnections: number;
  memoryUsage: number;
  cpuUsage: number;
}

/**
 * Servicio de Monitoreo y Alertas del Sistema
 */
export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: Map<string, SystemMetric[]> = new Map();
  private alertRules: Map<string, AlertRule[]> = new Map();
  private healthChecks: Map<string, HealthCheck> = new Map();
  private monitoringInterval?: NodeJS.Timeout;

  private constructor() {
    this.initializeMonitoring();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Inicializar monitoreo
   */
  private async initializeMonitoring(): Promise<void> {
    try {
      // Cargar reglas de alerta por defecto
      await this.loadDefaultAlertRules();
      
      // Iniciar monitoreo automático
      this.startAutomaticMonitoring();
      // TODO: log Monitoreo del sistema inicializado en desarrollo
    } catch (error) {
      // TODO: log Error inicializando monitoreo en desarrollo
    }
  }

  /**
   * Cargar reglas de alerta por defecto
   */
  private async loadDefaultAlertRules(): Promise<void> {
    const defaultRules: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Timeline SLA Breach',
        description: 'Alerta cuando una línea de tiempo excede el SLA',
        metric: 'timeline_sla_breach',
        condition: 'GREATER_THAN',
        threshold: 0,
        severity: 'HIGH',
        actions: ['CREATE_ALERT', 'NOTIFY_STAKEHOLDERS', 'ESCALATE'],
        isActive: true
      },
      {
        name: 'High Error Rate',
        description: 'Alerta cuando la tasa de errores es alta',
        metric: 'error_rate',
        condition: 'GREATER_THAN',
        threshold: 5, // 5%
        severity: 'CRITICAL',
        actions: ['CREATE_ALERT', 'NOTIFY_ADMINS', 'SCALE_RESOURCES'],
        isActive: true
      },
      {
        name: 'High Response Time',
        description: 'Alerta cuando el tiempo de respuesta es alto',
        metric: 'response_time',
        condition: 'GREATER_THAN',
        threshold: 2000, // 2 segundos
        severity: 'MEDIUM',
        actions: ['CREATE_ALERT', 'OPTIMIZE_PERFORMANCE'],
        isActive: true
      },
      {
        name: 'Plan Limit Warning',
        description: 'Alerta cuando se acerca al límite del plan',
        metric: 'plan_usage_percentage',
        condition: 'GREATER_THAN',
        threshold: 80, // 80%
        severity: 'MEDIUM',
        actions: ['CREATE_ALERT', 'NOTIFY_ADMIN', 'SUGGEST_UPGRADE'],
        isActive: true
      },
      {
        name: 'Database Connection Pool',
        description: 'Alerta cuando el pool de conexiones está lleno',
        metric: 'database_connections',
        condition: 'GREATER_THAN',
        threshold: 80, // 80% del pool
        severity: 'HIGH',
        actions: ['CREATE_ALERT', 'SCALE_DATABASE', 'OPTIMIZE_QUERIES'],
        isActive: true
      }
    ];

    for (const rule of defaultRules) {
      await this.createAlertRule(rule);
    }
  }

  /**
   * Iniciar monitoreo automático
   */
  private startAutomaticMonitoring(): void {
    // Monitoreo cada 30 segundos
    this.monitoringInterval = setInterval(async () => {
      await this.collectSystemMetrics();
      await this.evaluateAlertRules();
      await this.performHealthChecks();
    }, 30000);

    // TODO: log Monitoreo automático iniciado (intervalo: 30s)
  }

  /**
   * Detener monitoreo automático
   */
  stopAutomaticMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
      // TODO: log Monitoreo automático detenido
    }
  }

  /**
   * Recolectar métricas del sistema
   */
  async collectSystemMetrics(): Promise<void> {
    try {
      const metrics: SystemMetric[] = [];

      // Métricas de líneas de tiempo
      const timelineMetrics = await this.collectTimelineMetrics();
      metrics.push(...timelineMetrics);

      // Métricas de rendimiento
      const performanceMetrics = await this.collectPerformanceMetrics();
      metrics.push(...performanceMetrics);

      // Métricas de uso de planes
      const planMetrics = await this.collectPlanMetrics();
      metrics.push(...planMetrics);

      // Métricas de errores
      const errorMetrics = await this.collectErrorMetrics();
      metrics.push(...errorMetrics);

      // Guardar métricas
      await this.saveMetrics(metrics);

      // Actualizar en memoria
      const timestamp = new Date().toISOString().split('T')[0]; // Fecha sin tiempo
      this.metrics.set(timestamp, metrics);

    } catch (error) {
      // TODO: log Error recolectando métricas en desarrollo
    }
  }

  /**
   * Recolectar métricas de líneas de tiempo
   */
  private async collectTimelineMetrics(): Promise<SystemMetric[]> {
    const metrics: SystemMetric[] = [];
    const now = new Date();

    try {
      // Total de líneas de tiempo activas
      const { count: activeTimelines } = await supabase
        .from('universal_timelines')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ACTIVE');

      metrics.push({
        id: `timeline_active_${now.getTime()}`,
        name: 'active_timelines',
        value: activeTimelines || 0,
        unit: 'count',
        category: 'BUSINESS',
        timestamp: now
      });

      // Líneas de tiempo retrasadas
      const { count: delayedTimelines } = await supabase
        .from('universal_timelines')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ACTIVE')
        .lt('expected_end_time', now.toISOString());

      metrics.push({
        id: `timeline_delayed_${now.getTime()}`,
        name: 'delayed_timelines',
        value: delayedTimelines || 0,
        unit: 'count',
        category: 'BUSINESS',
        timestamp: now
      });

      // Alertas activas
      const { count: activeAlerts } = await supabase
        .from('timeline_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ACTIVE');

      metrics.push({
        id: `alerts_active_${now.getTime()}`,
        name: 'active_alerts',
        value: activeAlerts || 0,
        unit: 'count',
        category: 'BUSINESS',
        timestamp: now
      });

      // Milestones completados hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: completedMilestones } = await supabase
        .from('timeline_milestones')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'COMPLETED')
        .gte('actual_time', today.toISOString());

      metrics.push({
        id: `milestones_completed_today_${now.getTime()}`,
        name: 'milestones_completed_today',
        value: completedMilestones || 0,
        unit: 'count',
        category: 'BUSINESS',
        timestamp: now
      });

    } catch (error) {
      // TODO: log Error recolectando métricas de líneas de tiempo en desarrollo
    }

    return metrics;
  }

  /**
   * Recolectar métricas de rendimiento
   */
  private async collectPerformanceMetrics(): Promise<SystemMetric[]> {
    const metrics: SystemMetric[] = [];
    const now = new Date();

    try {
      // Simular métricas de rendimiento (en producción se obtendrían de herramientas reales)
      const responseTime = Math.random() * 1000 + 200; // 200-1200ms
      const requestsPerMinute = Math.random() * 100 + 50; // 50-150 req/min
      const memoryUsage = Math.random() * 30 + 40; // 40-70%
      const cpuUsage = Math.random() * 20 + 30; // 30-50%

      metrics.push(
        {
          id: `response_time_${now.getTime()}`,
          name: 'response_time',
          value: responseTime,
          unit: 'ms',
          category: 'PERFORMANCE',
          timestamp: now
        },
        {
          id: `requests_per_minute_${now.getTime()}`,
          name: 'requests_per_minute',
          value: requestsPerMinute,
          unit: 'req/min',
          category: 'PERFORMANCE',
          timestamp: now
        },
        {
          id: `memory_usage_${now.getTime()}`,
          name: 'memory_usage',
          value: memoryUsage,
          unit: '%',
          category: 'PERFORMANCE',
          timestamp: now
        },
        {
          id: `cpu_usage_${now.getTime()}`,
          name: 'cpu_usage',
          value: cpuUsage,
          unit: '%',
          category: 'PERFORMANCE',
          timestamp: now
        }
      );

    } catch (error) {
      // TODO: log Error recolectando métricas de rendimiento en desarrollo
    }

    return metrics;
  }

  /**
   * Recolectar métricas de planes
   */
  private async collectPlanMetrics(): Promise<SystemMetric[]> {
    const metrics: SystemMetric[] = [];
    const now = new Date();

    try {
      // Obtener estadísticas de uso de todas las empresas
      const { data: companies } = await supabase
        .from('companies')
        .select('id, name');

      for (const company of companies || []) {
        const usageStats = await planLimitService.getUsageStatistics(company.id);
        
        if (usageStats) {
          // Métrica de uso promedio
          const averageUsage = usageStats.usageBreakdown.reduce((sum, item) => sum + item.percentage, 0) / usageStats.usageBreakdown.length;
          
          metrics.push({
            id: `plan_usage_${company.id}_${now.getTime()}`,
            name: 'plan_usage_percentage',
            value: averageUsage,
            unit: '%',
            category: 'USAGE',
            timestamp: now,
            companyId: company.id,
            metadata: { companyName: company.name }
          });

          // Métrica de características cerca del límite
          metrics.push({
            id: `features_near_limit_${company.id}_${now.getTime()}`,
            name: 'features_near_limit',
            value: usageStats.featuresNearLimit,
            unit: 'count',
            category: 'USAGE',
            timestamp: now,
            companyId: company.id,
            metadata: { companyName: company.name }
          });
        }
      }

    } catch (error) {
      // TODO: log Error recolectando métricas de planes en desarrollo
    }

    return metrics;
  }

  /**
   * Recolectar métricas de errores
   */
  private async collectErrorMetrics(): Promise<SystemMetric[]> {
    const metrics: SystemMetric[] = [];
    const now = new Date();

    try {
      // Simular métricas de errores (en producción se obtendrían de logs reales)
      const errorRate = Math.random() * 3; // 0-3%
      const totalErrors = Math.floor(Math.random() * 10); // 0-10 errores

      metrics.push(
        {
          id: `error_rate_${now.getTime()}`,
          name: 'error_rate',
          value: errorRate,
          unit: '%',
          category: 'ERROR',
          timestamp: now
        },
        {
          id: `total_errors_${now.getTime()}`,
          name: 'total_errors',
          value: totalErrors,
          unit: 'count',
          category: 'ERROR',
          timestamp: now
        }
      );

    } catch (error) {
      // TODO: log Error recolectando métricas de errores en desarrollo
    }

    return metrics;
  }

  /**
   * Guardar métricas en base de datos
   */
  private async saveMetrics(metrics: SystemMetric[]): Promise<void> {
    try {
      const metricsData = metrics.map(metric => ({
        name: metric.name,
        value: metric.value,
        unit: metric.unit,
        category: metric.category,
        timestamp: metric.timestamp.toISOString(),
        company_id: metric.companyId,
        metadata: metric.metadata
      }));

      const { error } = await supabase
        .from('system_metrics')
        .insert(metricsData);

      if (error) throw error;

    } catch (error) {
      // TODO: log Error guardando métricas en desarrollo
    }
  }

  /**
   * Evaluar reglas de alerta
   */
  async evaluateAlertRules(): Promise<void> {
    try {
      const rules = await this.getActiveAlertRules();
      const latestMetrics = await this.getLatestMetrics();

      for (const rule of rules) {
        const metric = latestMetrics.find(m => m.name === rule.metric);
        
        if (metric && this.shouldTriggerAlert(rule, metric)) {
          await this.createSystemAlert(rule, metric);
        }
      }

    } catch (error) {
      // TODO: log Error evaluando reglas de alerta en desarrollo
    }
  }

  /**
   * Verificar si debe disparar una alerta
   */
  private shouldTriggerAlert(rule: AlertRule, metric: SystemMetric): boolean {
    switch (rule.condition) {
      case 'GREATER_THAN':
        return metric.value > rule.threshold;
      case 'LESS_THAN':
        return metric.value < rule.threshold;
      case 'EQUALS':
        return metric.value === rule.threshold;
      case 'NOT_EQUALS':
        return metric.value !== rule.threshold;
      default:
        return false;
    }
  }

  /**
   * Crear alerta del sistema
   */
  private async createSystemAlert(rule: AlertRule, metric: SystemMetric): Promise<void> {
    try {
      const alert: Omit<SystemAlert, 'id'> = {
        ruleId: rule.id,
        title: `Alerta: ${rule.name}`,
        message: `${rule.description}. Valor actual: ${metric.value} ${metric.unit}, Umbral: ${rule.threshold} ${metric.unit}`,
        severity: rule.severity,
        status: 'ACTIVE',
        metricValue: metric.value,
        threshold: rule.threshold,
        timestamp: new Date(),
        metadata: {
          metricName: metric.name,
          companyId: metric.companyId,
          companyName: metric.metadata?.companyName
        }
      };

      const { data, error } = await supabase
        .from('system_alerts')
        .insert(alert)
        .select('id')
        .single();

      if (error) throw error;

      // Ejecutar acciones de la alerta
      await this.executeAlertActions(rule.actions, alert);

      // TODO: log Alerta creada: alert.title (alert.severity)

    } catch (error) {
      // TODO: log Error creando alerta del sistema en desarrollo
    }
  }

  /**
   * Ejecutar acciones de alerta
   */
  private async executeAlertActions(actions: string[], alert: Omit<SystemAlert, 'id'>): Promise<void> {
    for (const action of actions) {
      try {
        switch (action) {
          case 'CREATE_ALERT':
            // Ya se ejecutó
            break;
          
          case 'NOTIFY_STAKEHOLDERS':
            await this.notifyStakeholders(alert);
            break;
          
          case 'NOTIFY_ADMINS':
            await this.notifyAdmins(alert);
            break;
          
          case 'ESCALATE':
            await this.escalateAlert(alert);
            break;
          
          case 'SUGGEST_UPGRADE':
            await this.suggestPlanUpgrade(alert);
            break;
          
          case 'OPTIMIZE_PERFORMANCE':
            await this.optimizePerformance(alert);
            break;
          
          case 'SCALE_RESOURCES':
            await this.scaleResources(alert);
            break;
          
          case 'SCALE_DATABASE':
            await this.scaleDatabase(alert);
            break;
          
          case 'OPTIMIZE_QUERIES':
            await this.optimizeQueries(alert);
            break;
          
          default:
            // TODO: log Acción no implementada en desarrollo
            break;
        }
      } catch (error) {
        // TODO: log Error ejecutando acción en desarrollo
      }
    }
  }

  /**
   * Realizar verificaciones de salud
   */
  async performHealthChecks(): Promise<void> {
    const checks: HealthCheck[] = [];

    try {
      // Verificar base de datos
      const dbCheck = await this.checkDatabaseHealth();
      checks.push(dbCheck);

      // Verificar API de Supabase
      const apiCheck = await this.checkSupabaseAPIHealth();
      checks.push(apiCheck);

      // Verificar servicios internos
      const servicesCheck = await this.checkServicesHealth();
      checks.push(servicesCheck);

      // Actualizar estado de salud
      checks.forEach(check => {
        this.healthChecks.set(check.component, check);
      });

      // Crear alerta si algún componente está caído
      const downComponents = checks.filter(c => c.status === 'DOWN');
      if (downComponents.length > 0) {
        await this.createHealthAlert(downComponents);
      }

    } catch (error) {
      // TODO: log Error realizando verificaciones de salud en desarrollo
    }
  }

  /**
   * Verificar salud de la base de datos
   */
  private async checkDatabaseHealth(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('universal_timelines')
        .select('count', { count: 'exact', head: true });

      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          component: 'database',
          status: 'DOWN',
          responseTime,
          lastCheck: new Date(),
          error: error.message
        };
      }

      return {
        component: 'database',
        status: responseTime > 1000 ? 'DEGRADED' : 'HEALTHY',
        responseTime,
        lastCheck: new Date()
      };

    } catch (error) {
      return {
        component: 'database',
        status: 'DOWN',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        error: error.message
      };
    }
  }

  /**
   * Verificar salud de la API de Supabase
   */
  private async checkSupabaseAPIHealth(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`
        }
      });

      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        return {
          component: 'supabase_api',
          status: 'DOWN',
          responseTime,
          lastCheck: new Date(),
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        component: 'supabase_api',
        status: responseTime > 2000 ? 'DEGRADED' : 'HEALTHY',
        responseTime,
        lastCheck: new Date()
      };

    } catch (error) {
      return {
        component: 'supabase_api',
        status: 'DOWN',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        error: error.message
      };
    }
  }

  /**
   * Verificar salud de servicios internos
   */
  private async checkServicesHealth(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Verificar TimelineService
      const timelineService = await timelineService.getTimelinesByCompany('test', { limit: 1 });
      
      const responseTime = Date.now() - startTime;
      
      return {
        component: 'internal_services',
        status: responseTime > 1500 ? 'DEGRADED' : 'HEALTHY',
        responseTime,
        lastCheck: new Date()
      };

    } catch (error) {
      return {
        component: 'internal_services',
        status: 'DOWN',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        error: error.message
      };
    }
  }

  /**
   * Crear alerta de salud
   */
  private async createHealthAlert(downComponents: HealthCheck[]): Promise<void> {
    try {
      const alert: Omit<SystemAlert, 'id'> = {
        ruleId: 'health_check',
        title: 'Componentes del sistema caídos',
        message: `Los siguientes componentes están caídos: ${downComponents.map(c => c.component).join(', ')}`,
        severity: 'CRITICAL',
        status: 'ACTIVE',
        metricValue: downComponents.length,
        threshold: 0,
        timestamp: new Date(),
        metadata: {
          downComponents: downComponents.map(c => ({
            component: c.component,
            error: c.error,
            responseTime: c.responseTime
          }))
        }
      };

      const { error } = await supabase
        .from('system_alerts')
        .insert(alert);

      if (error) throw error;

      // TODO: log Alerta de salud creada: downComponents.length componentes caídos

    } catch (error) {
      // TODO: log Error creando alerta de salud en desarrollo
    }
  }

  // Métodos para obtener datos
  async getActiveAlertRules(): Promise<AlertRule[]> {
    try {
      const { data, error } = await supabase
        .from('alert_rules')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      return (data || []).map(rule => ({
        ...rule,
        createdAt: new Date(rule.created_at),
        updatedAt: new Date(rule.updated_at)
      }));
    } catch (error) {
      // TODO: log Error obteniendo reglas de alerta en desarrollo
      return [];
    }
  }

  async getLatestMetrics(): Promise<SystemMetric[]> {
    try {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .gte('timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Últimos 5 minutos
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return (data || []).map(metric => ({
        ...metric,
        timestamp: new Date(metric.timestamp)
      }));
    } catch (error) {
      // TODO: log Error obteniendo métricas en desarrollo
      return [];
    }
  }

  async getSystemAlerts(limit: number = 50): Promise<SystemAlert[]> {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(alert => ({
        ...alert,
        timestamp: new Date(alert.timestamp),
        resolvedAt: alert.resolved_at ? new Date(alert.resolved_at) : undefined
      }));
    } catch (error) {
      // TODO: log Error obteniendo alertas del sistema en desarrollo
      return [];
    }
  }

  async getSystemHealth(): Promise<HealthCheck[]> {
    return Array.from(this.healthChecks.values());
  }

  // Métodos para crear reglas de alerta
  async createAlertRule(ruleData: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('alert_rules')
        .insert({
          name: ruleData.name,
          description: ruleData.description,
          metric: ruleData.metric,
          condition: ruleData.condition,
          threshold: ruleData.threshold,
          severity: ruleData.severity,
          actions: ruleData.actions,
          is_active: ruleData.isActive,
          company_id: ruleData.companyId
        })
        .select('id')
        .single();

      if (error) throw error;

      return data.id;
    } catch (error) {
      // TODO: log Error creando regla de alerta en desarrollo
      throw new Error('Failed to create alert rule');
    }
  }

  // Métodos placeholder para acciones de alerta
  private async notifyStakeholders(alert: Omit<SystemAlert, 'id'>): Promise<void> {
    // TODO: log Notificando stakeholders en desarrollo
  }

  private async notifyAdmins(alert: Omit<SystemAlert, 'id'>): Promise<void> {
    // TODO: log Notificando administradores en desarrollo
  }

  private async escalateAlert(alert: Omit<SystemAlert, 'id'>): Promise<void> {
    // TODO: log Escalando alerta en desarrollo
  }

  private async suggestPlanUpgrade(alert: Omit<SystemAlert, 'id'>): Promise<void> {
    // TODO: log Sugiriendo upgrade de plan en desarrollo
  }

  private async optimizePerformance(alert: Omit<SystemAlert, 'id'>): Promise<void> {
    // TODO: log Optimizando rendimiento en desarrollo
  }

  private async scaleResources(alert: Omit<SystemAlert, 'id'>): Promise<void> {
    // TODO: log Escalando recursos en desarrollo
  }

  private async scaleDatabase(alert: Omit<SystemAlert, 'id'>): Promise<void> {
    // TODO: log Escalando base de datos en desarrollo
  }

  private async optimizeQueries(alert: Omit<SystemAlert, 'id'>): Promise<void> {
    // TODO: log Optimizando consultas en desarrollo
  }

  /**
   * Obtener dashboard de métricas
   */
  async getMetricsDashboard(): Promise<any> {
    try {
      const latestMetrics = await this.getLatestMetrics();
      const systemAlerts = await this.getSystemAlerts(10);
      const healthChecks = await this.getSystemHealth();

      // Agrupar métricas por categoría
      const metricsByCategory = latestMetrics.reduce((acc, metric) => {
        if (!acc[metric.category]) {
          acc[metric.category] = [];
        }
        acc[metric.category].push(metric);
        return acc;
      }, {} as Record<string, SystemMetric[]>);

      // Calcular promedios por categoría
      const averages = Object.entries(metricsByCategory).reduce((acc, [category, metrics]) => {
        acc[category] = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
        return acc;
      }, {} as Record<string, number>);

      return {
        metrics: latestMetrics,
        metricsByCategory,
        averages,
        alerts: systemAlerts,
        healthChecks,
        summary: {
          totalMetrics: latestMetrics.length,
          activeAlerts: systemAlerts.filter(a => a.status === 'ACTIVE').length,
          healthyComponents: healthChecks.filter(h => h.status === 'HEALTHY').length,
          degradedComponents: healthChecks.filter(h => h.status === 'DEGRADED').length,
          downComponents: healthChecks.filter(h => h.status === 'DOWN').length
        }
      };

    } catch (error) {
      // TODO: log Error obteniendo dashboard de métricas en desarrollo
      return null;
    }
  }
}

// Exportar instancia singleton
export const monitoringService = MonitoringService.getInstance(); 