# Guía de Implementación: Alertas Automáticas Basadas en Métricas

## 📅 Fecha: 05/07/2025
## 🎯 Objetivo: Implementar sistema de alertas automáticas basadas en métricas del sistema

---

## 🏗️ Arquitectura del Sistema

### **1. Sistema de Métricas**
```typescript
// src/shared/services/metricsService.ts
interface SystemMetrics {
  performance: PerformanceMetrics;
  security: SecurityMetrics;
  business: BusinessMetrics;
  infrastructure: InfrastructureMetrics;
}

interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
}
```

### **2. Reglas de Alertas**
```typescript
// src/shared/services/alertRules.ts
interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  duration: number; // segundos
  priority: AlertPriority;
  channels: AlertChannel[];
  enabled: boolean;
}
```

---

## 📊 Métricas a Monitorear

### **1. Métricas de Rendimiento**
```typescript
const performanceRules: AlertRule[] = [
  {
    id: 'high-response-time',
    name: 'Tiempo de Respuesta Alto',
    metric: 'responseTime',
    condition: 'gt',
    threshold: 2000, // ms
    duration: 300, // 5 minutos
    priority: AlertPriority.HIGH,
    channels: [AlertChannel.SLACK, AlertChannel.EMAIL],
    enabled: true
  },
  {
    id: 'high-error-rate',
    name: 'Tasa de Error Alta',
    metric: 'errorRate',
    condition: 'gt',
    threshold: 5, // %
    duration: 60, // 1 minuto
    priority: AlertPriority.CRITICAL,
    channels: [AlertChannel.SMS, AlertChannel.SLACK],
    enabled: true
  },
  {
    id: 'high-cpu-usage',
    name: 'Uso de CPU Alto',
    metric: 'cpuUsage',
    condition: 'gt',
    threshold: 90, // %
    duration: 300, // 5 minutos
    priority: AlertPriority.MEDIUM,
    channels: [AlertChannel.SLACK],
    enabled: true
  }
];
```

### **2. Métricas de Seguridad**
```typescript
const securityRules: AlertRule[] = [
  {
    id: 'failed-login-attempts',
    name: 'Intentos de Login Fallidos',
    metric: 'failedLogins',
    condition: 'gt',
    threshold: 10, // intentos
    duration: 300, // 5 minutos
    priority: AlertPriority.HIGH,
    channels: [AlertChannel.SLACK, AlertChannel.EMAIL],
    enabled: true
  },
  {
    id: 'suspicious-activity',
    name: 'Actividad Sospechosa',
    metric: 'suspiciousRequests',
    condition: 'gt',
    threshold: 5, // requests
    duration: 60, // 1 minuto
    priority: AlertPriority.CRITICAL,
    channels: [AlertChannel.SMS, AlertChannel.SLACK],
    enabled: true
  }
];
```

### **3. Métricas de Negocio**
```typescript
const businessRules: AlertRule[] = [
  {
    id: 'low-user-activity',
    name: 'Actividad de Usuario Baja',
    metric: 'activeUsers',
    condition: 'lt',
    threshold: 10, // usuarios
    duration: 3600, // 1 hora
    priority: AlertPriority.MEDIUM,
    channels: [AlertChannel.SLACK],
    enabled: true
  },
  {
    id: 'high-transaction-failure',
    name: 'Fallos de Transacción Altos',
    metric: 'transactionFailureRate',
    condition: 'gt',
    threshold: 10, // %
    duration: 300, // 5 minutos
    priority: AlertPriority.HIGH,
    channels: [AlertChannel.SLACK, AlertChannel.EMAIL],
    enabled: true
  }
];
```

---

## 🔧 Implementación del Sistema

### **1. Servicio de Métricas**
```typescript
// src/shared/services/metricsService.ts
export class MetricsService {
  private metrics: SystemMetrics = {
    performance: {
      responseTime: 0,
      throughput: 0,
      errorRate: 0,
      cpuUsage: 0,
      memoryUsage: 0
    },
    security: {
      failedLogins: 0,
      suspiciousRequests: 0,
      vulnerabilities: 0
    },
    business: {
      activeUsers: 0,
      transactionFailureRate: 0,
      revenue: 0
    },
    infrastructure: {
      diskUsage: 0,
      networkLatency: 0,
      databaseConnections: 0
    }
  };

  private subscribers: ((metrics: SystemMetrics) => void)[] = [];

  // Actualizar métricas
  updateMetrics(newMetrics: Partial<SystemMetrics>) {
    this.metrics = { ...this.metrics, ...newMetrics };
    this.notifySubscribers();
  }

  // Obtener métricas actuales
  getMetrics(): SystemMetrics {
    return { ...this.metrics };
  }

  // Suscribirse a cambios
  subscribe(callback: (metrics: SystemMetrics) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(subscriber => subscriber(this.metrics));
  }
}
```

