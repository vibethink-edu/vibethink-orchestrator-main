/**
 * SuperAdminDashboard - Dashboard para superadministradores de la plataforma SaaS
 * 
 * Dashboard especializado para la gestión completa de la plataforma:
 * - Gestión de tenants/empresas
 * - Monitoreo de sistema y performance
 * - Analytics globales de la plataforma
 * - Gestión de usuarios y roles
 * - Configuración de infraestructura
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/hooks/useAuth';
import { 
  Server, 
  Building2, 
  Users, 
  Shield, 
  Database,
  Activity,
  AlertTriangle,
  DollarSign,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  Settings,
  UserCheck,
  Ban,
  Key,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical
} from 'lucide-react';

// Bundui UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/bundui-premium/components/ui/tabs';
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/bundui-premium/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/bundui-premium/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/bundui-premium/components/ui/alert';

// Debug Panel
import SystemDebugPanel from './SystemDebugPanel';

interface PlatformMetrics {
  totalTenants: number;
  activeUsers: number;
  systemUptime: number;
  monthlyRevenue: number;
  avgResponseTime: number;
  errorRate: number;
  storageUsed: number;
  bandwidthUsed: number;
}

interface TenantInfo {
  id: string;
  name: string;
  plan: 'basic' | 'premium' | 'enterprise';
  users: number;
  status: 'active' | 'suspended' | 'trial';
  lastActivity: string;
  monthlyRevenue: number;
}

interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

interface SystemResource {
  name: string;
  usage: number;
  total: number;
  status: 'healthy' | 'warning' | 'critical';
}

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showDebug, setShowDebug] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - En producción vendría de API/Supabase
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics>({
    totalTenants: 47,
    activeUsers: 1284,
    systemUptime: 99.97,
    monthlyRevenue: 847650,
    avgResponseTime: 145,
    errorRate: 0.02,
    storageUsed: 67.8,
    bandwidthUsed: 45.2
  });

  const [tenants, setTenants] = useState<TenantInfo[]>([
    {
      id: '1',
      name: 'TechCorp Solutions',
      plan: 'enterprise',
      users: 156,
      status: 'active',
      lastActivity: '2 min ago',
      monthlyRevenue: 25000
    },
    {
      id: '2',
      name: 'StartupXYZ',
      plan: 'premium',
      users: 23,
      status: 'trial',
      lastActivity: '1h ago',
      monthlyRevenue: 1500
    },
    {
      id: '3',
      name: 'Global Industries',
      plan: 'enterprise',
      users: 342,
      status: 'active',
      lastActivity: '5 min ago',
      monthlyRevenue: 45000
    },
    {
      id: '4',
      name: 'Creative Agency',
      plan: 'basic',
      users: 12,
      status: 'suspended',
      lastActivity: '2 days ago',
      monthlyRevenue: 500
    }
  ]);

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Alto uso de CPU en servidor DB-02',
      description: 'El servidor de base de datos está utilizando 87% de CPU durante los últimos 30 minutos.',
      timestamp: '15 min ago',
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Mantenimiento programado completado',
      description: 'El mantenimiento del cluster de Redis se completó exitosamente.',
      timestamp: '2h ago',
      resolved: true
    },
    {
      id: '3',
      type: 'critical',
      title: 'Falla en backup automático',
      description: 'El backup programado para tenant TechCorp falló. Requiere atención inmediata.',
      timestamp: '3h ago',
      resolved: false
    }
  ]);

  const [systemResources, setSystemResources] = useState<SystemResource[]>([
    { name: 'CPU', usage: 67, total: 100, status: 'healthy' },
    { name: 'Memory', usage: 82, total: 100, status: 'warning' },
    { name: 'Storage', usage: 45, total: 100, status: 'healthy' },
    { name: 'Network', usage: 23, total: 100, status: 'healthy' }
  ]);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular refresh de datos
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'premium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'basic': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'trial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getResourceStatus = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Super Admin Panel
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Gestión completa de la plataforma SaaS | {user?.profile?.name || 'Super Admin'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tenants, usuarios..."
                  className="pl-10 w-64"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDebug(!showDebug)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Alertas críticas */}
            {systemAlerts.filter(alert => !alert.resolved && alert.type === 'critical').length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Alertas Críticas Activas</AlertTitle>
                <AlertDescription>
                  Hay {systemAlerts.filter(alert => !alert.resolved && alert.type === 'critical').length} alertas críticas que requieren atención inmediata.
                </AlertDescription>
              </Alert>
            )}

            {/* Métricas principales */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformMetrics.totalTenants}</div>
                  <p className="text-xs text-muted-foreground">
                    +5 nuevos este mes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformMetrics.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uptime del Sistema</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformMetrics.systemUptime}%</div>
                  <p className="text-xs text-muted-foreground">
                    {platformMetrics.avgResponseTime}ms respuesta promedio
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${platformMetrics.monthlyRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +15.3% crecimiento mensual
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recursos del sistema */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recursos del Sistema</CardTitle>
                  <CardDescription>
                    Estado en tiempo real de la infraestructura
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemResources.map((resource) => (
                    <div key={resource.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{resource.name}</span>
                        <span className={`text-sm ${getResourceStatus(resource.status)}`}>
                          {resource.usage}%
                        </span>
                      </div>
                      <Progress 
                        value={resource.usage} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Alertas del sistema */}
              <Card>
                <CardHeader>
                  <CardTitle>Alertas del Sistema</CardTitle>
                  <CardDescription>
                    Últimas alertas y notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemAlerts.slice(0, 4).map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {alert.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {alert.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.timestamp}
                        </p>
                      </div>
                      {alert.resolved && (
                        <Badge variant="secondary" className="text-xs">
                          Resuelto
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tenants Tab */}
          <TabsContent value="tenants" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Tenants</CardTitle>
                    <CardDescription>
                      Administra todas las empresas de la plataforma
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Usuarios</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Última Actividad</TableHead>
                      <TableHead>Ingresos</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">{tenant.name}</TableCell>
                        <TableCell>
                          <Badge className={getPlanColor(tenant.plan)}>
                            {tenant.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>{tenant.users}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(tenant.status)}>
                            {tenant.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {tenant.lastActivity}
                        </TableCell>
                        <TableCell>${tenant.monthlyRevenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Performance</CardTitle>
                  <CardDescription>
                    Estadísticas de rendimiento del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Cpu className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">67%</p>
                      <p className="text-sm text-gray-600">CPU Promedio</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <HardDrive className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">45.2TB</p>
                      <p className="text-sm text-gray-600">Storage Usado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado de Servicios</CardTitle>
                  <CardDescription>
                    Monitoreo de microservicios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'API Gateway', status: 'healthy' },
                    { name: 'Auth Service', status: 'healthy' },
                    { name: 'Database Cluster', status: 'warning' },
                    { name: 'File Storage', status: 'healthy' },
                    { name: 'Email Service', status: 'healthy' }
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{service.name}</span>
                      <Badge className={getStatusColor(service.status === 'healthy' ? 'active' : 'trial')}>
                        {service.status === 'healthy' ? 'Online' : 'Warning'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión Global de Usuarios</CardTitle>
                <CardDescription>
                  Administra usuarios a través de todos los tenants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Gestión de Usuarios
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Vista global de usuarios, roles y permisos...
                  </p>
                  <Button variant="outline">
                    Ver Todos los Usuarios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Plataforma</CardTitle>
                <CardDescription>
                  Configuraciones globales y ajustes del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Configuraciones Globales
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Ajustes de infraestructura, límites y políticas...
                  </p>
                  <Button variant="outline">
                    Acceder a Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed bottom-4 right-4 z-50">
          <SystemDebugPanel />
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
