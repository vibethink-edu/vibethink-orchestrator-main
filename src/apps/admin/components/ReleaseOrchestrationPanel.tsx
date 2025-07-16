/**
 * Panel de Orquestación de Liberaciones - Super Admin
 * Vista 365° inspirada en Mercado Libre y HubSpot
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { Slider } from '@/shared/components/ui/slider';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Separator } from '@/shared/components/ui/separator';
import { 
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  GitBranch,
  GitBranchPlus,
  GitBranchMinus,
  GitBranchX,
  GitBranchCheck,
  Activity
} from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';
import { FeatureFlag, SystemOverview, Alert as SystemAlert } from '@/types/release-orchestration';

interface ReleaseOrchestrationPanelProps {
  className?: string;
}

export const ReleaseOrchestrationPanel: React.FC<ReleaseOrchestrationPanelProps> = ({ 
  className 
}) => {
  const { user, hasPermission } = useAuth();
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);

  // Verificar permisos de super admin
  if (!hasPermission('SUPER_ADMIN')) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Acceso denegado. Se requieren permisos de Super Admin.
        </AlertDescription>
      </Alert>
    );
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Cargar datos del dashboard
      const [overviewData, flagsData, alertsData] = await Promise.all([
        fetchSystemOverview(),
        fetchFeatureFlags(),
        fetchSystemAlerts()
      ]);

      setOverview(overviewData);
      setFeatureFlags(flagsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (flagId: string, enabled: boolean) => {
    try {
      await updateFeatureFlag(flagId, { enabled });
      await loadDashboardData(); // Recargar datos
    } catch (error) {
      console.error('Error toggling feature:', error);
    }
  };

  const handleUpdateRollout = async (flagId: string, percentage: number) => {
    try {
      await updateFeatureFlag(flagId, { rollout_percentage: percentage });
      await loadDashboardData(); // Recargar datos
    } catch (error) {
      console.error('Error updating rollout:', error);
    }
  };

  const handleEmergencyRollback = async (flagId: string) => {
    try {
      await emergencyRollback(flagId);
      await loadDashboardData(); // Recargar datos
    } catch (error) {
      console.error('Error performing emergency rollback:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Features Activas</p>
                <p className="text-2xl font-bold">{overview?.active_features || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold">{overview?.pending_releases || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas</p>
                <p className="text-2xl font-bold">{overview?.rollback_alerts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Salud del Sistema</p>
                <Badge 
                  variant={overview?.system_health === 'green' ? 'default' : 
                          overview?.system_health === 'yellow' ? 'secondary' : 'destructive'}
                >
                  {overview?.system_health?.toUpperCase() || 'UNKNOWN'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Críticas */}
      {alerts.filter(alert => alert.severity === 'critical').length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Alertas Críticas:</strong>
            <ul className="mt-2 space-y-1">
              {alerts
                .filter(alert => alert.severity === 'critical')
                .map(alert => (
                  <li key={alert.id}>• {alert.message}</li>
                ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Gestión de Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Gestión de Feature Flags</span>
            <Button size="sm" onClick={() => setSelectedFlag({} as FeatureFlag)}>
              + Nueva Feature
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featureFlags.map(flag => (
              <FeatureFlagCard
                key={flag.id}
                flag={flag}
                onToggle={(enabled) => handleToggleFeature(flag.id, enabled)}
                onUpdateRollout={(percentage) => handleUpdateRollout(flag.id, percentage)}
                onRollback={() => handleEmergencyRollback(flag.id)}
                onEdit={() => setSelectedFlag(flag)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Adopción de Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featureFlags.slice(0, 5).map(flag => (
                <div key={flag.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{flag.name}</span>
                    <span>{flag.metrics?.adoption_rate || 0}%</span>
                  </div>
                  <Progress value={flag.metrics?.adoption_rate || 0} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Métricas del Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Empresas</span>
                <span className="font-semibold">{overview?.total_companies || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Usuarios</span>
                <span className="font-semibold">{overview?.total_users || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime</span>
                <span className="font-semibold">{overview?.uptime_percentage || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente para mostrar una feature flag individual
interface FeatureFlagCardProps {
  flag: FeatureFlag;
  onToggle: (enabled: boolean) => void;
  onUpdateRollout: (percentage: number) => void;
  onRollback: () => void;
  onEdit: () => void;
}

const FeatureFlagCard: React.FC<FeatureFlagCardProps> = ({
  flag,
  onToggle,
  onUpdateRollout,
  onRollback,
  onEdit
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'rolled_back': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{flag.name}</h3>
              <Badge className={getStatusColor(flag.status)}>
                {flag.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
            
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={flag.enabled}
                  onCheckedChange={onToggle}
                />
                <span className="text-sm">{flag.enabled ? 'Habilitada' : 'Deshabilitada'}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Rollout:</span>
                <span className="font-semibold">{flag.rollout_percentage}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Ocultar' : 'Detalles'}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
            >
              Editar
            </Button>
            
            {flag.status === 'active' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onRollback}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Uso:</span> {flag.metrics?.usage_count || 0}
              </div>
              <div>
                <span className="font-medium">Error Rate:</span> {flag.metrics?.error_rate || 0}%
              </div>
              <div>
                <span className="font-medium">Adopción:</span> {flag.metrics?.adoption_rate || 0}%
              </div>
              <div>
                <span className="font-medium">Feedback:</span> {flag.metrics?.user_feedback_score || 0}/5
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Rollout Percentage</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={flag.rollout_percentage}
                  onChange={(e) => onUpdateRollout(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm w-12">{flag.rollout_percentage}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Funciones de API (mock por ahora)
async function fetchSystemOverview(): Promise<SystemOverview> {
  // TODO: Implementar llamada real a la API
  return {
    active_features: 12,
    pending_releases: 3,
    rollback_alerts: 1,
    system_health: 'green',
    total_companies: 156,
    total_users: 1247,
    uptime_percentage: 99.9
  };
}

async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
  // TODO: Implementar llamada real a la API
  return [
    {
      id: '1',
      name: 'crm_advanced_features',
      description: 'Funcionalidades avanzadas del CRM',
      enabled: true,
      rollout_percentage: 75,
      target_plans: ['PREMIUM', 'ENTERPRISE'],
      target_roles: ['ADMIN', 'OWNER'],
      target_companies: [],
      target_regions: ['CO', 'MX', 'AR'],
      start_date: new Date('2025-01-01'),
      metrics: {
        usage_count: 1234,
        error_rate: 0.2,
        performance_impact: 0.1,
        adoption_rate: 67,
        user_feedback_score: 4.2,
        last_updated: new Date()
      },
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'system',
      status: 'active'
    }
  ];
}

async function fetchSystemAlerts(): Promise<SystemAlert[]> {
  // TODO: Implementar llamada real a la API
  return [
    {
      id: '1',
      type: 'error_rate',
      severity: 'critical',
      title: 'Error Rate Spike',
      message: 'Feature flag crm_advanced_features showing 5% error rate',
      feature_flag_id: '1',
      affected_companies: ['company-1', 'company-2'],
      created_at: new Date(),
      metadata: {}
    }
  ];
}

async function updateFeatureFlag(flagId: string, updates: Partial<FeatureFlag>): Promise<void> {
  // TODO: Implementar llamada real a la API
  console.log('Updating feature flag:', flagId, updates);
}

async function emergencyRollback(flagId: string): Promise<void> {
  // TODO: Implementar llamada real a la API
  console.log('Emergency rollback for feature flag:', flagId);
} 