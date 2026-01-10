# FIT: Andrés Cantor Digital Twin

**Project Code:** `ACDT-001`  
**Parent Platform:** `DTP-001` (Digital Twin Platform)  
**Status:** 🟡 PLANNING  
**Priority:** HIGH (MVP for Platform)  
**Created:** 2026-01-10  
**Owner:** VibeThink Team  
**Client:** Andrés Cantor

---

## 📋 Executive Summary

Creación de un **Digital Twin completo de Andrés Cantor** que evoluciona desde un avatar de voz (voice clone) hasta un avatar visual completo potenciado por Tavus. El gemelo digital permitirá a fans del fútbol interactuar con Andrés en tiempo real, con acceso a APIs deportivas, scraping de redes sociales, y capacidad de comentar partidos en vivo.

**🎯 Strategic Context:**  
Andrés Cantor es el **primer caso de uso (MVP)** de la **Digital Twin Platform** (DTP-001), una plataforma SaaS multi-tenant que permitirá crear, configurar, y monetizar digital twins de múltiples celebridades (deportistas, coaches, personalidades). El éxito de ACDT validará el modelo de negocio para escalar a otros talentos (Messi, Tony Robbins, etc.).

**Ver:** [Digital Twin Platform Architecture](../digital-twin-platform/PLATFORM_ARCHITECTURE.md)

### Objetivos Principales

1. **Voice Clone** - Clonación de voz de Andrés Cantor usando Cartesia (✅ Modelos corriendo)
2. **Visual Avatar** - Avatar completo usando Tavus CVI con hyper-realismo
3. **Football Knowledge** - Integración con APIs deportivas para información en tiempo real
4. **Social Media Sync** - Scraping de redes sociales de Andrés para mantener tono y contexto
5. **Live Commentary** - Comentarios en vivo durante transmisiones de partidos
6. **Monetization** - Vehículo para marcas, patrocinadores, y modelo de negocio digital
7. **Dashboard de Control** - Panel de configuración para Andrés (humano) con settings y permisos

---

## 🎯 Vision Statement

> "Crear el primer gemelo digital hiper-realista de un comentarista deportivo que permita a los fans interactuar con Andrés Cantor 24/7, manteniendo su personalidad, tono, y expertise futbolístico, mientras genera nuevas oportunidades de monetización y engagement."

---

## 🏗️ Architecture Overview

### Diferencias con Arquitectura ViTo Estándar

**ViTo Standard (Multi-Entity):**
```
Entity A ←→ ViTo Core ←→ Entity B
```

