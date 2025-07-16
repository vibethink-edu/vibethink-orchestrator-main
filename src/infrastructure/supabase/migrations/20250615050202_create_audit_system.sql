-- Agregar políticas RLS para que Super Admins puedan ver todas las empresas
CREATE POLICY "Super admins can view all companies" ON companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND email IN ('admin@vibethink.com', 'superadmin@vibethink.com', 'root@vibethink.com')
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'OWNER' 
      AND company_id IN (
        SELECT id FROM companies WHERE slug = 'vibethink-platform'
      )
    )
  );

-- Política para que Super Admins puedan ver todos los perfiles de usuario
CREATE POLICY "Super admins can view all user profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.email IN ('admin@vibethink.com', 'superadmin@vibethink.com', 'root@vibethink.com')
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role = 'OWNER' 
      AND up.company_id IN (
        SELECT id FROM companies WHERE slug = 'vibethink-platform'
      )
    )
  );

-- Crear algunas empresas de ejemplo para testing
INSERT INTO companies (name, slug, status, subscription_plan, max_users, max_monthly_ai_requests, max_monthly_scraping_pages) VALUES
('Demo Company 1', 'demo-company-1', 'ACTIVE', 'PROFESSIONAL', 25, 10000, 1000),
('Test Corp', 'test-corp', 'TRIAL', 'STARTER', 5, 1000, 100),
('Enterprise Solutions', 'enterprise-solutions', 'ACTIVE', 'ENTERPRISE', 100, 50000, 5000),
('Startup Inc', 'startup-inc', 'SUSPENDED', 'STARTER', 5, 1000, 100)
ON CONFLICT (slug) DO NOTHING;

-- Asegurarse de que las empresas tengan referencias a plan_definitions
UPDATE companies SET plan_definition_id = (
  SELECT id FROM plan_definitions 
  WHERE name = companies.subscription_plan::text
) WHERE plan_definition_id IS NULL;

-- Deshabilitar temporalmente el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear el primer usuario manualmente
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    role
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'superadmin@vibethink.co',
    crypt('12345', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Super Administrator"}',
    'authenticated'
);
