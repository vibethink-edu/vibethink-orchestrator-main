# Andrés Cantor Digital Twin - Quick Reference

**Project:** ACDT-001  
**Status:** 🟡 PLANNING  
**Timeline:** 5-6 months (23 weeks)  
**Priority:** HIGH

---

## 🎯 Objetivo

Crear un gemelo digital completo de Andrés Cantor que evoluciona desde voice clone (✅ completado con Cartesia) hasta avatar visual completo (Tavus), con capacidad de:

- Interactuar con fans 24/7
- Comentar partidos en vivo
- Acceder a APIs deportivas en tiempo real
- Mantener tono y personalidad de Andrés (via social media scraping)
- Generar revenue (suscripciones, marcas, patrocinadores)

---

## 📊 7 Fases de Desarrollo

| Phase | Descripción | Status | Effort |
|-------|-------------|--------|--------|
| **1** | Voice Clone Foundation (Cartesia) | ✅ DONE | - |
| **2** | Visual Avatar Integration (Tavus) | 🟡 Planning | 4 weeks |
| **3** | Football Knowledge Base (APIs) | 🔴 Pending | 3 weeks |
| **4** | Social Media Sync (Scraping) | 🔴 Pending | 2 weeks |
| **5** | Live Commentary System | 🔴 Pending | 5 weeks |
| **6** | Monetization & Brand Integration | 🔴 Pending | 4 weeks |
| **7** | Andrés Dashboard (Control Panel) | 🔴 Pending | 5 weeks |

**Total:** ~23 weeks (5-6 months)

---

## 🏗️ Tech Stack

### Core
- **Voice:** Cartesia (✅ running)
- **Avatar:** Tavus CVI
- **Frontend:** Next.js 15.3.4 + React 19
- **Backend:** ViTo Core (Hono + Supabase)
- **AI:** AGNO + Vercel AI SDK
- **Streaming:** LiveKit

### Data Sources
- Football APIs (TBD - investigación hecha)
- Social Media Scraper (Twitter/X, Instagram)
- Live Match Feeds

---

## 🎨 Arquitectura Única

**Diferencia clave vs ViTo estándar:**

```
ViTo Standard: Multi-Entity (A ↔ ViTo ↔ B)
ACDT: Single Entity + Live Events + Human-in-the-Loop
```

**Componentes:**
1. **Andrés Dashboard** - Control panel con settings y permisos
2. **Digital Twin Core** - Voice + Visual + Personality
3. **Data Sources** - Football APIs + Social Media + Live Feeds
4. **User Layer** - Fan chat + Live commentary + Brand integration

---

## 🔒 Brand Safety

- **Guardrails estrictos** para proteger imagen de Andrés
- **Human-in-the-Loop** - Andrés (humano) configura límites
- **Content moderation** - Filtrado de temas sensibles
- **Kill switch** para emergencias

---

## 💰 Monetization

1. **Suscripciones** - Fans pagan por acceso premium
2. **Brand Deals** - Patrocinadores integrados
3. **Event-based** - Acceso especial durante partidos
4. **Merchandise** - Productos digitales/físicos

---

## 📅 Próximos Pasos Inmediatos

### Week 1-2

1. **Tavus Setup**
   - Revisar pricing y contratos
   - Setup API access
   - Planear sesión de fotogrametría

2. **Football APIs**
   - Documentar investigación
   - Seleccionar 3-5 APIs
   - Setup cuentas y keys

3. **Architecture**
   - Crear ADR específico
   - Definir data models
   - Diseñar API contracts

4. **Team**
   - Asignar roles
   - Setup repo
   - Kickoff meeting

---

## 📚 Documentación

- **FIT Completo:** `docs/projects/andres-cantor-digital-twin/FIT.md`
- **Tavus Guide:** `vibethink-asset-library/tavus/README.md`
- **ML Tools:** `vibethink-asset-library/tavus/ml-tools/README.md`

---

## 🎯 Success Metrics

### Technical
- Voice similarity: >95%
- Visual satisfaction: >90%
- Latency: <500ms
- Uptime: >99.5%

### Business
- Retention: >60% MAU
- NPS: >70
- Revenue: $X/mes
- Brand deals: X activos

---

**Version:** 1.0  
**Last Updated:** 2026-01-10  
**Full FIT:** [Ver documento completo](./FIT.md)
