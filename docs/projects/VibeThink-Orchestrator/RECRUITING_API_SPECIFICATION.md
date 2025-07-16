# Especificación de APIs - Módulo Agentic de Recruiting

## Base URL
```
https://api.enterprise.com/recruiting/v1
```

## Autenticación
Todas las APIs requieren autenticación JWT con header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints Principales

### 1. Gestión de Workflows de Recruiting

#### POST /workflows/start
Inicia un nuevo workflow de recruiting.

**Request Body:**
```json
{
  "company_id": "string",
  "position": {
    "title": "Senior Software Engineer",
    "department": "Engineering",
    "location": "Bogotá, Colombia",
    "type": "full-time"
  },
  "requirements": {
    "skills": ["Python", "React", "AWS"],
    "experience_years": 3,
    "education": "Bachelor's degree",
    "languages": ["Spanish", "English"]
  },
  "search_strategy": {
    "internal_search": true,
    "linkedin_search": true,
    "external_portals": ["Indeed", "Glassdoor"],
    "outreach_channels": ["email", "linkedin_invitation"]
  },
  "budget_range": "4000-6000 USD",
  "urgency": "high",
  "approval_required": false
}
```

**Response:**
```json
{
  "workflow_id": "rec_company123_1703123456",
  "status": "initiated",
  "estimated_completion": "2024-01-20T18:00:00Z",
  "landing_page_url": "https://careers.company.com/apply/rec_company123_1703123456",
  "dashboard_url": "https://hr.company.com/recruiting/rec_company123_1703123456"
}
```

#### GET /workflows/{workflow_id}
Obtiene el estado actual de un workflow.

**Response:**
```json
{
  "workflow_id": "rec_company123_1703123456",
  "status": "in_progress",
  "progress": {
    "market_research": "completed",
    "database_search": "completed",
    "linkedin_scraping": "in_progress",
    "outreach": "pending",
    "landing_page": "completed",
    "applications": "pending"
  },
  "metrics": {
    "candidates_found": 45,
    "outreach_sent": 23,
    "responses_received": 8,
    "applications_received": 12
  },
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T14:30:00Z"
}
```

#### GET /workflows/{workflow_id}/candidates
Obtiene la lista de candidatos encontrados.

**Query Parameters:**
- `status`: Filter por status (found, contacted, responded, applied)
- `source`: Filter por fuente (internal, linkedin, external)
- `limit`: Número máximo de resultados (default: 50)
- `offset`: Paginación

**Response:**
```json
{
  "candidates": [
    {
      "id": "cand_123",
      "name": "María González",
      "title": "Senior Software Engineer",
      "company": "TechCorp",
      "location": "Bogotá, Colombia",
      "experience_years": 5,
      "skills": ["Python", "React", "AWS", "Docker"],
      "source": "linkedin",
      "profile_url": "https://linkedin.com/in/mariagonzalez",
      "status": "contacted",
      "outreach_date": "2024-01-15T11:00:00Z",
      "response_date": "2024-01-15T14:00:00Z",
      "score": 0.85
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 50
}
```

### 2. Gestión de Outreach

#### POST /workflows/{workflow_id}/outreach
Envía outreach a candidatos específicos.

**Request Body:**
```json
{
  "candidate_ids": ["cand_123", "cand_456"],
  "message_template": "personalized_invitation",
  "custom_message": "Hola María, vimos tu perfil y nos gustaría invitarte...",
  "channels": ["email", "linkedin_invitation"],
  "schedule": {
    "send_immediately": true,
    "timezone": "America/Bogota"
  }
}
```

#### GET /workflows/{workflow_id}/outreach/status
Obtiene el estado de las campañas de outreach.

