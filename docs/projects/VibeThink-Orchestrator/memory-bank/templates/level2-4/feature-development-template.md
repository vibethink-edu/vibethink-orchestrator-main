---
complexity: 2-4
tokens_estimated: 1500
template_for: "new_features, integrations, moderate_changes"
max_token_budget: 2000
load_time_target: "1-3 seconds"
---

# Level 2-4: Feature Development Template

## 🎯 Business Context
**Feature**: [Name and brief description]  
**User Story**: As a [role], I want [feature] so that [benefit]  
**Priority**: [High/Medium/Low] - [Business justification]  
**Complexity**: [2/3/4] - [Rationale for complexity level]

## 🏗️ Technical Approach

### Architecture Impact
**Components Affected**: [List of components/files to modify]  
**New Components**: [Components to create]  
**Database Changes**: [Tables/columns/indexes needed]  
**API Changes**: [New endpoints or modifications]

### Multi-tenant Considerations
**Company Isolation**: [How feature respects company_id]  
**Role Permissions**: [Which roles can access this feature]  
**Data Security**: [RLS policies needed]  
**Billing Impact**: [Usage tracking/limits if applicable]

### AI Processing (if applicable)
**OpenAI Usage**: [Which APIs used and estimated costs]  
**Rate Limiting**: [How to handle company limits]  
**Error Handling**: [Fallbacks and retries]

## 📝 Implementation Plan

### Phase 1: Foundation
- [ ] **Database Schema**: [Tables, columns, indexes]
- [ ] **RLS Policies**: [Security policies for multi-tenancy]
- [ ] **Types**: [TypeScript interfaces and types]
- [ ] **Basic Queries**: [CRUD operations with company_id]

### Phase 2: Core Logic
- [ ] **Business Logic**: [Core functionality implementation]
- [ ] **Validation**: [Input validation and sanitization]
- [ ] **Error Handling**: [Proper error management]
- [ ] **Permission Checks**: [Role-based access control]

### Phase 3: UI Integration
- [ ] **Components**: [UI components creation/modification]
- [ ] **State Management**: [React Query setup]
- [ ] **User Feedback**: [Loading states, success/error messages]
- [ ] **Responsive Design**: [Mobile/desktop compatibility]

### Phase 4: Polish & Testing
- [ ] **Unit Tests**: [Component and hook testing]
- [ ] **Integration Tests**: [Multi-tenant data flow]
- [ ] **E2E Tests**: [Full user workflow]
- [ ] **Performance**: [Optimization and monitoring]

## 🔒 Security Checklist

### Multi-tenant Security
- [ ] All queries filter by `company_id`
- [ ] RLS policies properly configured
- [ ] No cross-company data leakage possible
- [ ] Role permissions enforced at all levels

### Data Validation
- [ ] Input sanitization implemented
- [ ] SQL injection prevention
- [ ] XSS protection in place
- [ ] File upload security (if applicable)

### API Security
- [ ] Authentication required
- [ ] Rate limiting implemented
- [ ] Proper error messages (no data leakage)
- [ ] CORS configuration correct

## 🧪 Testing Strategy

### Test Cases
```typescript
describe('Feature Tests', () => {
  test('should respect company isolation', () => {
    // Multi-tenant test
  });
  
  test('should enforce role permissions', () => {
    // Permission test
  });
  
  test('should handle error cases gracefully', () => {
    // Error handling test
  });
});
```

### Multi-tenant Test Scenarios
- [ ] User can only see their company's data
- [ ] Different roles have appropriate access
- [ ] Company limits are enforced
- [ ] Cross-company access blocked

## 📊 Monitoring & Analytics

### Usage Tracking
- [ ] Feature usage metrics
- [ ] Performance metrics
- [ ] Error rate monitoring
- [ ] Company-specific analytics

### AI Usage (if applicable)
- [ ] Request count tracking
- [ ] Cost monitoring
- [ ] Rate limit monitoring
- [ ] Success/failure rates

## 🚀 Deployment Considerations

### Environment Setup
- [ ] Development environment tested
- [ ] Staging deployment verified
- [ ] Production environment ready
- [ ] Database migrations planned

### Rollout Strategy
- [ ] Feature flags implemented (if needed)
- [ ] Gradual rollout plan
- [ ] Rollback procedure defined
- [ ] User communication planned

## 📋 Definition of Done

### Functionality
- [ ] All acceptance criteria met
- [ ] Multi-tenant security verified
- [ ] Role permissions working correctly
- [ ] Error handling comprehensive

### Quality
- [ ] Code review completed
- [ ] Tests passing (unit, integration, E2E)
- [ ] Performance meets requirements
- [ ] Documentation updated

### Security
- [ ] Security review passed
- [ ] No hardcoded secrets
- [ ] Audit logging implemented (if needed)
- [ ] Compliance requirements met

## 🔄 Post-Launch

### Monitoring
- [ ] Feature usage dashboard
- [ ] Error monitoring active
- [ ] Performance tracking in place
- [ ] User feedback collection

### Iteration
- [ ] User feedback analysis
- [ ] Performance optimization
- [ ] Feature enhancement planning
- [ ] Technical debt management

---

**🎯 Level 2-4 Focus**: Balanced implementation with proper architecture, security, and testing  
**📋 Success Metrics**: Feature works reliably, securely, and scales with the multi-tenant architecture 