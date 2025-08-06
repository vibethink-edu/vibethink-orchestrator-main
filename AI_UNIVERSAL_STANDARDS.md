# AI Universal Standards - VThink 1.0

## 🤖 **FOR ALL AIs: Claude, Gemini, Cursor, GitHub Copilot, etc.**

**CRITICAL**: These standards apply to ALL AI assistants working on this project. No exceptions.

---

## 🎯 **Core Architectural Decisions - NON-NEGOTIABLE**

### **1. Color Standards - ABSOLUTE RULE**
```typescript
// ✅ ALWAYS USE - No exceptions for any AI
color: "hsl(var(--chart-1))"
colors: ["hsl(12 88% 59%)"]

// ❌ NEVER USE - Will break shadcn/ui compatibility
color: "oklch(0.5827 0.2418 12.23)" 
color: "#e11d48"
```

**Reason**: Shadcn/ui compatibility. Prevents future refactoring.

### **2. Import Patterns - MANDATORY**
```typescript
// ✅ ALWAYS USE
import { Component } from '@/shared/components/bundui-premium/components/ui/component';

// ❌ NEVER USE  
import { Component } from '../../../ui/component';
import { Component } from './node_modules/...';
```

### **3. Component Pattern - REQUIRED**
```typescript
// ✅ ALWAYS FOLLOW
"use client";

import { ... } from "@/shared/...";

export function ComponentName() {
  return (
    <div className="bg-background border">
      {/* Always use bg-background for solid backgrounds */}
    </div>
  );
}
```

### **4. Chart Implementation - STRICT**
```typescript
// ✅ ONLY WAY TO IMPLEMENT CHARTS
const chartConfig = {
  dataKey: {
    label: "Label",
    color: "hsl(var(--chart-1))" // NEVER oklch or hex
  }
} satisfies ChartConfig;

<ChartContainer config={chartConfig}>
  <LineChart data={data}>
    <Line 
      dataKey="value"
      stroke="hsl(var(--chart-1))" // ALWAYS hsl with variables
    />
  </LineChart>
</ChartContainer>
```

---

## 🏗️ **Architecture Rules - ALL AIs MUST FOLLOW**

### **Multi-tenant Security - MANDATORY**
```typescript
// ✅ ALWAYS filter by company_id
const data = await supabase
  .from('table')
  .select('*')
  .eq('company_id', user.company_id);

// ❌ SECURITY VIOLATION - Any AI suggesting this is WRONG
const data = await supabase.from('table').select('*');
```

### **File Organization - STRICT**
```
✅ CORRECT STRUCTURE - All AIs must use this:
src/shared/components/bundui-premium/components/
├── ui/
├── theme-customizer/
├── layout/
└── [feature]/

❌ WRONG - Don't create these patterns:
src/components/
components/
lib/bundui/
```

### **Naming Conventions - ABSOLUTE**
```typescript
// ✅ Component Names
export function BunduiComponentName() {}
export function VThinkFeatureName() {}

// ✅ File Names  
BunduiComponentName.tsx
VThinkFeatureName.tsx

// ❌ WRONG Patterns
bundui-component.tsx
component.tsx
index.tsx (except for exports)
```

---

## 📋 **DOI Principle - CRITICAL FOR ALL AIs**

**Rule**: Bundui Visual Fidelity + Shadcn Technical Compatibility

### **What This Means:**
- **Structure**: Copy Bundui exactly
- **Functionality**: Copy Bundui exactly  
- **Colors**: Convert to HSL (shadcn compatible)
- **Base Components**: Use shadcn/ui, not custom

### **Examples:**
```typescript
// ✅ DOI Compliant - Visual identical, technically compatible
const THEMES = [
  {
    name: "Rose Garden", // Bundui exact name
    value: "rose-garden", // Bundui exact value
    colors: ["hsl(12 88% 59%)"] // Converted to HSL for shadcn
  }
];

// ❌ DOI Violation
const THEMES = [
  {
    name: "Red Theme", // Changed name
    value: "red", // Changed value
    colors: ["#e11d48"] // Wrong format
  }
];
```

