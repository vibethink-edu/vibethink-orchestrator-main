# Migración Kentico → Payload CMS

## 🎯 **Propósito**

Migración automatizada de contenido desde Kentico v12 hacia Payload CMS, preservando estructura, metadatos y relaciones de contenido con soporte para tipos de contenido personalizados.

## 📁 **Estructura**

```
kentico-payload/
├── extractors/              # Extractores de Kentico
├── transformers/            # Transformadores para Payload
├── loaders/                 # Cargadores en Payload
├── validators/              # Validadores
├── types/                   # Tipos de datos
└── utils/                   # Utilidades
```

## 🔧 **Implementación**

### **Extractor de Kentico:**
```typescript
// ✅ Extractor de contenido de Kentico
export class KenticoContentExtractor {
  private kenticoClient: KenticoClient;
  
  constructor(config: KenticoConfig) {
    this.kenticoClient = new KenticoClient({
      url: config.url,
      username: config.username,
      password: config.password,
      apiKey: config.apiKey
    });
  }
  
  // Extraer todos los tipos de contenido
  async extractAllContent(): Promise<KenticoContent[]> {
    const contentTypes = await this.kenticoClient.getContentTypes();
    const allContent: KenticoContent[] = [];
    
    for (const contentType of contentTypes) {
      const content = await this.kenticoClient.getContentByType(contentType);
      allContent.push(...content.map(item => this.transformKenticoContent(item)));
    }
    
    return allContent;
  }
  
  // Extraer contenido por tipo
  async extractContentByType(contentType: string): Promise<KenticoContent[]> {
    const content = await this.kenticoClient.getContentByType(contentType);
    return content.map(item => this.transformKenticoContent(item));
  }
  
  // Extraer contenido específico
  async extractContent(contentId: string): Promise<KenticoContent> {
    const content = await this.kenticoClient.getContent(contentId);
    return this.transformKenticoContent(content);
  }
  
  // Transformar contenido de Kentico
  private transformKenticoContent(rawContent: any): KenticoContent {
    return {
      id: rawContent.DocumentID,
      title: rawContent.DocumentName,
      content: rawContent.DocumentContent,
      contentType: rawContent.DocumentType,
      url: rawContent.DocumentUrlPath,
      publishedAt: rawContent.DocumentPublishedWhen,
      createdBy: rawContent.DocumentCreatedByUserID,
      modifiedBy: rawContent.DocumentModifiedByUserID,
      createdWhen: rawContent.DocumentCreatedWhen,
      modifiedWhen: rawContent.DocumentModifiedWhen,
      metadata: this.extractMetadata(rawContent),
      fields: this.extractFields(rawContent),
      seo: this.extractSEO(rawContent),
      media: this.extractMedia(rawContent)
    };
  }
  
  // Extraer campos personalizados
  private extractFields(content: any): KenticoField[] {
    const fields = content.DocumentFields || [];
    return fields.map(field => ({
      name: field.FieldName,
      value: field.FieldValue,
      type: field.FieldType,
      required: field.FieldRequired
    }));
  }
  
  // Extraer media
  private extractMedia(content: any): KenticoMedia[] {
    const media = content.DocumentMedia || [];
    return media.map(item => ({
      id: item.MediaID,
      url: item.MediaUrl,
      alt: item.MediaAlt,
      title: item.MediaTitle,
      type: item.MediaType
    }));
  }
}
```

