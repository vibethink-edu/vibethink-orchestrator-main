# ADR-007: Agentic Framework Selection

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---


## Status
Accepted

## Context
Necesitamos seleccionar un framework agentico para implementar nuestro sistema de agentes IA especializados que manejen atención omnicanal, marketing, soporte y ventas. La decisión debe considerar performance, escalabilidad multi-tenant, facilidad de desarrollo y costos.

## Decision
**Implementar Agno como framework principal** para nuestro sistema de agentes IA, reemplazando la propuesta inicial de LangGraph + CrewAI.

### Framework Seleccionado: Agno
- **Repositorio:** [github.com/agno-agi/agno](https://github.com/agno-agi/agno)
- **Stars:** 28.6k
- **Licencia:** MPL-2.0 (compatible con SaaS comercial)
- **Stack:** Python nativo, FastAPI integrado

## Comparative Analysis

### LangGraph + CrewAI vs Agno

| Criterio | LangGraph + CrewAI | **Agno** | Peso |
|----------|-------------------|----------|------|
| **Performance** | ⭐⭐⭐ (segundos) | ⭐⭐⭐⭐⭐ (~3μs) | 25% |
| **Madurez** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (28.6k stars) | 20% |
| **Multi-modal** | ❌ No nativo | ✅ Nativo (texto, imagen, audio, video) | 15% |
| **RAG integrado** | ❌ Requiere desarrollo | ✅ 20+ bases vectoriales | 15% |
| **FastAPI nativo** | ❌ Requiere integración | ✅ Rutas pre-construidas | 10% |
| **Monitoreo** | ❌ Requiere desarrollo | ✅ agno.com incluido | 10% |
| **Memoria persistente** | ⭐⭐⭐ Básico | ⭐⭐⭐⭐⭐ Drivers nativos | 5% |
| **Total Score** | **6.5/10** | **9.5/10** | **100%** |

### Análisis Detallado por Criterio

#### 1. Performance (25% del peso)
**Agno:**
- Instanciación de agentes: ~3μs
- Memoria por agente: ~6.5Kib
- Optimizado para miles de agentes concurrentes

**LangGraph + CrewAI:**
- Instanciación: segundos
- Memoria: significativamente mayor
- Requiere optimización manual

#### 2. Madurez y Estabilidad (20% del peso)
**Agno:**
- 28.6k stars en GitHub
- 221 contribuidores activos
- 72 releases
- Comunidad muy activa

**LangGraph + CrewAI:**
- LangGraph: maduro pero menos popular
- CrewAI: menos maduro, documentación limitada

#### 3. Multi-modal (15% del peso)
**Agno:**
- Soporte nativo para texto, imagen, audio, video
- Integración directa con modelos multi-modales
- Sin desarrollo adicional requerido

**LangGraph + CrewAI:**
- Requiere desarrollo personalizado
- Integración compleja con modelos multi-modales

#### 4. RAG Integrado (15% del peso)
**Agno:**
- 20+ bases de datos vectoriales soportadas
- RAG agentico asíncrono y performante
- Búsqueda semántica integrada

**LangGraph + CrewAI:**
- Requiere implementación manual
- Integración con bases vectoriales externas

#### 5. FastAPI Nativo (10% del peso)
**Agno:**
- Rutas FastAPI pre-construidas
- 0 a producción en minutos
- Integración perfecta con nuestro stack

**LangGraph + CrewAI:**
- Requiere desarrollo de endpoints
- Integración manual con FastAPI

#### 6. Monitoreo (10% del peso)
**Agno:**
- Monitoreo en tiempo real en agno.com
- Métricas de performance integradas
- Debugging avanzado

**LangGraph + CrewAI:**
- Requiere implementación de monitoreo
- Métricas personalizadas necesarias

#### 7. Memoria Persistente (5% del peso)
**Agno:**
- Drivers de Storage & Memory nativos
- Persistencia automática de contexto
- Gestión de sesiones integrada

**LangGraph + CrewAI:**
- Gestión manual de estado
- Persistencia requiere desarrollo

## Implementation Strategy

### Arquitectura Multi-Tenant con Agno
```python
# services/agno_multi_tenant.py
from agno.agent import Agent
from agno.team import Team
from agno.models.openai import OpenAIChat

class MultiTenantAgnoManager:
    def __init__(self):
        self.company_agents: Dict[str, Dict[str, Agent]] = {}
        self.company_teams: Dict[str, Team] = {}
    
    async def get_or_create_company_agents(self, company_id: str) -> Dict[str, Agent]:
        """Crea agentes específicos para cada empresa con aislamiento completo"""
        if company_id not in self.company_agents:
            self.company_agents[company_id] = {
                "reception": Agent(
                    name=f"Reception-{company_id}",
                    role="Customer reception and classification",
                    model=OpenAIChat(id="gpt-4o"),
                    instructions=f"Handle inquiries for company {company_id}",
                    storage_driver=f"company_{company_id}_storage",
                    memory_driver=f"company_{company_id}_memory"
                ),
                "marketing": Agent(
                    name=f"Marketing-{company_id}",
                    role="Marketing and sales specialist",
                    model=OpenAIChat(id="gpt-4o"),
                    instructions=f"Handle marketing for company {company_id}"
                ),
                "support": Agent(
                    name=f"Support-{company_id}",
                    role="Technical support specialist",
                    model=OpenAIChat(id="gpt-4o"),
                    instructions=f"Handle support for company {company_id}"
                )
            }
        
        return self.company_agents[company_id]
```

### Integración con FastAPI
```python
# api/routes/agno_agents.py
from fastapi import APIRouter, Depends, HTTPException
from services.agno_multi_tenant import MultiTenantAgnoManager

router = APIRouter(prefix="/api/v1/agents", tags=["agents"])

@router.post("/{company_id}/chat")
async def chat_with_agents(
    company_id: str,
    message: str,
    channel: str,
    user_id: str,
    current_user = Depends(get_current_user)
):
    """Endpoint para chat con agentes de una empresa específica"""
    
    # Verificar permisos multi-tenant
    if not has_permission(current_user, company_id, "AGENT_ACCESS"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    # Obtener equipo de agentes de la empresa
    agno_manager = MultiTenantAgnoManager()
    team = await agno_manager.create_company_team(company_id)
    
    # Procesar mensaje con contexto omnicanal
    response = await team.ainvoke({
        "message": message,
        "channel": channel,
        "user_id": user_id,
        "company_id": company_id,
        "user_context": await get_user_context(user_id, company_id)
    })
    
    return {
        "response": response.content,
        "agent_used": response.agent_name,
        "confidence": response.confidence
    }
```

## Cost Analysis

### Comparativa de Costos

| Aspecto | LangGraph + CrewAI | **Agno** | Ahorro |
|---------|-------------------|----------|--------|
| **Tiempo desarrollo** | 8-12 semanas | 2-3 semanas | 6-9 semanas |
| **Costo desarrollo** | ~$120k-$180k | ~$30k-$45k | **~$90k-$135k** |
| **Mantenimiento** | Alto (constante) | Bajo (estable) | **Significativo** |
| **Capacidades incluidas** | Básicas | RAG, multi-modal, monitoreo | **Valor agregado** |

### ROI Estimado
- **Ahorro inmediato:** $90k-$135k
- **Tiempo ahorrado:** 6-9 semanas
- **ROI positivo:** En 2-3 meses
- **Capacidades adicionales:** Sin costo adicional

## Migration Plan

### Fase 1: Evaluación Técnica (1 semana)
- Instalación de Agno
- POC básico multi-tenant
- Test de performance
- Validación de licencia

### Fase 2: Integración Multi-Tenant (2 semanas)
- Implementar MultiTenantAgnoManager
- Integrar con sistema de autenticación
- Configurar storage y memory por empresa
- Test de aislamiento de datos

### Fase 3: Casos de Uso Específicos (1 semana)
- Agente de recepción omnicanal
- Agente de marketing especializado
- Agente de soporte técnico
- Team coordinado

### Fase 4: Producción (1 semana)
- Deploy en staging
- Test de performance con carga
- Monitoreo y alertas
- Deploy en producción

## Consequences

### Positivas
- **Performance superior** - ~3μs vs segundos
- **Ahorro significativo** - $90k-$135k en desarrollo
- **Capacidades avanzadas** - RAG, multi-modal, monitoreo incluidos
- **Madurez** - Framework muy estable y probado
- **Comunidad activa** - Soporte y actualizaciones continuas

### Negativas
- **Curva de aprendizaje** - Nuevo framework para el equipo
- **Dependencia externa** - Aunque es open source
- **Migración requerida** - Cambio de arquitectura planeada

### Riesgos y Mitigación
- **Riesgo:** Limitaciones multi-tenant no detectadas
  - **Mitigación:** POC exhaustivo antes de decisión final
- **Riesgo:** Performance no se mantiene en producción
  - **Mitigación:** Tests de carga con datos reales
- **Riesgo:** Cambios en licencia futuros
  - **Mitigación:** Fork del código si es necesario

## References
- [Agno GitHub Repository](https://github.com/agno-agi/agno)
- [Agno Documentation](https://docs.agno.com)
- [MPL-2.0 License](https://www.mozilla.org/en-US/MPL/2.0/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [CrewAI Documentation](https://docs.crewai.com/)

## Decision Log
- **Fecha:** 2025-01-XX
- **Decisor:** Marcelo Escallón
- **Contexto:** Evaluación de frameworks agenticos para sistema omnicanal
- **Alternativas consideradas:** LangGraph + CrewAI, Swarm, ARCADE, FIPA/JADE, LLaMA
- **Criterios principales:** Performance, madurez, multi-tenant, costos
- **Resultado:** Agno seleccionado con score 9.5/10 vs 6.5/10 de LangGraph+CrewAI 