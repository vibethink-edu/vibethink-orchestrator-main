# ViTo Database Naming & Persistence Rules

**Status**: SEALED
**Authority**: Engineering Rector Pack v1 · ViTo Canonical Ontology
**Last Updated**: 2026-01-09
**Scope**: Normative rules for database persistence layer in ViTo platform.

---

## 🎯 Objetivo

Establecer un estándar riguroso de naming y estructura para la base de datos de ViTo, asegurando consistencia, observabilidad y aislamiento multi-tenant desde el diseño.

---

## 1. Non-Negotiables (Leyes de Hierro)

1.  **Multi-Tenant Isolation**: Toda tabla con datos de clientes DEBE incluir `tenant_id`. No hay excepciones para datos operativos.
2.  **Canonical Naming**: Los nombres de las tablas DEBEN mapear 1:1 con la **Ontología SELLADA** de ViTo (ej: `communication_signals`, no `emails`).
3.  **Audit Always**: Las entidades core DEBEN incluir campos de auditoría estándar.
4.  **Vendor Agnostic Naming**: El naming debe ser independiente del motor de DB (PostgreSQL, MySQL, snowflake, etc.).
5.  **Snake Case**: Todo objeto de base de datos (tablas, columnas, índices, constraints) usa `snake_case`.

---

## 2. Naming de Tablas

### Reglas
- **Plural**: Las tablas representan colecciones de entidades.
- **Nombres Autodescriptivos**: Evitar abreviaciones (ej: use `organizations`, no `orgs`).
- **Domain First**: El nombre debe empezar por la entidad principal.
- **Prefixes Reservados**:
    - `sys_*`: Tablas de sistema o metadatos internos (ej: `sys_migrations`).
    - `meta_*`: Configuraciones de capacidades o definiciones.
    - `audit_*`: Logs de auditoría de bajo nivel.

### Ejemplos (Alineados con Ontología)
| Entidad Ontológica | Nombre de Tabla (DB) |
| :--- | :--- |
| Communication Signal | `communication_signals` |
| Interaction Signal | `interaction_signals` |
| Commitment Signal | `commitment_signals` |
| Knowledge Artifact | `knowledge_artifacts` |
| Case | `cases` |
| Program | `programs` |
| Tenant | `tenants` |
| Workspace | `workspaces` |
| Organization | `organizations` |
| Person | `persons` |

---

## 3. Naming de Columnas

### Reglas
- **Singular**: Los campos representan un único atributo.
- **PK**: Siempre se denomina `id`.
- **FK**: `{singular_table_name}_id` (ej: `tenant_id`, `case_id`).
- **Booleans**: Prefijo `is_`, `has_`, `can_` (ej: `is_active`, `has_content`).
- **Timestamps**: Sufijo `_at` (ej: `occurred_at`, `created_at`).
- **Dates**: Sufijo `_date` (ej: `birth_date`).

### Ejemplos
- `display_name` (en `persons`)
- `status` (en `cases`)
- `occurred_at` (en `communication_signals`)
- `content_ref` (referencia externa de contenido)

---

## 4. PK / FK / Index Naming

Para facilitar la administración y el debugging, los nombres de constraints e índices deben seguir un patrón predecible.

| Tipo | Prefijo/Sufijo | Patrón | Ejemplo |
| :--- | :--- | :--- | :--- |
| **Primary Key** | `pk_` | `pk_{table_name}` | `pk_cases` |
| **Foreign Key** | `fk_` | `fk_{src}_{target}_{col}` | `fk_cases_tenants_tenant_id` |
| **Unique** | `uq_` | `uq_{table}_{cols}` | `uq_tenants_slug` |
| **Check** | `ck_` | `ck_{table}_{cond}` | `ck_cases_status` |
| **Index** | `idx_` | `idx_{table}_{cols}` | `idx_cases_tenant_id` |

---

## 5. Audit Fields (Standard)

Toda tabla de dominio DEBE incluir estos campos para trazabilidad.

```sql
created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by_user_id UUID REFERENCES identity_users(id),
updated_by_user_id UUID REFERENCES identity_users(id),
deleted_at         TIMESTAMPTZ -- Solo si se requiere Soft Delete
```

*Nota: Se prefiere `TIMESTAMPTZ` para asegurar que el motor gestione el offset UTC correctamente.*

---

## 6. Multi-tenant Constraints

### Aislamiento por Tenant
El `tenant_id` es el límite físico y lógico de los datos.
- **Mandatory**: `tenant_id UUID NOT NULL` en toda tabla operativa.
- **Index Priority**: El primer campo de cualquier índice compuesto suele ser `tenant_id` para optimizar el filtrado por cliente.

### Relaciones Cross-Tenant (PROHIBIDAS)
No se permiten Foreign Keys que apunten a un `id` que pertenezca a un `tenant_id` diferente. La aplicación o un trigger de base de datos debe validar la consistencia de `tenant_id` en joins.

### Ejemplo de tabla multi-tenant (Case)
```sql
CREATE TABLE cases (
  id           UUID PRIMARY KEY,
  tenant_id    UUID NOT NULL,
  workspace_id UUID NOT NULL,
  title        VARCHAR(255) NOT NULL,
  status       VARCHAR(50) NOT NULL,
  
  -- Auditoría
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_cases_tenants FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_cases_workspaces FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
  CONSTRAINT ck_cases_status CHECK (status IN ('OPEN', 'IN_PROGRESS', 'CLOSED', 'ARCHIVED'))
);

-- Índice obligatorio para performance de inquilino
CREATE INDEX idx_cases_tenant_workspace ON cases(tenant_id, workspace_id);
```

---

## 7. No-Gos (Anti-patrones)

- 🚫 **No usar CamelCase**: La DB es case-insensitive en muchos motores; `snake_case` es universal.
- 🚫 **No usar tipos complejos ocultos**: Evitar `ENUMS` nativos del motor (ej: PostgreSQL ENUM) si estos dificultan migraciones; preferir `VARCHAR` + `CHECK constraints`.
- 🚫 **No prefijos redundantes**: No llamar a una columna `case_title` dentro de la tabla `cases`. Usar simplemente `title`.
- 🚫 **No saltar la Ontología**: Si necesitas una tabla para "Leads", primero verifica si no es un "Person" con un rol específico o un "Case" de tipo venta.
