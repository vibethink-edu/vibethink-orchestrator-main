"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/bundui-premium/components/ui/card';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/bundui-premium/components/ui/tabs';
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/bundui-premium/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/bundui-premium/components/ui/table';
import { useAuth } from '@/shared/hooks/useAuth';

/**
 * @component BunduiDefaultDashboard
 * @description Dashboard desacoplado inspirado en Shadcn UI Kit Default Dashboard.
 * Solo visible para roles ADMIN, OWNER, SUPER_ADMIN. Multi-tenant: filtra por company_id.
 * Cumple VThink 1.0: tipado estricto, imports por alias, preparado para integración y pruebas.
 *
 * @example
 * <BunduiDefaultDashboard companyId="company-123" />
 */
interface BunduiDefaultDashboardProps {
  /** ID de la compañía para filtrar datos (multi-tenant) */
  companyId: string;
}

// Mock de datos desacoplados (en producción, vendrán por props o fetch)
const mockPayments = [
  { customer: 'Kenneth Thompson', email: 'ken99@yahoo.com', amount: 316, status: 'success' },
  { customer: 'Abraham Lincoln', email: 'abe45@gmail.com', amount: 242, status: 'success' },
  { customer: 'Monserrat Rodriguez', email: 'monserrat44@gmail.com', amount: 837, status: 'processing' },
  { customer: 'Silas Johnson', email: 'silas22@gmail.com', amount: 874, status: 'success' },
  { customer: 'Carmella DeVito', email: 'carmella@hotmail.com', amount: 721, status: 'failed' },
  { customer: 'Maria Garcia', email: 'maria@gmail.com', amount: 529, status: 'success' },
  { customer: 'James Wilson', email: 'james34@outlook.com', amount: 438, status: 'processing' },
  { customer: 'Sarah Jones', email: 'sarah.j@yahoo.com', amount: 692, status: 'success' },
];

/**
 * Componente principal del dashboard desacoplado.
 * - Controla acceso por rol.
 * - Filtra datos por companyId (mock).
 * - Preparado para integración real.
 */
const BunduiDefaultDashboard: React.FC<BunduiDefaultDashboardProps> = ({ companyId }) => {
  const { user, hasPermission } = useAuth();

  // Todos los hooks deben ir antes de cualquier return o condicional
  const allowed = hasPermission('ADMIN') || hasPermission('OWNER') || hasPermission('SUPER_ADMIN');

  // Filtrado multi-tenant (mock)
  const payments = useMemo(() => {
    // En real: filtrar por companyId
    return mockPayments;
  }, [companyId]);

  // KPIs mock
  const kpis = useMemo(() => ([
    { label: 'Suscripciones', value: '+4850', change: '+180.1%', description: 'desde el mes pasado' },
    { label: 'Ingresos Totales', value: '$15,231.89', change: '+20.1%', description: 'desde el mes pasado' },
  ]), []);

  // Ahora sí, condicional de render
  if (!allowed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Necesitas permisos de administrador, owner o super admin para acceder al dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard Premium</h1>
          <p className="text-muted-foreground">Panel de control multi-tenant desacoplado, inspirado en Shadcn UI Kit.</p>
        </div>
        <Button>Descargar reporte</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle>{kpi.value}</CardTitle>
              <Badge variant="outline">{kpi.change}</Badge>
            </CardHeader>
            <CardContent>
              <span className="text-xs text-muted-foreground">{kpi.description}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs defaultValue="payments" className="mb-6">
        <TabsList>
          <TabsTrigger value="payments">Pagos recientes</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
        </TabsList>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Últimos Pagos</CardTitle>
              <CardDescription>Pagos procesados recientemente</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{p.customer}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>${p.amount}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'success' ? 'success' : p.status === 'processing' ? 'warning' : 'destructive'}>
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Miembros del equipo</CardTitle>
              <CardDescription>Colaboradores recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {/* Mock de equipo, reemplazar por fetch real */}
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/avatars/1.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Toby Belhome</div>
                    <div className="text-xs text-muted-foreground">Viewer</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/avatars/2.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Jackson Lee</div>
                    <div className="text-xs text-muted-foreground">Developer</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/avatars/3.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Hally Gray</div>
                    <div className="text-xs text-muted-foreground">Viewer</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-8 text-xs text-muted-foreground text-right">
        {/* Footer desacoplado, preparado para internacionalización */}
        Dashboard desacoplado Bundui Premium &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default BunduiDefaultDashboard; 