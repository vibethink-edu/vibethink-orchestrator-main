-- Migración para Arquitectura Jerárquica de Organizaciones
-- Basada en mejores prácticas de Zoho y HubSpot

-- =====================================================
-- TABLA DE PLATAFORMA (VibeThink Platform)
-- =====================================================
CREATE TABLE platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT UNIQUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- TABLA DE ORGANIZACIONES PRINCIPALES (Clientes directos)
-- =====================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_id UUID NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    domain TEXT UNIQUE,
    type TEXT DEFAULT 'customer' NOT NULL, -- 'customer', 'partner', 'reseller'
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'suspended', 'cancelled'
    
    -- Configuración de branding
    branding JSONB DEFAULT '{}', -- Logo, colores, textos personalizados
    settings JSONB DEFAULT '{}', -- Configuraciones específicas
    
    -- Información de contacto
    contact_info JSONB DEFAULT '{}',
    
    -- Límites y planes
    plan_type TEXT DEFAULT 'free',
    plan_limits JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    UNIQUE(platform_id, slug)
);

-- =====================================================
-- TABLA DE WORKSPACES (Departamentos/Divisiones)
-- =====================================================
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT DEFAULT 'department' NOT NULL, -- 'department', 'project', 'team'
    status TEXT DEFAULT 'active' NOT NULL,
    
    -- Configuración específica del workspace
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}', -- Herencia del organization + personalización
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    UNIQUE(organization_id, slug)
);

-- =====================================================
-- TABLA DE SUB-ORGANIZACIONES (Clientes de clientes)
-- =====================================================
CREATE TABLE sub_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT DEFAULT 'client' NOT NULL, -- 'client', 'vendor', 'partner'
    status TEXT DEFAULT 'active' NOT NULL,
    
    -- Configuración específica
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}',
    
    -- Información de relación comercial
    relationship_data JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    UNIQUE(parent_organization_id, slug)
);

-- =====================================================
-- TABLA DE SUB-WORKSPACES (Workspaces de sub-organizaciones)
-- =====================================================
CREATE TABLE sub_workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_organization_id UUID NOT NULL REFERENCES sub_organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    type TEXT DEFAULT 'department' NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    UNIQUE(sub_organization_id, slug)
);

-- =====================================================
-- TABLA DE USUARIOS CON ROLES JERÁRQUICOS
-- =====================================================
CREATE TABLE hierarchical_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contexto de la jerarquía
    platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    sub_organization_id UUID REFERENCES sub_organizations(id) ON DELETE CASCADE,
    sub_workspace_id UUID REFERENCES sub_workspaces(id) ON DELETE CASCADE,
    
    -- Rol específico para este contexto
    role TEXT NOT NULL, -- 'SUPER_ADMIN_VT', 'OWNER_CUST', 'ADMIN_CLI', etc.
    permissions JSONB DEFAULT '[]',
    
    -- Estado del usuario en este contexto
    status TEXT DEFAULT 'active' NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- Asegurar que solo un contexto esté activo por usuario
    CONSTRAINT valid_hierarchy_context CHECK (
        (platform_id IS NOT NULL AND organization_id IS NULL AND workspace_id IS NULL AND sub_organization_id IS NULL AND sub_workspace_id IS NULL) OR
        (platform_id IS NOT NULL AND organization_id IS NOT NULL AND workspace_id IS NULL AND sub_organization_id IS NULL AND sub_workspace_id IS NULL) OR
        (platform_id IS NOT NULL AND organization_id IS NOT NULL AND workspace_id IS NOT NULL AND sub_organization_id IS NULL AND sub_workspace_id IS NULL) OR
        (platform_id IS NOT NULL AND organization_id IS NOT NULL AND workspace_id IS NULL AND sub_organization_id IS NOT NULL AND sub_workspace_id IS NULL) OR
        (platform_id IS NOT NULL AND organization_id IS NOT NULL AND workspace_id IS NULL AND sub_organization_id IS NOT NULL AND sub_workspace_id IS NOT NULL)
    )
);

