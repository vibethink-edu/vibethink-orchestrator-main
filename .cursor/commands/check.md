# /check - Code Quality Check Command

Ejecuta verificaciones de calidad de código (TypeScript, ESLint, Build).

## Pasos a Ejecutar

1. **TypeScript Check:**
   ```bash
   npx tsc --noEmit
   ```
   - Verifica errores de tipos
   - No genera archivos (solo verifica)

2. **ESLint Check (si está configurado):**
   ```bash
   npm run lint
   ```
   - Verifica reglas de linting
   - Reporta warnings y errors

3. **Build Check:**
   ```bash
   npm run build
   ```
   - Verifica que el proyecto compila
   - Genera dist/ para verificar

4. **Verificar Worktrees:**
   ```powershell
   .\scripts\verify-no-worktree.ps1
   ```
   - Verifica que no hay worktrees extra
   - Importante antes de commits grandes

## Output Esperado

Reportar resumen:
```
✅ TypeScript: 0 errors
✅ ESLint: 0 errors, 2 warnings
✅ Build: Success
✅ Worktrees: Clean (only main)

Total: All checks passed ✅
```

O si hay errores:
```
❌ TypeScript: 3 errors
   - src/components/ChatColumn.tsx:45 - Type 'string' is not assignable to type 'number'
   - src/services/voiceService.ts:120 - Property 'xyz' does not exist

⚠️  ESLint: 5 warnings
   - Unused variable 'temp' in voiceService.ts
   
✅ Build: Success (with warnings)
❌ Worktrees: 2 extra worktrees detected

Total: 2 checks failed ❌
```

## Cuándo Usar

Ejecutar `/check` antes de:
- Hacer commit
- Hacer push
- Crear Pull Request
- Merge a main
- Deploy a producción

## Opciones Rápidas

**Solo TypeScript:**
```bash
npx tsc --noEmit
```

**Solo Build:**
```bash
npm run build
```

**Solo Worktrees:**
```powershell
.\scripts\verify-no-worktree.ps1
```
