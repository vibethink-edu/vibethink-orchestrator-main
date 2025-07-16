---
complexity: 1
tokens_estimated: 300
template_for: "bug_fixes, quick_tweaks, immediate_issues"
max_token_budget: 500
load_time_target: "< 1 second"
---

# Level 1: Quick Fix Template

## 🎯 Problem Context
**Issue**: [Brief description of the bug/issue]  
**Affected**: [Component/function/feature affected]  
**Severity**: [High/Medium/Low - for prioritization]

## 🔍 Root Cause
**Located in**: `[file:line]` or `[component name]`  
**Cause**: [One-line explanation of what's wrong]

## ✅ Solution
**Fix**: [Concise description of the fix]  
**Code Change**: 
```typescript
// Before (if relevant)
[problematic code]

// After
[fixed code]
```

## 🧪 Verification
- [ ] **Test**: [How to verify the fix works]
- [ ] **Edge Cases**: [Any edge cases to check]
- [ ] **Regression**: [Ensure no new issues]

## 📋 Company Context (if needed)
**Multi-tenant Impact**: [None/Verify company_id/Check RLS]  
**Role Permissions**: [None/Check user role/Verify access]

---
**⚡ Level 1 Checklist**: Problem → Solution → Test → Deploy  
**🎯 Keep it simple**: Minimal context, focused fix, quick verification 