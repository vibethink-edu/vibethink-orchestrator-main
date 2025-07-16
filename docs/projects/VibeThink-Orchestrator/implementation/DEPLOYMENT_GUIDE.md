# 🚀 Guía de Despliegue - Sistema de Línea de Tiempo Universal

## 📋 **RESUMEN EJECUTIVO**

Esta guía proporciona instrucciones paso a paso para desplegar el **Sistema de Línea de Tiempo Universal** en el ambiente de producción de AI Pair Orchestrator Pro.

### **Componentes a Desplegar**
- ✅ Base de datos con 7 tablas principales
- ✅ Servicios backend (Timeline, Virtual Agents, Plan Limits)
- ✅ Sistema de monitoreo y alertas
- ✅ Componentes frontend
- ✅ Configuración de notificaciones
- ✅ Agentes virtuales especializados

---

## 🎯 **PRERREQUISITOS**

### **Requerimientos del Sistema**
- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior
- **Git**: v2.30.0 o superior
- **Supabase CLI**: v1.0.0 o superior
- **PowerShell**: v7.0 o superior (Windows)

### **Credenciales Requeridas**
- ✅ URL de Supabase
- ✅ Clave anónima de Supabase
- ✅ Clave de servicio de Supabase (para migraciones)
- ✅ Acceso a repositorio Git

### **Permisos Necesarios**
- 🔐 Acceso de administrador a Supabase
- 🔐 Permisos de escritura en base de datos
- 🔐 Acceso a funciones de Supabase
- 🔐 Permisos de despliegue en servidor

---

## 📦 **PASO 1: PREPARACIÓN DEL AMBIENTE**

### **1.1 Clonar Repositorio**
```bash
git clone https://github.com/ai-pair/orchestrator-pro.git
cd orchestrator-pro
git checkout main
```

### **1.2 Verificar Dependencias**
```bash
# Verificar Node.js
node --version  # Debe ser >= 18.0.0

# Verificar npm
npm --version   # Debe ser >= 9.0.0

# Verificar Supabase CLI
supabase --version  # Debe ser >= 1.0.0
```

### **1.3 Configurar Variables de Entorno**
```bash
# Copiar archivo de ejemplo
cp config/env.production.example config/env.production

# Editar variables de entorno
nano config/env.production
```

**Variables requeridas:**
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Environment
NODE_ENV=production
REACT_APP_ENVIRONMENT=production

# Monitoring
REACT_APP_MONITORING_ENABLED=true
REACT_APP_ALERT_WEBHOOK_URL=https://your-webhook-url.com

# Virtual Agents
REACT_APP_SALES_AGENT_ENABLED=true
REACT_APP_UNITY_INK_AGENT_ENABLED=true
```

---

## 🗄️ **PASO 2: CONFIGURACIÓN DE BASE DE DATOS**

### **2.1 Ejecutar Migraciones**
```bash
# Configurar Supabase
supabase login
supabase link --project-ref your-project-ref

# Ejecutar migraciones
supabase db push
```

### **2.2 Verificar Tablas Creadas**
```sql
-- Verificar que todas las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'timeline%' OR table_name = 'universal_timelines';

-- Verificar funciones
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'create_timeline%' OR routine_name LIKE 'update_milestone%';
```

### **2.3 Insertar Datos Iniciales**
```sql
-- Verificar configuraciones de tipos de línea de tiempo
SELECT * FROM timeline_type_configs;

-- Verificar planes por defecto
SELECT * FROM subscription_plans WHERE is_active = true;
```

---

## ⚙️ **PASO 3: DESPLIEGUE AUTOMATIZADO**

### **3.1 Ejecutar Script de Despliegue**
```powershell
# Ejecutar despliegue completo
.\scripts\deploy-timeline-system.ps1 -Environment production -SupabaseUrl "https://your-project.supabase.co" -SupabaseKey "your-service-key"

