import { BaseLoader } from '../services/UniversalMigrationService';
import { UniversalContent, TargetConfig, MigrationOptions, RollbackResult } from '../types/universal-migration';

/**
 * Loader Específico para Strapi v4
 * 
 * Carga datos transformados de Kentico v12 a Strapi v4
 * con soporte para rollback y validación.
 */
export class StrapiV4Loader implements BaseLoader {
  
  /**
   * Cargar datos en Strapi v4
   */
  async load(
    data: UniversalContent[], 
    config: TargetConfig, 
    options: MigrationOptions
  ): Promise<UniversalContent[]> {
    
    console.log('📤 Cargando datos en Strapi v4...');
    
    try {
      // 1. Validar conexión con Strapi
      await this.validateStrapiConnection(config);
      
      // 2. Crear tipos de contenido si no existen
      await this.ensureContentTypes(data, config);
      
      // 3. Cargar datos por lotes
      const loadedData: UniversalContent[] = [];
      const batchSize = options.batchSize || 100;
      
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        console.log(`📦 Procesando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(data.length / batchSize)}`);
        
        const batchResults = await this.loadBatch(batch, config, options);
        loadedData.push(...batchResults);
        
        // Pausa entre lotes para evitar sobrecarga
        if (i + batchSize < data.length) {
          await this.delay(1000);
        }
      }
      
      console.log(`✅ Carga completada: ${loadedData.length} elementos cargados en Strapi v4`);
      
      return loadedData;
      
    } catch (error) {
      console.error('❌ Error cargando datos en Strapi v4:', error);
      throw new Error(`Strapi v4 loading failed: ${error.message}`);
    }
  }
  
  /**
   * Rollback de migración
   */
  async rollback(migration: any): Promise<RollbackResult> {
    console.log('🔄 Iniciando rollback de migración Strapi v4...');
    
    const startTime = Date.now();
    const rolledBackItems: any[] = [];
    const errors: any[] = [];
    const logs: any[] = [];
    
    try {
      // Obtener datos migrados para rollback
      const migratedData = await this.getMigratedData(migration);
      
      for (const item of migratedData) {
        try {
          await this.deleteStrapiContent(item.id, item.type, migration.targetConfig);
          rolledBackItems.push(item);
          
          logs.push({
            id: `log_${Date.now()}_${Math.random()}`,
            timestamp: new Date(),
            level: 'info',
            message: `Rolled back: ${item.type} - ${item.title}`,
            step: 'rollback',
            duration: 0
          });
          
        } catch (error) {
          errors.push({
            id: `error_${Date.now()}_${Math.random()}`,
            timestamp: new Date(),
            level: 'error',
            message: `Failed to rollback ${item.type} - ${item.title}: ${error.message}`,
            details: error,
            recoverable: false
          });
        }
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      return {
        id: `rollback_${Date.now()}_${Math.random()}`,
        migrationId: migration.id,
        status: errors.length === 0 ? 'completed' : 'failed',
        progress: 100,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
        rolledBackItems: rolledBackItems.length,
        errors,
        logs
      };
      
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      return {
        id: `rollback_${Date.now()}_${Math.random()}`,
        migrationId: migration.id,
        status: 'failed',
        progress: 0,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
        rolledBackItems: 0,
        errors: [{
          id: `error_${Date.now()}_${Math.random()}`,
          timestamp: new Date(),
          level: 'error',
          message: `Rollback failed: ${error.message}`,
          details: error,
          recoverable: false
        }],
        logs
      };
    }
  }
  
  /**
   * Validar conexión con Strapi
   */
  private async validateStrapiConnection(config: TargetConfig): Promise<void> {
    try {
      const response = await fetch(`${config.url}/api/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.credentials.token}`,
          'Content-Type': 'application/json'
        },
        timeout: config.timeout || 30000
      });
      
      if (!response.ok) {
        throw new Error(`Strapi connection failed: ${response.status} ${response.statusText}`);
      }
      
      console.log('✅ Conexión con Strapi v4 validada');
      
    } catch (error) {
      throw new Error(`Strapi v4 connection validation failed: ${error.message}`);
    }
  }
  
  /**
   * Asegurar que los tipos de contenido existen en Strapi
   */
  private async ensureContentTypes(data: UniversalContent[], config: TargetConfig): Promise<void> {
    console.log('🔧 Verificando tipos de contenido en Strapi...');
    
    const contentTypes = [...new Set(data.map(item => item.type))];
    
    for (const contentType of contentTypes) {
      try {
        await this.createContentTypeIfNotExists(contentType, config);
      } catch (error) {
        console.warn(`Warning: Could not create content type ${contentType}:`, error);
      }
    }
  }
  
  /**
   * Crear tipo de contenido si no existe
   */
  private async createContentTypeIfNotExists(contentType: string, config: TargetConfig): Promise<void> {
    try {
      // Verificar si el tipo de contenido existe
      const response = await fetch(`${config.url}/api/content-type-builder/content-types/${contentType}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.credentials.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 404) {
        // Crear tipo de contenido
        await this.createContentType(contentType, config);
      }
      
    } catch (error) {
      console.warn(`Could not verify content type ${contentType}:`, error);
    }
  }
  
  /**
   * Crear tipo de contenido en Strapi
   */
  private async createContentType(contentType: string, config: TargetConfig): Promise<void> {
    const contentTypeSchema = this.getContentTypeSchema(contentType);
    
    const response = await fetch(`${config.url}/api/content-type-builder/content-types`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.credentials.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contentType: {
          name: contentType,
          kind: 'collectionType',
          attributes: contentTypeSchema.attributes
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create content type ${contentType}: ${response.status}`);
    }
    
    console.log(`✅ Content type ${contentType} created in Strapi`);
  }
  
  /**
   * Obtener esquema de tipo de contenido
   */
  private getContentTypeSchema(contentType: string): any {
    const schemas: Record<string, any> = {
      'pages': {
        attributes: {
          title: { type: 'string', required: true },
          content: { type: 'richtext' },
          slug: { type: 'string', unique: true },
          seo: { type: 'component', component: 'shared.seo' },
          metadata: { type: 'json' }
        }
      },
      'articles': {
        attributes: {
          title: { type: 'string', required: true },
          content: { type: 'richtext' },
          slug: { type: 'string', unique: true },
          seo: { type: 'component', component: 'shared.seo' },
          metadata: { type: 'json' }
        }
      },
      'blogs': {
        attributes: {
          title: { type: 'string', required: true },
          content: { type: 'richtext' },
          slug: { type: 'string', unique: true },
          seo: { type: 'component', component: 'shared.seo' },
          metadata: { type: 'json' }
        }
      },
      'products': {
        attributes: {
          title: { type: 'string', required: true },
          description: { type: 'richtext' },
          price: { type: 'decimal' },
          sku: { type: 'string', unique: true },
          stock: { type: 'integer' },
          slug: { type: 'string', unique: true },
          metadata: { type: 'json' }
        }
      },
      'services': {
        attributes: {
          title: { type: 'string', required: true },
          description: { type: 'richtext' },
          price: { type: 'decimal' },
          duration: { type: 'string' },
          slug: { type: 'string', unique: true },
          metadata: { type: 'json' }
        }
      },
      'events': {
        attributes: {
          title: { type: 'string', required: true },
          description: { type: 'richtext' },
          startDate: { type: 'datetime' },
          endDate: { type: 'datetime' },
          location: { type: 'string' },
          slug: { type: 'string', unique: true },
          metadata: { type: 'json' }
        }
      },
      'forms': {
        attributes: {
          title: { type: 'string', required: true },
          description: { type: 'richtext' },
          fields: { type: 'json' },
          slug: { type: 'string', unique: true },
          metadata: { type: 'json' }
        }
      },
      'newsletters': {
        attributes: {
          title: { type: 'string', required: true },
          content: { type: 'richtext' },
          subject: { type: 'string' },
          recipients: { type: 'json' },
          slug: { type: 'string', unique: true },
          metadata: { type: 'json' }
        }
      }
    };
    
    return schemas[contentType] || {
      attributes: {
        title: { type: 'string', required: true },
        content: { type: 'richtext' },
        slug: { type: 'string', unique: true },
        metadata: { type: 'json' }
      }
    };
  }
  
  /**
   * Cargar lote de datos
   */
  private async loadBatch(
    batch: UniversalContent[], 
    config: TargetConfig, 
    options: MigrationOptions
  ): Promise<UniversalContent[]> {
    
    const loadedItems: UniversalContent[] = [];
    
    for (const item of batch) {
      try {
        const loadedItem = await this.loadSingleItem(item, config, options);
        loadedItems.push(loadedItem);
        
        // Log progreso
        console.log(`✅ Loaded: ${item.type} - ${item.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to load ${item.type} - ${item.title}:`, error);
        
        // Si rollbackOnFailure está habilitado, lanzar error
        if (options.rollbackOnFailure) {
          throw error;
        }
      }
    }
    
    return loadedItems;
  }
  
  /**
   * Cargar un elemento individual
   */
  private async loadSingleItem(
    item: UniversalContent, 
    config: TargetConfig, 
    options: MigrationOptions
  ): Promise<UniversalContent> {
    
    // Preparar datos para Strapi
    const strapiData = this.prepareStrapiData(item, options);
    
    // Determinar endpoint basado en tipo de contenido
    const endpoint = this.getStrapiEndpoint(item.type, config.url);
    
    // Realizar request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.credentials.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(strapiData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to load ${item.type}: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Actualizar item con datos de Strapi
    return {
      ...item,
      id: responseData.data.id,
      metadata: {
        ...item.metadata,
        strapiId: responseData.data.id,
        strapiCreatedAt: responseData.data.attributes.createdAt,
        strapiUpdatedAt: responseData.data.attributes.updatedAt
      }
    };
  }
  
  /**
   * Preparar datos para Strapi
   */
  private prepareStrapiData(item: UniversalContent, options: MigrationOptions): any {
    const data: any = {
      data: {
        title: item.title,
        content: item.content,
        slug: item.slug,
        publishedAt: item.status === 'published' ? item.publishedAt : null
      }
    };
    
    // Agregar campos específicos por tipo
    if (item.type === 'products') {
      data.data.price = item.metadata?.product?.price || 0;
      data.data.sku = item.metadata?.product?.sku || '';
      data.data.stock = item.metadata?.product?.stock || 0;
    }
    
    if (item.type === 'events') {
      data.data.startDate = item.metadata?.event?.startDate;
      data.data.endDate = item.metadata?.event?.endDate;
      data.data.location = item.metadata?.event?.location;
    }
    
    if (item.type === 'forms') {
      data.data.fields = item.metadata?.form?.fields || [];
    }
    
    if (item.type === 'newsletters') {
      data.data.subject = item.metadata?.newsletter?.subject || '';
      data.data.recipients = item.metadata?.newsletter?.recipients || [];
    }
    
    // Agregar SEO si está habilitado
    if (options.includeSEO && item.seo) {
      data.data.seo = {
        title: item.seo.title,
        description: item.seo.description,
        keywords: item.seo.keywords,
        canonicalUrl: item.seo.canonicalUrl,
        ogTitle: item.seo.ogTitle,
        ogDescription: item.seo.ogDescription,
        ogImage: item.seo.ogImage,
        twitterCard: item.seo.twitterCard,
        metaRobots: item.seo.metaRobots
      };
    }
    
    // Agregar metadata si está habilitado
    if (options.includeMetadata) {
      data.data.metadata = item.metadata;
    }
    
    // Agregar campos personalizados
    if (Object.keys(item.customFields).length > 0) {
      Object.assign(data.data, item.customFields);
    }
    
    return data;
  }
  
  /**
   * Obtener endpoint de Strapi
   */
  private getStrapiEndpoint(contentType: string, baseUrl: string): string {
    return `${baseUrl}/api/${contentType}`;
  }
  
  /**
   * Eliminar contenido de Strapi (para rollback)
   */
  private async deleteStrapiContent(id: string, contentType: string, config: TargetConfig): Promise<void> {
    const endpoint = `${config.url}/api/${contentType}/${id}`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${config.credentials.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete ${contentType} ${id}: ${response.status}`);
    }
  }
  
  /**
   * Obtener datos migrados (para rollback)
   */
  private async getMigratedData(migration: any): Promise<any[]> {
    // Implementar lógica para obtener datos migrados
    // Esto dependería de cómo se almacenan los datos de migración
    return [];
  }
  
  /**
   * Delay entre operaciones
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 