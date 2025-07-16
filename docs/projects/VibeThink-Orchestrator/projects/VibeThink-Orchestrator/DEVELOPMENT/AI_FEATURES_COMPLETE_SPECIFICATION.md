# 🤖 ESPECIFICACIONES AI: Social Media Optimization

**Proyecto**: AI Pair Orchestrator Pro - Social Media AI Features  
**Equipo**: Development AI Team  
**Integración**: Social Media Scheduling Module  
**Framework**: OpenAI GPT-4 + Custom Models  

---

## 🎯 **OBJETIVOS DE IA**

### **Funcionalidades de IA Obligatorias**
```yaml
CORE_AI_FEATURES:
  content_optimization:
    description: "Optimizar contenido para cada plataforma"
    input: "Texto original del usuario"
    output: "Versiones optimizadas por plataforma"
    priority: "MUST HAVE"
    
  hashtag_suggestions:
    description: "Sugerir hashtags relevantes"
    input: "Contenido del post + industria/nicho"
    output: "Lista de hashtags con scores de relevancia"
    priority: "MUST HAVE"
    
  posting_timing:
    description: "Sugerir mejores horarios de publicación"
    input: "Audience data + historical performance"
    output: "Horarios óptimos por plataforma"
    priority: "SHOULD HAVE"
    
  content_analysis:
    description: "Analizar tono y sentiment del contenido"
    input: "Texto del post"
    output: "Análisis de tono, sentiment, engagement prediction"
    priority: "SHOULD HAVE"
    
  image_optimization:
    description: "Sugerir mejoras en imágenes"
    input: "Imagen + contexto del post"
    output: "Sugerencias de crop, filtros, texto overlay"
    priority: "COULD HAVE"
```

---

## 🧠 **ARQUITECTURA DE IA**

### **Stack de IA Obligatorio**
```typescript
// AI Services Architecture
interface AIServiceConfig {
  openai: {
    apiKey: string;
    model: 'gpt-4' | 'gpt-4-turbo';
    maxTokens: number;
    temperature: number;
  };
  
  customModels: {
    hashtagModel: string; // Modelo custom para hashtags
    timingModel: string;  // Modelo para timing optimization
  };
  
  fallbacks: {
    enabled: boolean;
    fallbackService: 'anthropic' | 'google-ai';
  };
}

// Core AI Service
@Injectable()
export class SocialMediaAIService {
  constructor(
    private openai: OpenAIService,
    private hashtagService: HashtagOptimizationService,
    private timingService: TimingOptimizationService,
    private contentAnalysisService: ContentAnalysisService,
  ) {}
  
  async optimizePost(input: PostOptimizationInput): Promise<PostOptimizationOutput> {
    // Implementación obligatoria
  }
}
```

### **Integración con Módulo Principal**
```typescript
// En PostsService - integración obligatoria
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private aiService: SocialMediaAIService, // ← AI Integration
  ) {}
  
  async createPost(data: CreatePostDto, userId: string): Promise<Post> {
    // 1. Crear post base
    const post = await this.prisma.post.create({
      data: {
        ...data,
        userId,
        status: 'DRAFT',
      },
    });
    
    // 2. Aplicar optimizaciones de AI (OBLIGATORIO)
    if (data.enableAI) {
      const aiOptimizations = await this.aiService.optimizePost({
        content: data.content,
        platforms: data.platforms,
        mediaUrls: data.mediaUrls,
        targetAudience: data.targetAudience,
      });
      
      // 3. Guardar sugerencias de AI
      await this.prisma.post.update({
        where: { id: post.id },
        data: {
          aiOptimized: true,
          aiSuggestions: aiOptimizations,
        },
      });
    }
    
    return post;
  }
}
```

---

## 🎨 **ESPECIFICACIONES DETALLADAS**

