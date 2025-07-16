-- =====================================================
-- MIGRACIÓN: PERFILES UNIFICADOS + COOKIES MODERNAS
-- VThink 1.0 - Estándares 2025
-- =====================================================

-- =====================================================
-- 1. TABLA DE PERFILES UNIFICADOS
-- =====================================================
CREATE TABLE unified_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contexto multi-tenant
    tenant_id UUID NOT NULL,
    workspace_id UUID,
    organization_id UUID,
    
    -- Datos personales
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    
    -- Rol unificado con contexto
    role TEXT NOT NULL CHECK (role IN (
        -- VThink Internal (_VT)
        'SUPER_ADMIN_VT', 'SUPPORT_VT', 'DEVELOPER_VT', 'MANAGER_VT', 'EMPLOYEE_VT',
        -- Customer (_CUST)
        'OWNER_CUST', 'ADMIN_CUST', 'MANAGER_CUST', 'EMPLOYEE_CUST',
        -- Partner (_PART)
        'PARTNER_ADMIN_PART', 'PARTNER_MANAGER_PART', 'PARTNER_EMPLOYEE_PART'
    )),
    
    -- Estado y configuración
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
    preferences JSONB DEFAULT '{}',
    permissions JSONB DEFAULT '[]',
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    last_login TIMESTAMPTZ,
    last_activity TIMESTAMPTZ,
    
    -- Constraints
    UNIQUE(auth_user_id),
    UNIQUE(tenant_id, email)
);

-- =====================================================
-- 2. TABLA DE COOKIES MODERNAS
-- =====================================================
CREATE TABLE modern_cookies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES unified_profiles(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    
    -- Datos de la cookie
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    domain TEXT,
    path TEXT DEFAULT '/',
    
    -- Configuración moderna
    secure BOOLEAN DEFAULT true,
    http_only BOOLEAN DEFAULT true,
    same_site TEXT DEFAULT 'Lax' CHECK (same_site IN ('Strict', 'Lax', 'None')),
    partitioned BOOLEAN DEFAULT false,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    
    -- Vida útil
    expires_at TIMESTAMPTZ,
    max_age INTEGER, -- en segundos
    
    -- Propósito y consentimiento
    purpose TEXT NOT NULL CHECK (purpose IN (
        'essential', 'functional', 'analytics', 'marketing', 'preferences'
    )),
    consent_given BOOLEAN DEFAULT false,
    consent_timestamp TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- Constraints
    UNIQUE(user_id, name, domain)
);

-- =====================================================
-- 3. TABLA DE CONSENTIMIENTO DE COOKIES
-- =====================================================
CREATE TABLE cookie_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES unified_profiles(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    
    -- Consentimientos específicos
    essential_consent BOOLEAN DEFAULT true,
    functional_consent BOOLEAN DEFAULT false,
    analytics_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    preferences_consent BOOLEAN DEFAULT false,
    
    -- Información del consentimiento
    consent_version TEXT NOT NULL,
    consent_timestamp TIMESTAMPTZ DEFAULT now() NOT NULL,
    ip_address INET,
    user_agent TEXT,
    
    -- Configuración de privacidad
    privacy_settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    UNIQUE(user_id, tenant_id)
);

