/**
 * Sistema de Logging Categorizado para Observabilidad Completa
 * Logs estructurados por servicio con categorización automática
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum LogCategory {
  // Servicios Core
  AUTH = 'auth',
  PAYMENTS = 'payments',
  AI_PROVIDERS = 'ai_providers',
  DATABASE = 'database',
  API_GATEWAY = 'api_gateway',
  
  // Servicios de Negocio
  CRM = 'crm',
  HELP_DESK = 'help_desk',
  RECRUITING = 'recruiting',
  BILLING = 'billing',
  
  // Infraestructura
  INFRASTRUCTURE = 'infrastructure',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  INTEGRATIONS = 'integrations',
  
  // Agentes IA
  AI_AGENTS = 'ai_agents',
  AI_ORCHESTRATION = 'ai_orchestration',
  AI_MIGRATION = 'ai_migration',
  
  // Usuarios
  USER_ACTIONS = 'user_actions',
  USER_SESSIONS = 'user_sessions',
  USER_PERMISSIONS = 'user_permissions'
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  service: string;
  message: string;
  details?: any;
  userId?: string;
  companyId?: string;
  sessionId?: string;
  requestId?: string;
  duration?: number;
  metadata?: Record<string, any>;
  stackTrace?: string;
  tags?: string[];
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  service?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  companyId?: string;
  tags?: string[];
}

export class LoggingService {
  private static instance: LoggingService;
  private logQueue: LogEntry[] = [];
  private batchSize = 100;
  private flushInterval = 5000; // 5 segundos
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.startBatchProcessing();
  }

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  /**
   * Log estructurado con categorización automática
   */
  log(
    level: LogLevel,
    category: LogCategory,
    service: string,
    message: string,
    details?: any,
    metadata?: Record<string, any>
  ): void {
    const logEntry: LogEntry = {
      id: this.generateLogId(),
      timestamp: new Date(),
      level,
      category,
      service,
      message,
      details,
      metadata,
      tags: this.generateTags(level, category, service),
      requestId: this.getCurrentRequestId(),
      userId: this.getCurrentUserId(),
      companyId: this.getCurrentCompanyId(),
      sessionId: this.getCurrentSessionId()
    };

    // Log inmediato para errores críticos
    if (level === LogLevel.CRITICAL || level === LogLevel.ERROR) {
      this.processLogImmediately(logEntry);
    } else {
      this.logQueue.push(logEntry);
    }

    // Limpiar cola si excede el tamaño máximo
    if (this.logQueue.length > this.batchSize * 2) {
      this.logQueue = this.logQueue.slice(-this.batchSize);
    }
  }

  /**
   * Métodos de conveniencia por nivel
   */
  debug(category: LogCategory, service: string, message: string, details?: any): void {
    this.log(LogLevel.DEBUG, category, service, message, details);
  }

  info(category: LogCategory, service: string, message: string, details?: any): void {
    this.log(LogLevel.INFO, category, service, message, details);
  }

  warn(category: LogCategory, service: string, message: string, details?: any): void {
    this.log(LogLevel.WARN, category, service, message, details);
  }

  error(category: LogCategory, service: string, message: string, details?: any, stackTrace?: string): void {
    this.log(LogLevel.ERROR, category, service, message, details, { stackTrace });
  }

  critical(category: LogCategory, service: string, message: string, details?: any, stackTrace?: string): void {
    this.log(LogLevel.CRITICAL, category, service, message, details, { stackTrace });
  }

  /**
   * Logs específicos por servicio
   */
  auth(level: LogLevel, message: string, details?: any): void {
    this.log(level, LogCategory.AUTH, 'auth-service', message, details);
  }

  payments(level: LogLevel, message: string, details?: any): void {
    this.log(level, LogCategory.PAYMENTS, 'payment-service', message, details);
  }

  aiProvider(level: LogLevel, provider: string, message: string, details?: any): void {
    this.log(level, LogCategory.AI_PROVIDERS, `ai-provider-${provider}`, message, details);
  }

  database(level: LogLevel, operation: string, message: string, details?: any): void {
    this.log(level, LogCategory.DATABASE, 'database-service', message, details, { operation });
  }

  crm(level: LogLevel, action: string, message: string, details?: any): void {
    this.log(level, LogCategory.CRM, 'crm-service', message, details, { action });
  }

  helpDesk(level: LogLevel, ticketId: string, message: string, details?: any): void {
    this.log(level, LogCategory.HELP_DESK, 'helpdesk-service', message, details, { ticketId });
  }

  /**
   * Logs de performance
   */
  performance(operation: string, duration: number, details?: any): void {
    this.log(LogLevel.INFO, LogCategory.PERFORMANCE, 'performance-monitor', 
      `${operation} completed in ${duration}ms`, details, { duration, operation });
  }

  /**
   * Logs de seguridad
   */
  security(event: string, details?: any): void {
    this.log(LogLevel.WARN, LogCategory.SECURITY, 'security-service', 
      `Security event: ${event}`, details);
  }

  /**
   * Logs de migración de IA
   */
  aiMigration(from: string, to: string, reason: string, details?: any): void {
    this.log(LogLevel.INFO, LogCategory.AI_MIGRATION, 'ai-orchestrator', 
      `AI Provider migration: ${from} → ${to}`, details, { from, to, reason });
  }

  /**
   * Procesamiento por lotes
   */
  private startBatchProcessing(): void {
    this.flushTimer = setInterval(() => {
      this.flushLogs();
    }, this.flushInterval);
  }

  private flushLogs(): void {
    if (this.logQueue.length === 0) return;

    const logsToProcess = this.logQueue.splice(0, this.batchSize);
    
    // Procesar logs por categoría
    const logsByCategory = this.groupLogsByCategory(logsToProcess);
    
    // Enviar a diferentes destinos según categoría
    Object.entries(logsByCategory).forEach(([category, logs]) => {
      this.sendLogsToDestination(category as LogCategory, logs);
    });
  }

  private groupLogsByCategory(logs: LogEntry[]): Record<string, LogEntry[]> {
    return logs.reduce((acc, log) => {
      if (!acc[log.category]) {
        acc[log.category] = [];
      }
      acc[log.category].push(log);
      return acc;
    }, {} as Record<string, LogEntry[]>);
  }

  private sendLogsToDestination(category: LogCategory, logs: LogEntry[]): void {
    // Enviar a diferentes destinos según categoría
    switch (category) {
      case LogCategory.AUTH:
      case LogCategory.SECURITY:
        this.sendToSecurityLogs(logs);
        break;
      case LogCategory.PAYMENTS:
      case LogCategory.BILLING:
        this.sendToFinancialLogs(logs);
        break;
      case LogCategory.AI_PROVIDERS:
      case LogCategory.AI_AGENTS:
      case LogCategory.AI_ORCHESTRATION:
        this.sendToAILogs(logs);
        break;
      case LogCategory.PERFORMANCE:
        this.sendToPerformanceLogs(logs);
        break;
      default:
        this.sendToGeneralLogs(logs);
    }
  }

  private sendToSecurityLogs(logs: LogEntry[]): void {
    // Enviar a sistema de seguridad (ej: SIEM)
    // TODO: log 🔒 Security logs
    // Implementar envío a SIEM
  }

  private sendToFinancialLogs(logs: LogEntry[]): void {
    // Enviar a sistema de auditoría financiera
    // TODO: log 💰 Financial logs
    // Implementar envío a auditoría
  }

  private sendToAILogs(logs: LogEntry[]): void {
    // Enviar a sistema de monitoreo de IA
    // TODO: log 🤖 AI logs
    // Implementar envío a monitoreo de IA
  }

  private sendToPerformanceLogs(logs: LogEntry[]): void {
    // Enviar a sistema de APM
    // TODO: log ⚡ Performance logs
    // Implementar envío a APM
  }

  private sendToGeneralLogs(logs: LogEntry[]): void {
    // TODO: log 📝 General logs
    // Implementar envío a sistema general
  }

  private processLogImmediately(logEntry: LogEntry): void {
    // TODO: log 🚨 Critical log
    this.sendLogsToDestination(logEntry.category, [logEntry]);
  }

  /**
   * Búsqueda y filtrado de logs
   */
  async searchLogs(filter: LogFilter, limit: number = 100): Promise<LogEntry[]> {
    // Implementar búsqueda en base de datos
    return [];
  }

  /**
   * Métricas de logs
   */
  async getLogMetrics(timeframe: 'hour' | 'day' | 'week' = 'day'): Promise<{
    totalLogs: number;
    logsByLevel: Record<LogLevel, number>;
    logsByCategory: Record<LogCategory, number>;
    errorRate: number;
    criticalErrors: number;
  }> {
    // Implementar métricas
    return {
      totalLogs: 0,
      logsByLevel: {} as Record<LogLevel, number>,
      logsByCategory: {} as Record<LogCategory, number>,
      errorRate: 0,
      criticalErrors: 0
    };
  }

  /**
   * Utilidades privadas
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTags(level: LogLevel, category: LogCategory, service: string): string[] {
    return [level, category, service, 'ai-pair-orchestrator'];
  }

  private getCurrentRequestId(): string | undefined {
    // Obtener ID de request actual (implementar según framework)
    return undefined;
  }

  private getCurrentUserId(): string | undefined {
    // Obtener ID de usuario actual (implementar según auth)
    return undefined;
  }

  private getCurrentCompanyId(): string | undefined {
    // Obtener ID de empresa actual (implementar según multi-tenant)
    return undefined;
  }

  private getCurrentSessionId(): string | undefined {
    // Obtener ID de sesión actual (implementar según sesiones)
    return undefined;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushLogs(); // Flush final
  }
}

// Exportar instancia singleton
export const logger = LoggingService.getInstance(); 