### **1. Content Optimization**
```typescript
// Interfaz obligatoria
interface ContentOptimizationInput {
  originalContent: string;
  platforms: Platform[];
  targetAudience?: {
    demographics: string;
    interests: string[];
    industry: string;
  };
  contentType: 'promotional' | 'educational' | 'entertainment' | 'news';
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative';
}

interface ContentOptimizationOutput {
  optimizedContent: {
    [key in Platform]: {
      content: string;
      hashtags: string[];
      mentions: string[];
      characterCount: number;
      optimizationScore: number; // 0-100
      changes: string[]; // Lista de cambios aplicados
    };
  };
  
  globalSuggestions: {
    toneAdjustments: string[];
    engagementTips: string[];
    callToActionSuggestions: string[];
  };
}

// Implementación obligatoria
export class ContentOptimizationService {
  async optimizeContent(input: ContentOptimizationInput): Promise<ContentOptimizationOutput> {
    const prompt = this.buildOptimizationPrompt(input);
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: CONTENT_OPTIMIZATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Más determinístico para consistencia
      max_tokens: 2000,
    });
    
    return this.parseOptimizationResponse(response.choices[0].message.content);
  }
  
  private buildOptimizationPrompt(input: ContentOptimizationInput): string {
    return `
    Optimize the following social media content for multiple platforms:
    
    Original Content: "${input.originalContent}"
    Target Platforms: ${input.platforms.join(', ')}
    Content Type: ${input.contentType}
    Tone: ${input.tone}
    ${input.targetAudience ? `Target Audience: ${JSON.stringify(input.targetAudience)}` : ''}
    
    Requirements:
    1. Adapt content for each platform's character limits and best practices
    2. Suggest relevant hashtags (max 30 for Instagram, 5-10 for others)
    3. Optimize for engagement while maintaining the original message
    4. Ensure content aligns with platform-specific audience expectations
    5. Suggest call-to-action when appropriate
    
    Return in JSON format with the structure specified in ContentOptimizationOutput.
    `;
  }
}

// System Prompt obligatorio
const CONTENT_OPTIMIZATION_SYSTEM_PROMPT = `
You are an expert social media manager and content optimizer with deep knowledge of platform-specific best practices. Your goal is to help users maximize engagement while maintaining authenticity.

Platform-specific knowledge:
- Instagram: Visual-first, hashtag-heavy, stories and posts, younger demographic
- Facebook: Community-focused, longer-form content acceptable, diverse age groups
- Twitter: Brevity, real-time, hashtags for discovery, news and discussions
- LinkedIn: Professional tone, industry insights, networking focus
- TikTok: Entertainment, trends, short-form video descriptions

Optimization principles:
1. Maintain the core message and brand voice
2. Adapt language and format for each platform's culture
3. Optimize for platform algorithms (engagement, timing, hashtags)
4. Suggest improvements without being pushy or over-promotional
5. Consider accessibility and inclusivity
6. Balance optimization with authenticity

Always provide specific, actionable suggestions with clear reasoning.
`;
```

