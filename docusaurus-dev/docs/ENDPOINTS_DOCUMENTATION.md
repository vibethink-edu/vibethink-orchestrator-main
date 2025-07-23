# 📡 API Endpoints Documentation

## 🎯 **Resumen Ejecutivo**

AI Pair Orchestrator Pro expone los siguientes endpoints principales:

- **🔐 Supabase Auth API**: Autenticación JWT
- **🤖 Edge Functions**: Meeting Processor & Resource Scraper  
- **📊 Database API**: CRUD operations con RLS
- **📡 Real-time API**: WebSocket subscriptions

## 🌐 **Base URLs**

```bash
# Production
SUPABASE_URL=https://pikywaoqlekupfynnclg.supabase.co
EDGE_FUNCTIONS_URL=https://pikywaoqlekupfynnclg.supabase.co/functions/v1

# Local Development  
SUPABASE_URL=http://localhost:54321
EDGE_FUNCTIONS_URL=http://localhost:54321/functions/v1
```

## 🔧 **Herramientas Recomendadas**

### **Swagger/OpenAPI (Recomendado)**
```bash
# Instalar herramientas de documentación
npm install --save-dev swagger-ui-express @apidevtools/swagger-jsdoc

# Generar documentación interactiva
npm run docs:generate
```

### **Postman Collection**
- **Ventajas**: Testing integrado, entornos, scripts pre/post-request
- **Ubicación**: `docs/postman/AI-Pair-Orchestrator-Pro.postman_collection.json`
- **Entornos**: Development, Staging, Production

## 📋 **OpenAPI 3.0 Specification**

