/**
 * 🧪 Script de Prueba - Integración Siigo La Petite
 * 
 * Script para probar la integración completa con Siigo
 * para el caso de uso del Restaurante La Petite.
 * 
 * @author Eulalia
 * @date 27/01/2025
 * @version 1.0.0
 */

const { LaPetiteIntegrationService } = require('../src/services/la-petite-integration.service');
const { SiigoAdapter, LA_PETITE_SIIGO_CONFIG } = require('../src/adapters/siigo-adapter');

// Configuración de prueba
const TEST_CONFIG = {
  ...LA_PETITE_SIIGO_CONFIG,
  // Usar credenciales de prueba si están disponibles
  client_id: process.env.SIIGO_TEST_CLIENT_ID || LA_PETITE_SIIGO_CONFIG.client_id,
  client_secret: process.env.SIIGO_TEST_CLIENT_SECRET || LA_PETITE_SIIGO_CONFIG.client_secret,
  username: process.env.SIIGO_TEST_USERNAME || LA_PETITE_SIIGO_CONFIG.username,
  password: process.env.SIIGO_TEST_PASSWORD || LA_PETITE_SIIGO_CONFIG.password
};

class SiigoIntegrationTester {
  constructor() {
    this.integration = new LaPetiteIntegrationService();
    this.testResults = [];
    this.startTime = Date.now();
  }

  /**
   * 📝 Registrar resultado de prueba
   */
  logTestResult(testName, success, details = {}) {
    const result = {
      test: testName,
      success,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      ...details
    };

    this.testResults.push(result);
    
    const status = success ? '✅' : '❌';
    console.log(`${status} ${testName}: ${success ? 'PASÓ' : 'FALLÓ'}`);
    
    if (!success && details.error) {
      console.log(`   Error: ${details.error}`);
    }
    
    if (details.data) {
      console.log(`   Datos: ${JSON.stringify(details.data, null, 2)}`);
    }
  }

  /**
   * 🔐 Prueba de autenticación
   */
  async testAuthentication() {
    try {
      console.log('\n🔐 Probando autenticación...');
      
      const isConnected = await this.integration.initialize();
      
      this.logTestResult('Autenticación', isConnected, {
        connection_status: isConnected ? 'connected' : 'failed'
      });
      
      return isConnected;
    } catch (error) {
      this.logTestResult('Autenticación', false, {
        error: error.message
      });
      return false;
    }
  }

  /**
   * 📊 Prueba de métricas
   */
  async testMetrics() {
    try {
      console.log('\n📊 Probando métricas...');
      
      const metrics = await this.integration.getUsageMetrics();
      
      this.logTestResult('Métricas', metrics.success, {
        data: metrics.data,
        error: metrics.error
      });
      
      return metrics.success;
    } catch (error) {
      this.logTestResult('Métricas', false, {
        error: error.message
      });
      return false;
    }
  }

