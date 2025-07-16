-- Migration: Create get_company_limits RPC function
-- Description: Function to get company limits and current usage for billing and restrictions
-- Author: AI Pair Platform - Backend Team
-- Version: 1.0.0

-- Function to get company limits and current usage
CREATE OR REPLACE FUNCTION get_company_limits(p_company_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    company_record RECORD;
    plan_record RECORD;
    current_month_start DATE;
    usage_stats RECORD;
    result JSONB;
BEGIN
    -- Get current month start for usage calculations
    current_month_start := DATE_TRUNC('month', CURRENT_DATE);
    
    -- Get company information
    SELECT c.*, pd.max_users as plan_max_users,
           pd.max_monthly_ai_requests as plan_max_ai_requests,
           pd.max_monthly_scraping_pages as plan_max_scraping_pages,
           pd.max_storage_gb as plan_max_storage_gb,
           pd.features as plan_features
    INTO company_record
    FROM companies c
    LEFT JOIN plan_definitions pd ON c.plan_definition_id = pd.id
    WHERE c.id = p_company_id;
    
    -- Return error if company not found
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'error', 'Company not found',
            'company_id', p_company_id
        );
    END IF;
    
    -- Calculate current usage for this month
    SELECT 
        COALESCE(COUNT(*), 0) as ai_requests,
        COALESCE(SUM(tokens_used), 0) as tokens_used,
        COALESCE(SUM(cost_estimate), 0) as total_cost
    INTO usage_stats
    FROM ai_usage_logs
    WHERE company_id = p_company_id
      AND created_at >= current_month_start
      AND status = 'completed';
    
    -- Get current user count
    DECLARE
        user_count INTEGER;
    BEGIN
        SELECT COUNT(*)
        INTO user_count
        FROM user_profiles
        WHERE company_id = p_company_id
          AND is_active = true;
    END;
    
    -- Get current storage usage (placeholder - would need actual file tracking)
    DECLARE
        storage_mb INTEGER := 0;
    BEGIN
        -- This would be calculated from actual file storage in the future
        storage_mb := 0;
    END;
    
    -- Build result JSON with company limits and current usage
    result := jsonb_build_object(
        'company_id', company_record.id,
        'company_name', company_record.name,
        'subscription_plan', COALESCE(company_record.subscription_plan, 'STARTER'),
        'status', COALESCE(company_record.status, 'ACTIVE'),
        
        -- Limits (use custom values if set, otherwise plan defaults)
        'max_users', COALESCE(
            company_record.custom_max_users,
            company_record.max_users,
            company_record.plan_max_users,
            5
        ),
        'max_monthly_ai_requests', COALESCE(
            company_record.custom_max_monthly_ai_requests,
            company_record.max_monthly_ai_requests,
            company_record.plan_max_ai_requests,
            1000
        ),
        'max_monthly_scraping_pages', COALESCE(
            company_record.custom_max_monthly_scraping_pages,
            company_record.max_monthly_scraping_pages,
            company_record.plan_max_scraping_pages,
            100
        ),
        'max_storage_gb', COALESCE(
            company_record.max_storage_gb,
            company_record.plan_max_storage_gb,
            1
        ),
        
        -- Current usage
        'current_usage', jsonb_build_object(
            'users', user_count,
            'ai_requests', usage_stats.ai_requests,
            'tokens_used', usage_stats.tokens_used,
            'total_cost_usd', usage_stats.total_cost,
            'storage_mb', storage_mb,
            'calculation_period', jsonb_build_object(
                'start', current_month_start,
                'end', DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'
            )
        ),
        
        -- Features available
        'features', COALESCE(
            company_record.custom_features,
            company_record.plan_features,
            '["basic_ai"]'::jsonb
        ),
        
        -- Metadata
        'calculated_at', NOW(),
        'limits_source', CASE 
            WHEN company_record.custom_max_users IS NOT NULL 
                OR company_record.custom_max_monthly_ai_requests IS NOT NULL
                OR company_record.custom_max_monthly_scraping_pages IS NOT NULL
            THEN 'custom'
            WHEN company_record.plan_definition_id IS NOT NULL THEN 'plan'
            ELSE 'default'
        END
    );
    
    RETURN result;
END;
$$;

