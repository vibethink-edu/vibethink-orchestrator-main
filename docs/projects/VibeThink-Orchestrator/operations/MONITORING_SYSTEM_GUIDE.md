# 🎛️ Guía Completa del Sistema de Monitoreo

## 📋 **Índice**

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Para Agentes Humanos](#para-agentes-humanos)
4. [Para Agentes de IA](#para-agentes-de-ia)
5. [Componentes del Sistema](#componentes-del-sistema)
6. [Configuración e Instalación](#configuración-e-instalación)
7. [Casos de Uso](#casos-de-uso)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)
10. [Glosario](#glosario)

---

## 🎯 **Resumen Ejecutivo**

El **Sistema de Monitoreo Inteligente** es una plataforma integral de observabilidad diseñada para **agentes humanos y agentes de IA** que trabajan en conjunto para mantener la salud y performance de la plataforma SaaS multi-tenant.

### **Características Principales**
- ✅ **Logs categorizados** por servicio y nivel de criticidad
- ✅ **Monitoreo automático** de todos los servicios críticos
- ✅ **Dashboard inteligente** con métricas en tiempo real
- ✅ **API-first design** para integración con agentes IA
- ✅ **Alertas proactivas** por múltiples canales
- ✅ **Scripts de monitoreo** que se ejecutan automáticamente

### **Beneficios**
- **Para Agentes Humanos**: Visibilidad completa y alertas proactivas
- **Para Agentes IA**: Datos estructurados para toma de decisiones automáticas
- **Para la Plataforma**: Detección temprana de problemas y optimización continua

---

## 🏗️ **Arquitectura del Sistema**

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA DE MONITOREO                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   LOGGING   │    │   HEALTH    │    │   METRICS   │     │
│  │   SERVICE   │    │   MONITOR   │    │ COLLECTOR   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                   │                   │           │
│         └───────────────────┼───────────────────┘           │
│                             │                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              DASHBOARD INTELIGENTE                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │   HUMANS    │  │    AGENTS   │  │    API      │ │   │
│  │  │  INTERFACE  │  │     IA      │  │  ENDPOINTS  │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                             │                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              SCRIPT DE MONITOREO                    │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │   HEALTH    │  │   ALERTS    │  │    LOGS     │ │   │
│  │  │   CHECKER   │  │   SYSTEM    │  │  PERSISTENT │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 **Para Agentes Humanos**

### **🎛️ Dashboard de Control**

#### **Acceso al Dashboard**
```
URL: http://localhost:3000/admin/intelligent-control-dashboard
Usuario: admin@company.com
Contraseña: [configurada en variables de entorno]
```

#### **Vistas Principales**

##### **1. Vista General (Overview)**
- **Estado General del Sistema**: Indicador visual de salud
- **Usuarios Activos**: Número de sesiones activas
- **Requests por Minuto**: Throughput del sistema
- **Tiempo de Respuesta Promedio**: Performance general

##### **2. Monitoreo de Servicios**
- **Servicios Críticos**: Auth, Payments, Database, API Gateway
- **Servicios de Negocio**: CRM, Help Desk, Recruiting
- **Servicios de IA**: Proveedores de IA y orquestación

**Indicadores Visuales:**
- 🟢 **Verde**: Servicio saludable
- 🟡 **Amarillo**: Servicio degradado
- 🔴 **Rojo**: Servicio no saludable

##### **3. Métricas de IA**
- **Operaciones de IA**: Total de operaciones por hora
- **Tiempo de Respuesta**: Latencia de proveedores de IA
- **Tokens Utilizados**: Consumo de tokens
- **Costos**: Gasto por proveedor de IA
- **Desglose por Proveedor**: Comparación entre Knotie, OpenAI, etc.

##### **4. Performance del Sistema**
- **Uso de CPU**: Porcentaje de utilización
- **Uso de Memoria**: Consumo de RAM
- **Uso de Disco**: Espacio utilizado
- **Uso de Red**: Ancho de banda

##### **5. Logs y Alertas**
- **Logs Recientes**: Últimos eventos del sistema
- **Alertas Activas**: Problemas que requieren atención
- **Historial de Alertas**: Problemas resueltos

#### **Controles del Dashboard**

##### **Auto-refresh**
```typescript
// Activar/desactivar actualización automática
const [autoRefresh, setAutoRefresh] = useState(true);

// Intervalo: 30 segundos
// Se puede ajustar en la configuración
```

##### **Filtros Dinámicos**
- **Por Servicio**: Filtrar métricas por servicio específico
- **Por Nivel**: DEBUG, INFO, WARN, ERROR, CRITICAL
- **Por Tiempo**: Última hora, día, semana, mes
- **Por Compañía**: En modo multi-tenant

##### **Exportación de Datos**
```typescript
// Exportar métricas a CSV/JSON
const exportMetrics = async (timeframe: string, format: 'csv' | 'json') => {
  const data = await getMetrics(timeframe);
  downloadFile(data, `metrics_${timeframe}.${format}`);
};
```

### **🚨 Sistema de Alertas**

#### **Tipos de Alertas**

##### **Alertas Críticas (CRITICAL)**
- **Color**: 🔴 Rojo
- **Sonido**: Alerta sonora
- **Notificación**: Email + Slack + Webhook
- **Ejemplos**:
  - Servicio de pagos no disponible
  - Base de datos no responde
  - API Gateway caído

##### **Alertas de Advertencia (WARNING)**
- **Color**: 🟡 Amarillo
- **Sonido**: Notificación suave
- **Notificación**: Slack + Webhook
- **Ejemplos**:
  - Latencia alta en servicios
  - Uso elevado de recursos
  - Tasa de error aumentando

##### **Alertas Informativas (INFO)**
- **Color**: 🔵 Azul
- **Sonido**: Sin sonido
- **Notificación**: Solo en dashboard
- **Ejemplos**:
  - Migración automática de proveedor IA
  - Backup completado
  - Actualización de sistema

#### **Configuración de Alertas**

##### **Canales de Notificación**
```env
# Email
ALERT_EMAIL=admin@company.com
ALERT_EMAIL_SMTP=smtp.company.com

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Webhook personalizado
ALERT_WEBHOOK_URL=https://webhook.company.com/alerts

# SMS (opcional)
SMS_WEBHOOK_URL=https://sms.company.com/send
```

##### **Umbrales de Alerta**
```javascript
const alertThresholds = {
  // Performance
  responseTime: 2000,        // 2 segundos
  errorRate: 5,              // 5%
  cpuUsage: 80,              // 80%
  memoryUsage: 85,           // 85%
  
  // Servicios críticos
  criticalServices: ['auth', 'payments', 'database', 'api_gateway'],
  
  // IA
  aiCostPerHour: 50,         // $50 por hora
  aiLatency: 3000,           // 3 segundos
  
  // Cooldown de alertas
  alertCooldown: 300000      // 5 minutos
};
```

### **📊 Reportes y Análisis**

#### **Reportes Automáticos**

##### **Reporte Diario**
- **Hora de envío**: 8:00 AM
- **Contenido**:
  - Resumen de métricas del día anterior
  - Alertas generadas
  - Servicios con problemas
  - Costos acumulados
  - Recomendaciones

##### **Reporte Semanal**
- **Día de envío**: Lunes 9:00 AM
- **Contenido**:
  - Tendencias de performance
  - Análisis de patrones
  - Comparación con semana anterior
  - Plan de optimización

##### **Reporte Mensual**
- **Día de envío**: Primer día del mes
- **Contenido**:
  - Análisis completo del mes
  - ROI de optimizaciones
  - Planificación estratégica
  - Comparación con objetivos

#### **Métricas Clave (KPIs)**

##### **Disponibilidad**
- **Uptime**: Objetivo 99.9%
- **MTTR**: Mean Time To Recovery < 5 minutos
- **MTBF**: Mean Time Between Failures

##### **Performance**
- **Response Time**: < 500ms promedio
- **Throughput**: > 1000 req/s
- **Error Rate**: < 1%

##### **Costos**
- **AI Costs**: < $1000/mes
- **Infrastructure Costs**: < $500/mes
- **Cost per Request**: < $0.01

---

## 🤖 **Para Agentes de IA**

### **🔌 API Reference**

#### **Endpoints Principales**

##### **Health Check API**
```http
GET /api/monitoring/health
GET /api/monitoring/health?detailed=true
GET /api/monitoring/health?services=auth,payments
GET /api/monitoring/health?services=ai_providers&detailed=true
```

**Respuesta Básica:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 86400,
  "version": "1.0.0",
  "environment": "production",
  "summary": {
    "healthyServices": 8,
    "totalServices": 8,
    "criticalIssues": 0,
    "activeUsers": 150,
    "totalRequests": 15000,
    "averageResponseTime": 250,
    "errorRate": 0.5
  }
}
```

**Respuesta Detallada:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "services": [
      {
        "service": "auth",
        "status": "healthy",
        "responseTime": 150,
        "uptime": 99.9,
        "lastCheck": "2024-01-15T10:30:00Z"
      }
    ],
    "systemMetrics": {
      "totalRequests": 15000,
      "averageResponseTime": 250,
      "errorRate": 0.5,
      "activeUsers": 150,
      "aiOperations": 500,
      "totalTokens": 50000,
      "totalCost": 25.50
    },
    "aiMetrics": {
      "totalOperations": 500,
      "averageResponseTime": 1200,
      "totalTokens": 50000,
      "totalCost": 25.50,
      "successRate": 98.5,
      "providerBreakdown": {
        "knotie": {
          "operations": 300,
          "averageResponseTime": 800,
          "totalTokens": 30000,
          "totalCost": 15.00
        },
        "openai": {
          "operations": 200,
          "averageResponseTime": 1800,
          "totalTokens": 20000,
          "totalCost": 10.50
        }
      }
    }
  }
}
```

##### **Metrics API**
```http
GET /api/monitoring/metrics
GET /api/monitoring/metrics?timeframe=hour
GET /api/monitoring/metrics?service=ai_providers
GET /api/monitoring/metrics?aggregation=avg&groupBy=hour
```

##### **Logs API**
```http
GET /api/monitoring/logs
GET /api/monitoring/logs?level=error
GET /api/monitoring/logs?category=ai_providers
GET /api/monitoring/logs?startDate=2024-01-15&endDate=2024-01-16
```

### **🤖 Casos de Uso para Agentes IA**

#### **1. Monitoreo Automático de Salud**

```typescript
// Agente IA verificando salud del sistema
async function monitorSystemHealth() {
  try {
    const response = await fetch('/api/monitoring/health?detailed=true');
    const healthData = await response.json();
    
    if (healthData.status === 'unhealthy') {
      await takeCorrectiveAction(healthData.details);
    } else if (healthData.status === 'degraded') {
      await investigateIssues(healthData.details);
    }
    
    return healthData;
  } catch (error) {
    await sendAlert('CRITICAL', 'Health check failed', { error: error.message });
  }
}
```

#### **2. Optimización de Costos de IA**

```typescript
// Agente IA optimizando costos
async function optimizeAICosts() {
  const aiMetrics = await getAIMetrics();
  const dailyBudget = 100; // $100 por día
  
  if (aiMetrics.totalCost > dailyBudget) {
    // Migrar a proveedor de menor costo
    await migrateToLowerCostProvider();
    
    // Notificar a humanos
    await sendAlert('WARNING', 'AI costs exceeded budget', {
      currentCost: aiMetrics.totalCost,
      budget: dailyBudget,
      action: 'migrated_to_lower_cost_provider'
    });
  }
}
```

#### **3. Detección de Anomalías**

```typescript
// Agente IA detectando patrones anómalos
async function detectAnomalies() {
  const metrics = await getMetrics('hour');
  const historicalData = await getHistoricalMetrics('week');
  
  // Análisis de patrones
  const anomalies = analyzePatterns(metrics, historicalData);
  
  for (const anomaly of anomalies) {
    if (anomaly.severity === 'high') {
      await sendAlert('WARNING', 'Anomaly detected', anomaly);
      await investigateAnomaly(anomaly);
    }
  }
}
```

#### **4. Auto-scaling Basado en Métricas**

```typescript
// Agente IA escalando recursos automáticamente
async function autoScaleResources() {
  const systemMetrics = await getSystemMetrics();
  
  if (systemMetrics.cpuUsage > 80) {
    await scaleUpResources('cpu');
    await sendAlert('INFO', 'Resources scaled up', {
      reason: 'high_cpu_usage',
      currentUsage: systemMetrics.cpuUsage
    });
  }
  
  if (systemMetrics.activeUsers > 1000) {
    await scaleUpResources('database');
    await sendAlert('INFO', 'Database scaled up', {
      reason: 'high_user_load',
      activeUsers: systemMetrics.activeUsers
    });
  }
}
```

#### **5. Migración Automática de Proveedores**

```typescript
// Agente IA migrando proveedores automáticamente
async function autoMigrateProviders() {
  const aiMetrics = await getAIMetrics();
  
  // Verificar performance de proveedores
  for (const [provider, metrics] of Object.entries(aiMetrics.providerBreakdown)) {
    if (metrics.averageResponseTime > 3000) {
      // Migrar a proveedor alternativo
      await migrateToAlternativeProvider(provider);
      
      await sendAlert('WARNING', 'Provider migrated', {
        from: provider,
        reason: 'high_latency',
        latency: metrics.averageResponseTime
      });
    }
  }
}
```

### **📊 Decision Making Framework**

#### **Matriz de Decisiones**

| Condición | Acción Automática | Notificación Humana |
|-----------|-------------------|-------------------|
| Error Rate > 5% | Investigar causa raíz | WARNING |
| Response Time > 2s | Optimizar queries | WARNING |
| AI Cost > Budget | Migrar a proveedor más barato | WARNING |
| Service Down | Activar fallback | CRITICAL |
| CPU > 90% | Auto-scale up | INFO |
| Memory > 95% | Reiniciar servicio | CRITICAL |

#### **Límites de Autonomía**

```typescript
const autonomyLimits = {
  // El agente IA puede tomar estas acciones automáticamente
  automaticActions: [
    'scale_up_resources',
    'migrate_ai_provider',
    'restart_degraded_service',
    'clear_cache',
    'optimize_queries'
  ],
  
  // Estas acciones requieren aprobación humana
  humanApprovalRequired: [
    'scale_down_production',
    'change_critical_config',
    'restart_database',
    'update_security_settings'
  ],
  
  // Estas acciones son solo informativas
  informationalOnly: [
    'send_daily_report',
    'log_metrics',
    'update_dashboard'
  ]
};
```

---

## 🔧 **Componentes del Sistema**

### **📝 LoggingService**

#### **Características**
- **Logs categorizados** por servicio y nivel
- **Procesamiento por lotes** para eficiencia
- **Envío a múltiples destinos** según categoría
- **Búsqueda y filtrado** avanzado

#### **Uso**
```typescript
import { logger } from '@/services/logging/LoggingService';

// Logs básicos
logger.info(LogCategory.AUTH, 'auth-service', 'User logged in');
logger.error(LogCategory.PAYMENTS, 'payment-service', 'Payment failed');

// Logs específicos por servicio
logger.auth(LogLevel.INFO, 'Login successful', { userId: '123' });
logger.payments(LogLevel.ERROR, 'Payment rejected', { transactionId: 'tx_123' });
logger.aiProvider(LogLevel.WARN, 'knotie', 'High latency', { latency: 2500 });
```

### **🔍 HealthMonitor**

#### **Características**
- **Health checks automáticos** cada 30 segundos
- **Monitoreo de servicios críticos**
- **Detección automática de problemas**
- **Estados de salud** (Healthy, Degraded, Unhealthy)

#### **Configuración**
```typescript
// Agregar health check personalizado
healthMonitor.addHealthCheck({
  name: 'custom-service',
  service: 'custom',
  check: async () => {
    const response = await fetch('/api/custom/health');
    return response.ok;
  },
  timeout: 5000,
  interval: 30000,
  critical: false
});
```

### **📈 MetricsCollector**

#### **Características**
- **Recolección automática** de métricas
- **Agregaciones** por tiempo
- **Métricas de sistema** y IA
- **Exportación** de datos

#### **Uso**
```typescript
import { metricsCollector } from '@/services/analytics/MetricsCollector';

// Registrar métricas
metricsCollector.recordMetric('api_requests', 1, { endpoint: '/api/users' });
metricsCollector.recordResponseTime('user_login', 150);
metricsCollector.recordAIMetric('knotie', 'text_generation', 1200, 150, 0.05, true);

// Obtener métricas
const systemMetrics = metricsCollector.getSystemMetrics();
const aiMetrics = metricsCollector.getAIMetrics();
```

---

## ⚙️ **Configuración e Instalación**

### **Variables de Entorno**

```env
# Configuración General
NODE_ENV=production
APP_VERSION=1.0.0

# Logging
LOG_LEVEL=info
LOG_RETENTION_DAYS=30
LOG_BATCH_SIZE=100
LOG_FLUSH_INTERVAL=5000

# Monitoring
HEALTH_CHECK_INTERVAL=30000
HEALTH_CHECK_TIMEOUT=10000
HEALTH_CHECK_RETRY_ATTEMPTS=3

# Alerts
ALERT_EMAIL=admin@company.com
ALERT_EMAIL_SMTP=smtp.company.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
ALERT_WEBHOOK_URL=https://webhook.company.com/alerts
ALERT_COOLDOWN=300000

# Metrics
METRICS_RETENTION_DAYS=90
METRICS_BATCH_SIZE=100
METRICS_FLUSH_INTERVAL=60000

# API
API_BASE_URL=https://api.company.com
API_TIMEOUT=10000

# Umbrales de Alerta
ALERT_ERROR_RATE=5
ALERT_RESPONSE_TIME=2000
ALERT_CPU_USAGE=80
ALERT_MEMORY_USAGE=85
ALERT_AI_COST_PER_HOUR=50
ALERT_AI_LATENCY=3000
```

### **Instalación**

#### **1. Instalar Dependencias**
```bash
npm install
```

#### **2. Configurar Variables de Entorno**
```bash
cp .env.example .env
# Editar .env con valores reales
```

#### **3. Iniciar Servicios**
```bash
# Iniciar aplicación
npm run dev

# Iniciar script de monitoreo (en terminal separada)
node scripts/monitoring/health-checker.js
```

#### **4. Verificar Instalación**
```bash
# Verificar health check
curl http://localhost:3000/api/monitoring/health

# Verificar dashboard
open http://localhost:3000/admin/intelligent-control-dashboard
```

---

## 🎯 **Casos de Uso**

### **Caso 1: Detección de Problemas de Performance**

#### **Escenario**
El sistema detecta latencia alta en el servicio de pagos.

#### **Flujo**
1. **Health Monitor** detecta response time > 2s
2. **Metrics Collector** registra la anomalía
3. **Dashboard** muestra alerta amarilla
4. **Agente IA** analiza patrones históricos
5. **Agente IA** toma acción correctiva automática
6. **Sistema** notifica a humanos por Slack

#### **Código de Ejemplo**
```typescript
// Agente IA respondiendo a problemas de performance
async function handlePerformanceIssue(service: string, metric: string, value: number) {
  const threshold = getThreshold(metric);
  
  if (value > threshold) {
    // Investigar causa
    const analysis = await analyzePerformanceIssue(service, metric);
    
    // Tomar acción automática
    if (analysis.canAutoResolve) {
      await takeAutomaticAction(analysis.recommendedAction);
      await sendAlert('INFO', 'Performance issue auto-resolved', analysis);
    } else {
      await sendAlert('WARNING', 'Performance issue requires human attention', analysis);
    }
  }
}
```

### **Caso 2: Optimización de Costos de IA**

#### **Escenario**
Los costos de IA exceden el presupuesto diario.

#### **Flujo**
1. **Metrics Collector** detecta costo > $100/día
2. **Agente IA** analiza uso por proveedor
3. **Agente IA** migra a proveedor más económico
4. **Sistema** registra la migración en logs
5. **Dashboard** actualiza métricas en tiempo real
6. **Reporte** incluye ahorro de costos

#### **Código de Ejemplo**
```typescript
// Agente IA optimizando costos
async function optimizeAICosts() {
  const aiMetrics = await getAIMetrics();
  const dailyBudget = 100;
  
  if (aiMetrics.totalCost > dailyBudget) {
    // Analizar proveedores
    const providerAnalysis = analyzeProviders(aiMetrics.providerBreakdown);
    const bestProvider = findBestProvider(providerAnalysis);
    
    // Migrar si es beneficioso
    if (bestProvider.cost < aiMetrics.totalCost * 0.8) {
      await migrateToProvider(bestProvider.name);
      
      await sendAlert('INFO', 'AI provider migrated for cost optimization', {
        from: getCurrentProvider(),
        to: bestProvider.name,
        savings: aiMetrics.totalCost - bestProvider.cost
      });
    }
  }
}
```

### **Caso 3: Escalado Automático**

#### **Escenario**
Aumento repentino de usuarios activos.

#### **Flujo**
1. **Metrics Collector** detecta usuarios > 1000
2. **Agente IA** analiza tendencias
3. **Agente IA** predice necesidad de escalado
4. **Sistema** escala recursos automáticamente
5. **Dashboard** muestra nuevos recursos
6. **Logs** registran acción de escalado

#### **Código de Ejemplo**
```typescript
// Agente IA escalando recursos
async function autoScaleResources() {
  const metrics = await getSystemMetrics();
  const predictions = await predictLoad(metrics);
  
  if (predictions.needScaling) {
    const scalingPlan = createScalingPlan(predictions);
    
    // Escalar automáticamente
    await executeScalingPlan(scalingPlan);
    
    await sendAlert('INFO', 'Resources auto-scaled', {
      reason: predictions.reason,
      actions: scalingPlan.actions,
      estimatedCost: scalingPlan.estimatedCost
    });
  }
}
```

---

## 🔧 **Troubleshooting**

### **Problemas Comunes**

#### **1. Dashboard No Carga**

**Síntomas:**
- Dashboard muestra "Loading..." indefinidamente
- Errores en consola del navegador

**Diagnóstico:**
```bash
# Verificar API endpoints
curl http://localhost:3000/api/monitoring/health

# Verificar logs del servidor
tail -f logs/server.log

# Verificar variables de entorno
echo $API_BASE_URL
```

**Solución:**
```bash
# Reiniciar servicios
npm run dev

# Verificar configuración
cat .env | grep MONITORING
```

#### **2. Alertas No Se Envían**

**Síntomas:**
- Problemas detectados pero no hay notificaciones
- Logs muestran errores de envío

**Diagnóstico:**
```bash
# Verificar configuración de Slack
curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"test"}'

# Verificar configuración de email
echo $ALERT_EMAIL
echo $ALERT_EMAIL_SMTP
```

**Solución:**
```bash
# Actualizar configuración
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
export ALERT_EMAIL="admin@company.com"

# Reiniciar script de monitoreo
pkill -f health-checker
node scripts/monitoring/health-checker.js
```

#### **3. Métricas No Se Actualizan**

**Síntomas:**
- Dashboard muestra datos antiguos
- Métricas no cambian

**Diagnóstico:**
```bash
# Verificar collector de métricas
curl http://localhost:3000/api/monitoring/metrics

# Verificar logs de métricas
tail -f logs/metrics.log
```

**Solución:**
```bash
# Reiniciar collector
pkill -f metrics-collector

# Limpiar cache
rm -rf cache/metrics

# Verificar configuración
cat .env | grep METRICS
```

#### **4. Health Checks Fallan**

**Síntomas:**
- Servicios marcados como "unhealthy" incorrectamente
- Falsos positivos

**Diagnóstico:**
```bash
# Verificar endpoints individuales
curl http://localhost:3000/api/auth/health
curl http://localhost:3000/api/payments/health

# Verificar timeouts
echo $HEALTH_CHECK_TIMEOUT
```

**Solución:**
```bash
# Ajustar timeouts
export HEALTH_CHECK_TIMEOUT=15000

# Verificar conectividad de red
ping api.company.com

# Revisar configuración de firewalls
```

### **Logs de Debugging**

#### **Habilitar Debug Mode**
```env
LOG_LEVEL=debug
DEBUG_MODE=true
```

#### **Logs Importantes**
```bash
# Logs de monitoreo
tail -f logs/monitoring.log

# Logs de métricas
tail -f logs/metrics.log

# Logs de alertas
tail -f logs/alerts.log

# Logs de health checks
tail -f logs/health-checks.json
```

---

## 📚 **API Reference**

### **Endpoints de Monitoreo**

#### **Health Check**
```http
GET /api/monitoring/health
GET /api/monitoring/health?detailed=true
GET /api/monitoring/health?services=auth,payments
```

**Parámetros:**
- `detailed` (boolean): Incluir detalles completos
- `services` (string): Servicios específicos a verificar

**Respuesta:**
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "ISO-8601",
  "uptime": 86400,
  "version": "1.0.0",
  "environment": "production",
  "summary": {
    "healthyServices": 8,
    "totalServices": 8,
    "criticalIssues": 0,
    "activeUsers": 150,
    "totalRequests": 15000,
    "averageResponseTime": 250,
    "errorRate": 0.5
  },
  "details": {
    "services": [...],
    "systemMetrics": {...},
    "aiMetrics": {...}
  }
}
```

#### **Metrics**
```http
GET /api/monitoring/metrics
GET /api/monitoring/metrics?timeframe=hour
GET /api/monitoring/metrics?service=ai_providers
GET /api/monitoring/metrics?aggregation=avg&groupBy=hour
```

**Parámetros:**
- `timeframe` (string): hour, day, week, month
- `service` (string): Servicio específico
- `aggregation` (string): avg, sum, min, max
- `groupBy` (string): minute, hour, day

**Respuesta:**
```json
{
  "metrics": [
    {
      "name": "api_requests",
      "value": 15000,
      "timestamp": "2024-01-15T10:30:00Z",
      "tags": {"endpoint": "/api/users"}
    }
  ],
  "aggregations": {
    "total": 15000,
    "average": 1000,
    "min": 500,
    "max": 2000
  }
}
```

#### **Logs**
```http
GET /api/monitoring/logs
GET /api/monitoring/logs?level=error
GET /api/monitoring/logs?category=ai_providers
GET /api/monitoring/logs?startDate=2024-01-15&endDate=2024-01-16
```

**Parámetros:**
- `level` (string): debug, info, warn, error, critical
- `category` (string): Categoría de log
- `startDate` (string): Fecha de inicio (ISO-8601)
- `endDate` (string): Fecha de fin (ISO-8601)
- `limit` (number): Número máximo de logs

**Respuesta:**
```json
{
  "logs": [
    {
      "id": "log_123",
      "timestamp": "2024-01-15T10:30:00Z",
      "level": "error",
      "category": "payments",
      "service": "payment-service",
      "message": "Payment failed",
      "details": {...},
      "userId": "user_123",
      "companyId": "company_456"
    }
  ],
  "total": 1000,
  "hasMore": true
}
```

### **Webhooks**

#### **Alert Webhook**
```http
POST /api/monitoring/webhooks/alerts
```

**Payload:**
```json
{
  "level": "WARNING",
  "message": "High latency detected",
  "details": {
    "service": "payment-service",
    "latency": 2500,
    "threshold": 2000
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "production"
}
```

#### **Metrics Webhook**
```http
POST /api/monitoring/webhooks/metrics
```

**Payload:**
```json
{
  "metrics": [
    {
      "name": "api_requests",
      "value": 1000,
      "timestamp": "2024-01-15T10:30:00Z",
      "tags": {"endpoint": "/api/users"}
    }
  ]
}
```

---

## 📖 **Glosario**

### **Términos Técnicos**

#### **A**
- **API Gateway**: Punto de entrada único para todas las APIs
- **APM**: Application Performance Monitoring
- **Auto-scaling**: Escalado automático de recursos

#### **B**
- **Batch Processing**: Procesamiento por lotes
- **Bottleneck**: Cuello de botella en el sistema

#### **C**
- **Cache**: Almacenamiento temporal de datos
- **Circuit Breaker**: Patrón para manejar fallos
- **Cooldown**: Período de espera entre alertas

#### **D**
- **Dashboard**: Panel de control visual
- **Debug**: Proceso de encontrar y corregir errores
- **Degraded**: Estado de servicio con problemas menores

#### **E**
- **Error Rate**: Tasa de errores
- **Event-driven**: Arquitectura basada en eventos

#### **F**
- **Fallback**: Mecanismo de respaldo
- **False Positive**: Alerta incorrecta

#### **H**
- **Health Check**: Verificación de salud de servicio
- **Hot Reload**: Recarga automática durante desarrollo

#### **I**
- **Infrastructure**: Infraestructura del sistema
- **Integration**: Integración entre sistemas

#### **L**
- **Latency**: Tiempo de respuesta
- **Load Balancing**: Distribución de carga

#### **M**
- **Metrics**: Métricas del sistema
- **Monitoring**: Monitoreo del sistema
- **MTBF**: Mean Time Between Failures
- **MTTR**: Mean Time To Recovery

#### **O**
- **Observability**: Observabilidad del sistema
- **Orchestration**: Orquestación de servicios

#### **P**
- **Performance**: Rendimiento del sistema
- **Pipeline**: Tubería de procesamiento

#### **R**
- **Response Time**: Tiempo de respuesta
- **Retry**: Reintento de operación

#### **S**
- **Scalability**: Escalabilidad del sistema
- **Service Mesh**: Malla de servicios
- **SIEM**: Security Information and Event Management
- **SLA**: Service Level Agreement

#### **T**
- **Throughput**: Capacidad de procesamiento
- **Timeout**: Tiempo límite de espera

#### **U**
- **Uptime**: Tiempo de actividad
- **User Experience**: Experiencia de usuario

---

## 📞 **Soporte**

### **Canales de Soporte**

#### **Para Agentes Humanos**
- **Email**: support@company.com
- **Slack**: #monitoring-support
- **Documentación**: docs.company.com/monitoring

#### **Para Agentes IA**
- **API**: /api/support
- **Webhook**: /api/support/webhook
- **Documentación**: docs.company.com/monitoring/api

### **Escalación**

#### **Nivel 1: Auto-resolución**
- Agentes IA resuelven automáticamente
- Sin intervención humana

#### **Nivel 2: Alerta Humana**
- Agentes IA detectan problema
- Humanos reciben notificación
- Humanos toman decisión

#### **Nivel 3: Intervención Crítica**
- Sistema no puede resolver automáticamente
- Humanos intervienen inmediatamente
- Escalación a equipo especializado

---

**🎯 Esta documentación proporciona todo lo necesario para que tanto agentes humanos como agentes de IA trabajen eficientemente con el sistema de monitoreo.** 