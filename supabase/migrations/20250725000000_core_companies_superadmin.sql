-- VibeThink Orchestrator - Core Companies & Super Admin Schema
-- =============================================================
-- Date: 2025-07-25
-- Description: Estructura básica para empresas y superadministración

-- =============================================
-- 1. EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 2. ENUMS
-- =============================================

-- Plan types
CREATE TYPE plan_type AS ENUM (
    'FREE',
    'BASIC', 
    'PRO',
    'ENTERPRISE',
    'CUSTOM'
);

-- Company status
CREATE TYPE company_status AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'CANCELLED',
    'PENDING'
);

-- User roles
CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN',     -- Administrador global del sistema
    'COMPANY_OWNER',   -- Dueño de la empresa
    'COMPANY_ADMIN',   -- Administrador de empresa
    'MANAGER',         -- Gerente de departamento
    'EMPLOYEE',        -- Empleado regular
    'GUEST'            -- Usuario invitado
);

-- User status
CREATE TYPE user_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING'
);

-- =============================================
-- 3. CORE TABLES
-- =============================================

-- Companies Table (Tenant Root)
CREATE TABLE companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT,
    logo_url TEXT,
    
    -- Business Information
    industry TEXT,
    size_category TEXT CHECK (size_category IN ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE')),
    country_code CHAR(2),
    timezone TEXT DEFAULT 'UTC',
    
    -- Subscription & Billing
    plan_type plan_type DEFAULT 'FREE',
    plan_limits JSONB DEFAULT '{}',
    billing_email TEXT,
    
    -- Status & Metadata
    status company_status DEFAULT 'ACTIVE',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT companies_slug_format CHECK (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'),
    CONSTRAINT companies_name_length CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 100)
);

-- Users Table (Extended from Supabase Auth)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    
    -- Company Association
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Role & Permissions
    role user_role DEFAULT 'EMPLOYEE',
    department TEXT,
    position TEXT,
    manager_id UUID REFERENCES user_profiles(id),
    
    -- Status & Activity
    status user_status DEFAULT 'ACTIVE',
    last_login TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE,
    
    -- Preferences & Settings
    settings JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT user_profiles_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT user_profiles_super_admin_no_company CHECK (
        (role = 'SUPER_ADMIN' AND company_id IS NULL) OR 
        (role != 'SUPER_ADMIN' AND company_id IS NOT NULL)
    )
);

-- Super Admin Table (Configuraciones globales)
CREATE TABLE super_admin_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Audit Log (Para super administradores)
CREATE TABLE system_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id UUID REFERENCES user_profiles(id),
    actor_email TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    company_id UUID REFERENCES companies(id),
    
    -- Event Details
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT audit_log_action_not_empty CHECK (LENGTH(action) > 0)
);

-- Company Invitations
CREATE TABLE company_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role DEFAULT 'EMPLOYEE',
    department TEXT,
    
    -- Invitation Details
    invited_by UUID REFERENCES user_profiles(id),
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(company_id, email)
);

-- =============================================
-- 4. INDEXES FOR PERFORMANCE
-- =============================================

-- Companies indexes
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_plan_type ON companies(plan_type);
CREATE INDEX idx_companies_created_at ON companies(created_at);

-- User profiles indexes
CREATE INDEX idx_user_profiles_company_id ON user_profiles(company_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_manager_id ON user_profiles(manager_id);

-- Audit log indexes
CREATE INDEX idx_audit_log_actor_id ON system_audit_log(actor_id);
CREATE INDEX idx_audit_log_company_id ON system_audit_log(company_id);
CREATE INDEX idx_audit_log_resource_type ON system_audit_log(resource_type);
CREATE INDEX idx_audit_log_created_at ON system_audit_log(created_at);

-- Invitations indexes
CREATE INDEX idx_invitations_company_id ON company_invitations(company_id);
CREATE INDEX idx_invitations_email ON company_invitations(email);
CREATE INDEX idx_invitations_token ON company_invitations(token);
CREATE INDEX idx_invitations_expires_at ON company_invitations(expires_at);

-- =============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admin_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_invitations ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Super admins can view all companies" ON companies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
        )
    );

