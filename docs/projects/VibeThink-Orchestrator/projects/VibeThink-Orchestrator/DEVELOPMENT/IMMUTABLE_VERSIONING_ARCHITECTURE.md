# Arquitectura de Versionado Inmutable - Documentación Completa

## Visión General

Sistema de versionado especializado que garantiza inmutabilidad para entidades críticas (flujos, parámetros de negocio, compliance) y mutabilidad controlada para entidades de presentación, con validaciones estrictas y auditoría completa.

## 🚨 REGLAS INMUTABLES DEL SISTEMA

### **1. TIPOS DE VERSIONADO FIJOS E INMUTABLES**

```typescript
// NUNCA CAMBIAR - REGLA FUNDAMENTAL
// Una vez definido el tipo de versionado, NUNCA puede cambiar
// NO EXISTEN EXCEPCIONES a esta regla
// Cualquier intento de cambio debe ser BLOQUEADO por el sistema
```

#### **Entidades INMUTABLES (NUNCA CAMBIAR):**
- `flow` - Flujos de trabajo
- `business_parameter` - Parámetros de negocio
- `compliance_rule` - Reglas de compliance
- `security_config` - Configuraciones de seguridad
- `financial_process` - Procesos financieros
- `legal_rule` - Reglas legales (PQRS, etc.)
- `workflow_definition` - Definiciones de workflow
- `audit_config` - Configuraciones de auditoría

#### **Entidades MUTABLES (PUEDEN CAMBIAR):**
- `template` - Templates de UI
- `ui_configuration` - Configuraciones de interfaz
- `presentation_style` - Estilos de presentación
- `text_content` - Contenido de texto
- `user_preference` - Preferencias de usuario
- `visual_setting` - Configuraciones visuales
- `color_scheme` - Esquemas de colores
- `font_config` - Configuraciones de fuentes

#### **Entidades HÍBRIDAS (CAMPOS ESPECÍFICOS):**
- `company_configuration` - Configuraciones de empresa
- `system_parameter` - Parámetros de sistema
- `user_settings` - Configuraciones de usuario

### **2. VALIDACIONES OBLIGATORIAS**

```typescript
// VALIDACIONES QUE SIEMPRE DEBEN EJECUTARSE
// NO SE PUEDEN OMITIR BAJO NINGUNA CIRCUNSTANCIA
```

#### **Validación al Crear Entidad:**
- Verificar que el tipo esté definido
- Asignar tipo de versionado automáticamente
- Bloquear creación si tipo no está definido

#### **Validación al Modificar:**
- Verificar que el tipo no haya cambiado
- Bloquear cualquier intento de cambio de tipo
- Log crítico de intentos de cambio

#### **Validación al Ejecutar:**
- Verificar que la versión sea inmutable si corresponde
- Garantizar trazabilidad completa
- Log de todas las transacciones

### **3. AUDITORÍA OBLIGATORIA**

```typescript
// AUDITORÍA QUE SIEMPRE DEBE EJECUTARSE
// NO SE PUEDE DESHABILITAR
```

#### **Log de Transacciones Críticas:**
- Todas las operaciones de versionado
- Todas las ejecuciones de flujos
- Todos los cambios de configuración
- Todas las operaciones financieras

#### **Trazabilidad Completa:**
- Quién hizo qué
- Cuándo se hizo
- Qué versión se usó
- Qué resultado se obtuvo

#### **Verificación de Integridad:**
- Checksums de todos los datos
- Verificación post-operación
- Alertas automáticas si falla

## 🏗️ ARQUITECTURA DE BASE DE DATOS

### **Esquema Principal**

