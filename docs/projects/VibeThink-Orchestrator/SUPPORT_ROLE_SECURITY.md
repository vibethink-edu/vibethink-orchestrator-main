# SUPPORT Role Security Documentation

## 🔐 **CRITICAL SECURITY IMPLEMENTATION**

Esta documentación detalla la implementación segura del rol `SUPPORT` en AI Pair Orchestrator Pro, incluyendo las medidas de seguridad implementadas para prevenir violaciones de aislamiento multi-tenant.

## 📋 **RESUMEN DE LA IMPLEMENTACIÓN**

### ✅ **Medidas de Seguridad Implementadas**

1. **Políticas RLS Específicas para SUPPORT**
   - Control de acceso cross-company validado
   - Aislamiento multi-tenant mantenido
   - Audit logging obligatorio

2. **Validación de Permisos en Aplicación**
   - Verificación de rol SUPPORT antes de acceso a datos
   - Validación de pertenencia a VibeThink-platform
   - Control de permisos granular

3. **Funciones de Base de Datos Seguras**
   - `validate_support_user()`: Validación de credenciales SUPPORT
   - `log_support_action()`: Logging obligatorio de acciones
   - `support_temporary_limit_increase()`: Ajustes temporales controlados

## 🚨 **PROBLEMAS CRÍTICOS RESUELTOS**

### **Problema Original**: Acceso Irrestricto a Datos
```typescript
// ❌ ANTES: Violación de seguridad multi-tenant
const { data: companiesData } = await supabase
  .from('companies')
  .select('*')  // Sin filtrado company_id
```

### **Solución Implementada**: Acceso Controlado con RLS
```sql
-- ✅ DESPUÉS: RLS Policy para SUPPORT
CREATE POLICY "Support can view all companies for assistance" ON companies
  FOR SELECT USING (
    -- Regular users see their own company
    id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
    OR
    -- SUPPORT users from VibeThink-platform can see all companies
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN companies c ON up.company_id = c.id
      WHERE up.id = auth.uid() 
      AND up.role = 'SUPPORT'
      AND c.slug = 'VibeThink-platform'
    )
  );
```

## 🔧 **ARQUITECTURA DE SEGURIDAD**

### **1. Validación de Usuario SUPPORT**

```typescript
// ✅ Patrón de validación implementado
const validateSupportAccess = async () => {
  // Verificar permisos en aplicación
  if (!hasPermission('access_companies_for_support')) {
    throw new Error('Unauthorized: Missing support permissions')
  }

  // Verificar rol y empresa
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('role, company_id')
    .eq('id', user?.id)
    .single()

  if (!userProfile || userProfile.role !== 'SUPPORT') {
    throw new Error('Unauthorized: Invalid support credentials')
  }
}
```

### **2. Audit Logging Obligatorio**

Todas las acciones de SUPPORT se registran automáticamente:

