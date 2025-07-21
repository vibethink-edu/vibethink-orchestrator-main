# 📚 **SWAGGER DOCUMENTATION - VibeThink 1.0**

## 🎯 **RESUMEN EJECUTIVO**

**Versión:** 1.0  
**Fecha:** 19/7/2025  
**Estado:** ✅ **ACTIVO**  
**Base URL:** `https://api.vibethink.com`  
**Compliance:** VThink 1.0 + CMMI-ML3

## 🔐 **AUTENTICACIÓN**

### **Bearer Token:**
```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### **Headers Requeridos:**
```yaml
headers:
  Authorization:
    description: Bearer token de autenticación
    required: true
    schema:
      type: string
      example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  
  X-Company-ID:
    description: ID de la empresa del usuario
    required: true
    schema:
      type: string
      format: uuid
      example: "550e8400-e29b-41d4-a716-446655440000"
  
  Content-Type:
    description: Tipo de contenido
    required: true
    schema:
      type: string
      example: "application/json"
```

## 👥 **API DE USUARIOS**

### **GET /api/users**
**Descripción:** Obtener lista de usuarios de la empresa

**Parámetros:**
```yaml
parameters:
  - name: page
    in: query
    description: Número de página
    required: false
    schema:
      type: integer
      default: 1
      minimum: 1
  
  - name: limit
    in: query
    description: Límite de usuarios por página
    required: false
    schema:
      type: integer
      default: 20
      minimum: 1
      maximum: 100
  
  - name: role
    in: query
    description: Filtrar por rol de usuario
    required: false
    schema:
      type: string
      enum: [EMPLOYEE, MANAGER, ADMIN, OWNER, SUPER_ADMIN]
  
  - name: search
    in: query
    description: Búsqueda por nombre o email
    required: false
    schema:
      type: string
      minLength: 2
  
  - name: active
    in: query
    description: Filtrar por estado activo
    required: false
    schema:
      type: boolean
```

**Respuesta Exitosa (200):**
```yaml
responses:
  '200':
    description: Lista de usuarios obtenida exitosamente
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                users:
                  type: array
                  items:
                    $ref: '#/components/schemas/User'
                pagination:
                  $ref: '#/components/schemas/Pagination'
            message:
              type: string
              example: "Usuarios obtenidos exitosamente"
            timestamp:
              type: string
              format: date-time
              example: "2025-07-19T10:30:00Z"
```

**Respuesta de Error (401):**
```yaml
responses:
  '401':
    description: No autenticado
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            error:
              type: object
              properties:
                code:
                  type: string
                  example: "UNAUTHORIZED"
                message:
                  type: string
                  example: "Token de autenticación inválido"
                details:
                  type: object
                  properties:
                    expired:
                      type: boolean
                      example: true
                    invalid_signature:
                      type: boolean
                      example: false
```

### **POST /api/users**
**Descripción:** Crear nuevo usuario

**Body:**
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:
          - email
          - name
          - role
        properties:
          email:
            type: string
            format: email
            description: Email del usuario
            example: "nuevo@empresa.com"
          name:
            type: string
            minLength: 2
            maxLength: 100
            description: Nombre completo del usuario
            example: "Juan Pérez"
          role:
            type: string
            enum: [EMPLOYEE, MANAGER, ADMIN, OWNER]
            description: Rol del usuario
            example: "EMPLOYEE"
          password:
            type: string
            minLength: 8
            description: Contraseña del usuario
            example: "SecurePass123!"
          send_invitation:
            type: boolean
            description: Enviar invitación por email
            default: true
```

**Respuesta Exitosa (201):**
```yaml
responses:
  '201':
    description: Usuario creado exitosamente
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                user:
                  $ref: '#/components/schemas/User'
                invitation_sent:
                  type: boolean
                  example: true
            message:
              type: string
              example: "Usuario creado exitosamente"
```

### **PUT /api/users/{id}**
**Descripción:** Actualizar usuario existente

