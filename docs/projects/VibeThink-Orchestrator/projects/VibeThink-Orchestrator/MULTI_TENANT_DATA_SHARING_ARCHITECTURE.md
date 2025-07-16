# 🔄 Arquitectura de Compartición Controlada de Datos - Multi-Tenant

**Versión:** 1.0.0  
**Fecha:** 2025-01-22  
**Autor:** AI Pair Platform  
**Estado:** **ARQUITECTURA CRÍTICA - DISEÑO COMPLETO**  

---

## 🎯 **VISIÓN GENERAL**

### **Problema Central**
¿Cómo compartir datos del tenant AI-PAIR con clientes sin violar el aislamiento multi-tenant?

### **Principio Fundamental**
```typescript
const SHARING_PRINCIPLE = {
  rule: "Los datos de AI-PAIR se comparten SOLO cuando es necesario para el funcionamiento del servicio",
  isolation: "Aislamiento total por defecto",
  sharing: "Compartición controlada y explícita",
  audit: "Audit completo de toda compartición"
};
```

---

## 🏗️ **ARQUITECTURA DE COMPARTICIÓN**

### **Modelo de Datos por Capas**
```typescript
const DATA_LAYERS = {
  // Capa 1: Datos Privados AI-PAIR (NUNCA se comparten)
  VibeThinkPrivate: {
    description: "Datos internos de AI-PAIR",
    examples: [
      "Estrategia de negocio",
      "Finanzas internas",
      "Roadmap de desarrollo",
      "Información de empleados",
      "Datos de desarrollo"
    ],
    sharing: "NUNCA",
    isolation: "Total"
  },
  
  // Capa 2: Datos de Servicio (Se comparten según necesidad)
  serviceData: {
    description: "Datos necesarios para el funcionamiento del servicio",
    examples: [
      "Configuración de planes de suscripción",
      "Features disponibles por plan",
      "Límites de uso",
      "Templates de email",
      "Documentación de API"
    ],
    sharing: "CONTROLADO",
    isolation: "Por plan de suscripción"
  },
  
  // Capa 3: Datos de Plataforma (Se comparten con todos)
  platformData: {
    description: "Datos de la plataforma disponibles para todos",
    examples: [
      "Términos de servicio",
      "Política de privacidad",
      "Documentación pública",
      "Status de la plataforma",
      "Noticias y actualizaciones"
    ],
    sharing: "PÚBLICO",
    isolation: "Ninguna"
  }
};
```

### **Mecanismos de Compartición**
```typescript
const SHARING_MECHANISMS = {
  // 1. RLS Policies con Compartición Controlada
  rlsSharing: {
    mechanism: "Row Level Security con políticas de compartición",
    implementation: `
      -- Política para datos de servicio
      CREATE POLICY "service_data_sharing" ON service_configurations
      FOR SELECT USING (
        company_id = 'AI-PAIR-UUID' OR 
        (company_id = auth.jwt() ->> 'company_id' AND 
         subscription_plan IN (SELECT available_plans FROM ai_pair_config))
      );
    `,
    control: "Control granular por plan de suscripción"
  },
  
  // 2. API Gateway con Validación
  apiGateway: {
    mechanism: "API Gateway con validación de permisos",
    implementation: `
      // Validación en middleware
      const validateSharingAccess = (req, res, next) => {
        const { company_id, subscription_plan } = req.user;
        const { data_type } = req.params;
        
        if (data_type === 'service_data') {
          const hasAccess = await checkServiceDataAccess(company_id, subscription_plan);
          if (!hasAccess) return res.status(403).json({ error: 'Access denied' });
        }
        
        next();
      };
    `,
    control: "Validación en cada request"
  },
  
  // 3. Views de Base de Datos
  databaseViews: {
    mechanism: "Views específicas para compartición",
    implementation: `
      -- View para datos de servicio compartidos
      CREATE VIEW shared_service_data AS
      SELECT 
        feature_name,
        feature_description,
        available_in_plans,
        limits,
        created_at
      FROM ai_pair_features
      WHERE is_public = true;
      
      -- RLS en la view
      CREATE POLICY "shared_service_data_access" ON shared_service_data
      FOR SELECT USING (
        auth.jwt() ->> 'company_id' IS NOT NULL
      );
    `,
    control: "Datos filtrados y seguros"
  }
};
```

---

## 📊 **TIPOS DE DATOS Y COMPARTICIÓN**

