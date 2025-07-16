import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Settings,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { 
  notificationService, 
  Notification, 
  NotificationType, 
  NotificationPriority 
} from '../services/notificationService';

interface NotificationCenterProps {
  maxNotifications?: number;
  showSettings?: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  maxNotifications = 10,
  showSettings = true 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Suscribirse a nuevas notificaciones
    const unsubscribe = notificationService.subscribe((notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, maxNotifications));
      setUnreadCount(prev => prev + 1);
    });

    // Cargar notificaciones existentes
    setNotifications(notificationService.getNotifications().slice(0, maxNotifications));

    return unsubscribe;
  }, [maxNotifications]);

  // Función para obtener el icono según el tipo de notificación
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SECURITY_CRITICAL:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case NotificationType.MAJOR_UPDATE:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case NotificationType.UPGRADE_SUCCESS:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case NotificationType.UPGRADE_FAILURE:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  // Función para obtener el color del badge según la prioridad
  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.IMMEDIATE:
        return 'destructive';
      case NotificationPriority.HIGH:
        return 'default';
      case NotificationPriority.MEDIUM:
        return 'secondary';
      case NotificationPriority.LOW:
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Función para formatear la fecha
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  // Función para manejar acciones de notificación
  const handleNotificationAction = (notification: Notification, action: string) => {
    console.log('🔧 Acción de notificación:', action, notification);
    
    // Aquí se manejarían las acciones específicas
    switch (action) {
      case 'view_details':
        // Navegar a detalles
        break;
      case 'upgrade':
        // Ejecutar upgrade
        break;
      case 'retry':
        // Reintentar operación
        break;
      default:
        // Acción personalizada
        break;
    }
  };

  // Función para limpiar notificaciones
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Función para marcar como leídas
  const markAsRead = () => {
    setUnreadCount(0);
  };

  // Función para refrescar notificaciones
  const refreshNotifications = () => {
    setNotifications(notificationService.getNotifications().slice(0, maxNotifications));
  };

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 z-50">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Notificaciones</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshNotifications}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAsRead}
                  >
                    Marcar leídas
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearNotifications}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                {notifications.length > 0 ? (
                  <div className="space-y-1 p-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getPriorityColor(notification.priority)} size="sm">
                                {notification.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex items-center space-x-2">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleNotificationAction(notification, action.action)}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <Bell className="h-8 w-8 mb-2" />
                    <p className="text-sm">No hay notificaciones</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Configuración de notificaciones */}
      {showSettings && isOpen && (
        <div className="absolute right-0 top-96 w-96 z-40 mt-2">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <CardTitle className="text-sm">Configuración</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Notificaciones por email</span>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notificaciones por Slack</span>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sonidos de notificación</span>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 