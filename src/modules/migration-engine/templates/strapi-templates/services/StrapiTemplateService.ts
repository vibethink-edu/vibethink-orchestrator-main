import { StrapiTemplate } from '../types/template-types';
import { heroFocusedTemplate } from '../home-templates/hero-focused';
import { aboutUsTemplate } from '../internal-templates/about-us';

/**
 * Servicio de Plantillas para Strapi 4 y 5
 * 
 * Gestiona la creación, aplicación y personalización de plantillas
 * para diferentes versiones de Strapi con compatibilidad completa.
 */
export class StrapiTemplateService {
  
  private templates: Map<string, StrapiTemplate> = new Map();
  private componentRegistry: Map<string, any> = new Map();
  private strapiVersion: 'v4' | 'v5' = 'v4';
  
  constructor(strapiVersion: 'v4' | 'v5' = 'v4') {
    this.strapiVersion = strapiVersion;
    this.registerDefaultTemplates();
  }
  
  /**
   * Registrar plantillas por defecto
   */
  private registerDefaultTemplates(): void {
    // Plantillas de Home
    this.registerTemplate(heroFocusedTemplate);
    
    // Plantillas de Páginas Internas
    this.registerTemplate(aboutUsTemplate);
    
    // TODO: Agregar más plantillas
    // this.registerTemplate(featureGridTemplate);
    // this.registerTemplate(servicesTemplate);
    // this.registerTemplate(blogListingTemplate);
    // this.registerTemplate(contactTemplate);
    // this.registerTemplate(faqTemplate);
  }
  
  /**
   * Obtener configuración específica de versión
   */
  private getVersionConfig(): StrapiVersionConfig {
    const configs = {
      v4: {
        apiPath: '/api',
        contentTypePath: 'content-types',
        componentsPath: 'components',
        pluginsPath: 'plugins',
        adminPath: '/admin',
        mediaPath: '/uploads',
        defaultLocale: 'en',
        supportedLocales: ['en', 'es', 'fr', 'de'],
        features: {
          components: true,
          dynamicZones: true,
          relations: true,
          mediaLibrary: true,
          i18n: true,
          permissions: true,
          roles: true,
          users: true,
          apiTokens: true,
          webhooks: true,
          auditLogs: true
        }
      },
      v5: {
        apiPath: '/api',
        contentTypePath: 'content-types',
        componentsPath: 'components',
        pluginsPath: 'plugins',
        adminPath: '/admin',
        mediaPath: '/uploads',
        defaultLocale: 'en',
        supportedLocales: ['en', 'es', 'fr', 'de'],
        features: {
          components: true,
          dynamicZones: true,
          relations: true,
          mediaLibrary: true,
          i18n: true,
          permissions: true,
          roles: true,
          users: true,
          apiTokens: true,
          webhooks: true,
          auditLogs: true,
          // Nuevas características de Strapi 5
          customFields: true,
          contentAPI: true,
          adminAPI: true,
          databaseConnectors: true,
          pluginAPI: true,
          serverless: true,
          edgeFunctions: true,
          realTime: true,
          notifications: true,
          workflows: true,
          versioning: true,
          scheduling: true,
          preview: true,
          draftPublish: true,
          contentReleases: true,
          reviewWorkflows: true,
          internationalization: true,
          localization: true,
          multiTenancy: true,
          customAdmin: true,
          themeCustomization: true,
          pluginMarketplace: true,
          cloudDeployment: true,
          monitoring: true,
          analytics: true,
          backupRestore: true,
          migrationTools: true
        }
      }
    };
    
    return configs[this.strapiVersion];
  }
  
  /**
   * Registrar una nueva plantilla
   */
  registerTemplate(template: StrapiTemplate): void {
    // Validar compatibilidad con versión
    if (!this.isTemplateCompatible(template)) {
      console.warn(`⚠️ Plantilla ${template.name} puede no ser compatible con Strapi ${this.strapiVersion}`);
    }
    
    this.templates.set(template.id, template);
    console.log(`✅ Plantilla registrada: ${template.name} (Strapi ${this.strapiVersion})`);
  }
  
