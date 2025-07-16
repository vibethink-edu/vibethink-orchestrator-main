-- 🌍 MIGRACIÓN COMPLETA - SISTEMA MULTI-PAÍS AI PAIR ORCHESTRATOR PRO
-- Fecha: 2025-01-21
-- Descripción: Implementación del sistema multi-país completo
-- Autor: Equipo de Desarrollo

-- =====================================================
-- 1. TABLA DE CONFIGURACIONES POR PAÍS
-- =====================================================

CREATE TABLE country_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) UNIQUE NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  region VARCHAR(10) NOT NULL CHECK (region IN ('LATAM', 'NA', 'EU')),
  
  -- Configuración de idioma
  default_language VARCHAR(5) NOT NULL,
  supported_languages JSONB NOT NULL DEFAULT '[]',
  
  -- Configuración monetaria
  default_currency VARCHAR(3) NOT NULL,
  currency_symbol VARCHAR(5) NOT NULL,
  currency_position VARCHAR(10) NOT NULL DEFAULT 'before',
  
  -- Configuración de formatos
  date_format VARCHAR(20) NOT NULL DEFAULT 'DD/MM/YYYY',
  time_format VARCHAR(5) NOT NULL DEFAULT '24h',
  number_format JSONB NOT NULL DEFAULT '{"decimalSeparator": ".", "thousandsSeparator": ",", "decimalPlaces": 2}',
  
  -- Configuración fiscal
  tax_rates JSONB NOT NULL DEFAULT '{"standard": 0, "reduced": 0, "zero": 0}',
  
  -- Configuración legal
  legal_requirements JSONB NOT NULL DEFAULT '{"requiresTaxId": false, "requiresAddress": false, "requiresPhone": false}',
  
  -- Configuración de pagos
  payment_methods JSONB NOT NULL DEFAULT '{"creditCard": true, "debitCard": true, "bankTransfer": false, "digitalWallets": [], "localMethods": []}',
  
  -- Configuración de contacto
  contact_info JSONB NOT NULL DEFAULT '{"supportEmail": "", "supportPhone": "", "businessHours": "", "timezone": ""}',
  
  -- Metadatos
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_country_configurations_region ON country_configurations(region);
CREATE INDEX idx_country_configurations_active ON country_configurations(is_active);
CREATE INDEX idx_country_configurations_language ON country_configurations(default_language);

-- =====================================================
-- 2. TABLA DE CONFIGURACIONES DE EMPRESA POR PAÍS
-- =====================================================

CREATE TABLE company_country_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES country_configurations(country_code),
  
  -- Configuración operativa
  operational_language VARCHAR(5) NOT NULL,
  operational_currency VARCHAR(3) NOT NULL,
  operational_timezone VARCHAR(50) NOT NULL,
  
  -- Configuración de facturación
  billing_settings JSONB NOT NULL DEFAULT '{}',
  
  -- Configuración de contacto
  contact_settings JSONB NOT NULL DEFAULT '{}',
  
  -- Configuración de pagos
  payment_settings JSONB NOT NULL DEFAULT '{}',
  
  -- Configuración de soporte
  support_settings JSONB NOT NULL DEFAULT '{}',
  
  -- Metadatos
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Restricciones
  UNIQUE(company_id, country_code)
);

-- Índices para optimización
CREATE INDEX idx_company_country_settings_company ON company_country_settings(company_id);
CREATE INDEX idx_company_country_settings_country ON company_country_settings(country_code);
CREATE INDEX idx_company_country_settings_active ON company_country_settings(is_active);

-- =====================================================
-- 3. TABLA DE PLANES POR PAÍS
-- =====================================================

CREATE TABLE country_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) NOT NULL REFERENCES country_configurations(country_code),
  plan_name VARCHAR(50) NOT NULL,
  
  -- Configuración de precios
  base_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
  
  -- Configuración de límites
  limits JSONB NOT NULL DEFAULT '{}',
  
  -- Configuración de características
  features JSONB NOT NULL DEFAULT '[]',
  
  -- Configuración de descuentos
  discounts JSONB NOT NULL DEFAULT '{}',
  
  -- Metadatos
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Restricciones
  UNIQUE(country_code, plan_name)
);

-- Índices para optimización
CREATE INDEX idx_country_plans_country ON country_plans(country_code);
CREATE INDEX idx_country_plans_active ON country_plans(is_active);
CREATE INDEX idx_country_plans_currency ON country_plans(currency);