**Parámetros:**
```yaml
parameters:
  - name: id
    in: path
    required: true
    description: ID del usuario
    schema:
      type: string
      format: uuid
      example: "550e8400-e29b-41d4-a716-446655440000"
```

**Body:**
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          name:
            type: string
            minLength: 2
            maxLength: 100
            description: Nombre actualizado
            example: "Juan Pérez Actualizado"
          role:
            type: string
            enum: [EMPLOYEE, MANAGER, ADMIN, OWNER]
            description: Rol actualizado
            example: "MANAGER"
          is_active:
            type: boolean
            description: Estado activo del usuario
            example: true
```

## 🏢 **API DE EMPRESAS**

### **GET /api/companies/{id}**
**Descripción:** Obtener información de la empresa

**Parámetros:**
```yaml
parameters:
  - name: id
    in: path
    required: true
    description: ID de la empresa
    schema:
      type: string
      format: uuid
      example: "550e8400-e29b-41d4-a716-446655440000"
```

**Respuesta Exitosa (200):**
```yaml
responses:
  '200':
    description: Información de la empresa obtenida
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                company:
                  $ref: '#/components/schemas/Company'
```

### **PUT /api/companies/{id}**
**Descripción:** Actualizar configuración de la empresa

**Body:**
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          name:
            type: string
            minLength: 2
            maxLength: 100
            description: Nombre de la empresa
            example: "Mi Empresa Actualizada"
          settings:
            type: object
            properties:
              theme:
                type: object
                properties:
                  mode:
                    type: string
                    enum: [light, dark, auto]
                    example: "light"
                  primary_color:
                    type: string
                    pattern: '^#[0-9A-Fa-f]{6}$'
                    example: "#10b981"
              notifications:
                type: object
                properties:
                  email:
                    type: boolean
                    example: true
                  push:
                    type: boolean
                    example: false
                  sms:
                    type: boolean
                    example: false
```

## 💰 **API DE FACTURACIÓN**

### **GET /api/billing/current**
**Descripción:** Obtener información de facturación actual

**Respuesta Exitosa (200):**
```yaml
responses:
  '200':
    description: Información de facturación obtenida
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                billing:
                  $ref: '#/components/schemas/Billing'
```

### **GET /api/billing/history**
**Descripción:** Obtener historial de facturación

**Parámetros:**
```yaml
parameters:
  - name: page
    in: query
    description: Número de página
    required: false
    schema:
      type: integer
      default: 1
      minimum: 1
  
  - name: limit
    in: query
    description: Límite de facturas por página
    required: false
    schema:
      type: integer
      default: 12
      minimum: 1
      maximum: 50
  
  - name: year
    in: query
    description: Filtrar por año
    required: false
    schema:
      type: integer
      minimum: 2020
      maximum: 2030
      example: 2025
```

## 🤖 **API DE IA**

### **POST /api/ai/chat**
**Descripción:** Enviar mensaje al chat de IA

**Body:**
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:
          - message
        properties:
          message:
            type: string
            minLength: 1
            maxLength: 1000
            description: Mensaje del usuario
            example: "¿Cuál es el estado de mis proyectos?"
          context:
            type: object
            properties:
              project_id:
                type: string
                format: uuid
                description: ID del proyecto
                example: "550e8400-e29b-41d4-a716-446655440000"
              conversation_id:
                type: string
                format: uuid
                description: ID de la conversación
                example: "550e8400-e29b-41d4-a716-446655440000"
          model:
            type: string
            enum: [gpt-3.5-turbo, gpt-4, claude-3]
            default: "gpt-3.5-turbo"
            description: Modelo de IA a usar
            example: "gpt-4"
