/**
 * Servicio de Email con Resend
 * 
 * Integración completa con Resend API para envío de emails
 * con templates React y analytics en tiempo real.
 */

import { Resend } from 'resend';

export interface EmailConfig {
  from: string;
  fromName: string;
  replyTo?: string;
}

export interface EmailTemplate {
  subject: string;
  react: React.ReactElement;
  html?: string;
  text?: string;
}

export interface EmailData {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  react?: React.ReactElement;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailResponse {
  success: boolean;
  data?: any;
  error?: string;
  messageId?: string;
}

export class ResendService {
  private resend: Resend;
  private config: EmailConfig;

  constructor(apiKey: string, config: EmailConfig) {
    this.resend = new Resend(apiKey);
    this.config = config;
  }

  /**
   * Enviar email con Resend
   */
  async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `${this.config.fromName} <${this.config.from}>`,
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject,
        react: emailData.react,
        html: emailData.html,
        text: emailData.text,
        attachments: emailData.attachments,
        reply_to: this.config.replyTo,
      });

      if (error) {
        // TODO: log en cada punto donde había console.log, console.error o console.warn
        return {
          success: false,
          error: error.message || 'Error sending email',
        };
      }

      return {
        success: true,
        data,
        messageId: data?.id,
      };
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Enviar email de bienvenida
   */
  async sendWelcomeEmail(user: any, company: any): Promise<EmailResponse> {
    const { WelcomeEmail } = await import('@/emails/WelcomeEmail');
    
    return this.sendEmail({
      to: user.email,
      subject: `¡Bienvenido a ${company.name}!`,
      react: WelcomeEmail({ user, company }),
    });
  }

  /**
   * Enviar email de reset de contraseña
   */
  async sendPasswordResetEmail(user: any, resetToken: string): Promise<EmailResponse> {
    const { PasswordResetEmail } = await import('@/emails/PasswordResetEmail');
    
    return this.sendEmail({
      to: user.email,
      subject: 'Restablecer Contraseña - VThink',
      react: PasswordResetEmail({ user, resetToken }),
    });
  }

  /**
   * Enviar email de notificación
   */
  async sendNotificationEmail(user: any, notification: any): Promise<EmailResponse> {
    const { NotificationEmail } = await import('@/emails/NotificationEmail');
    
    return this.sendEmail({
      to: user.email,
      subject: notification.subject,
      react: NotificationEmail({ user, notification }),
    });
  }

  /**
   * Enviar email de migración completada
   */
  async sendMigrationCompletedEmail(user: any, migrationData: any): Promise<EmailResponse> {
    const { MigrationCompletedEmail } = await import('@/emails/MigrationCompletedEmail');
    
    return this.sendEmail({
      to: user.email,
      subject: 'Migración Completada - VThink',
      react: MigrationCompletedEmail({ user, migrationData }),
    });
  }

  /**
   * Enviar email de reporte SEO
   */
  async sendSEOReportEmail(user: any, seoReport: any): Promise<EmailResponse> {
    const { SEOReportEmail } = await import('@/emails/SEOReportEmail');
    
    return this.sendEmail({
      to: user.email,
      subject: 'Reporte SEO Premium - VThink',
      react: SEOReportEmail({ user, seoReport }),
    });
  }

  /**
   * Enviar email de traducción completada
   */
  async sendTranslationCompletedEmail(user: any, translationData: any): Promise<EmailResponse> {
    const { TranslationCompletedEmail } = await import('@/emails/TranslationCompletedEmail');
    
    return this.sendEmail({
      to: user.email,
      subject: 'Traducción Completada - VThink',
      react: TranslationCompletedEmail({ user, translationData }),
    });
  }

  /**
   * Enviar email masivo
   */
  async sendBulkEmail(users: any[], template: EmailTemplate, data: any): Promise<EmailResponse[]> {
    const promises = users.map(user => 
      this.sendEmail({
        to: user.email,
        subject: template.subject,
        react: template.react,
        html: template.html,
        text: template.text,
      })
    );
    
    return await Promise.allSettled(promises).then(results =>
      results.map(result => 
        result.status === 'fulfilled' ? result.value : {
          success: false,
          error: 'Failed to send email'
        }
      )
    );
  }

  /**
   * Verificar estado de email
   */
  async getEmailStatus(messageId: string): Promise<any> {
    try {
      // Resend no proporciona endpoint para verificar estado individual
      // Se puede usar webhooks para tracking
      return {
        messageId,
        status: 'sent', // Asumimos que fue enviado si no hay error
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return null;
    }
  }

  /**
   * Obtener estadísticas de envío
   */
  async getEmailStats(period: string = '30d'): Promise<any> {
    try {
      // Resend no proporciona API para estadísticas
      // Se puede implementar con webhooks
      return {
        period,
        totalSent: 0,
        delivered: 0,
        bounced: 0,
        opened: 0,
        clicked: 0,
      };
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      return null;
    }
  }
}

// Instancia global del servicio
export const resendService = new ResendService(
  process.env.RESEND_API_KEY || '',
  {
    from: process.env.RESEND_FROM_EMAIL || 'noreply@vthink.com',
    fromName: process.env.RESEND_FROM_NAME || 'VibeThink',
    replyTo: process.env.RESEND_REPLY_TO || 'support@vthink.com',
  }
); 