```sql
-- Tabla maestra de versiones con tipo de inmutabilidad
CREATE TABLE universal_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    version_type VARCHAR(20) NOT NULL CHECK (version_type IN ('immutable', 'mutable', 'hybrid')),
    content JSONB NOT NULL,
    changes TEXT[] NOT NULL DEFAULT '{}',
    author_id UUID NOT NULL REFERENCES users(id),
    author_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    metadata JSONB DEFAULT '{}',
    is_current BOOLEAN DEFAULT false,
    company_id UUID NOT NULL REFERENCES companies(id),
    
    -- CONSTRAINTS CRÍTICOS
    UNIQUE(entity_type, entity_id, version_number),
    CONSTRAINT valid_version_type CHECK (
        (entity_type IN ('flow', 'business_parameter', 'compliance_rule', 'security_config', 'financial_process', 'legal_rule', 'workflow_definition', 'audit_config') AND version_type = 'immutable') OR
        (entity_type IN ('template', 'ui_configuration', 'presentation_style', 'text_content', 'user_preference', 'visual_setting', 'color_scheme', 'font_config') AND version_type = 'mutable') OR
        (entity_type IN ('company_configuration', 'system_parameter', 'user_settings') AND version_type = 'hybrid')
    )
);

-- Tabla de ejecuciones con versionado inmutable
CREATE TABLE executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    version_id UUID NOT NULL REFERENCES universal_versions(id),
    original_version_id UUID NOT NULL REFERENCES universal_versions(id),
    status VARCHAR(50) DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    result JSONB,
    error_message TEXT,
    company_id UUID NOT NULL REFERENCES companies(id),
    
    -- CONSTRAINTS CRÍTICOS
    CONSTRAINT executions_immutable_version CHECK (version_id = original_version_id),
    CONSTRAINT valid_execution_entity CHECK (
        entity_type IN ('flow', 'business_parameter', 'compliance_rule', 'security_config', 'financial_process', 'legal_rule', 'workflow_definition', 'audit_config')
    )
);

-- Tabla de auditoría crítica
CREATE TABLE critical_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP DEFAULT NOW(),
    level VARCHAR(20) NOT NULL CHECK (level IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    version_id UUID,
    user_id UUID REFERENCES users(id),
    user_company UUID REFERENCES companies(id),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    data JSONB,
    checksum VARCHAR(64) NOT NULL,
    integrity_verified BOOLEAN DEFAULT false
);

-- Tabla de alertas críticas
CREATE TABLE critical_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP DEFAULT NOW(),
    level VARCHAR(20) NOT NULL CHECK (level IN ('WARNING', 'ERROR', 'CRITICAL')),
    event_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP,
    escalated BOOLEAN DEFAULT false,
    escalated_at TIMESTAMP
);

-- Índices críticos para performance
CREATE INDEX idx_universal_versions_entity ON universal_versions(entity_type, entity_id);
CREATE INDEX idx_universal_versions_type ON universal_versions(version_type);
CREATE INDEX idx_universal_versions_status ON universal_versions(status);
CREATE INDEX idx_universal_versions_company ON universal_versions(company_id);
CREATE INDEX idx_executions_entity ON executions(entity_type, entity_id);
CREATE INDEX idx_executions_version ON executions(version_id);
CREATE INDEX idx_executions_status ON executions(status);
CREATE INDEX idx_critical_audit_timestamp ON critical_audit_log(timestamp);
CREATE INDEX idx_critical_audit_level ON critical_audit_log(level);
CREATE INDEX idx_critical_alerts_timestamp ON critical_alerts(timestamp);
CREATE INDEX idx_critical_alerts_level ON critical_alerts(level);
```

## 🔧 SERVICIOS CRÍTICOS

### **Servicio de Validación de Versionado**