  /**
   * 👥 Prueba de clientes
   */
  async testCustomers() {
    try {
      console.log('\n👥 Probando clientes...');
      
      // Buscar clientes existentes
      const customers = await this.integration.syncCustomers({ limit: 5 });
      
      this.logTestResult('Sincronización de Clientes', customers.success, {
        count: customers.data?.length || 0,
        error: customers.error
      });

      // Crear cliente de prueba
      if (customers.success) {
        const testCustomer = {
          id: `test-${Date.now()}`,
          name: 'Cliente Prueba La Petite',
          identification: `TEST${Date.now()}`,
          email: 'test@lapetite.com',
          phone: '3001234567',
          address: {
            street: 'Calle 123 # 45-67',
            city: 'Bogotá',
            state: 'Cundinamarca',
            country: 'Colombia',
            postal_code: '110111'
          },
          type: 'individual',
          category: 'RESTAURANTE',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const createResult = await this.integration.createCustomer(testCustomer);
        
        this.logTestResult('Creación de Cliente', createResult.success, {
          customer_id: createResult.data?.id,
          error: createResult.error
        });
      }
      
      return customers.success;
    } catch (error) {
      this.logTestResult('Clientes', false, {
        error: error.message
      });
      return false;
    }
  }

  /**
   * 📦 Prueba de productos
   */
  async testProducts() {
    try {
      console.log('\n📦 Probando productos...');
      
      // Buscar productos existentes
      const products = await this.integration.syncProducts({ limit: 5 });
      
      this.logTestResult('Sincronización de Productos', products.success, {
        count: products.data?.length || 0,
        error: products.error
      });

      // Crear producto de prueba
      if (products.success) {
        const testProduct = {
          id: `test-prod-${Date.now()}`,
          code: `TEST${Date.now()}`,
          name: 'Plato Prueba La Petite',
          description: 'Plato de prueba para integración',
          price: 25000,
          cost: 15000,
          category: 'PLATOS_PRINCIPALES',
          tax_rate: 0.19,
          unit: 'UN',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const createResult = await this.integration.createProduct(testProduct);
        
        this.logTestResult('Creación de Producto', createResult.success, {
          product_id: createResult.data?.id,
          error: createResult.error
        });
      }
      
      return products.success;
    } catch (error) {
      this.logTestResult('Productos', false, {
        error: error.message
      });
      return false;
    }
  }

  /**
   * 📄 Prueba de facturas
   */
  async testInvoices() {
    try {
      console.log('\n📄 Probando facturas...');
      
      // Buscar facturas existentes
      const invoices = await this.integration.syncInvoices({ limit: 5 });
      
      this.logTestResult('Sincronización de Facturas', invoices.success, {
        count: invoices.data?.length || 0,
        error: invoices.error
      });

      // Crear factura de prueba
      if (invoices.success) {
        const testInvoice = {
          id: `test-inv-${Date.now()}`,
          number: `LP${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          customer: {
            id: 'test-customer',
            name: 'Cliente Prueba',
            identification: 'TEST123',
            email: 'test@example.com',
            phone: '3001234567',
            address: {
              street: 'Calle Test',
              city: 'Bogotá',
              state: 'Cundinamarca',
              country: 'Colombia',
              postal_code: '110111'
            },
            type: 'individual',
            category: 'RESTAURANTE',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          items: [
            {
              id: 'test-item-1',
              product: {
                id: 'test-product',
                code: 'TEST001',
                name: 'Producto Prueba',
                description: 'Producto de prueba',
                price: 15000,
                cost: 10000,
                category: 'PLATOS_PRINCIPALES',
                tax_rate: 0.19,
                unit: 'UN',
                active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              quantity: 2,
              unit_price: 15000,
              discount: 0,
              tax_rate: 0.19,
              total: 30000
            }
          ],
          subtotal: 30000,
          tax: 5700,
          total: 35700,
          status: 'draft',
          payment_method: 'CASH',
          notes: 'Factura de prueba para integración',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const createResult = await this.integration.createInvoice(testInvoice);
        
        this.logTestResult('Creación de Factura', createResult.success, {
          invoice_id: createResult.data?.id,
          error: createResult.error
        });
      }
      
      return invoices.success;
    } catch (error) {
      this.logTestResult('Facturas', false, {
        error: error.message
      });
      return false;
    }
  }

  /**
   * 📊 Prueba de reportes
   */
  async testReports() {
    try {
      console.log('\n📊 Probando reportes...');
      
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 30);
      
      const report = await this.integration.getSalesReport({
        date_from: dateFrom.toISOString().split('T')[0],
        date_to: new Date().toISOString().split('T')[0]
      });
      
      this.logTestResult('Reporte de Ventas', report.success, {
        data: report.data,
        error: report.error
      });
      
      return report.success;
    } catch (error) {
      this.logTestResult('Reportes', false, {
        error: error.message
      });
      return false;
    }
  }

  /**
   * 🔄 Prueba de sincronización completa
   */
  async testFullSync() {
    try {
      console.log('\n🔄 Probando sincronización completa...');
      
      const syncResult = await this.integration.fullSync();
      
      const allSuccessful = 
        syncResult.invoices.success &&
        syncResult.customers.success &&
        syncResult.products.success;
      
      this.logTestResult('Sincronización Completa', allSuccessful, {
        invoices: syncResult.invoices.success,
        customers: syncResult.customers.success,
        products: syncResult.products.success,
        errors: {
          invoices: syncResult.invoices.error,
          customers: syncResult.customers.error,
          products: syncResult.products.error
        }
      });
      
      return allSuccessful;
    } catch (error) {
      this.logTestResult('Sincronización Completa', false, {
        error: error.message
      });
      return false;
    }
  }

  /**
   * 🧹 Prueba de limpieza
   */
  async testCleanup() {
    try {
      console.log('\n🧹 Probando limpieza...');
      
      await this.integration.cleanup();
      
      this.logTestResult('Limpieza', true, {
        message: 'Recursos limpiados correctamente'
      });
      
      return true;
    } catch (error) {
      this.logTestResult('Limpieza', false, {
        error: error.message
      });
      return false;
    }
  }

  /**
   * 🏃‍♂️ Ejecutar todas las pruebas
   */
  async runAllTests() {
    console.log('🚀 Iniciando pruebas de integración Siigo - La Petite');
    console.log('=' .repeat(60));
    
    const tests = [
      { name: 'Autenticación', fn: () => this.testAuthentication() },
      { name: 'Métricas', fn: () => this.testMetrics() },
      { name: 'Clientes', fn: () => this.testCustomers() },
      { name: 'Productos', fn: () => this.testProducts() },
      { name: 'Facturas', fn: () => this.testInvoices() },
      { name: 'Reportes', fn: () => this.testReports() },
      { name: 'Sincronización Completa', fn: () => this.testFullSync() },
      { name: 'Limpieza', fn: () => this.testCleanup() }
    ];

    const results = [];
    
    for (const test of tests) {
      try {
        const success = await test.fn();
        results.push({ name: test.name, success });
      } catch (error) {
        console.error(`❌ Error en prueba ${test.name}:`, error);
        results.push({ name: test.name, success: false, error: error.message });
      }
    }

    // Resumen final
    this.printSummary(results);
    
    return results;
  }

  /**
   * 📋 Imprimir resumen de resultados
   */
  printSummary(results) {
    console.log('\n' + '=' .repeat(60));
    console.log('📋 RESUMEN DE PRUEBAS');
    console.log('=' .repeat(60));
    
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const total = results.length;
    
    console.log(`✅ Pruebas pasadas: ${passed}/${total}`);
    console.log(`❌ Pruebas fallidas: ${failed}/${total}`);
    console.log(`📊 Tasa de éxito: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Pruebas fallidas:');
      results.filter(r => !r.success).forEach(result => {
        console.log(`   - ${result.name}: ${result.error || 'Error desconocido'}`);
      });
    }
    
    console.log('\n📊 Métricas detalladas:');
    this.testResults.forEach(result => {
      const duration = result.duration;
      console.log(`   ${result.test}: ${result.success ? '✅' : '❌'} (${duration}ms)`);
    });
    
    const totalDuration = Date.now() - this.startTime;
    console.log(`\n⏱️ Tiempo total de ejecución: ${totalDuration}ms`);
    
    // Recomendaciones
    console.log('\n💡 Recomendaciones:');
    if (failed === 0) {
      console.log('   ✅ Todas las pruebas pasaron. La integración está funcionando correctamente.');
    } else if (failed <= 2) {
      console.log('   ⚠️ Algunas pruebas fallaron. Revisar configuración y credenciales.');
    } else {
      console.log('   ❌ Múltiples pruebas fallaron. Verificar conectividad y configuración.');
    }
    
    console.log('=' .repeat(60));
  }
}

// Ejecutar pruebas si se llama directamente
if (require.main === module) {
  const tester = new SiigoIntegrationTester();
  
  tester.runAllTests()
    .then(results => {
      const exitCode = results.every(r => r.success) ? 0 : 1;
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('❌ Error fatal en las pruebas:', error);
      process.exit(1);
    });
}

module.exports = { SiigoIntegrationTester }; 