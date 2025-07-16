# Registro de Violaciones, Excepciones y Cambios de Reglas

Este documento centraliza todas las violaciones detectadas, excepciones justificadas y cambios de criterio en las reglas, estándares y procesos internos del equipo de desarrollo.

## 📋 Formato de registro

- **Fecha**
- **Regla/estándar afectado**
- **Descripción de la violación/excepción**
- **Motivo**
- **Impacto**
- **Decisión tomada**
- **Responsable**
- **¿Requiere cambio de regla?**
- **¿Se documentó en el índice maestro?**
- **Prioridad de seguimiento**
- **Acción futura (si aplica)**

---

## 📝 Ejemplo de entrada

### 2025-06-24
- **Regla afectada:** "No usar código AGPL-3.0 en SaaS cerrado"
- **Descripción:** Se detectó que un módulo de UI fue copiado directamente de Postiz.
- **Motivo:** Urgencia por demo.
- **Impacto:** Riesgo legal.
- **Decisión:** Reescribir el módulo antes de producción.
- **Responsable:** Equipo Frontend.
- **¿Requiere cambio de regla?:** No, solo refuerzo.
- **¿Se documentó en el índice maestro?:** Sí.
- **Prioridad:** Alta.
- **Acción futura:** Revisar todos los módulos antes de release. 