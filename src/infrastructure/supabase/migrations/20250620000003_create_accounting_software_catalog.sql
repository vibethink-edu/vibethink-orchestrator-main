-- =====================================================
-- CATÁLOGO UNIVERSAL DE SOFTWARE CONTABLE COLOMBIANO
-- =====================================================

-- =====================================================
-- TABLA DE SOFTWARE CONTABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS accounting_software (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  software_name VARCHAR(100) NOT NULL,
  software_provider VARCHAR(100) NOT NULL,
  software_type VARCHAR(50) NOT NULL, -- 'cloud', 'on_premise', 'hybrid', 'desktop'
  software_category VARCHAR(50) NOT NULL, -- 'enterprise', 'medium', 'small', 'micro'
  software_country VARCHAR(2) DEFAULT 'CO',
  
  -- Capacidades de integración
  has_api BOOLEAN DEFAULT false,
  has_webhooks BOOLEAN DEFAULT false,
  has_import_export BOOLEAN DEFAULT true,
  has_rpa_support BOOLEAN DEFAULT false,
  has_browser_extension BOOLEAN DEFAULT false,
  
  -- Funcionalidades específicas
  supports_electronic_invoicing BOOLEAN DEFAULT true,
  supports_payroll BOOLEAN DEFAULT false,
  supports_inventory BOOLEAN DEFAULT false,
  supports_treasury BOOLEAN DEFAULT false,
  supports_multi_currency BOOLEAN DEFAULT false,
  supports_multi_company BOOLEAN DEFAULT false,
  
  -- Información de contacto y soporte
  website_url VARCHAR(255),
  support_email VARCHAR(255),
  support_phone VARCHAR(50),
  documentation_url VARCHAR(255),
  api_documentation_url VARCHAR(255),
  
  -- Información comercial
  pricing_model VARCHAR(50), -- 'subscription', 'perpetual', 'freemium', 'enterprise'
  min_users INTEGER DEFAULT 1,
  max_users INTEGER,
  estimated_cost_range VARCHAR(50), -- 'low', 'medium', 'high', 'enterprise'
  
  -- Estado y configuración
  is_active BOOLEAN DEFAULT true,
  is_certified_dian BOOLEAN DEFAULT false,
  certification_date DATE,
  last_updated DATE,
  
  -- Metadatos
  features TEXT[],
  limitations TEXT[],
  integration_notes TEXT,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(software_name, software_provider)
);

-- =====================================================
-- TABLA DE CONFIGURACIÓN DE INTEGRACIÓN POR EMPRESA
-- =====================================================

CREATE TABLE IF NOT EXISTS company_accounting_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  accounting_software_id UUID NOT NULL REFERENCES accounting_software(id),
  
  -- Configuración de integración
  integration_level VARCHAR(50) NOT NULL, -- 'api', 'import_export', 'rpa', 'browser_extension', 'manual'
  integration_status VARCHAR(20) DEFAULT 'inactive', -- 'active', 'inactive', 'testing', 'error'
  
  -- Configuración de funcionalidades
  enable_document_classification BOOLEAN DEFAULT true,
  enable_drive_organization BOOLEAN DEFAULT true,
  enable_ai_assistant BOOLEAN DEFAULT true,
  enable_browser_extension BOOLEAN DEFAULT false,
  enable_auto_contabilization BOOLEAN DEFAULT false,
  
  -- Configuración de cobro
  billing_model VARCHAR(50) DEFAULT 'included', -- 'included', 'per_document', 'per_month', 'enterprise'
  document_limit INTEGER DEFAULT 100, -- Límite de documentos incluidos en el plan
  overage_rate DECIMAL(10,4) DEFAULT 0.50, -- Precio por documento adicional
  integration_fee DECIMAL(10,2) DEFAULT 0.00, -- Cargo adicional por integración
  
  -- Configuración de API (si aplica)
  api_credentials JSONB, -- Credenciales encriptadas
  api_settings JSONB, -- Configuración específica de la API
  api_endpoints JSONB, -- Endpoints específicos del software
  
  -- Configuración de importación/exportación
  import_format VARCHAR(20) DEFAULT 'csv', -- 'csv', 'txt', 'excel', 'xml'
  export_format VARCHAR(20) DEFAULT 'csv',
  field_mapping JSONB, -- Mapeo de campos específicos
  
  -- Configuración de RPA
  rpa_script_path VARCHAR(255),
  rpa_credentials JSONB,
  rpa_settings JSONB,
  
  -- Configuración de extensión de navegador
  browser_extension_enabled BOOLEAN DEFAULT false,
  browser_extension_settings JSONB,
  
  -- Configuración de validación
  require_manual_validation BOOLEAN DEFAULT true,
  auto_approval_threshold DECIMAL(3,2) DEFAULT 0.95, -- Confianza mínima para auto-aprobación
  validation_rules JSONB, -- Reglas de validación específicas
  
  -- Información de auditoría
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(company_id, accounting_software_id)
);

