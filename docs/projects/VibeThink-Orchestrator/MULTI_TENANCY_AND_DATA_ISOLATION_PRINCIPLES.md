# Principios de Multi-Tenancy y Aislamiento de Datos

**Fecha:** 2024-06-20

**Estado:** **APROBADO - PRINCIPIO FUNDAMENTAL**

## 1. Declaración del Principio

Esta plataforma opera bajo un **Modelo de Orquestación Centrado en la Empresa**, no en el usuario. Toda la arquitectura, selección de tecnología e implementación debe adherirse a los siguientes principios de multi-tenancy y aislamiento de datos. Este es un principio no negociable.

## 2. Definición del Modelo

1.  **La Empresa como Entidad Central:** El tenant principal de nuestra plataforma es la `Compañía Cliente`. La conexión con servicios externos (Google Workspace, Microsoft 365) es propiedad de la Compañía, no de un usuario individual.
2.  **Aislamiento Criptográfico por Defecto:** Los datos de una compañía deben ser criptográficamente inaccesibles para cualquier otra compañía. No debe existir ninguna circunstancia (excepto para tareas de administración de SUPER_ADMIN) en la que se crucen los datos de los tenants.
3.  **Acceso Basado en Roles y Departamentos (RBAC):** Dentro de una misma compañía, el acceso a los datos se segmenta por departamentos y roles de usuario. Un usuario solo puede ver y actuar sobre los datos para los que tiene permiso explícito.
4.  **Soporte para Usuarios Externos y de Acceso Limitado:** La plataforma debe ser capaz de gestionar identidades de usuarios que no pertenecen a la organización del cliente (ej. clientes finales, ciudadanos), otorgándoles acceso granular y de alcance mínimo, limitado a sus propios datos (ej. un único caso de soporte, una única factura).

## 3. Requisitos Técnicos para Cualquier Componente Futuro

Cualquier nueva herramienta, servicio o componente que se integre en nuestra plataforma **DEBE** cumplir con uno de los siguientes patrones para ser compatible con nuestro modelo de multi-tenancy:

1.  **Soporte Nativo para Aislamiento de Datos:** La herramienta debe proporcionar de forma nativa un mecanismo para separar los datos, recursos y ejecuciones por tenant (ej. la Seguridad a Nivel de Fila de PostgreSQL).
2.  **Operación Agnóstica al Tenant (Stateless):** La herramienta debe operar como un motor sin estado, donde el contexto del tenant (`company_id`, etc.) se le pasa en cada llamada de API o ejecución. La herramienta no debe almacenar datos de tenant de forma persistente. (Ej. Kestra).
3.  **Capacidad de Gestión vía Capa de Abstracción:** Si la herramienta no cumple con los puntos 1 o 2, debemos ser capaces de gestionar múltiples instancias o cuentas de esa herramienta a través de una capa de abstracción en nuestro backend. Nuestra plataforma debe poder almacenar las credenciales por tenant y actuar como un intermediario seguro. (Ej. Gestión de claves de Postiz).

La elección de cualquier tecnología que no cumpla con estos requisitos queda automáticamente vetada. 