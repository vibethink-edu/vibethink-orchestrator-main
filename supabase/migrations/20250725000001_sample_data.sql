-- VibeThink Orchestrator - Sample Data & Test Scripts
-- ================================================
-- Date: 2025-07-25
-- Description: Scripts de ejemplo para testing y desarrollo

-- =============================================
-- 1. SAMPLE COMPANIES
-- =============================================

-- Empresa de prueba 1
INSERT INTO companies (
    name, 
    slug, 
    industry,
    size_category,
    plan_type,
    country_code,
    timezone,
    billing_email
) VALUES (
    'TechCorp Solutions',
    'techcorp-solutions',
    'Technology',
    'MEDIUM',
    'PRO',
    'US',
    'America/New_York',
    'billing@techcorp.com'
);

-- Empresa de prueba 2 
INSERT INTO companies (
    name,
    slug,
    industry, 
    size_category,
    plan_type,
    country_code,
    timezone,
    billing_email
) VALUES (
    'Marketing Plus',
    'marketing-plus',
    'Marketing',
    'SMALL',
    'BASIC',
    'ES',
    'Europe/Madrid',
    'facturacion@marketingplus.es'
);

-- Empresa de prueba 3 (FREE plan)
INSERT INTO companies (
    name,
    slug,
    industry,
    size_category,
    plan_type,
    country_code,
    timezone
) VALUES (
    'Startup Innovation',
    'startup-innovation',
    'SaaS',
    'STARTUP',
    'FREE',
    'CO',
    'America/Bogota'
);

-- =============================================
-- 2. SAMPLE USERS
-- =============================================

-- Super Admin (sin empresa)
-- Nota: Este usuario debe existir en auth.users primero
INSERT INTO user_profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    company_id,
    role,
    status
) VALUES (
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'::uuid, -- Reemplazar con ID real
    'superadmin@vibethink.com',
    'Super Administrator',
    'Super',
    'Administrator',
    NULL,
    'SUPER_ADMIN',
    'ACTIVE'
);

-- Company Owner para TechCorp
INSERT INTO user_profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    company_id,
    role,
    department,
    position,
    status
) VALUES (
    'bbbbbbbb-cccc-dddd-eeee-ffffffffffff'::uuid, -- Reemplazar con ID real
    'owner@techcorp.com',
    'John Smith',
    'John',
    'Smith',
    (SELECT id FROM companies WHERE slug = 'techcorp-solutions'),
    'COMPANY_OWNER',
    'Executive',
    'CEO',
    'ACTIVE'
);

-- Company Admin para TechCorp
INSERT INTO user_profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    company_id,
    role,
    department,
    position,
    manager_id,
    status
) VALUES (
    'cccccccc-dddd-eeee-ffff-aaaaaaaaaaaa'::uuid,
    'admin@techcorp.com',
    'Jane Doe',
    'Jane',
    'Doe',
    (SELECT id FROM companies WHERE slug = 'techcorp-solutions'),
    'COMPANY_ADMIN',
    'IT',
    'CTO',
    (SELECT id FROM user_profiles WHERE email = 'owner@techcorp.com'),
    'ACTIVE'
);

-- Manager para TechCorp
INSERT INTO user_profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    company_id,
    role,
    department,
    position,
    manager_id,
    status
) VALUES (
    'dddddddd-eeee-ffff-aaaa-bbbbbbbbbbbb'::uuid,
    'manager@techcorp.com',
    'Mike Johnson',
    'Mike',
    'Johnson',
    (SELECT id FROM companies WHERE slug = 'techcorp-solutions'),
    'MANAGER',
    'Development',
    'Development Manager',
    (SELECT id FROM user_profiles WHERE email = 'admin@techcorp.com'),
    'ACTIVE'
);

-- Employee para TechCorp
INSERT INTO user_profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    company_id,
    role,
    department,
    position,
    manager_id,
    status
) VALUES (
    'eeeeeeee-ffff-aaaa-bbbb-cccccccccccc'::uuid,
    'developer@techcorp.com',
    'Sarah Wilson',
    'Sarah',
    'Wilson',
    (SELECT id FROM companies WHERE slug = 'techcorp-solutions'),
    'EMPLOYEE',
    'Development',
    'Senior Developer',
    (SELECT id FROM user_profiles WHERE email = 'manager@techcorp.com'),
    'ACTIVE'
);

-- =============================================
-- 3. SAMPLE INVITATIONS
-- =============================================

