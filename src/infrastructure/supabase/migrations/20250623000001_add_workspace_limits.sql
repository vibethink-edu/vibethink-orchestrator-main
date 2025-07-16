-- Migración para agregar límites de workspaces a los planes
-- Fecha: 2025-01-22
-- Objetivo: Permitir configurar límites de workspaces por plan

-- =====================================================
-- AGREGAR COLUMNA DE LÍMITES DE WORKSPACES
-- =====================================================

-- Agregar columna max_workspaces a plan_definitions
ALTER TABLE plan_definitions 
ADD COLUMN max_workspaces INTEGER DEFAULT 1;

-- Agregar columna custom_max_workspaces a companies para overrides
ALTER TABLE companies 
ADD COLUMN custom_max_workspaces INTEGER;

-- =====================================================
-- ACTUALIZAR PLANES EXISTENTES CON LÍMITES DE WORKSPACES
-- =====================================================

-- Actualizar planes con límites de workspaces
UPDATE plan_definitions SET max_workspaces = 1 WHERE name = 'STARTER';
UPDATE plan_definitions SET max_workspaces = 5 WHERE name = 'PROFESSIONAL';
UPDATE plan_definitions SET max_workspaces = 20 WHERE name = 'ENTERPRISE';
UPDATE plan_definitions SET max_workspaces = NULL WHERE name = 'CUSTOM'; -- Configurable, no ilimitado

-- =====================================================
-- ACTUALIZAR PLAN CUSTOM PARA SER CONFIGURABLE
-- =====================================================

-- Cambiar valores arbitrarios altos por NULL (configurable)
UPDATE plan_definitions SET 
  max_users = NULL,
  max_monthly_ai_requests = NULL,
  max_monthly_scraping_pages = NULL,
  max_storage_gb = NULL,
  max_workspaces = NULL
WHERE name = 'CUSTOM';

-- =====================================================
-- ACTUALIZAR FUNCIÓN get_company_limits
-- =====================================================

CREATE OR REPLACE FUNCTION get_company_limits(p_company_id UUID)
RETURNS TABLE(
  max_users INTEGER,
  max_monthly_ai_requests INTEGER,
  max_monthly_scraping_pages INTEGER,
  max_storage_gb INTEGER,
  max_workspaces INTEGER,
  features JSONB
) AS $$
DECLARE
  company_rec RECORD;
  plan_rec RECORD;
BEGIN
  -- Obtener datos de la empresa
  SELECT * INTO company_rec FROM companies WHERE id = p_company_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Company not found';
  END IF;
  
  -- Obtener datos del plan
  SELECT * INTO plan_rec FROM plan_definitions WHERE id = company_rec.plan_definition_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plan definition not found';
  END IF;
  
  -- Para plan CUSTOM, usar valores custom obligatoriamente
  IF plan_rec.name = 'CUSTOM' THEN
    IF company_rec.custom_max_users IS NULL OR 
       company_rec.custom_max_monthly_ai_requests IS NULL OR
       company_rec.custom_max_monthly_scraping_pages IS NULL OR
       company_rec.custom_max_workspaces IS NULL THEN
      RAISE EXCEPTION 'Plan CUSTOM requiere configuración personalizada de todos los límites';
    END IF;
  END IF;
  
  -- Retornar límites (usar custom si existe, sino usar del plan)
  RETURN QUERY SELECT
    COALESCE(company_rec.custom_max_users, plan_rec.max_users),
    COALESCE(company_rec.custom_max_monthly_ai_requests, plan_rec.max_monthly_ai_requests),
    COALESCE(company_rec.custom_max_monthly_scraping_pages, plan_rec.max_monthly_scraping_pages),
    COALESCE(company_rec.custom_max_storage_gb, plan_rec.max_storage_gb),
    COALESCE(company_rec.custom_max_workspaces, plan_rec.max_workspaces),
    COALESCE(company_rec.custom_features, plan_rec.features);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ACTUALIZAR FUNCIÓN configure_company_plan
-- =====================================================

