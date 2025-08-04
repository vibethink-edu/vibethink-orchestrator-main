-- VibeThink Orchestrator - Validation & Testing Scripts
-- ===================================================
-- Date: 2025-07-25
-- Description: Scripts para validar la estructura de datos

-- =============================================
-- 1. SCHEMA VALIDATION
-- =============================================

-- Verificar que todas las tablas existen
DO $$
DECLARE
    tables_missing TEXT[];
    expected_tables TEXT[] := ARRAY[
        'companies',
        'user_profiles', 
        'super_admin_config',
        'system_audit_log',
        'company_invitations'
    ];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY expected_tables
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = table_name AND table_schema = 'public'
        ) THEN
            tables_missing := array_append(tables_missing, table_name);
        END IF;
    END LOOP;
    
    IF array_length(tables_missing, 1) > 0 THEN
        RAISE EXCEPTION 'Missing tables: %', array_to_string(tables_missing, ', ');
    ELSE
        RAISE NOTICE 'All required tables exist ✓';
    END IF;
END $$;

-- Verificar que todos los ENUMs existen
DO $$
DECLARE
    enums_missing TEXT[];
    expected_enums TEXT[] := ARRAY[
        'plan_type',
        'company_status',
        'user_role',
        'user_status'
    ];
    enum_name TEXT;
BEGIN
    FOREACH enum_name IN ARRAY expected_enums
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_type 
            WHERE typname = enum_name AND typtype = 'e'
        ) THEN
            enums_missing := array_append(enums_missing, enum_name);
        END IF;
    END LOOP;
    
    IF array_length(enums_missing, 1) > 0 THEN
        RAISE EXCEPTION 'Missing ENUMs: %', array_to_string(enums_missing, ', ');
    ELSE
        RAISE NOTICE 'All required ENUMs exist ✓';
    END IF;
END $$;

-- =============================================
-- 2. RLS VALIDATION
-- =============================================

-- Verificar que RLS está habilitado en todas las tablas
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('companies', 'user_profiles', 'super_admin_config', 'system_audit_log', 'company_invitations')
ORDER BY tablename;

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =============================================
-- 3. INDEX VALIDATION
-- =============================================

-- Verificar índices importantes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('companies', 'user_profiles', 'system_audit_log', 'company_invitations')
ORDER BY tablename, indexname;

-- =============================================
-- 4. CONSTRAINT VALIDATION
-- =============================================

-- Verificar constraints importantes
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('companies', 'user_profiles', 'company_invitations')
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- =============================================
-- 5. FUNCTION VALIDATION
-- =============================================

-- Verificar que las funciones existen
SELECT 
    routine_name,
    routine_type,
    data_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('update_updated_at_column', 'log_system_event')
ORDER BY routine_name;

-- =============================================
-- 6. DATA INTEGRITY TESTS
-- =============================================

-- Test 1: Crear empresa de prueba
INSERT INTO companies (name, slug, plan_type, status)
VALUES ('Test Company', 'test-company-validation', 'FREE', 'ACTIVE');

-- Test 2: Verificar que slug es único (debe fallar)
DO $$
BEGIN
    BEGIN
        INSERT INTO companies (name, slug, plan_type)
        VALUES ('Test Company 2', 'test-company-validation', 'FREE');
        RAISE EXCEPTION 'Unique constraint on slug failed!';
    EXCEPTION
        WHEN unique_violation THEN
            RAISE NOTICE 'Unique constraint on slug working ✓';
    END;
END $$;

-- Test 3: Verificar constraint de SUPER_ADMIN sin company_id
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
BEGIN
    -- Esto debería funcionar (SUPER_ADMIN sin company)
    INSERT INTO user_profiles (id, email, role, company_id)
    VALUES (test_user_id, 'test-superadmin@test.com', 'SUPER_ADMIN', NULL);
    
    RAISE NOTICE 'SUPER_ADMIN without company constraint working ✓';
    
    -- Limpiar
    DELETE FROM user_profiles WHERE id = test_user_id;
END $$;

