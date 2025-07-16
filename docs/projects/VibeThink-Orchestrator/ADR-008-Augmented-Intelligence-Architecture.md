# ADR-008: Arquitectura de Inteligencia Aumentada y Triple Capa de Conocimiento

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

## 1. Contexto y Decisión Estratégica

Se ha decidido evolucionar la plataforma de un SaaS de gestión a una **Plataforma de Inteligencia Aumentada**. El núcleo de esta evolución es un sistema de conocimiento sofisticado, diseñado para empoderar a nuestros clientes con información contextual, verificable y relevante, diferenciándonos de manera fundamental en el mercado.

Esta arquitectura aborda la necesidad crítica de las empresas de acceder no solo a su conocimiento interno, sino también a un cuerpo de conocimiento global y curado, garantizando siempre la fiabilidad, la seguridad y la auditabilidad de la información.

## 2. Arquitectura Adoptada: El Modelo de Triple Capa

Se implementará una arquitectura de conocimiento de tres capas, orquestada por un motor de IA que utiliza un proceso de Recuperación y Aumentación Generativa (RAG).

*   **Capa 3: Contexto Privado (El Conocimiento del Cliente)**
    *   **Función**: El silo de conocimiento más cercano, específico y seguro de cada `Compañía Cliente`. Contiene la "salsa secreta" de su operación.
    *   **Seguridad**: Protegido por políticas RLS de Supabase. Es técnicamente imposible el cruce de datos entre clientes.

*   **Capa 2: Biblioteca Global (La Verdad Curada)**
    *   **Función**: Nuestra fuente de verdad centralizada, que contiene leyes, decretos, guías de mejores prácticas y metodologías. Es validada por nuestros propios expertos.
    *   **Propósito**: Ofrecer a todos nuestros clientes una base de conocimiento común, fiable y actualizada.

*   **Capa 1: Internet (El Fallback Abierto)**
    *   **Función**: La red de seguridad final. Se utiliza de forma transparente y como último recurso si las capas internas no poseen la información solicitada.

### 2.1. Dualidad del Conocimiento en la Capa 3

Para evitar cuellos de botella y reflejar la realidad operativa, la Capa 3 se divide en dos tipos de conocimiento con flujos de ingesta distintos:

*   **Conocimiento Normativo Privado (Curado)**: Políticas, reglamentos y manuales internos. Requiere un **flujo de aprobación explícito** por parte de un rol designado (`Cliente Quality Manager`) para garantizar su validez.
*   **Conocimiento Operativo Privado (Dinámico)**: El pulso diario del negocio (estado de pedidos, tickets, tareas). Se ingesta de **forma automática y sin fricción** como reflejo de las operaciones de la plataforma.

## 3. Gobernanza y Flujo de Curación

La confianza es la piedra angular de esta arquitectura. Se implementará un sistema de gobernanza robusto.

*   **Dashboards de Aprobación**: Se crearán interfaces específicas donde los responsables pueden revisar, comentar y aprobar o rechazar nuevo conocimiento normativo antes de su integración.
*   **Roles de Autorización**:
    *   `Euphorianet Quality Manager`: Rol interno para aprobar contenido en la **Biblioteca Global (Capa 2)**.
    *   `Cliente Quality Manager`: Rol asignable a `Usuarios` de la `Compañía Cliente` para aprobar contenido en su **Conocimiento Normativo Privado (Capa 3)**.

## 4. Pila Tecnológica y Decisiones Clave

### 4.1. Base de Datos Vectorial

*   **Decisión**: Iniciar con **`pgvector`** en Supabase.
*   **Razón**: Máxima simplicidad y velocidad de desarrollo para el MVP. La integración nativa con Supabase y las políticas RLS simplifica enormemente la arquitectura inicial.
*   **Plan de Escalado Futuro**: Se mantiene `qdrant` como una opción viable para una futura optimización de rendimiento si la escala lo requiere.

### 4.2. Repositorio de Fuentes Originales y Auditabilidad

*   **Decisión**: Utilizar **`Supabase Storage`**.
*   **Razón**: `Supabase Storage` es una capa de abstracción sobre S3 que simplifica drásticamente la gestión de permisos al integrarse nativamente con la autenticación y las políticas de Supabase. Ofrece la robustez de S3 con una menor complejidad de desarrollo.
*   **Implementación de Auditabilidad**: Cada fragmento de conocimiento normativo vectorizado almacenará en sus metadatos un enlace directo a su documento fuente (PDF, Docx) en Supabase Storage, permitiendo la verificación con un solo clic.

### 4.3. Patrón de Abstracción para Flexibilidad Futura

Para evitar la dependencia tecnológica (`vendor lock-in`), se implementará un **Patrón de Abstracción** para el servicio de almacenamiento. Se creará un módulo intermediario (`storageService.ts`) con una interfaz genérica. Esto permitirá cambiar el proveedor de almacenamiento subyacente (de Supabase Storage a un bucket de S3 gestionado directamente, por ejemplo) en el futuro, modificando únicamente este módulo, sin impactar el resto de la aplicación.

## 5. Diagrama Conceptual de la Arquitectura