-- =====================================================
-- TABLA DE PLANTILLAS DE INTEGRACIÓN
-- =====================================================

CREATE TABLE IF NOT EXISTS integration_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accounting_software_id UUID NOT NULL REFERENCES accounting_software(id),
  
  template_name VARCHAR(100) NOT NULL,
  template_type VARCHAR(50) NOT NULL, -- 'import', 'export', 'api', 'rpa', 'browser_extension'
  template_description TEXT,
  
  -- Configuración de la plantilla
  template_config JSONB NOT NULL, -- Configuración específica de la plantilla
  field_mapping JSONB, -- Mapeo de campos estándar
  validation_rules JSONB, -- Reglas de validación
  
  -- Archivos de plantilla
  template_file_url VARCHAR(255), -- URL del archivo de plantilla
  template_file_format VARCHAR(20), -- 'csv', 'txt', 'excel', 'xml', 'json'
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE AGENTE IA PARA ASISTENCIA CONTABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS accounting_ai_agent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Configuración del agente
  agent_name VARCHAR(100) DEFAULT 'Asistente Contable IA',
  agent_personality TEXT, -- Personalidad del agente
  agent_knowledge_base JSONB, -- Base de conocimiento específica
  
  -- Capacidades del agente
  can_classify_documents BOOLEAN DEFAULT true,
  can_extract_data BOOLEAN DEFAULT true,
  can_suggest_accounts BOOLEAN DEFAULT true,
  can_validate_documents BOOLEAN DEFAULT true,
  can_generate_reports BOOLEAN DEFAULT true,
  
  -- Configuración de IA
  ai_model VARCHAR(50) DEFAULT 'gpt-4',
  ai_temperature DECIMAL(3,2) DEFAULT 0.7,
  ai_max_tokens INTEGER DEFAULT 2000,
  
  -- Configuración de respuestas
  response_language VARCHAR(10) DEFAULT 'es',
  response_style VARCHAR(50) DEFAULT 'professional',
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE EXTENSIÓN DE NAVEGADOR
-- =====================================================

CREATE TABLE IF NOT EXISTS browser_extension_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  accounting_software_id UUID NOT NULL REFERENCES accounting_software(id),
  
  -- Configuración de la extensión
  extension_name VARCHAR(100) NOT NULL,
  extension_version VARCHAR(20) DEFAULT '1.0.0',
  
  -- URLs y selectores
  target_urls TEXT[], -- URLs donde funciona la extensión
  form_selectors JSONB, -- Selectores CSS para formularios
  field_mappings JSONB, -- Mapeo de campos específicos
  
  -- Funcionalidades
  auto_fill_enabled BOOLEAN DEFAULT true,
  validation_enabled BOOLEAN DEFAULT true,
  confirmation_required BOOLEAN DEFAULT true,
  
  -- Configuración de datos
  data_source VARCHAR(50) DEFAULT 'processed_documents', -- 'processed_documents', 'ai_extraction'
  data_mapping JSONB, -- Mapeo de datos específicos
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSERCIÓN DEL CATÁLOGO COMPLETO DE SOFTWARE CONTABLE COLOMBIANO
-- =====================================================

INSERT INTO accounting_software (
  software_name, software_provider, software_type, software_category,
  has_api, has_webhooks, has_import_export, has_rpa_support, has_browser_extension,
  supports_electronic_invoicing, supports_payroll, supports_inventory, supports_treasury,
  supports_multi_currency, supports_multi_company, website_url, support_email,
  pricing_model, estimated_cost_range, is_certified_dian, features, limitations
) VALUES 
-- SOFTWARE CLOUD CON API
('Siigo', 'Siigo', 'cloud', 'medium', true, true, true, true, true,
 true, true, true, true, true, true, 'https://www.siigo.com', 'soporte@siigo.com',
 'subscription', 'medium', true,
 ARRAY['facturación_electrónica', 'contabilidad', 'nómina', 'inventarios', 'tesorería', 'reportes_avanzados'],
 ARRAY['límite_api_calls', 'solo_facturación_ventas']),

