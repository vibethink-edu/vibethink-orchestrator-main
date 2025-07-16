# ADR-010: Principio de Diseño Global "Jurisdictional by Design"

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

## 1. Decisión

Se establece que el **Modelo de "Overrides" Jurisdiccionales**, definido en el `ADR-009`, es un principio de diseño fundamental y mandatorio para toda la plataforma. Todos los módulos, presentes y futuros, deben ser diseñados con la capacidad inherente de adaptarse a diferentes jurisdicciones.

## 2. Alcance de Aplicación

Este principio debe ser considerado en el diseño y la codificación de cualquier funcionalidad que pueda variar según la ubicación geográfica o el marco legal del cliente. Esto incluye, pero no se limita a:

*   **Facturación**: Impuestos, monedas, formatos de factura.
*   **Legal**: Términos de Servicio, Políticas de Privacidad.
*   **Faqs y Documentación**: Respuestas y guías.
*   **Módulo CRM**: Formatos de campos (direcciones, tipos de documento).
*   **Integraciones con Terceros**: Disponibilidad de servicios y pasarelas de pago.

## 3. Directriz de Codificación

Cualquier nuevo desarrollo que maneje datos o lógica potencialmente localizada debe implementar el patrón de **tabla base + tabla de overrides** o una lógica de filtrado por `jurisdiction_code` en la API, según corresponda. El objetivo es mantener una base de código única, donde la localización sea una función de los datos, no de la lógica duplicada.

## 4. Flujo de Trabajo de Documentación Continua

Como corolario de este principio, se adopta el siguiente flujo de trabajo:

> **Toda decisión de negocio, regla de funcionamiento o definición de arquitectura debe ser inmediatamente documentada como un ítem en el Sistema de Conocimiento de Producto (Faqs).**

Esto asegura que nuestra documentación de cara al cliente y la base de conocimiento de nuestra IA evolucionen en perfecta sincronía con el desarrollo de la plataforma. 