CREATE POLICY "Users can view their own company" ON companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Company owners/admins can update their company" ON companies
    FOR UPDATE USING (
        id IN (
            SELECT company_id FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('COMPANY_OWNER', 'COMPANY_ADMIN')
        )
    );

-- User profiles policies
CREATE POLICY "Users can view profiles in their company" ON user_profiles
    FOR SELECT USING (
        -- Super admins can see all
        (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'SUPER_ADMIN'
        OR
        -- Users can see profiles in their company
        company_id IN (
            SELECT company_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Company admins can update profiles in their company" ON user_profiles
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('COMPANY_OWNER', 'COMPANY_ADMIN')
        )
    );

-- Super admin config policies
CREATE POLICY "Only super admins can manage config" ON super_admin_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
        )
    );

-- Audit log policies
CREATE POLICY "Super admins can view all audit logs" ON system_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
        )
    );

CREATE POLICY "Company admins can view their company audit logs" ON system_audit_log
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('COMPANY_OWNER', 'COMPANY_ADMIN')
        )
    );

-- Invitations policies
CREATE POLICY "Company admins can manage invitations" ON company_invitations
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('COMPANY_OWNER', 'COMPANY_ADMIN')
        )
    );

-- =============================================
-- 6. FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER super_admin_config_updated_at 
    BEFORE UPDATE ON super_admin_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER company_invitations_updated_at 
    BEFORE UPDATE ON company_invitations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log system events
CREATE OR REPLACE FUNCTION log_system_event(
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT DEFAULT NULL,
    p_company_id UUID DEFAULT NULL,
    p_event_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
    current_user_email TEXT;
BEGIN
    -- Get current user email
    SELECT email INTO current_user_email
    FROM user_profiles 
    WHERE id = auth.uid();
    
    INSERT INTO system_audit_log (
        actor_id,
        actor_email,
        action,
        resource_type,
        resource_id,
        company_id,
        event_data
    ) VALUES (
        auth.uid(),
        current_user_email,
        p_action,
        p_resource_type,
        p_resource_id,
        p_company_id,
        p_event_data
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. INITIAL DATA
-- =============================================

-- Insert default super admin config
INSERT INTO super_admin_config (config_key, config_value, description, is_public) VALUES
    ('system_name', '"VibeThink Orchestrator"', 'Nombre del sistema', true),
    ('system_version', '"1.0.0"', 'Versión actual del sistema', true),
    ('max_companies', '1000', 'Máximo número de empresas permitidas', false),
    ('default_plan_limits', '{"users": 5, "storage_gb": 1, "ai_requests_monthly": 100}', 'Límites por defecto para plan FREE', false),
    ('maintenance_mode', 'false', 'Modo de mantenimiento del sistema', false);

-- =============================================
-- 8. COMMENTS
-- =============================================

COMMENT ON TABLE companies IS 'Tabla principal de empresas (tenants del sistema)';
COMMENT ON TABLE user_profiles IS 'Perfiles de usuario extendidos de Supabase Auth';
COMMENT ON TABLE super_admin_config IS 'Configuraciones globales del sistema';
COMMENT ON TABLE system_audit_log IS 'Log de auditoría para administradores';
COMMENT ON TABLE company_invitations IS 'Invitaciones pendientes a empresas';

COMMENT ON COLUMN companies.slug IS 'URL-friendly identifier único por empresa';
COMMENT ON COLUMN companies.plan_limits IS 'Límites específicos del plan de la empresa';
COMMENT ON COLUMN user_profiles.role IS 'Rol del usuario en el sistema';
COMMENT ON COLUMN user_profiles.company_id IS 'NULL solo para SUPER_ADMIN';
