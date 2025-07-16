# Arquitectura: Strapi CMS Unificado para iPair

**Versión:** 1.0.0  
**Fecha:** 2025-01-22  
**Autor:** AI Pair Platform (asistente de Marcelo Escallón)  
**Estado:** Planificado  
**Impacto:** Crítico - Arquitectura unificada de toda la plataforma  

---

## Resumen Ejecutivo

Implementación de Strapi como CMS unificado que administra tanto el contenido de la plataforma iPair como los límites y contenido de los clientes, maximizando eficiencia y minimizando curva de aprendizaje.

---

## Arquitectura Unificada

### **1. Estructura de Contenido Unificada**

```typescript
// Strapi como CMS central para TODO
interface StrapiUnifiedCMS {
  // 1. CONTENIDO DE LA PLATAFORMA (iPair)
  platform: {
    landing_pages: LandingPage[];
    blog_posts: BlogPost[];
    help_articles: HelpArticle[];
    faqs: FAQ[];
    testimonials: Testimonial[];
    case_studies: CaseStudy[];
    pricing_pages: PricingPage[];
    feature_descriptions: FeatureDescription[];
    media: PlatformMedia[];
    announcements: Announcement[];
    notifications: Notification[];
  },
  
  // 2. CONTENIDO DE CLIENTES (Multi-tenant)
  clients: {
    companies: Company[];
    company_plans: CompanyPlan[];
    company_content: CompanyContent[];
    company_media: CompanyMedia[];
    company_snippets: CompanySnippet[];
    company_integrations: CompanyIntegration[];
  },
  
  // 3. SISTEMA DE LÍMITES UNIFICADO
  limits: {
    platform_limits: PlatformLimits;
    client_limits: ClientLimits;
    usage_tracking: UsageTracking;
    plan_configurations: PlanConfiguration[];
  }
}
```

### **2. Modelos de Strapi**

```typescript
// Modelos principales en Strapi
const strapiModels = {
  // PLATFORM CONTENT
  'api::landing-page.landing-page': {
    attributes: {
      title: 'string',
      slug: 'string',
      content: 'richtext',
      seo_meta: 'json',
      is_active: 'boolean',
      created_by: 'relation',
      updated_by: 'relation'
    },
    limits: {
      basic: 3,
      pro: 10,
      enterprise: -1
    }
  },
  
  'api::blog-post.blog-post': {
    attributes: {
      title: 'string',
      slug: 'string',
      excerpt: 'text',
      content: 'richtext',
      featured_image: 'media',
      author: 'relation',
      categories: 'relation',
      tags: 'relation',
      published_at: 'datetime',
      seo_meta: 'json'
    },
    limits: {
      basic: 10,
      pro: 50,
      enterprise: -1
    }
  },
  
  'api::help-article.help-article': {
    attributes: {
      title: 'string',
      slug: 'string',
      content: 'richtext',
      category: 'enumeration',
      difficulty: 'enumeration',
      video_url: 'string',
      attachments: 'media',
      is_featured: 'boolean',
      view_count: 'integer'
    },
    limits: {
      basic: 20,
      pro: 100,
      enterprise: -1
    }
  },
  
  // CLIENT CONTENT
  'api::company-snippet.company-snippet': {
    attributes: {
      company_id: 'string',
      title: 'string',
      content: 'text',
      context: 'json',
      triggers: 'json',
      is_active: 'boolean',
      usage_count: 'integer',
      created_by: 'relation'
    },
    limits: {
      basic: 10,
      pro: 50,
      enterprise: -1
    }
  },
  
  'api::company-media.company-media': {
    attributes: {
      company_id: 'string',
      file: 'media',
      file_size: 'integer',
      file_type: 'string',
      category: 'enumeration',
      is_public: 'boolean',
      created_by: 'relation'
    },
    limits: {
      basic: 100, // MB
      pro: 500,   // MB
      enterprise: -1
    }
  },
  
  // PLANS & LIMITS
  'api::company-plan.company-plan': {
    attributes: {
      company_id: 'string',
      plan_type: 'enumeration',
      current_usage: 'json',
      limits: 'json',
      reset_date: 'date',
      is_active: 'boolean',
      stripe_subscription_id: 'string'
    }
  },
  
  'api::usage-tracking.usage-tracking': {
    attributes: {
      company_id: 'string',
      content_type: 'string',
      action: 'enumeration',
      quantity: 'integer',
      timestamp: 'datetime',
      user_id: 'string'
    }
  }
};
```

