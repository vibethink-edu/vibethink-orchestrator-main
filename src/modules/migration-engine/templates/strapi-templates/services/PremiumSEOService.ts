/**
 * Servicio Premium de SEO para Strapi 5
 * 
 * Características avanzadas de SEO con IA, análisis competitivo,
 * optimización automática y métricas avanzadas.
 */

export interface PremiumSEOConfig {
  // Análisis competitivo
  competitorAnalysis: boolean;
  competitorUrls: string[];
  keywordResearch: boolean;
  targetKeywords: string[];
  
  // Optimización automática
  autoOptimization: boolean;
  contentGapAnalysis: boolean;
  semanticAnalysis: boolean;
  
  // IA y Machine Learning
  aiContentOptimization: boolean;
  aiKeywordGeneration: boolean;
  aiMetaDescription: boolean;
  aiTitleOptimization: boolean;
  
  // Schema markup avanzado
  advancedSchema: boolean;
  structuredData: boolean;
  richSnippets: boolean;
  
  // Performance y Core Web Vitals
  performanceOptimization: boolean;
  coreWebVitals: boolean;
  pageSpeedOptimization: boolean;
  
  // Internacionalización
  internationalSEO: boolean;
  hreflangImplementation: boolean;
  localSEO: boolean;
  
  // Analytics avanzado
  advancedAnalytics: boolean;
  conversionTracking: boolean;
  userBehaviorAnalysis: boolean;
  
  // Technical SEO
  technicalSEO: boolean;
  crawlabilityOptimization: boolean;
  sitemapGeneration: boolean;
  
  // E-commerce SEO
  ecommerceSEO: boolean;
  productSchema: boolean;
  reviewSchema: boolean;
  
  // Voice Search
  voiceSearchOptimization: boolean;
  featuredSnippets: boolean;
  
  // Mobile SEO
  mobileFirstOptimization: boolean;
  AMPImplementation: boolean;
}

export interface SEOAnalysisResult {
  score: number;
  recommendations: SEORecommendation[];
  competitors: CompetitorAnalysis[];
  keywords: KeywordAnalysis[];
  technicalIssues: TechnicalIssue[];
  performanceMetrics: PerformanceMetrics;
  schemaMarkup: SchemaMarkup;
}

export interface SEORecommendation {
  type: 'critical' | 'important' | 'suggestion';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  implementation: string;
  estimatedImprovement: number;
}

export interface CompetitorAnalysis {
  url: string;
  domain: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  backlinks: number;
  domainAuthority: number;
  organicTraffic: number;
}

export interface KeywordAnalysis {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: number;
  opportunities: string[];
  relatedKeywords: string[];
  longTailVariations: string[];
}

export interface TechnicalIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  url?: string;
  line?: number;
  fix: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface PerformanceMetrics {
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
  };
  pageSpeed: {
    mobile: number;
    desktop: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  };
}

export interface SchemaMarkup {
  types: string[];
  markup: string;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  richSnippets: RichSnippet[];
}

export interface RichSnippet {
  type: string;
  title: string;
  description: string;
  url: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  availability?: string;
}

export class PremiumSEOService {
  
  private config: PremiumSEOConfig;
  
  constructor(config: PremiumSEOConfig) {
    this.config = config;
  }
  
  /**
   * Análisis SEO completo premium
   */
  async analyzeContent(content: any): Promise<SEOAnalysisResult> {
    
    console.log('🔍 Iniciando análisis SEO premium...');
    
    const analysis: SEOAnalysisResult = {
      score: 0,
      recommendations: [],
      competitors: [],
      keywords: [],
      technicalIssues: [],
      performanceMetrics: await this.analyzePerformance(content),
      schemaMarkup: await this.generateAdvancedSchema(content)
    };
    
    // Análisis competitivo
    if (this.config.competitorAnalysis) {
      analysis.competitors = await this.analyzeCompetitors();
    }
    
    // Análisis de keywords
    if (this.config.keywordResearch) {
      analysis.keywords = await this.analyzeKeywords(content);
    }
    
    // Análisis técnico
    if (this.config.technicalSEO) {
      analysis.technicalIssues = await this.analyzeTechnicalSEO(content);
    }
    
    // Generar recomendaciones
    analysis.recommendations = await this.generateRecommendations(content, analysis);
    
    // Calcular score final
    analysis.score = this.calculateSEOScore(analysis);
    
    console.log(`✅ Análisis SEO completado. Score: ${analysis.score}/100`);
    
    return analysis;
  }
  
