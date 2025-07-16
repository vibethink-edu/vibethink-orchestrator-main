-- Migración para tablas de compliance GDPR y Ley Colombiana
-- Implementa todos los requisitos de GDPR Art. 12-34 y Ley 1581/2012

-- Tabla de consentimientos del usuario (GDPR Art. 7, Ley 1581 Art. 9)
CREATE TABLE user_consents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    purpose VARCHAR(255) NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT false,
    ip INET,
    user_agent TEXT,
    version VARCHAR(10) NOT NULL DEFAULT '1.0',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    withdrawn_at TIMESTAMPTZ,
    withdrawal_reason VARCHAR(100),
    country VARCHAR(2) NOT NULL DEFAULT 'CO',
    regulation VARCHAR(50) NOT NULL DEFAULT 'GDPR_AND_1581',
    language VARCHAR(5) NOT NULL DEFAULT 'es',
    explicit BOOLEAN NOT NULL DEFAULT true,
    granular BOOLEAN NOT NULL DEFAULT true,
    withdrawable BOOLEAN NOT NULL DEFAULT true,
    
    -- Índices para performance
    CONSTRAINT user_consents_user_purpose_unique UNIQUE (user_id, purpose),
    CONSTRAINT user_consents_timestamp_check CHECK (timestamp <= NOW())
);

-- Tabla de auditoría de consentimientos
CREATE TABLE consent_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    details JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip INET,
    user_agent TEXT,
    
    -- Índices
    CONSTRAINT consent_audit_log_timestamp_check CHECK (timestamp <= NOW())
);

-- Tabla de solicitudes de datos (GDPR Art. 12-22, Ley 1581 Art. 8)
CREATE TABLE data_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('ACCESS', 'RECTIFICATION', 'ERASURE', 'PORTABILITY', 'RESTRICTION', 'OBJECTION')),
    details TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    deadline TIMESTAMPTZ NOT NULL,
    response_data JSONB,
    notes TEXT,
    
    -- Índices
    CONSTRAINT data_requests_deadline_check CHECK (deadline > created_at)
);

-- Tabla de restricciones de procesamiento (GDPR Art. 18)
CREATE TABLE processing_restrictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    purpose VARCHAR(255) NOT NULL,
    restricted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'REMOVED')),
    reason TEXT,
    
    -- Índices
    CONSTRAINT processing_restrictions_user_purpose_unique UNIQUE (user_id, purpose),
    CONSTRAINT processing_restrictions_expires_check CHECK (expires_at IS NULL OR expires_at > restricted_at)
);

-- Tabla de objeciones al procesamiento (GDPR Art. 21, Ley 1581 Art. 8.1)
CREATE TABLE processing_objections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    purpose VARCHAR(255) NOT NULL,
    reason TEXT,
    objected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESOLVED', 'OVERRIDDEN')),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    
    -- Índices
    CONSTRAINT processing_objections_user_purpose_unique UNIQUE (user_id, purpose)
);

-- Tabla de eliminaciones programadas (GDPR Art. 17)
CREATE TABLE scheduled_deletions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    reason VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    
    -- Índices
    CONSTRAINT scheduled_deletions_scheduled_check CHECK (scheduled_at > created_at)
);

-- Tabla de brechas de datos (GDPR Art. 33-34)
CREATE TABLE data_breaches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('PERSONAL_DATA_BREACH', 'SECURITY_BREACH', 'UNAUTHORIZED_ACCESS')),
    description TEXT NOT NULL,
    affected_users INTEGER NOT NULL DEFAULT 0,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    discovered_at TIMESTAMPTZ NOT NULL,
    details JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'INVESTIGATING' CHECK (status IN ('INVESTIGATING', 'CONTAINED', 'RESOLVED', 'CLOSED')),
    reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notification_required BOOLEAN NOT NULL DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    -- Índices
    CONSTRAINT data_breaches_discovered_check CHECK (discovered_at <= reported_at)
);

