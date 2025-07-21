/**
 * PremiumTestPageEnhanced - VibeThink 1.0
 * 
 * Página de testing mejorada para debugging de variables del sistema,
 * testing de componentes y monitoreo en tiempo real.
 * 
 * URL: /admin/premium-test
 */

import React, { useState, useEffect } from 'react';
import { 
  BunduiPremiumProvider, 
  useBunduiPremium 
} from '@/shared/components/bundui-premium/BunduiPremiumProvider';
import { useAuth } from '@/shared/hooks/hooks/useAuth';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/bundui-premium/components/ui/tabs';
import { Label } from '@/shared/components/bundui-premium/components/ui/label';
import { Switch } from '@/shared/components/bundui-premium/components/ui/switch';
import { Separator } from '@/shared/components/bundui-premium/components/ui/separator';
import { Alert, AlertDescription } from '@/shared/components/bundui-premium/components/ui/alert';

// Panel de Variables del Sistema
const SystemVariablesPanel: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { theme } = useBunduiPremium();
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [showRawData, setShowRawData] = useState(false);

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
      loading: loading
    },
    ui: {
      theme: theme,
      timestamp: timestamp,
      userAgent: navigator.userAgent.slice(0, 60) + '...',
      currentUrl: window.location.href
    },
    environment: {
      mode: process.env.NODE_ENV || 'unknown',
      timestamp: timestamp.split('T')[1].split('.')[0],
      locale: navigator.language
    }
  };

  return (
    <Card className="mb-6 border-2 border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              🔧 System Variables Debug Panel
              <Badge variant="secondary" className="text-xs">LIVE</Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              Variables del sistema actualizándose en tiempo real
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="raw-data" className="text-xs">Raw JSON</Label>
            <Switch 
              id="raw-data"
              checked={showRawData}
              onCheckedChange={setShowRawData}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showRawData ? (
          <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-60">
            {JSON.stringify(systemVars, null, 2)}
          </pre>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Usuario */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">👤 Usuario</h4>
              <div className="space-y-1 text-xs">
                <div><strong>ID:</strong> {systemVars.user.id}</div>
                <div><strong>Email:</strong> {systemVars.user.email}</div>
                <div><strong>Autenticado:</strong> 
                  <Badge variant={systemVars.user.authenticated ? "default" : "destructive"} className="ml-1 text-xs">
                    {systemVars.user.authenticated ? 'Sí' : 'No'}
                  </Badge>
                </div>
                <div><strong>Cargando:</strong> 
                  <Badge variant={systemVars.user.loading ? "secondary" : "outline"} className="ml-1 text-xs">
                    {systemVars.user.loading ? 'Sí' : 'No'}
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
                <div><strong>Timestamp:</strong> {systemVars.environment.timestamp}</div>
                <div><strong>URL:</strong> <code className="text-xs">{systemVars.ui.currentUrl.split('/').pop()}</code></div>
                <div><strong>Navegador:</strong> {systemVars.ui.userAgent}</div>
              </div>
            </div>

            {/* Environment */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">⚙️ Environment</h4>
              <div className="space-y-1 text-xs">
                <div><strong>Modo:</strong> 
                  <Badge variant={systemVars.environment.mode === 'development' ? "secondary" : "default"} className="ml-1 text-xs">
                    {systemVars.environment.mode}
                  </Badge>
                </div>
                <div><strong>Locale:</strong> {systemVars.environment.locale}</div>
                <div><strong>Hora:</strong> {systemVars.environment.timestamp}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente principal del dashboard premium (importar desde el archivo existente)
const ExistingBunduiPremiumDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <Alert>
        <AlertDescription>
          <strong>Dashboard Premium Completo:</strong> Aquí aparecerá todo el contenido del BunduiPremiumDashboard existente
        </AlertDescription>
      </Alert>
      {/* Aquí irá todo el contenido del BunduiPremiumDashboard.tsx existente */}
    </div>
  );
};

// Página principal de test mejorada
const PremiumTestPageEnhanced: React.FC = () => {
  return (
    <BunduiPremiumProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              🧪 Premium Test Page Enhanced
            </h1>
            <p className="text-muted-foreground">
              Página de testing con debugging avanzado y monitoreo de variables del sistema
            </p>
          </div>

          {/* Panel de Debug */}
          <SystemVariablesPanel />
          
          <Separator className="my-6" />

          {/* Dashboard Premium Completo */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">📊 Dashboard Premium Completo</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Todos los componentes premium en funcionamiento con datos en tiempo real
            </p>
          </div>
          
          <ExistingBunduiPremiumDashboard />
        </div>
      </div>
    </BunduiPremiumProvider>
  );
};

export default PremiumTestPageEnhanced;
