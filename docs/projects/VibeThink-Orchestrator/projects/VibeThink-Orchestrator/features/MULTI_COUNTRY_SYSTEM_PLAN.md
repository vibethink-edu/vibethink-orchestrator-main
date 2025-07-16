# 🌍 PLAN COMPLETO - SISTEMA MULTI-PAÍS AI PAIR ORCHESTRATOR PRO

## 🎯 **OBJETIVO ESTRATÉGICO**

Implementar un **sistema multi-país completo** que soporte Latinoamérica, USA y Europa, con **Colombia como país de inicio** pero no exclusivo. Cada empresa debe tener parámetros de atención específicos: idioma default, moneda, formatos de números, fechas, etc.

---

## 🗺️ **PAÍSES OBJETIVO**

### **Fase 1 - Latinoamérica (Inicio)**
- 🇨🇴 **Colombia** - País de inicio (COP, Español)
- 🇲🇽 **México** - Mercado prioritario (MXN, Español)
- 🇧🇷 **Brasil** - Mercado emergente (BRL, Portugués)
- 🇦🇷 **Argentina** - Mercado establecido (ARS, Español)
- 🇨🇱 **Chile** - Mercado desarrollado (CLP, Español)
- 🇵🇪 **Perú** - Mercado en crecimiento (PEN, Español)

### **Fase 2 - Norteamérica**
- 🇺🇸 **Estados Unidos** - Mercado principal (USD, Inglés)
- 🇨🇦 **Canadá** - Mercado anglófono (CAD, Inglés/Francés)

### **Fase 3 - Europa**
- 🇪🇸 **España** - Mercado hispanohablante (EUR, Español)
- 🇩🇪 **Alemania** - Mercado tecnológico (EUR, Alemán)
- 🇫🇷 **Francia** - Mercado establecido (EUR, Francés)
- 🇮🇹 **Italia** - Mercado mediterráneo (EUR, Italiano)
- 🇬🇧 **Reino Unido** - Mercado financiero (GBP, Inglés)

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **1. Configuración por País**
```typescript
interface CountryConfiguration {
  // Identificación
  countryCode: string;           // 'CO', 'MX', 'BR', 'US', 'ES'
  countryName: string;           // 'Colombia', 'México', 'Brasil'
  region: 'LATAM' | 'NA' | 'EU'; // Región geográfica
  
  // Configuración de idioma
  defaultLanguage: string;       // 'es', 'en', 'pt', 'de', 'fr'
  supportedLanguages: string[];  // ['es', 'en'] para México
  
  // Configuración monetaria
  defaultCurrency: string;       // 'COP', 'MXN', 'BRL', 'USD', 'EUR'
  currencySymbol: string;        // '$', 'R$', '€'
  currencyPosition: 'before' | 'after';
  
  // Configuración de formatos
  dateFormat: string;            // 'DD/MM/YYYY', 'MM/DD/YYYY'
  timeFormat: '12h' | '24h';     // Formato de hora
  numberFormat: {
    decimalSeparator: string;    // ',' o '.'
    thousandsSeparator: string;  // '.' o ','
    decimalPlaces: number;       // 2 para monedas
  };
  
  // Configuración fiscal
  taxRates: {
    standard: number;            // IVA/VAT estándar
    reduced: number;             // IVA/VAT reducido
    zero: number;                // IVA/VAT cero
  };
  
  // Configuración legal
  legalRequirements: {
    requiresTaxId: boolean;      // RFC, NIT, CNPJ
    requiresAddress: boolean;    // Dirección fiscal
    requiresPhone: boolean;      // Teléfono de contacto
  };
  
  // Configuración de pagos
  paymentMethods: {
    creditCard: boolean;
    debitCard: boolean;
    bankTransfer: boolean;
    digitalWallets: string[];    // ['PayPal', 'MercadoPago']
    localMethods: string[];      // ['PSE', 'OXXO', 'Boleto']
  };
  
  // Configuración de contacto
  contactInfo: {
    supportEmail: string;
    supportPhone: string;
    businessHours: string;
    timezone: string;            // 'America/Bogota'
  };
}
```

