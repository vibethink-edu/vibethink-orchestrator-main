# 🔧 Validación: Kestra + React Flow - Administración por Empresa

## 📋 **Resumen Ejecutivo**

**SÍ ES COMPATIBLE** ✅ - La estructura propuesta soporta perfectamente que cada empresa administre sus propios workflows de Kestra de manera independiente y segura.

## 🏗️ **Arquitectura de Administración por Empresa**

### **Separación de Responsabilidades**
```
🏢 Empresa A
├── Admin de Empresa A
│   ├── Gestiona workflows de Kestra
│   ├── Configura React Flow
│   ├── Define plantillas por país
│   └── Administra usuarios internos
│
🏢 Empresa B  
├── Admin de Empresa B
│   ├── Gestiona workflows de Kestra (INDEPENDIENTE)
│   ├── Configura React Flow (INDEPENDIENTE)
│   ├── Define plantillas por país (INDEPENDIENTE)
│   └── Administra usuarios internos (INDEPENDIENTE)
```

## 🔒 **Multi-tenant Isolation**

### **1. Base de Datos - Aislamiento por Empresa**
```sql
-- Tabla de workflows por empresa
CREATE TABLE company_workflows (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  kestra_flow_id VARCHAR(255),
  reactflow_data JSONB,
  country_code VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de ejecuciones por empresa
CREATE TABLE company_workflow_executions (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  workflow_id UUID REFERENCES company_workflows(id),
  kestra_execution_id VARCHAR(255),
  status VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies para aislamiento
ALTER TABLE company_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_workflow_executions ENABLE ROW LEVEL SECURITY;

-- Política: Solo ver workflows de tu empresa
CREATE POLICY "Users can only see their company workflows"
ON company_workflows FOR ALL
USING (company_id = auth.jwt() ->> 'company_id');

CREATE POLICY "Users can only see their company executions"
ON company_workflow_executions FOR ALL
USING (company_id = auth.jwt() ->> 'company_id');
```

### **2. Kestra - Namespaces por Empresa**
```typescript
// Configuración de Kestra por empresa
interface KestraCompanyConfig {
  companyId: string;
  namespace: string; // company-{companyId}
  kestraUrl: string;
  apiKey: string;
  workflows: KestraWorkflow[];
  executions: KestraExecution[];
}

// Namespace automático por empresa
const getKestraNamespace = (companyId: string): string => {
  return `company-${companyId}`;
};

// Cliente de Kestra por empresa
class KestraCompanyClient {
  constructor(private companyId: string) {}
  
  private getNamespace(): string {
    return getKestraNamespace(this.companyId);
  }
  
  async createWorkflow(workflow: KestraWorkflow): Promise<void> {
    // Crear workflow en namespace de la empresa
    await this.kestraClient.createFlow({
      ...workflow,
      namespace: this.getNamespace()
    });
  }
  
  async listWorkflows(): Promise<KestraWorkflow[]> {
    // Listar solo workflows de la empresa
    return await this.kestraClient.listFlows({
      namespace: this.getNamespace()
    });
  }
}
```

## 🎨 **React Flow - Editor por Empresa**

### **1. Componente de Editor**
```typescript
// Editor de React Flow por empresa
const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ companyId }) => {
  const { workflows, saveWorkflow } = useKestraWorkflows(companyId);
  const { reactFlowInstance, setReactFlowInstance } = useReactFlow();
  
  // Cargar workflows específicos de la empresa
  useEffect(() => {
    loadCompanyWorkflows(companyId);
  }, [companyId]);
  
  const handleSave = async (flowData: ReactFlowData) => {
    // Guardar en namespace de la empresa
    await saveWorkflow({
      companyId,
      flowData,
      kestraFlow: convertToKestraFlow(flowData)
    });
  };
  
  return (
    <div className="workflow-editor">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSave={handleSave}
      />
      <WorkflowSidebar companyId={companyId} />
    </div>
  );
};
```

