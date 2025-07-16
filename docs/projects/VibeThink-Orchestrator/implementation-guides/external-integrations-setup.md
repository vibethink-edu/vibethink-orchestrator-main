# Guía de Implementación: Integraciones con Sistemas Externos

## 📅 Fecha: 05/07/2025
## 🎯 Objetivo: Implementar integraciones con sistemas externos para alertas y monitoreo

---

## 🔗 Arquitectura de Integraciones

### **1. Sistema de Integración Centralizado**
```typescript
// src/shared/services/integrationService.ts
interface IntegrationConfig {
  id: string;
  name: string;
  type: IntegrationType;
  enabled: boolean;
  config: Record<string, any>;
  webhooks?: WebhookConfig[];
  apiKeys?: ApiKeyConfig[];
}

interface WebhookConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  bodyTemplate?: string;
}

interface ApiKeyConfig {
  key: string;
  secret?: string;
  permissions: string[];
}
```

### **2. Tipos de Integración**
```typescript
enum IntegrationType {
  MONITORING = 'monitoring',
  ALERTING = 'alerting',
  ANALYTICS = 'analytics',
  SECURITY = 'security',
  BUSINESS = 'business',
  INFRASTRUCTURE = 'infrastructure'
}
```

---

## 📊 Integraciones de Monitoreo

### **1. Datadog Integration**
```typescript
// src/shared/services/integrations/datadogIntegration.ts
export class DatadogIntegration {
  private apiKey: string;
  private appKey: string;
  private baseUrl: string;

  constructor(config: IntegrationConfig) {
    this.apiKey = config.apiKeys?.find(k => k.key === 'api_key')?.key || '';
    this.appKey = config.apiKeys?.find(k => k.key === 'app_key')?.key || '';
    this.baseUrl = 'https://api.datadoghq.com/api/v1';
  }

  // Enviar métricas a Datadog
  async sendMetrics(metrics: SystemMetrics): Promise<void> {
    const payload = {
      series: [
        {
          metric: 'vthink.response_time',
          points: [[Math.floor(Date.now() / 1000), metrics.performance.responseTime]],
          type: 'gauge',
          tags: ['env:production', 'service:vthink']
        },
        {
          metric: 'vthink.error_rate',
          points: [[Math.floor(Date.now() / 1000), metrics.performance.errorRate]],
          type: 'gauge',
          tags: ['env:production', 'service:vthink']
        },
        {
          metric: 'vthink.active_users',
          points: [[Math.floor(Date.now() / 1000), metrics.business.activeUsers]],
          type: 'gauge',
          tags: ['env:production', 'service:vthink']
        }
      ]
    };

    await this.makeRequest('/series', 'POST', payload);
  }

  // Crear alerta en Datadog
  async createAlert(alert: Alert): Promise<void> {
    const payload = {
      title: alert.title,
      text: alert.message,
      priority: this.mapPriority(alert.priority),
      tags: [
        `alert_type:${alert.type}`,
        `priority:${alert.priority}`,
        'service:vthink'
      ]
    };

    await this.makeRequest('/monitor', 'POST', payload);
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': this.apiKey,
        'DD-APPLICATION-KEY': this.appKey
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`Datadog API error: ${response.statusText}`);
    }

    return response.json();
  }

  private mapPriority(priority: AlertPriority): string {
    switch (priority) {
      case AlertPriority.CRITICAL: return 'critical';
      case AlertPriority.HIGH: return 'warning';
      case AlertPriority.MEDIUM: return 'info';
      case AlertPriority.LOW: return 'info';
      default: return 'info';
    }
  }
}
```

