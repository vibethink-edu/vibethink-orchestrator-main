import { BaseTransformer } from '../services/UniversalMigrationService';
import { UniversalContent, TargetSystem, MigrationOptions } from '../types/universal-migration';

/**
 * Transformador Específico: Kentico v12 → Strapi v4
 * 
 * Convierte la estructura de datos de Kentico v12 al formato de Strapi v4
 * manteniendo la integridad de los datos y las relaciones.
 */
export class KenticoV12ToStrapiTransformer implements BaseTransformer {
  
  /**
   * Transformar contenido de Kentico v12 a Strapi v4
   */
  async transform(
    data: UniversalContent[], 
    target: TargetSystem, 
    options: MigrationOptions
  ): Promise<UniversalContent[]> {
    
    // TODO: log '🔄 Transformando datos de Kentico v12 a Strapi v4...'
    
    try {
      const transformedData: UniversalContent[] = [];
      
      for (const item of data) {
        const transformedItem = await this.transformContentItem(item, target, options);
        transformedData.push(transformedItem);
      }
      
      // TODO: log `✅ Transformación completada: ${transformedData.length} elementos`
      
      return transformedData;
      
    } catch (error) {
      // TODO: log '❌ Error en transformación Kentico v12 → Strapi:' error
      throw new Error(`Kentico v12 to Strapi transformation failed: ${error.message}`);
    }
  }
  
  /**
   * Transformar un elemento de contenido individual
   */
  private async transformContentItem(
    item: UniversalContent, 
    target: TargetSystem, 
    options: MigrationOptions
  ): Promise<UniversalContent> {
    
    // Mapeo de tipos de contenido de Kentico v12 a Strapi v4
    const contentTypeMapping = this.getContentTypeMapping(item.type);
    
    // Transformar campos básicos
    const transformedItem: UniversalContent = {
      id: options.preserveIds ? item.id : this.generateStrapiId(item.id),
      type: contentTypeMapping.strapiType,
      title: item.title,
      content: this.transformContent(item.content, item.type),
      slug: this.generateStrapiSlug(item.slug, item.title),
      status: this.mapKenticoStatusToStrapi(item.status),
      publishedAt: item.publishedAt,
      createdAt: options.preserveTimestamps ? item.createdAt : new Date(),
      updatedAt: options.preserveTimestamps ? item.updatedAt : new Date(),
      createdBy: item.createdBy,
      updatedBy: item.updatedBy,
      metadata: this.transformMetadata(item.metadata, item.type, options),
      seo: this.transformSEO(item.seo, options),
      media: await this.transformMedia(item.media, target, options),
      relationships: await this.transformRelationships(item.relationships, target, options),
      customFields: this.transformCustomFields(item.customFields, item.type)
    };
    
    return transformedItem;
  }
  
  /**
   * Obtener mapeo de tipos de contenido
   */
  private getContentTypeMapping(kenticoType: string): { strapiType: string; fieldMapping: any } {
    const mappings: Record<string, { strapiType: string; fieldMapping: any }> = {
      'pages': {
        strapiType: 'pages',
        fieldMapping: {
          'DocumentName': 'title',
          'DocumentContent': 'content',
          'DocumentPageTitle': 'seo.title',
          'DocumentPageDescription': 'seo.description',
          'DocumentPageKeywords': 'seo.keywords',
          'DocumentPageUrl': 'seo.canonicalUrl'
        }
      },
      'articles': {
        strapiType: 'articles',
        fieldMapping: {
          'DocumentName': 'title',
          'DocumentContent': 'content',
          'DocumentPageTitle': 'seo.title',
          'DocumentPageDescription': 'seo.description',
          'DocumentPageKeywords': 'seo.keywords'
        }
      },
      'blogs': {
        strapiType: 'blogs',
        fieldMapping: {
          'DocumentName': 'title',
          'DocumentContent': 'content',
          'DocumentPageTitle': 'seo.title',
          'DocumentPageDescription': 'seo.description'
        }
      },
      'products': {
        strapiType: 'products',
        fieldMapping: {
          'DocumentName': 'title',
          'DocumentContent': 'description',
          'ProductPrice': 'price',
          'ProductSKU': 'sku',
          'ProductStock': 'stock'
        }
      },
      'services': {
        strapiType: 'services',
        fieldMapping: {
          'DocumentName': 'title',
          'DocumentContent': 'description',
          'ServicePrice': 'price',
          'ServiceDuration': 'duration'
        }
      },
      'events': {
        strapiType: 'events',
        fieldMapping: {
          'DocumentName': 'title',
          'DocumentContent': 'description',
          'EventStartDate': 'startDate',
          'EventEndDate': 'endDate',
          'EventLocation': 'location'
        }
      },
      'forms': {
        strapiType: 'forms',
        fieldMapping: {
          'DocumentName': 'title',
          'DocumentContent': 'description',
          'FormFields': 'fields'
        }
      },
      'newsletters': {
        strapiType: 'newsletters',
        fieldMapping: {
          'DocumentName': 'title',
          'DocumentContent': 'content',
          'NewsletterSubject': 'subject',
          'NewsletterRecipients': 'recipients'
        }
      },
      'media': {
        strapiType: 'files',
        fieldMapping: {
          'MediaFileName': 'name',
          'MediaFilePath': 'url',
          'MediaFileSize': 'size',
          'MediaFileMimeType': 'mime'
        }
      },
      'user': {
        strapiType: 'users',
        fieldMapping: {
          'UserFirstName': 'firstName',
          'UserLastName': 'lastName',
          'UserEmail': 'email',
          'UserName': 'username'
        }
      }
    };
    
    return mappings[kenticoType] || {
      strapiType: 'pages',
      fieldMapping: {}
    };
  }
  