![Arquitectura de Triple Capa de Conocimiento](https://mermaid.ink/svg/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBzdWJncmFwaCBcIkNhcGFzIGRlIENvbm9jaW1pZW50byB5IE9yw61nZW5lc1wiXG4gICAgICAgIEMxW1wiQ2FwYSAxOiBJbnRlcm5ldFwiXVxuICAgICAgICBDMltcIkNhcGEgMjogQmlibGlvdGVjYSBHbG9iYWwgKHBndmVjdG9yKVwiXVxuICAgICAgICBDM19Ob3JtW1wiQ2FwYSAzOiBDb25vY2ltaWVudG8gTm9ybWF0aXZvIFByaXZhZG8gKHBndmVjdG9yKVwiXVxuICAgICAgICBDM19PcFtcIkNhcGEgMzogQ29ub2NpbWllbnRvIE9wZXJhdGl2byBQcml2YWRvIChwZ3ZlY3RvcilcIl1cbiAgICAgICAgU3RvcmFnZVtcIlJlcG9zaXRvcmkvIGRlIEZ1ZW50ZXNcXG4oU3VwYWJhc2UgU3RvcmFnZSAtIFBERnMsIERvY3MpXCJdXG4gICAgZW5kXG5cbiAgICBzdWJncmFwaCBcIkZsdWpvIGRlIEN1cmFjacOzbiBOb3JtYXRpdm9cIlxuICAgICAgICBBcHByb3ZhbEdbXCJEYXNoYm9hcmQgQXBvc_Rlc2lvbiBHbG9iYWxcIl0gLS0tQXBydWViYS0tLT4gQzJcbiAgICAgICAgQXBwcm92YWxQW1wiRGFzaGJvYXJkIEFwcm9iYWNpw7NuIFByaXZhZG9cIl0gLS0tQXBydWViYS0tLT4gQzNfTm9ybVxuICAgICAgICBFeHBlcnRbXCJFdXBocmlhbmV0IFF1YWxpdHkgTWFuYWdlclwiXSAtLS1Vc2EtLT4gQXBwcm92YWxHXG4gICAgICAgIE1hbmFnZXJbXCJDbGllbnRlIFF1YWxpdHkgTWFuYWdlclwiXSAtLS1Vc2EtLT4gQXBwcm92YWxQXG4gICAgICAgIFxuICAgICAgICBDMiAtLS1SZWZlcmVuY2lhIGEtLT4gU3RvcmFnZVxuICAgICAgICBDM19Ob3JtIC0tLVJlZmVyZW5jaWEgYS0tPiBTdG9yYWdlXG4gICAgZW5kXG4gICAgXG4gICAgc3ViZ3JhcGggXCJGbHVqbyBkZSBJbmdlc3RhIE9wZXJhdGl2b1wiXG4gICAgICAgIEFwcE9wc1tcIk9wZXJhY2lvbmVzIGRlIGxhIEFwcFxcbihDYW1iaW8gZGUgRXN0YWRvLCBldGMuKVwiXVxuICAgICAgICBBcHBPcHMgLS0tSW5nZXN0YSBBdXRvbcOhdGljYSB5IERpcmVjdGEtLT4gQzNfT3BcbiAgICBlbmRcblxuICAgIHN1YmdyYXBoIFwiT3JxdWVzdGFkb3IgZGUgQ29uc3VsdGFzXCJcbiAgICAgICAgT3JjaGVzdHJhdG9yW1wiT3JxdWVzdGFkb3IgUkFHXCJdXG4gICAgICAgIEZpbmFsVXNlcltcIlN1YXJpbyBGaW5hbFwiXTtcbiAgICAgICAgRmluYWxVc2VyIC0tLT4gT3JjaGVzdHJhdG9yXG4gICAgICAgIE9yY2hlc3RyYXRvciAtLS0xLiBCdXNjYSBlbi0tPiBDM19Ob3JtXG4gICAgICAgIE9yY2hlc3RyYXRvciAtLS0yLiBCdXNjYSBlbi0tPiBDM19PcFxuICAgICAgICBPcmNoZXN0cmF0b3IgLS0tMy4gQnVzY2EgZW4tLT4gQzJcbiAgICAgICAgT3JjaGVzdHJhdG9yIC0tLTQuIEJ1c2NhIGVuLS0-IEMxXG4gICAgICAgIE9yY2hlc3RyYXRvciAtLT4gRmluYWxVc2VyXG4gICAgZW5kXG4gICAgXG4gICAgc3R5bGUgQzIgZmlsbDojY2NlNWZmLHN0cm9rZTojMDA3YmZmXG4gICAgc3R5bGUgQzNfTm9ybSBmaWxsOiNkNGVkZGEsc3Ryb2tlOiMxNTU3MjRcbiAgICBzdHlsZSBDM19PcCBmaWxsOiNkMWVjZjEsc3Ryb2tlOiMwYzU0NjBcbiAgICBzdHlsZSBTdG9yYWdlIGZpbGw6I2ZmZThkMyxzdHJva2U6I2NiOTk3ZVxuPC9zb3VyY2U-PC9wcmUtY29kZSIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2UsImpzb25TdHJpbmciOiJ7XCJ0aGVtZVwiOlwiZGVmYXVsdFwifSJ9) 