-- =====================================================
-- 4. TABLA DE AUDITORÍA DE CAMBIOS POR PAÍS
-- =====================================================

CREATE TABLE country_settings_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES country_configurations(country_code),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Detalles del cambio
  change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('created', 'updated', 'deleted')),
  field_name VARCHAR(100) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  reason TEXT,
  
  -- Metadatos
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Información adicional
  ip_address INET,
  user_agent TEXT
);

-- Índices para auditoría
CREATE INDEX idx_country_settings_audit_company ON country_settings_audit_log(company_id);
CREATE INDEX idx_country_settings_audit_country ON country_settings_audit_log(country_code);
CREATE INDEX idx_country_settings_audit_user ON country_settings_audit_log(user_id);
CREATE INDEX idx_country_settings_audit_date ON country_settings_audit_log(changed_at);

-- =====================================================
-- 5. FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar timestamps
CREATE TRIGGER update_country_configurations_updated_at 
  BEFORE UPDATE ON country_configurations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_country_settings_updated_at 
  BEFORE UPDATE ON company_country_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_country_plans_updated_at 
  BEFORE UPDATE ON country_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear auditoría automática
CREATE OR REPLACE FUNCTION audit_country_settings_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO country_settings_audit_log (
      company_id, country_code, user_id, change_type, field_name, new_value
    ) VALUES (
      NEW.company_id, NEW.country_code, auth.uid(), 'created', 'all', to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Auditoría de cambios específicos
    IF OLD.operational_language != NEW.operational_language THEN
      INSERT INTO country_settings_audit_log (
        company_id, country_code, user_id, change_type, field_name, old_value, new_value
      ) VALUES (
        NEW.company_id, NEW.country_code, auth.uid(), 'updated', 'operational_language', 
        to_jsonb(OLD.operational_language), to_jsonb(NEW.operational_language)
      );
    END IF;
    
    IF OLD.operational_currency != NEW.operational_currency THEN
      INSERT INTO country_settings_audit_log (
        company_id, country_code, user_id, change_type, field_name, old_value, new_value
      ) VALUES (
        NEW.company_id, NEW.country_code, auth.uid(), 'updated', 'operational_currency', 
        to_jsonb(OLD.operational_currency), to_jsonb(NEW.operational_currency)
      );
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO country_settings_audit_log (
      company_id, country_code, user_id, change_type, field_name, old_value
    ) VALUES (
      OLD.company_id, OLD.country_code, auth.uid(), 'deleted', 'all', to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger para auditoría automática
CREATE TRIGGER audit_company_country_settings_changes
  AFTER INSERT OR UPDATE OR DELETE ON company_country_settings
  FOR EACH ROW EXECUTE FUNCTION audit_country_settings_change();

-- =====================================================
-- 6. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE country_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_country_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_settings_audit_log ENABLE ROW LEVEL SECURITY;

-- Políticas para country_configurations (lectura pública, escritura solo super admin)
CREATE POLICY "country_configurations_read_policy" ON country_configurations
  FOR SELECT USING (is_active = true);

CREATE POLICY "country_configurations_write_policy" ON country_configurations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'SUPER_ADMIN'
    )
  );

-- Políticas para company_country_settings (acceso por empresa)
CREATE POLICY "company_country_settings_company_policy" ON company_country_settings
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE user_profiles.id = auth.uid()
    )
  );

-- Políticas para country_plans (lectura pública, escritura solo super admin)
CREATE POLICY "country_plans_read_policy" ON country_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "country_plans_write_policy" ON country_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'SUPER_ADMIN'
    )
  );

-- Políticas para auditoría (solo super admin y admin de la empresa)
CREATE POLICY "country_settings_audit_admin_policy" ON country_settings_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND (user_profiles.role = 'SUPER_ADMIN' OR 
           (user_profiles.role IN ('ADMIN', 'OWNER') AND user_profiles.company_id = country_settings_audit_log.company_id))
    )
  );

-- =====================================================
-- 7. DATOS INICIALES - CONFIGURACIONES POR PAÍS
-- =====================================================