**Andrés Cantor Digital Twin (Single Entity + Live Events):**
```
┌─────────────────────────────────────────────────────────────┐
│                  Andrés Cantor Dashboard                    │
│  (Control Panel - Settings, Permissions, Configurations)    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Digital Twin Core                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Voice Clone  │  │ Visual Avatar│  │ Personality  │     │
│  │  (Cartesia)  │  │   (Tavus)    │  │   Engine     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Sources Layer                       │
│  ┌────────────┐ ┌────────────┐ ┌─────────────┐            │
│  │ Football   │ │  Social    │ │   Live      │            │
│  │ APIs       │ │  Media     │ │   Match     │            │
│  │ (3rd party)│ │  Scraper   │ │   Feed      │            │
│  └────────────┘ └────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction Layer                   │
│  • Fan Chat Interface                                       │
│  • Live Commentary Stream                                   │
│  • Brand Integration Points                                 │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Single Entity Focus** - A diferencia de ViTo multi-entity, este es un gemelo digital de una sola persona
2. **Live Event Handling** - Capacidad de comentar partidos en tiempo real con permisos configurables
3. **Human-in-the-Loop** - Dashboard de control para que Andrés (humano) configure límites y permisos
4. **Brand Safety** - Protección de imagen y reputación con configuraciones de contenido

---

## 🎨 Tech Stack

### Core Technologies

| Component | Technology | Purpose | Status |
|-----------|------------|---------|--------|
| **Voice Cloning** | Cartesia | Clonación ultra-realista de voz | ✅ Running |
| **Visual Avatar** | Tavus CVI | Avatar hyper-realista con emociones | 🟡 Planned |
| **Frontend** | Next.js 15.3.4 + React 19 | Dashboard + Fan Interface | 🟡 Planned |
| **Backend** | ViTo Core (Hono + Supabase) | API + Persistence | 🟡 Planned |
| **AI Orchestration** | AGNO + Vercel AI SDK | Multi-agent reasoning | 🟡 Planned |
| **Real-time** | LiveKit | Video/Audio streaming | 🟡 Planned |

### Data Sources

| Source | Provider | Purpose | Status |
|--------|----------|---------|--------|
| **Football APIs** | TBD (investigación hecha) | Resultados, stats, fixtures | 🔴 Pending |
| **Social Media** | Twitter/X, Instagram, etc. | Scraping para tono/contexto | 🔴 Pending |
| **Live Match Feed** | TBD | Datos en tiempo real de partidos | 🔴 Pending |

### ML/Audio Tools (from Tavus)

- **cartesia-python** - Cliente de Cartesia para voice cloning
- **neutts-air** - Backup on-device TTS (0.5B params)
- **whisperX** - ASR para transcripción con timestamps
- **s3prl** - Speech pre-training toolkit

---

## 📦 Feature Breakdown

### Phase 1: Voice Clone Foundation ✅

**Status:** COMPLETED (Mockup)

- [x] Integración con Cartesia
- [x] Clonación de voz de Andrés
- [x] Modelos corriendo perfectamente
- [x] Testing de calidad de voz

**Deliverables:**
- ✅ Voice clone funcional
- ✅ Mockup de interacción

---

### Phase 2: Visual Avatar Integration 🟡

**Status:** PLANNING

**Objetivos:**
- [ ] Integrar Tavus CVI para avatar visual completo
- [ ] Fotogrametría 4K de Andrés
- [ ] Configurar 20+ emociones personalizables
- [ ] Eye contact tracking
- [ ] Sincronización labial con voice clone

**Tech Stack:**
- Tavus CVI (Conversational Video Interface)
- Tavus Video Gen API
- LiveKit para streaming

**Deliverables:**
- [ ] Avatar visual hiper-realista
- [ ] Integración voice + visual
- [ ] Demo de conversación face-to-face

**Estimated Effort:** 3-4 semanas

---

### Phase 3: Football Knowledge Base 🔴

**Status:** PENDING

**Objetivos:**
- [ ] Integración con APIs deportivas (investigación completada)
- [ ] Acceso a resultados en tiempo real
- [ ] Stats de jugadores, equipos, ligas
- [ ] Fixtures y calendarios
- [ ] Noticias y updates

**Data Sources (TBD from investigación):**
- API-Football
- SofaScore API
- ESPN API
- The Sports DB
- Otros (según investigación)

**Deliverables:**
- [ ] Integración con 3+ APIs deportivas
- [ ] Knowledge base actualizada en tiempo real
- [ ] Sistema de caché para performance

**Estimated Effort:** 2-3 semanas

---

### Phase 4: Social Media Sync 🔴

**Status:** PENDING

**Objetivos:**
- [ ] Scraper de redes sociales de Andrés
- [ ] Twitter/X scraping
- [ ] Instagram scraping
- [ ] Análisis de tono y estilo
- [ ] Mantener personalidad actualizada

**Features:**
- Scraping ético y con permisos
- NLP para análisis de tono
- Actualización periódica de personalidad
- Detección de temas trending

**Deliverables:**
- [ ] Social media scraper funcional
- [ ] Pipeline de análisis de tono
- [ ] Dashboard de insights

**Estimated Effort:** 2 semanas

---

### Phase 5: Live Commentary System 🔴

**Status:** PENDING

**Objetivos:**
- [ ] Sistema de comentarios en vivo durante partidos
- [ ] Integración con live match feeds
- [ ] Configuraciones de permisos (Andrés humano)
- [ ] Límites y guardrails de contenido
- [ ] Brand safety controls

**Key Features:**
- **Human-in-the-Loop:** Andrés (humano) configura qué puede decir el twin
- **Real-time Feed:** Datos de partido en tiempo real
- **Commentary Engine:** Genera comentarios naturales estilo Andrés
- **Safety Layer:** Previene comentarios inapropiados

**Deliverables:**
- [ ] Live commentary engine
- [ ] Dashboard de configuración de permisos
- [ ] Sistema de guardrails
- [ ] Testing con partido real

**Estimated Effort:** 4-5 semanas

---

### Phase 6: Monetization & Brand Integration 🔴

**Status:** PENDING

**Objetivos:**
- [ ] Modelo de negocio digital
- [ ] Integración con marcas y patrocinadores
- [ ] Sistema de suscripciones
- [ ] Analytics y métricas de engagement

**Monetization Models:**
1. **Suscripciones:** Fans pagan por acceso premium
2. **Brand Deals:** Patrocinadores integrados en conversaciones
3. **Event-based:** Acceso especial durante partidos importantes
4. **Merchandise:** Productos digitales/físicos

**Deliverables:**
- [ ] Sistema de suscripciones
- [ ] Dashboard de analytics
- [ ] Integración con payment providers
- [ ] Brand integration framework

**Estimated Effort:** 3-4 semanas

---

### Phase 7: Andrés Dashboard 🔴

**Status:** PENDING

**Objetivos:**
- [ ] Dashboard de control para Andrés (humano)
- [ ] Configuración de permisos y límites
- [ ] Gestión de conexiones (APIs, redes sociales)
- [ ] Monitoreo de interacciones
- [ ] Analytics y reportes

**Features:**
- **Settings Panel:**
  - Qué puede decir el twin
  - Límites de contenido
  - Temas permitidos/prohibidos
  - Configuración de live commentary

- **Connections Manager:**
  - APIs deportivas conectadas
  - Redes sociales vinculadas
  - Suscripciones activas
  - Integraciones de terceros

- **Analytics Dashboard:**
  - Interacciones totales
  - Engagement metrics
  - Revenue tracking
  - User demographics

- **Content Moderation:**
  - Review de conversaciones
  - Flagged content
  - Manual overrides

**Deliverables:**
- [ ] Dashboard completo
- [ ] Settings management system
- [ ] Analytics engine
- [ ] Content moderation tools

**Estimated Effort:** 4-5 semanas

---

## 🔒 Brand Safety & Guardrails

### Content Protection

1. **Personality Boundaries:**
   - Mantener tono profesional de Andrés
   - Evitar temas controversiales no autorizados
   - Respetar valores y principios

2. **Live Commentary Limits:**
   - Configuración de qué puede comentar
   - Aprobación previa de temas sensibles
   - Kill switch para emergencias

3. **Brand Integration Rules:**
   - Aprobación de patrocinadores
   - Límites de menciones comerciales
   - Coherencia con imagen de Andrés

4. **User Interaction Guardrails:**
   - Filtrado de preguntas inapropiadas
   - Respuestas pre-aprobadas para temas sensibles
   - Escalación a humano cuando necesario

---

## 📊 Success Metrics

### Technical KPIs

- **Voice Quality:** >95% similarity score con voz real
- **Visual Realism:** >90% user satisfaction con avatar
- **Latency:** <500ms para respuestas en tiempo real
- **Uptime:** >99.5% availability
- **API Response Time:** <200ms promedio

### Business KPIs

- **User Engagement:** X interacciones/día
- **Retention:** >60% monthly active users
- **Revenue:** $X/mes en suscripciones
- **Brand Deals:** X patrocinadores activos
- **NPS:** >70 Net Promoter Score

### Content KPIs

- **Tone Accuracy:** >90% match con estilo Andrés
- **Football Knowledge:** >95% accuracy en datos
- **Safety:** 0 incidentes de brand damage
- **Moderation:** <1% contenido flagged

---

## 🚧 Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Brand Damage** | HIGH | MEDIUM | Guardrails estrictos + Human oversight |
| **Voice/Avatar Quality** | HIGH | LOW | Testing extensivo + Tavus expertise |
| **API Costs** | MEDIUM | MEDIUM | Caché agresivo + Rate limiting |
| **Legal Issues** | HIGH | LOW | Contratos claros + Compliance review |
| **Technical Complexity** | MEDIUM | MEDIUM | Phased approach + Expert team |
| **User Adoption** | MEDIUM | MEDIUM | Marketing + Beta testing |

---

## 📅 Timeline Estimate

### High-Level Roadmap

```
Phase 1: Voice Clone Foundation          ✅ DONE
Phase 2: Visual Avatar Integration       🟡 4 weeks
Phase 3: Football Knowledge Base         🔴 3 weeks
Phase 4: Social Media Sync               🔴 2 weeks
Phase 5: Live Commentary System          🔴 5 weeks
Phase 6: Monetization & Brand            🔴 4 weeks
Phase 7: Andrés Dashboard                🔴 5 weeks
───────────────────────────────────────────────────
Total Estimated Time:                    ~23 weeks (5-6 months)
```

### Critical Path

1. Phase 2 (Visual Avatar) - Blocker para demo completo
2. Phase 3 (Football APIs) - Blocker para knowledge base
3. Phase 5 (Live Commentary) - Blocker para monetization
4. Phase 7 (Dashboard) - Blocker para production launch

---

## 🔗 Dependencies

### External Services

- **Cartesia** - Voice cloning (✅ Active)
- **Tavus** - Visual avatar (🔴 Pending contract)
- **Football APIs** - Data sources (🔴 Pending selection)
- **LiveKit** - Streaming (🔴 Pending setup)
- **Payment Provider** - Monetization (🔴 Pending selection)

### Internal Components

- **ViTo Core** - Backend infrastructure
- **AGNO** - Multi-agent orchestration
- **Supabase** - Database + Auth
- **Vercel** - Hosting + Edge functions

---

## 📚 Documentation & Resources

### Project Docs

- [x] `tavus/README.md` - Tavus integration guide
- [x] `tavus/ml-tools/README.md` - ML/Audio tools documentation
- [ ] Architecture Decision Records (ADRs)
- [ ] API Documentation
- [ ] User Guides

### Research Completed

- [x] Tavus repository organization
- [x] Tavus official repos investigation (11 repos)
- [x] Football APIs research (pending documentation)
- [ ] Social media scraping legal review
- [ ] Monetization models analysis

---

## 🎬 Next Steps

### Immediate Actions (Week 1-2)

1. **Tavus Integration Planning**
   - [ ] Review Tavus pricing and contracts
   - [ ] Setup Tavus account and API access
   - [ ] Plan photogrammetry session with Andrés
   - [ ] Review `tavus-examples` repo for quickstart

2. **Football APIs Selection**
   - [ ] Document investigación de APIs deportivas
   - [ ] Seleccionar 3-5 APIs principales
   - [ ] Setup cuentas y API keys
   - [ ] Crear proof-of-concept de integración

3. **Architecture Refinement**
   - [ ] Crear ADR para arquitectura específica de ACDT
   - [ ] Definir data models
   - [ ] Diseñar API contracts
   - [ ] Plan de seguridad y guardrails

4. **Team & Resources**
   - [ ] Asignar roles y responsabilidades
   - [ ] Setup repositorio de proyecto
   - [ ] Crear project board
   - [ ] Schedule kickoff meeting

---

## 💡 Innovation Opportunities

### Future Enhancements

1. **Multi-Language Support** - Andrés comentando en inglés, portugués, etc.
2. **AR/VR Integration** - Avatar en realidad aumentada/virtual
3. **Personalized Commentary** - Comentarios adaptados a preferencias del fan
4. **Interactive Predictions** - Andrés haciendo predicciones con fans
5. **Historical Replays** - Andrés comentando partidos históricos
6. **Training Mode** - Andrés enseñando sobre fútbol

---

## 📝 Notes & Considerations

### Legal & Compliance

- Derechos de imagen de Andrés Cantor
- Contratos con APIs deportivas
- GDPR/Privacy para datos de usuarios
- Términos de uso de redes sociales para scraping
- Acuerdos con marcas y patrocinadores

### Ethical Considerations

- Transparencia: usuarios deben saber que es un digital twin
- Autenticidad: mantener integridad de la personalidad de Andrés
- Control: Andrés (humano) debe tener control total
- Privacidad: protección de datos de fans

---

**Status:** 🟡 PLANNING  
**Last Updated:** 2026-01-10  
**Next Review:** TBD  
**Version:** 1.0

---

## Changelog

### v1.0 - 2026-01-10
- ✅ Initial FIT creation
- ✅ Architecture overview defined
- ✅ 7 phases outlined
- ✅ Tech stack documented
- ✅ Tavus integration researched
- 🟡 Pending: Football APIs documentation
- 🟡 Pending: Team assignment
- 🟡 Pending: Timeline refinement