  /**
   * Transformar contenido HTML
   */
  private transformContent(content: string, contentType: string): string {
    if (!content) return '';
    
    // Limpiar HTML de Kentico v12
    let transformedContent = content;
    
    // Reemplazar tags específicos de Kentico
    transformedContent = transformedContent.replace(
      /<cms:([^>]+)>/g, 
      '<span class="kentico-tag">$1</span>'
    );
    
    // Convertir macros de Kentico
    transformedContent = transformedContent.replace(
      /{%\s*([^%]+)\s*%}/g,
      '{{ $1 }}'
    );
    
    // Limpiar atributos específicos de Kentico
    transformedContent = transformedContent.replace(
      /data-kentico="[^"]*"/g,
      ''
    );
    
    // Convertir URLs relativas a absolutas si es necesario
    if (contentType === 'media') {
      transformedContent = this.convertRelativeUrls(transformedContent);
    }
    
    return transformedContent;
  }
  
  /**
   * Convertir URLs relativas a absolutas
   */
  private convertRelativeUrls(content: string): string {
    // Implementar lógica de conversión de URLs
    return content.replace(
      /src="\/([^"]+)"/g,
      'src="/uploads/$1"'
    );
  }
  
  /**
   * Generar ID de Strapi
   */
  private generateStrapiId(kenticoId: string): string {
    // Strapi usa IDs numéricos o UUIDs
    return `strapi_${kenticoId}_${Date.now()}`;
  }
  
  /**
   * Generar slug de Strapi
   */
  private generateStrapiSlug(kenticoSlug: string, title: string): string {
    if (kenticoSlug) {
      return kenticoSlug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Generar slug desde el título
    return title
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  /**
   * Mapear estado de Kentico a Strapi
   */
  private mapKenticoStatusToStrapi(kenticoStatus: string): 'draft' | 'published' | 'archived' {
    const statusMapping: Record<string, 'draft' | 'published' | 'archived'> = {
      'draft': 'draft',
      'published': 'published',
      'archived': 'archived',
      'approved': 'published',
      'pending': 'draft',
      'rejected': 'draft'
    };
    
    return statusMapping[kenticoStatus] || 'draft';
  }
  
  /**
   * Transformar metadata
   */
  private transformMetadata(
    metadata: Record<string, any>, 
    contentType: string, 
    options: MigrationOptions
  ): Record<string, any> {
    const transformedMetadata: Record<string, any> = {
      // Metadata básica de Strapi
      strapiId: this.generateStrapiId(metadata.nodeId || metadata.documentId || ''),
      contentType: contentType,
      migratedFrom: 'kentico-v12',
      migrationDate: new Date().toISOString(),
      originalId: metadata.nodeId || metadata.documentId,
      originalCulture: metadata.culture,
      originalSiteId: metadata.siteId
    };
    
    // Preservar metadata específica de Kentico si se solicita
    if (options.includeMetadata) {
      transformedMetadata.kenticoMetadata = {
        workflowStepId: metadata.workflowStepId,
        workflowStepName: metadata.workflowStepName,
        versionHistoryId: metadata.versionHistoryId,
        isPublished: metadata.isPublished,
        isArchived: metadata.isArchived,
        isSecured: metadata.isSecured,
        requiresAuthentication: metadata.requiresAuthentication,
        customFields: metadata.customFields || {}
      };
    }
    
    // Metadata específica por tipo de contenido
    if (contentType === 'products') {
      transformedMetadata.product = {
        sku: metadata.sku,
        price: metadata.price,
        stock: metadata.stock,
        category: metadata.category
      };
    }
    
    if (contentType === 'events') {
      transformedMetadata.event = {
        startDate: metadata.startDate,
        endDate: metadata.endDate,
        location: metadata.location,
        organizer: metadata.organizer
      };
    }
    
    if (contentType === 'forms') {
      transformedMetadata.form = {
        fields: metadata.fields,
        submissions: metadata.submissions,
        notifications: metadata.notifications
      };
    }
    
    return transformedMetadata;
  }
  
  /**
   * Transformar SEO data
   */
  private transformSEO(
    seo: any, 
    options: MigrationOptions
  ): any {
    if (!options.includeSEO) {
      return {
        title: '',
        description: '',
        keywords: [],
        canonicalUrl: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterCard: 'summary',
        metaRobots: 'index,follow'
      };
    }
    
    return {
      title: seo.title || '',
      description: seo.description || '',
      keywords: Array.isArray(seo.keywords) ? seo.keywords : [],
      canonicalUrl: seo.canonicalUrl || '',
      ogTitle: seo.ogTitle || seo.title || '',
      ogDescription: seo.ogDescription || seo.description || '',
      ogImage: seo.ogImage || '',
      twitterCard: seo.twitterCard || 'summary',
      metaRobots: seo.metaRobots || 'index,follow'
    };
  }
  
  /**
   * Transformar media files
   */
  private async transformMedia(
    media: any[], 
    target: TargetSystem, 
    options: MigrationOptions
  ): Promise<any[]> {
    if (!options.includeMedia || !media.length) {
      return [];
    }
    
    return media.map(mediaItem => ({
      id: this.generateStrapiId(mediaItem.id),
      url: this.transformMediaUrl(mediaItem.url, target),
      alt: mediaItem.alt || mediaItem.title || '',
      title: mediaItem.title || '',
      type: mediaItem.type || 'image',
      size: mediaItem.size || 0,
      width: mediaItem.width,
      height: mediaItem.height,
      metadata: {
        originalId: mediaItem.id,
        migratedFrom: 'kentico-v12',
        originalUrl: mediaItem.url,
        mimeType: mediaItem.type,
        ...mediaItem.metadata
      }
    }));
  }
  
  /**
   * Transformar URL de media
   */
  private transformMediaUrl(originalUrl: string, target: TargetSystem): string {
    // Convertir URL de Kentico a Strapi
    if (originalUrl.startsWith('/')) {
      return `${target.config.url}/uploads${originalUrl}`;
    }
    
    return originalUrl;
  }
  
  /**
   * Transformar relaciones
   */
  private async transformRelationships(
    relationships: any[], 
    target: TargetSystem, 
    options: MigrationOptions
  ): Promise<any[]> {
    if (!options.includeRelationships || !relationships.length) {
      return [];
    }
    
    return relationships.map(relationship => ({
      id: this.generateStrapiId(relationship.id),
      type: this.mapRelationshipType(relationship.type),
      targetId: this.generateStrapiId(relationship.targetId),
      targetType: this.getContentTypeMapping(relationship.targetType).strapiType,
      metadata: {
        originalId: relationship.id,
        originalType: relationship.type,
        migratedFrom: 'kentico-v12',
        relationshipName: relationship.metadata?.relationshipName,
        relationshipOrder: relationship.metadata?.relationshipOrder,
        ...relationship.metadata
      }
    }));
  }
  
  /**
   * Mapear tipos de relación
   */
  private mapRelationshipType(kenticoType: string): string {
    const relationshipMapping: Record<string, string> = {
      'parent': 'parent',
      'child': 'child',
      'related': 'related',
      'sibling': 'sibling',
      'category': 'category',
      'tag': 'tag'
    };
    
    return relationshipMapping[kenticoType] || 'related';
  }
  
  /**
   * Transformar campos personalizados
   */
  private transformCustomFields(
    customFields: Record<string, any>, 
    contentType: string
  ): Record<string, any> {
    const transformedFields: Record<string, any> = {};
    
    // Mapear campos personalizados de Kentico a Strapi
    for (const [key, value] of Object.entries(customFields)) {
      const strapiKey = this.mapCustomFieldKey(key, contentType);
      transformedFields[strapiKey] = this.transformCustomFieldValue(value, key);
    }
    
    return transformedFields;
  }
  
  /**
   * Mapear clave de campo personalizado
   */
  private mapCustomFieldKey(kenticoKey: string, contentType: string): string {
    // Convertir camelCase de Kentico a snake_case de Strapi
    return kenticoKey
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }
  
  /**
   * Transformar valor de campo personalizado
   */
  private transformCustomFieldValue(value: any, key: string): any {
    // Manejar diferentes tipos de datos
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'number') {
      return value;
    }
    
    if (typeof value === 'boolean') {
      return value;
    }
    
    if (Array.isArray(value)) {
      return value.map(item => this.transformCustomFieldValue(item, key));
    }
    
    if (typeof value === 'object' && value !== null) {
      const transformed: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        transformed[this.mapCustomFieldKey(k, key)] = this.transformCustomFieldValue(v, k);
      }
      return transformed;
    }
    
    return value;
  }
} 