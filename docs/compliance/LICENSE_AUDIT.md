# ⚖️ Auditoría de Licencias de Terceros (SaaS Compliance)

> **Objetivo:** Verificar que todas las tecnologías integradas permiten su uso comercial en un SaaS (Software as a Service) sin riesgo legal.
> **Estado:** ✅ AUDITED (2026-01-09)

---

## 1. El Semáforo Legal

Antes de incluir cualquier librería, verificamos su licencia contra este semáforo:

*   **🟢 PERMITIDO (SaaS Safe):** MIT, Apache 2.0, ISC, BSD-3-Clause. (Permiten uso comercial, modificación y no son "virales").
*   **🟡 REVISIÓN (Cuidado):** MPL, LGPL. (Permitidos si se usan como librerías dinámicas, pero requieren análisis).
*   **🔴 PROHIBIDO (Viral/Riesgo):** GPL v2/v3, AGPL. (Obligan a liberar TU código fuente si lo usas en SaaS. **Estrictamente prohibidos** en el backend).

---

## 2. Auditoría de Vendors Actuales

### 🎨 Frontend & UI

| Vendor | Licencia | Estado SaaS | Notas |
| :--- | :--- | :--- | :--- |
| **React / Next.js** | **MIT** | 🟢 Seguro | Estándar de industria. |
| **Tailwind CSS** | **MIT** | 🟢 Seguro | Framework de estilos. |
| **Shadcn UI** | **MIT** | 🟢 Seguro | El código es tuyo al copiarlo. |
| **XYFlow (React Flow)** | **MIT** | 🟢 Seguro | Core libre. Versión Pro opcional. |
| **Bundui Premium** | **COMERCIAL** | 🟡 **Licencia Requerida** | Requiere compra única. No redistribuir código fuente públicamente. |
| **Builder.io** | **MIT (SDK)** | 🟢 Seguro | El SDK es MIT. El servicio es SaaS Freemium/Paid. |

### ⚙️ Backend & Core

| Vendor | Licencia | Estado SaaS | Notas |
| :--- | :--- | :--- | :--- |
| **Supabase (Client)** | **MIT** | 🟢 Seguro | Cliente JS. |
| **BullMQ** | **MIT** | 🟢 Seguro | Motor de colas Redis. |
| **PayloadCMS** | **MIT** | 🟢 Seguro | Free for commercial use. |

---

## 3. Matriz de Licenciamiento para Nuevos Candidatos

Cualquier tecnología futura (ej. "CoolNewFramework") debe pasar por este filtro:

| Tipo | Licencia | Acción |
| :--- | :--- | :--- |
| **Open Source** | MIT, Apache 2.0 | ✅ **Aprobar** |
| **Open Source (Viral)** | GPL, AGPL | 🛑 **RECHAZAR** (Contamina el IP de VibeThink) |
| **Comercial / SaaS** | Propietaria | ⚠️ **Auditar Costo** (¿Pagan por usuario o por uso?) |

---

## 4. Política de "Bundui Premium" (Propiedad Intelectual)

*   **Titularidad:** La licencia de Bundui debe estar a nombre de la empresa VibeThink.
*   **Repo Privado:** Es obligatorio que el repositorio de VibeThink sea **Privado**. Si se hace público, se viola la licencia de Bundui.

---
**Responsable:** Legal / Architecture Lead