```

**Respuesta Exitosa (200):**
```yaml
responses:
  '200':
    description: Respuesta de IA generada
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                response:
                  type: string
                  description: Respuesta de la IA
                  example: "Basándome en los datos de tus proyectos..."
                conversation_id:
                  type: string
                  format: uuid
                  description: ID de la conversación
                  example: "550e8400-e29b-41d4-a716-446655440000"
                usage:
                  type: object
                  properties:
                    tokens_used:
                      type: integer
                      description: Tokens utilizados
                      example: 150
                    cost:
                      type: number
                      format: float
                      description: Costo de la consulta
                      example: 0.002
                model:
                  type: string
                  description: Modelo utilizado
                  example: "gpt-4"
```

## 📊 **API DE MÉTRICAS**

### **GET /api/metrics/dashboard**
**Descripción:** Obtener métricas del dashboard

**Respuesta Exitosa (200):**
```yaml
responses:
  '200':
    description: Métricas del dashboard obtenidas
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                metrics:
                  $ref: '#/components/schemas/DashboardMetrics'
```

## 🔧 **ESQUEMAS DE DATOS**

### **User Schema:**
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: ID único del usuario
          example: "550e8400-e29b-41d4-a716-446655440000"
        email:
          type: string
          format: email
          description: Email del usuario
          example: "usuario@empresa.com"
        name:
          type: string
          description: Nombre completo del usuario
          example: "Juan Pérez"
        role:
          type: string
          enum: [EMPLOYEE, MANAGER, ADMIN, OWNER, SUPER_ADMIN]
          description: Rol del usuario
          example: "EMPLOYEE"
        company_id:
          type: string
          format: uuid
          description: ID de la empresa
          example: "550e8400-e29b-41d4-a716-446655440000"
        is_active:
          type: boolean
          description: Estado activo del usuario
          example: true
        created_at:
          type: string
          format: date-time
          description: Fecha de creación
          example: "2025-07-19T10:30:00Z"
        updated_at:
          type: string
          format: date-time
          description: Fecha de última actualización
          example: "2025-07-19T10:30:00Z"
      required:
        - id
        - email
        - name
        - role
        - company_id
        - is_active
        - created_at
```

### **Company Schema:**
```yaml
components:
  schemas:
    Company:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: ID único de la empresa
          example: "550e8400-e29b-41d4-a716-446655440000"
        name:
          type: string
          description: Nombre de la empresa
          example: "Mi Empresa"
        domain:
          type: string
          description: Dominio de la empresa
          example: "miempresa.com"
        plan:
          type: string
          enum: [BASIC, PREMIUM, ENTERPRISE]
          description: Plan de la empresa
          example: "PREMIUM"
        max_users:
          type: integer
          description: Máximo número de usuarios
          example: 100
        current_users:
          type: integer
          description: Número actual de usuarios
          example: 45
        created_at:
          type: string
          format: date-time
          description: Fecha de creación
          example: "2025-01-01T00:00:00Z"
        settings:
          type: object
          properties:
            theme:
              type: object
              properties:
                mode:
                  type: string
                  enum: [light, dark, auto]
                  example: "dark"
                primary_color:
                  type: string
                  example: "#3b82f6"
            language:
              type: string
              enum: [es, en]
              example: "es"
            timezone:
              type: string
              example: "America/Mexico_City"
      required:
        - id
        - name
        - plan
        - max_users
        - current_users
        - created_at
```

### **Billing Schema:**
```yaml
components:
  schemas:
    Billing:
      type: object
      properties:
        plan:
          type: string
          enum: [BASIC, PREMIUM, ENTERPRISE]
          description: Plan actual
          example: "PREMIUM"
        monthly_cost:
          type: number
          format: float
          description: Costo mensual
          example: 99.99
        current_usage:
          type: object
          properties:
            users:
              type: integer
              description: Usuarios actuales
              example: 45
            storage_gb:
              type: number
              format: float
              description: Almacenamiento usado en GB
              example: 2.5
            api_calls:
              type: integer
              description: Llamadas a API
              example: 15000
        limits:
          type: object
          properties:
            max_users:
              type: integer
              description: Máximo de usuarios
              example: 100
            max_storage_gb:
              type: number
              format: float
              description: Máximo almacenamiento en GB
              example: 10
            max_api_calls:
              type: integer
              description: Máximo llamadas a API
              example: 50000
        next_billing_date:
          type: string
          format: date-time
          description: Próxima fecha de facturación
          example: "2025-08-01T00:00:00Z"
      required:
        - plan
        - monthly_cost
        - current_usage
        - limits
        - next_billing_date
```

