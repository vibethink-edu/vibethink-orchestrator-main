-- Migración para el Sistema de Línea de Tiempo Universal
-- Fecha: 2025-01-24
-- Autor: AI Pair Platform
-- Descripción: Implementación completa del sistema de líneas de tiempo universales

-- =====================================================
-- 1. TABLA PRINCIPAL DE LÍNEAS DE TIEMPO
-- =====================================================

CREATE TABLE universal_timelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- 'SHIPPING', 'CASE', 'PURCHASE', 'PROJECT', etc.
    context JSONB NOT NULL DEFAULT '{}',
    start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    expected_end_time TIMESTAMPTZ NOT NULL,
    actual_end_time TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DELAYED'
    
    -- Métricas de progreso
    progress_percentage INTEGER DEFAULT 0,
    time_remaining BIGINT, -- en milisegundos
    risk_level VARCHAR(20) DEFAULT 'LOW', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    
    -- Configuración de alertas
    alert_rules JSONB DEFAULT '[]',
    
    -- Metadatos
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    sub_workspace_id UUID REFERENCES sub_workspaces(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- Índices para performance
    CONSTRAINT valid_timeline_type CHECK (type IN ('SHIPPING', 'CASE', 'PURCHASE', 'PROJECT', 'TASK', 'EVENT')),
    CONSTRAINT valid_timeline_status CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED', 'DELAYED')),
    CONSTRAINT valid_risk_level CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

-- Índices para optimización
CREATE INDEX idx_timelines_company ON universal_timelines(company_id);
CREATE INDEX idx_timelines_type ON universal_timelines(type);
CREATE INDEX idx_timelines_status ON universal_timelines(status);
CREATE INDEX idx_timelines_start_time ON universal_timelines(start_time);
CREATE INDEX idx_timelines_expected_end_time ON universal_timelines(expected_end_time);

-- =====================================================
-- 2. TABLA DE MILESTONES
-- =====================================================

CREATE TABLE timeline_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timeline_id UUID REFERENCES universal_timelines(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    expected_time TIMESTAMPTZ NOT NULL,
    actual_time TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'FAILED'
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    dependencies JSONB DEFAULT '[]', -- Array de milestone IDs que deben completarse antes
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    CONSTRAINT valid_milestone_status CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'FAILED')),
    CONSTRAINT valid_milestone_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

-- Índices
CREATE INDEX idx_milestones_timeline ON timeline_milestones(timeline_id);
CREATE INDEX idx_milestones_status ON timeline_milestones(status);
CREATE INDEX idx_milestones_expected_time ON timeline_milestones(expected_time);

-- =====================================================
-- 3. TABLA DE STAKEHOLDERS
-- =====================================================

CREATE TABLE timeline_stakeholders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timeline_id UUID REFERENCES universal_timelines(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'OWNER', 'MANAGER', 'EXECUTOR', 'OBSERVER'
    notification_preferences JSONB DEFAULT '["EMAIL"]', -- Array de canales: 'EMAIL', 'PUSH', 'SMS'
    escalation_level INTEGER DEFAULT 1,
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    UNIQUE(timeline_id, user_id),
    CONSTRAINT valid_stakeholder_role CHECK (role IN ('OWNER', 'MANAGER', 'EXECUTOR', 'OBSERVER')),
    CONSTRAINT valid_escalation_level CHECK (escalation_level >= 1 AND escalation_level <= 5)
);

-- Índices
CREATE INDEX idx_stakeholders_timeline ON timeline_stakeholders(timeline_id);
CREATE INDEX idx_stakeholders_user ON timeline_stakeholders(user_id);

-- =====================================================
-- 4. TABLA DE ALERTAS
-- =====================================================

