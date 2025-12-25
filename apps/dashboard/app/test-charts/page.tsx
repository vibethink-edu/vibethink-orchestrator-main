/**
 * Página de Testing para Charts Individual
 * Para debuggear por qué no se muestran los charts en el debug panel
 */

import { DashboardLayout } from '@vibethink/ui/components/dashboard-layout';
import { RevenueChart } from '@/shared/components/dashboard/RevenueChart';
import { MetricCard } from '@/shared/components/dashboard/MetricCard';
import { ClientOnly } from '@/shared/components/ClientOnly';

export default function TestChartsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">📊 Charts Test Page</h1>
          <p className="text-muted-foreground mt-2">
            Testing individual chart components to debug rendering issues
          </p>
        </div>

        <div className="space-y-8">
          {/* Test RevenueChart directly */}
          <section>
            <h2 className="text-xl font-semibold mb-4">RevenueChart Component Test</h2>
            <div className="border-2 border-blue-200 p-4 rounded-lg">
              <ClientOnly>
                <RevenueChart />
              </ClientOnly>
            </div>
          </section>

          {/* Test MetricCard directly */}
          <section>
            <h2 className="text-xl font-semibold mb-4">MetricCard Component Test</h2>
            <div className="border-2 border-green-200 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <ClientOnly>
                  <MetricCard
                    title="Test Metric 1"
                    value="123"
                    subtitle="This is working"
                    subtitleColor="text-green-600"
                  />
                  <MetricCard
                    title="Test Metric 2"
                    value="456"
                    subtitle="This should work too"
                    subtitleColor="text-blue-600"
                  />
                  <MetricCard
                    title="Test Metric 3"
                    value="789"
                    subtitle="Another test"
                    subtitleColor="text-purple-600"
                  />
                  <MetricCard
                    title="Test Metric 4"
                    value="999"
                    subtitle="Final test"
                    subtitleColor="text-red-600"
                  />
                </ClientOnly>
              </div>
            </div>
          </section>

          {/* Test both together like in SystemDebugPanel */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Combined Test (Like in Debug Panel)</h2>
            <div className="border-2 border-purple-200 p-4 rounded-lg space-y-4">
              <ClientOnly>
                {/* MetricCards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <MetricCard
                    title="Total Errors"
                    value="0"
                    subtitle="All good"
                    subtitleColor="text-green-600"
                  />
                  <MetricCard
                    title="Memory Usage"
                    value="45 MB"
                    subtitle="Current allocation"
                    subtitleColor="text-blue-600"
                  />
                  <MetricCard
                    title="Active Sessions"
                    value="1"
                    subtitle="Current user"
                    subtitleColor="text-green-600"
                  />
                  <MetricCard
                    title="Uptime"
                    value="123.45ms"
                    subtitle="Since last refresh"
                    subtitleColor="text-gray-600"
                  />
                </div>

                {/* Revenue Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">📈 Revenue Chart Component</h5>
                    <RevenueChart />
                  </div>

                  {/* System Stats Chart */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">🔧 System Stats</h5>
                    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Debug Stats</h3>
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                          Real-time ⚡
                        </div>
                      </div>

                      <div className="h-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 flex items-end justify-between">
                        <div className="flex flex-col items-center flex-1">
                          <div className="w-8 bg-gradient-to-t from-red-500 to-red-300 rounded-t-sm"
                            style={{ height: "20%" }}></div>
                          <div className="text-xs font-semibold mt-2 text-red-600">0</div>
                          <div className="text-xs text-gray-500">Errors</div>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <div className="w-8 bg-gradient-to-t from-green-500 to-green-300 rounded-t-sm"
                            style={{ height: "60%" }}></div>
                          <div className="text-xs font-semibold mt-2 text-green-600">✓</div>
                          <div className="text-xs text-gray-500">Status</div>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <div className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm"
                            style={{ height: "45%" }}></div>
                          <div className="text-xs font-semibold mt-2 text-blue-600">45</div>
                          <div className="text-xs text-gray-500">Memory</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400">System Health</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            🟢 Healthy
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ClientOnly>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
