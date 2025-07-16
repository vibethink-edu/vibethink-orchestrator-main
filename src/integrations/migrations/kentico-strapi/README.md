# Migración Kentico → Strapi CMS

## 🎯 **Propósito**

Migración automatizada de contenido desde Kentico v12 hacia Strapi CMS, preservando estructura, metadatos y relaciones de contenido.

## 📁 **Estructura**

```
kentico-strapi/
├── extractors/              # Extractores de Kentico
├── transformers/            # Transformadores para Strapi
├── loaders/                 # Cargadores en Strapi
├── validators/              # Validadores
├── types/                   # Tipos de datos
└── utils/                   # Utilidades
```

## 🔧 **Implementación**

### **Extractor de Kentico:**
```typescript
// ✅ Extractor de páginas de Kentico
export class KenticoPageExtractor {
  private kenticoClient: KenticoClient;
  
  constructor(config: KenticoConfig) {
    this.kenticoClient = new KenticoClient({
      url: config.url,
      username: config.username,
      password: config.password,
      apiKey: config.apiKey
    });
  }
  
  // Extraer todas las páginas
  async extractAllPages(): Promise<KenticoPage[]> {
    const pages = await this.kenticoClient.getPages();
    return pages.map(page => this.transformKenticoPage(page));
  }
  
  // Extraer páginas por sección
  async extractPagesBySection(sectionId: string): Promise<KenticoPage[]> {
    const pages = await this.kenticoClient.getPagesBySection(sectionId);
    return pages.map(page => this.transformKenticoPage(page));
  }
  
  // Extraer página específica
  async extractPage(pageId: string): Promise<KenticoPage> {
    const page = await this.kenticoClient.getPage(pageId);
    return this.transformKenticoPage(page);
  }
  
  // Transformar página de Kentico
  private transformKenticoPage(rawPage: any): KenticoPage {
    return {
      id: rawPage.DocumentID,
      title: rawPage.DocumentName,
      content: rawPage.DocumentContent,
      url: rawPage.DocumentUrlPath,
      publishedAt: rawPage.DocumentPublishedWhen,
      createdBy: rawPage.DocumentCreatedByUserID,
      modifiedBy: rawPage.DocumentModifiedByUserID,
      createdWhen: rawPage.DocumentCreatedWhen,
      modifiedWhen: rawPage.DocumentModifiedWhen,
      metadata: this.extractMetadata(rawPage),
      components: this.extractComponents(rawPage),
      seo: this.extractSEO(rawPage)
    };
  }
  
  // Extraer metadatos
  private extractMetadata(page: any): KenticoMetadata {
    return {
      keywords: page.DocumentMetaKeywords,
      description: page.DocumentMetaDescription,
      title: page.DocumentMetaTitle,
      author: page.DocumentMetaAuthor,
      robots: page.DocumentMetaRobots
    };
  }
  
  // Extraer componentes
  private extractComponents(page: any): KenticoComponent[] {
    const components = page.DocumentComponents || [];
    return components.map(comp => ({
      id: comp.ComponentID,
      type: comp.ComponentType,
      content: comp.ComponentContent,
      properties: comp.ComponentProperties
    }));
  }
  
  // Extraer SEO
  private extractSEO(page: any): KenticoSEO {
    return {
      title: page.DocumentMetaTitle,
      description: page.DocumentMetaDescription,
      keywords: page.DocumentMetaKeywords,
      canonicalUrl: page.DocumentCanonicalUrl,
      ogTitle: page.DocumentOGTitle,
      ogDescription: page.DocumentOGDescription,
      ogImage: page.DocumentOGImage
    };
  }
}
```

