-- Migration: Secure SUPPORT Role Implementation
-- Description: Implements secure RLS policies and audit logging for SUPPORT role
-- Author: AI Pair Platform - Security Team
-- Version: 1.0.0
-- CRITICAL: Fixes multi-tenant security violations

-- Create audit table for support actions if not exists
CREATE TABLE IF NOT EXISTS public.support_actions_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  support_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  action_data JSONB DEFAULT '{}',
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create index for performance
CREATE INDEX idx_support_actions_log_user_company ON public.support_actions_log(support_user_id, target_company_id);
CREATE INDEX idx_support_actions_log_performed_at ON public.support_actions_log(performed_at DESC);

-- Enable RLS on support actions log
ALTER TABLE public.support_actions_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only SUPPORT users from vibethink-platform can view support actions
CREATE POLICY "Support users can view support actions" ON public.support_actions_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.companies c ON up.company_id = c.id
      WHERE up.id = auth.uid() 
      AND up.role = 'SUPPORT'
      AND c.slug = 'vibethink-platform'
    )
  );

-- RLS Policy: Only SUPPORT users can insert support actions
CREATE POLICY "Support users can log actions" ON public.support_actions_log
  FOR INSERT WITH CHECK (
    support_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.companies c ON up.company_id = c.id
      WHERE up.id = auth.uid() 
      AND up.role = 'SUPPORT'
      AND c.slug = 'vibethink-platform'
    )
  );

-- Enhanced RLS Policy: SUPPORT role can view ALL companies (controlled cross-tenant access)
CREATE POLICY "Support can view all companies for assistance" ON public.companies
  FOR SELECT USING (
    -- Regular users see their own company
    id IN (SELECT company_id FROM public.user_profiles WHERE id = auth.uid())
    OR
    -- SUPPORT users from vibethink-platform can see all companies
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.companies c ON up.company_id = c.id
      WHERE up.id = auth.uid() 
      AND up.role = 'SUPPORT'
      AND c.slug = 'vibethink-platform'
    )
  );

-- Enhanced RLS Policy: SUPPORT role can view ALL user profiles (read-only for support)
CREATE POLICY "Support can view all user profiles for assistance" ON public.user_profiles
  FOR SELECT USING (
    -- Regular users see their company profiles
    company_id IN (SELECT company_id FROM public.user_profiles WHERE id = auth.uid())
    OR
    -- SUPPORT users from vibethink-platform can see all profiles
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.companies c ON up.company_id = c.id
      WHERE up.id = auth.uid() 
      AND up.role = 'SUPPORT'
      AND c.slug = 'vibethink-platform'
    )
  );

-- Enhanced RLS Policy: SUPPORT can view usage tracking across companies
CREATE POLICY "Support can view all usage tracking" ON public.usage_tracking
  FOR SELECT USING (
    -- Regular users see their company usage
    company_id IN (SELECT company_id FROM public.user_profiles WHERE id = auth.uid())
    OR
    -- SUPPORT users from vibethink-platform can see all usage
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.companies c ON up.company_id = c.id
      WHERE up.id = auth.uid() 
      AND up.role = 'SUPPORT'
      AND c.slug = 'vibethink-platform'
    )
  );

-- Enhanced RLS Policy: SUPPORT can view AI usage logs across companies
CREATE POLICY "Support can view all AI usage logs" ON public.ai_usage_logs
  FOR SELECT USING (
    -- Regular users see their company logs
    company_id IN (
      SELECT up.company_id 
      FROM public.user_profiles up 
      WHERE up.id = auth.uid()
    )
    OR
    -- SUPPORT users from vibethink-platform can see all logs
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.companies c ON up.company_id = c.id
      WHERE up.id = auth.uid() 
      AND up.role = 'SUPPORT'
      AND c.slug = 'vibethink-platform'
    )
  );

-- Function to validate SUPPORT user permissions
CREATE OR REPLACE FUNCTION validate_support_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  user_role user_role;
  company_slug TEXT;
BEGIN
  -- Get user role and company slug
  SELECT up.role, c.slug INTO user_role, company_slug
  FROM public.user_profiles up
  JOIN public.companies c ON up.company_id = c.id
  WHERE up.id = auth.uid();
  
  -- Check if user is SUPPORT from vibethink-platform
  RETURN user_role = 'SUPPORT' AND company_slug = 'vibethink-platform';
END;
$$;