**Response:**
```json
{
  "campaigns": [
    {
      "id": "camp_123",
      "status": "completed",
      "sent": 23,
      "delivered": 22,
      "opened": 15,
      "clicked": 8,
      "responded": 5,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 3. Gestión de Landing Pages

#### GET /landing-pages/{workflow_id}
Obtiene información de la landing page generada.

**Response:**
```json
{
  "workflow_id": "rec_company123_1703123456",
  "url": "https://careers.company.com/apply/rec_company123_1703123456",
  "title": "Senior Software Engineer - TechCorp",
  "status": "active",
  "analytics": {
    "visitors": 156,
    "applications": 12,
    "conversion_rate": 7.7,
    "avg_time_on_page": "2:30"
  },
  "created_at": "2024-01-15T10:05:00Z"
}
```

#### POST /landing-pages/{workflow_id}/customize
Personaliza la landing page.

**Request Body:**
```json
{
  "template": "modern_tech",
  "custom_fields": {
    "company_logo": "https://company.com/logo.png",
    "company_description": "Somos una empresa líder en...",
    "benefits": ["Remote work", "Health insurance", "Learning budget"]
  },
  "form_fields": [
    {"name": "name", "type": "text", "required": true},
    {"name": "email", "type": "email", "required": true},
    {"name": "cv", "type": "file", "required": true},
    {"name": "portfolio", "type": "url", "required": false}
  ]
}
```

### 4. Gestión de Aplicaciones

#### GET /workflows/{workflow_id}/applications
Obtiene las aplicaciones recibidas.

**Query Parameters:**
- `status`: Filter por status (new, reviewed, shortlisted, rejected)
- `date_from`: Fecha desde (ISO format)
- `date_to`: Fecha hasta (ISO format)

**Response:**
```json
{
  "applications": [
    {
      "id": "app_123",
      "candidate_name": "Carlos Rodríguez",
      "email": "carlos@email.com",
      "phone": "+57 300 123 4567",
      "cv_url": "https://storage.company.com/cvs/app_123.pdf",
      "portfolio_url": "https://github.com/carlosrodriguez",
      "status": "new",
      "score": 0.78,
      "applied_at": "2024-01-15T16:00:00Z",
      "reviewed_at": null,
      "reviewed_by": null
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 50
}
```

#### POST /applications/{application_id}/review
Revisa una aplicación.

**Request Body:**
```json
{
  "status": "shortlisted",
  "score": 0.85,
  "notes": "Excelente perfil técnico, experiencia relevante",
  "next_steps": "schedule_interview",
  "interview_date": "2024-01-20T14:00:00Z"
}
```

### 5. Métricas y Reportes

#### GET /workflows/{workflow_id}/metrics
Obtiene métricas detalladas del workflow.

**Response:**
```json
{
  "workflow_id": "rec_company123_1703123456",
  "overview": {
    "total_candidates": 45,
    "contacted": 23,
    "responded": 8,
    "applied": 12,
    "shortlisted": 5,
    "hired": 1
  },
  "timeline": {
    "started": "2024-01-15T10:00:00Z",
    "market_research_completed": "2024-01-15T10:30:00Z",
    "search_completed": "2024-01-15T11:00:00Z",
    "outreach_started": "2024-01-15T11:30:00Z",
    "first_application": "2024-01-15T14:00:00Z"
  },
  "sources": {
    "internal_database": 12,
    "linkedin": 28,
    "external_portals": 5
  },
  "engagement": {
    "email_open_rate": 65.2,
    "email_click_rate": 34.8,
    "linkedin_response_rate": 15.2,
    "application_conversion_rate": 7.7
  }
}
```

#### GET /companies/{company_id}/recruiting/dashboard
Dashboard general de recruiting para una empresa.

**Response:**
```json
{
  "company_id": "company123",
  "period": "2024-01",
  "overview": {
    "active_workflows": 5,
    "total_candidates": 234,
    "total_applications": 45,
    "total_hires": 8,
    "avg_time_to_hire": "18 days"
  },
  "top_positions": [
    {
      "title": "Senior Software Engineer",
      "candidates": 45,
      "applications": 12,
      "hires": 2
    }
  ],
  "performance": {
    "candidate_quality_score": 0.82,
    "time_to_fill": "15 days",
    "cost_per_hire": 2500
  }
}
```

### 6. Configuración y Administración

#### GET /companies/{company_id}/config
Obtiene la configuración de recruiting de una empresa.

**Response:**
```json
{
  "company_id": "company123",
  "ats_integration": {
    "provider": "bamboo_hr",
    "api_key": "***",
    "webhook_url": "https://api.company.com/webhooks/ats"
  },
  "email_provider": {
    "provider": "sendgrid",
    "api_key": "***",
    "from_email": "careers@company.com"
  },
  "linkedin_config": {
    "api_key": "***",
    "daily_limit": 100,
    "rate_limit_delay": 1000
  },
  "outreach_templates": [
    {
      "id": "template_1",
      "name": "Invitación Personalizada",
      "subject": "Oportunidad en {company_name}",
      "body": "Hola {candidate_name},..."
    }
  ],
  "landing_page_templates": [
    {
      "id": "modern_tech",
      "name": "Tech Modern",
      "preview_url": "https://preview.company.com/modern_tech"
    }
  ]
}
```

#### PUT /companies/{company_id}/config
Actualiza la configuración de recruiting.

**Request Body:**
```json
{
  "email_provider": {
    "provider": "sendgrid",
    "api_key": "new_api_key",
    "from_email": "talent@company.com"
  },
  "outreach_templates": [
    {
      "name": "Nueva Plantilla",
      "subject": "Oportunidad Única",
      "body": "Contenido del email..."
    }
  ]
}
```

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

## Rate Limiting

- **Workflows**: 10 por hora por empresa
- **Outreach**: 100 por día por empresa
- **API calls**: 1000 por hora por empresa

## Webhooks

### Eventos Disponibles
- `workflow.started`
- `workflow.completed`
- `candidate.found`
- `outreach.sent`
- `application.received`
- `application.reviewed`

### Ejemplo de Webhook
```json
{
  "event": "application.received",
  "workflow_id": "rec_company123_1703123456",
  "application_id": "app_123",
  "candidate_name": "María González",
  "timestamp": "2024-01-15T16:00:00Z",
  "data": {
    "email": "maria@email.com",
    "cv_url": "https://storage.company.com/cvs/app_123.pdf"
  }
}
``` 