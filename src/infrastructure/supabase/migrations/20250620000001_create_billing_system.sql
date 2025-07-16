-- =====================================================
-- SISTEMA DE BILLING Y PLANES SAAS
-- Migración para AI Pair Orchestrator Pro
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLA DE PLANES DE SUSCRIPCIÓN
-- =====================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  base_price_usd DECIMAL(10,2) NOT NULL,
  base_price_cop DECIMAL(10,2) NOT NULL,
  base_price_eur DECIMAL(10,2) NOT NULL,
  trial_days INTEGER DEFAULT 14,
  max_users INTEGER NOT NULL,
  max_monthly_ai_requests INTEGER NOT NULL,
  max_monthly_scraping_pages INTEGER NOT NULL,
  max_storage_gb INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  stripe_product_id VARCHAR(100),
  stripe_price_id_monthly VARCHAR(100),
  stripe_price_id_yearly VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE SUSCRIPCIONES
-- =====================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id VARCHAR(100) UNIQUE,
  stripe_customer_id VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'trialing',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE FACTURAS
-- =====================================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  stripe_invoice_id VARCHAR(100) UNIQUE,
  number VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'draft',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  exchange_rate DECIMAL(10,6) DEFAULT 1.0,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE ITEMS DE FACTURA
-- =====================================================

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,4) DEFAULT 0.19,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE TICKETS DE SOPORTE
-- =====================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  zammad_ticket_id INTEGER,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'technical',
  priority VARCHAR(20) DEFAULT 'normal',
  status VARCHAR(20) DEFAULT 'open',
  assigned_to UUID REFERENCES users(id),
  resolution TEXT,
  closed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE MÉTRICAS DE USO MENSUAL
-- =====================================================

CREATE TABLE IF NOT EXISTS monthly_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  billing_month VARCHAR(7) NOT NULL, -- formato: YYYY-MM
  ai_requests INTEGER DEFAULT 0,
  scraping_pages INTEGER DEFAULT 0,
  storage_gb DECIMAL(10,2) DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  cost_per_ai_request DECIMAL(10,4) DEFAULT 0.02,
  total_cost_usd DECIMAL(10,2) DEFAULT 0,
  overage_charges DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, billing_month)
);

-- =====================================================
-- TABLA DE LOGS DE USO DETALLADO
-- =====================================================

CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  service_type VARCHAR(50) NOT NULL, -- 'ai_request', 'scraping', 'storage'
  operation_type VARCHAR(100) NOT NULL,
  amount INTEGER DEFAULT 1,
  cost_usd DECIMAL(10,4) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE CONFIGURACIÓN DE BILLING
-- =====================================================

CREATE TABLE IF NOT EXISTS billing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para suscripciones
CREATE INDEX IF NOT EXISTS idx_subscriptions_company_id ON subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Índices para facturas
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(number);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Índices para items de factura
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Índices para tickets de soporte
CREATE INDEX IF NOT EXISTS idx_support_tickets_company_id ON support_tickets(company_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_type ON support_tickets(type);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);

-- Índices para métricas de uso
CREATE INDEX IF NOT EXISTS idx_monthly_usage_company_id ON monthly_usage(company_id);
CREATE INDEX IF NOT EXISTS idx_monthly_usage_billing_month ON monthly_usage(billing_month);

-- Índices para logs de uso
CREATE INDEX IF NOT EXISTS idx_usage_logs_company_id ON usage_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_service_type ON usage_logs(service_type);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);

-- =====================================================
-- FUNCIONES PARA GESTIÓN DE BILLING
-- =====================================================

-- Función para calcular el uso mensual
CREATE OR REPLACE FUNCTION calculate_monthly_usage(
  p_company_id UUID,
  p_billing_month VARCHAR(7)
) RETURNS JSONB AS $$
DECLARE
  usage_data JSONB;
BEGIN
  SELECT jsonb_build_object(
    'ai_requests', COALESCE(SUM(CASE WHEN service_type = 'ai_request' THEN amount ELSE 0 END), 0),
    'scraping_pages', COALESCE(SUM(CASE WHEN service_type = 'scraping' THEN amount ELSE 0 END), 0),
    'storage_gb', COALESCE(MAX(CASE WHEN service_type = 'storage' THEN amount ELSE 0 END), 0),
    'total_cost_usd', COALESCE(SUM(cost_usd), 0)
  ) INTO usage_data
  FROM usage_logs
  WHERE company_id = p_company_id
    AND to_char(created_at, 'YYYY-MM') = p_billing_month;

  RETURN usage_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para validar límites de uso
CREATE OR REPLACE FUNCTION validate_usage_limits(
  p_company_id UUID,
  p_service_type VARCHAR(50),
  p_amount INTEGER DEFAULT 1
) RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
  plan_limit INTEGER;
  current_month VARCHAR(7);
BEGIN
  current_month := to_char(NOW(), 'YYYY-MM');
  
  -- Obtener uso actual del mes
  SELECT COALESCE(SUM(amount), 0) INTO current_usage
  FROM usage_logs
  WHERE company_id = p_company_id
    AND service_type = p_service_type
    AND to_char(created_at, 'YYYY-MM') = current_month;
  
  -- Obtener límite del plan
  SELECT 
    CASE p_service_type
      WHEN 'ai_request' THEN sp.max_monthly_ai_requests
      WHEN 'scraping' THEN sp.max_monthly_scraping_pages
      WHEN 'storage' THEN sp.max_storage_gb
      ELSE 0
    END INTO plan_limit
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.company_id = p_company_id
    AND s.status IN ('active', 'trialing');
  
  -- Retornar true si está dentro del límite
  RETURN (current_usage + p_amount) <= plan_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para generar número de factura