```typescript
// services/versioningValidation.ts
export class VersioningValidationService {
  
  // Configuración inmutable de tipos (NUNCA CAMBIAR)
  private static readonly IMMUTABLE_TYPES = new Set([
    'flow',
    'business_parameter',
    'compliance_rule',
    'security_config',
    'financial_process',
    'legal_rule',
    'workflow_definition',
    'audit_config'
  ]);
  
  private static readonly MUTABLE_TYPES = new Set([
    'template',
    'ui_configuration',
    'presentation_style',
    'text_content',
    'user_preference',
    'visual_setting',
    'color_scheme',
    'font_config'
  ]);
  
  private static readonly HYBRID_TYPES = new Set([
    'company_configuration',
    'system_parameter',
    'user_settings'
  ]);
  
  // Validar tipo de versionado (OBLIGATORIO)
  static validateVersioningType(entityType: string): VersioningType {
    if (this.IMMUTABLE_TYPES.has(entityType)) {
      return 'immutable';
    } else if (this.MUTABLE_TYPES.has(entityType)) {
      return 'mutable';
    } else if (this.HYBRID_TYPES.has(entityType)) {
      return 'hybrid';
    } else {
      // ERROR CRÍTICO: Tipo no definido
      const error = new Error(`Tipo de entidad no definido: ${entityType}`);
      CriticalLogService.logError('UNDEFINED_ENTITY_TYPE', {
        entityType,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  
  // Bloquear cambio de tipo (CRÍTICO)
  static async blockTypeChange(
    entityType: string,
    oldType: VersioningType,
    newType: VersioningType
  ): Promise<void> {
    
    if (oldType !== newType) {
      // Log crítico obligatorio
      await CriticalLogService.logCritical('VERSIONING_TYPE_CHANGE_ATTEMPT', {
        entityType,
        oldType,
        newType,
        userId: getCurrentUserId(),
        userIp: getCurrentUserIp(),
        userAgent: getCurrentUserAgent(),
        timestamp: new Date()
      });
      
      // Alertar administradores inmediatamente
      await AlertService.alertCritical('VERSIONING_TYPE_CHANGE_ATTEMPT', {
        entityType,
        oldType,
        newType,
        userId: getCurrentUserId()
      });
      
      // Bloquear operación
      const error = new Error(
        `CAMBIO DE TIPO BLOQUEADO: ${entityType} de ${oldType} a ${newType}. ` +
        `Esta operación no está permitida por seguridad del sistema. ` +
        `Contacte al administrador del sistema.`
      );
      
      throw error;
    }
  }
  
  // Verificar integridad de versión (OBLIGATORIO)
  static async verifyVersionIntegrity(
    entityType: string,
    entityId: string,
    versionId: string
  ): Promise<boolean> {
    
    try {
      const version = await this.getVersion(versionId);
      const expectedType = this.validateVersioningType(entityType);
      
      if (version.versionType !== expectedType) {
        await CriticalLogService.logCritical('VERSION_INTEGRITY_FAILED', {
          entityType,
          entityId,
          versionId,
          expectedType,
          actualType: version.versionType
        });
        
        return false;
      }
      
      return true;
    } catch (error) {
      await CriticalLogService.logError('VERSION_INTEGRITY_CHECK_ERROR', {
        entityType,
        entityId,
        versionId,
        error: error.message
      });
      
      return false;
    }
  }
}
```

### **Servicio de Auditoría Crítica**

```typescript
// services/criticalAuditService.ts
export class CriticalAuditService {
  
  // Log de transacciones críticas (OBLIGATORIO)
  static async logCriticalTransaction(
    transactionType: string,
    entityType: string,
    entityId: string,
    versionId: string,
    action: string,
    data: any
  ): Promise<void> {
    
    try {
      const auditEntry = {
        id: generateUUID(),
        timestamp: new Date(),
        level: 'CRITICAL',
        event_type: transactionType,
        entity_type: entityType,
        entity_id: entityId,
        version_id: versionId,
        user_id: getCurrentUserId(),
        user_company: getCurrentUserCompany(),
        session_id: getCurrentSessionId(),
        ip_address: getCurrentUserIp(),
        user_agent: getCurrentUserAgent(),
        data: data,
        checksum: this.generateChecksum(data),
        integrity_verified: false
      };
      
      // Guardar en tabla de auditoría
      await this.saveAuditEntry(auditEntry);
      
      // Verificar integridad inmediatamente
      const integrityVerified = await this.verifyIntegrity(auditEntry);
      
      if (!integrityVerified) {
        await this.alertIntegrityBreach(auditEntry);
        throw new Error('Integridad de datos comprometida');
      }
      
      // Marcar como verificado
      await this.markIntegrityVerified(auditEntry.id);
      
    } catch (error) {
      // Si falla la auditoría, el sistema debe detenerse
      await this.emergencyShutdown('AUDIT_FAILURE', {
        error: error.message,
        transactionType,
        entityType,
        entityId
      });
      
      throw error;
    }
  }
  
  // Verificación de integridad (OBLIGATORIO)
  private static async verifyIntegrity(auditEntry: AuditEntry): Promise<boolean> {
    try {
      const calculatedChecksum = this.generateChecksum(auditEntry.data);
      
      if (calculatedChecksum !== auditEntry.checksum) {
        await this.alertIntegrityBreach(auditEntry);
        return false;
      }
      
      return true;
    } catch (error) {
      await CriticalLogService.logError('INTEGRITY_CHECK_ERROR', {
        auditEntryId: auditEntry.id,
        error: error.message
      });
      
      return false;
    }
  }
  
  // Generar checksum (OBLIGATORIO)
  private static generateChecksum(data: any): string {
    const dataString = JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }
  
  // Alertar breach de integridad (CRÍTICO)
  private static async alertIntegrityBreach(auditEntry: AuditEntry): Promise<void> {
    await AlertService.alertCritical('INTEGRITY_BREACH', {
      auditEntryId: auditEntry.id,
      entityType: auditEntry.entity_type,
      entityId: auditEntry.entity_id,
      timestamp: auditEntry.timestamp
    });
  }
  
  // Shutdown de emergencia (CRÍTICO)
  private static async emergencyShutdown(reason: string, data: any): Promise<void> {
    await CriticalLogService.logCritical('EMERGENCY_SHUTDOWN', {
      reason,
      data,
      timestamp: new Date()
    });
    
    // Notificar a todos los administradores
    await AlertService.alertAllAdmins('EMERGENCY_SHUTDOWN', {
      reason,
      data,
      timestamp: new Date()
    });
    
    // El sistema debe detenerse
    process.exit(1);
  }
}
```

