# Arquitectura: DNS Multi-Tenant para URLs Personalizadas

**Versión:** 1.0.0  
**Fecha:** 2025-01-22  
**Autor:** AI Pair Platform (asistente de Marcelo Escallón)  
**Estado:** Planificado  
**Impacto:** Crítico - Escalabilidad y experiencia de cliente  

---

## Resumen Ejecutivo

Implementación de sistema de DNS multi-tenant que permite a los clientes usar URLs personalizadas (subdominios y dominios propios) con configuración automática de SSL y gestión centralizada de costos.

---

## Arquitectura de DNS Multi-Tenant

### **1. Opciones de Implementación**

```typescript
// Configuración de dominios por cliente
interface ClientDomainConfig {
  company_id: string;
  primary_domain: string;        // dominio principal del cliente
  custom_domains: string[];      // dominios personalizados
  subdomain: string;             // subdominio en nuestra plataforma
  ssl_certificate: SSLCert;
  dns_records: DNSRecord[];
  status: 'active' | 'pending' | 'error';
  created_at: string;
  updated_at: string;
}

// Ejemplo de configuración
const clientDomains = {
  'company-123': {
    primary_domain: 'miempresa.com',
    custom_domains: ['app.miempresa.com', 'dashboard.miempresa.com'],
    subdomain: 'company-123.ipair.com',
    ssl_certificate: {
      provider: 'letsencrypt',
      status: 'active',
      expires_at: '2025-12-31'
    }
  }
};
```

### **2. Estructura de Dominios por Plan**

```typescript
// Configuración por plan comercial
const planDomainConfig = {
  basic: {
    subdomain: true,             // company-name.ipair.com
    custom_domains: false,       // No disponible
    ssl_certificate: 'free',     // Let's Encrypt
    dns_management: 'automatic', // Automático
    cost_monthly: 0,             // Gratis
    setup_time: 'instant'        // Inmediato
  },
  
  pro: {
    subdomain: true,             // company-name.ipair.com
    custom_domains: 2,           // 2 dominios personalizados
    ssl_certificate: 'free',     // Let's Encrypt
    dns_management: 'automatic', // Automático
    cost_monthly: 5,             // $5/mes
    setup_time: '5-10 minutes'   // Configuración manual
  },
  
  enterprise: {
    subdomain: true,             // company-name.ipair.com
    custom_domains: -1,          // Ilimitado
    ssl_certificate: 'wildcard', // Wildcard SSL
    dns_management: 'dedicated', // Gestión dedicada
    cost_monthly: 15,            // $15/mes
    setup_time: 'instant'        // Configuración automática
  }
};
```

---

## Procedimiento de Configuración

### **1. Subdominios (Recomendado para Inicio)**

```typescript
// Estructura de subdominios
const subdomainStructure = {
  // Cliente básico
  'basic': 'company-name.ipair.com',
  
  // Cliente pro
  'pro': 'company-name.ipair.com',
  
  // Cliente enterprise
  'enterprise': 'company-name.ipair.com' // + dominios personalizados
};

// Middleware de detección de tenant
const tenantDetectionMiddleware = async (ctx, next) => {
  const host = ctx.request.headers.host;
  
  // Detectar tenant por subdominio
  if (host.includes('.ipair.com')) {
    const subdomain = host.split('.')[0];
    const company = await getCompanyBySubdomain(subdomain);
    
    if (company) {
      ctx.state.tenant = company;
      ctx.state.company_id = company.id;
    }
  }
  
  // Detectar tenant por dominio personalizado
  else {
    const company = await getCompanyByCustomDomain(host);
    if (company) {
      ctx.state.tenant = company;
      ctx.state.company_id = company.id;
    }
  }
  
  await next();
};
```

### **2. Dominios Personalizados (Enterprise)**

```typescript
// Configuración de dominio personalizado
const customDomainSetup = {
  // 1. Cliente configura DNS
  dns_configuration: {
    type: 'CNAME',
    name: 'app',
    value: 'ipair.com',
    ttl: 3600
  },
  
  // 2. Verificación automática
  verification: {
    method: 'dns_txt_record',
    record: 'ipair-verification=abc123',
    status: 'pending'
  },
  
  // 3. SSL automático
  ssl: {
    provider: 'letsencrypt',
    auto_renewal: true,
    wildcard: false
  }
};
```

---

## Análisis de Costos

### **Costos por Opción:**

#### **Opción 1: Subdominios (Gratis)**
```typescript
const subdomainCosts = {
  dns_management: 0,           // Incluido en hosting
  ssl_certificates: 0,         // Let's Encrypt gratuito
  domain_registration: 0,      // No requiere dominio adicional
  total_monthly: 0,
  total_yearly: 0,
  setup_cost: 0,
  maintenance_cost: 0
};
```

#### **Opción 2: Dominios Personalizados**
```typescript
const customDomainCosts = {
  dns_management: 5,           // $5/mes por dominio
  ssl_certificates: 0,         // Let's Encrypt gratuito
  domain_registration: 12,     // $12/año por dominio
  wildcard_ssl: 60,            // $60/año (opcional)
  total_monthly: 5,
  total_yearly: 72,
  setup_cost: 0,
  maintenance_cost: 5
};
```

#### **Opción 3: Enterprise (White Label)**
```typescript
const enterpriseCosts = {
  dns_management: 10,          // $10/mes por dominio
  ssl_certificates: 0,         // Let's Encrypt gratuito
  domain_registration: 12,     // $12/año por dominio
  wildcard_ssl: 60,            // $60/año
  dedicated_ip: 5,             // $5/mes
  total_monthly: 15,
  total_yearly: 192,
  setup_cost: 50,
  maintenance_cost: 15
};
```

---

## Implementación Técnica

