// Tipos Universales para Migración de Propósito General

export interface UniversalMigrationConfig {
  id: string;
  name: string;
  description?: string;
  source: SourceSystem;
  target: TargetSystem;
  options: MigrationOptions;
  schedule?: MigrationSchedule;
  companyId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SourceSystem {
  type: 'kentico' | 'kentico-xperience' | 'wordpress' | 'drupal' | 'joomla' | 'squarespace' | 'wix' | 'shopify' | 'magento' | 'prestashop' | 'custom';
  version?: string;
  config: SourceConfig;
  contentTypes?: string[];
  filters?: MigrationFilters;
}

export interface TargetSystem {
  type: 'strapi' | 'payload' | 'supabase' | 'wordpress' | 'drupal' | 'shopify' | 'magento' | 'custom';
  version?: string;
  config: TargetConfig;
  contentTypeMapping?: ContentTypeMapping;
}

export interface SourceConfig {
  url: string;
  credentials: Credentials;
  apiVersion?: string;
  customHeaders?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
}

export interface TargetConfig {
  url: string;
  credentials: Credentials;
  apiVersion?: string;
  customHeaders?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
}

export interface Credentials {
  type: 'basic' | 'token' | 'oauth' | 'api-key' | 'custom';
  username?: string;
  password?: string;
  token?: string;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  customAuth?: Record<string, any>;
}

export interface MigrationOptions {
  incremental?: boolean;
  lastSyncDate?: Date;
  validateOnly?: boolean;
  dryRun?: boolean;
  preserveIds?: boolean;
  preserveTimestamps?: boolean;
  includeMedia?: boolean;
  includeMetadata?: boolean;
  includeSEO?: boolean;
  includeRelationships?: boolean;
  batchSize?: number;
  concurrency?: number;
  timeout?: number;
  retryOnFailure?: boolean;
  maxRetries?: number;
  rollbackOnFailure?: boolean;
  notifyOnCompletion?: boolean;
  notifyOnFailure?: boolean;
  customTransformers?: CustomTransformer[];
  customValidators?: CustomValidator[];
}

export interface MigrationSchedule {
  enabled: boolean;
  frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
  cronExpression?: string;
  timezone?: string;
  startDate?: Date;
  endDate?: Date;
  maxExecutions?: number;
}

export interface MigrationFilters {
  contentTypes?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  tags?: string[];
  categories?: string[];
  customFilters?: Record<string, any>;
}

export interface ContentTypeMapping {
  [sourceType: string]: {
    targetType: string;
    fieldMapping?: FieldMapping;
    transformations?: TransformationRule[];
  };
}

export interface FieldMapping {
  [sourceField: string]: {
    targetField: string;
    type: 'direct' | 'transform' | 'combine' | 'split' | 'custom';
    transformation?: string;
    required?: boolean;
    defaultValue?: any;
  };
}

export interface TransformationRule {
  id: string;
  name: string;
  description?: string;
  sourceField: string;
  targetField: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'json' | 'url' | 'email' | 'custom';
  transformation: string;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  id: string;
  name: string;
  type: 'required' | 'format' | 'length' | 'range' | 'custom';
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface CustomTransformer {
  id: string;
  name: string;
  description?: string;
  language: 'javascript' | 'python' | 'typescript';
  code: string;
  dependencies?: string[];
  version: string;
}

export interface CustomValidator {
  id: string;
  name: string;
  description?: string;
  language: 'javascript' | 'python' | 'typescript';
  code: string;
  dependencies?: string[];
  version: string;
}

export interface MigrationResult {
  id: string;
  migrationId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'rolledback';
  progress: number;
  currentStep: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  migratedItems: number;
  totalItems: number;
  successRate: number;
  errors: MigrationError[];
  warnings: MigrationWarning[];
  logs: MigrationLog[];
  metadata: MigrationMetadata;
}

export interface MigrationError {
  id: string;
  timestamp: Date;
  level: 'error' | 'critical';
  message: string;
  details?: any;
  stackTrace?: string;
  recoverable: boolean;
}

export interface MigrationWarning {
  id: string;
  timestamp: Date;
  level: 'warning' | 'info';
  message: string;
  details?: any;
  action?: string;
}

export interface MigrationLog {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  details?: any;
  step: string;
  duration?: number;
}

export interface MigrationMetadata {
  sourceSystem: string;
  targetSystem: string;
  contentTypes: string[];
  totalSize: number;
  compressionRatio?: number;
  validationResults: ValidationResult[];
  performanceMetrics: PerformanceMetrics;
}

export interface ValidationResult {
  type: 'data-integrity' | 'format' | 'business-rules' | 'custom';
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: any;
  timestamp: Date;
}

export interface PerformanceMetrics {
  extractionTime: number;
  transformationTime: number;
  loadingTime: number;
  totalTime: number;
  itemsPerSecond: number;
  memoryUsage: number;
  cpuUsage: number;
  networkUsage: number;
}

export interface RollbackResult {
  id: string;
  migrationId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  rolledBackItems: number;
  errors: MigrationError[];
  logs: MigrationLog[];
}

export interface MigrationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'cms' | 'ecommerce' | 'blog' | 'portfolio' | 'corporate' | 'custom';
  sourceType: string;
  targetType: string;
  config: UniversalMigrationConfig;
  popularity: number;
  rating: number;
  downloads: number;
  author: string;
  version: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MigrationAnalytics {
  totalMigrations: number;
  successfulMigrations: number;
  failedMigrations: number;
  averageDuration: number;
  successRate: number;
  popularSourceSystems: Array<{ system: string; count: number }>;
  popularTargetSystems: Array<{ system: string; count: number }>;
  commonErrors: Array<{ error: string; count: number }>;
  performanceTrends: PerformanceTrend[];
}

export interface PerformanceTrend {
  date: Date;
  averageDuration: number;
  successRate: number;
  totalMigrations: number;
}

// Tipos para sistemas específicos
export interface KenticoConfig extends SourceConfig {
  version: 'v9' | 'v10' | 'v11' | 'v12';
  includeWorkflow?: boolean;
  includeVersionHistory?: boolean;
  includeUserData?: boolean;
  legacyApi?: boolean;
}

export interface KenticoXperienceConfig extends SourceConfig {
  version: 'v13' | 'v14' | 'v15' | 'v16' | 'v17' | 'v18';
  includeWorkflow?: boolean;
  includeVersionHistory?: boolean;
  includeUserData?: boolean;
  includePersonalization?: boolean;
  includeAITest?: boolean;
  includeContentStaging?: boolean;
  includeMarketingAutomation?: boolean;
  useRESTAPI?: boolean;
  useGraphQL?: boolean;
}

export interface WordPressConfig extends SourceConfig {
  version: string;
  includePlugins?: boolean;
  includeThemes?: boolean;
  includeUsers?: boolean;
  includeComments?: boolean;
}

export interface StrapiConfig extends TargetConfig {
  version: string;
  contentTypePrefix?: string;
  preserveRelationships?: boolean;
  includeDrafts?: boolean;
}

export interface PayloadConfig extends TargetConfig {
  version: string;
  preserveCollections?: boolean;
  includeGlobals?: boolean;
  includeUsers?: boolean;
}

// Tipos para contenido universal
export interface UniversalContent {
  id: string;
  type: string;
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  metadata: Record<string, any>;
  seo: SEOData;
  media: MediaItem[];
  relationships: ContentRelationship[];
  customFields: Record<string, any>;
}

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  metaRobots?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  alt: string;
  title: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  metadata: Record<string, any>;
}

export interface ContentRelationship {
  id: string;
  type: 'parent' | 'child' | 'related' | 'custom';
  targetId: string;
  targetType: string;
  metadata: Record<string, any>;
} 