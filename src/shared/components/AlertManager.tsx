import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Settings,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Clock,
  User
} from 'lucide-react';
import { 
  alertService, 
  Alert, 
  AlertType, 
  AlertPriority, 
  AlertChannel 
} from '@/shared/services/alertService';

interface AlertManagerProps {
  showSettings?: boolean;
  maxAlerts?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const AlertManager: React.FC<AlertManagerProps> = ({ 
  showSettings = true,
  maxAlerts = 50,
  autoRefresh = true,
  refreshInterval = 30000 // 30 segundos
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState(alertService.getAlertStats());
  const [filters, setFilters] = useState({
    type: undefined as AlertType | undefined,
    priority: undefined as AlertPriority | undefined,
    channel: undefined as AlertChannel | undefined,
    acknowledged: undefined as boolean | undefined
  });
  const [config, setConfig] = useState(alertService.getConfig());

  useEffect(() => {
    // Cargar alertas iniciales
    loadAlerts();

    // Suscribirse a nuevas alertas
    const unsubscribe = alertService.subscribe(AlertChannel.DASHBOARD, (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, maxAlerts));
      setStats(alertService.getAlertStats());
    });

    // Auto-refresh si está habilitado
    let intervalId: NodeJS.Timeout;
    if (autoRefresh) {
      intervalId = setInterval(loadAlerts, refreshInterval);
    }

    return () => {
      unsubscribe();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [maxAlerts, autoRefresh, refreshInterval]);

  const loadAlerts = () => {
    const filteredAlerts = alertService.getAlerts(filters);
    setAlerts(filteredAlerts.slice(0, maxAlerts));
    setStats(alertService.getAlertStats());
  };

  const handleAcknowledge = (alertId: string) => {
    alertService.acknowledgeAlert(alertId, 'current-user');
    loadAlerts();
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const filteredAlerts = alertService.getAlerts(newFilters);
    setAlerts(filteredAlerts.slice(0, maxAlerts));
  };

  const getPriorityColor = (priority: AlertPriority) => {
    switch (priority) {
      case AlertPriority.CRITICAL: return 'destructive';
      case AlertPriority.HIGH: return 'default';
      case AlertPriority.MEDIUM: return 'secondary';
      case AlertPriority.LOW: return 'outline';
      case AlertPriority.INFO: return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.SECURITY_SCAN:
      case AlertType.VULNERABILITY_DETECTED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case AlertType.UPGRADE_MONITOR:
      case AlertType.DEPLOYMENT_STATUS:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case AlertType.SYSTEM_HEALTH:
      case AlertType.USER_ACTIVITY:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alertas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.unacknowledged} sin reconocer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.byPriority.critical}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Altas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.byPriority.high}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención pronto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reconocidas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.acknowledged}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.acknowledged / stats.total) * 100)}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
            <Button variant="outline" size="sm" onClick={loadAlerts}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              >
                <option value="">Todos los tipos</option>
                {Object.values(AlertType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Prioridad</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
              >
                <option value="">Todas las prioridades</option>
                {Object.values(AlertPriority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Canal</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.channel || ''}
                onChange={(e) => handleFilterChange('channel', e.target.value || undefined)}
              >
                <option value="">Todos los canales</option>
                {Object.values(AlertChannel).map(channel => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Estado</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.acknowledged?.toString() || ''}
                onChange={(e) => handleFilterChange('acknowledged', e.target.value === '' ? undefined : e.target.value === 'true')}
              >
                <option value="">Todos los estados</option>
                <option value="false">Sin reconocer</option>
                <option value="true">Reconocidas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {alerts.length > 0 ? (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                      alert.acknowledged 
                        ? 'bg-gray-50 opacity-75' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {alert.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(alert.priority)} size="sm">
                            {alert.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" size="sm">
                            {alert.type}
                          </Badge>
                          {alert.channels.map(channel => (
                            <Badge key={channel} variant="outline" size="sm">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {alert.acknowledged ? (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <User className="h-3 w-3" />
                              <span>{alert.acknowledgedBy}</span>
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(alert.acknowledgedAt!)}</span>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Reconocer
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {alert.actions && alert.actions.length > 0 && (
                        <div className="flex items-center space-x-2 mt-2">
                          {alert.actions.map((action) => (
                            <Button
                              key={action.id}
                              variant="outline"
                              size="sm"
                              onClick={() => action.callback?.()}
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
                <p className="text-sm">No hay alertas que coincidan con los filtros</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Configuración */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              Configuración del Sistema de Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Canales Habilitados</h4>
                <div className="space-y-2">
                  {Object.entries(config.channels).map(([channel, channelConfig]) => (
                    <div key={channel} className="flex items-center justify-between">
                      <span className="text-sm">{channel}</span>
                      <Badge variant={channelConfig.enabled ? 'default' : 'outline'}>
                        {channelConfig.enabled ? 'Habilitado' : 'Deshabilitado'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Configuración Global</h4>
                <div className="space-y-2 text-sm">
                  <div>Retención: {config.retentionDays} días</div>
                  <div>Máximo por canal: {config.maxAlertsPerChannel}</div>
                  <div>Auto-refresh: {autoRefresh ? 'Habilitado' : 'Deshabilitado'}</div>
                  {autoRefresh && (
                    <div>Intervalo: {refreshInterval / 1000}s</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlertManager; 