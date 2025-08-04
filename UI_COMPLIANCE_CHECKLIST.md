# ✅ UI Compliance Checklist - AI Self-Validation

> **For AI Assistants:** Use this checklist to verify compliance with UI standards before completing any task.

## 🚨 **CRITICAL PRE-FLIGHT CHECKS**

### **1. Layout Validation**
- [ ] ✅ Used `BunduiCompleteLayout` for dashboard pages
- [ ] ❌ Did NOT use `DashboardLayout` or manual layout
- [ ] ✅ Wrapped content in `<div className="space-y-6">`
- [ ] ✅ Followed standard page structure

### **2. Color System Validation**  
- [ ] ✅ Used only HSL color format: `hsl(var(--chart-1))`
- [ ] ✅ Used HSL direct values: `hsl(12 88% 59%)`
- [ ] ❌ Did NOT use hex colors: `#FF6B35`
- [ ] ❌ Did NOT use RGB colors: `rgb(255,107,53)`
- [ ] ❌ Did NOT use OKLCH colors

### **3. Component Import Validation**
- [ ] ✅ Prioritized Bundui Premium imports: `@/shared/components/bundui-premium/components/ui/`
- [ ] ✅ Used Shared UI as fallback: `@/shared/components/ui/`
- [ ] ❌ Did NOT use root level imports: `@/components/ui/`

### **4. Chart Implementation Validation** 
- [ ] ✅ All `yAxisId` have matching `YAxis` components
- [ ] ✅ Used HSL colors for chart elements
- [ ] ✅ Proper Recharts component structure
- [ ] ✅ Responsive container implementation

### **5. React Hooks Validation**
- [ ] ✅ `useCallback` dependencies are stable (no objects)
- [ ] ✅ Empty dependency arrays `[]` for static functions
- [ ] ❌ Did NOT include `supabase` client in dependencies
- [ ] ✅ No circular dependency patterns

### **6. Security Validation**
- [ ] ✅ All database queries filter by `company_id`
- [ ] ✅ Used `.eq('company_id', user.company_id)` pattern
- [ ] ✅ Multi-tenant security maintained
- [ ] ❌ Did NOT create queries without tenant filtering

### **7. File Structure Validation**
- [ ] ✅ Dashboard in correct location: `apps/dashboard/app/[name]/page.tsx`
- [ ] ✅ Components in `components/` subdirectory
- [ ] ✅ Hooks in `hooks/` subdirectory  
- [ ] ✅ Types in `types/` subdirectory

### **8. Responsive Design Validation**
- [ ] ✅ Used responsive grid classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- [ ] ✅ Mobile-first approach
- [ ] ✅ Proper breakpoint handling
- [ ] ✅ Content works on all screen sizes

## 📋 **COMPONENT-SPECIFIC CHECKS**

### **Dashboard Pages Checklist**
```typescript
// ✅ Required structure validation
'use client'                                    // [ ] Present
import BunduiCompleteLayout                     // [ ] Correct import
export default function YourDashboardPage()    // [ ] Proper naming
return <BunduiCompleteLayout>                   // [ ] Proper wrapper
  <div className="space-y-6">                  // [ ] Standard spacing
```

### **Chart Components Checklist**  
```typescript
// ✅ Required Recharts validation
<YAxis />                           // [ ] Default axis present
<YAxis yAxisId="custom" />          // [ ] Custom axis if needed
<Area yAxisId="custom" />           // [ ] Matching yAxisId
stroke="hsl(var(--chart-1))"       // [ ] HSL colors only
```

### **Hook Implementation Checklist**
```typescript
// ✅ Required hook validation
const useYourHook = () => {
  const fetchData = useCallback(async () => {
    // API calls
  }, [])                            // [ ] Empty or stable dependencies
  
  useEffect(() => {
    fetchData()
  }, [fetchData])                   // [ ] Stable function reference
}
```

## 🛠️ **DEBUGGING CHECKLIST**

### **If Getting Layout Issues:**
- [ ] Verify using `BunduiCompleteLayout`
- [ ] Check for conflicting layout imports
- [ ] Ensure proper content wrapper: `space-y-6`

### **If Getting Color/Theme Issues:**
- [ ] Verify all colors use HSL format
- [ ] Check CSS variable usage: `hsl(var(--chart-X))`
- [ ] Confirm no hex/rgb colors in components

### **If Getting Chart Errors:**
- [ ] Check `yAxisId` pairing between `YAxis` and data components
- [ ] Verify chart color format (HSL only)
- [ ] Confirm responsive container setup

### **If Getting Infinite Loop Errors:**
- [ ] Review `useCallback` dependencies
- [ ] Remove object dependencies (supabase, etc.)
- [ ] Simplify dependency arrays to essentials only

### **If Getting Import Errors:**
- [ ] Check import path hierarchy (Bundui Premium first)
- [ ] Verify component exists in target location
- [ ] Use fallback imports if primary not available

## 🎯 **SUCCESS CRITERIA**

### **PASS:** All checkboxes marked ✅
- UI follows established patterns
- Security maintained  
- Performance optimized
- Responsive design implemented
- Error-free implementation

### **FAIL:** Any ❌ checkbox marked or critical check missing
- Must fix issues before proceeding
- Review `UI_DOCUMENTATION_CENTRAL.md`
- Apply corrections and re-validate

## 📚 **Quick Reference Links**

- **Complete Standards:** `UI_DOCUMENTATION_CENTRAL.md`
- **Working Examples:** 
  - `apps/dashboard/app/ecommerce-dashboard/page.tsx`
  - `apps/dashboard/app/crypto-dashboard/page.tsx`
  - `apps/dashboard/app/finance-dashboard/components/CashFlowChart.tsx`

---

**AI Assistant Instruction:** Run through this checklist for EVERY UI-related change. If any check fails, fix the issue before completing the task.

**Last Updated:** January 2025