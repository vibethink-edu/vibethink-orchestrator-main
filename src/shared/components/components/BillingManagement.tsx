/**
 * Billing Management - Gestión de Facturación desde Super Admin
 * 
 * Panel para gestionar ingresos, pagos, y facturación de todas 
 * las empresas clientes desde el Super Admin
 * 
 * @author AI Pair Platform - Billing Team
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Calendar,
  FileText,
  Download,
  Search,
  Filter,
  Eye
} from 'lucide-react'

interface BillingRecord {
  id: string
  company: string
  companyId: string
  plan: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'overdue' | 'failed'
  billingDate: string
  dueDate: string
  paidDate?: string
  invoiceId: string
  paymentMethod: string
}

interface RevenueMetrics {
  totalMRR: number
  previousMRR: number
  totalARR: number
  averageARPU: number
  churnRate: number
  growthRate: number
  totalCustomers: number
  paidCustomers: number
}

// Mock data - en producción vendría de la base de datos
const mockBillingRecords: BillingRecord[] = [
  {
    id: 'BILL-001',
    company: 'Empresa ABC',
    companyId: 'comp_001',
    plan: 'Professional',
    amount: 299,
    currency: 'USD',
    status: 'paid',
    billingDate: '2025-06-01',
    dueDate: '2025-06-15',
    paidDate: '2025-06-05',
    invoiceId: 'INV-2025-001',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'BILL-002',
    company: 'TechCorp',
    companyId: 'comp_002',
    plan: 'Enterprise',
    amount: 999,
    currency: 'USD',
    status: 'pending',
    billingDate: '2025-06-01',
    dueDate: '2025-06-15',
    invoiceId: 'INV-2025-002',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'BILL-003',
    company: 'StartupXYZ',
    companyId: 'comp_003',
    plan: 'Starter',
    amount: 99,
    currency: 'USD',
    status: 'overdue',
    billingDate: '2025-05-01',
    dueDate: '2025-05-15',
    invoiceId: 'INV-2025-003',
    paymentMethod: 'Credit Card'
  }
]

const mockMetrics: RevenueMetrics = {
  totalMRR: 24750,
  previousMRR: 22100,
  totalARR: 297000,
  averageARPU: 485,
  churnRate: 2.5,
  growthRate: 12.0,
  totalCustomers: 51,
  paidCustomers: 48
}

export function BillingManagement() {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>(mockBillingRecords)
  const [metrics, setMetrics] = useState<RevenueMetrics>(mockMetrics)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'overdue': return 'bg-red-100 text-red-700'
      case 'failed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-3 h-3" />
      case 'pending': return <Clock className="w-3 h-3" />
      case 'overdue': return <AlertTriangle className="w-3 h-3" />
      case 'failed': return <AlertTriangle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = record.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(metrics.totalMRR)}</div>
                <div className="text-xs text-muted-foreground">MRR Total</div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {formatPercentage(metrics.growthRate)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(metrics.totalARR)}</div>
                <div className="text-xs text-muted-foreground">ARR Total</div>
              </div>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(metrics.averageARPU)}</div>
                <div className="text-xs text-muted-foreground">ARPU Promedio</div>
              </div>
              <Building2 className="w-4 h-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{metrics.churnRate}%</div>
                <div className="text-xs text-muted-foreground">Churn Rate</div>
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="billing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="billing">Facturación</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por empresa o factura..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="paid">Pagado</option>
                    <option value="pending">Pendiente</option>
                    <option value="overdue">Vencido</option>
                    <option value="failed">Fallido</option>
                  </select>
                  
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Records */}
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {record.invoiceId}
                        </Badge>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status.toUpperCase()}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm font-semibold">{record.company}</div>
                          <div className="text-xs text-muted-foreground">Plan: {record.plan}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-semibold">
                            {formatCurrency(record.amount, record.currency)}
                          </div>
                          <div className="text-xs text-muted-foreground">{record.paymentMethod}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm">
                            Facturado: {new Date(record.billingDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Vence: {new Date(record.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div>
                          {record.paidDate && (
                            <>
                              <div className="text-sm text-green-600">
                                Pagado: {new Date(record.paidDate).toLocaleDateString()}
                              </div>
                            </>
                          )}
                          {record.status === 'overdue' && (
                            <div className="text-sm text-red-600">
                              Vencido hace {Math.floor((Date.now() - new Date(record.dueDate).getTime()) / (1000 * 60 * 60 * 24))} días
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredRecords.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron registros</h3>
                  <p className="text-muted-foreground">
                    No hay registros de facturación que coincidan con los filtros seleccionados.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Crecimiento de Ingresos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">MRR Actual</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(metrics.totalMRR)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">MRR Anterior</span>
                  <span className="font-bold">
                    {formatCurrency(metrics.previousMRR)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Crecimiento</span>
                  <span className="font-bold text-green-600">
                    {formatPercentage(metrics.growthRate)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(metrics.growthRate * 5, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  Métricas de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Clientes Totales</span>
                  <span className="font-bold">{metrics.totalCustomers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Clientes Pagando</span>
                  <span className="font-bold text-green-600">{metrics.paidCustomers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tasa de Conversión</span>
                  <span className="font-bold">
                    {((metrics.paidCustomers / metrics.totalCustomers) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Churn Rate</span>
                  <span className="font-bold text-red-600">{metrics.churnRate}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Estados de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {billingRecords.filter(r => r.status === 'paid').length}
                  </div>
                  <div className="text-sm text-green-700">Pagados</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {billingRecords.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-700">Pendientes</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {billingRecords.filter(r => r.status === 'overdue').length}
                  </div>
                  <div className="text-sm text-red-700">Vencidos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {billingRecords.filter(r => r.status === 'failed').length}
                  </div>
                  <div className="text-sm text-gray-700">Fallidos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Pagos</CardTitle>
              <CardDescription>
                Procesar pagos pendientes y gestionar métodos de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Gestión de Pagos</h3>
                <p className="text-muted-foreground mb-4">
                  Integración con procesadores de pago en desarrollo
                </p>
                <Button variant="outline">
                  Próximamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes Financieros</CardTitle>
              <CardDescription>
                Genera reportes detallados de ingresos y facturación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  <span>Reporte Mensual</span>
                  <span className="text-xs text-muted-foreground">Ingresos del mes actual</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Calendar className="w-6 h-6" />
                  <span>Reporte Anual</span>
                  <span className="text-xs text-muted-foreground">Resumen del año fiscal</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <TrendingUp className="w-6 h-6" />
                  <span>Análisis de Crecimiento</span>
                  <span className="text-xs text-muted-foreground">Tendencias y proyecciones</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Building2 className="w-6 h-6" />
                  <span>Por Cliente</span>
                  <span className="text-xs text-muted-foreground">Ingresos por empresa</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