### **2. Servicio de Reglas de Alertas**
```typescript
// src/shared/services/alertRulesService.ts
export class AlertRulesService {
  private rules: AlertRule[] = [];
  private activeAlerts: Map<string, { startTime: Date; triggered: boolean }> = new Map();

  // Agregar regla
  addRule(rule: AlertRule) {
    this.rules.push(rule);
  }

  // Evaluar reglas
  evaluateRules(metrics: SystemMetrics) {
    this.rules.forEach(rule => {
      if (!rule.enabled) return;

      const metricValue = this.getMetricValue(metrics, rule.metric);
      const shouldTrigger = this.evaluateCondition(metricValue, rule.condition, rule.threshold);

      if (shouldTrigger) {
        this.handleRuleTrigger(rule, metricValue);
      } else {
        this.handleRuleReset(rule);
      }
    });
  }

  private getMetricValue(metrics: SystemMetrics, metricPath: string): number {
    const paths = metricPath.split('.');
    let value: any = metrics;
    
    for (const path of paths) {
      value = value[path];
    }
    
    return value || 0;
  }

  private evaluateCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case 'gt': return value > threshold;
      case 'lt': return value < threshold;
      case 'eq': return value === threshold;
      case 'gte': return value >= threshold;
      case 'lte': return value <= threshold;
      default: return false;
    }
  }

  private handleRuleTrigger(rule: AlertRule, metricValue: number) {
    const alertKey = rule.id;
    const now = new Date();
    const existingAlert = this.activeAlerts.get(alertKey);

    if (!existingAlert) {
      // Nueva alerta
      this.activeAlerts.set(alertKey, { startTime: now, triggered: false });
    } else {
      // Verificar duración
      const durationMs = rule.duration * 1000;
      const timeSinceStart = now.getTime() - existingAlert.startTime.getTime();

      if (timeSinceStart >= durationMs && !existingAlert.triggered) {
        // Activar alerta
        this.triggerAlert(rule, metricValue);
        existingAlert.triggered = true;
      }
    }
  }

  private handleRuleReset(rule: AlertRule) {
    this.activeAlerts.delete(rule.id);
  }

  private async triggerAlert(rule: AlertRule, metricValue: number) {
    await alertService.sendAlert({
      type: AlertType.SYSTEM_HEALTH,
      priority: rule.priority,
      title: rule.name,
      message: `La métrica ${rule.metric} ha alcanzado ${metricValue} (umbral: ${rule.condition} ${rule.threshold})`,
      channels: rule.channels,
      metadata: {
        ruleId: rule.id,
        metricValue,
        threshold: rule.threshold,
        condition: rule.condition,
        duration: rule.duration
      }
    });
  }
}
```

---

## 📈 Monitoreo de Métricas Específicas

### **1. Métricas de API**
```typescript
// src/shared/services/apiMetricsService.ts
export class ApiMetricsService {
  private responseTimes: number[] = [];
  private errorCount = 0;
  private totalRequests = 0;

  // Registrar request
  recordRequest(responseTime: number, success: boolean) {
    this.responseTimes.push(responseTime);
    this.totalRequests++;
    
    if (!success) {
      this.errorCount++;
    }

    // Mantener solo los últimos 100 requests
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
  }

  // Calcular métricas
  getMetrics() {
    const avgResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;
    
    const errorRate = this.totalRequests > 0 
      ? (this.errorCount / this.totalRequests) * 100 
      : 0;

    return {
      avgResponseTime,
      errorRate,
      totalRequests: this.totalRequests,
      errorCount: this.errorCount
    };
  }
}
```