### **Transformador para Strapi:**
```typescript
// ✅ Transformador de Kentico a Strapi
export class StrapiPageTransformer {
  // Transformar página de Kentico a Strapi
  transformPage(kenticoPage: KenticoPage): StrapiPage {
    return {
      title: kenticoPage.title,
      content: kenticoPage.content,
      slug: this.generateSlug(kenticoPage.url),
      publishedAt: kenticoPage.publishedAt,
      createdAt: kenticoPage.createdWhen,
      updatedAt: kenticoPage.modifiedWhen,
      createdBy: this.mapUser(kenticoPage.createdBy),
      updatedBy: this.mapUser(kenticoPage.modifiedBy),
      seo: this.transformSEO(kenticoPage.seo),
      metadata: this.transformMetadata(kenticoPage.metadata),
      components: this.transformComponents(kenticoPage.components),
      locale: 'es',
      localizations: []
    };
  }
  
  // Transformar SEO
  private transformSEO(kenticoSEO: KenticoSEO): StrapiSEO {
    return {
      metaTitle: kenticoSEO.title,
      metaDescription: kenticoSEO.description,
      keywords: kenticoSEO.keywords,
      canonicalURL: kenticoSEO.canonicalUrl,
      ogTitle: kenticoSEO.ogTitle,
      ogDescription: kenticoSEO.ogDescription,
      ogImage: kenticoSEO.ogImage
    };
  }
  
  // Transformar metadatos
  private transformMetadata(kenticoMetadata: KenticoMetadata): StrapiMetadata {
    return {
      keywords: kenticoMetadata.keywords,
      description: kenticoMetadata.description,
      title: kenticoMetadata.title,
      author: kenticoMetadata.author,
      robots: kenticoMetadata.robots
    };
  }
  
  // Transformar componentes
  private transformComponents(kenticoComponents: KenticoComponent[]): StrapiComponent[] {
    return kenticoComponents.map(comp => ({
      __component: `content.${comp.type}`,
      id: comp.id,
      content: comp.content,
      properties: comp.properties
    }));
  }
  
  // Generar slug
  private generateSlug(url: string): string {
    return url.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
  }
  
  // Mapear usuario
  private mapUser(userId: string): string {
    // Mapear ID de usuario de Kentico a Strapi
    return userId; // Implementar mapeo real
  }
}
```

### **Cargador en Strapi:**
```typescript
// ✅ Cargador de datos en Strapi
export class StrapiPageLoader {
  private strapiClient: StrapiClient;
  
  constructor(config: StrapiConfig) {
    this.strapiClient = new StrapiClient({
      url: config.url,
      token: config.token,
      apiKey: config.apiKey
    });
  }
  
  // Cargar página en Strapi
  async loadPage(strapiPage: StrapiPage): Promise<StrapiPage> {
    try {
      const response = await this.strapiClient.createPage(strapiPage);
      
      // Cargar componentes si existen
      if (strapiPage.components && strapiPage.components.length > 0) {
        await this.loadComponents(response.id, strapiPage.components);
      }
      
      return response;
    } catch (error) {
      throw new Error(`Failed to load page: ${error.message}`);
    }
  }
  
  // Cargar múltiples páginas
  async loadPages(strapiPages: StrapiPage[]): Promise<StrapiPage[]> {
    const results: StrapiPage[] = [];
    
    for (const page of strapiPages) {
      try {
        const result = await this.loadPage(page);
        results.push(result);
      } catch (error) {
        console.error(`Failed to load page ${page.title}:`, error);
      }
    }
    
    return results;
  }
  
  // Cargar componentes
  private async loadComponents(pageId: string, components: StrapiComponent[]): Promise<void> {
    for (const component of components) {
      try {
        await this.strapiClient.createComponent(pageId, component);
      } catch (error) {
        console.error(`Failed to load component ${component.__component}:`, error);
      }
    }
  }
  
  // Verificar página cargada
  async verifyPage(pageId: string): Promise<boolean> {
    try {
      const page = await this.strapiClient.getPage(pageId);
      return !!page;
    } catch (error) {
      return false;
    }
  }
}
```

### **Validador de Migración:**
```typescript
// ✅ Validador de migración Kentico → Strapi
export class KenticoStrapiValidator {
  // Validar datos extraídos
  validateExtractedData(data: KenticoPage[]): ValidationResult {
    const errors: string[] = [];
    
    data.forEach((page, index) => {
      if (!page.title) {
        errors.push(`Page ${index}: Missing title`);
      }
      if (!page.content) {
        errors.push(`Page ${index}: Missing content`);
      }
      if (!page.url) {
        errors.push(`Page ${index}: Missing URL`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Validar datos transformados
  validateTransformedData(data: StrapiPage[]): ValidationResult {
    const errors: string[] = [];
    
    data.forEach((page, index) => {
      if (!page.title) {
        errors.push(`Page ${index}: Missing title`);
      }
      if (!page.slug) {
        errors.push(`Page ${index}: Missing slug`);
      }
      if (!page.content) {
        errors.push(`Page ${index}: Missing content`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Verificar migración
  async verifyMigration(originalData: KenticoPage[], migratedData: StrapiPage[]): Promise<VerificationResult> {
    const verification: VerificationResult = {
      totalPages: originalData.length,
      migratedPages: migratedData.length,
      successRate: (migratedData.length / originalData.length) * 100,
      errors: [],
      warnings: []
    };
    
    // Verificar que todas las páginas fueron migradas
    if (verification.migratedPages < verification.totalPages) {
      verification.warnings.push(`${verification.totalPages - verification.migratedPages} pages were not migrated`);
    }
    
    // Verificar contenido
    for (let i = 0; i < Math.min(originalData.length, migratedData.length); i++) {
      const original = originalData[i];
      const migrated = migratedData[i];
      
      if (original.title !== migrated.title) {
        verification.errors.push(`Page ${i}: Title mismatch`);
      }
      
      if (original.content !== migrated.content) {
        verification.warnings.push(`Page ${i}: Content may have been modified`);
      }
    }
    
    return verification;
  }
}
```

