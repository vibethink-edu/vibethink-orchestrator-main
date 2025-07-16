# Sistema Universal de Transporte - AI Pair Orchestrator Pro

## Resumen Ejecutivo

El **Sistema Universal de Transporte** es un componente transversal que maneja **cualquier tipo de envío** (ecommerce, documentos, muestras, etc.) de forma **parametrizable** por país, proveedor y dominio de negocio.

## 🎯 **Principios de Diseño**

### **1. Universalidad**
- Funciona para **cualquier dominio**: ecommerce, CRM, PQRS, healthcare, etc.
- **Una sola implementación**, múltiples usos
- **Transversal** a toda la plataforma

### **2. Parametrización**
- **Configuración por país**: Reglas, impuestos, restricciones
- **Configuración por proveedor**: APIs, formatos, límites
- **Configuración por dominio**: Workflows específicos

### **3. Extensibilidad**
- **Sistema de plugins** para proveedores específicos
- **Hooks** para lógica de negocio personalizada
- **APIs** para integraciones externas

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales**

```typescript
// 1. Transport Engine (Motor Principal)
class UniversalTransportEngine {
  constructor(
    private tenantContext: TenantContext,
    private pluginRegistry: TransportPluginRegistry,
    private configurationEngine: ParametricConfigurationEngine
  ) {}
  
  async processShipment(shipmentRequest: ShipmentRequest): Promise<ShipmentResult> {
    // 1. Cargar configuración paramétrica
    const config = await this.getTransportConfiguration(shipmentRequest);
    
    // 2. Seleccionar proveedor
    const provider = await this.selectProvider(shipmentRequest, config);
    
    // 3. Ejecutar con plugins
    return this.executeWithPlugins(provider, shipmentRequest, config);
  }
}

// 2. Plugin Registry (Registro de Proveedores)
class TransportPluginRegistry {
  private plugins = new Map<string, TransportPlugin>();
  
  register(plugin: TransportPlugin): void {
    this.plugins.set(plugin.id, plugin);
  }
  
  getPlugin(providerCode: string): TransportPlugin | undefined {
    return this.plugins.get(providerCode);
  }
  
  getPluginsForCountry(countryCode: string): TransportPlugin[] {
    return Array.from(this.plugins.values())
      .filter(plugin => plugin.supportsCountry(countryCode));
  }
}

// 3. Transport Plugin Interface
interface TransportPlugin {
  id: string; // Ej: "fedex_us", "fedex_co", "dhl_global"
  name: string;
  provider: string; // Ej: "FedEx", "DHL", "UPS"
  countryCode: string; // ISO 3166-1 alpha-2
  supportedServices: TransportService[];
  
  // Métodos principales
  createShipment(request: ShipmentRequest): Promise<ShipmentResult>;
  trackShipment(trackingNumber: string): Promise<TrackingResult>;
  getRates(request: RateRequest): Promise<RateResult>;
  
  // Hooks para extensibilidad
  hooks?: {
    beforeShipment?: (request: ShipmentRequest) => Promise<ShipmentRequest>;
    afterShipment?: (result: ShipmentResult) => Promise<void>;
    beforeTracking?: (trackingNumber: string) => Promise<string>;
    afterTracking?: (result: TrackingResult) => Promise<void>;
  };
}
```

### **Configuración Paramétrica**

```typescript
// Configuración por país/proveedor
interface TransportConfiguration {
  countryCode: string;
  providers: {
    [providerCode: string]: ProviderConfiguration;
  };
  rules: {
    customs: CustomsRules;
    restrictions: RestrictionRules;
    taxes: TaxRules;
  };
  workflows: {
    [domain: string]: TransportWorkflow;
  };
}

interface ProviderConfiguration {
  enabled: boolean;
  apiCredentials: APICredentials;
  services: ServiceConfiguration[];
  limits: ProviderLimits;
  formats: {
    trackingNumber: string; // Regex pattern
    address: AddressFormat;
    weight: WeightFormat;
  };
}

// Ejemplo de configuración para Colombia
const colombiaConfig: TransportConfiguration = {
  countryCode: "CO",
  providers: {
    "fedex_co": {
      enabled: true,
      apiCredentials: { /* ... */ },
      services: [
        { code: "PRIORITY", name: "FedEx Priority", maxWeight: 68 },
        { code: "ECONOMY", name: "FedEx Economy", maxWeight: 68 }
      ],
      limits: { maxWeight: 68, maxValue: 10000 },
      formats: {
        trackingNumber: "^[0-9]{12}$",
        address: "COLOMBIAN_FORMAT",
        weight: "KG"
      }
    },
    "dhl_co": {
      enabled: true,
      apiCredentials: { /* ... */ },
      services: [
        { code: "EXPRESS", name: "DHL Express", maxWeight: 70 },
        { code: "GROUND", name: "DHL Ground", maxWeight: 70 }
      ],
      limits: { maxWeight: 70, maxValue: 15000 },
      formats: {
        trackingNumber: "^[0-9]{10}$",
        address: "COLOMBIAN_FORMAT",
        weight: "KG"
      }
    }
  },
  rules: {
    customs: {
      requiresInvoice: true,
      maxDutyFreeValue: 200,
      restrictedItems: ["electronics", "pharmaceuticals"]
    },
    restrictions: {
      maxWeight: 70,
      prohibitedItems: ["weapons", "drugs"]
    },
    taxes: {
      iva: 19,
      customsDuty: 0.15
    }
  },
  workflows: {
    ecommerce: {
      steps: ["validation", "label_generation", "pickup_scheduling", "tracking"],
      notifications: ["customer", "warehouse", "logistics"]
    },
    documents: {
      steps: ["validation", "label_generation", "tracking"],
      notifications: ["sender", "recipient"]
    }
  }
};
```

