# 🗂️ Registro de Riesgos y Oportunidades (Risk Log)

## 📅 **Fecha:** 19 Junio 2025
## 🎯 **Objetivo:** Identificar, analizar, y gestionar proactivamente los riesgos y oportunidades del proyecto para asegurar el éxito y la resiliencia.
## 👥 **Audiencia:** Stakeholders, Product Owner, Equipo de Desarrollo

---

## 🧭 **Filosofía de Gestión de Riesgos**

Este documento es una herramienta **estratégica y proactiva**, no un registro de problemas. Su propósito es:
- **Anticipar:** Identificar potenciales obstáculos antes de que ocurran.
- **Preparar:** Definir planes de mitigación claros y accionables.
- **Priorizar:** Enfocar nuestros esfuerzos en los riesgos más significativos.
- **Capitalizar:** Identificar y aprovechar oportunidades inesperadas.

El log se revisará semanalmente en la reunión de equipo para mantenerlo actualizado.

---

## 📈 **Matriz de Probabilidad e Impacto**

Usamos esta matriz para calcular la **Severidad** (`Probabilidad * Impacto`) y priorizar los riesgos.

| **Probabilidad** | **Impacto** | **Descripción** |
| :--- | :--- | :--- |
| **5** (Muy Alta) | **5** (Crítico) | Ocurrencia casi segura. | Interrupción total del proyecto/negocio. |
| **4** (Alta) | **4** (Alto) | Es muy probable que ocurra. | Impacto severo en coste, tiempo o calidad. |
| **3** (Media) | **3** (Medio) | Podría ocurrir. | Impacto notable, requiere esfuerzo para corregir. |
| **2** (Baja) | **2** (Bajo) | Es poco probable que ocurra. | Impacto menor, inconvenientes. |
| **1** (Muy Baja) | **1** (Muy Bajo) | Ocurrencia muy remota. | Impacto insignificante. |

---

## 📋 **Registro de Riesgos Activos**

| ID | Fecha | Descripción del Riesgo | Prob. (1-5) | Imp. (1-5) | Severidad (P*I) | Plan de Mitigación | Responsable | Estado |
|:---|:---|:---|:---:|:---:|:---:|:---|:---|:---|
| R-001 | 19/06/2025 | **Dependencia externa crítica:** La API de un proveedor de IA (ej. OpenAI) sufre una caída prolongada o cambia sus términos de servicio de forma disruptiva. | 3 | 5 | 15 | 1. Implementar un conector secundario a un modelo de IA alternativo (ej. Claude, Gemini) a través de un orquestador como OpenRouter. <br> 2. Implementar un sistema de reintentos con backoff exponencial. <br> 3. Definir un modo de "funcionalidad degradada" si la IA no está disponible. | Líder Técnico | **Identificado** |
| R-002 | 19/06/2025 | **Fuga de datos (Data Leak):** Una configuración incorrecta en las políticas RLS de Supabase o un bug en el código podría exponer datos de una empresa a otra. | 2 | 5 | 10 | 1. Implementar tests E2E específicos que intenten acceder a datos cross-tenant y verifiquen que fallan. <br> 2. Realizar auditorías de seguridad periódicas (trimestrales) sobre las políticas RLS. <br> 3. Añadir a la checklist de PR una revisión específica de queries a la BD. | Equipo Dev | **Identificado** |
| R-003 | 19/06/2025 | **Escalabilidad de la Base de Datos:** Un crecimiento rápido de usuarios podría degradar el rendimiento de la base de datos de Supabase más rápido de lo esperado. | 3 | 4 | 12 | 1. Implementar un monitoreo proactivo del rendimiento de la BD (ej. con herramientas de Supabase o externas). <br> 2. Optimizar las queries más frecuentes. <br> 3. Tener un plan pre-aprobado para escalar la instancia de Supabase. | Equipo Infra | **Identificado** |
| | | | | | | | | |

---

## ✨ **Registro de Oportunidades**

| ID | Fecha | Descripción de la Oportunidad | Potencial (1-5) | Facilidad (1-5) | Puntuación (P*F) | Plan de Acción | Responsable | Estado |
|:---|:---|:---|:---:|:---:|:---:|:---|:---|:---|
| O-001 | 19/06/2025 | **Auge de Modelos Open Source:** El rendimiento de modelos de IA open-source de 7B de parámetros está alcanzando a modelos comerciales para tareas específicas. | 4 | 3 | 12 | Investigar y realizar un PoC para usar un modelo open-source (hosteado localmente o en Hugging Face) para tareas de bajo coste como clasificación o resumen simple, reduciendo la dependencia y los costes de APIs externas. | Equipo IA | **Identificado** |
| | | | | | | | | |

---

## 🗄️ **Historial de Riesgos Cerrados/Mitigados**

| ID | Descripción del Riesgo | Fecha de Cierre | Resultado / Lección Aprendida |
|:---|:---|:---|:---|
| | | | |

---
**Última actualización:** 19 Junio 2025  
**Próxima revisión:** 26 Junio 2025 