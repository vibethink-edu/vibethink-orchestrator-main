# 🗂️ Política General de Clasificación Documental – CMMI ML3

---

## 1. Alcance

Esta política aplica a toda la documentación, evidencia y artefactos generados para demostrar cumplimiento CMMI ML3 en el proyecto.

---

## 2. Criterios de inclusión y exclusión

- **Incluir:**
  - Documentos, plantillas, reportes y evidencia directamente relacionados con los procesos, prácticas y áreas de CMMI ML3.
  - Artefactos requeridos por auditoría, mejora continua o trazabilidad.
- **Excluir:**
  - Material temporal, borradores no validados, archivos personales o sin relevancia directa para CMMI ML3.
  - Evidencia transversal o global debe residir en la carpeta de mayor nivel y solo referenciarse aquí.

---

## 3. Naming convention

- Usar kebab-case para archivos y carpetas, salvo excepciones internacionales (`README.md`, `CHANGELOG.md`).
- Ejemplo: `test-report-2024.md`, `process-map.md`, `evidence-summary.md`.

---

## 4. Estructura de carpetas

- Organizar por área de proceso (engineering, support, project-management, etc.).
- Cada subcarpeta debe tener un `README.md` explicando su propósito y referencia a esta política.

---

## 5. Política de enlaces cruzados

- Si un documento aplica a varias áreas, debe residir en la carpeta de mayor nivel de abstracción y ser referenciado desde las demás.
- Evitar duplicidad de archivos; priorizar enlaces y referencias.

---

## 6. Auditoría y actualización

- Esta política es auditable en cada revisión de PR y auditoría interna.
- Cualquier excepción debe documentarse explícitamente en el `README.md` del área correspondiente. 