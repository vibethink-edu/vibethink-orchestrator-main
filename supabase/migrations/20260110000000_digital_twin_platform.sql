-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CELEBRITIES TABLE
-- Represents the human entity (Andrés Cantor, Messi, etc.)
CREATE TABLE IF NOT EXISTS public.celebrities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE, -- 'andres-cantor'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb -- For storing extra info like social handles
);

-- 2. DIGITAL TWINS TABLE
-- Represents the technical instance/version of a celebrity
-- One celebrity can have multiple twin versions (e.g., 'v1-core', 'v2-enhanced')
CREATE TABLE IF NOT EXISTS public.digital_twins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    celebrity_id UUID NOT NULL REFERENCES public.celebrities(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- 'Andrés Cantor Core V1'
    version TEXT NOT NULL, -- '1.0.0'
    provider TEXT NOT NULL, -- 'tavus', 'heygen', etc.
    provider_twin_id TEXT NOT NULL, -- The ID in Tavus system
    is_active BOOLEAN DEFAULT true,
    capabilities JSONB DEFAULT '[]'::jsonb, -- ['video', 'voice', 'interactive']
    configuration JSONB DEFAULT '{}'::jsonb, -- Specific provider config
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. DEPLOYMENTS TABLE
-- Represents the lease/usage of a Twin by a specific Client
-- This implements the "Multitenancy" and "Build Once, Deploy Many" model
CREATE TABLE IF NOT EXISTS public.deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    digital_twin_id UUID NOT NULL REFERENCES public.digital_twins(id) ON DELETE RESTRICT,
    client_name TEXT NOT NULL, -- 'Coca-Cola', 'Nike'
    deployment_type TEXT NOT NULL CHECK (deployment_type IN ('PORTAL', 'EMBEDDED', 'CAMPAIGN', 'WHITE_LABEL')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'EXPIRED')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    end_date TIMESTAMP WITH TIME ZONE,
    monthly_fee NUMERIC(10, 2), -- $2,000.00
    config_overrides JSONB DEFAULT '{}'::jsonb, -- Custom scripts, restricted topics per client
    api_usage_limit INTEGER, -- Request limit per month
    current_usage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. KNOWLEDGE BASES
-- Context specific knowledge for the Twins
CREATE TABLE IF NOT EXISTS public.knowledge_bases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    digital_twin_id UUID REFERENCES public.digital_twins(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'TEXT', 'URL', 'PDF', 'API_STREAM'
    content TEXT, -- Raw text or URL
    refresh_interval_minutes INTEGER, -- For API streams (e.g., live scores)
    last_indexed_at TIMESTAMP WITH TIME ZONE,
    embedding_ids TEXT[], -- References to vector store
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES
CREATE INDEX idx_celebrities_slug ON public.celebrities(slug);
CREATE INDEX idx_digital_twins_celebrity ON public.digital_twins(celebrity_id);
CREATE INDEX idx_deployments_twin ON public.deployments(digital_twin_id);
CREATE INDEX idx_deployments_client ON public.deployments(client_name);

-- RLS POLICIES (Draft - permissive for now for internal dev)
ALTER TABLE public.celebrities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_bases ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to authenticated users" ON public.celebrities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to authenticated users" ON public.digital_twins FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to authenticated users" ON public.deployments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to authenticated users" ON public.knowledge_bases FOR SELECT USING (auth.role() = 'authenticated');

-- Allow write access to authenticated users (simplified for dev)
CREATE POLICY "Allow write access to authenticated users" ON public.celebrities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access to authenticated users" ON public.digital_twins FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access to authenticated users" ON public.deployments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access to authenticated users" ON public.knowledge_bases FOR ALL USING (auth.role() = 'authenticated');

-- Comments
COMMENT ON TABLE public.celebrities IS 'Core identity of the celebrity/influencer';
COMMENT ON TABLE public.digital_twins IS 'Technical implementation/instance of a celebrity twin (e.g. Tavus Replica)';
COMMENT ON TABLE public.deployments IS 'Commercial deployment of a twin to a specific client (Tenancy)';
COMMENT ON TABLE public.knowledge_bases IS 'Domain specific knowledge for twin context';
