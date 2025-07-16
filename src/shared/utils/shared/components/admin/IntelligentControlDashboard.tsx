/**
 * Dashboard de Control Inteligente
 * Monitoreo completo de la orquestación de la plataforma
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Progress } from '@/shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Database,
  Shield,
  Brain,
  MessageSquare,
  CreditCard,
  Settings,
  BarChart3,
  Clock,
  Server,
  Globe,
  Cpu,
  MemoryStick,
  HardDrive,
  Network
} from 'lucide-react';
import { healthMonitor } from '@/services/monitoring/HealthMonitor';
import { metricsCollector } from '@/services/analytics/MetricsCollector';
import { logger } from '@/services/logging/LoggingService';
import { LogCategory, LogLevel } from '@/services/logging/LoggingService';

interface SystemOverview {
  overallStatus: string;
  healthyServices: number;
  totalServices: number;
  criticalIssues: number;
  uptime: number;
  activeUsers: number;
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
}

interface ServiceStatus {
  service: string;
  status: string;
  responseTime: number;
  uptime: number;
  lastCheck: Date;
}

interface AIMetrics {
  totalOperations: number;
  averageResponseTime: number;
  totalTokens: number;
  totalCost: number;
  successRate: number;
  providerBreakdown: Record<string, any>;
}

export const IntelligentControlDashboard: React.FC = () => {
  const [systemOverview, setSystemOverview] = useState<SystemOverview | null>(null);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [aiMetrics, setAiMetrics] = useState<AIMetrics | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 30000); // 30 segundos
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar datos del sistema
      const health = healthMonitor.getOverallHealth();
      const systemMetrics = metricsCollector.getSystemMetrics();
      const aiMetricsData = metricsCollector.getAIMetrics();
      const servicesHealth = healthMonitor.getAllServicesHealth();

      setSystemOverview({
        overallStatus: health.status,
        healthyServices: health.healthyServices,
        totalServices: health.totalServices,
        criticalIssues: health.criticalIssues,
        uptime: 99.9, // Calcular real
        activeUsers: systemMetrics.activeUsers,
        totalRequests: systemMetrics.totalRequests,
        averageResponseTime: systemMetrics.averageResponseTime,
        errorRate: systemMetrics.errorRate
      });

      setServices(servicesHealth.map(s => ({
        service: s.service,
        status: s.status,
        responseTime: s.responseTime,
        uptime: s.uptime,
        lastCheck: s.lastCheck
      })));

      setAiMetrics(aiMetricsData);

    } catch (error) {
      // TODO: log Error loading dashboard data en desarrollo
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'auth':
        return <Shield className="h-4 w-4" />;
      case 'payments':
        return <CreditCard className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'ai_providers':
        return <Brain className="h-4 w-4" />;
      case 'api_gateway':
        return <Globe className="h-4 w-4" />;
      case 'crm':
        return <Users className="h-4 w-4" />;
      case 'help_desk':
        return <MessageSquare className="h-4 w-4" />;
      case 'recruiting':
        return <Users className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Control Inteligente</h1>
          <p className="text-gray-600">Monitoreo completo de la orquestación de la plataforma</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={loadDashboardData} 
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Clock className="h-4 w-4 mr-2" />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {systemOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado General</CardTitle>
              {getStatusIcon(systemOverview.overallStatus)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemOverview.healthyServices}/{systemOverview.totalServices}
              </div>
              <p className="text-xs text-muted-foreground">
                Servicios saludables
              </p>
              {systemOverview.criticalIssues > 0 && (
                <Badge variant="destructive" className="mt-2">
                  {systemOverview.criticalIssues} críticos
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemOverview.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Sesiones activas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests/min</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(systemOverview.totalRequests / 60)}
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio por minuto
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Respuesta</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(systemOverview.averageResponseTime)}ms
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio global
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="ai">Inteligencia Artificial</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card key={service.service}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {getServiceIcon(service.service)}
                    {service.service.replace('_', ' ').toUpperCase()}
                  </CardTitle>
                  {getStatusIcon(service.status)}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Estado:</span>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status === 'healthy' ? 'Saludable' : 
                         service.status === 'degraded' ? 'Degradado' : 'No Saludable'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Respuesta:</span>
                      <span className={service.responseTime > 1000 ? 'text-red-600' : 'text-green-600'}>
                        {service.responseTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Uptime:</span>
                      <span>{service.uptime.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Último check:</span>
                      <span>{service.lastCheck.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Tab */}
        <TabsContent value="ai" className="space-y-4">
          {aiMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Operaciones IA</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiMetrics.totalOperations}</div>
                  <p className="text-xs text-muted-foreground">
                    Última hora
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tiempo Respuesta IA</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(aiMetrics.averageResponseTime)}ms
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Promedio
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tokens Usados</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {aiMetrics.totalTokens.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Última hora
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Costo IA</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${aiMetrics.totalCost.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Última hora
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Provider Breakdown */}
          {aiMetrics && (
            <Card>
              <CardHeader>
                <CardTitle>Desglose por Proveedor de IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(aiMetrics.providerBreakdown).map(([provider, data]: [string, any]) => (
                    <div key={provider} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-4">
                        <div className="font-medium">{provider.toUpperCase()}</div>
                        <div className="text-sm text-gray-600">
                          {data.operations} operaciones
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-gray-600">Respuesta:</span>
                          <span className="ml-1 font-medium">{Math.round(data.averageResponseTime)}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tokens:</span>
                          <span className="ml-1 font-medium">{data.totalTokens.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Costo:</span>
                          <span className="ml-1 font-medium">${data.totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="flex items-center gap-2"><Cpu className="h-4 w-4 text-muted-foreground" /> CPU Usage</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="flex items-center gap-2"><MemoryStick className="h-4 w-4 text-muted-foreground" /> Memory Usage</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="w-full" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-muted-foreground" /> Disk Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="w-full" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="flex items-center gap-2"><Network className="h-4 w-4 text-muted-foreground" /> Network</span>
                    <span>30%</span>
                  </div>
                  <Progress value={30} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Errores y Alertas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Tasa de error elevada en servicio de pagos (5.2%)
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Latencia alta en proveedor de IA Knotie (2.5s)
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Implementar visualización de logs en tiempo real
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Servicio de pagos no disponible - Migración automática activada
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Alto uso de CPU en servidor principal (85%)
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 