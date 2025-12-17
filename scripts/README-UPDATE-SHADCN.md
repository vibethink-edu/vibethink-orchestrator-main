# Shadcn UI Auto-Updater

Automated script to download and update Shadcn UI components from GitHub.

## 📦 Installation

No installation needed! The script uses Node.js built-in modules.

## 🚀 Usage

### Update Specific Components

```bash
npm run update:ui card badge button
```

### Update All Components

```bash
npm run update:ui:all
```

### List Available Components

```bash
npm run update:ui:list
```

## 📋 Available Components

- avatar
- badge
- button
- card
- checkbox
- dialog
- form
- input
- label
- progress
- select
- separator
- sheet
- table
- tabs
- toast
- toaster

## 🔄 Workflow

### 1. Check for Updates

```bash
# List what's available
npm run update:ui:list
```

### 2. Update Components

```bash
# Update specific components
npm run update:ui card badge

# Or update everything
npm run update:ui:all
```

### 3. Review Changes

```bash
# Check what changed
git diff packages/ui/src/components/
```

### 4. Update Exports

If you added new components, update `packages/ui/src/index.ts`:

```typescript
export * from './components/new-component';
```

### 5. Install Dependencies

If the component requires new Radix UI primitives:

```bash
cd packages/ui
npm install @radix-ui/react-new-primitive
```

### 6. Test

```bash
# Restart dev server
npm run dev
```

## 📝 What the Script Does

1. **Downloads** component from GitHub
2. **Fixes imports** - Changes `@/lib/utils` to `../lib/utils`
3. **Saves** to `packages/ui/src/components/`
4. **Reports** success/failure

## 🔧 Mejoras Implementadas (2025-01-16)

### Características Nuevas

- ✅ **Timeout de 8 segundos** - Evita que el script se quede colgado
- ✅ **Retry automático** - Hasta 2 intentos en caso de error o timeout
- ✅ **Múltiples URLs** - Prueba `new-york` y `default` registries automáticamente
- ✅ **Mejor logging** - Muestra qué URL está probando
- ✅ **Manejo de errores mejorado** - Stack traces y mensajes más claros
- ✅ **Creación de directorios** - Asegura que existan antes de escribir

### Cambios Técnicos

- Timeout reducido de 15s a 8s para fallar más rápido
- Retry reducido de 3 a 2 intentos (más eficiente)
- Array de URLs para fallback automático
- Mejor manejo de imports internos entre componentes

## 🎯 Example Session

```bash
$ npm run update:ui card badge

🔄 Updating Shadcn UI components from GitHub...

📦 Updating card...
   ✅ card.tsx updated

📦 Updating badge...
   ✅ badge.tsx updated

📊 Summary:
   ✅ Success: 2

💡 Next steps:
   1. Review changes: git diff packages/ui/src/components/
   2. Update exports: packages/ui/src/index.ts
   3. Install dependencies if needed: cd packages/ui && npm install
   4. Test components in dashboard
```

## ⚠️ Important Notes

### Import Paths

The script automatically fixes import paths:

```typescript
// GitHub version
import { cn } from "@/lib/utils"

// Fixed for monorepo
import { cn } from "../lib/utils"
```

### Dependencies

After updating, check if new dependencies are needed:

```bash
# Component might require new Radix UI primitive
npm install @radix-ui/react-dialog
```

### Breaking Changes

Shadcn UI can have breaking changes. Always:

1. Review the diff
2. Check Shadcn changelog
3. Test in development
4. Update your code if needed

## 🔍 Troubleshooting

### Component Not Found

```
❌ Failed: Component not found on GitHub
```

**Solution:** Component might not exist or name is wrong. Run `npm run update:ui:list` to see available components.

### Import Errors After Update

```
Module not found: Can't resolve '@radix-ui/react-*'
```

**Solution:** Install missing dependency:
```bash
cd packages/ui
npm install @radix-ui/react-missing-primitive
```

### TypeScript Errors

```
Type error: Property 'x' does not exist
```

**Solution:** Component API might have changed. Check Shadcn docs and update your usage.

## 📚 Related Documentation

- [Shadcn UI Docs](https://ui.shadcn.com)
- [Shadcn GitHub](https://github.com/shadcn-ui/ui)
- [BRANDING.md](../apps/dashboard/BRANDING.md)
- [SHADCN_RADIX_UI_STACK.md](../../_vibethink-dev-kit/knowledge/stack-guides/SHADCN_RADIX_UI_STACK.md)

## 🎯 Best Practices

### 1. Update Regularly

```bash
# Monthly or when you need new features
npm run update:ui:all
```

### 2. Review Before Committing

```bash
git diff packages/ui/src/components/
```

### 3. Test After Updates

```bash
npm run dev
# Test all pages using updated components
```

### 4. Document Breaking Changes

If an update breaks something, document it:

```markdown
## Breaking Changes (2025-12-16)

- `Button` variant "ghost" renamed to "link"
- `Card` now requires explicit `CardContent`
```

## 🔄 Update Schedule

**Recommended:** Monthly or when needed

```bash
# First Monday of each month
npm run update:ui:all
git diff
# Review, test, commit
```

---

**Last Updated:** 2025-12-16  
**Maintainer:** VibeThink Engineering
