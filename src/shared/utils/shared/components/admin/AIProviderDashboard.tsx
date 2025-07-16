/**
 * Dashboard de Proveedores de IA
 * Monitoreo en tiempo real y gestión de migraciones
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Progress } from '@/shared/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Zap,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useAIProvider } from '@/hooks/useAIProvider';

interface ProviderStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'unavailable';
  latency: number;
  errorRate: number;
  cost: number;
  features: string[];
}

export const AIProviderDashboard: React.FC = () => {
  const {
    currentProvider,
    isAvailable,
    health,
    latency,
    features,
    migrationHistory,
    generateText,
    deployApp,
    getUsageStats,
    forceMigration,
    getPerformanceMetrics
  } = useAIProvider();

  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProviderData();
    const interval = setInterval(loadProviderData, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const loadProviderData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar estadísticas de uso
      const stats = await getUsageStats('day');
      setUsageStats(stats);
      
      // Simular datos de proveedores (en producción vendría del monitor)
      setProviders([
        {
          name: 'Knotie AI',
          status: currentProvider === 'knotie' ? health : 'unavailable',
          latency: currentProvider === 'knotie' ? latency : 0,
          errorRate: 2.1,
          cost: 45.67,
          features: ['Rapid Deployment', 'Usage Analytics', 'Custom Templates']
        },
        {
          name: 'OpenAI',
          status: currentProvider === 'openai' ? health : 'healthy',
          latency: 850,
          errorRate: 1.2,
          cost: 23.45,
          features: ['GPT-4', 'DALL-E', 'Whisper']
        },
        {
          name: 'Anthropic',
          status: currentProvider === 'anthropic' ? health : 'healthy',
          latency: 1200,
          errorRate: 0.8,
          cost: 18.90,
          features: ['Claude', 'Constitutional AI']
        }
      ]);
    } catch (error) {
      // TODO: log Failed to load provider data en desarrollo
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
      case 'unavailable':
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
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleForceMigration = async (providerName: string) => {
    try {
      await forceMigration(providerName);
      await loadProviderData();
    } catch (error) {
      // TODO: log Migration failed
    }
  };

  const testProvider = async (providerName: string) => {
    try {
      await generateText({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Test message' }]
      });
    } catch (error) {
      // TODO: log Provider test failed
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Provider Dashboard</h1>
          <p className="text-gray-600">Monitoreo en tiempo real de proveedores de IA</p>
        </div>
        <Button 
          onClick={loadProviderData} 
          disabled={isLoading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Current Provider Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Proveedor Actual: {currentProvider.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(health)}
              <span className="font-medium">Estado:</span>
              <Badge className={getStatusColor(health)}>
                {health === 'healthy' ? 'Saludable' : 
                 health === 'degraded' ? 'Degradado' : 'No Disponible'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="font-medium">Latencia:</span>
              <span className={latency > 1000 ? 'text-red-600' : 'text-green-600'}>
                {latency}ms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Disponible:</span>
              <Badge variant={isAvailable ? 'default' : 'destructive'}>
                {isAvailable ? 'Sí' : 'No'}
              </Badge>
            </div>
          </div>

          {/* Features */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Características Disponibles:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(features).map(([feature, available]) => (
                <Badge 
                  key={feature} 
                  variant={available ? 'default' : 'secondary'}
                >
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card key={provider.name} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{provider.name}</span>
                {getStatusIcon(provider.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Badge */}
              <Badge className={getStatusColor(provider.status)}>
                {provider.status === 'healthy' ? 'Saludable' : 
                 provider.status === 'degraded' ? 'Degradado' : 'No Disponible'}
              </Badge>

              {/* Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Latencia:</span>
                  <span className={provider.latency > 1000 ? 'text-red-600' : 'text-green-600'}>
                    {provider.latency}ms
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tasa de Error:</span>
                  <span className={provider.errorRate > 5 ? 'text-red-600' : 'text-green-600'}>
                    {provider.errorRate}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Costo Hoy:</span>
                  <span className="text-blue-600">${provider.cost}</span>
                </div>
              </div>

              {/* Features */}
              <div>
                <h5 className="text-sm font-medium mb-2">Características:</h5>
                <div className="flex flex-wrap gap-1">
                  {provider.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testProvider(provider.name)}
                  disabled={provider.status === 'unavailable'}
                >
                  Probar
                </Button>
                {provider.name !== currentProvider && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleForceMigration(provider.name.toLowerCase())}
                    disabled={provider.status === 'unavailable'}
                  >
                    Migrar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Statistics */}
      {usageStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Estadísticas de Uso (Hoy)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {usageStats.totalRequests || 0}
                </div>
                <div className="text-sm text-gray-600">Requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {usageStats.totalTokens || 0}
                </div>
                <div className="text-sm text-gray-600">Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {usageStats.averageLatency || 0}ms
                </div>
                <div className="text-sm text-gray-600">Latencia Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${usageStats.totalCost || 0}
                </div>
                <div className="text-sm text-gray-600">Costo Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Migration History */}
      {migrationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Migraciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {migrationHistory.map((migration, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{migration.from}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{migration.to}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {migration.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {!isAvailable && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            El proveedor actual no está disponible. Se intentará migrar automáticamente a un proveedor de respaldo.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}; 