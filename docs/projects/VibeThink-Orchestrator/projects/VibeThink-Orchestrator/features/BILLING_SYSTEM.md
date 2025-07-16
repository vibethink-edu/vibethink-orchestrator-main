# 💳 Sistema de Billing - AI Pair Orchestrator Pro

## 📋 **Resumen Ejecutivo**

El sistema de billing de AI Pair Orchestrator Pro está diseñado específicamente para el mercado colombiano, con planes adaptados, integración con Stripe, sistema de soporte con Zammad, y generación automática de facturas PDF.

---

## 🎯 **Características Principales**

### **1. Planes Optimizados para Colombia**
- **Precios en COP** con conversión automática
- **Planes Starter, Professional, Enterprise**
- **14 días de prueba gratuita** en todos los planes
- **Límites flexibles** por plan

### **2. Integración con Stripe**
- **Procesamiento seguro** de pagos
- **Suscripciones automáticas** con trial
- **Manejo de webhooks** para eventos
- **Soporte para múltiples monedas**

### **3. Sistema de Soporte con Zammad**
- **Widget flotante** en todas las páginas
- **Tickets automáticos** para facturación
- **Soporte técnico** integrado
- **Escalación automática** por prioridad

### **4. Generación de Facturas PDF**
- **Plantillas personalizadas** para Colombia
- **Información fiscal** completa
- **Descarga automática** y envío por email
- **Cumplimiento legal** colombiano

---

## 💰 **Planes y Precios**

### **Plan Starter - $99.000 COP/mes**
- **5 usuarios** incluidos
- **500 consultas AI** por mes
- **100 páginas de scraping** por mes
- **10GB de almacenamiento**
- **Soporte por email**
- **Integración Google Workspace**

### **Plan Professional - $299.000 COP/mes**
- **25 usuarios** incluidos
- **2.500 consultas AI** por mes
- **500 páginas de scraping** por mes
- **50GB de almacenamiento**
- **Soporte prioritario**
- **API access**
- **Workflows personalizados**

### **Plan Enterprise - $799.000 COP/mes**
- **Usuarios ilimitados**
- **10.000 consultas AI** por mes
- **2.000 páginas de scraping** por mes
- **200GB de almacenamiento**
- **Soporte dedicado 24/7**
- **Single Sign-On (SSO)**
- **White Label**
- **Integraciones personalizadas**

---

## 🔧 **Arquitectura Técnica**

### **1. Base de Datos**
```sql
-- Tablas principales del sistema de billing
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id),
  stripe_invoice_id VARCHAR(100),
  number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  status VARCHAR(20) NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  ai_requests INTEGER DEFAULT 0,
  scraping_pages INTEGER DEFAULT 0,
  storage_gb DECIMAL(5,2) DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **2. Componentes React**
```typescript
// Hook principal de billing
export const useBilling = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<UsageMetrics | null>(null);
  
  // Funciones principales
  const createSubscription = async (planId: string, paymentMethodId: string) => {
    // Lógica de creación de suscripción
  };
  
  const getTrialDaysRemaining = () => {
    // Cálculo de días restantes de trial
  };
  
  const checkUsageLimits = (operation: 'ai' | 'scraping' | 'storage' | 'users') => {
    // Verificación de límites de uso
  };
  
  return {
    subscription,
    invoices,
    usage,
    createSubscription,
    getTrialDaysRemaining,
    checkUsageLimits
  };
};
```

### **3. Integración con Stripe**
```typescript
// Configuración de Stripe
const stripeConfig = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  currency: 'cop',
  paymentMethods: ['card'],
  billingAddressCollection: 'required'
};