### **2. Métricas de Base de Datos**
```typescript
// src/shared/services/databaseMetricsService.ts
export class DatabaseMetricsService {
  private connectionCount = 0;
  private queryTimes: number[] = [];

  // Registrar query
  recordQuery(duration: number) {
    this.queryTimes.push(duration);
    
    if (this.queryTimes.length > 1000) {
      this.queryTimes.shift();
    }
  }

  // Actualizar conexiones
  updateConnections(count: number) {
    this.connectionCount = count;
  }

  // Obtener métricas
  getMetrics() {
    const avgQueryTime = this.queryTimes.length > 0 
      ? this.queryTimes.reduce((a, b) => a + b, 0) / this.queryTimes.length 
      : 0;

    return {
      avgQueryTime,
      connectionCount: this.connectionCount,
      totalQueries: this.queryTimes.length
    };
  }
}
```

### **3. Métricas de Usuario**
```typescript
// src/shared/services/userMetricsService.ts
export class UserMetricsService {
  private activeUsers = new Set<string>();
  private failedLogins = 0;
  private suspiciousActivities = 0;

  // Usuario activo
  userActive(userId: string) {
    this.activeUsers.add(userId);
  }

  // Usuario inactivo
  userInactive(userId: string) {
    this.activeUsers.delete(userId);
  }

  // Login fallido
  recordFailedLogin() {
    this.failedLogins++;
  }

  // Actividad sospechosa
  recordSuspiciousActivity() {
    this.suspiciousActivities++;
  }

  // Reset contadores
  resetCounters() {
    this.failedLogins = 0;
    this.suspiciousActivities = 0;
  }

  // Obtener métricas
  getMetrics() {
    return {
      activeUsers: this.activeUsers.size,
      failedLogins: this.failedLogins,
      suspiciousActivities: this.suspiciousActivities
    };
  }
}
```

---

## 🔄 Sistema de Monitoreo Continuo

### **1. Worker de Monitoreo**
```typescript
// src/shared/services/monitoringWorker.ts
export class MonitoringWorker {
  private metricsService: MetricsService;
  private alertRulesService: AlertRulesService;
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.metricsService = new MetricsService();
    this.alertRulesService = new AlertRulesService();
  }

  // Iniciar monitoreo
  start(intervalMs: number = 30000) { // 30 segundos
    this.interval = setInterval(() => {
      this.collectMetrics();
      this.evaluateRules();
    }, intervalMs);
  }

  // Detener monitoreo
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private async collectMetrics() {
    try {
      // Recolectar métricas del sistema
      const systemMetrics = await this.getSystemMetrics();
      
      // Actualizar servicio de métricas
      this.metricsService.updateMetrics(systemMetrics);
    } catch (error) {
      console.error('Error collecting metrics:', error);
    }
  }

  private evaluateRules() {
    const metrics = this.metricsService.getMetrics();
    this.alertRulesService.evaluateRules(metrics);
  }

  private async getSystemMetrics(): Promise<SystemMetrics> {
    // Implementar recolección de métricas del sistema
    return {
      performance: {
        responseTime: await this.getAverageResponseTime(),
        throughput: await this.getThroughput(),
        errorRate: await this.getErrorRate(),
        cpuUsage: await this.getCpuUsage(),
        memoryUsage: await this.getMemoryUsage()
      },
      security: {
        failedLogins: await this.getFailedLogins(),
        suspiciousRequests: await this.getSuspiciousRequests(),
        vulnerabilities: await this.getVulnerabilities()
      },
      business: {
        activeUsers: await this.getActiveUsers(),
        transactionFailureRate: await this.getTransactionFailureRate(),
        revenue: await this.getRevenue()
      },
      infrastructure: {
        diskUsage: await this.getDiskUsage(),
        networkLatency: await this.getNetworkLatency(),
        databaseConnections: await this.getDatabaseConnections()
      }
    };
  }

  // Métodos para obtener métricas específicas
  private async getAverageResponseTime(): Promise<number> {
    // Implementar
    return 150;
  }

  private async getThroughput(): Promise<number> {
    // Implementar
    return 1000;
  }

  private async getErrorRate(): Promise<number> {
    // Implementar
    return 2.5;
  }

  private async getCpuUsage(): Promise<number> {
    // Implementar
    return 65;
  }

  private async getMemoryUsage(): Promise<number> {
    // Implementar
    return 78;
  }

  private async getFailedLogins(): Promise<number> {
    // Implementar
    return 3;
  }

  private async getSuspiciousRequests(): Promise<number> {
    // Implementar
    return 1;
  }

  private async getVulnerabilities(): Promise<number> {
    // Implementar
    return 0;
  }

  private async getActiveUsers(): Promise<number> {
    // Implementar
    return 150;
  }

  private async getTransactionFailureRate(): Promise<number> {
    // Implementar
    return 1.2;
  }

  private async getRevenue(): Promise<number> {
    // Implementar
    return 50000;
  }

  private async getDiskUsage(): Promise<number> {
    // Implementar
    return 45;
  }

  private async getNetworkLatency(): Promise<number> {
    // Implementar
    return 25;
  }

  private async getDatabaseConnections(): Promise<number> {
    // Implementar
    return 25;
  }
}
```

