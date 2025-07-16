import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

/**
 * Servicio de Compliance GDPR y Ley Colombiana
 * Gestiona derechos del usuario, consentimiento y portabilidad de datos
 */

// Esquemas de validación
const consentSchema = z.object({
  userId: z.string().uuid(),
  purpose: z.string(),
  consent: z.boolean(),
  ip: z.string().ip(),
  userAgent: z.string(),
  version: z.string()
});

const dataRequestSchema = z.object({
  userId: z.string().uuid(),
  requestType: z.enum(['ACCESS', 'RECTIFICATION', 'ERASURE', 'PORTABILITY', 'RESTRICTION', 'OBJECTION']),
  details: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM')
});

const dataExportSchema = z.object({
  userId: z.string().uuid(),
  format: z.enum(['JSON', 'CSV', 'XML']).default('JSON'),
  includeMetadata: z.boolean().default(true)
});

/**
 * Gestión de Consentimiento (GDPR Art. 7, Ley 1581 Art. 9)
 */
export class ConsentManager {
  
  /**
   * Registrar consentimiento explícito
   */
  async recordConsent(consentData: z.infer<typeof consentSchema>) {
    try {
      const validatedData = consentSchema.parse(consentData);
      
      const consentRecord = {
        ...validatedData,
        timestamp: new Date().toISOString(),
        country: 'CO', // Colombia
        regulation: 'GDPR_AND_1581',
        language: 'es',
        explicit: true,
        granular: true,
        withdrawable: true
      };
      
      const { data, error } = await supabase
        .from('user_consents')
        .insert(consentRecord)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log para auditoría
      await this.logConsentEvent('CONSENT_RECORDED', validatedData.userId, consentRecord);
      
      return data;
    } catch (error) {
      // TODO: log Error recording consent en desarrollo
      throw new Error('Failed to record consent');
    }
  }
  
  /**
   * Revocar consentimiento
   */
  async withdrawConsent(userId: string, purpose: string) {
    try {
      const { data, error } = await supabase
        .from('user_consents')
        .update({
          consent: false,
          withdrawnAt: new Date().toISOString(),
          withdrawalReason: 'USER_REQUEST'
        })
        .eq('user_id', userId)
        .eq('purpose', purpose)
        .eq('consent', true)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log para auditoría
      await this.logConsentEvent('CONSENT_WITHDRAWN', userId, { purpose });
      
      return data;
    } catch (error) {
      // TODO: log Error withdrawing consent en desarrollo
      throw new Error('Failed to withdraw consent');
    }
  }
  
  /**
   * Obtener consentimientos activos del usuario
   */
  async getUserConsents(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', userId)
        .eq('consent', true)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      // TODO: log Error getting user consents: error
      throw new Error('Failed to get user consents');
    }
  }
  
  /**
   * Verificar si el usuario ha dado consentimiento
   */
  async hasConsent(userId: string, purpose: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('consent')
        .eq('user_id', userId)
        .eq('purpose', purpose)
        .eq('consent', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return !!data?.consent;
    } catch (error) {
      // TODO: log Error checking consent: error
      return false;
    }
  }
  
  /**
   * Logging de eventos de consentimiento
   */
  private async logConsentEvent(event: string, userId: string, details: any) {
    try {
      await supabase
        .from('consent_audit_log')
        .insert({
          event,
          user_id: userId,
          details: JSON.stringify(details),
          timestamp: new Date().toISOString(),
          ip: details.ip || 'unknown',
          user_agent: details.userAgent || 'unknown'
        });
    } catch (error) {
      // TODO: log Error logging consent event en desarrollo
    }
  }
}

/**
 * Gestión de Derechos del Usuario (GDPR Art. 12-22, Ley 1581 Art. 8)
 */
export class UserRightsManager {
  
  /**
   * Derecho de Acceso (GDPR Art. 15, Ley 1581 Art. 8.1)
   */
  async exportUserData(exportData: z.infer<typeof dataExportSchema>) {
    try {
      const validatedData = dataExportSchema.parse(exportData);
      
      // Obtener todos los datos del usuario
      const userData = await this.getAllUserData(validatedData.userId);
      
      // Formatear según el formato solicitado
      const formattedData = this.formatDataForExport(userData, validatedData.format);
      
      // Registrar la solicitud
      await this.recordDataRequest({
        userId: validatedData.userId,
        requestType: 'ACCESS',
        details: `Data export in ${validatedData.format} format`,
        priority: 'MEDIUM'
      });
      
      return {
        data: formattedData,
        format: validatedData.format,
        timestamp: new Date().toISOString(),
        userId: validatedData.userId
      };
    } catch (error) {
      // TODO: log Error exporting user data: error
      throw new Error('Failed to export user data');
    }
  }
  
