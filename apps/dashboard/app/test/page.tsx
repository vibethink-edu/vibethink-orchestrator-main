/**
 * Página de Testing Premium Avanzado
 * 
 * Esta página muestra la suite de testing avanzada que creamos
 * para validar componentes premium.
 */

import { DashboardLayout } from '@vibethink/ui/components/dashboard-layout';
// import { PremiumTestPageEnhanced } from '@vibethink/bundui-ui'; // TODO: Migrar o remover
import { ClientOnly } from '@/shared/components/ClientOnly';

export default function TestPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ClientOnly>
          <div className="p-4">
            <p className="text-muted-foreground">PremiumTestPageEnhanced - TODO: Migrar componente</p>
          </div>
        </ClientOnly>
      </div>
    </DashboardLayout>
  );
}