CREATE OR REPLACE FUNCTION configure_company_plan(
  p_company_id UUID,
  p_plan_name VARCHAR(50),
  p_custom_max_users INTEGER DEFAULT NULL,
  p_custom_max_monthly_ai_requests INTEGER DEFAULT NULL,
  p_custom_max_monthly_scraping_pages INTEGER DEFAULT NULL,
  p_custom_max_workspaces INTEGER DEFAULT NULL,
  p_custom_max_storage_gb INTEGER DEFAULT NULL,
  p_custom_features JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  plan_def_id UUID;
  plan_name TEXT;
BEGIN
  -- Obtener ID del plan
  SELECT id, name INTO plan_def_id, plan_name FROM plan_definitions WHERE name = p_plan_name AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plan definition not found: %', p_plan_name;
  END IF;
  
  -- Para plan CUSTOM, validar que todos los límites estén configurados
  IF plan_name = 'CUSTOM' THEN
    IF p_custom_max_users IS NULL OR 
       p_custom_max_monthly_ai_requests IS NULL OR
       p_custom_max_monthly_scraping_pages IS NULL OR
       p_custom_max_workspaces IS NULL OR
       p_custom_max_storage_gb IS NULL THEN
      RAISE EXCEPTION 'Plan CUSTOM requiere configuración de todos los límites: usuarios, AI requests, scraping pages, workspaces y storage';
    END IF;
    
    -- Validar límites mínimos para plan CUSTOM
    IF p_custom_max_users < 1 THEN
      RAISE EXCEPTION 'Plan CUSTOM requiere al menos 1 usuario';
    END IF;
    
    IF p_custom_max_monthly_ai_requests < 1000 THEN
      RAISE EXCEPTION 'Plan CUSTOM requiere al menos 1,000 AI requests por mes';
    END IF;
    
    IF p_custom_max_workspaces < 1 THEN
      RAISE EXCEPTION 'Plan CUSTOM requiere al menos 1 workspace';
    END IF;
    
    IF p_custom_max_storage_gb < 1 THEN
      RAISE EXCEPTION 'Plan CUSTOM requiere al menos 1GB de storage';
    END IF;
  END IF;
  
  -- Actualizar empresa
  UPDATE companies SET
    plan_definition_id = plan_def_id,
    custom_max_users = p_custom_max_users,
    custom_max_monthly_ai_requests = p_custom_max_monthly_ai_requests,
    custom_max_monthly_scraping_pages = p_custom_max_monthly_scraping_pages,
    custom_max_workspaces = p_custom_max_workspaces,
    custom_max_storage_gb = p_custom_max_storage_gb,
    custom_features = p_custom_features,
    updated_at = NOW()
  WHERE id = p_company_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCIÓN PARA VALIDAR LÍMITES DE WORKSPACES
-- =====================================================

CREATE OR REPLACE FUNCTION validate_workspace_creation(
  p_company_id UUID,
  p_workspace_name TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  current_workspaces_count INTEGER;
  max_workspaces_allowed INTEGER;
  company_limits RECORD;
BEGIN
  -- Obtener límites de la empresa
  SELECT * INTO company_limits FROM get_company_limits(p_company_id);
  
  -- Contar workspaces actuales de la empresa
  SELECT COUNT(*) INTO current_workspaces_count
  FROM workspaces w
  JOIN organizations o ON w.organization_id = o.id
  WHERE o.id = p_company_id;
  
  -- Verificar si se puede crear más workspaces
  IF current_workspaces_count >= company_limits.max_workspaces THEN
    RAISE EXCEPTION 'Límite de workspaces alcanzado para este plan. Máximo permitido: %, Actual: %', 
      company_limits.max_workspaces, current_workspaces_count;
  END IF;
  
  -- Verificar si el nombre ya existe
  IF EXISTS (
    SELECT 1 FROM workspaces w
    JOIN organizations o ON w.organization_id = o.id
    WHERE o.id = p_company_id AND w.name = p_workspace_name
  ) THEN
    RAISE EXCEPTION 'Ya existe un workspace con el nombre: %', p_workspace_name;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER PARA VALIDAR CREACIÓN DE WORKSPACES
-- =====================================================

CREATE OR REPLACE FUNCTION validate_workspace_limits()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar límites antes de crear workspace
  PERFORM validate_workspace_creation(
    (SELECT id FROM organizations WHERE id = NEW.organization_id),
    NEW.name
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger en la tabla workspaces
CREATE TRIGGER trigger_validate_workspace_limits
  BEFORE INSERT ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION validate_workspace_limits();

-- =====================================================
-- AGREGAR COLUMNA PARA STORAGE PERSONALIZADO
-- =====================================================

-- Agregar columna custom_max_storage_gb a companies
ALTER TABLE companies 
ADD COLUMN custom_max_storage_gb INTEGER;

-- =====================================================
-- CREAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_plan_definitions_workspaces ON plan_definitions(max_workspaces);
CREATE INDEX idx_companies_custom_workspaces ON companies(custom_max_workspaces);
CREATE INDEX idx_companies_custom_storage ON companies(custom_max_storage_gb);

-- =====================================================
-- ACTUALIZAR COMENTARIOS
-- =====================================================

COMMENT ON COLUMN plan_definitions.max_workspaces IS 'Número máximo de workspaces permitidos por plan (NULL para CUSTOM = configurable)';
COMMENT ON COLUMN companies.custom_max_workspaces IS 'Override personalizado para límite de workspaces (obligatorio para planes CUSTOM)';
COMMENT ON COLUMN companies.custom_max_storage_gb IS 'Override personalizado para límite de storage en GB (obligatorio para planes CUSTOM)';
COMMENT ON FUNCTION validate_workspace_creation IS 'Valida si se puede crear un nuevo workspace según los límites del plan';
COMMENT ON FUNCTION validate_workspace_limits IS 'Trigger function para validar límites de workspaces antes de crear';

-- =====================================================
-- ACTUALIZAR COMENTARIOS DE PLAN CUSTOM
-- =====================================================

COMMENT ON TABLE plan_definitions IS 'Definiciones de planes de suscripción. Plan CUSTOM requiere configuración personalizada obligatoria de todos los límites.';