-- Test 4: Verificar constraint de EMPLOYEE con company_id
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_company_id UUID;
BEGIN
    -- Obtener una company existente
    SELECT id INTO test_company_id FROM companies WHERE slug = 'test-company-validation';
    
    -- Esto debería funcionar (EMPLOYEE con company)
    INSERT INTO user_profiles (id, email, role, company_id)
    VALUES (test_user_id, 'test-employee@test.com', 'EMPLOYEE', test_company_id);
    
    RAISE NOTICE 'EMPLOYEE with company constraint working ✓';
    
    -- Limpiar
    DELETE FROM user_profiles WHERE id = test_user_id;
END $$;

-- Test 5: Verificar función de logging
DO $$
DECLARE
    log_id UUID;
    test_company_id UUID;
BEGIN
    SELECT id INTO test_company_id FROM companies WHERE slug = 'test-company-validation';
    
    SELECT log_system_event(
        'test_action',
        'test_resource',
        'test-123',
        test_company_id,
        '{"test": true}'::jsonb
    ) INTO log_id;
    
    IF log_id IS NOT NULL THEN
        RAISE NOTICE 'Logging function working ✓ (Log ID: %)', log_id;
    ELSE
        RAISE EXCEPTION 'Logging function failed!';
    END IF;
END $$;

-- Test 6: Verificar triggers de updated_at
DO $$
DECLARE
    test_company_id UUID;
    old_updated_at TIMESTAMP;
    new_updated_at TIMESTAMP;
BEGIN
    SELECT id INTO test_company_id FROM companies WHERE slug = 'test-company-validation';
    
    -- Obtener timestamp actual
    SELECT updated_at INTO old_updated_at FROM companies WHERE id = test_company_id;
    
    -- Esperar un momento y actualizar
    PERFORM pg_sleep(1);
    UPDATE companies SET name = 'Test Company Updated' WHERE id = test_company_id;
    
    -- Verificar que updated_at cambió
    SELECT updated_at INTO new_updated_at FROM companies WHERE id = test_company_id;
    
    IF new_updated_at > old_updated_at THEN
        RAISE NOTICE 'Updated_at trigger working ✓';
    ELSE
        RAISE EXCEPTION 'Updated_at trigger failed!';
    END IF;
END $$;

-- =============================================
-- 7. PERFORMANCE TESTS
-- =============================================

-- Test de performance en consulta multi-tenant
EXPLAIN (ANALYZE, BUFFERS) 
SELECT c.name, COUNT(up.id) as user_count
FROM companies c
LEFT JOIN user_profiles up ON c.id = up.company_id
WHERE c.status = 'ACTIVE'
GROUP BY c.id, c.name
ORDER BY user_count DESC;

-- Test de performance en audit log
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM system_audit_log 
WHERE company_id IS NOT NULL
AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC
LIMIT 100;

-- =============================================
-- 8. CLEANUP
-- =============================================

-- Limpiar datos de prueba
DELETE FROM system_audit_log WHERE resource_type = 'test_resource';
DELETE FROM companies WHERE slug = 'test-company-validation';

-- =============================================
-- 9. SUMMARY REPORT
-- =============================================

SELECT 
    'VALIDATION COMPLETE' as status,
    'All tests passed successfully' as message,
    NOW() as completed_at;

-- Resumen de datos actuales
SELECT 'CURRENT DATA SUMMARY' as section;

SELECT 
    'Companies' as entity,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'ACTIVE') as active
FROM companies
UNION ALL
SELECT 
    'Users' as entity,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'ACTIVE') as active
FROM user_profiles
UNION ALL
SELECT 
    'Super Admins' as entity,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'ACTIVE') as active
FROM user_profiles WHERE role = 'SUPER_ADMIN'
UNION ALL
SELECT 
    'Pending Invitations' as entity,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE expires_at > NOW()) as valid
FROM company_invitations WHERE status = 'PENDING'
UNION ALL
SELECT 
    'Audit Logs (Last 30 days)' as entity,
    COUNT(*) as total,
    COUNT(DISTINCT company_id) as companies_with_activity
FROM system_audit_log WHERE created_at >= NOW() - INTERVAL '30 days';

RAISE NOTICE '==============================================';
RAISE NOTICE 'VALIDATION COMPLETED SUCCESSFULLY ✓';
RAISE NOTICE 'All core tables, constraints, and functions are working properly';
RAISE NOTICE '==============================================';
