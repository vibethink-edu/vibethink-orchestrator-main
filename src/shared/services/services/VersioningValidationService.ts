/**
 * Servicio de Validación de Versionado Inmutable
 * 
 * Garantiza que las entidades críticas mantengan su tipo de versionado
 * durante toda su ejecución, bloqueando cualquier intento de cambio.
 * 
 * @author AI Pair System
 * @version 1.0.0
 */

import { supabase } from '@/integrations/supabase/client';

// Tipos de versionado permitidos
export type VersioningType = 'IMMUTABLE' | 'MUTABLE' | 'HYBRID';

// Entidades que DEBEN ser inmutables
export const IMMUTABLE_ENTITIES = [
  'flow',
  'business_parameter', 
  'compliance_rule',
  'security_config',
  'financial_process',
  'legal_rule',
  'workflow_definition',
  'audit_config'
] as const;

// Entidades que PUEDEN ser mutables
export const MUTABLE_ENTITIES = [
  'template',
  'ui_configuration',
  'presentation_style',
  'text_content',
  'user_preference',
  'visual_setting',
  'color_scheme',
  'font_config'
] as const;

export type ImmutableEntityType = typeof IMMUTABLE_ENTITIES[number];
export type MutableEntityType = typeof MUTABLE_ENTITIES[number];
export type EntityType = ImmutableEntityType | MutableEntityType;

// Interfaz para transacciones críticas
export interface CriticalTransaction {
  operation: string;
  entityType: EntityType;
  entityId: string;
  versionId: string;
  action: 'create' | 'update' | 'delete' | 'execute';
  data?: any;
  userId?: string;
  timestamp: Date;
}

// Interfaz para logs de auditoría
export interface AuditLog {
  id: string;
  transaction: CriticalTransaction;
  checksum: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  error?: string;
  timestamp: Date;
}

/**
 * Servicio principal de validación de versionado
 */
export class VersioningValidationService {
  private static instance: VersioningValidationService;
  
  private constructor() {}
  
  public static getInstance(): VersioningValidationService {
    if (!VersioningValidationService.instance) {
      VersioningValidationService.instance = new VersioningValidationService();
    }
    return VersioningValidationService.instance;
  }

  /**
   * Valida el tipo de versionado para una entidad
   * @param entityType Tipo de entidad
   * @param versioningType Tipo de versionado propuesto
   * @returns true si es válido, false si no
   */
  public async validateVersioningType(
    entityType: EntityType, 
    versioningType: VersioningType
  ): Promise<boolean> {
    try {
      // Entidades inmutables NO pueden cambiar a mutable
      if (this.isImmutableEntity(entityType) && versioningType !== 'IMMUTABLE') {
        await this.logValidationFailure(entityType, versioningType, 'IMMUTABLE_ENTITY_CANNOT_BE_MUTABLE');
        return false;
      }

      // Entidades mutables pueden ser cualquier tipo
      if (this.isMutableEntity(entityType)) {
        return true;
      }

      // Por defecto, entidades inmutables deben ser IMMUTABLE
      return versioningType === 'IMMUTABLE';
    } catch (error) {
      await this.logValidationError(entityType, versioningType, error);
      return false;
    }
  }

  /**
   * Bloquea cualquier intento de cambiar el tipo de versionado
   * @param entityType Tipo de entidad
   * @param oldType Tipo anterior
   * @param newType Tipo nuevo
   * @returns true si el cambio es permitido, false si se bloquea
   */
  public async blockTypeChange(
    entityType: EntityType,
    oldType: VersioningType,
    newType: VersioningType
  ): Promise<boolean> {
    try {
      // Si es una entidad inmutable, NO permitir cambios
      if (this.isImmutableEntity(entityType)) {
        await this.logBlockedChange(entityType, oldType, newType, 'IMMUTABLE_ENTITY_TYPE_CHANGE_BLOCKED');
        return false;
      }

      // Para entidades mutables, permitir cambios
      return true;
    } catch (error) {
      await this.logValidationError(entityType, newType, error);
      return false;
    }
  }

  /**
   * Registra una transacción crítica para auditoría
   * @param transaction Transacción a registrar
   */
  public async logCriticalTransaction(transaction: CriticalTransaction): Promise<void> {
    try {
      const auditLog: AuditLog = {
        id: this.generateId(),
        transaction,
        checksum: this.generateChecksum(transaction),
        status: 'SUCCESS',
        timestamp: new Date()
      };

      // Guardar en base de datos
      const { error } = await supabase
        .from('audit_logs')
        .insert(auditLog);

      if (error) {
        // TODO: log Error logging critical transaction
        await this.triggerEmergencyShutdown('AUDIT_LOG_FAILURE');
      }
    } catch (error) {
      // TODO: log Critical error in audit logging
      await this.triggerEmergencyShutdown('AUDIT_SYSTEM_FAILURE');
    }
  }

