# Esquemas de Datos - Módulo Agentic de Recruiting

## Modelos de Base de Datos

### 1. Workflows de Recruiting

```sql
-- Tabla principal de workflows
CREATE TABLE recruiting_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id VARCHAR(100) UNIQUE NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id),
    created_by UUID NOT NULL REFERENCES users(id),
    
    -- Información del puesto
    position_title VARCHAR(200) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(200),
    position_type VARCHAR(50), -- full-time, part-time, contract
    
    -- Requisitos
    requirements JSONB NOT NULL,
    search_strategy JSONB NOT NULL,
    
    -- Configuración
    budget_range VARCHAR(100),
    urgency VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    approval_required BOOLEAN DEFAULT false,
    
    -- Estado
    status VARCHAR(50) DEFAULT 'initiated', -- initiated, in_progress, completed, paused, cancelled
    progress JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    
    -- URLs generadas
    landing_page_url VARCHAR(500),
    dashboard_url VARCHAR(500),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Índices
    INDEX idx_workflows_company (company_id),
    INDEX idx_workflows_status (status),
    INDEX idx_workflows_created_at (created_at)
);

-- Tabla de configuración por empresa
CREATE TABLE company_recruiting_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID UNIQUE NOT NULL REFERENCES companies(id),
    
    -- Integración ATS
    ats_provider VARCHAR(100), -- bamboo_hr, workday, etc.
    ats_api_key VARCHAR(500),
    ats_webhook_url VARCHAR(500),
    
    -- Proveedor de email
    email_provider VARCHAR(100), -- sendgrid, aws_ses, etc.
    email_api_key VARCHAR(500),
    from_email VARCHAR(200),
    
    -- Configuración LinkedIn
    linkedin_api_key VARCHAR(500),
    linkedin_daily_limit INTEGER DEFAULT 100,
    linkedin_rate_limit_delay INTEGER DEFAULT 1000,
    
    -- Plantillas
    outreach_templates JSONB DEFAULT '[]',
    landing_page_templates JSONB DEFAULT '[]',
    
    -- Configuración de compliance
    compliance_settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Candidatos

```sql
-- Tabla de candidatos encontrados
CREATE TABLE recruiting_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id VARCHAR(100) UNIQUE NOT NULL,
    workflow_id UUID NOT NULL REFERENCES recruiting_workflows(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    
    -- Información básica
    name VARCHAR(200) NOT NULL,
    title VARCHAR(200),
    company VARCHAR(200),
    location VARCHAR(200),
    
    -- Detalles profesionales
    experience_years INTEGER,
    skills TEXT[], -- Array de skills
    education VARCHAR(200),
    languages TEXT[],
    
    -- Información de contacto
    email VARCHAR(200),
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    
    -- Origen y estado
    source VARCHAR(50) NOT NULL, -- internal, linkedin, external_portal
    source_details JSONB, -- Detalles específicos del origen
    status VARCHAR(50) DEFAULT 'found', -- found, contacted, responded, applied, shortlisted, rejected
    
    -- Scoring y evaluación
    score DECIMAL(3,2), -- 0.00 a 1.00
    evaluation_notes TEXT,
    
    -- Embeddings para búsqueda semántica
    profile_embedding VECTOR(1536), -- Para Qdrant
    
    -- Timestamps
    found_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contacted_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    applied_at TIMESTAMP WITH TIME ZONE,
    
    -- Índices
    INDEX idx_candidates_workflow (workflow_id),
    INDEX idx_candidates_company (company_id),
    INDEX idx_candidates_status (status),
    INDEX idx_candidates_source (source),
    INDEX idx_candidates_score (score DESC)
);

-- Tabla de detalles de perfil (información extraída)
CREATE TABLE candidate_profile_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES recruiting_candidates(id),
    
    -- Experiencia laboral
    work_experience JSONB, -- Array de trabajos anteriores
    
    -- Educación
    education_history JSONB, -- Array de estudios
    
    -- Certificaciones
    certifications JSONB, -- Array de certificaciones
    
    -- Proyectos
    projects JSONB, -- Array de proyectos destacados
    
    -- Información adicional
    additional_info JSONB,
    
    -- Metadata de scraping
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source_url VARCHAR(500),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Outreach y Comunicación

