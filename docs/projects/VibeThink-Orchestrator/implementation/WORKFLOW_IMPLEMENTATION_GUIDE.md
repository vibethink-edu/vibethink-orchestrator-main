# Guía de Implementación - Sistema de Workflows Universal

## Resumen Ejecutivo

Esta guía proporciona instrucciones paso a paso para implementar el sistema de workflows universal en la plataforma AI Pair Orchestrator Pro.

## 🎯 Estado Actual del Proyecto

### **✅ Artefactos Completados**
1. **`src/services/WorkflowEngine.ts`** - Motor universal de workflows
2. **`src/components/workflows/WorkflowBuilder.tsx`** - Constructor visual
3. **`src/components/workflows/WorkflowDashboard.tsx`** - Dashboard de gestión
4. **`docs/architecture/ADR-004-Universal-Workflow-Engine.md`** - Decisiones arquitectónicas

### **🔄 Pendientes de Implementación**
1. **Migraciones de Base de Datos**
2. **Integración con el Sistema Existente**
3. **Plantillas Predefinidas**
4. **Sistema de Extensiones/Plug-ins**

---

## 📋 Plan de Implementación

### **Fase 1: Base de Datos (1-2 días)**

#### **1.1 Crear Migraciones**
```sql
-- Tabla de definiciones de workflow
CREATE TABLE workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    version TEXT DEFAULT '1.0.0',
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Configuración del workflow
    steps JSONB NOT NULL DEFAULT '[]',
    triggers JSONB NOT NULL DEFAULT '[]',
    conditions JSONB NOT NULL DEFAULT '[]',
    escalations JSONB NOT NULL DEFAULT '[]',
    
    -- Metadatos
    category TEXT DEFAULT 'custom',
    priority TEXT DEFAULT 'normal',
    estimated_duration INTEGER DEFAULT 0,
    
    -- Configuración de IA
    ai_enabled BOOLEAN DEFAULT false,
    ai_config JSONB DEFAULT '{}',
    
    -- Estado y auditoría
    status TEXT DEFAULT 'draft',
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(company_id, name)
);

-- Tabla de ejecuciones de workflow
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Estado de ejecución
    status TEXT DEFAULT 'pending',
    current_step_id TEXT,
    completed_steps TEXT[] DEFAULT '{}',
    
    -- Datos de entrada y salida
    input_data JSONB DEFAULT '{}',
    output_data JSONB,
    
    -- Metadatos de ejecución
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    
    -- Usuario y auditoría
    initiated_by UUID NOT NULL REFERENCES auth.users(id),
    assigned_to UUID REFERENCES auth.users(id),
    
    -- Errores y logs
    errors JSONB,
    logs JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para optimización
CREATE INDEX idx_workflow_definitions_company ON workflow_definitions(company_id);
CREATE INDEX idx_workflow_definitions_status ON workflow_definitions(status);
CREATE INDEX idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_workflow_executions_company ON workflow_executions(company_id);
```

#### **1.2 Políticas RLS**
```sql
-- RLS para workflow_definitions
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflows from their company" ON workflow_definitions
    FOR SELECT USING (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create workflows in their company" ON workflow_definitions
    FOR INSERT WITH CHECK (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update workflows in their company" ON workflow_definitions
    FOR UPDATE USING (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

-- RLS para workflow_executions
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view executions from their company" ON workflow_executions
    FOR SELECT USING (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create executions in their company" ON workflow_executions
    FOR INSERT WITH CHECK (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));
```

### **Fase 2: Integración con el Sistema (2-3 días)**

#### **2.1 Actualizar WorkflowEngine**
```typescript
// src/services/WorkflowEngine.ts
// Agregar métodos para integración con Supabase

export class WorkflowEngine {
  // ... código existente ...

  /**
   * Obtener definición de workflow desde Supabase
   */
  private async getWorkflowDefinition(id: string): Promise<WorkflowDefinition | null> {
    const { data, error } = await supabase
      .from('workflow_definitions')
      .select('*')
      .eq('id', id)
      .eq('company_id', this.companyId)
      .single();

    if (error) {
      console.error('Error fetching workflow definition:', error);
      return null;
    }

    return data;
  }

  /**
   * Guardar ejecución en Supabase
   */
  private async saveExecution(execution: Omit<WorkflowExecution, 'id'>): Promise<WorkflowExecution> {
    const { data, error } = await supabase
      .from('workflow_executions')
      .insert(execution)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
```

#### **2.2 Crear Hooks de React**
```typescript
// src/hooks/useWorkflows.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkflowEngine } from '@/services/WorkflowEngine';

export function useWorkflows() {
  const { getWorkflowDefinitions, createWorkflowDefinition } = useWorkflowEngine();
  const queryClient = useQueryClient();

  const workflows = useQuery({
    queryKey: ['workflows'],
    queryFn: () => getWorkflowDefinitions(),
  });

  const createWorkflow = useMutation({
    mutationFn: createWorkflowDefinition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  return {
    workflows: workflows.data || [],
    isLoading: workflows.isLoading,
    createWorkflow: createWorkflow.mutate,
    isCreating: createWorkflow.isPending,
  };
}
```

