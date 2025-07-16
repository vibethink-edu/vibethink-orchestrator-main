# Roadmap de Implementación - Rol Comercial y Ecommerce

## Resumen Ejecutivo

Este documento define el roadmap detallado para implementar el rol comercial AI Pair y las capacidades de ecommerce/logística, incluyendo cronogramas, recursos requeridos y hitos clave.

## 1. Fase 1: Rol Comercial (2-3 semanas)

### 1.1 Semana 1: Definición del Rol

#### 1.1.1 Actualización de Tipos y Roles
**Archivos a modificar:**
- `src/types/roles.ts`
- `src/types/hierarchicalRoles.ts`
- `src/utils/constants.ts`

**Tareas:**
- [ ] Agregar `SALES_AP` al tipo `UserRole`
- [ ] Definir permisos específicos del rol comercial
- [ ] Actualizar jerarquía de roles
- [ ] Crear interfaces de permisos comerciales

#### 1.1.2 Base de Datos
**Nuevas tablas:**
```sql
-- Análisis de requerimientos
CREATE TABLE requirement_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES companies(id),
  sales_rep_id UUID REFERENCES users(id),
  industry VARCHAR(50),
  business_model VARCHAR(50),
  technical_complexity VARCHAR(20),
  estimated_users INTEGER,
  estimated_products INTEGER,
  analysis_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Propuestas comerciales
CREATE TABLE sales_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_analysis_id UUID REFERENCES requirement_analyses(id),
  recommended_plan VARCHAR(50),
  estimated_cost DECIMAL(10,2),
  implementation_timeline JSONB,
  proposal_data JSONB,
  status VARCHAR(20) DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pipeline de ventas
CREATE TABLE sales_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(200),
  contact_email VARCHAR(200),
  contact_phone VARCHAR(50),
  industry VARCHAR(50),
  initial_requirements TEXT,
  assigned_sales_rep UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'NEW',
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 1.2 Semana 2: Herramientas de Análisis

#### 1.2.1 AI Requirement Analyzer
**Componentes a desarrollar:**
- `src/services/ai/requirementAnalyzer.ts`
- `src/hooks/useRequirementAnalysis.ts`
- `src/components/sales/RequirementAnalyzer.tsx`

**Funcionalidades:**
- Análisis de texto de requerimientos
- Identificación de patrones de industria
- Estimación de complejidad técnica
- Generación de recomendaciones

#### 1.2.2 Dashboard Comercial
**Componentes:**
- `src/components/sales/SalesDashboard.tsx`
- `src/components/sales/LeadManagement.tsx`
- `src/components/sales/ProposalGenerator.tsx`

**Métricas a mostrar:**
- Leads activos por estado
- Conversión de propuestas
- Tiempo promedio de cierre
- Performance por industria

### 1.3 Semana 3: Templates y Configuración

#### 1.3.1 Industry Templates
**Templates a crear:**
- Ecommerce básico
- Ecommerce avanzado
- Marketplace
- Industrial (UNITY INK)
- Educación
- Salud

#### 1.3.2 Plan Configuration Tools
**Herramientas:**
- Configurador dinámico de planes
- Calculadora de costos
- Generador de roadmaps
- Comparador de funcionalidades

## 2. Fase 2: Ecommerce Básico (4-6 semanas)

### 2.1 Semanas 1-2: PIM Integrado

#### 2.1.1 Estructura de Productos
**Nuevas tablas:**
```sql
-- Catálogo de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  name VARCHAR(200),
  description TEXT,
  sku VARCHAR(100),
  category_id UUID REFERENCES product_categories(id),
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  inventory_quantity INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categorías de productos
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  name VARCHAR(100),
  description TEXT,
  parent_category_id UUID REFERENCES product_categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Atributos de productos
CREATE TABLE product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  attribute_name VARCHAR(100),
  attribute_value TEXT,
  attribute_type VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2.1.2 API de Productos
