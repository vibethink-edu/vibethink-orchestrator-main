# Especificación del Rol Comercial AI Pair

## Resumen Ejecutivo

Este documento define la implementación del **Rol Comercial AI Pair (SALES_AP)** que será responsable de dimensionar requerimientos de clientes y realizar onboarding inteligente utilizando capacidades de IA avanzadas.

## 1. Definición del Rol

### 1.1 Características Principales

```typescript
SALES_AP: {
  role: 'SALES_AP',
  name: 'Comercial AI Pair',
  description: 'Comercial especializado en dimensionar requerimientos y hacer onboarding inteligente de clientes',
  permissions: [
    'access_all_companies_for_sales',
    'create_requirement_analysis',
    'generate_proposal_recommendations',
    'access_plan_configuration_tools',
    'view_company_analytics_for_sales',
    'create_onboarding_workflows',
    'access_ai_dimensioning_tools',
    'manage_sales_pipeline',
    'generate_technical_specifications',
    'access_integration_catalog',
    'create_custom_plan_recommendations',
    'view_competitor_analysis',
    'access_industry_templates',
    'manage_client_expectations',
    'create_implementation_roadmaps'
  ],
  restrictions: [
    'No puede modificar configuraciones de producción',
    'No puede acceder a datos sensibles de clientes',
    'Solo puede crear propuestas y análisis',
    'No puede ejecutar implementaciones técnicas'
  ],
  canAccessCompanies: true,
  canModifyPlatform: false,
  hierarchyLevel: 2,
  isVibeThinkRole: true,
  isCustomerRole: false
}
```

### 1.2 Jerarquía de Roles

El rol SALES_AP se posiciona entre SUPPORT_AP y DEVELOPER_AP en la jerarquía de AI Pair:

```
SUPER_ADMIN_AP (Nivel 1)
├── SUPPORT_AP (Nivel 2)
├── SALES_AP (Nivel 2) ← NUEVO ROL
├── DEVELOPER_AP (Nivel 3)
├── MANAGER_AP (Nivel 3)
└── EMPLOYEE_AP (Nivel 4)
```

## 2. Capacidades del Comercial AI

### 2.1 Dimensionamiento Inteligente de Requerimientos

#### 2.1.1 AI Requirement Analyzer

**Funcionalidades:**
- Análisis de conversaciones con clientes
- Procesamiento de documentos de requerimientos
- Identificación automática de necesidades técnicas
- Estimación de complejidad y esfuerzo
- Mapeo a templates de industria

**Proceso de Análisis:**
```typescript
interface RequirementAnalysis {
  clientId: string;
  industry: IndustryType;
  businessModel: BusinessModelType;
  technicalComplexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'ENTERPRISE';
  estimatedUsers: number;
  estimatedProducts: number;
  requiredIntegrations: IntegrationRequirement[];
  complianceRequirements: ComplianceType[];
  scalabilityNeeds: ScalabilityProfile;
  recommendedPlan: SubscriptionPlan;
  implementationTimeline: ImplementationTimeline;
  costEstimation: CostBreakdown;
}
```

#### 2.1.2 Industry Template Matcher

**Templates Disponibles:**
- **Ecommerce Básico**: Tienda simple, una moneda, una sede
- **Ecommerce Avanzado**: Múltiples sedes, monedas, pasarelas
- **Marketplace**: Múltiples vendedores, comisiones
- **Industrial**: Catálogos técnicos, especificaciones complejas
- **Educación**: Gestión de rutas escolares
- **Salud**: Logística médica, cumplimiento HIPAA

### 2.2 Herramientas de Onboarding

#### 2.2.1 Plan Configuration Tools

**Capacidades:**
- Configuración dinámica de planes
- Ajuste de límites por módulo
- Personalización de funcionalidades
- Estimación de costos en tiempo real

#### 2.2.2 Implementation Roadmap Generator

**Características:**
- Generación automática de roadmaps
- Definición de fases de implementación
- Estimación de tiempos y recursos
- Identificación de dependencias críticas

## 3. Casos de Uso Soportados

### 3.1 Ecommerce Básico

**Escenario:** "Tengo una tienda virtual simple"

**Análisis Automático:**
- Complejidad: BAJA
- Usuarios estimados: 50-200
- Productos: < 1,000
- Recomendación: Plan BASIC + PIM integrado

### 3.2 Ecommerce Avanzado

**Escenario:** "Tienda con múltiples sedes, monedas y pasarelas"

**Análisis Automático:**
- Complejidad: ALTA
- Usuarios estimados: 500-2,000
- Productos: 1,000-10,000
- Recomendación: Plan ENTERPRISE + PIM modular