# Opciones disponibles:
# -SkipDatabase: Saltar migraciones de BD
# -SkipFrontend: Saltar construcción frontend
# -SkipNotifications: Saltar configuración notificaciones
# -Force: Continuar aunque fallen algunas pruebas
```

### **3.2 Verificar Proceso de Despliegue**
El script ejecutará automáticamente:

1. ✅ **Verificación de dependencias**
2. ✅ **Backup del sistema actual**
3. ✅ **Migraciones de base de datos**
4. ✅ **Instalación de dependencias**
5. ✅ **Construcción del frontend**
6. ✅ **Configuración de notificaciones**
7. ✅ **Ejecución de pruebas**
8. ✅ **Verificación de salud del sistema**
9. ✅ **Generación de reporte**

### **3.3 Monitorear Logs**
```bash
# Ver logs en tiempo real
Get-Content -Path "logs/deployment.log" -Wait

# Ver errores específicos
Get-Content -Path "logs/deployment.log" | Select-String "ERROR"
```

---

## 🔧 **PASO 4: CONFIGURACIÓN DE SERVICIOS**

### **4.1 Configurar TimelineService**
```typescript
// Verificar que el servicio se inicializa correctamente
import { timelineService } from '@/services/TimelineService';

// Probar creación de línea de tiempo
const timelineId = await timelineService.createTimeline({
  type: 'SHIPPING',
  context: { test: true },
  expectedEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
  companyId: 'test-company-id'
});

console.log('Timeline creada:', timelineId);
```

### **4.2 Configurar VirtualAgentService**
```typescript
// Verificar agentes virtuales
import { virtualAgentService } from '@/services/VirtualAgentService';

// Listar agentes disponibles
const salesAgents = await virtualAgentService.getAgentsByType('SALES');
const unityInkAgents = await virtualAgentService.getAgentsByType('UNITY_INK');

console.log('Agentes de ventas:', salesAgents.length);
console.log('Agentes UNITY INK:', unityInkAgents.length);
```

### **4.3 Configurar PlanLimitService**
```typescript
// Verificar gestión de límites
import { planLimitService } from '@/services/PlanLimitService';

// Obtener planes activos
const activePlans = await planLimitService.getActivePlans();
console.log('Planes activos:', activePlans.length);

// Verificar límites de empresa
const limits = await planLimitService.getCompanyLimits('test-company-id');
console.log('Límites configurados:', limits.length);
```

---

## 📊 **PASO 5: CONFIGURACIÓN DE MONITOREO**

### **5.1 Inicializar MonitoringService**
```typescript
// Verificar monitoreo automático
import { monitoringService } from '@/services/MonitoringService';

// Obtener dashboard de métricas
const dashboard = await monitoringService.getMetricsDashboard();
console.log('Estado del sistema:', dashboard.summary);

// Verificar alertas activas
const alerts = await monitoringService.getSystemAlerts();
console.log('Alertas activas:', alerts.filter(a => a.status === 'ACTIVE').length);
```

### **5.2 Configurar Alertas Personalizadas**
```typescript
// Crear regla de alerta personalizada
const alertRule = await monitoringService.createAlertRule({
  name: 'High Timeline Usage',
  description: 'Alerta cuando se crean muchas líneas de tiempo',
  metric: 'timelines_created_per_hour',
  condition: 'GREATER_THAN',
  threshold: 100,
  severity: 'MEDIUM',
  actions: ['CREATE_ALERT', 'NOTIFY_ADMINS'],
  isActive: true
});
```

### **5.3 Configurar Webhooks**
```bash
# Configurar webhook para notificaciones
curl -X POST "https://your-project.supabase.co/functions/v1/webhook-config" \
  -H "Authorization: Bearer your-service-key" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-webhook-url.com/notifications",
    "events": ["timeline_created", "milestone_completed", "alert_triggered"]
  }'
```

---

## 🧪 **PASO 6: PRUEBAS Y VERIFICACIÓN**

### **6.1 Pruebas Unitarias**
```bash
# Ejecutar pruebas unitarias
npm test

# Ejecutar pruebas con coverage
npm run test:coverage

# Ejecutar pruebas específicas
npm test -- --testNamePattern="TimelineService"
```

### **6.2 Pruebas de Integración**
```bash
# Ejecutar pruebas de integración
npm run test:integration

# Pruebas de base de datos
npm run test:db

# Pruebas de API
npm run test:api
```

### **6.3 Pruebas End-to-End**
```bash
# Ejecutar pruebas E2E
npm run test:e2e

# Pruebas de flujo completo
npm run test:e2e:timeline-flow
```

### **6.4 Verificación Manual**
```bash
# Verificar endpoints críticos
curl -X GET "https://your-project.supabase.co/rest/v1/universal_timelines" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"

