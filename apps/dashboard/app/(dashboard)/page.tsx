"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/bundui-premium/components/ui/button"
import Card from "@/shared/components/generic/Card"
import Navigation from "@/shared/components/generic/Navigation"
import Chart from "@/shared/components/generic/Chart"
import { useGenericData } from "@/shared/hooks/useGenericData"
import { formatCurrency, formatNumber, formatPercentage } from "@/shared/utils/genericFormatters"
import { Users, DollarSign, Activity, CreditCard, Download, Plus, MessageCircle, TrendingUp, Calendar, UserPlus, CreditCard as PaymentIcon, Home, BarChart3, Settings, User, FileText, Bell } from 'lucide-react'

/**
 * Dashboard Page
 * 
 * ⚠️ IMPORTANTE: Esta página actualmente usa datos MOCK
 * Para integrar con base de datos real:
 * 
 * 1. Reemplazar useGenericData con hooks específicos de BD
 * 2. Implementar autenticación y autorización
 * 3. Agregar filtros por company_id para multi-tenancy
 * 4. Implementar cache y optimización de consultas
 * 
 * Ejemplo de integración con Supabase:
 * ```typescript
 * // Reemplazar useGenericData con hooks específicos
 * const { data: metrics } = useMetrics(user.company_id);
 * const { data: teamMembers } = useTeamMembers(user.company_id);
 * const { data: payments } = usePayments(user.company_id);
 * ```
 */

// Mock data types - Reemplazar con tipos de BD real
interface MetricData {
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface PaymentData {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'success' | 'processing' | 'failed';
  date: string;
}

interface ChartData {
  name: string;
  value: number;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // TODO: Reemplazar con hooks específicos de BD
  // Actualmente usa datos mock - integrar con Supabase/PostgreSQL
  const { data: metrics, loading: metricsLoading } = useGenericData<MetricData[]>({
    endpoint: '/api/metrics',
    initialData: [
      { value: 4850, change: 180.1, changeType: 'increase', period: 'from last month' },
      { value: 15231.89, change: 20.1, changeType: 'increase', period: 'from last month' },
      { value: 2350, change: 0, changeType: 'increase', period: 'Your exercise minutes are ahead' },
      { value: 573, change: 201, changeType: 'increase', period: 'from last month' }
    ],
    autoFetch: false
  });

  const { data: teamMembers, loading: teamLoading } = useGenericData<TeamMember[]>({
    endpoint: '/api/team',
    initialData: [
      { id: '1', name: 'Toby Belhome', email: 'hello@tobybelhome.com', role: 'Viewer', avatar: 'TB' },
      { id: '2', name: 'Jackson Lee', email: 'pre@example.com', role: 'Developer', avatar: 'JL' },
      { id: '3', name: 'Hally Gray', email: 'hally@site.com', role: 'Viewer', avatar: 'HG' }
    ],
    autoFetch: false
  });

  const { data: payments, loading: paymentsLoading } = useGenericData<PaymentData[]>({
    endpoint: '/api/payments',
    initialData: [
      { id: '1', customer: 'Kenneth Thompson', email: 'ken99@yahoo.com', amount: 316.00, status: 'success', date: '2025-08-06' },
      { id: '2', customer: 'Abraham Lincoln', email: 'abe45@gmail.com', amount: 242.00, status: 'success', date: '2025-08-06' },
      { id: '3', customer: 'Monserrat Rodriguez', email: 'monserrat44@gmail.com', amount: 837.00, status: 'processing', date: '2025-08-06' },
      { id: '4', customer: 'Silas Johnson', email: 'silas22@gmail.com', amount: 874.00, status: 'success', date: '2025-08-06' }
    ],
    autoFetch: false
  });

