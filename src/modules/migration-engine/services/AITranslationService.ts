import { UniversalContent } from '../types/universal-migration';

/**
 * Servicio de Traducción Automática con IA
 * 
 * Proporciona traducción automática de contenido durante la migración:
 * - Traducción de títulos y contenido
 * - Traducción de SEO metadata
 * - Traducción de schema markup
 * - Traducción de campos personalizados
 * - Múltiples proveedores de IA
 * - Control de calidad de traducción
 */
export class AITranslationService {
  
  private aiProvider: 'openai' | 'google' | 'deepl' | 'anthropic' = 'openai';
  private apiKey: string;
  private defaultSourceLanguage = 'auto';
  
  constructor(apiKey?: string, provider?: 'openai' | 'google' | 'deepl' | 'anthropic') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.aiProvider = provider || 'openai';
  }
  
  /**
   * Traducir contenido con IA
   */
  async translateContent(
    content: UniversalContent, 
    targetLanguages: string[],
    options?: TranslationOptions
  ): Promise<TranslatedContent[]> {
    
    // TODO: log '🌐 Iniciando traducción automática para idiomas:' targetLanguages
    
    const translationOptions = {
      preserveFormatting: true,
      maintainContext: true,
      culturalAdaptation: true,
      qualityCheck: true,
      ...options
    };
    
    const translations: TranslatedContent[] = [];
    
    try {
      for (const language of targetLanguages) {
        // TODO: log `🔄 Traduciendo a ${language}...`
        
        const translatedContent = await this.translateToLanguage(
          content, 
          language, 
          translationOptions
        );
        
        translations.push(translatedContent);
        // TODO: log `✅ Traducción a ${language} completada`
      }
      
      // TODO: log `🎯 Traducción completada: ${translations.length} idiomas`
      
      return translations;
      
    } catch (error) {
      // TODO: log '❌ Error en traducción automática:' error
      throw new Error(`AI translation failed: ${error.message}`);
    }
  }
  
  /**
   * Traducir a idioma específico
   */
  private async translateToLanguage(
    content: UniversalContent, 
    targetLanguage: string,
    options: TranslationOptions
  ): Promise<TranslatedContent> {
    
    // Traducir título
    const translatedTitle = await this.translateText(
      content.title, 
      this.defaultSourceLanguage, 
      targetLanguage,
      options
    );
    
    // Traducir contenido
    const translatedContent = await this.translateText(
      content.content, 
      this.defaultSourceLanguage, 
      targetLanguage,
      options
    );
    
    // Traducir SEO
    const translatedSEO = await this.translateSEO(content.seo, targetLanguage, options);
    
    // Traducir schema markup
    const translatedSchema = await this.translateSchema(content.schema, targetLanguage, options);
    
    // Traducir campos personalizados
    const translatedCustomFields = await this.translateCustomFields(
      content.customFields, 
      targetLanguage, 
      options
    );
    
    return {
      id: `${content.id}_${targetLanguage}`,
      originalId: content.id,
      language: targetLanguage,
      type: content.type,
      title: translatedTitle,
      content: translatedContent,
      slug: this.generateTranslatedSlug(translatedTitle, targetLanguage),
      status: content.status,
      publishedAt: content.publishedAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: content.createdBy,
      updatedBy: content.updatedBy,
      metadata: {
        ...content.metadata,
        originalLanguage: this.detectLanguage(content.title),
        translationProvider: this.aiProvider,
        translationQuality: 'premium',
        translationDate: new Date().toISOString(),
        culturalAdaptation: options.culturalAdaptation
      },
      seo: translatedSEO,
      schema: translatedSchema,
      media: content.media, // Media no se traduce
      relationships: content.relationships, // Relaciones no se traducen
      customFields: translatedCustomFields
    };
  }
  
  /**
   * Traducir texto con IA
   */
  private async translateText(
    text: string, 
    sourceLanguage: string, 
    targetLanguage: string,
    options: TranslationOptions
  ): Promise<string> {
    
    if (!text || text.trim().length === 0) {
      return text;
    }
    
    const prompt = `
      Translate this text from ${sourceLanguage} to ${targetLanguage}:
      
      Text: "${text}"
      
      Requirements:
      - Maintain original meaning and tone
      - Preserve technical terms appropriately
      - Ensure natural flow in ${targetLanguage}
      - Keep formatting and structure
      - ${options.culturalAdaptation ? 'Adapt to cultural context of ' + targetLanguage : ''}
      - ${options.preserveFormatting ? 'Preserve all formatting (HTML, markdown, etc.)' : ''}
      
      Return only the translated text, no explanations.
    `;
    
    const response = await this.callAI(prompt);
    
    // Verificar calidad si está habilitado
    if (options.qualityCheck) {
      const qualityScore = await this.checkTranslationQuality(text, response, targetLanguage);
      if (qualityScore < 0.7) {
        // TODO: log `⚠️ Low translation quality (${qualityScore}) for text: ${text.substring(0, 50)}...`
      }
    }
    
    return response;
  }
  
  /**
   * Traducir SEO metadata
   */
  private async translateSEO(
    seo: any, 
    targetLanguage: string,
    options: TranslationOptions
  ): Promise<any> {
    
    const translatedSEO: any = {};
    
    // Traducir campos de texto
    const textFields = ['title', 'description', 'ogTitle', 'ogDescription'];
    
    for (const field of textFields) {
      if (seo[field]) {
        translatedSEO[field] = await this.translateText(
          seo[field], 
          this.defaultSourceLanguage, 
          targetLanguage,
          options
        );
      }
    }
    
    // Traducir keywords
    if (seo.keywords && Array.isArray(seo.keywords)) {
      translatedSEO.keywords = await Promise.all(
        seo.keywords.map((keyword: string) => 
          this.translateText(keyword, this.defaultSourceLanguage, targetLanguage, options)
        )
      );
    }
    
    // Campos que no se traducen
    const nonTranslatableFields = ['canonicalUrl', 'ogImage', 'twitterCard', 'metaRobots'];
    
    for (const field of nonTranslatableFields) {
      if (seo[field]) {
        translatedSEO[field] = seo[field];
      }
    }
    
    return translatedSEO;
  }
  
  /**
   * Traducir schema markup
   */
  private async translateSchema(
    schema: any, 
    targetLanguage: string,
    options: TranslationOptions
  ): Promise<any> {
    
    if (!schema) return null;
    
    const translatedSchema = { ...schema };
    
    // Campos de texto que se pueden traducir en schema
    const translatableFields = ['name', 'description', 'headline', 'text', 'content'];
    
    for (const field of translatableFields) {
      if (schema[field]) {
        translatedSchema[field] = await this.translateText(
          schema[field], 
          this.defaultSourceLanguage, 
          targetLanguage,
          options
        );
      }
    }
    
    // Traducir campos anidados
    if (schema.author && schema.author.name) {
      translatedSchema.author.name = await this.translateText(
        schema.author.name, 
        this.defaultSourceLanguage, 
        targetLanguage,
        options
      );
    }
    
    if (schema.publisher && schema.publisher.name) {
      translatedSchema.publisher.name = await this.translateText(
        schema.publisher.name, 
        this.defaultSourceLanguage, 
        targetLanguage,
        options
      );
    }
    
    return translatedSchema;
  }
  
  /**
   * Traducir campos personalizados
   */
  private async translateCustomFields(
    customFields: Record<string, any>, 
    targetLanguage: string,
    options: TranslationOptions
  ): Promise<Record<string, any>> {
    
    const translatedFields: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(customFields)) {
      if (typeof value === 'string') {
        translatedFields[key] = await this.translateText(
          value, 
          this.defaultSourceLanguage, 
          targetLanguage,
          options
        );
      } else if (Array.isArray(value)) {
        translatedFields[key] = await Promise.all(
          value.map((item: any) => 
            typeof item === 'string' 
              ? this.translateText(item, this.defaultSourceLanguage, targetLanguage, options)
              : item
          )
        );
      } else if (typeof value === 'object' && value !== null) {
        // Traducir objetos anidados recursivamente
        translatedFields[key] = await this.translateCustomFields(value, targetLanguage, options);
      } else {
        translatedFields[key] = value; // No traducir otros tipos
      }
    }
    
    return translatedFields;
  }
  
  /**
   * Generar slug traducido
   */
  private generateTranslatedSlug(title: string, language: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${baseSlug}-${language}`;
  }
  
  /**
   * Detectar idioma del texto
   */
  private detectLanguage(text: string): string {
    // Implementación básica de detección de idioma
    // En producción, usar librería como 'langdetect'
    
    const languagePatterns = {
      'es': /[áéíóúñü]/i,
      'fr': /[àâäéèêëïîôùûüÿç]/i,
      'de': /[äöüß]/i,
      'it': /[àèéìíîòóù]/i,
      'pt': /[ãõâêîôûç]/i,
      'ru': /[а-яё]/i,
      'zh': /[\u4e00-\u9fff]/,
      'ja': /[\u3040-\u309f\u30a0-\u30ff]/,
      'ko': /[\uac00-\ud7af]/,
      'ar': /[\u0600-\u06ff]/,
      'he': /[\u0590-\u05ff]/,
      'th': /[\u0e00-\u0e7f]/
    };
    
    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }
    
    return 'en'; // Default a inglés
  }
  
  /**
   * Verificar calidad de traducción
   */
  private async checkTranslationQuality(
    original: string, 
    translated: string, 
    targetLanguage: string
  ): Promise<number> {
    
    const prompt = `
      Rate the translation quality from 0 to 1:
      
      Original: "${original}"
      Translated: "${translated}"
      Target Language: ${targetLanguage}
      
      Consider:
      - Accuracy of meaning
      - Natural flow
      - Grammar correctness
      - Cultural appropriateness
      
      Return only a number between 0 and 1, no explanations.
    `;
    
    try {
      const response = await this.callAI(prompt);
      const score = parseFloat(response);
      return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
    } catch (error) {
      // TODO: log 'Error checking translation quality:' error
      return 0.5; // Default score
    }
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
    const body = this.getAIBody(prompt);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return this.extractAIResponse(data);
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
      case 'deepl':
        return 'https://api-free.deepl.com/v2/translate';
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
      case 'deepl':
        return {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
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
   * Obtener body de IA
   */
  private getAIBody(prompt: string): any {
    switch (this.aiProvider) {
      case 'openai':
        return {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator. Provide only the translated text, no explanations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        };
      case 'google':
        return {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000
          }
        };
      case 'deepl':
        return {
          text: [prompt],
          target_lang: 'EN' // DeepL requiere especificar idioma objetivo
        };
      case 'anthropic':
        return {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        };
      default:
        return {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator. Provide only the translated text, no explanations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        };
    }
  }
  
  /**
   * Extraer respuesta de IA
   */
  private extractAIResponse(data: any): string {
    switch (this.aiProvider) {
      case 'openai':
        return data.choices[0]?.message?.content || '';
      case 'google':
        return data.candidates[0]?.content?.parts[0]?.text || '';
      case 'deepl':
        return data.translations[0]?.text || '';
      case 'anthropic':
        return data.content[0]?.text || '';
      default:
        return data.choices[0]?.message?.content || '';
    }
  }
}

// Tipos adicionales
export interface TranslationOptions {
  preserveFormatting?: boolean;
  maintainContext?: boolean;
  culturalAdaptation?: boolean;
  qualityCheck?: boolean;
}

export interface TranslatedContent extends UniversalContent {
  originalId: string;
  language: string;
} 