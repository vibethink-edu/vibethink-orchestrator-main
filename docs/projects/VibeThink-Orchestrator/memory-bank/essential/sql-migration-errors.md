# SQL Migration Error: IMMUTABLE Functions in Index Predicates

## 🚨 **Error Crítico Documentado**

### **Error Completo:**
```
ERROR: 42P17: functions in index predicate must be marked IMMUTABLE
```

### **📅 Fecha de Encuentro:**
- **Fecha:** 18 de Diciembre 2024
- **Proyecto:** VibeThink Orchestrator
- **Contexto:** Sistema de Permisos Departamentales
- **Migración:** `20250618130000_create_departmental_permission_system.sql`

### **🔍 Causa Raíz:**
PostgreSQL requiere que las funciones usadas en **índices parciales** (partial indexes) estén marcadas como `IMMUTABLE`. Las funciones que retornan valores diferentes en cada llamada (como `now()`, `random()`, `uuid_generate_v4()`) **NO pueden usarse** en definiciones de índices.

### **❌ Código Problemático:**
```sql
-- ❌ ESTO CAUSA ERROR 42P17
CREATE INDEX idx_permission_logs_recent ON permission_logs(created_at DESC) 
WHERE created_at > now() - interval '30 days';

CREATE INDEX idx_data_access_logs_recent ON data_access_logs(created_at DESC) 
WHERE created_at > now() - interval '30 days';
```

### **✅ Solución Aplicada:**
```sql
-- ✅ ELIMINAR ÍNDICES PARCIALES PROBLEMÁTICOS
-- Mantener solo índices completos que funcionan perfectamente

CREATE INDEX idx_permission_logs_user_time ON permission_logs(user_id, created_at DESC);
CREATE INDEX idx_permission_logs_company_time ON permission_logs(company_id, created_at DESC);
CREATE INDEX idx_permission_logs_action_time ON permission_logs(action, created_at DESC);

CREATE INDEX idx_data_access_logs_user_time ON data_access_logs(user_id, created_at DESC);
CREATE INDEX idx_data_access_logs_company_time ON data_access_logs(company_id, created_at DESC);
CREATE INDEX idx_data_access_logs_success_time ON data_access_logs(success, created_at DESC);
```

### **🎯 Funciones Problemáticas Comunes:**

#### **❌ NO Inmutables (Causan Error):**
- `now()` - Fecha/hora actual
- `current_timestamp` - Timestamp actual
- `random()` - Número aleatorio
- `uuid_generate_v4()` - UUID aleatorio
- `clock_timestamp()` - Timestamp del reloj del sistema
- `current_user` - Usuario actual
- `current_database()` - Base de datos actual

#### **✅ Inmutables (Funcionan):**
- `upper()`, `lower()` - Transformación de texto
- `length()`, `substring()` - Operaciones de string
- `abs()`, `round()` - Operaciones matemáticas
- `to_char()`, `to_date()` - Conversiones con parámetros fijos

### **🔧 Estrategias de Solución:**

#### **Opción 1: Eliminar Índices Parciales (Recomendado)**
```sql
-- ✅ Usar índices completos en lugar de parciales
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX idx_logs_user_time ON logs(user_id, created_at DESC);
```

#### **Opción 2: Usar Valores Fijos**
```sql
-- ✅ Índice parcial con fecha fija
CREATE INDEX idx_logs_2024 ON logs(created_at DESC) 
WHERE created_at > '2024-01-01'::timestamp;
```

#### **Opción 3: Crear Función Inmutable**
```sql
-- ✅ Función inmutable personalizada
CREATE OR REPLACE FUNCTION get_cutoff_date()
RETURNS timestamp
LANGUAGE sql
IMMUTABLE
AS $$ SELECT '2024-01-01'::timestamp; $$;

-- ✅ Usar en índice parcial
CREATE INDEX idx_logs_recent ON logs(created_at DESC) 
WHERE created_at > get_cutoff_date();
```

### **📊 Impacto en Performance:**

#### **Antes (Índices Parciales):**
- ✅ Menor tamaño de índice
- ✅ Consultas más rápidas para datos recientes
- ❌ **Error de migración**

#### **Después (Índices Completos):**
- ✅ Migración exitosa
- ✅ Consultas rápidas para todos los datos
- ✅ Mejor flexibilidad
- ⚠️ Índices ligeramente más grandes

### **🚀 Optimización Alternativa:**

