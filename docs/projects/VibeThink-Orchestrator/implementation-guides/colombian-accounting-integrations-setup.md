# Guía de Implementación: Integraciones de Contabilidad Colombiana

## 📅 Fecha: 05/07/2025
## 🎯 Objetivo: Migrar e implementar integraciones con sistemas contables colombianos

---

## 📊 **Sistemas Contables Colombianos Identificados**

### **1. Sistemas Cloud con API Completa**

#### **Siigo (Principal)**
```typescript
// src/shared/services/integrations/accounting/siigoIntegration.ts
export class SiigoIntegration {
  private apiKey: string;
  private baseUrl: string;
  private companyId: string;

  constructor(config: IntegrationConfig) {
    this.apiKey = config.apiKeys?.find(k => k.key === 'api_key')?.key || '';
    this.baseUrl = 'https://api.siigo.com/v1';
    this.companyId = config.config.companyId || '';
  }

  // Crear factura electrónica
  async createInvoice(invoiceData: InvoiceData): Promise<InvoiceResponse> {
    const payload = {
      document: {
        id: invoiceData.number,
        type: 'Invoice',
        date: invoiceData.date,
        customer: {
          identification: invoiceData.customerId,
          name: invoiceData.customerName
        },
        items: invoiceData.items.map(item => ({
          code: item.code,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          tax: item.tax
        }))
      }
    };

    const response = await this.makeRequest('/documents', 'POST', payload);
    return response;
  }

  // Obtener cuentas contables
  async getAccounts(): Promise<Account[]> {
    const response = await this.makeRequest('/accounts', 'GET');
    return response.results;
  }

  // Crear asiento contable
  async createJournalEntry(entryData: JournalEntryData): Promise<JournalEntryResponse> {
    const payload = {
      date: entryData.date,
      number: entryData.number,
      items: entryData.items.map(item => ({
        account: item.account,
        debit: item.debit,
        credit: item.credit,
        description: item.description
      }))
    };

    const response = await this.makeRequest('/journal-entries', 'POST', payload);
    return response;
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`Siigo API error: ${response.statusText}`);
    }

    return response.json();
  }
}
```

#### **Alegra**
```typescript
// src/shared/services/integrations/accounting/alegraIntegration.ts
export class AlegraIntegration {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: IntegrationConfig) {
    this.apiKey = config.apiKeys?.find(k => k.key === 'api_key')?.key || '';
    this.baseUrl = 'https://api.alegra.com/api/v1';
  }

  // Crear factura
  async createInvoice(invoiceData: InvoiceData): Promise<InvoiceResponse> {
    const payload = {
      client: invoiceData.customerId,
      items: invoiceData.items.map(item => ({
        id: item.code,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      date: invoiceData.date,
      dueDate: invoiceData.dueDate
    };

    const response = await this.makeRequest('/invoices', 'POST', payload);
    return response;
  }

  // Obtener contactos (clientes/proveedores)
  async getContacts(): Promise<Contact[]> {
    const response = await this.makeRequest('/contacts', 'GET');
    return response;
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`Alegra API error: ${response.statusText}`);
    }

    return response.json();
  }
}
```

#### **ContaMatic**
```typescript
// src/shared/services/integrations/accounting/contamaticIntegration.ts
export class ContaMaticIntegration {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: IntegrationConfig) {
    this.apiKey = config.apiKeys?.find(k => k.key === 'api_key')?.key || '';
    this.baseUrl = 'https://api.contamatic.com/v2';
  }

  // Crear factura
  async createInvoice(invoiceData: InvoiceData): Promise<InvoiceResponse> {
    const payload = {
      tipo: 'FACTURA',
      numero: invoiceData.number,
      fecha: invoiceData.date,
      cliente: {
        nit: invoiceData.customerId,
        nombre: invoiceData.customerName
      },
      items: invoiceData.items
    };

    const response = await this.makeRequest('/facturas', 'POST', payload);
    return response;
  }

  // Obtener cuentas contables
  async getAccounts(): Promise<Account[]> {
    const response = await this.makeRequest('/cuentas', 'GET');
    return response;
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`ContaMatic API error: ${response.statusText}`);
    }

    return response.json();
  }
}
```

---

## 🏗️ **Nueva Estructura Propuesta**

### **1. Ubicación en la Arquitectura**
```
src/
├── shared/
│   ├── services/
│   │   └── integrations/
│   │       ├── accounting/           # ← NUEVA UBICACIÓN
│   │       │   ├── siigoIntegration.ts
│   │       │   ├── alegraIntegration.ts
│   │       │   ├── contamaticIntegration.ts
│   │       │   ├── sapIntegration.ts
│   │       │   └── accountingIntegrationManager.ts
│   │       └── external/             # ← Integraciones externas existentes
│   │           ├── datadogIntegration.ts
│   │           ├── newRelicIntegration.ts
│   │           └── awsCloudWatchIntegration.ts
│   └── types/
│       └── accounting.ts             # ← Tipos específicos de contabilidad
```

