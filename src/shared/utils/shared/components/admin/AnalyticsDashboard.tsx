/**
 * AnalyticsDashboard - Dashboard de Análisis Avanzado
 * 
 * Dashboard especializado en análisis de datos, métricas avanzadas,
 * segmentación de usuarios y análisis predictivo.
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  Eye,
  MousePointer,
  Clock,
  Target,
  Zap,
  Filter,
  Download,
  Calendar,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

// Bundui UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/bundui-premium/components/ui/tabs';
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress';
import { Separator } from '@/shared/components/bundui-premium/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/bundui-premium/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/bundui-premium/components/ui/table';

// Debug Panel
import SystemDebugPanel from './SystemDebugPanel';

interface AnalyticsMetrics {
  totalPageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  goalCompletions: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  conversionRate: number;
}

interface UserSegment {
  segment: string;
  users: number;
  revenue: number;
  engagementScore: number;
  retentionRate: number;
}

interface TopPage {
  page: string;
  views: number;
  uniqueViews: number;
  avgTimeOnPage: string;
  bounceRate: number;
  exitRate: number;
}

interface DeviceAnalytics {
  device: string;
  sessions: number;
  percentage: number;
  conversionRate: number;
  avgSessionDuration: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('pageviews');

  // Mock data - Analytics Metrics
  const analyticsMetrics: AnalyticsMetrics = {
    totalPageViews: 145678,
    uniqueVisitors: 34567,
    averageSessionDuration: 245, // seconds
    bounceRate: 34.5,
    conversionRate: 3.4,
    goalCompletions: 1234
  };

  // Mock data - Traffic Sources
  const trafficSources: TrafficSource[] = [
    {
      source: 'Organic Search',
      visitors: 15234,
      percentage: 44.1,
      trend: 'up',
      conversionRate: 4.2
    },
    {
      source: 'Direct',
      visitors: 8945,
      percentage: 25.9,
      trend: 'stable',
      conversionRate: 5.1
    },
    {
      source: 'Social Media',
      visitors: 5678,
      percentage: 16.4,
      trend: 'up',
      conversionRate: 2.8
    },
    {
      source: 'Email Marketing',
      visitors: 3456,
      percentage: 10.0,
      trend: 'down',
      conversionRate: 6.3
    },
    {
      source: 'Paid Ads',
      visitors: 1234,
      percentage: 3.6,
      trend: 'up',
      conversionRate: 4.7
    }
  ];

  // Mock data - User Segments
  const userSegments: UserSegment[] = [
    {
      segment: 'Power Users',
      users: 2340,
      revenue: 89500,
      engagementScore: 92,
      retentionRate: 87
    },
    {
      segment: 'Regular Users',
      users: 12456,
      revenue: 156780,
      engagementScore: 74,
      retentionRate: 65
    },
    {
      segment: 'New Users',
      users: 8934,
      revenue: 34567,
      engagementScore: 56,
      retentionRate: 42
    },
    {
      segment: 'Inactive Users',
      users: 5678,
      revenue: 12340,
      engagementScore: 23,
      retentionRate: 15
    }
  ];

  // Mock data - Top Pages
  const topPages: TopPage[] = [
    {
      page: '/dashboard',
      views: 34567,
      uniqueViews: 23456,
      avgTimeOnPage: '4:32',
      bounceRate: 28.5,
      exitRate: 15.2
    },
    {
      page: '/products',
      views: 28934,
      uniqueViews: 19876,
      avgTimeOnPage: '3:45',
      bounceRate: 35.7,
      exitRate: 22.1
    },
    {
      page: '/checkout',
      views: 15678,
      uniqueViews: 14234,
      avgTimeOnPage: '2:18',
      bounceRate: 45.2,
      exitRate: 67.8
    },
    {
      page: '/about',
      views: 9876,
      uniqueViews: 8234,
      avgTimeOnPage: '1:56',
      bounceRate: 52.1,
      exitRate: 34.5
    },
    {
      page: '/contact',
      views: 7890,
      uniqueViews: 6543,
      avgTimeOnPage: '1:23',
      bounceRate: 48.7,
      exitRate: 41.2
    }
  ];

  // Mock data - Device Analytics
  const deviceAnalytics: DeviceAnalytics[] = [
    {
      device: 'Desktop',
      sessions: 18934,
      percentage: 54.7,
      conversionRate: 4.2,
      avgSessionDuration: '4:23'
    },
    {
      device: 'Mobile',
      sessions: 12456,
      percentage: 36.0,
      conversionRate: 2.8,
      avgSessionDuration: '2:45'
    },
    {
      device: 'Tablet',
      sessions: 3210,
      percentage: 9.3,
      conversionRate: 3.1,
      avgSessionDuration: '3:12'
    }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Análisis avanzado de datos y métricas de rendimiento
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
          >
            Debug
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsMetrics.totalPageViews)}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5% vs período anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsMetrics.uniqueVisitors)}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.3% vs período anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(analyticsMetrics.averageSessionDuration)}</div>
              <div className="flex items-center text-xs text-red-600">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -2.1% vs período anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsMetrics.bounceRate}%</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -3.2% vs período anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsMetrics.conversionRate}%</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +0.7% vs período anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsMetrics.goalCompletions)}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15.4% vs período anterior
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed analytics */}
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pageviews">Traffic</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="pageviews" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>
                    Páginas vistas y visitantes únicos por día
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Gráfico de tráfico</p>
                      <p className="text-xs text-slate-500">Integración con Chart.js pendiente</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>
                    Páginas más visitadas del sitio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Página</TableHead>
                        <TableHead className="text-right">Vistas</TableHead>
                        <TableHead className="text-right">Bounce %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topPages.map((page) => (
                        <TableRow key={page.page}>
                          <TableCell className="font-medium">{page.page}</TableCell>
                          <TableCell className="text-right">{formatNumber(page.views)}</TableCell>
                          <TableCell className="text-right">{page.bounceRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Origen del tráfico y tasas de conversión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">{source.source}</span>
                        </div>
                        <Badge variant={source.trend === 'up' ? 'default' : source.trend === 'down' ? 'destructive' : 'secondary'}>
                          {source.trend === 'up' ? '↗' : source.trend === 'down' ? '↘' : '→'} {source.trend}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatNumber(source.visitors)}</div>
                        <div className="text-sm text-gray-500">{source.percentage}% • Conv: {source.conversionRate}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="segments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Segments</CardTitle>
                <CardDescription>
                  Análisis de segmentos de usuarios y comportamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userSegments.map((segment) => (
                    <Card key={segment.segment}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{segment.segment}</CardTitle>
                        <CardDescription>{formatNumber(segment.users)} usuarios</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Revenue</span>
                            <span className="text-sm font-medium">{formatCurrency(segment.revenue)}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Engagement</span>
                              <span>{segment.engagementScore}%</span>
                            </div>
                            <Progress value={segment.engagementScore} className="h-2" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Retention</span>
                              <span>{segment.retentionRate}%</span>
                            </div>
                            <Progress value={segment.retentionRate} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Analytics</CardTitle>
                <CardDescription>
                  Análisis por tipo de dispositivo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceAnalytics.map((device) => (
                    <div key={device.device} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {device.device === 'Desktop' && <Monitor className="h-5 w-5 text-blue-500" />}
                          {device.device === 'Mobile' && <Smartphone className="h-5 w-5 text-green-500" />}
                          {device.device === 'Tablet' && <Tablet className="h-5 w-5 text-purple-500" />}
                          <span className="font-medium">{device.device}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatNumber(device.sessions)}</div>
                        <div className="text-sm text-gray-500">
                          {device.percentage}% • {device.avgSessionDuration} • Conv: {device.conversionRate}%
                        </div>
                      </div>
                    </div>
                  ))}
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

export default AnalyticsDashboard;
