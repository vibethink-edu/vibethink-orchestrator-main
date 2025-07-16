-- Migration: Universal Tagging System
-- Author: AI Pair Platform Team
-- Version: 1.0.0
-- Description: Sistema universal de etiquetas para todos los módulos de la plataforma

-- =====================================================
-- 1. SISTEMA DE CATEGORÍAS DE ETIQUETAS
-- =====================================================

-- Tabla de categorías de etiquetas (para organizar etiquetas por módulo/contexto)
CREATE TABLE IF NOT EXISTS tag_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Color por defecto (azul)
  icon TEXT, -- Icono opcional (ej: 'user', 'building', 'star')
  module TEXT NOT NULL, -- 'crm', 'helpdesk', 'operations', 'general'
  is_system BOOLEAN DEFAULT false, -- Etiquetas del sistema que no se pueden eliminar
  sort_order INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  
  -- Constraints
  UNIQUE(company_id, name, module)
);

-- =====================================================
-- 2. TABLA PRINCIPAL DE ETIQUETAS
-- =====================================================

CREATE TABLE IF NOT EXISTS tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES tag_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6B7280', -- Color por defecto (gris)
  usage_count INTEGER DEFAULT 0, -- Contador de uso para analytics
  is_system BOOLEAN DEFAULT false, -- Etiquetas del sistema
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  
  -- Constraints
  UNIQUE(company_id, name),
  CHECK (color ~ '^#[0-9A-Fa-f]{6}$') -- Validar formato de color
);

-- =====================================================
-- 3. TABLA DE RELACIÓN ENTIDAD-ETIQUETA
-- =====================================================

CREATE TABLE IF NOT EXISTS entity_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'contact', 'person', 'deal', 'ticket', 'meeting', etc.
  entity_id UUID NOT NULL,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Constraints
  UNIQUE(tag_id, entity_type, entity_id), -- Evitar duplicados
  CHECK (entity_type IN (
    'contact', 'person', 'deal', 'interaction', 'pqrs_request',
    'support_ticket', 'support_conversation',
    'prompt_template', 'naming_convention', 'folder_structure',
    'meeting', 'resource', 'content_item', 'task'
  ))
);

-- =====================================================
-- 4. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para búsquedas rápidas
CREATE INDEX idx_tag_categories_company_module ON tag_categories(company_id, module);
CREATE INDEX idx_tags_company_category ON tags(company_id, category_id);
CREATE INDEX idx_tags_company_name ON tags(company_id, name);
CREATE INDEX idx_entity_tags_entity ON entity_tags(entity_type, entity_id);
CREATE INDEX idx_entity_tags_tag ON entity_tags(tag_id);
CREATE INDEX idx_entity_tags_company ON entity_tags(company_id);

-- Índice compuesto para búsquedas por entidad
CREATE INDEX idx_entity_tags_lookup ON entity_tags(company_id, entity_type, entity_id);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE tag_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_tags ENABLE ROW LEVEL SECURITY;

-- Políticas para tag_categories
CREATE POLICY "Users can view tag categories from their company" ON tag_categories
  FOR SELECT USING (company_id = auth.jwt() ->> 'company_id');

CREATE POLICY "Users can create tag categories in their company" ON tag_categories
  FOR INSERT WITH CHECK (company_id = auth.jwt() ->> 'company_id');

CREATE POLICY "Users can update tag categories in their company" ON tag_categories
  FOR UPDATE USING (company_id = auth.jwt() ->> 'company_id');

CREATE POLICY "Users can delete tag categories in their company" ON tag_categories
  FOR DELETE USING (company_id = auth.jwt() ->> 'company_id');

-- Políticas para tags
CREATE POLICY "Users can view tags from their company" ON tags
  FOR SELECT USING (company_id = auth.jwt() ->> 'company_id');

CREATE POLICY "Users can create tags in their company" ON tags
  FOR INSERT WITH CHECK (company_id = auth.jwt() ->> 'company_id');

CREATE POLICY "Users can update tags in their company" ON tags
  FOR UPDATE USING (company_id = auth.jwt() ->> 'company_id');

CREATE POLICY "Users can delete tags in their company" ON tags
  FOR DELETE USING (company_id = auth.jwt() ->> 'company_id');

-- Políticas para entity_tags
CREATE POLICY "Users can view entity tags from their company" ON entity_tags
  FOR SELECT USING (company_id = auth.jwt() ->> 'company_id');

CREATE POLICY "Users can create entity tags in their company" ON entity_tags
  FOR INSERT WITH CHECK (company_id = auth.jwt() ->> 'company_id');

CREATE POLICY "Users can delete entity tags in their company" ON entity_tags
  FOR DELETE USING (company_id = auth.jwt() ->> 'company_id');

-- =====================================================
-- 6. FUNCIONES DE UTILIDAD
-- =====================================================

-- Función para obtener etiquetas de una entidad
CREATE OR REPLACE FUNCTION get_entity_tags(
  p_entity_type TEXT,
  p_entity_id UUID
)
RETURNS TABLE (
  tag_id UUID,
  tag_name TEXT,
  tag_color TEXT,
  category_name TEXT,
  category_color TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.color,
    tc.name as category_name,
    tc.color as category_color
  FROM entity_tags et
  JOIN tags t ON et.tag_id = t.id
  LEFT JOIN tag_categories tc ON t.category_id = tc.id
  WHERE et.entity_type = p_entity_type 
    AND et.entity_id = p_entity_id
    AND et.company_id = auth.jwt() ->> 'company_id'
    AND t.is_active = true
  ORDER BY tc.sort_order, t.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para buscar entidades por etiquetas
CREATE OR REPLACE FUNCTION search_entities_by_tags(
  p_entity_type TEXT,
  p_tag_names TEXT[]
)
RETURNS TABLE (
  entity_id UUID,
  tag_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    et.entity_id,
    COUNT(*) as tag_count
  FROM entity_tags et
  JOIN tags t ON et.tag_id = t.id
  WHERE et.entity_type = p_entity_type
    AND et.company_id = auth.jwt() ->> 'company_id'
    AND t.name = ANY(p_tag_names)
    AND t.is_active = true
  GROUP BY et.entity_id
  HAVING COUNT(*) = array_length(p_tag_names, 1) -- Debe tener todas las etiquetas
  ORDER BY tag_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar contador de uso de etiquetas
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags 
    SET usage_count = usage_count + 1,
        updated_at = now()
    WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags 
    SET usage_count = GREATEST(usage_count - 1, 0),
        updated_at = now()
    WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contador de uso
CREATE TRIGGER trigger_update_tag_usage
  AFTER INSERT OR DELETE ON entity_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_usage_count();

-- =====================================================
-- 7. COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE tag_categories IS 'Categorías para organizar etiquetas por módulo y contexto';
COMMENT ON TABLE tags IS 'Etiquetas disponibles para categorizar entidades';
COMMENT ON TABLE entity_tags IS 'Relación muchos a muchos entre entidades y etiquetas';
COMMENT ON COLUMN tag_categories.module IS 'Módulo al que pertenece la categoría: crm, helpdesk, operations, general';
COMMENT ON COLUMN entity_tags.entity_type IS 'Tipo de entidad que se está etiquetando';
COMMENT ON COLUMN tags.usage_count IS 'Contador de uso para analytics y sugerencias';
