import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { logger } from '@/shared/utils/logger';

// Tipos de la base de datos
type Timeline = Database['public']['Tables']['universal_timelines']['Row'];
type Milestone = Database['public']['Tables']['timeline_milestones']['Row'];
type Alert = Database['public']['Tables']['timeline_alerts']['Row'];
type Notification = Database['public']['Tables']['timeline_notifications']['Row'];

// Tipos de la aplicación
export interface TimelineContext {
  [key: string]: any;
}

export interface TimelineData {
  type: 'SHIPPING' | 'CASE' | 'PURCHASE' | 'PROJECT' | 'TASK' | 'EVENT';
  context: TimelineContext;
  expectedEndTime: Date;
  companyId: string;
  workspaceId?: string;
  subWorkspaceId?: string;
}

export interface MilestoneData {
  timelineId: string;
  name: string;
  description?: string;
  expectedTime: Date;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dependencies?: string[];
}

export interface AlertData {
  timelineId: string;
  type: string;
  title: string;
  message: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actions?: Array<{ label: string; action: string }>;
}

/**
 * Servicio principal para el Sistema de Línea de Tiempo Universal
 */
export class TimelineService {
  private static instance: TimelineService;

  private constructor() {}

  public static getInstance(): TimelineService {
    if (!TimelineService.instance) {
      TimelineService.instance = new TimelineService();
    }
    return TimelineService.instance;
  }