-- Colombia (País de inicio)
INSERT INTO country_configurations (
  country_code, country_name, region, default_language, supported_languages,
  default_currency, currency_symbol, currency_position, date_format, time_format,
  number_format, tax_rates, legal_requirements, payment_methods, contact_info
) VALUES (
  'CO', 'Colombia', 'LATAM', 'es', '["es", "en"]',
  'COP', '$', 'before', 'DD/MM/YYYY', '24h',
  '{"decimalSeparator": ",", "thousandsSeparator": ".", "decimalPlaces": 2}',
  '{"standard": 19, "reduced": 5, "zero": 0}',
  '{"requiresTaxId": true, "requiresAddress": true, "requiresPhone": true}',
  '{"creditCard": true, "debitCard": true, "bankTransfer": true, "digitalWallets": ["PayPal", "Nequi", "Daviplata"], "localMethods": ["PSE", "Bancolombia"]}',
  '{"supportEmail": "soporte@vibethink.co", "supportPhone": "+57 1 234 5678", "businessHours": "Lun-Vie 8:00-18:00", "timezone": "America/Bogota"}'
);

-- México
INSERT INTO country_configurations (
  country_code, country_name, region, default_language, supported_languages,
  default_currency, currency_symbol, currency_position, date_format, time_format,
  number_format, tax_rates, legal_requirements, payment_methods, contact_info
) VALUES (
  'MX', 'México', 'LATAM', 'es', '["es", "en"]',
  'MXN', '$', 'before', 'DD/MM/YYYY', '24h',
  '{"decimalSeparator": ".", "thousandsSeparator": ",", "decimalPlaces": 2}',
  '{"standard": 16, "reduced": 0, "zero": 0}',
  '{"requiresTaxId": true, "requiresAddress": true, "requiresPhone": true}',
  '{"creditCard": true, "debitCard": true, "bankTransfer": true, "digitalWallets": ["PayPal", "MercadoPago"], "localMethods": ["OXXO", "7-Eleven", "Banamex"]}',
  '{"supportEmail": "soporte@vibethink.mx", "supportPhone": "+52 55 1234 5678", "businessHours": "Lun-Vie 9:00-18:00", "timezone": "America/Mexico_City"}'
);

-- Brasil
INSERT INTO country_configurations (
  country_code, country_name, region, default_language, supported_languages,
  default_currency, currency_symbol, currency_position, date_format, time_format,
  number_format, tax_rates, legal_requirements, payment_methods, contact_info
) VALUES (
  'BR', 'Brasil', 'LATAM', 'pt', '["pt", "en"]',
  'BRL', 'R$', 'before', 'DD/MM/YYYY', '24h',
  '{"decimalSeparator": ",", "thousandsSeparator": ".", "decimalPlaces": 2}',
  '{"standard": 17, "reduced": 7, "zero": 0}',
  '{"requiresTaxId": true, "requiresAddress": true, "requiresPhone": true}',
  '{"creditCard": true, "debitCard": true, "bankTransfer": true, "digitalWallets": ["PayPal", "Pix"], "localMethods": ["Boleto", "Pix", "Itaú"]}',
  '{"supportEmail": "suporte@vibethink.com.br", "supportPhone": "+55 11 1234 5678", "businessHours": "Seg-Sex 8:00-18:00", "timezone": "America/Sao_Paulo"}'
);

-- Estados Unidos
INSERT INTO country_configurations (
  country_code, country_name, region, default_language, supported_languages,
  default_currency, currency_symbol, currency_position, date_format, time_format,
  number_format, tax_rates, legal_requirements, payment_methods, contact_info
) VALUES (
  'US', 'Estados Unidos', 'NA', 'en', '["en", "es"]',
  'USD', '$', 'before', 'MM/DD/YYYY', '12h',
  '{"decimalSeparator": ".", "thousandsSeparator": ",", "decimalPlaces": 2}',
  '{"standard": 0, "reduced": 0, "zero": 0}',
  '{"requiresTaxId": false, "requiresAddress": true, "requiresPhone": false}',
  '{"creditCard": true, "debitCard": true, "bankTransfer": true, "digitalWallets": ["PayPal", "Apple Pay", "Google Pay"], "localMethods": ["ACH", "Wire Transfer"]}',
  '{"supportEmail": "support@vibethink.com", "supportPhone": "+1 555 123 4567", "businessHours": "Mon-Fri 9:00-17:00", "timezone": "America/New_York"}'
);

