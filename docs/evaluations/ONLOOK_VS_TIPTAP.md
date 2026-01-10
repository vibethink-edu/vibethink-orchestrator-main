# ⚔️ Vendor Shootout: Onlook vs TipTap (Marketing Freedom)

> **Fecha:** 2026-01-09
> **Tipo:** Evaluación Arquitectónica (Visual Builders & Landing Pages)
> **Contendientes:** **Onlook** (Visual React Builder) vs **TipTap** (Rich Text Editor).

---

## 1. El Malentendido Fundamental

El usuario busca una herramienta para **"libertad de Landing Pages y Campañas"** para el equipo de Marketing.

| Herramienta | ¿Qué es realmente? | ¿Qué puede hacer Marketing con ella? |
| :--- | :--- | :--- |
| **TipTap** | Un "Word" supervitaminado (Headless Editor). | Escribir un Post de Blog muy bonito. |
| **Onlook** | Un "Webflow" para tu código React (Visual IDE). | Mover botones de sitio, cambiar colores, diseñar toda la página. |

**Conclusión Inicial:** Son animales diferentes. TipTap es para **Contenido**. Onlook es para **Estructura/Diseño**.

---

## 2. Evaluación de Onlook (El nuevo candidato)

### A. La Promesa
Onlook permite editar una aplicación React **en vivo** (como si fuera Figma) y escribe los cambios directamente en el código (`.tsx`).

### B. El Peligro (El "pero" gigante)
Onlook está diseñado como una herramienta de **Desarrollo (Localhost)**.
*   **Workflow:** El developer corre `npm run onlook`, edita visualmente, y Onlook modifica los archivos locales. Luego haces commit.
*   **Problema para Marketing:** "Doña María de Marketing" no tiene el repo clonado en su laptop ni corre `npm run dev`.
*   **¿Existe versión Cloud/SaaS?** Onlook tiene features de colaboración, pero su core sigue siendo escribir código en el repo.

### C. La Alternativa Real para Marketing
Para que Marketing sea autónomo, necesitan un **Headless CMS con Page Builder** (como Builder.io, PayloadCMS, o un TipTap muy customizado).

---

## 3. Matriz de Decisión (Marketing Freedom)

### Escenario A: Quieren editar *Texto* de Campañas
*   **Ganador:** **TipTap** (Integrado en VibeThink Admin).
*   **Flujo:** Marketing entra al Admin -> Edita el texto enriquecido -> Guardar.

### Escenario B: Quieren crear *Landing Pages Nuevas* desde cero
*   **Ganador Technical:** **Onlook** (Pero solo si Marketing aprende a usar git/localhost o si Onlook saca una versión Cloud robusta).
*   **Ganador Realista:** **PayloadCMS** (usando su sistema de Bloques/Layouts) o **Builder.io** (arrastrar componentes visuales en la nube).

---

## 4. Veredicto Final

**¿Onlook reemplaza a TipTap?**
**❌ NO.** TipTap sigue siendo necesario para editar la biografía del usuario, el cuerpo de un email, o un post de blog.

**¿Onlook sirve para Marketing?**
**⚠️ CUIDADO.** Onlook es increíble para **Diseñadores que saben un poco de código**. No es una herramienta "No-Code" para marketers puros (a menos que el marketer sea técnico).

**Recomendación:**
1.  **Mantén TipTap** para edición de texto rico (Rich Text).
2.  **Evalúa Onlook** solo como herramienta para **TUS Diseñadores**, para que ellos ajusten pixel-perfect sin molestarte a ti. No se lo des a Marketing directo todavía.

---
**Firmado:** Arquitectura VibeThink
