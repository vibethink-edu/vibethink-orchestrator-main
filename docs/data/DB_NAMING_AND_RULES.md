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
2.  **Canonical Naming**: Los nombres de las tablas DEBEN mapear a la **Ontología SELLADA** de ViTo (ver Sección 2 para reglas de pluralización).
3.  **Audit Always**: Las entidades core DEBEN incluir campos de auditoría estándar.
4.  **Vendor Agnostic Naming**: El naming debe ser independiente del motor de DB.
5.  **Snake Case**: Todo objeto de base de datos (tablas, columnas, índices, constraints) usa `snake_case`.

---

## 2. Naming de Tablas (Mapeo Ontológico)

### Norma de Transformación Ontológica: Singular → Plural
La Ontología ViTo define entidades en singular (**Identity Entity**), mientras que la base de datos representa colecciones persistentes de dichas entidades (**Collection Table**).

| Ontología (Singular Entity) | Base de Datos (Plural Table) |
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
| Organization Unit | `organization_units` |
| Person | `persons` |
| Identity User | `identity_users` |
| Capability Activation | `capability_activations` |
| Temporal Context | `temporal_contexts` |

**Nota: `identity_users` se define como un Bridge Técnico Ontológico** que representa actores internos autenticados, distinto de la entidad `Person`.

### Reglas de Prefijos
- `sys_*`: Tablas de sistema o metadatos internos (ej: `sys_migrations`).
- `meta_*`: Configuraciones de capacidades o definiciones.
- `audit_*`: Logs de auditoría de bajo nivel.

---

## 3. Naming de Columnas

### Reglas
- **Singular**: Los campos representan un único atributo.
- **PK**: Siempre se denomina `id`.
- **FK**: `{singular_table_name}_id` (ej: `tenant_id`, `case_id`).
- **Booleans**: Prefijo `is_`, `has_`, `can_`.
- **Timestamps**: Sufijo `_at`.
- **Dates**: Sufijo `_date`.

---

## 4. PK / FK / Index Naming

| Tipo | Prefijo/Sufijo | Patrón | Ejemplo |
| :--- | :--- | :--- | :--- |
| **Primary Key** | `pk_` | `pk_{table_name}` | `pk_cases` |
| **Foreign Key** | `fk_` | `fk_{src}_{target}_{col}` | `fk_cases_tenants_tenant_id` |
| **Unique** | `uq_` | `uq_{table}_{cols}` | `uq_tenants_slug` |
| **Check** | `ck_` | `ck_{table}_{cond}` | `ck_cases_status` |
| **Index** | `idx_` | `idx_{table}_{cols}` | `idx_cases_tenant_id` |

---

## 5. Audit Fields (Standard)

```sql
created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
created_by_user_id UUID REFERENCES identity_users(id),
updated_by_user_id UUID REFERENCES identity_users(id),
deleted_at         TIMESTAMPTZ -- Soft Delete (Opcional)
```

---

## 6. Multi-tenant Enforcement

### Ley de Aislamiento Estricto
Las relaciones cross-tenant están **PROHIBIDAS**. El enforcement ocurre a nivel de base de datos.

1.  **Composite Foreign Keys (Patrón Recomendado)**:
    Para asegurar que un objeto hijo pertenece al mismo tenant que su padre, se deben usar FKs compuestas:
    ```sql
    CONSTRAINT fk_cases_workspaces 
      FOREIGN KEY (tenant_id, workspace_id) 
      REFERENCES workspaces (tenant_id, id)
    ```

2.  **Cross-Tenant Validation (Trigger Fallback)**:
    Si no es posible usar FKs compuestas, se debe implementar un trigger de validación:
    ```sql
    -- Ejemplo conceptual:
    -- IF (NEW.tenant_id != (SELECT tenant_id FROM parent WHERE id = NEW.parent_id)) 
    -- THEN RAISE EXCEPTION 'Cross-tenant violation';
    ```

3.  **Row-Level Security (RLS)**:
    Implementación requerida en PostgreSQL para capas de acceso directo:
    ```sql
    ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
    CREATE POLICY tenant_isolation_policy ON cases
      USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
    ```

### Reference Implementation (PL/pgSQL)

Para asegurar el aislamiento físico en relaciones donde no es viable el uso de FKs compuestas:

