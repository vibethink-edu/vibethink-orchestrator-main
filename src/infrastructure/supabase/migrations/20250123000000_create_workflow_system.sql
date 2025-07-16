-- Migración para Sistema de Workflows Universal
-- Fecha: 2025-01-23
-- Objetivo: Crear tablas y funciones para el sistema de workflows

-- =====================================================
-- TABLA DE DEFINICIONES DE WORKFLOW
-- =====================================================

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
    category TEXT DEFAULT 'custom' CHECK (category IN ('business_process', 'approval', 'automation', 'compliance', 'custom')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    estimated_duration INTEGER DEFAULT 0 CHECK (estimated_duration >= 0),
    
    -- Configuración de IA
    ai_enabled BOOLEAN DEFAULT false,
    ai_config JSONB DEFAULT '{}',
    
    -- Estado y auditoría
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(company_id, name)
);

-- =====================================================
-- TABLA DE EJECUCIONES DE WORKFLOW
-- =====================================================

CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Estado de ejecución
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'paused', 'completed', 'failed', 'cancelled')),
    current_step_id TEXT,
    completed_steps TEXT[] DEFAULT '{}',
    
    -- Datos de entrada y salida
    input_data JSONB DEFAULT '{}',
    output_data JSONB,
    
    -- Metadatos de ejecución
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    duration_minutes INTEGER CHECK (duration_minutes >= 0),
    
    -- Usuario y auditoría
    initiated_by UUID NOT NULL REFERENCES auth.users(id),
    assigned_to UUID REFERENCES auth.users(id),
    
    -- Errores y logs
    errors JSONB,
    logs JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLA DE PLUG-INS DE WORKFLOW
-- =====================================================

CREATE TABLE workflow_plugins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    version TEXT NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Configuración del plugin
    plugin_type TEXT NOT NULL CHECK (plugin_type IN ('action', 'condition', 'notification', 'integration')),
    config JSONB DEFAULT '{}',
    
    -- Estado
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(company_id, name, version)
);

-- =====================================================
-- TABLA DE PLANTILLAS DE WORKFLOW
-- =====================================================

CREATE TABLE workflow_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    
    -- Configuración de la plantilla
    template_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    
    -- Metadatos
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para workflow_definitions
CREATE INDEX idx_workflow_definitions_company ON workflow_definitions(company_id);
CREATE INDEX idx_workflow_definitions_status ON workflow_definitions(status);
CREATE INDEX idx_workflow_definitions_category ON workflow_definitions(category);
CREATE INDEX idx_workflow_definitions_created_by ON workflow_definitions(created_by);
CREATE INDEX idx_workflow_definitions_workspace ON workflow_definitions(workspace_id);

-- Índices para workflow_executions
CREATE INDEX idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_workflow_executions_company ON workflow_executions(company_id);
CREATE INDEX idx_workflow_executions_initiated_by ON workflow_executions(initiated_by);
CREATE INDEX idx_workflow_executions_assigned_to ON workflow_executions(assigned_to);
CREATE INDEX idx_workflow_executions_started_at ON workflow_executions(started_at);
CREATE INDEX idx_workflow_executions_workspace ON workflow_executions(workspace_id);

-- Índices para workflow_plugins
CREATE INDEX idx_workflow_plugins_company ON workflow_plugins(company_id);
CREATE INDEX idx_workflow_plugins_type ON workflow_plugins(plugin_type);
CREATE INDEX idx_workflow_plugins_active ON workflow_plugins(is_active);

-- Índices para workflow_templates
CREATE INDEX idx_workflow_templates_category ON workflow_templates(category);
CREATE INDEX idx_workflow_templates_public ON workflow_templates(is_public);

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para workflow_definitions
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

