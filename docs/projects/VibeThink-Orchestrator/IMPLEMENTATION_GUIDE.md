
# GUÍA DE IMPLEMENTACIÓN DETALLADA

## 🚀 SETUP INICIAL

### **1. Configuración de Secrets**
```typescript
// API Keys requeridas (Supabase Vault)
const REQUIRED_SECRETS = [
  'OPENAI_API_KEY',      // OpenAI Platform
  'FIRECRAWL_API_KEY',   // Firecrawl Dashboard  
  'RESEND_API_KEY'       // Resend Dashboard
];
```

### **2. Database Schema Setup**
```sql
-- Ejecutar en Supabase SQL Editor
-- Ver TECHNICAL_ARCHITECTURE.md para schema completo
```

### **3. Edge Functions Deployment**
```bash
# Automático via GitHub Actions
# No requiere acción manual
```

## 📋 TESTING WORKFLOWS

### **Meeting Processor Test**
```typescript
// Test data for meeting processor
const testMeeting = {
  audio_file: 'sample_meeting.mp3',
  title: 'Sprint Planning Q1 2025',
  attendees: ['john@company.com', 'jane@company.com'],
  expected_duration: 60 // minutes
};

// Expected output
const expectedOutput = {
  transcript: 'Full transcription text...',
  summary: 'Executive summary...',
  action_items: [
    { task: 'Setup API keys', assignee: 'john@company.com', due_date: '2025-01-20' }
  ],
  pdf_url: 'https://storage.supabase.co/meeting-minutes/uuid.pdf'
};
```

### **Resource Scraper Test**
```typescript
// Test data for resource scraper
const testScraping = {
  url: 'https://techcrunch.com/2025/01/15/ai-trends',
  extraction_criteria: {
    content_type: 'article',
    min_word_count: 500,
    extract_images: true,
    categorize: true
  }
};

// Expected output
const expectedScraping = {
  title: 'AI Trends 2025: What to Expect',
  content: 'Full article content...',
  metadata: {
    author: 'John Doe',
    publish_date: '2025-01-15',
    word_count: 1250,
    reading_time: 5
  },
  tags: ['AI', 'Technology', 'Trends', '2025'],
  category: 'Technology News'
};
```

## 🔄 WORKFLOW EXECUTION

### **Monitoreo en Tiempo Real**
```typescript
// Dashboard de ejecución
const WorkflowMonitor = () => {
  const { data: executions } = useQuery({
    queryKey: ['workflow-executions'],
    queryFn: () => supabase
      .from('workflow_executions')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(20),
    refetchInterval: 2000 // Update every 2 seconds
  });

  return (
    <div className="workflow-monitor">
      {executions?.map(execution => (
        <ExecutionCard 
          key={execution.id}
          execution={execution}
          onRetry={retryExecution}
          onCancel={cancelExecution}
        />
      ))}
    </div>
  );
};
```

### **Error Handling**
```typescript
// Estrategia de reintentos
const executeWorkflow = async (workflowId: string, inputData: any) => {
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const result = await supabase.functions.invoke('workflow-executor', {
        body: { workflowId, inputData, attempt }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    } catch (error) {
      attempt++;
      if (attempt >= MAX_RETRIES) {
        // Log error and notify user
        await logWorkflowError(workflowId, error);
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
};
```

## 📊 MÉTRICAS Y ANALYTICS

### **Performance Tracking**
```typescript
// Métricas clave a monitorear
const performanceMetrics = {
  workflow_success_rate: 'workflow_executions.status = completed / total',
  average_execution_time: 'AVG(completed_at - started_at)',
  error_rate: 'COUNT(status = failed) / COUNT(*)',
  user_satisfaction: 'User feedback scores',
  cost_per_execution: 'API costs / execution count'
};

// Dashboard de métricas
const MetricsDashboard = () => {
  const metrics = useWorkflowMetrics();
  
  return (
    <div className="metrics-grid">
      <MetricCard 
        title="Success Rate"
        value={`${metrics.successRate}%`}
        trend={metrics.successRateTrend}
        target={95}
      />
      <MetricCard 
        title="Avg Execution Time"
        value={`${metrics.avgTime}s`}
        trend={metrics.timeTrend}
        target={30}
      />
      {/* More metrics... */}
    </div>
  );
};
```

## 🔧 DEBUGGING Y TROUBLESHOOTING

