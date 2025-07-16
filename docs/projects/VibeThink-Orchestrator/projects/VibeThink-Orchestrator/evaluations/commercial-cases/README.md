# Estudios Comerciales y Sectoriales (Commercial Cases)

Esta carpeta centraliza toda la documentación, estudios de caso, protocolos y patrones de integración sectorial y comercial ("industry stacks") del proyecto.

- Aquí se agrupan los materiales, análisis y casos de uso por industria (retail, restauración, fintech, salud, etc.) que sirven como referencia para despliegues, consultoría, ventas y personalización sectorial.
- No se mezclan aquí auditorías técnicas, benchmarks ni evaluaciones transversales (que van en `/docs/project/evaluations/`).
- Si un estudio de caso es relevante para ambos contextos (sectorial y evaluación técnica), debe referenciarse en ambos README, pero mantenerse en esta carpeta para la gestión sectorial.

## Reglas de actualización
- Toda nueva documentación sectorial/comercial debe agregarse aquí, siguiendo la estructura y nomenclatura acordada.
- No eliminar ni mover estudios sin dejar constancia en este README o en el changelog del proyecto.
- Actualizar este README ante cualquier cambio relevante en la estructura o el proceso de gestión sectorial.

> _Esta regla asegura trazabilidad, claridad y acceso rápido a los materiales comerciales y sectoriales del proyecto._

---

## 📜 Política de centralización obligatoria

> **Regla permanente:**
>
> Todos los industry stacks, estudios de caso comerciales, protocolos sectoriales y documentación de referencia para despliegues, consultoría o ventas por industria deben ser centralizados exclusivamente en esta carpeta (`/docs/project/evaluations/commercial-cases/`).
>
> - No se permite la dispersión de material sectorial/comercial en otras carpetas del monorepo.
> - Cualquier nuevo material de este tipo debe agregarse aquí y documentarse en este README.
> - Si un documento es relevante para evaluaciones técnicas, puede referenciarse desde `/docs/project/evaluations/`, pero su fuente única debe ser esta carpeta.
>
> _Esta política es obligatoria para mantener la trazabilidad, la claridad y la eficiencia en la gestión documental sectorial y comercial del proyecto._

---

## 🏷️ Naming convention obligatoria

> **Regla permanente:**
>
> Todos los archivos y carpetas en esta carpeta deben seguir la convención kebab-case:
> - Solo minúsculas, palabras separadas por guiones (`-`).
> - Sin guiones bajos (`_`), sin espacios, sin mayúsculas (excepto `README.md`).
> - Ejemplo: `integration-ecosystem.md`, `restaurant-stack.md`, `executive-summary.md`.
> - Documentos clave como `README.md` o `CHANGELOG.md` pueden ir en mayúsculas por estándar internacional.
>
> Cualquier archivo que no cumpla con esta convención debe ser renombrado inmediatamente. Esta política es obligatoria y auditable en revisiones de PR y auditorías internas.

---

### 📝 Auditoría de cumplimiento

> [2024-07-02] Todos los archivos y carpetas presentes han sido renombrados a kebab-case. Esta carpeta cumple al 100% con la política de naming convention establecida. Cualquier nuevo archivo deberá seguir esta convención obligatoriamente. 