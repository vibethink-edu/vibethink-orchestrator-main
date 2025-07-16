# SQL Migration Troubleshooting Guide

## 🚨 **Error Crítico: Functions in Index Predicate Must Be Marked IMMUTABLE**

### **Error Completo:**
```sql
ERROR: 42P17: functions in index predicate must be marked IMMUTABLE
```

### **🔍 Descripción del Problema**

Este error ocurre cuando intentas crear **índices parciales** (partial indexes) en PostgreSQL que usan funciones que no están marcadas como `IMMUTABLE`.

**Funciones NO inmutables comunes:**
- `now()` - Retorna la fecha/hora actual
- `current_timestamp` - Timestamp actual
- `random()` - Número aleatorio
- `uuid_generate_v4()` - UUID aleatorio
- `clock_timestamp()` - Timestamp del reloj del sistema

### **❌ Ejemplo Problemático:**
```sql
-- ❌ ESTO CAUSA ERROR
CREATE INDEX idx_logs_recent ON permission_logs(created_at DESC) 
WHERE created_at > now() - interval '30 days';
```

### **✅ Solución Correcta:**

#### **Opción 1: Eliminar Índices Parciales (Recomendado)**
```sql
-- ✅ FUNCIONA PERFECTAMENTE
CREATE INDEX idx_logs_created_at ON permission_logs(created_at DESC);
CREATE INDEX idx_logs_user_time ON permission_logs(user_id, created_at DESC);
```

#### **Opción 2: Usar Funciones Inmutables**
```sql
-- ✅ Si necesitas índices parciales, usa funciones inmutables
CREATE INDEX idx_logs_recent ON permission_logs(created_at DESC) 
WHERE created_at > '2024-01-01'::timestamp;
```

#### **Opción 3: Crear Función Inmutable Personalizada**
```sql
-- ✅ Crear función inmutable para fechas
CREATE OR REPLACE FUNCTION get_cutoff_date()
RETURNS timestamp
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT '2024-01-01'::timestamp;
$$;

-- ✅ Usar en índice parcial
CREATE INDEX idx_logs_recent ON permission_logs(created_at DESC) 
WHERE created_at > get_cutoff_date();
```

### **🎯 Caso Específico: Sistema de Permisos Departamentales**

#### **Problema Encontrado:**
```sql
-- ❌ CAUSABA ERROR
CREATE INDEX idx_permission_logs_recent ON permission_logs(created_at DESC) 
WHERE created_at > now() - interval '30 days';

CREATE INDEX idx_data_access_logs_recent ON data_access_logs(created_at DESC) 
WHERE created_at > now() - interval '30 days';
```

#### **Solución Aplicada:**
```sql
-- ✅ ELIMINADOS - Usar índices completos en su lugar
CREATE INDEX idx_permission_logs_user_time ON permission_logs(user_id, created_at DESC);
CREATE INDEX idx_permission_logs_company_time ON permission_logs(company_id, created_at DESC);
CREATE INDEX idx_permission_logs_action_time ON permission_logs(action, created_at DESC);

CREATE INDEX idx_data_access_logs_user_time ON data_access_logs(user_id, created_at DESC);
CREATE INDEX idx_data_access_logs_company_time ON data_access_logs(company_id, created_at DESC);
CREATE INDEX idx_data_access_logs_success_time ON data_access_logs(success, created_at DESC);
```

### **📊 Impacto en Performance**

#### **Antes (Índices Parciales):**
- ✅ Menor tamaño de índice
- ✅ Consultas más rápidas para datos recientes
- ❌ Error de migración

#### **Después (Índices Completos):**
- ✅ Migración exitosa
- ✅ Consultas rápidas para todos los datos
- ✅ Mejor flexibilidad
- ⚠️ Índices ligeramente más grandes

### **🔧 Estrategias de Optimización Alternativas**

#### **1. Limpieza Automática de Logs**
```sql
-- Función para limpiar logs antiguos
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

#### **2. Particionamiento de Tablas**
```sql
-- Para tablas muy grandes, considerar particionamiento
CREATE TABLE permission_logs_2024 PARTITION OF permission_logs
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