```yaml
openapi: 3.0.3
info:
  title: AI Pair Orchestrator Pro API
  description: |
    Enterprise SaaS platform for AI-powered business automation with multi-tenant architecture.
    
    ## Features
    - 🔐 JWT Authentication with role-based access
    - 🏢 Multi-tenant data isolation  
    - 🤖 AI processing (transcription, analysis)
    - 📄 Document scraping and processing
    - 📊 Real-time data subscriptions
    
  version: 1.0.0
  contact:
    name: AI Pair Platform Team
    email: support@VibeThink.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://pikywaoqlekupfynnclg.supabase.co
    description: Production server
  - url: http://localhost:54321
    description: Local development server

security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: "550e8400-e29b-41d4-a716-446655440000"
        email:
          type: string
          format: email
          example: "user@company.com"
        full_name:
          type: string
          example: "Juan Pérez"
        role:
          type: string
          enum: [SUPER_ADMIN, SUPPORT, OWNER, ADMIN, MANAGER, EMPLOYEE]
          example: "ADMIN"
        company_id:
          type: string
          format: uuid
          example: "123e4567-e89b-12d3-a456-426614174000"
        is_active:
          type: boolean
          example: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    Company:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
          example: "ACME Corporation"
        subscription_plan:
          type: string
          enum: [STARTUP, PROFESSIONAL, ENTERPRISE, CUSTOM]
          example: "PROFESSIONAL"
        status:
          type: string
          enum: [ACTIVE, SUSPENDED, CANCELLED]
          example: "ACTIVE"
        created_at:
          type: string
          format: date-time

    MeetingProcessRequest:
      type: object
      required:
        - file_data
        - file_type
        - company_id
      properties:
        file_name:
          type: string
          example: "weekly-meeting.mp3"
        file_data:
          type: string
          format: base64
          description: "Base64 encoded audio file"
        file_type:
          type: string
          enum: [audio/wav, audio/mp3, audio/mpeg, audio/mp4, audio/m4a, audio/webm]
          example: "audio/mp3"
        meeting_title:
          type: string
          example: "Weekly Team Standup"
        meeting_date:
          type: string
          format: date
          example: "2024-01-15"
        attendees:
          type: array
          items:
            type: string
          example: ["Juan Pérez", "María García", "Carlos López"]
        company_id:
          type: string
          format: uuid

    MeetingProcessResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          type: object
          properties:
            transcription:
              type: string
              example: "En esta reunión discutimos los objetivos trimestrales..."
            meeting_minutes:
              $ref: '#/components/schemas/MeetingMinutes'
            usage:
              $ref: '#/components/schemas/UsageMetrics'
        error:
          type: string
          example: null

    MeetingMinutes:
      type: object
      properties:
        title:
          type: string
          example: "Weekly Team Standup"
        date:
          type: string
          format: date
          example: "2024-01-15"
        attendees:
          type: array
          items:
            type: string
          example: ["Juan Pérez", "María García"]
        summary:
          type: string
          example: "Se revisaron los objetivos trimestrales y se asignaron nuevas tareas."
        key_points:
          type: array
          items:
            type: string
          example: ["Incremento del 15% en ventas", "Lanzamiento del nuevo producto en Q2"]
        action_items:
          type: array
          items:
            $ref: '#/components/schemas/ActionItem'
        decisions:
          type: array
          items:
            type: string
          example: ["Aprobar presupuesto adicional para marketing"]
        next_steps:
          type: array
          items:
            type: string
          example: ["Preparar presentación para la junta directiva"]

    ActionItem:
      type: object
      properties:
        task:
          type: string
          example: "Preparar informe de ventas Q1"
        assignee:
          type: string
          example: "Juan Pérez"
        due_date:
          type: string
          format: date
          example: "2024-01-30"
        priority:
          type: string
          enum: [low, medium, high]
          example: "high"

    ScrapeRequest:
      type: object
      required:
        - url
        - extractionType
        - userId
      properties:
        url:
          type: string
          format: uri
          example: "https://example.com/article"
        extractionType:
          type: string
          enum: [article, product, research, general]
          example: "article"
        tags:
          type: array
          items:
            type: string
          example: ["business", "technology"]
        userId:
          type: string
          format: uuid

    UsageMetrics:
      type: object
      properties:
        transcription_duration:
          type: integer
          description: "Duration in seconds"
          example: 1800
        cost_estimate:
          type: number
          format: decimal
          example: 0.0245
        tokens_used:
          type: integer
          example: 1250

    Error:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: string
          example: "Missing required fields: file_data, file_type, company_id"
        code:
          type: string
          example: "VALIDATION_ERROR"
        timestamp:
          type: string
          format: date-time

paths:
  /functions/v1/meeting-processor:
    post:
      tags:
        - AI Processing
      summary: Process meeting audio file
      description: |
        Transcribe audio files and generate structured meeting minutes with:
        - Full transcription using OpenAI Whisper
        - AI-generated summary and key points  
        - Action items extraction with assignments
        - Automatic cost and usage tracking
        
        **Supported formats**: WAV, MP3, MP4, M4A, WebM
        **Max file size**: 25MB
        **Rate limits**: Based on company subscription plan
        
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MeetingProcessRequest'
            example:
              file_name: "team-meeting-jan-15.mp3"
              file_data: "UklGRnoGAABXQVZFZm10IBAAAAABAAEA..."
              file_type: "audio/mp3"
              meeting_title: "Weekly Team Standup"
              meeting_date: "2024-01-15"
              attendees: ["Juan Pérez", "María García", "Carlos López"]
              company_id: "123e4567-e89b-12d3-a456-426614174000"
              
      responses:
        '200':
          description: Meeting processed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MeetingProcessResponse'
              example:
                success: true
                data:
                  transcription: "Buenas tardes equipo. En la reunión de hoy vamos a revisar..."
                  meeting_minutes:
                    title: "Weekly Team Standup"
                    date: "2024-01-15"
                    attendees: ["Juan Pérez", "María García", "Carlos López"]
                    summary: "Se revisaron los objetivos trimestrales y se definieron las prioridades para la próxima semana."
                    key_points: [
                      "Incremento del 15% en ventas respecto al mes anterior",
                      "Lanzamiento del nuevo producto planificado para Q2"
                    ]
                    action_items: [
                      {
                        task: "Preparar informe de ventas Q1",
                        assignee: "Juan Pérez", 
                        due_date: "2024-01-30",
                        priority: "high"
                      }
                    ]
                    decisions: ["Aprobar presupuesto adicional para marketing digital"]
                    next_steps: ["Preparar presentación para la junta directiva"]
                  usage:
                    transcription_duration: 1800
                    cost_estimate: 0.0245
                    tokens_used: 1250
                    
        '400':
          description: Bad request - missing required fields
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                success: false
                error: "Missing required fields: file_data, file_type, company_id"
                code: "VALIDATION_ERROR"
                
        '401':
          description: Unauthorized - invalid or missing authentication
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                success: false
                error: "Authorization header required"
                code: "UNAUTHORIZED"
                
        '403':
          description: Forbidden - user does not have access to company
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                success: false
                error: "User does not have access to this company"
                code: "FORBIDDEN"
                
        '429':
          description: Rate limit exceeded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                success: false
                error: "Monthly AI request limit exceeded. Please upgrade your plan."
                code: "RATE_LIMIT_EXCEEDED"
                
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /functions/v1/resource-scraper:
    post:
      tags:
        - Content Processing
      summary: Scrape web content
      description: |
        Extract structured content from web pages using AI-powered scraping:
        - Article content extraction
        - Product information parsing
        - Research data extraction  
        - Custom extraction prompts
        
        Uses Firecrawl API for reliable content extraction.
        
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ScrapeRequest'
            example:
              url: "https://techcrunch.com/2024/01/15/ai-breakthrough"
              extractionType: "article"
              tags: ["technology", "AI", "innovation"]
              userId: "550e8400-e29b-41d4-a716-446655440000"
              
      responses:
        '200':
          description: Content scraped successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  content:
                    type: string
                    example: "AI breakthrough enables 50% faster processing..."
                  metadata:
                    type: object
                    properties:
                      title:
                        type: string
                        example: "AI Breakthrough Enables Faster Processing"
                      description:
                        type: string
                        example: "New advancement in AI technology..."
                      url:
                        type: string
                        example: "https://techcrunch.com/2024/01/15/ai-breakthrough"
                      scraped_at:
                        type: string
                        format: date-time
                        
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
                
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/v1/token:
    post:
      tags:
        - Authentication
      summary: User authentication
      description: Authenticate user and receive JWT token
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                  example: "admin@company.com"
                password:
                  type: string
                  format: password
                  example: "securepassword123"
                  
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                    example: "eyJhbGciOiJIUzI1NiIs..."
                  refresh_token:
                    type: string
                    example: "eyJhbGciOiJIUzI1NiIs..."
                  expires_in:
                    type: integer
                    example: 3600
                  token_type:
                    type: string
                    example: "bearer"
                  user:
                    $ref: '#/components/schemas/User'
                    
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /rest/v1/companies:
    get:
      tags:
        - Companies
      summary: List companies (SUPER_ADMIN only)
      description: Get list of all companies in the platform
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
          description: Number of results to return
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
          description: Number of results to skip
          
      responses:
        '200':
          description: Companies retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Company'

  /rest/v1/user_profiles:
    get:
      tags:
        - Users
      summary: List company users
      description: Get users for the authenticated user's company
      parameters:
        - name: role
          in: query
          schema:
            type: string
            enum: [EMPLOYEE, MANAGER, ADMIN, OWNER]
          description: Filter by user role
        - name: is_active
          in: query
          schema:
            type: boolean
          description: Filter by active status
          
      responses:
        '200':
          description: Users retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'

  /rest/v1/rpc/get_company_limits:
    post:
      tags:
        - Company Management
      summary: Get company usage limits
      description: Retrieve current usage and limits for a company
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                p_company_id:
                  type: string
                  format: uuid
                  
      responses:
        '200':
          description: Limits retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  max_users:
                    type: integer
                    example: 25
                  max_monthly_ai_requests:
                    type: integer
                    example: 10000
                  max_monthly_scraping_pages:
                    type: integer
                    example: 1000
                  max_storage_gb:
                    type: integer
                    example: 10
                  current_usage:
                    type: object
                    properties:
                      users:
                        type: integer
                        example: 12
                      ai_requests:
                        type: integer
                        example: 2340
                      scraping_pages:
                        type: integer
                        example: 456
                      storage_mb:
                        type: integer
                        example: 3072
                  features:
                    type: array
                    items:
                      type: string
                    example: ["ai_generation", "document_processing", "advanced_analytics"]

tags:
  - name: Authentication
    description: User authentication and session management
  - name: AI Processing
    description: AI-powered content processing and analysis
  - name: Content Processing
    description: Web scraping and content extraction
  - name: Companies
    description: Company management and configuration
  - name: Users
    description: User management and profiles
  - name: Company Management
    description: Company limits and usage tracking
```

