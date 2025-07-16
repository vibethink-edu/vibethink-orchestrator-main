-- Migration: Departmental Permissions System
-- Author: AI Pair Platform Team
-- Version: 1.0.0

-- Crear tipo enum para códigos de departamento
CREATE TYPE department_code AS ENUM (
  'OPERATIONS',
  'FINANCE', 
  'HR',
  'IT',
  'MARKETING',
  'SALES',
  'LEGAL',
  'EXECUTIVE',
  'GENERAL'
);

-- Crear tipo enum para tipos de recursos
CREATE TYPE resource_type AS ENUM (
  'FOLDER',
  'DOCUMENT', 
  'WORKFLOW',
  'AI_FEATURE',
  'INTEGRATION',
  'ANALYTICS',
  'CONFIGURATION'
);

-- Crear tipo enum para niveles de permisos
CREATE TYPE permission_level AS ENUM (
  'NONE',
  'VIEW',
  'COMMENT', 
  'EDIT',
  'MANAGE',
  'ADMIN'
);

-- Tabla de departamentos
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code department_code NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  manager_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  parent_department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  UNIQUE(company_id, code),
  CHECK (id != parent_department_id) -- Evitar auto-referencia
);

-- Tabla de permisos departamentales
CREATE TABLE public.departmental_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  department_code department_code NOT NULL,
  resource_type resource_type NOT NULL,
  resource_id TEXT NOT NULL,
  resource_pattern TEXT, -- Para patrones como "Operations/*"
  permission_level permission_level NOT NULL DEFAULT 'NONE',
  conditions JSONB DEFAULT NULL,
  created_by UUID NOT NULL REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  FOREIGN KEY (company_id, department_code) REFERENCES public.departments(company_id, code) ON DELETE CASCADE
);

-- Tabla de membresía departamental de usuarios
CREATE TABLE public.user_department_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  department_code department_code NOT NULL,
  role_in_department TEXT NOT NULL CHECK (role_in_department IN ('MEMBER', 'LEAD', 'MANAGER', 'ADMIN')),
  primary_department BOOLEAN NOT NULL DEFAULT false,
  permissions_override JSONB DEFAULT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Constraints
  FOREIGN KEY (company_id, department_code) REFERENCES public.departments(company_id, code) ON DELETE CASCADE,
  UNIQUE(user_id, company_id, department_code)
);

-- Tabla de log de acceso a recursos
CREATE TABLE public.resource_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  resource_type resource_type NOT NULL,
  resource_id TEXT NOT NULL,
  permission_level permission_level NOT NULL,
  access_source TEXT NOT NULL CHECK (access_source IN ('ROLE', 'DEPARTMENT', 'DIRECT', 'INHERITED')),
  department_code department_code,
  granted_by UUID REFERENCES public.user_profiles(id),
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Índices para performance
CREATE INDEX idx_departments_company_id ON public.departments(company_id);
CREATE INDEX idx_departments_manager ON public.departments(manager_user_id);
CREATE INDEX idx_departmental_permissions_company_dept ON public.departmental_permissions(company_id, department_code);
CREATE INDEX idx_departmental_permissions_resource ON public.departmental_permissions(resource_type, resource_id);
CREATE INDEX idx_user_memberships_user ON public.user_department_memberships(user_id);
CREATE INDEX idx_user_memberships_company_dept ON public.user_department_memberships(company_id, department_code);
CREATE INDEX idx_resource_access_log_user_resource ON public.resource_access_log(user_id, resource_type, resource_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_departments_updated_at 
  BEFORE UPDATE ON public.departments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departmental_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_department_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_access_log ENABLE ROW LEVEL SECURITY;

-- Policy: Solo usuarios de la misma empresa ven sus departamentos
CREATE POLICY "Users see their company departments" ON public.departments
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM public.user_profiles WHERE id = auth.uid())
    OR
    -- SUPPORT puede ver todos los departamentos
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.companies c ON up.company_id = c.id
      WHERE up.id = auth.uid() 
      AND up.role = 'SUPPORT'
      AND c.slug = 'vibethink-platform'
    )
  );