### 3.3 Marketplace

**Escenario:** "Plataforma para múltiples vendedores"

**Análisis Automático:**
- Complejidad: ENTERPRISE
- Usuarios estimados: 1,000+
- Productos: 10,000+
- Recomendación: Plan ENTERPRISE + PIM externo

### 3.4 Industrial (UNITY INK)

**Escenario:** "Venta de pinturas industriales con asesoría técnica"

**Análisis Automático:**
- Complejidad: ALTA
- Usuarios estimados: 200-500
- Productos: 5,000+
- Recomendación: Plan ENTERPRISE + PIM especializado

## 4. Implementación Técnica

### 4.1 Nuevos Componentes Requeridos

#### 4.1.1 AI Dimensioning Engine

```typescript
interface AIDimensioningEngine {
  analyzeRequirements(input: ClientInput): RequirementAnalysis;
  generateProposal(analysis: RequirementAnalysis): SalesProposal;
  createRoadmap(proposal: SalesProposal): ImplementationRoadmap;
  estimateCosts(roadmap: ImplementationRoadmap): CostEstimation;
}
```

#### 4.1.2 Sales Pipeline Manager

```typescript
interface SalesPipelineManager {
  createLead(clientInfo: ClientInfo): SalesLead;
  updateLeadStatus(leadId: string, status: LeadStatus): void;
  generateProposal(leadId: string): SalesProposal;
  trackConversions(proposalId: string): ConversionMetrics;
}
```

### 4.2 Integración con Sistema Existente

#### 4.2.1 Modificaciones a Roles Existentes

**Actualizar `src/types/roles.ts`:**
```typescript
// Agregar SALES_AP a UserRole
export type UserRole = 
  | 'SUPER_ADMIN_AP'
  | 'SUPPORT_AP'
  | 'SALES_AP'  // ← NUEVO
  | 'DEVELOPER_AP'
  | 'MANAGER_AP'
  | 'EMPLOYEE_AP'
  // ... resto de roles
```

#### 4.2.2 Nuevas Tablas de Base de Datos

```sql
-- Tabla para análisis de requerimientos
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

-- Tabla para propuestas comerciales
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
```

## 5. Flujo de Trabajo del Comercial

### 5.1 Proceso de Dimensionamiento

1. **Recepción de Lead**
   - Cliente contacta con requerimientos
   - Comercial crea lead en sistema

2. **Análisis Inicial**
   - Comercial ejecuta AI Requirement Analyzer
   - Sistema genera análisis preliminar

3. **Refinamiento**
   - Comercial ajusta análisis basado en conversación
   - Sistema recalcula recomendaciones

4. **Generación de Propuesta**
   - Sistema genera propuesta automática
   - Comercial personaliza según necesidades

5. **Presentación**
   - Comercial presenta propuesta al cliente
   - Sistema trackea engagement

### 5.2 Herramientas de Soporte

#### 5.2.1 Dashboard Comercial

**Métricas Clave:**
- Leads activos
- Conversión de propuestas
- Tiempo promedio de cierre
- Valor promedio de propuestas
- Performance por industria

#### 5.2.2 Biblioteca de Templates

**Contenido:**
- Templates de propuestas por industria
- Casos de estudio exitosos
- Comparativas de competidores
- Documentación técnica

## 6. Beneficios Esperados

### 6.1 Para AI Pair
- **Mejor conversión** de leads a clientes
- **Reducción de tiempo** de dimensionamiento
- **Consistencia** en propuestas
- **Escalabilidad** del equipo comercial

### 6.2 Para Clientes
- **Respuestas más rápidas** a requerimientos
- **Propuestas más precisas** y personalizadas
- **Mejor entendimiento** de capacidades
- **Onboarding más eficiente**

## 7. Próximos Pasos

### 7.1 Implementación Inmediata (2-3 semanas)
- [ ] Crear rol SALES_AP en sistema
- [ ] Implementar AI Requirement Analyzer básico
- [ ] Desarrollar dashboard comercial
- [ ] Crear templates de industria

### 7.2 Mejoras Futuras
- [ ] Integración con CRM externo
- [ ] Analytics avanzados de conversión
- [ ] Automatización de follow-ups
- [ ] Integración con sistemas de facturación

---

## Conclusión

El rol comercial AI Pair representa una evolución significativa en la capacidad de la plataforma para servir a clientes de manera más inteligente y eficiente. La combinación de IA con experiencia comercial permitirá un dimensionamiento más preciso y un onboarding más exitoso. 