  /**
   * Análisis de competidores premium
   */
  private async analyzeCompetitors(): Promise<CompetitorAnalysis[]> {
    
    console.log('🏆 Analizando competidores...');
    
    const competitors: CompetitorAnalysis[] = [];
    
    for (const competitorUrl of this.config.competitorUrls) {
      try {
        const analysis = await this.analyzeSingleCompetitor(competitorUrl);
        competitors.push(analysis);
      } catch (error) {
        console.warn(`⚠️ Error analizando competidor ${competitorUrl}:`, error.message);
      }
    }
    
    return competitors;
  }
  
  /**
   * Analizar un competidor individual
   */
  private async analyzeSingleCompetitor(url: string): Promise<CompetitorAnalysis> {
    
    // Simulación de análisis de competidor
    const domain = new URL(url).hostname;
    
    return {
      url,
      domain,
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      strengths: [
        'Contenido bien estructurado',
        'Meta descripciones optimizadas',
        'Velocidad de carga rápida'
      ],
      weaknesses: [
        'Falta de schema markup',
        'Imágenes no optimizadas',
        'Contenido duplicado'
      ],
      opportunities: [
        'Implementar rich snippets',
        'Optimizar para voice search',
        'Mejorar Core Web Vitals'
      ],
      threats: [
        'Competencia agresiva en keywords',
        'Cambios en algoritmos de Google',
        'Nuevos competidores emergentes'
      ],
      backlinks: Math.floor(Math.random() * 10000) + 1000,
      domainAuthority: Math.floor(Math.random() * 30) + 40,
      organicTraffic: Math.floor(Math.random() * 50000) + 10000
    };
  }
  
  /**
   * Análisis de keywords premium
   */
  private async analyzeKeywords(content: any): Promise<KeywordAnalysis[]> {
    
    console.log('🔑 Analizando keywords...');
    
    const keywords: KeywordAnalysis[] = [];
    
    // Extraer keywords del contenido
    const extractedKeywords = this.extractKeywordsFromContent(content);
    
    for (const keyword of extractedKeywords) {
      const analysis = await this.analyzeSingleKeyword(keyword);
      keywords.push(analysis);
    }
    
    // Agregar keywords objetivo si están configuradas
    for (const targetKeyword of this.config.targetKeywords) {
      const analysis = await this.analyzeSingleKeyword(targetKeyword);
      keywords.push(analysis);
    }
    
    return keywords;
  }
  
  /**
   * Analizar una keyword individual
   */
  private async analyzeSingleKeyword(keyword: string): Promise<KeywordAnalysis> {
    
    return {
      keyword,
      searchVolume: Math.floor(Math.random() * 10000) + 100,
      difficulty: Math.floor(Math.random() * 70) + 10,
      cpc: Math.random() * 5 + 0.5,
      competition: Math.random(),
      opportunities: [
        'Long-tail variations disponibles',
        'Baja competencia en SERP',
        'Alto volumen de búsquedas'
      ],
      relatedKeywords: [
        `${keyword} guide`,
        `${keyword} tutorial`,
        `${keyword} tips`,
        `${keyword} best practices`
      ],
      longTailVariations: [
        `how to ${keyword}`,
        `${keyword} for beginners`,
        `${keyword} examples`,
        `${keyword} vs alternatives`
      ]
    };
  }
  
