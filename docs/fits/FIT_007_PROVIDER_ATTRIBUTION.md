# FIT-007 — Provider Attribution Contract

**Status:** FIT (P0 stub)  
**Last updated:** 2025-12-31

---

## Purpose

Evitar dependencias críticas "invisibles".
Toda integración con providers Distance 0–1 debe ser trazable:
- quién es el provider
- dónde se usa
- versión/riesgo
- dónde está el boundary (adapter/wrapper)

Este FIT valida **provenance** en archivos boundary (no en todo el repo).

---

## Scope

Aplica solo a:
- Distance 0–1 providers definidos en `docs/registry/CRITICAL_PROVIDERS.md`
- Archivos boundary donde se hace:
  - instanciación de Supabase client
  - acceso a datetime canonical wrapper
  - acceso a AI provider (OpenAI) y AI SDK core
  - ejecución de workflow engine (si aplica)

---

## Contract: Provenance Header

Todo archivo boundary debe incluir un header con este formato mínimo:

```typescript
/**
 * @provenance
 * provider: <ProviderName>
 * package: <npm package>
 * distance: <0|1>
 * risk: <CRITICAL|HIGH|MEDIUM>
 * policy: governed
 * replaced_by: <optional future>
 */
```

**Notas:**
- No se exige "version" en header si ya está en registry; opcional.
- Puede haber múltiples providers, pero se recomienda un boundary por provider.

---

## Verification (P0 — warning)

### Check A — Boundary files have provenance header

**Given:** Existe un archivo boundary para un provider Distance 0–1

**When:** Busco `@provenance` en el header del archivo

**Then:** El archivo contiene el bloque `@provenance` con provider/package/distance/risk

---

### Check B — No direct provider imports in high-risk entrypoints (initial target)

**Given:** `@ai-sdk/openai` es Distance 1 y high risk

**When:** Analizo route handlers `apps/**/app/api/**`

**Then:** No debe haber import directo desde `@ai-sdk/openai` fuera del boundary

(En P0, este check puede ser warning; en P1, soft-fail para código nuevo.)

---

## Suggested Implementation (script later)

```bash
# Check A: Find provenance headers
rg "@provenance" <boundary_paths>

# Check B: Find direct OpenAI imports outside boundary
rg "from '@ai-sdk/openai'" apps/dashboard/app/api -g"*.ts" -g"*.tsx"
```

---

## Current Status (from audit)

**FAIL (expected):** no boundary identified for Supabase/datetime yet

**FAIL (verified):** direct import exists for OpenAI provider:
- `apps/dashboard/app/api/chat/route.ts:1` imports `openai` from `@ai-sdk/openai`

---

## Related

- `docs/canon/CRITICAL_DEPENDENCY_GOVERNANCE.md`
- `docs/registry/CRITICAL_PROVIDERS.md`