```sql
-- 1. Función de validación universal de Tenant
CREATE OR REPLACE FUNCTION validate_tenant_fk()
RETURNS TRIGGER AS $$
DECLARE
    parent_tenant_id UUID;
BEGIN
    -- Obtenemos el tenant_id del padre (ej: workspace_id)
    -- TG_ARGV[0] es el nombre de la tabla padre, TG_ARGV[1] el FK col name
    EXECUTE format('SELECT tenant_id FROM %I WHERE id = $1', TG_ARGV[0])
    INTO parent_tenant_id
    USING (CASE 
        WHEN TG_ARGV[1] = 'workspace_id' THEN NEW.workspace_id 
        WHEN TG_ARGV[1] = 'parent_id' THEN NEW.parent_id
        ELSE NULL 
    END);

    IF (NEW.tenant_id != parent_tenant_id) THEN
        RAISE EXCEPTION 'Cross-tenant violation: child tenant % does not match parent % tenant %', 
            NEW.tenant_id, TG_ARGV[0], parent_tenant_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger aplicado a la tabla 'cases'
CREATE TRIGGER trg_validate_case_tenant
BEFORE INSERT OR UPDATE ON cases
FOR EACH ROW
EXECUTE FUNCTION validate_tenant_fk('workspaces', 'workspace_id');
```

---

## 7. Vendor Agnostic & Guide

PostgreSQL se define como la **implementación de referencia**. El uso de `UUID`, `TIMESTAMPTZ` y `JSONB` es normativo pero adaptable.

### Guía de Portabilidad

| Feature | PostgreSQL (Ref) | MySQL | SQL Server |
| :--- | :--- | :--- | :--- |
| **Primary Key** | `UUID` / `GEN_RANDOM_UUID()` | `BINARY(16)` / `UUID_TO_BIN()` | `UNIQUEIDENTIFIER` / `NEWID()` |
| **Timestamps** | `TIMESTAMPTZ` | `DATETIME(6)` (UTC) | `DATETIMEOFFSET` |
| **JSON** | `JSONB` | `JSON` | `NVARCHAR(MAX)` + `ISJSON` |
| **Audit Trigger** | `BEFORE UPDATE` | `BEFORE UPDATE` | `AFTER UPDATE` (via INSTEAD OF) |

---

## 8. No-Gos (Anti-patrones)

- 🚫 **No usar CamelCase**.
- 🚫 **No usar ENUMS nativos**: Preferir `VARCHAR` + `CHECK constraints` para facilitar migraciones.
- 🚫 **No prefijos redundantes**: No llamar a una columna `case_title` dentro de la tabla `cases`.
- 🚫 **No saltar la Ontología**.
- 🚫 **No permitir Cross-Tenant Joins sin validación de ID de inquilino**.

---

## 9. Vector / Embedding Extensions (RAG Ops)

### Naming y Estructura
Almacenamiento de Embeddings y Chunks para operaciones semánticas.

1.  **Tablas de Embeddings**:
    Deben tener el prefijo o sufijo explícito que denote su naturaleza vectorial.
    *   Sufijo: `_embeddings` (Recomendado) o `_vectors`.
    *   Ejemplo: `knowledge_artifacts_embeddings`.

2.  **Dimensiones Estrictas**:
    Las columnas vectoriales DEBEN declarar su dimensión para evitar mismatch de modelos.
    *   `embedding vector(1536)` (OpenAI text-embedding-3-small)
    *   `embedding vector(3072)` (OpenAI text-embedding-3-large)
    
3.  **Chunking Metadata (Obligatorio)**:
    Todo chunk debe ser trazable a su fuente original.
    ```sql
    source_id      UUID NOT NULL REFERENCES origin_table(id), -- FK a la fuente
    chunk_index    INTEGER NOT NULL,   -- Orden secuencial
    chunk_content  TEXT NOT NULL,      -- Texto plano del chunk
    tokens_count   INTEGER,            -- Cost accounting
    embedding      VECTOR(1536),       -- Payload vectorial
    strategy_v     VARCHAR(20)         -- Versión del algoritmo de chunking (ej: 'v1.0-overlap-200')
    ```

4.  **Índices HNSW**:
    Para producción, usar índices HNSW en lugar de IVFFlat para performance.
    ```sql
    CREATE INDEX idx_artifacts_embedding ON knowledge_artifacts_embeddings 
    USING hnsw (embedding vector_cosine_ops);
    ```

