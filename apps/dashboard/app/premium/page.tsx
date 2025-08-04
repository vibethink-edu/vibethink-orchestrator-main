/**
 * Página Premium Mejorada
 * 
 * Esta página muestra la versión premium del dashboard con funcionalidades avanzadas.
 */

import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout';
import { BunduiPremiumDashboard } from '@/shared/components/bundui-premium';
import ShadcnDashboardComplete from '@/shared/components/bundui-premium/components/ShadcnDashboardComplete';
import { ClientOnly } from '@/shared/components/ClientOnly';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/bundui-premium/components/ui/tabs';

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
              <div className="border rounded-lg">
                <ShadcnDashboardComplete withLayout={false} />
              </div>
            </TabsContent>
            
            <TabsContent value="bundui-premium" className="space-y-4">
              <BunduiPremiumDashboard />
            </TabsContent>
          </Tabs>
        </ClientOnly>
      </div>
    </DashboardLayout>
  );
}
