# Módulos de Lógica de Negocio (`modules/`)

## 🎯 **Propósito**

Esta carpeta contiene los **módulos de lógica de negocio reutilizable** que implementan las funcionalidades core del sistema VibeThink Orchestrator.

## 📁 **Estructura**

```
modules/
├── billing/            # Módulo de facturación
├── analytics/          # Módulo de analíticas
├── notifications/      # Módulo de notificaciones
├── audit/              # Módulo de auditoría
├── ai-orchestration/   # Orquestación de IA
├── workflow-management/ # Gestión de workflows con Kestra
├── postiz-analysis/    # Análisis Postiz
├── knotie-checkup/     # Checkup Knotie
└── universal-assistant/ # Lógica del asistente universal
```

## 💳 **Facturación (`billing/`)**

### **Propósito:**
Gestión completa del sistema de facturación y pagos.

### **Funcionalidades:**
- **Plan management**: Gestión de planes y límites
- **Usage tracking**: Seguimiento de uso
- **Payment processing**: Procesamiento de pagos
- **Invoice generation**: Generación de facturas
- **Subscription management**: Gestión de suscripciones

### **Estructura:**
```
billing/
├── services/           # Servicios de facturación
├── hooks/              # Hooks de facturación
├── components/         # Componentes de facturación
├── types/              # Tipos de facturación
├── utils/              # Utilidades de facturación
└── tests/              # Tests de facturación
```

### **Patrón de Uso:**
```typescript
// ✅ Uso con multi-tenant
import { useBilling } from '@/modules/billing';

const BillingPanel = () => {
  const { 
    currentPlan, 
    usage, 
    upgradePlan, 
    generateInvoice 
  } = useBilling();
  
  return (
    <div>
      <PlanDisplay plan={currentPlan} />
      <UsageTracker usage={usage} />
      <UpgradeButton onUpgrade={upgradePlan} />
    </div>
  );
};
```

## 📊 **Analíticas (`analytics/`)**

### **Propósito:**
Sistema completo de analíticas y métricas del negocio.

### **Funcionalidades:**
- **Data collection**: Recolección de datos
- **Metrics calculation**: Cálculo de métricas
- **Reporting**: Generación de reportes
- **Dashboard data**: Datos para dashboards
- **Real-time analytics**: Analíticas en tiempo real

### **Estructura:**
```
analytics/
├── services/           # Servicios de analíticas
├── hooks/              # Hooks de analíticas
├── components/         # Componentes de analíticas
├── types/              # Tipos de analíticas
├── utils/              # Utilidades de analíticas
└── tests/              # Tests de analíticas
```

### **Patrón de Uso:**
```typescript
// ✅ Uso con React Query
import { useAnalytics } from '@/modules/analytics';

const AnalyticsDashboard = () => {
  const { 
    metrics, 
    isLoading, 
    error,
    refreshData 
  } = useAnalytics();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <MetricsGrid metrics={metrics} />
      <RefreshButton onRefresh={refreshData} />
    </div>
  );
};
```

## 🔔 **Notificaciones (`notifications/`)**

### **Propósito:**
Sistema de notificaciones en tiempo real.

### **Funcionalidades:**
- **Real-time notifications**: Notificaciones en tiempo real
- **Email notifications**: Notificaciones por email
- **Push notifications**: Notificaciones push
- **Notification preferences**: Preferencias de notificación
- **Notification history**: Historial de notificaciones

### **Estructura:**
```
notifications/
├── services/           # Servicios de notificaciones
├── hooks/              # Hooks de notificaciones
├── components/         # Componentes de notificaciones
├── types/              # Tipos de notificaciones
├── utils/              # Utilidades de notificaciones
└── tests/              # Tests de notificaciones
```

### **Patrón de Uso:**
```typescript
// ✅ Uso con Supabase real-time
import { useNotifications } from '@/modules/notifications';

const NotificationCenter = () => {
  const { 
    notifications, 
    markAsRead, 
    deleteNotification 
  } = useNotifications();
  
  return (
    <div>
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onRead={() => markAsRead(notification.id)}
          onDelete={() => deleteNotification(notification.id)}
        />
      ))}
    </div>
  );
};
```

