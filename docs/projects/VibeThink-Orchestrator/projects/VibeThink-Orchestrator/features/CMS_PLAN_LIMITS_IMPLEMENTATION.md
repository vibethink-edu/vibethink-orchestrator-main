# Implementación: Control de Límites por Plan en Strapi

**Versión:** 1.0.0  
**Fecha:** 2025-01-22  
**Autor:** AI Pair Platform (asistente de Marcelo Escallón)  
**Estado:** Planificado  
**Impacto:** Crítico - Control de costos y escalabilidad  

---

## Resumen Ejecutivo

Implementación de sistema de control de límites de contenido por plan comercial en Strapi, permitiendo gestionar automáticamente el uso de recursos según el plan contratado por cada empresa.

---

## Arquitectura de Control de Límites

### **1. Estructura de Datos**

```typescript
// Tipos de contenido con límites por plan
interface ContentLimits {
  snippets: {
    basic: 10,      // Plan Básico: 10 snippets
    pro: 50,        // Plan Pro: 50 snippets
    enterprise: -1  // Plan Enterprise: ilimitado
  },
  media: {
    basic: 100,     // 100MB
    pro: 500,       // 500MB
    enterprise: -1  // ilimitado
  },
  users: {
    basic: 5,       // 5 usuarios
    pro: 25,        // 25 usuarios
    enterprise: -1  // ilimitado
  },
  api_calls: {
    basic: 1000,    // 1000 llamadas/mes
    pro: 10000,     // 10000 llamadas/mes
    enterprise: -1  // ilimitado
  }
}

// Configuración por empresa
interface CompanyPlanConfig {
  company_id: string;
  plan: 'basic' | 'pro' | 'enterprise';
  current_usage: {
    snippets: number;
    media_mb: number;
    users: number;
    api_calls: number;
  };
  limits: ContentLimits;
  reset_date: string; // Fecha de reset mensual
}
```

### **2. Middleware de Validación**

```typescript
// Strapi middleware para validar límites
const planLimitsMiddleware = async (ctx, next) => {
  const { company_id } = ctx.state.user;
  const { plan, current_usage, limits } = await getCompanyPlanConfig(company_id);
  
  // Validar límites antes de crear contenido
  if (ctx.request.method === 'POST') {
    const contentType = ctx.request.url.split('/')[1]; // snippets, media, etc.
    const limit = limits[contentType][plan];
    
    if (limit !== -1 && current_usage[contentType] >= limit) {
      return ctx.badRequest(`Límite de ${contentType} alcanzado para el plan ${plan}`);
    }
  }
  
  await next();
  
  // Actualizar uso después de operación exitosa
  if (ctx.response.status < 400) {
    await updateCompanyUsage(company_id, contentType, ctx.request.method);
  }
};
```

### **3. Hook de Validación**

```typescript
// Strapi lifecycle hook
module.exports = {
  beforeCreate: async (event) => {
    const { data, params } = event;
    const company_id = data.company_id;
    
    // Validar límites antes de crear
    const canCreate = await validateContentLimit(company_id, 'snippets');
    if (!canCreate.allowed) {
      throw new Error(`Límite alcanzado: ${canCreate.message}`);
    }
  },
  
  afterCreate: async (event) => {
    const { result } = event;
    const company_id = result.company_id;
    
    // Actualizar contador de uso
    await incrementUsage(company_id, 'snippets', 1);
  }
};
```

---

## Implementación por Tipo de Contenido

### **1. Snippets**

```typescript
// Modelo de Snippet con validación
interface Snippet {
  id: string;
  company_id: string;
  title: string;
  content: string;
  context: string[];
  triggers: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Validación de límites para snippets
const validateSnippetLimit = async (company_id: string): Promise<ValidationResult> => {
  const config = await getCompanyPlanConfig(company_id);
  const currentCount = await countSnippets(company_id);
  const limit = config.limits.snippets[config.plan];
  
  if (limit === -1) {
    return { allowed: true, message: 'Ilimitado' };
  }
  
  if (currentCount >= limit) {
    return { 
      allowed: false, 
      message: `Límite de ${limit} snippets alcanzado. Actualice su plan.` 
    };
  }
  
  return { 
    allowed: true, 
    message: `${currentCount}/${limit} snippets utilizados` 
  };
};
```