### **Fase 3: Plantillas Predefinidas (2-3 días)**

#### **3.1 Crear Plantillas por Dominio**
```typescript
// src/templates/workflowTemplates.ts
export const WORKFLOW_TEMPLATES = {
  // Ecommerce - Envío
  shipment: {
    name: 'Proceso de Envío',
    description: 'Workflow para gestión de envíos de ecommerce',
    steps: [
      {
        id: 'order_received',
        name: 'Pedido Recibido',
        type: 'automated',
        config: {
          assignee_type: 'system',
          notifications: { email: true }
        }
      },
      {
        id: 'inventory_check',
        name: 'Verificación de Inventario',
        type: 'automated',
        config: {
          assignee_type: 'system',
          ai_actions: { analyze: true }
        }
      },
      {
        id: 'picking',
        name: 'Picking',
        type: 'manual',
        config: {
          assignee_type: 'role',
          assignee_role: 'warehouse_worker'
        }
      },
      {
        id: 'packing',
        name: 'Empaque',
        type: 'manual',
        config: {
          assignee_type: 'role',
          assignee_role: 'warehouse_worker'
        }
      },
      {
        id: 'shipping',
        name: 'Envío',
        type: 'automated',
        config: {
          assignee_type: 'system',
          notifications: { email: true, push: true }
        }
      },
      {
        id: 'delivery',
        name: 'Entrega',
        type: 'automated',
        config: {
          assignee_type: 'system',
          notifications: { email: true }
        }
      }
    ]
  },

  // CRM - Oportunidad
  opportunity: {
    name: 'Proceso de Oportunidad',
    description: 'Workflow para gestión de oportunidades de venta',
    steps: [
      {
        id: 'lead_detected',
        name: 'Lead Detectado',
        type: 'automated',
        config: {
          assignee_type: 'ai',
          ai_actions: { classify: true, analyze: true }
        }
      },
      {
        id: 'initial_contact',
        name: 'Contacto Inicial',
        type: 'manual',
        config: {
          assignee_type: 'role',
          assignee_role: 'sales_rep'
        }
      },
      {
        id: 'qualification',
        name: 'Calificación',
        type: 'manual',
        config: {
          assignee_type: 'role',
          assignee_role: 'sales_rep'
        }
      },
      {
        id: 'proposal',
        name: 'Propuesta',
        type: 'manual',
        config: {
          assignee_type: 'role',
          assignee_role: 'sales_rep'
        }
      },
      {
        id: 'negotiation',
        name: 'Negociación',
        type: 'manual',
        config: {
          assignee_type: 'role',
          assignee_role: 'sales_manager'
        }
      },
      {
        id: 'closing',
        name: 'Cierre',
        type: 'approval',
        config: {
          assignee_type: 'role',
          assignee_role: 'sales_director'
        }
      }
    ]
  },

  // PQRS - Caso de Soporte
  support_case: {
    name: 'Caso de Soporte',
    description: 'Workflow para gestión de casos PQRS',
    steps: [
      {
        id: 'case_received',
        name: 'Caso Recibido',
        type: 'automated',
        config: {
          assignee_type: 'system',
          ai_actions: { classify: true, analyze: true }
        }
      },
      {
        id: 'classification',
        name: 'Clasificación',
        type: 'ai_enhanced',
        config: {
          assignee_type: 'ai',
          ai_actions: { classify: true, suggest_action: true }
        }
      },
      {
        id: 'assignment',
        name: 'Asignación',
        type: 'automated',
        config: {
          assignee_type: 'auto',
          auto_escalate: true
        }
      },
      {
        id: 'investigation',
        name: 'Investigación',
        type: 'manual',
        config: {
          assignee_type: 'role',
          assignee_role: 'support_agent'
        }
      },
      {
        id: 'resolution',
        name: 'Resolución',
        type: 'manual',
        config: {
          assignee_type: 'role',
          assignee_role: 'support_agent'
        }
      },
      {
        id: 'verification',
        name: 'Verificación',
        type: 'notification',
        config: {
          assignee_type: 'system',
          notifications: { email: true }
        }
      }
    ]
  }
};
```

### **Fase 4: Sistema de Extensiones (3-4 días)**

