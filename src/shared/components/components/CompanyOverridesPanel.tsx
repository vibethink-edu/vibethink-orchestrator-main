
import React, { useState } from 'react';
import { usePlatformConfigurations } from '@/hooks/usePlatformConfigurations';
import { ConfigurationTable } from './ConfigurationTable';
import { AuditLogTable } from './AuditLogTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';

export const CompanyOverridesPanel = () => {
  const { 
    overrides, 
    auditLog, 
    createOverride, 
    deleteOverride,
    isCreatingOverride,
    isDeletingOverride,
    loading 
  } = usePlatformConfigurations();

  const [formData, setFormData] = useState({
    company_id: '',
    category: '',
    config_key: '',
    override_value: '',
    reason: '',
    expires_at: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let parsedValue;
    try {
      parsedValue = JSON.parse(formData.override_value);
    } catch {
      parsedValue = formData.override_value;
    }

    createOverride({
      ...formData,
      override_value: parsedValue,
      expires_at: formData.expires_at || undefined
    });

    // Reset form
    setFormData({
      company_id: '',
      category: '',
      config_key: '',
      override_value: '',
      reason: '',
      expires_at: ''
    });
  };

  const handleDeleteOverride = (overrideId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este override?')) {
      deleteOverride(overrideId);
    }
  };

  const formatValue = (value: any) => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ai_models: 'bg-blue-100 text-blue-800',
      integrations: 'bg-green-100 text-green-800',
      limits: 'bg-orange-100 text-orange-800',
      features: 'bg-purple-100 text-purple-800',
      security: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando overrides...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overrides" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overrides">Overrides Activos</TabsTrigger>
          <TabsTrigger value="new">Nuevo Override</TabsTrigger>
          <TabsTrigger value="audit">Log de Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="overrides" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overrides por Empresa</CardTitle>
              <CardDescription>
                Configuraciones específicas que sobrescriben las globales para empresas individuales
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overrides?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay overrides configurados
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Clave</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Razón</TableHead>
                      <TableHead>Expira</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overrides?.map((override) => (
                      <TableRow key={override.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{override.companies?.name}</div>
                            <div className="text-xs text-gray-500">{override.companies?.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(override.category)}>
                            {override.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {override.config_key}
                        </TableCell>
                        <TableCell>
                          <pre className="text-xs bg-gray-50 p-2 rounded max-w-xs overflow-auto">
                            {formatValue(override.override_value)}
                          </pre>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {override.reason}
                        </TableCell>
                        <TableCell>
                          {override.expires_at 
                            ? new Date(override.expires_at).toLocaleDateString()
                            : 'Nunca'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={override.is_active ? 'default' : 'secondary'}>
                            {override.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOverride(override.id)}
                            disabled={isDeletingOverride}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Override de Empresa</CardTitle>
              <CardDescription>
                Crear configuración específica que sobrescribe la global para una empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_id">ID de Empresa</Label>
                    <Input
                      id="company_id"
                      value={formData.company_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value }))}
                      placeholder="UUID de la empresa"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ai_models">Modelos de IA</SelectItem>
                        <SelectItem value="integrations">Integraciones</SelectItem>
                        <SelectItem value="limits">Límites</SelectItem>
                        <SelectItem value="features">Características</SelectItem>
                        <SelectItem value="security">Seguridad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="config_key">Clave de Configuración</Label>
                    <Input
                      id="config_key"
                      value={formData.config_key}
                      onChange={(e) => setFormData(prev => ({ ...prev, config_key: e.target.value }))}
                      placeholder="ej: openai_models"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="expires_at">Fecha de Expiración (opcional)</Label>
                    <Input
                      id="expires_at"
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="override_value">Valor Override (JSON)</Label>
                  <Textarea
                    id="override_value"
                    value={formData.override_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, override_value: e.target.value }))}
                    placeholder='ej: ["gpt-4", "gpt-3.5-turbo"]'
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="reason">Razón del Override</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Explicar por qué se necesita este override específico"
                    rows={2}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={isCreatingOverride} className="w-full">
                  {isCreatingOverride ? 'Creando Override...' : 'Crear Override'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AuditLogTable
            auditLog={auditLog?.filter(log => log.table_name === 'company_configuration_overrides') || []}
            title="Log de Auditoría - Overrides de Empresa"
            description="Historial de cambios en overrides específicos de empresas"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