### **2. Hashtag Suggestions**
```typescript
interface HashtagSuggestionInput {
  content: string;
  platform: Platform;
  industry?: string;
  location?: string;
  contentType: 'promotional' | 'educational' | 'entertainment' | 'news';
}

interface HashtagSuggestionOutput {
  primary: HashtagSuggestion[];     // 5-10 hashtags principales
  secondary: HashtagSuggestion[];   // 10-20 hashtags secundarios
  trending: HashtagSuggestion[];    // 3-5 hashtags trending
  branded: HashtagSuggestion[];     // 2-3 hashtags de marca
  
  strategy: {
    recommended_count: number;
    mix_strategy: string;
    placement_tips: string[];
  };
}

interface HashtagSuggestion {
  hashtag: string;
  relevanceScore: number;    // 0-100
  popularityScore: number;   // 0-100 (alto = más competitivo)
  difficulty: 'low' | 'medium' | 'high';
  estimatedReach: number;
  category: 'niche' | 'moderate' | 'popular' | 'trending';
}

export class HashtagOptimizationService {
  async suggestHashtags(input: HashtagSuggestionInput): Promise<HashtagSuggestionOutput> {
    // 1. Generar hashtags con OpenAI
    const aiHashtags = await this.generateHashtagsWithAI(input);
    
    // 2. Validar y enriquecer con datos reales (si disponible)
    const enrichedHashtags = await this.enrichHashtagData(aiHashtags, input.platform);
    
    // 3. Categorizar y scoring
    return this.categorizeAndScore(enrichedHashtags, input);
  }
  
  private async generateHashtagsWithAI(input: HashtagSuggestionInput): Promise<string[]> {
    const prompt = `
    Generate relevant hashtags for this social media post:
    
    Content: "${input.content}"
    Platform: ${input.platform}
    Industry: ${input.industry || 'general'}
    Content Type: ${input.contentType}
    
    Requirements:
    - Generate 30-50 hashtags of varying popularity levels
    - Include mix of: niche-specific, industry-related, general, and trending
    - Consider platform-specific hashtag culture
    - Avoid banned or shadowbanned hashtags
    - Include both single-word and phrase hashtags
    
    Return as JSON array of hashtag strings (without # symbol).
    `;
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: HASHTAG_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    });
    
    return JSON.parse(response.choices[0].message.content);
  }
}

const HASHTAG_SYSTEM_PROMPT = `
You are a social media hashtag expert with deep knowledge of platform algorithms and hashtag strategies. 

Key principles:
1. Mix high, medium, and low competition hashtags (80/20 rule)
2. Platform-specific hashtag cultures and limits
3. Avoid over-popular hashtags that get buried
4. Include community and niche hashtags for engagement
5. Consider hashtag lifecycle and trends
6. Ensure hashtags are actually relevant to content

Platform specifics:
- Instagram: 10-30 hashtags, mix of sizes, hashtag stories
- Facebook: 1-5 hashtags, more reserved usage
- Twitter: 1-3 hashtags, conversational integration
- LinkedIn: 3-5 hashtags, professional focus
- TikTok: 3-5 hashtags, trend-focused

Always prioritize relevance over popularity.
`;
```

### **3. Timing Optimization**
```typescript
interface TimingOptimizationInput {
  userId: string;
  platforms: Platform[];
  contentType: 'promotional' | 'educational' | 'entertainment' | 'news';
  targetAudience?: {
    timezone: string;
    demographics: string;
    behavior_patterns?: any;
  };
  historical_data?: PostAnalytics[];
}

interface TimingOptimizationOutput {
  recommendations: {
    [key in Platform]: {
      optimal_times: OptimalTime[];
      best_days: string[];
      avoid_times: string[];
      reasoning: string;
    };
  };
  
  general_strategy: {
    posting_frequency: string;
    optimal_intervals: string;
    seasonal_considerations: string[];
  };
}

interface OptimalTime {
  time: string; // "09:00"
  day: string;  // "Monday"
  confidence: number; // 0-100
  expected_engagement: number; // Relative score
  timezone: string;
}

export class TimingOptimizationService {
  async optimizePostingTimes(input: TimingOptimizationInput): Promise<TimingOptimizationOutput> {
    // 1. Analizar datos históricos del usuario (si disponible)
    const userInsights = await this.analyzeUserHistoricalData(input);
    
    // 2. Aplicar conocimiento general de plataformas
    const platformInsights = await this.getPlatformGeneralInsights(input);
    
    // 3. Combinar con AI para recomendaciones personalizadas
    const aiRecommendations = await this.generateTimingRecommendations(input, userInsights, platformInsights);
    
    return aiRecommendations;
  }
  
  private async generateTimingRecommendations(
    input: TimingOptimizationInput,
    userInsights: any,
    platformInsights: any
  ): Promise<TimingOptimizationOutput> {
    const prompt = `
    Analyze and recommend optimal posting times for social media content:
    
    Platforms: ${input.platforms.join(', ')}
    Content Type: ${input.contentType}
    Target Audience: ${JSON.stringify(input.targetAudience)}
    User Historical Data: ${JSON.stringify(userInsights)}
    Platform General Insights: ${JSON.stringify(platformInsights)}
    
    Provide specific time recommendations considering:
    1. Platform-specific peak engagement times
    2. Target audience timezone and behavior
    3. Content type performance patterns
    4. Competition and content saturation times
    5. User's historical performance (if available)
    
    Return detailed recommendations in JSON format.
    `;
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: TIMING_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    });
    
    return JSON.parse(response.choices[0].message.content);
  }
}

const TIMING_SYSTEM_PROMPT = `
You are a social media timing and engagement expert with deep knowledge of platform algorithms and user behavior patterns.

Key knowledge:
1. Platform-specific peak hours and user activity patterns
2. Industry-specific optimal posting times
3. Timezone considerations and global audience behavior
4. Content type impact on optimal timing
5. Competition analysis and content saturation
6. Seasonal and weekly patterns

Platform timing knowledge:
- Instagram: 11 AM - 1 PM, 7-9 PM weekdays; varies by audience
- Facebook: 9 AM - 10 AM, 3-4 PM weekdays
- Twitter: 8-10 AM, 7-9 PM; real-time nature varies
- LinkedIn: 8-10 AM, 12 PM, 5-6 PM business days
- TikTok: 6-10 AM, 7-9 PM; varies by region

Always provide timezone-specific recommendations and explain reasoning.
`;
```

### **4. Content Analysis & Engagement Prediction**
```typescript
interface ContentAnalysisInput {
  content: string;
  platform: Platform;
  mediaUrls?: string[];
  historicalPosts?: PostAnalytics[];
}

interface ContentAnalysisOutput {
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    confidence: number;
    emotional_tone: string[];
  };
  
  engagement_prediction: {
    score: number; // 0-100
    factors: {
      positive: string[];
      negative: string[];
      improvements: string[];
    };
  };
  
  content_quality: {
    readability_score: number;
    clarity_score: number;
    call_to_action_strength: number;
    brand_alignment: number;
  };
  
  platform_optimization: {
    character_usage: number;
    hashtag_effectiveness: number;
    visual_content_score?: number;
  };
  
  recommendations: {
    immediate_improvements: string[];
    strategic_suggestions: string[];
    risk_warnings: string[];
  };
}

export class ContentAnalysisService {
  async analyzeContent(input: ContentAnalysisInput): Promise<ContentAnalysisOutput> {
    const prompt = `
    Analyze this social media content comprehensively:
    
    Content: "${input.content}"
    Platform: ${input.platform}
    ${input.mediaUrls ? `Media URLs: ${input.mediaUrls.join(', ')}` : ''}
    
    Provide detailed analysis covering:
    1. Sentiment and emotional tone
    2. Engagement potential prediction
    3. Content quality metrics
    4. Platform-specific optimization
    5. Actionable recommendations
    
    Consider factors like:
    - Language clarity and readability
    - Emotional appeal and connection
    - Call-to-action effectiveness
    - Platform algorithm preferences
    - Potential risks or issues
    
    Return comprehensive analysis in JSON format.
    `;
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: CONTENT_ANALYSIS_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1, // Very deterministic for analysis
    });
    
    return JSON.parse(response.choices[0].message.content);
  }
}

const CONTENT_ANALYSIS_SYSTEM_PROMPT = `
You are an expert content analyst and social media strategist with deep understanding of engagement psychology and platform algorithms.

Analysis framework:
1. Sentiment Analysis: Detect emotional tone, positivity/negativity, brand safety
2. Engagement Prediction: Assess likelihood of likes, comments, shares
3. Quality Assessment: Evaluate clarity, structure, call-to-action strength
4. Platform Optimization: Analyze platform-specific best practices
5. Risk Assessment: Identify potential issues or controversies

Scoring methodology:
- Use 0-100 scales for quantitative metrics
- Provide confidence levels for predictions
- Give specific, actionable feedback
- Consider both short-term engagement and long-term brand impact
- Balance optimization with authenticity

Always provide constructive, specific recommendations that users can implement immediately.
`;
```

---

## 🎯 **INTEGRACIÓN CON UI**

### **Componentes AI Obligatorios**
```typescript
// 1. AI Optimization Panel
export function AIOptimizationPanel({ post, onApplyOptimization }: AIOptimizationPanelProps) {
  const [optimizations, setOptimizations] = useState<PostOptimizationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const generateOptimizations = async () => {
    setIsLoading(true);
    try {
      const result = await fetch('/api/ai/optimize-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: post.content,
          platforms: post.platforms,
          contentType: post.contentType,
          tone: post.tone,
        }),
      });
      
      const data = await result.json();
      setOptimizations(data);
    } catch (error) {
      toast.error('Failed to generate AI optimizations');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Content Optimization
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!optimizations ? (
          <Button onClick={generateOptimizations} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Generate AI Suggestions'}
          </Button>
        ) : (
          <AIOptimizationResults 
            optimizations={optimizations}
            onApply={onApplyOptimization}
          />
        )}
      </CardContent>
    </Card>
  );
}

// 2. Hashtag Suggestions Component
export function HashtagSuggestions({ content, platform, onSelectHashtags }: HashtagSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<HashtagSuggestionOutput | null>(null);
  
  useEffect(() => {
    if (content.length > 10) {
      debouncedGenerateHashtags();
    }
  }, [content, platform]);
  
  const debouncedGenerateHashtags = useMemo(
    () => debounce(async () => {
      const result = await fetch('/api/ai/suggest-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform }),
      });
      
      const data = await result.json();
      setSuggestions(data);
    }, 1000),
    [content, platform]
  );
  
  return (
    <div className="space-y-4">
      {suggestions && (
        <>
          <HashtagCategory 
            title="Recommended"
            hashtags={suggestions.primary}
            onSelect={onSelectHashtags}
          />
          <HashtagCategory 
            title="Trending"
            hashtags={suggestions.trending}
            onSelect={onSelectHashtags}
          />
          <HashtagCategory 
            title="Niche"
            hashtags={suggestions.secondary}
            onSelect={onSelectHashtags}
          />
        </>
      )}
    </div>
  );
}

// 3. Timing Recommendations
export function TimingRecommendations({ userId, platforms, contentType }: TimingRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<TimingOptimizationOutput | null>(null);
  
  useEffect(() => {
    fetch('/api/ai/optimize-timing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, platforms, contentType }),
    })
    .then(res => res.json())
    .then(setRecommendations);
  }, [userId, platforms, contentType]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>🕐 Optimal Posting Times</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations && (
          <div className="space-y-4">
            {Object.entries(recommendations.recommendations).map(([platform, timing]) => (
              <PlatformTimingCard 
                key={platform}
                platform={platform as Platform}
                timing={timing}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 📊 **PERFORMANCE Y MÉTRICAS**

### **KPIs de AI Obligatorios**
```yaml
AI_PERFORMANCE_KPIS:
  response_time:
    content_optimization: "<5 segundos"
    hashtag_suggestions: "<3 segundos"
    timing_recommendations: "<2 segundos"
    content_analysis: "<4 segundos"
    
  accuracy_metrics:
    hashtag_relevance: ">85% user approval"
    timing_accuracy: ">70% engagement improvement"
    content_optimization: ">60% engagement lift"
    sentiment_analysis: ">90% accuracy"
    
  usage_metrics:
    ai_feature_adoption: ">60% de posts usan AI"
    suggestion_acceptance: ">50% sugerencias aceptadas"
    user_satisfaction: ">4.5/5 rating"
    
  cost_efficiency:
    openai_tokens: "<1000 tokens promedio por optimización"
    api_calls: "<10 calls por post creation"
    monthly_ai_cost: "<$500 para 1000 usuarios activos"
```

### **Monitoring y Logging**
```typescript
// Logging obligatorio para AI features
export class AIMetricsService {
  async logOptimizationRequest(input: any, output: any, responseTime: number) {
    await this.prisma.aIMetrics.create({
      data: {
        feature: 'content_optimization',
        inputTokens: this.countTokens(JSON.stringify(input)),
        outputTokens: this.countTokens(JSON.stringify(output)),
        responseTimeMs: responseTime,
        success: true,
        userId: input.userId,
      },
    });
  }
  
  async logHashtagSuggestion(input: any, output: any, userAcceptance: number) {
    await this.prisma.aIMetrics.create({
      data: {
        feature: 'hashtag_suggestions',
        success: true,
        userSatisfaction: userAcceptance,
        metadata: {
          suggestedCount: output.primary.length + output.secondary.length,
          acceptedCount: Math.floor(userAcceptance * (output.primary.length + output.secondary.length)),
        },
      },
    });
  }
}
```

---

## 🚨 **REGLAS Y RESTRICCIONES**

### **Reglas de Desarrollo AI Obligatorias**
```yaml
OBLIGATORIO:
  error_handling:
    - "Todas las llamadas AI deben tener timeout de 30 segundos"
    - "Fallback graceful si AI falla (modo básico sin AI)"
    - "Rate limiting: max 10 requests por minuto por usuario"
    - "Retry automático con backoff exponencial"
    
  data_privacy:
    - "NUNCA almacenar contenido de usuario en logs de AI"
    - "Anonimizar datos antes de enviar a OpenAI"
    - "Cumplir con GDPR y CCPA"
    - "Opción de opt-out de features AI"
    
  cost_control:
    - "Límite de tokens por request: 4000 input + 2000 output"
    - "Cache de sugerencias por 24 horas"
    - "Batch processing cuando sea posible"
    - "Monitoring de costos en tiempo real"
    
  quality_assurance:
    - "Validación de outputs AI antes de mostrar al usuario"
    - "Sanitización de contenido generado"
    - "Detección de contenido inapropiado"
    - "A/B testing de prompts y modelos"
```

### **Casos Edge y Manejo de Errores**
```typescript
// Implementación obligatoria de error handling
export class AIServiceWithFallback {
  async optimizeContentWithFallback(input: ContentOptimizationInput): Promise<ContentOptimizationOutput> {
    try {
      // Intento principal con OpenAI
      return await this.openaiService.optimizeContent(input);
    } catch (error) {
      if (error.code === 'rate_limit_exceeded') {
        // Fallback 1: Usar cached suggestions
        const cached = await this.getCachedOptimizations(input);
        if (cached) return cached;
        
        // Fallback 2: Reglas básicas sin AI
        return this.basicOptimizationFallback(input);
      }
      
      if (error.code === 'timeout') {
        // Timeout: devolver versión básica
        return this.basicOptimizationFallback(input);
      }
      
      // Otros errores: modo degradado
      throw new AIServiceError('AI optimization temporarily unavailable', error);
    }
  }
  
  private basicOptimizationFallback(input: ContentOptimizationInput): ContentOptimizationOutput {
    // Implementar lógica básica sin AI para casos de emergencia
    return {
      optimizedContent: this.applyBasicRules(input),
      globalSuggestions: {
        toneAdjustments: ['Consider adding emojis for engagement'],
        engagementTips: ['Add a call-to-action at the end'],
        callToActionSuggestions: ['Ask a question to encourage comments'],
      },
    };
  }
}
```

---

## 🎯 **TESTING DE AI**

### **Test Cases Obligatorios**
```typescript
// Tests unitarios obligatorios
describe('SocialMediaAIService', () => {
  describe('Content Optimization', () => {
    it('should optimize content for multiple platforms', async () => {
      const input: ContentOptimizationInput = {
        originalContent: 'Check out our new product!',
        platforms: [Platform.INSTAGRAM, Platform.TWITTER],
        contentType: 'promotional',
        tone: 'friendly',
      };
      
      const result = await aiService.optimizeContent(input);
      
      expect(result.optimizedContent).toHaveProperty(Platform.INSTAGRAM);
      expect(result.optimizedContent).toHaveProperty(Platform.TWITTER);
      expect(result.optimizedContent[Platform.INSTAGRAM].content).toBeDefined();
      expect(result.optimizedContent[Platform.INSTAGRAM].hashtags).toHaveLength(greaterThan(0));
    });
    
    it('should handle rate limits gracefully', async () => {
      // Mock rate limit error
      jest.spyOn(openaiService, 'chat').mockRejectedValue(new Error('Rate limit exceeded'));
      
      const result = await aiService.optimizeContent(mockInput);
      
      // Should fallback to basic optimization
      expect(result).toBeDefined();
      expect(result.optimizedContent).toBeDefined();
    });
  });
  
  describe('Hashtag Suggestions', () => {
    it('should generate relevant hashtags', async () => {
      const input: HashtagSuggestionInput = {
        content: 'Beautiful sunset at the beach',
        platform: Platform.INSTAGRAM,
        contentType: 'entertainment',
      };
      
      const result = await hashtagService.suggestHashtags(input);
      
      expect(result.primary).toHaveLength(greaterThan(5));
      expect(result.primary[0].relevanceScore).toBeGreaterThan(70);
      expect(result.primary.every(h => h.hashtag.startsWith('#'))).toBe(false); // No # prefix
    });
  });
});

// Integration tests
describe('AI Integration Tests', () => {
  it('should complete full post optimization flow', async () => {
    const postData = {
      content: 'Exciting announcement coming soon!',
      platforms: [Platform.INSTAGRAM, Platform.FACEBOOK],
      enableAI: true,
    };
    
    const post = await postsService.createPost(postData, userId);
    
    expect(post.aiOptimized).toBe(true);
    expect(post.aiSuggestions).toBeDefined();
    expect(post.aiSuggestions.optimizedContent).toHaveProperty(Platform.INSTAGRAM);
  });
});
```

---

## 🚀 **DEPLOYMENT Y CONFIGURACIÓN**

### **Variables de Entorno Obligatorias**
```bash
# AI Service Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.3

# Fallback Configuration
AI_FALLBACK_ENABLED=true
AI_FALLBACK_SERVICE=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Rate Limiting
AI_RATE_LIMIT_PER_MINUTE=10
AI_RATE_LIMIT_PER_HOUR=100
AI_TIMEOUT_MS=30000

# Cost Control
AI_MONTHLY_BUDGET=500
AI_COST_ALERT_THRESHOLD=400
AI_TOKEN_LIMIT_PER_REQUEST=6000

# Cache Configuration
AI_CACHE_TTL_HOURS=24
REDIS_URL=redis://localhost:6379

# Feature Flags
AI_CONTENT_OPTIMIZATION_ENABLED=true
AI_HASHTAG_SUGGESTIONS_ENABLED=true
AI_TIMING_OPTIMIZATION_ENABLED=true
AI_CONTENT_ANALYSIS_ENABLED=true
```

### **Configuración de Production**
```typescript
// Production-ready AI configuration
export const aiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.3,
    timeout: parseInt(process.env.AI_TIMEOUT_MS) || 30000,
  },
  
  rateLimit: {
    perMinute: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE) || 10,
    perHour: parseInt(process.env.AI_RATE_LIMIT_PER_HOUR) || 100,
  },
  
  costControl: {
    monthlyBudget: parseInt(process.env.AI_MONTHLY_BUDGET) || 500,
    alertThreshold: parseInt(process.env.AI_COST_ALERT_THRESHOLD) || 400,
    tokenLimitPerRequest: parseInt(process.env.AI_TOKEN_LIMIT_PER_REQUEST) || 6000,
  },
  
  cache: {
    ttlHours: parseInt(process.env.AI_CACHE_TTL_HOURS) || 24,
    redisUrl: process.env.REDIS_URL,
  },
  
  featureFlags: {
    contentOptimization: process.env.AI_CONTENT_OPTIMIZATION_ENABLED === 'true',
    hashtagSuggestions: process.env.AI_HASHTAG_SUGGESTIONS_ENABLED === 'true',
    timingOptimization: process.env.AI_TIMING_OPTIMIZATION_ENABLED === 'true',
    contentAnalysis: process.env.AI_CONTENT_ANALYSIS_ENABLED === 'true',
  },
};
```

---

## 🏁 **CHECKLIST FINAL**

### **Antes de Desarrollo**
```bash
□ Crear cuenta OpenAI y obtener API key
□ Setup de ambiente de desarrollo con todas las variables
□ Instalar dependencias de AI (openai, tiktoken, etc.)
□ Configurar rate limiting y error handling
□ Setup de monitoring y logging
□ Crear tests unitarios base
```

### **Durante Desarrollo**
```bash
□ Implementar cada servicio AI con fallbacks
□ Crear componentes UI para features AI
□ Integrar con el flujo principal de posts
□ Implementar caching y optimización de costos
□ Configurar monitoring de performance
□ Crear documentación de APIs
```

### **Antes de Deploy**
```bash
□ Testing completo de todos los features AI
□ Validación de costos y límites
□ Configuración de production
□ Setup de alertas y monitoring
□ Documentación de troubleshooting
□ Training del equipo en features AI
```

---

## 🎯 **CONCLUSIÓN**

**Esta especificación es COMPLETA para el equipo AI**. Incluye:

✅ **Arquitectura de AI clara y detallada**  
✅ **Especificaciones técnicas completas**  
✅ **Ejemplos de código implementables**  
✅ **Integración con UI y backend**  
✅ **Manejo de errores y fallbacks**  
✅ **Testing y quality assurance**  
✅ **Configuración de production**  
✅ **Métricas y monitoring**  

**El equipo AI puede desarrollar todas las funcionalidades sin preguntas adicionales.**

---

*Especificaciones AI completas - 29 de Junio, 2025*  
*Proyecto: AI Pair Orchestrator Pro - Social Media AI Features*  
*Estado: READY FOR AI DEVELOPMENT* 🤖