### **Pagination Schema:**
```yaml
components:
  schemas:
    Pagination:
      type: object
      properties:
        page:
          type: integer
          description: Página actual
          example: 1
        limit:
          type: integer
          description: Límite por página
          example: 20
        total:
          type: integer
          description: Total de elementos
          example: 150
        totalPages:
          type: integer
          description: Total de páginas
          example: 8
      required:
        - page
        - limit
        - total
        - totalPages
```

### **DashboardMetrics Schema:**
```yaml
components:
  schemas:
    DashboardMetrics:
      type: object
      properties:
        users:
          type: object
          properties:
            total:
              type: integer
              description: Total de usuarios
              example: 45
            active:
              type: integer
              description: Usuarios activos
              example: 42
            growth:
              type: number
              format: float
              description: Crecimiento porcentual
              example: 12.5
        usage:
          type: object
          properties:
            storage_gb:
              type: number
              format: float
              description: Almacenamiento usado
              example: 2.5
            api_calls:
              type: integer
              description: Llamadas a API
              example: 15000
            ai_requests:
              type: integer
              description: Solicitudes de IA
              example: 500
        performance:
          type: object
          properties:
            avg_response_time:
              type: integer
              description: Tiempo promedio de respuesta en ms
              example: 120
            uptime:
              type: number
              format: float
              description: Tiempo de actividad en porcentaje
              example: 99.9
            error_rate:
              type: number
              format: float
              description: Tasa de errores en porcentaje
              example: 0.1
      required:
        - users
        - usage
        - performance
```

## 🚨 **CÓDIGOS DE ERROR**

### **Error Responses:**
```yaml
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            code:
              type: string
              description: Código de error
              example: "VALIDATION_ERROR"
            message:
              type: string
              description: Mensaje de error
              example: "Datos inválidos"
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                    description: Campo con error
                    example: "email"
                  message:
                    type: string
                    description: Mensaje específico del error
                    example: "Email inválido"
        timestamp:
          type: string
          format: date-time
          description: Timestamp del error
          example: "2025-07-19T10:30:00Z"
      required:
        - success
        - error
        - timestamp
```

### **Códigos de Error Comunes:**
```yaml
responses:
  '400':
    description: Bad Request - Datos inválidos
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
  
  '401':
    description: Unauthorized - No autenticado
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
  
  '403':
    description: Forbidden - Sin permisos
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
  
  '404':
    description: Not Found - Recurso no encontrado
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
  
  '409':
    description: Conflict - Recurso ya existe
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
  
  '429':
    description: Too Many Requests - Rate limit excedido
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
  
  '500':
    description: Internal Server Error - Error del servidor
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
```

## 🔄 **RATE LIMITING**

### **Límites por Endpoint:**
```yaml
x-rate-limit:
  'GET /api/users': '100 requests/hour'
  'POST /api/users': '10 requests/hour'
  'PUT /api/users/{id}': '50 requests/hour'
  'GET /api/metrics/*': '200 requests/hour'
  'POST /api/ai/chat': '100 requests/hour'
  'GET /api/billing/*': '50 requests/hour'
```

### **Headers de Rate Limiting:**
```yaml
headers:
  X-RateLimit-Limit:
    description: Límite de requests por hora
    schema:
      type: integer
      example: 100
  
  X-RateLimit-Remaining:
    description: Requests restantes
    schema:
      type: integer
      example: 95
  
  X-RateLimit-Reset:
    description: Timestamp de reset del rate limit
    schema:
      type: integer
      example: 1640995200
```

---

**📌 NOTA: Esta documentación Swagger está actualizada y cumple con los estándares de VThink 1.0.** 