## 📬 **Postman Collection Setup**

### **1. Crear Colección**
```bash
# Crear directorio para Postman
mkdir -p docs/postman

# Crear colección base
```

### **2. Entornos de Postman**

**Development Environment:**
```json
{
  "name": "AI Pair Orchestrator Pro - Development",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:54321",
      "enabled": true
    },
    {
      "key": "supabase_anon_key",
      "value": "{{SUPABASE_ANON_KEY}}",
      "enabled": true
    },
    {
      "key": "auth_token",
      "value": "",
      "enabled": true
    }
  ]
}
```

**Production Environment:**
```json
{
  "name": "AI Pair Orchestrator Pro - Production", 
  "values": [
    {
      "key": "base_url",
      "value": "https://pikywaoqlekupfynnclg.supabase.co",
      "enabled": true
    },
    {
      "key": "supabase_anon_key",
      "value": "{{SUPABASE_ANON_KEY}}",
      "enabled": true
    },
    {
      "key": "auth_token",
      "value": "",
      "enabled": true
    }
  ]
}
```

## 🧪 **Testing con Postman**

### **Pre-request Scripts**
```javascript
// Set authentication token
if (pm.environment.get("auth_token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("auth_token")
    });
}

// Set Supabase headers
pm.request.headers.add({
    key: "apikey",
    value: pm.environment.get("supabase_anon_key")
});
```

