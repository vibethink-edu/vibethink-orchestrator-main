/**
 * SystemDebugPanel - VThink 1.0
 * 
 * Panel de debugging para monitoreo de variables del sistema en tiempo real.
 * Se puede agregar a cualquier página para debugging rápido.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/hooks/useAuth';
import { useBunduiPremium } from '@/shared/components/bundui-premium/BunduiPremiumProvider';

// Componentes UI
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Label } from '@/shared/components/bundui-premium/components/ui/label';
import { Switch } from '@/shared/components/bundui-premium/components/ui/switch';
import { Separator } from '@/shared/components/bundui-premium/components/ui/separator';

interface SystemDebugPanelProps {
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  className?: string;
}

const SystemDebugPanel: React.FC<SystemDebugPanelProps> = ({ 
  collapsed: externalCollapsed = false, 
  onToggle,
  className = ''
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { theme } = useBunduiPremium();
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [showRawData, setShowRawData] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(externalCollapsed);

  const collapsed = onToggle ? externalCollapsed : internalCollapsed;
  const toggleCollapsed = onToggle || setInternalCollapsed;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const systemVars = {
    user: {
      id: user?.id || 'No authenticated',
      email: user?.email || 'No email',
      authenticated: isAuthenticated,
      loading: loading,
      role: user?.profile?.role || 'No role'
    },
    ui: {
      theme: theme,
      timestamp: timestamp,
      userAgent: navigator.userAgent.slice(0, 60) + '...',
      currentUrl: window.location.href,
      language: navigator.language
    },
    environment: {
      mode: process.env.NODE_ENV || 'unknown',
      timestamp: timestamp.split('T')[1].split('.')[0],
      locale: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    performance: {
      memoryUsage: (performance as any).memory ? 
        Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) + ' MB' : 
        'No disponible',
      renderTime: Date.now() % 1000 + 'ms',
      userTiming: performance.now().toFixed(2) + 'ms'
    }
  };

  if (collapsed) {
    return (
      <div className={`fixed top-4 right-4 z-50 ${className}`}>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => toggleCollapsed(false)}
          className="shadow-lg"
        >
          🔧 Debug
          <Badge variant="destructive" className="ml-2 text-xs">
            {systemVars.user.authenticated ? '✅' : '❌'}
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <Card className={`border-2 border-blue-200 bg-blue-50/30 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              🔧 System Debug Panel
              <Badge variant="secondary" className="text-xs animate-pulse">LIVE</Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              Variables del sistema • Actualización automática • {systemVars.environment.timestamp}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="raw-data" className="text-xs">JSON</Label>
            <Switch 
              id="raw-data"
              checked={showRawData}
              onCheckedChange={setShowRawData}
            />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => toggleCollapsed(true)}
              className="h-8 w-8 p-0"
            >
              ✕
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showRawData ? (
          <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-60 font-mono">
            {JSON.stringify(systemVars, null, 2)}
          </pre>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Usuario */}
            <div>
              <h4 className="font-semibold mb-2 text-sm flex items-center gap-1">
                👤 Usuario
                <Badge variant={systemVars.user.authenticated ? "default" : "destructive"} className="text-xs">
                  {systemVars.user.authenticated ? '✅' : '❌'}
                </Badge>
              </h4>
              <div className="space-y-1 text-xs">
                <div><strong>Email:</strong> <code>{systemVars.user.email}</code></div>
                <div><strong>Role:</strong> <Badge variant="outline" className="text-xs">{systemVars.user.role}</Badge></div>
                <div><strong>Loading:</strong> 
                  <Badge variant={systemVars.user.loading ? "secondary" : "outline"} className="ml-1 text-xs">
                    {systemVars.user.loading ? '⏳' : '✅'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* UI State */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">🎨 UI State</h4>
              <div className="space-y-1 text-xs">
                <div><strong>Tema:</strong> 
                  <Badge variant="outline" className="ml-1 text-xs">{systemVars.ui.theme}</Badge>
                </div>
                <div><strong>Lang:</strong> {systemVars.ui.language}</div>
                <div><strong>Route:</strong> <code className="text-xs">/{systemVars.ui.currentUrl.split('/').pop()}</code></div>
              </div>
            </div>

            {/* Environment */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">⚙️ Environment</h4>
              <div className="space-y-1 text-xs">
                <div><strong>Mode:</strong> 
                  <Badge variant={systemVars.environment.mode === 'development' ? "secondary" : "default"} className="ml-1 text-xs">
                    {systemVars.environment.mode}
                  </Badge>
                </div>
                <div><strong>TimeZone:</strong> {systemVars.environment.timeZone.split('/').pop()}</div>
              </div>
            </div>

            {/* Performance */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">📊 Performance</h4>
              <div className="space-y-1 text-xs">
                <div><strong>Memory:</strong> {systemVars.performance.memoryUsage}</div>
                <div><strong>Uptime:</strong> {systemVars.performance.userTiming}</div>
                <div><strong>Last Update:</strong> {systemVars.environment.timestamp}</div>
              </div>
            </div>
          </div>
        )}
        
        <Separator className="my-3" />
        
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => console.log('System Variables:', systemVars)}
            >
              📝 Log to Console
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const data = JSON.stringify(systemVars, null, 2);
                navigator.clipboard.writeText(data);
              }}
            >
              📋 Copy JSON
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Auto-refresh: 1s
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemDebugPanel;
