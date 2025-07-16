/**
 * Hook para gestión de emails con Resend
 * 
 * Proporciona funcionalidades para envío de emails con templates React
 * y gestión de estado de envío.
 */

import { useState, useCallback } from 'react';
import { resendService, EmailData, EmailResponse } from '@/shared/services/email/ResendService';

export interface EmailState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  messageId: string | null;
}

export interface UseEmailReturn {
  sendEmail: (emailData: EmailData) => Promise<EmailResponse>;
  sendWelcomeEmail: (user: any, company: any) => Promise<EmailResponse>;
  sendPasswordResetEmail: (user: any, resetToken: string) => Promise<EmailResponse>;
  sendNotificationEmail: (user: any, notification: any) => Promise<EmailResponse>;
  sendMigrationCompletedEmail: (user: any, migrationData: any) => Promise<EmailResponse>;
  sendSEOReportEmail: (user: any, seoReport: any) => Promise<EmailResponse>;
  sendTranslationCompletedEmail: (user: any, translationData: any) => Promise<EmailResponse>;
  sendBulkEmail: (users: any[], template: any, data: any) => Promise<EmailResponse[]>;
  resetState: () => void;
  state: EmailState;
}

export const useEmail = (): UseEmailReturn => {
  const [state, setState] = useState<EmailState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    messageId: null,
  });

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      messageId: null,
    });
  }, []);

  const sendEmail = useCallback(async (emailData: EmailData): Promise<EmailResponse> => {
    setState(prev => ({ ...prev, isLoading: true, isSuccess: false, isError: false, error: null }));

    try {
      const response = await resendService.sendEmail(emailData);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
          messageId: response.messageId || null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isError: true,
          error: response.error || 'Error sending email',
        }));
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: errorMessage,
      }));
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  const sendWelcomeEmail = useCallback(async (user: any, company: any): Promise<EmailResponse> => {
    return sendEmail({
      to: user.email,
      subject: `¡Bienvenido a ${company.name}!`,
      react: null, // Se maneja internamente en el servicio
    });
  }, [sendEmail]);

  const sendPasswordResetEmail = useCallback(async (user: any, resetToken: string): Promise<EmailResponse> => {
    return sendEmail({
      to: user.email,
      subject: 'Restablecer Contraseña - VThink',
      react: null, // Se maneja internamente en el servicio
    });
  }, [sendEmail]);

  const sendNotificationEmail = useCallback(async (user: any, notification: any): Promise<EmailResponse> => {
    return sendEmail({
      to: user.email,
      subject: notification.subject,
      react: null, // Se maneja internamente en el servicio
    });
  }, [sendEmail]);

  const sendMigrationCompletedEmail = useCallback(async (user: any, migrationData: any): Promise<EmailResponse> => {
    return sendEmail({
      to: user.email,
      subject: 'Migración Completada - VThink',
      react: null, // Se maneja internamente en el servicio
    });
  }, [sendEmail]);

  const sendSEOReportEmail = useCallback(async (user: any, seoReport: any): Promise<EmailResponse> => {
    return sendEmail({
      to: user.email,
      subject: 'Reporte SEO Premium - VThink',
      react: null, // Se maneja internamente en el servicio
    });
  }, [sendEmail]);

  const sendTranslationCompletedEmail = useCallback(async (user: any, translationData: any): Promise<EmailResponse> => {
    return sendEmail({
      to: user.email,
      subject: 'Traducción Completada - VThink',
      react: null, // Se maneja internamente en el servicio
    });
  }, [sendEmail]);

  const sendBulkEmail = useCallback(async (users: any[], template: any, data: any): Promise<EmailResponse[]> => {
    setState(prev => ({ ...prev, isLoading: true, isSuccess: false, isError: false, error: null }));

    try {
      const responses = await resendService.sendBulkEmail(users, template, data);
      
      const successCount = responses.filter(r => r.success).length;
      const errorCount = responses.filter(r => !r.success).length;

      setState(prev => ({
        ...prev,
        isLoading: false,
        isSuccess: successCount > 0,
        isError: errorCount > 0,
        error: errorCount > 0 ? `${errorCount} emails failed` : null,
      }));

      return responses;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: errorMessage,
      }));
      
      return [];
    }
  }, []);

  return {
    sendEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendNotificationEmail,
    sendMigrationCompletedEmail,
    sendSEOReportEmail,
    sendTranslationCompletedEmail,
    sendBulkEmail,
    resetState,
    state,
  };
}; 