---

## Sistema de Límites Unificado

### **1. Middleware de Control Unificado**

```typescript
// Middleware unificado para toda la plataforma
const unifiedLimitsMiddleware = async (ctx, next) => {
  const { company_id, user_id } = ctx.state.user;
  const contentType = ctx.request.url.split('/')[1];
  
  // Determinar si es contenido de plataforma o cliente
  const isPlatformContent = contentType.startsWith('platform-');
  const isClientContent = company_id && !isPlatformContent;
  
  if (isClientContent) {
    // Validar límites de cliente
    const clientLimits = await validateClientLimits(company_id, contentType, ctx.request.method);
    if (!clientLimits.allowed) {
      return ctx.badRequest(clientLimits.message);
    }
  } else if (isPlatformContent) {
    // Validar límites de plataforma (si aplica)
    const platformLimits = await validatePlatformLimits(contentType, ctx.request.method);
    if (!platformLimits.allowed) {
      return ctx.badRequest(platformLimits.message);
    }
  }
  
  await next();
  
  // Actualizar tracking de uso
  if (ctx.response.status < 400) {
    await trackUsage({
      company_id,
      content_type: contentType,
      action: ctx.request.method,
      user_id,
      timestamp: new Date()
    });
  }
};
```

### **2. Validación de Límites**

```typescript
// Validación unificada de límites
const validateClientLimits = async (company_id: string, contentType: string, method: string) => {
  const plan = await getCompanyPlan(company_id);
  const currentUsage = await getCurrentUsage(company_id, contentType);
  const limits = getContentTypeLimits(contentType, plan.plan_type);
  
  if (method === 'POST' && limits !== -1) {
    if (currentUsage >= limits) {
      return {
        allowed: false,
        message: `Límite de ${contentType} alcanzado para el plan ${plan.plan_type}. ` +
                 `Límite: ${limits}, Actual: ${currentUsage}`
      };
    }
  }
  
  return { allowed: true };
};

const validatePlatformLimits = async (contentType: string, method: string) => {
  // Límites para contenido de la plataforma (si aplica)
  const platformLimits = getPlatformLimits(contentType);
  
  if (method === 'POST' && platformLimits !== -1) {
    const currentUsage = await getPlatformUsage(contentType);
    
    if (currentUsage >= platformLimits) {
      return {
        allowed: false,
        message: `Límite de contenido de plataforma alcanzado: ${contentType}`
      };
    }
  }
  
  return { allowed: true };
};
```

---

## Dashboard Unificado

### **1. Panel de Administración Completo**

