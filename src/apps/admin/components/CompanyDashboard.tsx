/**
 * CompanyDashboard - Dashboard para usuarios empresariales
 * 
 * Dashboard diseñado para usuarios de empresa con métricas
 * específicas de negocio, analytics y gestión de equipos.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/hooks/useAuth';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Calendar,
  FileText,
  Settings,
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  MessageSquare
} from 'lucide-react';

// Bundui UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/bundui-premium/components/ui/tabs';
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/bundui-premium/components/ui/avatar';

// Debug Panel
import SystemDebugPanel from './SystemDebugPanel';

interface CompanyMetrics {
  totalEmployees: number;
  activeProjects: number;
  monthlyRevenue: number;
  customerSatisfaction: number;
  tasksCompleted: number;
  pendingTasks: number;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'project' | 'task' | 'meeting' | 'report';
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  productivity: number;
}

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showDebug, setShowDebug] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock data - En producción vendría de API/Supabase
  const [metrics, setMetrics] = useState<CompanyMetrics>({
    totalEmployees: 156,
    activeProjects: 23,
    monthlyRevenue: 284750,
    customerSatisfaction: 94,
    tasksCompleted: 847,
    pendingTasks: 123
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: 'act-001',
      user: 'Ana García',
      action: 'Completó el proyecto "Marketing Q2"',
      timestamp: '2025-07-07 15:30',
      type: 'project'
    },
    {
      id: 'act-002',
      user: 'Carlos López',
      action: 'Creó nueva tarea en "Desarrollo Web"',
      timestamp: '2025-07-07 14:15',
      type: 'task'
    },
    {
      id: 'act-003',
      user: 'María Rodriguez',
      action: 'Inició reunión "Planning Semanal"',
      timestamp: '2025-07-07 13:00',
      type: 'meeting'
    },
    {
      id: 'act-004',
      user: 'David Silva',
      action: 'Subió reporte "Analytics Q2"',
      timestamp: '2025-07-07 11:45',
      type: 'report'
    },
    {
      id: 'act-005',
      user: 'Laura Martinez',
      action: 'Actualizó estado del proyecto "App Mobile"',
      timestamp: '2025-07-07 10:20',
      type: 'project'
    }
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'tm-001',
      name: 'Ana García',
      role: 'Project Manager',
      status: 'online',
      productivity: 95
    },
    {
      id: 'tm-002',
      name: 'Carlos López',
      role: 'Frontend Developer',
      status: 'online',
      productivity: 87
    },
    {
      id: 'tm-003',
      name: 'María Rodriguez',
      role: 'UX Designer',
      status: 'away',
      productivity: 92
    },
    {
      id: 'tm-004',
      name: 'David Silva',
      role: 'Data Analyst',
      status: 'online',
      productivity: 88
    },
    {
      id: 'tm-005',
      name: 'Laura Martinez',
      role: 'Product Owner',
      status: 'offline',
      productivity: 91
    },
    {
      id: 'tm-006',
      name: 'Roberto Chen',
      role: 'Backend Developer',
      status: 'online',
      productivity: 89
    }
  ]);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case 'task': return <FileText className="h-4 w-4 text-green-600" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'report': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard Empresarial
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Bienvenido, {user?.profile?.name || 'Usuario'} | {user?.profile?.company || 'Empresa'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                3
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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Métricas principales */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Empleados Total</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% desde el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.activeProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    +3 nuevos esta semana
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
                    ${metrics.monthlyRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +18% vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfacción Cliente</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.customerSatisfaction}%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% mejora continua
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contenido principal */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Actividad reciente */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>
                    Últimas acciones del equipo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.user}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.action}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.timestamp}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Estado del equipo */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Equipo</CardTitle>
                  <CardDescription>
                    Miembros activos y productividad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {member.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-green-600">
                          {member.productivity}%
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Progreso de tareas */}
            <Card>
              <CardHeader>
                <CardTitle>Progreso de Tareas</CardTitle>
                <CardDescription>
                  Estado actual de las tareas del mes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tareas Completadas</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics.tasksCompleted} / {metrics.tasksCompleted + metrics.pendingTasks}
                    </span>
                  </div>
                  <Progress 
                    value={(metrics.tasksCompleted / (metrics.tasksCompleted + metrics.pendingTasks)) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>87% completado</span>
                    <span>{metrics.pendingTasks} pendientes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Proyectos</CardTitle>
                    <CardDescription>
                      Administra y monitorea todos los proyectos activos
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Proyecto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Gestión de Proyectos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Vista detallada de proyectos en desarrollo...
                  </p>
                  <Button variant="outline">
                    Ver Todos los Proyectos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Equipo</CardTitle>
                    <CardDescription>
                      Administra miembros del equipo y asigna roles
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Invitar Miembro
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Gestión de Equipo
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Vista detallada del equipo y permisos...
                  </p>
                  <Button variant="outline">
                    Ver Directorio Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Empresarial</CardTitle>
                <CardDescription>
                  Métricas avanzadas y reportes de rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Analytics Avanzado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Gráficos, reportes y insights de negocio...
                  </p>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Reporte
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

export default CompanyDashboard;
