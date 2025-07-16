import { UniversalContent } from '../types/universal-migration';

/**
 * Servicio de Generación Automática de Schema Markup
 * 
 * Genera automáticamente schema markup estructurado para SEO:
 * - Análisis automático del tipo de contenido
 * - Generación de schema específico por tipo
 * - Validación de schema.org
 * - Optimización para motores de búsqueda
 * - Soporte para múltiples tipos de contenido
 */
export class SchemaGenerationService {
  
  private aiProvider: 'openai' | 'google' | 'anthropic' = 'openai';
  private apiKey: string;
  
  constructor(apiKey?: string, provider?: 'openai' | 'google' | 'anthropic') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.aiProvider = provider || 'openai';
  }
  
  /**
   * Generar schema markup automático
   */
  async generateSchemaMarkup(
    content: UniversalContent, 
    options?: SchemaGenerationOptions
  ): Promise<any> {
    
    console.log('🏷️ Generando schema markup para:', content.title);
    
    const schemaOptions = {
      enableAI: true,
      validateSchema: true,
      includeStructuredData: true,
      optimizeForSEO: true,
      ...options
    };
    
    try {
      const schemaType = this.determineSchemaType(content.type);
      let schema: any;
      
      if (schemaOptions.enableAI) {
        // Usar IA para generar schema más preciso
        schema = await this.generateSchemaWithAI(content, schemaType);
      } else {
        // Usar generación basada en reglas
        schema = this.generateSchemaByRules(content, schemaType);
      }
      
      // Validar schema si está habilitado
      if (schemaOptions.validateSchema) {
        schema = this.validateSchema(schema, schemaType);
      }
      
      // Optimizar para SEO si está habilitado
      if (schemaOptions.optimizeForSEO) {
        schema = this.optimizeSchemaForSEO(schema, content);
      }
      
      console.log('✅ Schema markup generado:', schemaType);
      
      return schema;
      
    } catch (error) {
      console.error('❌ Error generando schema markup:', error);
      // Fallback a schema básico
      return this.generateBasicSchema(content);
    }
  }
  
  /**
   * Generar schema con IA
   */
  private async generateSchemaWithAI(content: UniversalContent, schemaType: string): Promise<any> {
    
    const prompt = `
      Generate JSON-LD schema markup for this ${schemaType}:
      
      Title: ${content.title}
      Content: ${content.content.substring(0, 500)}
      Type: ${content.type}
      Published: ${content.publishedAt}
      Author: ${content.createdBy}
      URL: ${content.seo?.canonicalUrl || ''}
      Description: ${content.seo?.description || ''}
      
      Additional metadata:
      ${JSON.stringify(content.metadata, null, 2)}
      
      Requirements:
      - Valid JSON-LD format
      - Include all required fields for ${schemaType}
      - Follow Schema.org specifications exactly
      - Include proper @context and @type
      - Add relevant optional fields based on content
      - Ensure SEO optimization
      
      Return only the JSON-LD schema, no explanations.
    `;
    
    const response = await this.callAI(prompt);
    
    try {
      const schema = JSON.parse(response);
      return this.enhanceSchemaWithMetadata(schema, content);
    } catch (error) {
      console.error('Error parsing AI-generated schema:', error);
      return this.generateSchemaByRules(content, schemaType);
    }
  }
  
  /**
   * Generar schema basado en reglas
   */
  private generateSchemaByRules(content: UniversalContent, schemaType: string): any {
    
    switch (schemaType) {
      case 'Article':
        return this.generateArticleSchema(content);
      case 'BlogPosting':
        return this.generateBlogPostingSchema(content);
      case 'Product':
        return this.generateProductSchema(content);
      case 'Service':
        return this.generateServiceSchema(content);
      case 'Event':
        return this.generateEventSchema(content);
      case 'Organization':
        return this.generateOrganizationSchema(content);
      case 'Person':
        return this.generatePersonSchema(content);
      case 'WebPage':
        return this.generateWebPageSchema(content);
      case 'FAQPage':
        return this.generateFAQPageSchema(content);
      case 'HowTo':
        return this.generateHowToSchema(content);
      default:
        return this.generateWebPageSchema(content);
    }
  }
  
  /**
   * Generar schema de artículo
   */
  private generateArticleSchema(content: UniversalContent): any {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": content.title,
      "description": content.seo?.description || content.content.substring(0, 160),
      "image": this.getPrimaryImage(content),
      "author": {
        "@type": "Person",
        "name": content.createdBy
      },
      "publisher": {
        "@type": "Organization",
        "name": content.metadata?.organization || "Your Organization",
        "logo": {
          "@type": "ImageObject",
          "url": content.metadata?.logo || "https://your-site.com/logo.png"
        }
      },
      "datePublished": content.publishedAt,
      "dateModified": content.updatedAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": content.seo?.canonicalUrl || `https://your-site.com/${content.slug}`
      },
      "articleSection": content.metadata?.category || "General",
      "keywords": content.seo?.keywords?.join(', ') || "",
      "wordCount": content.content.length,
      "inLanguage": content.metadata?.language || "en-US"
    };
  }
  
  /**
   * Generar schema de blog post
   */
  private generateBlogPostingSchema(content: UniversalContent): any {
    const articleSchema = this.generateArticleSchema(content);
    return {
      ...articleSchema,
      "@type": "BlogPosting",
      "blogPost": {
        "@type": "Blog",
        "name": content.metadata?.blogName || "Blog"
      }
    };
  }
  
  /**
   * Generar schema de producto
   */
  private generateProductSchema(content: UniversalContent): any {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": content.title,
      "description": content.content,
      "image": this.getPrimaryImage(content),
      "brand": {
        "@type": "Brand",
        "name": content.metadata?.brand || "Your Brand"
      },
      "offers": {
        "@type": "Offer",
        "price": content.metadata?.price || "0",
        "priceCurrency": content.metadata?.currency || "USD",
        "availability": content.metadata?.availability || "https://schema.org/InStock",
        "url": content.seo?.canonicalUrl || `https://your-site.com/${content.slug}`
      },
      "category": content.metadata?.category || "General",
      "sku": content.metadata?.sku || "",
      "mpn": content.metadata?.mpn || "",
      "gtin": content.metadata?.gtin || "",
      "aggregateRating": content.metadata?.rating ? {
        "@type": "AggregateRating",
        "ratingValue": content.metadata.rating.value,
        "reviewCount": content.metadata.rating.count
      } : undefined
    };
  }
  
  /**
   * Generar schema de servicio
   */
  private generateServiceSchema(content: UniversalContent): any {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": content.title,
      "description": content.content,
      "provider": {
        "@type": "Organization",
        "name": content.metadata?.provider || "Your Organization"
      },
      "areaServed": content.metadata?.areaServed || "Worldwide",
      "serviceType": content.metadata?.serviceType || "General Service",
      "url": content.seo?.canonicalUrl || `https://your-site.com/${content.slug}`
    };
  }
  
  /**
   * Generar schema de evento
   */
  private generateEventSchema(content: UniversalContent): any {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": content.title,
      "description": content.content,
      "startDate": content.metadata?.startDate,
      "endDate": content.metadata?.endDate,
      "location": content.metadata?.location ? {
        "@type": "Place",
        "name": content.metadata.location.name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": content.metadata.location.streetAddress,
          "addressLocality": content.metadata.location.city,
          "addressRegion": content.metadata.location.state,
          "postalCode": content.metadata.location.postalCode,
          "addressCountry": content.metadata.location.country
        }
      } : undefined,
      "organizer": {
        "@type": "Organization",
        "name": content.metadata?.organizer || "Your Organization"
      },
      "performer": content.metadata?.performer ? {
        "@type": "Person",
        "name": content.metadata.performer
      } : undefined,
      "eventStatus": content.metadata?.eventStatus || "https://schema.org/EventScheduled",
      "eventAttendanceMode": content.metadata?.attendanceMode || "https://schema.org/OfflineEventAttendanceMode"
    };
  }
  
  /**
   * Generar schema de organización
   */
  private generateOrganizationSchema(content: UniversalContent): any {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": content.title,
      "description": content.content,
      "url": content.seo?.canonicalUrl || `https://your-site.com/${content.slug}`,
      "logo": {
        "@type": "ImageObject",
        "url": content.metadata?.logo || "https://your-site.com/logo.png"
      },
      "address": content.metadata?.address ? {
        "@type": "PostalAddress",
        "streetAddress": content.metadata.address.streetAddress,
        "addressLocality": content.metadata.address.city,
        "addressRegion": content.metadata.address.state,
        "postalCode": content.metadata.address.postalCode,
        "addressCountry": content.metadata.address.country
      } : undefined,
      "contactPoint": content.metadata?.contact ? {
        "@type": "ContactPoint",
        "telephone": content.metadata.contact.phone,
        "email": content.metadata.contact.email,
        "contactType": "customer service"
      } : undefined,
      "sameAs": content.metadata?.socialMedia || []
    };
  }
  
  /**
   * Generar schema de persona
   */
  private generatePersonSchema(content: UniversalContent): any {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": content.title,
      "description": content.content,
      "image": this.getPrimaryImage(content),
      "url": content.seo?.canonicalUrl || `https://your-site.com/${content.slug}`,
      "jobTitle": content.metadata?.jobTitle || "",
      "worksFor": content.metadata?.organization ? {
        "@type": "Organization",
        "name": content.metadata.organization
      } : undefined,
      "sameAs": content.metadata?.socialMedia || [],
      "knowsAbout": content.metadata?.expertise || []
    };
  }
  
  /**
   * Generar schema de página web
   */
  private generateWebPageSchema(content: UniversalContent): any {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": content.title,
      "description": content.seo?.description || content.content.substring(0, 160),
      "url": content.seo?.canonicalUrl || `https://your-site.com/${content.slug}`,
      "datePublished": content.publishedAt,
      "dateModified": content.updatedAt,
      "author": {
        "@type": "Person",
        "name": content.createdBy
      },
      "publisher": {
        "@type": "Organization",
        "name": content.metadata?.organization || "Your Organization"
      },
      "breadcrumb": content.metadata?.breadcrumb ? {
        "@type": "BreadcrumbList",
        "itemListElement": content.metadata.breadcrumb
      } : undefined
    };
  }
  
  /**
   * Generar schema de FAQ
   */
  private generateFAQPageSchema(content: UniversalContent): any {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": content.metadata?.faqs?.map((faq: any) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      })) || []
    };
  }
  
  /**
   * Generar schema de How-To
   */
  private generateHowToSchema(content: UniversalContent): any {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": content.title,
      "description": content.content,
      "image": this.getPrimaryImage(content),
      "totalTime": content.metadata?.totalTime || "PT30M",
      "estimatedCost": content.metadata?.estimatedCost ? {
        "@type": "MonetaryAmount",
        "currency": content.metadata.estimatedCost.currency || "USD",
        "value": content.metadata.estimatedCost.value
      } : undefined,
      "step": content.metadata?.steps?.map((step: any, index: number) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text,
        "image": step.image,
        "url": step.url
      })) || []
    };
  }
  
  /**
   * Determinar tipo de schema
   */
  private determineSchemaType(contentType: string): string {
    const schemaMapping: Record<string, string> = {
      'article': 'Article',
      'blog': 'BlogPosting',
      'newsletter': 'Article',
      'product': 'Product',
      'service': 'Service',
      'event': 'Event',
      'page': 'WebPage',
      'person': 'Person',
      'organization': 'Organization',
      'company': 'Organization',
      'team': 'Organization',
      'faq': 'FAQPage',
      'howto': 'HowTo',
      'tutorial': 'HowTo',
      'guide': 'HowTo',
      'form': 'WebPage',
      'landing': 'WebPage'
    };
    
    return schemaMapping[contentType] || 'WebPage';
  }
  
  /**
   * Obtener imagen principal
   */
  private getPrimaryImage(content: UniversalContent): string | undefined {
    if (content.media && content.media.length > 0) {
      return content.media[0].url;
    }
    
    if (content.seo?.ogImage) {
      return content.seo.ogImage;
    }
    
    return content.metadata?.defaultImage || undefined;
  }
  
  /**
   * Mejorar schema con metadata adicional
   */
  private enhanceSchemaWithMetadata(schema: any, content: UniversalContent): any {
    // Agregar metadata adicional si está disponible
    if (content.metadata?.schema) {
      return { ...schema, ...content.metadata.schema };
    }
    
    return schema;
  }
  
  /**
   * Validar schema
   */
  private validateSchema(schema: any, schemaType: string): any {
    // Validaciones básicas
    if (!schema['@context'] || !schema['@type']) {
      throw new Error('Invalid schema structure');
    }
    
    if (schema['@type'] !== schemaType) {
      schema['@type'] = schemaType;
    }
    
    // Validar campos requeridos según el tipo
    const requiredFields = this.getRequiredFields(schemaType);
    
    for (const field of requiredFields) {
      if (!schema[field]) {
        console.warn(`⚠️ Missing required field '${field}' for schema type '${schemaType}'`);
      }
    }
    
    return schema;
  }
  
  /**
   * Obtener campos requeridos por tipo de schema
   */
  private getRequiredFields(schemaType: string): string[] {
    const requiredFields: Record<string, string[]> = {
      'Article': ['headline'],
      'Product': ['name'],
      'Event': ['name', 'startDate'],
      'Organization': ['name'],
      'Person': ['name'],
      'WebPage': ['name']
    };
    
    return requiredFields[schemaType] || [];
  }
  
  /**
   * Optimizar schema para SEO
   */
  private optimizeSchemaForSEO(schema: any, content: UniversalContent): any {
    // Agregar campos SEO adicionales
    if (content.seo?.keywords) {
      schema.keywords = content.seo.keywords.join(', ');
    }
    
    if (content.seo?.canonicalUrl) {
      schema.url = content.seo.canonicalUrl;
    }
    
    // Agregar metadata de idioma
    if (content.metadata?.language) {
      schema.inLanguage = content.metadata.language;
    }
    
    // Agregar metadata de región
    if (content.metadata?.region) {
      schema.contentLocation = {
        "@type": "Place",
        "name": content.metadata.region
      };
    }
    
    return schema;
  }
  
  /**
   * Generar schema básico como fallback
   */
  private generateBasicSchema(content: UniversalContent): any {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": content.title,
      "description": content.seo?.description || content.content.substring(0, 160),
      "url": content.seo?.canonicalUrl || `https://your-site.com/${content.slug}`,
      "datePublished": content.publishedAt,
      "dateModified": content.updatedAt
    };
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
            content: 'You are a Schema.org expert. Generate valid JSON-LD schema markup only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
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
export interface SchemaGenerationOptions {
  enableAI?: boolean;
  validateSchema?: boolean;
  includeStructuredData?: boolean;
  optimizeForSEO?: boolean;
} 