### **1. Datos de Desarrollo (NUNCA se comparten)**
```typescript
const DEVELOPMENT_DATA = {
  // Datos del módulo de desarrollo
  developmentModule: {
    projects: "Proyectos internos de AI-PAIR",
    tasks: "Tareas de desarrollo",
    milestones: "Hitos internos",
    timeLogs: "Logs de tiempo de desarrolladores",
    reports: "Reportes internos de desarrollo",
    sharing: "NUNCA",
    reason: "Información confidencial de desarrollo"
  },
  
  // Datos de infraestructura
  infrastructure: {
    serverConfigs: "Configuración de servidores",
    databaseConfigs: "Configuración de base de datos",
    securityConfigs: "Configuración de seguridad",
    sharing: "NUNCA",
    reason: "Seguridad de infraestructura"
  }
};
```

### **2. Datos de Servicio (Compartición Controlada)**
```typescript
const SERVICE_DATA = {
  // Configuración de planes
  subscriptionPlans: {
    data: [
      "Nombre del plan",
      "Precio",
      "Features incluidas",
      "Límites de uso",
      "Restricciones"
    ],
    sharing: "CONTROLADO",
    access: "Clientes según su plan",
    example: "Cliente en plan BASIC ve solo features de BASIC"
  },
  
  // Features de la plataforma
  platformFeatures: {
    data: [
      "Lista de features disponibles",
      "Descripción de features",
      "Estado de features (beta, stable)",
      "Documentación de features"
    ],
    sharing: "CONTROLADO",
    access: "Según plan de suscripción",
    example: "Cliente ve solo features de su plan"
  },
  
  // Templates y configuraciones
  templates: {
    data: [
      "Templates de email",
      "Templates de landing pages",
      "Configuraciones por defecto",
      "Guías de uso"
    ],
    sharing: "CONTROLADO",
    access: "Según plan y permisos",
    example: "Templates premium solo para planes premium"
  }
};
```

### **3. Datos de Plataforma (Compartición Pública)**
```typescript
const PLATFORM_DATA = {
  // Información pública
  publicInfo: {
    data: [
      "Términos de servicio",
      "Política de privacidad",
      "Status de la plataforma",
      "Noticias y actualizaciones",
      "Documentación pública"
    ],
    sharing: "PÚBLICO",
    access: "Todos los usuarios",
    example: "Cualquier usuario puede ver el status de la plataforma"
  },
  
  // Analytics agregados
  aggregatedAnalytics: {
    data: [
      "Número total de usuarios",
      "Features más populares",
      "Satisfacción general",
      "Uptime de la plataforma"
    ],
    sharing: "PÚBLICO",
    access: "Todos los usuarios",
    example: "Dashboard público de métricas de la plataforma"
  }
};
```

---

## 🔧 **IMPLEMENTACIÓN TÉCNICA**

### **Estructura de Base de Datos**
```sql
-- Tabla para controlar compartición
CREATE TABLE data_sharing_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type VARCHAR(50) NOT NULL, -- 'PRIVATE', 'SERVICE', 'PUBLIC'
    table_name VARCHAR(100) NOT NULL,
    column_name VARCHAR(100),
    sharing_level VARCHAR(50) NOT NULL, -- 'NONE', 'PLAN_BASED', 'PUBLIC'
    subscription_plans TEXT[], -- Array de planes que pueden acceder
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para audit de compartición
CREATE TABLE data_sharing_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    data_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'READ', 'WRITE', 'SHARE'
    accessed_by UUID REFERENCES user_profiles(id),
    accessed_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- RLS para audit
ALTER TABLE data_sharing_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_pair_audit_access" ON data_sharing_audit
    FOR ALL USING (company_id = 'AI-PAIR-UUID');
```

### **Middleware de Validación**
```typescript
const SHARING_MIDDLEWARE = {
  // Middleware para validar acceso a datos compartidos
  validateSharingAccess: async (req, res, next) => {
    const { company_id, subscription_plan, role } = req.user;
    const { data_type, table_name } = req.params;
    
    try {
      // Verificar configuración de compartición
      const sharingConfig = await getSharingConfig(data_type, table_name);
      
      if (!sharingConfig) {
        return res.status(403).json({ 
          error: 'Data sharing not configured' 
        });
      }
      
      // Validar acceso según nivel de compartición
      switch (sharingConfig.sharing_level) {
        case 'NONE':
          if (company_id !== 'AI-PAIR-UUID') {
            return res.status(403).json({ 
              error: 'Access denied - private data' 
            });
          }
          break;
          
        case 'PLAN_BASED':
          if (!sharingConfig.subscription_plans.includes(subscription_plan)) {
            return res.status(403).json({ 
              error: 'Access denied - plan not authorized' 
            });
          }
          break;
          
        case 'PUBLIC':
          // Acceso público permitido
          break;
          
        default:
          return res.status(403).json({ 
            error: 'Invalid sharing level' 
          });
      }
      
      // Log audit
      await logSharingAudit({
        company_id,
        data_type,
        table_name,
        action: 'READ',
        accessed_by: req.user.id,
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      });
      
      next();
    } catch (error) {
      console.error('Sharing validation error:', error);
      return res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }
};
```

