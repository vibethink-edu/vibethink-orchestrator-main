/**
 * Página de Testing Premium Avanzado
 * 
 * Esta página muestra la suite de testing avanzada que creamos
 * para validar componentes premium.
 */

import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout';
import { PremiumTestPageEnhanced } from '@/shared/components/bundui-premium';
import { ClientOnly } from '@/shared/components/ClientOnly';

export default function TestPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ClientOnly>
          <PremiumTestPageEnhanced />
        </ClientOnly>
      </div>
    </DashboardLayout>
  );
}