## 🔍 **Auditoría (`audit/`)**

### **Propósito:**
Sistema completo de auditoría y compliance.

### **Funcionalidades:**
- **Activity logging**: Registro de actividades
- **Compliance tracking**: Seguimiento de compliance
- **Audit reports**: Reportes de auditoría
- **Data retention**: Retención de datos
- **Security monitoring**: Monitoreo de seguridad

### **Estructura:**
```
audit/
├── services/           # Servicios de auditoría
├── hooks/              # Hooks de auditoría
├── components/         # Componentes de auditoría
├── types/              # Tipos de auditoría
├── utils/              # Utilidades de auditoría
└── tests/              # Tests de auditoría
```

### **Patrón de Uso:**
```typescript
// ✅ Uso con logging automático
import { useAudit } from '@/modules/audit';

const AuditLogger = () => {
  const { logActivity, getAuditTrail } = useAudit();
  
  const handleUserAction = async (action: string) => {
    await logActivity({
      action,
      user_id: user.id,
      company_id: user.company_id,
      timestamp: new Date(),
      details: { /* action details */ }
    });
  };
  
  return (
    <div>
      <AuditTrail data={getAuditTrail()} />
    </div>
  );
};
```

## 🤖 **Orquestación de IA (`ai-orchestration/`)**

### **Propósito:**
Orquestación inteligente de servicios de IA.

### **Funcionalidades:**
- **AI service routing**: Enrutamiento de servicios IA
- **Model selection**: Selección de modelos
- **Response optimization**: Optimización de respuestas
- **Cost management**: Gestión de costos
- **Performance monitoring**: Monitoreo de performance

### **Estructura:**
```
ai-orchestration/
├── services/           # Servicios de orquestación
├── hooks/              # Hooks de orquestación
├── components/         # Componentes de orquestación
├── types/              # Tipos de orquestación
├── utils/              # Utilidades de orquestación
└── tests/              # Tests de orquestación
```

### **Patrón de Uso:**
```typescript
// ✅ Uso con múltiples proveedores IA
import { useAIOrchestration } from '@/modules/ai-orchestration';

const AIOrchestrator = () => {
  const { 
    generateResponse, 
    selectModel, 
    optimizeResponse 
  } = useAIOrchestration();
  
  const handleGenerate = async (prompt: string) => {
    const model = await selectModel(prompt);
    const response = await generateResponse(prompt, model);
    const optimized = await optimizeResponse(response);
    return optimized;
  };
  
  return (
    <div>
      <ModelSelector onSelect={selectModel} />
      <ResponseOptimizer onOptimize={optimizeResponse} />
    </div>
  );
};
```

## 🔄 **Gestión de Workflows (`workflow-management/`)**

### **Propósito:**
Gestión completa de workflows con Kestra.

### **Funcionalidades:**
- **Workflow creation**: Creación de workflows
- **Workflow execution**: Ejecución de workflows
- **Workflow monitoring**: Monitoreo de workflows
- **Template management**: Gestión de templates
- **Integration with React Flow**: Integración con React Flow

### **Estructura:**
```
workflow-management/
├── services/           # Servicios de workflows
├── hooks/              # Hooks de workflows
├── components/         # Componentes de workflows
├── types/              # Tipos de workflows
├── utils/              # Utilidades de workflows
└── tests/              # Tests de workflows
```

### **Patrón de Uso:**
```typescript
// ✅ Uso con Kestra + React Flow
import { useWorkflowManagement } from '@/modules/workflow-management';

const WorkflowManager = () => {
  const { 
    workflows, 
    createWorkflow, 
    executeWorkflow,
    monitorExecution 
  } = useWorkflowManagement();
  
  return (
    <div>
      <WorkflowList workflows={workflows} />
      <WorkflowCreator onCreate={createWorkflow} />
      <ExecutionMonitor onMonitor={monitorExecution} />
    </div>
  );
};
```

