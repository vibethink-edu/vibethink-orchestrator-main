# Product Branding Configuration Guide

**Status:** ✅ Production Ready  
**Last Updated:** 2025-12-16  
**Monorepo Compliant:** ✅ Yes

---

## 📋 Overview

This guide explains how to configure product branding across the entire monorepo. The product name "Pana" is used during development and can be easily changed for production.

---

## 🎯 Why Configurable Branding?

1. **Development vs Production** - Different names for different environments
2. **White-label Ready** - Easy to rebrand for different clients
3. **Monorepo Compliant** - Centralized configuration
4. **Type-Safe** - TypeScript ensures consistency

---

## ⚙️ Configuration

### 1. Environment Variables

**File:** `.env.local` (or `.env.production`)

```bash
# --- Product Branding (Configurable) ---
# Development name: "Pana" | Production name: TBD
NEXT_PUBLIC_PRODUCT_NAME=Pana
NEXT_PUBLIC_PRODUCT_TAGLINE=El amigo que orquesta tu empresa
NEXT_PUBLIC_PRODUCT_DESCRIPTION=AI-powered business orchestration platform
NEXT_PUBLIC_COMPANY_NAME=VibeThink

# Logo/Branding (optional - defaults to gradient if not set)
# NEXT_PUBLIC_LOGO_URL=/logo.png
# NEXT_PUBLIC_FAVICON_URL=/favicon.ico
```

### 2. Branding Module

**File:** `apps/dashboard/lib/branding.ts`

```typescript
import { getBranding } from '@/lib/branding'

const branding = getBranding()
// branding.name → "Pana" (or configured value)
// branding.tagline → "El amigo que orquesta tu empresa"
// branding.gradient.text → "P" (first letter)
```

---

## 🚀 Usage

### In Components

```typescript
import { getBranding } from '@/lib/branding'

export default function MyComponent() {
  const branding = getBranding()
  
  return (
    <div>
      <h1>{branding.name}</h1>
      <p>{branding.tagline}</p>
      
      {/* Gradient logo */}
      <div className={`bg-gradient-to-br ${branding.gradient.from} ${branding.gradient.to}`}>
        <span>{branding.gradient.text}</span>
      </div>
    </div>
  )
}
```

### In Metadata (SEO)

```typescript
import { getBranding } from '@/lib/branding'

export async function generateMetadata() {
  const branding = getBranding()
  
  return {
    title: branding.name,
    description: branding.description,
  }
}
```

---

## 🔄 Changing Product Name

### For Development

1. Update `.env.local`:
```bash
NEXT_PUBLIC_PRODUCT_NAME=NewName
NEXT_PUBLIC_PRODUCT_TAGLINE=New tagline
```

2. Restart dev server:
```bash
npm run dev
```

### For Production

1. Update `.env.production`:
```bash
NEXT_PUBLIC_PRODUCT_NAME=ProductionName
NEXT_PUBLIC_PRODUCT_TAGLINE=Production tagline
```

2. Rebuild:
```bash
npm run build
```

---

## 📁 Files Using Branding

### Current Implementation

```
apps/dashboard/
├── lib/
│   └── branding.ts              ← Centralized config
└── app/
    └── pana/
        └── dashboard/
            └── page.tsx         ← Uses getBranding()
```

### Future Files (Add as needed)

- `app/layout.tsx` - Root layout metadata
- `app/pana/layout.tsx` - Section layout
- `components/header.tsx` - Header component
- `components/footer.tsx` - Footer component

---

## 🎨 Branding Elements

### Logo

**Default:** Gradient with first letter
```typescript
<div className={`bg-gradient-to-br ${branding.gradient.from} ${branding.gradient.to}`}>
  <span>{branding.gradient.text}</span>
</div>
```

**Custom Logo:**
```bash
# .env.local
NEXT_PUBLIC_LOGO_URL=/logo.png
```

```typescript
{branding.logo ? (
  <img src={branding.logo} alt={branding.name} />
) : (
  <div className={`bg-gradient-to-br ${branding.gradient.from} ${branding.gradient.to}`}>
    <span>{branding.gradient.text}</span>
  </div>
)}
```

---

## ✅ Monorepo Compliance

### Centralized Configuration
- ✅ Single source of truth (`lib/branding.ts`)
- ✅ Environment variables in root `.env`
- ✅ Type-safe exports

### Reusable Across Apps
```typescript
// Can be used in any app
import { getBranding } from '@/lib/branding'
```

### No Hardcoded Strings
```typescript
// ❌ Bad
<h1>Pana</h1>

// ✅ Good
<h1>{branding.name}</h1>
```

---

## 🧪 Testing Different Names

### Quick Test

```bash
# Terminal
NEXT_PUBLIC_PRODUCT_NAME="TestName" npm run dev
```

### Multiple Environments

```bash
# .env.development
NEXT_PUBLIC_PRODUCT_NAME=Pana (Dev)

# .env.staging
NEXT_PUBLIC_PRODUCT_NAME=Pana (Staging)

# .env.production
NEXT_PUBLIC_PRODUCT_NAME=ProductionName
```

---

## 📝 Checklist for Production

- [ ] Update `NEXT_PUBLIC_PRODUCT_NAME` in `.env.production`
- [ ] Update `NEXT_PUBLIC_PRODUCT_TAGLINE`
- [ ] Update `NEXT_PUBLIC_PRODUCT_DESCRIPTION`
- [ ] Add custom logo (optional)
- [ ] Update favicon (optional)
- [ ] Test all pages
- [ ] Verify SEO metadata
- [ ] Update documentation

---

## 🎯 Best Practices

### 1. Always Use getBranding()
```typescript
// ✅ Good
const branding = getBranding()
<h1>{branding.name}</h1>

// ❌ Bad
<h1>Pana</h1>
```

### 2. Destructure When Needed
```typescript
const { name, tagline, gradient } = getBranding()
```

### 3. Use Type-Safe Access
```typescript
// TypeScript will catch typos
branding.name // ✅
branding.namee // ❌ Error
```

### 4. Document Custom Branding
```typescript
// If adding new branding properties, update:
// 1. lib/branding.ts
// 2. .env.example
// 3. This guide
```

---

## 🔍 Troubleshooting

### Branding Not Updating

**Problem:** Changed `.env` but branding still shows old value

**Solution:**
1. Restart dev server
2. Clear Next.js cache: `rm -rf .next`
3. Rebuild: `npm run dev`

### TypeScript Errors

**Problem:** `Property 'name' does not exist`

**Solution:**
```typescript
import { getBranding } from '@/lib/branding'
// Not: import branding from '@/lib/branding'
```

### Environment Variables Not Found

**Problem:** `branding.name` is undefined

**Solution:**
1. Verify `.env.local` exists
2. Verify variables start with `NEXT_PUBLIC_`
3. Restart dev server

---

## 📚 Related Documentation

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Monorepo Best Practices](../../../_vibethink-dev-kit/knowledge/best-practices/)
- [ENV_VAR_STANDARD.md](../../../_vibethink-dev-kit/knowledge/engineering-standards/ENV_VAR_STANDARD.md)

---

**Last Updated:** 2025-12-16  
**Maintainer:** VibeThink Engineering  
**Status:** ✅ Production Ready