  // Mock chart data - Reemplazar con datos de BD real
  const subscriptionsChartData: ChartData[] = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1400 },
    { name: 'Mar', value: 1600 },
    { name: 'Apr', value: 1800 },
    { name: 'May', value: 2200 },
    { name: 'Jun', value: 2400 },
    { name: 'Jul', value: 2600 },
    { name: 'Aug', value: 4850 }
  ];

  const revenueChartData: ChartData[] = [
    { name: 'Jan', value: 8000 },
    { name: 'Feb', value: 9200 },
    { name: 'Mar', value: 10800 },
    { name: 'Apr', value: 12400 },
    { name: 'May', value: 13600 },
    { name: 'Jun', value: 14400 },
    { name: 'Jul', value: 14800 },
    { name: 'Aug', value: 15231.89 }
  ];

  const metricIcons = [Users, DollarSign, Activity, TrendingUp];
  const metricTitles = ['Subscriptions', 'Total Revenue', 'Exercise Minutes', 'Latest Activity'];

  // Navigation items for sidebar
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4" />,
      href: '/dashboard'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      href: '/analytics'
    },
    {
      id: 'team',
      label: 'Team',
      icon: <User className="h-4 w-4" />,
      href: '/team'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="h-4 w-4" />,
      href: '/documents'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-4 w-4" />,
      badge: 3,
      href: '/notifications'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      href: '/settings'
    }
  ];

  const handleNavigationClick = (item: any) => {
    console.log('Navigation clicked:', item);
    // TODO: Implement navigation logic
  };

  // Prevent hydration mismatch by not rendering inputs until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-sm text-muted-foreground">10 Jul 2025 - 06 Aug 2025</p>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics?.map((metric, index) => {
              const IconComponent = metricIcons[index];
              const title = metricTitles[index];
              
              return (
                <Card
                  key={index}
                  variant="metric"
                  title={title}
                  icon={<IconComponent className="h-4 w-4 text-muted-foreground" />}
                >
                  <div className="text-2xl font-bold">
                    {index === 1 ? formatCurrency(metric.value) : formatNumber(metric.value, { prefix: '+' })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metric.change > 0 ? '+' : ''}{formatPercentage(metric.change)} {metric.period}
                  </p>
                </Card>
              );
            })}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Chart
              variant="line"
              data={subscriptionsChartData}
              title="Subscriptions Growth"
              subtitle="Monthly subscription growth over time"
              height={250}
              formatValue={(value) => formatNumber(value)}
            />
            <Chart
              variant="line"
              data={revenueChartData}
              title="Total Revenue"
              subtitle="Monthly revenue trends"
              height={250}
              formatValue={(value) => formatCurrency(value)}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card
              variant="team"
              title="Team Members"
              subtitle="Invite your team members to collaborate."
              icon={<Users className="h-5 w-5" />}
            >
              {teamMembers?.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{member.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {member.role}
                  </span>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </Card>
            <Card
              variant="chat"
              title="Sofia Davis"
              subtitle="m@example.com"
              icon={<MessageCircle className="h-5 w-5" />}
            >
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">SD</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">Hi, how can I help you today?</p>
                    <p className="text-xs text-muted-foreground">2 min ago</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="flex-1 max-w-[80%]">
                    <p className="text-sm bg-primary text-primary-foreground p-2 rounded-lg">
                      Hey, I'm having trouble with my account.
                    </p>
                    <p className="text-xs text-muted-foreground text-right">1 min ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">SD</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">What seems to be the problem?</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 border rounded-md text-sm bg-muted">
                    <span className="text-muted-foreground">Type your message...</span>
                  </div>
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card
              variant="payment"
              title="Latest Payments"
              icon={<CreditCard className="h-5 w-5" />}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium">Customer</th>
                      <th className="text-left py-3 font-medium">Email</th>
                      <th className="text-left py-3 font-medium">Amount</th>
                      <th className="text-left py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {payments?.map((payment) => (
                      <tr key={payment.id}>
                        <td className="py-3">{payment.customer}</td>
                        <td className="py-3 text-muted-foreground">{payment.email}</td>
                        <td className="py-3 font-medium">{formatCurrency(payment.amount)}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            payment.status === 'success' 
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 text-sm text-muted-foreground">
                  0 of 16 row(s) selected.
                </div>
              </div>
            </Card>
            <Card
              variant="form"
              title="Payment Method"
              subtitle="Add a new payment method to your account."
              icon={<PaymentIcon className="h-5 w-5" />}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm">Card</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <span className="text-sm font-semibold">Paypal</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <span className="text-sm font-semibold">Apple</span>
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Name on the card</label>
                    <div className="w-full mt-1 px-3 py-2 border rounded-md bg-muted">
                      <span className="text-muted-foreground">Enter card holder name</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">City</label>
                    <div className="w-full mt-1 px-3 py-2 border rounded-md bg-muted">
                      <span className="text-muted-foreground">Enter city</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Card number</label>
                  <div className="w-full mt-1 px-3 py-2 border rounded-md bg-muted">
                    <span className="text-muted-foreground">1234 5678 9012 3456</span>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Expires</label>
                    <div className="w-full mt-1 px-3 py-2 border rounded-md bg-muted">
                      <span className="text-muted-foreground">Month</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <div className="w-full mt-1 px-3 py-2 border rounded-md bg-muted">
                      <span className="text-muted-foreground">Year</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">CVC</label>
                    <div className="w-full mt-1 px-3 py-2 border rounded-md bg-muted">
                      <span className="text-muted-foreground">123</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Continue</Button>
              </div>
            </Card>
          </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-sm text-muted-foreground">10 Jul 2025 - 06 Aug 2025</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics?.map((metric, index) => {
            const IconComponent = metricIcons[index];
            const title = metricTitles[index];
            
            return (
              <Card
                key={index}
                variant="metric"
                title={title}
                icon={<IconComponent className="h-4 w-4 text-muted-foreground" />}
              >
                <div className="text-2xl font-bold">
                  {index === 1 ? formatCurrency(metric.value) : formatNumber(metric.value, { prefix: '+' })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.change > 0 ? '+' : ''}{formatPercentage(metric.change)} {metric.period}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Chart
            variant="line"
            data={subscriptionsChartData}
            title="Subscriptions Growth"
            subtitle="Monthly subscription growth over time"
            height={250}
            formatValue={(value) => formatNumber(value)}
          />
          <Chart
            variant="line"
            data={revenueChartData}
            title="Total Revenue"
            subtitle="Monthly revenue trends"
            height={250}
            formatValue={(value) => formatCurrency(value)}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Team Members */}
          <Card
            variant="team"
            title="Team Members"
            subtitle="Invite your team members to collaborate."
            icon={<Users className="h-5 w-5" />}
          >
            {teamMembers?.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{member.avatar}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {member.role}
                </span>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </Card>

          {/* Chat Section */}
          <Card
            variant="chat"
            title="Sofia Davis"
            subtitle="m@example.com"
            icon={<MessageCircle className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">SD</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">Hi, how can I help you today?</p>
                  <p className="text-xs text-muted-foreground">2 min ago</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <div className="flex-1 max-w-[80%]">
                  <p className="text-sm bg-primary text-primary-foreground p-2 rounded-lg">
                    Hey, I'm having trouble with my account.
                  </p>
                  <p className="text-xs text-muted-foreground text-right">1 min ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">SD</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">What seems to be the problem?</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button size="sm">Send</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Latest Payments */}
          <Card
            variant="payment"
            title="Latest Payments"
            icon={<CreditCard className="h-5 w-5" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Customer</th>
                    <th className="text-left py-3 font-medium">Email</th>
                    <th className="text-left py-3 font-medium">Amount</th>
                    <th className="text-left py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments?.map((payment) => (
                    <tr key={payment.id}>
                      <td className="py-3">{payment.customer}</td>
                      <td className="py-3 text-muted-foreground">{payment.email}</td>
                      <td className="py-3 font-medium">{formatCurrency(payment.amount)}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          payment.status === 'success' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-sm text-muted-foreground">
                0 of 16 row(s) selected.
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card
            variant="form"
            title="Payment Method"
            subtitle="Add a new payment method to your account."
            icon={<PaymentIcon className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <CreditCard className="h-6 w-6" />
                <span className="text-sm">Card</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <span className="text-sm font-semibold">Paypal</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <span className="text-sm font-semibold">Apple</span>
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Name on the card</label>
                  <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="text-sm font-medium">City</label>
                  <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Card number</label>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456"
                  className="w-full mt-1 px-3 py-2 border rounded-md" 
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Expires</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option>Month</option>
                    <option>01</option>
                    <option>02</option>
                    <option>03</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option>Year</option>
                    <option>2025</option>
                    <option>2026</option>
                    <option>2027</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    className="w-full mt-1 px-3 py-2 border rounded-md" 
                  />
                </div>
              </div>
              <Button className="w-full">Continue</Button>
            </div>
          </Card>
        </div>
    </div>
  );
} 