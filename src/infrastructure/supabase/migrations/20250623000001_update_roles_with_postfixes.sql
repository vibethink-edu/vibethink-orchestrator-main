-- Migración: Actualización de Roles con Postfijos _VT y _CUST
-- Fecha: 2025-01-24
-- Descripción: Actualiza el sistema de roles para usar postfijos _VT (VThink) y _CUST (Customer)

-- 1. Crear el nuevo tipo enum con postfijos
CREATE TYPE user_role_new AS ENUM (
  -- Roles de AI Pair Interno (_VT)
  'SUPER_ADMIN_VT',
  'SUPPORT_VT', 
  'DEVELOPER_VT',
  'MANAGER_VT',
  'EMPLOYEE_VT',
  -- Roles de Empresa Cliente (_CUST)
  'OWNER_CUST',
  'ADMIN_CUST',
  'MANAGER_CUST',
  'EMPLOYEE_CUST'
);

-- 2. Crear función para migrar roles existentes
CREATE OR REPLACE FUNCTION migrate_user_roles()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Migrar roles existentes a nuevos roles con postfijos
  UPDATE user_profiles 
  SET role = CASE 
    WHEN role = 'SUPER_ADMIN' THEN 'SUPER_ADMIN_VT'::user_role_new
    WHEN role = 'SUPPORT' THEN 'SUPPORT_VT'::user_role_new
    WHEN role = 'OWNER' THEN 'OWNER_CUST'::user_role_new
    WHEN role = 'ADMIN' THEN 'ADMIN_CUST'::user_role_new
    WHEN role = 'MANAGER' THEN 'MANAGER_CUST'::user_role_new
    WHEN role = 'EMPLOYEE' THEN 'EMPLOYEE_CUST'::user_role_new
    ELSE 'EMPLOYEE_CUST'::user_role_new  -- Default fallback
  END
  WHERE role IN ('SUPER_ADMIN', 'SUPPORT', 'OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE');
  
  -- Log de migración
  INSERT INTO audit_log (
    event_type, 
    entity_type, 
    entity_id, 
    user_id, 
    company_id, 
    event_data
  ) VALUES (
    'migration',
    'system',
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    jsonb_build_object(
      'migration_type', 'roles_postfix_update',
      'old_roles', ARRAY['SUPER_ADMIN', 'SUPPORT', 'OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE'],
      'new_roles', ARRAY['SUPER_ADMIN_VT', 'SUPPORT_VT', 'OWNER_CUST', 'ADMIN_CUST', 'MANAGER_CUST', 'EMPLOYEE_CUST'],
      'migrated_at', now()
    )
  );
END;
$$;

-- 3. Ejecutar migración
SELECT migrate_user_roles();

-- 4. Actualizar la columna role para usar el nuevo tipo
ALTER TABLE user_profiles 
  ALTER COLUMN role TYPE user_role_new 
  USING role::user_role_new;

-- 5. Eliminar el tipo enum antiguo
DROP TYPE user_role;

-- 6. Renombrar el nuevo tipo
ALTER TYPE user_role_new RENAME TO user_role;

-- 7. Actualizar funciones de base de datos

-- Función para obtener el nombre completo del rol en inglés
CREATE OR REPLACE FUNCTION get_role_display_name(role_name user_role, language_code text DEFAULT 'en')
RETURNS text
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  CASE role_name
    -- AI Pair Roles (_VT)
    WHEN 'SUPER_ADMIN_VT' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Super Admin AI Pair'
        ELSE 'Super Admin AI Pair'
      END;
    WHEN 'SUPPORT_VT' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Soporte AI Pair'
        ELSE 'Support AI Pair'
      END;
    WHEN 'DEVELOPER_VT' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Desarrollador AI Pair'
        ELSE 'Developer AI Pair'
      END;
    WHEN 'MANAGER_VT' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Manager AI Pair'
        ELSE 'Manager AI Pair'
      END;
    WHEN 'EMPLOYEE_VT' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Empleado AI Pair'
        ELSE 'Employee AI Pair'
      END;
    -- Customer Roles (_CUST)
    WHEN 'OWNER_CUST' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Propietario'
        ELSE 'Owner'
      END;
    WHEN 'ADMIN_CUST' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Administrador'
        ELSE 'Administrator'
      END;
    WHEN 'MANAGER_CUST' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Manager'
        ELSE 'Manager'
      END;
    WHEN 'EMPLOYEE_CUST' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Empleado'
        ELSE 'Employee'
      END;
    ELSE 
      RETURN role_name::text;
  END CASE;
END;
$$;

