/**
 * Página del Panel de Debug del Sistema
 * 
 * Esta página incluye debugging para sidebar y sistema general
 */

import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout';
import { SystemDebugPanel } from '@/shared/components/bundui-premium';
import { SystemDebugPanelFixed } from '@/shared/components/bundui-premium/components/SystemDebugPanelFixed';
import { ClientOnly } from '@/shared/components/ClientOnly';
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
        
        {/* Original Debug Panel */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Original Debug Panel</h2>
          <ClientOnly>
            <SystemDebugPanel />
          </ClientOnly>
        </div>

        {/* Fixed Debug Panel for Comparison */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Fixed Debug Panel (Charts Always Visible)</h2>
          <ClientOnly>
            <SystemDebugPanelFixed />
          </ClientOnly>
        </div>
      </div>
    </DashboardLayout>
  );
}
