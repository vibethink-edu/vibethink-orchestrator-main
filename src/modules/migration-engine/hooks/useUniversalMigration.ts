import { useState, useCallback, useMemo } from 'react';
import { 
  UniversalMigrationConfig, 
  MigrationResult, 
  RollbackResult,
  MigrationTemplate,
  MigrationAnalytics
} from '../types/universal-migration';
import { UniversalMigrationService } from '../services/UniversalMigrationService';

/**
 * Hook Universal para Migraciones de Propósito General
 * 
 * Proporciona una interfaz unificada para gestionar migraciones
 * entre cualquier sistema compatible.
 */
export const useUniversalMigration = () => {
  const migrationService = useMemo(() => new UniversalMigrationService(), []);
  
  const [migrations, setMigrations] = useState<MigrationResult[]>([]);
  const [templates, setTemplates] = useState<MigrationTemplate[]>([]);
  const [analytics, setAnalytics] = useState<MigrationAnalytics | null>(null);
  const [currentMigration, setCurrentMigration] = useState<MigrationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ejecutar migración universal
   */
  const executeMigration = useCallback(async (config: UniversalMigrationConfig) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await migrationService.executeMigration(config);
      
      // Actualizar lista de migraciones
      setMigrations(prev => [result, ...prev]);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [migrationService]);

  /**
   * Ejecutar migración incremental
   */
  const executeIncrementalMigration = useCallback(async (
    config: UniversalMigrationConfig, 
    lastSyncDate: Date
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await migrationService.executeIncrementalMigration(config, lastSyncDate);
      
      // Actualizar lista de migraciones
      setMigrations(prev => [result, ...prev]);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [migrationService]);

  /**
   * Ejecutar migración programada
   */
  const executeScheduledMigration = useCallback(async (config: UniversalMigrationConfig) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await migrationService.executeScheduledMigration(config);
      
      // Actualizar lista de migraciones
      setMigrations(prev => [result, ...prev]);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [migrationService]);

  /**
   * Rollback de migración
   */
  const rollbackMigration = useCallback(async (migrationId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await migrationService.rollbackMigration(migrationId);
      
      // Actualizar migración en la lista
      setMigrations(prev => prev.map(migration => 
        migration.id === migrationId 
          ? { ...migration, status: 'rolledback' as const }
          : migration
      ));
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [migrationService]);

  /**
   * Cargar plantillas de migración
   */
  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const templatesList = await migrationService.getMigrationTemplates();
      setTemplates(templatesList);
      
      return templatesList;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [migrationService]);

  /**
   * Crear migración desde plantilla
   */
  const createMigrationFromTemplate = useCallback(async (
    templateId: string,
    config: Partial<UniversalMigrationConfig>
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const migrationConfig = await migrationService.createMigrationFromTemplate(templateId, config);
      
      return migrationConfig;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [migrationService]);

  /**
   * Cargar analytics de migraciones
   */
  const loadAnalytics = useCallback(async (companyId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const analyticsData = await migrationService.getMigrationAnalytics(companyId);
      setAnalytics(analyticsData);
      
      return analyticsData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [migrationService]);

  /**
   * Validar configuración de migración
   */
  const validateMigrationConfig = useCallback(async (config: UniversalMigrationConfig) => {
    try {
      setError(null);
      
      // Validaciones básicas
      if (!config.source.type) {
        throw new Error('Source system type is required');
      }
      
      if (!config.target.type) {
        throw new Error('Target system type is required');
      }
      
      if (!config.source.config.url) {
        throw new Error('Source URL is required');
      }
      
      if (!config.target.config.url) {
        throw new Error('Target URL is required');
      }
      
      // Validar credenciales
      if (!config.source.config.credentials) {
        throw new Error('Source credentials are required');
      }
      
      if (!config.target.config.credentials) {
        throw new Error('Target credentials are required');
      }
      
      // Validaciones específicas para Kentico
      if (config.source.type === 'kentico') {
        await validateKenticoConfig(config);
      }
      
      if (config.source.type === 'kentico-xperience') {
        await validateKenticoXperienceConfig(config);
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Validar configuración de Kentico tradicional (v9-12)
   */
  const validateKenticoConfig = useCallback(async (config: UniversalMigrationConfig) => {
    const validVersions = ['v9', 'v10', 'v11', 'v12'];
    const version = config.source.version;
    
    if (!validVersions.includes(version)) {
      throw new Error(`Invalid Kentico version: ${version}. Supported versions: ${validVersions.join(', ')}`);
    }
    
    // Validar configuración específica para versiones antiguas
    if (['v9', 'v10'].includes(version)) {
      console.warn('Legacy API recommended for Kentico v9 and v10');
    }
  }, []);

  /**
   * Validar configuración de Kentico Xperience (v13+)
   */
  const validateKenticoXperienceConfig = useCallback(async (config: UniversalMigrationConfig) => {
    const validVersions = ['v13', 'v14', 'v15', 'v16', 'v17', 'v18'];
    const version = config.source.version;
    
    if (!validVersions.includes(version)) {
      throw new Error(`Invalid Kentico Xperience version: ${version}. Supported versions: ${validVersions.join(', ')}`);
    }
    
    // Validar que use REST API o GraphQL
    const sourceConfig = config.source.config as any;
    if (!sourceConfig.useRESTAPI && !sourceConfig.useGraphQL) {
      throw new Error('Kentico Xperience requires REST API or GraphQL configuration');
    }
  }, []);

  /**
   * Obtener sistemas soportados
   */
  const getSupportedSystems = useCallback(() => {
    return {
      sources: [
        // Kentico diferenciado por versión
        { type: 'kentico', name: 'Kentico CMS (Traditional)', versions: ['v9', 'v10', 'v11', 'v12'], description: 'Kentico tradicional con API legacy/moderna' },
        { type: 'kentico-xperience', name: 'Kentico Xperience', versions: ['v13', 'v14', 'v15', 'v16', 'v17', 'v18'], description: 'Kentico Xperience con REST API/GraphQL' },
        { type: 'wordpress', name: 'WordPress', versions: ['5.x', '6.x'] },
        { type: 'drupal', name: 'Drupal', versions: ['8.x', '9.x', '10.x'] },
        { type: 'joomla', name: 'Joomla', versions: ['3.x', '4.x'] },
        { type: 'shopify', name: 'Shopify', versions: ['2023-01', '2023-04', '2023-07'] },
        { type: 'magento', name: 'Magento', versions: ['2.4.x'] },
        { type: 'prestashop', name: 'PrestaShop', versions: ['1.7.x', '8.x'] },
        { type: 'squarespace', name: 'Squarespace', versions: ['7.1'] },
        { type: 'wix', name: 'Wix', versions: ['2023'] }
      ],
      targets: [
        { type: 'strapi', name: 'Strapi CMS', versions: ['4.x'] },
        { type: 'payload', name: 'Payload CMS', versions: ['2.x'] },
        { type: 'supabase', name: 'Supabase', versions: ['2023'] },
        { type: 'wordpress', name: 'WordPress', versions: ['6.x'] },
        { type: 'drupal', name: 'Drupal', versions: ['10.x'] }
      ]
    };
  }, []);

  /**
   * Obtener tipos de contenido soportados
   */
  const getSupportedContentTypes = useCallback((systemType: string) => {
    const contentTypeMap: Record<string, string[]> = {
      // Kentico tradicional
      kentico: ['pages', 'articles', 'blogs', 'products', 'services', 'events', 'forms', 'newsletters'],
      // Kentico Xperience
      'kentico-xperience': [
        'pages', 'articles', 'blogs', 'products', 'services', 'events', 'forms', 'newsletters',
        'personalization', 'ai-tests', 'content-staging', 'marketing-automation', 'workflows'
      ],
      wordpress: ['posts', 'pages', 'products', 'custom-post-types'],
      drupal: ['nodes', 'articles', 'pages', 'products'],
      joomla: ['articles', 'categories', 'products'],
      shopify: ['products', 'collections', 'pages', 'blogs'],
      magento: ['products', 'categories', 'pages', 'cms-blocks'],
      prestashop: ['products', 'categories', 'cms-pages'],
      squarespace: ['pages', 'blogs', 'products'],
      wix: ['pages', 'blogs', 'products'],
      strapi: ['pages', 'articles', 'products', 'services'],
      payload: ['pages', 'posts', 'products', 'services'],
      supabase: ['pages', 'articles', 'products', 'services']
    };
    
    return contentTypeMap[systemType] || [];
  }, []);

  /**
   * Obtener opciones de migración específicas por sistema
   */
  const getMigrationOptions = useCallback((sourceType?: string) => {
    const baseOptions = {
      incremental: {
        label: 'Incremental Migration',
        description: 'Only migrate content that has changed since last sync',
        type: 'boolean'
      },
      validateOnly: {
        label: 'Validate Only',
        description: 'Validate data without performing actual migration',
        type: 'boolean'
      },
      dryRun: {
        label: 'Dry Run',
        description: 'Simulate migration without making changes',
        type: 'boolean'
      },
      preserveIds: {
        label: 'Preserve IDs',
        description: 'Keep original content IDs when possible',
        type: 'boolean'
      },
      preserveTimestamps: {
        label: 'Preserve Timestamps',
        description: 'Keep original creation and modification dates',
        type: 'boolean'
      },
      includeMedia: {
        label: 'Include Media',
        description: 'Migrate media files and attachments',
        type: 'boolean'
      },
      includeMetadata: {
        label: 'Include Metadata',
        description: 'Migrate custom metadata and fields',
        type: 'boolean'
      },
      includeSEO: {
        label: 'Include SEO',
        description: 'Migrate SEO data and meta tags',
        type: 'boolean'
      },
      includeRelationships: {
        label: 'Include Relationships',
        description: 'Preserve content relationships and links',
        type: 'boolean'
      },
      batchSize: {
        label: 'Batch Size',
        description: 'Number of items to process in each batch',
        type: 'number',
        min: 1,
        max: 1000,
        default: 100
      },
      concurrency: {
        label: 'Concurrency',
        description: 'Number of parallel operations',
        type: 'number',
        min: 1,
        max: 10,
        default: 3
      },
      timeout: {
        label: 'Timeout (seconds)',
        description: 'Maximum time for each operation',
        type: 'number',
        min: 30,
        max: 3600,
        default: 300
      },
      retryOnFailure: {
        label: 'Retry on Failure',
        description: 'Automatically retry failed operations',
        type: 'boolean'
      },
      maxRetries: {
        label: 'Max Retries',
        description: 'Maximum number of retry attempts',
        type: 'number',
        min: 0,
        max: 10,
        default: 3
      },
      rollbackOnFailure: {
        label: 'Rollback on Failure',
        description: 'Automatically rollback on migration failure',
        type: 'boolean'
      },
      notifyOnCompletion: {
        label: 'Notify on Completion',
        description: 'Send notification when migration completes',
        type: 'boolean'
      },
      notifyOnFailure: {
        label: 'Notify on Failure',
        description: 'Send notification when migration fails',
        type: 'boolean'
      }
    };

    // Opciones específicas para Kentico tradicional
    if (sourceType === 'kentico') {
      return {
        ...baseOptions,
        legacyApi: {
          label: 'Use Legacy API',
          description: 'Use legacy API for Kentico v9-10',
          type: 'boolean'
        },
        includeWorkflow: {
          label: 'Include Workflow',
          description: 'Migrate workflow data and states',
          type: 'boolean'
        },
        includeVersionHistory: {
          label: 'Include Version History',
          description: 'Migrate content version history',
          type: 'boolean'
        },
        includeUserData: {
          label: 'Include User Data',
          description: 'Migrate user accounts and permissions',
          type: 'boolean'
        }
      };
    }

    // Opciones específicas para Kentico Xperience
    if (sourceType === 'kentico-xperience') {
      return {
        ...baseOptions,
        useRESTAPI: {
          label: 'Use REST API',
          description: 'Use REST API for data extraction',
          type: 'boolean'
        },
        useGraphQL: {
          label: 'Use GraphQL',
          description: 'Use GraphQL for data extraction',
          type: 'boolean'
        },
        includePersonalization: {
          label: 'Include Personalization',
          description: 'Migrate personalization data',
          type: 'boolean'
        },
        includeAITest: {
          label: 'Include AI Tests',
          description: 'Migrate AI test data',
          type: 'boolean'
        },
        includeContentStaging: {
          label: 'Include Content Staging',
          description: 'Migrate content staging data',
          type: 'boolean'
        },
        includeMarketingAutomation: {
          label: 'Include Marketing Automation',
          description: 'Migrate marketing automation data',
          type: 'boolean'
        }
      };
    }

    return baseOptions;
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpiar migración actual
   */
  const clearCurrentMigration = useCallback(() => {
    setCurrentMigration(null);
  }, []);

  return {
    // Estado
    migrations,
    templates,
    analytics,
    currentMigration,
    loading,
    error,
    
    // Acciones principales
    executeMigration,
    executeIncrementalMigration,
    executeScheduledMigration,
    rollbackMigration,
    
    // Gestión de plantillas
    loadTemplates,
    createMigrationFromTemplate,
    
    // Analytics
    loadAnalytics,
    
    // Utilidades
    validateMigrationConfig,
    getSupportedSystems,
    getSupportedContentTypes,
    getMigrationOptions,
    clearError,
    clearCurrentMigration
  };
}; 