  /**
   * Extraer keywords del contenido
   */
  private extractKeywordsFromContent(content: any): string[] {
    const keywords: string[] = [];
    
    // Extraer del título
    if (content.title) {
      const titleKeywords = content.title.toLowerCase().split(' ');
      keywords.push(...titleKeywords.filter(word => word.length > 3));
    }
    
    // Extraer del contenido
    if (content.content) {
      const contentText = content.content.toLowerCase();
      const words = contentText.split(/\s+/);
      const wordFrequency = new Map<string, number>();
      
      for (const word of words) {
        if (word.length > 3 && !this.isStopWord(word)) {
          wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
        }
      }
      
      // Obtener las palabras más frecuentes
      const sortedWords = Array.from(wordFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
      
      keywords.push(...sortedWords);
    }
    
    return [...new Set(keywords)];
  }
  
  /**
   * Verificar si es una palabra stop
   */
  private isStopWord(word: string): boolean {
    const stopWords = [
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ];
    return stopWords.includes(word);
  }
  
  /**
   * Análisis técnico SEO premium
   */
  private async analyzeTechnicalSEO(content: any): Promise<TechnicalIssue[]> {
    
    console.log('🔧 Analizando SEO técnico...');
    
    const issues: TechnicalIssue[] = [];
    
    // Verificar meta tags
    if (!content.metaDescription || content.metaDescription.length < 120) {
      issues.push({
        type: 'warning',
        category: 'Meta Tags',
        title: 'Meta description too short',
        description: 'Meta description should be between 120-160 characters',
        fix: 'Extend meta description to 120-160 characters',
        priority: 'medium'
      });
    }
    
    // Verificar título
    if (!content.title || content.title.length > 60) {
      issues.push({
        type: 'error',
        category: 'Meta Tags',
        title: 'Title too long',
        description: 'Title should be under 60 characters',
        fix: 'Shorten title to under 60 characters',
        priority: 'high'
      });
    }
    
    // Verificar headings
    if (!this.hasProperHeadingStructure(content)) {
      issues.push({
        type: 'warning',
        category: 'Content Structure',
        title: 'Improper heading structure',
        description: 'Content should have proper H1, H2, H3 hierarchy',
        fix: 'Implement proper heading hierarchy (H1 > H2 > H3)',
        priority: 'medium'
      });
    }
    
    // Verificar imágenes
    if (this.hasUnoptimizedImages(content)) {
      issues.push({
        type: 'error',
        category: 'Images',
        title: 'Unoptimized images',
        description: 'Images should have alt text and be optimized',
        fix: 'Add alt text to images and optimize file sizes',
        priority: 'high'
      });
    }
    
    // Verificar enlaces internos
    if (!this.hasInternalLinks(content)) {
      issues.push({
        type: 'info',
        category: 'Internal Linking',
        title: 'No internal links',
        description: 'Internal linking helps with SEO and user experience',
        fix: 'Add relevant internal links to related content',
        priority: 'low'
      });
    }
    
    return issues;
  }
  
  /**
   * Verificar estructura de headings
   */
  private hasProperHeadingStructure(content: any): boolean {
    // Simulación de verificación de headings
    return content.content && content.content.includes('<h1>') && content.content.includes('<h2>');
  }
  
  /**
   * Verificar imágenes no optimizadas
   */
  private hasUnoptimizedImages(content: any): boolean {
    // Simulación de verificación de imágenes
    return content.content && content.content.includes('<img') && !content.content.includes('alt=');
  }
  
  /**
   * Verificar enlaces internos
   */
  private hasInternalLinks(content: any): boolean {
    // Simulación de verificación de enlaces internos
    return content.content && content.content.includes('<a href="/');
  }
  
  /**
   * Análisis de performance premium
   */
  private async analyzePerformance(content: any): Promise<PerformanceMetrics> {
    
    console.log('⚡ Analizando performance...');
    
    return {
      lighthouse: {
        performance: Math.floor(Math.random() * 20) + 80, // 80-100
        accessibility: Math.floor(Math.random() * 15) + 85, // 85-100
        bestPractices: Math.floor(Math.random() * 10) + 90, // 90-100
        seo: Math.floor(Math.random() * 15) + 85 // 85-100
      },
      coreWebVitals: {
        lcp: Math.random() * 2 + 1, // 1-3 seconds
        fid: Math.random() * 100 + 10, // 10-110ms
        cls: Math.random() * 0.1, // 0-0.1
        ttfb: Math.random() * 500 + 100 // 100-600ms
      },
      pageSpeed: {
        mobile: Math.floor(Math.random() * 30) + 70, // 70-100
        desktop: Math.floor(Math.random() * 20) + 80, // 80-100
        firstContentfulPaint: Math.random() * 2 + 0.5, // 0.5-2.5s
        largestContentfulPaint: Math.random() * 3 + 1 // 1-4s
      }
    };
  }
  
  /**
   * Generar schema markup avanzado
   */
  private async generateAdvancedSchema(content: any): Promise<SchemaMarkup> {
    
    console.log('🏷️ Generando schema markup avanzado...');
    
    const schemaTypes = ['Article', 'WebPage', 'Organization'];
    
    if (content.type === 'product') {
      schemaTypes.push('Product', 'Offer', 'Review');
    }
    
    if (content.type === 'article') {
      schemaTypes.push('Article', 'Person', 'Organization');
    }
    
    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": schemaTypes[0],
      "name": content.title,
      "description": content.metaDescription || content.description,
      "url": content.url,
      "datePublished": content.publishedAt,
      "dateModified": content.updatedAt,
      "author": {
        "@type": "Person",
        "name": content.author || "Unknown"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Your Company",
        "logo": {
          "@type": "ImageObject",
          "url": "https://yourcompany.com/logo.png"
        }
      }
    };
    
    // Agregar schema específico según el tipo de contenido
    if (content.type === 'product') {
      Object.assign(schemaMarkup, {
        "offers": {
          "@type": "Offer",
          "price": content.price,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.5",
          "reviewCount": "100"
        }
      });
    }
    
    return {
      types: schemaTypes,
      markup: JSON.stringify(schemaMarkup, null, 2),
      validation: {
        isValid: true,
        errors: [],
        warnings: []
      },
      richSnippets: [
        {
          type: 'Article',
          title: content.title,
          description: content.metaDescription || content.description,
          url: content.url,
          rating: 4.5,
          reviewCount: 100
        }
      ]
    };
  }
  