  /**
   * Crear una nueva línea de tiempo
   */
  async createTimeline(data: TimelineData): Promise<string> {
    try {
      const { data: timelineId, error } = await supabase.rpc('create_timeline', {
        p_type: data.type,
        p_context: data.context,
        p_expected_end_time: data.expectedEndTime.toISOString(),
        p_company_id: data.companyId,
        p_workspace_id: data.workspaceId || null,
        p_sub_workspace_id: data.subWorkspaceId || null
      });

      if (error) throw error;
      
      logger.info({ 
        service: 'TimelineService', 
        operation: 'createTimeline',
        timelineId,
        type: data.type,
        companyId: data.companyId
      }, 'Línea de tiempo creada exitosamente');
      
      return timelineId;
    } catch (error) {
      logger.error({ 
        service: 'TimelineService', 
        operation: 'createTimeline',
        type: data.type,
        companyId: data.companyId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'Error creando línea de tiempo');
      throw new Error('Failed to create timeline');
    }
  }

  /**
   * Obtener línea de tiempo por ID
   */
  async getTimeline(timelineId: string): Promise<Timeline | null> {
    try {
      const { data, error } = await supabase
        .from('universal_timelines')
        .select('*')
        .eq('id', timelineId)
        .single();

      if (error) throw error;
      
      logger.info({ 
        service: 'TimelineService', 
        operation: 'getTimeline',
        timelineId
      }, 'Línea de tiempo obtenida');
      
      return data;
    } catch (error) {
      logger.error({ 
        service: 'TimelineService', 
        operation: 'getTimeline',
        timelineId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'Error obteniendo línea de tiempo');
      return null;
    }
  }

  /**
   * Obtener líneas de tiempo por empresa
   */
  async getTimelinesByCompany(companyId: string, filters?: {
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Timeline[]> {
    try {
      let query = supabase
        .from('universal_timelines')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      logger.info({ 
        service: 'TimelineService', 
        operation: 'getTimelinesByCompany',
        companyId,
        timelineCount: data?.length || 0,
        filters
      }, 'Líneas de tiempo obtenidas por empresa');
      
      return data || [];
    } catch (error) {
      logger.error({ 
        service: 'TimelineService', 
        operation: 'getTimelinesByCompany',
        companyId,
        filters,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'Error obteniendo líneas de tiempo por empresa');
      return [];
    }
  }

  /**
   * Actualizar progreso de milestone
   */
  async updateMilestoneProgress(
    timelineId: string,
    milestoneName: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED',
    userId?: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('update_milestone_progress', {
        p_timeline_id: timelineId,
        p_milestone_name: milestoneName,
        p_status: status,
        p_user_id: userId || null
      });

      if (error) throw error;
      return data;
    } catch (error) {
      // TODO: log Error updating milestone progress: error
      return false;
    }
  }

  /**
   * Obtener milestones de una línea de tiempo
   */
  async getMilestones(timelineId: string): Promise<Milestone[]> {
    try {
      const { data, error } = await supabase
        .from('timeline_milestones')
        .select('*')
        .eq('timeline_id', timelineId)
        .order('expected_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      // TODO: log Error fetching milestones: error
      return [];
    }
  }

  /**
   * Crear alerta en línea de tiempo
   */
  async createAlert(data: AlertData): Promise<string> {
    try {
      const { data: alertId, error } = await supabase.rpc('create_timeline_alert', {
        p_timeline_id: data.timelineId,
        p_type: data.type,
        p_title: data.title,
        p_message: data.message,
        p_severity: data.severity || 'MEDIUM',
        p_actions: data.actions || []
      });

      if (error) throw error;
      return alertId;
    } catch (error) {
      // TODO: log Error creating alert: error
      throw new Error('Failed to create alert');
    }
  }

  /**
   * Obtener alertas activas de una línea de tiempo
   */
  async getActiveAlerts(timelineId: string): Promise<Alert[]> {
    try {
      const { data, error } = await supabase
        .from('timeline_alerts')
        .select('*')
        .eq('timeline_id', timelineId)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      // TODO: log Error fetching alerts: error
      return [];
    }
  }

  /**
   * Obtener notificaciones no leídas de un usuario
   */
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('timeline_notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'DELIVERED')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      // TODO: log Error fetching notifications: error
      return [];
    }
  }

  /**
   * Marcar notificación como leída
   */
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('timeline_notifications')
        .update({ 
          status: 'READ',
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      // TODO: log Error marking notification as read: error
      return false;
    }
  }

  /**
   * Suscribirse a actualizaciones de línea de tiempo en tiempo real
   */
  subscribeToTimelineUpdates(timelineId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`timeline-${timelineId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'universal_timelines',
          filter: `id=eq.${timelineId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timeline_milestones',
          filter: `timeline_id=eq.${timelineId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timeline_alerts',
          filter: `timeline_id=eq.${timelineId}`
        },
        callback
      )
      .subscribe();
  }

  /**
   * Suscribirse a notificaciones de usuario en tiempo real
   */
  subscribeToUserNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'timeline_notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }

  /**
   * Verificar alertas automáticamente (para ser ejecutado por un cron job)
   */
  async checkAutomaticAlerts(): Promise<void> {
    try {
      // Obtener líneas de tiempo activas
      const { data: activeTimelines, error: timelinesError } = await supabase
        .from('universal_timelines')
        .select('*')
        .eq('status', 'ACTIVE');

      if (timelinesError) throw timelinesError;

      for (const timeline of activeTimelines || []) {
        await this.evaluateTimelineAlerts(timeline);
      }
    } catch (error) {
      // TODO: log Error checking automatic alerts: error
    }
  }

  /**
   * Evaluar alertas de una línea de tiempo específica
   */
  private async evaluateTimelineAlerts(timeline: Timeline): Promise<void> {
    try {
      const now = new Date();
      const expectedEnd = new Date(timeline.expected_end_time);
      const timeRemaining = expectedEnd.getTime() - now.getTime();

      // Verificar si hay retrasos
      if (timeRemaining < 0 && timeline.status === 'ACTIVE') {
        // Crear alerta de retraso
        await this.createAlert({
          timelineId: timeline.id,
          type: 'DELAY',
          title: `🚨 Línea de tiempo retrasada`,
          message: `La línea de tiempo ${timeline.type} está retrasada por ${Math.abs(Math.floor(timeRemaining / (1000 * 60 * 60)))} horas`,
          severity: 'HIGH',
          actions: [
            { label: 'Ver Detalles', action: 'VIEW_TIMELINE' },
            { label: 'Actualizar Estado', action: 'UPDATE_STATUS' }
          ]
        });
      }

      // Verificar milestones retrasados
      const milestones = await this.getMilestones(timeline.id);
      for (const milestone of milestones) {
        if (milestone.status === 'PENDING' && new Date(milestone.expected_time) < now) {
          await this.createAlert({
            timelineId: timeline.id,
            type: 'MILESTONE_DELAYED',
            title: `⚠️ Milestone retrasado: ${milestone.name}`,
            message: `El milestone "${milestone.description}" está retrasado`,
            severity: 'MEDIUM',
            actions: [
              { label: 'Ver Milestone', action: 'VIEW_MILESTONE' },
              { label: 'Actualizar Estado', action: 'UPDATE_MILESTONE' }
            ]
          });
        }
      }
    } catch (error) {
      // TODO: log Error evaluating timeline alerts: error
    }
  }
}

// Exportar instancia singleton
export const timelineService = TimelineService.getInstance(); 