### **2. Gestor de Integraciones Contables**
```typescript
// src/shared/services/integrations/accounting/accountingIntegrationManager.ts
export class AccountingIntegrationManager {
  private integrations: Map<string, any> = new Map();
  private config: AccountingIntegrationConfig[] = [];

  constructor() {
    this.loadAccountingIntegrations();
  }

  // Cargar configuraciones de integraciones contables
  private loadAccountingIntegrations() {
    this.config = [
      {
        id: 'siigo',
        name: 'Siigo',
        type: 'cloud',
        provider: 'Siigo',
        country: 'CO',
        hasApi: true,
        hasElectronicInvoicing: true,
        hasPayroll: true,
        hasInventory: true,
        apiEndpoint: 'https://api.siigo.com/v1',
        authenticationType: 'oauth2',
        features: ['facturación_electrónica', 'contabilidad', 'nómina', 'inventarios'],
        limitations: ['límite_api_calls', 'solo_facturación_ventas'],
        documentationUrl: 'https://docs.siigo.com'
      },
      {
        id: 'alegra',
        name: 'Alegra',
        type: 'cloud',
        provider: 'Alegra',
        country: 'CO',
        hasApi: true,
        hasElectronicInvoicing: true,
        hasPayroll: true,
        hasInventory: true,
        apiEndpoint: 'https://api.alegra.com/api/v1',
        authenticationType: 'api_key',
        features: ['facturación_electrónica', 'contabilidad', 'nómina', 'inventarios', 'tesorería'],
        limitations: ['límite_usuarios', 'limitaciones_reportes'],
        documentationUrl: 'https://api.alegra.com/docs'
      },
      {
        id: 'contamatic',
        name: 'ContaMatic',
        type: 'cloud',
        provider: 'ContaMatic',
        country: 'CO',
        hasApi: true,
        hasElectronicInvoicing: true,
        hasPayroll: false,
        hasInventory: false,
        apiEndpoint: 'https://api.contamatic.com/v2',
        authenticationType: 'api_key',
        features: ['facturación_electrónica', 'contabilidad', 'tesorería'],
        limitations: ['solo_empresas_pequeñas', 'limitaciones_reportes'],
        documentationUrl: 'https://api.contamatic.com/docs'
      }
    ];

    this.initializeIntegrations();
  }

  // Inicializar integraciones
  private initializeIntegrations() {
    this.config.forEach(config => {
      if (config.hasApi) {
        const integration = this.createIntegration(config);
        if (integration) {
          this.integrations.set(config.id, integration);
        }
      }
    });
  }

  // Crear instancia de integración
  private createIntegration(config: AccountingIntegrationConfig): any {
    switch (config.id) {
      case 'siigo':
        return new SiigoIntegration(config);
      case 'alegra':
        return new AlegraIntegration(config);
      case 'contamatic':
        return new ContaMaticIntegration(config);
      default:
        console.warn(`Unknown accounting integration: ${config.id}`);
        return null;
    }
  }

  // Obtener integración por ID
  getIntegration(integrationId: string): any {
    return this.integrations.get(integrationId);
  }

  // Listar integraciones disponibles
  getAvailableIntegrations(): AccountingIntegrationConfig[] {
    return this.config.filter(config => config.hasApi);
  }

  // Crear factura en sistema contable
  async createInvoice(integrationId: string, invoiceData: InvoiceData): Promise<InvoiceResponse> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    return await integration.createInvoice(invoiceData);
  }

  // Obtener cuentas contables
  async getAccounts(integrationId: string): Promise<Account[]> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    return await integration.getAccounts();
  }

  // Crear asiento contable
  async createJournalEntry(integrationId: string, entryData: JournalEntryData): Promise<JournalEntryResponse> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    return await integration.createJournalEntry(entryData);
  }
}
```

---

## 📋 **Tipos de Datos para Contabilidad**

```typescript
// src/shared/types/accounting.ts
export interface InvoiceData {
  number: string;
  date: string;
  dueDate?: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  total: number;
  tax: number;
  currency: string;
}

export interface InvoiceItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
}

export interface InvoiceResponse {
  id: string;
  number: string;
  status: string;
  url?: string;
  xml?: string;
  pdf?: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  parent?: string;
  level: number;
}

export interface JournalEntryData {
  date: string;
  number: string;
  description: string;
  items: JournalEntryItem[];
}

export interface JournalEntryItem {
  account: string;
  debit: number;
  credit: number;
  description: string;
}

export interface JournalEntryResponse {
  id: string;
  number: string;
  status: string;
}

export interface AccountingIntegrationConfig {
  id: string;
  name: string;
  type: 'cloud' | 'on_premise' | 'hybrid';
  provider: string;
  country: string;
  hasApi: boolean;
  hasElectronicInvoicing: boolean;
  hasPayroll: boolean;
  hasInventory: boolean;
  apiEndpoint: string;
  authenticationType: 'oauth2' | 'api_key' | 'basic';
  features: string[];
  limitations: string[];
  documentationUrl: string;
}
```

---

## 🔧 **Migración de la Base de Datos**

