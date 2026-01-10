# ⚔️ Vendor Shootout: Builder.io (Marketing Freedom)

> **Fecha:** 2026-01-09
> **Tipo:** Evaluación Arquitectónica (Headless Page Builder)
> **Contendiente:** Builder.io
> **Estado:** 🏆 **GOLD STANDARD**

---

## 1. ¿Qué es Builder.io?
Es un "Visual Headless CMS".
*   **Para Marketing:** Es como Wix/Webflow. Arrastran botones, cambian textos, hacen A/B testing, publican landings sin pedir permiso.
*   **Para Developers (Tú):** Es una API que te devuelve JSON. Tú registras tus componentes de React (`<Hero />`, `<PricingCard />`) y Builder permite a Marketing usarlos.

---

## 2. El "Marketing Freedom" Real
El usuario pregunta: *"¿Builder.io les daría esa facilidad?"*
**Respuesta: SÍ, ABSOLUTAMENTE.**

| Tarea de Marketing | Sin Builder.io | Con Builder.io |
| :--- | :--- | :--- |
| **Cambiar texto del Hero** | Ticket en Jira -> Dev edita código -> Deploy | Marketing edita en vivo -> Publicar. |
| **Nueva Landing de Navidad** | Dev crea `pages/xmas.tsx` -> 2 días | Marketing clona template -> Arrastra bloques -> 1 hora. |
| **A/B Testing** | Implementar herramienta externa compleja | Nativo en Builder (Click derecho -> A/B Test). |

---

## 3. Integración Técnica (Monorepo Friendly)
Builder.io se integra perfectamente en Next.js.
1.  **SDK:** `npm install @builder.io/react`.
2.  **Registro:** En tu código, le dices a Builder: "Mira, tengo este componente `FancyButton`".
3.  **Uso:** En el editor visual de Builder, `FancyButton` aparece en la barra lateral.

**Ventaja Clave:** Marketing usa TUS componentes (Bundui/VibeThink), por lo que las landings **no se ven feas** ni rompen la marca.

---

## 4. Diferencia con PayloadCMS
*   **PayloadCMS:** Genial para datos estructurados (Blog Posts, Autores).
*   **Builder.io:** Genial para layouts visuales libres (Landings, Homepages).

---

## 5. Veredicto Final

**¿Es la solución para Marketing?**
**🟢 SÍ.** Es la herramienta estándar de la industria para este problema exacto ("Marketing quiere editar la web sin molestar a Dev").

**Recomendación:**
1.  **Adoptar Builder.io** (Plan Free/Start) para las páginas públicas (Marketing Site).
2.  **Mantener VibeThink Admin** (Bundui) para la aplicación SaaS.
3.  **No usar Onlook** para esto (demasiado técnico).

---
**Firmado:** Arquitectura VibeThink
