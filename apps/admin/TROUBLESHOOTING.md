# Admin Console - Troubleshooting Guide

> **Purpose:** Prevent repeating the same setup/styling issues that cost 7+ hours in initial implementation.

---

## 🔴 Problem: "Tailwind CSS Not Loading" (Styles Look Broken)

### Symptoms
- HTML renders but looks unstyled (Times New Roman font, blue links)
- Sidebar appears as plain text instead of fixed layout
- No colors, borders, or spacing applied

### Root Causes & Solutions

#### 1. Missing `tailwind.config.ts` Content Paths
**Error:** Tailwind doesn't scan shared UI package (`@vibethink/ui`).

**Fix:**
```typescript
// apps/admin/tailwind.config.ts
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './lib/**/*.{js,ts,jsx,tsx,mdx}',
  '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}', // ← CRITICAL
],
```

#### 2. Missing or Incorrect `postcss.config.js`
**Error:** `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` or silent CSS failure.

**Fix:** Create `apps/admin/postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Note:** Do NOT use `.cjs` extension on Windows/pnpm (causes issues).

#### 3. Missing CSS Import in Root Layout
**Error:** `globals.css` exists but isn't loaded.

**Fix:** Verify `apps/admin/app/layout.tsx` has:
```typescript
import "./globals.css"; // ← Line 1
```

#### 4. Stale `.next` Cache
**Symptom:** Changes to Tailwind config don't apply.

**Fix:**
```bash
rm -rf apps/admin/.next
# or on Windows:
Remove-Item -Recurse -Force apps/admin/.next
```

---

## 🔴 Problem: "Module not found: @vibethink/ui"

### Cause
Shared UI package not linked in monorepo.

### Solution
1. Add dependency to `apps/admin/package.json`:
```json
"dependencies": {
  "@vibethink/ui": "workspace:*"
}
```

2. Configure Next.js transpilation in `apps/admin/next.config.js`:
```javascript
module.exports = {
  transpilePackages: ['@vibethink/ui'],
};
```

3. Run `pnpm install` from **root** (not from `apps/admin`).

---

## 🔴 Problem: Build Error - "border-border class does not exist"

### Error Message
```
The `border-border` class does not exist. 
If `border-border` is a custom class, make sure it is defined within a `@layer` directive.
```

### Cause
`globals.css` uses `@apply border-border` but Tailwind config doesn't define it.

### Solution
Comment out the problematic line in `apps/admin/app/globals.css`:
```css
@layer base {
  /* Commented out - requires borderColor in tailwind.config
  * {
    @apply border-border;
  }
  */
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 🔴 Problem: "EADDRINUSE: Port 3002 already in use"

### Cause
Previous dev server didn't terminate properly (zombie process).

### Solutions

**Option A:** Kill the process (Windows):
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3002).OwningProcess | Stop-Process -Force
```

**Option B:** Use a different port:
```bash
cd apps/admin && npx next dev --port 3005
```

---

## 🔴 Problem: Hydration Mismatch Warning

### Error
```
Hydration failed because the server rendered HTML didn't match the client.
```

### Cause
Browser extensions (e.g., Monica AI) inject attributes into `<body>` tag.

### Solution
Add `suppressHydrationWarning` to `apps/admin/app/layout.tsx`:
```tsx
<body className={inter.className} suppressHydrationWarning>
```

---

## 🔴 Problem: Database Connection Fails

### Error
```
getaddrinfo ENOTFOUND your-project.supabase.co
```

### Cause
`.env.local` has placeholder values instead of real Supabase credentials.

### Solution
1. Copy `.env.local.example` to `.env.local`
2. Replace placeholders with actual values from Supabase Dashboard > Settings > API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)
3. **Restart dev server** (env changes require restart)

---

## ✅ Checklist: Fresh Setup

Use this when setting up Admin Console on a new machine:

- [ ] Run `pnpm install` from **root**
- [ ] Copy `.env.local.example` → `.env.local` and fill credentials
- [ ] Verify `tailwind.config.ts` includes `../../packages/ui/src/**`
- [ ] Verify `postcss.config.js` exists
- [ ] Verify `next.config.js` has `transpilePackages: ['@vibethink/ui']`
- [ ] Delete `.next` folder if migrating from old config
- [ ] Run `pnpm dev --filter @vibethink/admin` (or `npx next dev` in `apps/admin`)
- [ ] Test: Visit `http://localhost:3002/tenants` (or 3005)

---

## 📚 Related Documentation

- [Tailwind Monorepo Setup](https://tailwindcss.com/docs/content-configuration#working-with-monorepos)
- [Next.js transpilePackages](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)
- [shadcn/ui Installation](https://ui.shadcn.com/docs/installation/next)

---

**Last Updated:** 2026-01-10  
**Maintainer:** VibeThink Engineering Team
