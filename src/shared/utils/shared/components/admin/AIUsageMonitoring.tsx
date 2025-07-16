/**
 * AI Usage Monitoring - Monitoreo de Uso de IA desde Super Admin
 * 
 * Panel para supervisar el uso de IA across todas las empresas,
 * costos, optimización de recursos y analytics
 * 
 * @author AI Pair Platform - AI Team
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Calendar,
  BarChart3,
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  Settings
} from 'lucide-react'

interface AIUsageRecord {
  id: string
  company: string
  companyId: string
  model: string
  requests: number
  tokens: number
  cost: number
  date: string
  responseTime: number
  successRate: number
}

interface AIMetrics {
  totalRequests: number
  totalTokens: number
  totalCost: number
  averageResponseTime: number
  successRate: number
  topModel: string
  costPerRequest: number
  monthlyGrowth: number
}

// Mock data - en producción vendría de la base de datos
const mockUsageRecords: AIUsageRecord[] = [
  {
    id: 'AI-001',
    company: 'Empresa ABC',
    companyId: 'comp_001',
    model: 'gpt-4',
    requests: 1250,
    tokens: 850000,
    cost: 17.50,
    date: '2025-06-10',
    responseTime: 1.2,
    successRate: 99.8
  },
  {
    id: 'AI-002',
    company: 'TechCorp',
    companyId: 'comp_002',
    model: 'claude-3-sonnet',
    requests: 3400,
    tokens: 2100000,
    cost: 63.00,
    date: '2025-06-10',
    responseTime: 0.9,
    successRate: 99.9
  },
  {
    id: 'AI-003',
    company: 'StartupXYZ',
    companyId: 'comp_003',
    model: 'gpt-3.5-turbo',
    requests: 890,
    tokens: 420000,
    cost: 0.84,
    date: '2025-06-10',
    responseTime: 0.7,
    successRate: 99.5
  }
]

const mockMetrics: AIMetrics = {
  totalRequests: 127450,
  totalTokens: 89500000,
  totalCost: 2847.30,
  averageResponseTime: 1.1,
  successRate: 99.7,
  topModel: 'gpt-4',
  costPerRequest: 0.022,
  monthlyGrowth: 18.5
}

export function AIUsageMonitoring() {
  const [usageRecords, setUsageRecords] = useState<AIUsageRecord[]>(mockUsageRecords)
  const [metrics, setMetrics] = useState<AIMetrics>(mockMetrics)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedModel, setSelectedModel] = useState<string>('all')

  const getModelColor = (model: string) => {
    switch (model) {
      case 'gpt-4': return 'bg-green-100 text-green-700'
      case 'gpt-3.5-turbo': return 'bg-blue-100 text-blue-700'
      case 'claude-3-sonnet': return 'bg-purple-100 text-purple-700'
      case 'claude-3-haiku': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 99.5) return 'text-green-600'
    if (rate >= 99.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredRecords = usageRecords.filter(record => {
    const matchesSearch = record.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.model.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesModel = selectedModel === 'all' || record.model === selectedModel
    
    return matchesSearch && matchesModel
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* AI Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatNumber(metrics.totalRequests)}</div>
                <div className="text-xs text-muted-foreground">Requests Totales</div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  +{formatPercentage(metrics.monthlyGrowth)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(metrics.totalCost)}</div>
                <div className="text-xs text-muted-foreground">Costo Total</div>
              </div>
              <DollarSign className="w-4 h-4 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{metrics.averageResponseTime}s</div>
                <div className="text-xs text-muted-foreground">Tiempo Respuesta</div>
              </div>
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatPercentage(metrics.successRate)}</div>
                <div className="text-xs text-muted-foreground">Tasa de Éxito</div>
              </div>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usage">Uso por Empresa</TabsTrigger>
          <TabsTrigger value="models">Modelos</TabsTrigger>
          <TabsTrigger value="costs">Costos</TabsTrigger>
          <TabsTrigger value="optimization">Optimización</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por empresa o modelo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">Todos los modelos</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                  </select>
                  
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Records */}
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-sm font-semibold">{record.company}</div>
                        <Badge className={getModelColor(record.model)}>
                          {record.model}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {new Date(record.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Requests</div>
                          <div className="font-semibold">{formatNumber(record.requests)}</div>
                        </div>
                        
                        <div>
                          <div className="text-muted-foreground">Tokens</div>
                          <div className="font-semibold">{formatNumber(record.tokens)}</div>
                        </div>
                        
                        <div>
                          <div className="text-muted-foreground">Costo</div>
                          <div className="font-semibold text-red-600">
                            {formatCurrency(record.cost)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-muted-foreground">Tiempo Resp.</div>
                          <div className="font-semibold">{record.responseTime}s</div>
                        </div>
                        
                        <div>
                          <div className="text-muted-foreground">Éxito</div>
                          <div className={`font-semibold ${getSuccessRateColor(record.successRate)}`}>
                            {formatPercentage(record.successRate)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredRecords.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron registros</h3>
                  <p className="text-muted-foreground">
                    No hay registros de uso de IA que coincidan con los filtros seleccionados.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Usage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-500" />
                  Distribución por Modelo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">GPT-4</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <span className="text-sm font-bold">45%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Claude 3 Sonnet</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }} />
                    </div>
                    <span className="text-sm font-bold">30%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">GPT-3.5 Turbo</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }} />
                    </div>
                    <span className="text-sm font-bold">20%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Claude 3 Haiku</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '5%' }} />
                    </div>
                    <span className="text-sm font-bold">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Métricas de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Modelo Más Rápido</span>
                  <Badge className="bg-green-100 text-green-700">Claude 3 Haiku</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mayor Precisión</span>
                  <Badge className="bg-blue-100 text-blue-700">GPT-4</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Más Económico</span>
                  <Badge className="bg-purple-100 text-purple-700">GPT-3.5 Turbo</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Más Usado</span>
                  <Badge className="bg-orange-100 text-orange-700">GPT-4</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Comparación de Modelos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Modelo</th>
                      <th className="text-left p-2">Requests</th>
                      <th className="text-left p-2">Costo/Request</th>
                      <th className="text-left p-2">Tiempo Resp.</th>
                      <th className="text-left p-2">Tasa Éxito</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">GPT-4</td>
                      <td className="p-2">57,350</td>
                      <td className="p-2">$0.031</td>
                      <td className="p-2">1.2s</td>
                      <td className="p-2 text-green-600">99.8%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Claude 3 Sonnet</td>
                      <td className="p-2">38,240</td>
                      <td className="p-2">$0.018</td>
                      <td className="p-2">0.9s</td>
                      <td className="p-2 text-green-600">99.9%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">GPT-3.5 Turbo</td>
                      <td className="p-2">25,500</td>
                      <td className="p-2">$0.002</td>
                      <td className="p-2">0.7s</td>
                      <td className="p-2 text-green-600">99.5%</td>
                    </tr>
                    <tr>
                      <td className="p-2">Claude 3 Haiku</td>
                      <td className="p-2">6,360</td>
                      <td className="p-2">$0.001</td>
                      <td className="p-2">0.5s</td>
                      <td className="p-2 text-green-600">99.3%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Costos por Modelo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">GPT-4</span>
                  <span className="font-bold">{formatCurrency(1780.45)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Claude 3 Sonnet</span>
                  <span className="font-bold">{formatCurrency(688.32)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">GPT-3.5 Turbo</span>
                  <span className="font-bold">{formatCurrency(51.00)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Claude 3 Haiku</span>
                  <span className="font-bold">{formatCurrency(6.36)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Top Spending Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  Top Empresas (Gasto)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">TechCorp</span>
                  <span className="font-bold text-red-600">{formatCurrency(1250.80)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Empresa ABC</span>
                  <span className="font-bold text-red-600">{formatCurrency(892.45)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">BigCorp</span>
                  <span className="font-bold text-red-600">{formatCurrency(567.20)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">StartupXYZ</span>
                  <span className="font-bold text-red-600">{formatCurrency(136.85)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Cost Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Tendencias de Costo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Este Mes</span>
                  <span className="font-bold">{formatCurrency(metrics.totalCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mes Anterior</span>
                  <span className="font-bold">{formatCurrency(2403.95)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cambio</span>
                  <span className="font-bold text-green-600">+18.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Proyección</span>
                  <span className="font-bold text-blue-600">{formatCurrency(3200.00)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
                Recomendaciones de Optimización
              </CardTitle>
              <CardDescription>
                Sugerencias para optimizar el uso y reducir costos de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50">
                <h4 className="font-semibold text-blue-800">Cambio de Modelo Recomendado</h4>
                <p className="text-sm text-blue-600 mt-1">
                  3 empresas podrían usar Claude 3 Haiku para tareas simples, ahorrando ~$450/mes
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50">
                <h4 className="font-semibold text-green-800">Batch Processing</h4>
                <p className="text-sm text-green-600 mt-1">
                  Implementar procesamiento por lotes podría reducir costos en 15-20%
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50">
                <h4 className="font-semibold text-orange-800">Cache Inteligente</h4>
                <p className="text-sm text-orange-600 mt-1">
                  Sistema de cache para respuestas frecuentes podría ahorrar $200-300/mes
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50">
                <h4 className="font-semibold text-purple-800">Rate Limiting</h4>
                <p className="text-sm text-purple-600 mt-1">
                  Implementar límites inteligentes previene uso excesivo y controla costos
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
