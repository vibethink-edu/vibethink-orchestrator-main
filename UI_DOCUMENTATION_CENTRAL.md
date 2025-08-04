# 🎨 UI Documentation Central - VibeThink Orchestrator

> **CRITICAL:** This is the **SINGLE SOURCE OF TRUTH** for all UI components, layouts, and patterns in the VibeThink Orchestrator platform. ALL AI assistants (Claude, Gemini, Cursor, etc.) MUST follow these standards.

## 🚨 **MANDATORY UI STANDARDS**

### **Layout System - USE ONLY THESE**

#### ✅ **CORRECT: BunduiCompleteLayout (Current Standard)**
```typescript
// ✅ ALWAYS USE THIS for all dashboard pages
import BunduiCompleteLayout from '@/shared/components/bundui-premium/components/layout/BunduiCompleteLayout'

export default function YourDashboardPage() {
  return (
    <BunduiCompleteLayout>
      <div className="space-y-6">
        {/* Your dashboard content */}
      </div>
    </BunduiCompleteLayout>
  )
}
```

#### ❌ **FORBIDDEN: Do NOT use these layouts**
```typescript
// ❌ NEVER USE - Causes spacing issues
import DashboardLayout from '@/shared/components/layouts/DashboardLayout'

// ❌ NEVER USE - Inconsistent navigation  
import { AppSidebar } from '@/shared/components/layout/sidebar'

// ❌ NEVER USE - Manual layout creation
<div className="flex">
  <Sidebar />
  <main>...</main>
</div>
```

### **Component Import Hierarchy - FOLLOW THIS ORDER**

#### **1. Layout Components (HIGHEST PRIORITY)**
```typescript
// ✅ PRIMARY - Always use when available
import BunduiCompleteLayout from '@/shared/components/bundui-premium/components/layout/BunduiCompleteLayout'
```

#### **2. UI Components (PREFERRED ORDER)**
```typescript
// ✅ FIRST CHOICE - Bundui Premium (when available)
import { Button } from '@/shared/components/bundui-premium/components/ui/button'
import { Card } from '@/shared/components/bundui-premium/components/ui/card'

// ✅ SECOND CHOICE - Shared UI (fallback)  
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'

// ❌ NEVER - Root level components
import { Button } from '@/components/ui/button'
```

#### **3. Specialized Components**
```typescript
// ✅ Dashboard-specific components
import { RevenueChart } from './components/RevenueChart'

// ✅ Shared specialized components
import { EmailTester } from '@/shared/components/EmailTester'
```

## 🎯 **Dashboard Implementation Standards**

### **Required Structure for ALL Dashboards**
```typescript
'use client'

import React, { useState } from 'react'
import BunduiCompleteLayout from '@/shared/components/bundui-premium/components/layout/BunduiCompleteLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card'
// ... other imports

export default function YourDashboardPage() {
  // State management
  const [loading, setLoading] = useState(false)
  
  // Data hooks (with mock data)
  const { data, loading: dataLoading, error } = useYourData()

  // Loading state
  if (loading || dataLoading) {
    return (
      <BunduiCompleteLayout>
        <div className="space-y-6">
          {/* Loading skeletons */}
        </div>
      </BunduiCompleteLayout>
    )
  }

  // Error state  
  if (error) {
    return (
      <BunduiCompleteLayout>
        <div className="flex items-center justify-center h-96">
          {/* Error message */}
        </div>
      </BunduiCompleteLayout>
    )
  }

  return (
    <BunduiCompleteLayout>
      <div className="space-y-6">
        {/* Dashboard header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Title</h1>
          <p className="text-muted-foreground">Dashboard description</p>
        </div>

        {/* Dashboard content */}
        <div className="grid gap-6">
          {/* Cards, charts, tables, etc. */}
        </div>
      </div>
    </BunduiCompleteLayout>
  )
}
```

## 🎨 **Color System - HSL ONLY**

### **✅ CORRECT: HSL Color Variables**
```typescript
// ✅ ALWAYS USE - Theme-compatible HSL variables
const chartColors = {
  primary: 'hsl(var(--chart-1))',    // Blue
  secondary: 'hsl(var(--chart-2))',  // Green  
  tertiary: 'hsl(var(--chart-3))',   // Orange
  quaternary: 'hsl(var(--chart-4))', // Purple
  quinary: 'hsl(var(--chart-5))'     // Red
}

// ✅ Direct HSL values (when variables not available)
backgroundColor: 'hsl(12 88% 59%)'  // Orange
color: 'hsl(142 76% 36%)'          // Green
```

### **❌ FORBIDDEN: Other Color Formats**
```typescript
// ❌ NEVER USE - Not compatible with theming
backgroundColor: '#FF6B35'          // Hex colors
color: 'rgb(255, 107, 53)'         // RGB colors  
backgroundColor: 'oklch(0.7 0.15 45)' // OKLCH colors
```

## 📊 **Charts Standards (Recharts)**

### **✅ CORRECT: Proper Axis Configuration**
```typescript
// ✅ ALWAYS match yAxisId between YAxis and data components
<YAxis />  {/* Default axis */}
<YAxis yAxisId="secondary" orientation="right" />
<Area dataKey="data1" />  {/* Uses default axis */}
<Area dataKey="data2" yAxisId="secondary" />  {/* Uses secondary axis */}

// ✅ CORRECT color usage
<Area 
  dataKey="value"
  stroke="hsl(var(--chart-1))"
  fill="hsl(var(--chart-1))"
  fillOpacity={0.3}
/>
```

