# Stack Técnico y Convenciones de Nomenclatura

## 🏗️ **Stack Tecnológico Actualizado**

### **Backend (Python/FastAPI)**
- **Framework:** FastAPI 0.104+
- **Python:** 3.11+
- **ORM:** SQLAlchemy 2.0+
- **Migrations:** Alembic
- **Base de Datos:** PostgreSQL 15+
- **Cache:** Redis 7+
- **Agentic Framework:** **Agno 1.6.3** ⭐ *NUEVO*
- **API Documentation:** Swagger/OpenAPI

### **Frontend (React/TypeScript)**
- **Framework:** React 18+
- **Language:** TypeScript 5.0+
- **Build Tool:** Vite 5.0+
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS 3.3+
- **State Management:** React Query (TanStack Query)
- **Routing:** React Router DOM 6+

### **Infraestructura**
- **API Gateway:** Traefik (desarrollo) + Kong (producción)
- **Containerization:** Docker + Docker Compose
- **Orchestration:** Portainer (actual) → Kubernetes (futuro)
- **Secrets Management:** Infisical
- **Email Service:** Resend
- **Payment Gateway:** Stripe (principal) + alternativas locales

### **IA y Machine Learning**
- **Agentic Framework:** **Agno 1.6.3** ⭐ *NUEVO*
- **LLM Providers:** OpenAI GPT-4o, Anthropic Claude
- **Vector Database:** OpenSearch (recomendado)
- **RAG:** Integrado en Agno
- **Multi-modal:** Nativo en Agno

### **Testing**
- **Backend:** pytest + pytest-asyncio
- **Frontend:** Vitest + React Testing Library
- **E2E:** Playwright
- **Performance:** k6

### **DevOps**
- **CI/CD:** GitHub Actions
- **Monitoring:** Agno.com (incluido)
- **Logging:** Structured logging con Python
- **Feature Flags:** Unleash

---

## 🆕 **Nuevas Adiciones al Stack**

### **Agno Agentic Framework** ⭐ *NUEVO*
```python
# Ejemplo de uso
from agno.agent import Agent
from agno.team import Team
from agno.models.openai import OpenAIChat

# Agente individual
agent = Agent(
    name="Customer Service Agent",
    model=OpenAIChat(id="gpt-4o"),
    instructions="Handle customer inquiries"
)

# Equipo de agentes
team = Team(
    mode="coordinate",
    members=[agent1, agent2, agent3],
    model=OpenAIChat(id="gpt-4o")
)
```

**Características:**
- ✅ Performance: ~3μs instanciación
- ✅ Multi-tenant nativo
- ✅ RAG integrado
- ✅ Multi-modal (texto, imagen, audio, video)
- ✅ FastAPI nativo
- ✅ Monitoreo incluido

### **OpenSearch** ⭐ *NUEVO*
```python
# Motor de búsqueda recomendado
# Alternativa a Elasticsearch (licencia SSPL)
# Licencia Apache 2.0 - compatible con Open Source
```

### **Traefik + Kong** ⭐ *NUEVO*
```yaml
# Desarrollo local
traefik:
  image: traefik:v2.10
  ports:
    - "80:80"
    - "8080:8080"  # Dashboard

# Producción
kong:
  image: kong:3.4
  ports:
    - "8000:8000"
    - "8001:8001"  # Admin API
```

---

## 📁 **Estructura de Directorios Actualizada**

```
src/
├── components/              # Componentes React
│   ├── ui/                 # shadcn/ui components
│   ├── admin/              # Paneles administrativos
│   ├── layout/             # Componentes de layout
│   ├── dashboard/          # Dashboard components
│   ├── crm/                # CRM components
│   └── helpdesk/           # Helpdesk components
├── pages/                  # Páginas de la aplicación
├── hooks/                  # Custom hooks
├── services/               # Servicios de negocio
│   ├── agno/               # ⭐ NUEVO: Servicios de Agno
│   │   ├── agents/         # Agentes especializados
│   │   ├── teams/          # Equipos de agentes
│   │   └── orchestrator.py # Orquestador multi-tenant
│   ├── communication/      # Bus de comunicaciones
│   └── business/           # Lógica de negocio
├── repositories/           # Acceso a datos
├── interfaces/             # Contratos abstractos
├── implementations/        # Implementaciones concretas
├── factories/              # Factories para creación
├── events/                 # Sistema de eventos
├── utils/                  # Utilidades
└── types/                  # TypeScript types
```

---

## 🎯 **Patrones de Diseño Implementados**

### **1. Facade Pattern - Gateways de Servicios**
```python
# interfaces/payment_gateway.py
class PaymentGateway(ABC):
    @abstractmethod
    async def process_payment(self, amount: float, currency: str) -> Dict[str, Any]:
        pass

# implementations/stripe_gateway.py
class StripePaymentGateway(PaymentGateway):
    def __init__(self, api_key: str):
        self.stripe = stripe.Stripe(api_key)
```

### **2. Strategy Pattern - Motores de Búsqueda**
```python
# interfaces/search_engine.py
class SearchEngine(ABC):
    @abstractmethod
    async def search(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        pass

# implementations/opensearch_engine.py
class OpenSearchEngine(SearchEngine):
    def __init__(self, client: OpenSearch):
        self.client = client
```

