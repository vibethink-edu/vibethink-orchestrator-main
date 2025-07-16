# Migration & Upgrade Guide - AI Pair Orchestrator Pro

## 📈 Guía de Migración y Actualización

Esta guía proporciona procedimientos paso a paso para actualizar AI Pair Orchestrator Pro, incluyendo migraciones de base de datos, actualizaciones de dependencias, y cambios de arquitectura.

**Audiencia**: DevOps, Tech Lead, Senior Developers  
**Última actualización**: Diciembre 2024

## 🎯 Tipos de Actualización

### 1. Actualizaciones de Seguridad (Críticas)
- **Frecuencia**: Inmediata
- **Downtime**: < 5 minutos
- **Rollback**: Automático

### 2. Actualizaciones de Dependencias
- **Frecuencia**: Mensual
- **Downtime**: < 15 minutos
- **Rollback**: Manual disponible

### 3. Migraciones de Base de Datos
- **Frecuencia**: Por release
- **Downtime**: Variable (5-30 minutos)
- **Rollback**: Procedimiento específico

### 4. Actualizaciones de Arquitectura
- **Frecuencia**: Trimestral
- **Downtime**: 1-2 horas planificado
- **Rollback**: Plan detallado requerido

## 🔄 Proceso General de Actualización

### Pre-Actualización Checklist

```bash
# 1. Backup completo
npm run backup:full

# 2. Verificar estado actual
npm run health:check

# 3. Ejecutar tests completos
npm run test:all

# 4. Verificar disk space
df -h

# 5. Notificar a stakeholders
echo "Maintenance window starting in 30 minutes"
```

### Procedimiento Estándar

#### 1. Preparación (30 minutos antes)
- [ ] Backup de base de datos
- [ ] Backup de configuraciones
- [ ] Notificación a usuarios
- [ ] Verificación de rollback plan
- [ ] Setup de monitoring específico

#### 2. Ejecución
- [ ] Activar modo mantenimiento
- [ ] Aplicar cambios según tipo
- [ ] Verificar health checks
- [ ] Smoke testing básico
- [ ] Desactivar modo mantenimiento

#### 3. Post-Actualización
- [ ] Monitoring intensivo (2 horas)
- [ ] Tests de regresión
- [ ] Performance benchmarking
- [ ] Notificación de completado
- [ ] Documentar issues encontrados

## 🗄️ Migraciones de Base de Datos

### Estructura de Migración

```sql
-- Ejemplo: 20241218120000_add_new_feature.sql
-- Migration: Add new feature table
-- Author: Developer Name
-- Date: 2024-12-18
-- Rollback: 20241218120000_rollback_new_feature.sql

BEGIN;

-- Crear nueva tabla
CREATE TABLE IF NOT EXISTS new_feature_table (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_new_feature_table_company_id ON new_feature_table(company_id);
CREATE INDEX idx_new_feature_table_name ON new_feature_table(name);

-- RLS policies
ALTER TABLE new_feature_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company isolation for new_feature_table" ON new_feature_table
    FOR ALL USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

-- Actualizar función de company limits si necesario
-- ...

COMMIT;
```

### Aplicar Migraciones

#### Desarrollo Local
```bash
# Aplicar migración localmente
npx supabase db reset

# Verificar migración
npx supabase db push --dry-run
npx supabase db push
```

#### Staging Environment
```bash
# Aplicar a staging
npx supabase db push --project-ref staging-project-id

# Verificar resultado
npx supabase db dump --project-ref staging-project-id --schema public
```

#### Producción
```bash
# Backup antes de migración
npx supabase db dump --project-ref pikywaoqlekupfynnclg --file backup-pre-migration-$(date +%Y%m%d).sql

# Aplicar migración
npx supabase db push --project-ref pikywaoqlekupfynnclg

# Verificar estado
npx supabase migration list --project-ref pikywaoqlekupfynnclg
```

### Rollback de Migraciones

#### Crear Script de Rollback
```sql
-- 20241218120000_rollback_new_feature.sql
-- Rollback for: Add new feature table

BEGIN;

-- Eliminar políticas RLS
DROP POLICY IF EXISTS "Company isolation for new_feature_table" ON new_feature_table;

-- Eliminar tabla
DROP TABLE IF EXISTS new_feature_table;

-- Revertir otros cambios...

COMMIT;
```

#### Ejecutar Rollback
```bash
# Aplicar rollback manualmente
psql $DATABASE_URL < 20241218120000_rollback_new_feature.sql

# O usar reset a punto específico
npx supabase db reset --project-ref pikywaoqlekupfynnclg --restore-point "2024-12-18 10:00:00"
```

## 📦 Actualizaciones de Dependencias

### Estrategia de Actualización

