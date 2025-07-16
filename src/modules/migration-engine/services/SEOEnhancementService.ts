import { UniversalContent } from '../types/universal-migration';

/**
 * Servicio de Mejoras SEO Automáticas con IA
 * 
 * Proporciona mejoras automáticas de SEO durante la migración:
 * - Generación de meta títulos optimizados
 * - Generación de meta descripciones
 * - Extracción de keywords relevantes
 * - Generación de schema markup
 * - Optimización de URLs canónicas
 * - Generación de Open Graph tags
 * - Optimización de Twitter Cards
 */
export class SEOEnhancementService {
  
  private aiProvider: 'openai' | 'google' | 'anthropic' = 'openai';
  private apiKey: string;
  
  constructor(apiKey?: string, provider?: 'openai' | 'google' | 'anthropic') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.aiProvider = provider || 'openai';
  }
  
  /**
   * Mejorar SEO del contenido migrado
   */
  async enhanceSEO(content: UniversalContent, options?: SEOEnhancementOptions): Promise<EnhancedContent> {
    console.log('🔍 Mejorando SEO para:', content.title);
    
    const enhancedContent = { ...content };
    const enhancementOptions = {
      generateTitles: true,
      generateDescriptions: true,
      extractKeywords: true,
      generateSchema: true,
      optimizeCanonical: true,
      generateOGTags: true,
      generateTwitterCards: true,
      ...options
    };
    
    try {
      // 1. Generar meta título optimizado
      if (enhancementOptions.generateTitles && this.needsTitleEnhancement(content)) {
        enhancedContent.seo.title = await this.generateOptimizedTitle(content);
        console.log('✅ Título optimizado generado');
      }
      
      // 2. Generar meta descripción
      if (enhancementOptions.generateDescriptions && this.needsDescriptionEnhancement(content)) {
        enhancedContent.seo.description = await this.generateMetaDescription(content);
        console.log('✅ Meta descripción generada');
      }
      
      // 3. Extraer keywords relevantes
      if (enhancementOptions.extractKeywords) {
        enhancedContent.seo.keywords = await this.extractKeywords(content);
        console.log('✅ Keywords extraídas');
      }
      
      // 4. Generar schema markup
      if (enhancementOptions.generateSchema) {
        enhancedContent.schema = await this.generateSchemaMarkup(content);
        console.log('✅ Schema markup generado');
      }
      
      // 5. Optimizar URLs canónicas
      if (enhancementOptions.optimizeCanonical) {
        enhancedContent.seo.canonicalUrl = this.optimizeCanonicalUrl(content);
        console.log('✅ URL canónica optimizada');
      }
      
      // 6. Generar Open Graph tags
      if (enhancementOptions.generateOGTags) {
        const ogTags = await this.generateOGTags(content);
        enhancedContent.seo = { ...enhancedContent.seo, ...ogTags };
        console.log('✅ Open Graph tags generados');
      }
      
      // 7. Generar Twitter Cards
      if (enhancementOptions.generateTwitterCards) {
        enhancedContent.seo.twitterCard = 'summary_large_image';
        console.log('✅ Twitter Card configurado');
      }
      
      // 8. Calcular score SEO
      enhancedContent.seoScore = this.calculateSEOScore(enhancedContent);
      
      console.log('🎯 SEO mejorado completado. Score:', enhancedContent.seoScore);
      
      return enhancedContent;
      
    } catch (error) {
      console.error('❌ Error mejorando SEO:', error);
      throw new Error(`SEO enhancement failed: ${error.message}`);
    }
  }
  
  /**
   * Verificar si necesita mejora de título
   */
  private needsTitleEnhancement(content: UniversalContent): boolean {
    const title = content.seo.title || content.title;
    return !title || title.length < 30 || title.length > 60;
  }
  
  /**
   * Verificar si necesita mejora de descripción
   */
  private needsDescriptionEnhancement(content: UniversalContent): boolean {
    const description = content.seo.description;
    return !description || description.length < 120 || description.length > 160;
  }
  
  /**
   * Generar título optimizado con IA
   */
  private async generateOptimizedTitle(content: UniversalContent): Promise<string> {
    const prompt = `
      Generate an SEO-optimized title for this content:
      
      Original Title: ${content.title}
      Content Preview: ${content.content.substring(0, 500)}
      Content Type: ${content.type}
      
      Requirements:
      - 50-60 characters maximum
      - Include primary keyword naturally
      - Engaging and clickable
      - Maintain original meaning
      - Follow SEO best practices
      - Use title case
      
      Return only the optimized title, no explanations.
    `;
    
    const response = await this.callAI(prompt);
    return this.cleanTitle(response);
  }
  
  /**
   * Generar meta descripción con IA
   */
  private async generateMetaDescription(content: UniversalContent): Promise<string> {
    const prompt = `
      Generate an SEO-optimized meta description for this content:
      
      Title: ${content.title}
      Content Preview: ${content.content.substring(0, 300)}
      Content Type: ${content.type}
      
      Requirements:
      - 150-160 characters maximum
      - Include primary keyword naturally
      - Compelling call-to-action
      - Accurate content summary
      - No duplicate content from title
      - Use active voice
      
      Return only the meta description, no explanations.
    `;
    
    const response = await this.callAI(prompt);
    return this.cleanDescription(response);
  }
  
  /**
   * Extraer keywords relevantes
   */
  private async extractKeywords(content: UniversalContent): Promise<string[]> {
    const prompt = `
      Extract 5-7 relevant SEO keywords from this content:
      
      Title: ${content.title}
      Content: ${content.content.substring(0, 500)}
      Content Type: ${content.type}
      
      Requirements:
      - Primary keyword (1-2 words)
      - Secondary keywords (2-3 words)
      - Long-tail keywords (3-4 words)
      - Search intent aligned
      - Relevant to content type
      
      Return as JSON array of strings only, no explanations.
      Example: ["primary keyword", "secondary keyword", "long tail keyword"]
    `;
    
    const response = await this.callAI(prompt);
    
    try {
      const keywords = JSON.parse(response);
      return Array.isArray(keywords) ? keywords : [];
    } catch (error) {
      console.error('Error parsing keywords:', error);
      return [];
    }
  }
  
  /**
   * Generar schema markup
   */
  private async generateSchemaMarkup(content: UniversalContent): Promise<any> {
    const schemaType = this.determineSchemaType(content.type);
    
    const prompt = `
      Generate JSON-LD schema markup for this ${schemaType}:
      
      Title: ${content.title}
      Content: ${content.content.substring(0, 300)}
      Type: ${content.type}
      Published: ${content.publishedAt}
      Author: ${content.createdBy}
      URL: ${content.seo.canonicalUrl}
      
      Requirements:
      - Valid JSON-LD format
      - Include all required fields for ${schemaType}
      - Follow Schema.org specifications
      - Include proper @context and @type
      
      Return only the JSON-LD schema, no explanations.
    `;
    
    const response = await this.callAI(prompt);
    
    try {
      const schema = JSON.parse(response);
      return this.validateSchema(schema, schemaType);
    } catch (error) {
      console.error('Error parsing schema:', error);
      return this.generateBasicSchema(content, schemaType);
    }
  }
  
  /**
   * Determinar tipo de schema
   */
  private determineSchemaType(contentType: string): string {
    const schemaMapping: Record<string, string> = {
      'article': 'Article',
      'blog': 'BlogPosting',
      'product': 'Product',
      'service': 'Service',
      'event': 'Event',
      'page': 'WebPage',
      'person': 'Person',
      'organization': 'Organization',
      'newsletter': 'Article',
      'form': 'WebPage'
    };
    
    return schemaMapping[contentType] || 'WebPage';
  }
  
  /**
   * Validar schema generado
   */
  private validateSchema(schema: any, schemaType: string): any {
    // Validaciones básicas
    if (!schema['@context'] || !schema['@type']) {
      throw new Error('Invalid schema structure');
    }
    
    if (schema['@type'] !== schemaType) {
      schema['@type'] = schemaType;
    }
    
    return schema;
  }
  
  /**
   * Generar schema básico si falla la IA
   */
  private generateBasicSchema(content: UniversalContent, schemaType: string): any {
    return {
      "@context": "https://schema.org",
      "@type": schemaType,
      "headline": content.title,
      "description": content.seo.description,
      "datePublished": content.publishedAt,
      "dateModified": content.updatedAt,
      "author": {
        "@type": "Person",
        "name": content.createdBy
      }
    };
  }
  
  /**
   * Optimizar URL canónica
   */
  private optimizeCanonicalUrl(content: UniversalContent): string {
    const currentUrl = content.seo.canonicalUrl || content.slug;
    
    if (!currentUrl) {
      return `https://your-site.com/${content.slug}`;
    }
    
    // Asegurar que sea URL absoluta
    if (currentUrl.startsWith('/')) {
      return `https://your-site.com${currentUrl}`;
    }
    
    // Asegurar que tenga protocolo
    if (!currentUrl.startsWith('http')) {
      return `https://${currentUrl}`;
    }
    
    return currentUrl;
  }
  
  /**
   * Generar Open Graph tags
   */
  private async generateOGTags(content: UniversalContent): Promise<any> {
    return {
      ogTitle: content.seo.title || content.title,
      ogDescription: content.seo.description,
      ogImage: content.media[0]?.url || content.seo.ogImage,
      ogType: this.determineOGType(content.type),
      ogUrl: content.seo.canonicalUrl,
      ogSiteName: 'Your Site Name',
      ogLocale: 'en_US'
    };
  }
  
  /**
   * Determinar tipo de Open Graph
   */
  private determineOGType(contentType: string): string {
    const ogTypeMapping: Record<string, string> = {
      'article': 'article',
      'blog': 'article',
      'product': 'product',
      'service': 'website',
      'event': 'event',
      'page': 'website',
      'person': 'profile',
      'organization': 'website'
    };
    
    return ogTypeMapping[contentType] || 'website';
  }
  
  /**
   * Calcular score SEO
   */
  private calculateSEOScore(content: EnhancedContent): number {
    let score = 0;
    const maxScore = 100;
    
    // Título (20 puntos)
    if (content.seo.title) {
      const titleLength = content.seo.title.length;
      if (titleLength >= 30 && titleLength <= 60) {
        score += 20;
      } else if (titleLength > 0) {
        score += 10;
      }
    }
    
    // Descripción (20 puntos)
    if (content.seo.description) {
      const descLength = content.seo.description.length;
      if (descLength >= 120 && descLength <= 160) {
        score += 20;
      } else if (descLength > 0) {
        score += 10;
      }
    }
    
    // Keywords (15 puntos)
    if (content.seo.keywords && content.seo.keywords.length > 0) {
      score += 15;
    }
    
    // Schema markup (15 puntos)
    if (content.schema) {
      score += 15;
    }
    
    // Open Graph tags (10 puntos)
    if (content.seo.ogTitle && content.seo.ogDescription) {
      score += 10;
    }
    
    // Canonical URL (10 puntos)
    if (content.seo.canonicalUrl) {
      score += 10;
    }
    
    // Twitter Card (10 puntos)
    if (content.seo.twitterCard) {
      score += 10;
    }
    
    return Math.min(score, maxScore);
  }
  
  /**
   * Limpiar título
   */
  private cleanTitle(title: string): string {
    return title
      .replace(/^["']|["']$/g, '') // Remover comillas
      .replace(/\n/g, ' ') // Reemplazar saltos de línea
      .trim();
  }
  
  /**
   * Limpiar descripción
   */
  private cleanDescription(description: string): string {
    return description
      .replace(/^["']|["']$/g, '') // Remover comillas
      .replace(/\n/g, ' ') // Reemplazar saltos de línea
      .trim();
  }
  
  /**
   * Llamar a IA
   */
  private async callAI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }
    
    const endpoint = this.getAIEndpoint();
    const headers = this.getAIHeaders();
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.getAIModel(),
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Provide only the requested output, no explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
  
  /**
   * Obtener endpoint de IA
   */
  private getAIEndpoint(): string {
    switch (this.aiProvider) {
      case 'openai':
        return 'https://api.openai.com/v1/chat/completions';
      case 'google':
        return 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
      case 'anthropic':
        return 'https://api.anthropic.com/v1/messages';
      default:
        return 'https://api.openai.com/v1/chat/completions';
    }
  }
  
  /**
   * Obtener headers de IA
   */
  private getAIHeaders(): Record<string, string> {
    switch (this.aiProvider) {
      case 'openai':
        return {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        };
      case 'google':
        return {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        };
      case 'anthropic':
        return {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        };
      default:
        return {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        };
    }
  }
  
  /**
   * Obtener modelo de IA
   */
  private getAIModel(): string {
    switch (this.aiProvider) {
      case 'openai':
        return 'gpt-4';
      case 'google':
        return 'gemini-pro';
      case 'anthropic':
        return 'claude-3-sonnet-20240229';
      default:
        return 'gpt-4';
    }
  }
}

// Tipos adicionales
export interface SEOEnhancementOptions {
  generateTitles?: boolean;
  generateDescriptions?: boolean;
  extractKeywords?: boolean;
  generateSchema?: boolean;
  optimizeCanonical?: boolean;
  generateOGTags?: boolean;
  generateTwitterCards?: boolean;
}

export interface EnhancedContent extends UniversalContent {
  seoScore?: number;
  schema?: any;
} 