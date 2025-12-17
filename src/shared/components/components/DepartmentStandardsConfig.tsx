/**
 * Componente de Configuración de Estándares por Departamento
 * 
 * Permite configurar qué estándares de calidad aplica cada departamento
 * y si requiere validación automática de documentos.
 * 
 * @author AI Pair Platform - Quality Standards Team
 * @version 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Settings,
  FileText,
  Shield
} from 'lucide-react';
import { useDepartmentStandards } from '@/hooks/useDepartmentStandards';
import { DepartmentStandard, DEPARTMENT_STANDARDS, STANDARD_DESCRIPTIONS } from '@/types/departmentStandards';
import { useAuth } from '@/hooks/useAuth';

interface DepartmentStandardsConfigProps {
  className?: string;
}

export const DepartmentStandardsConfig: React.FC<DepartmentStandardsConfigProps> = ({ 
  className 
}) => {
  const { user, hasPermission } = useAuth();
  const {
    configs,
    loading,
    error,
    enableStandard,
    disableStandard,
    setValidationRequired,
    getDepartmentStandards,
    getStandardDescription
  } = useDepartmentStandards();

  // Verificar permisos
  if (!hasPermission('ADMIN')) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          No tienes permisos para configurar estándares de departamento.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Cargando configuración...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar la configuración: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Estándares por Departamento</h2>
        <p className="text-muted-foreground">
          Configura qué estándares de calidad aplica cada departamento
        </p>
      </div>

      {/* Departamentos */}
      <div className="grid gap-6">
        {Object.entries(DEPARTMENT_STANDARDS).map(([departmentKey, standards]) => (
          <Card key={departmentKey}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {departmentKey.charAt(0).toUpperCase() + departmentKey.slice(1)}
              </CardTitle>
              <CardDescription>
                Estándares disponibles para este departamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {standards.map((standard) => {
                  const config = configs.find(
                    c => c.department_id === departmentKey && c.standard === standard
                  );
                  const isEnabled = config?.enabled || false;
                  const validationRequired = config?.validationRequired || false;

                  return (
                    <div key={standard} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={isEnabled ? "default" : "secondary"}>
                            {standard}
                          </Badge>
                          {isEnabled && (
                            <Badge variant="outline" className="text-xs">
                              {validationRequired ? 'Validación Requerida' : 'Validación Opcional'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getStandardDescription(standard)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Habilitar/Deshabilitar */}
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={async (checked) => {
                              if (checked) {
                                await enableStandard(departmentKey, standard);
                              } else {
                                await disableStandard(departmentKey, standard);
                              }
                            }}
                          />
                          <Label className="text-sm">
                            {isEnabled ? 'Habilitado' : 'Deshabilitado'}
                          </Label>
                        </div>

                        {/* Validación requerida */}
                        {isEnabled && (
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={validationRequired}
                              onCheckedChange={async (checked) => {
                                await setValidationRequired(departmentKey, standard, checked);
                              }}
                            />
                            <Label className="text-sm">
                              Validación Requerida
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">¿Cómo funciona?</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Cada departamento puede habilitar sus propios estándares</li>
                <li>• Al generar documentos, se valida automáticamente según el estándar del departamento</li>
                <li>• Si "Validación Requerida" está activo, el documento debe pasar validación</li>
                <li>• AI Pair Platform usa CMMI-ML3 para todo el desarrollo interno</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Estándares por Departamento</h4>
              <div className="grid gap-2 text-muted-foreground">
                <div><strong>Calidad:</strong> ISO9001, ISO14001, ISO45001</div>
                <div><strong>IT/Seguridad:</strong> ISO27001, SOC2, NIST-CSF</div>
                <div><strong>Financiero:</strong> PCI-DSS, ISO9001</div>
                <div><strong>Salud:</strong> HIPAA, ISO27001, ISO45001</div>
                <div><strong>Legal:</strong> GDPR, LGPD</div>
                <div><strong>Desarrollo (AI Pair):</strong> CMMI-ML3</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
