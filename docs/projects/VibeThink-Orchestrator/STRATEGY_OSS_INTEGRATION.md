# Estrategia de Integración, Licenciamiento y Gestión de Componentes Open Source

**Fecha**: 2024-06-20

**Estado**: Adoptado

## 1. Principios Fundamentales

Este documento establece la estrategia oficial para integrar componentes de software de código abierto (Open Source Software - OSS) dentro de la plataforma AI Pair Orchestrator Pro.

1.  **Modelo de Negocio SaaS 100% Cerrado**: Nuestra plataforma se ofrece como un Software como Servicio (SaaS). **No distribuimos binarios, instaladores o el código fuente de nuestra plataforma a los clientes**. Los clientes acceden a la plataforma a través de la web. Este es el pilar de nuestra estrategia de licenciamiento.
2.  **Valor en la Integración, No en el Software OSS**: Nuestro modelo de negocio no consiste en revender software open source. El valor que ofrecemos y por el que cobramos a nuestros clientes es la **integración profunda, la unificación de datos, la automatización, la seguridad, el mantenimiento y el soporte** de estos componentes dentro de un ecosistema coherente y de valor añadido.

## 2. Análisis de Licenciamiento y Componentes Aprobados

Se ha realizado un análisis de los componentes OSS clave y su viabilidad para ser integrados en nuestra plataforma SaaS cerrada.

| Componente | Proyecto Base | Licencia | Implicaciones para nuestro SaaS | Decisión |
| :--- | :--- | :--- | :--- | :--- |
| **Núcleo CDP** | Tracardi | `MIT` | Permisiva. Permite el uso comercial, modificación y uso en SaaS cerrado sin restricciones. | **Aprobado** |
| **Agendamiento** | Cal.com | `AGPL-3.0` | Permite el uso en SaaS. Requiere publicar los cambios si se modifica el núcleo Y se ofrece públicamente como una alternativa a Cal.com. Al usarlo como un módulo integrado y no como un producto independiente, el riesgo es bajo. | **Aprobado** |
| **Formularios** | HeyForm | `GPL-3.0` | Similar a AGPL. Permite el uso en SaaS. Las obligaciones de compartir se activan al distribuir el software, no al usarlo como servicio. | **Aprobado** |
| **Marketing** | Postiz | `AGPL-3.0` | Idéntico a Cal.com. Es seguro para nuestro modelo de negocio SaaS siempre que no distribuyamos el software modificado. | **Aprobado** |

## 3. Estrategia de Gestión de Riesgos y Mantenimiento

Para mitigar los riesgos asociados a la evolución de los proyectos OSS, se implementará la siguiente estrategia:

1.  **Fork Controlado**: Se creará un "fork" (copia) privado en nuestro repositorio de cada componente OSS crítico. Trabajaremos sobre nuestro fork, no directamente sobre el proyecto público.
2.  **Congelamiento de Versiones**: La versión de un componente en nuestro ambiente de producción estará congelada y solo se actualizará de forma planificada.
3.  **Orquestación de Validación Automática (con Kestra)**: Se implementará un flujo de trabajo con **Kestra.io** para automatizar la validación de nuevas versiones. Este flujo:
    -   Monitorizará los repositorios OSS originales.
    -   Al detectar una nueva versión, la desplegará automáticamente en un entorno de staging aislado.
    -   Ejecutará una batería de tests de integración para verificar la compatibilidad con nuestra plataforma.
    -   Generará un reporte de éxito o fallo, notificando al equipo de ingeniería.

## 4. Perfiles de Recursos Humanos Requeridos

La implementación y mantenimiento de esta arquitectura requiere perfiles técnicos con los siguientes conocimientos:

### Perfil 1: Ingeniero de Plataforma / DevOps

-   **Responsabilidades**: Despliegue, escalado, monitorización y seguridad de la infraestructura de los componentes OSS. Gestión de los flujos de Kestra.
-   **Conocimientos Clave**:
    -   Experiencia avanzada en **Docker** y **Kubernetes (k8s)**.
    -   Dominio de proveedores de cloud (AWS, GCP o Azure).
    -   Experiencia con herramientas de Infraestructura como Código (**Terraform**, Ansible).
    -   Experiencia en configuración de CI/CD (GitHub Actions, GitLab CI).
    -   Conocimiento profundo de las tecnologías subyacentes de los componentes (ej. **Elasticsearch/OpenSearch** y **Redis** para Tracardi).

### Perfil 2: Ingeniero de Integración / Backend

-   **Responsabilidades**: Adaptar y extender los componentes OSS para que se integren con nuestra plataforma. Desarrollar los conectores, la lógica de negocio y asegurar el aislamiento de datos (multi-tenancy).
-   **Conocimientos Clave**:
    -   Dominio del stack tecnológico del componente a integrar (ej. **NestJS (Node.js)** y **Prisma** para Postiz y Cal.com; **Python** para Tracardi).
    -   Experiencia demostrable en la implementación de **arquitecturas multi-tenant**.
    -   Sólidos conocimientos en diseño de APIs REST/GraphQL y patrones de integración.
    -   Experiencia en seguridad de aplicaciones, incluyendo autenticación (OAuth, JWT) y autorización. 