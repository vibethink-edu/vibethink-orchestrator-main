# 🏗️ MONOREPO EXCEPTIONS - VibeThink Orchestrator

> **🚨 CRITICAL:** Apps que NO siguen las reglas estándar del monorepo
> **📅 Created:** 2025-01-12
> **🎯 Purpose:** Evitar falsos positivos en validaciones y reglas

---

## 🔍 **APPS EXCEPTUADAS**

### **🌐 apps/website/ - Marketing Website**
- **Purpose**: Marketing site, landing pages, documentation
- **Architecture**: Standalone Next.js app (non-multitenant)
- **Source**: External import from cosmic-main
- **Exceptions**:
  - ❌ **No multi-tenant**: No company_id filtering
  - ❌ **No RLS policies**: No Supabase database
  - ❌ **No auth system**: Public marketing site
  - ❌ **Independent deps**: Can use different versions

### **📚 apps/bundui-reference/ - Component Reference**
- **Purpose**: Official bundui-premium reference for development
- **Architecture**: Pure bundui-premium implementation
- **Source**: Direct copy from external/bundui-premium
- **Exceptions**:
  - ❌ **No multi-tenant**: Pure UI showcase
  - ❌ **No RLS policies**: No database integration
  - ❌ **No auth system**: Demo/reference only
  - ❌ **Independent deps**: Uses bundui-premium exact versions

---

## 🛡️ **VALIDATION EXCEPTIONS**

### **Security Validator Exceptions**
```javascript
// In dev-tools/validation/security-validator.cjs
const EXEMPT_APPS = [
  'apps/website',           // Marketing site - no auth needed
  'apps/bundui-reference'   // Reference implementation - no auth needed
];

// Skip company_id validation for these apps
if (EXEMPT_APPS.some(exempt => filePath.includes(exempt))) {
  return; // Skip multi-tenant checks
}
```

### **Architecture Validator Exceptions**
```javascript
// In dev-tools/validation/architecture-validator.cjs
const NON_MULTITENANT_APPS = [
  'website',
  'bundui-reference'
];

// Skip database schema validation
function skipMultiTenantChecks(appName) {
  return NON_MULTITENANT_APPS.includes(appName);
}
```

### **Cross-App Validator Exceptions**
```javascript
// In dev-tools/validation/cross-app-validator.cjs
const STANDALONE_APPS = [
  'website',           // Marketing - independent
  'bundui-reference'   // Reference - independent
];

// These apps can have different dependency versions
function isStandaloneApp(appName) {
  return STANDALONE_APPS.includes(appName);
}
```

---

## 📋 **DEPENDENCY MANAGEMENT EXCEPTIONS**

### **Website Dependencies**
```json
{
  "exceptions": {
    "react": "^19.0.0",          // ✅ Can use React 19 (marketing)
    "next": "^15.3.4",           // ✅ Can use caret versions
    "framer-motion": "latest"    // ✅ Animation library for marketing
  },
  "rationale": "Marketing site needs latest features for UX"
}
```

### **Bundui-Reference Dependencies**
```json
{
  "exceptions": {
    "preserve_original": true,    // ✅ Keep bundui-premium exact versions
    "no_modification": true,      // ✅ Don't change package.json
    "independent_install": true   // ✅ Install independently
  },
  "rationale": "Reference must match official bundui-premium exactly"
}
```

---

## ⚠️ **VALIDATION RULE UPDATES NEEDED**

### **1. Update Security Validator**
```javascript
// Add to dev-tools/validation/security-validator.cjs
const MARKETING_APPS = ['website', 'bundui-reference'];

function skipSecurityChecks(filePath) {
  return MARKETING_APPS.some(app => filePath.includes(`apps/${app}`));
}

// Skip company_id, RLS, and auth checks for marketing apps
```

### **2. Update Architecture Validator**
```javascript
// Add to dev-tools/validation/architecture-validator.cjs
const STANDALONE_APPS = ['website', 'bundui-reference'];

function validateMultiTenantArchitecture(appPath) {
  const appName = path.basename(appPath);
  
  if (STANDALONE_APPS.includes(appName)) {
    return { valid: true, reason: 'Standalone app - multitenant not required' };
  }
  
  // Continue with normal multitenant validation
}
```

### **3. Update Dependency Validator**
```javascript
// Add to dev-tools/validation/dependency-validator.cjs
const FLEXIBLE_APPS = ['website', 'bundui-reference'];

function checkDependencyVersions(appName, deps) {
  if (FLEXIBLE_APPS.includes(appName)) {
    // Allow caret versions and independent choices
    return validateFlexibleDependencies(deps);
  }
  
  // Enforce exact versions for core apps
  return validateExactDependencies(deps);
}
```

---

## 🚀 **IMPLEMENTATION PRIORITY**

### **High Priority (Immediate)**
1. ✅ Update `security-validator.cjs` - Skip multitenant checks
2. ✅ Update `architecture-validator.cjs` - Skip RLS validation
3. ✅ Update `cross-app-validator.cjs` - Allow different dependencies

### **Medium Priority (This Week)**
1. ✅ Update `dependency-validator.cjs` - Allow caret versions
2. ✅ Update validation documentation
3. ✅ Test all validators with exceptions

### **Low Priority (As Needed)**
1. ✅ Update other validators as they encounter false positives
2. ✅ Add specific tests for exception handling

---

## 📊 **MONITORING EXCEPTIONS**

### **Health Reports Should Show**
```yaml
Core Apps (Multitenant): 4/5 ✅
  - dashboard: ✅ Compliant
  - admin: ✅ Compliant  
  - login: ✅ Compliant
  - helpdesk: ✅ Compliant

Standalone Apps (Marketing): 2/2 ✅
  - website: ✅ Marketing exception
  - bundui-reference: ✅ Reference exception

Total System Health: ✅ 100% Compliant
```

### **Validation Commands**
```bash
# Core apps only (multitenant)
npm run validate:core-apps

# All apps including exceptions
npm run validate:all-apps  

# Exception-aware validation
npm run validate:universal  # Should handle exceptions automatically
```

---

## 🎯 **QUICK REFERENCE**

### **Is this app multitenant?**
```bash
✅ YES: dashboard, admin, login, helpdesk
❌ NO:  website, bundui-reference
```

### **Should this app have company_id filtering?**
```bash
✅ YES: dashboard, admin, login, helpdesk  
❌ NO:  website, bundui-reference
```

### **Can this app use caret dependencies?**
```bash
❌ NO:  dashboard, admin, login, helpdesk (use exact versions)
✅ YES: website, bundui-reference (marketing flexibility allowed)
```

---

**🚨 REMEMBER:** These exceptions are architectural decisions, not oversights. Marketing and reference apps have different requirements than core business applications.