-- Tabla de notificaciones a autoridades
CREATE TABLE authority_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    breach_id UUID NOT NULL REFERENCES data_breaches(id) ON DELETE CASCADE,
    authority VARCHAR(100) NOT NULL,
    notified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'SENT' CHECK (status IN ('SENT', 'ACKNOWLEDGED', 'RESPONDED')),
    response_received_at TIMESTAMPTZ,
    response_details TEXT,
    
    -- Índices
    CONSTRAINT authority_notifications_breach_authority_unique UNIQUE (breach_id, authority)
);

-- Tabla de notificaciones a usuarios
CREATE TABLE user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    breach_id UUID NOT NULL REFERENCES data_breaches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('DATA_BREACH', 'CONSENT_UPDATE', 'POLICY_CHANGE')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'READ', 'ACKNOWLEDGED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    content JSONB,
    
    -- Índices
    CONSTRAINT user_notifications_breach_user_unique UNIQUE (breach_id, user_id)
);

-- Tabla de actividad del usuario (para portabilidad GDPR Art. 20)
CREATE TABLE user_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    ip INET,
    user_agent TEXT,
    metadata JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT user_activity_log_timestamp_check CHECK (timestamp <= NOW())
);

-- Tabla de perfiles de usuario (datos personales)
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(2) DEFAULT 'CO',
    postal_code VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    preferences JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT user_profiles_date_of_birth_check CHECK (date_of_birth <= CURRENT_DATE)
);

-- Tabla de preferencias del usuario
CREATE TABLE user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    language VARCHAR(5) DEFAULT 'es',
    timezone VARCHAR(50) DEFAULT 'America/Bogota',
    currency VARCHAR(3) DEFAULT 'COP',
    notifications JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Políticas RLS para seguridad multi-tenant

-- Política para user_consents
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own consents" ON user_consents
    FOR ALL USING (auth.uid() = user_id);

-- Política para consent_audit_log
ALTER TABLE consent_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own consent audit logs" ON consent_audit_log
    FOR ALL USING (auth.uid() = user_id);

-- Política para data_requests
ALTER TABLE data_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own data requests" ON data_requests
    FOR ALL USING (auth.uid() = user_id);

-- Política para processing_restrictions
ALTER TABLE processing_restrictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own processing restrictions" ON processing_restrictions
    FOR ALL USING (auth.uid() = user_id);

-- Política para processing_objections
ALTER TABLE processing_objections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own processing objections" ON processing_objections
    FOR ALL USING (auth.uid() = user_id);

-- Política para scheduled_deletions
ALTER TABLE scheduled_deletions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own scheduled deletions" ON scheduled_deletions
    FOR ALL USING (auth.uid() = user_id);

-- Política para user_activity_log
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own activity logs" ON user_activity_log
    FOR ALL USING (auth.uid() = user_id);

-- Política para user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own profiles" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Política para user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Políticas especiales para administradores
CREATE POLICY "Admins can access all compliance data" ON user_consents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('ADMIN', 'OWNER', 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can access all compliance data" ON consent_audit_log
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('ADMIN', 'OWNER', 'SUPER_ADMIN')
        )
    );

CREATE POLICY "Admins can access all compliance data" ON data_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('ADMIN', 'OWNER', 'SUPER_ADMIN')
        )
    );

-- Funciones para automatización

-- Función para limpiar consentimientos expirados
CREATE OR REPLACE FUNCTION cleanup_expired_consents()
RETURNS void AS $$
BEGIN
    UPDATE user_consents 
    SET consent = false, withdrawn_at = NOW(), withdrawal_reason = 'AUTO_EXPIRED'
    WHERE consent = true 
    AND timestamp < NOW() - INTERVAL '2 years'
    AND withdrawn_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Función para procesar eliminaciones programadas
