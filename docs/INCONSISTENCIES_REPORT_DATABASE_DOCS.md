# 🔧 REPORTE DE INCONSISTENCIAS - Documentación vs Schema Actual

## 📋 **RESUMEN EJECUTIVO**

Se han identificado **inconsistencias críticas** entre la documentación existente y el nuevo schema de base de datos implementado. Estas inconsistencias pueden causar problemas de desarrollo y confusión en el equipo.

## 🚨 **INCONSISTENCIAS CRÍTICAS IDENTIFICADAS**

### **1. Schema de Usuarios - CRÍTICO**

#### **Problema**: Dos definiciones diferentes de tablas de usuario

**Documentación Anterior** (`TECHNICAL_ARCHITECTURE.md`):
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT DEFAULT 'employee',
  department TEXT,
  -- SIN multi-tenancy
);
```

**Schema Actual** (`20250725000000_core_companies_superadmin.sql`):
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'EMPLOYEE',
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  -- CON multi-tenancy completo
);
```

#### **Impacto**:
- ❌ Código frontend puede referenciar tabla incorrecta
- ❌ APIs pueden fallar por nombres de tabla diferentes
- ❌ Queries existentes pueden ser incompatibles

---

### **2. Sistema Multi-Tenant - CRÍTICO**

#### **Problema**: Documentación no refleja arquitectura multi-tenant

**Falta en documentación anterior**:
- ✅ Tabla `companies` (tenant root)
- ✅ Row Level Security (RLS)
- ✅ Company isolation
- ✅ Super admin functionality

#### **Impacto**:
- ❌ Desarrolladores no entienden el modelo multi-tenant
- ❌ Implementaciones pueden violar aislamiento de datos
- ❌ Falta claridad sobre seguridad

---

### **3. Roles de Usuario - ALTO**

#### **Problema**: Definiciones de roles inconsistentes

**En project-overview.md**:
```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}
```

**En schema actual**:
```sql
CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN',
    'COMPANY_OWNER',    -- ¡NUEVO!
    'COMPANY_ADMIN',    -- ¡NUEVO!
    'MANAGER',          -- ¡NUEVO!
    'EMPLOYEE',         -- ¡NUEVO!
    'GUEST'            -- ¡NUEVO!
);
```

#### **Impacto**:
- ❌ Frontend puede no manejar nuevos roles
- ❌ Componentes de autorización desactualizados
- ❌ Confusión sobre permisos

---

### **4. Naming Conventions - MEDIO**

#### **Problema**: Inconsistencia en nombres de tablas y campos

**Diferencias encontradas**:
- `profiles` vs `user_profiles`
- `role TEXT` vs `role user_role`
- `employee` vs `EMPLOYEE`

#### **Impacto**:
- ❌ Queries pueden fallar silenciosamente
- ❌ Code generation puede generar tipos incorrectos

---

## 🔧 **PLAN DE CORRECCIÓN**

### **Fase 1: Actualizar Documentación Core (URGENTE)**

1. **Actualizar TECHNICAL_ARCHITECTURE.md**
   - ✅ Reemplazar schema `profiles` con `user_profiles`
   - ✅ Agregar tabla `companies`
   - ✅ Documentar RLS policies
   - ✅ Actualizar roles completos

2. **Actualizar project-overview.md**
   - ✅ Corregir enum de roles
   - ✅ Agregar explicación multi-tenant
   - ✅ Actualizar ejemplos de código

### **Fase 2: Validar Código Existente (ALTO)**

3. **Revisar Frontend**
   - 🔍 Buscar referencias a `profiles` table
   - 🔍 Validar que roles están actualizados
   - 🔍 Verificar queries de base de datos

4. **Revisar Edge Functions**
   - 🔍 Actualizar schemas en funciones
   - 🔍 Verificar que respetan multi-tenancy

### **Fase 3: Testing y Validación (MEDIO)**

5. **Testing de Integración**
   - ✅ Probar todas las queries con nuevo schema
   - ✅ Validar RLS funciona correctamente
   - ✅ Verificar roles y permisos

---

## 📊 **ARCHIVOS QUE REQUIEREN ACTUALIZACIÓN**

### **Documentación**
```
docs/projects/VibeThink-Orchestrator/TECHNICAL_ARCHITECTURE.md
docusaurus-docs/docs/user-guides/project-overview.md
docusaurus-docs/docs/user-guides/dashboard-manual.md
docusaurus-docs/docs/troubleshooting/common-issues.md
```

### **Posible Código (a verificar)**
```
src/types/database.ts
src/lib/supabase/
apps/*/src/types/
```

---

## 🚨 **ACCIONES INMEDIATAS REQUERIDAS**

### **1. ACTUALIZAR TECHNICAL_ARCHITECTURE.md (URGENTE)**
Reemplazar section de database schema con nuevo diseño multi-tenant.

### **2. CREAR MIGRATION GUIDE (ALTO)**
Documentar cómo migrar código existente de `profiles` a `user_profiles`.

### **3. VALIDAR CÓDIGO EXISTENTE (ALTO)**
Revisar todo el código que pueda estar usando el schema anterior.

### **4. ACTUALIZAR DOCUMENTACIÓN DE ROLES (MEDIO)**
Asegurar que toda la documentación use la nueva jerarquía de roles.

---

## ✅ **CHECKLIST DE VALIDACIÓN**

- [ ] ✅ `TECHNICAL_ARCHITECTURE.md` actualizado con nuevo schema
- [ ] ✅ `project-overview.md` con roles correctos
- [ ] ✅ Frontend usa `user_profiles` en lugar de `profiles`
- [ ] ✅ Edge Functions respetan multi-tenancy
- [ ] ✅ RLS policies documentadas
- [ ] ✅ Migration guide creado
- [ ] ✅ Testing de integración completado

---

## 📞 **PRÓXIMOS PASOS**

1. **Revisar y aprobar** este reporte de inconsistencias
2. **Priorizar** las correcciones según impacto
3. **Asignar responsables** para cada fase
4. **Establecer timeline** para correcciones
5. **Implementar** las correcciones según plan

---

**Fecha**: 2025-07-25  
**Estado**: PENDIENTE DE REVISIÓN  
**Prioridad**: CRÍTICA
