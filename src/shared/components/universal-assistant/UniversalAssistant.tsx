import React, { useState, useCallback } from 'react';
import { useAssistant } from './hooks/useAssistant';
import { AssistantChat } from './AssistantChat';
import { AssistantProfile } from './AssistantProfile';
import { QuickActions } from './QuickActions';
import type { UniversalAssistantProps } from './types/assistant.types';

/**
 * Universal Assistant Component - VThink 1.0
 * 
 * Agente de IA que se adapta dinámicamente al contexto de la entidad y los módulos
 * disponibles, proporcionando soporte inteligente y personalizado.
 * 
 * @param entityId - ID de la entidad (opcional)
 * @param entityType - Tipo de entidad (opcional)
 * @param className - Clases CSS adicionales
 * @param position - Posición del asistente (sidebar, floating, fullscreen)
 * @param showProfile - Mostrar perfil del asistente
 */
export const UniversalAssistant: React.FC<UniversalAssistantProps> = ({
  entityId,
  entityType,
  className = '',
  position = 'floating',
  showProfile = true
}) => {
  const {
    messages,
    sendMessage,
    isTyping,
    profile,
    context,
    clearChat
  } = useAssistant(entityId, entityType);

  const [isOpen, setIsOpen] = useState(false);

  // Manejar acción rápida
  const handleQuickAction = useCallback((action: string) => {
    sendMessage(`Acción: ${action}`);
  }, [sendMessage]);

  // Manejar cierre del asistente
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Manejar apertura del asistente
  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className={`universal-assistant ${position} ${className}`}>
      {/* Botón flotante para posición floating */}
      {position === 'floating' && (
        <button
          className="assistant-toggle-btn"
          onClick={handleOpen}
          aria-label="Abrir asistente universal"
          title="Asistente Universal"
        >
          <div className="assistant-toggle-icon">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="assistant-toggle-badge">
            <span className="assistant-status-indicator" />
          </div>
        </button>
      )}

      {/* Panel del asistente */}
      {(isOpen || position !== 'floating') && (
        <div className="assistant-panel">
          {/* Header del asistente */}
          <div className="assistant-header">
            <div className="assistant-header-content">
              {showProfile && (
                <AssistantProfile 
                  profile={profile} 
                  context={context} 
                />
              )}
              
              <div className="assistant-header-actions">
                <button
                  className="assistant-clear-btn"
                  onClick={clearChat}
                  title="Limpiar conversación"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                
                {position === 'floating' && (
                  <button
                    className="assistant-close-btn"
                    onClick={handleClose}
                    title="Cerrar asistente"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Chat del asistente */}
          <div className="assistant-chat-container">
            <AssistantChat
              messages={messages}
              onSendMessage={sendMessage}
              isTyping={isTyping}
              context={context}
            />
          </div>

          {/* Acciones rápidas */}
          <div className="assistant-actions">
            <QuickActions 
              context={context} 
              onAction={handleQuickAction} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalAssistant; 