#### Major Updates (Anual)
```bash
# Crear branch de actualización
git checkout -b update/major-dependencies-2024

# Actualizar major versions
npm update --latest

# Verificar breaking changes
npm run test:all
npm run build
npm run type-check
```

#### Minor/Patch Updates (Mensual)
```bash
# Actualizar automáticamente
npm update

# Verificar compatibilidad
npm audit
npm run test:all
```

### Dependencias Críticas

#### React & Ecosystem
```bash
# Verificar versión actual
npm list react react-dom

# Actualizar React
npm install react@latest react-dom@latest @types/react@latest @types/react-dom@latest

# Verificar breaking changes
# - Revisar changelog oficial
# - Ejecutar tests completos
# - Verificar deprecated APIs
```

#### TypeScript
```bash
# Verificar versión
npx tsc --version

# Actualizar TypeScript
npm install typescript@latest

# Verificar compilación
npx tsc --noEmit

# Actualizar tipos relacionados
npm update @types/*
```

#### Supabase
```bash
# Verificar versión actual
npm list @supabase/supabase-js

# Actualizar Supabase
npm install @supabase/supabase-js@latest

# Regenerar tipos
npx supabase gen types typescript --project-ref pikywaoqlekupfynnclg > src/integrations/supabase/types.ts

# Verificar cambios en API
# - Revisar migration guide oficial
# - Verificar RLS policies
# - Testing de autenticación
```

### Post-Update Verification

#### Automated Checks
```bash
#!/bin/bash
# post-update-check.sh

echo "Running post-update verification..."

# TypeScript compilation
echo "Checking TypeScript..."
npx tsc --noEmit || exit 1

# Tests
echo "Running tests..."
npm run test:run || exit 1

# Build
echo "Testing build..."
npm run build || exit 1

# Lint
echo "Checking code style..."
npm run lint || exit 1

# Security audit
echo "Security audit..."
npm audit --audit-level moderate || exit 1

echo "✅ All checks passed!"
```

## 🏗️ Actualizaciones de Arquitectura

### Migración de Autenticación (Ejemplo)

#### Problema
Migrar de sistema de auth custom a Supabase Auth completo.

#### Plan de Migración

##### Fase 1: Preparación (1 semana)
```typescript
// 1. Crear mapeo de usuarios existentes
interface UserMigration {
  oldUserId: string;
  email: string;
  role: UserRole;
  companyId: string;
  migrationStatus: 'pending' | 'completed' | 'failed';
}

// 2. Script de migración
async function migrateUserToSupabaseAuth(user: UserMigration) {
  try {
    // Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: generateTemporaryPassword(),
      email_confirm: true,
      user_metadata: {
        migrated_from: user.oldUserId,
        company_id: user.companyId,
        role: user.role,
      },
    });

    if (error) throw error;

    // Actualizar mapping
    await updateMigrationStatus(user.oldUserId, 'completed', data.user.id);
    
    return { success: true, newUserId: data.user.id };
  } catch (error) {
    await updateMigrationStatus(user.oldUserId, 'failed');
    return { success: false, error };
  }
}
```

##### Fase 2: Implementación Paralela (2 semanas)
```typescript
// Dual auth system
class DualAuthProvider {
  async signIn(email: string, password: string) {
    // Intentar con Supabase Auth primero
    const supabaseResult = await this.supabaseSignIn(email, password);
    if (supabaseResult.success) {
      return supabaseResult;
    }

    // Fallback a sistema anterior
    const legacyResult = await this.legacySignIn(email, password);
    if (legacyResult.success) {
      // Migrar usuario automáticamente
      await this.autoMigrateUser(legacyResult.user);
    }

    return legacyResult;
  }
}
```

##### Fase 3: Cutover (Día específico)
```typescript
// Feature flag para cambiar completamente
const USE_SUPABASE_AUTH_ONLY = process.env.VITE_USE_SUPABASE_AUTH_ONLY === 'true';

function AuthProvider({ children }: { children: React.ReactNode }) {
  if (USE_SUPABASE_AUTH_ONLY) {
    return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
  }
  
  return <DualAuthProvider>{children}</DualAuthProvider>;
}
```

##### Fase 4: Cleanup (1 semana después)
```sql
-- Eliminar tablas del sistema anterior después de verificación
-- DROP TABLE legacy_users;
-- DROP TABLE legacy_sessions;
```

### Migración de Multi-tenancy (Ejemplo)

#### Problema
Mejorar aislamiento de datos entre empresas.

#### Plan de Migración

##### 1. Auditoría de Aislamiento Actual
```sql
-- Script para identificar tablas sin company_id
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name NOT IN (
    SELECT DISTINCT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'company_id'
  );
```

