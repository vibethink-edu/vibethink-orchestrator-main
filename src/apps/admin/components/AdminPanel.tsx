
import React from 'react';
import { Users, Shield, Gauge, Activity, TrendingUp, Clock, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isSuperAdmin } = useSuperAdmin();

  const companyName = user?.company?.name || 'Tu Empresa';
  const isVibeThinkCompany = user?.company?.slug === 'VibeThink-platform';

  const stats = [
    {
      title: 'Usuarios de la Empresa',
      value: '127',
      change: '+12%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Módulos Activos',
      value: '6',
      change: '+2',
      icon: Activity,
      trend: 'up'
    },
    {
      title: 'Uso Mensual de IA',
      value: '89%',
      change: '+5%',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: 'Tiempo Promedio',
      value: '2.4h',
      change: '-0.2h',
      icon: Clock,
      trend: 'down'
    }
  ];

  const adminActions = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios de tu empresa',
      icon: Users,
      action: () => navigate('/admin/users'),
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      title: 'Permisos y Roles',
      description: 'Configurar permisos dentro de tu empresa',
      icon: Shield,
      action: () => navigate('/admin/permissions'),
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    {
      title: 'Límites y Configuración',
      description: 'Gestionar límites y configuración empresarial',
      icon: Gauge,
      action: () => navigate('/admin/limits'),
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      title: 'Configuración Empresarial',
      description: 'Configurar datos y preferencias de la empresa',
      icon: Building2,
      action: () => navigate('/admin/company'),
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header con indicador de contexto */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground text-lg">
              Gestión empresarial de {companyName}
            </p>
          </div>
          
          {/* Indicadores de contexto */}
          <div className="flex items-center gap-3">
            {isSuperAdmin && isVibeThinkCompany && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Modo: Cliente AI Pair
              </Badge>
            )}
            
            {isSuperAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/super-admin')}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                🚀 Ir a Super Admin
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid - Solo de la empresa */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Acciones de Administración Empresarial */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Gestión Empresarial
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {adminActions.map((action, index) => (
            <Card 
              key={index} 
              className="bg-card border-2 border-border hover:border-primary transition-all duration-200 cursor-pointer group"
              onClick={action.action}
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {action.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-primary/20"
                  >
                    Acceder →
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Actividad Reciente de la Empresa */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Actividad Reciente</CardTitle>
          <CardDescription className="text-muted-foreground">
            Últimas acciones realizadas en tu empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Usuario creado', user: 'Maria González', time: 'Hace 2 horas', type: 'user' },
              { action: 'Permisos modificados', user: 'Juan Pérez', time: 'Hace 4 horas', type: 'permission' },
              { action: 'Límite actualizado', user: 'Ana Martín', time: 'Hace 6 horas', type: 'limit' },
              { action: 'Configuración cambiada', user: 'Carlos Ruiz', time: 'Hace 1 día', type: 'config' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-blue-500/20' :
                    activity.type === 'permission' ? 'bg-green-500/20' :
                    activity.type === 'limit' ? 'bg-purple-500/20' :
                    'bg-orange-500/20'
                  }`}>
                    {activity.type === 'user' ? <Users className="w-4 h-4 text-blue-400" /> :
                     activity.type === 'permission' ? <Shield className="w-4 h-4 text-green-400" /> :
                     activity.type === 'limit' ? <Gauge className="w-4 h-4 text-purple-400" /> :
                     <Building2 className="w-4 h-4 text-orange-400" />}
                  </div>
                  <div>
                    <p className="text-foreground text-sm">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">{activity.user}</p>
                  </div>
                </div>
                <span className="text-muted-foreground text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
