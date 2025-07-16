# 🔍 Guía de Revisión - Base de Datos Supabase

## 📊 Dashboard Principal
**URL:** https://supabase.com/dashboard/project/pikywaoqlekupfynnclg

---

## 🗂️ Tablas Principales a Revisar

### 1. **👥 user_profiles** - Perfiles de Usuario
```sql
-- Verificar usuarios creados
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  company_id, 
  created_at,
  is_active
FROM user_profiles 
ORDER BY created_at DESC 
LIMIT 10;
```

**✅ Qué verificar:**
- [ ] Usuarios de prueba existen
- [ ] Roles asignados correctamente (SUPER_ADMIN, ADMIN, etc.)
- [ ] company_id está poblado
- [ ] is_active = true

### 2. **🏢 companies** - Empresas Multi-tenant
```sql
-- Verificar empresas creadas
SELECT 
  id,
  name,
  slug,
  status,
  subscription_plan,
  max_users,
  created_at
FROM companies 
ORDER BY created_at DESC;
```

**✅ Qué verificar:**
- [ ] Empresa AI Pair existe (slug: 'VibeThink-platform')
- [ ] Límites configurados correctamente
- [ ] Status = 'ACTIVE'

### 3. **🤖 ai_usage_logs** - Tracking de IA
```sql
-- Verificar logs de uso de IA
SELECT 
  id,
  user_id,
  company_id,
  model_used,
  tokens_used,
  cost_usd,
  created_at
FROM ai_usage_logs 
ORDER BY created_at DESC 
LIMIT 5;
```

### 4. **📅 meetings** - Procesador de Reuniones
```sql
-- Verificar reuniones procesadas
SELECT 
  id,
  title,
  company_id,
  status,
  created_at
FROM meetings 
ORDER BY created_at DESC 
LIMIT 5;
```

### 5. **⚙️ platform_configurations** - Configuraciones
```sql
-- Verificar configuraciones de plataforma
SELECT 
  id,
  category,
  config_key,
  config_value,
  is_active
FROM platform_configurations 
WHERE is_active = true;
```

---

## 🛡️ Row Level Security (RLS) - Verificación

### Verificar Políticas Activas:
```sql
-- Ver todas las políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public';
```

**✅ Políticas Esperadas:**
- [ ] user_profiles: Solo acceso a su company_id
- [ ] companies: Solo SUPER_ADMIN puede ver todas
- [ ] meetings: Aislamiento por company_id
- [ ] ai_usage_logs: Aislamiento por company_id

---

## 📈 Monitoreo y Performance

### 1. **Conexiones Activas:**
```sql
SELECT 
  count(*) as active_connections,
  state
FROM pg_stat_activity 
WHERE state IS NOT NULL 
GROUP BY state;
```

### 2. **Tamaño de Tablas:**
```sql
SELECT 
  table_name,
  pg_size_pretty(pg_total_relation_size(table_name::regclass)) as size
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY pg_total_relation_size(table_name::regclass) DESC;
```

### 3. **Queries Más Lentas:**
```sql
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
```

---

## 🔒 Seguridad - Checklist

### Auth Configuration:
- [ ] Email confirmación habilitada
- [ ] Password mínimo 6 caracteres
- [ ] OAuth providers configurados
- [ ] JWT secret rotado

### Database Security:
- [ ] RLS habilitado en todas las tablas
- [ ] Políticas de acceso configuradas
- [ ] Backup automático habilitado
- [ ] SSL/TLS forzado

---

## 📊 Usuarios de Prueba Esperados

| Email | Role | Company | Status |
|-------|------|---------|--------|
| admin@VibeThink.co | SUPER_ADMIN | VibeThink-platform | Active |
| admin@company.com | ADMIN | test-company | Active |
| manager@company.com | MANAGER | test-company | Active |
| user@company.com | EMPLOYEE | test-company | Active |

---

## 🚨 Alertas a Configurar

### En Supabase Dashboard:
1. **Database Usage > 80%**
2. **API Requests > límite del plan**
3. **Errores de autenticación > 10/min**
4. **Queries lentas > 1 segundo**

### Webhooks para Slack/Discord:
```javascript
// Ejemplo de webhook
const webhook = {
  url: "tu-webhook-url",
  events: ["db.usage", "auth.errors", "api.limit"]
};
```

---

## 🔧 Comandos SQL Útiles

### Limpiar datos de prueba:
```sql
-- CUIDADO: Solo en desarrollo
DELETE FROM ai_usage_logs WHERE created_at < NOW() - INTERVAL '7 days';
DELETE FROM meetings WHERE status = 'ERROR';
```

### Crear usuario de prueba:
```sql
-- Insertar en user_profiles después de crear en Auth
INSERT INTO user_profiles (
  id, email, full_name, role, company_id
) VALUES (
  'uuid-del-auth',
  'test@example.com',
  'Test User',
  'EMPLOYEE',
  'company-uuid'
);
```

### Verificar integridad referencial:
```sql
-- Usuarios sin empresa
SELECT * FROM user_profiles 
WHERE company_id NOT IN (SELECT id FROM companies);

-- Logs sin usuario
SELECT * FROM ai_usage_logs 
WHERE user_id NOT IN (SELECT id FROM user_profiles);
```

---

## 📋 Plan de Revisión Diaria

### 🌅 Mañana (5 min):
1. Ver dashboard de métricas
2. Revisar errores de la noche
3. Verificar backups

### 🌆 Tarde (10 min):
1. Revisar usage de API
2. Verificar performance de queries
3. Revisar nuevos usuarios registrados

### 🌙 Noche (2 min):
1. Verificar alertas
2. Revisar logs de errores

---

## 🎯 Próximos Pasos

1. **Configura alertas** en el dashboard
2. **Revisa políticas RLS** están funcionando
3. **Optimiza queries** si es necesario
4. **Configura webhooks** para notificaciones
5. **Programa backups** adicionales si es crítico 