INSERT INTO company_invitations (
    company_id,
    email,
    role,
    department,
    invited_by,
    token,
    expires_at
) VALUES (
    (SELECT id FROM companies WHERE slug = 'techcorp-solutions'),
    'newdev@techcorp.com',
    'EMPLOYEE',
    'Development',
    (SELECT id FROM user_profiles WHERE email = 'manager@techcorp.com'),
    'inv_' || encode(gen_random_bytes(16), 'hex'),
    NOW() + INTERVAL '7 days'
);

-- =============================================
-- 4. SAMPLE AUDIT LOGS
-- =============================================

-- Log de creación de empresa
SELECT log_system_event(
    'company_created',
    'company',
    (SELECT id::text FROM companies WHERE slug = 'techcorp-solutions'),
    (SELECT id FROM companies WHERE slug = 'techcorp-solutions'),
    '{"plan_type": "PRO", "industry": "Technology"}'::jsonb
);

-- Log de creación de usuario
SELECT log_system_event(
    'user_created',
    'user_profile',
    (SELECT id::text FROM user_profiles WHERE email = 'developer@techcorp.com'),
    (SELECT company_id FROM user_profiles WHERE email = 'developer@techcorp.com'),
    '{"role": "EMPLOYEE", "department": "Development"}'::jsonb
);

-- =============================================
-- 5. SAMPLE SUPER ADMIN CONFIG
-- =============================================

-- Configuraciones adicionales
INSERT INTO super_admin_config (config_key, config_value, description, is_public) VALUES
    ('email_verification_required', 'true', 'Requiere verificación de email para nuevos usuarios', false),
    ('max_login_attempts', '5', 'Máximo número de intentos de login antes de bloqueo temporal', false),
    ('session_timeout_hours', '24', 'Tiempo de expiración de sesión en horas', false),
    ('backup_retention_days', '30', 'Días de retención de backups automáticos', false),
    ('support_email', '"support@vibethink.com"', 'Email de soporte técnico', true),
    ('terms_of_service_url', '"https://vibethink.com/terms"', 'URL de términos de servicio', true),
    ('privacy_policy_url', '"https://vibethink.com/privacy"', 'URL de política de privacidad', true);

-- =============================================
-- 6. USEFUL QUERIES FOR TESTING
-- =============================================

-- Ver todas las empresas con conteo de usuarios
SELECT 
    c.name,
    c.slug,
    c.plan_type,
    c.status,
    COUNT(up.id) as user_count,
    c.created_at
FROM companies c
LEFT JOIN user_profiles up ON c.id = up.company_id
GROUP BY c.id, c.name, c.slug, c.plan_type, c.status, c.created_at
ORDER BY c.created_at DESC;

-- Ver jerarquía de usuarios en una empresa
WITH RECURSIVE user_hierarchy AS (
    -- Usuarios sin manager (top level)
    SELECT 
        id,
        email,
        full_name,
        role,
        department,
        manager_id,
        0 as level,
        full_name as hierarchy_path
    FROM user_profiles 
    WHERE company_id = (SELECT id FROM companies WHERE slug = 'techcorp-solutions')
    AND manager_id IS NULL
    
    UNION ALL
    
    -- Usuarios con manager (recursive)
    SELECT 
        up.id,
        up.email,
        up.full_name,
        up.role,
        up.department,
        up.manager_id,
        uh.level + 1,
        uh.hierarchy_path || ' > ' || up.full_name
    FROM user_profiles up
    INNER JOIN user_hierarchy uh ON up.manager_id = uh.id
)
SELECT 
    level,
    REPEAT('  ', level) || full_name as indented_name,
    email,
    role,
    department
FROM user_hierarchy
ORDER BY hierarchy_path;

-- Ver invitaciones pendientes por empresa
SELECT 
    c.name as company_name,
    ci.email,
    ci.role,
    ci.department,
    up.full_name as invited_by,
    ci.created_at,
    ci.expires_at,
    ci.status
FROM company_invitations ci
JOIN companies c ON ci.company_id = c.id
LEFT JOIN user_profiles up ON ci.invited_by = up.id
WHERE ci.status = 'PENDING'
ORDER BY ci.created_at DESC;

-- Ver logs de auditoría recientes
SELECT 
    sal.created_at,
    up.email as actor_email,
    c.name as company_name,
    sal.action,
    sal.resource_type,
    sal.event_data
FROM system_audit_log sal
LEFT JOIN user_profiles up ON sal.actor_id = up.id
LEFT JOIN companies c ON sal.company_id = c.id
ORDER BY sal.created_at DESC
LIMIT 20;

-- Ver configuraciones públicas del sistema
SELECT 
    config_key,
    config_value,
    description
FROM super_admin_config
WHERE is_public = true
ORDER BY config_key;
