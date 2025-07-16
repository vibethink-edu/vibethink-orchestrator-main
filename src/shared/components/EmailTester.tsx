/**
 * Componente para testing de emails con Resend
 * 
 * Permite probar templates de email y verificar envío
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmail } from '@/shared/hooks/useEmail';
import { Loader2, Send, CheckCircle, XCircle, Eye, Download } from 'lucide-react';

interface EmailTesterProps {
  className?: string;
}

export const EmailTester: React.FC<EmailTesterProps> = ({ className }) => {
  const { sendEmail, state, resetState } = useEmail();
  const [testData, setTestData] = useState({
    email: '',
    template: 'welcome',
    customSubject: '',
    customMessage: '',
  });

  const [previewData, setPreviewData] = useState({
    user: {
      name: 'Usuario de Prueba',
      email: 'test@example.com',
      role: 'ADMIN',
    },
    company: {
      name: 'Empresa de Prueba',
      domain: 'test.com',
      logo: 'https://vthink.com/logo.png',
    },
  });

  const templates = [
    { value: 'welcome', label: 'Bienvenida', description: 'Email de bienvenida para nuevos usuarios' },
    { value: 'password-reset', label: 'Reset Contraseña', description: 'Email para restablecer contraseña' },
    { value: 'notification', label: 'Notificación', description: 'Email de notificación general' },
    { value: 'migration-completed', label: 'Migración Completada', description: 'Email de migración finalizada' },
    { value: 'seo-report', label: 'Reporte SEO', description: 'Email de reporte SEO premium' },
    { value: 'translation-completed', label: 'Traducción Completada', description: 'Email de traducción finalizada' },
  ];

  const handleSendTest = async () => {
    if (!testData.email) return;

    const emailData = {
      to: testData.email,
      subject: testData.customSubject || `Test - ${templates.find(t => t.value === testData.template)?.label}`,
      react: null, // Se maneja internamente en el servicio
    };

    await sendEmail(emailData);
  };

  const handlePreview = () => {
    // Aquí se podría implementar preview del template
    console.log('Preview template:', testData.template);
  };

  const handleDownload = () => {
    // Aquí se podría implementar descarga del template
    console.log('Download template:', testData.template);
  };

  const getTemplatePreview = () => {
    switch (testData.template) {
      case 'welcome':
        return {
          subject: `¡Bienvenido a ${previewData.company.name}!`,
          preview: 'Email de bienvenida con información de la cuenta y características de la plataforma.',
        };
      case 'password-reset':
        return {
          subject: 'Restablecer Contraseña - VThink',
          preview: 'Email de reset de contraseña con enlace seguro y advertencias de seguridad.',
        };
      case 'notification':
        return {
          subject: 'Notificación - VThink',
          preview: 'Email de notificación con detalles y acciones recomendadas.',
        };
      case 'migration-completed':
        return {
          subject: 'Migración Completada - VThink',
          preview: 'Email con resumen de migración, estadísticas y enlaces a resultados.',
        };
      case 'seo-report':
        return {
          subject: 'Reporte SEO Premium - VThink',
          preview: 'Email con análisis SEO, problemas detectados y recomendaciones.',
        };
      case 'translation-completed':
        return {
          subject: 'Traducción Completada - VThink',
          preview: 'Email con resumen de traducción, calidad y glosario de términos.',
        };
      default:
        return {
          subject: 'Test Email',
          preview: 'Template de prueba.',
        };
    }
  };

  const templatePreview = getTemplatePreview();

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Email Tester - Resend
          </CardTitle>
          <CardDescription>
            Prueba templates de email y verifica el envío con Resend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="test" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="test">Enviar Test</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="test" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email de Destino</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="test@example.com"
                    value={testData.email}
                    onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select
                    value={testData.template}
                    onValueChange={(value) => setTestData(prev => ({ ...prev, template: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Asunto Personalizado (opcional)</Label>
                <Input
                  id="subject"
                  placeholder="Asunto del email..."
                  value={testData.customSubject}
                  onChange={(e) => setTestData(prev => ({ ...prev, customSubject: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje Personalizado (opcional)</Label>
                <Textarea
                  id="message"
                  placeholder="Mensaje adicional..."
                  value={testData.customMessage}
                  onChange={(e) => setTestData(prev => ({ ...prev, customMessage: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSendTest} 
                  disabled={!testData.email || state.isLoading}
                  className="flex items-center gap-2"
                >
                  {state.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Enviar Test
                </Button>
                <Button variant="outline" onClick={resetState}>
                  Reset
                </Button>
              </div>

              {state.isSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Email enviado exitosamente. Message ID: {state.messageId}
                  </AlertDescription>
                </Alert>
              )}

              {state.isError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Error al enviar email: {state.error}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Template Seleccionado</Label>
                  <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {templates.find(t => t.value === testData.template)?.label}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handlePreview}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">Asunto: {templatePreview.subject}</p>
                      <p className="text-sm text-gray-600 mt-1">{templatePreview.preview}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Datos de Usuario (Preview)</Label>
                    <div className="mt-2 p-3 border rounded-lg bg-blue-50">
                      <p className="text-sm"><strong>Nombre:</strong> {previewData.user.name}</p>
                      <p className="text-sm"><strong>Email:</strong> {previewData.user.email}</p>
                      <p className="text-sm"><strong>Rol:</strong> {previewData.user.role}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Datos de Empresa (Preview)</Label>
                    <div className="mt-2 p-3 border rounded-lg bg-green-50">
                      <p className="text-sm"><strong>Nombre:</strong> {previewData.company.name}</p>
                      <p className="text-sm"><strong>Dominio:</strong> {previewData.company.domain}</p>
                      <p className="text-sm"><strong>Logo:</strong> {previewData.company.logo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card key={template.value} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{template.label}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{template.value}</Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setTestData(prev => ({ ...prev, template: template.value }))}
                        >
                          Seleccionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 