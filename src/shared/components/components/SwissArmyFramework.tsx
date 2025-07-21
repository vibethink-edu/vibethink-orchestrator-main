import React, { useState, useEffect } from 'react';
// import { SwissArmyDecisionPanel } from '@/components/ui/SwissArmyDecisionPanel'; // TODO: Implementar este componente
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Download, 
  Upload, 
  BarChart3, 
  Settings, 
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useSwissArmyDecision, ToolDecision } from '@/shared/hooks/hooks/useSwissArmyDecision';
import { 
  calculateFrameworkMetrics, 
  generatePerformanceReport,
  exportDecisionsToCSV,
  importDecisionsFromCSV
} from '@/shared/utils/utils/swissArmyHelpers';

export const SwissArmyFramework: React.FC = () => {
  const { decisions, calculateMetrics } = useSwissArmyDecision();
  const [metrics, setMetrics] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    calculateMetrics();
    const frameworkMetrics = calculateFrameworkMetrics(decisions);
    const performanceReport = generatePerformanceReport(decisions);
    
    setMetrics(frameworkMetrics);
    setReport(performanceReport);
  }, [decisions, calculateMetrics]);

  // 📊 Componente de Dashboard
  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Decisiones</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalDecisions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Decisiones tomadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Éxito Navaja Suiza</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.swissArmySuccessRate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Tasa de éxito
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.averageImplementationTime?.toFixed(1) || 0}h
            </div>
            <p className="text-xs text-muted-foreground">
              Implementación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Herramientas Especializadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.specializedToolUsage?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Uso de especializadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Decisiones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Decisiones</CardTitle>
            <CardDescription>
              Resumen de decisiones por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Navaja Suiza</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{metrics?.swissArmyDecisions || 0}</span>
                  <Badge variant="secondary">
                    {metrics?.totalDecisions ? 
                      ((metrics.swissArmyDecisions / metrics.totalDecisions) * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span>Especializadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{metrics?.specializedDecisions || 0}</span>
                  <Badge variant="secondary">
                    {metrics?.totalDecisions ? 
                      ((metrics.specializedDecisions / metrics.totalDecisions) * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Herramientas Más Usadas</CardTitle>
            <CardDescription>
              Top 5 herramientas de la navaja suiza
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics?.mostUsedTools?.slice(0, 5).map((tool: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{tool.tool}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{tool.count}</span>
                    <Badge variant="outline">
                      {metrics?.totalDecisions ? 
                        ((tool.count / metrics.totalDecisions) * 100).toFixed(1) : 0}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // 📈 Componente de Tendencias
  const TrendsAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tendencias de Decisión</CardTitle>
          <CardDescription>
            Evolución de decisiones a lo largo del tiempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics?.decisionTrends?.map((trend: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{trend.month}</span>
                  <span className="text-sm text-muted-foreground">
                    Total: {trend.total}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Navaja Suiza: {trend.swissArmy}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Especializadas: {trend.specialized}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ⚠️ Componente de Alertas y Recomendaciones
  const AlertsAndRecommendations = () => (
    <div className="space-y-6">
      {/* Alertas */}
      {report?.alerts && report.alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Alertas Críticas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {report.alerts.map((alert: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <span className="text-sm text-red-800">{alert}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones */}
      {report?.recommendations && report.recommendations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Settings className="h-5 w-5" />
              <span>Recomendaciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {report.recommendations.map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm text-blue-800">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen de Métricas */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Métricas</CardTitle>
          <CardDescription>
            Estado actual del framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Métricas Clave</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Decisiones:</span>
                  <span className="font-medium">{report?.summary?.totalDecisions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Navaja Suiza:</span>
                  <span className="font-medium">{report?.summary?.swissArmyDecisions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Especializadas:</span>
                  <span className="font-medium">{report?.summary?.specializedDecisions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasa de Éxito:</span>
                  <span className="font-medium">{report?.summary?.successRate?.toFixed(1) || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo Promedio:</span>
                  <span className="font-medium">{report?.summary?.averageTime?.toFixed(1) || 0}h</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Estado</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    (report?.summary?.successRate || 0) >= 80 ? 'bg-green-500' : 
                    (report?.summary?.successRate || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm">Tasa de Éxito</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    (metrics?.specializedToolUsage || 0) <= 15 ? 'bg-green-500' : 
                    (metrics?.specializedToolUsage || 0) <= 25 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm">Uso Especializadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    (metrics?.averageImplementationTime || 0) <= 4 ? 'bg-green-500' : 
                    (metrics?.averageImplementationTime || 0) <= 8 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm">Tiempo Implementación</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 📁 Componente de Importación/Exportación
  const ImportExport = () => {
    const handleExport = () => {
      const csvContent = exportDecisionsToCSV(decisions);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `swiss-army-decisions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const importedDecisions = importDecisionsFromCSV(content);
          // TODO: log 'Decisions imported:' importedDecisions
        } catch (error) {
          // TODO: log 'Error importing decisions:' error
        }
      };
      reader.readAsText(file);
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Importar/Exportar Decisiones</CardTitle>
            <CardDescription>
              Gestiona las decisiones del framework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Exportar Decisiones</h4>
                <p className="text-sm text-muted-foreground">
                  Descarga todas las decisiones en formato CSV
                </p>
                <Button onClick={handleExport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Importar Decisiones</h4>
                <p className="text-sm text-muted-foreground">
                  Importa decisiones desde un archivo CSV
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar CSV
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Archivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Decisiones:</span>
                <span className="font-medium">{decisions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Última Actualización:</span>
                <span className="font-medium">
                  {decisions.length > 0 ? 
                    new Date(decisions[decisions.length - 1].date).toLocaleDateString() : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tamaño Estimado:</span>
                <span className="font-medium">
                  {(JSON.stringify(decisions).length / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Framework Navaja Suiza</h1>
          <p className="text-muted-foreground">
            Administración y análisis del framework de decisiones de herramientas UI/UX
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {metrics?.totalDecisions || 0} decisiones
          </Badge>
          <Badge variant={
            (metrics?.swissArmySuccessRate || 0) >= 80 ? 'default' :
            (metrics?.swissArmySuccessRate || 0) >= 60 ? 'secondary' : 'destructive'
          }>
            {(metrics?.swissArmySuccessRate || 0).toFixed(1)}% éxito
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Dashboard</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="framework">Framework</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardOverview />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendsAnalysis />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <AlertsAndRecommendations />
        </TabsContent>

        <TabsContent value="framework" className="space-y-6">
          <SwissArmyDecisionPanel 
            showMetrics={false}
            showDecisions={true}
          />
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <ImportExport />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 