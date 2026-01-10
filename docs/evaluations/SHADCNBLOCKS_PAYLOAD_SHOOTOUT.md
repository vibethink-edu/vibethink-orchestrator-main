# ⚔️ Vendor Shootout: ShadcnBlocks for PayloadCMS

> **Fecha:** 2026-01-09
> **Tipo:** Evaluación de Complemento (UI Blocks para CMS)
> **Contendiente:** ShadcnBlocks (PayloadCMS Integration)
> **Estado:** 🔴 **RECHAZADO (Over-Engineering)**

---

## 1. El Contexto (¿Qué es?)
Es un set de bloques visuales (Hero, Features, Pricing) *ya configurados* para trabajar dentro de PayloadCMS.

## 2. Checkpoint de Negocio (Duplicidad)

**¿Tenemos ya bloques Premium?**
*   **SÍ.** Tenemos `Bundui Premium` (dashboard) y `Shadcn UI` (base).
*   **¿Qué aporta esto?** Solo la "conexión" pre-hecha con PayloadCMS.

**Análisis de Costo/Beneficio:**
*   **Costo:** Licencia adicional (Pro).
*   **Beneficio:** Ahorrar tiempo conectando un bloque Hero a Payload.
*   **Problema:** Si decidimos usar **Builder.io** (Evaluación anterior), estos bloques de Payload son redundantes. Builder.io ya resuelve el tema de "Marketing Freedom" mejor que Payload.

## 3. Matriz de Decisión

| Escenario | Solución Recomendada | ¿ShadcnBlocks ayuda? |
| :--- | :--- | :--- |
| **Landing Pages (Marketing)** | **Builder.io** | No. Builder tiene su propio visual editor superior. |
| **Blog / Contenido Estructurado** | **PayloadCMS Base** | No necesitamos bloques visuales complejos, solo texto e imágenes. |
| **Dashboard SaaS** | **Bundui (Ya lo tenemos)** | No. ShadcnBlocks es para marketing sites, no apps complejas. |

---

## 4. Veredicto Final

**¿Comprar ShadcnBlocks Payload?**
**❌ NO SE JUSTIFICA.**

**Razones:**
1.  **Redundancia:** Ya tienes Bundui (UI Premium) y Builder.io (Page Builder).
2.  **Over-Engineering:** Meter una capa extra de UI dentro de un CMS (Payload) cuando ya tienes un Page Builder dedicado (Builder.io) es ensuciar la arquitectura.
3.  **Foco:** Usa Payload para lo que es bueno (Datos puros: Blog, Autores). Usa Builder para lo visual.

**Recomendación:**
Ahorra el dinero. Si necesitas un bloque Hero en Payload, créalo tú mismo en 10 minutos copiando el código de Bundui.

---
**Firmado:** Arquitectura VibeThink