## 🔌 **Sistema de Plugins**

### **Plugin FedEx Colombia**

```typescript
class FedExColombiaPlugin implements TransportPlugin {
  id = "fedex_co";
  name = "FedEx Colombia";
  provider = "FedEx";
  countryCode = "CO";
  supportedServices = [
    { code: "PRIORITY", name: "FedEx Priority", maxWeight: 68 },
    { code: "ECONOMY", name: "FedEx Economy", maxWeight: 68 }
  ];
  
  async createShipment(request: ShipmentRequest): Promise<ShipmentResult> {
    // 1. Validar según reglas de Colombia
    await this.validateColombianRules(request);
    
    // 2. Formatear para API de FedEx
    const fedexRequest = this.formatForFedExAPI(request);
    
    // 3. Llamar API de FedEx
    const fedexResponse = await this.callFedExAPI(fedexRequest);
    
    // 4. Formatear respuesta
    return this.formatResponse(fedexResponse);
  }
  
  async trackShipment(trackingNumber: string): Promise<TrackingResult> {
    // Implementación específica de FedEx Colombia
    const fedexTracking = await this.callFedExTrackingAPI(trackingNumber);
    return this.formatTrackingResponse(fedexTracking);
  }
  
  async getRates(request: RateRequest): Promise<RateResult> {
    // Implementación específica de FedEx Colombia
    const fedexRates = await this.callFedExRatesAPI(request);
    return this.formatRatesResponse(fedexRates);
  }
  
  hooks = {
    beforeShipment: async (request: ShipmentRequest) => {
      // Validaciones específicas de Colombia
      if (request.weight > 68) {
        throw new Error("Peso máximo excedido para Colombia");
      }
      
      // Validar restricciones de aduana
      if (request.value > 200 && !request.hasInvoice) {
        throw new Error("Factura comercial requerida para valores > $200");
      }
      
      return request;
    },
    
    afterShipment: async (result: ShipmentResult) => {
      // Notificaciones específicas de Colombia
      await this.sendColombianNotifications(result);
      
      // Registrar en sistema de aduanas
      await this.registerWithCustoms(result);
    }
  };
  
  private async validateColombianRules(request: ShipmentRequest): Promise<void> {
    // Validaciones específicas del país
    if (request.restrictedItems.some(item => colombiaRestrictedItems.includes(item))) {
      throw new Error("Artículo restringido en Colombia");
    }
  }
  
  private formatForFedExAPI(request: ShipmentRequest): FedExRequest {
    // Formatear según especificaciones de FedEx Colombia
    return {
      // ... formato específico
    };
  }
}
```

### **Plugin DHL Global**

```typescript
class DHLGlobalPlugin implements TransportPlugin {
  id = "dhl_global";
  name = "DHL Global";
  provider = "DHL";
  countryCode = "GLOBAL";
  supportedServices = [
    { code: "EXPRESS", name: "DHL Express", maxWeight: 70 },
    { code: "GROUND", name: "DHL Ground", maxWeight: 70 }
  ];
  
  async createShipment(request: ShipmentRequest): Promise<ShipmentResult> {
    // Implementación global de DHL
    const dhlRequest = this.formatForDHLAPI(request);
    const dhlResponse = await this.callDHLAPI(dhlRequest);
    return this.formatResponse(dhlResponse);
  }
  
  hooks = {
    beforeShipment: async (request: ShipmentRequest) => {
      // Validaciones globales
      await this.validateGlobalRestrictions(request);
      return request;
    }
  };
}
```

