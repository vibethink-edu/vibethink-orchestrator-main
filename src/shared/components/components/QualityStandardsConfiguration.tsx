/**
 * Componente de Configuración de Estándares de Calidad
 * 
 * Permite a los administradores configurar los estándares de calidad
 * específicos de su empresa según sus necesidades de cumplimiento.
 * 
 * @author AI Pair Platform - Quality Standards Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Settings, 
  FileText, 
  Shield, 
  Building2,
  Save,
  RefreshCw,
  Download
} from 'lucide-react';
import { useCompanyQualityStandards } from '@/shared/hooks/useCompanyQualityStandards';
import { QualityStandard, INDUSTRY_STANDARDS } from '@/types/companyStandards';
import { useAuth } from '@/shared/hooks/useAuth';

interface QualityStandardsConfigurationProps {
  className?: string;
}

export const QualityStandardsConfiguration: React.FC<QualityStandardsConfigurationProps> = ({ 
  className 
}) => {
  const { user, hasPermission } = useAuth();
  const {
    standards,
    complianceStatus,
    loading,
    error,
    setPrimaryStandard,
    addSecondaryStandard,
    removeSecondaryStandard,
    applyIndustryStandards,
    validateCompliance,
    generateComplianceReport,
    refresh
  } = useCompanyQualityStandards();

  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [isApplyingIndustry, setIsApplyingIndustry] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Verificar permisos
  if (!hasPermission('ADMIN')) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No tienes permisos para configurar estándares de calidad.
        </AlertDescription>
      </Alert>
    );
  }

  // Aplicar estándares por industria
  const handleApplyIndustryStandards = async (industry: string) => {
    if (!industry) return;
    
    setIsApplyingIndustry(true);
    try {
      const success = await applyIndustryStandards(industry as keyof typeof INDUSTRY_STANDARDS);
      if (success) {
        await refresh();
      }
    } catch (error) {
      // TODO: log 'Error applying industry standards:' error
    } finally {
      setIsApplyingIndustry(false);
    }
  };

  // Validar cumplimiento
  const handleValidateCompliance = async () => {
    setIsValidating(true);
    try {
      await validateCompliance();
      await refresh();
    } catch (error) {
      // TODO: log 'Error validating compliance:' error
    } finally {
      setIsValidating(false);
    }
  };

  // Generar reporte
  const handleGenerateReport = async (format: 'pdf' | 'excel' | 'html') => {
    setIsGeneratingReport(true);
    try {
      const reportPath = await generateComplianceReport(format);
      // TODO: log `Reporte generado: ${reportPath}`
    } catch (error) {
      // TODO: log 'Error generating report:' error
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Cargando configuración de estándares...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar la configuración: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estándares de Calidad</h2>
          <p className="text-muted-foreground">
            Configura los estándares de calidad y cumplimiento para tu empresa
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleValidateCompliance}
            disabled={isValidating}
          >
            {isValidating ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Validar Cumplimiento
          </Button>
          <Button
            variant="outline"
            onClick={() => handleGenerateReport('pdf')}
            disabled={isGeneratingReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="h-4 w-4 mr-2" />
            Cumplimiento
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Plantillas
          </TabsTrigger>
        </TabsList>

        {/* Configuración */}
        <TabsContent value="configuration" className="space-y-4">
          {/* Estándar Primario */}
          <Card>
            <CardHeader>
              <CardTitle>Estándar Primario</CardTitle>
              <CardDescription>
                El estándar principal que define los requisitos de calidad de tu empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="primary-standard">Estándar Principal</Label>
                <Select
                  value={standards?.primaryStandard || ''}
                  onValueChange={setPrimaryStandard}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Seleccionar estándar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CMMI-ML2">CMMI Level 2 - Managed</SelectItem>
                    <SelectItem value="CMMI-ML3">CMMI Level 3 - Defined</SelectItem>
                    <SelectItem value="CMMI-ML4">CMMI Level 4 - Quantitatively Managed</SelectItem>
                    <SelectItem value="CMMI-ML5">CMMI Level 5 - Optimizing</SelectItem>
                    <SelectItem value="ISO9001">ISO 9001 - Gestión de Calidad</SelectItem>
                    <SelectItem value="ISO14001">ISO 14001 - Gestión Ambiental</SelectItem>
                    <SelectItem value="ISO27001">ISO 27001 - Seguridad de la Información</SelectItem>
                    <SelectItem value="ISO45001">ISO 45001 - Salud y Seguridad Ocupacional</SelectItem>
                    <SelectItem value="ISO20000">ISO 20000 - Gestión de Servicios TI</SelectItem>
                    <SelectItem value="ISO22301">ISO 22301 - Continuidad del Negocio</SelectItem>
                    <SelectItem value="SOC2-TYPE-I">SOC 2 Type I</SelectItem>
                    <SelectItem value="SOC2-TYPE-II">SOC 2 Type II</SelectItem>
                    <SelectItem value="NIST-CSF">NIST Cybersecurity Framework</SelectItem>
                    <SelectItem value="PCI-DSS">PCI DSS</SelectItem>
                    <SelectItem value="HIPAA">HIPAA</SelectItem>
                    <SelectItem value="GDPR">GDPR</SelectItem>
                    <SelectItem value="LGPD">LGPD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {standards?.primaryStandard && (
                <div className="flex items-center space-x-2">
                  <Badge variant="default">
                    {standards.primaryStandard}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Estándar principal activo
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estándares Secundarios */}
          <Card>
            <CardHeader>
              <CardTitle>Estándares Secundarios</CardTitle>
              <CardDescription>
                Estándares adicionales que complementan tu estándar principal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {standards?.secondaryStandards.map((standard) => (
                  <Badge key={standard} variant="secondary" className="flex items-center space-x-2">
                    <span>{standard}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSecondaryStandard(standard)}
                      className="h-4 w-4 p-0"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value) {
                      addSecondaryStandard(value as QualityStandard);
                    }
                  }}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Agregar estándar secundario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CMMI-ML2">CMMI Level 2 - Managed</SelectItem>
                    <SelectItem value="CMMI-ML3">CMMI Level 3 - Defined</SelectItem>
                    <SelectItem value="CMMI-ML4">CMMI Level 4 - Quantitatively Managed</SelectItem>
                    <SelectItem value="CMMI-ML5">CMMI Level 5 - Optimizing</SelectItem>
                    <SelectItem value="ISO9001">ISO 9001 - Gestión de Calidad</SelectItem>
                    <SelectItem value="ISO14001">ISO 14001 - Gestión Ambiental</SelectItem>
                    <SelectItem value="ISO27001">ISO 27001 - Seguridad de la Información</SelectItem>
                    <SelectItem value="ISO45001">ISO 45001 - Salud y Seguridad Ocupacional</SelectItem>
                    <SelectItem value="ISO20000">ISO 20000 - Gestión de Servicios TI</SelectItem>
                    <SelectItem value="ISO22301">ISO 22301 - Continuidad del Negocio</SelectItem>
                    <SelectItem value="SOC2-TYPE-I">SOC 2 Type I</SelectItem>
                    <SelectItem value="SOC2-TYPE-II">SOC 2 Type II</SelectItem>
                    <SelectItem value="NIST-CSF">NIST Cybersecurity Framework</SelectItem>
                    <SelectItem value="PCI-DSS">PCI DSS</SelectItem>
                    <SelectItem value="HIPAA">HIPAA</SelectItem>
                    <SelectItem value="GDPR">GDPR</SelectItem>
                    <SelectItem value="LGPD">LGPD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configuración por Industria */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración por Industria</CardTitle>
              <CardDescription>
                Aplica configuraciones predefinidas según tu industria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(INDUSTRY_STANDARDS).map(([industry, standards]) => (
                  <Card key={industry} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold capitalize">{industry}</h4>
                      <Button
                        size="sm"
                        onClick={() => handleApplyIndustryStandards(industry)}
                        disabled={isApplyingIndustry}
                      >
                        {isApplyingIndustry ? 'Aplicando...' : 'Aplicar'}
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {standards.map((standard) => (
                        <Badge key={standard} variant="outline" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cumplimiento */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Cumplimiento</CardTitle>
              <CardDescription>
                Estado actual del cumplimiento de los estándares configurados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complianceStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        complianceStatus.overallStatus === 'compliant' ? 'default' :
                        complianceStatus.overallStatus === 'in_progress' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {complianceStatus.overallStatus === 'compliant' ? 'Cumpliente' :
                       complianceStatus.overallStatus === 'in_progress' ? 'En Progreso' :
                       'No Cumpliente'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Estado general
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Estándares Individuales</h4>
                    {Object.entries(complianceStatus.standards).map(([standard, data]) => (
                      <div key={standard} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{standard}</span>
                          <div className="text-sm text-muted-foreground">
                            Puntuación: {data.score}%
                          </div>
                        </div>
                        <Badge 
                          variant={
                            data.status === 'compliant' ? 'default' :
                            data.status === 'in_progress' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {data.status === 'compliant' ? 'Cumpliente' :
                           data.status === 'in_progress' ? 'En Progreso' :
                           'No Cumpliente'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Info className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No hay datos de cumplimiento disponibles
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plantillas */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Documentación</CardTitle>
              <CardDescription>
                Plantillas automáticas generadas según tus estándares de calidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Las plantillas se generan automáticamente según los estándares configurados
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Usa DocumentXTR para generar documentación específica
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
