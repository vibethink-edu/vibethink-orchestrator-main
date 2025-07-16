# ADR-011: Arquitectura de Formularios Inteligentes (SFI)

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---


*   **Autor**: Marcelo Escallón
*   **Cargo**: CEO, Euphorianet
*   **Fecha**: 2024-06-22
*   **Estado**: Aprobado

**Nota de Confidencialidad**: Este documento es propiedad de Euphorianet. Contiene información confidencial y propietaria y no debe ser distribuido, copiado o divulgado sin autorización explícita.

---

## 1. Contexto

Para evolucionar más allá de la entrada de datos estática y alinear la plataforma con nuestra visión de "Inteligencia Aumentada", se ha decidido implementar una arquitectura estándar para todos los formularios. El objetivo es que los formularios sean proactivos, auto-documentados y asistidos por IA, reduciendo la fricción para el usuario y aumentando la calidad de los datos.

## 2. Arquitectura Adoptada

El Sistema de Formularios Inteligentes (SFI) se basa en dos componentes principales:

### 2.1. Repositorio de Metadatos del Esquema

*   **Decisión**: Se creará una tabla centralizada `schema_metadata` en Supabase para que actúe como un "diccionario de datos" vivo y accesible por API.
*   **Estructura**: Esta tabla almacenará, para cada campo de la base de datos, metadatos cruciales como:
    *   `short_description` (multilingüe, para tooltips de ayuda en línea).
    *   `long_description` (multilingüe, para contextualizar a los agentes de IA).
    *   `example_value` (para guiar al usuario).
    *   `jurisdiction_code` (para aplicar overrides localizados a las descripciones).

### 2.2. Componente de UI `<IntelligentFormField>`

*   **Decisión**: Se desarrollará un componente de UI estándar y reutilizable que encapsulará toda la lógica inteligente. Este componente reemplazará a todos los campos de entrada estándar.
*   **Funcionalidades**:
    1.  **Ayuda en Línea Contextual**: Incluirá un icono de ayuda que, al activarse, mostrará la `short_description` del campo obtenida del repositorio de metadatos.
    2.  **Asistencia de IA a Nivel de Campo**: Incluirá un icono de IA que permitirá al usuario solicitar sugerencias o autocompletado para ese campo específico.
    3.  **Relleno Inteligente a Nivel de Formulario**: Los formularios compuestos por estos componentes podrán ofrecer una funcionalidad de "Diligenciar con IA" que rellenará múltiples campos de una sola vez.

## 3. Flujo de Interacción con IA

La interacción con la IA siempre será contextual. El componente `<IntelligentFormField>` enviará no solo el valor actual, sino también su identidad (`tableName`, `columnName`) y el contexto del registro que se está editando. Esto permite al servicio de IA consultar el repositorio de metadatos para obtener la `long_description` del campo y así construir prompts altamente relevantes y precisos para el LLM.

## 4. Conclusión

Esta arquitectura unifica la documentación, la ayuda en línea y la asistencia de IA en un sistema cohesivo y escalable. Asegura que todos los formularios de la plataforma, presentes y futuros, se beneficien de un nivel superior de inteligencia y usabilidad, convirtiendo la entrada de datos de una tarea tediosa a una colaboración eficiente entre el usuario y la IA. 