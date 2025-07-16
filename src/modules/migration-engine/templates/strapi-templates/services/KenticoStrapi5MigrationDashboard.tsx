/**
 * Dashboard para Migración Kentico v9-v12 → Strapi 5
 * 
 * Interfaz completa para gestionar migraciones con plantillas integradas
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Separator } from '@/shared/components/ui/separator';
import { 
  Play, 
  Settings, 
  Database, 
  FileText, 
  ShoppingCart, 
  Users, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Shield,
  Globe,
  Bell,
  Activity,
  TrendingUp
} from 'lucide-react';

import { KenticoToStrapi5Service } from './KenticoToStrapi5Service';
import { StrapiTemplateService } from './StrapiTemplateService';

interface MigrationConfig {
  kenticoVersion: 'v9' | 'v10' | 'v11' | 'v12';
  strapiVersion: 'v5';
  templateId?: string;
  customizations?: Record<string, any>;
  seoEnhancement?: boolean;
  aiTranslation?: boolean;
  schemaGeneration?: boolean;
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
  serverless?: boolean;
  edgeFunctions?: boolean;
  notifications?: boolean;
  monitoring?: boolean;
  analytics?: boolean;
}

interface MigrationStats {
  totalItems: number;
  pages: number;
  articles: number;
  products: number;
  blogPosts: number;
  migrationDate: string;
  strapiVersion: string;
  features: Record<string, boolean>;
}

export const KenticoStrapi5MigrationDashboard: React.FC = () => {
  
  const [migrationService] = useState(new KenticoToStrapi5Service());
  const [templateService] = useState(new StrapiTemplateService('v5'));
  
  const [config, setConfig] = useState<MigrationConfig>({
    kenticoVersion: 'v12',
    strapiVersion: 'v5',
    templateId: 'hero-focused-home-v5',
    seoEnhancement: true,
    aiTranslation: true,
    schemaGeneration: true,
    customFields: true,
    workflows: true,
    realTime: true,
    versioning: true,
    scheduling: true,
    multiTenancy: true,
    serverless: true,
    edgeFunctions: true,
    notifications: true,
    monitoring: true,
    analytics: true
  });
  
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStats, setMigrationStats] = useState<MigrationStats | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  useEffect(() => {
    loadTemplates();
  }, []);
  
  const loadTemplates = async () => {
    try {
      const templates = templateService.getCompatibleTemplates();
      setAvailableTemplates(templates);
      
      if (templates.length > 0) {
        setSelectedTemplate(templates[0]);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };
  
  const handleConfigChange = (key: keyof MigrationConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const validateConfig = (): { isValid: boolean; errors: string[] } => {
    return migrationService.validateMigrationConfig(config);
  };
  
  const startMigration = async () => {
    const validation = validateConfig();
    if (!validation.isValid) {
      setMigrationError(validation.errors.join(', '));
      return;
    }
    
    setIsMigrating(true);
    setMigrationProgress(0);
    setMigrationError(null);
    setMigrationLogs([]);
    
    try {
      // Simular progreso de migración
      const progressInterval = setInterval(() => {
        setMigrationProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      
      // Ejecutar migración
      const result = await migrationService.migrateKenticoToStrapi5(config);
      
      // Obtener estadísticas
      const stats = migrationService.getMigrationStats(result);
      setMigrationStats(stats);
      
      setMigrationLogs(prev => [...prev, '✅ Migración completada exitosamente']);
      
    } catch (error) {
      setMigrationError(error.message);
      setMigrationLogs(prev => [...prev, `❌ Error: ${error.message}`]);
    } finally {
      setIsMigrating(false);
    }
  };
  
  const getFeatureIcon = (feature: string) => {
    const icons = {
      customFields: <Database className="h-4 w-4" />,
      workflows: <FileText className="h-4 w-4" />,
      realTime: <Zap className="h-4 w-4" />,
      versioning: <Clock className="h-4 w-4" />,
      scheduling: <Clock className="h-4 w-4" />,
      multiTenancy: <Globe className="h-4 w-4" />,
      serverless: <Zap className="h-4 w-4" />,
      edgeFunctions: <Zap className="h-4 w-4" />,
      notifications: <Bell className="h-4 w-4" />,
      monitoring: <Activity className="h-4 w-4" />,
      analytics: <TrendingUp className="h-4 w-4" />
    };
    return icons[feature] || <Settings className="h-4 w-4" />;
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Migración Kentico → Strapi 5</h1>
          <p className="text-muted-foreground">
            Migra contenido de Kentico v9-v12 a Strapi 5 con plantillas integradas
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Strapi 5 Ready
        </Badge>
      </div>
      
      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuration">Configuración</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="features">Características</TabsTrigger>
          <TabsTrigger value="migration">Migración</TabsTrigger>
        </TabsList>
        
        {/* Configuración */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Migración</CardTitle>
              <CardDescription>
                Configura los parámetros básicos de la migración
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kenticoVersion">Versión de Kentico</Label>
                  <Select 
                    value={config.kenticoVersion} 
                    onValueChange={(value) => handleConfigChange('kenticoVersion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v9">Kentico v9</SelectItem>
                      <SelectItem value="v10">Kentico v10</SelectItem>
                      <SelectItem value="v11">Kentico v11</SelectItem>
                      <SelectItem value="v12">Kentico v12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strapiVersion">Versión de Strapi</Label>
                  <Input 
                    id="strapiVersion" 
                    value={config.strapiVersion} 
                    disabled 
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="templateId">Plantilla (Opcional)</Label>
                <Select 
                  value={config.templateId} 
                  onValueChange={(value) => handleConfigChange('templateId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mejoras Automáticas</CardTitle>
              <CardDescription>
                Habilita mejoras automáticas durante la migración
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mejoras de SEO</Label>
                  <p className="text-sm text-muted-foreground">
                    Optimiza automáticamente el SEO del contenido migrado
                  </p>
                </div>
                <Switch 
                  checked={config.seoEnhancement} 
                  onCheckedChange={(checked) => handleConfigChange('seoEnhancement', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Traducción con IA</Label>
                  <p className="text-sm text-muted-foreground">
                    Traduce contenido usando inteligencia artificial
                  </p>
                </div>
                <Switch 
                  checked={config.aiTranslation} 
                  onCheckedChange={(checked) => handleConfigChange('aiTranslation', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Generación de Schema</Label>
                  <p className="text-sm text-muted-foreground">
                    Genera automáticamente schema markup estructurado
                  </p>
                </div>
                <Switch 
                  checked={config.schemaGeneration} 
                  onCheckedChange={(checked) => handleConfigChange('schemaGeneration', checked)}
                />
              </div>
              
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Plantillas */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas Disponibles</CardTitle>
              <CardDescription>
                Plantillas optimizadas para Strapi 5 con características avanzadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTemplates.map(template => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {template.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {template.seoOptimized && <Badge variant="secondary">SEO</Badge>}
                        {template.mobileResponsive && <Badge variant="secondary">Mobile</Badge>}
                        <Badge variant="secondary">Strapi 5</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Características */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Características de Strapi 5</CardTitle>
              <CardDescription>
                Habilita las características avanzadas de Strapi 5
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Contenido</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('customFields')}
                      <div>
                        <Label className="text-sm">Custom Fields</Label>
                        <p className="text-xs text-muted-foreground">Campos personalizados avanzados</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.customFields} 
                      onCheckedChange={(checked) => handleConfigChange('customFields', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('workflows')}
                      <div>
                        <Label className="text-sm">Workflows</Label>
                        <p className="text-xs text-muted-foreground">Flujos de trabajo de contenido</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.workflows} 
                      onCheckedChange={(checked) => handleConfigChange('workflows', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('versioning')}
                      <div>
                        <Label className="text-sm">Versioning</Label>
                        <p className="text-xs text-muted-foreground">Control de versiones automático</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.versioning} 
                      onCheckedChange={(checked) => handleConfigChange('versioning', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('scheduling')}
                      <div>
                        <Label className="text-sm">Scheduling</Label>
                        <p className="text-xs text-muted-foreground">Programación de contenido</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.scheduling} 
                      onCheckedChange={(checked) => handleConfigChange('scheduling', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Infraestructura</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('realTime')}
                      <div>
                        <Label className="text-sm">Real-Time</Label>
                        <p className="text-xs text-muted-foreground">Actualizaciones en tiempo real</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.realTime} 
                      onCheckedChange={(checked) => handleConfigChange('realTime', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('multiTenancy')}
                      <div>
                        <Label className="text-sm">Multi-Tenancy</Label>
                        <p className="text-xs text-muted-foreground">Arquitectura multi-tenant</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.multiTenancy} 
                      onCheckedChange={(checked) => handleConfigChange('multiTenancy', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('serverless')}
                      <div>
                        <Label className="text-sm">Serverless</Label>
                        <p className="text-xs text-muted-foreground">Despliegue serverless</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.serverless} 
                      onCheckedChange={(checked) => handleConfigChange('serverless', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('edgeFunctions')}
                      <div>
                        <Label className="text-sm">Edge Functions</Label>
                        <p className="text-xs text-muted-foreground">Funciones edge para performance</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.edgeFunctions} 
                      onCheckedChange={(checked) => handleConfigChange('edgeFunctions', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Monitoreo</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('notifications')}
                      <div>
                        <Label className="text-sm">Notifications</Label>
                        <p className="text-xs text-muted-foreground">Sistema de notificaciones</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.notifications} 
                      onCheckedChange={(checked) => handleConfigChange('notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('monitoring')}
                      <div>
                        <Label className="text-sm">Monitoring</Label>
                        <p className="text-xs text-muted-foreground">Monitoreo avanzado</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.monitoring} 
                      onCheckedChange={(checked) => handleConfigChange('monitoring', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFeatureIcon('analytics')}
                      <div>
                        <Label className="text-sm">Analytics</Label>
                        <p className="text-xs text-muted-foreground">Analytics integrado</p>
                      </div>
                    </div>
                    <Switch 
                      checked={config.analytics} 
                      onCheckedChange={(checked) => handleConfigChange('analytics', checked)}
                    />
                  </div>
                </div>
                
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Migración */}
        <TabsContent value="migration" className="space-y-6">
          
          {/* Estado de Migración */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Migración</CardTitle>
              <CardDescription>
                Monitorea el progreso de la migración
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {isMigrating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progreso de migración</span>
                    <span>{migrationProgress}%</span>
                  </div>
                  <Progress value={migrationProgress} className="w-full" />
                </div>
              )}
              
              {migrationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{migrationError}</AlertDescription>
                </Alert>
              )}
              
              {migrationStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{migrationStats.totalItems}</div>
                    <div className="text-xs text-muted-foreground">Total Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{migrationStats.pages}</div>
                    <div className="text-xs text-muted-foreground">Páginas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{migrationStats.articles}</div>
                    <div className="text-xs text-muted-foreground">Artículos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{migrationStats.products}</div>
                    <div className="text-xs text-muted-foreground">Productos</div>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={startMigration} 
                disabled={isMigrating}
                className="w-full"
              >
                {isMigrating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Migrando...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar Migración
                  </>
                )}
              </Button>
              
            </CardContent>
          </Card>
          
          {/* Logs de Migración */}
          {migrationLogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Logs de Migración</CardTitle>
                <CardDescription>
                  Registro detallado del proceso de migración
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {migrationLogs.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Estadísticas de Características */}
          {migrationStats && (
            <Card>
              <CardHeader>
                <CardTitle>Características Habilitadas</CardTitle>
                <CardDescription>
                  Características de Strapi 5 activas en la migración
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(migrationStats.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center space-x-2">
                      {enabled ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
        </TabsContent>
      </Tabs>
      
    </div>
  );
};

export default KenticoStrapi5MigrationDashboard; 