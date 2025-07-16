
# Multi-Tenant Security Rules - CRITICAL

## SECURITY FIRST PRINCIPLE
Every database query MUST include company_id filtering to prevent cross-tenant data access.

## MANDATORY PATTERNS

### 1. Database Query Security
```typescript
// ✅ CORRECT: Always filter by company_id
const { data } = await supabase
  .from('table_name')
  .select('*')
  .eq('company_id', user.company_id);

// ❌ FORBIDDEN: Never query without company isolation
const { data } = await supabase
  .from('table_name')
  .select('*');
```

### 2. Secure Query Builder Pattern
```typescript
// ✅ CORRECT: Use company-scoped query builder
export const secureQuery = {
  forCompany: (companyId: string) => ({
    select: (table: string) => 
      supabase.from(table).select('*').eq('company_id', companyId),
    insert: (table: string, data: any) => 
      supabase.from(table).insert({ ...data, company_id: companyId }),
    update: (table: string, id: string, data: any) => 
      supabase.from(table).update(data).eq('id', id).eq('company_id', companyId),
    delete: (table: string, id: string) =>
      supabase.from(table).delete().eq('id', id).eq('company_id', companyId)
  })
};
```

### 3. Company Access Validation
```typescript
// ✅ CORRECT: Validate company access before operations
const validateCompanyAccess = async (userId: string, companyId: string) => {
  const { data } = await supabase
    .from('user_profiles')
    .select('company_id')
    .eq('id', userId)
    .single();
    
  if (data?.company_id !== companyId) {
    throw new UnauthorizedError('Company access denied');
  }
};
```

## ROLE-BASED ACCESS CONTROL

### 1. 5-Tier Role System
```typescript
interface RoleHierarchy {
  EMPLOYEE: 1;
  MANAGER: 2;
  ADMIN: 3;
  OWNER: 4;
  SUPER_ADMIN: 5;
}

const ROLE_LEVELS: RoleHierarchy = {
  EMPLOYEE: 1,
  MANAGER: 2,
  ADMIN: 3,
  OWNER: 4,
  SUPER_ADMIN: 5
};
```

### 2. Permission Checking Pattern
```typescript
// ✅ CORRECT: Check permissions before data access
const hasPermission = async (
  userId: string, 
  requiredLevel: keyof RoleHierarchy, 
  companyId: string
) => {
  const userRole = await getUserRole(userId, companyId);
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredLevel];
};

// ✅ CORRECT: Use in components
const { user, hasPermission } = useAuth();
if (!hasPermission('ADMIN')) {
  return <Unauthorized />;
}
```

### 3. Role Guard Component
```typescript
// ✅ CORRECT: Role-based rendering
export const RoleGuard: React.FC<{
  minimumRole: keyof RoleHierarchy;
  companyId: string;
  children: React.ReactNode;
}> = ({ minimumRole, companyId, children }) => {
  const { user } = useAuth();
  const { data: hasAccess } = useQuery({
    queryKey: ['permission', user.id, minimumRole, companyId],
    queryFn: () => hasPermission(user.id, minimumRole, companyId)
  });
  
  return hasAccess ? <>{children}</> : null;
};
```

## AUDIT LOGGING REQUIREMENT

### 1. Mandatory Action Logging
```typescript
// ✅ REQUIRED: Log all state changes
const logAction = async (
  action: string, 
  userId: string, 
  companyId: string, 
  details: any
) => {
  await supabase.from('configuration_audit_log').insert({
    action,
    changed_by: userId,
    company_id: companyId,
    new_values: details,
    changed_at: new Date().toISOString(),
    reason: `User initiated ${action}`
  });
};
```

### 2. Audit Wrapper Pattern
```typescript
// ✅ PATTERN: Wrap mutations with audit logging
export const withAuditLog = <T extends any[]>(
  fn: (...args: T) => Promise<any>,
  actionName: string
) => {
  return async (...args: T) => {
    const result = await fn(...args);
    await logAction(actionName, getCurrentUserId(), getCurrentCompanyId(), result);
    return result;
  };
};
```

## SUPER ADMIN EXCEPTION PATTERN
```typescript
// ✅ CORRECT: Super admin access with explicit check
const isSuperAdmin = user?.email?.includes('@VibeThink.co') && user?.role === 'OWNER';
if (isSuperAdmin) {
  // Cross-company access allowed
} else {
  // Regular company-scoped access
  query = query.eq('company_id', user.company_id);
}
```

## SECURITY TESTING REQUIREMENTS
- Test data isolation between companies
- Verify role-based access restrictions
- Validate super admin privilege escalation
- Test RLS policy enforcement

**REMEMBER**: Multi-tenant security is NON-NEGOTIABLE. When in doubt, restrict access.
