# Entity Memory Schema Spec (Canonical)

## Propósito
Definir el **contrato canónico** de *Entity Memory* para ViTo: un modelo estable de memoria que permita:
- Representar **entidades** (personas, compañías, contratos, cuentas, etc.)
- Representar **relaciones** (ownership, works_at, vendor_of, etc.)
- Representar **eventos** que afectan entidades
- Vincular **explícitamente** con **Timeline** (Timeline es una *vista*; Memory es la verdad)

**Regla de oro:** La UX, Timeline y cualquier “panel” son **proyecciones**.  
El *source of truth* es Entity Memory.

---

## Conceptos
### Entity
Una unidad del mundo real o conceptual con identidad estable.

### Relationship
Un vínculo explícito y tipado entre dos entidades, con directionality, vigencia, fuente y confianza.

### Entity Event
Hecho puntual o intervalo que **cambia el estado** de una o más entidades (o sus relaciones) y puede ser proyectado a Timeline.

### Timeline Link
Timeline debe poder referenciar *entity_id* y opcionalmente *entity_event_id*.  
En el futuro, será FK real; hoy es contrato.

---

## Alcance: Storage-agnostic
Este spec define:
- Campos, tipos semánticos, constraints, invariantes
- Ejemplos de instancias
- Reglas de resolución de identidad y deduplicación (a nivel contrato)

**No define**: motor de base de datos, índices, particionamiento, ni vendor específico.

---

## Identidad: IDs, Keys y Aliases
### entity_id (canonical)
- Tipo: `string` (ej. `ent_...`)
- Generación: determinística o aleatoria, pero **estable**
- Nunca se recicla

### external_ref (alias / key)
- Tipo: `{ system: string, key: string }`
- Permite anclar entidades a fuentes: CRM, email, calendar, accounting, etc.
- Una entidad puede tener N external_refs

### natural_key (opcional)
- Para casos donde exista (ej. NIT + país, IBAN, dominio, etc.)
- No reemplaza entity_id

---

## Modelo Canónico (Tablas lógicas)

### 1) entities
**Propósito:** Identidad, tipo, nombre canónico, atributos, referencias externas.

Campos:
- `entity_id` (PK, required)
- `entity_type` (required) — ver Taxonomía
- `canonical_name` (required)
- `status` (required) enum: `active | inactive | merged | deleted_tombstone`
- `created_at` (required, instant)
- `updated_at` (required, instant)

Atributos y metadatos:
- `attributes` (json object) — atributos tipados por `entity_type`
- `tags` (string[])
- `external_refs` (array of `{system, key, url?}`)

Control y evidencia:
- `provenance` (required)
  - `created_by` (actor_id or system)
  - `sources` (array de source pointers)
- `confidence` (0..1) — confianza global en esta entidad (composición/heurística)

Constraints:
- `canonical_name` no vacío
- `entity_type` ∈ taxonomy
- `status=merged` requiere `attributes.merged_into_entity_id`

---

### 2) entity_relationships
**Propósito:** Aristas del grafo (tipadas, direccionadas, con vigencia y evidencia).

Campos:
- `relationship_id` (PK, required)
- `relationship_type` (required) — ver taxonomía
- `from_entity_id` (required)
- `to_entity_id` (required)

Semántica:
- `directionality` enum: `directed | undirected` (por defecto `directed`)
- `roles` (optional) `{ from_role?: string, to_role?: string }`
- `valid_time` (optional)
  - `start` (instant or civil_date)
  - `end` (instant or civil_date)
- `status` enum: `active | inactive | disputed | deleted_tombstone`

Evidencia:
- `provenance` (required)
  - `sources` (array)
  - `asserted_by` (actor/system)
- `confidence` (0..1)
- `strength` (optional, 0..1) — intensidad (ej. ownership 0.5)

Constraints:
- `from_entity_id != to_entity_id` (excepto tipos explícitos que lo permitan; por defecto prohibido)
- `relationship_type` ∈ taxonomy
- No duplicados “idénticos” activos:
  - Misma tupla (`type, from, to`) con overlap de `valid_time` ⇒ requiere merge o versionado

---

### 3) entity_events
**Propósito:** Hechos que afectan entidades y proyectan a Timeline.