-- Policy: Solo ADMIN+ pueden gestionar departamentos
CREATE POLICY "Admins manage departments" ON public.departments
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Policy: Usuarios ven permisos de sus departamentos
CREATE POLICY "Users see their department permissions" ON public.departmental_permissions
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM public.user_profiles WHERE id = auth.uid())
    AND department_code IN (
      SELECT department_code FROM public.user_department_memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
    OR
    -- ADMIN+ pueden ver todos los permisos de su empresa
    company_id IN (
      SELECT company_id FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Policy: Solo ADMIN+ gestionan permisos departamentales
CREATE POLICY "Admins manage departmental permissions" ON public.departmental_permissions
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Policy: Usuarios ven sus propias membresías
CREATE POLICY "Users see their memberships" ON public.user_department_memberships
  FOR SELECT USING (
    user_id = auth.uid()
    OR
    -- ADMIN+ pueden ver todas las membresías de su empresa
    company_id IN (
      SELECT company_id FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Policy: Solo ADMIN+ gestionan membresías
CREATE POLICY "Admins manage memberships" ON public.user_department_memberships
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Policy: Usuarios ven su propio log de acceso
CREATE POLICY "Users see their access log" ON public.resource_access_log
  FOR SELECT USING (
    user_id = auth.uid()
    OR
    -- ADMIN+ pueden ver logs de su empresa
    company_id IN (
      SELECT company_id FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Función para verificar acceso a recurso
CREATE OR REPLACE FUNCTION check_resource_access(
  p_user_id UUID,
  p_resource_type resource_type,
  p_resource_id TEXT,
  p_required_level permission_level
)
RETURNS TABLE(
  has_access BOOLEAN,
  permission_level permission_level,
  access_source TEXT,
  department_code department_code
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  user_company_id UUID;
  max_permission permission_level := 'NONE';
  found_source TEXT := 'NONE';
  found_department department_code;
  
  -- Jerarquía de permisos
  permission_hierarchy INTEGER;
  required_hierarchy INTEGER;
BEGIN
  -- Obtener company_id del usuario
  SELECT company_id INTO user_company_id
  FROM user_profiles WHERE id = p_user_id;
  
  IF user_company_id IS NULL THEN
    RETURN QUERY SELECT false, 'NONE'::permission_level, 'NONE', NULL::department_code;
    RETURN;
  END IF;
  
  -- Verificar permisos departamentales
  SELECT dp.permission_level, dp.department_code
  INTO max_permission, found_department
  FROM departmental_permissions dp
  JOIN user_department_memberships udm ON 
    dp.company_id = udm.company_id AND 
    dp.department_code = udm.department_code
  WHERE udm.user_id = p_user_id
    AND udm.is_active = true
    AND dp.resource_type = p_resource_type
    AND dp.is_active = true
    AND (dp.expires_at IS NULL OR dp.expires_at > now())
    AND (
      dp.resource_id = p_resource_id
      OR 
      (dp.resource_pattern IS NOT NULL AND p_resource_id ~ dp.resource_pattern)
    )
  ORDER BY 
    CASE dp.permission_level
      WHEN 'ADMIN' THEN 5
      WHEN 'MANAGE' THEN 4
      WHEN 'EDIT' THEN 3
      WHEN 'COMMENT' THEN 2
      WHEN 'VIEW' THEN 1
      ELSE 0
    END DESC
  LIMIT 1;
  
  IF max_permission IS NOT NULL THEN
    found_source := 'DEPARTMENT';
  END IF;
  
  -- Convertir niveles a jerarquía numérica para comparar
  permission_hierarchy := CASE max_permission
    WHEN 'ADMIN' THEN 5
    WHEN 'MANAGE' THEN 4
    WHEN 'EDIT' THEN 3
    WHEN 'COMMENT' THEN 2
    WHEN 'VIEW' THEN 1
    ELSE 0
  END;
  
  required_hierarchy := CASE p_required_level
    WHEN 'ADMIN' THEN 5
    WHEN 'MANAGE' THEN 4
    WHEN 'EDIT' THEN 3
    WHEN 'COMMENT' THEN 2
    WHEN 'VIEW' THEN 1
    ELSE 0
  END;
  
  RETURN QUERY SELECT 
    permission_hierarchy >= required_hierarchy,
    COALESCE(max_permission, 'NONE'::permission_level),
    found_source,
    found_department;
END;
$$;

-- Función para obtener departamentos de un usuario
CREATE OR REPLACE FUNCTION get_user_departments(p_user_id UUID)
RETURNS TABLE(
  department_code department_code,
  department_name TEXT,
  role_in_department TEXT,
  is_primary BOOLEAN
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    udm.department_code,
    d.name,
    udm.role_in_department,
    udm.primary_department
  FROM user_department_memberships udm
  JOIN departments d ON udm.company_id = d.company_id AND udm.department_code = d.code
  WHERE udm.user_id = p_user_id 
    AND udm.is_active = true
    AND d.is_active = true
  ORDER BY udm.primary_department DESC, d.name;
END;
$$;

-- Insertar departamentos por defecto para empresas existentes
DO $$
DECLARE
  company_record RECORD;
BEGIN
  FOR company_record IN SELECT id, name FROM companies WHERE status = 'ACTIVE'
  LOOP
    -- Insertar departamentos básicos para cada empresa
    INSERT INTO departments (company_id, code, name, description) VALUES
    (company_record.id, 'OPERATIONS', 'Operaciones', 'Gestión operativa y procesos internos'),
    (company_record.id, 'FINANCE', 'Finanzas', 'Gestión financiera y contabilidad'),
    (company_record.id, 'HR', 'Recursos Humanos', 'Gestión de personal y recursos humanos'),
    (company_record.id, 'IT', 'Tecnología', 'Sistemas, infraestructura y desarrollo'),
    (company_record.id, 'MARKETING', 'Marketing', 'Marketing, comunicación y relaciones públicas'),
    (company_record.id, 'SALES', 'Ventas', 'Ventas, atención al cliente y desarrollo comercial'),
    (company_record.id, 'LEGAL', 'Legal', 'Asuntos legales, compliance y auditoría'),
    (company_record.id, 'EXECUTIVE', 'Ejecutivo', 'Dirección ejecutiva y toma de decisiones estratégicas'),
    (company_record.id, 'GENERAL', 'General', 'Acceso transversal a recursos compartidos')
    ON CONFLICT (company_id, code) DO NOTHING;
  END LOOP;
END;
$$;

-- Comentarios para documentación
COMMENT ON TABLE public.departments IS 'Departamentos organizacionales por empresa';
COMMENT ON TABLE public.departmental_permissions IS 'Permisos granulares por departamento y tipo de recurso';
COMMENT ON TABLE public.user_department_memberships IS 'Membresía de usuarios en departamentos';
COMMENT ON TABLE public.resource_access_log IS 'Log de acceso a recursos para auditoría';
COMMENT ON FUNCTION check_resource_access IS 'Verifica si un usuario tiene acceso a un recurso específico';
COMMENT ON FUNCTION get_user_departments IS 'Obtiene los departamentos de un usuario'; 