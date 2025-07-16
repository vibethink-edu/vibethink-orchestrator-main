-- Migración: Implementar restricciones de unicidad y optimización para empresas
-- Fecha: 2025-01-27
-- Autor: Marcelo + AI

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla principal de empresas con restricciones de unicidad
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  subdomain VARCHAR(100) UNIQUE,
  external_id VARCHAR(100) UNIQUE,
  tenant_id UUID UNIQUE DEFAULT uuid_generate_v4(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de branding y configuración
CREATE TABLE IF NOT EXISTS company_branding (
  company_id UUID PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  branding_config JSONB NOT NULL DEFAULT '{}',
  custom_locales JSONB DEFAULT '{}',
  permissions_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de permisos granulares
CREATE TABLE IF NOT EXISTS company_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role_name VARCHAR(50) NOT NULL,
  module VARCHAR(50) NOT NULL,
  permissions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, role_name, module)
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_subdomain ON companies(subdomain);
CREATE INDEX IF NOT EXISTS idx_companies_external_id ON companies(external_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);

CREATE INDEX IF NOT EXISTS idx_company_branding_company_id ON company_branding(company_id);
CREATE INDEX IF NOT EXISTS idx_company_permissions_company_id ON company_permissions(company_id);
CREATE INDEX IF NOT EXISTS idx_company_permissions_role ON company_permissions(role_name);
CREATE INDEX IF NOT EXISTS idx_company_permissions_module ON company_permissions(module);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers si no existen
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_companies_updated_at') THEN
    CREATE TRIGGER update_companies_updated_at 
      BEFORE UPDATE ON companies
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_company_branding_updated_at') THEN
    CREATE TRIGGER update_company_branding_updated_at 
      BEFORE UPDATE ON company_branding
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Habilitar RLS en todas las tablas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_permissions ENABLE ROW LEVEL SECURITY;

-- Política para SuperAdmin (acceso total)
CREATE POLICY IF NOT EXISTS "SuperAdmin can access all companies" ON companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'SUPER_ADMIN'
    )
  );

-- Política para usuarios de empresa (solo su empresa)
CREATE POLICY IF NOT EXISTS "Users can access only their company" ON companies
  FOR ALL USING (
    id = (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Políticas para company_branding
CREATE POLICY IF NOT EXISTS "SuperAdmin can access all company branding" ON company_branding
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'SUPER_ADMIN'
    )
  );

CREATE POLICY IF NOT EXISTS "Users can access only their company branding" ON company_branding
  FOR ALL USING (
    company_id = (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Políticas para company_permissions
CREATE POLICY IF NOT EXISTS "SuperAdmin can access all company permissions" ON company_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'SUPER_ADMIN'
    )
  );

CREATE POLICY IF NOT EXISTS "Users can access only their company permissions" ON company_permissions
  FOR ALL USING (
    company_id = (
      SELECT company_id FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Función para validar unicidad de slug
CREATE OR REPLACE FUNCTION validate_unique_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar si el slug ya existe
  IF EXISTS (
    SELECT 1 FROM companies 
    WHERE slug = NEW.slug 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) THEN
    RAISE EXCEPTION 'Slug "%" ya existe', NEW.slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar unicidad de slug
DROP TRIGGER IF EXISTS validate_slug_uniqueness ON companies;
CREATE TRIGGER validate_slug_uniqueness
  BEFORE INSERT OR UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION validate_unique_slug();

-- Función para generar slug automáticamente
CREATE OR REPLACE FUNCTION generate_slug_from_name()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Si ya hay un slug, no hacer nada
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;
  
  -- Generar slug base
  base_slug := LOWER(NEW.name);
  base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '-+', '-', 'g');
  base_slug := TRIM(BOTH '-' FROM base_slug);
  
  -- Si el slug base está vacío, usar un valor por defecto
  IF base_slug = '' THEN
    base_slug := 'company';
  END IF;
  
  final_slug := base_slug;
  
  -- Verificar unicidad y agregar sufijo si es necesario
  WHILE EXISTS (
    SELECT 1 FROM companies 
    WHERE slug = final_slug 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
    
    -- Prevenir loops infinitos
    IF counter > 100 THEN
      RAISE EXCEPTION 'No se pudo generar un slug único después de 100 intentos';
    END IF;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar slug automáticamente
DROP TRIGGER IF EXISTS auto_generate_slug ON companies;
CREATE TRIGGER auto_generate_slug
  BEFORE INSERT ON companies
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_name();

-- Insertar datos de ejemplo para testing
INSERT INTO companies (name, external_id) VALUES 
  ('AI Pair Platform', 'vibethink-platform'),
  ('Hospital San José', 'hospital-san-jose'),
  ('Empresa Ejemplo', 'empresa-ejemplo')
ON CONFLICT (external_id) DO NOTHING;

-- Crear configuraciones de branding por defecto
INSERT INTO company_branding (company_id, branding_config, custom_locales, permissions_config)
SELECT 
  id,
  '{"logoUrl": "", "primaryColor": "#0055A4", "welcomeMessage": "Bienvenido a ' || name || '", "customFields": {}}',
  '{}',
  '{}'
FROM companies
WHERE id NOT IN (SELECT company_id FROM company_branding); 