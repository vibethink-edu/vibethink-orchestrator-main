-- Migration para el Esquema Inicial del CRM Schema-First

-- Tabla de Workspaces para soportar la multitenencia
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    plan TEXT DEFAULT 'free' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE workspaces IS 'Representa una única empresa o tenant en la aplicación.';

-- Tabla de unión para vincular usuarios a workspaces y definir roles
CREATE TABLE workspace_users (
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'MEMBER' NOT NULL, -- Ej: 'OWNER', 'ADMIN', 'MEMBER'
    PRIMARY KEY (workspace_id, user_id)
);
COMMENT ON TABLE workspace_users IS 'Asigna usuarios a workspaces y define sus roles.';

-- Tabla de Objetos para definir estructuras de datos personalizadas
CREATE TABLE objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- Versión del nombre amigable para URLs
    type TEXT DEFAULT 'custom' NOT NULL, -- 'standard' o 'custom'
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(workspace_id, slug)
);
COMMENT ON TABLE objects IS 'Define los tipos de registros que un workspace puede tener, ej: Compañías, Tratos, Proyectos.';

-- Tabla de Atributos para definir el esquema de cada objeto
CREATE TABLE attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_id UUID NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- Versión del nombre amigable para URLs
    type TEXT NOT NULL, -- ej: 'text', 'number', 'date', 'select', 'relation'
    source TEXT DEFAULT 'user' NOT NULL, -- 'system', 'enriched', o 'user'
    config JSONB, -- Para opciones de select, detalles de relación, etc.
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(object_id, slug)
);
COMMENT ON TABLE attributes IS 'Define las propiedades para cada Objeto, como las columnas en una hoja de cálculo.';

-- Tabla de Registros para las entradas de datos reales
CREATE TABLE records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_id UUID NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE records IS 'Una única entrada de datos, como una fila en una hoja de cálculo (ej: una compañía específica).';

-- Tabla de Valores de Registro para almacenar los valores de los atributos de cada registro
CREATE TABLE record_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    value JSONB
);
COMMENT ON TABLE record_values IS 'Almacena el valor real para un atributo específico de un registro específico.';


-- Habilitar RLS (Row Level Security) para todas las tablas
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_values ENABLE ROW LEVEL SECURITY;


-- Políticas RLS para asegurar que los usuarios solo accedan a los datos de su propio workspace
-- Los usuarios pueden ver los workspaces a los que pertenecen
CREATE POLICY "Allow read access to members" ON workspaces
FOR SELECT USING (id IN (SELECT workspace_id FROM workspace_users WHERE user_id = auth.uid()));

-- Los usuarios pueden ver y gestionar los miembros de los workspaces a los que pertenecen
CREATE POLICY "Allow full access to members" ON workspace_users
FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_users WHERE user_id = auth.uid()));

-- Políticas para el resto de las tablas, permitiendo acceso solo a miembros del workspace
CREATE POLICY "Allow access to workspace members" ON objects
FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_users WHERE user_id = auth.uid()));

CREATE POLICY "Allow access to workspace members" ON attributes
FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_users WHERE user_id = auth.uid()));

CREATE POLICY "Allow access to workspace members" ON records
FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_users WHERE user_id = auth.uid()));

CREATE POLICY "Allow access to workspace members" ON record_values
FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_users WHERE user_id = auth.uid()));

-- Trigger para crear un workspace para cada nuevo usuario y asignarlo como OWNER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Crear un nuevo workspace
  INSERT INTO public.workspaces (name)
  VALUES ('Mi Espacio de Trabajo') -- Puedes personalizar el nombre por defecto
  RETURNING id INTO new_workspace_id;

  -- Asignar el nuevo usuario al nuevo workspace como OWNER
  INSERT INTO public.workspace_users (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'OWNER');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger en la tabla de usuarios de Supabase
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 