# Entity Relationship Taxonomy (Canonical)

## Propósito
Definir el vocabulario canónico de **relationship_type** para el Entity Graph.
Debe ser:
- Pequeño en MVP (alto leverage)
- Extensible sin romper compatibilidad
- Explícito en directionality y roles

---

## Principios
1) **Tipado estricto**: no “generic_link” en MVP.  
2) **Direccionalidad por defecto**: `directed`, salvo casos simétricos.  
3) **Rol semántico**: los roles ayudan a UX pero no reemplazan el type.  
4) **Tiempo opcional pero normalizado**: valid_time debe existir cuando aplica.

---

## Tipos canónicos (MVP)

### Identity / Equivalence
- `same_as` (undirected)
  - Uso: dedupe, identidad equivalencial entre entidades (pre-merge)
  - Nota: si se confirma, se ejecuta merge; `same_as` puede quedar como evidencia histórica.

### People ↔ Organization
- `works_at` (directed) person → organization
- `owns` (directed) person/organization → organization
- `manages` (directed) person → person/organization
- `member_of` (directed) person → organization (comunidades, asociaciones)

### Organization ↔ Organization
- `subsidiary_of` (directed) organization → organization
- `partner_of` (undirected) organization ↔ organization (si es realmente simétrico)
- `vendor_of` (directed) organization → organization (A vende a B)
- `customer_of` (directed) organization → organization (A compra a B)

### Contract / Document Links
- `signatory_of` (directed) person/organization → contract
- `references` (directed) document → entity (documento referencia entidad)

### Finance / Accounts (si aplica a tu dominio)
- `holds_account` (directed) person/organization → account
- `issued_by` (directed) account/instrument → organization (banco, emisor)
- `authorized_on` (directed) person → account (firmante / autorizado)

---

## Tipos recomendados (post-MVP)
- `reports_to` person → person
- `assigned_to` task/ticket → person
- `located_in` entity → location
- `uses_tool` organization/team → tool/system
- `governed_by` entity → policy
- `impacts` event → entity

---

## Constraints por tipo (MVP)
Ejemplos:

### works_at
- from_entity_type MUST = person
- to_entity_type MUST = organization
- valid_time recomendado

### owns
- from_entity_type ∈ {person, organization}
- to_entity_type MUST = organization
- strength recomendado (porcentaje)

### vendor_of / customer_of
- ambos MUST = organization
- vendor_of(A→B) implica customer_of(B→A) (derivable), pero no obligatorio duplicarlo.
  - Regla: si se materializa ambos, deben ser consistentes.

### same_as
- from_entity_type MUST = to_entity_type (por defecto)
- undirected

---

## Naming y Versioning
- Names en `snake_case`
- Cambios breaking: crear nuevo type y deprecate el anterior.
- Deprecación: documentar mapping.

---

## Ejemplos

### vendor_of
- relationship_type: vendor_of
- from_entity_id: ent_org_supplier
- to_entity_id: ent_org_client
- roles: {from_role:"vendor", to_role:"customer"}

### owns (50%)
- relationship_type: owns
- strength: 0.5
- valid_time: {start:"2020-01-01"}