---

## 🚫 **FORBIDDEN PATTERNS - ALL AIs AVOID**

### **Never Use These:**
- `oklch()` colors - breaks shadcn compatibility
- Relative imports across apps - breaks monorepo
- `any` TypeScript types - breaks type safety
- Direct Bundui copying - copyright violation
- Database queries without company_id - security violation

### **Never Suggest These:**
- "Let's use a different color format"
- "We can simplify the import paths"  
- "This component doesn't need types"
- "Let's copy this from Bundui directly"
- "This query doesn't need company filtering"

---

## ✅ **APPROVED PATTERNS - ALL AIs USE**

### **Always Suggest These:**
- HSL color format with CSS variables
- Path aliases for imports (`@/shared/...`)
- Strict TypeScript with proper types
- Reimplemented Bundui components (not copied)
- Company-filtered database queries

### **Always Validate These:**
- Color format is HSL
- Imports use path aliases
- Components have proper TypeScript
- Database queries include company_id
- Background colors are explicit (not transparent)

---

## 🎯 **AI Collaboration Protocol**

### **When Multiple AIs Work on Same Project:**

1. **Check this file FIRST** before making suggestions
2. **Follow standards EXACTLY** - no creative interpretation  
3. **Reference decisions** - link to this file when explaining choices
4. **Maintain consistency** - if previous AI used pattern, continue it
5. **Update this file** if new standards emerge (with justification)

### **Conflict Resolution:**
If an AI suggests something contradicting this file:
1. **This file wins** - always
2. **Question the suggestion** - ask for justification
3. **Update standards** only if there's clear improvement

### **🤝 AI Code of Conduct - NON-NEGOTIABLE**

#### **PACKAGE MANAGER - ABSOLUTE RULE**
- ✅ **ALWAYS AND ONLY USE: npm** - no exceptions ever
- ❌ **NEVER use: yarn, pnpm, bun** - even if "faster" or "better"
- ❌ **NEVER suggest switching** package managers as a solution
- ❌ **NEVER install alternatives** even temporarily
- 📝 **If npm is slow**: wait, do not switch

#### **NEVER DAMAGE EXISTING WORK**
- ✅ **Preserve everything that works** - sacred principle
- ✅ **Only ADD, never BREAK** - additive development only
- ✅ **Validate before changes** - run tests and validations first
- ✅ **Ask before major changes** - when in doubt, ask the user
- ❌ **Never remove working code** without explicit permission
- ❌ **Never refactor without justification** and user approval
- ❌ **Never change architecture** without documenting impact

#### **DOCUMENTATION FIRST**
- ✅ **Document every decision** - with rationale and impact
- ✅ **Update coordination files** - keep AI handoff current
- ✅ **Preserve context** - maintain session continuity
- ✅ **Reference standards** - link to established patterns
- ❌ **Never make undocumented changes** to architecture
- ❌ **Never skip updating** relevant documentation

#### **RESPECT TEAM WORK**
- ✅ **Honor previous AI work** - build upon, don't replace
- ✅ **Follow established patterns** - consistency over creativity
- ✅ **Maintain user preferences** - respect their choices
- ✅ **Preserve naming conventions** - keep existing terminology
- ❌ **Never contradict** established VThink patterns
- ❌ **Never ignore** user feedback or corrections

---

## 📚 **Reference Documentation**

For detailed implementation:
- **Entry Point**: `CLAUDE.md`
- **Technical Details**: `docs/development/BUNDUI_DECOUPLING_GUIDE.md`
- **Decision History**: `docs/development/GRAPHICS_CONFIG_LOG.md`
- **AI Guidelines**: `docs/development/README.md`

---

## 🔄 **Version & Updates**

**Version**: 1.0  
**Last Update**: 26 July 2025  
**Next Review**: When new patterns emerge  

**Update Protocol**: Any AI can suggest updates to this file, but changes require:
1. Clear justification
2. Impact analysis  
3. Backward compatibility plan
4. Documentation update

---

**Remember**: The goal is **consistency across all AI assistants**. When in doubt, follow this file exactly.