### **2. Media (Imágenes, Videos, Documentos)**

```typescript
// Control de tamaño de archivos
const validateMediaLimit = async (company_id: string, fileSize: number): Promise<ValidationResult> => {
  const config = await getCompanyPlanConfig(company_id);
  const currentUsage = config.current_usage.media_mb;
  const limit = config.limits.media[config.plan];
  const fileSizeMB = fileSize / (1024 * 1024);
  
  if (limit === -1) {
    return { allowed: true, message: 'Ilimitado' };
  }
  
  if (currentUsage + fileSizeMB > limit) {
    return { 
      allowed: false, 
      message: `Límite de ${limit}MB alcanzado. Espacio disponible: ${limit - currentUsage}MB` 
    };
  }
  
  return { 
    allowed: true, 
    message: `${currentUsage + fileSizeMB}/${limit}MB utilizados` 
  };
};
```

### **3. Usuarios**

```typescript
// Control de usuarios por empresa
const validateUserLimit = async (company_id: string): Promise<ValidationResult> => {
  const config = await getCompanyPlanConfig(company_id);
  const currentUsers = await countCompanyUsers(company_id);
  const limit = config.limits.users[config.plan];
  
  if (limit === -1) {
    return { allowed: true, message: 'Ilimitado' };
  }
  
  if (currentUsers >= limit) {
    return { 
      allowed: false, 
      message: `Límite de ${limit} usuarios alcanzado. Actualice su plan.` 
    };
  }
  
  return { 
    allowed: true, 
    message: `${currentUsers}/${limit} usuarios` 
  };
};
```

---

## Dashboard de Control

### **1. Panel de Administración**

```typescript
// Componente de dashboard para empresas
const CompanyUsageDashboard = ({ companyId }) => {
  const { data: usage } = useCompanyUsage(companyId);
  
  return (
    <div className="usage-dashboard">
      <h2>Uso de Recursos</h2>
      
      <div className="usage-cards">
        <UsageCard 
          title="Snippets"
          current={usage.snippets}
          limit={usage.limits.snippets}
          plan={usage.plan}
        />
        
        <UsageCard 
          title="Almacenamiento"
          current={usage.media_mb}
          limit={usage.limits.media}
          plan={usage.plan}
          unit="MB"
        />
        
        <UsageCard 
          title="Usuarios"
          current={usage.users}
          limit={usage.limits.users}
          plan={usage.plan}
        />
        
        <UsageCard 
          title="API Calls"
          current={usage.api_calls}
          limit={usage.limits.api_calls}
          plan={usage.plan}
          period="mes"
        />
      </div>
      
      <PlanUpgradeCTA usage={usage} />
    </div>
  );
};
```

### **2. Alertas y Notificaciones**

```typescript
// Sistema de alertas por límites
const UsageAlerts = ({ usage }) => {
  const alerts = [];
  
  // Alerta al 80% de uso
  Object.entries(usage).forEach(([resource, data]) => {
    if (data.limit !== -1) {
      const percentage = (data.current / data.limit) * 100;
      
      if (percentage >= 80) {
        alerts.push({
          type: percentage >= 100 ? 'error' : 'warning',
          message: `${resource}: ${percentage.toFixed(1)}% de uso`,
          action: 'upgrade_plan'
        });
      }
    }
  });
  
  return (
    <div className="usage-alerts">
      {alerts.map(alert => (
        <Alert key={alert.message} type={alert.type}>
          {alert.message}
        </Alert>
      ))}
    </div>
  );
};
```

---

## API de Control

### **1. Endpoints de Gestión**

```typescript
// API endpoints para gestión de límites
const planLimitsAPI = {
  // Obtener configuración actual
  GET: '/api/company/plan-config',
  
  // Actualizar plan
  PUT: '/api/company/plan',
  
  // Obtener uso actual
  GET: '/api/company/usage',
  
  // Validar límite específico
  POST: '/api/company/validate-limit',
  
  // Obtener historial de uso
  GET: '/api/company/usage-history'
};

// Ejemplo de uso
const validateLimit = async (companyId: string, contentType: string) => {
  const response = await fetch('/api/company/validate-limit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ company_id: companyId, content_type: contentType })
  });
  
  return response.json();
};
```