### **2. Hook de Gestión por Empresa**
```typescript
// Hook para gestionar workflows por empresa
export const useKestraWorkflows = (companyId: string) => {
  const [workflows, setWorkflows] = useState<KestraWorkflow[]>([]);
  const [executions, setExecutions] = useState<KestraExecution[]>([]);
  
  // Cargar workflows de la empresa
  const loadWorkflows = useCallback(async () => {
    const companyWorkflows = await kestraClient.listWorkflows({
      namespace: `company-${companyId}`
    });
    setWorkflows(companyWorkflows);
  }, [companyId]);
  
  // Crear workflow para la empresa
  const createWorkflow = useCallback(async (workflow: CreateWorkflowData) => {
    const newWorkflow = await kestraClient.createWorkflow({
      ...workflow,
      namespace: `company-${companyId}`
    });
    setWorkflows(prev => [...prev, newWorkflow]);
  }, [companyId]);
  
  // Ejecutar workflow de la empresa
  const executeWorkflow = useCallback(async (workflowId: string) => {
    const execution = await kestraClient.executeWorkflow({
      workflowId,
      namespace: `company-${companyId}`
    });
    setExecutions(prev => [...prev, execution]);
  }, [companyId]);
  
  return {
    workflows,
    executions,
    loadWorkflows,
    createWorkflow,
    executeWorkflow
  };
};
```

## 📊 **Plantillas Predefinidas por País**

### **1. Estructura de Plantillas**
```typescript
// Plantillas por país y empresa
interface CountryWorkflowTemplate {
  countryCode: string;
  companyId: string;
  templates: WorkflowTemplate[];
}

// Plantillas para Colombia
const colombiaTemplates: WorkflowTemplate[] = [
  {
    id: 'col-pqrs-basic',
    name: 'PQRS Básico Colombia',
    description: 'Workflow estándar para PQRS en Colombia',
    reactFlowData: colombiaPQRSFlow,
    kestraFlow: colombiaPQRSKestraFlow,
    countryCode: 'CO'
  },
  {
    id: 'col-complaint-escalation',
    name: 'Escalamiento de Quejas Colombia',
    description: 'Workflow de escalamiento según regulación colombiana',
    reactFlowData: colombiaComplaintFlow,
    kestraFlow: colombiaComplaintKestraFlow,
    countryCode: 'CO'
  }
];

// Plantillas para México
const mexicoTemplates: WorkflowTemplate[] = [
  {
    id: 'mx-pqrs-basic',
    name: 'PQRS Básico México',
    description: 'Workflow estándar para PQRS en México',
    reactFlowData: mexicoPQRSFlow,
    kestraFlow: mexicoPQRSKestraFlow,
    countryCode: 'MX'
  }
];
```

### **2. Gestión de Plantillas por Empresa**
```typescript
// Servicio de plantillas por empresa
class CompanyWorkflowTemplateService {
  constructor(private companyId: string) {}
  
  // Cargar plantillas disponibles para la empresa
  async loadTemplates(countryCode?: string): Promise<WorkflowTemplate[]> {
    const companyConfig = await this.getCompanyConfig();
    const availableCountries = companyConfig.allowedCountries;
    
    let templates: WorkflowTemplate[] = [];
    
    // Plantillas genéricas
    templates.push(...genericTemplates);
    
    // Plantillas por país si está permitido
    if (countryCode && availableCountries.includes(countryCode)) {
      templates.push(...this.getCountryTemplates(countryCode));
    }
    
    return templates;
  }
  
  // Instalar plantilla para la empresa
  async installTemplate(templateId: string): Promise<KestraWorkflow> {
    const template = await this.getTemplate(templateId);
    
    // Crear workflow en namespace de la empresa
    const workflow = await this.kestraClient.createWorkflow({
      ...template.kestraFlow,
      namespace: `company-${this.companyId}`,
      name: `${template.name} - ${this.companyId}`
    });
    
    return workflow;
  }
}
```

