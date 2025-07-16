import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Progress } from '@/shared/components/ui/progress';
import { 
  AlertTriangle, 
  Shield, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Settings,
  TrendingUp,
  Activity
} from 'lucide-react';

// Tipos para el sistema de alertas
interface Dependency {
  name: string;
  currentVersion: string;
  latestVersion: string;
  priority: 'immediate' | 'high' | 'medium' | 'low' | 'monitor';
  lastChecked: Date;
  status: 'stable' | 'update_available' | 'critical' | 'not_installed';
  category: 'security' | 'core' | 'ui' | 'testing' | 'utility';
}

interface SecurityIssue {
  id: string;
  package: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendedAction: string;
  cve?: string;
}

interface UpgradeRecommendation {
  type: 'security_critical' | 'major_update' | 'minor_update' | 'patch_update';
  priority: 'immediate' | 'high' | 'medium' | 'low';
  package: string;
  description: string;
  action: string;
}

// Datos mock para demostración
const mockDependencies: Dependency[] = [
  {
    name: 'react',
    currentVersion: '18.3.1',
    latestVersion: '19.1.0',
    priority: 'monitor',
    lastChecked: new Date(),
    status: 'stable',
    category: 'core'
  },
  {
    name: 'reactflow',
    currentVersion: 'no instalado',
    latestVersion: '11.11.4',
    priority: 'high',
    lastChecked: new Date(),
    status: 'not_installed',
    category: 'core'
  },
  {
    name: '@hookform/resolvers',
    currentVersion: '3.10.0',
    latestVersion: '5.1.1',
    priority: 'immediate',
    lastChecked: new Date(),
    status: 'critical',
    category: 'security'
  },
  {
    name: '@testing-library/react',
    currentVersion: '14.3.1',
    latestVersion: '16.3.0',
    priority: 'medium',
    lastChecked: new Date(),
    status: 'update_available',
    category: 'testing'
  },
  {
    name: 'lucide-react',
    currentVersion: '0.294.0',
    latestVersion: '0.525.0',
    priority: 'low',
    lastChecked: new Date(),
    status: 'update_available',
    category: 'ui'
  }
];

const mockSecurityIssues: SecurityIssue[] = [
  {
    id: '1',
    package: '@hookform/resolvers',
    severity: 'critical',
    description: 'Vulnerabilidad de seguridad conocida en versión 3.10.0',
    recommendedAction: 'Actualizar a versión 5.1.1',
    cve: 'CVE-2024-XXXX'
  }
];

const mockRecommendations: UpgradeRecommendation[] = [
  {
    type: 'security_critical',
    priority: 'immediate',
    package: '@hookform/resolvers',
    description: 'Vulnerabilidad de seguridad crítica',
    action: 'npm install @hookform/resolvers@latest'
  },
  {
    type: 'major_update',
    priority: 'high',
    package: 'reactflow',
    description: 'React Flow no está instalado',
    action: 'npm install reactflow@latest'
  }
];

