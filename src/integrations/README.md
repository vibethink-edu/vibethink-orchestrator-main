# Integraciones Externas (`integrations/`)

## 🎯 **Propósito**

Esta carpeta contiene todas las **integraciones con sistemas externos** y APIs de terceros que utiliza el proyecto VibeThink Orchestrator.

## 📁 **Estructura**

```
integrations/
├── supabase/           # Integración de base de datos
├── medusa/             # Integración de e-commerce
├── strapi/             # Integración de CMS
├── openai/             # Integración OpenAI
├── firecrawl/          # Integración Firecrawl
├── knotie/             # Integración Knotie
├── tracardi/           # Integración Tracardi (orquestación)
├── kestra/             # Integración Kestra (workflows)
└── component-registry.json
```

## 🗄️ **Base de Datos (`supabase/`)**

### **Propósito:**
Base de datos principal del sistema con autenticación y autorización.

### **Funcionalidades:**
- **Autenticación**: Auth con RLS policies
- **Base de datos**: PostgreSQL con real-time
- **Storage**: Almacenamiento de archivos
- **Edge Functions**: Serverless functions

### **Estructura:**
```
supabase/
├── client.ts           # Cliente Supabase
├── auth.ts             # Servicios de autenticación
├── database.ts         # Servicios de base de datos
├── storage.ts          # Servicios de storage
├── realtime.ts         # Suscripciones real-time
├── types.ts            # Tipos de Supabase
└── config.ts           # Configuración
```

### **Patrón de Uso:**
```typescript
// ✅ Uso correcto con multi-tenant
import { supabase } from '@/integrations/supabase/client';

const fetchUsers = async (companyId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('company_id', companyId);
    
  if (error) throw new Error('Access denied');
  return data;
};
```

## 🛒 **E-commerce (`medusa/`)**

### **Propósito:**
Sistema de e-commerce para ventas y gestión de productos.

### **Funcionalidades:**
- **Gestión de productos**: CRUD de productos
- **Carrito de compras**: Gestión de carritos
- **Órdenes**: Procesamiento de órdenes
- **Pagos**: Integración con gateways

### **Estructura:**
```
medusa/
├── client.ts           # Cliente Medusa
├── products.ts         # Servicios de productos
├── orders.ts           # Servicios de órdenes
├── cart.ts             # Servicios de carrito
├── payments.ts         # Servicios de pagos
├── types.ts            # Tipos de Medusa
└── config.ts           # Configuración
```

## 📝 **CMS (`strapi/`)**

### **Propósito:**
Sistema de gestión de contenido para páginas dinámicas.

### **Funcionalidades:**
- **Gestión de contenido**: CRUD de contenido
- **Tipos de contenido**: Definición de schemas
- **Media management**: Gestión de archivos
- **API REST**: Endpoints automáticos

### **Estructura:**
```
strapi/
├── client.ts           # Cliente Strapi
├── content.ts          # Servicios de contenido
├── media.ts            # Servicios de media
├── api.ts              # Servicios de API
├── types.ts            # Tipos de Strapi
└── config.ts           # Configuración
```

## 🤖 **IA - OpenAI (`openai/`)**

### **Propósito:**
Integración directa con OpenAI para funcionalidades de IA.

### **Funcionalidades:**
- **Chat completions**: Conversaciones con GPT
- **Text generation**: Generación de texto
- **Code generation**: Generación de código
- **Embeddings**: Vectores para búsqueda

### **Estructura:**
```
openai/
├── client.ts           # Cliente OpenAI
├── chat.ts             # Servicios de chat
├── completions.ts      # Servicios de completions
├── embeddings.ts       # Servicios de embeddings
├── types.ts            # Tipos de OpenAI
└── config.ts           # Configuración
```

### **Patrón de Uso:**
```typescript
// ✅ Uso con rate limiting y error handling
import { openaiClient } from '@/integrations/openai/client';

const generateResponse = async (prompt: string) => {
  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error('Failed to generate response');
  }
};
```

## 🌐 **Web Scraping (`firecrawl/`)**

### **Propósito:**
Web scraping inteligente para recolección de datos.

### **Funcionalidades:**
- **Web scraping**: Extracción de datos
- **Data processing**: Procesamiento de datos
- **Scheduling**: Programación de tareas
- **Data storage**: Almacenamiento de datos

