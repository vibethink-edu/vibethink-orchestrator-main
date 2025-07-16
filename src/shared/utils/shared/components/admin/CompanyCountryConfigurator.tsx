import React, { useState, useEffect } from 'react';
import { useMultiCountryConfiguration } from '@/hooks/useMultiCountryConfiguration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CountrySelector } from '@/shared/components/ui/CountrySelector';

// =====================================================
// TIPOS Y INTERFACES
// =====================================================

interface CompanyCountryConfiguratorProps {
  companyId: string;
  initialCountryCode?: string;
  showPreview?: boolean;
  onSave?: (settings: any) => void;
  className?: string;
}

interface FormData {
  operationalLanguage: string;
  operationalCurrency: string;
  operationalTimezone: string;
  billingSettings: {
    currency: string;
    taxId: string;
    taxRate: number;
    invoicePrefix: string;
    autoNumbering: boolean;
  };
  contactSettings: {
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    phone: string;
    email: string;
    website: string;
  };
  paymentSettings: {
    primaryMethod: string;
    supportedMethods: string[];
    autoRenewal: boolean;
    gracePeriod: number;
  };
  supportSettings: {
    language: string;
    timezone: string;
    responseTime: string;
    escalationLevels: number;
  };
}

// =====================================================
// UTILIDADES
// =====================================================

const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'es': 'Español',
    'en': 'English',
    'pt': 'Português',
    'de': 'Deutsch',
    'fr': 'Français',
    'it': 'Italiano',
    'ca': 'Català',
    'eu': 'Euskara',
    'gl': 'Galego'
  };
  return languages[code] || code;
};

const getTaxIdPlaceholder = (countryCode: string): string => {
  const placeholders: Record<string, string> = {
    'CO': 'NIT (ej: 900.123.456-7)',
    'MX': 'RFC (ej: ABC123456789)',
    'BR': 'CNPJ (ej: 12.345.678/0001-90)',
    'US': 'EIN (ej: 12-3456789)',
    'ES': 'CIF (ej: B12345678)',
    'DE': 'Steuernummer (ej: 123/456/78901)',
    'FR': 'SIRET (ej: 12345678901234)',
    'IT': 'Partita IVA (ej: 12345678901)',
    'GB': 'VAT Number (ej: GB123456789)'
  };
  return placeholders[countryCode] || 'Número de identificación fiscal';
};

const getTimezoneOptions = (countryCode: string): string[] => {
  const timezones: Record<string, string[]> = {
    'CO': ['America/Bogota'],
    'MX': ['America/Mexico_City', 'America/Tijuana', 'America/Monterrey'],
    'BR': ['America/Sao_Paulo', 'America/Manaus', 'America/Fortaleza'],
    'US': ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'],
    'ES': ['Europe/Madrid', 'Europe/Barcelona'],
    'DE': ['Europe/Berlin'],
    'FR': ['Europe/Paris'],
    'IT': ['Europe/Rome'],
    'GB': ['Europe/London']
  };
  return timezones[countryCode] || ['UTC'];
};