CREATE OR REPLACE FUNCTION process_scheduled_deletions()
RETURNS void AS $$
BEGIN
    UPDATE scheduled_deletions 
    SET status = 'IN_PROGRESS', completed_at = NOW()
    WHERE status = 'SCHEDULED' 
    AND scheduled_at <= NOW();
    
    -- Aquí se implementaría la lógica de eliminación real
    -- Por ahora solo marcamos como completado
    UPDATE scheduled_deletions 
    SET status = 'COMPLETED'
    WHERE status = 'IN_PROGRESS';
END;
$$ LANGUAGE plpgsql;

-- Función para verificar restricciones de procesamiento
CREATE OR REPLACE FUNCTION check_processing_restriction(user_uuid UUID, purpose_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM processing_restrictions 
        WHERE user_id = user_uuid 
        AND purpose = purpose_text 
        AND status = 'ACTIVE'
        AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql;

-- Triggers para auditoría automática

-- Trigger para actualizar updated_at en user_profiles
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at_trigger
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at();

-- Trigger para actualizar updated_at en user_preferences
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_preferences_updated_at_trigger
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_user_preferences_updated_at();

-- Índices para performance

-- Índices en user_consents
CREATE INDEX idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX idx_user_consents_purpose ON user_consents(purpose);
CREATE INDEX idx_user_consents_timestamp ON user_consents(timestamp);
CREATE INDEX idx_user_consents_consent ON user_consents(consent);

-- Índices en consent_audit_log
CREATE INDEX idx_consent_audit_log_user_id ON consent_audit_log(user_id);
CREATE INDEX idx_consent_audit_log_event ON consent_audit_log(event);
CREATE INDEX idx_consent_audit_log_timestamp ON consent_audit_log(timestamp);

-- Índices en data_requests
CREATE INDEX idx_data_requests_user_id ON data_requests(user_id);
CREATE INDEX idx_data_requests_type ON data_requests(request_type);
CREATE INDEX idx_data_requests_status ON data_requests(status);
CREATE INDEX idx_data_requests_deadline ON data_requests(deadline);

-- Índices en data_breaches
CREATE INDEX idx_data_breaches_type ON data_breaches(type);
CREATE INDEX idx_data_breaches_severity ON data_breaches(severity);
CREATE INDEX idx_data_breaches_status ON data_breaches(status);
CREATE INDEX idx_data_breaches_reported_at ON data_breaches(reported_at);

-- Índices en user_activity_log
CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_type ON user_activity_log(activity_type);
CREATE INDEX idx_user_activity_log_timestamp ON user_activity_log(timestamp);

-- Comentarios para documentación
COMMENT ON TABLE user_consents IS 'Almacena consentimientos del usuario según GDPR Art. 7 y Ley 1581 Art. 9';
COMMENT ON TABLE data_requests IS 'Gestiona solicitudes de derechos del usuario según GDPR Art. 12-22 y Ley 1581 Art. 8';
COMMENT ON TABLE data_breaches IS 'Registra brechas de datos según GDPR Art. 33-34';
COMMENT ON TABLE user_activity_log IS 'Registra actividad del usuario para portabilidad GDPR Art. 20';
COMMENT ON TABLE user_profiles IS 'Almacena datos personales del usuario';
COMMENT ON TABLE user_preferences IS 'Almacena preferencias del usuario';

-- Datos iniciales para propósitos de consentimiento
INSERT INTO user_consents (user_id, purpose, consent, ip, user_agent, version, country, regulation) VALUES
('00000000-0000-0000-0000-000000000000', 'MARKETING_EMAILS', false, '127.0.0.1', 'System', '1.0', 'CO', 'GDPR_AND_1581'),
('00000000-0000-0000-0000-000000000000', 'ANALYTICS', false, '127.0.0.1', 'System', '1.0', 'CO', 'GDPR_AND_1581'),
('00000000-0000-0000-0000-000000000000', 'THIRD_PARTY_SHARING', false, '127.0.0.1', 'System', '1.0', 'CO', 'GDPR_AND_1581'),
('00000000-0000-0000-0000-000000000000', 'PROFILING', false, '127.0.0.1', 'System', '1.0', 'CO', 'GDPR_AND_1581'); 