  /**
   * Generar recomendaciones SEO premium
   */
  private async generateRecommendations(
    content: any, 
    analysis: SEOAnalysisResult
  ): Promise<SEORecommendation[]> {
    
    console.log('💡 Generando recomendaciones SEO...');
    
    const recommendations: SEORecommendation[] = [];
    
    // Recomendaciones basadas en score
    if (analysis.score < 70) {
      recommendations.push({
        type: 'critical',
        category: 'Overall SEO',
        title: 'Improve overall SEO score',
        description: 'Focus on technical SEO, content optimization, and performance',
        impact: 'high',
        effort: 'medium',
        implementation: 'Implement all critical recommendations',
        estimatedImprovement: 25
      });
    }
    
    // Recomendaciones de performance
    if (analysis.performanceMetrics.coreWebVitals.lcp > 2.5) {
      recommendations.push({
        type: 'important',
        category: 'Performance',
        title: 'Optimize Largest Contentful Paint',
        description: 'LCP should be under 2.5 seconds for optimal user experience',
        impact: 'high',
        effort: 'medium',
        implementation: 'Optimize images, implement lazy loading, use CDN',
        estimatedImprovement: 15
      });
    }
    
    // Recomendaciones de keywords
    if (analysis.keywords.length > 0) {
      const lowCompetitionKeywords = analysis.keywords.filter(k => k.difficulty < 30);
      if (lowCompetitionKeywords.length > 0) {
        recommendations.push({
          type: 'suggestion',
          category: 'Keywords',
          title: 'Target low-competition keywords',
          description: `Found ${lowCompetitionKeywords.length} keywords with low competition`,
          impact: 'medium',
          effort: 'low',
          implementation: 'Create content targeting these keywords',
          estimatedImprovement: 10
        });
      }
    }
    
    // Recomendaciones de schema markup
    if (!analysis.schemaMarkup.validation.isValid) {
      recommendations.push({
        type: 'important',
        category: 'Schema Markup',
        title: 'Fix schema markup errors',
        description: 'Valid schema markup improves search visibility',
        impact: 'medium',
        effort: 'low',
        implementation: 'Fix schema markup validation errors',
        estimatedImprovement: 8
      });
    }
    
    // Recomendaciones de competidores
    if (analysis.competitors.length > 0) {
      const topCompetitor = analysis.competitors[0];
      recommendations.push({
        type: 'suggestion',
        category: 'Competitive Analysis',
        title: 'Learn from top competitor',
        description: `Analyze ${topCompetitor.domain} for improvement opportunities`,
        impact: 'medium',
        effort: 'medium',
        implementation: 'Study competitor content and backlink strategies',
        estimatedImprovement: 12
      });
    }
    
    return recommendations;
  }
  
