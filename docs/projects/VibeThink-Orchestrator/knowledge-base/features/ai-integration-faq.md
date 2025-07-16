# FAQ: Integración de IA

## 📋 **Índice**
1. [Servicios de IA](#servicios-de-ia)
2. [OpenAI Integration](#openai-integration)
3. [Firecrawl Integration](#firecrawl-integration)
4. [Funcionalidades Específicas](#funcionalidades-específicas)
5. [Casos de Uso](#casos-de-uso)
6. [Configuración y Costos](#configuración-y-costos)
7. [Monitoreo y Analytics](#monitoreo-y-analytics)
8. [Seguridad y Privacidad](#seguridad-y-privacidad)

---

## 🤖 **Servicios de IA**

### **¿Qué servicios de IA están integrados?**
- **OpenAI:** GPT-4 para generación de texto, análisis y procesamiento de lenguaje natural
- **Firecrawl:** Web scraping y extracción de datos de sitios web
- **Edge Functions:** Procesamiento en servidor para tareas complejas

### **¿Por qué elegimos estos servicios?**
- **OpenAI:** Líder en IA generativa, modelos más avanzados
- **Firecrawl:** Especializado en extracción web, más preciso que alternativas
- **Edge Functions:** Procesamiento rápido, sin latencia de red

### **¿Cómo se integran los servicios?**
```tsx
// Cliente unificado de IA
const aiClient = {
  openai: new OpenAIClient(process.env.OPENAI_API_KEY),
  firecrawl: new FirecrawlClient(process.env.FIRECRAWL_API_KEY),
  edge: new EdgeFunctionClient()
};
```

### **¿Qué funcionalidades proporciona cada servicio?**

#### **OpenAI**
- Generación de texto y respuestas
- Análisis de sentimiento
- Categorización automática
- Resúmenes y extracción de información
- Traducción y procesamiento de lenguaje

#### **Firecrawl**
- Extracción de datos de sitios web
- Scraping de contenido dinámico
- Extracción de metadatos
- Captura de pantallas
- Análisis de estructura web

---

## 🧠 **OpenAI Integration**

### **¿Cómo configurar OpenAI?**
```tsx
// Configuración de OpenAI
const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  models: {
    gpt4: 'gpt-4',
    gpt35: 'gpt-3.5-turbo',
    gpt4Turbo: 'gpt-4-turbo-preview'
  },
  defaults: {
    temperature: 0.1,
    maxTokens: 1000,
    timeout: 30000
  }
};
```

### **¿Cómo usar OpenAI para categorización?**
```tsx
// Categorización con OpenAI
const categorizeWithOpenAI = async (text, categories) => {
  const prompt = `
    Categoriza el siguiente texto en una de estas categorías: ${categories.join(', ')}
    
    Texto: "${text}"
    
    Responde solo con el nombre de la categoría más apropiada.
  `;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Eres un experto en categorización de contenido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1,
    max_tokens: 50
  });
  
  return response.choices[0].message.content.trim();
};
```

### **¿Cómo generar respuestas sugeridas?**
```tsx
// Generación de respuestas sugeridas
const generateSuggestedResponses = async (context, ticket) => {
  const prompt = `
    Basándote en el siguiente contexto y ticket, genera 3 respuestas profesionales y útiles:
    
    Contexto: ${context}
    Ticket: ${ticket.description}
    
    Genera respuestas que sean:
    1. Profesionales y corteses
    2. Específicas al problema
    3. Útiles para el usuario
    
    Formato: Respuesta 1 | Respuesta 2 | Respuesta 3
  `;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Eres un experto en soporte al cliente.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 500
  });
  
  return response.choices[0].message.content.split('|').map(r => r.trim());
};
```

### **¿Cómo analizar sentimiento?**
```tsx
// Análisis de sentimiento
const analyzeSentiment = async (text) => {
  const prompt = `
    Analiza el sentimiento del siguiente texto y proporciona:
    1. Sentimiento general (positivo, neutral, negativo)
    2. Nivel de urgencia (bajo, medio, alto)
    3. Emoción principal (frustrado, satisfecho, confundido, etc.)
    4. Puntuación de sentimiento (1-10)
    
    Texto: "${text}"
    
    Responde en formato JSON.
  `;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Eres un experto en análisis de sentimiento.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1,
    max_tokens: 200
  });
  
  return JSON.parse(response.choices[0].message.content);
};
```

### **¿Cómo generar resúmenes?**
```tsx
// Generación de resúmenes
const generateSummary = async (text, maxLength = 200) => {
  const prompt = `
    Genera un resumen conciso del siguiente texto en máximo ${maxLength} caracteres:
    
    "${text}"
    
    El resumen debe ser claro, informativo y mantener los puntos clave.
  `;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Eres un experto en resumir contenido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: maxLength
  });
  
  return response.choices[0].message.content.trim();
};
```

---

## 🕷️ **Firecrawl Integration**

### **¿Cómo configurar Firecrawl?**
```tsx
// Configuración de Firecrawl
const firecrawlConfig = {
  apiKey: process.env.FIRECRAWL_API_KEY,
  baseUrl: 'https://api.firecrawl.dev',
  defaults: {
    timeout: 60000,
    retries: 3,
    waitFor: 2000
  }
};
```

### **¿Cómo extraer datos de sitios web?**
```tsx
// Extracción de datos web
const extractWebData = async (url, selectors) => {
  const response = await firecrawl.scrape({
    url,
    extractors: selectors,
    waitFor: 3000,
    screenshot: false
  });
  
  return {
    success: response.success,
    data: response.data,
    metadata: response.metadata,
    error: response.error
  };
};

// Ejemplo de uso
const companyData = await extractWebData('https://company.com', {
  name: { selector: 'h1.company-name' },
  description: { selector: '.company-description' },
  contact: { selector: '.contact-info' },
  social: { selector: '.social-links a', type: 'list' }
});
```

### **¿Cómo extraer contenido dinámico?**
```tsx
// Extracción de contenido dinámico
const extractDynamicContent = async (url) => {
  const response = await firecrawl.scrape({
    url,
    waitFor: 5000, // Esperar a que cargue JavaScript
    waitForSelector: '.dynamic-content', // Esperar elemento específico
    extractors: {
      content: { selector: '.dynamic-content' },
      images: { selector: 'img', type: 'list' },
      links: { selector: 'a', type: 'list' }
    }
  });
  
  return response;
};
```

### **¿Cómo extraer metadatos?**
```tsx
// Extracción de metadatos
const extractMetadata = async (url) => {
  const response = await firecrawl.scrape({
    url,
    extractors: {
      title: { selector: 'title' },
      description: { selector: 'meta[name="description"]', attr: 'content' },
      keywords: { selector: 'meta[name="keywords"]', attr: 'content' },
      ogTitle: { selector: 'meta[property="og:title"]', attr: 'content' },
      ogDescription: { selector: 'meta[property="og:description"]', attr: 'content' },
      ogImage: { selector: 'meta[property="og:image"]', attr: 'content' }
    }
  });
  
  return response.data;
};
```

### **¿Cómo capturar pantallas?**
```tsx
// Captura de pantallas
const captureScreenshot = async (url, options = {}) => {
  const response = await firecrawl.scrape({
    url,
    screenshot: true,
    screenshotOptions: {
      fullPage: options.fullPage || false,
      width: options.width || 1920,
      height: options.height || 1080,
      quality: options.quality || 80
    }
  });
  
  return {
    screenshot: response.screenshot,
    data: response.data
  };
};
```

---

## 🎯 **Funcionalidades Específicas**

### **¿Cómo funciona la categorización automática de tickets?**
```tsx
// Categorización automática
const autoCategorizeTicket = async (ticket) => {
  // 1. Extraer información relevante
  const context = buildTicketContext(ticket);
  
  // 2. Categorizar con OpenAI
  const category = await categorizeWithOpenAI(ticket.description, availableCategories);
  
  // 3. Calcular confianza
  const confidence = await calculateConfidence(ticket, category);
  
  // 4. Asignar prioridad
  const priority = await calculatePriority(ticket, category);
  
  return {
    category,
    confidence,
    priority,
    suggestedAgent: await suggestAgent(category, priority)
  };
};
```

### **¿Cómo funciona la asignación inteligente de agentes?**
```tsx
// Asignación inteligente
const intelligentAssignment = async (ticket) => {
  // 1. Analizar requerimientos del ticket
  const requirements = await analyzeTicketRequirements(ticket);
  
  // 2. Encontrar agentes disponibles
  const availableAgents = await getAvailableAgents();
  
  // 3. Calcular score de compatibilidad
  const agentScores = await Promise.all(
    availableAgents.map(async (agent) => {
      const score = await calculateAgentScore(agent, requirements);
      return { agent, score };
    })
  );
  
  // 4. Seleccionar mejor agente
  const bestAgent = agentScores
    .sort((a, b) => b.score - a.score)[0].agent;
  
  return bestAgent;
};
```

### **¿Cómo funciona el análisis de sentimiento en tiempo real?**
```tsx
// Análisis de sentimiento en tiempo real
const realTimeSentimentAnalysis = async (text) => {
  // 1. Análisis rápido con modelo ligero
  const quickAnalysis = await quickSentimentCheck(text);
  
  // 2. Si es crítico, análisis detallado
  if (quickAnalysis.urgency === 'high') {
    const detailedAnalysis = await analyzeSentiment(text);
    
    // 3. Alertar si es necesario
    if (detailedAnalysis.sentiment === 'negative' && detailedAnalysis.urgency === 'high') {
      await alertSupervisor(detailedAnalysis);
    }
    
    return detailedAnalysis;
  }
  
  return quickAnalysis;
};
```

### **¿Cómo funciona la generación de respuestas automáticas?**
```tsx
// Generación de respuestas automáticas
const generateAutoResponse = async (ticket, context) => {
  // 1. Analizar el ticket
  const analysis = await analyzeTicket(ticket);
  
  // 2. Buscar respuestas similares
  const similarTickets = await findSimilarTickets(ticket);
  
  // 3. Generar respuesta personalizada
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Eres un agente de soporte experto. Genera una respuesta profesional y útil.`
      },
      {
        role: 'user',
        content: `
          Ticket: ${ticket.description}
          Contexto: ${context}
          Respuestas similares: ${similarTickets.map(t => t.response).join('\n')}
          
          Genera una respuesta que sea:
          - Profesional y empática
          - Específica al problema
          - Útil para el usuario
          - En el tono de la empresa
        `
      }
    ],
    temperature: 0.7
  });
  
  return response.choices[0].message.content;
};
```

---

## 💼 **Casos de Uso**

### **¿Cómo usar IA para lead scoring?**
```tsx
// Lead scoring con IA
const aiLeadScoring = async (lead) => {
  // 1. Recopilar datos del lead
  const leadData = await collectLeadData(lead);
  
  // 2. Analizar comportamiento
  const behavior = await analyzeBehavior(lead);
  
  // 3. Calcular score con IA
  const score = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Evalúa el potencial de este lead del 1 al 100.'
      },
      {
        role: 'user',
        content: JSON.stringify({ leadData, behavior })
      }
    ],
    temperature: 0.1
  });
  
  return parseInt(score.choices[0].message.content);
};
```

### **¿Cómo usar IA para predicción de ventas?**
```tsx
// Predicción de ventas
const predictSales = async (opportunity) => {
  // 1. Analizar factores de la oportunidad
  const factors = await analyzeOpportunityFactors(opportunity);
  
  // 2. Buscar oportunidades similares
  const similarOpportunities = await findSimilarOpportunities(opportunity);
  
  // 3. Predecir con IA
  const prediction = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Predice la probabilidad de cierre y valor esperado.'
      },
      {
        role: 'user',
        content: JSON.stringify({ factors, similarOpportunities })
      }
    ],
    temperature: 0.1
  });
  
  return JSON.parse(prediction.choices[0].message.content);
};
```

### **¿Cómo usar IA para análisis de competencia?**
```tsx
// Análisis de competencia
const analyzeCompetition = async (competitorUrl) => {
  // 1. Extraer datos del competidor
  const competitorData = await extractWebData(competitorUrl, {
    products: { selector: '.product-list', type: 'list' },
    pricing: { selector: '.pricing' },
    features: { selector: '.features', type: 'list' }
  });
  
  // 2. Analizar con IA
  const analysis = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Analiza los datos del competidor y proporciona insights.'
      },
      {
        role: 'user',
        content: JSON.stringify(competitorData)
      }
    ],
    temperature: 0.3
  });
  
  return analysis.choices[0].message.content;
};
```

### **¿Cómo usar IA para generación de contenido?**
```tsx
// Generación de contenido
const generateContent = async (type, context) => {
  const prompts = {
    email: 'Genera un email profesional para:',
    proposal: 'Genera una propuesta comercial para:',
    report: 'Genera un reporte ejecutivo sobre:',
    summary: 'Genera un resumen ejecutivo de:'
  };
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Eres un experto en ${type}. Genera contenido profesional y efectivo.`
      },
      {
        role: 'user',
        content: `${prompts[type]} ${context}`
      }
    ],
    temperature: 0.7
  });
  
  return response.choices[0].message.content;
};
```

---

## ⚙️ **Configuración y Costos**

### **¿Cómo configurar límites de uso?**
```tsx
// Configuración de límites
const usageLimits = {
  openai: {
    dailyTokens: 1000000,
    monthlyTokens: 30000000,
    maxTokensPerRequest: 4000
  },
  firecrawl: {
    dailyRequests: 1000,
    monthlyRequests: 30000,
    maxUrlsPerRequest: 10
  }
};
```

### **¿Cómo trackear costos?**
```tsx
// Tracking de costos
const trackAICosts = async (service, usage, cost) => {
  await apiClient.post('/ai/usage', {
    service,
    usage,
    cost,
    companyId: user.companyId,
    userId: user.id,
    timestamp: new Date()
  });
};

// Ejemplo de uso
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: messages,
  max_tokens: 1000
});

await trackAICosts('openai', {
  tokens: response.usage.total_tokens,
  model: 'gpt-4'
}, calculateCost(response.usage));
```

### **¿Cómo implementar rate limiting?**
```tsx
// Rate limiting para IA
const rateLimiter = {
  openai: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    tokensPerMinute: 100000
  },
  firecrawl: {
    requestsPerMinute: 30,
    requestsPerHour: 500
  }
};

const checkRateLimit = async (service) => {
  const usage = await getCurrentUsage(service);
  const limits = rateLimiter[service];
  
  if (usage.requestsThisMinute >= limits.requestsPerMinute) {
    throw new Error('Rate limit exceeded');
  }
  
  return true;
};
```

---

## 📊 **Monitoreo y Analytics**

### **¿Qué métricas se pueden trackear?**
- **Uso por servicio:** Tokens, requests, costos
- **Performance:** Tiempo de respuesta, errores
- **Calidad:** Precisión de categorización, satisfacción
- **Costos:** Por empresa, por usuario, por funcionalidad

### **¿Cómo generar reportes de uso?**
```tsx
// Reportes de uso de IA
const generateAIUsageReport = async (filters) => {
  const data = await apiClient.get('/ai/usage/report', {
    params: {
      startDate: filters.startDate,
      endDate: filters.endDate,
      companyId: filters.companyId,
      service: filters.service
    }
  });
  
  return {
    totalCost: data.reduce((sum, item) => sum + item.cost, 0),
    totalTokens: data.reduce((sum, item) => sum + item.usage.tokens, 0),
    totalRequests: data.length,
    costByService: groupBy(data, 'service'),
    costByCompany: groupBy(data, 'companyId')
  };
};
```

### **¿Cómo monitorear la calidad de la IA?**
```tsx
// Monitoreo de calidad
const monitorAIQuality = async () => {
  // 1. Recolectar feedback de usuarios
  const feedback = await collectUserFeedback();
  
  // 2. Analizar precisión de categorización
  const categorizationAccuracy = await analyzeCategorizationAccuracy();
  
  // 3. Medir satisfacción con respuestas
  const responseSatisfaction = await measureResponseSatisfaction();
  
  // 4. Generar reporte
  return {
    overallQuality: calculateOverallQuality(feedback, categorizationAccuracy, responseSatisfaction),
    recommendations: generateImprovementRecommendations(feedback, categorizationAccuracy, responseSatisfaction)
  };
};
```

---

## 🔒 **Seguridad y Privacidad**

### **¿Cómo proteger datos sensibles?**
```tsx
// Protección de datos
const sanitizeDataForAI = (data) => {
  return {
    ...data,
    // Remover información sensible
    email: data.email ? maskEmail(data.email) : null,
    phone: data.phone ? maskPhone(data.phone) : null,
    personalInfo: removePersonalInfo(data.personalInfo)
  };
};

const maskEmail = (email) => {
  const [local, domain] = email.split('@');
  return `${local[0]}***@${domain}`;
};
```

### **¿Cómo implementar auditoría de IA?**
```tsx
// Auditoría de IA
const auditAIUsage = async (request, response) => {
  await apiClient.post('/ai/audit', {
    timestamp: new Date(),
    userId: user.id,
    companyId: user.companyId,
    service: request.service,
    request: sanitizeRequest(request),
    response: sanitizeResponse(response),
    cost: calculateCost(request, response)
  });
};
```

### **¿Cómo manejar el consentimiento para IA?**
```tsx
// Consentimiento para IA
const checkAIConsent = async (userId) => {
  const consent = await getUserConsent(userId, 'ai_processing');
  
  if (!consent.granted) {
    throw new Error('AI processing consent required');
  }
  
  return consent;
};
```

---

## ✅ **Checklist de Implementación**

### **Antes de usar IA:**
- [ ] ¿Está configurado el servicio correctamente?
- [ ] ¿Se verificó el consentimiento del usuario?
- [ ] ¿Se sanitizaron los datos sensibles?
- [ ] ¿Se configuraron los límites de uso?

### **Antes de procesar con IA:**
- [ ] ¿Se validó la entrada?
- [ ] ¿Se verificó el rate limit?
- [ ] ¿Se preparó el contexto adecuado?
- [ ] ¿Se configuró el manejo de errores?

### **Después de procesar con IA:**
- [ ] ¿Se validó la respuesta?
- [ ] ¿Se trackeó el uso y costo?
- [ ] ¿Se auditó la operación?
- [ ] ¿Se guardó el resultado?

---

## 📚 **Recursos Adicionales**

### **Documentación Relacionada:**
- [Arquitectura de IA](../development/AI_ARCHITECTURE.md)
- [Guía de OpenAI](../development/OPENAI_GUIDE.md)
- [Guía de Firecrawl](../development/FIRECRAWL_GUIDE.md)
- [Seguridad de IA](../development/AI_SECURITY.md)

### **Herramientas:**
- [Hooks de IA](../../src/hooks/ai/)
- [Servicios de IA](../../src/services/ai/)
- [Componentes de IA](../../src/components/ai/)

---

**Nota:** Esta FAQ es esencial para el uso correcto de la IA en el sistema. Cualquier nueva funcionalidad de IA debe ser documentada aquí. 