# Verificar funciones
curl -X POST "https://your-project.supabase.co/rest/v1/rpc/create_timeline" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{"p_type": "TEST", "p_context": {}, "p_expected_end_time": "2025-01-25T00:00:00Z", "p_company_id": "test"}'
```

---

## 🔍 **PASO 7: VERIFICACIÓN DE SALUD**

### **7.1 Verificar Componentes del Sistema**
```typescript
// Verificar salud del sistema
const healthChecks = await monitoringService.getSystemHealth();

healthChecks.forEach(check => {
  console.log(`${check.component}: ${check.status} (${check.responseTime}ms)`);
  
  if (check.status === 'DOWN') {
    console.error(`❌ ${check.component} está caído: ${check.error}`);
  }
});
```

### **7.2 Verificar Métricas Clave**
```typescript
// Obtener métricas del sistema
const dashboard = await monitoringService.getMetricsDashboard();

console.log('📊 Métricas del Sistema:');
console.log(`- Métricas totales: ${dashboard.summary.totalMetrics}`);
console.log(`- Alertas activas: ${dashboard.summary.activeAlerts}`);
console.log(`- Componentes saludables: ${dashboard.summary.healthyComponents}`);
console.log(`- Componentes degradados: ${dashboard.summary.degradedComponents}`);
console.log(`- Componentes caídos: ${dashboard.summary.downComponents}`);
```

### **7.3 Verificar Funcionalidad Crítica**
```typescript
// Probar creación de línea de tiempo
const testTimeline = await timelineService.createTimeline({
  type: 'SHIPPING',
  context: { 
    customer: 'Test Customer',
    orderId: 'TEST-001',
    destination: 'Test Address'
  },
  expectedEndTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 horas
  companyId: 'test-company-id'
});

console.log('✅ Línea de tiempo creada:', testTimeline);

