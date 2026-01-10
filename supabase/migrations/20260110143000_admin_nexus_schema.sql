-- MIGRATION: Admin Nexus System Tables
-- AUTHOR: VibeThink Architecture Team
-- DATE: 2026-01-10

-- 1. ADMIN AUDIT EVENTS (Append-Only)
CREATE TABLE IF NOT EXISTS admin_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Actor
  actor_user_id UUID NOT NULL, -- Link to auth.users if possible, but keep loose for decoupling
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL, -- 'SUPPORT', 'OPS', 'SUPER'
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  
  -- Target
  target_tenant_id UUID, -- Link to public.tenants
  target_user_id UUID,   -- Link to public.users
  
  -- Action
  action_type TEXT NOT NULL,       -- e.g. 'UPDATE_LIMIT'
  reason_code TEXT NOT NULL,       -- e.g. 'TICKET_RESOLUTION'
  ticket_ref TEXT,                 -- e.g. 'JIRA-123'
  
  -- Data Payload
  payload JSONB DEFAULT '{}'::jsonb -- { before, after, diff }
);

-- RLS: Only Service Role can write. Admins can read (via API).
ALTER TABLE admin_audit_events ENABLE ROW LEVEL SECURITY;

-- 2. TENANT POLICIES (Configuration)
CREATE TABLE IF NOT EXISTS tenant_policies (
  tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  version INTEGER DEFAULT 1,
  
  -- The Config
  flavor TEXT NOT NULL DEFAULT 'PRO', -- 'ENTERPRISE', 'PRO', 'TRIAL'
  active_modules JSONB DEFAULT '[]'::jsonb, -- ['TWIN', 'CRM']
  feature_flags JSONB DEFAULT '{}'::jsonb,
  
  -- Policy Hash for Integrity
  policy_hash TEXT
);

-- 3. IMPERSONATION SESSIONS (Break-Glass)
CREATE TABLE IF NOT EXISTS impersonation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  admin_user_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  target_tenant_id UUID NOT NULL,
  
  status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'TERMINATED', 'EXPIRED'
  audit_event_id UUID REFERENCES admin_audit_events(id)
);

-- 4. ADMIN ROLES (Simple Mapping)
-- In a real scenario, this might be in auth.claims, but a table is safer for MVP visibility.
CREATE TABLE IF NOT EXISTS admin_role_assignments (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('SUPPORT', 'OPS', 'SUPER')),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID
);

-- INDICES
CREATE INDEX idx_audit_actor ON admin_audit_events(actor_user_id);
CREATE INDEX idx_audit_target_tenant ON admin_audit_events(target_tenant_id);
CREATE INDEX idx_impersonation_admin ON impersonation_sessions(admin_user_id);