## 📈 **Análisis Postiz (`postiz-analysis/`)**

### **Propósito:**
Análisis especializado de datos Postiz.

### **Funcionalidades:**
- **Data analysis**: Análisis de datos Postiz
- **Trend detection**: Detección de tendencias
- **Performance metrics**: Métricas de performance
- **Custom reports**: Reportes personalizados

### **Estructura:**
```
postiz-analysis/
├── services/           # Servicios de análisis
├── hooks/              # Hooks de análisis
├── components/         # Componentes de análisis
├── types/              # Tipos de análisis
├── utils/              # Utilidades de análisis
└── tests/              # Tests de análisis
```

## 🔍 **Checkup Knotie (`knotie-checkup/`)**

### **Propósito:**
Sistema de checkup y diagnóstico Knotie.

### **Funcionalidades:**
- **Health checks**: Verificaciones de salud
- **Diagnostic tools**: Herramientas de diagnóstico
- **Performance analysis**: Análisis de performance
- **Recommendations**: Recomendaciones automáticas

### **Estructura:**
```
knotie-checkup/
├── services/           # Servicios de checkup
├── hooks/              # Hooks de checkup
├── components/         # Componentes de checkup
├── types/              # Tipos de checkup
├── utils/              # Utilidades de checkup
└── tests/              # Tests de checkup
```

## 🤖 **Asistente Universal (`universal-assistant/`)**

### **Propósito:**
Lógica del asistente universal personal por empleado.

### **Funcionalidades:**
- **Profile management**: Gestión de perfiles
- **Context learning**: Aprendizaje de contexto
- **Tool integration**: Integración con herramientas
- **Cross-assistant coordination**: Coordinación entre assistants

### **Estructura:**
```
universal-assistant/
├── services/           # Servicios del asistente
├── hooks/              # Hooks del asistente
├── components/         # Componentes del asistente
├── types/              # Tipos del asistente
├── utils/              # Utilidades del asistente
└── tests/              # Tests del asistente
```

### **Patrón de Uso:**
```typescript
// ✅ Uso con perfil personalizado
import { useUniversalAssistant } from '@/modules/universal-assistant';

const UniversalAssistant = () => {
  const { 
    assistant, 
    updateProfile, 
    learnContext,
    coordinateWithOthers 
  } = useUniversalAssistant();
  
  return (
    <div>
      <AssistantProfile profile={assistant.profile} />
      <ContextLearner onLearn={learnContext} />
      <CoordinationPanel onCoordinate={coordinateWithOthers} />
    </div>
  );
};
```

## 🛡️ **Seguridad Multi-tenant**

### **Patrones de Seguridad:**
```typescript
// ✅ Siempre validar company_id
const validateCompanyAccess = (user: User, companyId: string) => {
  if (user.company_id !== companyId) {
    throw new Error('Access denied');
  }
};

// ✅ Filtrar datos por empresa
const getCompanyData = async (companyId: string) => {
  const data = await fetchData();
  return data.filter(item => item.company_id === companyId);
};
```

## 🧪 **Testing Strategy**

### **Por Módulo:**
- **Unit tests**: Para cada servicio
- **Integration tests**: Para flujos completos
- **Multi-tenant tests**: Para aislamiento de empresas
- **Performance tests**: Para métricas de rendimiento

### **Patrones de Testing:**
```typescript
// ✅ Test multi-tenant
describe('Multi-tenant Security', () => {
  it('should not access cross-company data', async () => {
    const company1User = createTestUser({ company_id: 'company1' });
    const company2Data = await fetchCompanyData(company1User, 'company2');
    
    expect(company2Data).toBeNull();
  });
});
```

## 📊 **Métricas de Calidad**

### **Por Módulo:**
- **Performance**: <500ms response time
- **Testing**: >90% coverage
- **Security**: 100% multi-tenant isolation
- **Reliability**: >99.9% uptime

---

**Los módulos siguen los principios de VThink 1.0, asegurando reutilización, seguridad y escalabilidad.** 