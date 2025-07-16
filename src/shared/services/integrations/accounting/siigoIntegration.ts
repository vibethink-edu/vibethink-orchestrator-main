// Integración con Siigo - Sistema contable colombiano
// VThink 1.0 - Siigo Integration

import { AccountingIntegrationConfig, InvoiceData, InvoiceResponse, Account, JournalEntryData, JournalEntryResponse } from '@/shared/types/accounting';

export class SiigoIntegration {
  private apiKey: string;
  private baseUrl: string;
  private companyId: string;
  private config: AccountingIntegrationConfig;

  constructor(config: AccountingIntegrationConfig) {
    this.config = config;
    this.apiKey = process.env.SIIGO_API_KEY || '';
    this.baseUrl = config.apiEndpoint;
    this.companyId = process.env.SIIGO_COMPANY_ID || '';
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
        })),
        totals: {
          total: invoiceData.total,
          tax: invoiceData.tax
        }
      }
    };

    try {
      const response = await this.makeRequest('/documents', 'POST', payload);
      
      return {
        id: response.id,
        number: response.number,
        status: response.status,
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
      const response = await this.makeRequest('/accounts', 'GET');
      
      return response.results.map((account: any) => ({
        id: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        parent: account.parent,
        level: account.level,
        isActive: account.active
      }));
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Crear asiento contable
  async createJournalEntry(entryData: JournalEntryData): Promise<JournalEntryResponse> {
    const payload = {
      date: entryData.date,
      number: entryData.number,
      description: entryData.description,
      items: entryData.items.map(item => ({
        account: item.account,
        debit: item.debit,
        credit: item.credit,
        description: item.description
      }))
    };

    try {
      const response = await this.makeRequest('/journal-entries', 'POST', payload);
      
      return {
        id: response.id,
        number: response.number,
        status: response.status
      };
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Obtener clientes
  async getCustomers(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/customers', 'GET');
      return response.results;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Crear cliente
  async createCustomer(customerData: any): Promise<any> {
    try {
      const response = await this.makeRequest('/customers', 'POST', customerData);
      return response;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Obtener productos
  async getProducts(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/products', 'GET');
      return response.results;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Crear producto
  async createProduct(productData: any): Promise<any> {
    try {
      const response = await this.makeRequest('/products', 'POST', productData);
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
      'Authorization': `Bearer ${this.apiKey}`,
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
      throw new Error(`Siigo API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }
} 