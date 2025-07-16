# ADR-009: Arquitectura de Conformidad Global (GDPR y Contenido Jurisdiccional)

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

Para operar a nivel global y generar confianza, la plataforma debe incorporar desde su concepción los más altos estándares de privacidad y ser capaz de adaptarse a las regulaciones y normativas específicas de cada jurisdicción. Este documento define la arquitectura para el cumplimiento del GDPR y la gestión de contenido localizado.

## 2. Pilar 1: Cumplimiento de GDPR "Privacy by Design"

La plataforma se construirá siguiendo los principios fundamentales del GDPR:

*   **Consentimiento Explícito**: Implementación de un sistema de opt-in claro para el procesamiento de datos y comunicaciones.
*   **Derecho al Acceso y Portabilidad**: Se habilitará una funcionalidad de "Exportar mis datos" en el perfil del usuario, generando un archivo `JSON` con su información personal.
*   **Derecho a la Rectificación**: Los perfiles de usuario serán completamente editables por el propio usuario.
*   **Derecho al Olvido (Borrado)**: Se implementará una función de eliminación de cuenta segura que borrará los datos personales y anonimizará las contribuciones para mantener la integridad del sistema.
*   **Protección de Datos por Diseño**: Se utilizarán las mejores prácticas de seguridad, incluyendo RLS, cifrado en reposo y en tránsito, y el principio de minimización de datos.

## 3. Pilar 2: Arquitectura de Contenido Jurisdiccional

Para manejar las variaciones de contenido (Faqs, términos legales, impuestos) por país sin duplicación de datos, se adopta el **Modelo de Override (Sobrescritura)**.

### 3.1. Diseño del Esquema

*   **Tabla Principal (`knowledge_items`)**: Almacenará el contenido **global o por defecto**.
*   **Tabla de Excepciones (`knowledge_item_overrides`)**: Almacenará solo las **variaciones específicas** para una jurisdicción. Estará compuesta por:
    *   `item_id`: Vincula al contenido principal.
    *   `jurisdiction_code`: Identificador del país o región (ej. 'CO', 'ES', 'EU').
    *   `overridden_content`: El texto o dato específico para esa jurisdicción.

### 3.2. Lógica de Presentación

El sistema siempre buscará primero el contenido base. Luego, verificará si existe un `override` para la jurisdicción del usuario. Si existe, se mostrará el contenido del `override`; de lo contrario, se mostrará el contenido base. Este modelo garantiza eficiencia, escalabilidad y un mantenimiento centralizado.

## 4. Conclusión

Con esta arquitectura dual, la plataforma estará preparada para un despliegue global, respetando la privacidad del usuario como un pilar fundamental y adaptándose de forma flexible y eficiente a la complejidad del panorama regulatorio internacional. 