### **2. Configuración de Empresa**
```typescript
interface CompanyCountrySettings {
  // Identificación
  companyId: string;
  countryCode: string;
  
  // Configuración operativa
  operationalLanguage: string;   // Idioma principal de operación
  operationalCurrency: string;   // Moneda principal de operación
  operationalTimezone: string;   // Zona horaria principal
  
  // Configuración de facturación
  billingSettings: {
    currency: string;
    taxId: string;               // NIT, RFC, CNPJ
    taxRate: number;
    invoicePrefix: string;       // 'FAC-', 'INV-'
    autoNumbering: boolean;
  };
  
  // Configuración de contacto
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
  
  // Configuración de pagos
  paymentSettings: {
    primaryMethod: string;
    supportedMethods: string[];
    autoRenewal: boolean;
    gracePeriod: number;         // Días de gracia
  };
  
  // Configuración de soporte
  supportSettings: {
    language: string;
    timezone: string;
    responseTime: string;        // '24h', '48h'
    escalationLevels: number;
  };
}
```

---

## 📊 **BASE DE DATOS - ESQUEMA COMPLETO**

### **1. Tabla de Configuraciones por País**
```sql
CREATE TABLE country_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) UNIQUE NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  region VARCHAR(10) NOT NULL CHECK (region IN ('LATAM', 'NA', 'EU')),
  
  -- Configuración de idioma
  default_language VARCHAR(5) NOT NULL,
  supported_languages JSONB NOT NULL DEFAULT '[]',
  
  -- Configuración monetaria
  default_currency VARCHAR(3) NOT NULL,
  currency_symbol VARCHAR(5) NOT NULL,
  currency_position VARCHAR(10) NOT NULL DEFAULT 'before',
  
  -- Configuración de formatos
  date_format VARCHAR(20) NOT NULL DEFAULT 'DD/MM/YYYY',
  time_format VARCHAR(5) NOT NULL DEFAULT '24h',
  number_format JSONB NOT NULL DEFAULT '{"decimalSeparator": ".", "thousandsSeparator": ",", "decimalPlaces": 2}',
  
  -- Configuración fiscal
  tax_rates JSONB NOT NULL DEFAULT '{"standard": 0, "reduced": 0, "zero": 0}',
  
  -- Configuración legal
  legal_requirements JSONB NOT NULL DEFAULT '{"requiresTaxId": false, "requiresAddress": false, "requiresPhone": false}',
  
  -- Configuración de pagos
  payment_methods JSONB NOT NULL DEFAULT '{"creditCard": true, "debitCard": true, "bankTransfer": false, "digitalWallets": [], "localMethods": []}',
  
  -- Configuración de contacto
  contact_info JSONB NOT NULL DEFAULT '{"supportEmail": "", "supportPhone": "", "businessHours": "", "timezone": ""}',
  
  -- Metadatos
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_country_configurations_region ON country_configurations(region);
CREATE INDEX idx_country_configurations_active ON country_configurations(is_active);
```

### **2. Tabla de Configuraciones de Empresa por País**
```sql
CREATE TABLE company_country_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES country_configurations(country_code),
  
  -- Configuración operativa
  operational_language VARCHAR(5) NOT NULL,
  operational_currency VARCHAR(3) NOT NULL,
  operational_timezone VARCHAR(50) NOT NULL,
  
  -- Configuración de facturación
  billing_settings JSONB NOT NULL DEFAULT '{}',
  
  -- Configuración de contacto
  contact_settings JSONB NOT NULL DEFAULT '{}',
  
  -- Configuración de pagos
  payment_settings JSONB NOT NULL DEFAULT '{}',
  
  -- Configuración de soporte
  support_settings JSONB NOT NULL DEFAULT '{}',
  
  -- Metadatos
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Restricciones
  UNIQUE(company_id, country_code)
);

-- Índices para optimización
CREATE INDEX idx_company_country_settings_company ON company_country_settings(company_id);
CREATE INDEX idx_company_country_settings_country ON company_country_settings(country_code);
CREATE INDEX idx_company_country_settings_active ON company_country_settings(is_active);
```

### **3. Tabla de Planes por País**
```sql
CREATE TABLE country_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) NOT NULL REFERENCES country_configurations(country_code),
  plan_name VARCHAR(50) NOT NULL,
  
  -- Configuración de precios
  base_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
  
  -- Configuración de límites
  limits JSONB NOT NULL DEFAULT '{}',
  
  -- Configuración de características
  features JSONB NOT NULL DEFAULT '[]',
  
  -- Configuración de descuentos
  discounts JSONB NOT NULL DEFAULT '{}',
  
  -- Metadatos
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Restricciones
  UNIQUE(country_code, plan_name)
);

-- Índices para optimización
CREATE INDEX idx_country_plans_country ON country_plans(country_code);
CREATE INDEX idx_country_plans_active ON country_plans(is_active);
```

---

## 🛠️ **IMPLEMENTACIÓN TÉCNICA**

### **1. Hooks React para Multi-País**
```typescript
// Hook principal para configuración multi-país
export const useMultiCountryConfiguration = () => {
  const { user, company } = useAuth();
  const [countryConfig, setCountryConfig] = useState<CountryConfiguration | null>(null);
  const [companyCountrySettings, setCompanyCountrySettings] = useState<CompanyCountrySettings | null>(null);
  
  // Cargar configuración del país
  const loadCountryConfiguration = useCallback(async (countryCode: string) => {
    const { data, error } = await supabase
      .from('country_configurations')
      .select('*')
      .eq('country_code', countryCode)
      .eq('is_active', true)
      .single();
      
    if (error) throw error;
    return data;
  }, []);
  
  // Cargar configuración de empresa por país
  const loadCompanyCountrySettings = useCallback(async (companyId: string, countryCode: string) => {
    const { data, error } = await supabase
      .from('company_country_settings')
      .select('*')
      .eq('company_id', companyId)
      .eq('country_code', countryCode)
      .eq('is_active', true)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }, []);
  
  // Obtener configuración efectiva
  const getEffectiveConfiguration = useCallback(() => {
    if (!countryConfig) return null;
    
    return {
      ...countryConfig,
      ...companyCountrySettings,
      // Lógica de herencia: empresa sobrescribe país
      operationalLanguage: companyCountrySettings?.operationalLanguage || countryConfig.defaultLanguage,
      operationalCurrency: companyCountrySettings?.operationalCurrency || countryConfig.defaultCurrency,
    };
  }, [countryConfig, companyCountrySettings]);
  
  return {
    countryConfig,
    companyCountrySettings,
    effectiveConfiguration: getEffectiveConfiguration(),
    loadCountryConfiguration,
    loadCompanyCountrySettings,
    updateCompanyCountrySettings: async (settings: Partial<CompanyCountrySettings>) => {
      // Implementar actualización
    }
  };
};

// Hook para formateo localizado
export const useLocalizedFormatting = (countryCode: string) => {
  const { countryConfig } = useMultiCountryConfiguration();
  
  const formatCurrency = useCallback((amount: number, currency?: string) => {
    if (!countryConfig) return amount.toString();
    
    const targetCurrency = currency || countryConfig.defaultCurrency;
    const formatter = new Intl.NumberFormat(countryConfig.defaultLanguage, {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: countryConfig.numberFormat.decimalPlaces,
      maximumFractionDigits: countryConfig.numberFormat.decimalPlaces
    });
    
    return formatter.format(amount);
  }, [countryConfig]);
  
  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    if (!countryConfig) return date.toLocaleDateString();
    
    const formatter = new Intl.DateTimeFormat(countryConfig.defaultLanguage, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    });
    
    return formatter.format(date);
  }, [countryConfig]);
  
  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    if (!countryConfig) return number.toString();
    
    const formatter = new Intl.NumberFormat(countryConfig.defaultLanguage, {
      minimumFractionDigits: countryConfig.numberFormat.decimalPlaces,
      maximumFractionDigits: countryConfig.numberFormat.decimalPlaces,
      ...options
    });
    
    return formatter.format(number);
  }, [countryConfig]);
  
  return {
    formatCurrency,
    formatDate,
    formatNumber
  };
};
```

### **2. Componentes UI para Multi-País**
```typescript
// Selector de país con banderas
export const CountrySelector: React.FC<{
  value: string;
  onChange: (countryCode: string) => void;
  variant?: 'dropdown' | 'buttons' | 'cards';
  showFlag?: boolean;
  showName?: boolean;
  showCurrency?: boolean;
  disabled?: boolean;
}> = ({ value, onChange, variant = 'dropdown', showFlag = true, showName = true, showCurrency = true, disabled = false }) => {
  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data } = await supabase
        .from('country_configurations')
        .select('*')
        .eq('is_active', true)
        .order('country_name');
      return data;
    }
  });
  
  if (variant === 'dropdown') {
    return (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar país" />
        </SelectTrigger>
        <SelectContent>
          {countries?.map(country => (
            <SelectItem key={country.country_code} value={country.country_code}>
              <div className="flex items-center gap-2">
                {showFlag && <span className="text-lg">{getCountryFlag(country.country_code)}</span>}
                {showName && <span>{country.country_name}</span>}
                {showCurrency && <span className="text-muted-foreground">({country.default_currency})</span>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  
  // Implementar otros variants...
};

// Configurador de empresa por país
export const CompanyCountryConfigurator: React.FC<{
  companyId: string;
  countryCode: string;
}> = ({ companyId, countryCode }) => {
  const { t } = useTranslation();
  const { countryConfig, companyCountrySettings, updateCompanyCountrySettings } = useMultiCountryConfiguration();
  const [formData, setFormData] = useState<Partial<CompanyCountrySettings>>({});
  
  // Cargar configuraciones al montar
  useEffect(() => {
    if (countryCode) {
      loadCountryConfiguration(countryCode);
      loadCompanyCountrySettings(companyId, countryCode);
    }
  }, [countryCode, companyId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompanyCountrySettings(formData);
  };
  
  if (!countryConfig) return <div>Cargando configuración del país...</div>;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración para {countryConfig.countryName}</CardTitle>
          <CardDescription>
            Configura los parámetros específicos para operar en {countryConfig.countryName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Idioma operativo */}
          <div>
            <Label>Idioma Operativo</Label>
            <Select 
              value={formData.operationalLanguage || countryConfig.defaultLanguage}
              onValueChange={(value) => setFormData(prev => ({ ...prev, operationalLanguage: value }))}
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
          
          {/* Moneda operativa */}
          <div>
            <Label>Moneda Operativa</Label>
            <Select 
              value={formData.operationalCurrency || countryConfig.defaultCurrency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, operationalCurrency: value }))}
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
          
          {/* Configuración de facturación */}
          <div>
            <Label>Número de Identificación Fiscal</Label>
            <Input 
              placeholder={getTaxIdPlaceholder(countryCode)}
              value={formData.billingSettings?.taxId || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                billingSettings: { ...prev.billingSettings, taxId: e.target.value }
              }))}
            />
          </div>
          
          {/* Más campos... */}
        </CardContent>
      </Card>
      
      <Button type="submit">Guardar Configuración</Button>
    </form>
  );
};
```

---

## 📋 **PLAN DE IMPLEMENTACIÓN**

### **Fase 1: Base del Sistema (Semanas 1-2)**
- [ ] Crear tablas de base de datos
- [ ] Implementar hooks básicos
- [ ] Crear componentes UI fundamentales
- [ ] Configurar datos iniciales para Colombia

### **Fase 2: Latinoamérica (Semanas 3-4)**
- [ ] Configurar México, Brasil, Argentina
- [ ] Implementar formatos locales
- [ ] Configurar métodos de pago locales
- [ ] Testing con empresas latinoamericanas

### **Fase 3: Norteamérica (Semanas 5-6)**
- [ ] Configurar USA y Canadá
- [ ] Implementar formatos USD/CAD
- [ ] Configurar métodos de pago norteamericanos
- [ ] Testing con empresas norteamericanas

### **Fase 4: Europa (Semanas 7-8)**
- [ ] Configurar países europeos principales
- [ ] Implementar formatos EUR
- [ ] Configurar métodos de pago europeos
- [ ] Testing con empresas europeas

### **Fase 5: Optimización (Semanas 9-10)**
- [ ] Performance optimization
- [ ] Cache implementation
- [ ] Analytics y reporting
- [ ] Documentación completa

---

## 🎯 **BENEFICIOS ESPERADOS**

### **Para las Empresas**
- ✅ **Experiencia localizada** - Configuración específica por país
- ✅ **Cumplimiento legal** - Requisitos fiscales y legales por país
- ✅ **Métodos de pago locales** - Integración con sistemas locales
- ✅ **Soporte en idioma local** - Atención en el idioma del cliente

### **Para el Desarrollo**
- ✅ **Arquitectura escalable** - Fácil agregar nuevos países
- ✅ **Configuración centralizada** - Administración desde un lugar
- ✅ **Testing automatizado** - Validación por país
- ✅ **Documentación completa** - Guías para cada mercado

### **Para el Negocio**
- ✅ **Expansión internacional** - Preparado para múltiples mercados
- ✅ **ROI optimizado** - Configuración específica por mercado
- ✅ **Competitividad** - Ventaja sobre competidores locales
- ✅ **Escalabilidad** - Crecimiento sin límites geográficos

---

## 📚 **PRÓXIMOS PASOS**

1. **Revisar y aprobar** este plan completo
2. **Crear migración de base de datos** con las nuevas tablas
3. **Implementar hooks básicos** para configuración multi-país
4. **Crear componentes UI** para selección y configuración
5. **Configurar datos iniciales** para países objetivo
6. **Testing exhaustivo** con empresas de diferentes países
7. **Documentación de usuario** para cada mercado

---

**Estado**: 📋 **PLAN COMPLETO CREADO**  
**Próximo paso**: Implementación de la base de datos  
**Responsable**: Equipo de Desarrollo  
**Fecha objetivo**: 4 semanas para implementación completa 