-- Migration: Create VibeThink Team Users
-- Description: Creates the internal VibeThink team users for testing and platform management
-- Author: VibeThink Platform
-- Version: 1.0.0

-- First, ensure we have the VibeThink platform company
INSERT INTO companies (
  id,
  name,
  slug,
  status,
  subscription_plan,
  max_users,
  max_monthly_ai_requests,
  max_monthly_scraping_pages,
  domain,
  created_at,
  updated_at
) VALUES (
  '111e1111-e11b-11d1-a111-111111111111',
  'VibeThink Platform',
  'vibethink-platform',
  'ACTIVE',
  'ENTERPRISE',
  1000,
  1000000,
  100000,
  'vibethink.co',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  domain = EXCLUDED.domain,
  updated_at = NOW();

-- Create VibeThink team user profiles
-- Note: The actual auth.users entries need to be created through Supabase Auth
-- These profiles will be linked when users sign in

-- SUPER_ADMIN user
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  company_id,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'superadmin@vibethink.co',
  'Super Administrator',
  'ADMIN', -- We'll handle SUPER_ADMIN logic in code since it's not in the enum
  '111e1111-e11b-11d1-a111-111111111111',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_id = EXCLUDED.company_id,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ADMIN user (without super powers)
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  company_id,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'admin@vibethink.co',
  'Platform Administrator',
  'ADMIN',
  '111e1111-e11b-11d1-a111-111111111111',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_id = EXCLUDED.company_id,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- MANAGER user
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  company_id,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'manager@vibethink.co',
  'Team Manager',
  'MANAGER',
  '111e1111-e11b-11d1-a111-111111111111',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_id = EXCLUDED.company_id,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- EMPLOYEE user
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  company_id,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000004',
  'employee@vibethink.co',
  'Internal Employee',
  'EMPLOYEE',
  '111e1111-e11b-11d1-a111-111111111111',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_id = EXCLUDED.company_id,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- SUPPORT user
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  company_id,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000005',
  'support@vibethink.co',
  'Technical Support',
  'SUPPORT',
  '111e1111-e11b-11d1-a111-111111111111',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_id = EXCLUDED.company_id,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Create example client company users for testing
INSERT INTO companies (
  id,
  name,
  slug,
  status,
  subscription_plan,
  max_users,
  max_monthly_ai_requests,
  max_monthly_scraping_pages,
  created_at,
  updated_at
) VALUES (
  '222e2222-e22b-22d2-a222-222222222222',
  'Example Company Inc',
  'example-company',
  'ACTIVE',
  'PROFESSIONAL',
  25,
  10000,
  1000,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

-- Client company ADMIN
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  company_id,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000011',
  'admin@company.com',
  'Company Administrator',
  'ADMIN',
  '222e2222-e22b-22d2-a222-222222222222',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_id = EXCLUDED.company_id,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Client company MANAGER
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  company_id,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000012',
  'manager@company.com',
  'Company Manager',
  'MANAGER',
  '222e2222-e22b-22d2-a222-222222222222',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_id = EXCLUDED.company_id,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Client company EMPLOYEE
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  company_id,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000013',
  'user@company.com',
  'Company Employee',
  'EMPLOYEE',
  '222e2222-e22b-22d2-a222-222222222222',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_id = EXCLUDED.company_id,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Log the migration
SELECT 'AI Pair team users created successfully' as migration_status; 