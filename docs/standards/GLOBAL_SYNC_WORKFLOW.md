# 🔄 VibeThink Global Workflow (Universal Sync)

> **Philosophy:** "Everything is a Node. Everything is Versioned. Everything is Synced."

## 1. El Concepto de "Source of Truth" Universal

Para no perdernos entre código propio, librerías externas y assets de referencia, definimos 4 tipos de **Entidades de Origen**:

| Tipo | Definición | Ejemplo | Fuente de Verdad | Política |
| :--- | :--- | :--- | :--- | :--- |
| **Vendor (Managed)** | Librería instalada via npm | `react`, `next`, `bullmq` | `package.json` | Actualizar con `pnpm update`. Validar Changelog. |
| **Asset (Reference)** | Código externo offline (ejemplos) | `C:\IA...\xyflow`, `bundui` | Carpeta Externa | `git pull` en carpeta externa antes de copiar. |
| **Vendor (Hosted)** | Servicios externos | Supabase, OpenAI | Dashboard del Vendor | Revisar estado de API y deprecations trimestralmente. |
| **Legacy Overlay** | Código externo copiado en el repo | `dashboard-bundui`, `legacy/` | El Repo (`/apps/...`) | Solo lectura/Compatibilidad. No evolucionar. |

---

## 2. El Ciclo de Vida del "Porting" (Generalizado)

Cualquier cosa que entre a VibeThink (desde un botón hasta un orquestador) sigue este **Ciclo de Vida de 5 Pasos**:

1.  **🔍 Scouting (Exploración):**
    *   Detectar el candidato en nuestra "Asset Library" o Internet.
    *   Evaluar compatibilidad (React 19, TS, Tailwind v4).
2.  **🧪 Sandbox (Prueba):**
    *   No instalar en `main`. Crear rama `feat/evaluation-[name]`.
    *   Prueba de concepto rápida (30 mins).
3.  **🤝 Adoption (Adopción):**
    *   Si pasa: Instalar dependencia oficial (`pnpm add`).
    *   Si es código: Copiar a `src/components/extensions/` (no mezclar con core).
4.  **🎨 Adaptation (VibeThink-ificación):**
    *   Aplicar `useTranslation`.
    *   Aplicar Tokens de Diseño (`bg-primary`).
    *   Agregar `use client` si es necesario.
5.  **📜 Registry (Sello Oficial):**
    *   Documentar en `VENDOR_VERSIONS.md`.
    *   Agregar al `module-registry.ts` si es un módulo funcional.

---

## 3. Matriz de Versiones (Cómo mantener todo fresco)

| Categoría | Frecuencia de Chequeo | Responsable | Acción |
| :--- | :--- | :--- | :--- |
| **Core (React/Next)** | Mensual | Arquitecto | `pnpm outdated`. Revisar Breaking Changes. |
| **UI Assets (Bundui)** | Trimestral | UX Lead | Comparar `bundui-reference` vs Repo. Cherry-pick features. |
| **Logic Assets (XYFlow)** | Semestral | Dev Lead | Revisar nuevos tipos de nodos/ejemplos en la Asset Library. |
| **Security** | Semanal | Auto (GitHub) | Dependabot / Snyk. |

---

## 4. La Regla de Oro de la Generalización

> "Si tienes que hacerlo dos veces, escribe un script o un documento estándar."

*   **No documentes "Cómo actualizar Bundui".**
*   **Documenta "Cómo actualizar un Asset Externo".** (Y usa a Bundui como ejemplo).

---
**Status:** CANONICAL
**Ubicación:** `docs/standards/GLOBAL_SYNC_WORKFLOW.md`