('Alegra', 'Alegra', 'cloud', 'small', true, true, true, true, true,
 true, true, true, true, true, true, 'https://www.alegra.com', 'soporte@alegra.com',
 'subscription', 'low', true,
 ARRAY['facturación_electrónica', 'contabilidad', 'nómina', 'inventarios', 'tesorería'],
 ARRAY['límite_usuarios', 'limitaciones_reportes']),

('ContaMatic', 'ContaMatic', 'cloud', 'small', true, false, true, true, true,
 true, true, false, true, false, false, 'https://www.contamatic.com', 'soporte@contamatic.com',
 'subscription', 'low', true,
 ARRAY['facturación_electrónica', 'contabilidad', 'tesorería'],
 ARRAY['solo_empresas_pequeñas', 'limitaciones_reportes']),

('Siesa', 'Siesa', 'cloud', 'enterprise', true, true, true, true, true,
 true, true, true, true, true, true, 'https://www.siesa.com', 'soporte@siesa.com',
 'enterprise', 'high', true,
 ARRAY['facturación_electrónica', 'contabilidad', 'inventarios', 'nómina', 'tesorería', 'reportes_avanzados'],
 ARRAY['alto_costo', 'complejidad_implementación']),

-- SOFTWARE ON-PREMISE
('SAP Business One', 'SAP', 'on_premise', 'enterprise', true, true, true, true, true,
 true, true, true, true, true, true, 'https://www.sap.com', 'soporte@sap.com',
 'enterprise', 'high', true,
 ARRAY['contabilidad_completa', 'inventarios', 'nómina', 'tesorería', 'reportes_avanzados'],
 ARRAY['alto_costo', 'requiere_servidor', 'complejidad']),

('Helisa', 'Helisa', 'on_premise', 'medium', false, false, true, true, true,
 true, true, true, true, false, false, 'https://www.helisa.com', 'soporte@helisa.com',
 'perpetual', 'medium', true,
 ARRAY['contabilidad', 'facturación_electrónica', 'nómina', 'inventarios'],
 ARRAY['no_api', 'limitaciones_reportes', 'solo_windows']),

('Tally ERP 9', 'Tally Solutions', 'on_premise', 'medium', false, false, true, true, true,
 false, true, true, true, true, true, 'https://tallysolutions.com', 'soporte@tally.com',
 'perpetual', 'medium', false,
 ARRAY['contabilidad', 'inventarios', 'nómina'],
 ARRAY['no_facturación_electrónica', 'limitaciones_reportes']),

('ContaPyme', 'ContaPyme', 'on_premise', 'small', false, false, true, true, true,
 true, true, false, true, false, false, 'https://contapyme.com', 'soporte@contapyme.com',
 'perpetual', 'low', true,
 ARRAY['contabilidad', 'facturación_electrónica', 'nómina'],
 ARRAY['solo_empresas_pequeñas', 'limitaciones_usuarios']),

-- SOFTWARE HÍBRIDO
('Quickbooks', 'Intuit', 'hybrid', 'small', true, true, true, true, true,
 true, true, true, true, true, true, 'https://quickbooks.intuit.com', 'soporte@intuit.com',
 'subscription', 'low', true,
 ARRAY['contabilidad', 'facturación', 'nómina', 'inventarios'],
 ARRAY['limitaciones_colombia', 'soporte_limitado']),

('Xero', 'Xero', 'cloud', 'small', true, true, true, true, true,
 true, true, true, true, true, true, 'https://www.xero.com', 'soporte@xero.com',
 'subscription', 'medium', false,
 ARRAY['contabilidad', 'facturación', 'nómina'],
 ARRAY['no_certificación_dian', 'limitaciones_colombia']),

-- SOFTWARE ESPECIALIZADO
('Facturación Electrónica DIAN', 'DIAN', 'cloud', 'micro', false, false, true, false, false,
 true, false, false, false, false, false, 'https://www.dian.gov.co', 'soporte@dian.gov.co',
 'freemium', 'low', true,
 ARRAY['facturación_electrónica_básica'],
 ARRAY['solo_facturación', 'sin_contabilidad', 'limitaciones_reportes']),

