/**
 * Servicio Centralizado de Alertas - VThink 1.0
 * Fecha: 05/07/2025
 * 
 * Este servicio centraliza todas las alertas del sistema de desarrollo,
 * permitiendo agregar nuevos canales de notificación fácilmente.
 */

// Tipos de alertas del sistema
export enum AlertType {
  // Alertas de desarrollo
  DEV_PORTAL = 'dev_portal',
  UPGRADE_MONITOR = 'upgrade_monitor',
  SECURITY_SCAN = 'security_scan',
  PERFORMANCE_MONITOR = 'performance_monitor',
  ERROR_TRACKING = 'error_tracking',
  DEPLOYMENT_STATUS = 'deployment_status',
  TEST_FAILURE = 'test_failure',
  BUILD_FAILURE = 'build_failure',
  
  // Alertas de negocio
  USER_ACTIVITY = 'user_activity',
  SYSTEM_HEALTH = 'system_health',
  DATABASE_MONITOR = 'database_monitor',
  API_MONITOR = 'api_monitor',
  
  // Alertas de seguridad
  VULNERABILITY_DETECTED = 'vulnerability_detected',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  
  // Alertas de infraestructura
  RESOURCE_USAGE = 'resource_usage',
  DISK_SPACE = 'disk_space',
  MEMORY_USAGE = 'memory_usage',
  CPU_USAGE = 'cpu_usage'
}

// Prioridades de alertas
export enum AlertPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

// Canales de notificación
export enum AlertChannel {
  DEV_PORTAL = 'dev_portal',
  SLACK = 'slack',
  EMAIL = 'email',
  SMS = 'sms',
  WEBHOOK = 'webhook',
  DASHBOARD = 'dashboard',
  LOG = 'log'
}

// Interfaz para alertas
export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  channels: AlertChannel[];
  actions?: AlertAction[];
  expiresAt?: Date;
  acknowledged?: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

// Interfaz para acciones de alerta
export interface AlertAction {
  id: string;
  label: string;
  action: string;
  url?: string;
  callback?: () => void;
  requiresConfirmation?: boolean;
}

// Interfaz para configuración de canales
export interface ChannelConfig {
  enabled: boolean;
  config: Record<string, any>;
  filters?: {
    minPriority: AlertPriority;
    types?: AlertType[];
  };
}

// Interfaz para configuración del sistema
export interface AlertSystemConfig {
  channels: Record<AlertChannel, ChannelConfig>;
  globalFilters?: {
    minPriority: AlertPriority;
    types?: AlertType[];
  };
  retentionDays: number;
  maxAlertsPerChannel: number;
}

/**
 * Clase principal del sistema de alertas centralizado
 */
export class AlertService {
  private config: AlertSystemConfig;
  private alerts: Alert[] = [];
  private subscribers: Map<AlertChannel, ((alert: Alert) => void)[]> = new Map();
  private channelHandlers: Map<AlertChannel, (alert: Alert) => Promise<void>> = new Map();

  constructor(config: Partial<AlertSystemConfig> = {}) {
    this.config = {
      channels: {
        [AlertChannel.DEV_PORTAL]: { enabled: true, config: {} },
        [AlertChannel.SLACK]: { enabled: false, config: {} },
        [AlertChannel.EMAIL]: { enabled: false, config: {} },
        [AlertChannel.SMS]: { enabled: false, config: {} },
        [AlertChannel.WEBHOOK]: { enabled: false, config: {} },
        [AlertChannel.DASHBOARD]: { enabled: true, config: {} },
        [AlertChannel.LOG]: { enabled: true, config: {} }
      },
      retentionDays: 30,
      maxAlertsPerChannel: 100,
      ...config
    };

    this.initializeChannelHandlers();
  }

  /**
   * Inicializa los manejadores de canales
   */
  private initializeChannelHandlers() {
    // Dev Portal Handler
    this.channelHandlers.set(AlertChannel.DEV_PORTAL, async (alert: Alert) => {
      // TODO: log Alert sent to Dev Portal
    });

    // Slack Handler
    this.channelHandlers.set(AlertChannel.SLACK, async (alert: Alert) => {
      // TODO: log Alert sent to Slack
    });

    // Email Handler
    this.channelHandlers.set(AlertChannel.EMAIL, async (alert: Alert) => {
      // TODO: log Alert sent via Email
    });

    // Dashboard Handler
    this.channelHandlers.set(AlertChannel.DASHBOARD, async (alert: Alert) => {
      // TODO: log Alert sent to Dashboard
    });

    // Log Handler
    this.channelHandlers.set(AlertChannel.LOG, async (alert: Alert) => {
      // TODO: log Alert logged
    });
  }

  /**
   * Registra un nuevo canal de alertas
   */
  registerChannel(
    channel: AlertChannel, 
    handler: (alert: Alert) => Promise<void>,
    config: ChannelConfig
  ) {
    this.channelHandlers.set(channel, handler);
    this.config.channels[channel] = config;
    // TODO: log Channel registered: ${channel}
  }