---

## 🧪 Scripts de Prueba

### **1. Script de Prueba de Métricas**
```typescript
// scripts/test-metrics-alerts.js
import { MonitoringWorker } from '@/shared/services/monitoringWorker';
import { AlertRulesService } from '@/shared/services/alertRulesService';

const testMetricsAlerts = async () => {
  console.log('🧪 Probando alertas basadas en métricas...');

  const worker = new MonitoringWorker();
  const rulesService = new AlertRulesService();

  // Agregar reglas de prueba
  rulesService.addRule({
    id: 'test-high-cpu',
    name: 'CPU Alto (Prueba)',
    metric: 'performance.cpuUsage',
    condition: 'gt',
    threshold: 50, // Bajo para pruebas
    duration: 10, // 10 segundos
    priority: AlertPriority.HIGH,
    channels: [AlertChannel.SLACK],
    enabled: true
  });

  // Iniciar monitoreo
  worker.start(5000); // Cada 5 segundos para pruebas

  // Simular métricas altas después de 15 segundos
  setTimeout(() => {
    console.log('📈 Simulando métricas altas...');
    // Aquí se simularían métricas altas
  }, 15000);

  // Detener después de 30 segundos
  setTimeout(() => {
    worker.stop();
    console.log('✅ Prueba completada');
  }, 30000);
};

testMetricsAlerts();
```

### **2. Script de Configuración de Reglas**
```typescript
// scripts/setup-alert-rules.js
import { AlertRulesService } from '@/shared/services/alertRulesService';

const setupAlertRules = () => {
  const rulesService = new AlertRulesService();

  // Reglas de rendimiento
  rulesService.addRule({
    id: 'high-response-time',
    name: 'Tiempo de Respuesta Alto',
    metric: 'performance.responseTime',
    condition: 'gt',
    threshold: 2000,
    duration: 300,
    priority: AlertPriority.HIGH,
    channels: [AlertChannel.SLACK, AlertChannel.EMAIL],
    enabled: true
  });

  rulesService.addRule({
    id: 'high-error-rate',
    name: 'Tasa de Error Alta',
    metric: 'performance.errorRate',
    condition: 'gt',
    threshold: 5,
    duration: 60,
    priority: AlertPriority.CRITICAL,
    channels: [AlertChannel.SMS, AlertChannel.SLACK],
    enabled: true
  });

  // Reglas de seguridad
  rulesService.addRule({
    id: 'failed-login-attempts',
    name: 'Intentos de Login Fallidos',
    metric: 'security.failedLogins',
    condition: 'gt',
    threshold: 10,
    duration: 300,
    priority: AlertPriority.HIGH,
    channels: [AlertChannel.SLACK, AlertChannel.EMAIL],
    enabled: true
  });

  console.log('✅ Reglas de alertas configuradas');
};

setupAlertRules();
```

---

## 📋 Checklist de Implementación

### **✅ Sistema de Métricas**
- [ ] Implementar MetricsService
- [ ] Implementar AlertRulesService
- [ ] Crear MonitoringWorker
- [ ] Configurar métricas específicas (API, DB, Usuario)

### **✅ Reglas de Alertas**
- [ ] Definir reglas de rendimiento
- [ ] Definir reglas de seguridad
- [ ] Definir reglas de negocio
- [ ] Configurar umbrales y duraciones

### **✅ Monitoreo Continuo**
- [ ] Implementar worker de monitoreo
- [ ] Configurar intervalos de recolección
- [ ] Implementar métricas del sistema
- [ ] Configurar alertas automáticas

### **✅ Pruebas**
- [ ] Crear scripts de prueba
- [ ] Probar reglas de alertas
- [ ] Validar integración con canales
- [ ] Documentar casos de uso

---

**Documentado por**: Marcelo Escallón  
**Fecha**: 05/07/2025  
**Versión**: VThink 1.0  
**Estado**: Listo para implementación 