  /**
   * Verificar compatibilidad de plantilla
   */
  private isTemplateCompatible(template: StrapiTemplate): boolean {
    const versionConfig = this.getVersionConfig();
    
    // Verificar características requeridas
    for (const component of template.components) {
      if (component.type === 'customField' && !versionConfig.features.customFields) {
        return false;
      }
      
      if (component.type === 'workflow' && !versionConfig.features.workflows) {
        return false;
      }
      
      if (component.type === 'realTime' && !versionConfig.features.realTime) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Obtener todas las plantillas disponibles
   */
  getAllTemplates(): StrapiTemplate[] {
    return Array.from(this.templates.values());
  }
  
  /**
   * Obtener plantillas por categoría
   */
  getTemplatesByCategory(category: string): StrapiTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }
  
  /**
   * Obtener plantillas compatibles con la versión actual
   */
  getCompatibleTemplates(): StrapiTemplate[] {
    return this.getAllTemplates().filter(template => this.isTemplateCompatible(template));
  }
  
  /**
   * Obtener plantilla por ID
   */
  getTemplateById(id: string): StrapiTemplate | undefined {
    return this.templates.get(id);
  }
  
  /**
   * Buscar plantillas por término
   */
  searchTemplates(query: string): StrapiTemplate[] {
    const searchTerm = query.toLowerCase();
    return this.getAllTemplates().filter(template => 
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.category.toLowerCase().includes(searchTerm)
    );
  }
  
  /**
   * Aplicar plantilla a contenido existente
   */
  async applyTemplate(
    templateId: string, 
    content: any, 
    customizations?: Record<string, any>
  ): Promise<any> {
    
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Plantilla no encontrada: ${templateId}`);
    }
    
    console.log(`🎨 Aplicando plantilla: ${template.name} (Strapi ${this.strapiVersion})`);
    
    try {
      // Aplicar componentes de la plantilla
      const appliedContent = await this.applyTemplateComponents(template, content, customizations);
      
      // Aplicar SEO de la plantilla
      const seoEnhancedContent = await this.applyTemplateSEO(template, appliedContent);
      
      // Aplicar estilos de la plantilla
      const styledContent = await this.applyTemplateStyles(template, seoEnhancedContent);
      
      // Aplicar configuraciones específicas de versión
      const versionSpecificContent = await this.applyVersionSpecificFeatures(template, styledContent);
      
      console.log(`✅ Plantilla aplicada exitosamente: ${template.name}`);
      
      return versionSpecificContent;
      
    } catch (error) {
      console.error(`❌ Error aplicando plantilla: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Aplicar características específicas de versión
   */
  private async applyVersionSpecificFeatures(template: StrapiTemplate, content: any): Promise<any> {
    const versionConfig = this.getVersionConfig();
    
    // Características específicas de Strapi 5
    if (this.strapiVersion === 'v5') {
      // Agregar soporte para custom fields
      if (versionConfig.features.customFields) {
        content.customFields = await this.generateCustomFields(template);
      }
      
      // Agregar soporte para workflows
      if (versionConfig.features.workflows) {
        content.workflows = await this.generateWorkflows(template);
      }
      
      // Agregar soporte para real-time
      if (versionConfig.features.realTime) {
        content.realTime = await this.generateRealTimeConfig(template);
      }
      
      // Agregar soporte para versioning
      if (versionConfig.features.versioning) {
        content.versioning = await this.generateVersioningConfig(template);
      }
      
      // Agregar soporte para scheduling
      if (versionConfig.features.scheduling) {
        content.scheduling = await this.generateSchedulingConfig(template);
      }
      
      // Agregar soporte para multi-tenancy
      if (versionConfig.features.multiTenancy) {
        content.multiTenancy = await this.generateMultiTenancyConfig(template);
      }
    }
    
    return content;
  }
  
  /**
   * Generar custom fields para Strapi 5
   */
  private async generateCustomFields(template: StrapiTemplate): Promise<any> {
    const customFields = [];
    
    for (const component of template.components) {
      if (component.type === 'customField') {
        customFields.push({
          name: component.id,
          type: component.props.type?.value || 'string',
          label: component.name,
          description: component.description,
          required: component.props.required?.value || false,
          unique: component.props.unique?.value || false,
          configurable: component.props.configurable?.value || true
        });
      }
    }
    
    return customFields;
  }
  
  /**
   * Generar workflows para Strapi 5
   */
  private async generateWorkflows(template: StrapiTemplate): Promise<any> {
    return {
      stages: [
        { name: 'draft', label: 'Borrador', color: '#6c757d' },
        { name: 'review', label: 'En Revisión', color: '#ffc107' },
        { name: 'published', label: 'Publicado', color: '#28a745' }
      ],
      permissions: {
        'draft': ['create', 'read', 'update'],
        'review': ['read', 'update'],
        'published': ['read']
      }
    };
  }
  
  /**
   * Generar configuración real-time para Strapi 5
   */
  private async generateRealTimeConfig(template: StrapiTemplate): Promise<any> {
    return {
      enabled: true,
      events: ['entry.create', 'entry.update', 'entry.delete'],
      channels: ['content-updates', 'user-activity'],
      authentication: true
    };
  }
  
  /**
   * Generar configuración de versioning para Strapi 5
   */
  private async generateVersioningConfig(template: StrapiTemplate): Promise<any> {
    return {
      enabled: true,
      maxVersions: 10,
      autoCleanup: true,
      includeFields: ['title', 'content', 'seo', 'components']
    };
  }
  
  /**
   * Generar configuración de scheduling para Strapi 5
   */
  private async generateSchedulingConfig(template: StrapiTemplate): Promise<any> {
    return {
      enabled: true,
      timezone: 'UTC',
      defaultPublishTime: '09:00',
      defaultUnpublishTime: '18:00'
    };
  }
  
  /**
   * Generar configuración de multi-tenancy para Strapi 5
   */
  private async generateMultiTenancyConfig(template: StrapiTemplate): Promise<any> {
    return {
      enabled: true,
      tenantField: 'company_id',
      isolation: 'database', // 'database' | 'schema' | 'row'
      sharedContent: ['global-settings', 'templates'],
      tenantSpecific: ['pages', 'blog-posts', 'products']
    };
  }
  
  /**
   * Aplicar componentes de la plantilla
   */
  private async applyTemplateComponents(
    template: StrapiTemplate, 
    content: any, 
    customizations?: Record<string, any>
  ): Promise<any> {
    
    const appliedContent = { ...content };
    
    // Aplicar cada componente de la plantilla
    for (const component of template.components) {
      const componentData = await this.generateComponentData(component, customizations);
      
      // Agregar componente al contenido
      if (!appliedContent.components) {
        appliedContent.components = [];
      }
      
      appliedContent.components.push({
        id: component.id,
        type: component.type,
        name: component.name,
        data: componentData,
        styles: component.styles,
        version: this.strapiVersion
      });
    }
    
    return appliedContent;
  }
  
  /**
   * Generar datos del componente
   */
  private async generateComponentData(
    component: any, 
    customizations?: Record<string, any>
  ): Promise<any> {
    
    const componentData = { ...component.props };
    
    // Aplicar personalizaciones si existen
    if (customizations && customizations[component.id]) {
      Object.assign(componentData, customizations[component.id]);
    }
    
    // Procesar valores dinámicos
    for (const [key, value] of Object.entries(componentData)) {
      if (typeof value === 'string' && value.includes('{')) {
        componentData[key] = await this.processDynamicValue(value, customizations);
      }
    }
    
    // Aplicar configuraciones específicas de versión
    if (this.strapiVersion === 'v5') {
      componentData.strapiVersion = 'v5';
      componentData.features = this.getVersionConfig().features;
    }
    
    return componentData;
  }
  
  /**
   * Procesar valores dinámicos
   */
  private async processDynamicValue(value: string, customizations?: Record<string, any>): Promise<string> {
    let processedValue = value;
    
    // Reemplazar variables comunes
    const variables = {
      '{company}': customizations?.company || 'Tu Empresa',
      '{tagline}': customizations?.tagline || 'Soluciones Innovadoras',
      '{description}': customizations?.description || 'Descripción de la empresa',
      '{industry}': customizations?.industry || 'tecnología',
      '{year}': new Date().getFullYear().toString(),
      '{strapiVersion}': this.strapiVersion
    };
    
    for (const [variable, replacement] of Object.entries(variables)) {
      processedValue = processedValue.replace(new RegExp(variable, 'g'), replacement);
    }
    
    return processedValue;
  }
  
  /**
   * Aplicar SEO de la plantilla
   */
  private async applyTemplateSEO(template: StrapiTemplate, content: any): Promise<any> {
    
    if (!template.seo) {
      return content;
    }
    
    const seoData = { ...template.seo };
    
    // Procesar valores dinámicos en SEO
    for (const [key, value] of Object.entries(seoData)) {
      if (typeof value === 'string' && value.includes('{')) {
        seoData[key] = await this.processDynamicValue(value);
      }
    }
    
    // Aplicar SEO al contenido
    content.seo = {
      ...content.seo,
      ...seoData,
      strapiVersion: this.strapiVersion
    };
    
    return content;
  }
  
  /**
   * Aplicar estilos de la plantilla
   */
  private async applyTemplateStyles(template: StrapiTemplate, content: any): Promise<any> {
    
    // Agregar estilos globales de la plantilla
    if (template.styles) {
      content.styles = {
        ...content.styles,
        ...template.styles
      };
    }
    
    // Agregar estilos específicos de versión
    content.styles = {
      ...content.styles,
      strapiVersion: this.strapiVersion,
      responsive: template.responsive,
      accessibility: template.accessibility
    };
    
    return content;
  }
  
  /**
   * Generar contenido desde plantilla
   */
  async generateFromTemplate(
    templateId: string, 
    data: Record<string, any>
  ): Promise<any> {
    
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Plantilla no encontrada: ${templateId}`);
    }
    
    console.log(`🚀 Generando contenido desde plantilla: ${template.name} (Strapi ${this.strapiVersion})`);
    
    try {
      // Crear contenido base
      const baseContent = {
        id: `generated-${Date.now()}`,
        type: template.category,
        title: data.title || template.name,
        slug: this.generateSlug(data.title || template.name),
        status: 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: data.createdBy || 'system',
        updatedBy: data.updatedBy || 'system',
        metadata: {
          template: templateId,
          generated: true,
          strapiVersion: this.strapiVersion,
          ...data.metadata
        }
      };
      
      // Aplicar plantilla
      const generatedContent = await this.applyTemplate(templateId, baseContent, data);
      
      console.log(`✅ Contenido generado exitosamente desde: ${template.name}`);
      
      return generatedContent;
      
    } catch (error) {
      console.error(`❌ Error generando contenido: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generar slug desde título
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  /**
   * Validar plantilla
   */
  validateTemplate(template: StrapiTemplate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validar campos requeridos
    if (!template.id) errors.push('ID de plantilla es requerido');
    if (!template.name) errors.push('Nombre de plantilla es requerido');
    if (!template.category) errors.push('Categoría de plantilla es requerida');
    
    // Validar componentes
    if (!template.components || template.components.length === 0) {
      errors.push('La plantilla debe tener al menos un componente');
    }
    
    // Validar SEO
    if (template.seo) {
      if (!template.seo.title) errors.push('Título SEO es requerido');
      if (!template.seo.description) errors.push('Descripción SEO es requerida');
    }
    
    // Validar compatibilidad con versión
    if (!this.isTemplateCompatible(template)) {
      errors.push(`Plantilla no compatible con Strapi ${this.strapiVersion}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Exportar plantilla
   */
  exportTemplate(templateId: string): string {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Plantilla no encontrada: ${templateId}`);
    }
    
    return JSON.stringify(template, null, 2);
  }
  
  /**
   * Importar plantilla
   */
  importTemplate(templateJson: string): StrapiTemplate {
    try {
      const template = JSON.parse(templateJson) as StrapiTemplate;
      
      // Validar plantilla
      const validation = this.validateTemplate(template);
      if (!validation.isValid) {
        throw new Error(`Plantilla inválida: ${validation.errors.join(', ')}`);
      }
      
      // Registrar plantilla
      this.registerTemplate(template);
      
      return template;
      
    } catch (error) {
      throw new Error(`Error importando plantilla: ${error.message}`);
    }
  }
  
  /**
   * Obtener estadísticas de plantillas
   */
  getTemplateStats(): TemplateStats {
    const templates = this.getAllTemplates();
    
    const stats = {
      total: templates.length,
      byCategory: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      seoOptimized: 0,
      mobileResponsive: 0,
      compatibleWithVersion: 0
    };
    
    for (const template of templates) {
      // Contar por categoría
      stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
      
      // Contar por dificultad
      stats.byDifficulty[template.difficulty] = (stats.byDifficulty[template.difficulty] || 0) + 1;
      
      // Contar características
      if (template.seoOptimized) stats.seoOptimized++;
      if (template.mobileResponsive) stats.mobileResponsive++;
      if (this.isTemplateCompatible(template)) stats.compatibleWithVersion++;
    }
    
    return stats;
  }
  
  /**
   * Obtener recomendaciones de plantillas
   */
  getTemplateRecommendations(
    category?: string, 
    difficulty?: string, 
    features?: string[]
  ): StrapiTemplate[] {
    
    let templates = this.getCompatibleTemplates();
    
    // Filtrar por categoría
    if (category) {
      templates = templates.filter(t => t.category === category);
    }
    
    // Filtrar por dificultad
    if (difficulty) {
      templates = templates.filter(t => t.difficulty === difficulty);
    }
    
    // Filtrar por características
    if (features) {
      templates = templates.filter(t => {
        if (features.includes('seo') && !t.seoOptimized) return false;
        if (features.includes('mobile') && !t.mobileResponsive) return false;
        return true;
      });
    }
    
    // Ordenar por relevancia
    templates.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      if (a.seoOptimized) scoreA += 2;
      if (b.seoOptimized) scoreB += 2;
      if (a.mobileResponsive) scoreA += 1;
      if (b.mobileResponsive) scoreB += 1;
      
      return scoreB - scoreA;
    });
    
    return templates;
  }
  
  /**
   * Migrar plantilla entre versiones
   */
  async migrateTemplate(templateId: string, targetVersion: 'v4' | 'v5'): Promise<StrapiTemplate> {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Plantilla no encontrada: ${templateId}`);
    }
    
    console.log(`🔄 Migrando plantilla ${template.name} a Strapi ${targetVersion}`);
    
    // Crear nueva instancia del servicio con la versión objetivo
    const targetService = new StrapiTemplateService(targetVersion);
    
    // Clonar plantilla
    const migratedTemplate = { ...template };
    
    // Aplicar cambios específicos de versión
    if (targetVersion === 'v5') {
      migratedTemplate.components = await this.upgradeComponentsToV5(template.components);
    } else {
      migratedTemplate.components = await this.downgradeComponentsToV4(template.components);
    }
    
    // Validar plantilla migrada
    const validation = targetService.validateTemplate(migratedTemplate);
    if (!validation.isValid) {
      throw new Error(`Error migrando plantilla: ${validation.errors.join(', ')}`);
    }
    
    console.log(`✅ Plantilla migrada exitosamente a Strapi ${targetVersion}`);
    
    return migratedTemplate;
  }
  
  /**
   * Actualizar componentes a Strapi 5
   */
  private async upgradeComponentsToV5(components: any[]): Promise<any[]> {
    return components.map(component => {
      const upgradedComponent = { ...component };
      
      // Agregar características específicas de v5
      if (component.type === 'customField') {
        upgradedComponent.props = {
          ...upgradedComponent.props,
          configurable: { type: 'boolean', value: true, label: 'Configurable' },
          unique: { type: 'boolean', value: false, label: 'Único' }
        };
      }
      
      return upgradedComponent;
    });
  }
  
  /**
   * Degradar componentes a Strapi 4
   */
  private async downgradeComponentsToV4(components: any[]): Promise<any[]> {
    return components.filter(component => {
      // Remover componentes específicos de v5
      if (component.type === 'customField') {
        return false; // No soportado en v4
      }
      
      return true;
    });
  }
}

// Tipos adicionales
export interface StrapiVersionConfig {
  apiPath: string;
  contentTypePath: string;
  componentsPath: string;
  pluginsPath: string;
  adminPath: string;
  mediaPath: string;
  defaultLocale: string;
  supportedLocales: string[];
  features: Record<string, boolean>;
}

export interface TemplateStats {
  total: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<string, number>;
  seoOptimized: number;
  mobileResponsive: number;
  compatibleWithVersion: number;
} 