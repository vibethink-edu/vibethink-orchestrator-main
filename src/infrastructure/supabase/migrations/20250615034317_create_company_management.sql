
-- Crear tabla de definiciones de planes (plantillas de planes)
CREATE TABLE plan_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 'STARTER', 'PROFESSIONAL', 'ENTERPRISE', 'CUSTOM'
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  base_price_usd DECIMAL(10,2) DEFAULT 0,
  max_users INTEGER NOT NULL,
  max_monthly_ai_requests INTEGER NOT NULL,
  max_monthly_scraping_pages INTEGER NOT NULL,
  max_storage_gb INTEGER DEFAULT 10,
  features JSONB DEFAULT '[]'::jsonb, -- Array de features habilitadas
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar planes predefinidos
INSERT INTO plan_definitions (name, display_name, description, base_price_usd, max_users, max_monthly_ai_requests, max_monthly_scraping_pages, max_storage_gb, features) VALUES
('STARTER', 'Starter Plan', 'Perfect for small teams getting started', 29.00, 5, 1000, 100, 5, '["basic_ai", "email_support"]'),
('PROFESSIONAL', 'Professional Plan', 'For growing businesses', 99.00, 25, 10000, 1000, 25, '["advanced_ai", "priority_support", "custom_workflows"]'),
('ENTERPRISE', 'Enterprise Plan', 'For large organizations', 299.00, 100, 50000, 5000, 100, '["enterprise_ai", "dedicated_support", "custom_integrations", "sso"]'),
('CUSTOM', 'Custom Plan', 'Tailored solutions for enterprise clients', 0.00, 999999, 999999999, 999999999, 999999, '["everything", "white_label", "on_premise"]');

-- Actualizar tabla companies para referenciar plan_definitions
ALTER TABLE companies ADD COLUMN plan_definition_id UUID REFERENCES plan_definitions(id);
ALTER TABLE companies ADD COLUMN custom_max_users INTEGER; -- Override para planes CUSTOM
ALTER TABLE companies ADD COLUMN custom_max_monthly_ai_requests INTEGER; -- Override para planes CUSTOM
ALTER TABLE companies ADD COLUMN custom_max_monthly_scraping_pages INTEGER; -- Override para planes CUSTOM
ALTER TABLE companies ADD COLUMN custom_features JSONB; -- Features adicionales para planes CUSTOM

-- Crear tabla de configuraciones empresariales (para overrides de Enterprise/Custom)
CREATE TABLE company_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  config_key VARCHAR(100) NOT NULL,
  config_value JSONB NOT NULL,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, config_key)
);

-- Crear función para obtener límites efectivos de una empresa
CREATE OR REPLACE FUNCTION get_company_limits(p_company_id UUID)
RETURNS TABLE(
  max_users INTEGER,
  max_monthly_ai_requests INTEGER,
  max_monthly_scraping_pages INTEGER,
  max_storage_gb INTEGER,
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
  
  -- Retornar límites (usar custom si existe, sino usar del plan)
  RETURN QUERY SELECT
    COALESCE(company_rec.custom_max_users, plan_rec.max_users),
    COALESCE(company_rec.custom_max_monthly_ai_requests, plan_rec.max_monthly_ai_requests),
    COALESCE(company_rec.custom_max_monthly_scraping_pages, plan_rec.max_monthly_scraping_pages),
    plan_rec.max_storage_gb,
    COALESCE(company_rec.custom_features, plan_rec.features);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para configurar plan de empresa (solo OWNERS/ADMINS de la plataforma)
CREATE OR REPLACE FUNCTION configure_company_plan(
  p_company_id UUID,
  p_plan_name VARCHAR(50),
  p_custom_max_users INTEGER DEFAULT NULL,
  p_custom_max_monthly_ai_requests INTEGER DEFAULT NULL,
  p_custom_max_monthly_scraping_pages INTEGER DEFAULT NULL,
  p_custom_features JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  plan_def_id UUID;
BEGIN
  -- Obtener ID del plan
  SELECT id INTO plan_def_id FROM plan_definitions WHERE name = p_plan_name AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plan definition not found: %', p_plan_name;
  END IF;
  
  -- Actualizar empresa
  UPDATE companies SET
    plan_definition_id = plan_def_id,
    custom_max_users = p_custom_max_users,
    custom_max_monthly_ai_requests = p_custom_max_monthly_ai_requests,
    custom_max_monthly_scraping_pages = p_custom_max_monthly_scraping_pages,
    custom_features = p_custom_features,
    updated_at = NOW()
  WHERE id = p_company_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Migrar empresas existentes al plan STARTER por defecto
UPDATE companies SET plan_definition_id = (SELECT id FROM plan_definitions WHERE name = 'STARTER') WHERE plan_definition_id IS NULL;

-- Crear índices para performance
CREATE INDEX idx_plan_definitions_name ON plan_definitions(name);
CREATE INDEX idx_companies_plan_definition ON companies(plan_definition_id);
CREATE INDEX idx_company_configurations_company_config ON company_configurations(company_id, config_key);

-- RLS para plan_definitions (solo lectura para usuarios autenticados)
ALTER TABLE plan_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view active plans" ON plan_definitions
  FOR SELECT USING (is_active = true);

-- RLS para company_configurations
ALTER TABLE company_configurations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company admins can manage configurations" ON company_configurations
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );
