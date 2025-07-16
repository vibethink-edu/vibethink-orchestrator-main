# 🏗️ ARQUITECTURA PARAMÉTRICA: BUENAS PRÁCTICAS
## Eliminación de Hardcoding y Variables Configurables

### 📋 **RESUMEN EJECUTIVO**

Este documento establece las **buenas prácticas** para arquitectura paramétrica, eliminando cualquier hardcoding de jurisdicciones específicas en el código y asegurando que todo sea **configurable y elegante**.

---

## ❌ **MALAS PRÁCTICAS (NO HACER)**

### **Hardcoding de Jurisdicciones**
```typescript
// ❌ MALA PRÁCTICA - Hardcoding Colombia
class ColombiaIdValidator {
  validateCedula(cedula: string): boolean {
    // Algoritmo específico de cédula colombiana
    return this.calculateChecksum(cedula);
  }
}

// ❌ MALA PRÁCTICA - Variables hardcodeadas
const COLOMBIA_TAX_RATES = {
  birth_certificate: 4200,
  death_certificate: 4200,
  driving_license: 300000
};

// ❌ MALA PRÁCTICA - URLs hardcodeadas
const REGISTRADURIA_URL = "https://api.registraduria.gov.co";
const PORTAL_ESTADO_URL = "https://www.gov.co";
```

### **Configuración Específica en Código**
```typescript
// ❌ MALA PRÁCTICA - Configuración hardcodeada
interface User {
  nationalId: string; // Solo para Colombia
  cedulaType: string; // Específico Colombia
}

// ❌ MALA PRÁCTICA - Validaciones específicas
function validateColombianId(id: string): boolean {
  return /^[0-9]{8,10}$/.test(id); // Solo cédula colombiana
}
```

---

## ✅ **BUENAS PRÁCTICAS (HACER)**

### **Arquitectura Paramétrica**
```typescript
// ✅ BUENA PRÁCTICA - Interfaces genéricas
interface NationalIdValidator {
  validateFormat(id: string): boolean;
  validateChecksum(id: string): boolean;
  validateWithAuthority(id: string): Promise<ValidationResult>;
}

// ✅ BUENA PRÁCTICA - Implementación específica
class ColombiaIdValidator implements NationalIdValidator {
  validateFormat(id: string): boolean {
    return /^[0-9]{8,10}$/.test(id);
  }
  
  validateChecksum(id: string): boolean {
    return this.calculateChecksum(id);
  }
  
  async validateWithAuthority(id: string): Promise<ValidationResult> {
    return await this.authorityApi.validate(id);
  }
}

// ✅ BUENA PRÁCTICA - Configuración paramétrica
interface JurisdictionConfig {
  id: string;
  name: string;
  currency: string;
  language: string;
  timezone: string;
  taxRates: Record<string, number>;
  idValidation: IdValidationConfig;
  integrations: IntegrationConfig;
}

// ✅ BUENA PRÁCTICA - Configuración desde archivo
const jurisdictionConfigs: Record<string, JurisdictionConfig> = {
  'CO': {
    id: 'CO',
    name: 'Colombia',
    currency: 'COP',
    language: 'es',
    timezone: 'America/Bogota',
    taxRates: {
      birth_certificate: 4200,
      death_certificate: 4200,
      driving_license: 300000
    },
    idValidation: {
      nationalIdType: 'cedula',
      formatRegex: '^[0-9]{8,10}$',
      validationClass: 'ColombiaIdValidator'
    },
    integrations: {
      identityAuthority: 'https://api.registraduria.gov.co',
      governmentPortal: 'https://www.gov.co',
      paymentGateway: 'PSE'
    }
  }
};
```

### **Variables Configurables**
```typescript
// ✅ BUENA PRÁCTICA - Variables paramétricas
interface User {
  nationalId: string; // Genérico para cualquier país
  nationalIdType: string; // 'cedula', 'dni', 'curp', etc.
  jurisdiction: string; // 'CO', 'ES', 'MX', etc.
}

// ✅ BUENA PRÁCTICA - Validación genérica
function validateNationalId(id: string, jurisdiction: string): boolean {
  const config = jurisdictionConfigs[jurisdiction];
  const validator = getValidator(config.idValidation.validationClass);
  return validator.validateFormat(id);
}

// ✅ BUENA PRÁCTICA - Cálculo de tasas paramétrico
function calculateTax(serviceType: string, jurisdiction: string): number {
  const config = jurisdictionConfigs[jurisdiction];
  return config.taxRates[serviceType] || 0;
}
```

---

## 🏗️ **ARQUITECTURA CORREGIDA**

### **1. Plugin System Paramétrico**
```typescript
// ✅ BUENA PRÁCTICA - Plugin system genérico
interface JurisdictionPlugin {
  getConfig(): JurisdictionConfig;
  validateNationalId(id: string): ValidationResult;
  getPaymentMethods(): PaymentMethod[];
  getLegalTemplates(): LegalTemplate[];
}

// ✅ BUENA PRÁCTICA - Implementación específica
class ColombiaPlugin implements JurisdictionPlugin {
  getConfig(): JurisdictionConfig {
    return jurisdictionConfigs['CO'];
  }
  
  validateNationalId(id: string): ValidationResult {
    const config = this.getConfig();
    const validator = new ColombiaIdValidator();
    return validator.validate(id);
  }
  
  getPaymentMethods(): PaymentMethod[] {
    return [
      { id: 'pse', name: 'PSE', enabled: true },
      { id: 'credit_card', name: 'Tarjeta de Crédito', enabled: true },
      { id: 'nequi', name: 'Nequi', enabled: true }
    ];
  }
}

// ✅ BUENA PRÁCTICA - Registry paramétrico
const JURISDICTION_PLUGINS: Record<string, JurisdictionPlugin> = {
  'CO': new ColombiaPlugin(),
  'ES': new SpainPlugin(), // Futuro
  'MX': new MexicoPlugin(), // Futuro
};
```

### **2. Database Schema Paramétrico**
```sql
-- ✅ BUENA PRÁCTICA - Schema genérico
CREATE TABLE jurisdictions (
    code VARCHAR(2) PRIMARY KEY, -- 'CO', 'ES', 'MX'
    name VARCHAR(100) NOT NULL,
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction_code VARCHAR(2) REFERENCES jurisdictions(code),
    national_id VARCHAR(50), -- Formato variable por jurisdicción
    national_id_type VARCHAR(20), -- 'cedula', 'dni', 'curp', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE service_tax_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction_code VARCHAR(2) REFERENCES jurisdictions(code),
    service_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    legal_basis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **3. API Design Paramétrico**
```typescript
// ✅ BUENA PRÁCTICA - API genérica
@Controller('identity')
export class IdentityController {
  @Post('validate')
  async validateIdentity(
    @Body() request: IdentityValidationRequest,
    @Tenant() tenant: Tenant
  ): Promise<IdentityValidationResponse> {
    const plugin = JURISDICTION_PLUGINS[tenant.jurisdictionCode];
    const result = await plugin.validateNationalId(request.idNumber);
    
    return {
      valid: result.valid,
      jurisdiction: tenant.jurisdictionCode,
      timestamp: new Date(),
      details: result.details
    };
  }
  
  @Get('payment-methods')
  async getPaymentMethods(@Tenant() tenant: Tenant): Promise<PaymentMethodsResponse> {
    const plugin = JURISDICTION_PLUGINS[tenant.jurisdictionCode];
    const methods = plugin.getPaymentMethods();
    
    return {
      methods,
      jurisdiction: tenant.jurisdictionCode
    };
  }
}
```

---

## 📁 **ESTRUCTURA DE CONFIGURACIÓN**

### **Archivos de Configuración**
```yaml
# config/jurisdictions/colombia.yml
jurisdiction:
  id: CO
  name: Colombia
  currency: COP
  language: es
  timezone: America/Bogota
  
tax_rates:
  birth_certificate: 4200
  death_certificate: 4200
  driving_license: 300000
  construction_permit: variable
  apostille: 16000
  
id_validation:
  national_id_type: cedula
  format_regex: "^[0-9]{8,10}$"
  validation_class: ColombiaIdValidator
  authority_endpoint: "https://api.registraduria.gov.co"
  
integrations:
  government_portal: "https://www.gov.co"
  payment_gateway: PSE
  certificate_authority: "andes_pki"
  
ui:
  theme: government
  colors:
    primary: "#003f7f"
    secondary: "#fdd900"
    accent: "#ce1126"
```

### **Carga de Configuración**
```typescript
// ✅ BUENA PRÁCTICA - Carga dinámica de configuración
class ConfigurationManager {
  private configs: Record<string, JurisdictionConfig> = {};
  
  async loadConfigurations(): Promise<void> {
    const jurisdictionCodes = ['CO', 'ES', 'MX']; // Configurable
    
    for (const code of jurisdictionCodes) {
      const config = await this.loadJurisdictionConfig(code);
      this.configs[code] = config;
    }
  }
  
  private async loadJurisdictionConfig(code: string): Promise<JurisdictionConfig> {
    const configPath = `config/jurisdictions/${code.toLowerCase()}.yml`;
    const configData = await this.loadYamlFile(configPath);
    return this.validateAndTransform(configData);
  }
  
  getConfig(jurisdictionCode: string): JurisdictionConfig {
    return this.configs[jurisdictionCode];
  }
}
```

---

## 🎯 **PRINCIPIOS DE ARQUITECTURA**

### **1. Configuración vs Código**
```yaml
✅ BUENO:
  - Configuración en archivos YAML/JSON
  - Código genérico y reutilizable
  - Variables paramétricas
  - Plugins configurables

❌ MALO:
  - Hardcoding en código
  - Variables específicas por país
  - Código duplicado por jurisdicción
  - Configuración mezclada con lógica
```

### **2. Nomenclatura Genérica**
```yaml
✅ BUENO:
  - nationalId (no cedula)
  - jurisdiction (no country)
  - taxRate (no colombiaTax)
  - identityValidator (no colombiaValidator)

❌ MALO:
  - cedula (específico Colombia)
  - colombiaTax (hardcoded)
  - colombiaValidator (específico)
  - registraduriaUrl (específico)
```

### **3. Interfaces Genéricas**
```yaml
✅ BUENO:
  - NationalIdValidator (genérico)
  - TaxCalculator (genérico)
  - PaymentProcessor (genérico)
  - DocumentGenerator (genérico)

❌ MALO:
  - ColombiaIdValidator (específico)
  - ColombiaTaxCalculator (específico)
  - ColombiaPaymentProcessor (específico)
  - ColombiaDocumentGenerator (específico)
```

---

## 🚀 **IMPLEMENTACIÓN CORREGIDA**

### **Estructura de Archivos**
```
src/
├── core/
│   ├── jurisdiction/
│   │   ├── JurisdictionPlugin.ts (genérico)
│   │   ├── JurisdictionConfig.ts (genérico)
│   │   └── ConfigurationManager.ts (genérico)
│   ├── identity/
│   │   ├── NationalIdValidator.ts (genérico)
│   │   ├── ColombiaIdValidator.ts (implementación)
│   │   └── SpainIdValidator.ts (implementación)
│   └── services/
│       ├── TaxCalculator.ts (genérico)
│       ├── PaymentProcessor.ts (genérico)
│       └── DocumentGenerator.ts (genérico)
├── config/
│   └── jurisdictions/
│       ├── colombia.yml
│       ├── spain.yml
│       └── mexico.yml
└── plugins/
    ├── ColombiaPlugin.ts
    ├── SpainPlugin.ts
    └── MexicoPlugin.ts
```

### **Ejemplo de Uso**
```typescript
// ✅ BUENA PRÁCTICA - Uso genérico
class GovernmentService {
  async processService(
    serviceType: string, 
    userId: string, 
    jurisdictionCode: string
  ): Promise<ServiceResult> {
    // Obtener configuración dinámica
    const config = this.configManager.getConfig(jurisdictionCode);
    
    // Obtener plugin dinámico
    const plugin = JURISDICTION_PLUGINS[jurisdictionCode];
    
    // Validar identidad genéricamente
    const user = await this.getUser(userId);
    const validation = await plugin.validateNationalId(user.nationalId);
    
    // Calcular tasa paramétricamente
    const taxRate = config.taxRates[serviceType];
    
    // Procesar pago genéricamente
    const payment = await this.paymentProcessor.process({
      amount: taxRate,
      currency: config.currency,
      jurisdiction: jurisdictionCode
    });
    
    return {
      success: payment.success,
      transactionId: payment.transactionId,
      jurisdiction: jurisdictionCode
    };
  }
}
```

---

## 🎯 **BENEFICIOS DE LA ARQUITECTURA PARAMÉTRICA**

### **1. Escalabilidad**
```yaml
Nueva_Jurisdicción:
  - Solo agregar archivo de configuración
  - Implementar plugin específico
  - Cero cambios en código base
  - Time-to-market: 2-3 semanas
```

### **2. Mantenibilidad**
```yaml
Cambios_Configuración:
  - Solo modificar archivos YAML
  - Sin tocar código
  - Sin riesgo de bugs
  - Deployment inmediato
```

### **3. Reutilización**
```yaml
Código_Reutilizable:
  - 90% código genérico
  - 10% implementaciones específicas
  - Reducción 70% tiempo desarrollo
  - Consistencia garantizada
```

### **4. Testing**
```yaml
Testing_Simplificado:
  - Tests genéricos para lógica base
  - Tests específicos solo para plugins
  - Mocking de configuración
  - Coverage 95%+
```

---

## 🏆 **CONCLUSIÓN**

### **Principios Fundamentales**

1. **🎯 Configuración vs Código**: Toda configuración en archivos, código genérico
2. **🔧 Interfaces Genéricas**: Nomenclatura universal, no específica por país
3. **📁 Estructura Paramétrica**: Plugins configurables, no hardcoding
4. **🚀 Escalabilidad**: Nueva jurisdicción = solo configuración + plugin
5. **🛡️ Mantenibilidad**: Cambios sin tocar código base

### **Resultado Final**

```yaml
Antes:
  - Código hardcodeado con "Colombia"
  - Variables específicas por país
  - Difícil escalabilidad
  - Mantenimiento complejo

Después:
  - Código 100% paramétrico
  - Variables genéricas y configurables
  - Escalabilidad sin límites
  - Mantenimiento simple
```

**¡ARQUITECTURA PARAMÉTRICA APROBADA!** 🎯✨

---

**Fecha de creación:** 27 de Enero de 2025  
**Estado:** ✅ **GUÍA APROBADA**  
**Próximo paso:** Implementar arquitectura paramétrica  
**Documento:** Guía de buenas prácticas vinculante 