// Probar agente de ventas
const salesResult = await virtualAgentService.executeSalesAgent({
  customerInfo: {
    name: 'Test Customer',
    email: 'test@example.com',
    company: 'Test Company',
    industry: 'Technology',
    size: 'MEDIUM'
  },
  requirements: {
    features: ['timeline', 'analytics'],
    integrations: ['slack', 'email'],
    users: 25,
    budget: { min: 5000, max: 15000, currency: 'USD' }
  },
  timeline: {
    startDate: new Date(),
    expectedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
});

console.log('✅ Agente de ventas ejecutado:', salesResult.success);
```

---

## 📈 **PASO 8: OPTIMIZACIÓN Y TUNING**

### **8.1 Optimizar Base de Datos**
```sql
-- Analizar rendimiento de consultas
EXPLAIN ANALYZE SELECT * FROM universal_timelines WHERE company_id = 'test-company-id';

-- Verificar índices
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename LIKE 'timeline%'
ORDER BY idx_scan DESC;

-- Optimizar estadísticas
ANALYZE universal_timelines;
ANALYZE timeline_milestones;
ANALYZE timeline_alerts;
```

### **8.2 Configurar Caché**
```typescript
// Configurar caché para métricas frecuentes
const cacheConfig = {
  timelineCache: {
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 1000
  },
  metricsCache: {
    ttl: 30 * 1000, // 30 segundos
    maxSize: 100
  }
};
```

### **8.3 Optimizar Consultas**
```typescript
// Implementar paginación para listas grandes
const timelines = await timelineService.getTimelinesByCompany(companyId, {
  limit: 50,
  offset: 0
});

// Implementar filtros eficientes
const activeTimelines = await timelineService.getTimelinesByCompany(companyId, {
  status: 'ACTIVE',
  type: 'SHIPPING'
});
```

---

## 🚨 **PASO 9: CONFIGURACIÓN DE ALERTAS**

### **9.1 Alertas de Sistema**
```typescript
// Configurar alertas críticas
const criticalAlerts = [
  {
    name: 'Database Connection Failure',
    metric: 'database_connections',
    condition: 'LESS_THAN',
    threshold: 1,
    severity: 'CRITICAL',
    actions: ['CREATE_ALERT', 'NOTIFY_ADMINS', 'ESCALATE']
  },
  {
    name: 'High Error Rate',
    metric: 'error_rate',
    condition: 'GREATER_THAN',
    threshold: 10,
    severity: 'CRITICAL',
    actions: ['CREATE_ALERT', 'NOTIFY_ADMINS', 'SCALE_RESOURCES']
  }
];
```

### **9.2 Alertas de Negocio**
```typescript
// Configurar alertas de negocio
const businessAlerts = [
  {
    name: 'Timeline SLA Breach',
    metric: 'timeline_sla_breach',
    condition: 'GREATER_THAN',
    threshold: 0,
    severity: 'HIGH',
    actions: ['CREATE_ALERT', 'NOTIFY_STAKEHOLDERS']
  },
  {
    name: 'Plan Limit Warning',
    metric: 'plan_usage_percentage',
    condition: 'GREATER_THAN',
    threshold: 90,
    severity: 'MEDIUM',
    actions: ['CREATE_ALERT', 'SUGGEST_UPGRADE']
  }
];
```

---

## 📋 **PASO 10: DOCUMENTACIÓN Y CAPACITACIÓN**

### **10.1 Documentación Técnica**
```bash
# Generar documentación de API
npm run docs:generate

# Generar documentación de componentes
npm run docs:components

# Generar guías de usuario
npm run docs:user-guides
```

### **10.2 Capacitación del Equipo**
```bash
# Crear materiales de capacitación
mkdir -p docs/training
cp docs/user-documentation/* docs/training/

# Crear videos de demostración
# (Usar herramientas como Loom o similar)
```

### **10.3 Runbook de Operaciones**
```markdown
# Runbook de Operaciones - Sistema de Línea de Tiempo

## Procedimientos de Emergencia

### 1. Sistema Caído
1. Verificar logs: `tail -f logs/system.log`
2. Reiniciar servicios: `npm run restart:services`
3. Verificar base de datos: `supabase db status`
4. Contactar equipo de desarrollo

### 2. Base de Datos Lenta
1. Verificar conexiones: `SELECT count(*) FROM pg_stat_activity;`
2. Analizar consultas lentas: `SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;`
3. Optimizar índices si es necesario
4. Escalar recursos si es necesario

### 3. Alertas Críticas
1. Revisar dashboard de monitoreo
2. Identificar causa raíz
3. Ejecutar acciones automáticas
4. Notificar stakeholders según severidad
```

---

## ✅ **VERIFICACIÓN FINAL**

### **Checklist de Despliegue**
- [ ] ✅ Base de datos migrada correctamente
- [ ] ✅ Servicios backend funcionando
- [ ] ✅ Frontend construido y desplegado
- [ ] ✅ Monitoreo configurado y activo
- [ ] ✅ Alertas configuradas y funcionando
- [ ] ✅ Pruebas pasando exitosamente
- [ ] ✅ Documentación actualizada
- [ ] ✅ Equipo capacitado
- [ ] ✅ Runbook de operaciones creado
- [ ] ✅ Backup configurado

### **Métricas de Éxito**
- 🎯 **Tiempo de respuesta**: < 2 segundos
- 🎯 **Disponibilidad**: > 99.9%
- 🎯 **Tasa de errores**: < 1%
- 🎯 **Cobertura de pruebas**: > 80%
- 🎯 **Tiempo de recuperación**: < 5 minutos

---

## 📞 **SOPORTE POST-DESPLIEGUE**

### **Contactos de Emergencia**
- **Desarrollo**: dev-team@ai-pair.com
- **Operaciones**: ops-team@ai-pair.com
- **Soporte**: support@ai-pair.com

### **Recursos Adicionales**
- 📚 [Documentación de API](../api/README.md)
- 📚 [Guía de Usuario](../user-documentation/README.md)
- 📚 [Troubleshooting](../troubleshooting/README.md)
- 📚 [FAQ](../faq/README.md)

### **Próximos Pasos**
1. 🚀 **Monitoreo continuo** del sistema
2. 📊 **Análisis de métricas** y optimización
3. 🔄 **Actualizaciones regulares** y mantenimiento
4. 📈 **Escalabilidad** según crecimiento
5. 🎯 **Mejoras continuas** basadas en feedback

---

**🎉 ¡El Sistema de Línea de Tiempo Universal está listo para producción!**

*Para soporte técnico adicional, contactar al equipo de desarrollo de AI Pair Platform.* 