### **Logs Estructurados**
```typescript
// Logging utility para Edge Functions
const createLogger = (functionName: string) => ({
  info: (message: string, metadata = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      function: functionName,
      message,
      metadata,
      timestamp: new Date().toISOString()
    }));
  },
  
  error: (message: string, error: Error, metadata = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      function: functionName,
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      metadata,
      timestamp: new Date().toISOString()
    }));
  }
});

// Uso en Edge Functions
const logger = createLogger('meeting-processor');
logger.info('Starting transcription', { fileSize, userId });
```

### **Common Issues y Soluciones**

#### **1. OpenAI API Rate Limits**
```typescript
// Implement exponential backoff
const callOpenAI = async (prompt: string, retries = 3) => {
  try {
    return await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    });
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      const delay = Math.pow(2, 4 - retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return callOpenAI(prompt, retries - 1);
    }
    throw error;
  }
};
```

#### **2. File Upload Issues**
```typescript
// Robust file handling
const processAudioFile = async (file: File) => {
  // Validate file type and size
  if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
    throw new Error('Invalid file type. Please upload audio or video files.');
  }
  
  if (file.size > 100 * 1024 * 1024) { // 100MB limit
    throw new Error('File too large. Maximum size is 100MB.');
  }
  
  // Upload to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('meeting-recordings')
    .upload(fileName, file);
    
  if (error) throw error;
  return data.path;
};
```

#### **3. Database Connection Issues**
```typescript
// Connection health check
const checkDatabaseHealth = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (error) throw error;
    return { status: 'healthy', latency: Date.now() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};
```

## 🎯 OPTIMIZATION GUIDELINES

### **Performance Optimization**
```typescript
// Edge Function optimization
export const optimizedFunction = async (req: Request) => {
  // 1. Early validation
  const { body, error } = await validateRequest(req);
  if (error) return earlyResponse(error);
  
  // 2. Parallel processing where possible
  const [userProfile, workflowConfig] = await Promise.all([
    getUserProfile(body.userId),
    getWorkflowConfig(body.workflowId)
  ]);
  
  // 3. Streaming responses for large operations
  if (body.operation === 'large-file-processing') {
    return streamingResponse(processLargeFile(body.file));
  }
  
  // 4. Caching for repeated operations
  const cacheKey = `workflow-${body.workflowId}-${body.hash}`;
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;
  
  const result = await processWorkflow(body);
  await setCache(cacheKey, result, 3600); // 1 hour
  
  return result;
};
```

### **Cost Optimization**
```typescript
// Monitor API costs
const costTracker = {
  openai: {
    whisper: 0.006, // per minute
    gpt4o_mini: 0.00015, // per 1K tokens input
    gpt4o: 0.0025 // per 1K tokens input
  },
  firecrawl: {
    scrape: 0.04 // per page
  }
};

// Estimate costs before execution
const estimateWorkflowCost = (workflow: Workflow, inputData: any) => {
  let estimatedCost = 0;
  
  workflow.steps.forEach(step => {
    switch (step.type) {
      case 'ai_transcribe':
        estimatedCost += costTracker.openai.whisper * inputData.durationMinutes;
        break;
      case 'ai_summarize':
        estimatedCost += costTracker.openai.gpt4o_mini * (inputData.tokenCount / 1000);
        break;
      case 'web_scrape':
        estimatedCost += costTracker.firecrawl.scrape * inputData.pageCount;
        break;
    }
  });
  
  return estimatedCost;
};
```

## 📝 DEPLOYMENT CHECKLIST

### **Pre-Production**
- [ ] All API keys configured in Supabase Vault
- [ ] Database schema deployed and tested
- [ ] Edge Functions deployed and health checked
- [ ] RLS policies tested with different user roles
- [ ] Error handling tested with invalid inputs
- [ ] Performance benchmarks established
- [ ] Security audit completed

### **Production**
- [ ] Domain configured and SSL enabled
- [ ] Monitoring and alerting setup
- [ ] Backup strategy implemented
- [ ] Rate limiting configured
- [ ] Documentation updated
- [ ] User training materials prepared
- [ ] Support procedures established

### **Post-Production**
- [ ] User onboarding flows tested
- [ ] Performance monitoring active
- [ ] Error tracking operational
- [ ] User feedback collection active
- [ ] Cost monitoring implemented
- [ ] Scaling triggers configured

---

**Mantenedor**: Development Team  
**Última actualización**: Enero 2025  
**Próxima revisión**: Cada release

