
-- Tabla para configuraciones globales de la plataforma (solo super admin)
CREATE TABLE platform_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL, -- 'ai_models', 'integrations', 'features', 'limits'
  config_key VARCHAR(100) NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, config_key)
);

-- Tabla para override de configuraciones específicas por empresa (super admin)
CREATE TABLE company_configuration_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  config_key VARCHAR(100) NOT NULL,
  override_value JSONB NOT NULL,
  reason TEXT, -- Razón del override
  expires_at TIMESTAMP WITH TIME ZONE, -- Para overrides temporales
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, category, config_key)
);

-- Tabla para log de cambios (auditoría)
CREATE TABLE configuration_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(50) NOT NULL, -- 'platform_configurations', 'company_configuration_overrides', etc.
  record_id UUID NOT NULL, -- ID del registro modificado
  company_id UUID, -- Solo si aplica a empresa específica
  action VARCHAR(20) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
  old_values JSONB, -- Valores anteriores
  new_values JSONB, -- Valores nuevos
  changed_by UUID REFERENCES user_profiles(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  reason TEXT -- Razón del cambio
);

-- Función para obtener configuración efectiva (global + overrides)
CREATE OR REPLACE FUNCTION get_effective_configuration(
  p_company_id UUID,
  p_category VARCHAR(50),
  p_config_key VARCHAR(100)
)
RETURNS JSONB AS $$
DECLARE
  override_value JSONB;
  global_value JSONB;
