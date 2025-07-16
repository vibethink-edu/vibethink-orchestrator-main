-- =====================================================
-- SISTEMA DE GESTIÓN CONTABLE AUTOMATIZADO
-- Base: Colombia (Extensible a otros países)
-- =====================================================

-- =====================================================
-- TABLA DE CONFIGURACIÓN CONTABLE POR PAÍS
-- =====================================================

CREATE TABLE IF NOT EXISTS accounting_country_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) NOT NULL UNIQUE,
  country_name VARCHAR(100) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  tax_rate DECIMAL(5,4) NOT NULL,
  tax_name VARCHAR(50) NOT NULL,
  invoice_prefix VARCHAR(10),
  electronic_invoicing BOOLEAN DEFAULT false,
  xml_schema_version VARCHAR(20),
  digital_signature_required BOOLEAN DEFAULT false,
  qr_code_required BOOLEAN DEFAULT false,
  fiscal_resolution_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE REMITENTES DE FACTURAS
-- =====================================================

CREATE TABLE IF NOT EXISTS invoice_senders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  sender_name VARCHAR(200) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  sender_tax_id VARCHAR(50),
  sender_address TEXT,
  sender_phone VARCHAR(50),
  sender_website VARCHAR(255),
  sender_category VARCHAR(100), -- Proveedor, Cliente, etc.
  sender_type VARCHAR(50), -- Empresa, Persona Natural, etc.
  sender_industry VARCHAR(100),
  sender_contact_person VARCHAR(200),
  sender_contact_email VARCHAR(255),
  sender_contact_phone VARCHAR(50),
  sender_payment_terms VARCHAR(100),
  sender_credit_limit DECIMAL(15,2),
  sender_rating INTEGER CHECK (sender_rating >= 1 AND sender_rating <= 5),
  sender_notes TEXT,
  sender_status VARCHAR(20) DEFAULT 'active',
  sender_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para búsqueda eficiente
  UNIQUE(company_id, sender_email),
  UNIQUE(company_id, sender_tax_id)
);

-- =====================================================
-- TABLA DE DOCUMENTOS RECIBIDOS
-- =====================================================

CREATE TABLE IF NOT EXISTS received_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES invoice_senders(id),
  
  -- Información del email
  email_subject VARCHAR(500),
  email_from VARCHAR(255) NOT NULL,
  email_to VARCHAR(255) NOT NULL,
  email_date TIMESTAMP WITH TIME ZONE NOT NULL,
  email_message_id VARCHAR(255),
  
  -- Información del documento
  document_type VARCHAR(50) NOT NULL, -- 'invoice', 'credit_note', 'debit_note', 'support_document'
  document_format VARCHAR(20) NOT NULL, -- 'xml', 'pdf', 'zip', 'rar', 'image'
  document_filename VARCHAR(255) NOT NULL,
  document_size_bytes BIGINT,
  document_hash VARCHAR(64), -- SHA-256 para verificación de integridad
  
  -- Información de la factura (si aplica)
  invoice_number VARCHAR(100),
  invoice_date DATE,
  invoice_total DECIMAL(15,2),
  invoice_currency VARCHAR(3) DEFAULT 'COP',
  invoice_tax_amount DECIMAL(15,2),
  invoice_subtotal DECIMAL(15,2),
  
  -- Información de procesamiento
  processing_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'error'
  processing_attempts INTEGER DEFAULT 0,
  processing_error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Información de almacenamiento
  storage_path TEXT NOT NULL, -- Ruta en Google Drive
  storage_file_id VARCHAR(100), -- ID del archivo en Google Drive
  storage_folder_id VARCHAR(100), -- ID de la carpeta en Google Drive
  
  -- Información de clasificación
  classification_confidence DECIMAL(3,2), -- 0.00 a 1.00
  classification_category VARCHAR(100),
  classification_tags TEXT[],
  
  -- Metadatos
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE ESTRUCTURA DE CARPETAS CONTABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS accounting_folder_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  folder_name VARCHAR(100) NOT NULL,
  folder_path TEXT NOT NULL,
  folder_drive_id VARCHAR(100),
  folder_type VARCHAR(50) NOT NULL, -- 'year', 'month', 'sender', 'category', 'project'
  folder_level INTEGER NOT NULL, -- 1 = raíz, 2 = subcarpeta, etc.
  folder_parent_id UUID REFERENCES accounting_folder_structure(id),
  folder_naming_convention VARCHAR(200),
  folder_description TEXT,
  folder_is_active BOOLEAN DEFAULT true,
  folder_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(company_id, folder_path)
);

-- =====================================================
-- TABLA DE DOCUMENTOS PROCESADOS
-- =====================================================

