-- VibeThink 1.0 - Schema Inicial
-- =============================

-- Companies Table (Multi-tenant)
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  settings JSONB DEFAULT{},
  plan_type TEXT DEFAULT FREE CHECK (plan_type IN (FREE,BASIC,PRO,ENTERPRISE)),  plan_limits JSONB DEFAULT '[object Object]tatus TEXT DEFAULT 'ACTIVE CHECK (status IN (ACTIVE, SUSPENDED, 'CANCELLED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT EMPLOYEE' CHECK (role IN (EMPLOYEE',MANAGER,ADMIN,OWNER', SUPER_ADMIN')),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  settings JSONB DEFAULT {},
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks Table (Mejorado)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'TODO CHECK (status IN ('TODO', IN_PROGRESS,REVIEW', DONE, 'CANCELLED')),
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN (LOW,MEDIUM',HIGH, TICAL)),  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assignee_name TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_hours DECIMAL(5,2  actual_hours DECIMAL(5,2),
  tags TEXTULT '[object Object]ource TEXT DEFAULT 'manual CHECK (source IN ('manual', dartai',meeting', 'email')),
  source_id TEXT,
  metadata JSONB DEFAULT {},
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

-- Workflows Table
CREATE TABLE IF NOT EXISTS workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN (meeting_processor',resource_scraper',content_pipeline', 'custom)),
  status TEXT DEFAULT 'ACTIVE CHECK (status IN ('ACTIVE,PAUSED, HIVED)),
  config JSONB DEFAULT '{},
  triggers JSONB DEFAULT [],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

-- Workflow Executions Table
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  status TEXT DEFAULTRUNNING CHECK (status IN ('RUNNING', COMPLETED', FAILED, 'CANCELLED')),
  input_data JSONB DEFAULT '[object Object]  output_data JSONB DEFAULT '{},error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

-- Meetings Table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  participants TEXT{},recording_url TEXT,
  transcript TEXT,
  summary TEXT,
  action_items JSONB DEFAULT 'tatus TEXT DEFAULTSCHEDULED CHECK (status IN ('SCHEDULED', 'IN_PROGRESS, COMPLETED, 'CANCELLED')),
  metadata JSONB DEFAULT {},
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT,
  type TEXT CHECK (type IN ('article', video', 'document',website', 'other')),
  content TEXT,
  summary TEXT,
  tags TEXTT '{},
  metadata JSONB DEFAULT {},
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT INFO' CHECK (type IN (INFO', 'SUCCESS',WARNING',ERROR)), read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  metadata JSONB DEFAULT {},
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  permissions JSONB DEFAULT[],
  last_used TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

-- RLS Policies
-- =============

-- Companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICYSuper admins can view all companies" ON companies
  FOR ALL USING (auth.jwt() ->> role' =SUPER_ADMIN);

CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (id = auth.jwt() ->> company_id');

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view users from their company" ON users
  FOR SELECT USING (company_id = auth.jwt() ->> 'company_id);

CREATE POLICY Admins can manage users in their company" ON users
  FOR ALL USING (
    company_id = auth.jwt() ->>company_id' 
    AND auth.jwt() ->>role' IN ('ADMIN,OWNER, 'SUPER_ADMIN));

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks from their company" ON tasks
  FOR SELECT USING (company_id = auth.jwt() ->> 'company_id);

CREATE POLICYUsers can insert tasks for their company" ON tasks
  FOR INSERT WITH CHECK (company_id = auth.jwt() ->> 'company_id);

CREATE POLICYUsers can update tasks from their company" ON tasks
  FOR UPDATE USING (company_id = auth.jwt() ->> 'company_id);

CREATE POLICYUsers can delete tasks from their company" ON tasks
  FOR DELETE USING (company_id = auth.jwt() ->> company_id);-- Workflows
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflows from their company" ON workflows
  FOR SELECT USING (company_id = auth.jwt() ->> 'company_id);

CREATE POLICY Admins can manage workflows in their company" ON workflows
  FOR ALL USING (
    company_id = auth.jwt() ->>company_id' 
    AND auth.jwt() ->>role' IN ('ADMIN,OWNER, 'SUPER_ADMIN')
  );

-- Workflow Executions
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflow executions from their company ON workflow_executions
  FOR SELECT USING (company_id = auth.jwt() ->> 'company_id);

CREATE POLICY Admins can manage workflow executions in their company ON workflow_executions
  FOR ALL USING (
    company_id = auth.jwt() ->>company_id' 
    AND auth.jwt() ->>role' IN ('ADMIN,OWNER, 'SUPER_ADMIN')
  );

-- Meetings
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view meetings from their company" ON meetings
  FOR SELECT USING (company_id = auth.jwt() ->> 'company_id);

CREATE POLICYUsers can manage meetings in their company" ON meetings
  FOR ALL USING (company_id = auth.jwt() ->> company_id);-- Resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view resources from their company" ON resources
  FOR SELECT USING (company_id = auth.jwt() ->> 'company_id);

CREATE POLICYUsers can manage resources in their company" ON resources
  FOR ALL USING (company_id = auth.jwt() ->> company_id');

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICYUsers can update their own notifications ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- API Keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY Admins can manage API keys in their company" ON api_keys
  FOR ALL USING (
    company_id = auth.jwt() ->>company_id' 
    AND auth.jwt() ->>role' IN ('ADMIN,OWNER, 'SUPER_ADMIN')
  );

-- Indexes
-- =======

-- Companies
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_source ON tasks(source);

-- Workflows
CREATE INDEX IF NOT EXISTS idx_workflows_company_id ON workflows(company_id);
CREATE INDEX IF NOT EXISTS idx_workflows_type ON workflows(type);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);

-- Workflow Executions
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started_at ON workflow_executions(started_at);

-- Meetings
CREATE INDEX IF NOT EXISTS idx_meetings_company_id ON meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);

-- Resources
CREATE INDEX IF NOT EXISTS idx_resources_company_id ON resources(company_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_tags ON resources USING GIN(tags);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- API Keys
CREATE INDEX IF NOT EXISTS idx_api_keys_company_id ON api_keys(company_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON api_keys(expires_at);

-- Triggers
-- ========

-- Update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_companies_updated_at 
  BEFORE UPDATE ON companies 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at 
  BEFORE UPDATE ON workflows 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at 
  BEFORE UPDATE ON meetings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at 
  BEFORE UPDATE ON resources 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 