### **2. New Relic Integration**
```typescript
// src/shared/services/integrations/newRelicIntegration.ts
export class NewRelicIntegration {
  private apiKey: string;
  private accountId: string;
  private baseUrl: string;

  constructor(config: IntegrationConfig) {
    this.apiKey = config.apiKeys?.find(k => k.key === 'api_key')?.key || '';
    this.accountId = config.config.accountId || '';
    this.baseUrl = 'https://api.newrelic.com/v2';
  }

  // Enviar métricas a New Relic
  async sendMetrics(metrics: SystemMetrics): Promise<void> {
    const payload = {
      metrics: [
        {
          name: 'Custom/VThink/ResponseTime',
          type: 'gauge',
          value: metrics.performance.responseTime,
          timestamp: Date.now()
        },
        {
          name: 'Custom/VThink/ErrorRate',
          type: 'gauge',
          value: metrics.performance.errorRate,
          timestamp: Date.now()
        },
        {
          name: 'Custom/VThink/ActiveUsers',
          type: 'gauge',
          value: metrics.business.activeUsers,
          timestamp: Date.now()
        }
      ]
    };

    await this.makeRequest('/metrics', 'POST', payload);
  }

  // Crear incidente en New Relic
  async createIncident(alert: Alert): Promise<void> {
    const payload = {
      incident: {
        title: alert.title,
        description: alert.message,
        priority: this.mapPriority(alert.priority),
        tags: [
          { key: 'alert_type', value: alert.type },
          { key: 'priority', value: alert.priority },
          { key: 'service', value: 'vthink' }
        ]
      }
    };

    await this.makeRequest('/incidents', 'POST', payload);
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`New Relic API error: ${response.statusText}`);
    }

    return response.json();
  }

  private mapPriority(priority: AlertPriority): string {
    switch (priority) {
      case AlertPriority.CRITICAL: return 'critical';
      case AlertPriority.HIGH: return 'high';
      case AlertPriority.MEDIUM: return 'medium';
      case AlertPriority.LOW: return 'low';
      default: return 'medium';
    }
  }
}
```

---

## 🔒 Integraciones de Seguridad

### **1. AWS CloudWatch Integration**
```typescript
// src/shared/services/integrations/awsCloudWatchIntegration.ts
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

export class AWSCloudWatchIntegration {
  private client: CloudWatchClient;
  private namespace: string;

  constructor(config: IntegrationConfig) {
    this.client = new CloudWatchClient({
      region: config.config.region || 'us-east-1',
      credentials: {
        accessKeyId: config.apiKeys?.find(k => k.key === 'access_key_id')?.key || '',
        secretAccessKey: config.apiKeys?.find(k => k.key === 'secret_access_key')?.key || ''
      }
    });
    this.namespace = config.config.namespace || 'VThink/Application';
  }

  // Enviar métricas a CloudWatch
  async sendMetrics(metrics: SystemMetrics): Promise<void> {
    const command = new PutMetricDataCommand({
      Namespace: this.namespace,
      MetricData: [
        {
          MetricName: 'ResponseTime',
          Value: metrics.performance.responseTime,
          Unit: 'Milliseconds',
          Dimensions: [
            { Name: 'Environment', Value: 'Production' },
            { Name: 'Service', Value: 'VThink' }
          ]
        },
        {
          MetricName: 'ErrorRate',
          Value: metrics.performance.errorRate,
          Unit: 'Percent',
          Dimensions: [
            { Name: 'Environment', Value: 'Production' },
            { Name: 'Service', Value: 'VThink' }
          ]
        },
        {
          MetricName: 'ActiveUsers',
          Value: metrics.business.activeUsers,
          Unit: 'Count',
          Dimensions: [
            { Name: 'Environment', Value: 'Production' },
            { Name: 'Service', Value: 'VThink' }
          ]
        }
      ]
    });

    await this.client.send(command);
  }

  // Crear alarma en CloudWatch
  async createAlarm(alert: Alert): Promise<void> {
    // Implementar creación de alarmas en CloudWatch
    console.log('Creating CloudWatch alarm for:', alert.title);
  }
}
```

### **2. Google Cloud Monitoring Integration**
```typescript
// src/shared/services/integrations/googleCloudMonitoringIntegration.ts
export class GoogleCloudMonitoringIntegration {
  private projectId: string;
  private credentials: any;

  constructor(config: IntegrationConfig) {
    this.projectId = config.config.projectId || '';
    this.credentials = JSON.parse(config.apiKeys?.find(k => k.key === 'service_account')?.key || '{}');
  }

  // Enviar métricas a Google Cloud Monitoring
  async sendMetrics(metrics: SystemMetrics): Promise<void> {
    const timeSeries = [
      {
        metric: {
          type: 'custom.googleapis.com/vthink/response_time',
          labels: {
            environment: 'production',
            service: 'vthink'
          }
        },
        resource: {
          type: 'global',
          labels: {
            project_id: this.projectId
          }
        },
        points: [
          {
            interval: {
              endTime: new Date().toISOString()
            },
            value: {
              doubleValue: metrics.performance.responseTime
            }
          }
        ]
      },
      {
        metric: {
          type: 'custom.googleapis.com/vthink/error_rate',
          labels: {
            environment: 'production',
            service: 'vthink'
          }
        },
        resource: {
          type: 'global',
          labels: {
            project_id: this.projectId
          }
        },
        points: [
          {
            interval: {
              endTime: new Date().toISOString()
            },
            value: {
              doubleValue: metrics.performance.errorRate
            }
          }
        ]
      }
    ];

    await this.makeRequest('/v3/projects/' + this.projectId + '/timeSeries', 'POST', {
      timeSeries
    });
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    // Implementar autenticación y requests a Google Cloud Monitoring
    console.log('Sending to Google Cloud Monitoring:', endpoint, data);
  }
}
```

