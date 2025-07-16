// Integración con ContaMatic - Sistema contable colombiano
// VThink 1.0 - ContaMatic Integration

import { AccountingIntegrationConfig, InvoiceData, InvoiceResponse, Account, JournalEntryData, JournalEntryResponse } from '@/shared/types/accounting';

export class ContaMaticIntegration {
  private apiKey: string;
  private baseUrl: string;
  private config: AccountingIntegrationConfig;

  constructor(config: AccountingIntegrationConfig) {
    this.config = config;
    this.apiKey = process.env.CONTAMATIC_API_KEY || '';
    this.baseUrl = config.apiEndpoint;
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
      items: invoiceData.items.map(item => ({
        codigo: item.code,
        descripcion: item.name,
        cantidad: item.quantity,
        precio: item.price,
        iva: item.tax,
        total: item.total
      })),
      total: invoiceData.total,
      iva: invoiceData.tax,
      notas: invoiceData.notes
    };

    try {
      const response = await this.makeRequest('/facturas', 'POST', payload);
      
      return {
        id: response.id,
        number: response.numero,
        status: response.estado,
        url: response.url,
        xml: response.xml,
        pdf: response.pdf
      };
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Obtener cuentas contables
  async getAccounts(): Promise<Account[]> {
    try {
      const response = await this.makeRequest('/cuentas', 'GET');
      
      return response.map((account: any) => ({
        id: account.id,
        code: account.codigo,
        name: account.nombre,
        type: account.tipo,
        parent: account.padre,
        level: account.nivel,
        isActive: account.activa
      }));
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Crear asiento contable
  async createJournalEntry(entryData: JournalEntryData): Promise<JournalEntryResponse> {
    const payload = {
      fecha: entryData.date,
      numero: entryData.number,
      descripcion: entryData.description,
      referencia: entryData.reference,
      items: entryData.items.map(item => ({
        cuenta: item.account,
        debito: item.debit,
        credito: item.credit,
        descripcion: item.description
      }))
    };

    try {
      const response = await this.makeRequest('/asientos', 'POST', payload);
      
      return {
        id: response.id,
        number: response.numero,
        status: response.estado
      };
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Obtener clientes
  async getCustomers(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/clientes', 'GET');
      return response;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Crear cliente
  async createCustomer(customerData: any): Promise<any> {
    try {
      const response = await this.makeRequest('/clientes', 'POST', customerData);
      return response;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Obtener productos
  async getProducts(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/productos', 'GET');
      return response;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Crear producto
  async createProduct(productData: any): Promise<any> {
    try {
      const response = await this.makeRequest('/productos', 'POST', productData);
      return response;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Obtener centros de costo
  async getCostCenters(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/centros-costo', 'GET');
      return response;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Sincronizar datos
  async syncData(syncType: 'accounts' | 'customers' | 'products' | 'all'): Promise<any> {
    const results: any = {};

    try {
      if (syncType === 'accounts' || syncType === 'all') {
        results.accounts = await this.getAccounts();
      }

      if (syncType === 'customers' || syncType === 'all') {
        results.customers = await this.getCustomers();
      }

      if (syncType === 'products' || syncType === 'all') {
        results.products = await this.getProducts();
      }

      return results;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Probar conexión
  async testConnection(): Promise<void> {
    try {
      await this.makeRequest('/ping', 'GET');
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Obtener métricas
  async getMetrics(): Promise<any> {
    try {
      const [accounts, customers, products] = await Promise.all([
        this.getAccounts(),
        this.getCustomers(),
        this.getProducts()
      ]);

      return {
        totalAccounts: accounts.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Método privado para hacer requests
  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json'
    };

    const options: RequestInit = {
      method,
      headers
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ContaMatic API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }
} 