# ADR-010: Adopción de un Gestor de Secretos Centralizado

**Fecha:** 2024-06-20

**Estado:** **APROBADO**

**Relacionado con**: `docs/SYSTEM_ARCHITECTURE_OVERVIEW.md`, `docs/ADR-008-Dedicated-IAM-Adoption.md`

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---


## 1. Contexto

Una arquitectura de microservicios y componentes distribuidos como la nuestra genera una gran cantidad de "secretos": claves de API, contraseñas de bases de datos, tokens de servicio, certificados TLS, etc. Gestionar estos secretos a través de archivos de entorno (`.env`) o mecanismos de bajo nivel (como Supabase Vault) es inseguro, propenso a errores y no escala.

Se requiere una solución robusta y centralizada para la gestión, el almacenamiento seguro, la distribución y la auditoría de todos los secretos de la plataforma.

## 2. Decisión Estratégica

1.  **Adoptar un Gestor de Secretos Dedicado:** Se ha tomado la decisión estratégica de adoptar una plataforma dedicada de Gestión de Secretos como la **fuente única de verdad** para todas las credenciales y configuraciones sensibles.

2.  **Selección de Infisical:** Se ha seleccionado **Infisical ([infisical.com](https://infisical.com/))** como nuestra plataforma oficial de Gestión de Secretos.
    *   **Razón:** Infisical representa el punto ideal entre la potencia de nivel empresarial de herramientas como HashiCorp Vault y la simplicidad y experiencia de desarrollador de una herramienta moderna. Su alineación filosófica con nuestro stack es perfecta, y su modelo de auto-alojamiento gratuito cubre todas nuestras necesidades funcionales.

3.  **Arquitectura de Integración:**
    *   Infisical se desplegará como un servicio contenedorizado más dentro de nuestra infraestructura, tanto en la Fase 1 (Docker Compose) como en la Fase 2 (Kubernetes), gestionado por OpenTofu.
    *   Todos los demás servicios (Kestra, FusionAuth, nuestro backend, etc.) serán configurados para obtener sus secretos de Infisical en el momento del arranque, en lugar de leerlos de archivos de entorno locales.
    *   Infisical se integrará con nuestro IAM (FusionAuth) para la autorización de acceso a los secretos.

## 3. Separación de Responsabilidades: FusionAuth vs. Infisical

Es crucial definir los roles de nuestras dos plataformas de seguridad principales:

*   **FusionAuth (Gestión de Identidad):** Responde a la pregunta **"¿Quién eres y a qué tienes permiso de acceder?"**. Gestiona la identidad de usuarios y máquinas y sus roles.
*   **Infisical (Gestión de Secretos):** Responde a la pregunta **"Ya que sé quién eres y tienes permiso, aquí están las credenciales (llaves) que necesitas para hacer tu trabajo."**

Un servicio primero se autentica en FusionAuth para obtener una identidad válida, y luego presenta esa identidad a Infisical para solicitar las credenciales que necesita.

## 4. Consecuencias y Beneficios

*   **Postura de Seguridad Fortalecida:** Centralizar los secretos elimina las malas prácticas (como secretos en el código o en archivos `.env`), facilita la rotación de credenciales y proporciona una auditoría completa de quién accedió a qué y cuándo.
*   **Simplificación Operativa:** La gestión de la configuración para todos los entornos (desarrollo, staging, producción) se simplifica masivamente. Cambiar una clave de API se hace en un solo lugar.
*   **Agilidad del Desarrollador:** Los desarrolladores pueden obtener los secretos para su entorno local de forma segura a través de la CLI de Infisical, sin necesidad de tener acceso directo a las credenciales de producción.
*   **Preparados para el Futuro:** Infisical nos proporciona capacidades avanzadas como la generación de secretos dinámicos y la gestión de PKI, que podremos aprovechar a medida que la plataforma madure. 