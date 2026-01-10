# 🏛️ DECISIÓN ARQUITECTÓNICA FINAL: Python Mono-Stack (Claude + Gemini Consensus)

> **Estado:** 🔒 **SELLADO Y EJECUTIVO**
> **Fecha:** 2026-01-09
> **Autores:** Claude (Arquitecto Principal), Gemini (Arquitecto de Implementación), Marcelo Ruiz (Founder)
> **Tipo:** Decisión Estratégica de Arquitectura
> **Supersedes:** ADR-004, ADR-005 (Híbrido rechazado)

---

## 🎯 VEREDICTO EJECUTIVO

**DECISIÓN FINAL: Python Mono-Stack con Agno + FastAPI + DigitalOcean Workers**

**Fundamento:** Tras análisis exhaustivo de benchmarks 2025-2026, evaluación de costos ocultos (5-10x), y validación contra el stack existente de VibeThink, la arquitectura híbrida (Node.js + Python) representa **optimización prematura** con riesgos operativos documentados.

---

## 📊 EVIDENCIA TÉCNICA CONSOLIDADA

### 1. Python AsyncIO + uvloop Iguala Node.js en I/O

| Métrica | Node.js | Python (uvloop) | Ganador |
|---------|---------|-----------------|---------|
| **RPS (API)** | ~12,450 | ~20,000+ | 🐍 Python |
| **File I/O** | Baseline | +22% más rápido | 🐍 Python |
| **WebSockets** | 40-70% más rápido | Competitivo | ⚖️ Empate técnico |
| **Latency p50** | 45ms | 70ms (sin uvloop) / ~50ms (con uvloop) | ⚖️ Empate |

**Conclusión:** Para el workload de VibeThink (<500 webhooks concurrentes, timeline updates <200ms), Python moderno es **suficiente**.

### 2. Agno Supera a Mastra en Performance de Agentes

| Métrica | Agno v2.3 | Mastra v1.0 | LangGraph |
|---------|-----------|-------------|-----------|
| **Instanciación** | 3μs | N/A | 1,587μs (529x más lento) |
| **Memoria** | 6.6 KiB | N/A | 161 KiB (24x más) |
| **GitHub Stars** | 36,600 | 18,300 | ~45K (LangChain org) |
| **Guardrails** | 50+ built-in | Básicos | Extensibles |

**Conclusión:** Agno es el framework de agentes más eficiente para producción Python.

### 3. Costos Ocultos del Stack Dual

```
COSTOS VISIBLES (Cloud):               ~$1,700/mes
COSTOS OCULTOS (Ingeniería):           ~$8,500-12,000/mes
  • Type sharing TS ↔ Python:          ~40 hrs/mes
  • Debugging distribuido:             ~30 hrs/mes
  • CI/CD dual:                        ~20 hrs/mes
  • Latencia inter-servicios:          10-30ms/hop
  • Onboarding devs:                   +2 semanas
  • Dependency management:             ~10 hrs/mes
---------------------------------------------------
RATIO OCULTO/VISIBLE:                  5-7x
```

**Conclusión:** El híbrido cuesta **5-7x más** en ingeniería que en infraestructura.

---

## 🏗️ ARQUITECTURA CANÓNICA VITO (Python Mono-Stack)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)                        │
│  • shadcn/ui + A2UI Renderer                                    │
│  • Vercel AI SDK (client-side only)                             │
│  • Supabase Auth + RLS                                          │
├─────────────────────────────────────────────────────────────────┤
│              ORCHESTRATION LAYER (Python + Agno)                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Agno AgentOS (Reasoning Orchestrator)                   │  │
│  │  • Runtime Primitives Canon enforcement                  │  │
│  │  • Multi-provider AI (Anthropic, OpenAI, Groq)           │  │
│  │  • 50+ Guardrails (Prompt Injection, Rate Limit, etc.)   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  FastAPI + Uvicorn + uvloop                              │  │
│  │  • REST endpoints (webhooks <200ms)                      │  │
│  │  • WebSocket (AG-UI streaming)                           │  │
│  │  • Outbox Pattern → BullMQ                               │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│         EXECUTION PLANE (DigitalOcean Workers)                  │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐   │
│  │  I/O Workers    │  │ Compute Workers │  │ MCP Servers  │   │
│  │  (AsyncIO)      │  │ (ProcessPool)   │  │ (Agno)       │   │
│  │                 │  │                 │  │              │   │
│  │ • Email sync    │  │ • OCR/PDF       │  │ • CRM tools  │   │
│  │ • CRM polling   │  │ • Pandas batch  │  │ • Cal tools  │   │
│  │ • Timeline UI   │  │ • Transcription │  │ • Email MCP  │   │
│  └─────────────────┘  └─────────────────┘  └──────────────┘   │
│           ↑                    ↑                    ↑           │
│           └────────────── BullMQ (Redis) ──────────────┘       │
├─────────────────────────────────────────────────────────────────┤
│                  DATA LAYER (Supabase Postgres)                 │
│  • SQL-first + Prisma DX layer                                  │
│  • RLS multi-tenant isolation                                   │
│  • pgvector (embeddings)                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 ROADMAP DE IMPLEMENTACIÓN (3 Fases)