### **API Endpoints con Compartición**
```typescript
const SHARING_API_ENDPOINTS = {
  // Endpoint para datos de servicio
  '/api/shared/service-data': {
    method: 'GET',
    description: 'Obtener datos de servicio según plan',
    access: 'Plan-based',
    implementation: `
      app.get('/api/shared/service-data', 
        validateSharingAccess,
        async (req, res) => {
          const { subscription_plan } = req.user;
          
          const serviceData = await db
            .from('ai_pair_service_data')
            .select('*')
            .eq('available_in_plans', subscription_plan)
            .eq('is_active', true);
          
          res.json(serviceData);
        }
      );
    `
  },
  
  // Endpoint para datos públicos
  '/api/shared/platform-data': {
    method: 'GET',
    description: 'Obtener datos públicos de la plataforma',
    access: 'Public',
    implementation: `
      app.get('/api/shared/platform-data',
        async (req, res) => {
          const platformData = await db
            .from('ai_pair_platform_data')
            .select('*')
            .eq('is_public', true)
            .eq('is_active', true);
          
          res.json(platformData);
        }
      );
    `
  }
};
```

---

## 🎯 **CASOS DE USO ESPECÍFICOS**

### **Caso 1: Cliente quiere ver features disponibles**
```typescript
const USE_CASE_1 = {
  scenario: "Cliente en plan BASIC quiere ver features disponibles",
  flow: [
    "1. Cliente hace request a /api/shared/service-data/features",
    "2. Middleware valida que cliente tiene plan BASIC",
    "3. Sistema filtra features solo para plan BASIC",
    "4. Cliente recibe lista de features de su plan",
    "5. Audit log registra el acceso"
  ],
  dataShared: [
    "feature_name: 'CDP Basic'",
    "feature_description: 'Customer Data Platform básico'",
    "limits: '1000 perfiles'",
    "available_in_plans: ['BASIC', 'PRO', 'ENTERPRISE']"
  ],
  dataNotShared: [
    "Precios internos de desarrollo",
    "Roadmap de features futuras",
    "Datos de competencia",
    "Métricas internas de uso"
  ]
};
```

### **Caso 2: Cliente quiere ver status de la plataforma**
```typescript
const USE_CASE_2 = {
  scenario: "Cliente quiere verificar si la plataforma está funcionando",
  flow: [
    "1. Cliente hace request a /api/shared/platform-data/status",
    "2. No se requiere validación (datos públicos)",
    "3. Sistema devuelve status actual de la plataforma",
    "4. Cliente recibe información de uptime y status",
    "5. Audit log registra el acceso público"
  ],
  dataShared: [
    "status: 'OPERATIONAL'",
    "uptime: '99.9%'",
    "last_incident: '2025-01-15'",
    "maintenance_schedule: 'Next: 2025-02-01'"
  ],
  dataNotShared: [
    "Detalles técnicos de la infraestructura",
    "Logs de errores específicos",
    "Información de servidores",
    "Métricas de performance internas"
  ]
};
```

### **Caso 3: AI-PAIR quiere ver datos de desarrollo**
```typescript
const USE_CASE_3 = {
  scenario: "Equipo de AI-PAIR quiere ver progreso de desarrollo",
  flow: [
    "1. Usuario AI-PAIR hace request a /api/development/projects",
    "2. Middleware valida que es usuario AI-PAIR",
    "3. Sistema devuelve todos los datos de desarrollo",
    "4. Usuario ve progreso completo del proyecto",
    "5. Audit log registra el acceso interno"
  ],
  dataShared: [
    "Todos los proyectos de desarrollo",
    "Tareas y hitos internos",
    "Logs de tiempo de desarrolladores",
    "Reportes internos de progreso"
  ],
  dataNotShared: [
    "Nada - es acceso interno completo"
  ]
};
```

---

## 🔒 **SEGURIDAD Y AUDIT**