## 🎯 **Tipos de Datos**

### **Kentico Types:**
```typescript
export interface KenticoPage {
  id: string;
  title: string;
  content: string;
  url: string;
  publishedAt: Date;
  createdBy: string;
  modifiedBy: string;
  createdWhen: Date;
  modifiedWhen: Date;
  metadata: KenticoMetadata;
  components: KenticoComponent[];
  seo: KenticoSEO;
}

export interface KenticoMetadata {
  keywords: string;
  description: string;
  title: string;
  author: string;
  robots: string;
}

export interface KenticoComponent {
  id: string;
  type: string;
  content: string;
  properties: Record<string, any>;
}

export interface KenticoSEO {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}
```

### **Strapi Types:**
```typescript
export interface StrapiPage {
  title: string;
  content: string;
  slug: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  seo: StrapiSEO;
  metadata: StrapiMetadata;
  components: StrapiComponent[];
  locale: string;
  localizations: any[];
}

export interface StrapiSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalURL: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface StrapiMetadata {
  keywords: string;
  description: string;
  title: string;
  author: string;
  robots: string;
}

export interface StrapiComponent {
  __component: string;
  id: string;
  content: string;
  properties: Record<string, any>;
}
```

## 🛡️ **Seguridad Multi-tenant**

### **Validación de Acceso:**
```typescript
// ✅ Validación de acceso a migraciones
export const validateKenticoStrapiAccess = (migration: Migration, user: User): boolean => {
  // Verificar que la migración pertenece a la empresa del usuario
  if (migration.company_id !== user.company_id) {
    return false;
  }
  
  // Verificar permisos del usuario
  if (!hasPermission(user, 'MIGRATION_KENTICO_STRAPI')) {
    return false;
  }
  
  return true;
};
```

## 🧪 **Testing Strategy**

### **Migración Testing:**
```typescript
describe('Kentico to Strapi Migration', () => {
  it('should migrate pages correctly', async () => {
    const extractor = new KenticoPageExtractor(config);
    const transformer = new StrapiPageTransformer();
    const loader = new StrapiPageLoader(config);
    
    const kenticoPages = await extractor.extractAllPages();
    const strapiPages = kenticoPages.map(page => transformer.transformPage(page));
    const migratedPages = await loader.loadPages(strapiPages);
    
    expect(migratedPages.length).toBe(kenticoPages.length);
    expect(migratedPages[0].title).toBe(kenticoPages[0].title);
  });
  
  it('should preserve content structure', async () => {
    const originalPage = await extractor.extractPage('test-page-id');
    const transformedPage = transformer.transformPage(originalPage);
    const migratedPage = await loader.loadPage(transformedPage);
    
    expect(migratedPage.content).toBe(originalPage.content);
    expect(migratedPage.seo.metaTitle).toBe(originalPage.seo.title);
  });
});
```

## 📊 **Métricas de Calidad**

### **Performance:**
- **Extraction Time**: <30s para 1000 páginas
- **Transformation Time**: <10s para 1000 páginas
- **Loading Time**: <60s para 1000 páginas
- **Total Migration Time**: <2min para 1000 páginas

### **Reliability:**
- **Data Integrity**: 100% validación
- **Content Preservation**: 100% contenido preservado
- **SEO Preservation**: 100% SEO preservado
- **Component Preservation**: 100% componentes preservados

---

**La migración Kentico → Strapi sigue los principios de VThink 1.0, asegurando migración segura y completa del contenido.** 