## 🎛️ **Configuración por Dominio**

### **Workflow de Ecommerce**

```typescript
const ecommerceWorkflow: TransportWorkflow = {
  steps: [
    {
      id: "validation",
      type: "validation",
      rules: ["weight_limit", "value_limit", "restricted_items"]
    },
    {
      id: "label_generation",
      type: "automated",
      action: "generate_shipping_label"
    },
    {
      id: "pickup_scheduling",
      type: "automated",
      action: "schedule_pickup"
    },
    {
      id: "tracking",
      type: "automated",
      action: "enable_tracking"
    }
  ],
  notifications: [
    {
      id: "customer",
      type: "email",
      template: "shipment_created",
      triggers: ["shipment_created", "tracking_updated"]
    },
    {
      id: "warehouse",
      type: "internal",
      template: "pickup_scheduled",
      triggers: ["pickup_scheduled"]
    },
    {
      id: "logistics",
      type: "internal",
      template: "shipment_details",
      triggers: ["shipment_created"]
    }
  ]
};
```

### **Workflow de Documentos**

```typescript
const documentsWorkflow: TransportWorkflow = {
  steps: [
    {
      id: "validation",
      type: "validation",
      rules: ["document_type", "recipient_address"]
    },
    {
      id: "label_generation",
      type: "automated",
      action: "generate_document_label"
    },
    {
      id: "tracking",
      type: "automated",
      action: "enable_tracking"
    }
  ],
  notifications: [
    {
      id: "sender",
      type: "email",
      template: "document_sent",
      triggers: ["document_sent"]
    },
    {
      id: "recipient",
      type: "email",
      template: "document_received",
      triggers: ["document_delivered"]
    }
  ]
};
```

## 🔧 **Implementación en Componentes**

### **Hook Universal de Transporte**

```typescript
export function useUniversalTransport() {
  const { configuration } = useParametricConfiguration();
  const [engine, setEngine] = useState<UniversalTransportEngine | null>(null);
  
  useEffect(() => {
    if (configuration) {
      const transportEngine = new UniversalTransportEngine(
        useTenant(),
        new TransportPluginRegistry(),
        new ParametricConfigurationEngine()
      );
      setEngine(transportEngine);
    }
  }, [configuration]);
  
  const createShipment = async (request: ShipmentRequest) => {
    if (!engine) throw new Error("Transport engine not initialized");
    return await engine.processShipment(request);
  };
  
  const trackShipment = async (trackingNumber: string, providerCode: string) => {
    if (!engine) throw new Error("Transport engine not initialized");
    return await engine.trackShipment(trackingNumber, providerCode);
  };
  
  const getRates = async (request: RateRequest) => {
    if (!engine) throw new Error("Transport engine not initialized");
    return await engine.getRates(request);
  };
  
  return {
    createShipment,
    trackShipment,
    getRates,
    isLoading: !engine
  };
}
```

### **Componente Universal de Transporte**

```typescript
interface UniversalTransportComponentProps {
  domain: 'ecommerce' | 'documents' | 'samples' | 'custom';
  entityId: string;
  onShipmentCreated?: (result: ShipmentResult) => void;
  onError?: (error: Error) => void;
}

function UniversalTransportComponent({
  domain,
  entityId,
  onShipmentCreated,
  onError
}: UniversalTransportComponentProps) {
  const { createShipment, trackShipment, getRates } = useUniversalTransport();
  const { configuration } = useParametricConfiguration();
  const { company } = useTenant();
  
  // Obtener configuración específica del dominio
  const domainConfig = configuration?.transport?.workflows?.[domain];
  const availableProviders = configuration?.transport?.providers?.[company.country_code];
  
  const handleCreateShipment = async (shipmentData: ShipmentFormData) => {
    try {
      const request: ShipmentRequest = {
        ...shipmentData,
        domain,
        entityId,
        countryCode: company.country_code,
        companyId: company.id
      };
      
      const result = await createShipment(request);
      onShipmentCreated?.(result);
    } catch (error) {
      onError?.(error as Error);
    }
  };
  
  return (
    <div className="universal-transport-component">
      <ShipmentForm 
        providers={availableProviders}
        workflow={domainConfig}
        onSubmit={handleCreateShipment}
      />
      <ShipmentTracking 
        onTrack={trackShipment}
        onGetRates={getRates}
      />
    </div>
  );
}
```

## 📊 **Casos de Uso Universales**

### **1. Ecommerce**
```typescript
// En componente de checkout
<UniversalTransportComponent 
  domain="ecommerce"
  entityId={order.id}
  onShipmentCreated={(result) => {
    updateOrderWithTracking(order.id, result.trackingNumber);
    sendOrderConfirmation(order.id);
  }}
/>
```

