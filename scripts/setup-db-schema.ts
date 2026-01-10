import { Pool } from 'pg';

async function setupSchema() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL required');
        process.exit(1);
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    try {
        console.log('🚧 Setting up CI Database Schema...');

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
      CREATE TABLE IF NOT EXISTS celebrities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT,
        twin_config JSONB,
        type celebrity_type
      );

      CREATE TABLE IF NOT EXISTS deployments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        config JSONB,
        status entity_status
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID,
        messages JSONB DEFAULT '[]',
        context JSONB,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        is_archived BOOLEAN DEFAULT FALSE,
        archived_at TIMESTAMPTZ
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