### **Tests Scripts**
```javascript
// Validate response status
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Validate response structure
pm.test("Response has success property", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
});

// Store auth token for subsequent requests
if (pm.response.json().access_token) {
    pm.environment.set("auth_token", pm.response.json().access_token);
}
```

## 🔄 **Workflow de Testing**

### **1. Secuencia de Tests**
1. **Authentication** → Obtener token JWT
2. **Company Limits** → Verificar limits disponibles  
3. **Meeting Processing** → Procesar archivo de audio
4. **Resource Scraping** → Extraer contenido web
5. **Usage Tracking** → Verificar consumo actualizado

### **2. Automatización CI/CD**
```bash
# Newman para testing automatizado
npm install -g newman

# Ejecutar colección en CI
newman run docs/postman/collection.json \
  --environment docs/postman/environments/development.json \
  --reporters cli,json \
  --reporter-json-export test-results.json
```

## 📊 **Monitoreo y Analytics**

### **Response Times**
- Meeting Processing: `< 30 segundos`
- Resource Scraping: `< 10 segundos`  
- Database Queries: `< 2 segundos`
- Authentication: `< 1 segundo`

### **Rate Limits por Plan**
```typescript
const RATE_LIMITS = {
  STARTUP: {
    ai_requests_per_month: 1000,
    scraping_pages_per_month: 500,
    requests_per_minute: 60
  },
  PROFESSIONAL: {
    ai_requests_per_month: 10000,
    scraping_pages_per_month: 5000,
    requests_per_minute: 300
  },
  ENTERPRISE: {
    ai_requests_per_month: 100000,
    scraping_pages_per_month: 50000,
    requests_per_minute: 1000
  }
}
```

## 🔧 **Próximos Pasos**

1. **✅ Generar Postman Collection** → Script automatizado
2. **📖 Swagger UI Integration** → Interface interactiva  
3. **🧪 Automated API Testing** → CI/CD pipeline
4. **📊 API Monitoring** → Performance tracking
5. **🔐 Security Testing** → Penetration testing

## 💡 **Recomendaciones**

### **Para Desarrollo**
- Usar **Postman** para testing manual e integración
- Implementar **Swagger UI** para documentación interactiva
- Configurar **Newman** para testing automatizado

### **Para Producción**
- Monitoreo con **Postman Monitor** o **Datadog**
- Rate limiting con **Supabase Edge Functions**
- Logging estructurado con **Winston** o **Pino**

---

**🚀 ¿Siguiente paso?** 
1. Generar Postman Collection automatizada
2. Configurar Swagger UI 
3. Integrar testing en CI/CD pipeline
</rewritten_file> 