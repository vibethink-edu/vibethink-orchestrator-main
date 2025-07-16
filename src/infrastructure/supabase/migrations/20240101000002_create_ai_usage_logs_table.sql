-- Migration: Create AI usage logs table
-- Description: Table to track AI API usage and costs for billing and limits
-- Author: AI Pair Platform - Backend Team
-- Version: 1.0.0

-- Create ai_usage_logs table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Usage details
    operation_type TEXT NOT NULL, -- 'meeting_processing', 'document_analysis', 'chat_completion', etc.
    service_provider TEXT NOT NULL DEFAULT 'openai', -- 'openai', 'anthropic', 'google', etc.
    model_used TEXT, -- 'gpt-4o', 'whisper-1', 'text-embedding-ada-002', etc.
    
    -- Metrics
    tokens_used INTEGER DEFAULT 0,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    
    -- Cost tracking
    cost_estimate DECIMAL(10, 6) DEFAULT 0, -- Cost in USD
    currency TEXT DEFAULT 'USD',
    
    -- Request details
    request_size_bytes BIGINT,
    response_size_bytes BIGINT,
    processing_duration_ms INTEGER,
    
    -- Status and error handling
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    error_message TEXT,
    
    -- Metadata and context
    metadata JSONB DEFAULT '{}', -- Additional context (file types, features used, etc.)
    api_request_id TEXT, -- External API request ID for debugging
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance and analytics
CREATE INDEX idx_ai_usage_logs_company_id ON public.ai_usage_logs(company_id);
CREATE INDEX idx_ai_usage_logs_user_id ON public.ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_operation_type ON public.ai_usage_logs(operation_type);
CREATE INDEX idx_ai_usage_logs_service_provider ON public.ai_usage_logs(service_provider);
CREATE INDEX idx_ai_usage_logs_created_at ON public.ai_usage_logs(created_at DESC);
CREATE INDEX idx_ai_usage_logs_company_date ON public.ai_usage_logs(company_id, created_at DESC);
CREATE INDEX idx_ai_usage_logs_status ON public.ai_usage_logs(status);

-- Composite index for monthly usage calculations
CREATE INDEX idx_ai_usage_logs_monthly_stats ON public.ai_usage_logs(
    company_id, 
    operation_type, 
    DATE_TRUNC('month', created_at),
    status
) WHERE status = 'completed';

-- Enable RLS (Row Level Security)
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for multi-tenant isolation

-- Policy for SELECT: Users can only see usage logs from their company
CREATE POLICY "Users can view AI usage from their company" ON public.ai_usage_logs
    FOR SELECT USING (
        company_id IN (
            SELECT up.company_id 
            FROM public.user_profiles up 
            WHERE up.id = auth.uid()
        )
    );

-- Policy for INSERT: System can insert usage logs for any company (via service role)
CREATE POLICY "System can insert AI usage logs" ON public.ai_usage_logs
    FOR INSERT WITH CHECK (true);

-- Policy for UPDATE: Only system can update usage logs
CREATE POLICY "System can update AI usage logs" ON public.ai_usage_logs
    FOR UPDATE USING (true);

-- Policy for DELETE: Only SUPER_ADMIN can delete usage logs
CREATE POLICY "Super admins can delete AI usage logs" ON public.ai_usage_logs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = auth.uid() 
            AND up.role = 'SUPER_ADMIN'
        )
    );

-- Create trigger to set completed_at when status changes to completed
CREATE OR REPLACE FUNCTION set_ai_usage_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_usage_completed_at 
    BEFORE UPDATE ON public.ai_usage_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION set_ai_usage_completed_at();

-- Add comments for documentation
COMMENT ON TABLE public.ai_usage_logs IS 'Tracks AI API usage and costs for billing and usage limits';
COMMENT ON COLUMN public.ai_usage_logs.operation_type IS 'Type of AI operation performed';
COMMENT ON COLUMN public.ai_usage_logs.tokens_used IS 'Total tokens consumed in the operation';
COMMENT ON COLUMN public.ai_usage_logs.cost_estimate IS 'Estimated cost in USD based on provider pricing';
COMMENT ON COLUMN public.ai_usage_logs.metadata IS 'Additional context and parameters for the operation'; 