```typescript
// Dashboard unificado para toda la plataforma
const UnifiedDashboard = ({ userRole, companyId }) => {
  const { data: platformStats } = usePlatformStats();
  const { data: clientStats } = useClientStats(companyId);
  
  return (
    <div className="unified-dashboard">
      <header className="dashboard-header">
        <h1>Panel de Administración iPair</h1>
        <UserRoleBadge role={userRole} />
      </header>
      
      <div className="dashboard-sections">
        {/* SECCIÓN PLATAFORMA (Solo para ADMIN/SUPER_ADMIN) */}
        {hasPermission('ADMIN') && (
          <PlatformSection stats={platformStats} />
        )}
        
        {/* SECCIÓN CLIENTE */}
        {companyId && (
          <ClientSection stats={clientStats} companyId={companyId} />
        )}
      </div>
    </div>
  );
};

// Sección de contenido de la plataforma
const PlatformSection = ({ stats }) => (
  <section className="platform-section">
    <h2>Contenido de la Plataforma</h2>
    
    <div className="content-grid">
      <ContentCard 
        title="Landing Pages"
        count={stats.landing_pages}
        limit={stats.limits.landing_pages}
        type="platform"
      />
      
      <ContentCard 
        title="Blog Posts"
        count={stats.blog_posts}
        limit={stats.limits.blog_posts}
        type="platform"
      />
      
      <ContentCard 
        title="Help Articles"
        count={stats.help_articles}
        limit={stats.limits.help_articles}
        type="platform"
      />
      
      <ContentCard 
        title="Media Storage"
        count={stats.media_storage}
        limit={stats.limits.media_storage}
        type="platform"
        unit="MB"
      />
    </div>
    
    <PlatformActions />
  </section>
);

// Sección de contenido de cliente
const ClientSection = ({ stats, companyId }) => (
  <section className="client-section">
    <h2>Contenido de la Empresa</h2>
    
    <div className="content-grid">
      <ContentCard 
        title="Snippets"
        count={stats.snippets}
        limit={stats.limits.snippets}
        type="client"
        plan={stats.plan}
      />
      
      <ContentCard 
        title="Media"
        count={stats.media_mb}
        limit={stats.limits.media}
        type="client"
        plan={stats.plan}
        unit="MB"
      />
      
      <ContentCard 
        title="Integrations"
        count={stats.integrations}
        limit={stats.limits.integrations}
        type="client"
        plan={stats.plan}
      />
    </div>
    
    <ClientActions companyId={companyId} />
  </section>
);
```

### **2. Gestión de Contenido Unificada**

```typescript
// Editor unificado de contenido
const UnifiedContentEditor = ({ contentType, contentId, companyId }) => {
  const { data: content } = useContent(contentType, contentId);
  const { data: limits } = useContentLimits(contentType, companyId);
  
  return (
    <div className="content-editor">
      <header className="editor-header">
        <h2>Editor de {getContentTypeLabel(contentType)}</h2>
        <UsageIndicator 
          current={limits.current}
          limit={limits.limit}
          type={contentType}
        />
      </header>
      
      <div className="editor-content">
        {/* Editor específico según tipo de contenido */}
        {contentType === 'blog-post' && (
          <BlogPostEditor content={content} />
        )}
        
        {contentType === 'company-snippet' && (
          <SnippetEditor content={content} companyId={companyId} />
        )}
        
        {contentType === 'help-article' && (
          <HelpArticleEditor content={content} />
        )}
      </div>
      
      <footer className="editor-footer">
        <SaveButton />
        <PreviewButton />
        <PublishButton />
      </footer>
    </div>
  );
};
```

---

## API Unificada

### **1. Endpoints Unificados**

```typescript
// API unificada para toda la plataforma
const unifiedAPI = {
  // CONTENIDO DE PLATAFORMA
  'GET /api/platform/landing-pages': 'Obtener landing pages',
  'POST /api/platform/landing-pages': 'Crear landing page',
  'PUT /api/platform/landing-pages/:id': 'Actualizar landing page',
  'DELETE /api/platform/landing-pages/:id': 'Eliminar landing page',
  
  'GET /api/platform/blog-posts': 'Obtener blog posts',
  'POST /api/platform/blog-posts': 'Crear blog post',
  'PUT /api/platform/blog-posts/:id': 'Actualizar blog post',
  'DELETE /api/platform/blog-posts/:id': 'Eliminar blog post',
  
  'GET /api/platform/help-articles': 'Obtener artículos de ayuda',
  'POST /api/platform/help-articles': 'Crear artículo de ayuda',
  'PUT /api/platform/help-articles/:id': 'Actualizar artículo de ayuda',
  'DELETE /api/platform/help-articles/:id': 'Eliminar artículo de ayuda',
  
  // CONTENIDO DE CLIENTE
  'GET /api/client/snippets': 'Obtener snippets del cliente',
  'POST /api/client/snippets': 'Crear snippet (validar límites)',
  'PUT /api/client/snippets/:id': 'Actualizar snippet',
  'DELETE /api/client/snippets/:id': 'Eliminar snippet',
  
  'GET /api/client/media': 'Obtener media del cliente',
  'POST /api/client/media': 'Subir media (validar límites)',
  'DELETE /api/client/media/:id': 'Eliminar media',
  
  // LÍMITES Y USO
  'GET /api/limits/usage': 'Obtener uso actual',
  'GET /api/limits/plan-config': 'Obtener configuración del plan',
  'POST /api/limits/validate': 'Validar límite específico',
  
  // ESTADÍSTICAS
  'GET /api/stats/platform': 'Estadísticas de la plataforma',
  'GET /api/stats/client': 'Estadísticas del cliente',
  'GET /api/stats/usage': 'Estadísticas de uso'
};
```