-- Function to check if a company can perform an AI operation
CREATE OR REPLACE FUNCTION can_use_ai_service(
    p_company_id UUID,
    p_operation_type TEXT DEFAULT 'general',
    p_estimated_tokens INTEGER DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    limits_data JSONB;
    can_proceed BOOLEAN := false;
    reason TEXT := '';
    current_usage INTEGER;
    max_requests INTEGER;
BEGIN
    -- Get company limits
    limits_data := get_company_limits(p_company_id);
    
    -- Check if company exists and is active
    IF limits_data ? 'error' THEN
        RETURN jsonb_build_object(
            'can_proceed', false,
            'reason', 'Company not found or inactive',
            'limits_data', limits_data
        );
    END IF;
    
    -- Check company status
    IF limits_data ->> 'status' NOT IN ('ACTIVE', 'TRIAL') THEN
        RETURN jsonb_build_object(
            'can_proceed', false,
            'reason', 'Company account is suspended or cancelled',
            'company_status', limits_data ->> 'status'
        );
    END IF;
    
    -- Get current usage and limits
    current_usage := (limits_data -> 'current_usage' ->> 'ai_requests')::INTEGER;
    max_requests := (limits_data ->> 'max_monthly_ai_requests')::INTEGER;
    
    -- Check AI request limits
    IF current_usage >= max_requests THEN
        can_proceed := false;
        reason := format('Monthly AI request limit exceeded (%s/%s)', current_usage, max_requests);
    ELSE
        can_proceed := true;
        reason := format('Can proceed (%s/%s requests used)', current_usage, max_requests);
    END IF;
    
    RETURN jsonb_build_object(
        'can_proceed', can_proceed,
        'reason', reason,
        'current_usage', current_usage,
        'max_requests', max_requests,
        'remaining_requests', GREATEST(0, max_requests - current_usage),
        'usage_percentage', ROUND((current_usage::DECIMAL / max_requests::DECIMAL) * 100, 2)
    );
END;
$$;

-- Function to get monthly usage statistics
CREATE OR REPLACE FUNCTION get_monthly_usage_stats(
    p_company_id UUID,
    p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    p_month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    month_start DATE;
    month_end DATE;
    stats RECORD;
    operation_stats JSONB := '{}';
    daily_stats JSONB := '[]';
BEGIN
    -- Calculate month boundaries
    month_start := DATE_TRUNC('month', MAKE_DATE(p_year, p_month, 1));
    month_end := month_start + INTERVAL '1 month' - INTERVAL '1 day';
    
    -- Get overall statistics for the month
    SELECT 
        COUNT(*) as total_requests,
        COALESCE(SUM(tokens_used), 0) as total_tokens,
        COALESCE(SUM(cost_estimate), 0) as total_cost,
        COUNT(DISTINCT operation_type) as unique_operations,
        COUNT(DISTINCT user_id) as unique_users
    INTO stats
    FROM ai_usage_logs
    WHERE company_id = p_company_id
      AND created_at >= month_start
      AND created_at <= month_end
      AND status = 'completed';
    
    -- Get statistics by operation type
    SELECT jsonb_object_agg(
        operation_type,
        jsonb_build_object(
            'requests', request_count,
            'tokens', total_tokens,
            'cost', total_cost
        )
    )
    INTO operation_stats
    FROM (
        SELECT 
            operation_type,
            COUNT(*) as request_count,
            COALESCE(SUM(tokens_used), 0) as total_tokens,
            COALESCE(SUM(cost_estimate), 0) as total_cost
        FROM ai_usage_logs
        WHERE company_id = p_company_id
          AND created_at >= month_start
          AND created_at <= month_end
          AND status = 'completed'
        GROUP BY operation_type
    ) op_stats;
    
    -- Get daily statistics
    SELECT jsonb_agg(
        jsonb_build_object(
            'date', usage_date,
            'requests', request_count,
            'tokens', total_tokens,
            'cost', total_cost
        ) ORDER BY usage_date
    )
    INTO daily_stats
    FROM (
        SELECT 
            DATE(created_at) as usage_date,
            COUNT(*) as request_count,
            COALESCE(SUM(tokens_used), 0) as total_tokens,
            COALESCE(SUM(cost_estimate), 0) as total_cost
        FROM ai_usage_logs
        WHERE company_id = p_company_id
          AND created_at >= month_start
          AND created_at <= month_end
          AND status = 'completed'
        GROUP BY DATE(created_at)
    ) daily;
    
    RETURN jsonb_build_object(
        'company_id', p_company_id,
        'period', jsonb_build_object(
            'year', p_year,
            'month', p_month,
            'start_date', month_start,
            'end_date', month_end
        ),
        'summary', jsonb_build_object(
            'total_requests', stats.total_requests,
            'total_tokens', stats.total_tokens,
            'total_cost_usd', stats.total_cost,
            'unique_operations', stats.unique_operations,
            'unique_users', stats.unique_users
        ),
        'by_operation', COALESCE(operation_stats, '{}'),
        'daily_breakdown', COALESCE(daily_stats, '[]'),
        'generated_at', NOW()
    );
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_company_limits(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_use_ai_service(UUID, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_monthly_usage_stats(UUID, INTEGER, INTEGER) TO authenticated;

-- Add comments
COMMENT ON FUNCTION get_company_limits(UUID) IS 'Returns company limits and current usage for billing and restrictions';
COMMENT ON FUNCTION can_use_ai_service(UUID, TEXT, INTEGER) IS 'Checks if a company can perform an AI operation based on current usage and limits';
COMMENT ON FUNCTION get_monthly_usage_stats(UUID, INTEGER, INTEGER) IS 'Returns detailed monthly usage statistics for a company'; 