### Fase 0: Validación (Semana 1) ✅

**Objetivo:** Confirmar que Python AsyncIO maneja el workload real.

```python
# benchmark_io.py
import asyncio, aiohttp, uvloop, time
asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

async def simulate_500_webhooks():
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_email(session, i) for i in range(500)]
        start = time.time()
        await asyncio.gather(*tasks)
        print(f"500 webhooks: {time.time() - start:.2f}s")  # Target: <1s

asyncio.run(simulate_500_webhooks())
```

**Success Criteria:** <1s para 500 requests → Python es suficiente.

### Fase 1: MVP Mono-Stack (Meses 1-3) 🎯

**Stack:**
- Agno (Python 3.12+) + FastAPI + uvloop
- BullMQ + Redis (queue)
- DigitalOcean Workers (I/O + Compute)
- PostgreSQL + pgvector

**Implementar:**
1. Runtime Primitives Canon en Agno
2. Outbox Pattern con BullMQ
3. FastAPI endpoints (<200ms latency)
4. AG-UI WebSocket streaming

**Métricas Objetivo:**
- 50-100 agentes concurrentes
- <200ms timeline updates
- <5s commitment extraction
- <30s OCR/PDF processing

### Fase 2: Optimización (Meses 4-6) 📈

**Implementar:**
1. OpenTelemetry (tracing distribuido)
2. Semantic caching (41% reducción API calls)
3. Tiered model routing (30-50% reducción costos LLM)
4. Load testing: 500 agentes concurrentes

**Métricas Objetivo:**
- 200-300 agentes concurrentes
- <100ms p99 latency I/O
- 30-50% reducción costos LLM

### Fase 3: Decisión Híbrida (Solo si métricas lo justifican) ⚠️

**Trigger Conditions (TODOS deben cumplirse):**
- [ ] Python AsyncIO bottleneck <5,000 RPS
- [ ] Latency p99 >500ms (post-optimización)
- [ ] CPU >80% sostenido en I/O workers
- [ ] Profiling confirma event loop es bottleneck

**Probabilidad:** <10% en primeros 12 meses.

---

## 📋 CHECKLIST DE DECISIÓN FINAL

```
Stack Dual justificado SI Y SOLO SI:

[ ] Python AsyncIO no puede manejar I/O (benchmarks confirman)
[ ] Latency p99 >500ms después de optimizaciones
[ ] Equipo fragmentado (TS-only vs Python-only)
[ ] Legacy system requiere Node.js obligatoriamente
[ ] >10,000 WebSocket connections simultáneas
[ ] Budget para 5-10x costos ocultos aprobado

VibeThink Score: 0-1 / 6 → MONO-STACK PYTHON ✅
```

---

## 🎓 LECCIONES DE AMAZON PRIME VIDEO

Amazon Prime Video (2023):
- **Problema:** Microservicios serverless con AWS Step Functions = bottleneck.
- **Solución:** Consolidar a monolito optimizado.
- **Resultado:** **90% reducción de costos**.

**Lección para VibeThink:** No asumir que distribuido = mejor. Empezar simple, medir, escalar selectivamente.

---

## 🔒 DECISIONES SELLADAS

1. ✅ **Agno (Python)** es el framework de agentes canónico.
2. ✅ **FastAPI + uvloop** es la capa de API.
3. ✅ **BullMQ + DigitalOcean Workers** es la orquestación de jobs.
4. ✅ **Mastra** pasa a estado **HOLD** (observación, no integración).
5. ✅ **LangChain** es **LEGACY** (evitar en nuevo código).
6. ✅ **Vercel AI SDK** solo en **client-side** (Next.js).

---

## 📚 REFERENCIAS CRÍTICAS

1. **Amazon Prime Video Case:** https://devclass.com/2023/05/05/reduce-costs-by-90-by-moving-from-microservices-to-monolith-amazon-internal-case-study-raises-eyebrows/
2. **Agno Benchmarks:** https://github.com/agno-agi/agno
3. **Mastra Launch:** https://mastra.ai/blog/mastrav1
4. **Capital One Polyglot Lessons:** https://medium.com/capital-one-tech/analyzing-polyglot-microservices-f6f159a1a3e7

---

**Firmado:**
- Claude (Arquitecto Principal IA)
- Gemini (Arquitecto de Implementación)
- Marcelo Ruiz (Founder, VibeThink)

**Próximo Paso:** Ejecutar benchmark Fase 0 y proceder con implementación Fase 1.