('SIIGO Nube', 'Siigo', 'cloud', 'small', true, true, true, true, true,
 true, true, true, true, true, true, 'https://nube.siigo.com', 'soporte@siigo.com',
 'subscription', 'low', true,
 ARRAY['facturación_electrónica', 'contabilidad_básica'],
 ARRAY['limitaciones_usuarios', 'funcionalidades_básicas'])

ON CONFLICT (software_name, software_provider) DO UPDATE SET
  updated_at = NOW();

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para obtener software disponible por empresa
CREATE OR REPLACE FUNCTION get_available_accounting_software(
  p_company_id UUID
) RETURNS TABLE (
  software_id UUID,
  software_name VARCHAR(100),
  software_provider VARCHAR(100),
  integration_level VARCHAR(50),
  has_api BOOLEAN,
  has_import_export BOOLEAN,
  has_browser_extension BOOLEAN,
  estimated_cost_range VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    asw.id,
    asw.software_name,
    asw.software_provider,
    CASE 
      WHEN asw.has_api THEN 'api'
      WHEN asw.has_import_export THEN 'import_export'
      WHEN asw.has_browser_extension THEN 'browser_extension'
      ELSE 'manual'
    END as integration_level,
    asw.has_api,
    asw.has_import_export,
    asw.has_browser_extension,
    asw.estimated_cost_range
  FROM accounting_software asw
  WHERE asw.is_active = true
  AND asw.is_certified_dian = true
  ORDER BY 
    CASE asw.has_api WHEN true THEN 1 ELSE 2 END,
    asw.software_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para calcular costo de integración
CREATE OR REPLACE FUNCTION calculate_integration_cost(
  p_company_id UUID,
  p_document_count INTEGER DEFAULT 0
) RETURNS JSONB AS $$
DECLARE
  config company_accounting_config%ROWTYPE;
  base_cost DECIMAL(10,2) := 0;
  overage_cost DECIMAL(10,2) := 0;
  total_cost DECIMAL(10,2) := 0;
BEGIN
  SELECT * INTO config
  FROM company_accounting_config
  WHERE company_id = p_company_id
  AND is_active = true
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'error', 'No configuration found',
      'cost', 0
    );
  END IF;
  
  -- Calcular costo base
  base_cost := config.integration_fee;
  
  -- Calcular costo por exceso de documentos
  IF p_document_count > config.document_limit THEN
    overage_cost := (p_document_count - config.document_limit) * config.overage_rate;
  END IF;
  
  total_cost := base_cost + overage_cost;
  
  RETURN jsonb_build_object(
    'base_cost', base_cost,
    'overage_cost', overage_cost,
    'total_cost', total_cost,
    'document_limit', config.document_limit,
    'document_count', p_document_count,
    'billing_model', config.billing_model
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POLÍTICAS RLS
-- =====================================================

-- Habilitar RLS
ALTER TABLE accounting_software ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_accounting_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_ai_agent ENABLE ROW LEVEL SECURITY;
ALTER TABLE browser_extension_config ENABLE ROW LEVEL SECURITY;

-- Políticas para accounting_software (lectura pública)
CREATE POLICY "accounting_software_read_policy" ON accounting_software
  FOR SELECT USING (is_active = true);

-- Políticas para company_accounting_config
CREATE POLICY "company_accounting_config_company_policy" ON company_accounting_config
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para integration_templates (lectura pública)
CREATE POLICY "integration_templates_read_policy" ON integration_templates
  FOR SELECT USING (is_active = true);

-- Políticas para accounting_ai_agent
CREATE POLICY "accounting_ai_agent_company_policy" ON accounting_ai_agent
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para browser_extension_config
CREATE POLICY "browser_extension_config_company_policy" ON browser_extension_config
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para actualizar updated_at
CREATE TRIGGER update_accounting_software_updated_at
  BEFORE UPDATE ON accounting_software
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_accounting_config_updated_at
  BEFORE UPDATE ON company_accounting_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_templates_updated_at
  BEFORE UPDATE ON integration_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounting_ai_agent_updated_at
  BEFORE UPDATE ON accounting_ai_agent
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_browser_extension_config_updated_at
  BEFORE UPDATE ON browser_extension_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 