CREATE TABLE IF NOT EXISTS processed_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  received_document_id UUID NOT NULL REFERENCES received_documents(id),
  
  -- Información extraída del documento
  extracted_data JSONB NOT NULL, -- Datos extraídos del XML/PDF
  validation_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'valid', 'invalid', 'manual_review'
  validation_errors TEXT[],
  
  -- Información contable
  accounting_entry_type VARCHAR(50), -- 'purchase', 'sale', 'expense', 'income'
  accounting_account VARCHAR(50), -- Cuenta contable
  accounting_center VARCHAR(50), -- Centro de costos
  accounting_project VARCHAR(50), -- Proyecto
  
  -- Información de integración
  integrated_with_system VARCHAR(100), -- Sistema contable integrado
  integration_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'error'
  integration_error_message TEXT,
  integrated_at TIMESTAMP WITH TIME ZONE,
  
  -- Información de auditoría
  processed_by UUID REFERENCES users(id),
  processing_duration_ms INTEGER,
  ai_confidence_score DECIMAL(3,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE SISTEMAS CONTABLES INTEGRADOS
-- =====================================================

CREATE TABLE IF NOT EXISTS accounting_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(100) NOT NULL,
  system_type VARCHAR(50) NOT NULL, -- 'cloud', 'on_premise', 'hybrid'
  system_provider VARCHAR(100) NOT NULL,
  system_country VARCHAR(2) NOT NULL,
  system_api_endpoint VARCHAR(255),
  system_api_version VARCHAR(20),
  system_authentication_type VARCHAR(50), -- 'oauth2', 'api_key', 'basic'
  system_features TEXT[], -- Características disponibles
  system_limitations TEXT[], -- Limitaciones conocidas
  system_documentation_url VARCHAR(255),
  system_support_email VARCHAR(255),
  system_is_active BOOLEAN DEFAULT true,
  system_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE CONFIGURACIONES DE INTEGRACIÓN
-- =====================================================

CREATE TABLE IF NOT EXISTS accounting_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  accounting_system_id UUID NOT NULL REFERENCES accounting_systems(id),
  
  -- Configuración de conexión
  integration_name VARCHAR(100) NOT NULL,
  integration_status VARCHAR(20) DEFAULT 'inactive', -- 'active', 'inactive', 'error'
  api_credentials JSONB, -- Credenciales encriptadas
  api_settings JSONB, -- Configuración de la API
  
  -- Mapeo de datos
  account_mapping JSONB, -- Mapeo de cuentas contables
  tax_mapping JSONB, -- Mapeo de impuestos
  category_mapping JSONB, -- Mapeo de categorías
  
  -- Configuración de sincronización
  sync_frequency VARCHAR(20) DEFAULT 'daily', -- 'realtime', 'hourly', 'daily', 'weekly'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  next_sync_at TIMESTAMP WITH TIME ZONE,
  
  -- Información de auditoría
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE REGLAS DE CLASIFICACIÓN AUTOMÁTICA
-- =====================================================

CREATE TABLE IF NOT EXISTS classification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  rule_name VARCHAR(100) NOT NULL,
  rule_description TEXT,
  rule_type VARCHAR(50) NOT NULL, -- 'sender', 'amount', 'description', 'date'
  rule_condition JSONB NOT NULL, -- Condición de la regla
  rule_action JSONB NOT NULL, -- Acción a ejecutar
  rule_priority INTEGER DEFAULT 0,
  rule_is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE LOGS DE PROCESAMIENTO
-- =====================================================

CREATE TABLE IF NOT EXISTS processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  received_document_id UUID REFERENCES received_documents(id),
  
  log_level VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error', 'debug'
  log_message TEXT NOT NULL,
  log_context JSONB, -- Contexto adicional del log
  log_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONFIGURACIÓN INICIAL PARA COLOMBIA
-- =====================================================

INSERT INTO accounting_country_config (
  country_code, country_name, currency_code, tax_rate, tax_name,
  invoice_prefix, electronic_invoicing, xml_schema_version,
  digital_signature_required, qr_code_required, fiscal_resolution_required
) VALUES (
  'CO', 'Colombia', 'COP', 0.19, 'IVA',
  'FAC', true, 'DIAN 2.1',
  true, true, true
) ON CONFLICT (country_code) DO UPDATE SET
  updated_at = NOW();

-- =====================================================
-- SISTEMAS CONTABLES COLOMBIANOS
-- =====================================================

INSERT INTO accounting_systems (
  system_name, system_type, system_provider, system_country,
  system_api_endpoint, system_api_version, system_authentication_type,
  system_features, system_limitations, system_documentation_url
) VALUES 
-- Sistemas Cloud
('Siigo', 'cloud', 'Siigo', 'CO', 'https://api.siigo.com', 'v1', 'oauth2',
  ARRAY['facturación_electrónica', 'contabilidad', 'nómina', 'inventarios'],
  ARRAY['límite_api_calls', 'solo_facturación_ventas'],
  'https://docs.siigo.com'),

('ContaMatic', 'cloud', 'ContaMatic', 'CO', 'https://api.contamatic.com', 'v2', 'api_key',
  ARRAY['facturación_electrónica', 'contabilidad', 'tesorería'],
  ARRAY['solo_empresas_pequeñas', 'limitaciones_reportes'],
  'https://api.contamatic.com/docs'),

('Siesa', 'cloud', 'Siesa', 'CO', 'https://api.siesa.com', 'v1', 'oauth2',
  ARRAY['facturación_electrónica', 'contabilidad', 'inventarios', 'nómina', 'tesorería'],
  ARRAY['alto_costo', 'complejidad_implementación'],
  'https://docs.siesa.com'),

-- Sistemas On-Premise
('SAP Business One', 'on_premise', 'SAP', 'CO', NULL, 'v9.3', 'basic',
  ARRAY['contabilidad_completa', 'inventarios', 'nómina', 'tesorería', 'reportes_avanzados'],
  ARRAY['alto_costo', 'requiere_servidor', 'complejidad'],
  'https://help.sap.com/business-one'),

('Tally ERP 9', 'on_premise', 'Tally Solutions', 'CO', NULL, 'v9.0', 'basic',
  ARRAY['contabilidad', 'inventarios', 'nómina'],
  ARRAY['no_facturación_electrónica', 'limitaciones_reportes'],
  'https://tallysolutions.com/support'),

('ContaPyme', 'on_premise', 'ContaPyme', 'CO', NULL, 'v2024', 'basic',
  ARRAY['contabilidad', 'facturación_electrónica', 'nómina'],
  ARRAY['solo_empresas_pequeñas', 'limitaciones_usuarios'],
  'https://contapyme.com/soporte')

ON CONFLICT (system_name, system_provider) DO UPDATE SET
  updated_at = NOW();

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE accounting_country_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_senders ENABLE ROW LEVEL SECURITY;
ALTER TABLE received_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_folder_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE classification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para invoice_senders
CREATE POLICY "invoice_senders_company_policy" ON invoice_senders
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para received_documents
CREATE POLICY "received_documents_company_policy" ON received_documents
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para accounting_folder_structure
CREATE POLICY "accounting_folder_structure_company_policy" ON accounting_folder_structure
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para processed_documents
CREATE POLICY "processed_documents_company_policy" ON processed_documents
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para accounting_integrations
CREATE POLICY "accounting_integrations_company_policy" ON accounting_integrations
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para classification_rules
CREATE POLICY "classification_rules_company_policy" ON classification_rules
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para processing_logs
CREATE POLICY "processing_logs_company_policy" ON processing_logs
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para accounting_country_config (lectura pública)
CREATE POLICY "accounting_country_config_read_policy" ON accounting_country_config
  FOR SELECT USING (true);

-- Políticas para accounting_systems (lectura pública)
CREATE POLICY "accounting_systems_read_policy" ON accounting_systems
  FOR SELECT USING (system_is_active = true);

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para generar estructura de carpetas por defecto
CREATE OR REPLACE FUNCTION create_default_accounting_structure(
  p_company_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Crear estructura base
  INSERT INTO accounting_folder_structure (
    company_id, folder_name, folder_path, folder_type, folder_level, folder_parent_id
  ) VALUES
  (p_company_id, 'Contabilidad', '/Contabilidad', 'root', 1, NULL),
  (p_company_id, '2024', '/Contabilidad/2024', 'year', 2, 
   (SELECT id FROM accounting_folder_structure WHERE company_id = p_company_id AND folder_name = 'Contabilidad')),
  (p_company_id, 'Enero', '/Contabilidad/2024/Enero', 'month', 3,
   (SELECT id FROM accounting_folder_structure WHERE company_id = p_company_id AND folder_name = '2024')),
  (p_company_id, 'Facturas Recibidas', '/Contabilidad/2024/Enero/Facturas Recibidas', 'category', 4,
   (SELECT id FROM accounting_folder_structure WHERE company_id = p_company_id AND folder_name = 'Enero')),
  (p_company_id, 'Documentos de Soporte', '/Contabilidad/2024/Enero/Documentos de Soporte', 'category', 4,
   (SELECT id FROM accounting_folder_structure WHERE company_id = p_company_id AND folder_name = 'Enero'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para clasificar automáticamente documentos
CREATE OR REPLACE FUNCTION classify_document(
  p_document_id UUID
) RETURNS JSONB AS $$
DECLARE
  document_data JSONB;
  classification_result JSONB;
BEGIN
  -- Obtener datos del documento
  SELECT metadata INTO document_data
  FROM received_documents
  WHERE id = p_document_id;
  
  -- Aquí iría la lógica de clasificación con IA
  -- Por ahora, retornamos una clasificación básica
  classification_result := jsonb_build_object(
    'confidence', 0.85,
    'category', 'factura_electrónica',
    'tags', ARRAY['automático', 'xml', 'colombia']
  );
  
  RETURN classification_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS PARA AUDITORÍA
-- =====================================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_invoice_senders_updated_at
  BEFORE UPDATE ON invoice_senders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_received_documents_updated_at
  BEFORE UPDATE ON received_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounting_folder_structure_updated_at
  BEFORE UPDATE ON accounting_folder_structure
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processed_documents_updated_at
  BEFORE UPDATE ON processed_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounting_integrations_updated_at
  BEFORE UPDATE ON accounting_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classification_rules_updated_at
  BEFORE UPDATE ON classification_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 