### **2. Hooks de Strapi Unificados**

```typescript
// Hooks unificados para toda la plataforma
const unifiedHooks = {
  // Hook para validar límites antes de crear
  beforeCreate: async (event) => {
    const { data, params } = event;
    const contentType = params.model;
    
    // Determinar tipo de contenido
    const isPlatformContent = contentType.startsWith('platform-');
    const isClientContent = data.company_id;
    
    if (isClientContent) {
      const canCreate = await validateClientLimits(
        data.company_id, 
        contentType, 
        'POST'
      );
      
      if (!canCreate.allowed) {
        throw new Error(canCreate.message);
      }
    }
  },
  
  // Hook para actualizar uso después de crear
  afterCreate: async (event) => {
    const { result, params } = event;
    const contentType = params.model;
    
    // Actualizar contador de uso
    await trackUsage({
      company_id: result.company_id,
      content_type: contentType,
      action: 'CREATE',
      quantity: 1,
      timestamp: new Date()
    });
  },
  
  // Hook para validar antes de actualizar
  beforeUpdate: async (event) => {
    const { data, params } = event;
    const contentType = params.model;
    
    // Validaciones específicas según tipo de contenido
    if (contentType === 'company-snippet') {
      await validateSnippetUpdate(data);
    }
  }
};
```

---

## Plan de Implementación

### **Fase 1: Configuración Base (Semana 1)**
- [ ] Instalación y configuración de Strapi
- [ ] Configuración de modelos unificados
- [ ] Setup de middleware de límites
- [ ] Configuración de autenticación multi-tenant

### **Fase 2: Contenido de Plataforma (Semana 2)**
- [ ] Implementar modelos de contenido de plataforma
- [ ] Crear editor de landing pages
- [ ] Implementar sistema de blog
- [ ] Crear gestor de artículos de ayuda

### **Fase 3: Contenido de Cliente (Semana 3)**
- [ ] Implementar modelos de contenido de cliente
- [ ] Crear editor de snippets
- [ ] Implementar gestor de media
- [ ] Sistema de límites por plan

### **Fase 4: Dashboard Unificado (Semana 4)**
- [ ] Crear dashboard unificado
- [ ] Implementar estadísticas
- [ ] Sistema de alertas y notificaciones
- [ ] Testing completo

---

## Ventajas de la Arquitectura Unificada

### **✅ Eficiencia Operacional:**
- **Una sola plataforma**: Strapi maneja todo
- **Una sola curva de aprendizaje**: Equipo unificado
- **Desarrollo centralizado**: Menos complejidad

### **✅ Escalabilidad:**
- **Multi-tenant nativo**: Strapi lo maneja automáticamente
- **Límites flexibles**: Configurables por plan
- **Performance optimizado**: Una sola base de datos

### **✅ Mantenibilidad:**
- **Código unificado**: Menos duplicación
- **Actualizaciones centralizadas**: Una sola fuente de verdad
- **Testing simplificado**: Una sola suite de pruebas

### **✅ ROI:**
- **Menor tiempo de desarrollo**: Reutilización de componentes
- **Menor costo de mantenimiento**: Una sola plataforma
- **Mayor velocidad de iteración**: Cambios centralizados

---

## Conclusión

Strapi como CMS unificado es la solución óptima para iPair, proporcionando:
- **Eficiencia máxima** con una sola plataforma
- **Escalabilidad** con límites por plan
- **Flexibilidad** para crecimiento futuro
- **ROI superior** con desarrollo unificado

**Próximo paso:** Implementar Fase 1 de la configuración base de Strapi.

---

## Historial de Cambios

- **2025-01-22** | AI Pair Platform (asistente de Marcelo Escallón) | Creación inicial de la arquitectura de Strapi CMS unificado para iPair 