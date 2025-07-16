import { BaseExtractor } from '../services/UniversalMigrationService';
import { KenticoConfig, UniversalContent, MigrationFilters } from '../types/universal-migration';

/**
 * Extractor Específico para Kentico v12
 * 
 * Características de Kentico v12:
 * - API REST moderna
 * - Workflow avanzado
 * - Versionado de contenido
 * - Personalización
 * - SEO avanzado
 * - Media management
 * - User management
 * - Formularios
 * - Newsletter
 * - Eventos
 */
export class KenticoV12Extractor implements BaseExtractor {
  
  /**
   * Extraer contenido de Kentico v12
   */
  async extract(
    config: KenticoConfig, 
    contentTypes?: string[], 
    filters?: MigrationFilters
  ): Promise<UniversalContent[]> {
    
    console.log(`🚀 Iniciando extracción de Kentico v12 desde: ${config.url}`);
    
    try {
      // 1. Validar conexión
      await this.validateConnection(config);
      
      // 2. Obtener tipos de contenido disponibles
      const availableContentTypes = await this.getAvailableContentTypes(config);
      
      // 3. Filtrar tipos de contenido solicitados
      const typesToExtract = contentTypes || availableContentTypes;
      
      // 4. Extraer contenido por tipo
      const extractedContent: UniversalContent[] = [];
      
      for (const contentType of typesToExtract) {
        console.log(`📦 Extrayendo tipo: ${contentType}`);
        
        const content = await this.extractContentType(config, contentType, filters);
        extractedContent.push(...content);
      }
      
      // 5. Extraer media files
      if (config.includeMedia) {
        const mediaFiles = await this.extractMediaFiles(config);
        extractedContent.push(...mediaFiles);
      }
      
      // 6. Extraer usuarios (si se solicita)
      if (config.includeUserData) {
        const users = await this.extractUsers(config);
        extractedContent.push(...users);
      }
      
      // 7. Extraer workflow data (si se solicita)
      if (config.includeWorkflow) {
        const workflowData = await this.extractWorkflowData(config);
        extractedContent.push(...workflowData);
      }
      
      // 8. Extraer version history (si se solicita)
      if (config.includeVersionHistory) {
        const versionHistory = await this.extractVersionHistory(config);
        extractedContent.push(...versionHistory);
      }
      
      console.log(`✅ Extracción completada: ${extractedContent.length} elementos`);
      
      return extractedContent;
      
    } catch (error) {
      console.error('❌ Error en extracción de Kentico v12:', error);
      throw new Error(`Kentico v12 extraction failed: ${error.message}`);
    }
  }
  