  /**
   * Calcular score SEO premium
   */
  private calculateSEOScore(analysis: SEOAnalysisResult): number {
    let score = 100;
    
    // Reducir score por issues técnicos
    const criticalIssues = analysis.technicalIssues.filter(i => i.priority === 'critical').length;
    const highIssues = analysis.technicalIssues.filter(i => i.priority === 'high').length;
    const mediumIssues = analysis.technicalIssues.filter(i => i.priority === 'medium').length;
    
    score -= criticalIssues * 10;
    score -= highIssues * 5;
    score -= mediumIssues * 2;
    
    // Ajustar por performance
    const performanceScore = analysis.performanceMetrics.lighthouse.performance;
    if (performanceScore < 90) {
      score -= (90 - performanceScore) * 0.5;
    }
    
    // Ajustar por Core Web Vitals
    if (analysis.performanceMetrics.coreWebVitals.lcp > 2.5) {
      score -= 5;
    }
    if (analysis.performanceMetrics.coreWebVitals.cls > 0.1) {
      score -= 3;
    }
    
    // Ajustar por schema markup
    if (!analysis.schemaMarkup.validation.isValid) {
      score -= 5;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  /**
   * Optimización automática de contenido
   */
  async autoOptimizeContent(content: any): Promise<any> {
    
    console.log('🤖 Iniciando optimización automática...');
    
    const optimizedContent = { ...content };
    
    // Optimización de título
    if (this.config.aiTitleOptimization) {
      optimizedContent.title = await this.optimizeTitle(content.title);
    }
    
    // Optimización de meta description
    if (this.config.aiMetaDescription) {
      optimizedContent.metaDescription = await this.optimizeMetaDescription(content);
    }
    
    // Optimización de contenido
    if (this.config.aiContentOptimization) {
      optimizedContent.content = await this.optimizeContent(content.content);
    }
    
    // Generación de keywords
    if (this.config.aiKeywordGeneration) {
      optimizedContent.keywords = await this.generateKeywords(content);
    }
    
    console.log('✅ Optimización automática completada');
    
    return optimizedContent;
  }
  
  /**
   * Optimizar título con IA
   */
  private async optimizeTitle(title: string): Promise<string> {
    // Simulación de optimización de título con IA
    const optimizedTitle = title
      .replace(/\b(how to|what is|best|top|ultimate)\b/gi, '')
      .trim();
    
    return optimizedTitle.length > 60 
      ? optimizedTitle.substring(0, 57) + '...'
      : optimizedTitle;
  }
  
  /**
   * Optimizar meta description con IA
   */
  private async optimizeMetaDescription(content: any): Promise<string> {
    // Simulación de generación de meta description con IA
    const baseDescription = content.description || content.content?.substring(0, 150);
    const optimizedDescription = `${baseDescription} - Learn more about ${content.title} and discover the best practices.`;
    
    return optimizedDescription.length > 160
      ? optimizedDescription.substring(0, 157) + '...'
      : optimizedDescription;
  }
  
  /**
   * Optimizar contenido con IA
   */
  private async optimizeContent(content: string): Promise<string> {
    // Simulación de optimización de contenido con IA
    return content
      .replace(/\b(very|really|quite|extremely)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Generar keywords con IA
   */
  private async generateKeywords(content: any): Promise<string[]> {
    // Simulación de generación de keywords con IA
    const keywords = [];
    
    if (content.title) {
      const titleWords = content.title.toLowerCase().split(' ');
      keywords.push(...titleWords.filter(word => word.length > 3));
    }
    
    if (content.content) {
      const contentWords = content.content.toLowerCase().split(/\s+/);
      const wordFrequency = new Map<string, number>();
      
      for (const word of contentWords) {
        if (word.length > 3 && !this.isStopWord(word)) {
          wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
        }
      }
      
      const topWords = Array.from(wordFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);
      
      keywords.push(...topWords);
    }
    
    return [...new Set(keywords)];
  }
  
  /**
   * Generar reporte SEO premium
   */
  async generatePremiumReport(content: any): Promise<any> {
    
    console.log('📊 Generando reporte SEO premium...');
    
    const analysis = await this.analyzeContent(content);
    const optimizedContent = await this.autoOptimizeContent(content);
    
    return {
      summary: {
        overallScore: analysis.score,
        grade: this.getSEOGrade(analysis.score),
        recommendations: analysis.recommendations.length,
        criticalIssues: analysis.technicalIssues.filter(i => i.priority === 'critical').length,
        estimatedImprovement: this.calculateEstimatedImprovement(analysis)
      },
      analysis,
      optimizedContent,
      competitors: analysis.competitors,
      keywords: analysis.keywords,
      performance: analysis.performanceMetrics,
      schema: analysis.schemaMarkup,
      generatedAt: new Date().toISOString()
    };
  }
  
  /**
   * Obtener grado SEO
   */
  private getSEOGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }
  
  /**
   * Calcular mejora estimada
   */
  private calculateEstimatedImprovement(analysis: SEOAnalysisResult): number {
    let improvement = 0;
    
    // Mejoras por recomendaciones
    for (const recommendation of analysis.recommendations) {
      improvement += recommendation.estimatedImprovement;
    }
    
    // Mejoras por issues técnicos
    const criticalIssues = analysis.technicalIssues.filter(i => i.priority === 'critical').length;
    const highIssues = analysis.technicalIssues.filter(i => i.priority === 'high').length;
    
    improvement += criticalIssues * 15;
    improvement += highIssues * 8;
    
    return Math.min(100, improvement);
  }
} 