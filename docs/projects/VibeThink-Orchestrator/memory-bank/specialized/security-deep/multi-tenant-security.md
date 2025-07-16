---
complexity: 4
tokens_estimated: 1200
dependencies: ["common/architecture/system-overview.md", "essential/critical-decisions.md"]
last_updated: "2024-12-18"
relevant_for: ["security", "architecture", "development"]
load_priority: "specialized"
trigger_keywords: ["security", "rls", "multi-tenant", "permission", "audit"]
---

# Deep Multi-Tenant Security - VibeThink Orchestrator

## 🔒 Row Level Security (RLS) Deep Dive

### Policy Architecture
```sql
-- Master template for all multi-tenant tables
CREATE POLICY "tenant_isolation" ON {table_name}
  FOR ALL USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
  );

-- Enhanced policy with role checking
CREATE POLICY "role_based_access" ON {sensitive_table}
  FOR ALL USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    AND (
      (auth.jwt() ->> 'role')::text IN ('OWNER', 'ADMIN') 
      OR created_by = auth.uid()
    )
  );
```

### SUPPORT Role Special Handling
```sql
-- SUPPORT role cross-company access (LIMITED)
CREATE POLICY "support_cross_company_read" ON companies
  FOR SELECT USING (
    -- Normal company isolation
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR 
    -- SUPPORT role limited access
    (
      (auth.jwt() ->> 'role')::text = 'SUPPORT'
      AND (auth.jwt() ->> 'company_id')::uuid = 'VibeThink-platform-company-id'
      AND is_support_action_logged() -- Custom function
    )
  );

-- Support action logging function
CREATE OR REPLACE FUNCTION is_support_action_logged()
RETURNS boolean AS $$
BEGIN
  -- Log every SUPPORT cross-company access
  INSERT INTO support_actions_log (
    support_user_id,
    target_company_id,
    action_type,
    timestamp,
    session_context
  ) VALUES (
    auth.uid(),
    current_setting('app.target_company_id', true)::uuid,
    'cross_company_access',
    now(),
    current_setting('app.session_context', true)
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🛡️ Advanced Security Patterns

### Company Isolation Validation
```typescript
// TypeScript helper for secure queries
export class SecureQueryBuilder {
  constructor(private supabase: SupabaseClient, private user: User) {
    if (!user.company_id) {
      throw new Error('User must have company_id for secure queries');
    }
  }

  // Always include company_id filter
  from<T>(table: string) {
    return this.supabase
      .from(table)
      .select('*')
      .eq('company_id', this.user.company_id);
  }

  // SUPPORT role special query (with audit)
  async supportQuery<T>(table: string, targetCompanyId: string) {
    if (this.user.role !== 'SUPPORT' || this.user.company_id !== 'VibeThink-platform-id') {
      throw new Error('Unauthorized cross-company access');
    }

    // Log support action
    await this.logSupportAction('cross_company_query', targetCompanyId);

    return this.supabase
      .from(table)
      .select('*')
      .eq('company_id', targetCompanyId);
  }

  private async logSupportAction(action: string, targetCompanyId: string) {
    await this.supabase.from('support_actions_log').insert({
      support_user_id: this.user.id,
      target_company_id: targetCompanyId,
      action_type: action,
      timestamp: new Date().toISOString(),
      session_context: window.location.pathname
    });
  }
}
```

### Data Validation & Sanitization
```typescript
// Company-aware validation
export const validateCompanyData = z.object({
  company_id: z.string().uuid(),
  // Ensure company_id matches authenticated user
}).refine(
  (data) => data.company_id === getCurrentUser()?.company_id,
  "Company ID must match authenticated user's company"
);

// Input sanitization for multi-tenant context
export function sanitizeForCompany(input: any, userCompanyId: string) {
  // Remove any company_id manipulation attempts
  const sanitized = { ...input };
  delete sanitized.company_id;
  
  // Add proper company_id
  sanitized.company_id = userCompanyId;
  
  return sanitized;
}
```

## 🔍 Audit & Compliance

### Comprehensive Audit Logging
```sql
-- Audit log table for all sensitive operations
CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  company_id uuid REFERENCES companies(id),
  action_type text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  timestamp timestamptz DEFAULT now(),
  session_id text
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger AS $$
BEGIN
  INSERT INTO audit_log (
    user_id,
    company_id,
    action_type,
    resource_type,
    resource_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    session_id
  ) VALUES (
    auth.uid(),
    COALESCE(NEW.company_id, OLD.company_id),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(OLD) END,
    CASE WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW) ELSE to_jsonb(NEW) END,
    current_setting('app.client_ip', true)::inet,
    current_setting('app.user_agent', true),
    current_setting('app.session_id', true)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### GDPR Compliance Patterns
```typescript
// Data export for GDPR compliance
export async function exportUserData(userId: string, requestingCompanyId: string) {
  const secureQuery = new SecureQueryBuilder(supabase, getCurrentUser());
  
  // Get all user data from company-scoped tables
  const userData = await Promise.all([
    secureQuery.from('user_documents').eq('created_by', userId),
    secureQuery.from('meeting_transcriptions').eq('created_by', userId),
    secureQuery.from('ai_usage_logs').eq('user_id', userId),
    // ... other user data tables
  ]);

  return {
    user_id: userId,
    company_id: requestingCompanyId,
    export_date: new Date().toISOString(),
    data: userData
  };
}

// Data deletion for GDPR compliance
export async function deleteUserData(userId: string, companyId: string) {
  // Verify user belongs to requesting company
  const user = await supabase
    .from('users')
    .select('company_id')
    .eq('id', userId)
    .single();

  if (user.data?.company_id !== companyId) {
    throw new Error('Cannot delete user from different company');
  }

  // Delete from all tables (with company_id verification)
  await Promise.all([
    supabase.from('user_documents').delete().eq('created_by', userId).eq('company_id', companyId),
    supabase.from('meeting_transcriptions').delete().eq('created_by', userId).eq('company_id', companyId),
    // ... other deletions
  ]);
}
```