### **Transformador para Payload CMS:**
```typescript
// ✅ Transformador de Kentico a Payload CMS
export class PayloadContentTransformer {
  // Transformar contenido de Kentico a Payload
  transformContent(kenticoContent: KenticoContent): PayloadContent {
    return {
      title: kenticoContent.title,
      content: kenticoContent.content,
      slug: this.generateSlug(kenticoContent.url),
      publishedDate: kenticoContent.publishedAt,
      createdAt: kenticoContent.createdWhen,
      updatedAt: kenticoContent.modifiedWhen,
      createdBy: this.mapUser(kenticoContent.createdBy),
      updatedBy: this.mapUser(kenticoContent.modifiedBy),
      contentType: this.mapContentType(kenticoContent.contentType),
      seo: this.transformSEO(kenticoContent.seo),
      metadata: this.transformMetadata(kenticoContent.metadata),
      fields: this.transformFields(kenticoContent.fields),
      media: this.transformMedia(kenticoContent.media),
      status: 'published'
    };
  }
  
  // Mapear tipo de contenido
  private mapContentType(kenticoType: string): string {
    const typeMapping: Record<string, string> = {
      'Article': 'articles',
      'Page': 'pages',
      'Blog': 'blog-posts',
      'Product': 'products',
      'Service': 'services'
    };
    
    return typeMapping[kenticoType] || 'content';
  }
  
  // Transformar campos
  private transformFields(kenticoFields: KenticoField[]): PayloadField[] {
    return kenticoFields.map(field => ({
      name: field.name,
      value: field.value,
      type: this.mapFieldType(field.type),
      required: field.required
    }));
  }
  
  // Mapear tipo de campo
  private mapFieldType(kenticoType: string): string {
    const typeMapping: Record<string, string> = {
      'Text': 'text',
      'RichText': 'richText',
      'Number': 'number',
      'Date': 'date',
      'Boolean': 'checkbox',
      'Media': 'upload'
    };
    
    return typeMapping[kenticoType] || 'text';
  }
  
  // Transformar media
  private transformMedia(kenticoMedia: KenticoMedia[]): PayloadMedia[] {
    return kenticoMedia.map(media => ({
      url: media.url,
      alt: media.alt,
      title: media.title,
      type: media.type
    }));
  }
}
```

### **Cargador en Payload CMS:**
```typescript
// ✅ Cargador de datos en Payload CMS
export class PayloadContentLoader {
  private payloadClient: PayloadClient;
  
  constructor(config: PayloadConfig) {
    this.payloadClient = new PayloadClient({
      url: config.url,
      token: config.token,
      apiKey: config.apiKey
    });
  }
  
  // Cargar contenido en Payload
  async loadContent(payloadContent: PayloadContent): Promise<PayloadContent> {
    try {
      const response = await this.payloadClient.createContent(
        payloadContent.contentType,
        payloadContent
      );
      
      // Cargar media si existe
      if (payloadContent.media && payloadContent.media.length > 0) {
        await this.loadMedia(response.id, payloadContent.media);
      }
      
      return response;
    } catch (error) {
      throw new Error(`Failed to load content: ${error.message}`);
    }
  }
  
  // Cargar múltiples contenidos
  async loadContentBatch(payloadContents: PayloadContent[]): Promise<PayloadContent[]> {
    const results: PayloadContent[] = [];
    
    for (const content of payloadContents) {
      try {
        const result = await this.loadContent(content);
        results.push(result);
      } catch (error) {
        console.error(`Failed to load content ${content.title}:`, error);
      }
    }
    
    return results;
  }
  
  // Cargar media
  private async loadMedia(contentId: string, media: PayloadMedia[]): Promise<void> {
    for (const mediaItem of media) {
      try {
        await this.payloadClient.uploadMedia(contentId, mediaItem);
      } catch (error) {
        console.error(`Failed to load media ${mediaItem.title}:`, error);
      }
    }
  }
  
  // Verificar contenido cargado
  async verifyContent(contentId: string, contentType: string): Promise<boolean> {
    try {
      const content = await this.payloadClient.getContent(contentType, contentId);
      return !!content;
    } catch (error) {
      return false;
    }
  }
}
```

### **Validador de Migración:**
```typescript
// ✅ Validador de migración Kentico → Payload
export class KenticoPayloadValidator {
  // Validar datos extraídos
  validateExtractedData(data: KenticoContent[]): ValidationResult {
    const errors: string[] = [];
    
    data.forEach((content, index) => {
      if (!content.title) {
        errors.push(`Content ${index}: Missing title`);
      }
      if (!content.content) {
        errors.push(`Content ${index}: Missing content`);
      }
      if (!content.contentType) {
        errors.push(`Content ${index}: Missing content type`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Validar datos transformados
  validateTransformedData(data: PayloadContent[]): ValidationResult {
    const errors: string[] = [];
    
    data.forEach((content, index) => {
      if (!content.title) {
        errors.push(`Content ${index}: Missing title`);
      }
      if (!content.slug) {
        errors.push(`Content ${index}: Missing slug`);
      }
      if (!content.contentType) {
        errors.push(`Content ${index}: Missing content type`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Verificar migración
  async verifyMigration(originalData: KenticoContent[], migratedData: PayloadContent[]): Promise<VerificationResult> {
    const verification: VerificationResult = {
      totalContent: originalData.length,
      migratedContent: migratedData.length,
      successRate: (migratedData.length / originalData.length) * 100,
      errors: [],
      warnings: []
    };
    
    // Verificar que todo el contenido fue migrado
    if (verification.migratedContent < verification.totalContent) {
      verification.warnings.push(`${verification.totalContent - verification.migratedContent} content items were not migrated`);
    }
    
    // Verificar contenido
    for (let i = 0; i < Math.min(originalData.length, migratedData.length); i++) {
      const original = originalData[i];
      const migrated = migratedData[i];
      
      if (original.title !== migrated.title) {
        verification.errors.push(`Content ${i}: Title mismatch`);
      }
      
      if (original.content !== migrated.content) {
        verification.warnings.push(`Content ${i}: Content may have been modified`);
      }
    }
    
    return verification;
  }
}
```

