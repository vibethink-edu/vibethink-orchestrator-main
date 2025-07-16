# Software Externo (`external/`)

## 🎯 **Propósito**

Esta carpeta contiene **software externo** que no forma parte del código fuente principal pero que se integra con el sistema VibeThink Orchestrator.

## 📁 **Estructura**

```
external/
├── tracardi/           # Tracardi (orquestación)
├── posthog/            # PostHog (analíticas)
└── cms/                # CMS externos
```

## 🔄 **Tracardi (`tracardi/`)**

### **Propósito:**
Sistema de orquestación de flujos y automatización de procesos.

### **Funcionalidades:**
- **Workflow orchestration**: Orquestación de flujos
- **Event processing**: Procesamiento de eventos
- **Data pipelines**: Pipelines de datos
- **Integration hub**: Hub de integraciones

### **Configuración:**
```yaml
# docker-compose.tracardi.yml
version: '3.8'
services:
  tracardi:
    image: tracardi/tracardi-api:latest
    ports:
      - "8686:8686"
    environment:
      - ELASTIC_HOST=http://elasticsearch:9200
      - REDIS_HOST=redis
    volumes:
      - tracardi_data:/data
    depends_on:
      - elasticsearch
      - redis
```

### **Integración:**
```typescript
// ✅ Integración desde src/integrations/tracardi/
import { TracardiClient } from '@/integrations/tracardi/client';

const tracardiClient = new TracardiClient({
  url: process.env.TRACARDI_URL,
  apiKey: process.env.TRACARDI_API_KEY
});
```

## 📊 **PostHog (`posthog/`)**

### **Propósito:**
Sistema de analíticas y tracking de eventos.

### **Funcionalidades:**
- **Event tracking**: Tracking de eventos
- **User analytics**: Analíticas de usuarios
- **Funnel analysis**: Análisis de embudos
- **A/B testing**: Testing A/B
- **Feature flags**: Feature flags

### **Configuración:**
```yaml
# docker-compose.posthog.yml
version: '3.8'
services:
  posthog:
    image: posthog/posthog:latest
    ports:
      - "8000:8000"
    environment:
      - POSTHOG_DB_HOST=postgres
      - POSTHOG_REDIS_HOST=redis
    volumes:
      - posthog_data:/var/lib/posthog
    depends_on:
      - postgres
      - redis
```

### **Integración:**
```typescript
// ✅ Integración desde src/integrations/analytics/
import { PostHogClient } from '@/integrations/analytics/posthog';

const posthogClient = new PostHogClient({
  apiKey: process.env.POSTHOG_API_KEY,
  host: process.env.POSTHOG_HOST
});
```

## 📝 **CMS (`cms/`)**

### **Propósito:**
Sistemas de gestión de contenido externos.

### **Funcionalidades:**
- **Content management**: Gestión de contenido
- **Media management**: Gestión de medios
- **Template system**: Sistema de templates
- **API integration**: Integración con APIs

### **CMS Incluidos:**
- **Strapi**: CMS headless
- **WordPress**: CMS tradicional
- **Drupal**: CMS empresarial
- **Ghost**: CMS para blogs

### **Configuración:**
```yaml
# docker-compose.cms.yml
version: '3.8'
services:
  strapi:
    image: strapi/strapi:latest
    ports:
      - "1337:1337"
    environment:
      - DATABASE_CLIENT=postgres
      - DATABASE_HOST=postgres
    volumes:
      - strapi_data:/srv/app
    depends_on:
      - postgres
```

## 🔧 **Patrones de Integración**

### **API Gateway Pattern:**
```typescript
// ✅ Gateway para servicios externos
export class ExternalServiceGateway {
  private tracardi: TracardiClient;
  private posthog: PostHogClient;
  private cms: CMSClient;
  
  constructor() {
    this.tracardi = new TracardiClient(config.tracardi);
    this.posthog = new PostHogClient(config.posthog);
    this.cms = new CMSClient(config.cms);
  }
  
  async orchestrateWorkflow(workflowData: WorkflowData) {
    return this.tracardi.createWorkflow(workflowData);
  }
  
  async trackEvent(event: AnalyticsEvent) {
    return this.posthog.capture(event);
  }
  
  async getContent(contentId: string) {
    return this.cms.getContent(contentId);
  }
}
```

### **Health Check Pattern:**
```typescript
// ✅ Health checks para servicios externos
export const externalServiceHealth = {
  tracardi: async () => {
    try {
      await tracardiClient.health();
      return { status: 'healthy', service: 'tracardi' };
    } catch (error) {
      return { status: 'unhealthy', service: 'tracardi', error };
    }
  },
  
  posthog: async () => {
    try {
      await posthogClient.health();
      return { status: 'healthy', service: 'posthog' };
    } catch (error) {
      return { status: 'unhealthy', service: 'posthog', error };
    }
  }
};
```

## 🛡️ **Seguridad**

### **Access Control:**
```typescript
// ✅ Control de acceso a servicios externos
export const validateExternalServiceAccess = (
  user: User, 
  service: string
) => {
  const allowedServices = user.permissions.external_services || [];
  return allowedServices.includes(service);
};
```

### **Data Encryption:**
```typescript
// ✅ Encriptación de datos para servicios externos
export const encryptForExternalService = (
  data: any, 
  service: string
) => {
  const serviceKey = getServiceEncryptionKey(service);
  return encrypt(data, serviceKey);
};
```

## 📊 **Monitoreo**

### **Service Monitoring:**
```typescript
// ✅ Monitoreo de servicios externos
export const externalServiceMonitor = {
  checkAllServices: async () => {
    const services = ['tracardi', 'posthog', 'cms'];
    const results = await Promise.all(
      services.map(service => checkServiceHealth(service))
    );
    
    return results.reduce((acc, result) => {
      acc[result.service] = result.status;
      return acc;
    }, {});
  }
};
```

## 🧪 **Testing Strategy**

### **External Service Testing:**
```typescript
// ✅ Tests para servicios externos
describe('External Services', () => {
  it('should connect to Tracardi', async () => {
    const health = await externalServiceHealth.tracardi();
    expect(health.status).toBe('healthy');
  });
  
  it('should connect to PostHog', async () => {
    const health = await externalServiceHealth.posthog();
    expect(health.status).toBe('healthy');
  });
});
```

## 📊 **Métricas de Calidad**

### **Por Servicio Externo:**
- **Uptime**: >99.9% availability
- **Response Time**: <500ms average
- **Error Rate**: <1% error rate
- **Security**: 100% encrypted communication

---

**Los servicios externos siguen los principios de VThink 1.0, asegurando integración segura y monitoreada.** 