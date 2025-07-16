
# ARQUITECTURA TÉCNICA DETALLADA

## 🏗️ OVERVIEW DE LA ARQUITECTURA

### **Principios de Diseño**
1. **Microservicios**: Edge Functions como servicios independientes
2. **Event-Driven**: Real-time updates y notificaciones
3. **API-First**: Todas las funcionalidades via APIs
4. **Stateless**: Edge Functions sin estado para escalabilidad
5. **Security-First**: RLS, JWT, encrypted secrets

## 📊 STACK TECNOLÓGICO COMPLETO

### **Frontend Architecture**
```
React 18 (Hooks + Context API)
├── TypeScript (Strict mode)
├── Tailwind CSS + shadcn/ui
├── React Router v6 (Protected routes)
├── React Query (Server state management)
├── React Hook Form + Zod (Form validation)
└── Framer Motion (Animations)
```

### **Backend Architecture** 
```
Supabase BaaS
├── PostgreSQL (Database with RLS)
├── Edge Functions (Deno runtime)
├── Auth (JWT + OAuth providers)
├── Storage (File uploads)
├── Real-time (WebSocket subscriptions)
└── Vault (Encrypted secrets management)
```

### **External Services**
```
AI & Processing
├── OpenAI (Whisper + GPT-4o models)
├── Firecrawl (Web scraping)
└── Resend (Email delivery)

Future Integrations
├── Google Workspace (Calendar, Sheets, Drive)
├── Microsoft 365 (Outlook, Teams, Excel)
├── Social Media APIs (LinkedIn, Twitter, Instagram)
└── CMS Platforms (Strapi, PayloadCMS)
```

## 🔧 EDGE FUNCTIONS ARCHITECTURE

### **Core Edge Functions**

#### 1. **meeting-processor**
```typescript
Purpose: Convert audio/video to structured meeting minutes
Input: File upload (audio/video) + metadata
Process: 
  1. Whisper API transcription
  2. GPT-4o summarization and structuring
  3. PDF generation with corporate template
  4. Database storage with real-time notification
Output: PDF document + structured data + notifications
Cost: ~$0.10 per hour of audio
```

#### 2. **resource-scraper**
```typescript
Purpose: Intelligent web scraping and content extraction
Input: URL + extraction criteria + categorization rules
Process:
  1. Firecrawl API for content extraction
  2. GPT-4o for content analysis and categorization
  3. Structured data transformation
  4. Database storage with tagging
Output: Structured content + metadata + relationships
Cost: ~$0.04 per page scraped
```

#### 3. **content-pipeline**
```typescript
Purpose: Automated content creation and publishing
Input: Content brief + platform preferences + brand guidelines
Process:
  1. GPT-4o content generation
  2. Platform-specific formatting
  3. Review queue management
  4. Multi-platform publishing via APIs
Output: Published content + analytics + approval trail
Cost: ~$0.15 per content piece
```

### **Supporting Edge Functions**

#### 4. **ai-transcriber**
```typescript
Purpose: Standalone audio transcription service
Tech: OpenAI Whisper API
Use Cases: Voice notes, interviews, calls
```

#### 5. **ai-summarizer**
```typescript
Purpose: Document and content summarization
Tech: GPT-4o with custom prompts
Use Cases: Long documents, articles, reports
```

#### 6. **email-sender**
```typescript
Purpose: Transactional email delivery
Tech: Resend API with templates
Use Cases: Notifications, reports, alerts
```

#### 7. **workflow-executor**
```typescript
Purpose: Generic workflow execution engine
Tech: State machine + step processing
Use Cases: Custom business processes
```

## 🗄️ DATABASE SCHEMA

### **Core Tables**

