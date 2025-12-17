"use client";

import { DashboardLayout } from '@vibethink/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Smartphone, Tablet, Monitor, Wifi } from 'lucide-react';

export default function MobileTestPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Mobile Responsivity Test</h1>
          <p className="text-muted-foreground">
            Testing sidebar and header responsivity across device sizes
          </p>
        </div>

        {/* Device Testing Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mobile Portrait</CardTitle>
              <Smartphone className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">≤ 768px width</Badge>
                <div className="text-sm text-muted-foreground">
                  <div>✅ Header: Full width sticky</div>
                  <div>✅ Navigation: Universal sidebar</div>
                  <div>✅ Touch targets: 44px min</div>
                  <div>✅ Icons: 18px touch-friendly</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tablet</CardTitle>
              <Tablet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">768px - 1024px</Badge>
                <div className="text-sm text-muted-foreground">
                  <div>✅ Header: Dynamic positioning</div>
                  <div>✅ Navigation: 5rem icon mode</div>
                  <div>✅ Sub-options: Visible indicators</div>
                  <div>✅ Transitions: 200ms smooth</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desktop</CardTitle>
              <Monitor className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">≥ 1024px</Badge>
                <div className="text-sm text-muted-foreground">
                  <div>✅ Header: Left offset sync</div>
                  <div>✅ Navigation: Full features</div>
                  <div>✅ Theme customizer: Full panel</div>
                  <div>✅ Performance: Optimized</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Features Status */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-orange-600" />
              Dashboard Features Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Intelligent Navigation</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>🎯 5rem width in icon mode</div>
                  <div>🎯 Sub-options remain visible</div>
                  <div>🎯 Smooth expand/collapse animations</div>
                  <div>🎯 Context-aware positioning</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Dynamic Header</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>🎯 Real-time sidebar synchronization</div>
                  <div>🎯 Always accessible tools</div>
                  <div>🎯 Mobile-first responsive design</div>
                  <div>🎯 Touch-optimized interactions</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Desktop Testing (≥ 768px)</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Use Theme Customizer to switch between "Default" and "Icon" mode</li>
                  <li>Verify header tools remain accessible during sidebar state changes</li>
                  <li>Check that sidebar width is exactly 5rem (80px) in icon mode</li>
                  <li>Confirm sub-options are visible even in icon mode</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Mobile Testing (&lt; 768px)</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Resize browser window to mobile width or use dev tools</li>
                  <li>Tap sidebar trigger to open sheet overlay</li>
                  <li>Verify touch targets are at least 44px in height</li>
                  <li>Test Theme Customizer in mobile-optimized panel</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Performance Validation</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Check Network tab for CSS optimization</li>
                  <li>Verify smooth animations at 60fps</li>
                  <li>Test on actual mobile devices for touch responsiveness</li>
                  <li>Validate high DPI display crisp rendering</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Long content for scroll testing */}
        <div className="h-[1500px] bg-gradient-to-b from-transparent to-muted/10 flex items-end justify-center rounded-lg border-2 border-dashed border-muted">
          <p className="text-muted-foreground text-sm pb-8">
            Scroll to test sticky header behavior on mobile and desktop
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