const getPaymentMethods = (countryCode: string): string[] => {
  const methods: Record<string, string[]> = {
    'CO': ['creditCard', 'debitCard', 'bankTransfer', 'PSE', 'Nequi', 'Daviplata'],
    'MX': ['creditCard', 'debitCard', 'bankTransfer', 'OXXO', '7-Eleven', 'MercadoPago'],
    'BR': ['creditCard', 'debitCard', 'bankTransfer', 'Boleto', 'Pix'],
    'US': ['creditCard', 'debitCard', 'bankTransfer', 'ACH', 'PayPal'],
    'ES': ['creditCard', 'debitCard', 'bankTransfer', 'Bizum'],
    'DE': ['creditCard', 'debitCard', 'bankTransfer', 'SEPA'],
    'FR': ['creditCard', 'debitCard', 'bankTransfer', 'SEPA'],
    'IT': ['creditCard', 'debitCard', 'bankTransfer', 'SEPA'],
    'GB': ['creditCard', 'debitCard', 'bankTransfer', 'BACS']
  };
  return methods[countryCode] || ['creditCard', 'debitCard'];
};

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export const CompanyCountryConfigurator: React.FC<CompanyCountryConfiguratorProps> = ({
  companyId,
  initialCountryCode = 'CO',
  showPreview = true,
  onSave,
  className = ''
}) => {
  const { t } = useTranslation();
  const [selectedCountryCode, setSelectedCountryCode] = useState(initialCountryCode);
  const [activeTab, setActiveTab] = useState('general');
  
  // Obtener configuración del país y empresa
  const {
    countryConfig,
    companyCountrySettings,
    effectiveConfiguration,
    updateCompanyCountrySettings,
    isUpdating,
    isLoading
  } = useMultiCountryConfiguration(selectedCountryCode);
  
  // Estado del formulario
  const [formData, setFormData] = useState<FormData>({
    operationalLanguage: '',
    operationalCurrency: '',
    operationalTimezone: '',
    billingSettings: {
      currency: '',
      taxId: '',
      taxRate: 0,
      invoicePrefix: '',
      autoNumbering: true
    },
    contactSettings: {
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      phone: '',
      email: '',
      website: ''
    },
    paymentSettings: {
      primaryMethod: '',
      supportedMethods: [],
      autoRenewal: true,
      gracePeriod: 7
    },
    supportSettings: {
      language: '',
      timezone: '',
      responseTime: '24h',
      escalationLevels: 2
    }
  });
  
  // Cargar datos iniciales cuando cambie el país o se carguen las configuraciones
  useEffect(() => {
    if (countryConfig) {
      setFormData(prev => ({
        ...prev,
        operationalLanguage: companyCountrySettings?.operationalLanguage || countryConfig.defaultLanguage,
        operationalCurrency: companyCountrySettings?.operationalCurrency || countryConfig.defaultCurrency,
        operationalTimezone: companyCountrySettings?.operationalTimezone || countryConfig.contactInfo.timezone,
        billingSettings: {
          ...prev.billingSettings,
          currency: companyCountrySettings?.billingSettings?.currency || countryConfig.defaultCurrency,
          taxRate: companyCountrySettings?.billingSettings?.taxRate || countryConfig.taxRates.standard,
          taxId: companyCountrySettings?.billingSettings?.taxId || '',
          invoicePrefix: companyCountrySettings?.billingSettings?.invoicePrefix || 'FAC-',
          autoNumbering: companyCountrySettings?.billingSettings?.autoNumbering ?? true
        },
        contactSettings: {
          ...prev.contactSettings,
          ...companyCountrySettings?.contactSettings
        },
        paymentSettings: {
          ...prev.paymentSettings,
          ...companyCountrySettings?.paymentSettings,
          supportedMethods: companyCountrySettings?.paymentSettings?.supportedMethods || 
            getPaymentMethods(selectedCountryCode).slice(0, 3)
        },
        supportSettings: {
          ...prev.supportSettings,
          ...companyCountrySettings?.supportSettings,
          language: companyCountrySettings?.supportSettings?.language || countryConfig.defaultLanguage,
          timezone: companyCountrySettings?.supportSettings?.timezone || countryConfig.contactInfo.timezone
        }
      }));
    }
  }, [countryConfig, companyCountrySettings, selectedCountryCode]);
  
  // Manejar cambios en el formulario
  const handleFormChange = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  // Manejar cambios en configuraciones anidadas
  const handleNestedChange = (section: keyof FormData, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }));
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateCompanyCountrySettings(formData);
      onSave?.(formData);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      toast.error('Error al guardar la configuración');
    }
  };
  
  // Resetear a configuración del país
  const handleResetToCountryDefaults = () => {
    if (countryConfig) {
      setFormData(prev => ({
        ...prev,
        operationalLanguage: countryConfig.defaultLanguage,
        operationalCurrency: countryConfig.defaultCurrency,
        operationalTimezone: countryConfig.contactInfo.timezone,
        billingSettings: {
          ...prev.billingSettings,
          currency: countryConfig.defaultCurrency,
          taxRate: countryConfig.taxRates.standard
        },
        supportSettings: {
          ...prev.supportSettings,
          language: countryConfig.defaultLanguage,
          timezone: countryConfig.contactInfo.timezone
        }
      }));
    }
  };
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Cargando configuración del país...</span>
      </div>
    );
  }
  
  if (!countryConfig) {
    return (
      <div className={`text-center p-8 text-muted-foreground ${className}`}>
        <p>No se pudo cargar la configuración del país seleccionado</p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con selector de país */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuración de Empresa</h2>
          <p className="text-muted-foreground">
            Configura los parámetros específicos para operar en {countryConfig.countryName}
          </p>
        </div>
        <CountrySelector
          value={selectedCountryCode}
          onChange={setSelectedCountryCode}
          variant="dropdown"
          showFlag={true}
          showName={true}
          showCurrency={true}
          className="w-64"
        />
      </div>
      
      {/* Preview de configuración efectiva */}
      {showPreview && effectiveConfiguration && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Configuración Efectiva</CardTitle>
            <CardDescription>
              Configuración combinada (País + Empresa)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Idioma</Label>
                <p className="text-sm">{getLanguageName(effectiveConfiguration.effectiveLanguage)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Moneda</Label>
                <p className="text-sm">{effectiveConfiguration.effectiveCurrency}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Zona Horaria</Label>
                <p className="text-sm">{effectiveConfiguration.effectiveTimezone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">IVA/VAT</Label>
                <p className="text-sm">{effectiveConfiguration.effectiveTaxRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Formulario de configuración */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="billing">Facturación</TabsTrigger>
            <TabsTrigger value="contact">Contacto</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="support">Soporte</TabsTrigger>
          </TabsList>
          
          {/* Pestaña General */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración Operativa</CardTitle>
                <CardDescription>
                  Configuración básica de idioma, moneda y zona horaria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Idioma Operativo</Label>
                    <Select
                      value={formData.operationalLanguage}
                      onValueChange={(value) => handleFormChange('operationalLanguage', 'operationalLanguage', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryConfig.supportedLanguages.map(lang => (
                          <SelectItem key={lang} value={lang}>
                            {getLanguageName(lang)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Moneda Operativa</Label>
                    <Select
                      value={formData.operationalCurrency}
                      onValueChange={(value) => handleFormChange('operationalCurrency', 'operationalCurrency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={countryConfig.defaultCurrency}>
                          {countryConfig.defaultCurrency} ({countryConfig.currencySymbol})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Zona Horaria</Label>
                    <Select
                      value={formData.operationalTimezone}
                      onValueChange={(value) => handleFormChange('operationalTimezone', 'operationalTimezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getTimezoneOptions(selectedCountryCode).map(tz => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Configuración del País</h4>
                    <p className="text-sm text-muted-foreground">
                      {countryConfig.countryName} • {countryConfig.region}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetToCountryDefaults}
                  >
                    Resetear a Defaults del País
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pestaña Facturación */}
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Facturación</CardTitle>
                <CardDescription>
                  Configuración fiscal y de facturación específica del país
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Moneda de Facturación</Label>
                    <Select
                      value={formData.billingSettings.currency}
                      onValueChange={(value) => handleFormChange('billingSettings', 'currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={countryConfig.defaultCurrency}>
                          {countryConfig.defaultCurrency} ({countryConfig.currencySymbol})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Tasa de IVA/VAT (%)</Label>
                    <Input
                      type="number"
                      value={formData.billingSettings.taxRate}
                      onChange={(e) => handleFormChange('billingSettings', 'taxRate', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Número de Identificación Fiscal</Label>
                  <Input
                    placeholder={getTaxIdPlaceholder(selectedCountryCode)}
                    value={formData.billingSettings.taxId}
                    onChange={(e) => handleFormChange('billingSettings', 'taxId', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Prefijo de Factura</Label>
                    <Input
                      placeholder="FAC-"
                      value={formData.billingSettings.invoicePrefix}
                      onChange={(e) => handleFormChange('billingSettings', 'invoicePrefix', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.billingSettings.autoNumbering}
                      onCheckedChange={(checked) => handleFormChange('billingSettings', 'autoNumbering', checked)}
                    />
                    <Label>Numeración Automática</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pestaña Contacto */}
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>
                  Dirección y datos de contacto para facturación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Dirección</Label>
                  <Input
                    placeholder="Calle y número"
                    value={formData.contactSettings.address.street}
                    onChange={(e) => handleNestedChange('contactSettings', 'address', 'street', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Ciudad</Label>
                    <Input
                      value={formData.contactSettings.address.city}
                      onChange={(e) => handleNestedChange('contactSettings', 'address', 'city', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Estado/Provincia</Label>
                    <Input
                      value={formData.contactSettings.address.state}
                      onChange={(e) => handleNestedChange('contactSettings', 'address', 'state', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Código Postal</Label>
                    <Input
                      value={formData.contactSettings.address.postalCode}
                      onChange={(e) => handleNestedChange('contactSettings', 'address', 'postalCode', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      type="tel"
                      value={formData.contactSettings.phone}
                      onChange={(e) => handleFormChange('contactSettings', 'phone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.contactSettings.email}
                      onChange={(e) => handleFormChange('contactSettings', 'email', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Sitio Web</Label>
                  <Input
                    type="url"
                    placeholder="https://"
                    value={formData.contactSettings.website}
                    onChange={(e) => handleFormChange('contactSettings', 'website', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pestaña Pagos */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Pagos</CardTitle>
                <CardDescription>
                  Métodos de pago y configuración de renovación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Método de Pago Principal</Label>
                  <Select
                    value={formData.paymentSettings.primaryMethod}
                    onValueChange={(value) => handleFormChange('paymentSettings', 'primaryMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método principal" />
                    </SelectTrigger>
                    <SelectContent>
                      {getPaymentMethods(selectedCountryCode).map(method => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Métodos de Pago Soportados</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {getPaymentMethods(selectedCountryCode).map(method => (
                      <div key={method} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={method}
                          checked={formData.paymentSettings.supportedMethods.includes(method)}
                          onChange={(e) => {
                            const methods = e.target.checked
                              ? [...formData.paymentSettings.supportedMethods, method]
                              : formData.paymentSettings.supportedMethods.filter(m => m !== method);
                            handleFormChange('paymentSettings', 'supportedMethods', methods);
                          }}
                        />
                        <Label htmlFor={method} className="text-sm">{method}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.paymentSettings.autoRenewal}
                      onCheckedChange={(checked) => handleFormChange('paymentSettings', 'autoRenewal', checked)}
                    />
                    <Label>Renovación Automática</Label>
                  </div>
                  
                  <div>
                    <Label>Período de Gracia (días)</Label>
                    <Input
                      type="number"
                      value={formData.paymentSettings.gracePeriod}
                      onChange={(e) => handleFormChange('paymentSettings', 'gracePeriod', parseInt(e.target.value) || 0)}
                      min="0"
                      max="30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pestaña Soporte */}
          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Soporte</CardTitle>
                <CardDescription>
                  Configuración de atención al cliente y soporte técnico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Idioma de Soporte</Label>
                    <Select
                      value={formData.supportSettings.language}
                      onValueChange={(value) => handleFormChange('supportSettings', 'language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryConfig.supportedLanguages.map(lang => (
                          <SelectItem key={lang} value={lang}>
                            {getLanguageName(lang)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Zona Horaria de Soporte</Label>
                    <Select
                      value={formData.supportSettings.timezone}
                      onValueChange={(value) => handleFormChange('supportSettings', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getTimezoneOptions(selectedCountryCode).map(tz => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tiempo de Respuesta</Label>
                    <Select
                      value={formData.supportSettings.responseTime}
                      onValueChange={(value) => handleFormChange('supportSettings', 'responseTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2h">2 horas</SelectItem>
                        <SelectItem value="4h">4 horas</SelectItem>
                        <SelectItem value="8h">8 horas</SelectItem>
                        <SelectItem value="24h">24 horas</SelectItem>
                        <SelectItem value="48h">48 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Niveles de Escalación</Label>
                    <Input
                      type="number"
                      value={formData.supportSettings.escalationLevels}
                      onChange={(e) => handleFormChange('supportSettings', 'escalationLevels', parseInt(e.target.value) || 1)}
                      min="1"
                      max="5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Botones de acción */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {countryConfig.countryName}
            </Badge>
            <Badge variant="secondary">
              {countryConfig.region}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetToCountryDefaults}
            >
              Resetear
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
            >
              {isUpdating ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}; 