### **❌ FORBIDDEN: Mismatched Configurations**
```typescript
// ❌ NEVER - Unmatched yAxisId causes runtime errors
<YAxis />
<Area dataKey="data" yAxisId="missing" />  // No matching YAxis

// ❌ NEVER - Non-HSL colors break theming
<Area fill="#FF6B35" stroke="rgb(255,107,53)" />
```

## 🔧 **React Hooks Best Practices**

### **✅ CORRECT: Stable Dependencies**
```typescript
// ✅ GOOD - Empty dependencies for static functions
const fetchData = useCallback(async (id: string) => {
  // API logic using static supabase client
}, []) 

// ✅ GOOD - Only essential dependencies
const processData = useCallback((data) => {
  return data.filter(item => item.company_id === companyId)
}, [companyId])
```

### **❌ FORBIDDEN: Unstable Dependencies**
```typescript
// ❌ NEVER - Object dependencies cause infinite loops
const fetchData = useCallback(async () => {
  // API logic
}, [supabaseClient]) // Object recreated every render

// ❌ NEVER - Unnecessary function dependencies
const refreshData = useCallback(async () => {
  await fetchUsers()
  await fetchPosts() 
}, [fetchUsers, fetchPosts]) // Functions recreated every render
```

## 🗂️ **File Organization Standards**

### **Dashboard Structure**
```
apps/dashboard/app/your-dashboard/
├── page.tsx                 ✅ Main dashboard page (uses BunduiCompleteLayout)
├── components/              ✅ Dashboard-specific components
│   ├── YourChart.tsx        
│   ├── YourTable.tsx
│   └── YourHeader.tsx
├── hooks/                   ✅ Data management hooks
│   ├── useYourData.ts       
│   └── useYourFilters.ts
└── types/                   ✅ TypeScript type definitions
    └── index.ts
```

### **Import Paths Priority**
```typescript
// 1. ✅ Bundui Premium (highest priority)
import { Component } from '@/shared/components/bundui-premium/components/ui/component'

// 2. ✅ Shared UI (fallback)
import { Component } from '@/shared/components/ui/component'

// 3. ✅ Local components (lowest priority)
import { Component } from './components/Component'
```

## 🛡️ **Security Standards**

### **Multi-tenant Data Filtering (CRITICAL)**
```typescript
// ✅ ALWAYS filter by company_id in ALL queries
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('company_id', user.company_id) // 🔒 CRITICAL SECURITY

// ✅ Use .match() for multiple conditions
.match({ 
  company_id: user.company_id,
  is_active: true 
})

// ❌ NEVER query without company_id filtering
const { data, error } = await supabase
  .from('table_name')
  .select('*') // 🚨 SECURITY VIOLATION
```

## 📱 **Responsive Design Patterns**

### **✅ CORRECT: Mobile-First Grid System**
```typescript
// ✅ Standard responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

// ✅ Responsive card layouts  
<div className="grid gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2">{/* Main content */}</div>
  <div>{/* Sidebar content */}</div>
</div>
```

## 🧪 **Testing & Validation**

### **Required Checks Before Deployment**
1. ✅ **Layout Consistency:** All pages use `BunduiCompleteLayout`
2. ✅ **Color Compliance:** Only HSL color variables used
3. ✅ **Chart Validation:** All `yAxisId` properly paired
4. ✅ **Hook Stability:** No infinite loops in `useCallback`/`useEffect`
5. ✅ **Security Check:** All queries filter by `company_id`
6. ✅ **Responsive Test:** Mobile/tablet/desktop layouts work
7. ✅ **Import Paths:** Follow hierarchy (Bundui Premium → Shared → Local)

## 🚨 **AI Assistant Instructions**

### **MANDATORY FOR ALL AI ASSISTANTS:**

1. **ALWAYS read this document FIRST** before making UI changes
2. **NEVER deviate** from these standards without explicit user approval  
3. **ALWAYS use BunduiCompleteLayout** for dashboard pages
4. **ALWAYS use HSL colors** with proper CSS variables
5. **ALWAYS validate Recharts** axis configurations
6. **ALWAYS check hook dependencies** for stability
7. **ALWAYS filter queries** by `company_id` for security

### **When in Doubt:**
- ✅ **Follow the patterns** in existing working dashboards
- ✅ **Use the most restrictive/secure** option
- ✅ **Ask for clarification** rather than guessing
- ✅ **Document any deviations** with justification

## 📚 **Reference Examples**

### **Perfect Dashboard Examples (USE AS TEMPLATES):**
- `apps/dashboard/app/ecommerce-dashboard/page.tsx` ✅ Layout reference
- `apps/dashboard/app/crypto-dashboard/page.tsx` ✅ Complex dashboard
- `apps/dashboard/app/finance-dashboard/page.tsx` ✅ Charts implementation

### **Component Examples:**
- `CashFlowChart.tsx` ✅ Proper Recharts implementation
- `BunduiCompleteLayout.tsx` ✅ Layout standard
- `useFileManagerData.ts` ✅ Stable hooks pattern

---

## 🎯 **SUCCESS CRITERIA**

A UI implementation is **SUCCESSFUL** when:
- ✅ Uses `BunduiCompleteLayout` for consistent layout
- ✅ Follows HSL color system for theming compatibility  
- ✅ Has stable React hooks without infinite loops
- ✅ Implements proper security with `company_id` filtering
- ✅ Works responsively across all device sizes
- ✅ Follows the import hierarchy for component selection

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Compliance:** Mandatory for ALL AI assistants