const DevPortal: React.FC = () => {
  const [dependencies, setDependencies] = useState<Dependency[]>(mockDependencies);
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>(mockSecurityIssues);
  const [recommendations, setRecommendations] = useState<UpgradeRecommendation[]>(mockRecommendations);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Función para obtener el color del badge según la prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      case 'monitor': return 'outline';
      default: return 'outline';
    }
  };

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'update_available': return 'default';
      case 'stable': return 'secondary';
      case 'not_installed': return 'outline';
      default: return 'outline';
    }
  };

  // Función para obtener el icono según el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'update_available': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'stable': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'not_installed': return <Package className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  // Función para refrescar los datos
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Aquí se llamaría al script de monitoreo
      // const response = await fetch('/api/upgrade-monitor');
      // const data = await response.json();
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastUpdate(new Date());
      console.log('✅ Datos actualizados');
    } catch (error) {
      console.error('❌ Error actualizando datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular estadísticas
  const stats = {
    total: dependencies.length,
    critical: dependencies.filter(d => d.status === 'critical').length,
    updates: dependencies.filter(d => d.status === 'update_available').length,
    stable: dependencies.filter(d => d.status === 'stable').length,
    notInstalled: dependencies.filter(d => d.status === 'not_installed').length
  };

  const criticalUpdates = recommendations.filter(r => r.priority === 'immediate');
  const highPriorityUpdates = recommendations.filter(r => r.priority === 'high');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dev Portal - VThink 1.0</h1>
            <p className="text-gray-600">Sistema de gestión de upgrades y monitoreo del stack</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </div>
            <Button 
              onClick={refreshData} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Alertas críticas */}
        {criticalUpdates.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Actualizaciones Críticas Requeridas</AlertTitle>
            <AlertDescription>
              Se encontraron {criticalUpdates.length} actualizaciones críticas que requieren atención inmediata.
            </AlertDescription>
          </Alert>
        )}

        {/* Dashboard principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dependencias</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Monitoreadas activamente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Críticas</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
              <p className="text-xs text-muted-foreground">
                Requieren atención inmediata
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actualizaciones</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.updates}</div>
              <p className="text-xs text-muted-foreground">
                Disponibles para upgrade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estables</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.stable}</div>
              <p className="text-xs text-muted-foreground">
                Actualizadas y seguras
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principales */}
        <Tabs defaultValue="dependencies" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dependencies">Dependencias</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
          </TabsList>

          {/* Tab de Dependencias */}
          <TabsContent value="dependencies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado de las Dependencias</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dependencia</TableHead>
                      <TableHead>Versión Actual</TableHead>
                      <TableHead>Última Versión</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Categoría</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dependencies.map((dep) => (
                      <TableRow key={dep.name}>
                        <TableCell className="font-medium">{dep.name}</TableCell>
                        <TableCell>{dep.currentVersion}</TableCell>
                        <TableCell>{dep.latestVersion}</TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(dep.priority)}>
                            {dep.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(dep.status)}
                            <Badge variant={getStatusColor(dep.status)}>
                              {dep.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{dep.category}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Seguridad */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Seguridad</CardTitle>
              </CardHeader>
              <CardContent>
                {securityIssues.length > 0 ? (
                  <div className="space-y-4">
                    {securityIssues.map((issue) => (
                      <Alert key={issue.id} variant="destructive">
                        <Shield className="h-4 w-4" />
                        <AlertTitle>Vulnerabilidad de Seguridad</AlertTitle>
                        <AlertDescription>
                          <strong>Paquete:</strong> {issue.package}
                          <br />
                          <strong>Descripción:</strong> {issue.description}
                          <br />
                          <strong>Acción recomendada:</strong> {issue.recommendedAction}
                          {issue.cve && (
                            <>
                              <br />
                              <strong>CVE:</strong> {issue.cve}
                            </>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No se encontraron vulnerabilidades de seguridad</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Recomendaciones */}
          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones de Upgrade</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getPriorityColor(rec.priority)}>
                              {rec.priority}
                            </Badge>
                            <span className="font-medium">{rec.package}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            Ejecutar
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <code className="text-xs bg-gray-100 p-2 rounded block">
                          {rec.action}
                        </code>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No hay recomendaciones de upgrade pendientes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Métricas */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progreso de Upgrades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Estabilidad del Stack</span>
                        <span>{Math.round((stats.stable / stats.total) * 100)}%</span>
                      </div>
                      <Progress value={(stats.stable / stats.total) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Cobertura de Seguridad</span>
                        <span>{Math.round(((stats.total - stats.critical) / stats.total) * 100)}%</span>
                      </div>
                      <Progress value={((stats.total - stats.critical) / stats.total) * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['core', 'security', 'ui', 'testing'].map((category) => {
                      const count = dependencies.filter(d => d.category === category).length;
                      const critical = dependencies.filter(d => d.category === category && d.status === 'critical').length;
                      return (
                        <div key={category} className="flex justify-between items-center">
                          <span className="capitalize">{category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{count}</span>
                            {critical > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {critical} críticas
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DevPortal; 