**Endpoints a crear:**
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/:id` - Obtener producto

### 2.2 Semanas 3-4: Sistema de Órdenes

#### 2.2.1 Gestión de Órdenes
**Nuevas tablas:**
```sql
-- Órdenes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  customer_id UUID REFERENCES users(id),
  order_number VARCHAR(50),
  status VARCHAR(20) DEFAULT 'PENDING',
  total_amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  shipping_address JSONB,
  billing_address JSONB,
  payment_status VARCHAR(20) DEFAULT 'PENDING',
  shipping_status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Items de orden
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2.2.2 API de Órdenes
**Endpoints:**
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `PUT /api/orders/:id` - Actualizar orden
- `GET /api/orders/:id` - Obtener orden

### 2.3 Semanas 5-6: Pasarelas de Pago

#### 2.3.1 Integración de Pagos
**Proveedores a integrar:**
- Stripe (principal)
- PayPal (secundario)
- Mercado Pago (Latinoamérica)

**Componentes:**
- `src/services/payment/stripeService.ts`
- `src/services/payment/paypalService.ts`
- `src/components/payment/PaymentForm.tsx`

## 3. Fase 3: Logística Básica (6-8 semanas)

### 3.1 Semanas 1-2: Departamento de Logística

#### 3.1.1 Estructura del Departamento
**Nuevas tablas:**
```sql
-- Departamentos
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  code VARCHAR(50),
  name VARCHAR(100),
  description TEXT,
  parent_department_id UUID REFERENCES departments(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Permisos departamentales
CREATE TABLE department_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id),
  user_id UUID REFERENCES users(id),
  permission_type VARCHAR(50),
  granted_at TIMESTAMP DEFAULT NOW()
);
```

#### 3.1.2 Configuración de Logística
**Sub-departamentos a crear:**
- SHIPPING_OPERATIONS
- TRACKING_MONITORING
- ROUTE_OPTIMIZATION
- CARRIER_MANAGEMENT

### 3.2 Semanas 3-4: Sistema de Tracking Básico