CREATE OR REPLACE FUNCTION generate_invoice_number() RETURNS VARCHAR(50) AS $$
DECLARE
  next_number INTEGER;
  invoice_number VARCHAR(50);
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(number FROM 'INV-(\d+)') AS INTEGER)), 0) + 1
  INTO next_number
  FROM invoices;
  
  invoice_number := 'INV-' || to_char(NOW(), 'YYYY') || '-' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN invoice_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_usage_updated_at
  BEFORE UPDATE ON monthly_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_config_updated_at
  BEFORE UPDATE ON billing_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES - PLANES DE SUSCRIPCIÓN
-- =====================================================

INSERT INTO subscription_plans (
  name, display_name, description, 
  base_price_usd, base_price_cop, base_price_eur,
  trial_days, max_users, max_monthly_ai_requests, 
  max_monthly_scraping_pages, max_storage_gb, features
) VALUES 
(
  'STARTER', 'Iniciador', 'Perfecto para pequeñas empresas que quieren empezar con IA',
  25.00, 99000.00, 23.00,
  14, 5, 500, 100, 10,
  '["basic_ai", "email_support", "google_workspace"]'
),
(
  'PROFESSIONAL', 'Profesional', 'Para empresas en crecimiento que necesitan más potencia',
  75.00, 299000.00, 69.00,
  14, 25, 2500, 500, 50,
  '["advanced_ai", "priority_support", "api_access", "custom_workflows"]'
),
(
  'ENTERPRISE', 'Empresarial', 'Solución completa para grandes organizaciones',
  200.00, 799000.00, 185.00,
  14, -1, 10000, 2000, 200,
  '["enterprise_ai", "dedicated_support", "sso", "white_label", "custom_integrations"]'
)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  base_price_usd = EXCLUDED.base_price_usd,
  base_price_cop = EXCLUDED.base_price_cop,
  base_price_eur = EXCLUDED.base_price_eur,
  trial_days = EXCLUDED.trial_days,
  max_users = EXCLUDED.max_users,
  max_monthly_ai_requests = EXCLUDED.max_monthly_ai_requests,
  max_monthly_scraping_pages = EXCLUDED.max_monthly_scraping_pages,
  max_storage_gb = EXCLUDED.max_storage_gb,
  features = EXCLUDED.features,
  updated_at = NOW();

-- =====================================================
-- CONFIGURACIÓN INICIAL DE BILLING
-- =====================================================

INSERT INTO billing_config (key, value, description) VALUES
(
  'stripe_config',
  '{
    "webhook_endpoint": "/api/webhooks/stripe",
    "currency_default": "cop",
    "tax_rates": {
      "CO": 0.19,
      "US": 0.00,
      "MX": 0.16,
      "AR": 0.21,
      "BR": 0.00,
      "CL": 0.19,
      "PE": 0.18
    }
  }',
  'Configuración de Stripe para procesamiento de pagos'
),
(
  'zammad_config',
  '{
    "base_url": "https://support.vibethink.com",
    "webhook_endpoint": "/api/webhooks/zammad",
    "groups": {
      "technical": "Technical Support",
      "billing": "Billing Support"
    }
  }',
  'Configuración de Zammad para tickets de soporte'
),
(
  'billing_rules',
  '{
    "trial_days": 14,
    "grace_period_days": 7,
    "overage_rates": {
      "ai_request": 0.02,
      "scraping_page": 0.01,
      "storage_gb": 0.50,
      "additional_user": 5.00
    },
    "invoice_terms": "Neto 30 días"
  }',
  'Reglas de facturación y cobros por exceso'
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_config ENABLE ROW LEVEL SECURITY;

-- Políticas para subscription_plans (lectura pública)
CREATE POLICY "subscription_plans_read_policy" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- Políticas para subscriptions
CREATE POLICY "subscriptions_company_policy" ON subscriptions
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para invoices
CREATE POLICY "invoices_company_policy" ON invoices
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para invoice_items
CREATE POLICY "invoice_items_company_policy" ON invoice_items
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Políticas para support_tickets
CREATE POLICY "support_tickets_company_policy" ON support_tickets
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para monthly_usage
CREATE POLICY "monthly_usage_company_policy" ON monthly_usage
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para usage_logs
CREATE POLICY "usage_logs_company_policy" ON usage_logs
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas para billing_config (solo admin)
CREATE POLICY "billing_config_admin_policy" ON billing_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE subscription_plans IS 'Planes de suscripción disponibles para las empresas';
COMMENT ON TABLE subscriptions IS 'Suscripciones activas de las empresas';
COMMENT ON TABLE invoices IS 'Facturas generadas para las empresas';
COMMENT ON TABLE invoice_items IS 'Items detallados de cada factura';
COMMENT ON TABLE support_tickets IS 'Tickets de soporte técnico y billing';
COMMENT ON TABLE monthly_usage IS 'Métricas de uso mensual por empresa';
COMMENT ON TABLE usage_logs IS 'Logs detallados de uso para tracking';
COMMENT ON TABLE billing_config IS 'Configuración del sistema de billing';

COMMENT ON COLUMN subscriptions.status IS 'Estado: trialing, active, past_due, canceled, unpaid';
COMMENT ON COLUMN invoices.status IS 'Estado: draft, open, paid, void, uncollectible';
COMMENT ON COLUMN support_tickets.type IS 'Tipo: technical, billing';
COMMENT ON COLUMN support_tickets.priority IS 'Prioridad: low, normal, high, urgent';
COMMENT ON COLUMN support_tickets.status IS 'Estado: open, in_progress, resolved, closed'; 