# GOV-QA — Quality Gates Pack v1 (CodeRabbit-Aligned)

> **Status**: SEALED  
> **Enforcement**: AUTOMATED (CI + Script Gates)  
> **Context**: Monorepo Quality Standards

## 1. Contexto Sellado (Non-Negotiable)

Este documento define los estándares mínimos de calidad que rigen el repositorio. Estas reglas son absolutas y su violación bloqueará cualquier Pull Request.

- **Gestor de Paquetes**: `pnpm` es canónico.
- **Tipado**: TypeScript estricto. **Prohibido `any`**.
- **Runtime Safety**: Uso obligatorio de Type Guards para narrowing dinámico.
- **Multi-tenant**: Tenant context debe ser fail-fast.
- **Resiliencia**: Idempotencia obligatoria en workers (con retries).
- **Seguridad**: Prohibido estrictamente PHI/PII en logs.

## 2. Banned Patterns (Gate: Banned)

El script `gate:banned` fallará si detecta cualquiera de los siguientes patrones en el código fuente (`src/`, `apps/`, `packages/`, `tests/`):

| Patrón | Estado | Razón | Excepción Permitida |
|--------|--------|-------|---------------------|
| `as any` | **FORBIDDEN** | Destruye la seguridad de tipos. | Ninguna. Usar `unknown` + Type Guard. |
| `as unknown as` | **FORBIDDEN** | Double-casting inseguro. | Ninguna. Refactorizar tipos. |
| `@ts-ignore` | **FORBIDDEN** | Silencia errores sin rastro. | Ninguna. |
| `@ts-expect-error` | **RESTRICTED** | Silencia errores conocidos. | Permitido **SOLO** con descripción en la misma línea. |

### Regla de `@ts-expect-error`
❌ Incorrecto:
```typescript
// @ts-expect-error
const x = y;
```

✅ Correcto:
```typescript
// @ts-expect-error: library types are incorrect for this edge case
const x = y;
```

## 3. Estándares de Código

### Type Safety
- No se permiten `any` explícitos ni implícitos.
- Utilizar `zod` o type guards personalizados para validar datos externos.

### Tenant Context
- Validar `company_id` y `user_id` al inicio de cualquier operación.
- Lanzar error inmediato si falta contexto (Fail-fast).

### Idempotencia
- Operaciones de escritura (mutaciones) deben manejar reintentos sin duplicar efectos secundarios.

## 4. Ejecución de Quality Gates

Antes de subir cambios, ejecutar:

```bash
pnpm gate:quality
```

Esto ejecutará en secuencia:
1. `typecheck` (Compilación TS)
2. `lint` (ESLint estricto)
3. `test` (Tests unitarios)
4. `gate:banned` (Escaneo de patrones prohibidos)
