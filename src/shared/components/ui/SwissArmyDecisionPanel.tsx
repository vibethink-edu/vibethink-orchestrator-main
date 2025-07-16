import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Tool, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  BarChart3,
  Table,
  MessageSquare,
  FileText,
  Palette
} from 'lucide-react';
import { useSwissArmyDecision, UseCase, ToolDecision } from '@/shared/hooks/hooks/useSwissArmyDecision';

interface SwissArmyDecisionPanelProps {
  className?: string;
  showMetrics?: boolean;
  showDecisions?: boolean;
}

export const SwissArmyDecisionPanel: React.FC<SwissArmyDecisionPanelProps> = ({
  className = '',
  showMetrics = true,
  showDecisions = true
}) => {
  const {
    decisions,
    metrics,
    swissArmyKnife,
    getRecommendations,
    calculateMetrics
  } = useSwissArmyDecision();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    calculateMetrics();
  }, [decisions, calculateMetrics]);

  // 🎯 Componente de Métricas
  const MetricsOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Éxito Navaja Suiza</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.swissArmySuccessRate.toFixed(1)}%</div>
          <Progress value={metrics.swissArmySuccessRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Casos resueltos exitosamente
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.averageImplementationTime.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground mt-1">
            Implementación promedio
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Herramientas Especializadas</CardTitle>
          <Tool className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.specializedToolUsage.toFixed(1)}%</div>
          <Progress value={metrics.specializedToolUsage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Uso de herramientas especializadas
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // 🔧 Componente de Herramientas de la Navaja Suiza
  const SwissArmyTools = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(swissArmyKnife).map(([key, tool]) => (
        <Card key={key} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              {getToolIcon(tool.category)}
              <CardTitle className="text-lg">{tool.name}</CardTitle>
            </div>
            <CardDescription className="text-sm">
              {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Performance:</span>
              <Badge variant="secondary">{tool.performance}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Bundle:</span>
              <Badge variant="outline">{tool.bundleSize}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Complejidad:</span>
              <div className="flex items-center space-x-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < tool.complexity ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Familiaridad:</span>
              <div className="flex items-center space-x-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < tool.teamFamiliarity ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Casos de uso: {tool.useCases.slice(0, 3).join(', ')}
                {tool.useCases.length > 3 && '...'}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // 📋 Componente de Decisiones Recientes
  const RecentDecisions = () => (
    <div className="space-y-4">
      {decisions.slice(-5).reverse().map((decision) => (
        <Card key={decision.id} className="hover:shadow-sm transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-base">{decision.useCase.name}</CardTitle>
                <Badge variant={
                  decision.decision === 'swiss-army' ? 'default' :
                  decision.decision === 'specialized' ? 'secondary' : 'outline'
                }>
                  {decision.decision === 'swiss-army' ? 'Navaja Suiza' :
                   decision.decision === 'specialized' ? 'Especializada' : 'Pendiente'}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(decision.date).toLocaleDateString()}
              </span>
            </div>
            <CardDescription className="text-sm">
              {decision.useCase.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Complejidad:</span>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < decision.useCase.complexity ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Impacto:</span>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < decision.useCase.businessImpact ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {decision.notes && (
              <p className="text-xs text-muted-foreground mt-2">
                {decision.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // 🎯 Componente de Evaluación Rápida
  const QuickEvaluation = () => {
    const [useCase, setUseCase] = useState<Partial<UseCase>>({
      name: '',
      description: '',
      requirements: [],
      performanceRequirement: 1000,
      complexity: 5,
      businessImpact: 5,
      priority: 'medium'
    });

    const [recommendation, setRecommendation] = useState<any>(null);

    const handleEvaluate = () => {
      if (!useCase.name || !useCase.description || !useCase.requirements?.length) {
        return;
      }

      const fullUseCase: UseCase = {
        id: `UC-${Date.now()}`,
        name: useCase.name,
        description: useCase.description,
        requirements: useCase.requirements,
        performanceRequirement: useCase.performanceRequirement || 1000,
        complexity: useCase.complexity || 5,
        businessImpact: useCase.businessImpact || 5,
        priority: useCase.priority || 'medium'
      };

      const result = getRecommendations(fullUseCase);
      setRecommendation(result);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Evaluación Rápida</CardTitle>
          <CardDescription>
            Evalúa rápidamente un caso de uso para obtener recomendaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre del caso de uso</label>
              <input
                type="text"
                value={useCase.name}
                onChange={(e) => setUseCase(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Ej: Dashboard de ventas"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <input
                type="text"
                value={useCase.description}
                onChange={(e) => setUseCase(prev => ({ ...prev, description: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Ej: Gráficos de ventas mensuales"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Requerimientos (separados por comas)</label>
            <input
              type="text"
              value={useCase.requirements?.join(', ')}
              onChange={(e) => setUseCase(prev => ({ 
                ...prev, 
                requirements: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              }))}
              className="w-full mt-1 px-3 py-2 border rounded-md"
              placeholder="Ej: gráficos de línea, filtros, exportar datos"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Performance (ms)</label>
              <input
                type="number"
                value={useCase.performanceRequirement}
                onChange={(e) => setUseCase(prev => ({ 
                  ...prev, 
                  performanceRequirement: parseInt(e.target.value) || 1000
                }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Complejidad (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={useCase.complexity}
                onChange={(e) => setUseCase(prev => ({ 
                  ...prev, 
                  complexity: parseInt(e.target.value) || 5
                }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Impacto (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={useCase.businessImpact}
                onChange={(e) => setUseCase(prev => ({ 
                  ...prev, 
                  businessImpact: parseInt(e.target.value) || 5
                }))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <Button onClick={handleEvaluate} className="w-full">
            Evaluar Caso de Uso
          </Button>

          {recommendation && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Recomendación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      recommendation.primaryRecommendation === 'swiss-army' ? 'default' : 'secondary'
                    }>
                      {recommendation.primaryRecommendation === 'swiss-army' ? 'Navaja Suiza' : 'Especializada'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Confianza: {(recommendation.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  {recommendation.primaryRecommendation === 'swiss-army' && recommendation.swissArmyTools.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Herramientas recomendadas:</p>
                      <div className="space-y-1">
                        {recommendation.swissArmyTools.map((tool: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{tool.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {tool.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendation.primaryRecommendation === 'specialized' && recommendation.specializedJustification.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Justificación:</p>
                      <div className="space-y-1">
                        {recommendation.specializedJustification.map((reason: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span>{reason.criterion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  };

  // 🎨 Iconos para categorías de herramientas
  const getToolIcon = (category: string) => {
    switch (category) {
      case 'charts':
        return <BarChart3 className="h-5 w-5 text-blue-600" />;
      case 'tables':
        return <Table className="h-5 w-5 text-green-600" />;
      case 'forms':
        return <FileText className="h-5 w-5 text-purple-600" />;
      case 'chat':
        return <MessageSquare className="h-5 w-5 text-orange-600" />;
      case 'ui':
        return <Palette className="h-5 w-5 text-pink-600" />;
      default:
        return <Tool className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center space-x-2">
        <Tool className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Framework Navaja Suiza</h2>
      </div>

      {showMetrics && <MetricsOverview />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="tools">Herramientas</TabsTrigger>
          <TabsTrigger value="decisions">Decisiones</TabsTrigger>
          <TabsTrigger value="evaluate">Evaluar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado del Framework</CardTitle>
              <CardDescription>
                Resumen de métricas y estado actual del framework Navaja Suiza
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Métricas Clave</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Éxito Navaja Suiza:</span>
                      <span className="font-medium">{metrics.swissArmySuccessRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tiempo Promedio:</span>
                      <span className="font-medium">{metrics.averageImplementationTime.toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Herramientas Especializadas:</span>
                      <span className="font-medium">{metrics.specializedToolUsage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Decisiones Recientes</h4>
                  <div className="text-sm text-muted-foreground">
                    {decisions.length} decisiones tomadas
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {decisions.filter(d => d.decision === 'swiss-army').length} navaja suiza
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tool className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">
                        {decisions.filter(d => d.decision === 'specialized').length} especializadas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <SwissArmyTools />
        </TabsContent>

        <TabsContent value="decisions">
          {showDecisions ? (
            <RecentDecisions />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Las decisiones están deshabilitadas</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="evaluate">
          <QuickEvaluation />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 