#### 3.2.1 Estructura de Tracking
**Nuevas tablas:**
```sql
-- Órdenes de envío
CREATE TABLE shipping_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  carrier_id UUID REFERENCES carriers(id),
  tracking_number VARCHAR(100),
  status VARCHAR(50),
  origin_address JSONB,
  destination_address JSONB,
  package_details JSONB,
  shipping_cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Eventos de tracking
CREATE TABLE tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipping_order_id UUID REFERENCES shipping_orders(id),
  event_type VARCHAR(50),
  event_description TEXT,
  location JSONB,
  timestamp TIMESTAMP,
  carrier_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3.2.2 API de Tracking
**Endpoints:**
- `GET /api/shipping/orders` - Listar envíos
- `POST /api/shipping/orders` - Crear envío
- `GET /api/shipping/tracking/:id` - Obtener tracking
- `POST /api/shipping/webhook` - Webhook de carriers

### 3.3 Semanas 5-6: Integración con Carriers

#### 3.3.1 Proveedores de Envío
**Carriers a integrar:**
- DHL Express
- FedEx
- UPS
- Servientrega (Colombia)
- Interrapidisimo (Colombia)

**Componentes:**
- `src/services/shipping/dhlService.ts`
- `src/services/shipping/fedexService.ts`
- `src/services/shipping/carrierManager.ts`

### 3.4 Semanas 7-8: Notificaciones

#### 3.4.1 Sistema de Notificaciones
**Canales:**
- Email
- SMS
- Push notifications
- WhatsApp (futuro)

**Componentes:**
- `src/services/notifications/emailService.ts`
- `src/services/notifications/smsService.ts`
- `src/services/notifications/notificationManager.ts`

## 4. Fase 4: Funcionalidades Avanzadas (8-12 semanas)

### 4.1 Semanas 1-3: PIM Modular/Externo

#### 4.1.1 Integración con Strapi
**Configuración:**
- Instalación de Strapi
- Configuración de modelos de datos
- Desarrollo de plugins personalizados
- Integración con API

#### 4.1.2 Sincronización de Datos
**Componentes:**
- `src/services/pim/strapiService.ts`
- `src/services/pim/dataSyncService.ts`
- `src/hooks/usePIMSync.ts`

### 4.2 Semanas 4-6: Optimización de Rutas

#### 4.2.1 Integración con APIs de Mapas
**Proveedores:**
- Google Maps API
- Mapbox
- OpenStreetMap

**Componentes:**
- `src/services/maps/googleMapsService.ts`
- `src/services/maps/routeOptimizer.ts`
- `src/components/maps/RouteMap.tsx`

### 4.3 Semanas 7-9: Analytics Avanzados

#### 4.3.1 Analytics de Logística
**Métricas:**
- Tiempo promedio de entrega
- Costos de envío por carrier
- Performance de rutas
- Satisfacción del cliente

**Componentes:**
- `src/services/analytics/logisticsAnalytics.ts`
- `src/components/analytics/LogisticsDashboard.tsx`

### 4.4 Semanas 10-12: Agentes IA

#### 4.4.1 Agente de Tracking
**Funcionalidades:**
- Notificaciones inteligentes
- Predicción de entregas
- Detección de anomalías
- Resolución automática de problemas

**Componentes:**
- `src/services/ai/trackingAgent.ts`
- `src/services/ai/customerServiceAgent.ts`

## 5. Fase 5: Optimización y Escalabilidad (4-6 semanas)

### 5.1 Semanas 1-2: Optimización de Performance

#### 5.1.1 Optimizaciones de Base de Datos
- Índices optimizados
- Consultas optimizadas
- Particionamiento de tablas grandes
- Caché de consultas frecuentes

#### 5.1.2 Optimizaciones de Frontend
- Lazy loading de componentes
- Code splitting
- Optimización de imágenes
- Caché de datos

### 5.2 Semanas 3-4: Escalabilidad

#### 5.2.1 Microservicios
- Separación de servicios
- Load balancing
- Auto-scaling
- Service discovery

#### 5.2.2 Monitoreo y Observabilidad
- Logging centralizado
- Métricas de performance
- Alertas automáticas
- Dashboards de monitoreo

### 5.3 Semanas 5-6: Testing y QA

#### 5.3.1 Testing Exhaustivo
- Unit tests
- Integration tests
- E2E tests
- Performance tests
- Security tests

## 6. Recursos Requeridos

### 6.1 Equipo de Desarrollo

#### 6.1.1 Fase 1-2 (Rol Comercial + Ecommerce Básico)
- **1 Frontend Developer** (React/TypeScript)
- **1 Backend Developer** (Node.js/PostgreSQL)
- **1 Full-stack Developer** (React + Node.js)
- **1 DevOps Engineer** (part-time)

#### 6.1.2 Fase 3-4 (Logística + Funcionalidades Avanzadas)
- **2 Frontend Developers** (React/TypeScript)
- **2 Backend Developers** (Node.js/PostgreSQL)
- **1 DevOps Engineer** (full-time)
- **1 QA Engineer** (part-time)

#### 6.1.3 Fase 5 (Optimización)
- **1 Performance Engineer**
- **1 Security Engineer**
- **1 QA Engineer** (full-time)

### 6.2 Infraestructura

#### 6.2.1 Servidores
- **Desarrollo**: 2 instancias (frontend + backend)
- **Staging**: 2 instancias (frontend + backend)
- **Producción**: 4 instancias (2 frontend + 2 backend)

#### 6.2.2 Base de Datos
- **Desarrollo**: PostgreSQL local
- **Staging**: PostgreSQL en la nube
- **Producción**: PostgreSQL cluster con replicación

#### 6.2.3 Servicios Externos
- **APIs de Mapas**: Google Maps, Mapbox
- **APIs de Carriers**: DHL, FedEx, UPS
- **APIs de Pago**: Stripe, PayPal
- **PIM**: Strapi (self-hosted)

### 6.3 Costos Estimados

#### 6.3.1 Desarrollo
- **Fase 1-2**: $50,000 - $80,000
- **Fase 3-4**: $100,000 - $150,000
- **Fase 5**: $30,000 - $50,000
- **Total**: $180,000 - $280,000

#### 6.3.2 Infraestructura (anual)
- **Servidores**: $10,000 - $20,000
- **Base de datos**: $5,000 - $10,000
- **APIs externas**: $5,000 - $15,000
- **Total**: $20,000 - $45,000

#### 6.3.3 Licencias (anual)
- **Strapi**: $0 (self-hosted)
- **Google Maps**: $2,000 - $5,000
- **Stripe**: 2.9% + $0.30 por transacción
- **Total**: $2,000 - $5,000

## 7. Hitos y Entregables

### 7.1 Hitos Principales

#### 7.1.1 Fin de Fase 1 (Semana 3)
- [ ] Rol comercial implementado
- [ ] Dashboard comercial funcional
- [ ] AI Requirement Analyzer básico
- [ ] Templates de industria creados

#### 7.1.2 Fin de Fase 2 (Semana 9)
- [ ] PIM integrado funcional
- [ ] Sistema de órdenes operativo
- [ ] Pasarelas de pago integradas
- [ ] Ecommerce básico funcionando

#### 7.1.3 Fin de Fase 3 (Semana 17)
- [ ] Departamento de logística creado
- [ ] Sistema de tracking básico
- [ ] Integración con carriers
- [ ] Notificaciones automáticas

#### 7.1.4 Fin de Fase 4 (Semana 29)
- [ ] PIM modular/externo
- [ ] Optimización de rutas
- [ ] Analytics avanzados
- [ ] Agentes IA funcionales

#### 7.1.5 Fin de Fase 5 (Semana 35)
- [ ] Optimizaciones de performance
- [ ] Escalabilidad implementada
- [ ] Testing completo
- [ ] Sistema listo para producción

### 7.2 Entregables por Fase

#### 7.2.1 Fase 1
- Documentación del rol comercial
- Código fuente del dashboard
- Base de datos actualizada
- Tests unitarios

#### 7.2.2 Fase 2
- Sistema de ecommerce funcional
- API de productos y órdenes
- Integración de pagos
- Documentación técnica

#### 7.2.3 Fase 3
- Sistema de logística básico
- Integración con carriers
- Sistema de notificaciones
- Dashboard de logística

#### 7.2.4 Fase 4
- PIM modular/externo
- Optimización de rutas
- Analytics avanzados
- Agentes IA

#### 7.2.5 Fase 5
- Sistema optimizado
- Documentación completa
- Guías de usuario
- Plan de mantenimiento

## 8. Riesgos y Mitigaciones

### 8.1 Riesgos Técnicos

#### 8.1.1 Complejidad de Integraciones
**Riesgo:** Las integraciones con APIs externas pueden ser complejas
**Mitigación:** Desarrollo incremental, testing exhaustivo, documentación detallada

#### 8.1.2 Performance de Base de Datos
**Riesgo:** El rendimiento puede degradarse con el crecimiento
**Mitigación:** Optimización temprana, índices apropiados, monitoreo continuo

### 8.2 Riesgos de Negocio

#### 8.2.1 Cambios en Requerimientos
**Riesgo:** Los requerimientos pueden cambiar durante el desarrollo
**Mitigación:** Desarrollo ágil, comunicación constante, prototipos tempranos

#### 8.2.2 Costos de APIs Externas
**Riesgo:** Los costos de APIs pueden escalar rápidamente
**Mitigación:** Monitoreo de uso, optimización de consultas, negociación de tarifas

### 8.3 Riesgos de Seguridad

#### 8.3.1 Protección de Datos
**Riesgo:** Vulnerabilidades en el manejo de datos sensibles
**Mitigación:** Encriptación, auditorías de seguridad, cumplimiento GDPR

#### 8.3.2 Integración de Pagos
**Riesgo:** Vulnerabilidades en el procesamiento de pagos
**Mitigación:** Uso de proveedores certificados, testing de seguridad, auditorías

## 9. Conclusión

Este roadmap proporciona una guía detallada para implementar el rol comercial y las capacidades de ecommerce/logística de manera incremental y controlada. La implementación en fases permite:

1. **Validación temprana** de funcionalidades
2. **Ajustes basados en feedback** del usuario
3. **Gestión de riesgos** efectiva
4. **Optimización continua** del proceso

El cronograma total de 35 semanas permite una implementación completa y robusta, con tiempo suficiente para testing y optimización. 