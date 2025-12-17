# 📦 UI Components Registry - Complete Documentation

**Project:** vibethink-orchestrator-main  
**Last Updated:** 2025-12-16  
**Status:** ✅ Production Ready

---

## 📋 Component Inventory

### Installed Components (6)

| Component | Radix Primitive | Version | Source | License |
|-----------|-----------------|---------|--------|---------|
| Avatar | @radix-ui/react-avatar | ^1.1.2 | Shadcn UI | MIT |
| Badge | - | - | Shadcn UI | MIT |
| Button | @radix-ui/react-slot | ^1.1.1 | Shadcn UI | MIT |
| Card | - | - | Shadcn UI | MIT |
| Progress | @radix-ui/react-progress | ^1.1.1 | Shadcn UI | MIT |
| Tabs | @radix-ui/react-tabs | ^1.1.2 | Shadcn UI | MIT |

---

## 📚 Radix UI Dependencies (Dec 2025)

| Package | Version | Used By | License |
|---------|---------|---------|---------|
| @radix-ui/react-avatar | ^1.1.2 | Avatar | MIT |
| @radix-ui/react-dialog | ^1.1.4 | (Not yet used) | MIT |
| @radix-ui/react-label | ^2.1.1 | (Not yet used) | MIT |
| @radix-ui/react-progress | ^1.1.1 | Progress | MIT |
| @radix-ui/react-separator | ^1.1.1 | (Not yet used) | MIT |
| @radix-ui/react-slot | ^1.1.1 | Button | MIT |
| @radix-ui/react-tabs | ^1.1.2 | Tabs | MIT |

**Repository:** https://github.com/radix-ui/primitives  
**Documentation:** https://www.radix-ui.com  
**Company:** WorkOS

---

## 🛠️ UI Utilities

| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| class-variance-authority | ^0.7.1 | Variant management | MIT |
| clsx | ^2.1.1 | Conditional classes | MIT |
| tailwind-merge | ^2.6.0 | Class merging | MIT |
| tailwindcss-animate | ^1.0.7 | Animations | MIT |
| lucide-react | ^0.468.0 | Icons (1000+) | ISC |

---

## 🔍 Sources & Licenses

### Primary Source: Shadcn UI

**Repository:** https://github.com/shadcn-ui/ui  
**Documentation:** https://ui.shadcn.com  
**License:** MIT  
**Author:** shadcn

**Approach:** Copy-paste components (not npm package)

---

### Base Primitives: Radix UI

**Repository:** https://github.com/radix-ui/primitives  
**Documentation:** https://www.radix-ui.com  
**License:** MIT  
**Company:** WorkOS

**Features:**
- ✅ WAI-ARIA compliant
- ✅ Unstyled (full control)
- ✅ TypeScript native

---

### Third-Party: BundUI (Legacy)

**Location:** `packages/bundui-ui/`  
**Status:** ⚠️ Reference only (not actively used)  
**Source:** Vendor premium template  
**License:** Commercial (purchased)

**Note:** Migrated to Shadcn for open-source benefits

---

## 📦 Component Details

### 1. Avatar

**Radix:** @radix-ui/react-avatar@^1.1.2  
**Source:** https://ui.shadcn.com/docs/components/avatar

**Subcomponents:**
- `Avatar` - Root
- `AvatarImage` - Image
- `AvatarFallback` - Fallback (initials)

**Usage:**
```typescript
import { Avatar, AvatarFallback } from '@vibethink/ui'

<Avatar>
  <AvatarFallback>ME</AvatarFallback>
</Avatar>
```

---

### 2. Badge

**Radix:** None (pure CSS)  
**Source:** https://ui.shadcn.com/docs/components/badge

**Variants:** default, secondary, destructive, outline

**Usage:**
```typescript
import { Badge } from '@vibethink/ui'

<Badge variant="secondary">New</Badge>
```

---

### 3. Button

**Radix:** @radix-ui/react-slot@^1.1.1  
**Source:** https://ui.shadcn.com/docs/components/button

**Variants:** default, destructive, outline, secondary, ghost, link  
**Sizes:** default, sm, lg, icon

**Usage:**
```typescript
import { Button } from '@vibethink/ui'

<Button variant="outline" size="sm">Click</Button>
```

---

### 4. Card

**Radix:** None (pure CSS)  
**Source:** https://ui.shadcn.com/docs/components/card

**Subcomponents:**
- `Card`, `CardHeader`, `CardTitle`
- `CardDescription`, `CardContent`, `CardFooter`

**Usage:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

---

### 5. Progress

**Radix:** @radix-ui/react-progress@^1.1.1  
**Source:** https://ui.shadcn.com/docs/components/progress

**Usage:**
```typescript
import { Progress } from '@vibethink/ui'

<Progress value={75} />
```

---

### 6. Tabs

**Radix:** @radix-ui/react-tabs@^1.1.2  
**Source:** https://ui.shadcn.com/docs/components/tabs

**Subcomponents:**
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

**Usage:**
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vibethink/ui'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content</TabsContent>
</Tabs>
```

---

## 🚀 Installation

### Add New Components

```bash
# List available
npm run update:ui:list

# Add specific
npm run update:ui dialog form

# Add all
npm run update:ui:all
```

---

## 🔄 Update Strategy

**Frequency:** Monthly or when needed

```bash
# Update all components
npm run update:ui:all

# Review changes
git diff packages/ui/

# Test
npm run dev
```

---

## 📊 Version Matrix

```yaml
Shadcn UI: latest
Radix UI: 1.1.x
React: ^18.0.0 || ^19.0.0
TypeScript: ^5.7.3
Next.js: ^15.0.0
```

---

## 🔗 Resources

- **Shadcn UI:** https://ui.shadcn.com
- **Radix UI:** https://www.radix-ui.com
- **Lucide Icons:** https://lucide.dev

---

**Last Updated:** 2025-12-16  
**Maintainer:** VibeThink Engineering
