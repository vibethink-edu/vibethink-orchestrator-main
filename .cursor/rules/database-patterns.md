
# Database Patterns and Query Optimization

## SUPABASE QUERY STANDARDS

### 1. Type-Safe Query Builder
```typescript
// ✅ REQUIRED: Use custom QueryBuilder for complex queries
import { QueryBuilders } from '@/utils/queryBuilders';

const companyScopedData = await QueryBuilders.configurations()
  .eq('company_id', user.company_id)
  .eq('is_active', true)
  .select('id, config_key, config_value, created_at')
  .orderBy('created_at', { ascending: false })
  .limit(50)
  .execute();
```

### 2. RLS Policy Compliance
```typescript
// ✅ ALWAYS: Include company_id in queries
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('company_id', user.company_id) // MANDATORY
  .eq('is_active', true);

// ✅ Super admin exception pattern
const isSuper = await supabase.rpc('is_super_admin_safe');
if (isSuper) {
  // Cross-company query allowed
  query = supabase.from('table_name').select('*');
} else {
  // Company-scoped query
  query = supabase.from('table_name')
    .select('*')
    .eq('company_id', user.company_id);
}
```

### 3. Error Handling Pattern
```typescript
// ✅ ENTERPRISE ERROR HANDLING
const safeQuery = async <T>(queryFn: () => Promise<{ data: T; error: any }>) => {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error('Database error:', error);
      throw new Error('Data access temporarily unavailable');
    }
    
    return data;
  } catch (error) {
    // Log to monitoring service
    console.error('Query execution failed:', error);
    throw error;
  }
};
```

## DATABASE FUNCTION USAGE

### 1. Business Logic Functions
```typescript
// ✅ USE: Database functions for complex business logic
const companyLimits = await supabase.rpc('get_company_limits', {
  p_company_id: user.company_id
});

const canManage = await supabase.rpc('can_manage_user', {
  manager_user_id: managerId,
  target_user_id: targetId
});
```

### 2. Usage Tracking Pattern
```typescript
// ✅ REQUIRED: Track all billable operations
const trackAIUsage = async (operation: string, tokens: number, cost: number) => {
  await supabase.rpc('track_usage', {
    p_company_id: user.company_id,
    p_user_id: user.id,
    p_service_name: 'openai',
    p_usage_type: operation,
    p_amount: tokens,
    p_cost_usd: cost,
    p_metadata: { model: 'gpt-4o', timestamp: new Date().toISOString() }
  });
};
```

## REAL-TIME SUBSCRIPTIONS

### 1. Company-Scoped Subscriptions
```typescript
// ✅ PATTERN: Real-time updates with company isolation
const subscribeToCompanyData = (companyId: string) => {
  return supabase
    .channel(`company-${companyId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'configurations',
      filter: `company_id=eq.${companyId}`
    }, handleConfigurationChange)
    .subscribe();
};
```

### 2. Cleanup Pattern
```typescript
// ✅ REQUIRED: Always cleanup subscriptions
useEffect(() => {
  const subscription = subscribeToCompanyData(user.company_id);
  
  return () => {
    subscription.unsubscribe();
  };
}, [user.company_id]);
```

## PERFORMANCE OPTIMIZATION

### 1. Query Optimization
```typescript
// ✅ EFFICIENT: Select only needed columns
const configs = await supabase
  .from('platform_configurations')
  .select('id, config_key, config_value') // Not SELECT *
  .eq('company_id', companyId)
  .eq('is_active', true)
  .limit(100); // Always limit results

// ✅ BATCH OPERATIONS: Reduce round trips
const batchUpdate = await supabase
  .from('configurations')
  .upsert(configurationArray, { onConflict: 'config_key,company_id' });
```

### 2. Caching Strategy
```typescript
// ✅ REACT QUERY: Smart caching for database queries
const useCompanyConfigurations = (companyId: string) => {
  return useQuery({
    queryKey: ['configurations', companyId],
    queryFn: () => fetchConfigurations(companyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!companyId
  });
};
```

## AUDIT LOGGING

### 1. Configuration Changes
```typescript
// ✅ REQUIRED: Log all configuration changes
const updateConfiguration = async (configId: string, newValue: any) => {
  const { data } = await supabase.rpc('upsert_platform_configuration', {
    p_category: 'ai_models',
    p_config_key: 'openai_model',
    p_config_value: newValue,
    p_description: 'AI model configuration',
    p_user_id: user.id,
    p_reason: 'User configuration update'
  });
  
  return data;
};
```

### 2. User Actions
```typescript
// ✅ PATTERN: Track significant user actions
const logUserAction = async (action: string, details: any) => {
  await supabase
    .from('configuration_audit_log')
    .insert({
      table_name: 'user_actions',
      action,
      changed_by: user.id,
      company_id: user.company_id,
      new_values: details,
      reason: `User initiated ${action}`
    });
};
```

## DATA VALIDATION

### 1. Type Guards
```typescript
// ✅ RUNTIME VALIDATION: Ensure data integrity
const isValidConfiguration = (data: any): data is Configuration => {
  return (
    typeof data === 'object' &&
    typeof data.config_key === 'string' &&
    data.company_id === user.company_id && // Security check
    data.config_value !== undefined
  );
};
```

### 2. Schema Validation
```typescript
// ✅ ZOD SCHEMAS: Validate API inputs
const configurationSchema = z.object({
  config_key: z.string().min(1).max(100),
  config_value: z.any(),
  company_id: z.string().uuid(),
  category: z.enum(['ai_models', 'integrations', 'billing', 'security'])
});
```

## MIGRATION PATTERNS

### 1. Safe Schema Changes
```sql
-- ✅ SAFE: Add columns with defaults
ALTER TABLE configurations 
ADD COLUMN new_field TEXT DEFAULT 'default_value';

-- ✅ SAFE: Add non-null constraints after populating
UPDATE configurations SET new_field = 'value' WHERE new_field IS NULL;
ALTER TABLE configurations ALTER COLUMN new_field SET NOT NULL;
```

### 2. Data Migration Functions
```sql
-- ✅ PATTERN: Reversible data migrations
CREATE OR REPLACE FUNCTION migrate_configuration_format()
RETURNS void AS $$
BEGIN
  -- Migration logic with error handling
  UPDATE configurations 
  SET config_value = jsonb_build_object('value', config_value)
  WHERE jsonb_typeof(config_value) != 'object';
END;
$$ LANGUAGE plpgsql;
```

**Performance Target**: All queries < 100ms, subscriptions < 10ms latency.
