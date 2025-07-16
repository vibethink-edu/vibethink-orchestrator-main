-- Create enum types
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'OWNER');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'inactive');
CREATE TYPE interaction_type AS ENUM ('CRM', 'Email', 'Calendar');

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'EMPLOYEE',
  department VARCHAR(255),
  status user_status NOT NULL DEFAULT 'active',
  last_activity TIMESTAMP WITH TIME ZONE,
  monthly_usage INTEGER DEFAULT 0,
  avatar_url TEXT,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interactions table
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type interaction_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX users_company_id_idx ON users(company_id);
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_role_idx ON users(role);
CREATE INDEX interactions_company_id_idx ON interactions(company_id);
CREATE INDEX interactions_user_id_idx ON interactions(user_id);
CREATE INDEX interactions_created_at_idx ON interactions(created_at);

-- Add RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own company's users"
  ON users FOR SELECT
  USING (company_id = auth.jwt() -> 'company_id'::text::uuid);

CREATE POLICY "Admins can insert users in their company"
  ON users FOR INSERT
  WITH CHECK (
    company_id = auth.jwt() -> 'company_id'::text::uuid
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'OWNER')
    )
  );

CREATE POLICY "Admins can update users in their company"
  ON users FOR UPDATE
  USING (
    company_id = auth.jwt() -> 'company_id'::text::uuid
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'OWNER')
    )
  );

CREATE POLICY "Admins can delete users in their company"
  ON users FOR DELETE
  USING (
    company_id = auth.jwt() -> 'company_id'::text::uuid
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'OWNER')
    )
  );

-- Interactions policies
CREATE POLICY "Users can view their company's interactions"
  ON interactions FOR SELECT
  USING (company_id = auth.jwt() -> 'company_id'::text::uuid);

CREATE POLICY "Users can insert interactions in their company"
  ON interactions FOR INSERT
  WITH CHECK (company_id = auth.jwt() -> 'company_id'::text::uuid);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interactions_updated_at
  BEFORE UPDATE ON interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 