### **2. Webhooks de Notificación**

```typescript
// Webhooks para notificaciones automáticas
const planWebhooks = {
  // Límite alcanzado
  'limit.reached': {
    url: '/webhooks/limit-reached',
    events: ['snippet.limit', 'media.limit', 'user.limit']
  },
  
  // Plan actualizado
  'plan.updated': {
    url: '/webhooks/plan-updated',
    events: ['plan.change', 'plan.upgrade', 'plan.downgrade']
  },
  
  // Uso mensual
  'usage.monthly': {
    url: '/webhooks/usage-report',
    events: ['usage.report', 'usage.reset']
  }
};
```

---

## Integración con Sistema de Billing

### **1. Sincronización con Stripe**

```typescript
// Sincronización con sistema de billing
const billingIntegration = {
  // Actualizar límites cuando cambia el plan
  async updatePlanLimits(companyId: string, newPlan: string) {
    const limits = getPlanLimits(newPlan);
    await updateCompanyPlanConfig(companyId, { plan: newPlan, limits });
    
    // Notificar a Stripe
    await stripe.subscriptions.update(companyId, {
      metadata: { plan: newPlan, limits: JSON.stringify(limits) }
    });
  },
  
  // Verificar límites antes de cobro
  async validateBillingLimits(companyId: string) {
    const usage = await getCompanyUsage(companyId);
    const config = await getCompanyPlanConfig(companyId);
    
    // Bloquear si excede límites
    if (usage.snippets > config.limits.snippets[config.plan]) {
      await blockCompany(companyId, 'limit_exceeded');
      return false;
    }
    
    return true;
  }
};
```

### **2. Métricas de Uso para Billing**

```typescript
// Métricas para facturación
const billingMetrics = {
  // Uso por empresa
  async getCompanyUsage(companyId: string) {
    return {
      snippets: await countSnippets(companyId),
      media_mb: await getMediaUsage(companyId),
      users: await countUsers(companyId),
      api_calls: await getAPICalls(companyId)
    };
  },
  
  // Uso agregado por plan
  async getPlanUsage(plan: string) {
    return {
      total_companies: await countCompaniesByPlan(plan),
      average_usage: await getAverageUsageByPlan(plan),
      overage_companies: await countOverageCompanies(plan)
    };
  }
};
```

---

## Planes de Implementación

### **Fase 1: Fundación (1 semana)**
- [ ] Configuración de modelos de límites en Strapi
- [ ] Implementación de middleware de validación
- [ ] Setup de hooks de lifecycle
- [ ] Configuración de base de datos

### **Fase 2: Controles Core (1 semana)**
- [ ] Validación de snippets
- [ ] Control de media
- [ ] Límites de usuarios
- [ ] Dashboard básico

### **Fase 3: Integración (1 semana)**
- [ ] Integración con sistema de billing
- [ ] Webhooks de notificación
- [ ] API de gestión
- [ ] Alertas automáticas

### **Fase 4: Optimización (1 semana)**
- [ ] Caching de límites
- [ ] Performance optimization
- [ ] Testing completo
- [ ] Documentación

---

## Métricas de Éxito

### **Técnicas:**
- Validación de límites: < 50ms
- Precisión de contadores: 100%
- Uptime del sistema: > 99.9%

### **Negocio:**
- Reducción de overage: > 90%
- Conversión a planes superiores: > 15%
- Satisfacción cliente: > 4.5/5

### **Operacionales:**
- Tiempo configuración límites: < 5 min
- Automatización de alertas: 100%
- Integración billing: tiempo real

---

## Conclusión

El control de límites por plan es fundamental para la escalabilidad y rentabilidad del negocio. Strapi proporciona todas las herramientas necesarias para implementar un sistema robusto y automatizado.

**Próximo paso:** Implementar Fase 1 del plan de control de límites.

---

## Historial de Cambios

- **2025-01-22** | AI Pair Platform (asistente de Marcelo Escallón) | Creación inicial de la documentación técnica para implementación de control de límites por plan en Strapi 