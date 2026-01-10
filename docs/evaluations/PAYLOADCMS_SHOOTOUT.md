# ⚔️ Vendor Shootout: PayloadCMS vs VibeThink Stack

> **Fecha:** 2026-01-09
> **Tipo:** Evaluación Arquitectónica (Headless CMS & Admin Panel)
> **Contendiente:** PayloadCMS 3.0 (Next.js Native)
> **Estado:** 🟡 EVALUACIÓN LEGAL & TÉCNICA

---

## 1. Checkpoint Legal (Crucial)

| Criterio | PayloadCMS | Veredicto |
| :--- | :--- | :--- |
| **Licencia** | **MIT** (Desde Mayo 2022) | 🟢 **APROBADO.** Seguro para SaaS comercial. |
| **Restricciones** | Ninguna (Free for commercial use). | 🟢 **APROBADO.** |
| **Riesgo Viral** | No tiene dependencias virales conocidas. | 🟢 **APROBADO.** |

---

## 2. Análisis Técnico (Arquitectura Monorepo)

El usuario menciona "ver la organización del repo". PayloadCMS 3.0 ha migrado a una arquitectura nativa de Next.js.

### Modelo de Organización (Lo que nos gusta)
*   **Monorepo-First:** Payload está diseñado para vivir *dentro* de tu repo de Next.js, no como un servicio externo aislado.
*   **Code-First Config:** Defines tus colecciones (Users, Media, Orders) en TypeScript (`payload.config.ts`), no en una UI click-to-configure.
*   **Local API:** Permite que tu frontend consulte la DB directamente (sin fetch HTTP) si están en el mismo servidor. **Velocidad extrema.**

### Comparativa: Payload vs VibeThink Admin (Bundui)

| Feature | **PayloadCMS 3.0** | **VibeThink Admin (Actual)** |
| :--- | :--- | :--- |
| **Admin UI** | Generada automáticamente | Construida a mano (Bundui) |
| **Flexibilidad UI** | Limitada (es un CMS) | Infinita (es React puro) |
| **Backend** | Gestiona Auth, DB y Validaciones | Nosotros gestionamos todo (Supabase + Zod) |
| **Uso Ideal** | Gestión de Contenidos (Blog, Proyectos) | SaaS complejo (Dashboards analíticos) |

---

## 3. Auditoría de "Assets Repository" (Inspiración)

Payload tiene un manejo de Assets interesante que podríamos imitar:

1.  **Separación Frontend/Backend:** En un monorepo, Payload suele ir en `/src/payload` o como paquete separado, pero comparte tipos con el frontend.
2.  **Hooks:** Usa hooks (`beforeChange`, `afterDelete`) para lógica de negocio. Esto es muy similar a nuestros Triggers, pero en código TS.

---

## 4. Veredicto Final

**¿Reemplaza Payload a VibeThink?**
**❌ NO REEMPLAZA AL SAAS.** (Tu SaaS es mucho más que un CMS).

**¿Complementa?**
**🤝 SÍ, PODRÍA.**
Si alguna vez necesitamos un **Blog, Help Center o Gestión de Marketing** dentro de VibeThink, Payload es el candidato #1. Es mucho mejor que montar un WordPress o Contentful externo.

**Decisión:**
Mantener en **Technology Radar** bajo el anillo **🟡 TRIAL**.
No implementarlo ahora (tenemos Bundui), pero usar su arquitectura de "Config-First" como inspiración para nuestros propios módulos.

---
**Firmado:** Arquitectura VibeThink
