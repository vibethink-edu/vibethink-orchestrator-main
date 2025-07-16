# Guía de Despliegue - Módulo Agentic de Recruiting

## Índice
1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Arquitectura de Despliegue](#arquitectura-de-despliegue)
3. [Configuración de Entorno](#configuración-de-entorno)
4. [Despliegue con Docker](#despliegue-con-docker)
5. [Despliegue en Kubernetes](#despliegue-en-kubernetes)
6. [Configuración de Base de Datos](#configuración-de-base-de-datos)
7. [Configuración de Servicios Externos](#configuración-de-servicios-externos)
8. [Monitoreo y Logging](#monitoreo-y-logging)
9. [Backup y Recuperación](#backup-y-recuperación)
10. [Escalabilidad](#escalabilidad)

---

## Requisitos del Sistema

### Requisitos Mínimos

- **CPU**: 4 cores
- **RAM**: 8 GB
- **Almacenamiento**: 100 GB SSD
- **Red**: 100 Mbps

### Requisitos Recomendados (Producción)

- **CPU**: 8+ cores
- **RAM**: 16+ GB
- **Almacenamiento**: 500 GB SSD
- **Red**: 1 Gbps
- **Load Balancer**: nginx/traefik

### Software Requerido

- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Kubernetes**: 1.24+ (opcional)
- **PostgreSQL**: 14+
- **Redis**: 6.2+
- **Qdrant**: 1.4+

---

## Arquitectura de Despliegue

### Diagrama de Arquitectura

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[nginx/traefik]
    end
    
    subgraph "Application Layer"
        API[FastAPI App]
        LP[Landing Pages]
        WS[WebSocket Server]
    end
    
    subgraph "Agentic Layer"
        Crew[CrewAI Workers]
        LangGraph[LangGraph Engine]
        Scrapers[Scraping Workers]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL)]
        RD[(Redis)]
        QD[(Qdrant)]
        S3[(S3/MinIO)]
    end
    
    subgraph "External Services"
        LI[LinkedIn API]
        SG[SendGrid]
        ATS[ATS Systems]
    end
    
    LB --> API
    LB --> LP
    API --> WS
    API --> Crew
    Crew --> LangGraph
    Crew --> Scrapers
    API --> PG
    API --> RD
    API --> QD
    API --> S3
    Scrapers --> LI
    API --> SG
    API --> ATS
```

### Componentes del Sistema

1. **API Gateway**: FastAPI con autenticación y rate limiting
2. **Agentic Engine**: CrewAI + LangGraph para orquestación
3. **Scraping Workers**: Playwright/Puppeteer para extracción
4. **Database Layer**: PostgreSQL + Redis + Qdrant
5. **Storage**: S3/MinIO para archivos
6. **Monitoring**: Prometheus + Grafana + ELK Stack

---

## Configuración de Entorno

### Variables de Entorno

```bash
# Configuración de la aplicación
APP_NAME=recruiting-agentic
APP_VERSION=1.0.0
ENVIRONMENT=production
DEBUG=false

# Base de datos
DATABASE_URL=postgresql://user:pass@postgres:5432/recruiting
REDIS_URL=redis://redis:6379
QDRANT_URL=http://qdrant:6333

# Autenticación
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600

# APIs externas
LINKEDIN_API_KEY=your-linkedin-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
OPENAI_API_KEY=your-openai-api-key

# Configuración de scraping
SCRAPING_CONCURRENT_WORKERS=5
SCRAPING_RATE_LIMIT_DELAY=1000
SCRAPING_MAX_RETRIES=3

# Configuración de email
EMAIL_FROM=noreply@company.com
EMAIL_REPLY_TO=careers@company.com
EMAIL_TEMPLATES_PATH=/app/templates/email

# Configuración de storage
S3_BUCKET=recruiting-files
S3_ACCESS_KEY=your-s3-access-key
S3_SECRET_KEY=your-s3-secret-key
S3_REGION=us-east-1

# Configuración de monitoreo
PROMETHEUS_ENABLED=true
GRAFANA_ENABLED=true
ELASTICSEARCH_URL=http://elasticsearch:9200

# Configuración de seguridad
CORS_ORIGINS=https://hr.company.com,https://careers.company.com
RATE_LIMIT_REQUESTS=1000
RATE_LIMIT_WINDOW=3600
```

### Archivo de Configuración

```yaml
# config/recruiting.yaml
app:
  name: recruiting-agentic
  version: 1.0.0
  environment: production
  debug: false

database:
  postgresql:
    host: postgres
    port: 5432
    database: recruiting
    username: recruiting_user
    password: secure_password
    pool_size: 20
    max_overflow: 30
  
  redis:
    host: redis
    port: 6379
    db: 0
    password: redis_password
  
  qdrant:
    host: qdrant
    port: 6333
    collection_name: candidate_profiles
    vector_size: 1536

agentic:
  crewai:
    max_workers: 10
    timeout: 300
    retry_attempts: 3
  
  langgraph:
    max_concurrent_workflows: 50
    workflow_timeout: 3600
  
  scraping:
    concurrent_workers: 5
    rate_limit_delay: 1000
    max_retries: 3
    user_agent: "RecruitingBot/1.0"

email:
  provider: sendgrid
  api_key: your-sendgrid-api-key
  from_email: careers@company.com
  reply_to: careers@company.com
  templates:
    invitation: templates/email/invitation.html
    follow_up: templates/email/follow_up.html
    rejection: templates/email/rejection.html

linkedin:
  api_key: your-linkedin-api-key
  daily_limit: 100
  rate_limit_delay: 1000
  search_filters:
    max_results: 100
    location_radius: 50
    experience_level: senior

storage:
  provider: s3
  bucket: recruiting-files
  region: us-east-1
  access_key: your-s3-access-key
  secret_key: your-s3-secret-key
  cdn_url: https://cdn.company.com

monitoring:
  prometheus:
    enabled: true
    port: 9090
  
  grafana:
    enabled: true
    port: 3000
  
  logging:
    level: INFO
    format: json
    output: stdout

security:
  cors:
    origins:
      - https://hr.company.com
      - https://careers.company.com
    methods:
      - GET
      - POST
      - PUT
      - DELETE
    headers:
      - Authorization
      - Content-Type
  
  rate_limiting:
    requests_per_minute: 1000
    burst_size: 100
```

---

## Despliegue con Docker

### Dockerfile

```dockerfile
# Dockerfile
FROM python:3.11-slim

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Instalar Node.js para Playwright
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Instalar Playwright
RUN npx playwright install chromium

# Crear directorio de trabajo
WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Crear usuario no-root
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### requirements.txt

```txt
# FastAPI y dependencias web
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0

# Base de datos
sqlalchemy==2.0.23
alembic==1.13.1
psycopg2-binary==2.9.9
redis==5.0.1
qdrant-client==1.7.0

# Agentic frameworks
crewai==0.1.0
langgraph==0.0.20
langchain==0.1.0
openai==1.3.7

# Scraping
playwright==1.40.0
beautifulsoup4==4.12.2
requests==2.31.0
selenium==4.15.2

# Email y comunicación
sendgrid==6.10.0
jinja2==3.1.2

# Storage
boto3==1.34.0
minio==7.2.0

# Monitoreo y logging
prometheus-client==0.19.0
structlog==23.2.0
elasticsearch==8.11.0

# Seguridad
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  # API Principal
  recruiting-api:
    build: .
    container_name: recruiting-api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://recruiting_user:secure_password@postgres:5432/recruiting
      - REDIS_URL=redis://redis:6379
      - QDRANT_URL=http://qdrant:6333
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    depends_on:
      - postgres
      - redis
      - qdrant
    restart: unless-stopped
    networks:
      - recruiting-network

  # Workers de Celery
  recruiting-workers:
    build: .
    container_name: recruiting-workers
    command: celery -A app.celery worker --loglevel=info --concurrency=4
    environment:
      - DATABASE_URL=postgresql://recruiting_user:secure_password@postgres:5432/recruiting
      - REDIS_URL=redis://redis:6379
      - QDRANT_URL=http://qdrant:6333
    volumes:
      - ./logs:/app/logs
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - recruiting-network

  # Scraping Workers
  scraping-workers:
    build: .
    container_name: scraping-workers
    command: python -m app.scraping.worker
    environment:
      - DATABASE_URL=postgresql://recruiting_user:secure_password@postgres:5432/recruiting
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./logs:/app/logs
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - recruiting-network

  # Base de datos PostgreSQL
  postgres:
    image: postgres:15
    container_name: recruiting-postgres
    environment:
      - POSTGRES_DB=recruiting
      - POSTGRES_USER=recruiting_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - recruiting-network

  # Redis
  redis:
    image: redis:7-alpine
    container_name: recruiting-redis
    command: redis-server --requirepass redis_password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - recruiting-network

  # Qdrant Vector Database
  qdrant:
    image: qdrant/qdrant:latest
    container_name: recruiting-qdrant
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333
      - QDRANT__SERVICE__GRPC_PORT=6334
    restart: unless-stopped
    networks:
      - recruiting-network

  # MinIO (S3 compatible)
  minio:
    image: minio/minio:latest
    container_name: recruiting-minio
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin123
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    restart: unless-stopped
    networks:
      - recruiting-network

  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    container_name: recruiting-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    networks:
      - recruiting-network

  # Grafana
  grafana:
    image: grafana/grafana:latest
    container_name: recruiting-grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    restart: unless-stopped
    networks:
      - recruiting-network

  # Nginx (Load Balancer)
  nginx:
    image: nginx:alpine
    container_name: recruiting-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - recruiting-api
    restart: unless-stopped
    networks:
      - recruiting-network

volumes:
  postgres_data:
  redis_data:
  qdrant_data:
  minio_data:
  prometheus_data:
  grafana_data:

networks:
  recruiting-network:
    driver: bridge
```

### Script de Despliegue

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Iniciando despliegue del Módulo Agentic de Recruiting..."

# Verificar Docker y Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p logs uploads monitoring/grafana/dashboards monitoring/grafana/datasources nginx/ssl

# Copiar archivos de configuración
echo "⚙️ Copiando configuraciones..."
cp config/recruiting.yaml ./
cp monitoring/prometheus.yml ./monitoring/
cp monitoring/grafana/dashboards/* ./monitoring/grafana/dashboards/
cp monitoring/grafana/datasources/* ./monitoring/grafana/datasources/
cp nginx/nginx.conf ./nginx/

# Construir imágenes
echo "🔨 Construyendo imágenes Docker..."
docker-compose build

# Iniciar servicios
echo "🚀 Iniciando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones de base de datos..."
docker-compose exec recruiting-api alembic upgrade head

# Verificar salud de los servicios
echo "🏥 Verificando salud de los servicios..."
docker-compose ps

# Mostrar URLs de acceso
echo "🌐 URLs de acceso:"
echo "   - API: http://localhost:8000"
echo "   - Dashboard: http://localhost:3000 (admin/admin123)"
echo "   - MinIO Console: http://localhost:9001 (minioadmin/minioadmin123)"
echo "   - Prometheus: http://localhost:9090"

echo "✅ Despliegue completado exitosamente!"
```

---

## Despliegue en Kubernetes

### Namespace

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: recruiting
  labels:
    name: recruiting
```

### ConfigMap y Secrets

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: recruiting-config
  namespace: recruiting
data:
  recruiting.yaml: |
    app:
      name: recruiting-agentic
      environment: production
    database:
      postgresql:
        host: recruiting-postgres
        port: 5432
        database: recruiting
    redis:
      host: recruiting-redis
      port: 6379
    qdrant:
      host: recruiting-qdrant
      port: 6333
```

```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: recruiting-secrets
  namespace: recruiting
type: Opaque
data:
  jwt-secret: <base64-encoded-jwt-secret>
  database-password: <base64-encoded-password>
  redis-password: <base64-encoded-redis-password>
  linkedin-api-key: <base64-encoded-linkedin-key>
  sendgrid-api-key: <base64-encoded-sendgrid-key>
  openai-api-key: <base64-encoded-openai-key>
```

### Deployment de la API

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: recruiting-api
  namespace: recruiting
spec:
  replicas: 3
  selector:
    matchLabels:
      app: recruiting-api
  template:
    metadata:
      labels:
        app: recruiting-api
    spec:
      containers:
      - name: recruiting-api
        image: recruiting-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: recruiting-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: recruiting-secrets
              key: redis-url
        - name: JWT_SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: recruiting-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service

```yaml
# k8s/api-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: recruiting-api-service
  namespace: recruiting
spec:
  selector:
    app: recruiting-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: ClusterIP
```

### Ingress

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: recruiting-ingress
  namespace: recruiting
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - recruiting.company.com
    secretName: recruiting-tls
  rules:
  - host: recruiting.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: recruiting-api-service
            port:
              number: 80
```

### Horizontal Pod Autoscaler

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: recruiting-api-hpa
  namespace: recruiting
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: recruiting-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## Configuración de Base de Datos

### Script de Inicialización

```sql
-- init.sql
-- Crear base de datos y usuario
CREATE DATABASE recruiting;
CREATE USER recruiting_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE recruiting TO recruiting_user;

-- Conectar a la base de datos
\c recruiting;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Crear tablas (ver esquemas en RECRUITING_DATA_SCHEMAS.md)
-- ... (todas las tablas definidas anteriormente)

-- Crear índices
CREATE INDEX CONCURRENTLY idx_workflows_company_status ON recruiting_workflows(company_id, status);
CREATE INDEX CONCURRENTLY idx_candidates_workflow_status ON recruiting_candidates(workflow_id, status);
CREATE INDEX CONCURRENTLY idx_applications_workflow_status ON recruiting_applications(workflow_id, status);

-- Configurar particionamiento
CREATE TABLE recruiting_audit_log_2024 PARTITION OF recruiting_audit_log
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Migraciones con Alembic

```python
# alembic/env.py
from alembic import context
from sqlalchemy import engine_from_config, pool
from logging.config import fileConfig
import os
import sys

# Añadir el directorio raíz al path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.database import Base
from app.models import *  # Importar todos los modelos

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

---

## Configuración de Servicios Externos

### LinkedIn API

1. **Crear aplicación en LinkedIn Developer Console**
2. **Configurar OAuth 2.0**
3. **Obtener API Key y Secret**
4. **Configurar webhooks para eventos**

```python
# app/services/linkedin_service.py
import requests
from typing import List, Dict, Any

class LinkedInService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.linkedin.com/v2"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    async def search_people(self, keywords: List[str], location: str) -> List[Dict[str, Any]]:
        """Busca personas en LinkedIn"""
        # Implementación de búsqueda
        pass
    
    async def get_profile(self, profile_id: str) -> Dict[str, Any]:
        """Obtiene perfil detallado"""
        # Implementación de obtención de perfil
        pass
    
    async def send_invitation(self, profile_id: str, message: str) -> bool:
        """Envía invitación de conexión"""
        # Implementación de envío de invitación
        pass
```

### SendGrid

```python
# app/services/email_service.py
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from typing import Dict, Any

class EmailService:
    def __init__(self, api_key: str, from_email: str):
        self.sg = SendGridAPIClient(api_key=api_key)
        self.from_email = from_email
    
    async def send_template_email(self, to_email: str, template_id: str, dynamic_data: Dict[str, Any]) -> bool:
        """Envía email usando plantilla de SendGrid"""
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=to_email
            )
            message.template_id = template_id
            message.dynamic_template_data = dynamic_data
            
            response = self.sg.send(message)
            return response.status_code == 202
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
```

---

## Monitoreo y Logging

### Prometheus Configuration

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "recruiting_rules.yml"

scrape_configs:
  - job_name: 'recruiting-api'
    static_configs:
      - targets: ['recruiting-api:8000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'recruiting-workers'
    static_configs:
      - targets: ['recruiting-workers:8000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'qdrant'
    static_configs:
      - targets: ['qdrant:6333']
    metrics_path: '/metrics'
```

### Grafana Dashboards

```json
// monitoring/grafana/dashboards/recruiting-overview.json
{
  "dashboard": {
    "title": "Recruiting Overview",
    "panels": [
      {
        "title": "Active Workflows",
        "type": "stat",
        "targets": [
          {
            "expr": "recruiting_workflows_active",
            "legendFormat": "Active"
          }
        ]
      },
      {
        "title": "Candidates Found",
        "type": "stat",
        "targets": [
          {
            "expr": "recruiting_candidates_total",
            "legendFormat": "Total"
          }
        ]
      },
      {
        "title": "Applications Received",
        "type": "stat",
        "targets": [
          {
            "expr": "recruiting_applications_total",
            "legendFormat": "Total"
          }
        ]
      },
      {
        "title": "Email Engagement",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(recruiting_emails_sent_total[5m])",
            "legendFormat": "Emails Sent"
          },
          {
            "expr": "rate(recruiting_emails_opened_total[5m])",
            "legendFormat": "Emails Opened"
          }
        ]
      }
    ]
  }
}
```

### Logging Configuration

```python
# app/logging.py
import structlog
import logging
from typing import Any, Dict

def setup_logging():
    """Configura logging estructurado"""
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

def get_logger(name: str) -> structlog.BoundLogger:
    """Obtiene logger configurado"""
    return structlog.get_logger(name)

class RecruitingLogger:
    def __init__(self, workflow_id: str, company_id: str):
        self.logger = get_logger("recruiting")
        self.workflow_id = workflow_id
        self.company_id = company_id
    
    def log_event(self, event_type: str, data: Dict[str, Any]):
        """Registra evento del workflow"""
        self.logger.info(
            event_type,
            workflow_id=self.workflow_id,
            company_id=self.company_id,
            **data
        )
```

---

## Backup y Recuperación

### Script de Backup

```bash
#!/bin/bash
# backup.sh

set -e

BACKUP_DIR="/backups/recruiting"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="recruiting_backup_$DATE"

echo "🔄 Iniciando backup del sistema de recruiting..."

# Crear directorio de backup
mkdir -p "$BACKUP_DIR"

# Backup de PostgreSQL
echo "🗄️ Haciendo backup de PostgreSQL..."
docker-compose exec -T postgres pg_dump -U recruiting_user recruiting > "$BACKUP_DIR/${BACKUP_NAME}_postgres.sql"

# Backup de Redis
echo "🔴 Haciendo backup de Redis..."
docker-compose exec -T redis redis-cli --rdb /data/dump.rdb
docker cp recruiting-redis:/data/dump.rdb "$BACKUP_DIR/${BACKUP_NAME}_redis.rdb"

# Backup de Qdrant
echo "🔍 Haciendo backup de Qdrant..."
docker-compose exec -T qdrant qdrant snapshot create --collection candidate_profiles
docker cp recruiting-qdrant:/qdrant/storage/snapshots "$BACKUP_DIR/${BACKUP_NAME}_qdrant"

# Backup de archivos
echo "📁 Haciendo backup de archivos..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_files.tar.gz" uploads/

# Backup de configuración
echo "⚙️ Haciendo backup de configuración..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz" config/ monitoring/ nginx/

# Crear archivo comprimido final
echo "📦 Comprimiendo backup completo..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_complete.tar.gz" -C "$BACKUP_DIR" "${BACKUP_NAME}_*"

# Limpiar archivos temporales
rm "$BACKUP_DIR/${BACKUP_NAME}_postgres.sql"
rm "$BACKUP_DIR/${BACKUP_NAME}_redis.rdb"
rm -rf "$BACKUP_DIR/${BACKUP_NAME}_qdrant"
rm "$BACKUP_DIR/${BACKUP_NAME}_files.tar.gz"
rm "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz"

# Mantener solo los últimos 7 backups
find "$BACKUP_DIR" -name "recruiting_backup_*_complete.tar.gz" -mtime +7 -delete

echo "✅ Backup completado: $BACKUP_DIR/${BACKUP_NAME}_complete.tar.gz"
```

### Script de Recuperación

```bash
#!/bin/bash
# restore.sh

set -e

BACKUP_FILE="$1"
BACKUP_DIR="/tmp/restore_$(date +%Y%m%d_%H%M%S)"

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Uso: $0 <archivo_backup>"
    exit 1
fi

echo "🔄 Iniciando recuperación desde: $BACKUP_FILE"

# Extraer backup
echo "📦 Extrayendo backup..."
mkdir -p "$BACKUP_DIR"
tar -xzf "$BACKUP_FILE" -C "$BACKUP_DIR"

# Detener servicios
echo "⏹️ Deteniendo servicios..."
docker-compose down

# Restaurar PostgreSQL
echo "🗄️ Restaurando PostgreSQL..."
docker-compose up -d postgres
sleep 10
docker-compose exec -T postgres psql -U recruiting_user -d recruiting -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker-compose exec -T postgres psql -U recruiting_user -d recruiting < "$BACKUP_DIR"/*_postgres.sql

# Restaurar Redis
echo "🔴 Restaurando Redis..."
docker-compose up -d redis
sleep 5
docker cp "$BACKUP_DIR"/*_redis.rdb recruiting-redis:/data/dump.rdb
docker-compose restart redis

# Restaurar Qdrant
echo "🔍 Restaurando Qdrant..."
docker-compose up -d qdrant
sleep 10
docker cp "$BACKUP_DIR"/*_qdrant/* recruiting-qdrant:/qdrant/storage/snapshots/
docker-compose exec -T qdrant qdrant snapshot restore --collection candidate_profiles

# Restaurar archivos
echo "📁 Restaurando archivos..."
tar -xzf "$BACKUP_DIR"/*_files.tar.gz -C ./

# Restaurar configuración
echo "⚙️ Restaurando configuración..."
tar -xzf "$BACKUP_DIR"/*_config.tar.gz -C ./

# Reiniciar servicios
echo "🚀 Reiniciando servicios..."
docker-compose up -d

# Limpiar
rm -rf "$BACKUP_DIR"

echo "✅ Recuperación completada exitosamente!"
```

---

## Escalabilidad

### Auto-scaling Configuration

```yaml
# k8s/autoscaling.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: recruiting-api-hpa
  namespace: recruiting
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: recruiting-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: recruiting-ingress
      target:
        type: Value
        value: 1000
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

### Database Scaling

```sql
-- Configuración de replicación PostgreSQL
-- Master
CREATE PUBLICATION recruiting_pub FOR ALL TABLES;

-- Replica
CREATE SUBSCRIPTION recruiting_sub 
CONNECTION 'host=master.company.com port=5432 dbname=recruiting user=replica password=replica_pass'
PUBLICATION recruiting_pub;

-- Configuración de particionamiento
CREATE TABLE recruiting_audit_log_2024_01 PARTITION OF recruiting_audit_log
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE recruiting_audit_log_2024_02 PARTITION OF recruiting_audit_log
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

### Redis Cluster Configuration

```yaml
# k8s/redis-cluster.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-cluster
  namespace: recruiting
spec:
  serviceName: redis-cluster
  replicas: 6
  selector:
    matchLabels:
      app: redis-cluster
  template:
    metadata:
      labels:
        app: redis-cluster
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        command: ["redis-server", "/etc/redis/redis.conf"]
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-config
          mountPath: /etc/redis
        - name: redis-data
          mountPath: /data
  volumeClaimTemplates:
  - metadata:
      name: redis-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

Esta guía de despliegue proporciona una base sólida para implementar el módulo agentic de recruiting en diferentes entornos, desde desarrollo hasta producción a gran escala. 