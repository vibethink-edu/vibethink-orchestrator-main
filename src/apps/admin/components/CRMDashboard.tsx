/**
 * CRMDashboard - Dashboard Enterprise Completo
 * 
 * Sistema CRM completo con React + Bundui Premium nativo
 * - Dashboard principal con métricas
 * - Gestión de leads y deals
 * - Pipeline de ventas
 * - Equipo de ventas
 * - Reportes y analytics
 */

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Plus,
  ArrowUpRight,
  Building,
  Target,
  Calendar,
  Phone,
  Mail,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  Settings,
  Menu,
  Home,
  BarChart3,
  Download
} from 'lucide-react';

// Bundui Premium Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/bundui-premium/components/ui/tabs';
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/bundui-premium/components/ui/avatar';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';

// Debug Panel
import SystemDebugPanel from './SystemDebugPanel';

const CRMDashboard: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data simplificado
  const metrics = {
    totalLeads: 1245,
    qualifiedLeads: 456,
    activeDeals: 89,
    revenue: 2456000,
    avgDeal: 34500,
    conversion: 18.5,
    salesCycle: 42,
    closedDeals: 234
  };

  const recentLeads = [
    {
      id: 1,
      name: 'Ana García',
      company: 'TechCorp Solutions',
      email: 'ana@techcorp.com',
      value: 45000,
      status: 'qualified',
      score: 85,
      assignedTo: 'Carlos López',
      lastActivity: '2025-07-07'
    },
    {
      id: 2,
      name: 'Miguel Rodríguez',
      company: 'Innovate Digital',
      email: 'miguel@innovate.es',
      value: 28000,
      status: 'contacted',
      score: 72,
      assignedTo: 'María Fernández',
      lastActivity: '2025-07-06'
    },
    {
      id: 3,
      name: 'Laura Martín',
      company: 'Startup Hub',
      email: 'laura@startup.io',
      value: 67000,
      status: 'proposal',
      score: 91,
      assignedTo: 'Carlos López',
      lastActivity: '2025-07-07'
    }
  ];

  const activeDeals = [
    {
      id: 1,
      title: 'Enterprise CRM Implementation',
      client: 'Global Industries',
      value: 125000,
      stage: 'Negotiation',
      probability: 85,
      expectedClose: '2025-07-15',
      assignedTo: 'Carlos López'
    },
    {
      id: 2,
      title: 'SaaS Platform License',
      client: 'StartupTech',
      value: 45000,
      stage: 'Proposal',
      probability: 70,
      expectedClose: '2025-07-20',
      assignedTo: 'María Fernández'
    },
    {
      id: 3,
      title: 'Digital Transformation',
      client: 'Traditional Corp',
      value: 89000,
      stage: 'Discovery',
      probability: 40,
      expectedClose: '2025-08-01',
      assignedTo: 'Ana Ruiz'
    }
  ];

  const salesTeam = [
    {
      id: 1,
      name: 'Carlos López',
      role: 'Senior Sales Rep',
      leads: 34,
      deals: 12,
      revenue: 567000,
      target: 800000,
      progress: 70.9,
      avatar: '/avatars/carlos.jpg'
    },
    {
      id: 2,
      name: 'María Fernández',
      role: 'Sales Rep',
      leads: 28,
      deals: 9,
      revenue: 423000,
      target: 600000,
      progress: 70.5,
      avatar: '/avatars/maria.jpg'
    },
    {
      id: 3,
      name: 'Ana Ruiz',
      role: 'Sales Rep',
      leads: 31,
      deals: 8,
      revenue: 345000,
      target: 500000,
      progress: 69.0,
      avatar: '/avatars/ana.jpg'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'call',
      title: 'Follow-up call with TechCorp',
      client: 'TechCorp Solutions',
      assignedTo: 'Carlos López',
      dueDate: '2025-07-08',
      status: 'completed',
      priority: 'high'
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Product demo for StartupTech',
      client: 'StartupTech',
      assignedTo: 'María Fernández',
      dueDate: '2025-07-09',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'email',
      title: 'Send proposal to Enterprise Solutions',
      client: 'Enterprise Solutions',
      assignedTo: 'Ana Ruiz',
      dueDate: '2025-07-08',
      status: 'overdue',
      priority: 'urgent'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-green-100 text-green-800',
      'proposal': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed-won': 'bg-green-100 text-green-800',
      'closed-lost': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600',
      'high': 'text-red-600',
      'urgent': 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CRM Enterprise</h1>
                <p className="text-xs text-gray-500">VibeThink Orchestrator</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar leads, deals, contactos..."
                className="pl-10 pr-4"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="12m">Último año</SelectItem>
              </SelectContent>
            </Select>

            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Lead
            </Button>

            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setShowDebug(!showDebug)}>
              <Settings className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/avatars/user.jpg" />
                    <AvatarFallback>CL</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Carlos López</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Gestión completa de relaciones con clientes y pipeline de ventas
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Crear Lead
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metrics.totalLeads)}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12% vs mes anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualified</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.qualifiedLeads}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8% vs mes anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeDeals}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15% vs mes anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +23% vs mes anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.avgDeal)}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +5% vs mes anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversion}%</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.1% vs mes anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales Cycle</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.salesCycle}d</div>
              <div className="flex items-center text-xs text-red-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +3d vs mes anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.closedDeals}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +18% vs mes anterior
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Actividades recientes del equipo de ventas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`mt-1 ${getPriorityColor(activity.priority)}`}>
                          {activity.type === 'call' && <Phone className="h-4 w-4" />}
                          {activity.type === 'email' && <Mail className="h-4 w-4" />}
                          {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {activity.title}
                            </p>
                            <Badge 
                              variant={activity.status === 'completed' ? 'default' : activity.status === 'overdue' ? 'destructive' : 'secondary'}
                              className="ml-2"
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {activity.client} • {activity.assignedTo}
                          </p>
                          <p className="text-xs text-gray-400">
                            Due: {activity.dueDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sales Pipeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Pipeline</CardTitle>
                  <CardDescription>
                    Estado actual del pipeline de ventas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Discovery</span>
                        <span className="text-sm text-gray-500">15 deals • {formatCurrency(450000)}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Proposal</span>
                        <span className="text-sm text-gray-500">8 deals • {formatCurrency(320000)}</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Negotiation</span>
                        <span className="text-sm text-gray-500">5 deals • {formatCurrency(280000)}</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Closing</span>
                        <span className="text-sm text-gray-500">3 deals • {formatCurrency(150000)}</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Leads</CardTitle>
                    <CardDescription>
                      Últimos leads generados y su estado
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lead
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell>{formatCurrency(lead.value)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {lead.score}
                          </div>
                        </TableCell>
                        <TableCell>{lead.assignedTo}</TableCell>
                        <TableCell>{lead.lastActivity}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                              <DropdownMenuItem>Convert to Deal</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Deals</CardTitle>
                    <CardDescription>
                      Deals activos en el pipeline
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead>Expected Close</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeDeals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>
                          <div className="font-medium">{deal.title}</div>
                        </TableCell>
                        <TableCell>{deal.client}</TableCell>
                        <TableCell>{formatCurrency(deal.value)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{deal.stage}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Progress value={deal.probability} className="w-16 h-2 mr-2" />
                            <span className="text-sm">{deal.probability}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{deal.expectedClose}</TableCell>
                        <TableCell>{deal.assignedTo}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                              <DropdownMenuItem>Move Stage</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Team Performance</CardTitle>
                <CardDescription>
                  Rendimiento del equipo de ventas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {salesTeam.map((rep) => (
                    <Card key={rep.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={rep.avatar} />
                            <AvatarFallback>
                              {rep.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{rep.name}</h3>
                            <p className="text-sm text-gray-500">{rep.role}</p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Revenue Progress</span>
                            <span>{rep.progress}%</span>
                          </div>
                          <Progress value={rep.progress} className="h-2" />
                          <div className="text-sm text-gray-500">
                            {formatCurrency(rep.revenue)} / {formatCurrency(rep.target)}
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Leads</div>
                            <div className="font-semibold">{rep.leads}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Deals</div>
                            <div className="font-semibold">{rep.deals}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2025 VibeThink Orchestrator CRM. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reportes
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </footer>
      </main>

      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Debug Panel - CRM Dashboard</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              <SystemDebugPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMDashboard;