  /**
   * Derecho de Rectificación (GDPR Art. 16, Ley 1581 Art. 8.1)
   */
  async rectifyUserData(userId: string, corrections: Record<string, any>) {
    try {
      // Validar que el usuario existe
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (userError || !user) {
        throw new Error('User not found');
      }
      
      // Aplicar correcciones
      const { data, error } = await supabase
        .from('users')
        .update(corrections)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Registrar la solicitud
      await this.recordDataRequest({
        userId,
        requestType: 'RECTIFICATION',
        details: `Data rectification: ${JSON.stringify(corrections)}`,
        priority: 'HIGH'
      });
      
      return data;
    } catch (error) {
      // TODO: log Error rectifying user data: error
      throw new Error('Failed to rectify user data');
    }
  }
  
  /**
   * Derecho al Olvido (GDPR Art. 17, Ley 1581 Art. 8.1)
   */
  async deleteUserData(userId: string, reason?: string) {
    try {
      // Soft delete para auditoría
      const { data, error } = await supabase
        .from('users')
        .update({
          deleted_at: new Date().toISOString(),
          deletion_reason: reason || 'USER_REQUEST',
          status: 'DELETED'
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Programar eliminación completa (30 días para GDPR)
      await this.scheduleCompleteDeletion(userId, 30);
      
      // Registrar la solicitud
      await this.recordDataRequest({
        userId,
        requestType: 'ERASURE',
        details: `Data deletion requested: ${reason || 'No reason provided'}`,
        priority: 'URGENT'
      });
      
      return data;
    } catch (error) {
      // TODO: log Error deleting user data: error
      throw new Error('Failed to delete user data');
    }
  }
  
  /**
   * Derecho a la Portabilidad (GDPR Art. 20)
   */
  async exportDataForPortability(userId: string) {
    try {
      const userData = await this.getAllUserData(userId);
      
      // Formato estructurado para portabilidad
      const portableData = {
        user: userData.user,
        profile: userData.profile,
        preferences: userData.preferences,
        activity: userData.activity,
        metadata: {
          exportedAt: new Date().toISOString(),
          format: 'GDPR_PORTABILITY',
          version: '1.0'
        }
      };
      
      // Registrar la solicitud
      await this.recordDataRequest({
        userId,
        requestType: 'PORTABILITY',
        details: 'Data portability export',
        priority: 'MEDIUM'
      });
      
      return portableData;
    } catch (error) {
      // TODO: log Error exporting data for portability: error
      throw new Error('Failed to export data for portability');
    }
  }
  
  /**
   * Derecho a Limitar el Procesamiento (GDPR Art. 18)
   */
  async restrictProcessing(userId: string, purpose: string, duration?: number) {
    try {
      const restriction = {
        user_id: userId,
        purpose,
        restricted_at: new Date().toISOString(),
        expires_at: duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString() : null,
        status: 'ACTIVE'
      };
      
      const { data, error } = await supabase
        .from('processing_restrictions')
        .insert(restriction)
        .select()
        .single();
      
      if (error) throw error;
      
      // Registrar la solicitud
      await this.recordDataRequest({
        userId,
        requestType: 'RESTRICTION',
        details: `Processing restriction for purpose: ${purpose}`,
        priority: 'HIGH'
      });
      
      return data;
    } catch (error) {
      // TODO: log Error restricting processing: error
      throw new Error('Failed to restrict processing');
    }
  }
  
  /**
   * Derecho de Oposición (GDPR Art. 21, Ley 1581 Art. 8.1)
   */
  async objectToProcessing(userId: string, purpose: string, reason?: string) {
    try {
      const objection = {
        user_id: userId,
        purpose,
        reason: reason || 'USER_OBJECTION',
        objected_at: new Date().toISOString(),
        status: 'ACTIVE'
      };
      
      const { data, error } = await supabase
        .from('processing_objections')
        .insert(objection)
        .select()
        .single();
      
      if (error) throw error;
      
      // Registrar la solicitud
      await this.recordDataRequest({
        userId,
        requestType: 'OBJECTION',
        details: `Objection to processing: ${purpose} - ${reason || 'No reason provided'}`,
        priority: 'HIGH'
      });
      
      return data;
    } catch (error) {
      // TODO: log Error recording objection: error
      throw new Error('Failed to record objection');
    }
  }
  
  /**
   * Obtener todos los datos del usuario
   */
  private async getAllUserData(userId: string) {
    try {
      // Datos básicos del usuario
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError) throw userError;
      
      // Perfil del usuario
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      
      // Preferencias del usuario
      const { data: preferences, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (preferencesError && preferencesError.code !== 'PGRST116') throw preferencesError;
      
      // Actividad del usuario (últimos 30 días)
      const { data: activity, error: activityError } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });
      
      if (activityError) throw activityError;
      
      return {
        user,
        profile: profile || null,
        preferences: preferences || null,
        activity: activity || []
      };
    } catch (error) {
      // TODO: log Error getting user data: error
      throw new Error('Failed to get user data');
    }
  }
  