```sql
-- Tabla de audit para acciones SUPPORT
CREATE TABLE support_actions_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  support_user_id UUID NOT NULL,
  target_company_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  action_data JSONB DEFAULT '{}',
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **3. Límites Controlados para Ajustes Temporales**

```sql
-- Función segura para ajustes temporales (máximo 500)
CREATE FUNCTION support_temporary_limit_increase(
  p_company_id UUID,
  p_increase_amount INTEGER,  -- MAX 500
  p_reason TEXT
) RETURNS JSONB
```

## 📊 **TABLAS Y POLÍTICAS RLS AFECTADAS**

### **Tablas con Acceso SUPPORT Cross-Company**

| Tabla | Acceso SUPPORT | Tipo | Validación |
|-------|----------------|------|------------|
| `companies` | ✅ Solo lectura | SELECT | RLS Policy |
| `user_profiles` | ✅ Solo lectura | SELECT | RLS Policy |
| `usage_tracking` | ✅ Solo lectura | SELECT | RLS Policy |
| `ai_usage_logs` | ✅ Solo lectura | SELECT | RLS Policy |
| `support_actions_log` | ✅ R/W propio | ALL | RLS Policy |

### **Tablas SIN Acceso SUPPORT**

| Tabla | Acceso | Razón |
|-------|--------|-------|
| `plan_definitions` | ❌ | Solo SUPER_ADMIN |
| `platform_configurations` | ❌ | Solo SUPER_ADMIN |
| `monthly_billing` | ❌ | Solo empresa propia |

## 🧪 **PROCEDIMIENTOS DE TESTING**

### **1. Test de Aislamiento Multi-Tenant**

```bash
# Verificar que usuarios regulares NO pueden acceder a datos cross-company
npm run test:security -- --grep "multi-tenant"
```

### **2. Test de Permisos SUPPORT**

```bash
# Verificar permisos específicos del rol SUPPORT
npm run test:role-permissions -- --role=SUPPORT
```

### **3. Test de Audit Logging**

```bash
# Verificar que todas las acciones se registran
npm run test:audit-logging
```

### **4. Test de Límites Temporales**

```sql
-- Test en base de datos
SELECT support_temporary_limit_increase(
  'test-company-id',
  600,  -- Debería fallar (over 500)
  'Test limit'
);
```

## 🔍 **VALIDACIONES DE SEGURIDAD REQUERIDAS**

### **Pre-Deployment Checklist**

- [ ] **RLS Policies**: Verificar que todas las políticas RLS están activas
- [ ] **Audit Logging**: Confirmar que se registran todas las acciones SUPPORT
- [ ] **Permission Validation**: Validar permisos en componente SupportPanel
- [ ] **Cross-Company Access**: Confirmar acceso controlado entre empresas
- [ ] **Temporary Limits**: Verificar límite máximo de 500 en aumentos
- [ ] **Error Handling**: Confirmar manejo seguro de errores

### **Post-Deployment Monitoring**

1. **Monitor Support Actions**: Revisar logs de `support_actions_log`
2. **RLS Policy Performance**: Monitorear performance de queries cross-company
3. **Unauthorized Access Attempts**: Alertas por intentos de acceso no autorizado
4. **Temporary Limit Usage**: Tracking de ajustes temporales por SUPPORT

## 🚨 **ALERTAS DE SEGURIDAD**

### **Configurar Alertas para:**

1. **Acceso SUPPORT fuera de horario laboral**
2. **Aumentos de límites > 200 requests**
3. **Múltiples acciones SUPPORT en mismo company_id**
4. **Fallos de validación de permisos SUPPORT**

## 📈 **MÉTRICAS DE SEGURIDAD**

### **KPIs a Monitorear:**

- **Support Actions per Day**: < 50 acciones/día
- **Temporary Limit Increases**: < 10 por semana
- **Cross-Company Data Access**: Log completo
- **Permission Validation Failures**: 0 tolerancia

## 🔒 **RESTRICCIONES DEL ROL SUPPORT**

### **NO PUEDE:**
- ❌ Crear o modificar planes de subscripción
- ❌ Cambiar configuraciones de plataforma
- ❌ Acceder a facturación de plataforma
- ❌ Realizar cambios permanentes en límites
- ❌ Modificar datos de empresas (solo lectura)

### **SÍ PUEDE:**
- ✅ Ver datos de todas las empresas (solo lectura)
- ✅ Aumentar límites temporalmente (máx. 500)
- ✅ Ver analytics y logs de uso
- ✅ Gestionar tickets de soporte
- ✅ Asistir a usuarios con problemas técnicos

## 📞 **PROCEDIMIENTOS DE ESCALACIÓN**

### **Si se detecta violación de seguridad:**

1. **Inmediato**: Revocar acceso del usuario SUPPORT
2. **5 minutos**: Notificar a SUPER_ADMIN
3. **15 minutos**: Revisar logs de audit completos
4. **30 minutos**: Reporte de incidente de seguridad
5. **24 horas**: Review de políticas RLS

## 🔄 **MANTENIMIENTO DE SEGURIDAD**

### **Revisiones Regulares:**

- **Semanal**: Review de logs de support_actions_log
- **Mensual**: Audit de políticas RLS
- **Trimestral**: Penetration testing del rol SUPPORT
- **Anual**: Review completo de arquitectura de seguridad

---

## ⚠️ **RECORDATORIO CRÍTICO**

**El rol SUPPORT tiene acceso cross-company controlado. Cualquier modificación a las políticas RLS o funciones de SUPPORT debe ser revisada por el equipo de seguridad antes del deployment.**

**En caso de duda sobre la seguridad, DENEGAR el acceso.** 