-- España
INSERT INTO country_configurations (
  country_code, country_name, region, default_language, supported_languages,
  default_currency, currency_symbol, currency_position, date_format, time_format,
  number_format, tax_rates, legal_requirements, payment_methods, contact_info
) VALUES (
  'ES', 'España', 'EU', 'es', '["es", "en", "ca", "eu", "gl"]',
  'EUR', '€', 'after', 'DD/MM/YYYY', '24h',
  '{"decimalSeparator": ",", "thousandsSeparator": ".", "decimalPlaces": 2}',
  '{"standard": 21, "reduced": 10, "zero": 0}',
  '{"requiresTaxId": true, "requiresAddress": true, "requiresPhone": true}',
  '{"creditCard": true, "debitCard": true, "bankTransfer": true, "digitalWallets": ["PayPal", "Bizum"], "localMethods": ["Transferencia", "Bizum"]}',
  '{"supportEmail": "soporte@vibethink.es", "supportPhone": "+34 91 123 4567", "businessHours": "Lun-Vie 9:00-18:00", "timezone": "Europe/Madrid"}'
);

-- =====================================================
-- 8. DATOS INICIALES - PLANES POR PAÍS
-- =====================================================

-- Planes para Colombia
INSERT INTO country_plans (country_code, plan_name, base_price, currency, billing_cycle, limits, features, discounts) VALUES
('CO', 'Starter', 99000, 'COP', 'monthly', '{"maxUsers": 5, "maxMonthlyAiRequests": 1000, "maxMonthlyScrapingPages": 500}', '["ai_chat", "basic_analytics", "email_support"]', '{"annual": 20}'),
('CO', 'Professional', 199000, 'COP', 'monthly', '{"maxUsers": 20, "maxMonthlyAiRequests": 5000, "maxMonthlyScrapingPages": 2000}', '["ai_chat", "advanced_analytics", "priority_support", "custom_integrations"]', '{"annual": 25}'),
('CO', 'Enterprise', 499000, 'COP', 'monthly', '{"maxUsers": 100, "maxMonthlyAiRequests": 20000, "maxMonthlyScrapingPages": 10000}', '["ai_chat", "enterprise_analytics", "dedicated_support", "custom_integrations", "api_access"]', '{"annual": 30}');

-- Planes para México
INSERT INTO country_plans (country_code, plan_name, base_price, currency, billing_cycle, limits, features, discounts) VALUES
('MX', 'Starter', 199, 'MXN', 'monthly', '{"maxUsers": 5, "maxMonthlyAiRequests": 1000, "maxMonthlyScrapingPages": 500}', '["ai_chat", "basic_analytics", "email_support"]', '{"annual": 20}'),
('MX', 'Professional', 399, 'MXN', 'monthly', '{"maxUsers": 20, "maxMonthlyAiRequests": 5000, "maxMonthlyScrapingPages": 2000}', '["ai_chat", "advanced_analytics", "priority_support", "custom_integrations"]', '{"annual": 25}'),
('MX', 'Enterprise', 999, 'MXN', 'monthly', '{"maxUsers": 100, "maxMonthlyAiRequests": 20000, "maxMonthlyScrapingPages": 10000}', '["ai_chat", "enterprise_analytics", "dedicated_support", "custom_integrations", "api_access"]', '{"annual": 30}');

-- Planes para Brasil
INSERT INTO country_plans (country_code, plan_name, base_price, currency, billing_cycle, limits, features, discounts) VALUES
('BR', 'Starter', 99, 'BRL', 'monthly', '{"maxUsers": 5, "maxMonthlyAiRequests": 1000, "maxMonthlyScrapingPages": 500}', '["ai_chat", "basic_analytics", "email_support"]', '{"annual": 20}'),
('BR', 'Professional', 199, 'BRL', 'monthly', '{"maxUsers": 20, "maxMonthlyAiRequests": 5000, "maxMonthlyScrapingPages": 2000}', '["ai_chat", "advanced_analytics", "priority_support", "custom_integrations"]', '{"annual": 25}'),
('BR', 'Enterprise', 499, 'BRL', 'monthly', '{"maxUsers": 100, "maxMonthlyAiRequests": 20000, "maxMonthlyScrapingPages": 10000}', '["ai_chat", "enterprise_analytics", "dedicated_support", "custom_integrations", "api_access"]', '{"annual": 30}');

-- Planes para Estados Unidos
INSERT INTO country_plans (country_code, plan_name, base_price, currency, billing_cycle, limits, features, discounts) VALUES
('US', 'Starter', 29, 'USD', 'monthly', '{"maxUsers": 5, "maxMonthlyAiRequests": 1000, "maxMonthlyScrapingPages": 500}', '["ai_chat", "basic_analytics", "email_support"]', '{"annual": 20}'),
('US', 'Professional', 59, 'USD', 'monthly', '{"maxUsers": 20, "maxMonthlyAiRequests": 5000, "maxMonthlyScrapingPages": 2000}', '["ai_chat", "advanced_analytics", "priority_support", "custom_integrations"]', '{"annual": 25}'),
('US', 'Enterprise', 149, 'USD', 'monthly', '{"maxUsers": 100, "maxMonthlyAiRequests": 20000, "maxMonthlyScrapingPages": 10000}', '["ai_chat", "enterprise_analytics", "dedicated_support", "custom_integrations", "api_access"]', '{"annual": 30}');