---

## 📈 Integraciones de Analytics

### **1. Google Analytics Integration**
```typescript
// src/shared/services/integrations/googleAnalyticsIntegration.ts
export class GoogleAnalyticsIntegration {
  private measurementId: string;
  private apiSecret: string;

  constructor(config: IntegrationConfig) {
    this.measurementId = config.config.measurementId || '';
    this.apiSecret = config.apiKeys?.find(k => k.key === 'api_secret')?.key || '';
  }

  // Enviar eventos a Google Analytics
  async sendEvent(eventName: string, parameters: Record<string, any>): Promise<void> {
    const payload = {
      client_id: 'vthink-system',
      events: [
        {
          name: eventName,
          params: {
            ...parameters,
            engagement_time_msec: 1000
          }
        }
      ]
    };

    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Enviar métricas de negocio
  async sendBusinessMetrics(metrics: BusinessMetrics): Promise<void> {
    await this.sendEvent('business_metrics', {
      active_users: metrics.activeUsers,
      transaction_failure_rate: metrics.transactionFailureRate,
      revenue: metrics.revenue
    });
  }
}
```

### **2. Mixpanel Integration**
```typescript
// src/shared/services/integrations/mixpanelIntegration.ts
export class MixpanelIntegration {
  private token: string;

  constructor(config: IntegrationConfig) {
    this.token = config.apiKeys?.find(k => k.key === 'token')?.key || '';
  }

  // Enviar eventos a Mixpanel
  async sendEvent(eventName: string, properties: Record<string, any>): Promise<void> {
    const payload = {
      event: eventName,
      properties: {
        ...properties,
        token: this.token,
        time: Date.now()
      }
    };

    await fetch('https://api.mixpanel.com/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  }

  // Enviar métricas de usuario
  async sendUserMetrics(userId: string, metrics: any): Promise<void> {
    await this.sendEvent('user_metrics', {
      distinct_id: userId,
      ...metrics
    });
  }
}
```

---

## 🏢 Integraciones de Negocio

### **1. Salesforce Integration**
```typescript
// src/shared/services/integrations/salesforceIntegration.ts
export class SalesforceIntegration {
  private accessToken: string;
  private instanceUrl: string;

  constructor(config: IntegrationConfig) {
    this.accessToken = config.apiKeys?.find(k => k.key === 'access_token')?.key || '';
    this.instanceUrl = config.config.instanceUrl || '';
  }

  // Crear caso en Salesforce
  async createCase(alert: Alert): Promise<void> {
    const payload = {
      Subject: alert.title,
      Description: alert.message,
      Priority: this.mapPriority(alert.priority),
      Origin: 'System Alert',
      Status: 'New',
      Type: 'Technical Issue'
    };

    await this.makeRequest('/services/data/v52.0/sobjects/Case', 'POST', payload);
  }

  // Actualizar métricas de negocio
  async updateBusinessMetrics(metrics: BusinessMetrics): Promise<void> {
    // Implementar actualización de métricas en Salesforce
    console.log('Updating Salesforce with business metrics:', metrics);
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const response = await fetch(`${this.instanceUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`Salesforce API error: ${response.statusText}`);
    }

    return response.json();
  }

  private mapPriority(priority: AlertPriority): string {
    switch (priority) {
      case AlertPriority.CRITICAL: return 'High';
      case AlertPriority.HIGH: return 'Medium';
      case AlertPriority.MEDIUM: return 'Low';
      case AlertPriority.LOW: return 'Low';
      default: return 'Medium';
    }
  }
}
```

### **2. HubSpot Integration**
```typescript
// src/shared/services/integrations/hubspotIntegration.ts
export class HubSpotIntegration {
  private apiKey: string;