CREATE POLICY "Users can delete workflows in their company" ON workflow_definitions
    FOR DELETE USING (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

-- Políticas para workflow_executions
CREATE POLICY "Users can view executions from their company" ON workflow_executions
    FOR SELECT USING (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create executions in their company" ON workflow_executions
    FOR INSERT WITH CHECK (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update executions in their company" ON workflow_executions
    FOR UPDATE USING (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

-- Políticas para workflow_plugins
CREATE POLICY "Users can view plugins from their company" ON workflow_plugins
    FOR SELECT USING (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create plugins in their company" ON workflow_plugins
    FOR INSERT WITH CHECK (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update plugins in their company" ON workflow_plugins
    FOR UPDATE USING (company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
    ));

-- Políticas para workflow_templates
CREATE POLICY "Users can view public templates" ON workflow_templates
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own templates" ON workflow_templates
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create templates" ON workflow_templates
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" ON workflow_templates
    FOR UPDATE USING (created_by = auth.uid());

-- =====================================================
-- FUNCIONES DE UTILIDAD
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_workflow_definitions_updated_at 
    BEFORE UPDATE ON workflow_definitions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_executions_updated_at 
    BEFORE UPDATE ON workflow_executions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_plugins_updated_at 
    BEFORE UPDATE ON workflow_plugins 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_templates_updated_at 
    BEFORE UPDATE ON workflow_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular duración de ejecución
CREATE OR REPLACE FUNCTION calculate_execution_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
        NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at)) / 60;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para calcular duración
CREATE TRIGGER calculate_workflow_execution_duration 
    BEFORE UPDATE ON workflow_executions 
    FOR EACH ROW EXECUTE FUNCTION calculate_execution_duration();

-- =====================================================
-- FUNCIONES DE CONSULTA
-- =====================================================

-- Función para obtener estadísticas de workflows
CREATE OR REPLACE FUNCTION get_workflow_stats(p_company_id UUID)
RETURNS TABLE(
    total_workflows INTEGER,
    active_workflows INTEGER,
    total_executions INTEGER,
    running_executions INTEGER,
    success_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT wd.id)::INTEGER as total_workflows,
        COUNT(DISTINCT CASE WHEN wd.status = 'active' THEN wd.id END)::INTEGER as active_workflows,
        COUNT(we.id)::INTEGER as total_executions,
        COUNT(CASE WHEN we.status = 'running' THEN we.id END)::INTEGER as running_executions,
        CASE 
            WHEN COUNT(we.id) > 0 THEN 
                ROUND((COUNT(CASE WHEN we.status = 'completed' THEN we.id END)::NUMERIC / COUNT(we.id)::NUMERIC) * 100, 2)
            ELSE 0 
        END as success_rate
    FROM workflow_definitions wd
    LEFT JOIN workflow_executions we ON wd.id = we.workflow_id
    WHERE wd.company_id = p_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener ejecuciones recientes
CREATE OR REPLACE FUNCTION get_recent_executions(p_company_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
    id UUID,
    workflow_name TEXT,
    status TEXT,
    started_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    initiated_by_email TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        we.id,
        wd.name as workflow_name,
        we.status,
        we.started_at,
        we.duration_minutes,
        u.email as initiated_by_email
    FROM workflow_executions we
    JOIN workflow_definitions wd ON we.workflow_id = wd.id
    JOIN auth.users u ON we.initiated_by = u.id
    WHERE we.company_id = p_company_id
    ORDER BY we.started_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar plantillas públicas básicas
INSERT INTO workflow_templates (name, description, category, template_data, is_public) VALUES
(
    'Proceso de Envío Ecommerce',
    'Workflow estándar para gestión de envíos de ecommerce',
    'ecommerce',
    '{
        "name": "Proceso de Envío",
        "description": "Workflow para gestión de envíos de ecommerce",
        "steps": [
            {
                "id": "order_received",
                "name": "Pedido Recibido",
                "type": "automated",
                "config": {
                    "assignee_type": "system",
                    "notifications": {"email": true}
                }
            },
            {
                "id": "inventory_check",
                "name": "Verificación de Inventario",
                "type": "automated",
                "config": {
                    "assignee_type": "system",
                    "ai_actions": {"analyze": true}
                }
            },
            {
                "id": "picking",
                "name": "Picking",
                "type": "manual",
                "config": {
                    "assignee_type": "role",
                    "assignee_role": "warehouse_worker"
                }
            },
            {
                "id": "packing",
                "name": "Empaque",
                "type": "manual",
                "config": {
                    "assignee_type": "role",
                    "assignee_role": "warehouse_worker"
                }
            },
            {
                "id": "shipping",
                "name": "Envío",
                "type": "automated",
                "config": {
                    "assignee_type": "system",
                    "notifications": {"email": true, "push": true}
                }
            }
        ]
    }',
    true
),
(
    'Caso de Soporte PQRS',
    'Workflow estándar para gestión de casos de soporte',
    'pqrs',
    '{
        "name": "Caso de Soporte",
        "description": "Workflow para gestión de casos PQRS",
        "steps": [
            {
                "id": "case_received",
                "name": "Caso Recibido",
                "type": "automated",
                "config": {
                    "assignee_type": "system",
                    "ai_actions": {"classify": true, "analyze": true}
                }
            },
            {
                "id": "classification",
                "name": "Clasificación",
                "type": "ai_enhanced",
                "config": {
                    "assignee_type": "ai",
                    "ai_actions": {"classify": true, "suggest_action": true}
                }
            },
            {
                "id": "assignment",
                "name": "Asignación",
                "type": "automated",
                "config": {
                    "assignee_type": "auto",
                    "auto_escalate": true
                }
            },
            {
                "id": "investigation",
                "name": "Investigación",
                "type": "manual",
                "config": {
                    "assignee_type": "role",
                    "assignee_role": "support_agent"
                }
            },
            {
                "id": "resolution",
                "name": "Resolución",
                "type": "manual",
                "config": {
                    "assignee_type": "role",
                    "assignee_role": "support_agent"
                }
            }
        ]
    }',
    true
),
(
    'Oportunidad de Venta CRM',
    'Workflow estándar para gestión de oportunidades de venta',
    'crm',
    '{
        "name": "Oportunidad de Venta",
        "description": "Workflow para gestión de oportunidades de venta",
        "steps": [
            {
                "id": "lead_detected",
                "name": "Lead Detectado",
                "type": "automated",
                "config": {
                    "assignee_type": "ai",
                    "ai_actions": {"classify": true, "analyze": true}
                }
            },
            {
                "id": "initial_contact",
                "name": "Contacto Inicial",
                "type": "manual",
                "config": {
                    "assignee_type": "role",
                    "assignee_role": "sales_rep"
                }
            },
            {
                "id": "qualification",
                "name": "Calificación",
                "type": "manual",
                "config": {
                    "assignee_type": "role",
                    "assignee_role": "sales_rep"
                }
            },
            {
                "id": "proposal",
                "name": "Propuesta",
                "type": "manual",
                "config": {
                    "assignee_type": "role",
                    "assignee_role": "sales_rep"
                }
            },
            {
                "id": "negotiation",
                "name": "Negociación",
                "type": "manual",
                "config": {
                    "assignee_type": "role",
                    "assignee_role": "sales_manager"
                }
            },
            {
                "id": "closing",
                "name": "Cierre",
                "type": "approval",
                "config": {
                    "assignee_type": "role",
                    "assignee_role": "sales_director"
                }
            }
        ]
    }',
    true
);

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE workflow_definitions IS 'Definiciones de workflows configurables por empresa';
COMMENT ON TABLE workflow_executions IS 'Ejecuciones de workflows con estado y logs';
COMMENT ON TABLE workflow_plugins IS 'Plug-ins para extender funcionalidad de workflows';
COMMENT ON TABLE workflow_templates IS 'Plantillas predefinidas de workflows';

COMMENT ON COLUMN workflow_definitions.steps IS 'Array de pasos del workflow en formato JSON';
COMMENT ON COLUMN workflow_definitions.triggers IS 'Triggers que activan el workflow';
COMMENT ON COLUMN workflow_definitions.conditions IS 'Condiciones para ejecución del workflow';
COMMENT ON COLUMN workflow_definitions.escalations IS 'Reglas de escalación del workflow';

COMMENT ON COLUMN workflow_executions.completed_steps IS 'Array de IDs de pasos completados';
COMMENT ON COLUMN workflow_executions.input_data IS 'Datos de entrada del workflow';
COMMENT ON COLUMN workflow_executions.output_data IS 'Datos de salida del workflow';
COMMENT ON COLUMN workflow_executions.errors IS 'Errores ocurridos durante la ejecución';
COMMENT ON COLUMN workflow_executions.logs IS 'Logs detallados de la ejecución'; 