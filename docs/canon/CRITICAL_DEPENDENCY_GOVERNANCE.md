# Critical Dependency Governance (CDG)

**Status:** CANON (P0)  
**Owner:** Platform Architecture  
**Last updated:** 2025-12-31

---

## Purpose

ViTo es AI-first y está gobernado por capas (Memory → Reasoning → UX Projection).
Por tanto, la gobernanza de dependencias NO empieza por UI.
Empieza por las dependencias más cercanas al Core: Memory Substrate y Reasoning.

Este documento define:
- cómo clasificamos dependencias externas por "distancia al Core"
- qué reglas aplican por distancia
- qué se considera "crítico" y cómo se valida (FIT-007)

---

## Canon Principle

**Dependency Governance by Layer**

> Cuanto más cerca esté una dependencia del Memory/Reasoning Layer, más estricta debe ser su gobernanza.
> UX providers se gobiernan, pero no lideran el modelo.

---

## Distance Model

### Distance 0 — Memory Layer (CRITICAL)

Dependencias que afectan la fuente de verdad: persistencia, eventos, policy enforcement, temporal logic.

**Regla:** debe existir boundary (adapter/wrapper) o un "contracted usage pattern" explícito y auditado.

### Distance 1 — Reasoning Layer (HIGH RISK)

Dependencias que habilitan razonamiento AI, streaming, tool calling, workflow engines (si ejecutan lógica).

**Regla:** provider lock-in mitigado mediante adapters o interfaces agnósticas.

### Distance 2 — Domain Engines (IMPORTANT)

Lógica de negocio reusable (booking/availability, normalization domain-specific, etc.).
Puede variar por domain pack.

### Distance 3 — UX Providers (NICE TO HAVE en P0)

Librerías visuales y componentes. Se gobiernan después de asegurar Distance 0–1.

---

## Governance Rules (P0)

### Rule G1 — No Invisible Critical Dependencies

Toda dependencia Distance 0–1 debe estar listada en el registry y tener un **rationale** de uso.

### Rule G2 — Boundary-First for Critical Providers

Para Distance 0–1, el acceso debe ocurrir a través de **boundary modules** (adapters/wrappers) o un patrón de uso canónico.

Ejemplos de boundaries esperados:
- `src/**/services/**` (memory services)
- `packages/utils/**` (datetime/money canonical)
- `src/**/ai/**` o `src/**/providers/**` (AI adapters)

### Rule G3 — Provenance Headers on Boundaries

Los archivos boundary de Distance 0–1 deben incluir un header de provenance (ver FIT-007).

### Rule G4 — Freeze Policy for Upstream Visual Suites

Providers UI "suites" (ej. Bundui Premium) operan en modo **FROZEN** por defecto.
Updates solo por ventana manual con changelog + impact assessment.

### Rule G5 — UX is Projection (State Tools Caution)

Herramientas de estado cliente (ej. Zustand) NO pueden convertirse en source of truth.
Solo se usan para estado efímero de UI.

---

## Current Critical Providers (Evidence-Based Snapshot)

Este set se define en `docs/registry/CRITICAL_PROVIDERS.md` con evidencia.

---

## Enforcement

- En P0: validaciones en modo **warning** (no bloqueante).
- En P1+: "soft-fail" para nuevas violaciones en boundaries Distance 0–1.
- En P2: "strict" (bloqueante) cuando la adopción sea completa.

---

## Related

- `docs/fits/FIT_007_PROVIDER_ATTRIBUTION.md`
- `docs/canon/02_AI_FIRST_3_LAYER_ARCHITECTURE.md`
- `docs/canon/11_PLANS_AND_USAGE_LIMITS_MODEL.md`