-- =====================================================
-- 4. TABLA DE SESIONES MODERNAS
-- =====================================================
CREATE TABLE modern_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES unified_profiles(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    
    -- Datos de sesión
    session_token TEXT UNIQUE NOT NULL,
    refresh_token TEXT UNIQUE,
    
    -- Información del dispositivo
    device_id TEXT,
    device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
    browser TEXT,
    os TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Estado de la sesión
    is_active BOOLEAN DEFAULT true,
    is_remembered BOOLEAN DEFAULT false,
    
    -- Seguridad
    last_activity TIMESTAMPTZ DEFAULT now() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- 5. TABLA DE PREFERENCIAS DE PRIVACIDAD
-- =====================================================
CREATE TABLE privacy_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES unified_profiles(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    
    -- Configuraciones de privacidad
    data_collection BOOLEAN DEFAULT false,
    analytics_tracking BOOLEAN DEFAULT false,
    marketing_communications BOOLEAN DEFAULT false,
    third_party_sharing BOOLEAN DEFAULT false,
    
    -- Configuraciones de notificaciones
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    sms_notifications BOOLEAN DEFAULT false,
    
    -- Configuraciones de idioma y región
    language TEXT DEFAULT 'es',
    timezone TEXT DEFAULT 'UTC',
    date_format TEXT DEFAULT 'DD/MM/YYYY',
    time_format TEXT DEFAULT '24h',
    
    -- Configuraciones de accesibilidad
    high_contrast BOOLEAN DEFAULT false,
    reduced_motion BOOLEAN DEFAULT false,
    screen_reader BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    UNIQUE(user_id, tenant_id)
);

-- =====================================================
-- 6. FUNCIONES PARA GESTIÓN DE COOKIES
-- =====================================================

-- Función para crear cookie moderna
CREATE OR REPLACE FUNCTION create_modern_cookie(
    p_user_id UUID,
    p_tenant_id UUID,
    p_name TEXT,
    p_value TEXT,
    p_purpose TEXT DEFAULT 'essential',
    p_domain TEXT DEFAULT NULL,
    p_path TEXT DEFAULT '/',
    p_secure BOOLEAN DEFAULT true,
    p_http_only BOOLEAN DEFAULT true,
    p_same_site TEXT DEFAULT 'Lax',
    p_max_age INTEGER DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cookie_id UUID;
BEGIN
    INSERT INTO modern_cookies (
        user_id, tenant_id, name, value, domain, path,
        secure, http_only, same_site, max_age, purpose,
        expires_at
    ) VALUES (
        p_user_id, p_tenant_id, p_name, p_value, p_domain, p_path,
        p_secure, p_http_only, p_same_site, p_max_age, p_purpose,
        CASE 
            WHEN p_max_age IS NOT NULL THEN now() + (p_max_age || ' seconds')::INTERVAL
            ELSE NULL
        END
    ) RETURNING id INTO cookie_id;
    
    RETURN cookie_id;
END;
$$;

-- Función para verificar consentimiento
CREATE OR REPLACE FUNCTION has_cookie_consent(
    p_user_id UUID,
    p_tenant_id UUID,
    p_purpose TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    consent_record RECORD;
BEGIN
    SELECT * INTO consent_record
    FROM cookie_consents
    WHERE user_id = p_user_id AND tenant_id = p_tenant_id;
    
    IF NOT FOUND THEN
        RETURN p_purpose = 'essential';
    END IF;
    
    CASE p_purpose
        WHEN 'essential' THEN RETURN true;
        WHEN 'functional' THEN RETURN consent_record.functional_consent;
        WHEN 'analytics' THEN RETURN consent_record.analytics_consent;
        WHEN 'marketing' THEN RETURN consent_record.marketing_consent;
        WHEN 'preferences' THEN RETURN consent_record.preferences_consent;
        ELSE RETURN false;
    END CASE;
END;
$$;

-- Función para limpiar cookies expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_cookies()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM modern_cookies
    WHERE expires_at IS NOT NULL AND expires_at < now();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- =====================================================
-- 7. TRIGGERS Y AUTOMATIZACIÓN
-- =====================================================

-- Trigger para actualizar last_activity
CREATE OR REPLACE FUNCTION update_last_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.last_activity = now();
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_last_activity
    BEFORE UPDATE ON unified_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_last_activity();

-- Trigger para limpiar sesiones expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE modern_sessions
    SET is_active = false
    WHERE expires_at < now() AND is_active = true;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_cleanup_expired_sessions
    AFTER INSERT ON modern_sessions
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_expired_sessions();

-- =====================================================
-- 8. POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE unified_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modern_cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE modern_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas para unified_profiles
CREATE POLICY "Users can view own profile" ON unified_profiles
    FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON unified_profiles
    FOR UPDATE USING (auth.uid() = auth_user_id);

-- Políticas para modern_cookies
CREATE POLICY "Users can manage own cookies" ON modern_cookies
    FOR ALL USING (auth.uid() IN (
        SELECT auth_user_id FROM unified_profiles WHERE id = user_id
    ));

-- Políticas para cookie_consents
CREATE POLICY "Users can manage own consents" ON cookie_consents
    FOR ALL USING (auth.uid() IN (
        SELECT auth_user_id FROM unified_profiles WHERE id = user_id
    ));

-- Políticas para modern_sessions
CREATE POLICY "Users can manage own sessions" ON modern_sessions
    FOR ALL USING (auth.uid() IN (
        SELECT auth_user_id FROM unified_profiles WHERE id = user_id
    ));

-- Políticas para privacy_preferences
CREATE POLICY "Users can manage own privacy preferences" ON privacy_preferences
    FOR ALL USING (auth.uid() IN (
        SELECT auth_user_id FROM unified_profiles WHERE id = user_id
    ));

-- =====================================================
-- 9. ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

CREATE INDEX idx_unified_profiles_auth_user ON unified_profiles(auth_user_id);
CREATE INDEX idx_unified_profiles_tenant ON unified_profiles(tenant_id);
CREATE INDEX idx_unified_profiles_role ON unified_profiles(role);
CREATE INDEX idx_unified_profiles_status ON unified_profiles(status);

CREATE INDEX idx_modern_cookies_user ON modern_cookies(user_id);
CREATE INDEX idx_modern_cookies_purpose ON modern_cookies(purpose);
CREATE INDEX idx_modern_cookies_expires ON modern_cookies(expires_at);

CREATE INDEX idx_cookie_consents_user ON cookie_consents(user_id);
CREATE INDEX idx_cookie_consents_tenant ON cookie_consents(tenant_id);

CREATE INDEX idx_modern_sessions_user ON modern_sessions(user_id);
CREATE INDEX idx_modern_sessions_token ON modern_sessions(session_token);
CREATE INDEX idx_modern_sessions_expires ON modern_sessions(expires_at);

CREATE INDEX idx_privacy_preferences_user ON privacy_preferences(user_id);
CREATE INDEX idx_privacy_preferences_tenant ON privacy_preferences(tenant_id);

-- =====================================================
-- 10. DATOS INICIALES
-- =====================================================

-- Insertar configuración por defecto para VThink Platform
INSERT INTO unified_profiles (
    auth_user_id, tenant_id, email, first_name, last_name, role, status
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- Placeholder
    '00000000-0000-0000-0000-000000000000', -- Placeholder
    'admin@vibethink.com',
    'VThink',
    'Admin',
    'SUPER_ADMIN_VT',
    'active'
) ON CONFLICT DO NOTHING;

-- Comentarios para documentación
COMMENT ON TABLE unified_profiles IS 'Perfiles unificados con soporte multi-tenant y roles jerárquicos';
COMMENT ON TABLE modern_cookies IS 'Cookies modernas con estándares de privacidad 2025';
COMMENT ON TABLE cookie_consents IS 'Consentimientos de cookies por usuario y tenant';
COMMENT ON TABLE modern_sessions IS 'Sesiones modernas con tokens seguros';
COMMENT ON TABLE privacy_preferences IS 'Preferencias de privacidad y configuración personal'; 