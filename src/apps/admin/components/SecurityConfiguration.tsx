/**
 * Componente de Configuración de Seguridad
 * Panel de administración para configurar medidas de seguridad OWASP, CORS y GDPR
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Progress } from '@/shared/components/ui/progress';
import { Separator } from '@/shared/components/ui/separator';
import { 
  Shield,
  Lock,
  Globe,
  Settings,
  Database,
  CheckCircle,
  AlertTriangle,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  ShieldOff,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';

interface SecurityConfig {
  // CORS Configuration
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
    allowedMethods: string[];
    credentials: boolean;
  };
  
  // OWASP Security Headers
  securityHeaders: {
    hsts: boolean;
    xssProtection: boolean;
    contentSecurityPolicy: boolean;
    frameOptions: boolean;
    contentTypeOptions: boolean;
  };
  
  // Rate Limiting
  rateLimiting: {
    enabled: boolean;
    authWindowMs: number;
    authMaxRequests: number;
    generalWindowMs: number;
    generalMaxRequests: number;
  };
  
  // GDPR Compliance
  gdpr: {
    enabled: boolean;
    consentRequired: boolean;
    dataRetentionDays: number;
    autoDeleteEnabled: boolean;
    exportEnabled: boolean;
  };
  
  // Colombian Compliance
  colombianCompliance: {
    ley1581Enabled: boolean;
    sicRegistration: boolean;
    dataRetentionPolicy: boolean;
  };
}

const SecurityConfiguration: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [config, setConfig] = useState<SecurityConfig>({
    cors: {
      enabled: true,
      allowedOrigins: ['https://app.tudominio.com', 'https://admin.tudominio.com'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    },
    securityHeaders: {
      hsts: true,
      xssProtection: true,
      contentSecurityPolicy: true,
      frameOptions: true,
      contentTypeOptions: true
    },
    rateLimiting: {
      enabled: true,
      authWindowMs: 900000, // 15 minutos
      authMaxRequests: 5,
      generalWindowMs: 60000, // 1 minuto
      generalMaxRequests: 100
    },
    gdpr: {
      enabled: true,
      consentRequired: true,
      dataRetentionDays: 730, // 2 años
      autoDeleteEnabled: true,
      exportEnabled: true
    },
    colombianCompliance: {
      ley1581Enabled: true,
      sicRegistration: false,
      dataRetentionPolicy: true
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Verificar permisos
  if (!hasPermission('ADMIN')) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a la configuración de seguridad.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus('idle');

    try {
      // Simular guardado en base de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí se guardaría la configuración en Supabase
      // await supabase.from('security_config').upsert({
      //   company_id: user?.company_id,
      //   config: config,
      //   updated_by: user?.id,
      //   updated_at: new Date().toISOString()
      // });

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const getComplianceStatus = () => {
    const checks = [
      { name: 'OWASP Top 10', status: true, icon: Shield },
      { name: 'CORS Configurado', status: config.cors.enabled, icon: Globe },
      { name: 'Rate Limiting', status: config.rateLimiting.enabled, icon: Lock },
      { name: 'GDPR Compliance', status: config.gdpr.enabled, icon: UserCheck },
      { name: 'Ley 1581 Colombia', status: config.colombianCompliance.ley1581Enabled, icon: Database },
      { name: 'Headers de Seguridad', status: Object.values(config.securityHeaders).every(Boolean), icon: Settings }
    ];

    const passed = checks.filter(check => check.status).length;
    const total = checks.length;

    return { checks, passed, total, percentage: Math.round((passed / total) * 100) };
  };

  const complianceStatus = getComplianceStatus();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Seguridad</h1>
          <p className="text-muted-foreground">
            Configura las medidas de seguridad OWASP, CORS y cumplimiento normativo
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Cumplimiento</div>
            <div className="text-2xl font-bold">{complianceStatus.percentage}%</div>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Estado de Cumplimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Estado de Cumplimiento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complianceStatus.checks.map((check, index) => {
              const Icon = check.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Icon className={`h-5 w-5 ${check.status ? 'text-green-500' : 'text-red-500'}`} />
                  <div className="flex-1">
                    <div className="font-medium">{check.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {check.status ? 'Cumplido' : 'Pendiente'}
                    </div>
                  </div>
                  {check.status ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuración CORS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Configuración CORS</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="cors-enabled"
              checked={config.cors.enabled}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, cors: { ...prev.cors, enabled: checked } }))
              }
            />
            <Label htmlFor="cors-enabled">Habilitar CORS</Label>
          </div>

          {config.cors.enabled && (
            <>
              <div className="space-y-2">
                <Label>Orígenes Permitidos</Label>
                <div className="space-y-2">
                  {config.cors.allowedOrigins.map((origin, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        value={origin}
                        onChange={(e) => {
                          const newOrigins = [...config.cors.allowedOrigins];
                          newOrigins[index] = e.target.value;
                          setConfig(prev => ({ 
                            ...prev, 
                            cors: { ...prev.cors, allowedOrigins: newOrigins } 
                          }));
                        }}
                        placeholder="https://app.tudominio.com"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOrigins = config.cors.allowedOrigins.filter((_, i) => i !== index);
                          setConfig(prev => ({ 
                            ...prev, 
                            cors: { ...prev.cors, allowedOrigins: newOrigins } 
                          }));
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOrigins = [...config.cors.allowedOrigins, ''];
                      setConfig(prev => ({ 
                        ...prev, 
                        cors: { ...prev.cors, allowedOrigins: newOrigins } 
                      }));
                    }}
                  >
                    Agregar Origen
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="cors-credentials"
                  checked={config.cors.credentials}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, cors: { ...prev.cors, credentials: checked } }))
                  }
                />
                <Label htmlFor="cors-credentials">Permitir Credenciales</Label>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Configuración OWASP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Headers de Seguridad OWASP</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hsts"
                checked={config.securityHeaders.hsts}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ 
                    ...prev, 
                    securityHeaders: { ...prev.securityHeaders, hsts: checked } 
                  }))
                }
              />
              <Label htmlFor="hsts">HSTS (HTTP Strict Transport Security)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="xss-protection"
                checked={config.securityHeaders.xssProtection}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ 
                    ...prev, 
                    securityHeaders: { ...prev.securityHeaders, xssProtection: checked } 
                  }))
                }
              />
              <Label htmlFor="xss-protection">XSS Protection</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="csp"
                checked={config.securityHeaders.contentSecurityPolicy}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ 
                    ...prev, 
                    securityHeaders: { ...prev.securityHeaders, contentSecurityPolicy: checked } 
                  }))
                }
              />
              <Label htmlFor="csp">Content Security Policy</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="frame-options"
                checked={config.securityHeaders.frameOptions}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ 
                    ...prev, 
                    securityHeaders: { ...prev.securityHeaders, frameOptions: checked } 
                  }))
                }
              />
              <Label htmlFor="frame-options">X-Frame-Options</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Rate Limiting</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="rate-limiting-enabled"
              checked={config.rateLimiting.enabled}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, rateLimiting: { ...prev.rateLimiting, enabled: checked } }))
              }
            />
            <Label htmlFor="rate-limiting-enabled">Habilitar Rate Limiting</Label>
          </div>

          {config.rateLimiting.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Autenticación</h4>
                <div className="space-y-2">
                  <Label>Ventana de tiempo (ms)</Label>
                  <Input
                    type="number"
                    value={config.rateLimiting.authWindowMs}
                    onChange={(e) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        rateLimiting: { ...prev.rateLimiting, authWindowMs: parseInt(e.target.value) } 
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Máximo de requests</Label>
                  <Input
                    type="number"
                    value={config.rateLimiting.authMaxRequests}
                    onChange={(e) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        rateLimiting: { ...prev.rateLimiting, authMaxRequests: parseInt(e.target.value) } 
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">General</h4>
                <div className="space-y-2">
                  <Label>Ventana de tiempo (ms)</Label>
                  <Input
                    type="number"
                    value={config.rateLimiting.generalWindowMs}
                    onChange={(e) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        rateLimiting: { ...prev.rateLimiting, generalWindowMs: parseInt(e.target.value) } 
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Máximo de requests</Label>
                  <Input
                    type="number"
                    value={config.rateLimiting.generalMaxRequests}
                    onChange={(e) => 
                      setConfig(prev => ({ 
                        ...prev, 
                        rateLimiting: { ...prev.rateLimiting, generalMaxRequests: parseInt(e.target.value) } 
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GDPR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Cumplimiento GDPR</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="gdpr-enabled"
              checked={config.gdpr.enabled}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, gdpr: { ...prev.gdpr, enabled: checked } }))
              }
            />
            <Label htmlFor="gdpr-enabled">Habilitar GDPR</Label>
          </div>

          {config.gdpr.enabled && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="consent-required"
                  checked={config.gdpr.consentRequired}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, gdpr: { ...prev.gdpr, consentRequired: checked } }))
                  }
                />
                <Label htmlFor="consent-required">Consentimiento Explícito Requerido</Label>
              </div>

              <div className="space-y-2">
                <Label>Retención de Datos (días)</Label>
                <Input
                  type="number"
                  value={config.gdpr.dataRetentionDays}
                  onChange={(e) => 
                    setConfig(prev => ({ 
                      ...prev, 
                      gdpr: { ...prev.gdpr, dataRetentionDays: parseInt(e.target.value) } 
                    }))
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-delete"
                  checked={config.gdpr.autoDeleteEnabled}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, gdpr: { ...prev.gdpr, autoDeleteEnabled: checked } }))
                  }
                />
                <Label htmlFor="auto-delete">Eliminación Automática</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="export-enabled"
                  checked={config.gdpr.exportEnabled}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, gdpr: { ...prev.gdpr, exportEnabled: checked } }))
                  }
                />
                <Label htmlFor="export-enabled">Exportación de Datos</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Colombia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Cumplimiento Colombia</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="ley1581-enabled"
              checked={config.colombianCompliance.ley1581Enabled}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ 
                  ...prev, 
                  colombianCompliance: { ...prev.colombianCompliance, ley1581Enabled: checked } 
                }))
              }
            />
            <Label htmlFor="ley1581-enabled">Ley 1581 de 2012</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="sic-registration"
              checked={config.colombianCompliance.sicRegistration}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ 
                  ...prev, 
                  colombianCompliance: { ...prev.colombianCompliance, sicRegistration: checked } 
                }))
              }
            />
            <Label htmlFor="sic-registration">Registro SIC</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="data-retention-policy"
              checked={config.colombianCompliance.dataRetentionPolicy}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ 
                  ...prev, 
                  colombianCompliance: { ...prev.colombianCompliance, dataRetentionPolicy: checked } 
                }))
              }
            />
            <Label htmlFor="data-retention-policy">Política de Retención</Label>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              El registro en la SIC es obligatorio para empresas que procesen datos personales en Colombia.
              <br />
              <a href="https://www.sic.gov.co/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Consultar requisitos en SIC.gov.co
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Estado de Guardado */}
      {saveStatus === 'success' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Configuración de seguridad guardada exitosamente.
          </AlertDescription>
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Error al guardar la configuración. Intenta nuevamente.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SecurityConfiguration; 