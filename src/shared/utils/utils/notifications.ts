/**
 * Notifications System
 * 
 * Centralized notification management
 * - Multiple notification types
 * - Different channels (in-app, email, push)
 * - Notification preferences
 * - Real-time updates
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useAuth } from '@/shared/hooks/useAuth';
import { useCookies } from '@/shared/hooks/useCookies';
import { usePersonalization } from '@/shared/hooks/usePersonalization';

// Notification types
export const NOTIFICATION_TYPES = {
  // System notifications
  SYSTEM: 'system',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  
  // Business notifications
  TICKET: 'ticket',
  CRM: 'crm',
  ANALYTICS: 'analytics',
  ADMIN: 'admin',
  AI: 'ai',
  
  // User notifications
  PROFILE: 'profile',
  SECURITY: 'security',
  BILLING: 'billing'
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// Notification channels
export const NOTIFICATION_CHANNELS = {
  IN_APP: 'in_app',
  EMAIL: 'email',
  PUSH: 'push',
  SMS: 'sms',
  SLACK: 'slack',
  WEBHOOK: 'webhook'
} as const;

export type NotificationChannel = typeof NOTIFICATION_CHANNELS[keyof typeof NOTIFICATION_CHANNELS];

// Notification priority
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export type NotificationPriority = typeof NOTIFICATION_PRIORITY[keyof typeof NOTIFICATION_PRIORITY];

// Notification status
export const NOTIFICATION_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

export type NotificationStatus = typeof NOTIFICATION_STATUS[keyof typeof NOTIFICATION_STATUS];

// Notification interface
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  status: NotificationStatus;
  metadata?: Record<string, any>;
  createdAt: string;
  scheduledFor?: string;
  expiresAt?: string;
  readAt?: string;
  userId?: string;
  companyId?: string;
  actionUrl?: string;
  actionText?: string;
}

// Notification preferences
interface NotificationPreferences {
  inApp: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
  slack: boolean;
  webhook: boolean;
  types: Record<NotificationType, boolean>;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
    timezone: string;
  };
}

// Notification template
interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  title: string;
  message: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  metadata?: Record<string, any>;
}

// Notification service interface
interface NotificationService {
  // Core methods
  send(notification: Omit<Notification, 'id' | 'status' | 'createdAt'>): Promise<string>;
  sendTemplate(templateId: string, data: Record<string, any>): Promise<string>;
  sendBulk(notifications: Omit<Notification, 'id' | 'status' | 'createdAt'>[]): Promise<string[]>;
  
  // Management methods
  get(id: string): Promise<Notification | null>;
  list(filters?: NotificationFilters): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  delete(id: string): Promise<void>;
  cancel(id: string): Promise<void>;
  
  // Preferences
  getPreferences(): Promise<NotificationPreferences>;
  updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void>;
  
  // Templates
  getTemplates(): Promise<NotificationTemplate[]>;
  createTemplate(template: Omit<NotificationTemplate, 'id'>): Promise<string>;
  updateTemplate(id: string, template: Partial<NotificationTemplate>): Promise<void>;
  deleteTemplate(id: string): Promise<void>;
}

// Notification filters
interface NotificationFilters {
  type?: NotificationType;
  status?: NotificationStatus;
  priority?: NotificationPriority;
  channel?: NotificationChannel;
  userId?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// Default notification templates
const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'ticket_created',
    name: 'Ticket Creado',
    type: NOTIFICATION_TYPES.TICKET,
    title: 'Nuevo ticket creado',
    message: 'Se ha creado un nuevo ticket: {{ticket_title}}',
    channels: [NOTIFICATION_CHANNELS.IN_APP, NOTIFICATION_CHANNELS.EMAIL],
    priority: NOTIFICATION_PRIORITY.NORMAL,
    metadata: {
      actionUrl: '/helpdesk/tickets/{{ticket_id}}',
      actionText: 'Ver Ticket'
    }
  },
  {
    id: 'ticket_assigned',
    name: 'Ticket Asignado',
    type: NOTIFICATION_TYPES.TICKET,
    title: 'Ticket asignado',
    message: 'Se te ha asignado el ticket: {{ticket_title}}',
    channels: [NOTIFICATION_CHANNELS.IN_APP, NOTIFICATION_CHANNELS.EMAIL],
    priority: NOTIFICATION_PRIORITY.HIGH,
    metadata: {
      actionUrl: '/helpdesk/tickets/{{ticket_id}}',
      actionText: 'Ver Ticket'
    }
  },
  {
    id: 'lead_created',
    name: 'Lead Creado',
    type: NOTIFICATION_TYPES.CRM,
    title: 'Nuevo lead',
    message: 'Se ha creado un nuevo lead: {{lead_name}}',
    channels: [NOTIFICATION_CHANNELS.IN_APP, NOTIFICATION_CHANNELS.EMAIL],
    priority: NOTIFICATION_PRIORITY.NORMAL,
    metadata: {
      actionUrl: '/crm/leads/{{lead_id}}',
      actionText: 'Ver Lead'
    }
  },
  {
    id: 'system_alert',
    name: 'Alerta del Sistema',
    type: NOTIFICATION_TYPES.SYSTEM,
    title: 'Alerta del sistema',
    message: '{{alert_message}}',
    channels: [NOTIFICATION_CHANNELS.IN_APP, NOTIFICATION_CHANNELS.EMAIL],
    priority: NOTIFICATION_PRIORITY.HIGH
  },
  {
    id: 'security_alert',
    name: 'Alerta de Seguridad',
    type: NOTIFICATION_TYPES.SECURITY,
    title: 'Alerta de seguridad',
    message: '{{security_message}}',
    channels: [NOTIFICATION_CHANNELS.IN_APP, NOTIFICATION_CHANNELS.EMAIL, NOTIFICATION_CHANNELS.SMS],
    priority: NOTIFICATION_PRIORITY.URGENT
  }
];

// Default preferences
const DEFAULT_PREFERENCES: NotificationPreferences = {
  inApp: true,
  email: true,
  push: false,
  sms: false,
  slack: false,
  webhook: false,
  types: {
    [NOTIFICATION_TYPES.SYSTEM]: true,
    [NOTIFICATION_TYPES.INFO]: true,
    [NOTIFICATION_TYPES.SUCCESS]: true,
    [NOTIFICATION_TYPES.WARNING]: true,
    [NOTIFICATION_TYPES.ERROR]: true,
    [NOTIFICATION_TYPES.TICKET]: true,
    [NOTIFICATION_TYPES.CRM]: true,
    [NOTIFICATION_TYPES.ANALYTICS]: false,
    [NOTIFICATION_TYPES.ADMIN]: true,
    [NOTIFICATION_TYPES.AI]: true,
    [NOTIFICATION_TYPES.PROFILE]: true,
    [NOTIFICATION_TYPES.SECURITY]: true,
    [NOTIFICATION_TYPES.BILLING]: true
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
    timezone: 'America/Bogota'
  }
};

// Main notification service
class NotificationService implements NotificationService {
  private templates: Map<string, NotificationTemplate>;
  private preferences: NotificationPreferences;
  private notifications: Map<string, Notification>;
  
  constructor() {
    this.templates = new Map();
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.notifications = new Map();
    
    // Load default templates
    DEFAULT_TEMPLATES.forEach(template => {
      this.templates.set(template.id, template);
    });
    
    // Load preferences from localStorage
    this.loadPreferences();
  }
  
  private loadPreferences() {
    try {
      const stored = localStorage.getItem('notification_preferences');
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
    }
  }
  
  private savePreferences() {
    try {
      localStorage.setItem('notification_preferences', JSON.stringify(this.preferences));
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
    }
  }
  
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private isInQuietHours(): boolean {
    if (!this.preferences.quietHours.enabled) return false;
    
    const now = new Date();
    const timezone = this.preferences.quietHours.timezone;
    const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const currentTime = localTime.getHours() * 60 + localTime.getMinutes();
    
    const [startHour, startMinute] = this.preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = this.preferences.quietHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight quiet hours
      return currentTime >= startTime || currentTime <= endTime;
    }
  }
  
  private shouldSendNotification(notification: Notification): boolean {
    // Check if notification type is enabled
    if (!this.preferences.types[notification.type]) return false;
    
    // Check quiet hours
    if (this.isInQuietHours() && notification.priority !== NOTIFICATION_PRIORITY.URGENT) {
      return false;
    }
    
    return true;
  }
  
  private async sendToChannel(notification: Notification, channel: NotificationChannel): Promise<boolean> {
    try {
      switch (channel) {
        case NOTIFICATION_CHANNELS.IN_APP:
          return this.sendInApp(notification);
        
        case NOTIFICATION_CHANNELS.EMAIL:
          return this.sendEmail(notification);
        
        case NOTIFICATION_CHANNELS.PUSH:
          return this.sendPush(notification);
        
        case NOTIFICATION_CHANNELS.SMS:
          return this.sendSMS(notification);
        
        case NOTIFICATION_CHANNELS.SLACK:
          return this.sendSlack(notification);
        
        case NOTIFICATION_CHANNELS.WEBHOOK:
          return this.sendWebhook(notification);
        
        default:
          return false;
      }
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return false;
    }
  }
  
  private async sendInApp(notification: Notification): Promise<boolean> {
    // Store in local storage for in-app display
    const inAppNotifications = JSON.parse(localStorage.getItem('in_app_notifications') || '[]');
    inAppNotifications.push({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      createdAt: notification.createdAt,
      actionUrl: notification.actionUrl,
      actionText: notification.actionText
    });
    
    // Keep only last 50 notifications
    if (inAppNotifications.length > 50) {
      inAppNotifications.splice(0, inAppNotifications.length - 50);
    }
    
    localStorage.setItem('in_app_notifications', JSON.stringify(inAppNotifications));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('notification-received', { detail: notification }));
    
    return true;
  }
  
  private async sendEmail(notification: Notification): Promise<boolean> {
    // Send to email service
    const response = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        to: notification.userId,
        subject: notification.title,
        body: notification.message,
        template: notification.type,
        metadata: notification.metadata
      })
    });
    
    return response.ok;
  }
  
  private async sendPush(notification: Notification): Promise<boolean> {
    // Send push notification
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        data: notification.metadata,
        actions: notification.actionUrl ? [
          {
            action: 'open',
            title: notification.actionText || 'Abrir'
          }
        ] : undefined
      });
      return true;
    }
    return false;
  }
  
  private async sendSMS(notification: Notification): Promise<boolean> {
    // Send SMS via API
    const response = await fetch('/api/notifications/sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        to: notification.userId,
        message: notification.message,
        priority: notification.priority
      })
    });
    
    return response.ok;
  }
  
  private async sendSlack(notification: Notification): Promise<boolean> {
    // Send to Slack webhook
    const response = await fetch('/api/notifications/slack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        channel: notification.metadata?.slack_channel || '#general',
        text: notification.message,
        attachments: [{
          title: notification.title,
          text: notification.message,
          color: this.getPriorityColor(notification.priority)
        }]
      })
    });
    
    return response.ok;
  }
  
  private async sendWebhook(notification: Notification): Promise<boolean> {
    // Send to webhook URL
    const webhookUrl = notification.metadata?.webhook_url;
    if (!webhookUrl) return false;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notification)
    });
    
    return response.ok;
  }
  
  private getPriorityColor(priority: NotificationPriority): string {
    switch (priority) {
      case NOTIFICATION_PRIORITY.LOW: return '#36a64f';
      case NOTIFICATION_PRIORITY.NORMAL: return '#2f80ed';
      case NOTIFICATION_PRIORITY.HIGH: return '#f2994a';
      case NOTIFICATION_PRIORITY.URGENT: return '#eb5757';
      default: return '#2f80ed';
    }
  }
  
  async send(notification: Omit<Notification, 'id' | 'status' | 'createdAt'>): Promise<string> {
    const id = this.generateId();
    const fullNotification: Notification = {
      ...notification,
      id,
      status: NOTIFICATION_STATUS.PENDING,
      createdAt: new Date().toISOString()
    };
    
    // Store notification
    this.notifications.set(id, fullNotification);
    
    // Check if should send
    if (!this.shouldSendNotification(fullNotification)) {
      fullNotification.status = NOTIFICATION_STATUS.CANCELLED;
      return id;
    }
    
    // Send to enabled channels
    const enabledChannels = notification.channels.filter(channel => 
      this.preferences[channel as keyof NotificationPreferences] as boolean
    );
    
    const results = await Promise.allSettled(
      enabledChannels.map(channel => this.sendToChannel(fullNotification, channel))
    );
    
    // Update status based on results
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value
    ).length;
    
    if (successCount > 0) {
      fullNotification.status = NOTIFICATION_STATUS.SENT;
    } else {
      fullNotification.status = NOTIFICATION_STATUS.FAILED;
    }
    
    return id;
  }
  
  async sendTemplate(templateId: string, data: Record<string, any>): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    // Replace placeholders in template
    let title = template.title;
    let message = template.message;
    let actionUrl = template.metadata?.actionUrl;
    
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      title = title.replace(new RegExp(placeholder, 'g'), String(value));
      message = message.replace(new RegExp(placeholder, 'g'), String(value));
      if (actionUrl) {
        actionUrl = actionUrl.replace(new RegExp(placeholder, 'g'), String(value));
      }
    });
    
    return this.send({
      type: template.type,
      title,
      message,
      priority: template.priority,
      channels: template.channels,
      metadata: {
        ...template.metadata,
        actionUrl,
        templateId,
        templateData: data
      }
    });
  }
  
  async sendBulk(notifications: Omit<Notification, 'id' | 'status' | 'createdAt'>[]): Promise<string[]> {
    const results = await Promise.allSettled(
      notifications.map(notification => this.send(notification))
    );
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : null
    ).filter(Boolean) as string[];
  }
  
  async get(id: string): Promise<Notification | null> {
    return this.notifications.get(id) || null;
  }
  
  async list(filters: NotificationFilters = {}): Promise<Notification[]> {
    let notifications = Array.from(this.notifications.values());
    
    if (filters.type) {
      notifications = notifications.filter(n => n.type === filters.type);
    }
    
    if (filters.status) {
      notifications = notifications.filter(n => n.status === filters.status);
    }
    
    if (filters.priority) {
      notifications = notifications.filter(n => n.priority === filters.priority);
    }
    
    if (filters.userId) {
      notifications = notifications.filter(n => n.userId === filters.userId);
    }
    
    if (filters.companyId) {
      notifications = notifications.filter(n => n.companyId === filters.companyId);
    }
    
    if (filters.startDate) {
      notifications = notifications.filter(n => n.createdAt >= filters.startDate!);
    }
    
    if (filters.endDate) {
      notifications = notifications.filter(n => n.createdAt <= filters.endDate!);
    }
    
    // Sort by creation date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Apply pagination
    if (filters.offset) {
      notifications = notifications.slice(filters.offset);
    }
    
    if (filters.limit) {
      notifications = notifications.slice(0, filters.limit);
    }
    
    return notifications;
  }
  
  async markAsRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.status = NOTIFICATION_STATUS.READ;
      notification.readAt = new Date().toISOString();
    }
  }
  
  async markAllAsRead(): Promise<void> {
    const promises = Array.from(this.notifications.values())
      .filter(n => n.status === NOTIFICATION_STATUS.SENT)
      .map(n => this.markAsRead(n.id));
    
    await Promise.all(promises);
  }
  
  async delete(id: string): Promise<void> {
    this.notifications.delete(id);
  }
  
  async cancel(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification && notification.status === NOTIFICATION_STATUS.PENDING) {
      notification.status = NOTIFICATION_STATUS.CANCELLED;
    }
  }
  
  async getPreferences(): Promise<NotificationPreferences> {
    return { ...this.preferences };
  }
  
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences };
    this.savePreferences();
  }
  
  async getTemplates(): Promise<NotificationTemplate[]> {
    return Array.from(this.templates.values());
  }
  
  async createTemplate(template: Omit<NotificationTemplate, 'id'>): Promise<string> {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullTemplate: NotificationTemplate = { ...template, id };
    this.templates.set(id, fullTemplate);
    return id;
  }
  
  async updateTemplate(id: string, template: Partial<NotificationTemplate>): Promise<void> {
    const existing = this.templates.get(id);
    if (existing) {
      this.templates.set(id, { ...existing, ...template });
    }
  }
  
  async deleteTemplate(id: string): Promise<void> {
    this.templates.delete(id);
  }
}

// Global notification service instance
export const notificationService = new NotificationService();

// React hook for notifications
export function useNotifications() {
  const { user } = useAuth();
  const { hasConsent } = useCookies();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  
  // Load in-app notifications
  React.useEffect(() => {
    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem('in_app_notifications');
        if (stored) {
          const inAppNotifications = JSON.parse(stored);
          setNotifications(inAppNotifications);
          setUnreadCount(inAppNotifications.filter((n: any) => !n.readAt).length);
        }
      } catch (error) {
        // TODO: log en cada punto donde había console.log, console.error o console.warn
      }
    };
    
    loadNotifications();
    
    // Listen for new notifications
    const handleNewNotification = (event: CustomEvent) => {
      loadNotifications();
    };
    
    window.addEventListener('notification-received', handleNewNotification);
    
    return () => {
      window.removeEventListener('notification-received', handleNewNotification);
    };
  }, []);
  
  // Mark notification as read
  const markAsRead = React.useCallback(async (id: string) => {
    await notificationService.markAsRead(id);
    
    // Update local state
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, status: NOTIFICATION_STATUS.READ, readAt: new Date().toISOString() } : n)
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);
  
  // Mark all as read
  const markAllAsRead = React.useCallback(async () => {
    await notificationService.markAllAsRead();
    
    // Update local state
    setNotifications(prev => 
      prev.map(n => ({ ...n, status: NOTIFICATION_STATUS.READ, readAt: new Date().toISOString() }))
    );
    
    setUnreadCount(0);
  }, []);
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    send: notificationService.send.bind(notificationService),
    sendTemplate: notificationService.sendTemplate.bind(notificationService)
  };
}

// Utility functions
export const NotificationUtils = {
  /**
   * Send system notification
   */
  sendSystem: (title: string, message: string, priority: NotificationPriority = NOTIFICATION_PRIORITY.NORMAL) => {
    return notificationService.send({
      type: NOTIFICATION_TYPES.SYSTEM,
      title,
      message,
      priority,
      channels: [NOTIFICATION_CHANNELS.IN_APP]
    });
  },
  
  /**
   * Send success notification
   */
  sendSuccess: (title: string, message: string) => {
    return notificationService.send({
      type: NOTIFICATION_TYPES.SUCCESS,
      title,
      message,
      priority: NOTIFICATION_PRIORITY.NORMAL,
      channels: [NOTIFICATION_CHANNELS.IN_APP]
    });
  },
  
  /**
   * Send error notification
   */
  sendError: (title: string, message: string) => {
    return notificationService.send({
      type: NOTIFICATION_TYPES.ERROR,
      title,
      message,
      priority: NOTIFICATION_PRIORITY.HIGH,
      channels: [NOTIFICATION_CHANNELS.IN_APP]
    });
  },
  
  /**
   * Send ticket notification
   */
  sendTicketNotification: (ticketId: string, title: string, message: string, userId?: string) => {
    return notificationService.sendTemplate('ticket_created', {
      ticket_id: ticketId,
      ticket_title: title
    });
  }
};

// Export types
export type { Notification, NotificationPreferences, NotificationTemplate, NotificationFilters }; 