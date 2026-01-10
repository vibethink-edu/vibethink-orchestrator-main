# Vendor Versions & Compatibility Matrix

> **Última actualización:** 2026-01-09
> **Versión del documento:** 1.2.0

### ⚠️ Nota Importante sobre "Asset Library"
Este documento rastrea las versiones de referencia offline (Assets) vs la implementación de producción (Dependencias).
La "Asset Library" (ej. `C:\IA Marcelo Labs\xyflow`) es SOLO REFERENCIA de código fuente y ejemplos.

---

## 📊 Stack Principal (VibeThink Orchestrator)

| Dependencia | Versión | Notas |
|-------------|---------|-------|
| **React** | 19.0.0 | ⚠️ Versión RC/nueva |
| **Next.js** | 15.3.4 | App Router |
| **TypeScript** | 5.9.2 | Última estable |
| **Tailwind CSS** | 4.1.11 | v4 (nueva arquitectura) |

---

## 🎨 Vendor: Bundui (shadcn-ui-kit-dashboard)

| Tipo | Versión | Ubicación |
|------|---------|-----------|
| **Referencia Offline** | 1.2.0 | `C:\IA Marcelo Labs\bundui\` |
| **Producción** | N/A (Migrado) | `@vibethink/ui` |

---

## 🔄 Vendor: React Flow (xyflow)

| Tipo | Versión | Ubicación | Estado |
|------|---------|-----------|--------|
| **Referencia Offline** | git-17-Dec-25 | `C:\IA Marcelo Labs\xyflow` | ✅ Asset Library |
| **Dependencia Prod** | `@xyflow/react` v12.x | `package.json` | ⚠️ Verificar Sync |

### Protocolo de Sincronización (XYFlow)
1.  **Si actualizas `npm install @xyflow/react`:**
    *   Debes ir a `C:\IA Marcelo Labs\xyflow`.
    *   Ejecutar `git pull origin main` para traer los nuevos ejemplos/docs.
    *   Esto asegura que cuando copies ejemplos, sean compatibles con tu versión instalada.

2.  **Comando de Verificación:**
    ```powershell
    # Ver versión instalada
    npm list @xyflow/react
    # Ver versión de referencia
    cd "C:\IA Marcelo Labs\xyflow"
    git log -1 --format="%cd"
    ```

---

## 📦 Vendor: Shadcn UI

| Tipo | Versión | Ubicación |
|------|---------|-----------|
| **CLI** | 3.6.1 | `pnpm dlx shadcn@latest` |
| **Componentes** | Rolling | `packages/ui/src/components/ui` |

---

## 🔍 Matriz de Compatibilidad & Riesgos

```
┌──────────────────┬───────────┬───────────┬───────────┐
│ Feature          │ VThink    │ Bundui    │ XYFlow    │
│                  │ (Prod)    │ (Asset)   │ (Asset)   │
├──────────────────┼───────────┼───────────┼───────────┤
│ React Version    │ 19.0.0    │ ^19.2.0   │ >=17      │
│ Tailwind         │ v4        │ v4        │ N/A       │
│ Zustand          │ v5        │ v5        │ v4 (⚠️)   │
└──────────────────┴───────────┴───────────┴───────────┘
```
> **Alerta Zustand:** XYFlow usa Zustand v4 internamente. VibeThink usa v5. Esto generalmente funciona, pero si copiamos "Custom Stores" de los ejemplos de XYFlow, podrían requerir adaptación.

---

**Mantenedor:** VThink Team
**Próxima revisión:** Trimestral (Q2 2026)
