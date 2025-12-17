/**
 * Knotie Integration Page
 * 
 * Página principal para la integración con Knotie-AI
 * Combina orquestación de agentes y gestión de snippets
 * 
 * @author AI Pair Platform - Knotie Integration Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Separator } from '@/shared/components/ui/separator';
import { 
  Activity, 
  Users, 
  MessageSquare, 
  Mic, 
  Zap,
  BarChart3,
  Settings,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { KnotieAgent } from '@/components/universal-assistant/KnotieAgent';
import { SnippetDashboard } from '@/components/universal-assistant/SnippetDashboard';

interface KnotieIntegrationStats {
  totalAgents: number;
  activeAgents: number;
  totalConversations: number;
  avgResponseTime: number;
  satisfactionScore: number;
  revenueGenerated: number;
  snippetsUsed: number;
  integrationHealth: 'healthy' | 'degraded' | 'unavailable';
}

interface KnotieIntegrationPageProps {
  companyId: string;
}

export const KnotieIntegrationPage: React.FC<KnotieIntegrationPageProps> = ({
  companyId
}) => {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<KnotieIntegrationStats>({
    totalAgents: 0,
    activeAgents: 0,
    totalConversations: 0,
    avgResponseTime: 0,
    satisfactionScore: 0,
    revenueGenerated: 0,
    snippetsUsed: 0,
    integrationHealth: 'healthy'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Cargar estadísticas de integración
  useEffect(() => {
    if (hasPermission('ADMIN')) {
      loadIntegrationStats();
    }
  }, [companyId, hasPermission]);

  const loadIntegrationStats = async () => {
    setIsLoading(true);
    try {
      // TODO: Implementar llamada a API de Knotie
      const mockStats: KnotieIntegrationStats = {
        totalAgents: 5,
        activeAgents: 3,
        totalConversations: 2847,
        avgResponseTime: 2.1,
        satisfactionScore: 4.3,
        revenueGenerated: 187500,
        snippetsUsed: 1250,
        integrationHealth: 'healthy'
      };
      
      setStats(mockStats);
    } catch (error) {
      toast({
        title: "Error al cargar estadísticas",
        description: "No se pudieron cargar las estadísticas de integración",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unavailable': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'degraded': return <AlertCircle className="w-4 h-4" />;
      case 'unavailable': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!hasPermission('ADMIN')) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No tienes permisos para acceder a la integración con Knotie-AI
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integración Knotie-AI</h1>
          <p className="text-muted-foreground">
            Plataforma de orquestación de agentes de IA omnicanal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={stats.integrationHealth === 'healthy' ? 'default' : 'destructive'}
            className="flex items-center gap-1"
          >
            {getHealthIcon(stats.integrationHealth)}
            {stats.integrationHealth === 'healthy' ? 'Conectado' : 'Problemas'}
          </Badge>
          <Button variant="outline" asChild>
            <a href="https://knotie.ai" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Knotie Dashboard
            </a>
          </Button>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Agentes</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{stats.activeAgents}/{stats.totalAgents}</div>
              <div className="text-xs text-muted-foreground">Activos/Total</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Conversaciones</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{stats.totalConversations.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Satisfacción</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{stats.satisfactionScore}/5</div>
              <div className="text-xs text-muted-foreground">Promedio</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Ingresos</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">${(stats.revenueGenerated / 1000).toFixed(0)}k</div>
              <div className="text-xs text-muted-foreground">Generados</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="agents">Agentes</TabsTrigger>
          <TabsTrigger value="snippets">Snippets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Estado de Integración */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Integración</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado de Conexión</span>
                    <Badge 
                      variant={stats.integrationHealth === 'healthy' ? 'default' : 'destructive'}
                      className="flex items-center gap-1"
                    >
                      {getHealthIcon(stats.integrationHealth)}
                      {stats.integrationHealth === 'healthy' ? 'Conectado' : 'Problemas'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tiempo de Respuesta Promedio</span>
                    <span className="text-sm">{stats.avgResponseTime}s</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Snippets Utilizados</span>
                    <span className="text-sm">{stats.snippetsUsed.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Ingresos Generados</span>
                    <span className="text-sm font-semibold">${stats.revenueGenerated.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Ventajas de la Integración</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Agentes omnicanal unificados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Workflows visuales drag & drop
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Analytics en tiempo real
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Integración nativa con CRM
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Snippets reutilizables
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actividad Reciente */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Nueva conversación iniciada</p>
                      <p className="text-xs text-muted-foreground">Agente: Soporte Técnico</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Hace 2 min</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mic className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Llamada de ventas completada</p>
                      <p className="text-xs text-muted-foreground">Agente: Ventas Premium</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Hace 15 min</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Workflow ejecutado</p>
                      <p className="text-xs text-muted-foreground">Onboarding de cliente</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Hace 1 hora</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents" className="space-y-6">
          <KnotieAgent 
            companyId={companyId}
            onAgentUpdate={(agent) => {
              toast({
                title: "Agente actualizado",
                description: `El agente "${agent.name}" ha sido actualizado`
              });
            }}
            onWorkflowTrigger={(workflowId, data) => {
              toast({
                title: "Workflow ejecutado",
                description: `Workflow ${workflowId} iniciado con éxito`
              });
            }}
          />
        </TabsContent>
        
        <TabsContent value="snippets" className="space-y-6">
          <SnippetDashboard 
            companyId={companyId}
            onSnippetSelect={(snippet) => {
              toast({
                title: "Snippet seleccionado",
                description: `"${snippet.title}" listo para usar`
              });
            }}
            onSnippetExport={(snippets) => {
              toast({
                title: "Snippets exportados",
                description: `${snippets.length} snippets exportados exitosamente`
              });
            }}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Avanzados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-12">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Analytics en Desarrollo</h3>
                <p className="text-sm">
                  Próximamente: Gráficos interactivos, métricas de rendimiento, 
                  análisis de conversaciones y reportes personalizados
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer con Enlaces Útiles */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Integración con Knotie-AI • Partnership Vitalicio
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://docs.knotie.ai" target="_blank" rel="noopener noreferrer">
                  Documentación
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://community.knotie.ai" target="_blank" rel="noopener noreferrer">
                  Comunidad
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://support.knotie.ai" target="_blank" rel="noopener noreferrer">
                  Soporte
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