#### **Limpieza Automática de Logs:**
```sql
-- Función para mantener performance sin índices parciales
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Eliminar logs de permisos más antiguos de 90 días
  DELETE FROM permission_logs 
  WHERE created_at < now() - interval '90 days';
  
  -- Eliminar logs de acceso más antiguos de 60 días
  DELETE FROM data_access_logs 
  WHERE created_at < now() - interval '60 days';
END;
$$;
```

### **🎯 Checklist de Prevención:**

#### **Antes de Crear Índices:**
- [ ] Verificar que no hay funciones no inmutables
- [ ] Reemplazar `now()` con valores fijos
- [ ] Usar índices completos cuando sea posible
- [ ] Probar migración en desarrollo

#### **Funciones a Evitar en Índices:**
- [ ] `now()`, `current_timestamp`
- [ ] `random()`, `uuid_generate_v4()`
- [ ] `clock_timestamp()`
- [ ] `current_user`, `current_database()`

### **📝 Patrones Seguros:**

#### **✅ Índices Seguros:**
```sql
-- Índices completos (siempre seguros)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX idx_logs_user_time ON logs(user_id, created_at DESC);

-- Índices parciales con valores fijos (seguros)
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;
CREATE INDEX idx_logs_2024 ON logs(created_at) WHERE created_at > '2024-01-01'::timestamp;
```

#### **❌ Índices Problemáticos:**
```sql
-- Usar funciones no inmutables
CREATE INDEX idx_recent ON logs(created_at) WHERE created_at > now() - interval '1 day';

-- Usar funciones aleatorias
CREATE INDEX idx_random ON logs(id) WHERE random() > 0.5;

-- Usar funciones de tiempo
CREATE INDEX idx_current ON logs(id) WHERE created_at > current_timestamp - interval '1 hour';
```

### **🔍 Debugging:**

#### **Verificar Índices Problemáticos:**
```sql
-- Consulta para encontrar índices que usan funciones no inmutables
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE indexdef LIKE '%now()%' 
   OR indexdef LIKE '%current_timestamp%'
   OR indexdef LIKE '%random()%'
   OR indexdef LIKE '%uuid_generate_v4()%';
```

#### **Verificar Funciones en Índices:**
```sql
-- Verificar si una función es inmutable
SELECT proname, provolatile 
FROM pg_proc 
WHERE proname = 'function_name';
-- provolatile: 'i'=immutable, 's'=stable, 'v'=volatile
```

### **📚 Referencias:**

#### **Documentación PostgreSQL:**
- [CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html)
- [Indexes and ORDER BY](https://www.postgresql.org/docs/current/indexes-ordering.html)
- [Partial Indexes](https://www.postgresql.org/docs/current/indexes-partial.html)

#### **Funciones por Volatilidad:**
- **IMMUTABLE**: `upper()`, `lower()`, `length()`, `substring()`, `abs()`, `round()`
- **STABLE**: `current_user`, `current_database()`, `current_setting()`
- **VOLATILE**: `now()`, `random()`, `uuid_generate_v4()`, `clock_timestamp()`

### **🎯 Lecciones Aprendidas:**

1. **Siempre verificar funciones** antes de crear índices parciales
2. **Usar índices completos** cuando sea posible
3. **Implementar limpieza automática** para mantener performance
4. **Probar migraciones** en desarrollo antes de producción
5. **Documentar patrones problemáticos** para evitar repetición

### **🚀 Mejores Prácticas:**

#### **Para Sistemas de Logging:**
```sql
-- ✅ Patrón recomendado
CREATE INDEX idx_logs_user_time ON logs(user_id, created_at DESC);
CREATE INDEX idx_logs_company_time ON logs(company_id, created_at DESC);
CREATE INDEX idx_logs_action_time ON logs(action, created_at DESC);

-- Implementar limpieza automática
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM logs WHERE created_at < now() - interval '90 days';
END;
$$ LANGUAGE plpgsql;
```

#### **Para Índices de Performance:**
```sql
-- ✅ Índices compuestos para consultas frecuentes
CREATE INDEX idx_user_department_active ON user_department_memberships(user_id, department_id, is_active);
CREATE INDEX idx_permission_department_active ON department_permissions(department_id, permission, is_active);
```

---

**📝 Nota:** Este error es **CRÍTICO** y puede afectar cualquier migración que use funciones no inmutables en índices parciales. **Siempre verificar** antes de crear índices.

**🔗 Archivos Relacionados:**
- `supabase/migrations/20250618130000_create_departmental_permission_system.sql`
- `scripts/apply-migration-manual.sql`
- `docs/SQL_MIGRATION_TROUBLESHOOTING.md`
- `docs/COMMON_SQL_ERRORS.md` 