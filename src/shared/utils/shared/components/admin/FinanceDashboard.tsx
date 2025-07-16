/**
 * FinanceDashboard - Dashboard Financiero
 * 
 * Dashboard especializado en métricas financieras, análisis de ingresos,
 * gastos, flujo de caja y proyecciones financieras.
 */

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Receipt,
  Building,
  Users,
  FileText,
  Download,
  Filter
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

interface FinancialMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalExpenses: number;
  monthlyExpenses: number;
  netProfit: number;
  grossMargin: number;
  cashFlow: number;
  burnRate: number;
  runway: number; // months
  arpu: number; // Average Revenue Per User
  ltv: number; // Lifetime Value
  cac: number; // Customer Acquisition Cost
}

interface RevenueStream {
  source: string;
  amount: number;
  percentage: number;
  growth: number;
  recurring: boolean;
}

interface Expense {
  category: string;
  amount: number;
  percentage: number;
  budgeted: number;
  variance: number;
  trend: 'up' | 'down' | 'stable';
}

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  dueDate: string;
  issueDate: string;
  description: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
}

interface BudgetItem {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
  trend: 'over' | 'under' | 'on-track';
}

const FinanceDashboard: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - Financial Metrics
  const financialMetrics: FinancialMetrics = {
    totalRevenue: 2456789,
    monthlyRevenue: 234567,
    totalExpenses: 1678901,
    monthlyExpenses: 156789,
    netProfit: 777888,
    grossMargin: 68.5,
    cashFlow: 445000,
    burnRate: 78000,
    runway: 15,
    arpu: 145.50,
    ltv: 2340.00,
    cac: 89.50
  };

  // Mock data - Revenue Streams
  const revenueStreams: RevenueStream[] = [
    {
      source: 'SaaS Subscriptions',
      amount: 167000,
      percentage: 71.2,
      growth: 12.5,
      recurring: true
    },
    {
      source: 'Professional Services',
      amount: 45000,
      percentage: 19.2,
      growth: 8.3,
      recurring: false
    },
    {
      source: 'Enterprise Licenses',
      amount: 15600,
      percentage: 6.7,
      growth: 22.1,
      recurring: true
    },
    {
      source: 'Training & Support',
      amount: 6967,
      percentage: 2.9,
      growth: -5.2,
      recurring: false
    }
  ];

  // Mock data - Expenses
  const expenses: Expense[] = [
    {
      category: 'Personnel',
      amount: 89000,
      percentage: 56.7,
      budgeted: 85000,
      variance: 4.7,
      trend: 'up'
    },
    {
      category: 'Technology',
      amount: 23400,
      percentage: 14.9,
      budgeted: 25000,
      variance: -6.4,
      trend: 'down'
    },
    {
      category: 'Marketing',
      amount: 18900,
      percentage: 12.0,
      budgeted: 20000,
      variance: -5.5,
      trend: 'down'
    },
    {
      category: 'Operations',
      amount: 12500,
      percentage: 8.0,
      budgeted: 12000,
      variance: 4.2,
      trend: 'up'
    },
    {
      category: 'Legal & Admin',
      amount: 8700,
      percentage: 5.5,
      budgeted: 9000,
      variance: -3.3,
      trend: 'stable'
    },
    {
      category: 'Other',
      amount: 4289,
      percentage: 2.7,
      budgeted: 5000,
      variance: -14.2,
      trend: 'down'
    }
  ];

  // Mock data - Recent Invoices
  const recentInvoices: Invoice[] = [
    {
      id: 'INV-2025-001',
      client: 'TechCorp Solutions',
      amount: 45000,
      status: 'paid',
      dueDate: '2025-07-15',
      issueDate: '2025-06-15',
      description: 'Enterprise SaaS License - Q3 2025'
    },
    {
      id: 'INV-2025-002',
      client: 'Startup Hub',
      amount: 12500,
      status: 'pending',
      dueDate: '2025-07-20',
      issueDate: '2025-07-05',
      description: 'Professional Services - Implementation'
    },
    {
      id: 'INV-2025-003',
      client: 'Global Industries',
      amount: 67800,
      status: 'overdue',
      dueDate: '2025-07-01',
      issueDate: '2025-06-01',
      description: 'Custom Development Package'
    },
    {
      id: 'INV-2025-004',
      client: 'Digital Innovation',
      amount: 23400,
      status: 'draft',
      dueDate: '2025-08-01',
      issueDate: '2025-07-07',
      description: 'Consulting Services - Q3 2025'
    }
  ];

  // Mock data - Recent Transactions
  const recentTransactions: Transaction[] = [
    {
      id: '1',
      date: '2025-07-07',
      description: 'TechCorp Solutions - License Payment',
      category: 'SaaS Revenue',
      amount: 45000,
      type: 'income',
      status: 'completed'
    },
    {
      id: '2',
      date: '2025-07-06',
      description: 'AWS Infrastructure - Monthly Bill',
      category: 'Technology',
      amount: -3450,
      type: 'expense',
      status: 'completed'
    },
    {
      id: '3',
      date: '2025-07-05',
      description: 'Employee Salaries - July 2025',
      category: 'Personnel',
      amount: -78000,
      type: 'expense',
      status: 'completed'
    },
    {
      id: '4',
      date: '2025-07-04',
      description: 'Google Ads - Marketing Campaign',
      category: 'Marketing',
      amount: -2340,
      type: 'expense',
      status: 'completed'
    },
    {
      id: '5',
      date: '2025-07-03',
      description: 'Startup Hub - Service Payment',
      category: 'Professional Services',
      amount: 15600,
      type: 'income',
      status: 'pending'
    }
  ];

  // Mock data - Budget vs Actual
  const budgetItems: BudgetItem[] = [
    {
      category: 'Personnel',
      allocated: 100000,
      spent: 89000,
      remaining: 11000,
      percentage: 89.0,
      trend: 'on-track'
    },
    {
      category: 'Technology',
      allocated: 30000,
      spent: 23400,
      remaining: 6600,
      percentage: 78.0,
      trend: 'under'
    },
    {
      category: 'Marketing',
      allocated: 25000,
      spent: 18900,
      remaining: 6100,
      percentage: 75.6,
      trend: 'under'
    },
    {
      category: 'Operations',
      allocated: 15000,
      spent: 12500,
      remaining: 2500,
      percentage: 83.3,
      trend: 'on-track'
    },
    {
      category: 'Legal & Admin',
      allocated: 10000,
      spent: 8700,
      remaining: 1300,
      percentage: 87.0,
      trend: 'on-track'
    }
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(amount));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-red-100 text-red-800',
      'draft': 'bg-gray-100 text-gray-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTrendColor = (trend: string) => {
    const colors = {
      'up': 'text-red-600',
      'down': 'text-green-600',
      'stable': 'text-gray-600',
      'over': 'text-red-600',
      'under': 'text-green-600',
      'on-track': 'text-blue-600'
    };
    return colors[trend] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finance Dashboard
          </h1>
          <p className="text-gray-600">
            Análisis financiero y métricas de rendimiento económico
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
              <SelectItem value="ytd">Año hasta fecha</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
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

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.monthlyRevenue)}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.monthlyExpenses)}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -3.2% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.netProfit)}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +18.7% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.cashFlow)}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.3% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialMetrics.grossMargin}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +1.2% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runway</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialMetrics.runway}m</div>
            <div className="flex items-center text-xs text-yellow-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -1m vs mes anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Expenses Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <CardDescription>
                  Comparación mensual de ingresos y gastos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Gráfico de Revenue vs Expenses</p>
                    <p className="text-xs text-slate-500">Integración con Chart.js pendiente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Trend</CardTitle>
                <CardDescription>
                  Evolución del flujo de caja en los últimos 12 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Gráfico de Cash Flow</p>
                    <p className="text-xs text-slate-500">Integración con Chart.js pendiente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Últimas transacciones financieras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Streams */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Streams</CardTitle>
                <CardDescription>
                  Desglose de fuentes de ingresos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueStreams.map((stream) => (
                    <div key={stream.source} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {stream.recurring ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-orange-500" />
                          )}
                          <span className="font-medium">{stream.source}</span>
                        </div>
                        <Badge variant={stream.growth > 0 ? 'default' : 'destructive'}>
                          {stream.growth > 0 ? '+' : ''}{stream.growth}%
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(stream.amount)}</div>
                        <div className="text-sm text-gray-500">{stream.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Revenue Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Revenue Metrics</CardTitle>
                <CardDescription>
                  Métricas clave de ingresos y SaaS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(financialMetrics.arpu)}
                      </div>
                      <div className="text-sm text-gray-500">ARPU</div>
                      <div className="text-xs text-gray-400">Average Revenue Per User</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(financialMetrics.ltv)}
                      </div>
                      <div className="text-sm text-gray-500">LTV</div>
                      <div className="text-xs text-gray-400">Lifetime Value</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(financialMetrics.cac)}
                    </div>
                    <div className="text-sm text-gray-500">CAC</div>
                    <div className="text-xs text-gray-400">Customer Acquisition Cost</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg bg-blue-50">
                    <div className="text-2xl font-bold text-blue-600">
                      {(financialMetrics.ltv / financialMetrics.cac).toFixed(1)}:1
                    </div>
                    <div className="text-sm text-gray-500">LTV:CAC Ratio</div>
                    <div className="text-xs text-gray-400">Ideal: 3:1 o superior</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>
                Desglose de gastos por categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{expense.category}</span>
                      <Badge variant={expense.variance > 0 ? 'destructive' : 'default'}>
                        {expense.variance > 0 ? '+' : ''}{expense.variance}% vs budget
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(expense.amount)}</div>
                      <div className="text-sm text-gray-500">
                        {expense.percentage}% • Budget: {formatCurrency(expense.budgeted)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>
                    Facturas recientes y su estado
                  </CardDescription>
                </div>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell className="max-w-xs truncate">{invoice.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual</CardTitle>
              <CardDescription>
                Comparación entre presupuesto asignado y gasto real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgetItems.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.category}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(item.spent)} / {formatCurrency(item.allocated)}
                        </div>
                        <div className={`text-xs ${getTrendColor(item.trend)}`}>
                          {formatCurrency(item.remaining)} remaining • {item.trend}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.trend === 'over' ? 'bg-red-500' : 
                          item.trend === 'on-track' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.percentage}% utilizado
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed bottom-4 right-4 z-50">
          <SystemDebugPanel />
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