### **Servicio de Monitoreo Continuo**

```typescript
// services/continuousMonitoring.ts
export class ContinuousMonitoringService {
  
  // Monitoreo de integridad (OBLIGATORIO)
  static async monitorIntegrity(): Promise<void> {
    try {
      const integrityChecks = await this.runIntegrityChecks();
      
      for (const check of integrityChecks) {
        if (!check.passed) {
          await this.alertCriticalEvent('INTEGRITY_CHECK_FAILED', {
            checkId: check.id,
            entityType: check.entityType,
            entityId: check.entityId,
            error: check.error
          });
        }
      }
    } catch (error) {
      await CriticalLogService.logError('INTEGRITY_MONITORING_ERROR', {
        error: error.message
      });
      
      // Si falla el monitoreo, alertar críticamente
      await this.alertCriticalEvent('MONITORING_SYSTEM_FAILURE', {
        error: error.message
      });
    }
  }
  
  // Verificación de versionado (OBLIGATORIO)
  static async verifyVersioningConsistency(): Promise<void> {
    try {
      const inconsistencies = await this.findVersioningInconsistencies();
      
      for (const inconsistency of inconsistencies) {
        await this.alertCriticalEvent('VERSIONING_INCONSISTENCY', {
          entityType: inconsistency.entityType,
          entityId: inconsistency.entityId,
          expectedType: inconsistency.expectedType,
          actualType: inconsistency.actualType
        });
      }
    } catch (error) {
      await CriticalLogService.logError('VERSIONING_CONSISTENCY_CHECK_ERROR', {
        error: error.message
      });
    }
  }
  
  // Alertas críticas (OBLIGATORIO)
  static async alertCriticalEvent(
    eventType: string,
    data: any
  ): Promise<void> {
    
    const alert = {
      id: generateUUID(),
      timestamp: new Date(),
      level: 'CRITICAL',
      event_type: eventType,
      message: `Evento crítico: ${eventType}`,
      data: data,
      acknowledged: false,
      escalated: false
    };
    
    // Guardar alerta
    await this.saveAlert(alert);
    
    // Enviar alerta inmediata
    await this.sendImmediateAlert(alert);
    
    // Escalar si no hay respuesta en 5 minutos
    setTimeout(() => this.escalateAlert(alert), 300000);
  }
  
  // Escalación automática (OBLIGATORIO)
  private static async escalateAlert(alert: Alert): Promise<void> {
    if (!alert.acknowledged) {
      alert.escalated = true;
      alert.escalated_at = new Date();
      
      await this.saveAlert(alert);
      
      // Notificar a todos los administradores
      await AlertService.alertAllAdmins('ESCALATED_CRITICAL_ALERT', {
        alertId: alert.id,
        eventType: alert.event_type,
        data: alert.data
      });
    }
  }
}
```

## 🚨 CASOS CRÍTICOS Y MANEJO DE ERRORES

### **1. Cambio de Tipo de Versionado**

```typescript
// ESCENARIO: Alguien intenta cambiar un flujo de inmutable a mutable
// RESPUESTA: BLOQUEAR INMEDIATAMENTE

try {
  await VersioningValidationService.blockTypeChange('flow', 'immutable', 'mutable');
} catch (error) {
  // El sistema debe bloquear la operación
  // Log crítico obligatorio
  // Alertar administradores
  // NO permitir la operación bajo ninguna circunstancia
}
```