#### **4.1 Crear Sistema de Plug-ins**
```typescript
// src/plugins/WorkflowPlugin.ts
export interface WorkflowPlugin {
  id: string;
  name: string;
  version: string;
  hooks: {
    beforeStep?: (stepId: string, data: any) => Promise<any>;
    afterStep?: (stepId: string, data: any) => Promise<void>;
    onError?: (stepId: string, error: Error) => Promise<void>;
  };
  actions: {
    [actionName: string]: (data: any) => Promise<any>;
  };
}

// src/plugins/ecommerce/ShipmentPlugin.ts
export class ShipmentPlugin implements WorkflowPlugin {
  id = 'shipment';
  name = 'Ecommerce Shipment Plugin';
  version = '1.0.0';

  hooks = {
    beforeStep: async (stepId: string, data: any) => {
      if (stepId === 'inventory_check') {
        return await this.checkInventory(data.orderId);
      }
      return data;
    },
    afterStep: async (stepId: string, data: any) => {
      if (stepId === 'shipping') {
        await this.sendTrackingEmail(data);
      }
    }
  };

  actions = {
    checkInventory: async (orderId: string) => {
      // Lógica específica de verificación de inventario
    },
    sendTrackingEmail: async (data: any) => {
      // Lógica específica de envío de email de tracking
    }
  };
}
```

### **Fase 5: Integración con UI (2-3 días)**

#### **5.1 Crear Página de Workflows**
```typescript
// src/pages/workflows/index.tsx
import { WorkflowDashboard } from '@/components/workflows/WorkflowDashboard';

export default function WorkflowsPage() {
  return (
    <div className="container mx-auto p-6">
      <WorkflowDashboard />
    </div>
  );
}
```

#### **5.2 Agregar a Navegación**
```typescript
// src/components/layout/Sidebar.tsx
// Agregar enlace a workflows
{
  name: 'Workflows',
  href: '/workflows',
  icon: Workflow,
  current: pathname === '/workflows'
}
```

---

## 🧪 Testing y Validación

### **1. Tests Unitarios**
```typescript
// tests/unit/WorkflowEngine.test.ts
import { WorkflowEngine } from '@/services/WorkflowEngine';

describe('WorkflowEngine', () => {
  let engine: WorkflowEngine;

  beforeEach(() => {
    engine = new WorkflowEngine('company-1', 'user-1');
  });

  test('should create workflow definition', async () => {
    const definition = await engine.createWorkflowDefinition({
      name: 'Test Workflow',
      description: 'Test description',
      steps: [],
      triggers: [],
      conditions: [],
      escalations: [],
      category: 'test',
      priority: 'normal',
      estimated_duration: 60,
      ai_enabled: false,
      status: 'draft',
      created_by: 'user-1'
    });

    expect(definition.name).toBe('Test Workflow');
  });
});
```

### **2. Tests de Integración**
```typescript
// tests/integration/workflow-execution.test.ts
describe('Workflow Execution', () => {
  test('should execute complete workflow', async () => {
    // Crear workflow
    // Ejecutar workflow
    // Verificar estados
    // Verificar logs
  });
});
```

---

## 📊 Monitoreo y Observabilidad

### **1. Métricas Clave**
- Tasa de éxito de workflows
- Tiempo promedio de ejecución
- Número de workflows activos
- Errores por tipo de paso

### **2. Logs Estructurados**
```typescript
// src/utils/logger.ts
export const workflowLogger = {
  info: (message: string, data?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...data
    }));
  },
  error: (message: string, error?: Error, data?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...data
    }));
  }
};
```

---

## 🚀 Despliegue

### **1. Migraciones**
```bash
# Ejecutar migraciones
supabase db push

# Verificar tablas creadas
supabase db diff
```

### **2. Variables de Entorno**
```env
# .env.local
NEXT_PUBLIC_WORKFLOW_ENABLED=true
WORKFLOW_MAX_EXECUTION_TIME=3600
WORKFLOW_RETRY_ATTEMPTS=3
```

### **3. Verificación**
- [ ] Migraciones ejecutadas correctamente
- [ ] RLS configurado
- [ ] Componentes renderizando
- [ ] Workflows creándose
- [ ] Ejecuciones funcionando

---

## 📚 Documentación Adicional

### **Para Desarrolladores**
- [Guía de Patrones Arquitectónicos](./WORKFLOW_ARCHITECTURE_PATTERNS.md)
- [ADR - Motor Universal](./ADR-004-Universal-Workflow-Engine.md)

### **Para Usuarios**
- [Guía de Usuario - Workflows](../user-documentation/workflows-user-guide.md)
- [Plantillas Disponibles](../user-documentation/workflow-templates.md)

---

## ⚠️ Consideraciones Importantes

### **Performance**
- Usar índices en base de datos
- Implementar paginación en listas
- Cachear definiciones de workflow

### **Seguridad**
- Validar permisos en cada operación
- Sanitizar datos de entrada
- Logging de auditoría

### **Escalabilidad**
- Considerar message queues para workflows pesados
- Implementar rate limiting
- Monitorear uso de recursos

---

## 📞 Soporte

Para dudas o problemas durante la implementación:
1. Revisar logs de aplicación
2. Verificar configuración de base de datos
3. Consultar documentación de patrones
4. Contactar al equipo de arquitectura 