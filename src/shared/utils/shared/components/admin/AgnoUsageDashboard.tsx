import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useAgno } from '@/shared/hooks/hooks/useAgno';
import { useAuth } from '@/shared/hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
  topModels: Array<{ model: string; requests: number; cost: number }>;
  usageByOperation: Record<string, number>;
}

interface RealTimeStats {
  activeAgents: number;
  activeTeams: number;
  currentRequests: number;
  averageResponseTime: number;
  costPerMinute: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AgnoUsageDashboard: React.FC = () => {
  // TODO: log AgnoUsageDashboard mounted en desarrollo
  const { user } = useAuth();
  const { getCompanyUsageStats, getUserUsageStats, getRealTimeStats, isLoading, error } = useAgno();
  
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');
  const [viewMode, setViewMode] = useState<'company' | 'user'>('company');
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(null);

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      if (viewMode === 'company') {
        const stats = await getCompanyUsageStats(period);
        setUsageStats(stats);
      } else {
        const stats = await getUserUsageStats(period);
        setUsageStats(stats);
      }
    } catch (err) {
      // TODO: log Error loading stats en desarrollo
    }
  };

  // Cargar estadísticas en tiempo real
  const loadRealTimeStats = async () => {
    try {
      const stats = await getRealTimeStats();
      setRealTimeStats(stats);
    } catch (err) {
      // TODO: log Error loading real-time stats en desarrollo
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadStats();
    loadRealTimeStats();
  }, [period, viewMode]);

  // Actualizar estadísticas en tiempo real cada 30 segundos
  useEffect(() => {
    const interval = setInterval(loadRealTimeStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // TODO: log user en desarrollo
  // TODO: log usageStats en desarrollo
  // TODO: log realTimeStats en desarrollo
  // TODO: log error en desarrollo

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Uso Agno</h1>
          <p className="text-muted-foreground">
            Estadísticas de uso de agentes y equipos IA
          </p>
        </div>
        
        <div className="flex gap-4">
          <Select value={viewMode} onValueChange={(value: 'company' | 'user') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">Empresa</SelectItem>
              <SelectItem value="user">Usuario</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={period} onValueChange={(value: 'day' | 'week' | 'month') => setPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={loadStats} disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas en Tiempo Real */}
      {realTimeStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Agentes Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeStats.activeAgents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Equipos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeStats.activeTeams}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Peticiones Actuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeStats.currentRequests}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(realTimeStats.averageResponseTime)}ms
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Costo/Minuto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${realTimeStats.costPerMinute.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Estadísticas Generales */}
      {usageStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Peticiones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.totalRequests.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.totalTokens.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${usageStats.totalCost.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(usageStats.averageResponseTime)}ms
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos */}
      {usageStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Modelos */}
          <Card>
            <CardHeader>
              <CardTitle>Modelos Más Usados</CardTitle>
              <CardDescription>Distribución de uso por modelo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageStats.topModels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Uso por Operación */}
          <Card>
            <CardHeader>
              <CardTitle>Uso por Operación</CardTitle>
              <CardDescription>Distribución de peticiones por tipo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(usageStats.usageByOperation).map(([key, value], index) => ({
                      name: key,
                      value,
                      color: COLORS[index % COLORS.length]
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(usageStats.usageByOperation).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de Top Modelos */}
      {usageStats?.topModels && (
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Modelos</CardTitle>
            <CardDescription>Uso detallado por modelo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Modelo</th>
                    <th className="text-left p-2">Peticiones</th>
                    <th className="text-left p-2">Costo</th>
                    <th className="text-left p-2">Promedio por Petición</th>
                  </tr>
                </thead>
                <tbody>
                  {usageStats.topModels.map((model, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        <Badge variant="outline">{model.model}</Badge>
                      </td>
                      <td className="p-2">{model.requests.toLocaleString()}</td>
                      <td className="p-2">${model.cost.toFixed(2)}</td>
                      <td className="p-2">
                        ${(model.cost / model.requests).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 