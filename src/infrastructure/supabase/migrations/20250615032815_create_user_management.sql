
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE');

-- Create enum for company status
CREATE TYPE company_status AS ENUM ('ACTIVE', 'SUSPENDED', 'TRIAL', 'CANCELLED');

-- Create enum for subscription plans
CREATE TYPE subscription_plan AS ENUM ('STARTER', 'PROFESSIONAL', 'ENTERPRISE', 'CUSTOM');

-- Companies table (multi-tenant core)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  status company_status DEFAULT 'TRIAL',
  subscription_plan subscription_plan DEFAULT 'STARTER',
  max_users INTEGER DEFAULT 5,
  max_monthly_ai_requests INTEGER DEFAULT 1000,
  max_monthly_scraping_pages INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles with company association
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role user_role DEFAULT 'EMPLOYEE',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, company_id)
);

-- Company API keys (encrypted storage references)
CREATE TABLE company_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  service_name VARCHAR(50) NOT NULL, -- 'OPENAI', 'FIRECRAWL', 'RESEND'
  vault_secret_name VARCHAR(255) NOT NULL, -- Reference to Supabase Vault
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, service_name)
);

-- Usage tracking for billing
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  service_name VARCHAR(50) NOT NULL,
  usage_type VARCHAR(50) NOT NULL, -- 'AI_TOKENS', 'SCRAPING_PAGES', 'STORAGE_MB'
  amount DECIMAL(15,4) NOT NULL,
  cost_usd DECIMAL(10,4),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly billing summaries
CREATE TABLE monthly_billing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  billing_month DATE NOT NULL, -- First day of the month
  total_cost_usd DECIMAL(12,2) DEFAULT 0,
  ai_tokens_used BIGINT DEFAULT 0,
  scraping_pages_used INTEGER DEFAULT 0,
  storage_mb_used DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'INVOICED', 'PAID'
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, billing_month)
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_billing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (
    id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Company owners can update their company" ON companies
  FOR UPDATE USING (
    id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view profiles in their company" ON user_profiles
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage users in their company" ON user_profiles
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- RLS Policies for company_api_keys
CREATE POLICY "Company admins can manage API keys" ON company_api_keys
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- RLS Policies for usage_tracking
CREATE POLICY "Users can view usage in their company" ON usage_tracking
  FOR SELECT USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "System can insert usage tracking" ON usage_tracking
  FOR INSERT WITH CHECK (true);

-- RLS Policies for monthly_billing
CREATE POLICY "Company admins can view billing" ON monthly_billing
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_name TEXT;
  company_slug TEXT;
  new_company_id UUID;
BEGIN
  -- Extract company name from email domain or use default
  company_name := COALESCE(
    NEW.raw_user_meta_data->>'company_name',
    split_part(NEW.email, '@', 2)
  );
  
  -- Generate unique slug
  company_slug := LOWER(REPLACE(company_name, ' ', '-')) || '-' || substring(NEW.id::text, 1, 8);
  
  -- Create company if it doesn't exist
  INSERT INTO companies (name, slug) 
  VALUES (company_name, company_slug)
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO new_company_id;
  
  -- If company already exists, get its ID
  IF new_company_id IS NULL THEN
    SELECT id INTO new_company_id FROM companies WHERE slug = company_slug;
  END IF;
  
  -- Create user profile
  INSERT INTO user_profiles (
    id, 
    company_id, 
    email, 
    full_name, 
    role
  ) VALUES (
    NEW.id,
    new_company_id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'OWNER' -- First user becomes owner
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to track usage
CREATE OR REPLACE FUNCTION track_usage(
  p_company_id UUID,
  p_user_id UUID,
  p_service_name TEXT,
  p_usage_type TEXT,
  p_amount DECIMAL,
  p_cost_usd DECIMAL DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  usage_id UUID;
BEGIN
  INSERT INTO usage_tracking (
    company_id,
    user_id,
    service_name,
    usage_type,
    amount,
    cost_usd,
    metadata
  ) VALUES (
    p_company_id,
    p_user_id,
    p_service_name,
    p_usage_type,
    p_amount,
    p_cost_usd,
    p_metadata
  ) RETURNING id INTO usage_id;
  
  RETURN usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create performance indexes (fixed version)
CREATE INDEX idx_user_profiles_company_id ON user_profiles(company_id);
CREATE INDEX idx_usage_tracking_company ON usage_tracking(company_id);
CREATE INDEX idx_usage_tracking_service ON usage_tracking(service_name, created_at);
CREATE INDEX idx_company_api_keys_company_service ON company_api_keys(company_id, service_name);
CREATE INDEX idx_usage_tracking_created_at ON usage_tracking(created_at);
