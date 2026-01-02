# FIT-EntityGraph-001 — Entity Graph Exists + Used

## Estado
Draft (propuesto)

## Motivación
El proyecto tiene Timeline, Departments y Policy Layer, pero **Entity Graph NO existe** y es un blocker.
Sin Entity Graph:
- Timeline queda como lista “huérfana” sin identidad canónica
- No hay memoria estructural para razonamiento multi-departamento
- No hay base para dedupe, provenance, ni causalidad

## Definición
El sistema cumple este FIT si:
1) Existe un **modelo canónico** de Entity Graph (entities + relationships + events) definido en docs/canon
2) El producto **usa** Entity Graph como fuente de verdad (aunque aún no haya DB)
3) Timeline referencia explícitamente `entity_id` (y opcional `entity_event_id`)

**Nota:** “Existe” no significa base de datos; significa **contrato implementable** y adoptado.

---

## Alcance
Incluye:
- Contrato de tablas lógicas: entities, entity_relationships, entity_events
- Taxonomía mínima de relationship_type
- Invariantes (WITs) verificables
- Link obligatorio Timeline → entity_id

Excluye:
- Elección de DB (SQL/graph/document)
- Indexing/optimization
- Nuevas features de producto

---

## Criterios de Aceptación (irrefutables)

### A) Canon docs
- Existe `docs/canon/ENTITY_MEMORY_SCHEMA_SPEC.md`
- Existe `docs/canon/ENTITY_RELATIONSHIP_TAXONOMY.md`
- Contienen:
  - campos requeridos
  - constraints
  - MVP vs expansión
  - ejemplos

### B) WITs declaradas
- Las WITs relevantes están explicitadas (al menos WIT-EM-001..006 o equivalente)

### C) Uso por Timeline (contrato)
- Timeline item (modelo/DTO/capa de proyección) incluye `entity_id` obligatorio.
- Regla: no se produce timeline_item sin entity_id.

Evidencia aceptable (sin DB):
- Tipos/DTOs/Interfaces que incluyen entity_id como required
- Tests de contrato / validators
- Docs que definan el shape y reglas

---

## Dependencias
- Timeline existente (ya está)
- Policy Layer existente (ya está)
- Entity Graph (este FIT crea el “Distance-0 contract”)

---

## Riesgos si NO se cumple
- Memoria inconsistente por departamento
- Dedupe manual infinito
- Timeline como “log” sin identidad, imposible de auditar

---

## FITs relacionados
- FIT-EntityTimelineLink: Timeline references entity_id (puede separarse como FIT-002 si quieren granularidad)

---

## Checklist de validación (manual)
- [ ] Se puede tomar un timeline_item y rastrear a 1 entity_id canónico
- [ ] Se puede listar relaciones de una entidad sin ambigüedad de tipo
- [ ] Cada entidad/relación/evento tiene provenance
- [ ] Hay regla explícita de merge/dedupe


Si quieres, el siguiente paso (sin construir DB) es definir “Entity Event Types (MVP)” para que Timeline tenga categorías estables (meeting, transaction, decision, policy_enforced, etc.) y que Policy Layer tenga targets claros para “escribir memoria” sin inventar formatos.