  /**
   * Formatear datos para exportación
   */
  private formatDataForExport(data: any, format: string) {
    switch (format) {
      case 'JSON':
        return JSON.stringify(data, null, 2);
      case 'CSV':
        return this.convertToCSV(data);
      case 'XML':
        return this.convertToXML(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  }
  
  /**
   * Convertir a CSV
   */
  private convertToCSV(data: any): string {
    // Implementación básica de conversión a CSV
    const flatten = (obj: any, prefix = ''): Record<string, any> => {
      return Object.keys(obj).reduce((acc, key) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(acc, flatten(obj[key], pre + key));
        } else {
          acc[pre + key] = obj[key];
        }
        return acc;
      }, {} as Record<string, any>);
    };
    
    const flattened = flatten(data);
    const headers = Object.keys(flattened);
    const values = Object.values(flattened);
    
    return [headers.join(','), values.join(',')].join('\n');
  }
  
  /**
   * Convertir a XML
   */
  private convertToXML(data: any): string {
    const convert = (obj: any, rootName = 'root'): string => {
      if (typeof obj !== 'object' || obj === null) {
        return `<${rootName}>${obj}</${rootName}>`;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => convert(item, rootName)).join('');
      }
      
      const xml = Object.keys(obj).map(key => convert(obj[key], key)).join('');
      return `<${rootName}>${xml}</${rootName}>`;
    };
    
    return `<?xml version="1.0" encoding="UTF-8"?>\n${convert(data, 'userData')}`;
  }
  
  /**
   * Programar eliminación completa
   */
  private async scheduleCompleteDeletion(userId: string, days: number) {
    try {
      const deletionDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      
      await supabase
        .from('scheduled_deletions')
        .insert({
          user_id: userId,
          scheduled_at: deletionDate.toISOString(),
          status: 'SCHEDULED',
          reason: 'GDPR_ERASURE'
        });
    } catch (error) {
      // TODO: log Error scheduling deletion en desarrollo
    }
  }
  
  /**
   * Registrar solicitud de datos
   */
  private async recordDataRequest(request: z.infer<typeof dataRequestSchema>) {
    try {
      const validatedRequest = dataRequestSchema.parse(request);
      
      await supabase
        .from('data_requests')
        .insert({
          ...validatedRequest,
          status: 'PENDING',
          created_at: new Date().toISOString(),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
        });
    } catch (error) {
      // TODO: log Error recording data request en desarrollo
    }
  }
}

/**
 * Servicio de Notificación de Brechas (GDPR Art. 33-34)
 */
export class BreachNotificationService {
  
  /**
   * Registrar brecha de datos
   */
  async recordBreach(breachData: {
    type: 'PERSONAL_DATA_BREACH' | 'SECURITY_BREACH' | 'UNAUTHORIZED_ACCESS';
    description: string;
    affectedUsers: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    discoveredAt: string;
    details: any;
  }) {
    try {
      const breach = {
        ...breachData,
        status: 'INVESTIGATING',
        reported_at: new Date().toISOString(),
        notification_required: breachData.severity === 'HIGH' || breachData.severity === 'CRITICAL'
      };
      
      const { data, error } = await supabase
        .from('data_breaches')
        .insert(breach)
        .select()
        .single();
      
      if (error) throw error;
      
      // Si es crítica, notificar inmediatamente
      if (breach.notification_required) {
        await this.notifyAuthorities(breach);
        await this.notifyAffectedUsers(breach);
      }
      
      return data;
    } catch (error) {
      // TODO: log Error recording breach en desarrollo
      throw new Error('Failed to record breach');
    }
  }
  
  /**
   * Notificar a autoridades (72 horas para GDPR)
   */
  private async notifyAuthorities(breach: any) {
    try {
      // TODO: Implementar notificación a autoridades colombianas
      // TODO: log Notifying authorities about breach en desarrollo
      await supabase
        .from('authority_notifications')
        .insert({
          breach_id: breach.id,
          authority: 'SIC_COLOMBIA',
          notified_at: new Date().toISOString(),
          status: 'SENT'
        });
    } catch (error) {
      // TODO: log Error notifying authorities en desarrollo
    }
  }
  
  /**
   * Notificar a usuarios afectados
   */
  private async notifyAffectedUsers(breach: any) {
    try {
      // TODO: Implementar notificación a usuarios
      // TODO: log Notifying affected users about breach en desarrollo
      await supabase
        .from('user_notifications')
        .insert({
          breach_id: breach.id,
          type: 'DATA_BREACH',
          status: 'PENDING',
          created_at: new Date().toISOString()
        });
    } catch (error) {
      // TODO: log Error notifying users en desarrollo
    }
  }
}

// Instancias de servicios
export const consentManager = new ConsentManager();
export const userRightsManager = new UserRightsManager();
export const breachNotificationService = new BreachNotificationService(); 