### **1. Configuración de Nginx/Traefik**

```yaml
# Traefik configuration para multi-tenancy
version: '3.8'
services:
  traefik:
    image: traefik:v2.10
    command:
      - --api.insecure=true
      - --providers.docker=true
      - --providers.file.directory=/etc/traefik/dynamic
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.email=admin@ipair.com
      - --certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./letsencrypt:/letsencrypt
      - ./dynamic:/etc/traefik/dynamic

  strapi:
    image: strapi/strapi
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.strapi.rule=HostRegexp(`{subdomain:[a-z0-9-]+}.ipair.com`)"
      - "traefik.http.routers.strapi.tls.certresolver=letsencrypt"
```

### **2. Middleware de Detección de Tenant**

```typescript
// Middleware para detectar tenant por dominio
const tenantDetectionMiddleware = async (ctx, next) => {
  const host = ctx.request.headers.host;
  let company = null;
  
  // 1. Verificar subdominio
  if (host.includes('.ipair.com')) {
    const subdomain = host.split('.')[0];
    company = await getCompanyBySubdomain(subdomain);
  }
  
  // 2. Verificar dominio personalizado
  else {
    company = await getCompanyByCustomDomain(host);
  }
  
  // 3. Verificar dominio principal
  if (!company && host === 'ipair.com') {
    company = await getDefaultCompany();
  }
  
  if (company) {
    ctx.state.tenant = company;
    ctx.state.company_id = company.id;
    ctx.state.plan = company.plan;
  } else {
    return ctx.unauthorized('Tenant no encontrado');
  }
  
  await next();
};
```

### **3. API de Gestión de Dominios**

```typescript
// API para gestionar dominios de clientes
const domainManagementAPI = {
  // Verificar disponibilidad de subdominio
  'GET /api/domains/check-subdomain/:subdomain': async (ctx) => {
    const { subdomain } = ctx.params;
    const isAvailable = await checkSubdomainAvailability(subdomain);
    
    return {
      subdomain,
      available: isAvailable,
      suggested: isAvailable ? subdomain : await suggestSubdomain(subdomain)
    };
  },
  
  // Configurar dominio personalizado
  'POST /api/domains/setup-custom': async (ctx) => {
    const { company_id, domain } = ctx.request.body;
    
    // 1. Verificar propiedad del dominio
    const verification = await verifyDomainOwnership(domain);
    
    // 2. Configurar DNS
    const dnsConfig = await generateDNSConfiguration(domain);
    
    // 3. Solicitar SSL
    const sslRequest = await requestSSLCertificate(domain);
    
    return {
      domain,
      verification,
      dns_config: dnsConfig,
      ssl_status: sslRequest.status,
      estimated_time: '5-10 minutos'
    };
  },
  
  // Listar dominios del cliente
  'GET /api/domains/client/:company_id': async (ctx) => {
    const { company_id } = ctx.params;
    const domains = await getClientDomains(company_id);
    
    return {
      company_id,
      domains,
      primary_domain: domains.find(d => d.is_primary),
      custom_domains: domains.filter(d => !d.is_primary)
    };
  }
};
```

---

## Procedimiento para el Cliente

### **Paso a Paso:**

#### **Para Subdominios (Automático):**
1. **Cliente se registra** → Se asigna automáticamente `company-name.ipair.com`
2. **Acceso inmediato** → Sin configuración adicional
3. **SSL automático** → Let's Encrypt se configura automáticamente

#### **Para Dominios Personalizados:**
1. **Cliente solicita** → Dominio personalizado
2. **Verificación** → Cliente debe verificar propiedad del dominio
3. **Configuración DNS** → Cliente configura CNAME en su proveedor DNS
4. **SSL automático** → Let's Encrypt genera certificado
5. **Activación** → Dominio activo en 5-10 minutos

---

## Plan de Implementación

### **Fase 1: Subdominios (Semana 1)**
- [ ] Configurar Traefik para subdominios
- [ ] Implementar middleware de detección de tenant
- [ ] Configurar SSL automático con Let's Encrypt
- [ ] Testing de subdominios

### **Fase 2: Dominios Personalizados (Semana 2)**
- [ ] Implementar API de gestión de dominios
- [ ] Sistema de verificación de propiedad
- [ ] Configuración automática de DNS
- [ ] Testing de dominios personalizados

### **Fase 3: White Label (Semana 3)**
- [ ] Implementar wildcard SSL
- [ ] Sistema de gestión dedicada
- [ ] Configuración automática completa
- [ ] Testing de white label

---

## Métricas de Éxito

### **Técnicas:**
- Tiempo de configuración de subdominio: < 1 minuto
- Tiempo de configuración de dominio personalizado: < 10 minutos
- Uptime del sistema DNS: > 99.9%
- Tiempo de resolución DNS: < 100ms

### **Negocio:**
- Adopción de dominios personalizados: > 30% (Pro+)
- Reducción de tickets de soporte DNS: > 80%
- Satisfacción cliente: > 4.5/5

### **Operacionales:**
- Automatización de configuración: 100%
- Tiempo de resolución de problemas: < 2 horas
- Costo por dominio gestionado: < $5/mes

---

## Conclusión

El sistema de DNS multi-tenant es fundamental para la escalabilidad y experiencia de cliente de iPair, proporcionando:
- **Flexibilidad** con múltiples opciones de dominio
- **Escalabilidad** con configuración automática
- **Costos controlados** con opciones gratuitas y premium
- **Experiencia superior** con SSL automático

**Próximo paso:** Implementar Fase 1 con subdominios automáticos.

---

## Historial de Cambios

- **2025-01-22** | AI Pair Platform (asistente de Marcelo Escallón) | Creación inicial de la arquitectura de DNS multi-tenant para URLs personalizadas 