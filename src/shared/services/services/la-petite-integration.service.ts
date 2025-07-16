/**
 * 🏪 Servicio de Integración La Petite - Siigo
 * 
 * Servicio que coordina la integración entre el sistema interno
 * y Siigo para el Restaurante La Petite.
 * 
 * @author Eulalia
 * @date 27/01/2025
 * @version 1.0.0
 */

import { SiigoAdapter, LA_PETITE_SIIGO_CONFIG } from '../adapters/siigo-adapter';
import { 
  SiigoInvoiceTransformer, 
  SiigoCustomerTransformer, 
  SiigoProductTransformer,
  SiigoReportTransformer,
  SiigoErrorTransformer,
  InternalInvoice,
  InternalCustomer,
  InternalProduct,
  LA_PETITE_CONFIG
} from '../transformers/siigo-transformers';

export interface IntegrationMetrics {
  total_syncs: number;
  last_sync: string;
  success_rate: number;
  errors_count: number;
  processing_time_avg: number;
}

export interface SyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
  timestamp: string;
}

export class LaPetiteIntegrationService {
  private adapter: SiigoAdapter;
  private metrics: IntegrationMetrics = {
    total_syncs: 0,
    last_sync: '',
    success_rate: 0,
    errors_count: 0,
    processing_time_avg: 0
  };

  constructor() {
    this.adapter = new SiigoAdapter(LA_PETITE_SIIGO_CONFIG);
  }

  /**
   * 🔐 Inicializar conexión
   */
  async initialize(): Promise<boolean> {
    try {
      const isConnected = await this.adapter.testConnection();
      if (isConnected) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * 📄 Sincronizar facturas
   */
  async syncInvoices(params: {
    date_from?: string;
    date_to?: string;
    status?: string;
    limit?: number;
  } = {}): Promise<SyncResult<InternalInvoice[]>> {
    const startTime = Date.now();
    
    try {
      // TODO: log Sincronizando facturas en desarrollo
      const siigoInvoices = await this.adapter.getInvoices(params);
      const internalInvoices = siigoInvoices.results.map(invoice => 
        SiigoInvoiceTransformer.fromSiigo(invoice)
      );

      this.updateMetrics(true, Date.now() - startTime);
      
      // TODO: log facturas sincronizadas en desarrollo
      return {
        success: true,
        data: internalInvoices,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);
      const transformedError = SiigoErrorTransformer.transformError(error);
      
      // TODO: log Error sincronizando facturas en desarrollo
      return {
        success: false,
        error: transformedError.message,
        details: transformedError,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 📄 Crear factura en Siigo
   */
  async createInvoice(invoice: InternalInvoice): Promise<SyncResult<InternalInvoice>> {
    const startTime = Date.now();
    
    try {
      // TODO: log Creando factura en desarrollo
      const siigoInvoice = SiigoInvoiceTransformer.toSiigo(invoice);
      const createdInvoice = await this.adapter.createInvoice(siigoInvoice);
      const internalInvoice = SiigoInvoiceTransformer.fromSiigo(createdInvoice);

      this.updateMetrics(true, Date.now() - startTime);
      
      // TODO: log Factura creada exitosamente en desarrollo
      return {
        success: true,
        data: internalInvoice,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);
      const transformedError = SiigoErrorTransformer.transformError(error);
      
      // TODO: log Error creando factura en desarrollo
      return {
        success: false,
        error: transformedError.message,
        details: transformedError,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 👥 Sincronizar clientes
   */
  async syncCustomers(params: {
    search?: string;
    limit?: number;
  } = {}): Promise<SyncResult<InternalCustomer[]>> {
    const startTime = Date.now();
    
    try {
      // TODO: log Sincronizando clientes en desarrollo
      const siigoCustomers = await this.adapter.getCustomers(params);
      const internalCustomers = siigoCustomers.results.map(customer => 
        SiigoCustomerTransformer.fromSiigo(customer)
      );

      this.updateMetrics(true, Date.now() - startTime);
      
      // TODO: log clientes sincronizados en desarrollo
      return {
        success: true,
        data: internalCustomers,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);
      const transformedError = SiigoErrorTransformer.transformError(error);
      
      // TODO: log Error sincronizando clientes en desarrollo
      return {
        success: false,
        error: transformedError.message,
        details: transformedError,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 👥 Crear cliente en Siigo
   */
  async createCustomer(customer: InternalCustomer): Promise<SyncResult<InternalCustomer>> {
    const startTime = Date.now();
    
    try {
      // TODO: log Creando cliente en desarrollo
      const siigoCustomer = SiigoCustomerTransformer.toSiigo(customer);
      const createdCustomer = await this.adapter.createCustomer(siigoCustomer);
      const internalCustomer = SiigoCustomerTransformer.fromSiigo(createdCustomer);

      this.updateMetrics(true, Date.now() - startTime);
      
      // TODO: log Cliente creado exitosamente en desarrollo
      return {
        success: true,
        data: internalCustomer,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);
      const transformedError = SiigoErrorTransformer.transformError(error);
      
      // TODO: log Error creando cliente en desarrollo
      return {
        success: false,
        error: transformedError.message,
        details: transformedError,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 👥 Buscar cliente por identificación
   */
  async findCustomer(identification: string): Promise<SyncResult<InternalCustomer | null>> {
    const startTime = Date.now();
    
    try {
      // TODO: log Buscando cliente en desarrollo
      const siigoCustomer = await this.adapter.findCustomerByIdentification(identification);
      
      if (!siigoCustomer) {
        // TODO: log Cliente no encontrado en desarrollo
        return {
          success: true,
          data: null,
          timestamp: new Date().toISOString()
        };
      }

      const internalCustomer = SiigoCustomerTransformer.fromSiigo(siigoCustomer);
      this.updateMetrics(true, Date.now() - startTime);
      
      // TODO: log Cliente encontrado en desarrollo
      return {
        success: true,
        data: internalCustomer,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);
      const transformedError = SiigoErrorTransformer.transformError(error);
      
      // TODO: log Error buscando cliente en desarrollo
      return {
        success: false,
        error: transformedError.message,
        details: transformedError,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 📦 Sincronizar productos
   */
  async syncProducts(params: {
    search?: string;
    category?: string;
    limit?: number;
  } = {}): Promise<SyncResult<InternalProduct[]>> {
    const startTime = Date.now();
    
    try {
      // TODO: log Sincronizando productos en desarrollo
      const siigoProducts = await this.adapter.getProducts(params);
      const internalProducts = siigoProducts.results.map(product => 
        SiigoProductTransformer.fromSiigo(product)
      );
      this.updateMetrics(true, Date.now() - startTime);
      // TODO: log productos sincronizados en desarrollo
      return {
        success: true,
        data: internalProducts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);
      const transformedError = SiigoErrorTransformer.transformError(error);
      // TODO: log Error sincronizando productos en desarrollo
      return {
        success: false,
        error: transformedError.message,
        details: transformedError,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 📦 Crear producto en Siigo
   */
  async createProduct(product: InternalProduct): Promise<SyncResult<InternalProduct>> {
    const startTime = Date.now();
    
    try {
      // TODO: log Creando producto en desarrollo
      const siigoProduct = SiigoProductTransformer.toSiigo(product);
      const createdProduct = await this.adapter.createProduct(siigoProduct);
      const internalProduct = SiigoProductTransformer.fromSiigo(createdProduct);

      this.updateMetrics(true, Date.now() - startTime);
      
      // TODO: log Producto creado exitosamente en desarrollo
      return {
        success: true,
        data: internalProduct,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);
      const transformedError = SiigoErrorTransformer.transformError(error);
      
      // TODO: log Error creando producto en desarrollo
      return {
        success: false,
        error: transformedError.message,
        details: transformedError,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 📊 Obtener reporte de ventas
   */
  async getSalesReport(params: {
    date_from: string;
    date_to: string;
    customer_id?: string;
    product_id?: string;
    group_by?: string;
  }): Promise<SyncResult<any>> {
    const startTime = Date.now();
    
    try {
      // TODO: log Generando reporte de ventas en desarrollo
      const siigoReport = await this.adapter.getSalesReport(params);
      const internalReport = SiigoReportTransformer.transformSalesReport(siigoReport);

      this.updateMetrics(true, Date.now() - startTime);
      
      // TODO: log Reporte de ventas generado exitosamente en desarrollo
      return {
        success: true,
        data: internalReport,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);
      const transformedError = SiigoErrorTransformer.transformError(error);
      
      // TODO: log Error generando reporte de ventas en desarrollo
      return {
        success: false,
        error: transformedError.message,
        details: transformedError,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 📊 Obtener métricas de uso
   */
  async getUsageMetrics(): Promise<SyncResult<any>> {
    try {
      const metrics = await this.adapter.getUsageMetrics();
      
      return {
        success: true,
        data: {
          ...metrics,
          integration_metrics: this.metrics
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const transformedError = SiigoErrorTransformer.transformError(error);
      
      return {
        success: false,
        error: transformedError.message,
        details: transformedError,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 🔄 Sincronización completa
   */
  async fullSync(): Promise<{
    invoices: SyncResult<InternalInvoice[]>;
    customers: SyncResult<InternalCustomer[]>;
    products: SyncResult<InternalProduct[]>;
    metrics: SyncResult<any>;
  }> {
    // TODO: log Iniciando sincronización completa en desarrollo
    const startTime = Date.now();
    
    try {
      // Sincronizar en paralelo para mayor eficiencia
      const [invoices, customers, products, metrics] = await Promise.all([
        this.syncInvoices({ limit: 100 }),
        this.syncCustomers({ limit: 100 }),
        this.syncProducts({ limit: 100 }),
        this.getUsageMetrics()
      ]);

      const totalTime = Date.now() - startTime;
      // TODO: log Sincronización completa finalizada en desarrollo
      
      return {
        invoices,
        customers,
        products,
        metrics
      };

    } catch (error) {
      // TODO: log Error en sincronización completa en desarrollo
      throw error;
    }
  }

  /**
   * 🔄 Sincronización incremental (últimas 24 horas)
   */
  async incrementalSync(): Promise<{
    invoices: SyncResult<InternalInvoice[]>;
    customers: SyncResult<InternalCustomer[]>;
    products: SyncResult<InternalProduct[]>;
  }> {
    // console.log('🔄 Iniciando sincronización incremental...');
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateFrom = yesterday.toISOString().split('T')[0];
    
    try {
      const [invoices, customers, products] = await Promise.all([
        this.syncInvoices({ 
          date_from: dateFrom,
          limit: 50 
        }),
        this.syncCustomers({ limit: 20 }),
        this.syncProducts({ limit: 20 })
      ]);

      // console.log('✅ Sincronización incremental finalizada');
      
      return {
        invoices,
        customers,
        products
      };

    } catch (error) {
      // console.error('❌ Error en sincronización incremental:', error);
      throw error;
    }
  }

  /**
   * 📈 Actualizar métricas
   */
  private updateMetrics(success: boolean, processingTime: number): void {
    this.metrics.total_syncs++;
    this.metrics.last_sync = new Date().toISOString();
    
    if (success) {
      const currentSuccessRate = this.metrics.success_rate;
      const totalSyncs = this.metrics.total_syncs;
      this.metrics.success_rate = ((currentSuccessRate * (totalSyncs - 1)) + 1) / totalSyncs;
    } else {
      this.metrics.errors_count++;
      const currentSuccessRate = this.metrics.success_rate;
      const totalSyncs = this.metrics.total_syncs;
      this.metrics.success_rate = (currentSuccessRate * (totalSyncs - 1)) / totalSyncs;
    }

    // Actualizar tiempo promedio de procesamiento
    const currentAvg = this.metrics.processing_time_avg;
    const totalSyncs = this.metrics.total_syncs;
    this.metrics.processing_time_avg = ((currentAvg * (totalSyncs - 1)) + processingTime) / totalSyncs;
  }

  /**
   * 🧹 Limpiar recursos
   */
  async cleanup(): Promise<void> {
    await this.adapter.cleanup();
    // console.log('🧹 Recursos de integración limpiados');
  }

  /**
   * 🔍 Validar configuración
   */
  validateConfiguration(): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar configuración de Siigo
    if (!LA_PETITE_SIIGO_CONFIG.client_id) {
      errors.push('Client ID de Siigo no configurado');
    }
    if (!LA_PETITE_SIIGO_CONFIG.client_secret) {
      errors.push('Client Secret de Siigo no configurado');
    }
    if (!LA_PETITE_SIIGO_CONFIG.username) {
      errors.push('Username de Siigo no configurado');
    }
    if (!LA_PETITE_SIIGO_CONFIG.password) {
      errors.push('Password de Siigo no configurado');
    }

    // Validar configuración de La Petite
    if (LA_PETITE_CONFIG.default_tax_rate <= 0) {
      warnings.push('Tasa de impuesto por defecto debe ser mayor a 0');
    }

    if (Object.keys(LA_PETITE_CONFIG.product_categories).length === 0) {
      warnings.push('No hay categorías de productos configuradas');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Instancia singleton para uso global
export const laPetiteIntegration = new LaPetiteIntegrationService(); 