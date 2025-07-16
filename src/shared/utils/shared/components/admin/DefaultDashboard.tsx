/**
 * DefaultDashboard - Dashboard estándar empresarial
 * 
 * Implementación del dashboard por defecto con layout clásico,
 * métricas básicas y funcionalidades core del negocio.
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  CreditCard,
  DollarSign,
  Activity,
  Calendar,
  Bell,
  Settings,
  Search,
  Filter,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Bundui UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/bundui-premium/components/ui/tabs';
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/bundui-premium/components/ui/avatar';
import { Separator } from '@/shared/components/bundui-premium/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/bundui-premium/components/ui/select';

// Debug Panel
import SystemDebugPanel from './SystemDebugPanel';

interface KPIMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  format: 'currency' | 'number' | 'percentage';
}

interface RecentOrder {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

const DefaultDashboard: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  // Mock KPI Data
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: 45231.89,
      change: 20.1,
      trend: 'up',
      format: 'currency'
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      value: 2350,
      change: -4.3,
      trend: 'down',
      format: 'number'
    },
    {
      id: 'sales',
      label: 'Sales',
      value: 12234,
      change: 19.7,
      trend: 'up',
      format: 'number'
    },
    {
      id: 'active_users',
      label: 'Active Now',
      value: 573,
      change: 8.2,
      trend: 'up',
      format: 'number'
    }
  ]);

  // Mock Recent Orders
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([
    {
      id: 'ORD-001',
      customer: 'Olivia Martin',
      email: 'olivia.martin@email.com',
      amount: 1999.00,
      status: 'processing',
      date: '2025-07-07'
    },
    {
      id: 'ORD-002', 
      customer: 'Jackson Lee',
      email: 'jackson.lee@email.com',
      amount: 399.00,
      status: 'shipped',
      date: '2025-07-06'
    },
    {
      id: 'ORD-003',
      customer: 'Isabella Nguyen',
      email: 'isabella.nguyen@email.com',
      amount: 299.00,
      status: 'delivered',
      date: '2025-07-05'
    },
    {
      id: 'ORD-004',
      customer: 'William Kim',
      email: 'will@email.com',
      amount: 99.00,
      status: 'pending',
      date: '2025-07-07'
    },
    {
      id: 'ORD-005',
      customer: 'Sofia Davis',
      email: 'sofia.davis@email.com',
      amount: 599.00,
      status: 'processing',
      date: '2025-07-06'
    }
  ]);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      processing: { variant: 'default' as const, label: 'Processing' },
      shipped: { variant: 'outline' as const, label: 'Shipped' },
      delivered: { variant: 'default' as const, label: 'Delivered' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Default Dashboard</h1>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-[300px]"
              />
            </div>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
            >
              Debug
            </Button>
            
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Debug Panel */}
        {showDebug && (
          <SystemDebugPanel />
        )}

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiMetrics.map((metric) => (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.label}
                </CardTitle>
                {metric.id === 'revenue' && <DollarSign className="h-4 w-4 text-muted-foreground" />}
                {metric.id === 'subscriptions' && <Users className="h-4 w-4 text-muted-foreground" />}
                {metric.id === 'sales' && <CreditCard className="h-4 w-4 text-muted-foreground" />}
                {metric.id === 'active_users' && <Activity className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatValue(metric.value, metric.format)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Overview Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Monthly revenue and growth metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Chart visualization will be here</p>
                  <p className="text-xs text-muted-foreground mt-2">Revenue: ${kpiMetrics[0]?.value.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                You made {recentOrders.length} sales this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`/avatars/${order.id}.jpg`} alt={order.customer} />
                      <AvatarFallback>{order.customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                    <div className="ml-auto space-y-1 text-right">
                      <div className="text-sm font-medium">
                        +${order.amount.toFixed(2)}
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Month</span>
                  <span className="text-sm font-medium">$12,234</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Target: $16,000</span>
                  <span>75% achieved</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Customers</span>
                  <span className="text-sm font-medium">+24</span>
                </div>
                <Progress value={60} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Target: +40</span>
                  <span>60% achieved</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Progress</span>
                  <span className="text-sm font-medium">18/23</span>
                </div>
                <Progress value={78} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Completion Rate</span>
                  <span>78%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DefaultDashboard;