// Creación de suscripción
const createStripeSubscription = async (customerId: string, priceId: string) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    trial_period_days: 14,
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent']
  });
  
  return subscription;
};
```

---

## 🎨 **Componentes de UI**

### **1. ColombianPlansDisplay**
- **Selector de moneda** (COP, USD, EUR)
- **Toggle mensual/anual** con descuento
- **Comparación de planes** visual
- **Información de trial** destacada

### **2. ColombianCardRegistration**
- **Formulario de tarjeta** con validación
- **Información de facturación** completa
- **Estados de carga** y error
- **Notificaciones de seguridad**

### **3. InvoiceGenerator**
- **Plantilla PDF** personalizada
- **Información fiscal** colombiana
- **Descarga y envío** automático
- **Historial de facturas**

### **4. SupportWidget**
- **Widget flotante** en todas las páginas
- **Creación de tickets** automática
- **Integración con Zammad**
- **Soporte técnico** y de facturación

---

## 🔐 **Seguridad y Cumplimiento**

### **1. Protección de Datos**
- **Encriptación end-to-end** con Stripe
- **No almacenamiento** de datos de tarjeta
- **Cumplimiento PCI DSS** a través de Stripe
- **Auditoría de seguridad** regular

### **2. Cumplimiento Legal Colombiano**
- **Facturación electrónica** según DIAN
- **Información fiscal** completa
- **Retención de documentos** por 5 años
- **Cumplimiento de impuestos** locales

### **3. Políticas de Privacidad**
- **Consentimiento explícito** para procesamiento
- **Derecho de cancelación** en cualquier momento
- **Acceso a datos personales** según ley
- **Notificación de cambios** en políticas

---

## 📊 **Métricas y Analytics**

### **1. Métricas de Uso**
- **Consultas AI** por usuario y período
- **Páginas de scraping** utilizadas
- **Almacenamiento** consumido
- **Usuarios activos** por plan

### **2. Métricas de Facturación**
- **MRR (Monthly Recurring Revenue)**
- **Churn rate** por plan
- **Conversión** de trial a pago
- **LTV (Lifetime Value)** por cliente

### **3. Alertas y Notificaciones**
- **Límites de uso** cercanos al 80%
- **Trial por vencer** (3 días antes)
- **Pagos fallidos** automáticos
- **Suspensión** por límites excedidos

---

## 🚀 **Flujo de Onboarding**

### **1. Registro de Usuario**
1. **Selección de plan** con información clara
2. **Registro de tarjeta** con validación
3. **Creación de trial** automático
4. **Configuración inicial** de la empresa

### **2. Período de Trial**
1. **Acceso completo** a todas las features
2. **Notificaciones** de uso y límites
3. **Recordatorios** de vencimiento
4. **Opciones de upgrade** visibles

### **3. Conversión a Pago**
1. **Cobro automático** al finalizar trial
2. **Notificación de éxito** o fallo
3. **Opciones de plan** si falla el pago
4. **Soporte inmediato** si hay problemas

---

## 🔧 **Configuración y Despliegue**

### **1. Variables de Entorno**
```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Zammad Configuration
ZAMMAD_URL=https://support.VibeThink.com
ZAMMAD_API_TOKEN=your_api_token

# Database Configuration
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=your_anon_key
```

### **2. Configuración de Stripe**
```typescript
// Configuración de productos y precios
const stripeProducts = {
  starter: {
    name: 'AI Pair Orchestrator - Starter',
    priceId: 'price_starter_monthly',
    trialDays: 14
  },
  professional: {
    name: 'AI Pair Orchestrator - Professional',
    priceId: 'price_professional_monthly',
    trialDays: 14
  },
  enterprise: {
    name: 'AI Pair Orchestrator - Enterprise',
    priceId: 'price_enterprise_monthly',
    trialDays: 14
  }
};
```

### **3. Configuración de Zammad**
```typescript
// Configuración del sistema de soporte
const zammadConfig = {
  url: process.env.ZAMMAD_URL,
  apiToken: process.env.ZAMMAD_API_TOKEN,
  defaultGroup: 'Billing Support',
  priorityMapping: {
    low: 1,
    normal: 2,
    high: 3,
    urgent: 4
  }
};
```

---

## 📈 **Roadmap Futuro**

### **Fase 1 (Actual)**
- ✅ **Planes básicos** implementados
- ✅ **Integración Stripe** funcional
- ✅ **Sistema de soporte** con Zammad
- ✅ **Generación de facturas** PDF

### **Fase 2 (Próximo)**
- 🔄 **Planes anuales** con descuento
- 🔄 **Facturación electrónica** DIAN
- 🔄 **Métricas avanzadas** de uso
- 🔄 **Sistema de referidos**

### **Fase 3 (Futuro)**
- 📋 **White label** para partners
- 📋 **API de billing** pública
- 📋 **Integración con ERP** colombianos
- 📋 **Sistema de comisiones** para partners

---

## 🛠️ **Mantenimiento y Soporte**

### **1. Monitoreo**
- **Alertas automáticas** para fallos de pago
- **Monitoreo de webhooks** de Stripe
- **Verificación de límites** de uso
- **Backup automático** de datos críticos

### **2. Soporte Técnico**
- **Documentación completa** para desarrolladores
- **Guías de troubleshooting** comunes
- **Escalación automática** por prioridad
- **Soporte 24/7** para Enterprise

### **3. Actualizaciones**
- **Actualizaciones de seguridad** automáticas
- **Nuevas features** con retrocompatibilidad
- **Migración de datos** automática
- **Notificación de cambios** a usuarios

---

**Última actualización**: 2025-01-20  
**Versión**: 1.0 - Sistema completo implementado  
**Responsable**: Equipo de Desarrollo 