## 🔐 **Seguridad y Permisos**

### **1. Roles por Empresa**
```typescript
// Roles específicos para gestión de workflows
enum WorkflowRole {
  WORKFLOW_VIEWER = 'workflow_viewer',      // Ver workflows
  WORKFLOW_EDITOR = 'workflow_editor',      // Editar workflows
  WORKFLOW_ADMIN = 'workflow_admin',        // Administrar workflows
  WORKFLOW_EXECUTOR = 'workflow_executor'   // Ejecutar workflows
}

// Permisos por empresa
interface CompanyWorkflowPermissions {
  companyId: string;
  userId: string;
  roles: WorkflowRole[];
  allowedNamespaces: string[]; // Solo namespace de la empresa
}
```

### **2. Validación de Acceso**
```typescript
// Hook de permisos de workflow
export const useWorkflowPermissions = (companyId: string) => {
  const { user } = useAuth();
  
  const canViewWorkflows = useMemo(() => {
    return hasPermission(user, 'WORKFLOW_VIEWER', companyId);
  }, [user, companyId]);
  
  const canEditWorkflows = useMemo(() => {
    return hasPermission(user, 'WORKFLOW_EDITOR', companyId);
  }, [user, companyId]);
  
  const canAdminWorkflows = useMemo(() => {
    return hasPermission(user, 'WORKFLOW_ADMIN', companyId);
  }, [user, companyId]);
  
  return {
    canViewWorkflows,
    canEditWorkflows,
    canAdminWorkflows
  };
};
```

## 🎯 **Flujo de Administración**

### **1. Admin de Empresa A**
```
1. Accede al panel de administración
2. Ve solo workflows de Empresa A
3. Crea/edita workflows en namespace company-empresa-a
4. Configura React Flow para Empresa A
5. Instala plantillas por país (solo para países permitidos)
6. Administra usuarios internos de Empresa A
```

### **2. Admin de Empresa B**
```
1. Accede al panel de administración (INDEPENDIENTE)
2. Ve solo workflows de Empresa B
3. Crea/edita workflows en namespace company-empresa-b
4. Configura React Flow para Empresa B
5. Instala plantillas por país (solo para países permitidos)
6. Administra usuarios internos de Empresa B
```

## ✅ **Validación de Compatibilidad**

### **✅ Multi-tenant Isolation**
- **Base de datos**: RLS policies por company_id
- **Kestra**: Namespaces separados por empresa
- **React Flow**: Datos aislados por empresa
- **Permisos**: Roles específicos por empresa

### **✅ Escalabilidad**
- **Cada empresa**: Namespace independiente
- **Performance**: No interferencia entre empresas
- **Recursos**: Aislamiento completo
- **Configuración**: Personalizada por empresa

### **✅ Flexibilidad**
- **Plantillas**: Por país y empresa
- **Workflows**: Personalizables por empresa
- **React Flow**: Editor específico por empresa
- **Kestra**: Configuración por empresa

### **✅ Seguridad**
- **Autenticación**: Por empresa
- **Autorización**: Roles por empresa
- **Datos**: Aislamiento completo
- **Auditoría**: Por empresa

## 🚀 **Implementación Recomendada**

### **Fase 1 - Base (Q3 2025)**
- ✅ Configuración multi-tenant de Kestra
- ✅ Editor React Flow básico
- ✅ Plantillas genéricas
- ✅ Permisos por empresa

### **Fase 2 - País (Q4 2025)**
- ✅ Plantillas por país
- ✅ Configuración por país
- ✅ Workflows específicos por país
- ✅ Validaciones por país

### **Fase 3 - Avanzado (Q1 2026)**
- ✅ Editor React Flow avanzado
- ✅ Integración completa con Kestra
- ✅ Analytics por empresa
- ✅ Automatización avanzada

---

**✅ CONCLUSIÓN: La estructura es 100% compatible y está optimizada para que cada empresa administre sus workflows de Kestra de manera independiente y segura.** 