### **Medidas de Seguridad**
```typescript
const SECURITY_MEASURES = {
  // Validación de permisos
  permissionValidation: {
    method: "Validación en cada request",
    implementation: "Middleware de compartición",
    control: "Verificación de plan y permisos"
  },
  
  // Audit completo
  auditLogging: {
    method: "Log de todos los accesos",
    data: [
      "Quién accedió",
      "Qué datos accedió",
      "Cuándo accedió",
      "Desde dónde accedió"
    ],
    retention: "7 años para compliance"
  },
  
  // Encriptación
  encryption: {
    method: "Encriptación en tránsito y reposo",
    implementation: "TLS 1.3 + AES-256",
    control: "Datos sensibles siempre encriptados"
  },
  
  // Rate limiting
  rateLimiting: {
    method: "Rate limiting por company",
    limits: "100 requests/minuto por company",
    control: "Prevención de abuso"
  }
};
```

### **Alertas de Seguridad**
```typescript
const SECURITY_ALERTS = {
  // Alertas automáticas
  automaticAlerts: [
    {
      trigger: "Acceso a datos privados desde company no-AI-PAIR",
      action: "Bloqueo inmediato + notificación a security team",
      severity: "CRITICAL"
    },
    {
      trigger: "Múltiples intentos de acceso denegado",
      action: "Rate limiting temporal + notificación",
      severity: "HIGH"
    },
    {
      trigger: "Acceso desde IP no reconocida",
      action: "Verificación adicional + notificación",
      severity: "MEDIUM"
    }
  ],
  
  // Reportes de seguridad
  securityReports: [
    {
      type: "DAILY",
      content: "Resumen de accesos y alertas del día"
    },
    {
      type: "WEEKLY",
      content: "Análisis de patrones de acceso"
    },
    {
      type: "MONTHLY",
      content: "Reporte completo de seguridad y compliance"
    }
  ]
};
```

---

## 📊 **MÉTRICAS Y MONITOREO**

### **Métricas de Compartición**
```typescript
const SHARING_METRICS = {
  // Métricas de uso
  usageMetrics: [
    {
      metric: "Datos compartidos por plan",
      measurement: "Número de requests por plan de suscripción",
      insight: "Uso de features por plan"
    },
    {
      metric: "Accesos denegados",
      measurement: "Número de accesos bloqueados",
      insight: "Intentos de acceso no autorizado"
    },
    {
      metric: "Tiempo de respuesta",
      measurement: "Latencia de requests de compartición",
      insight: "Performance del sistema de compartición"
    }
  ],
  
  // Métricas de seguridad
  securityMetrics: [
    {
      metric: "Alertas de seguridad",
      measurement: "Número de alertas generadas",
      insight: "Efectividad de las medidas de seguridad"
    },
    {
      metric: "Audit coverage",
      measurement: "Porcentaje de accesos auditados",
      insight: "Cobertura del sistema de audit"
    }
  ]
};
```

---

## 🎯 **CONCLUSIÓN**

### **Beneficios de la Arquitectura**
```typescript
const ARCHITECTURE_BENEFITS = {
  // Para AI-PAIR
  VibeThink: [
    "Control total sobre qué datos se comparten",
    "Audit completo de todos los accesos",
    "Seguridad garantizada para datos privados",
    "Flexibilidad para cambiar políticas de compartición"
  ],
  
  // Para Clientes
  clients: [
    "Acceso a datos necesarios para usar el servicio",
    "Transparencia sobre features disponibles",
    "Confianza en la seguridad de sus datos",
    "Información actualizada de la plataforma"
  ],
  
  // Para la Plataforma
  platform: [
    "Escalabilidad sin comprometer seguridad",
    "Compliance con regulaciones de privacidad",
    "Monitoreo completo de uso",
    "Optimización basada en métricas reales"
  ]
};
```

### **Principios Clave**
1. **Aislamiento por defecto** - Los datos son privados hasta que se configuren para compartición
2. **Compartición explícita** - Solo se comparte lo que está explícitamente configurado
3. **Audit completo** - Todo acceso se registra y puede auditarse
4. **Control granular** - Compartición controlada por plan de suscripción
5. **Seguridad primero** - Múltiples capas de seguridad y validación

### **Recordatorio Estratégico**
> **"La compartición controlada de datos es fundamental para el modelo multi-tenant. Permite que los clientes accedan a la información necesaria mientras mantenemos la seguridad y privacidad de los datos internos de AI-PAIR."**

**Esta arquitectura garantiza que el tenant AI-PAIR pueda compartir datos de manera segura y controlada con los clientes sin violar el aislamiento multi-tenant.** 