#### **3. Índices Condicionales con Valores Fijos**
```sql
-- Si necesitas índices parciales, usar valores fijos
CREATE INDEX idx_logs_2024 ON permission_logs(created_at DESC) 
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

### **🚀 Checklist de Migración**

#### **Antes de Ejecutar Migración:**
- [ ] Verificar que no hay funciones no inmutables en índices parciales
- [ ] Reemplazar `now()` con valores fijos o eliminar índices parciales
- [ ] Probar migración en entorno de desarrollo
- [ ] Verificar que las funciones RPC no usen funciones no inmutables

#### **Después de Ejecutar Migración:**
- [ ] Verificar que todas las tablas se crearon correctamente
- [ ] Confirmar que las funciones RPC funcionan
- [ ] Probar las políticas RLS
- [ ] Verificar que los triggers funcionan
- [ ] Comprobar que los índices se crearon

### **📝 Patrones a Evitar**

#### **❌ NO HACER:**
```sql
-- Usar funciones no inmutables en índices
CREATE INDEX idx_problematic ON table_name(column) 
WHERE created_at > now() - interval '1 day';

-- Usar funciones no inmutables en WHERE de índices
CREATE INDEX idx_problematic ON table_name(column) 
WHERE random() > 0.5;

-- Usar funciones no inmutables en expresiones de índice
CREATE INDEX idx_problematic ON table_name(column) 
WHERE uuid_generate_v4()::text = 'some-value';
```

#### **✅ HACER:**
```sql
-- Usar índices completos
CREATE INDEX idx_safe ON table_name(column);

-- Usar valores fijos en índices parciales
CREATE INDEX idx_safe_partial ON table_name(column) 
WHERE created_at > '2024-01-01'::timestamp;

-- Usar funciones inmutables
CREATE INDEX idx_safe_function ON table_name(column) 
WHERE immutable_function() = 'value';
```

### **🔍 Debugging de Errores de Migración**

#### **1. Identificar el Problema:**
```bash
# Verificar logs de migración
npx supabase db push --debug

# Verificar estado de migraciones
npx supabase migration list
```

#### **2. Verificar Funciones en Índices:**
```sql
-- Consulta para encontrar índices problemáticos
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE indexdef LIKE '%now()%' 
   OR indexdef LIKE '%current_timestamp%'
   OR indexdef LIKE '%random()%';
```

#### **3. Verificar Funciones RPC:**
```sql
-- Consulta para verificar funciones RPC
SELECT 
    proname,
    prosrc
FROM pg_proc 
WHERE proname LIKE '%permission%' 
   OR proname LIKE '%department%';
```

### **📚 Referencias Técnicas**

#### **Documentación PostgreSQL:**
- [CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html)
- [Indexes and ORDER BY](https://www.postgresql.org/docs/current/indexes-ordering.html)
- [Partial Indexes](https://www.postgresql.org/docs/current/indexes-partial.html)

#### **Funciones Inmutables vs Mutables:**
- **IMMUTABLE**: `upper()`, `lower()`, `length()`, `substring()`
- **STABLE**: `current_user`, `current_database()`
- **VOLATILE**: `now()`, `random()`, `uuid_generate_v4()`

### **🎯 Lecciones Aprendidas**

1. **Siempre probar migraciones** en entorno de desarrollo primero
2. **Evitar funciones no inmutables** en índices parciales
3. **Usar índices completos** cuando sea posible
4. **Implementar limpieza automática** para mantener performance
5. **Documentar patrones problemáticos** para evitar repetición

### **🚀 Mejores Prácticas**

#### **Para Índices de Logging:**
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

**📝 Nota:** Este documento debe actualizarse cada vez que se encuentren nuevos errores de migración para mantener un registro completo de soluciones.

**🔗 Archivos Relacionados:**
- `supabase/migrations/20250618130000_create_departmental_permission_system.sql`
- `scripts/apply-migration-manual.sql`
- `docs/DEPARTMENTAL_PERMISSIONS_SYSTEM.md` 