CREATE TABLE timeline_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timeline_id UUID REFERENCES universal_timelines(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'DELAY', 'SLA_BREACH', 'MILESTONE_MISSED', 'CUSTOM'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'ESCALATED'
    actions JSONB DEFAULT '[]', -- Array de acciones disponibles
    
    -- Configuración de notificación
    notification_channels JSONB DEFAULT '["EMAIL", "PUSH"]',
    escalation_path JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    resolved_at TIMESTAMPTZ,
    
    CONSTRAINT valid_alert_severity CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT valid_alert_status CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'ESCALATED'))
);

-- Índices
CREATE INDEX idx_alerts_timeline ON timeline_alerts(timeline_id);
CREATE INDEX idx_alerts_status ON timeline_alerts(status);
CREATE INDEX idx_alerts_severity ON timeline_alerts(severity);
CREATE INDEX idx_alerts_created_at ON timeline_alerts(created_at);

-- =====================================================
-- 5. TABLA DE NOTIFICACIONES
-- =====================================================

CREATE TABLE timeline_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timeline_id UUID REFERENCES universal_timelines(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'TIMELINE_UPDATE', 'MILESTONE_COMPLETED', 'ALERT', 'SLA_WARNING'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(20) NOT NULL, -- 'EMAIL', 'PUSH', 'SMS', 'IN_APP'
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'
    
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    CONSTRAINT valid_notification_channel CHECK (channel IN ('EMAIL', 'PUSH', 'SMS', 'IN_APP')),
    CONSTRAINT valid_notification_status CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'))
);

-- Índices
CREATE INDEX idx_notifications_timeline ON timeline_notifications(timeline_id);
CREATE INDEX idx_notifications_user ON timeline_notifications(user_id);
CREATE INDEX idx_notifications_status ON timeline_notifications(status);
CREATE INDEX idx_notifications_created_at ON timeline_notifications(created_at);

-- =====================================================
-- 6. TABLA DE EVENTOS DE LÍNEA DE TIEMPO
-- =====================================================

CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timeline_id UUID REFERENCES universal_timelines(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'MILESTONE_COMPLETED', 'ALERT_TRIGGERED', 'STATUS_CHANGED', 'PROGRESS_UPDATED'
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    user_id UUID REFERENCES user_profiles(id),
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Índices
CREATE INDEX idx_events_timeline ON timeline_events(timeline_id);
CREATE INDEX idx_events_type ON timeline_events(event_type);
CREATE INDEX idx_events_created_at ON timeline_events(created_at);

-- =====================================================
-- 7. TABLA DE CONFIGURACIÓN DE TIPOS DE LÍNEA DE TIEMPO
-- =====================================================

CREATE TABLE timeline_type_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_milestones JSONB DEFAULT '[]',
    default_alert_rules JSONB DEFAULT '[]',
    default_stakeholder_roles JSONB DEFAULT '[]',
    sla_config JSONB DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insertar configuraciones por defecto
INSERT INTO timeline_type_configs (type, name, description, default_milestones, default_alert_rules, default_stakeholder_roles, sla_config) VALUES
('SHIPPING', 'Envíos', 'Línea de tiempo para seguimiento de envíos', 
 '["LABEL_CREATED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"]',
 '[{"type": "DELAY", "conditions": {"delayHours": 2}, "actions": ["NOTIFY_STAKEHOLDERS"]}]',
 '["OWNER", "MANAGER", "OBSERVER"]',
 '{"defaultSLA": 72, "unit": "hours"}'),
 
('CASE', 'Casos', 'Línea de tiempo para casos de soporte y PQRS',
 '["CASE_CREATED", "CASE_ASSIGNED", "INVESTIGATION_STARTED", "RESOLUTION_IN_PROGRESS", "RESOLUTION_COMPLETED", "CASE_CLOSED"]',
 '[{"type": "SLA_BREACH", "conditions": {"remainingHours": 2}, "actions": ["ESCALATE", "NOTIFY_STAKEHOLDERS"]}]',
 '["OWNER", "MANAGER", "EXECUTOR", "OBSERVER"]',
 '{"defaultSLA": 24, "unit": "hours"}'),
 
('PURCHASE', 'Compras', 'Línea de tiempo para procesos de compra',
 '["PURCHASE_REQUESTED", "QUOTE_RECEIVED", "PURCHASE_APPROVED", "ORDER_PLACED", "ORDER_CONFIRMED", "SHIPPING_INITIATED", "IN_TRANSIT", "DELIVERED", "RECEIVED"]',
 '[{"type": "APPROVAL_PENDING", "conditions": {"pendingHours": 4}, "actions": ["NOTIFY_APPROVER", "ESCALATE"]}]',
 '["OWNER", "MANAGER", "APPROVER", "OBSERVER"]',
 '{"defaultSLA": 168, "unit": "hours"}');

-- =====================================================
-- 8. FUNCIONES DE UTILIDAD
-- =====================================================

-- Función para crear una nueva línea de tiempo
CREATE OR REPLACE FUNCTION create_timeline(
    p_type VARCHAR(50),
    p_context JSONB,
    p_expected_end_time TIMESTAMPTZ,
    p_company_id UUID,
    p_workspace_id UUID DEFAULT NULL,
    p_sub_workspace_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_timeline_id UUID;
    v_config RECORD;
    v_milestone JSONB;
BEGIN
    -- Obtener configuración del tipo
    SELECT * INTO v_config FROM timeline_type_configs WHERE type = p_type AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Timeline type % not found or inactive', p_type;
    END IF;
    
    -- Crear línea de tiempo
    INSERT INTO universal_timelines (
        type, context, expected_end_time, company_id, workspace_id, sub_workspace_id,
        alert_rules
    ) VALUES (
        p_type, p_context, p_expected_end_time, p_company_id, p_workspace_id, p_sub_workspace_id,
        v_config.default_alert_rules
    ) RETURNING id INTO v_timeline_id;
    
    -- Crear milestones por defecto
    FOR v_milestone IN SELECT * FROM jsonb_array_elements(v_config.default_milestones)
    LOOP
        INSERT INTO timeline_milestones (
            timeline_id, name, description, expected_time
        ) VALUES (
            v_timeline_id,
            v_milestone->>'name',
            v_milestone->>'description',
            p_expected_end_time - (v_milestone->>'offsetHours')::INTERVAL
        );
    END LOOP;
    
    RETURN v_timeline_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar progreso de milestone
CREATE OR REPLACE FUNCTION update_milestone_progress(
    p_timeline_id UUID,
    p_milestone_name VARCHAR(100),
    p_status VARCHAR(20),
    p_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_milestone_id UUID;
    v_timeline RECORD;
BEGIN
    -- Obtener milestone
    SELECT id INTO v_milestone_id 
    FROM timeline_milestones 
    WHERE timeline_id = p_timeline_id AND name = p_milestone_name;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Milestone % not found for timeline %', p_milestone_name, p_timeline_id;
    END IF;
    
    -- Actualizar milestone
    UPDATE timeline_milestones 
    SET status = p_status, actual_time = CASE WHEN p_status = 'COMPLETED' THEN now() ELSE actual_time END
    WHERE id = v_milestone_id;
    
    -- Obtener información de la línea de tiempo
    SELECT * INTO v_timeline FROM universal_timelines WHERE id = p_timeline_id;
    
    -- Calcular progreso
    UPDATE universal_timelines 
    SET progress_percentage = (
        SELECT ROUND((COUNT(*) FILTER (WHERE status = 'COMPLETED') * 100.0 / COUNT(*))::NUMERIC, 0)
        FROM timeline_milestones 
        WHERE timeline_id = p_timeline_id
    ),
    time_remaining = EXTRACT(EPOCH FROM (expected_end_time - now())) * 1000
    WHERE id = p_timeline_id;
    
    -- Registrar evento
    INSERT INTO timeline_events (timeline_id, event_type, description, user_id)
    VALUES (p_timeline_id, 'MILESTONE_UPDATED', 
            format('Milestone %s updated to status: %s', p_milestone_name, p_status), p_user_id);
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear alerta
CREATE OR REPLACE FUNCTION create_timeline_alert(
    p_timeline_id UUID,
    p_type VARCHAR(50),
    p_title VARCHAR(200),
    p_message TEXT,
    p_severity VARCHAR(20) DEFAULT 'MEDIUM',
    p_actions JSONB DEFAULT '[]'
)
RETURNS UUID AS $$
DECLARE
    v_alert_id UUID;
    v_stakeholder RECORD;
BEGIN
    -- Crear alerta
    INSERT INTO timeline_alerts (
        timeline_id, type, title, message, severity, actions
    ) VALUES (
        p_timeline_id, p_type, p_title, p_message, p_severity, p_actions
    ) RETURNING id INTO v_alert_id;
    
    -- Crear notificaciones para stakeholders
    FOR v_stakeholder IN 
        SELECT ts.*, up.email 
        FROM timeline_stakeholders ts
        JOIN user_profiles up ON ts.user_id = up.id
        WHERE ts.timeline_id = p_timeline_id
    LOOP
        INSERT INTO timeline_notifications (
            timeline_id, user_id, type, title, message, channel
        ) VALUES (
            p_timeline_id, v_stakeholder.user_id, 'ALERT', p_title, p_message, 'EMAIL'
        );
        
        -- Notificación push si está habilitada
        IF v_stakeholder.notification_preferences ? 'PUSH' THEN
            INSERT INTO timeline_notifications (
                timeline_id, user_id, type, title, message, channel
            ) VALUES (
                p_timeline_id, v_stakeholder.user_id, 'ALERT', p_title, p_message, 'PUSH'
            );
        END IF;
    END LOOP;
    
    -- Registrar evento
    INSERT INTO timeline_events (timeline_id, event_type, description)
    VALUES (p_timeline_id, 'ALERT_CREATED', format('Alert created: %s', p_title));
    
    RETURN v_alert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_timelines_updated_at 
    BEFORE UPDATE ON universal_timelines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at 
    BEFORE UPDATE ON timeline_milestones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stakeholders_updated_at 
    BEFORE UPDATE ON timeline_stakeholders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at 
    BEFORE UPDATE ON timeline_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON timeline_notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE universal_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Políticas para universal_timelines
CREATE POLICY "Users can view timelines from their company" ON universal_timelines
    FOR SELECT USING (company_id IN (
        SELECT company_id FROM user_profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can create timelines in their company" ON universal_timelines
    FOR INSERT WITH CHECK (company_id IN (
        SELECT company_id FROM user_profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can update timelines in their company" ON universal_timelines
    FOR UPDATE USING (company_id IN (
        SELECT company_id FROM user_profiles WHERE id = auth.uid()
    ));

-- =====================================================
-- 11. COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE universal_timelines IS 'Tabla principal para el sistema de líneas de tiempo universales';
COMMENT ON TABLE timeline_milestones IS 'Milestones individuales de cada línea de tiempo';
COMMENT ON TABLE timeline_stakeholders IS 'Usuarios involucrados en cada línea de tiempo';
COMMENT ON TABLE timeline_alerts IS 'Alertas generadas por el sistema de líneas de tiempo';
COMMENT ON TABLE timeline_notifications IS 'Notificaciones enviadas a los stakeholders';
COMMENT ON TABLE timeline_events IS 'Historial de eventos de cada línea de tiempo';
COMMENT ON TABLE timeline_type_configs IS 'Configuraciones por defecto para cada tipo de línea de tiempo';

COMMENT ON FUNCTION create_timeline IS 'Función para crear una nueva línea de tiempo con configuración automática';
COMMENT ON FUNCTION update_milestone_progress IS 'Función para actualizar el progreso de un milestone';
COMMENT ON FUNCTION create_timeline_alert IS 'Función para crear alertas automáticas en líneas de tiempo'; 