### **2. Fallo de Auditoría**

```typescript
// ESCENARIO: No se puede escribir en el log de auditoría
// RESPUESTA: SHUTDOWN DE EMERGENCIA

try {
  await CriticalAuditService.logCriticalTransaction(/* ... */);
} catch (error) {
  // Si falla la auditoría, el sistema debe detenerse
  await CriticalAuditService.emergencyShutdown('AUDIT_FAILURE', {
    error: error.message
  });
}
```

### **3. Breach de Integridad**

```typescript
// ESCENARIO: Checksum no coincide
// RESPUESTA: ALERTA CRÍTICA Y BLOQUEO

if (calculatedChecksum !== storedChecksum) {
  await AlertService.alertCritical('INTEGRITY_BREACH', {
    entityType,
    entityId,
    versionId
  });
  
  // Bloquear operación
  throw new Error('Integridad de datos comprometida');
}
```

### **4. Fallo de Monitoreo**

```typescript
// ESCENARIO: Sistema de monitoreo no responde
// RESPUESTA: ALERTA CRÍTICA Y ESCALACIÓN

try {
  await ContinuousMonitoringService.monitorIntegrity();
} catch (error) {
  await AlertService.alertCritical('MONITORING_SYSTEM_FAILURE', {
    error: error.message
  });
  
  // Escalar inmediatamente
  await ContinuousMonitoringService.escalateAlert(/* ... */);
}
```

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Validaciones Críticas**
- [ ] Implementar validaciones de tipo inmutables
- [ ] Bloquear cambios de tipo de versionado
- [ ] Log crítico de intentos de cambio
- [ ] Alertas automáticas a administradores

### **Fase 2: Auditoría Completa**
- [ ] Sistema de auditoría de transacciones
- [ ] Verificación de integridad con checksums
- [ ] Log de todas las operaciones críticas
- [ ] Backup automático de logs

### **Fase 3: Monitoreo Continuo**
- [ ] Monitoreo de integridad en tiempo real
- [ ] Verificación de consistencia de versionado
- [ ] Alertas proactivas para anomalías
- [ ] Escalación automática de alertas

### **Fase 4: Testing Exhaustivo**
- [ ] Testing de validaciones críticas
- [ ] Testing de auditoría bajo carga
- [ ] Testing de monitoreo continuo
- [ ] Testing de casos de fallo

## 🎯 REGLAS DE DESARROLLO

### **1. NUNCA OMITIR VALIDACIONES**
```typescript
// ❌ INCORRECTO
if (skipValidation) {
  // Saltar validación
}

// ✅ CORRECTO
// Las validaciones NUNCA se pueden omitir
await VersioningValidationService.validateVersioningType(entityType);
```

### **2. NUNCA IGNORAR ERRORES DE AUDITORÍA**
```typescript
// ❌ INCORRECTO
try {
  await CriticalAuditService.logCriticalTransaction(/* ... */);
} catch (error) {
  console.log('Audit failed, continuing...'); // NUNCA HACER ESTO
}

// ✅ CORRECTO
try {
  await CriticalAuditService.logCriticalTransaction(/* ... */);
} catch (error) {
  // El sistema debe detenerse si falla la auditoría
  await CriticalAuditService.emergencyShutdown('AUDIT_FAILURE', { error });
}
```

### **3. NUNCA PERMITIR CAMBIOS DE TIPO**
```typescript
// ❌ INCORRECTO
// Permitir cambio de tipo "por conveniencia"

// ✅ CORRECTO
// BLOQUEAR SIEMPRE cualquier intento de cambio de tipo
await VersioningValidationService.blockTypeChange(entityType, oldType, newType);
```

### **4. SIEMPRE VERIFICAR INTEGRIDAD**
```typescript
// ❌ INCORRECTO
// Asumir que los datos están bien

// ✅ CORRECTO
// Verificar SIEMPRE la integridad
const integrityVerified = await CriticalAuditService.verifyIntegrity(auditEntry);
if (!integrityVerified) {
  throw new Error('Integridad comprometida');
}
```

---

**NOTA CRÍTICA**: Esta documentación debe ser leída y entendida por TODOS los desarrolladores antes de trabajar en el sistema de versionado. Cualquier violación de estas reglas puede resultar en pérdida de datos, incumplimiento legal o fallos del sistema. 