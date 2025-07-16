# 🚀 Guía de Referencia Rápida - Sistema de Monitoreo

## 👥 **Para Agentes Humanos**

### **🎛️ Dashboard - Acceso Rápido**

```
URL: http://localhost:3000/admin/intelligent-control-dashboard
Usuario: admin@company.com
```

### **🔍 Indicadores Visuales**

| Color | Estado | Acción |
|-------|--------|--------|
| 🟢 Verde | Saludable | Ninguna |
| 🟡 Amarillo | Degradado | Monitorear |
| 🔴 Rojo | No Saludable | Intervenir |

### **🚨 Alertas - Respuesta Rápida**

#### **CRÍTICA (🔴)**
- **Servicio caído**: Reiniciar servicio
- **Base de datos no responde**: Verificar conectividad
- **API Gateway caído**: Verificar configuración

#### **ADVERTENCIA (🟡)**
- **Latencia alta**: Optimizar queries
- **Uso elevado de recursos**: Considerar escalado
- **Tasa de error aumentando**: Investigar causa

#### **INFORMATIVA (🔵)**
- **Migración automática**: Solo informativo
- **Backup completado**: Solo informativo

### **📊 Métricas Clave**

| Métrica | Objetivo | Alerta |
|---------|----------|--------|
| Uptime | > 99.9% | < 99% |
| Response Time | < 500ms | > 2s |
| Error Rate | < 1% | > 5% |
| AI Cost | < $1000/mes | > $1000/mes |

### **🔧 Comandos Útiles**

```bash
# Verificar salud del sistema
curl http://localhost:3000/api/monitoring/health

# Ver logs recientes
tail -f logs/monitoring.log

# Reiniciar script de monitoreo
pkill -f health-checker && node scripts/monitoring/health-checker.js

# Verificar configuración
cat .env | grep MONITORING
```

---

## 🤖 **Para Agentes de IA**

### **🔌 API Endpoints Principales**

#### **Health Check**
```http
GET /api/monitoring/health
GET /api/monitoring/health?detailed=true
GET /api/monitoring/health?services=auth,payments
```

#### **Métricas**
```http
GET /api/monitoring/metrics
GET /api/monitoring/metrics?timeframe=hour
GET /api/monitoring/metrics?service=ai_providers
```

#### **Logs**
```http
GET /api/monitoring/logs
GET /api/monitoring/logs?level=error
GET /api/monitoring/logs?category=ai_providers
```

### **🤖 Casos de Uso Automáticos**

#### **1. Monitoreo de Salud**
```typescript
async function monitorHealth() {
  const health = await fetch('/api/monitoring/health?detailed=true');
  const data = await health.json();
  
  if (data.status === 'unhealthy') {
    await takeCorrectiveAction(data.details);
  }
}
```

#### **2. Optimización de Costos**
```typescript
async function optimizeCosts() {
  const aiMetrics = await fetch('/api/monitoring/metrics?service=ai_providers');
  const data = await aiMetrics.json();
  
  if (data.totalCost > 100) {
    await migrateToLowerCostProvider();
  }
}
```

#### **3. Auto-scaling**
```typescript
async function autoScale() {
  const metrics = await fetch('/api/monitoring/metrics');
  const data = await metrics.json();
  
  if (data.cpuUsage > 80) {
    await scaleUpResources('cpu');
  }
}
```

### **📊 Umbrales de Decisión**

| Métrica | Umbral | Acción Automática |
|---------|--------|-------------------|
| Error Rate | > 5% | Investigar causa |
| Response Time | > 2s | Optimizar |
| AI Cost | > $100/día | Migrar proveedor |
| CPU Usage | > 80% | Scale up |
| Memory Usage | > 85% | Reiniciar servicio |

### **🚨 Envío de Alertas**

```typescript
async function sendAlert(level: string, message: string, details: any) {
  await fetch('/api/monitoring/alerts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, message, details })
  });
}
```

---

## 🔧 **Configuración Rápida**

### **Variables de Entorno Esenciales**

```env
# Alerts
ALERT_EMAIL=admin@company.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
ALERT_WEBHOOK_URL=https://webhook.company.com/alerts

# Monitoring
HEALTH_CHECK_INTERVAL=30000
HEALTH_CHECK_TIMEOUT=10000

# API
API_BASE_URL=https://api.company.com
```

### **Inicio Rápido**

```bash
# 1. Instalar
npm install

# 2. Configurar
cp .env.example .env
# Editar .env

# 3. Iniciar
npm run dev

# 4. Monitoreo (terminal separada)
node scripts/monitoring/health-checker.js
```

---

## 📞 **Contactos de Emergencia**

### **Agentes Humanos**
- **Soporte Técnico**: support@company.com
- **Slack**: #monitoring-support
- **Teléfono**: +1-555-MONITOR

### **Agentes IA**
- **API Support**: /api/support
- **Webhook**: /api/support/webhook
- **Documentación**: docs.company.com/monitoring/api

---

## 🎯 **Checklist de Verificación**

### **Diario (Agentes Humanos)**
- [ ] Revisar dashboard al inicio del día
- [ ] Verificar alertas pendientes
- [ ] Revisar métricas de performance
- [ ] Verificar costos de IA

### **Semanal (Agentes Humanos)**
- [ ] Revisar reporte semanal
- [ ] Analizar tendencias de performance
- [ ] Verificar configuración de alertas
- [ ] Actualizar documentación

### **Continuo (Agentes IA)**
- [ ] Monitorear health checks cada 30s
- [ ] Analizar métricas en tiempo real
- [ ] Tomar acciones automáticas según umbrales
- [ ] Enviar alertas cuando sea necesario

---

**⚡ Esta guía de referencia rápida proporciona acceso inmediato a las funciones más importantes del sistema de monitoreo para ambos tipos de agentes.** 