### **2. CRM - Envío de Documentos**
```typescript
// En componente de CRM
<UniversalTransportComponent 
  domain="documents"
  entityId={document.id}
  onShipmentCreated={(result) => {
    updateDocumentStatus(document.id, 'shipped');
    notifyRecipient(document.id, result.trackingNumber);
  }}
/>
```

### **3. PQRS - Envío de Respuestas**
```typescript
// En componente de PQRS
<UniversalTransportComponent 
  domain="documents"
  entityId={pqrs.id}
  onShipmentCreated={(result) => {
    updatePQRStatus(pqrs.id, 'response_shipped');
    logPQRActivity(pqrs.id, 'shipping_response', result);
  }}
/>
```

### **4. Healthcare - Envío de Muestras**
```typescript
// En componente de healthcare
<UniversalTransportComponent 
  domain="samples"
  entityId={sample.id}
  onShipmentCreated={(result) => {
    updateSampleStatus(sample.id, 'shipped_to_lab');
    scheduleLabNotification(sample.id, result.estimatedDelivery);
  }}
/>
```

## 🔄 **Registro de Plugins**

### **Registro Automático**

```typescript
// En archivo de configuración de plugins
export const transportPlugins: TransportPlugin[] = [
  new FedExColombiaPlugin(),
  new FedExUSPlugin(),
  new DHLGlobalPlugin(),
  new UPSColombiaPlugin(),
  new UPSUSPlugin(),
  new ServientregaColombiaPlugin(),
  new InterrapidisimoColombiaPlugin(),
  // ... más plugins
];

// Registro automático
export function registerTransportPlugins(registry: TransportPluginRegistry) {
  transportPlugins.forEach(plugin => {
    registry.register(plugin);
  });
}
```

### **Configuración de Nuevos Proveedores**

```typescript
// Para agregar un nuevo proveedor, solo necesitas:
// 1. Crear el plugin
class NewProviderPlugin implements TransportPlugin {
  id = "new_provider_co";
  name = "New Provider Colombia";
  provider = "NewProvider";
  countryCode = "CO";
  // ... implementación
}

// 2. Agregar a la lista de plugins
export const transportPlugins = [
  // ... plugins existentes
  new NewProviderPlugin(),
];

// 3. Configurar en la base de datos
// El sistema automáticamente detecta y configura el nuevo proveedor
```

## 📈 **Métricas y Monitoreo**

### **Métricas del Sistema**

```typescript
interface TransportMetrics {
  // Uso por proveedor
  providerUsage: {
    [providerCode: string]: {
      shipments: number;
      successRate: number;
      averageCost: number;
    };
  };
  
  // Uso por dominio
  domainUsage: {
    [domain: string]: {
      shipments: number;
      totalValue: number;
      averageWeight: number;
    };
  };
  
  // Performance
  performance: {
    averageResponseTime: number;
    errorRate: number;
    fallbackUsage: number;
  };
  
  // Costos
  costs: {
    totalSpent: number;
    averageCostPerShipment: number;
    costByProvider: { [provider: string]: number };
  };
}
```

## 🎯 **Beneficios del Sistema Universal**

### **1. Reutilización Total**
- **Una sola implementación** para todos los dominios
- **Cero duplicación** de código
- **Mantenimiento centralizado**

### **2. Escalabilidad Automática**
- **Nuevos proveedores** se agregan como plugins
- **Nuevos países** se configuran paramétricamente
- **Nuevos dominios** heredan toda la funcionalidad

### **3. Flexibilidad Extrema**
- **Configuración por país** automática
- **Workflows específicos** por dominio
- **Extensibilidad** sin modificar el core

### **4. Consistencia Global**
- **Misma experiencia** en todos los módulos
- **Mismos estándares** de calidad
- **Misma seguridad** y validaciones

## 🚀 **Implementación**

### **Fase 1: Core del Sistema**
1. Implementar `UniversalTransportEngine`
2. Crear `TransportPluginRegistry`
3. Desarrollar sistema de configuración paramétrica

### **Fase 2: Plugins Básicos**
1. Implementar plugins para proveedores principales
2. Configurar reglas por país
3. Crear workflows por dominio

### **Fase 3: Integración**
1. Integrar con módulos existentes
2. Migrar lógica específica a plugins
3. Implementar métricas y monitoreo

### **Fase 4: Extensibilidad**
1. Documentar proceso de creación de plugins
2. Crear herramientas de configuración
3. Implementar marketplace de plugins

---

**Este sistema es la materialización perfecta de la regla universal: una sola implementación que sirve para todo, parametrizable y extensible.** 