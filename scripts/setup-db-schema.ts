import { Pool } from 'pg';

/**
 * Sets up the database schema for CI environments
 * @description Creates ENUMs, tables, and indexes required for the application.
 *              Includes RLS policies for multi-tenant isolation.
 * @securityReview Required - validates multi-tenant isolation
 * @testingRequired Unit tests for schema creation and RLS enforcement
 * @returns {Promise<void>}
 */
async function setupSchema(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🚧 Setting up CI Database Schema...');

    // 0. Enable Extensions
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    // 1. Create ENUMs
    await pool.query(`
      DROP TYPE IF EXISTS celebrity_type CASCADE;
      CREATE TYPE celebrity_type AS ENUM ('real', 'synthetic');
      
      DROP TYPE IF EXISTS entity_status CASCADE;
      CREATE TYPE entity_status AS ENUM ('active', 'inactive', 'archived');
      
      DROP TYPE IF EXISTS deployment_type CASCADE;
      CREATE TYPE deployment_type AS ENUM ('azure', 'aws', 'gcp');
      
      DROP TYPE IF EXISTS transaction_type CASCADE;
      CREATE TYPE transaction_type AS ENUM ('credit', 'debit');
    `);

    // 2. Create Tables
    await pool.query(`
      -- 2a. Companies Table (Tenant Source of Truth)
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        plan TEXT NOT NULL DEFAULT 'free',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

      -- 2b. Conversations Table with Strict Constraints & FK
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id), -- Enforce referential integrity
        messages JSONB DEFAULT '[]'::jsonb,
        context JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        is_archived BOOLEAN DEFAULT FALSE NOT NULL,
        archived_at TIMESTAMPTZ,
        status entity_status DEFAULT 'active'
      );

      -- 2b. Enable Row Level Security (RLS)
      ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

      -- 2c. Create RLS Policies (Mocked for CI/Local, usually auth.uid() based)
      -- Policy: Users can only see conversations from their company
      DROP POLICY IF EXISTS "Tenant Isolation Policy" ON conversations;
      CREATE POLICY "Tenant Isolation Policy" ON conversations
        USING (company_id::text = current_setting('app.current_company_id', true));
      
      -- 2d. Other Tables with Constraints
      CREATE TABLE IF NOT EXISTS celebrities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        twin_config JSONB DEFAULT '{}'::jsonb,
        type celebrity_type NOT NULL DEFAULT 'synthetic'
      );

      CREATE TABLE IF NOT EXISTS deployments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        config JSONB DEFAULT '{}'::jsonb,
        status entity_status NOT NULL DEFAULT 'active'
      );
    `);

    // 3. Create Indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_celebrities_twin_config ON celebrities USING GIN (twin_config);
      CREATE INDEX IF NOT EXISTS idx_deployments_config ON deployments USING GIN (config);
      CREATE INDEX IF NOT EXISTS idx_conversations_context ON conversations USING GIN (context);
      
      -- Functional Indexes
      CREATE INDEX IF NOT EXISTS idx_celebrities_voice_clone_id ON celebrities USING GIN ((twin_config -> 'voiceCloneId'));
      CREATE INDEX IF NOT EXISTS idx_deployments_custom_domain ON deployments USING GIN ((config -> 'customDomain'));
    `);

    console.log('✅ CI Database Schema Created Successfully');

  } catch (err: unknown) {
    console.error('❌ Schema setup failed:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupSchema();