### **1. Mantener Tablas Existentes**
Las tablas ya están creadas en las migraciones:
- `accounting_software` - Catálogo de software
- `company_accounting_config` - Configuración por empresa
- `accounting_integrations` - Integraciones activas
- `accounting_systems` - Sistemas disponibles

### **2. Actualizar Estructura de Servicios**
```typescript
// src/shared/services/accountingService.ts
export class AccountingService {
  private integrationManager: AccountingIntegrationManager;
  private supabase: SupabaseClient;

  constructor() {
    this.integrationManager = new AccountingIntegrationManager();
    this.supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  }

  // Obtener configuración de contabilidad de la empresa
  async getCompanyAccountingConfig(companyId: string) {
    const { data, error } = await this.supabase
      .from('company_accounting_config')
      .select(`
        *,
        accounting_software:accounting_software(*)
      `)
      .eq('company_id', companyId)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  }

  // Crear factura en sistema contable
  async createInvoice(companyId: string, invoiceData: InvoiceData): Promise<InvoiceResponse> {
    const config = await this.getCompanyAccountingConfig(companyId);
    
    if (!config) {
      throw new Error('No accounting configuration found for company');
    }

    const integration = this.integrationManager.getIntegration(config.accounting_software.software_name.toLowerCase());
    
    if (!integration) {
      throw new Error(`Integration not available for ${config.accounting_software.software_name}`);
    }

    return await integration.createInvoice(invoiceData);
  }

  // Sincronizar datos con sistema contable
  async syncAccountingData(companyId: string): Promise<void> {
    const config = await this.getCompanyAccountingConfig(companyId);
    
    if (!config) return;

    const integration = this.integrationManager.getIntegration(config.accounting_software.software_name.toLowerCase());
    
    if (!integration) return;

    // Sincronizar cuentas contables
    const accounts = await integration.getAccounts();
    
    // Guardar en base de datos local
    await this.supabase
      .from('accounting_accounts')
      .upsert(accounts.map(account => ({
        company_id: companyId,
        account_code: account.code,
        account_name: account.name,
        account_type: account.type,
        integration_id: config.accounting_software_id
      })));
  }
}
```

---

## 🧪 **Scripts de Prueba**

### **1. Script de Prueba de Integraciones Contables**
```typescript
// scripts/test-accounting-integrations.js
import { AccountingIntegrationManager } from '@/shared/services/integrations/accounting/accountingIntegrationManager';

const testAccountingIntegrations = async () => {
  console.log('🧪 Probando integraciones contables colombianas...');

  const manager = new AccountingIntegrationManager();

  // Datos de prueba
  const testInvoice = {
    number: 'FAC-001',
    date: '2025-07-05',
    customerId: '900123456-7',
    customerName: 'Empresa de Prueba SAS',
    items: [
      {
        code: 'SERV-001',
        name: 'Servicio de Consultoría',
        quantity: 1,
        price: 100000,
        tax: 19000,
        total: 119000
      }
    ],
    total: 119000,
    tax: 19000,
    currency: 'COP'
  };

  // Probar cada integración
  const integrations = manager.getAvailableIntegrations();
  
  for (const integration of integrations) {
    console.log(`📊 Probando ${integration.name}...`);
    
    try {
      // Probar creación de factura
      const invoiceResponse = await manager.createInvoice(integration.id, testInvoice);
      console.log(`✅ Factura creada en ${integration.name}:`, invoiceResponse.id);
      
      // Probar obtención de cuentas
      const accounts = await manager.getAccounts(integration.id);
      console.log(`✅ Cuentas obtenidas de ${integration.name}:`, accounts.length);
      
    } catch (error) {
      console.error(`❌ Error en ${integration.name}:`, error.message);
    }
  }

  console.log('✅ Pruebas de integraciones contables completadas');
};

testAccountingIntegrations();
```

---

## 📋 **Checklist de Migración**

### **✅ Estructura de Archivos**
- [ ] Crear directorio `src/shared/services/integrations/accounting/`
- [ ] Migrar integraciones existentes
- [ ] Crear `accountingIntegrationManager.ts`
- [ ] Crear tipos en `src/shared/types/accounting.ts`

### **✅ Base de Datos**
- [ ] Verificar que las migraciones estén aplicadas
- [ ] Validar datos de software contable
- [ ] Probar funciones de base de datos

### **✅ Servicios**
- [ ] Implementar `AccountingService`
- [ ] Crear métodos de sincronización
- [ ] Implementar manejo de errores

### **✅ Pruebas**
- [ ] Crear scripts de prueba
- [ ] Probar cada integración
- [ ] Validar datos de facturación

---

## 🎯 **Próximos Pasos**

1. **Migrar integraciones existentes** a la nueva estructura
2. **Implementar AccountingService** con métodos completos
3. **Crear componentes UI** para gestión de integraciones
4. **Implementar sincronización automática** de datos
5. **Agregar más sistemas contables** según necesidad

---

**Documentado por**: Marcelo Escallón  
**Fecha**: 05/07/2025  
**Versión**: VThink 1.0  
**Estado**: Listo para migración 