##### 2. Migración de Datos
```sql
-- Ejemplo: Agregar company_id a tabla existente
BEGIN;

-- Agregar columna
ALTER TABLE existing_table 
ADD COLUMN company_id UUID REFERENCES companies(id);

-- Poblar datos existentes (requiere lógica específica)
UPDATE existing_table 
SET company_id = (
  SELECT company_id 
  FROM users 
  WHERE users.id = existing_table.user_id
);

-- Hacer columna obligatoria
ALTER TABLE existing_table 
ALTER COLUMN company_id SET NOT NULL;

-- Crear índice
CREATE INDEX idx_existing_table_company_id ON existing_table(company_id);

-- Agregar RLS
ALTER TABLE existing_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company isolation" ON existing_table
  FOR ALL USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

COMMIT;
```

## 🔧 Herramientas de Migración

### Script Maestro de Migración

```bash
#!/bin/bash
# migrate.sh - Script maestro de migración

set -e

ENVIRONMENT=${1:-staging}
MIGRATION_TYPE=${2:-database}
BACKUP_REQUIRED=${3:-true}

echo "🚀 Starting migration for $ENVIRONMENT ($MIGRATION_TYPE)"

# Configurar variables según ambiente
case $ENVIRONMENT in
  "staging")
    PROJECT_REF="staging-project-id"
    DATABASE_URL="$STAGING_DATABASE_URL"
    ;;
  "production")
    PROJECT_REF="pikywaoqlekupfynnclg"
    DATABASE_URL="$PRODUCTION_DATABASE_URL"
    ;;
  *)
    echo "❌ Invalid environment: $ENVIRONMENT"
    exit 1
    ;;
esac

# Función de backup
backup_database() {
  echo "📦 Creating backup..."
  npx supabase db dump --project-ref $PROJECT_REF --file "backup-pre-migration-$(date +%Y%m%d-%H%M%S).sql"
  echo "✅ Backup created"
}

# Función de health check
health_check() {
  echo "🏥 Running health check..."
  curl -f "https://$PROJECT_REF.supabase.co/rest/v1/" > /dev/null
  echo "✅ Health check passed"
}

# Función de migración de base de datos
migrate_database() {
  echo "🗄️ Applying database migrations..."
  npx supabase db push --project-ref $PROJECT_REF
  echo "✅ Database migrations applied"
}

# Función de migración de aplicación
migrate_application() {
  echo "🚀 Deploying application..."
  # Aquí iría el comando de deploy específico
  # npm run deploy:$ENVIRONMENT
  echo "✅ Application deployed"
}

# Ejecutar migración según tipo
case $MIGRATION_TYPE in
  "database")
    [ "$BACKUP_REQUIRED" = "true" ] && backup_database
    health_check
    migrate_database
    health_check
    ;;
  "application")
    [ "$BACKUP_REQUIRED" = "true" ] && backup_database
    health_check
    migrate_application
    health_check
    ;;
  "full")
    [ "$BACKUP_REQUIRED" = "true" ] && backup_database
    health_check
    migrate_database
    migrate_application
    health_check
    ;;
  *)
    echo "❌ Invalid migration type: $MIGRATION_TYPE"
    exit 1
    ;;
esac

echo "🎉 Migration completed successfully!"
```

### Monitoreo Post-Migración

```typescript
// monitoring/post-migration-check.ts
interface MigrationCheck {
  name: string;
  check: () => Promise<boolean>;
  critical: boolean;
}

const postMigrationChecks: MigrationCheck[] = [
  {
    name: "Database connectivity",
    check: async () => {
      try {
        const { error } = await supabase.from('companies').select('count').single();
        return !error;
      } catch {
        return false;
      }
    },
    critical: true,
  },
  {
    name: "Authentication working",
    check: async () => {
      try {
        const { data } = await supabase.auth.getSession();
        return data.session !== null;
      } catch {
        return false;
      }
    },
    critical: true,
  },
  {
    name: "RLS policies active",
    check: async () => {
      try {
        // Intentar acceso sin company_id (debería fallar)
        const { error } = await supabase.from('documents').select('*');
        return error !== null; // Queremos que falle
      } catch {
        return true;
      }
    },
    critical: true,
  },
];

export async function runPostMigrationChecks() {
  const results = await Promise.all(
    postMigrationChecks.map(async (check) => {
      const passed = await check.check();
      return { ...check, passed };
    })
  );

  const criticalFailures = results.filter(r => !r.passed && r.critical);
  
  if (criticalFailures.length > 0) {
    throw new Error(`Critical migration checks failed: ${criticalFailures.map(f => f.name).join(', ')}`);
  }

  return results;
}
```

## 📋 Checklists por Tipo de Actualización

### Actualización de Seguridad (P0)

#### Pre-Deploy
- [ ] Identificar vulnerabilidad específica
- [ ] Verificar fix en dependencia/código
- [ ] Testing de regresión rápido
- [ ] Backup automático activado