## 🚨 Security Incident Response

### Threat Detection
```typescript
// Automated threat detection
export class ThreatDetector {
  async detectAnomalousActivity(userId: string) {
    // Multiple company access attempts
    const crossCompanyAttempts = await this.checkCrossCompanyAccess(userId);
    
    // Unusual AI usage patterns
    const aiAbuseAttempts = await this.checkAIAbuse(userId);
    
    // SQL injection attempts
    const sqlInjectionAttempts = await this.checkSQLInjection(userId);
    
    if (crossCompanyAttempts || aiAbuseAttempts || sqlInjectionAttempts) {
      await this.triggerSecurityAlert(userId, {
        crossCompanyAttempts,
        aiAbuseAttempts,
        sqlInjectionAttempts
      });
    }
  }

  private async triggerSecurityAlert(userId: string, threats: any) {
    // Log security incident
    await supabase.from('security_incidents').insert({
      user_id: userId,
      incident_type: 'threat_detection',
      details: threats,
      severity: this.calculateSeverity(threats),
      status: 'open'
    });

    // Alert security team
    await this.notifySecurityTeam(userId, threats);
  }
}
```

### Access Control Verification
```typescript
// Runtime permission verification
export function verifyAccess(user: User, resource: any, operation: string) {
  // Company isolation check
  if (resource.company_id !== user.company_id) {
    // Only SUPPORT role can access cross-company with restrictions
    if (user.role !== 'SUPPORT' || user.company_id !== 'VibeThink-platform-id') {
      throw new SecurityError('Cross-company access denied');
    }
    
    // Log SUPPORT cross-company access
    logSupportAccess(user.id, resource.company_id, operation);
  }

  // Role-based access control
  const requiredRole = getRequiredRole(operation);
  if (!hasPermission(user.role, requiredRole)) {
    throw new SecurityError(`Insufficient permissions: ${operation} requires ${requiredRole}`);
  }

  return true;
}

// Permission hierarchy validation
function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy = ['EMPLOYEE', 'MANAGER', 'ADMIN', 'OWNER', 'SUPPORT', 'SUPER_ADMIN'];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole);
}
```

## 🔐 Security Testing Patterns

### Multi-tenant Security Tests
```typescript
describe('Multi-tenant Security', () => {
  test('prevents cross-company data access', async () => {
    const company1 = await createTestCompany();
    const company2 = await createTestCompany();
    
    const user1 = await createTestUser(company1.id);
    const document2 = await createTestDocument(company2.id);
    
    // User1 should not be able to access company2's document
    await expect(
      fetchDocument(user1, document2.id)
    ).rejects.toThrow('Access denied');
  });

  test('SUPPORT role has limited cross-company access', async () => {
    const supportUser = await createSupportUser();
    const targetCompany = await createTestCompany();
    
    // Support can view company data
    const companyData = await fetchCompanyData(supportUser, targetCompany.id);
    expect(companyData).toBeDefined();
    
    // But cannot modify without proper authorization
    await expect(
      updateCompanyData(supportUser, targetCompany.id, { name: 'Changed' })
    ).rejects.toThrow('Insufficient permissions');
    
    // And all actions are logged
    const auditLogs = await getAuditLogs(supportUser.id);
    expect(auditLogs).toContain({
      action: 'cross_company_access',
      target_company_id: targetCompany.id
    });
  });
});
```

## 📊 Security Monitoring

### Real-time Security Metrics
```typescript
// Security dashboard metrics
export async function getSecurityMetrics(companyId: string) {
  return {
    // Authentication metrics
    failed_logins: await getFailedLogins(companyId),
    successful_logins: await getSuccessfulLogins(companyId),
    
    // Access control metrics
    permission_denials: await getPermissionDenials(companyId),
    role_escalation_attempts: await getRoleEscalationAttempts(companyId),
    
    // Data access metrics
    cross_company_access_attempts: await getCrossCompanyAttempts(companyId),
    sensitive_data_access: await getSensitiveDataAccess(companyId),
    
    // AI security metrics
    ai_quota_violations: await getAIQuotaViolations(companyId),
    suspicious_ai_patterns: await getSuspiciousAIPatterns(companyId)
  };
}
```

### Automated Security Responses
```typescript
// Automated response to security events
export class SecurityAutomation {
  async handleSecurityEvent(event: SecurityEvent) {
    switch (event.type) {
      case 'multiple_failed_logins':
        await this.temporaryAccountLock(event.userId);
        break;
        
      case 'cross_company_access_violation':
        await this.alertSecurityTeam(event);
        await this.logSecurityIncident(event);
        break;
        
      case 'ai_quota_exceeded':
        await this.temporaryAIDisable(event.companyId);
        break;
        
      case 'sql_injection_attempt':
        await this.blockUserSession(event.userId);
        await this.alertSecurityTeam(event);
        break;
    }
  }
}
```

---

**🔒 Security Principle**: Defense in depth with multi-layered security controls

**🎯 Zero Trust**: Never trust, always verify - especially for cross-company operations

**📊 Continuous Monitoring**: Real-time threat detection and automated responses 