```sql
-- Users and Authentication (Supabase Auth + extended profile)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'employee',
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Workflows Management
CREATE TABLE workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'meeting', 'scraping', 'content', 'custom'
  config JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'draft'
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Executions
CREATE TABLE workflow_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'running', -- 'running', 'completed', 'failed', 'cancelled'
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  executed_by UUID REFERENCES profiles(id)
);

-- Meetings and Transcriptions
CREATE TABLE meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  audio_file_url TEXT,
  transcript TEXT,
  summary TEXT,
  action_items JSONB DEFAULT '[]',
  attendees JSONB DEFAULT '[]',
  meeting_date TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scraped Resources
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'archived', 'deleted'
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Management
CREATE TABLE content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT, -- 'blog_post', 'social_media', 'email', 'document'
  platform_config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft', -- 'draft', 'review', 'approved', 'published'
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Notifications
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Row Level Security (RLS) Policies**

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Workflows: Users can see workflows they created or have access to
CREATE POLICY "Users can view workflows" ON workflows FOR SELECT 
  USING (created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Meetings: Users can see meetings they created or attended
CREATE POLICY "Users can view meetings" ON meetings FOR SELECT
  USING (created_by = auth.uid() OR auth.uid()::text = ANY(
    SELECT jsonb_array_elements_text(attendees)
  ));

-- Resources: Department-based access control
CREATE POLICY "Users can view resources" ON resources FOR SELECT
  USING (created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles p1, profiles p2 
    WHERE p1.id = auth.uid() AND p2.id = resources.created_by 
    AND p1.department = p2.department
  ));
```

## 🔄 REAL-TIME FEATURES

### **WebSocket Subscriptions**
```typescript
// Real-time workflow execution updates
const workflowSubscription = supabase
  .channel('workflow-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'workflow_executions'
  }, (payload) => {
    // Update UI with execution progress
    updateWorkflowStatus(payload.new);
  })
  .subscribe();

// Real-time notifications
const notificationSubscription = supabase
  .channel('user-notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Show toast notification
    showNotification(payload.new);
  })
  .subscribe();
```

## 🔐 SECURITY ARCHITECTURE

### **Authentication Flow**
```
User Login → Supabase Auth → JWT Token → RLS Policies → Resource Access
```

### **API Security**
- **Rate Limiting**: 1000 requests/hour per user
- **CORS Configuration**: Restricted origins
- **Input Validation**: Zod schemas on all inputs
- **SQL Injection Protection**: Parameterized queries only

### **Secrets Management**
```typescript
// All API keys stored in Supabase Vault
const secrets = {
  OPENAI_API_KEY: 'vault:openai_key',
  FIRECRAWL_API_KEY: 'vault:firecrawl_key', 
  RESEND_API_KEY: 'vault:resend_key',
  // Future integrations
  GOOGLE_API_KEY: 'vault:google_key',
  MICROSOFT_CLIENT_SECRET: 'vault:microsoft_secret'
};
```

## 📊 MONITORING & OBSERVABILITY

### **Logging Strategy**
```typescript
// Structured logging in Edge Functions
const log = {
  timestamp: new Date().toISOString(),
  function: 'meeting-processor',
  user_id: userId,
  execution_id: executionId,
  event: 'transcription_started',
  metadata: { file_size: fileSize, duration: duration }
};
console.log(JSON.stringify(log));
```

### **Performance Monitoring**
- **Response Times**: < 2s for 95% of requests
- **Error Rates**: < 1% for all functions
- **Throughput**: Monitor requests/minute
- **Resource Usage**: Memory and CPU utilization

### **Health Checks**
```typescript
// Health check endpoint for each function
export const healthCheck = async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    dependencies: {
      openai: await checkOpenAI(),
      firecrawl: await checkFirecrawl(),
      database: await checkDatabase()
    }
  };
};
```

## 🚀 DEPLOYMENT & SCALING

### **CI/CD Pipeline**
```yaml
# GitHub Actions workflow
name: Deploy to Supabase
on:
  push:
    branches: [main]
jobs:
  deploy:
    - Deploy Edge Functions
    - Run database migrations  
    - Update secrets
    - Run health checks
```

### **Scaling Strategy**
- **Horizontal**: Edge Functions auto-scale
- **Vertical**: Database connection pooling
- **Caching**: Redis layer for frequent queries
- **CDN**: Static assets distribution

---

**Responsable**: Lead Developer  
**Última actualización**: Enero 2025  
**Próxima revisión**: Cada sprint (2 semanas)