#### Deploy
- [ ] Aplicar fix inmediatamente
- [ ] Verificar vulnerabilidad resuelta
- [ ] Monitoring de errores activo
- [ ] Comunicar resolución

#### Post-Deploy
- [ ] Confirmar sistema estable
- [ ] Documentar incident
- [ ] Post-mortem si necesario

### Actualización de Dependencias

#### Pre-Deploy
- [ ] Revisar changelogs de dependencias
- [ ] Identificar breaking changes
- [ ] Actualizar código para compatibilidad
- [ ] Tests completos ejecutados
- [ ] Performance testing realizado

#### Deploy
- [ ] Deploy a staging primero
- [ ] Smoke testing en staging
- [ ] Deploy a producción
- [ ] Monitoring activo

#### Post-Deploy
- [ ] Verificar performance baseline
- [ ] Confirmar funcionalidades críticas
- [ ] Monitoring por 24 horas
- [ ] Documentar cambios significativos

### Migración de Base de Datos

#### Pre-Deploy
- [ ] Script de migración revisado
- [ ] Script de rollback preparado
- [ ] Backup completo realizado
- [ ] Estimación de downtime confirmada
- [ ] Comunicación a usuarios enviada

#### Deploy
- [ ] Modo mantenimiento activado
- [ ] Migración aplicada
- [ ] Verificación de integridad
- [ ] Smoke testing
- [ ] Modo mantenimiento desactivado

#### Post-Deploy
- [ ] Performance de queries verificada
- [ ] Índices funcionando correctamente
- [ ] RLS policies activas
- [ ] Capacidad de rollback confirmada

## 🆘 Planes de Rollback

### Rollback de Aplicación

```bash
#!/bin/bash
# rollback-application.sh

PREVIOUS_VERSION=${1:-$(git describe --tags --abbrev=0 HEAD^)}

echo "🔄 Rolling back to version: $PREVIOUS_VERSION"

# Rollback del código
git checkout $PREVIOUS_VERSION

# Rebuild y redeploy
npm ci
npm run build
npm run deploy:production

echo "✅ Rollback completed to $PREVIOUS_VERSION"
```

### Rollback de Base de Datos

```sql
-- Template de rollback
-- IMPORTANTE: Ejecutar solo si la migración falló o causó problemas críticos

BEGIN;

-- 1. Verificar que el rollback es seguro
SELECT COUNT(*) FROM new_table; -- Si hay datos, considerar migración de datos

-- 2. Eliminar cambios de la migración
DROP TABLE IF EXISTS new_table CASCADE;
ALTER TABLE existing_table DROP COLUMN IF EXISTS new_column CASCADE;

-- 3. Restaurar estado anterior si necesario
-- ...

-- 4. Verificar integridad
SELECT COUNT(*) FROM companies;
SELECT COUNT(*) FROM users;

COMMIT;
```

## 📊 Métricas de Migración

### KPIs a Monitorear

#### Durante la Migración
- **Downtime real** vs estimado
- **Errores** durante migración
- **Performance** de queries críticas
- **Usuarios afectados**

#### Post-Migración (48 horas)
- **Response time** comparado con baseline
- **Error rate** vs período anterior
- **User satisfaction** (soporte tickets)
- **System stability** (crashes, timeouts)

### Dashboard de Migración

```typescript
// Métricas específicas para monitorear
interface MigrationMetrics {
  migrationId: string;
  startTime: Date;
  endTime?: Date;
  downtime: number; // minutos
  errorsCount: number;
  rollbackRequired: boolean;
  affectedUsers: number;
  performanceImpact: number; // percentage
}

// Ejemplo de tracking
export function trackMigration(migrationId: string) {
  const metrics: MigrationMetrics = {
    migrationId,
    startTime: new Date(),
    downtime: 0,
    errorsCount: 0,
    rollbackRequired: false,
    affectedUsers: 0,
    performanceImpact: 0,
  };

  // Tracking automático...
  return metrics;
}
```

---

## 📞 Escalación Durante Migraciones

### Contactos de Emergencia
- **Tech Lead**: Decisiones de rollback
- **DevOps**: Problemas de infraestructura
- **Database Expert**: Issues de migración DB
- **Security Lead**: Vulnerabilidades críticas

### Criterios de Rollback Automático
- **Response time** > 5x baseline por 5 minutos
- **Error rate** > 10% por 2 minutos
- **Cualquier fallo** en health checks críticos
- **Usuario reporta** corrupción de datos

**⚠️ Regla de Oro**: Ante la duda, hacer rollback. Es mejor ser conservador que arriesgar la estabilidad del sistema.

---

**Última actualización**: Diciembre 2024  
**Próxima revisión**: Marzo 2025  
**Responsable**: Tech Lead + DevOps Team 