  /**
   * Validar conexión con Kentico v12
   */
  private async validateConnection(config: KenticoConfig): Promise<void> {
    try {
      const response = await fetch(`${config.url}/api/kentico/v12/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${config.credentials.username}:${config.credentials.password}`)}`,
          'Content-Type': 'application/json'
        },
        timeout: config.timeout || 30000
      });
      
      if (!response.ok) {
        throw new Error(`Connection failed: ${response.status} ${response.statusText}`);
      }
      
      console.log('✅ Conexión con Kentico v12 validada');
      
    } catch (error) {
      throw new Error(`Kentico v12 connection validation failed: ${error.message}`);
    }
  }
  
  /**
   * Obtener tipos de contenido disponibles en Kentico v12
   */
  private async getAvailableContentTypes(config: KenticoConfig): Promise<string[]> {
    try {
      const response = await fetch(`${config.url}/api/kentico/v12/content-types`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${config.credentials.username}:${config.credentials.password}`)}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get content types: ${response.status}`);
      }
      
      const data = await response.json();
      return data.contentTypes || [];
      
    } catch (error) {
      console.error('Error getting content types:', error);
      // Retornar tipos por defecto si falla
      return ['pages', 'articles', 'blogs', 'products', 'services', 'events', 'forms', 'newsletters'];
    }
  }
  
  /**
   * Extraer contenido por tipo específico
   */
  private async extractContentType(
    config: KenticoConfig, 
    contentType: string, 
    filters?: MigrationFilters
  ): Promise<UniversalContent[]> {
    
    const content: UniversalContent[] = [];
    let page = 1;
    const pageSize = 100;
    
    while (true) {
      try {
        // Construir URL con filtros
        const url = new URL(`${config.url}/api/kentico/v12/content/${contentType}`);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('pageSize', pageSize.toString());
        
        // Aplicar filtros de fecha
        if (filters?.dateRange) {
          url.searchParams.set('dateFrom', filters.dateRange.start.toISOString());
          url.searchParams.set('dateTo', filters.dateRange.end.toISOString());
        }
        
        // Aplicar filtros de estado
        if (filters?.status) {
          url.searchParams.set('status', filters.status.join(','));
        }
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${btoa(`${config.credentials.username}:${config.credentials.password}`)}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${contentType}: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transformar datos de Kentico v12 a formato universal
        const transformedContent = data.items.map((item: any) => 
          this.transformKenticoContent(item, contentType)
        );
        
        content.push(...transformedContent);
        
        // Verificar si hay más páginas
        if (data.items.length < pageSize) {
          break;
        }
        
        page++;
        
      } catch (error) {
        console.error(`Error extracting ${contentType}:`, error);
        break;
      }
    }
    
    return content;
  }
  
  /**
   * Transformar contenido de Kentico v12 a formato universal
   */
  private transformKenticoContent(item: any, contentType: string): UniversalContent {
    return {
      id: item.DocumentID || item.NodeID || item.ID,
      type: contentType,
      title: item.DocumentName || item.Title || item.Name,
      content: item.DocumentContent || item.Content || item.Body,
      slug: item.DocumentUrlPath || item.UrlPath || item.Slug,
      status: this.mapKenticoStatus(item.DocumentWorkflowStepID || item.Status),
      publishedAt: item.DocumentPublishedWhen ? new Date(item.DocumentPublishedWhen) : undefined,
      createdAt: item.DocumentCreatedWhen ? new Date(item.DocumentCreatedWhen) : new Date(),
      updatedAt: item.DocumentModifiedWhen ? new Date(item.DocumentModifiedWhen) : new Date(),
      createdBy: item.DocumentCreatedByUserName || item.CreatedBy || 'Unknown',
      updatedBy: item.DocumentModifiedByUserName || item.ModifiedBy || 'Unknown',
      metadata: {
        // Metadata específica de Kentico v12
        nodeId: item.NodeID,
        documentId: item.DocumentID,
        culture: item.DocumentCulture,
        siteId: item.DocumentSiteID,
        workflowStepId: item.DocumentWorkflowStepID,
        workflowStepName: item.DocumentWorkflowStepName,
        versionHistoryId: item.DocumentVersionHistoryID,
        isPublished: item.DocumentIsPublished,
        isArchived: item.DocumentIsArchived,
        isSecured: item.DocumentIsSecured,
        requiresAuthentication: item.DocumentRequiresAuthentication,
        // Campos personalizados
        customFields: item.CustomFields || {},
        // SEO data
        seoTitle: item.DocumentPageTitle,
        seoDescription: item.DocumentPageDescription,
        seoKeywords: item.DocumentPageKeywords,
        // Media references
        mediaFiles: item.DocumentMediaFiles || [],
        // Relationships
        relationships: item.DocumentRelationships || []
      },
      seo: {
        title: item.DocumentPageTitle,
        description: item.DocumentPageDescription,
        keywords: item.DocumentPageKeywords ? item.DocumentPageKeywords.split(',') : [],
        canonicalUrl: item.DocumentPageUrl,
        ogTitle: item.DocumentPageTitle,
        ogDescription: item.DocumentPageDescription,
        ogImage: item.DocumentPageImage,
        twitterCard: 'summary',
        metaRobots: item.DocumentPageRobots || 'index,follow'
      },
      media: this.extractMediaFromContent(item),
      relationships: this.extractRelationshipsFromContent(item),
      customFields: item.CustomFields || {}
    };
  }
  
  /**
   * Mapear estado de Kentico v12 a formato universal
   */
  private mapKenticoStatus(workflowStepId: number): 'draft' | 'published' | 'archived' {
    // Mapeo de workflow steps de Kentico v12
    const publishedSteps = [1, 2, 3]; // Published, Approved, etc.
    const archivedSteps = [4, 5]; // Archived, Deleted, etc.
    
    if (archivedSteps.includes(workflowStepId)) {
      return 'archived';
    } else if (publishedSteps.includes(workflowStepId)) {
      return 'published';
    } else {
      return 'draft';
    }
  }
  
  /**
   * Extraer media files del contenido
   */
  private extractMediaFromContent(item: any): any[] {
    const media: any[] = [];
    
    // Extraer media de campos específicos
    if (item.DocumentMediaFiles) {
      media.push(...item.DocumentMediaFiles);
    }
    
    // Extraer media de contenido HTML
    if (item.DocumentContent) {
      const mediaMatches = item.DocumentContent.match(/<img[^>]+src="([^"]+)"/g);
      if (mediaMatches) {
        mediaMatches.forEach((match: string) => {
          const srcMatch = match.match(/src="([^"]+)"/);
          if (srcMatch) {
            media.push({
              id: `media_${Date.now()}_${Math.random()}`,
              url: srcMatch[1],
              alt: 'Extracted from content',
              title: 'Extracted from content',
              type: 'image',
              size: 0,
              metadata: {}
            });
          }
        });
      }
    }
    
    return media;
  }
  
  /**
   * Extraer relaciones del contenido
   */
  private extractRelationshipsFromContent(item: any): any[] {
    const relationships: any[] = [];
    
    if (item.DocumentRelationships) {
      item.DocumentRelationships.forEach((rel: any) => {
        relationships.push({
          id: rel.RelationshipID,
          type: rel.RelationshipType,
          targetId: rel.RelatedDocumentID,
          targetType: rel.RelatedDocumentType,
          metadata: {
            relationshipName: rel.RelationshipName,
            relationshipOrder: rel.RelationshipOrder
          }
        });
      });
    }
    
    return relationships;
  }
  
  /**
   * Extraer archivos de media
   */
  private async extractMediaFiles(config: KenticoConfig): Promise<UniversalContent[]> {
    console.log('📁 Extrayendo archivos de media...');
    
    try {
      const response = await fetch(`${config.url}/api/kentico/v12/media`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${config.credentials.username}:${config.credentials.password}`)}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.media.map((media: any) => ({
        id: media.MediaFileID,
        type: 'media',
        title: media.MediaFileName,
        content: '', // Media files don't have content
        slug: media.MediaFilePath,
        status: 'published',
        publishedAt: media.MediaFileCreatedWhen ? new Date(media.MediaFileCreatedWhen) : new Date(),
        createdAt: media.MediaFileCreatedWhen ? new Date(media.MediaFileCreatedWhen) : new Date(),
        updatedAt: media.MediaFileModifiedWhen ? new Date(media.MediaFileModifiedWhen) : new Date(),
        createdBy: media.MediaFileCreatedByUserName || 'Unknown',
        updatedBy: media.MediaFileModifiedByUserName || 'Unknown',
        metadata: {
          mediaFileId: media.MediaFileID,
          mediaFileGUID: media.MediaFileGUID,
          mediaFileSiteID: media.MediaFileSiteID,
          mediaFileSize: media.MediaFileSize,
          mediaFileExtension: media.MediaFileExtension,
          mediaFileMimeType: media.MediaFileMimeType,
          mediaFileImageWidth: media.MediaFileImageWidth,
          mediaFileImageHeight: media.MediaFileImageHeight
        },
        seo: {
          title: media.MediaFileName,
          description: media.MediaFileDescription || '',
          keywords: []
        },
        media: [{
          id: media.MediaFileID,
          url: `${config.url}${media.MediaFilePath}`,
          alt: media.MediaFileTitle || media.MediaFileName,
          title: media.MediaFileName,
          type: media.MediaFileMimeType,
          size: media.MediaFileSize,
          width: media.MediaFileImageWidth,
          height: media.MediaFileImageHeight,
          metadata: {}
        }],
        relationships: [],
        customFields: {}
      }));
      
    } catch (error) {
      console.error('Error extracting media files:', error);
      return [];
    }
  }
  
  /**
   * Extraer usuarios
   */
  private async extractUsers(config: KenticoConfig): Promise<UniversalContent[]> {
    console.log('👥 Extrayendo usuarios...');
    
    try {
      const response = await fetch(`${config.url}/api/kentico/v12/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${config.credentials.username}:${config.credentials.password}`)}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.users.map((user: any) => ({
        id: user.UserID,
        type: 'user',
        title: `${user.UserFirstName} ${user.UserLastName}`,
        content: '', // Users don't have content
        slug: user.UserName,
        status: user.UserEnabled ? 'published' : 'archived',
        publishedAt: user.UserCreatedWhen ? new Date(user.UserCreatedWhen) : new Date(),
        createdAt: user.UserCreatedWhen ? new Date(user.UserCreatedWhen) : new Date(),
        updatedAt: user.UserModifiedWhen ? new Date(user.UserModifiedWhen) : new Date(),
        createdBy: 'System',
        updatedBy: 'System',
        metadata: {
          userId: user.UserID,
          userName: user.UserName,
          userEmail: user.UserEmail,
          userFirstName: user.UserFirstName,
          userLastName: user.UserLastName,
          userEnabled: user.UserEnabled,
          userPrivilegeLevel: user.UserPrivilegeLevel,
          userSiteID: user.UserSiteID
        },
        seo: {
          title: `${user.UserFirstName} ${user.UserLastName}`,
          description: '',
          keywords: []
        },
        media: [],
        relationships: [],
        customFields: {}
      }));
      
    } catch (error) {
      console.error('Error extracting users:', error);
      return [];
    }
  }
  
  /**
   * Extraer datos de workflow
   */
  private async extractWorkflowData(config: KenticoConfig): Promise<UniversalContent[]> {
    console.log('🔄 Extrayendo datos de workflow...');
    
    try {
      const response = await fetch(`${config.url}/api/kentico/v12/workflow`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${config.credentials.username}:${config.credentials.password}`)}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch workflow: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.workflows.map((workflow: any) => ({
        id: workflow.WorkflowID,
        type: 'workflow',
        title: workflow.WorkflowDisplayName,
        content: workflow.WorkflowDescription || '',
        slug: workflow.WorkflowName,
        status: 'published',
        publishedAt: workflow.WorkflowCreatedWhen ? new Date(workflow.WorkflowCreatedWhen) : new Date(),
        createdAt: workflow.WorkflowCreatedWhen ? new Date(workflow.WorkflowCreatedWhen) : new Date(),
        updatedAt: workflow.WorkflowModifiedWhen ? new Date(workflow.WorkflowModifiedWhen) : new Date(),
        createdBy: 'System',
        updatedBy: 'System',
        metadata: {
          workflowId: workflow.WorkflowID,
          workflowName: workflow.WorkflowName,
          workflowDisplayName: workflow.WorkflowDisplayName,
          workflowEnabled: workflow.WorkflowEnabled,
          workflowSteps: workflow.WorkflowSteps || []
        },
        seo: {
          title: workflow.WorkflowDisplayName,
          description: workflow.WorkflowDescription || '',
          keywords: []
        },
        media: [],
        relationships: [],
        customFields: {}
      }));
      
    } catch (error) {
      console.error('Error extracting workflow data:', error);
      return [];
    }
  }
  
  /**
   * Extraer historial de versiones
   */
  private async extractVersionHistory(config: KenticoConfig): Promise<UniversalContent[]> {
    console.log('📚 Extrayendo historial de versiones...');
    
    try {
      const response = await fetch(`${config.url}/api/kentico/v12/version-history`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${config.credentials.username}:${config.credentials.password}`)}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch version history: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.versions.map((version: any) => ({
        id: version.VersionHistoryID,
        type: 'version-history',
        title: `Version ${version.VersionNumber} - ${version.DocumentName}`,
        content: version.DocumentContent || '',
        slug: `version-${version.VersionHistoryID}`,
        status: 'archived',
        publishedAt: version.VersionCreatedWhen ? new Date(version.VersionCreatedWhen) : new Date(),
        createdAt: version.VersionCreatedWhen ? new Date(version.VersionCreatedWhen) : new Date(),
        updatedAt: version.VersionModifiedWhen ? new Date(version.VersionModifiedWhen) : new Date(),
        createdBy: version.VersionCreatedByUserName || 'Unknown',
        updatedBy: version.VersionModifiedByUserName || 'Unknown',
        metadata: {
          versionHistoryId: version.VersionHistoryID,
          versionNumber: version.VersionNumber,
          documentId: version.DocumentID,
          documentName: version.DocumentName,
          versionComment: version.VersionComment,
          versionWasPublished: version.VersionWasPublished
        },
        seo: {
          title: `Version ${version.VersionNumber} - ${version.DocumentName}`,
          description: version.VersionComment || '',
          keywords: []
        },
        media: [],
        relationships: [],
        customFields: {}
      }));
      
    } catch (error) {
      console.error('Error extracting version history:', error);
      return [];
    }
  }
} 