  /**
   * Verifica la integridad de una entidad inmutable
   * @param entityType Tipo de entidad
   * @param entityId ID de la entidad
   * @param versionId ID de la versión
   * @returns true si la integridad es válida
   */
  public async verifyIntegrity(
    entityType: EntityType,
    entityId: string,
    versionId: string
  ): Promise<boolean> {
    try {
      // Obtener la entidad de la base de datos
      const { data, error } = await supabase
        .from(entityType)
        .select('*')
        .eq('id', entityId)
        .eq('version_id', versionId)
        .single();

      if (error || !data) {
        await this.logIntegrityFailure(entityType, entityId, versionId, 'ENTITY_NOT_FOUND');
        return false;
      }

      // Verificar que el tipo de versionado sea correcto
      if (this.isImmutableEntity(entityType) && data.versioning_type !== 'IMMUTABLE') {
        await this.logIntegrityFailure(entityType, entityId, versionId, 'INVALID_VERSIONING_TYPE');
        return false;
      }

      // Verificar checksum si existe
      if (data.checksum) {
        const calculatedChecksum = this.generateChecksum(data);
        if (data.checksum !== calculatedChecksum) {
          await this.logIntegrityFailure(entityType, entityId, versionId, 'CHECKSUM_MISMATCH');
          return false;
        }
      }

      return true;
    } catch (error) {
      await this.logIntegrityFailure(entityType, entityId, versionId, error);
      return false;
    }
  }

  /**
   * Verifica si una entidad es inmutable
   */
  private isImmutableEntity(entityType: EntityType): entityType is ImmutableEntityType {
    return IMMUTABLE_ENTITIES.includes(entityType as ImmutableEntityType);
  }

  /**
   * Verifica si una entidad es mutable
   */
  private isMutableEntity(entityType: EntityType): entityType is MutableEntityType {
    return MUTABLE_ENTITIES.includes(entityType as MutableEntityType);
  }

  /**
   * Genera un ID único para logs
   */
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Genera un checksum para verificar integridad
   */
  private generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * Registra un fallo de validación
   */
  private async logValidationFailure(
    entityType: EntityType,
    versioningType: VersioningType,
    reason: string
  ): Promise<void> {
    // TODO: log Validation failure
    
    // Enviar alerta a administradores
    await this.sendAlert('VALIDATION_FAILURE', {
      entityType,
      versioningType,
      reason,
      timestamp: new Date()
    });
  }

  /**
   * Registra un cambio bloqueado
   */
  private async logBlockedChange(
    entityType: EntityType,
    oldType: VersioningType,
    newType: VersioningType,
    reason: string
  ): Promise<void> {
    // TODO: log Blocked change
    
    // Enviar alerta crítica
    await this.sendAlert('BLOCKED_CHANGE', {
      entityType,
      oldType,
      newType,
      reason,
      timestamp: new Date()
    });
  }

  /**
   * Registra un error de validación
   */
  private async logValidationError(
    entityType: EntityType,
    versioningType: VersioningType,
    error: any
  ): Promise<void> {
    // TODO: log Validation error
    await this.sendAlert('VALIDATION_ERROR', {
      entityType,
      versioningType,
      error: error.message,
      timestamp: new Date()
    });
  }

  /**
   * Registra un fallo de integridad
   */
  private async logIntegrityFailure(
    entityType: EntityType,
    entityId: string,
    versionId: string,
    error: any
  ): Promise<void> {
    // TODO: log Integrity failure
    
    await this.sendAlert('INTEGRITY_FAILURE', {
      entityType,
      entityId,
      versionId,
      error: error.message || error,
      timestamp: new Date()
    });
  }

  /**
   * Envía una alerta a administradores
   */
  private async sendAlert(type: string, data: any): Promise<void> {
    try {
      // Aquí se integraría con el sistema de notificaciones
      // TODO: log ALERT [type]
      // En producción, esto enviaría email/Slack/SMS
      // await NotificationService.sendAlert(type, data);
    } catch (error) {
      // TODO: log Error sending alert
    }
  }

  /**
   * Activa shutdown de emergencia
   */
  private async triggerEmergencyShutdown(reason: string): Promise<void> {
    // TODO: log Emergency shutdown
    
    // Enviar alerta crítica
    await this.sendAlert('EMERGENCY_SHUTDOWN', {
      reason,
      timestamp: new Date()
    });

    // En producción, esto detendría el sistema
    // process.exit(1);
  }
}

// Exportar instancia singleton
export const versioningValidationService = VersioningValidationService.getInstance(); 