/**
 * Página Premium Mejorada
 * 
 * Esta página muestra la versión premium del dashboard con funcionalidades avanzadas.
 */

import { DashboardLayout } from '@vibethink/ui/components/dashboard-layout';
// import { BunduiPremiumDashboard } from '@vibethink/bundui-ui'; // TODO: Migrar o remover
// import ShadcnDashboardComplete from '@vibethink/bundui-ui/components/ShadcnDashboardComplete'; // TODO: Migrar o remover
import { ClientOnly } from '@/shared/components/ClientOnly';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vibethink/ui/components/tabs';

export default function PremiumDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">🎨 Bundui Premium Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Dashboard premium con componentes avanzados de Bundui
          </p>
        </div>

        <ClientOnly>
          <Tabs defaultValue="shadcn-complete" className="space-y-4">
            <TabsList>
              <TabsTrigger value="shadcn-complete">📊 Shadcn Complete Dashboard</TabsTrigger>
              <TabsTrigger value="bundui-premium">🎨 Bundui Premium Explorer</TabsTrigger>
            </TabsList>

            <TabsContent value="shadcn-complete" className="space-y-4">
              <div className="border rounded-lg p-4">
                <p className="text-muted-foreground">ShadcnDashboardComplete - TODO: Migrar componente</p>
              </div>
            </TabsContent>

            <TabsContent value="bundui-premium" className="space-y-4">
              <div className="border rounded-lg p-4">
                <p className="text-muted-foreground">BunduiPremiumDashboard - TODO: Migrar componente</p>
              </div>
            </TabsContent>
          </Tabs>
        </ClientOnly>
      </div>
    </DashboardLayout>
  );
}