BEGIN
  -- Primero buscar override específico de la empresa
  SELECT override_value INTO override_value
  FROM company_configuration_overrides
  WHERE company_id = p_company_id
    AND category = p_category
    AND config_key = p_config_key
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW());
  
  -- Si existe override, retornarlo
  IF override_value IS NOT NULL THEN
    RETURN override_value;
  END IF;
  
  -- Si no, retornar configuración global
  SELECT config_value INTO global_value
  FROM platform_configurations
  WHERE category = p_category
    AND config_key = p_config_key
    AND is_active = true;
  
  RETURN COALESCE(global_value, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear/actualizar configuración global (solo super admin)
CREATE OR REPLACE FUNCTION upsert_platform_configuration(
  p_category VARCHAR(50),
  p_config_key VARCHAR(100),
  p_config_value JSONB,
  p_description TEXT,
  p_user_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  config_id UUID;
  old_values JSONB;
BEGIN
  -- Obtener valores anteriores para auditoría
  SELECT jsonb_build_object(
    'config_value', config_value,
    'description', description,
    'is_active', is_active
  ) INTO old_values
  FROM platform_configurations
  WHERE category = p_category AND config_key = p_config_key;
  
  -- Upsert configuración
  INSERT INTO platform_configurations (category, config_key, config_value, description, created_by)
  VALUES (p_category, p_config_key, p_config_value, p_description, p_user_id)
  ON CONFLICT (category, config_key)
  DO UPDATE SET
    config_value = p_config_value,
    description = p_description,
    updated_at = NOW()
  RETURNING id INTO config_id;
  
  -- Log de auditoría
  INSERT INTO configuration_audit_log (
    table_name, record_id, action, old_values, new_values, changed_by, reason
  ) VALUES (
    'platform_configurations',
    config_id,
    CASE WHEN old_values IS NULL THEN 'CREATE' ELSE 'UPDATE' END,
    old_values,
    jsonb_build_object(
      'config_value', p_config_value,
      'description', p_description,
      'is_active', true
    ),
    p_user_id,
    p_reason
  );
  
  RETURN config_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear override de empresa (solo super admin)
CREATE OR REPLACE FUNCTION create_company_override(
  p_company_id UUID,
  p_category VARCHAR(50),
  p_config_key VARCHAR(100),
  p_override_value JSONB,
  p_reason TEXT,
  p_expires_at TIMESTAMP WITH TIME ZONE,
  p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
  override_id UUID;
  old_values JSONB;
BEGIN
  -- Obtener valores anteriores si existen
  SELECT jsonb_build_object(
    'override_value', override_value,
    'reason', reason,
    'expires_at', expires_at,
    'is_active', is_active
  ) INTO old_values
  FROM company_configuration_overrides
  WHERE company_id = p_company_id AND category = p_category AND config_key = p_config_key;
  
  -- Upsert override
  INSERT INTO company_configuration_overrides (
    company_id, category, config_key, override_value, reason, expires_at, created_by
  )
  VALUES (p_company_id, p_category, p_config_key, p_override_value, p_reason, p_expires_at, p_user_id)
  ON CONFLICT (company_id, category, config_key)
  DO UPDATE SET
    override_value = p_override_value,
    reason = p_reason,
    expires_at = p_expires_at,
    is_active = true,
    updated_at = NOW()
  RETURNING id INTO override_id;
  
  -- Log de auditoría
  INSERT INTO configuration_audit_log (
    table_name, record_id, company_id, action, old_values, new_values, changed_by, reason
  ) VALUES (
    'company_configuration_overrides',
    override_id,
    p_company_id,
    CASE WHEN old_values IS NULL THEN 'CREATE' ELSE 'UPDATE' END,
    old_values,
    jsonb_build_object(
      'override_value', p_override_value,
      'reason', p_reason,
      'expires_at', p_expires_at,
      'is_active', true
    ),
    p_user_id,
    p_reason
  );
  
  RETURN override_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertar configuraciones globales por defecto
INSERT INTO platform_configurations (category, config_key, config_value, description) VALUES
-- Modelos de IA disponibles
('ai_models', 'openai_models', 
 '["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo", "whisper-1", "tts-1", "tts-1-hd"]'::jsonb,
 'Modelos de OpenAI disponibles en la plataforma'),
 
('ai_models', 'anthropic_models',
 '["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307", "claude-3-opus-20240229"]'::jsonb,
 'Modelos de Anthropic disponibles'),
 
('ai_models', 'elevenlabs_voices',
 '["9BWtsMINqrJLrRacOk9x", "CwhRBWXzGAHq8TQ4Fs17", "EXAVITQu4vr4xnSDxMaL"]'::jsonb,
 'Voces de ElevenLabs disponibles'),

-- Integraciones disponibles
('integrations', 'google_workspace_scopes',
 '["gmail.send", "gmail.modify", "drive.file", "documents", "spreadsheets", "calendar"]'::jsonb,
 'Scopes disponibles para Google Workspace'),
 
('integrations', 'microsoft365_scopes',
 '["files.readwrite", "mail.send", "calendars.read", "user.read"]'::jsonb,
 'Scopes disponibles para Microsoft 365'),

-- Límites por defecto del sistema
('limits', 'default_rate_limits',
 '{"api_requests_per_minute": 100, "ai_requests_per_hour": 1000, "storage_mb_per_user": 1000}'::jsonb,
 'Límites por defecto del sistema'),
 
('limits', 'max_file_sizes',
 '{"document_mb": 50, "image_mb": 10, "video_mb": 500}'::jsonb,
 'Tamaños máximos de archivos'),

-- Features disponibles
('features', 'available_features',
 '["ai_chat", "voice_agents", "document_processing", "workflow_automation", "custom_integrations", "white_label", "sso", "api_access"]'::jsonb,
 'Features disponibles en la plataforma'),

-- Configuraciones de seguridad
('security', 'password_requirements',
 '{"min_length": 8, "require_uppercase": true, "require_numbers": true, "require_symbols": true}'::jsonb,
 'Requisitos de contraseñas'),
 
('security', 'session_settings',
 '{"max_duration_hours": 24, "idle_timeout_minutes": 120, "concurrent_sessions": 3}'::jsonb,
 'Configuraciones de sesión');

-- Crear índices
CREATE INDEX idx_platform_config_category ON platform_configurations(category);
CREATE INDEX idx_company_overrides_company ON company_configuration_overrides(company_id);
CREATE INDEX idx_audit_log_company_date ON configuration_audit_log(company_id, changed_at);
CREATE INDEX idx_audit_log_table_record ON configuration_audit_log(table_name, record_id);

-- RLS para platform_configurations (solo super admin puede modificar)
ALTER TABLE platform_configurations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view platform configurations" ON platform_configurations
  FOR SELECT USING (true);

-- RLS para company_configuration_overrides (solo super admin)
ALTER TABLE company_configuration_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company users can view their overrides" ON company_configuration_overrides
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
  );

-- RLS para audit log (solo super admin puede ver todo, usuarios pueden ver su empresa)
ALTER TABLE configuration_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view audit logs for their company" ON configuration_audit_log
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
    OR company_id IS NULL
  );
