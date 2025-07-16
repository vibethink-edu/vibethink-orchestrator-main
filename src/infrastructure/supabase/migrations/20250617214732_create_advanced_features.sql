
-- Función para obtener el nombre completo del rol en inglés
CREATE OR REPLACE FUNCTION get_role_display_name(role_name user_role, language_code text DEFAULT 'en')
RETURNS text
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  CASE role_name
    WHEN 'OWNER' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Propietario'
        ELSE 'Owner'
      END;
    WHEN 'ADMIN' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Administrador'
        ELSE 'Admin'
      END;
    WHEN 'MANAGER' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Manager'
        ELSE 'Manager'
      END;
    WHEN 'EMPLOYEE' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Empleado'
        ELSE 'Employee'
      END;
    WHEN 'SUPPORT' THEN 
      RETURN CASE language_code 
        WHEN 'es' THEN 'Soporte'
        ELSE 'Support'
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
  IF manager_role = 'OWNER' AND manager_company_id = (SELECT id FROM companies WHERE slug = 'vibethink-platform' LIMIT 1) THEN
    RETURN true;
  END IF;
  
  -- Deben estar en la misma empresa
  IF manager_company_id != target_company_id THEN
    RETURN false;
  END IF;
  
  -- Jerarquía de roles (de mayor a menor): OWNER > ADMIN > MANAGER > EMPLOYEE/SUPPORT
  CASE manager_role
    WHEN 'OWNER' THEN 
      RETURN target_role IN ('ADMIN', 'MANAGER', 'EMPLOYEE', 'SUPPORT');
    WHEN 'ADMIN' THEN 
      RETURN target_role IN ('MANAGER', 'EMPLOYEE', 'SUPPORT');
    WHEN 'MANAGER' THEN 
      RETURN target_role IN ('EMPLOYEE', 'SUPPORT');
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
    COUNT(*) FILTER (WHERE role = 'OWNER') as owners_count,
    COUNT(*) FILTER (WHERE role = 'ADMIN') as admins_count,
    COUNT(*) FILTER (WHERE role = 'MANAGER') as managers_count,
    COUNT(*) FILTER (WHERE role = 'EMPLOYEE') as employees_count,
    COUNT(*) FILTER (WHERE role = 'SUPPORT') as support_count
  FROM user_profiles 
  WHERE company_id = p_company_id;
END;
$$;
