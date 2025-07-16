/**
 * Tipos para el Sistema de Plantillas de Strapi 4 y 5
 */

export interface StrapiTemplate {
  id: string;
  name: string;
  description: string;
  category: 'home' | 'internal' | 'ecommerce' | 'marketing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  seoOptimized: boolean;
  mobileResponsive: boolean;
  previewImage: string;
  components: TemplateComponent[];
  seo?: TemplateSEO;
  performance?: TemplatePerformance;
  accessibility?: TemplateAccessibility;
  responsive?: TemplateResponsive;
  analytics?: TemplateAnalytics;
  abTesting?: TemplateABTesting;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: CustomField[];
  workflows?: WorkflowConfig;
  realTime?: RealTimeConfig;
  versioning?: VersioningConfig;
  scheduling?: SchedulingConfig;
  multiTenancy?: MultiTenancyConfig;
}

export interface TemplateComponent {
  id: string;
  type: string;
  name: string;
  description: string;
  props: Record<string, ComponentProp>;
  styles?: Record<string, any>;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customField?: boolean;
  workflow?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface ComponentProp {
  type: 'string' | 'number' | 'boolean' | 'select' | 'array' | 'object';
  value: any;
  label: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  itemType?: string;
  itemSchema?: Record<string, any>;
  // Nuevas propiedades para Strapi 5
  configurable?: boolean;
  unique?: boolean;
  customField?: boolean;
  workflow?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface TemplateSEO {
  title: string;
  description: string;
  keywords: string[];
  schema: string;
  ogImage?: string;
  twitterCard?: string;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface TemplatePerformance {
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: {
    lcp: string;
    fid: string;
    cls: string;
  };
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  serverless?: boolean;
  edgeFunctions?: boolean;
  realTime?: boolean;
  notifications?: boolean;
  monitoring?: boolean;
  analytics?: boolean;
}

export interface TemplateAccessibility {
  wcagLevel: 'A' | 'AA' | 'AAA';
  features: string[];
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customAdmin?: boolean;
  themeCustomization?: boolean;
}

export interface TemplateResponsive {
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    large: string;
  };
  mobileFirst: boolean;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customAdmin?: boolean;
  themeCustomization?: boolean;
}

export interface TemplateAnalytics {
  events: string[];
  goals: string[];
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  realTime?: boolean;
  notifications?: boolean;
  monitoring?: boolean;
  analytics?: boolean;
}

export interface TemplateABTesting {
  variants: Array<{
    name: string;
    [key: string]: any;
  }>;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  realTime?: boolean;
  notifications?: boolean;
}

// Nuevos tipos para Strapi 5
export interface CustomField {
  name: string;
  type: string;
  label: string;
  description?: string;
  required?: boolean;
  unique?: boolean;
  configurable?: boolean;
  defaultValue?: any;
  validation?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface WorkflowConfig {
  stages: Array<{
    name: string;
    label: string;
    color: string;
  }>;
  permissions: Record<string, string[]>;
  transitions?: Array<{
    from: string;
    to: string;
    conditions?: Record<string, any>;
  }>;
}

export interface RealTimeConfig {
  enabled: boolean;
  events: string[];
  channels: string[];
  authentication: boolean;
  permissions?: Record<string, any>;
}

export interface VersioningConfig {
  enabled: boolean;
  maxVersions: number;
  autoCleanup: boolean;
  includeFields: string[];
  excludeFields?: string[];
}

export interface SchedulingConfig {
  enabled: boolean;
  timezone: string;
  defaultPublishTime: string;
  defaultUnpublishTime: string;
  customSchedules?: Array<{
    name: string;
    cron: string;
    action: 'publish' | 'unpublish';
  }>;
}

export interface MultiTenancyConfig {
  enabled: boolean;
  tenantField: string;
  isolation: 'database' | 'schema' | 'row';
  sharedContent: string[];
  tenantSpecific: string[];
  permissions?: Record<string, any>;
}

// Tipos para componentes específicos
export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlay?: boolean;
  layout?: 'default' | 'centered' | 'split' | 'minimal';
  height?: 'full' | 'large' | 'medium' | 'small';
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  columns: number;
  features: Array<{
    icon: string;
    title: string;
    description: string;
    link?: string;
  }>;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface TestimonialCarouselProps {
  title?: string;
  subtitle?: string;
  testimonials: Array<{
    name: string;
    role: string;
    company: string;
    content: string;
    avatar?: string;
    rating?: number;
  }>;
  autoplay?: boolean;
  autoplaySpeed?: number;
  showDots?: boolean;
  showArrows?: boolean;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface BlogPreviewProps {
  title?: string;
  subtitle?: string;
  posts: number;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
  layout?: 'grid' | 'list' | 'carousel';
  ctaText?: string;
  ctaLink?: string;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface NewsletterSignupProps {
  title: string;
  subtitle?: string;
  placeholder: string;
  buttonText: string;
  showName?: boolean;
  namePlaceholder?: string;
  privacyText?: string;
  privacyLink?: string;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface MissionVisionProps {
  title?: string;
  mission: {
    title: string;
    content: string;
    icon: string;
  };
  vision: {
    title: string;
    content: string;
    icon: string;
  };
  values: Array<{
    title: string;
    content: string;
    icon: string;
  }>;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface TimelineProps {
  title?: string;
  subtitle?: string;
  events: Array<{
    year: string;
    title: string;
    description: string;
    image?: string;
    achievements?: string[];
  }>;
  layout?: 'vertical' | 'horizontal' | 'cards';
  showImages?: boolean;
  showAchievements?: boolean;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface TeamGridProps {
  title?: string;
  subtitle?: string;
  members: Array<{
    name: string;
    role: string;
    bio: string;
    avatar?: string;
    email?: string;
    social?: Record<string, string>;
    department?: string;
    joinDate?: string;
  }>;
  layout?: 'grid' | 'list' | 'carousel';
  columns: number;
  showBio?: boolean;
  showEmail?: boolean;
  showSocial?: boolean;
  showDepartment?: boolean;
  showJoinDate?: boolean;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  stats: Array<{
    number: string;
    label: string;
    icon?: string;
  }>;
  layout?: 'grid' | 'list' | 'carousel';
  columns: number;
  animation?: boolean;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

export interface ContactFormProps {
  title: string;
  subtitle?: string;
  fields: string[];
  submitText: string;
  successMessage?: string;
  errorMessage?: string;
  showPrivacy?: boolean;
  privacyText?: string;
  privacyLink?: string;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

// Tipos para servicios de plantillas
export interface TemplateService {
  registerTemplate(template: StrapiTemplate): void;
  getAllTemplates(): StrapiTemplate[];
  getTemplatesByCategory(category: string): StrapiTemplate[];
  getTemplateById(id: string): StrapiTemplate | undefined;
  searchTemplates(query: string): StrapiTemplate[];
  applyTemplate(templateId: string, content: any, customizations?: Record<string, any>): Promise<any>;
  generateFromTemplate(templateId: string, data: Record<string, any>): Promise<any>;
  validateTemplate(template: StrapiTemplate): { isValid: boolean; errors: string[] };
  exportTemplate(templateId: string): string;
  importTemplate(templateJson: string): StrapiTemplate;
  getTemplateStats(): TemplateStats;
  getTemplateRecommendations(category?: string, difficulty?: string, features?: string[]): StrapiTemplate[];
  // Nuevos métodos para Strapi 5
  migrateTemplate(templateId: string, targetVersion: 'v4' | 'v5'): Promise<StrapiTemplate>;
  getCompatibleTemplates(): StrapiTemplate[];
  isTemplateCompatible(template: StrapiTemplate): boolean;
}

export interface TemplateStats {
  total: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<string, number>;
  seoOptimized: number;
  mobileResponsive: number;
  compatibleWithVersion: number;
}

// Tipos para migración con plantillas
export interface MigrationWithTemplate {
  source: string;
  target: 'strapi';
  strapiVersion: 'v4' | 'v5';
  template: string;
  customizations?: Record<string, any>;
  seoEnhancement?: boolean;
  aiTranslation?: boolean;
  schemaGeneration?: boolean;
  // Nuevas propiedades para Strapi 5
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

// Tipos para generación de contenido
export interface ContentGenerationData {
  title?: string;
  company?: string;
  tagline?: string;
  description?: string;
  industry?: string;
  createdBy?: string;
  updatedBy?: string;
  metadata?: Record<string, any>;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
  [key: string]: any;
}

// Tipos para personalización de plantillas
export interface TemplateCustomization {
  [componentId: string]: Record<string, any>;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

// Tipos para validación de plantillas
export interface TemplateValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

// Tipos para analytics de plantillas
export interface TemplateAnalyticsData {
  templateId: string;
  usageCount: number;
  averageScore: number;
  conversionRate: number;
  userFeedback: Array<{
    rating: number;
    comment?: string;
    date: string;
  }>;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

// Tipos para A/B testing de plantillas
export interface TemplateVariant {
  name: string;
  templateId: string;
  customizations: Record<string, any>;
  trafficPercentage: number;
  conversionRate: number;
  isActive: boolean;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customFields?: boolean;
  workflows?: boolean;
  realTime?: boolean;
  versioning?: boolean;
  scheduling?: boolean;
  multiTenancy?: boolean;
}

// Tipos para performance de plantillas
export interface TemplatePerformanceData {
  templateId: string;
  loadTime: number;
  lighthouseScore: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  lastTested: string;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  serverless?: boolean;
  edgeFunctions?: boolean;
  realTime?: boolean;
  notifications?: boolean;
  monitoring?: boolean;
  analytics?: boolean;
}

// Tipos para accesibilidad de plantillas
export interface TemplateAccessibilityData {
  templateId: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  complianceScore: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    component?: string;
  }>;
  lastAudited: string;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customAdmin?: boolean;
  themeCustomization?: boolean;
}

// Tipos para responsive design de plantillas
export interface TemplateResponsiveData {
  templateId: string;
  breakpoints: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
    large: boolean;
  };
  issues: Array<{
    breakpoint: string;
    component: string;
    issue: string;
  }>;
  lastTested: string;
  // Nuevas propiedades para Strapi 5
  strapiVersion?: 'v4' | 'v5';
  customAdmin?: boolean;
  themeCustomization?: boolean;
}

// Tipos para características específicas de Strapi 5
export interface StrapiV5Features {
  customFields: boolean;
  workflows: boolean;
  realTime: boolean;
  versioning: boolean;
  scheduling: boolean;
  multiTenancy: boolean;
  serverless: boolean;
  edgeFunctions: boolean;
  notifications: boolean;
  monitoring: boolean;
  analytics: boolean;
  backupRestore: boolean;
  migrationTools: boolean;
  pluginMarketplace: boolean;
  cloudDeployment: boolean;
  customAdmin: boolean;
  themeCustomization: boolean;
  contentReleases: boolean;
  reviewWorkflows: boolean;
  internationalization: boolean;
  localization: boolean;
}

// Tipos para configuración de versión
export interface StrapiVersionConfig {
  apiPath: string;
  contentTypePath: string;
  componentsPath: string;
  pluginsPath: string;
  adminPath: string;
  mediaPath: string;
  defaultLocale: string;
  supportedLocales: string[];
  features: StrapiV5Features;
} 