# ⚖️ Política de Evaluación de Nuevos Vendors/Componentes

> **Propósito:** Definir el proceso estandarizado para evaluar si una nueva tecnología (ej. `MotiaDev`) debe reemplazar o complementar una existente (ej. `Bundui`).

---

## 1. El Criterio de los "3 Ejes"

Para aceptar un nuevo vendor, debe ganar en al menos 2 de estos 3 ejes sin sacrificar el tercero catastróficamente:

### A. Eje Técnico (Calidad de Código)
*   **Compatibilidad:** ¿Soporta React 19 y Tailwind v4 nativamente? (Crucial para VibeThink).
*   **Stack:** ¿Usa TypeScript estricto o `any`? ¿Usa variables CSS modernas?
*   **Dependencias:** ¿Trae un "árbol de navidad" de dependencias (bloatware) o es ligero?

### B. Eje de Negocio (Valor/Licencia)
*   **Licencia:** ¿Es MIT/Apache (gratis y seguro) o Comercial/Restrictiva?
*   **Costo de Cambio:** ¿Reemplazar lo actual (Bundui) nos cuesta 100 horas de refactorización? Si el beneficio es marginal, la respuesta es NO.
*   **Mantenimiento:** ¿El repo tiene commits recientes (último mes) o está abandonado?

### C. Eje de Experiencia (UX/DX)
*   **UX:** ¿Es visualmente superior o igual a nuestros estándares premium?
*   **DX (Developer Experience):** ¿Es fácil de copiar/pegar y adaptar, o requiere una configuración oscura?
*   **Accesibilidad:** ¿Cumple WCAG o rompe la navegación por teclado?

---

## 2. El Proceso de "Shootout" (Duelo)

Antes de adoptar, se ejecuta un "Shootout" documentado.

### Paso 1: Asset Sandbox
1.  **Clonar** el nuevo candidato en `vibethink-asset-library/candidates/[nombre]`.
2.  **No instalar** en el monorepo todavía.

### Paso 2: La Prueba Ácida (The Smoke Test)
Tomar **UN** componente complejo (ej. un Dashboard Card o una Tabla) y tratar de portarlo a VibeThink siguiendo la [Guía de Porting](./GENERAL_COMPONENT_PORTING_GUIDE.md).

*   **¿Falló el copy-paste?** (Muchos errores de tipo, estilos rotos). -> 🚩 Red Flag.
*   **¿Requiere instalar 5 librerías nuevas?** -> 🚩 Red Flag.
*   **¿Funcionó en < 30 mins?** -> ✅ Green Flag.

### Paso 3: Scorecard Comparativo (Ejemplo MotiaDev vs Bundui)

Crear un documento temporal `docs/evaluations/MOTIADEV_VS_BUNDUI.md`:

| Criterio | Bundui (Actual) | MotiaDev (Candidato) | Ganador |
| :--- | :--- | :--- | :--- |
| **Stack** | Next 15 / React 19 | ¿...? | ? |
| **Estilos** | Tailwind v4 | ¿...? | ? |
| **Licencia** | Comercial (Pagada) | ¿MIT? | ? |
| **Diseño** | Premium | ¿...? | ? |
| **Código** | Necesita refactor (i18n) | ¿...? | ? |

---

## 3. Matriz de Decisión

*   **✅ ADOPTAR (Reemplazo Total):** Si gana en Técnico y Negocio, y la migración es viable.
*   **🤝 INCORPORAR (Complemento):** Si tiene componentes únicos (ej. un Gráfico 3D) que el actual no tiene. Se usa solo para esos casos.
*   **❌ RECHAZAR:** Si es técnicamente inferior o igual pero con costo de migración alto.

---

## 4. Resultado Formal (ADR)

Si se decide cambiar, se debe crear un **ADR (Architectural Decision Record)** en `docs/governance/decisions/` explicando:
"Decidimos migrar de X a Y porque Y soporta React 19 nativo y ahorra 20% de tiempo de desarrollo, a pesar del costo de migración inicial."

---
**Status:** REFERENCE
**Owner:** Arquitectura VibeThink
