# XTP v4.6 Methodology Rules

## 🎯 **XTP v4.6 Core Principles**

### **Session Protocol - MANDATORY**
```typescript
// ALWAYS start with session protocol
const sessionInfo = {
  fecha: "DD-MM-YYYY",
  participante: "Nombre del participante",
  rol: "Rol en el proyecto", 
  contexto: "Propósito de la sesión"
};

// VALIDATION REQUIRED
if (!sessionInfo.fecha || !sessionInfo.participante) {
  throw new Error("Información de sesión incompleta");
}
```

### **Task Complexity Levels**
```typescript
// Level 1: Quick Fix (500 tokens)
const level1Task = {
  scope: "Bug fixes, small tweaks",
  documentation: "Minimal",
  testing: "Basic validation",
  review: "Self-review"
};

// Level 2-4: Standard Feature (2000 tokens)
const level2_4Task = {
  scope: "New features, integrations",
  documentation: "Progressive",
  testing: "Comprehensive",
  review: "Peer review"
};

// Level 5: Architecture Change (5000 tokens)
const level5Task = {
  scope: "Major refactoring, security",
  documentation: "Comprehensive",
  testing: "Full suite",
  review: "Architecture review"
};
```

## 📋 **Documentation Standards**

### **Component Documentation**
```typescript
/**
 * @component ComponentName
 * @description Brief description of component purpose
 * @requires PERMISSION_LEVEL
 * @example
 * <ComponentName 
 *   prop1="value"
 *   onAction={handleAction}
 * />
 * @xtpCompliance true
 * @securityReview true
 * @testingRequired true
 */
```

### **XTP Documentation Template**
```markdown
# Component: ComponentName

## XTP v4.6 Compliance
- ✅ Multi-tenant isolation
- ✅ Role-based access control
- ✅ CMMI-ML3 standards
- ✅ Performance optimization

## Security Considerations
- Company_id filtering required
- RLS policies enforced
- Audit logging implemented

## Testing Requirements
- Unit tests for business logic
- Integration tests for API calls
- E2E tests for user flows
- Security tests for permissions
```

## 🔧 **Development Workflow**

### **Git Commit Format**
```bash
# XTP v4.6 commit format
git commit -m "type(scope): description

- Implements XTP v4.6 compliance
- Adds security validations
- Includes comprehensive testing
- Updates documentation

XTP Level: [1-5]
Security Review: [true/false]
Testing Coverage: [percentage]"
```

### **Code Review Checklist**
```typescript
const xtpReviewChecklist = {
  sessionProtocol: "Session info documented",
  securityValidation: "Company_id filtering implemented",
  roleBasedAccess: "Permissions checked",
  testingCoverage: "Tests written and passing",
  documentation: "XTP documentation updated",
  performance: "Performance impact assessed",
  accessibility: "WCAG compliance verified"
};
```

## 🧪 **Testing Requirements**

### **Multi-tenant Testing**
```typescript
describe('XTP v4.6 Multi-tenant Security', () => {
  it('should enforce company isolation', async () => {
    const company1User = createTestUser({ company_id: 'company1' });
    const company2Data = await fetchCompanyData(company1User, 'company2');
    expect(company2Data).toBeNull();
  });

  it('should validate RLS policies', async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('company_id', user.company_id);
    
    expect(error).toBeNull();
  });
});
```

### **Role-based Testing**
```typescript
describe('XTP v4.6 Role-based Access', () => {
  it('should deny unauthorized access', () => {
    const employee = createTestUser({ role: 'EMPLOYEE' });
    const canAccessAdmin = hasPermission(employee, 'ADMIN');
    expect(canAccessAdmin).toBe(false);
  });

  it('should allow authorized access', () => {
    const admin = createTestUser({ role: 'ADMIN' });
    const canAccessAdmin = hasPermission(admin, 'ADMIN');
    expect(canAccessAdmin).toBe(true);
  });
});
```

## 📊 **Quality Metrics**

### **Required Metrics**
```typescript
const xtpQualityMetrics = {
  security: "100% multi-tenant isolation",
  performance: "<2s load time for main features",
  testing: ">90% coverage for critical paths",
  documentation: "100% XTP v4.6 compliance",
  accessibility: "WCAG 2.1 AA compliance",
  codeQuality: "ESLint + Prettier passing"
};
```

### **Monitoring**
```typescript
const xtpMonitoring = {
  sessionTracking: "All sessions documented",
  securityAudit: "Regular security reviews",
  performanceMetrics: "Load time monitoring",
  testCoverage: "Coverage reports",
  documentationStatus: "Documentation completeness"
};
```

## 🚫 **Anti-Patterns**

### **XTP Violations**
```typescript
// ❌ NEVER do this:
// Missing session protocol
// No security validation
// No testing
// No documentation
// No performance consideration
// No accessibility compliance
```

### **Security Violations**
```typescript
// ❌ NEVER do this:
const users = await supabase.from('users').select('*'); // No company_id filter
const adminData = await fetchAdminData(); // No permission check
```

### **Quality Violations**
```typescript
// ❌ NEVER do this:
// Using 'any' type in TypeScript
// No error handling
// No loading states
// No accessibility attributes
```

---

**Follow these rules to maintain XTP v4.6 compliance and quality standards.** 