```sql
-- Tabla de campañas de outreach
CREATE TABLE outreach_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id VARCHAR(100) UNIQUE NOT NULL,
    workflow_id UUID NOT NULL REFERENCES recruiting_workflows(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    
    -- Configuración de la campaña
    name VARCHAR(200) NOT NULL,
    message_template VARCHAR(100),
    custom_message TEXT,
    channels TEXT[] NOT NULL, -- ['email', 'linkedin_invitation']
    
    -- Programación
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Estado
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sending, completed, failed
    
    -- Métricas
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    responded_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mensajes individuales
CREATE TABLE outreach_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES outreach_campaigns(id),
    candidate_id UUID NOT NULL REFERENCES recruiting_candidates(id),
    
    -- Detalles del mensaje
    channel VARCHAR(50) NOT NULL, -- email, linkedin_invitation, etc.
    subject VARCHAR(200),
    message_body TEXT,
    personalized_data JSONB, -- Datos personalizados usados
    
    -- Estado del envío
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, opened, clicked, responded, failed
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    
    -- Información de tracking
    tracking_id VARCHAR(100),
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Aplicaciones

```sql
-- Tabla de aplicaciones recibidas
CREATE TABLE recruiting_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id VARCHAR(100) UNIQUE NOT NULL,
    workflow_id UUID NOT NULL REFERENCES recruiting_workflows(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    
    -- Información del candidato
    candidate_name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    
    -- Archivos
    cv_url VARCHAR(500),
    cv_filename VARCHAR(200),
    portfolio_url VARCHAR(500),
    cover_letter TEXT,
    
    -- Información adicional
    additional_info JSONB, -- Campos adicionales del formulario
    
    -- Estado de la aplicación
    status VARCHAR(50) DEFAULT 'new', -- new, reviewed, shortlisted, rejected, hired
    score DECIMAL(3,2), -- 0.00 a 1.00
    review_notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Próximos pasos
    next_steps VARCHAR(100), -- schedule_interview, send_rejection, etc.
    interview_date TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de evaluaciones de aplicaciones
CREATE TABLE application_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES recruiting_applications(id),
    evaluator_id UUID NOT NULL REFERENCES users(id),
    
    -- Criterios de evaluación
    technical_skills INTEGER, -- 1-5
    experience_fit INTEGER, -- 1-5
    cultural_fit INTEGER, -- 1-5
    communication_skills INTEGER, -- 1-5
    
    -- Comentarios
    strengths TEXT,
    weaknesses TEXT,
    overall_notes TEXT,
    
    -- Recomendación
    recommendation VARCHAR(50), -- hire, interview, reject
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Landing Pages

```sql
-- Tabla de landing pages generadas
CREATE TABLE recruiting_landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID UNIQUE NOT NULL REFERENCES recruiting_workflows(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    
    -- Configuración de la página
    template VARCHAR(100) NOT NULL,
    custom_fields JSONB DEFAULT '{}',
    form_fields JSONB DEFAULT '[]',
    
    -- URLs
    url VARCHAR(500) NOT NULL,
    preview_url VARCHAR(500),
    
    -- Estado
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, archived
    
    -- Analytics
    visitors_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2), -- Porcentaje
    avg_time_on_page INTEGER, -- En segundos
    
    -- Metadata
    seo_title VARCHAR(200),
    seo_description TEXT,
    og_image_url VARCHAR(500),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de analytics de landing pages
CREATE TABLE landing_page_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landing_page_id UUID NOT NULL REFERENCES recruiting_landing_pages(id),
    
    -- Métricas de visitas
    date DATE NOT NULL,
    visitors INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    
    -- Métricas de conversión
    applications INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2),
    
    -- Métricas de engagement
    avg_time_on_page INTEGER,
    bounce_rate DECIMAL(5,2),
    
    -- Fuentes de tráfico
    traffic_sources JSONB, -- {'linkedin': 45, 'direct': 30, 'email': 25}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Métricas y Auditoría

```sql
-- Tabla de métricas de workflows
CREATE TABLE workflow_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES recruiting_workflows(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    
    -- Métricas generales
    total_candidates INTEGER DEFAULT 0,
    contacted_candidates INTEGER DEFAULT 0,
    responded_candidates INTEGER DEFAULT 0,
    applied_candidates INTEGER DEFAULT 0,
    shortlisted_candidates INTEGER DEFAULT 0,
    hired_candidates INTEGER DEFAULT 0,
    
    -- Métricas de tiempo
    time_to_first_application INTEGER, -- En horas
    time_to_hire INTEGER, -- En días
    avg_response_time INTEGER, -- En horas
    
    -- Métricas de calidad
    candidate_quality_score DECIMAL(3,2),
    application_quality_score DECIMAL(3,2),
    
    -- Métricas de costo
    cost_per_candidate DECIMAL(10,2),
    cost_per_application DECIMAL(10,2),
    cost_per_hire DECIMAL(10,2),
    
    -- Métricas de engagement
    email_open_rate DECIMAL(5,2),
    email_click_rate DECIMAL(5,2),
    linkedin_response_rate DECIMAL(5,2),
    
    -- Fecha de cálculo
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de auditoría
CREATE TABLE recruiting_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID REFERENCES users(id),
    
    -- Información del evento
    event_type VARCHAR(100) NOT NULL, -- workflow_started, candidate_contacted, etc.
    entity_type VARCHAR(100) NOT NULL, -- workflow, candidate, application, etc.
    entity_id VARCHAR(100) NOT NULL,
    
    -- Detalles del evento
    event_data JSONB,
    previous_state JSONB,
    new_state JSONB,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Modelos Pydantic

```python
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class WorkflowStatus(str, Enum):
    INITIATED = "initiated"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"

class CandidateStatus(str, Enum):
    FOUND = "found"
    CONTACTED = "contacted"
    RESPONDED = "responded"
    APPLIED = "applied"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"

class ApplicationStatus(str, Enum):
    NEW = "new"
    REVIEWED = "reviewed"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    HIRED = "hired"

# Modelos de Request
class PositionRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    department: Optional[str] = Field(None, max_length=100)
    location: str = Field(..., max_length=200)
    position_type: str = Field(..., regex="^(full-time|part-time|contract)$")

class RequirementsRequest(BaseModel):
    skills: List[str] = Field(..., min_items=1)
    experience_years: int = Field(..., ge=0, le=50)
    education: Optional[str] = Field(None, max_length=200)
    languages: List[str] = Field(default_factory=list)
    certifications: Optional[List[str]] = Field(None)
    soft_skills: Optional[List[str]] = Field(None)

class SearchStrategyRequest(BaseModel):
    internal_search: bool = Field(default=True)
    linkedin_search: bool = Field(default=True)
    external_portals: List[str] = Field(default_factory=list)
    outreach_channels: List[str] = Field(default_factory=list)
    max_candidates: int = Field(default=100, ge=1, le=1000)

class RecruitingWorkflowRequest(BaseModel):
    company_id: str = Field(..., min_length=1)
    position: PositionRequest
    requirements: RequirementsRequest
    search_strategy: SearchStrategyRequest
    budget_range: Optional[str] = Field(None, max_length=100)
    urgency: str = Field(default="normal", regex="^(low|normal|high|urgent)$")
    approval_required: bool = Field(default=False)

# Modelos de Response
class RecruitingWorkflowResponse(BaseModel):
    workflow_id: str
    status: WorkflowStatus
    estimated_completion: datetime
    landing_page_url: Optional[str] = None
    dashboard_url: Optional[str] = None

class CandidateResponse(BaseModel):
    id: str
    name: str
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    experience_years: Optional[int] = None
    skills: List[str] = Field(default_factory=list)
    source: str
    profile_url: Optional[str] = None
    status: CandidateStatus
    outreach_date: Optional[datetime] = None
    response_date: Optional[datetime] = None
    score: Optional[float] = Field(None, ge=0, le=1)

class ApplicationResponse(BaseModel):
    id: str
    candidate_name: str
    email: str
    phone: Optional[str] = None
    cv_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    status: ApplicationStatus
    score: Optional[float] = Field(None, ge=0, le=1)
    applied_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None

class WorkflowMetricsResponse(BaseModel):
    workflow_id: str
    overview: Dict[str, int]
    timeline: Dict[str, datetime]
    sources: Dict[str, int]
    engagement: Dict[str, float]

# Modelos de configuración
class CompanyRecruitingConfig(BaseModel):
    company_id: str
    ats_integration: Optional[Dict[str, Any]] = None
    email_provider: Dict[str, Any]
    linkedin_config: Optional[Dict[str, Any]] = None
    outreach_templates: List[Dict[str, Any]] = Field(default_factory=list)
    landing_page_templates: List[Dict[str, Any]] = Field(default_factory=list)
    compliance_settings: Dict[str, Any] = Field(default_factory=dict)
```

## Índices y Optimización

```sql
-- Índices para optimización de consultas
CREATE INDEX CONCURRENTLY idx_workflows_company_status ON recruiting_workflows(company_id, status);
CREATE INDEX CONCURRENTLY idx_candidates_workflow_status ON recruiting_candidates(workflow_id, status);
CREATE INDEX CONCURRENTLY idx_applications_workflow_status ON recruiting_applications(workflow_id, status);
CREATE INDEX CONCURRENTLY idx_audit_log_company_date ON recruiting_audit_log(company_id, created_at DESC);

-- Índices para búsquedas de texto
CREATE INDEX CONCURRENTLY idx_candidates_name_gin ON recruiting_candidates USING gin(to_tsvector('spanish', name));
CREATE INDEX CONCURRENTLY idx_candidates_skills_gin ON recruiting_candidates USING gin(skills);

-- Índices para métricas
CREATE INDEX CONCURRENTLY idx_metrics_workflow_date ON workflow_metrics(workflow_id, calculated_at DESC);
CREATE INDEX CONCURRENTLY idx_analytics_landing_date ON landing_page_analytics(landing_page_id, date DESC);
```

## Particionamiento

```sql
-- Particionamiento por fecha para tablas grandes
CREATE TABLE recruiting_audit_log_2024 PARTITION OF recruiting_audit_log
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE landing_page_analytics_2024 PARTITION OF landing_page_analytics
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
``` 