Campos:
- `entity_event_id` (PK, required)
- `event_type` (required) — taxonomía de eventos
- `occurred_time` (required)
  - Puede ser `instant_range` o `civil_range` (según dominio)
- `title` (required)
- `summary` (optional)
- `payload` (json object) — datos específicos del evento

Enlaces:
- `primary_entity_id` (required)
- `related_entity_ids` (optional, string[])
- `related_relationship_ids` (optional, string[])

Evidencia:
- `provenance` (required)
- `confidence` (0..1)

Constraints:
- `primary_entity_id` debe existir (contractualmente)
- `occurred_time` debe ser válido y comparable

---

### 4) timeline_items (contrato de link, no DB)
**Nota:** Timeline ya existe. Este spec define el **mínimo obligatorio** para el link.

Campos mínimos requeridos en Timeline:
- `timeline_item_id` (existing)
- `occurred_time` (existing)
- `entity_id` (NEW REQUIRED IN CONTRACT)
- `entity_event_id` (optional, pero recomendado)
- `kind` / `category` (existing)

Constraint:
- Cada Timeline item debe referenciar un `entity_id` canónico.

---

## Tipos de tiempo
- **instant**: timestamp absoluto (UTC)
- **civil_date**: fecha civil sin zona
- **instant_range**: [start,end] timestamps
- **civil_range**: [start_date,end_date] civil

Regla:
- Si el hecho proviene de calendario/agenda o logística humana → civil_range suele ser correcto.
- Si el hecho es sistema/finanzas/operación (ej. transacción) → instant_range/instant.

---

## Provenance (Source Pointers)
Formato recomendado:
- `source_id` (string)
- `source_type` enum: `email | calendar | document | api | user_input | system_inference`
- `locator` (string) — URL, message-id, path, etc.
- `excerpt_hash` (optional)
- `observed_at` (instant)

---

## Reglas canónicas de Merge / Dedupe
### Entidades
- Merge produce:
  - entidad A: `status=merged`, `merged_into_entity_id=B`
  - entidad B: absorbe external_refs/attributes
- No se borra historia: tombstone o merged.

### Relaciones
- Si se detecta duplicado, se fusionan `sources`, se recalcula confianza y se conserva `relationship_id` canónico.

---

## MVP vs Expansión
### MVP (obligatorio para desbloquear Entity Graph)
- entities
- entity_relationships
- entity_events
- timeline link por `entity_id` (y opcional `entity_event_id`)
- provenance + confidence (mínimo estructural)

### Expansión (post-MVP)
- Versionado completo (bitemporal)
- Políticas de resolución (Policy Layer) que “escriben” eventos/relaciones
- Embeddings por entidad/relación (vector memory)
- Ontología extendida (subtypes) y reglas por departamento
- “Claims” vs “Facts” (modelo epistemológico formal)

---

## Ejemplos mínimos

### Ejemplo: Person + Company + Relationship
Entity (Person):
- entity_id: ent_person_001
- entity_type: person
- canonical_name: "Carolina Salazar"
- external_refs: [{system:"google", key:"carolina@...", url:"mailto:..."}]

Entity (Company):
- entity_id: ent_company_001
- entity_type: organization
- canonical_name: "Euphorianet S.A.S."

Relationship:
- relationship_type: works_at
- from_entity_id: ent_person_001
- to_entity_id: ent_company_001
- valid_time: {start:"2024-01-01"}

Event:
- event_type: meeting
- primary_entity_id: ent_company_001
- related_entity_ids: ["ent_person_001"]
- title: "Validación Agente 1 - reconciliación bancaria"

Timeline item:
- entity_id: ent_company_001
- entity_event_id: entev_...

---

## WITs (System Invariants)
WIT-EM-001: **Toda entidad tiene entity_id estable** y status controlado.  
WIT-EM-002: **Toda relación referencia from_entity_id y to_entity_id** existentes (contractualmente).  
WIT-EM-003: **Todo evento tiene primary_entity_id** y occurred_time válido.  
WIT-EM-004: **Timeline item referencia entity_id** (truth link obligatorio).  
WIT-EM-005: **Provenance existe** para entidades, relaciones y eventos.  
WIT-EM-006: **No hay duplicados activos** de relaciones con misma tupla (type,from,to) y overlap temporal.

---

## FITs vinculados
- FIT-EntityGraph (exists + used)
- FIT-EntityTimelineLink (timeline references entity_id)