  /**
   * Suscribe un callback para un canal específico
   */
  subscribe(channel: AlertChannel, callback: (alert: Alert) => void) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, []);
    }
    this.subscribers.get(channel)!.push(callback);

    return () => {
      const callbacks = this.subscribers.get(channel);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Envía una alerta al sistema
   */
  async sendAlert(alertData: Omit<Alert, 'id' | 'timestamp'>) {
    const alert: Alert = {
      ...alertData,
      id: this.generateId(),
      timestamp: new Date()
    };

    // Agregar a la lista de alertas
    this.alerts.push(alert);

    // Filtrar alertas según configuración global
    if (this.shouldSendAlert(alert)) {
      // Enviar a cada canal configurado
      for (const [channel, config] of Object.entries(this.config.channels)) {
        if (config.enabled && this.shouldSendToChannel(alert, channel as AlertChannel, config)) {
          await this.sendToChannel(alert, channel as AlertChannel);
        }
      }

      // Notificar a suscriptores
      this.notifySubscribers(alert);
    }

    // Limpiar alertas antiguas
    this.cleanupOldAlerts();

    return alert;
  }

  /**
   * Determina si una alerta debe ser enviada según filtros globales
   */
  private shouldSendAlert(alert: Alert): boolean {
    if (this.config.globalFilters) {
      const { minPriority, types } = this.config.globalFilters;
      
      if (minPriority && this.getPriorityLevel(alert.priority) < this.getPriorityLevel(minPriority)) {
        return false;
      }
      
      if (types && !types.includes(alert.type)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Determina si una alerta debe ser enviada a un canal específico
   */
  private shouldSendToChannel(alert: Alert, channel: AlertChannel, config: ChannelConfig): boolean {
    if (config.filters) {
      const { minPriority, types } = config.filters;
      
      if (minPriority && this.getPriorityLevel(alert.priority) < this.getPriorityLevel(minPriority)) {
        return false;
      }
      
      if (types && !types.includes(alert.type)) {
        return false;
      }
    }
    
    return alert.channels.includes(channel);
  }

  /**
   * Envía una alerta a un canal específico
   */
  private async sendToChannel(alert: Alert, channel: AlertChannel) {
    try {
      const handler = this.channelHandlers.get(channel);
      if (handler) {
        await handler(alert);
      }
    } catch (error) {
      // TODO: log Error sending alert to ${channel}: ${error}
    }
  }

  /**
   * Notifica a los suscriptores de un canal
   */
  private notifySubscribers(alert: Alert) {
    for (const channel of alert.channels) {
      const callbacks = this.subscribers.get(channel);
      if (callbacks) {
        callbacks.forEach(callback => callback(alert));
      }
    }
  }

  /**
   * Obtiene el nivel numérico de una prioridad
   */
  private getPriorityLevel(priority: AlertPriority): number {
    const levels = {
      [AlertPriority.CRITICAL]: 4,
      [AlertPriority.HIGH]: 3,
      [AlertPriority.MEDIUM]: 2,
      [AlertPriority.LOW]: 1,
      [AlertPriority.INFO]: 0
    };
    return levels[priority] || 0;
  }

  /**
   * Genera un ID único para la alerta
   */
  private generateId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Limpia alertas antiguas según la configuración de retención
   */
  private cleanupOldAlerts() {
    const cutoffDate = new Date(Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffDate);
  }

  /**
   * Marca una alerta como reconocida
   */
  acknowledgeAlert(alertId: string, acknowledgedBy: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date();
    }
  }

  /**
   * Obtiene todas las alertas
   */
  getAlerts(filters?: {
    type?: AlertType;
    priority?: AlertPriority;
    channel?: AlertChannel;
    acknowledged?: boolean;
  }): Alert[] {
    let filtered = [...this.alerts];

    if (filters) {
      if (filters.type) {
        filtered = filtered.filter(a => a.type === filters.type);
      }
      if (filters.priority) {
        filtered = filtered.filter(a => a.priority === filters.priority);
      }
      if (filters.channel) {
        filtered = filtered.filter(a => a.channels.includes(filters.channel!));
      }
      if (filters.acknowledged !== undefined) {
        filtered = filtered.filter(a => a.acknowledged === filters.acknowledged);
      }
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Obtiene estadísticas de alertas
   */
  getAlertStats() {
    const total = this.alerts.length;
    const byPriority = Object.values(AlertPriority).reduce((acc, priority) => {
      acc[priority] = this.alerts.filter(a => a.priority === priority).length;
      return acc;
    }, {} as Record<AlertPriority, number>);

    const byType = Object.values(AlertType).reduce((acc, type) => {
      acc[type] = this.alerts.filter(a => a.type === type).length;
      return acc;
    }, {} as Record<AlertType, number>);

    const acknowledged = this.alerts.filter(a => a.acknowledged).length;

    return {
      total,
      byPriority,
      byType,
      acknowledged,
      unacknowledged: total - acknowledged
    };
  }

  /**
   * Actualiza la configuración del sistema
   */
  updateConfig(newConfig: Partial<AlertSystemConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Obtiene la configuración actual
   */
  getConfig(): AlertSystemConfig {
    return { ...this.config };
  }
}

// Instancia singleton del servicio
export const alertService = new AlertService();

// Exportar tipos para uso externo
export type { Alert, AlertAction, ChannelConfig, AlertSystemConfig }; 