-- Function to log support actions (mandatory for all support operations)
CREATE OR REPLACE FUNCTION log_support_action(
  p_target_company_id UUID,
  p_action_type TEXT,
  p_action_description TEXT,
  p_action_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  action_id UUID;
BEGIN
  -- Validate user is SUPPORT
  IF NOT validate_support_user() THEN
    RAISE EXCEPTION 'Unauthorized: Only SUPPORT users can log actions';
  END IF;
  
  -- Insert support action log
  INSERT INTO public.support_actions_log (
    support_user_id,
    target_company_id,
    action_type,
    action_description,
    action_data
  ) VALUES (
    auth.uid(),
    p_target_company_id,
    p_action_type,
    p_action_description,
    p_action_data
  ) RETURNING id INTO action_id;
  
  RETURN action_id;
END;
$$;

-- Function for temporary limit adjustments (SUPPORT only, max 500 increase)
CREATE OR REPLACE FUNCTION support_temporary_limit_increase(
  p_company_id UUID,
  p_increase_amount INTEGER,
  p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_limit INTEGER;
  new_limit INTEGER;
  max_increase CONSTANT INTEGER := 500;
  result JSONB;
BEGIN
  -- Validate user is SUPPORT
  IF NOT validate_support_user() THEN
    RAISE EXCEPTION 'Unauthorized: Only SUPPORT users can adjust limits';
  END IF;
  
  -- Validate increase amount
  IF p_increase_amount > max_increase THEN
    RAISE EXCEPTION 'Support limit increase cannot exceed % requests', max_increase;
  END IF;
  
  -- Get current limit
  SELECT max_monthly_ai_requests INTO current_limit
  FROM public.companies
  WHERE id = p_company_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Company not found';
  END IF;
  
  -- Calculate new limit
  new_limit := current_limit + p_increase_amount;
  
  -- Log the action BEFORE making changes
  PERFORM log_support_action(
    p_company_id,
    'TEMPORARY_LIMIT_INCREASE',
    format('Increased AI limit by %s requests. Reason: %s', p_increase_amount, p_reason),
    jsonb_build_object(
      'previous_limit', current_limit,
      'new_limit', new_limit,
      'increase_amount', p_increase_amount,
      'reason', p_reason
    )
  );
  
  -- Update the limit (temporary - should be reverted later)
  UPDATE public.companies
  SET 
    max_monthly_ai_requests = new_limit,
    updated_at = NOW()
  WHERE id = p_company_id;
  
  -- Return result
  result := jsonb_build_object(
    'success', true,
    'previous_limit', current_limit,
    'new_limit', new_limit,
    'increase_amount', p_increase_amount,
    'company_id', p_company_id
  );
  
  RETURN result;
END;
$$;

-- Grant necessary permissions to authenticated users
GRANT SELECT ON public.support_actions_log TO authenticated;
GRANT INSERT ON public.support_actions_log TO authenticated;
GRANT EXECUTE ON FUNCTION validate_support_user() TO authenticated;
GRANT EXECUTE ON FUNCTION log_support_action(UUID, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION support_temporary_limit_increase(UUID, INTEGER, TEXT) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.support_actions_log IS 'Audit log for all SUPPORT role actions across companies';
COMMENT ON FUNCTION validate_support_user() IS 'Validates if current user is authorized SUPPORT role from vibethink-platform';
COMMENT ON FUNCTION log_support_action(UUID, TEXT, TEXT, JSONB) IS 'Mandatory logging function for all SUPPORT actions';
COMMENT ON FUNCTION support_temporary_limit_increase(UUID, INTEGER, TEXT) IS 'Secure function for SUPPORT to temporarily increase company AI limits (max 500)';

-- Log this migration
INSERT INTO public.support_actions_log (
  support_user_id,
  target_company_id,
  action_type,
  action_description,
  action_data
) VALUES (
  '00000000-0000-0000-0000-000000000000'::UUID, -- System user
  '111e1111-e11b-11d1-a111-111111111111'::UUID, -- vibethink platform
  'SECURITY_MIGRATION',
  'Implemented secure SUPPORT role with RLS policies and audit logging',
  jsonb_build_object(
    'migration_file', '20250618000000_secure_support_role.sql',
    'security_level', 'CRITICAL',
    'features', jsonb_build_array(
      'Cross-company RLS policies',
      'Mandatory audit logging',
      'Temporary limit adjustments',
      'Support action validation'
    )
  )
) ON CONFLICT DO NOTHING; 