-- Función para verificar si un usuario puede gestionar otro usuario
CREATE OR REPLACE FUNCTION can_manage_user(manager_user_id uuid, target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  manager_role user_role;
  target_role user_role;
  manager_company_id uuid;
  target_company_id uuid;
BEGIN
  -- Obtener datos del manager
  SELECT role, company_id INTO manager_role, manager_company_id
  FROM user_profiles 
  WHERE id = manager_user_id;
  
  -- Obtener datos del usuario objetivo
  SELECT role, company_id INTO target_role, target_company_id
  FROM user_profiles 
  WHERE id = target_user_id;
  
  -- Si alguno no existe, no se puede gestionar
  IF manager_role IS NULL OR target_role IS NULL THEN
    RETURN false;
  END IF;
  
  -- Los super admins pueden gestionar a cualquiera
  IF manager_role = 'SUPER_ADMIN_VT' THEN
    RETURN true;
  END IF;
  
  -- Deben estar en la misma empresa
  IF manager_company_id != target_company_id THEN
    RETURN false;
  END IF;
  
  -- Jerarquía de roles (de mayor a menor)
  CASE manager_role
    WHEN 'OWNER_CUST' THEN 
      RETURN target_role IN ('ADMIN_CUST', 'MANAGER_CUST', 'EMPLOYEE_CUST');
    WHEN 'ADMIN_CUST' THEN 
      RETURN target_role IN ('MANAGER_CUST', 'EMPLOYEE_CUST');
    WHEN 'MANAGER_CUST' THEN 
      RETURN target_role IN ('EMPLOYEE_CUST');
    WHEN 'MANAGER_VT' THEN 
      RETURN target_role IN ('EMPLOYEE_VT');
    ELSE 
      RETURN false;
  END CASE;
END;
$$;

-- Función para obtener estadísticas de usuarios por empresa
CREATE OR REPLACE FUNCTION get_company_user_stats(p_company_id uuid)
RETURNS TABLE(
  total_users bigint,
  active_users bigint,
  inactive_users bigint,
  owners_count bigint,
  admins_count bigint,
  managers_count bigint,
  employees_count bigint,
  support_count bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE is_active = true) as active_users,
    COUNT(*) FILTER (WHERE is_active = false) as inactive_users,
    COUNT(*) FILTER (WHERE role = 'OWNER_CUST') as owners_count,
    COUNT(*) FILTER (WHERE role = 'ADMIN_CUST') as admins_count,
    COUNT(*) FILTER (WHERE role = 'MANAGER_CUST') as managers_count,
    COUNT(*) FILTER (WHERE role = 'EMPLOYEE_CUST') as employees_count,
    COUNT(*) FILTER (WHERE role = 'SUPPORT_VT') as support_count
  FROM user_profiles 
  WHERE company_id = p_company_id;
END;
$$;

-- 8. Actualizar políticas RLS para nuevos roles

-- Política para que Super Admins puedan ver todas las empresas
DROP POLICY IF EXISTS "Super admins can view all companies" ON companies;
CREATE POLICY "Super admins can view all companies" ON companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'SUPER_ADMIN_VT'
    )
  );

-- Política para que Support pueda ver empresas para asistencia
DROP POLICY IF EXISTS "Support can view companies for assistance" ON companies;
CREATE POLICY "Support can view companies for assistance" ON companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN companies c ON up.company_id = c.id
      WHERE up.id = auth.uid() 
      AND up.role = 'SUPPORT_VT'
      AND c.slug = 'vibethink-platform'
    )
  );

-- Política para usuarios regulares (solo su empresa)
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (
    id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
  );

-- 9. Crear índices para optimizar consultas por rol
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_role ON user_profiles(company_id, role);

-- 10. Limpiar función de migración
DROP FUNCTION IF EXISTS migrate_user_roles();

-- 11. Log de finalización
INSERT INTO audit_log (
  event_type, 
  entity_type, 
  entity_id, 
  user_id, 
  company_id, 
  event_data
) VALUES (
  'migration_complete',
  'system',
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  jsonb_build_object(
    'migration_type', 'roles_postfix_update',
    'status', 'completed',
    'completed_at', now(),
    'new_role_structure', jsonb_build_object(
      'ai_pair_roles', ARRAY['SUPER_ADMIN_VT', 'SUPPORT_VT', 'DEVELOPER_VT', 'MANAGER_VT', 'EMPLOYEE_VT'],
      'customer_roles', ARRAY['OWNER_CUST', 'ADMIN_CUST', 'MANAGER_CUST', 'EMPLOYEE_CUST']
    )
  )
); 