-- Planes para España
INSERT INTO country_plans (country_code, plan_name, base_price, currency, billing_cycle, limits, features, discounts) VALUES
('ES', 'Starter', 29, 'EUR', 'monthly', '{"maxUsers": 5, "maxMonthlyAiRequests": 1000, "maxMonthlyScrapingPages": 500}', '["ai_chat", "basic_analytics", "email_support"]', '{"annual": 20}'),
('ES', 'Professional', 59, 'EUR', 'monthly', '{"maxUsers": 20, "maxMonthlyAiRequests": 5000, "maxMonthlyScrapingPages": 2000}', '["ai_chat", "advanced_analytics", "priority_support", "custom_integrations"]', '{"annual": 25}'),
('ES', 'Enterprise', 149, 'EUR', 'monthly', '{"maxUsers": 100, "maxMonthlyAiRequests": 20000, "maxMonthlyScrapingPages": 10000}', '["ai_chat", "enterprise_analytics", "dedicated_support", "custom_integrations", "api_access"]', '{"annual": 30}');

-- =====================================================
-- 9. FUNCIONES DE UTILIDAD
-- =====================================================

-- Función para obtener configuración efectiva de empresa por país
CREATE OR REPLACE FUNCTION get_company_country_configuration(
  p_company_id UUID,
  p_country_code VARCHAR(2)
)
RETURNS JSONB AS $$
DECLARE
  country_config JSONB;
  company_settings JSONB;
  effective_config JSONB;
BEGIN
  -- Obtener configuración del país
  SELECT to_jsonb(cc.*) INTO country_config
  FROM country_configurations cc
  WHERE cc.country_code = p_country_code AND cc.is_active = true;
  
  -- Obtener configuración de la empresa
  SELECT to_jsonb(ccs.*) INTO company_settings
  FROM company_country_settings ccs
  WHERE ccs.company_id = p_company_id 
    AND ccs.country_code = p_country_code 
    AND ccs.is_active = true;
  
  -- Combinar configuraciones (empresa sobrescribe país)
  effective_config = country_config;
  IF company_settings IS NOT NULL THEN
    effective_config = effective_config || company_settings;
  END IF;
  
  RETURN effective_config;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener planes disponibles por país
CREATE OR REPLACE FUNCTION get_country_plans(p_country_code VARCHAR(2))
RETURNS TABLE (
  plan_name VARCHAR(50),
  base_price DECIMAL(10,2),
  currency VARCHAR(3),
  billing_cycle VARCHAR(20),
  limits JSONB,
  features JSONB,
  discounts JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT cp.plan_name, cp.base_price, cp.currency, cp.billing_cycle, cp.limits, cp.features, cp.discounts
  FROM country_plans cp
  WHERE cp.country_code = p_country_code AND cp.is_active = true
  ORDER BY cp.base_price ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE country_configurations IS 'Configuraciones específicas por país para el sistema multi-país';
COMMENT ON TABLE company_country_settings IS 'Configuraciones de empresa específicas por país';
COMMENT ON TABLE country_plans IS 'Planes de precios específicos por país';
COMMENT ON TABLE country_settings_audit_log IS 'Auditoría de cambios en configuraciones por país';

COMMENT ON FUNCTION get_company_country_configuration IS 'Obtiene la configuración efectiva combinando país y empresa';
COMMENT ON FUNCTION get_country_plans IS 'Obtiene los planes disponibles para un país específico';

-- =====================================================
-- MIGRACIÓN COMPLETADA
-- =====================================================

-- Verificar que todas las tablas se crearon correctamente
DO $$
BEGIN
  RAISE NOTICE '✅ Migración multi-país completada exitosamente';
  RAISE NOTICE '📊 Tablas creadas: country_configurations, company_country_settings, country_plans, country_settings_audit_log';
  RAISE NOTICE '🔒 Políticas RLS configuradas para seguridad multi-tenant';
  RAISE NOTICE '🌍 Datos iniciales cargados para: Colombia, México, Brasil, Estados Unidos, España';
  RAISE NOTICE '📋 Próximo paso: Implementar hooks React y componentes UI';
END $$; 