  constructor(config: IntegrationConfig) {
    this.apiKey = config.apiKeys?.find(k => k.key === 'api_key')?.key || '';
  }

  // Crear ticket en HubSpot
  async createTicket(alert: Alert): Promise<void> {
    const payload = {
      properties: {
        subject: alert.title,
        content: alert.message,
        hs_ticket_priority: this.mapPriority(alert.priority),
        hs_ticket_category: 'Technical Issue'
      }
    };

    await this.makeRequest('/crm/v3/objects/tickets', 'POST', payload);
  }

  // Actualizar métricas de negocio
  async updateBusinessMetrics(metrics: BusinessMetrics): Promise<void> {
    // Implementar actualización de métricas en HubSpot
    console.log('Updating HubSpot with business metrics:', metrics);
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const response = await fetch(`https://api.hubapi.com${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    return response.json();
  }

  private mapPriority(priority: AlertPriority): string {
    switch (priority) {
      case AlertPriority.CRITICAL: return 'HIGH';
      case AlertPriority.HIGH: return 'MEDIUM';
      case AlertPriority.MEDIUM: return 'LOW';
      case AlertPriority.LOW: return 'LOW';
      default: return 'MEDIUM';
    }
  }
}
```

---

## 🔧 Gestor de Integraciones

### **1. Servicio Principal de Integraciones**
```typescript
// src/shared/services/integrationManager.ts
export class IntegrationManager {
  private integrations: Map<string, any> = new Map();
  private config: IntegrationConfig[] = [];

  constructor() {
    this.loadIntegrations();
  }

  // Cargar configuraciones de integraciones
  private loadIntegrations() {
    this.config = [
      {
        id: 'datadog',
        name: 'Datadog',
        type: IntegrationType.MONITORING,
        enabled: true,
        config: {
          region: 'us-east-1'
        },
        apiKeys: [
          { key: 'api_key', secret: process.env.DATADOG_API_KEY },
          { key: 'app_key', secret: process.env.DATADOG_APP_KEY }
        ]
      },
      {
        id: 'newrelic',
        name: 'New Relic',
        type: IntegrationType.MONITORING,
        enabled: true,
        config: {
          accountId: process.env.NEWRELIC_ACCOUNT_ID
        },
        apiKeys: [
          { key: 'api_key', secret: process.env.NEWRELIC_API_KEY }
        ]
      },
      {
        id: 'aws-cloudwatch',
        name: 'AWS CloudWatch',
        type: IntegrationType.MONITORING,
        enabled: true,
        config: {
          region: 'us-east-1',
          namespace: 'VThink/Application'
        },
        apiKeys: [
          { key: 'access_key_id', secret: process.env.AWS_ACCESS_KEY_ID },
          { key: 'secret_access_key', secret: process.env.AWS_SECRET_ACCESS_KEY }
        ]
      }
    ];

    this.initializeIntegrations();
  }

  // Inicializar integraciones
  private initializeIntegrations() {
    this.config.forEach(config => {
      if (config.enabled) {
        const integration = this.createIntegration(config);
        if (integration) {
          this.integrations.set(config.id, integration);
        }
      }
    });
  }

  // Crear instancia de integración
  private createIntegration(config: IntegrationConfig): any {
    switch (config.id) {
      case 'datadog':
        return new DatadogIntegration(config);
      case 'newrelic':
        return new NewRelicIntegration(config);
      case 'aws-cloudwatch':
        return new AWSCloudWatchIntegration(config);
      case 'google-analytics':
        return new GoogleAnalyticsIntegration(config);
      case 'mixpanel':
        return new MixpanelIntegration(config);
      case 'salesforce':
        return new SalesforceIntegration(config);
      case 'hubspot':
        return new HubSpotIntegration(config);
      default:
        console.warn(`Unknown integration: ${config.id}`);
        return null;
    }
  }

  // Enviar métricas a todas las integraciones
  async sendMetricsToAll(metrics: SystemMetrics): Promise<void> {
    const promises = Array.from(this.integrations.values()).map(integration => {
      if (integration.sendMetrics) {
        return integration.sendMetrics(metrics).catch(error => {
          console.error(`Error sending metrics to integration:`, error);
        });
      }
    });

    await Promise.allSettled(promises);
  }

  // Enviar alerta a todas las integraciones
  async sendAlertToAll(alert: Alert): Promise<void> {
    const promises = Array.from(this.integrations.values()).map(integration => {
      if (integration.createAlert || integration.createIncident || integration.createCase) {
        const method = integration.createAlert || integration.createIncident || integration.createCase;
        return method.call(integration, alert).catch(error => {
          console.error(`Error sending alert to integration:`, error);
        });
      }
    });

    await Promise.allSettled(promises);
  }

  // Obtener estado de integraciones
  getIntegrationStatus(): Record<string, { enabled: boolean; lastSync?: Date }> {
    const status: Record<string, { enabled: boolean; lastSync?: Date }> = {};
    
    this.config.forEach(config => {
      status[config.id] = {
        enabled: config.enabled,
        lastSync: new Date() // Implementar tracking real
      };
    });

    return status;
  }
}
```

---

## 🧪 Scripts de Prueba

### **1. Script de Prueba de Integraciones**
```typescript
// scripts/test-integrations.js
import { IntegrationManager } from '@/shared/services/integrationManager';

const testIntegrations = async () => {
  console.log('🧪 Probando integraciones externas...');

  const integrationManager = new IntegrationManager();

  // Datos de prueba
  const testMetrics = {
    performance: {
      responseTime: 150,
      errorRate: 2.5,
      throughput: 1000
    },
    security: {
      failedLogins: 3,
      suspiciousActivity: 1
    },
    business: {
      activeUsers: 150,
      transactionFailureRate: 1.2,
      revenue: 50000
    },
    infrastructure: {
      diskUsage: 45,
      networkLatency: 25,
      databaseConnections: 25
    }
  };

  const testAlert = {
    id: 'test-alert-1',
    type: AlertType.SYSTEM_HEALTH,
    priority: AlertPriority.HIGH,
    title: 'Test Alert - Integration',
    message: 'Esta es una alerta de prueba para integraciones',
    channels: [AlertChannel.SLACK],
    metadata: {
      test: true,
      integration: 'external'
    }
  };

  // Probar envío de métricas
  console.log('📊 Enviando métricas a integraciones...');
  await integrationManager.sendMetricsToAll(testMetrics);

  // Probar envío de alertas
  console.log('🚨 Enviando alertas a integraciones...');
  await integrationManager.sendAlertToAll(testAlert);

  // Mostrar estado
  console.log('📋 Estado de integraciones:');
  console.log(integrationManager.getIntegrationStatus());

  console.log('✅ Pruebas de integración completadas');
};

testIntegrations();
```

---

## 📋 Checklist de Implementación

### **✅ Integraciones de Monitoreo**
- [ ] Implementar Datadog Integration
- [ ] Crear New Relic Integration
- [ ] Implementar AWS CloudWatch Integration
- [ ] Crear Google Cloud Monitoring Integration

### **✅ Integraciones de Analytics**
- [ ] Implementar Google Analytics Integration
- [ ] Crear Mixpanel Integration
- [ ] Configurar tracking de eventos
- [ ] Implementar métricas de negocio

### **✅ Integraciones de Negocio**
- [ ] Implementar Salesforce Integration
- [ ] Crear HubSpot Integration
- [ ] Configurar casos y tickets
- [ ] Implementar métricas de negocio

### **✅ Gestión Centralizada**
- [ ] Implementar IntegrationManager
- [ ] Crear sistema de configuración
- [ ] Implementar manejo de errores
- [ ] Crear monitoreo de estado

### **✅ Variables de Entorno**
```bash
# Datadog
DATADOG_API_KEY=your_datadog_api_key
DATADOG_APP_KEY=your_datadog_app_key

# New Relic
NEWRELIC_API_KEY=your_newrelic_api_key
NEWRELIC_ACCOUNT_ID=your_newrelic_account_id

# AWS
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Google Analytics
GA_MEASUREMENT_ID=your_ga_measurement_id
GA_API_SECRET=your_ga_api_secret

# Salesforce
SALESFORCE_ACCESS_TOKEN=your_salesforce_token
SALESFORCE_INSTANCE_URL=your_salesforce_instance

# HubSpot
HUBSPOT_API_KEY=your_hubspot_api_key
```

---

**Documentado por**: Marcelo Escallón  
**Fecha**: 05/07/2025  
**Versión**: VThink 1.0  
**Estado**: Listo para implementación 