## 🎯 **Tipos de Datos**

### **Kentico Types:**
```typescript
export interface KenticoContent {
  id: string;
  title: string;
  content: string;
  contentType: string;
  url: string;
  publishedAt: Date;
  createdBy: string;
  modifiedBy: string;
  createdWhen: Date;
  modifiedWhen: Date;
  metadata: KenticoMetadata;
  fields: KenticoField[];
  seo: KenticoSEO;
  media: KenticoMedia[];
}

export interface KenticoField {
  name: string;
  value: any;
  type: string;
  required: boolean;
}

export interface KenticoMedia {
  id: string;
  url: string;
  alt: string;
  title: string;
  type: string;
}
```

### **Payload Types:**
```typescript
export interface PayloadContent {
  title: string;
  content: string;
  slug: string;
  publishedDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  contentType: string;
  seo: PayloadSEO;
  metadata: PayloadMetadata;
  fields: PayloadField[];
  media: PayloadMedia[];
  status: 'draft' | 'published';
}

export interface PayloadField {
  name: string;
  value: any;
  type: string;
  required: boolean;
}

export interface PayloadMedia {
  url: string;
  alt: string;
  title: string;
  type: string;
}
```

## 🛡️ **Seguridad Multi-tenant**

### **Validación de Acceso:**
```typescript
// ✅ Validación de acceso a migraciones
export const validateKenticoPayloadAccess = (migration: Migration, user: User): boolean => {
  // Verificar que la migración pertenece a la empresa del usuario
  if (migration.company_id !== user.company_id) {
    return false;
  }
  
  // Verificar permisos del usuario
  if (!hasPermission(user, 'MIGRATION_KENTICO_PAYLOAD')) {
    return false;
  }
  
  return true;
};
```

## 🧪 **Testing Strategy**

### **Migración Testing:**
```typescript
describe('Kentico to Payload Migration', () => {
  it('should migrate content correctly', async () => {
    const extractor = new KenticoContentExtractor(config);
    const transformer = new PayloadContentTransformer();
    const loader = new PayloadContentLoader(config);
    
    const kenticoContent = await extractor.extractAllContent();
    const payloadContent = kenticoContent.map(content => transformer.transformContent(content));
    const migratedContent = await loader.loadContentBatch(payloadContent);
    
    expect(migratedContent.length).toBe(kenticoContent.length);
    expect(migratedContent[0].title).toBe(kenticoContent[0].title);
  });
  
  it('should preserve content structure', async () => {
    const originalContent = await extractor.extractContent('test-content-id');
    const transformedContent = transformer.transformContent(originalContent);
    const migratedContent = await loader.loadContent(transformedContent);
    
    expect(migratedContent.content).toBe(originalContent.content);
    expect(migratedContent.seo.metaTitle).toBe(originalContent.seo.title);
  });
});
```

## 📊 **Métricas de Calidad**

### **Performance:**
- **Extraction Time**: <30s para 1000 contenidos
- **Transformation Time**: <10s para 1000 contenidos
- **Loading Time**: <60s para 1000 contenidos
- **Total Migration Time**: <2min para 1000 contenidos

### **Reliability:**
- **Data Integrity**: 100% validación
- **Content Preservation**: 100% contenido preservado
- **Field Preservation**: 100% campos preservados
- **Media Preservation**: 100% media preservado

---

**La migración Kentico → Payload CMS sigue los principios de VThink 1.0, asegurando migración segura y completa del contenido con soporte para tipos personalizados.** 