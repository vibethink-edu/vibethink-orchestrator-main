
-- Crear vista para obtener información completa de empresas con sus planes y overrides
CREATE OR REPLACE VIEW company_plan_overview AS
SELECT 
  c.id,
  c.name,
  c.slug,
  c.status,
  c.subscription_plan,
  c.created_at,
  c.updated_at,
  
  -- Plan definition info
  pd.id as plan_definition_id,
  pd.display_name as plan_display_name,
  pd.base_price_usd as plan_base_price,
  pd.max_users as plan_max_users,
  pd.max_monthly_ai_requests as plan_max_ai_requests,
  pd.max_monthly_scraping_pages as plan_max_scraping_pages,
  pd.max_storage_gb as plan_max_storage_gb,
  pd.features as plan_features,
  
  -- Custom overrides (if any)
  c.custom_max_users,
  c.custom_max_monthly_ai_requests,
  c.custom_max_monthly_scraping_pages,
  c.custom_features,
  
  -- Effective limits (with overrides applied)
  COALESCE(c.custom_max_users, pd.max_users) as effective_max_users,
  COALESCE(c.custom_max_monthly_ai_requests, pd.max_monthly_ai_requests) as effective_max_ai_requests,
  COALESCE(c.custom_max_monthly_scraping_pages, pd.max_monthly_scraping_pages) as effective_max_scraping_pages,
  pd.max_storage_gb as effective_max_storage_gb,
  COALESCE(c.custom_features, pd.features) as effective_features,
  
  -- Has overrides flag
  CASE WHEN 
    c.custom_max_users IS NOT NULL OR 
    c.custom_max_monthly_ai_requests IS NOT NULL OR 
    c.custom_max_monthly_scraping_pages IS NOT NULL OR 
    c.custom_features IS NOT NULL 
  THEN true ELSE false END as has_overrides,
  
  -- Override details for billing
  CASE WHEN c.custom_max_users IS NOT NULL 
    THEN json_build_object('type', 'max_users', 'plan_value', pd.max_users, 'override_value', c.custom_max_users)
    ELSE NULL END as users_override,
  CASE WHEN c.custom_max_monthly_ai_requests IS NOT NULL 
    THEN json_build_object('type', 'max_ai_requests', 'plan_value', pd.max_monthly_ai_requests, 'override_value', c.custom_max_monthly_ai_requests)
    ELSE NULL END as ai_requests_override,
  CASE WHEN c.custom_max_monthly_scraping_pages IS NOT NULL 
    THEN json_build_object('type', 'max_scraping_pages', 'plan_value', pd.max_monthly_scraping_pages, 'override_value', c.custom_max_monthly_scraping_pages)
    ELSE NULL END as scraping_override,
  CASE WHEN c.custom_features IS NOT NULL 
    THEN json_build_object('type', 'features', 'plan_value', pd.features, 'override_value', c.custom_features)
    ELSE NULL END as features_override

FROM companies c
LEFT JOIN plan_definitions pd ON c.plan_definition_id = pd.id;

-- Función para calcular el costo efectivo con overrides
CREATE OR REPLACE FUNCTION calculate_company_billing_cost(p_company_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  company_data RECORD;
  base_cost DECIMAL := 0;
  override_cost DECIMAL := 0;
  users_multiplier DECIMAL := 5.0; -- $5 por usuario adicional
  ai_multiplier DECIMAL := 0.01; -- $0.01 por 1000 requests adicionales
  scraping_multiplier DECIMAL := 0.02; -- $0.02 por 100 páginas adicionales
BEGIN
  SELECT * INTO company_data FROM company_plan_overview WHERE id = p_company_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Costo base del plan
  base_cost := company_data.plan_base_price;
  
  -- Calcular costos adicionales por overrides
  IF company_data.custom_max_users IS NOT NULL AND company_data.custom_max_users > company_data.plan_max_users THEN
    override_cost := override_cost + ((company_data.custom_max_users - company_data.plan_max_users) * users_multiplier);
  END IF;
  
  IF company_data.custom_max_monthly_ai_requests IS NOT NULL AND company_data.custom_max_monthly_ai_requests > company_data.plan_max_ai_requests THEN
    override_cost := override_cost + (((company_data.custom_max_monthly_ai_requests - company_data.plan_max_ai_requests) / 1000.0) * ai_multiplier);
  END IF;
  
  IF company_data.custom_max_monthly_scraping_pages IS NOT NULL AND company_data.custom_max_monthly_scraping_pages > company_data.plan_max_scraping_pages THEN
    override_cost := override_cost + (((company_data.custom_max_monthly_scraping_pages - company_data.plan_max_scraping_pages) / 100.0) * scraping_multiplier);
  END IF;
  
  RETURN base_cost + override_cost;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agregar columna de costo efectivo a la vista (calculado)
CREATE OR REPLACE VIEW company_billing_overview AS
SELECT 
  *,
  calculate_company_billing_cost(id) as effective_monthly_cost
FROM company_plan_overview;

-- RLS para las vistas (hereda de las tablas base)
-- Las vistas heredan automáticamente las políticas RLS de las tablas base