-- =====================================================
-- TABLA DE CONFIGURACIONES DE BRANDING
-- =====================================================
CREATE TABLE branding_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Contexto de la configuración
    platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    sub_organization_id UUID REFERENCES sub_organizations(id) ON DELETE CASCADE,
    sub_workspace_id UUID REFERENCES sub_workspaces(id) ON DELETE CASCADE,
    
    -- Configuración de branding
    logo_url TEXT,
    primary_color TEXT,
    secondary_color TEXT,
    accent_color TEXT,
    
    -- Textos personalizados
    custom_texts JSONB DEFAULT '{}',
    
    -- Configuración de idioma
    default_language TEXT DEFAULT 'es',
    supported_languages TEXT[] DEFAULT '{"es", "en"}',
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- Asegurar que solo un contexto esté configurado
    CONSTRAINT valid_branding_context CHECK (
        (platform_id IS NOT NULL AND organization_id IS NULL AND workspace_id IS NULL AND sub_organization_id IS NULL AND sub_workspace_id IS NULL) OR
        (platform_id IS NOT NULL AND organization_id IS NOT NULL AND workspace_id IS NULL AND sub_organization_id IS NULL AND sub_workspace_id IS NULL) OR
        (platform_id IS NOT NULL AND organization_id IS NOT NULL AND workspace_id IS NOT NULL AND sub_organization_id IS NULL AND sub_workspace_id IS NULL) OR
        (platform_id IS NOT NULL AND organization_id IS NOT NULL AND workspace_id IS NULL AND sub_organization_id IS NOT NULL AND sub_workspace_id IS NULL) OR
        (platform_id IS NOT NULL AND organization_id IS NOT NULL AND workspace_id IS NULL AND sub_organization_id IS NOT NULL AND sub_workspace_id IS NOT NULL)
    )
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX idx_organizations_platform ON organizations(platform_id);
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_workspaces_organization ON workspaces(organization_id);
CREATE INDEX idx_sub_organizations_parent ON sub_organizations(parent_organization_id);
CREATE INDEX idx_sub_workspaces_sub_org ON sub_workspaces(sub_organization_id);
CREATE INDEX idx_hierarchical_users_context ON hierarchical_users(platform_id, organization_id, workspace_id, sub_organization_id, sub_workspace_id);
CREATE INDEX idx_hierarchical_users_user ON hierarchical_users(user_id);
CREATE INDEX idx_branding_configs_context ON branding_configs(platform_id, organization_id, workspace_id, sub_organization_id, sub_workspace_id);

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE hierarchical_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_configs ENABLE ROW LEVEL SECURITY;

-- Políticas para platforms (solo SUPER_ADMIN_VT)
CREATE POLICY "Only SUPER_ADMIN_VT can manage platforms" ON platforms
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND hu.role = 'SUPER_ADMIN_VT'
  )
);

-- Políticas para organizations
CREATE POLICY "organizations_access" ON organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM hierarchical_users hu
            WHERE hu.user_id = auth.uid()
            AND (
                (hu.role = 'SUPER_ADMIN_VT' AND hu.platform_id = organizations.platform_id) OR
                (hu.organization_id = organizations.id)
            )
        )
    );

-- Políticas para workspaces
CREATE POLICY "workspaces_access" ON workspaces
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM hierarchical_users hu
            WHERE hu.user_id = auth.uid()
            AND (
                (hu.role = 'SUPER_ADMIN_VT' AND hu.platform_id = (SELECT platform_id FROM organizations WHERE id = workspaces.organization_id)) OR
                (hu.organization_id = workspaces.organization_id) OR
                (hu.workspace_id = workspaces.id)
            )
        )
    );

-- Políticas para sub_organizations
CREATE POLICY "sub_organizations_access" ON sub_organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM hierarchical_users hu
            WHERE hu.user_id = auth.uid()
            AND (
                (hu.role = 'SUPER_ADMIN_VT' AND hu.platform_id = (SELECT platform_id FROM organizations WHERE id = sub_organizations.parent_organization_id)) OR
                (hu.organization_id = sub_organizations.parent_organization_id) OR
                (hu.sub_organization_id = sub_organizations.id)
            )
        )
    );

-- Políticas para sub_workspaces
CREATE POLICY "sub_workspaces_access" ON sub_workspaces
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM hierarchical_users hu
            WHERE hu.user_id = auth.uid()
            AND (
                (hu.role = 'SUPER_ADMIN_VT' AND hu.platform_id = (
                    SELECT o.platform_id 
                    FROM organizations o 
                    JOIN sub_organizations so ON so.parent_organization_id = o.id 
                    WHERE so.id = sub_workspaces.sub_organization_id
                )) OR
                (hu.sub_organization_id = sub_workspaces.sub_organization_id) OR
                (hu.sub_workspace_id = sub_workspaces.id)
            )
        )
    );

-- Políticas para hierarchical_users
CREATE POLICY "hierarchical_users_access" ON hierarchical_users
    FOR ALL USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM hierarchical_users hu
            WHERE hu.user_id = auth.uid()
            AND hu.role = 'SUPER_ADMIN_VT'
            AND hu.platform_id = hierarchical_users.platform_id
        )
    );

-- Políticas para branding_configs
CREATE POLICY "branding_configs_access" ON branding_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM hierarchical_users hu
            WHERE hu.user_id = auth.uid()
            AND (
                (hu.role = 'SUPER_ADMIN_VT' AND hu.platform_id = branding_configs.platform_id) OR
                (hu.organization_id = branding_configs.organization_id) OR
                (hu.workspace_id = branding_configs.workspace_id) OR
                (hu.sub_organization_id = branding_configs.sub_organization_id) OR
                (hu.sub_workspace_id = branding_configs.sub_workspace_id)
            )
        )
    );

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar la plataforma VibeThink
INSERT INTO platforms (name, slug, domain, settings) VALUES (
    'VibeThink Platform',
    'vibethink',
    'vibethink.com',
    '{"features": {"ai_chat": true, "command_xtr": true, "document_xtr": true}}'
);

-- =====================================================
-- FUNCIONES DE UTILIDAD
-- =====================================================

-- Función para obtener el contexto completo de un usuario
CREATE OR REPLACE FUNCTION get_user_context(user_uuid UUID)
RETURNS TABLE (
    platform_id UUID,
    organization_id UUID,
    workspace_id UUID,
    sub_organization_id UUID,
    sub_workspace_id UUID,
    role TEXT,
    permissions JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hu.platform_id,
        hu.organization_id,
        hu.workspace_id,
        hu.sub_organization_id,
        hu.sub_workspace_id,
        hu.role,
        hu.permissions
    FROM hierarchical_users hu
    WHERE hu.user_id = user_uuid
    AND hu.status = 'active'
    ORDER BY 
        CASE 
            WHEN hu.platform_id IS NOT NULL AND hu.organization_id IS NULL THEN 1
            WHEN hu.organization_id IS NOT NULL AND hu.workspace_id IS NULL THEN 2
            WHEN hu.workspace_id IS NOT NULL THEN 3
            WHEN hu.sub_organization_id IS NOT NULL AND hu.sub_workspace_id IS NULL THEN 4
            WHEN hu.sub_workspace_id IS NOT NULL THEN 5
        END
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener branding configurado
CREATE OR REPLACE FUNCTION get_branding_config(
    p_platform_id UUID DEFAULT NULL,
    p_organization_id UUID DEFAULT NULL,
    p_workspace_id UUID DEFAULT NULL,
    p_sub_organization_id UUID DEFAULT NULL,
    p_sub_workspace_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Buscar configuración específica
    SELECT bc.* INTO result
    FROM branding_configs bc
    WHERE bc.platform_id = p_platform_id
    AND bc.organization_id = p_organization_id
    AND bc.workspace_id = p_workspace_id
    AND bc.sub_organization_id = p_sub_organization_id
    AND bc.sub_workspace_id = p_sub_workspace_id;
    
    -- Si no se encuentra, buscar configuración heredada
    IF result IS NULL THEN
        SELECT bc.* INTO result
        FROM branding_configs bc
        WHERE bc.platform_id = p_platform_id
        AND bc.organization_id = p_organization_id
        AND bc.workspace_id = p_workspace_id
        AND bc.sub_organization_id = p_sub_organization_id
        AND bc.sub_workspace_id IS NULL;
    END IF;
    
    -- Continuar buscando en niveles superiores si es necesario
    IF result IS NULL THEN
        SELECT bc.* INTO result
        FROM branding_configs bc
        WHERE bc.platform_id = p_platform_id
        AND bc.organization_id = p_organization_id
        AND bc.workspace_id IS NULL
        AND bc.sub_organization_id IS NULL
        AND bc.sub_workspace_id IS NULL;
    END IF;
    
    -- Configuración por defecto de la plataforma
    IF result IS NULL THEN
        SELECT bc.* INTO result
        FROM branding_configs bc
        WHERE bc.platform_id = p_platform_id
        AND bc.organization_id IS NULL
        AND bc.workspace_id IS NULL
        AND bc.sub_organization_id IS NULL
        AND bc.sub_workspace_id IS NULL;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE platforms IS 'Plataforma principal (VibeThink Platform)';
COMMENT ON TABLE organizations IS 'Organizaciones principales (clientes directos de la plataforma)';
COMMENT ON TABLE workspaces IS 'Workspaces dentro de organizaciones (departamentos, proyectos)';
COMMENT ON TABLE sub_organizations IS 'Sub-organizaciones (clientes de los clientes)';
COMMENT ON TABLE sub_workspaces IS 'Workspaces de sub-organizaciones';
COMMENT ON TABLE hierarchical_users IS 'Usuarios con roles jerárquicos en diferentes contextos';
COMMENT ON TABLE branding_configs IS 'Configuraciones de branding por contexto'; 