### **3. Repository Pattern - Acceso a Datos**
```python
# repositories/base_repository.py
class BaseRepository(Generic[T]):
    def __init__(self, db_session: AsyncSession):
        self.db = db_session

# repositories/candidate_repository.py
class CandidateRepository(BaseRepository[Candidate]):
    async def search_by_skills(self, skills: List[str]) -> List[Candidate]:
        pass
```

### **4. Factory Pattern - Creación de Agentes**
```python
# factories/agent_factory.py
class AgentFactory:
    @staticmethod
    def create_agent(agent_type: str, context: Dict[str, Any]) -> BaseAgent:
        if agent_type == "marketing":
            return MarketingAgent(context)
        elif agent_type == "support":
            return SupportAgent(context)
```

### **5. Observer Pattern - Eventos del Sistema**
```python
# events/base_event.py
class BaseEvent(ABC):
    @property
    @abstractmethod
    def event_type(self) -> str:
        pass

# events/customer_interaction_event.py
class CustomerInteractionEvent(BaseEvent):
    def __init__(self, customer_id: str, channel: str, message: str):
        self.customer_id = customer_id
        self.channel = channel
        self.message = message
```

---

## 🔧 **Configuración de Desarrollo Local**

### **Requerimientos Mínimos**
```bash
# Python
python --version  # 3.11+

# Node.js
node --version    # 18+

# Git
git --version
```

### **Instalación Rápida**
```bash
# 1. Clonar repositorio
git clone <repository-url>
cd ai-pair-orchestrator-pro-main

# 2. Setup Python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Instalar dependencias
pip install agno fastapi uvicorn python-dotenv openai anthropic

# 4. Setup Node.js
npm install

# 5. Variables de entorno
cp .env.example .env.local
```

### **Variables de Entorno**
```env
# .env.local
# Base de datos (opcional para desarrollo)
DATABASE_URL=postgresql://user:password@localhost:5432/ai_pair_dev

# Redis (opcional para desarrollo)
REDIS_URL=redis://localhost:6379

# API Keys (solo si usas IA)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...

# Infisical (gestión de secretos)
INFISICAL_TOKEN=your_token

# Email (Resend)
RESEND_API_KEY=re_...

# Pagos (Stripe)
STRIPE_SECRET_KEY=sk_test_...
```

---

## 🚀 **Comandos de Desarrollo**

### **Backend**
```bash
# Desarrollo local
uvicorn main:app --reload

# Test
pytest tests/

# Migraciones
alembic upgrade head
```

### **Frontend**
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Test
npm run test
```

### **Agno (Nuevo)**
```bash
# Test básico
python poc_agno_basic.py

# Crear agente
python -c "
from agno.agent import Agent
from agno.models.openai import OpenAIChat
agent = Agent(model=OpenAIChat(id='gpt-4o'))
print('Agente creado exitosamente')
"
```

---

## 📊 **Métricas de Performance**

### **Agno Performance**
- **Instanciación de agentes:** ~3μs
- **Memoria por agente:** ~6.5Kib
- **Concurrencia:** Miles de agentes simultáneos

### **Stack Performance**
- **FastAPI:** ~50,000 req/s
- **React + Vite:** HMR < 100ms
- **PostgreSQL:** Optimizado para multi-tenant
- **Redis:** < 1ms latencia

---

## 🔒 **Seguridad y Compliance**

### **Multi-Tenant Security**
- **RLS (Row Level Security)** en PostgreSQL
- **Aislamiento completo** por empresa
- **Validación de permisos** en cada request

### **API Security**
- **JWT tokens** con Supabase Auth
- **Rate limiting** con Kong
- **CORS** configurado
- **Input validation** con Pydantic

### **Data Protection**
- **GDPR compliance** integrado
- **Data encryption** en tránsito y reposo
- **Audit logging** completo

---

## 📋 **Checklist de Implementación**

### **Backend**
- [ ] FastAPI configurado
- [ ] Agno integrado
- [ ] Patrones de diseño implementados
- [ ] Multi-tenant configurado
- [ ] Testing setup

### **Frontend**
- [ ] React + TypeScript configurado
- [ ] shadcn/ui instalado
- [ ] Tailwind CSS configurado
- [ ] React Query setup
- [ ] Componentes base creados

### **Infraestructura**
- [ ] Docker configurado
- [ ] Traefik para desarrollo
- [ ] Kong para producción
- [ ] Infisical para secretos
- [ ] Monitoring setup

### **IA y Agentes**
- [ ] Agno instalado y configurado
- [ ] Agentes especializados creados
- [ ] Teams configurados
- [ ] Multi-tenant agents
- [ ] RAG integrado

---

## 🔗 **Documentación Relacionada**

- [ADR-007: Agentic Framework Selection](./ADR-007-Agentic-Framework-Selection.md)
- [Developer Setup Guide](./DEVELOPER_SETUP_GUIDE.md)
- [Architecture Decision Records](./ARCHITECTURE_DECISION_RECORDS.md)
- [Critical Decisions Registry](./CRITICAL_DECISIONS_REGISTRY.md)

---

**Última actualización:** 2025-01-XX
**Versión del stack:** 2.0 (con Agno)
**Responsable:** Marcelo Escallón 