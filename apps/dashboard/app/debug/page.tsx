/**
 * Página del Panel de Debug del Sistema
 * 
 * Esta página incluye debugging para sidebar y sistema general
 */

import { DashboardLayout } from '@vibethink/ui/components/dashboard-layout';
import SidebarTestPage from './sidebar-test';

export default function DebugPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Sidebar Debug Test */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">🔧 Sidebar Layout Debug</h2>
          <SidebarTestPage />
        </div>

        {/* Debug Panels - TODO: Migrar desde bundui-ui */}
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Debug Panels</h2>
          <p className="text-muted-foreground">
            SystemDebugPanel components pending migration from @vibethink/bundui-ui
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
