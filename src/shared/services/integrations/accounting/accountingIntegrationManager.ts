// Gestor centralizado de integraciones contables colombianas
// VThink 1.0 - Accounting Integration Manager

import { AccountingIntegrationConfig, InvoiceData, InvoiceResponse, Account, JournalEntryData, JournalEntryResponse, SyncResult } from '@/shared/types/accounting';
import { SiigoIntegration } from './siigoIntegration';
import { AlegraIntegration } from './alegraIntegration';
import { ContaMaticIntegration } from './contamaticIntegration';

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
        hasTreasury: true,
        apiEndpoint: 'https://api.siigo.com/v1',
        authenticationType: 'oauth2',
        features: ['facturación_electrónica', 'contabilidad', 'nómina', 'inventarios', 'tesorería', 'reportes_avanzados'],
        limitations: ['límite_api_calls', 'solo_facturación_ventas'],
        documentationUrl: 'https://docs.siigo.com',
        isCertifiedDian: true
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
        hasTreasury: true,
        apiEndpoint: 'https://api.alegra.com/api/v1',
        authenticationType: 'api_key',
        features: ['facturación_electrónica', 'contabilidad', 'nómina', 'inventarios', 'tesorería'],
        limitations: ['límite_usuarios', 'limitaciones_reportes'],
        documentationUrl: 'https://api.alegra.com/docs',
        isCertifiedDian: true
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
        hasTreasury: true,
        apiEndpoint: 'https://api.contamatic.com/v2',
        authenticationType: 'api_key',
        features: ['facturación_electrónica', 'contabilidad', 'tesorería'],
        limitations: ['solo_empresas_pequeñas', 'limitaciones_reportes'],
        documentationUrl: 'https://api.contamatic.com/docs',
        isCertifiedDian: true
      },
      {
        id: 'siesa',
        name: 'Siesa',
        type: 'cloud',
        provider: 'Siesa',
        country: 'CO',
        hasApi: true,
        hasElectronicInvoicing: true,
        hasPayroll: true,
        hasInventory: true,
        hasTreasury: true,
        apiEndpoint: 'https://api.siesa.com/v1',
        authenticationType: 'oauth2',
        features: ['facturación_electrónica', 'contabilidad', 'inventarios', 'nómina', 'tesorería', 'reportes_avanzados'],
        limitations: ['alto_costo', 'complejidad_implementación'],
        documentationUrl: 'https://www.siesa.com/docs',
        isCertifiedDian: true
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
        // TODO: log en cada punto donde había console.log, console.error o console.warn
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

  // Obtener integraciones certificadas por DIAN
  getCertifiedDianIntegrations(): AccountingIntegrationConfig[] {
    return this.config.filter(config => config.hasApi && config.isCertifiedDian);
  }

  // Crear factura en sistema contable
  async createInvoice(integrationId: string, invoiceData: InvoiceData): Promise<InvoiceResponse> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    try {
      return await integration.createInvoice(invoiceData);
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Obtener cuentas contables
  async getAccounts(integrationId: string): Promise<Account[]> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    try {
      return await integration.getAccounts();
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Crear asiento contable
  async createJournalEntry(integrationId: string, entryData: JournalEntryData): Promise<JournalEntryResponse> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    try {
      return await integration.createJournalEntry(entryData);
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }

  // Sincronizar datos con sistema contable
  async syncData(integrationId: string, syncType: 'accounts' | 'customers' | 'products' | 'all'): Promise<SyncResult> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      return {
        success: false,
        message: `Integration ${integrationId} not found`,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const result = await integration.syncData(syncType);
      return {
        success: true,
        message: `Data synchronized successfully with ${integrationId}`,
        data: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `Error synchronizing data with ${integrationId}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Probar conexión con integración
  async testConnection(integrationId: string): Promise<SyncResult> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      return {
        success: false,
        message: `Integration ${integrationId} not found`,
        timestamp: new Date().toISOString()
      };
    }

    try {
      await integration.testConnection();
      return {
        success: true,
        message: `Connection to ${integrationId} successful`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection to ${integrationId} failed`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Obtener métricas de integración
  async getIntegrationMetrics(integrationId: string): Promise<any> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    try {
      return await integration.getMetrics();
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw error;
    }
  }
} 