### **Estructura:**
```
firecrawl/
├── client.ts           # Cliente Firecrawl
├── scraping.ts         # Servicios de scraping
├── processing.ts       # Servicios de procesamiento
├── scheduling.ts       # Servicios de scheduling
├── types.ts            # Tipos de Firecrawl
└── config.ts           # Configuración
```

## 📊 **Análisis (`knotie/`)**

### **Propósito:**
Análisis avanzado y procesamiento de datos.

### **Funcionalidades:**
- **Data analysis**: Análisis de datos
- **Reporting**: Generación de reportes
- **Insights**: Extracción de insights
- **Predictions**: Predicciones basadas en datos

### **Estructura:**
```
knotie/
├── client.ts           # Cliente Knotie
├── analysis.ts         # Servicios de análisis
├── reporting.ts        # Servicios de reportes
├── insights.ts         # Servicios de insights
├── types.ts            # Tipos de Knotie
└── config.ts           # Configuración
```

## 🔄 **Orquestación (`tracardi/`)**

### **Propósito:**
Orquestación de flujos y automatización de procesos.

### **Funcionalidades:**
- **Workflow orchestration**: Orquestación de flujos
- **Event processing**: Procesamiento de eventos
- **Data pipelines**: Pipelines de datos
- **Integration hub**: Hub de integraciones

### **Estructura:**
```
tracardi/
├── client.ts           # Cliente Tracardi
├── workflows.ts        # Servicios de workflows
├── events.ts           # Servicios de eventos
├── pipelines.ts        # Servicios de pipelines
├── types.ts            # Tipos de Tracardi
└── config.ts           # Configuración
```

## ⚡ **Workflows (`kestra/`)**

### **Propósito:**
Motor de workflows para automatización de procesos empresariales.

### **Funcionalidades:**
- **Workflow engine**: Motor de workflows
- **Task scheduling**: Programación de tareas
- **Execution monitoring**: Monitoreo de ejecución
- **Error handling**: Manejo de errores

### **Estructura:**
```
kestra/
├── client.ts           # Cliente Kestra
├── workflows.ts        # Servicios de workflows
├── executions.ts       # Servicios de ejecuciones
├── monitoring.ts       # Servicios de monitoreo
├── types.ts            # Tipos de Kestra
└── config.ts           # Configuración
```

### **Patrón de Uso:**
```typescript
// ✅ Uso con React Flow integration
import { kestraClient } from '@/integrations/kestra/client';

const createWorkflow = async (workflowData: WorkflowData) => {
  try {
    const workflow = await kestraClient.workflows.create({
      ...workflowData,
      company_id: user.company_id
    });
    return workflow;
  } catch (error) {
    console.error('Kestra error:', error);
    throw new Error('Failed to create workflow');
  }
};
```

## 🔧 **Registry (`component-registry.json`)**

### **Propósito:**
Registro centralizado de componentes y integraciones.

### **Funcionalidades:**
- **Component discovery**: Descubrimiento de componentes
- **Version tracking**: Seguimiento de versiones
- **Dependency management**: Gestión de dependencias
- **Integration status**: Estado de integraciones

## 🛡️ **Seguridad Multi-tenant**

### **Patrones de Seguridad:**
```typescript
// ✅ Siempre incluir company_id
const fetchData = async (companyId: string) => {
  const { data, error } = await integrationClient
    .from('table')
    .select('*')
    .eq('company_id', companyId);
    
  if (error) throw new Error('Access denied');
  return data;
};

// ✅ Validar permisos antes de acceder
const hasAccess = (user: User, resource: string) => {
  return user.permissions.includes(resource);
};
```

## 🧪 **Testing Strategy**

### **Por Integración:**
- **Unit tests**: Para cada servicio
- **Integration tests**: Para flujos completos
- **Mock tests**: Para APIs externas
- **Error handling tests**: Para manejo de errores

### **Patrones de Testing:**
```typescript
// ✅ Mock de integraciones externas
jest.mock('@/integrations/openai/client', () => ({
  openaiClient: {
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }
}));
```

## 📊 **Métricas de Calidad**

### **Por Integración:**
- **Uptime**: >99.9% availability
- **Response time**: <500ms average
- **Error rate**: <1% error rate
- **Security**: 100% multi-tenant isolation

---

**Las integraciones siguen los principios de VThink 1.0, asegurando seguridad, performance y escalabilidad.** 