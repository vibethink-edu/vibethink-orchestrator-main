# ADR-009: Selección del Proveedor de Servicios de Email Transaccional

**Fecha:** 2024-06-20

**Estado:** **APROBADO**

**Relacionado con**: `docs/SYSTEM_ARCHITECTURE_OVERVIEW.md`

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

Nuestra plataforma requiere un sistema para enviar emails transaccionales programáticos a los usuarios (ej. notificaciones, alertas, reportes, invitaciones). Construir y mantener una infraestructura de envío de email propia (servidores SMTP, gestión de reputación de IP, etc.) es una tarea altamente especializada, costosa y ajena a nuestro negocio principal.

Por lo tanto, se requiere la selección de un Proveedor de Servicios de Email (ESP) externo que actúe como un componente "conectable" dentro de nuestra arquitectura.

## 2. Decisión Estratégica

1.  **Adoptar un ESP Externo:** Se ha decidido no construir una solución de envío de email propia y, en su lugar, integrar un servicio de terceros a través de su API.

2.  **Selección de Resend:** Se ha seleccionado **Resend ([resend.com](https://resend.com/))** como nuestro proveedor oficial de servicios de email transaccional.

3.  **Arquitectura de Integración:** Resend no será un componente central, sino un **servicio de acción invocado por nuestro orquestador, Kestra.**
    *   Los flujos de trabajo en Kestra que requieran enviar un email contendrán una tarea que realiza una llamada a la API de Resend.
    *   Las plantillas de email se desarrollarán utilizando **React Email**, aprovechando la sinergia con nuestro stack de frontend.
    *   Los eventos de entrega (aperturas, clics, rebotes) se procesarán a través de webhooks de Resend, que pueden a su vez disparar otros flujos de Kestra para actualizar el CDP.

## 3. Razón Fundamental

La elección de Resend se basa en su alineación superior con nuestros principios arquitectónicos:

*   **Alineación con la Experiencia del Desarrollador:** La integración nativa con **React Email** nos permite construir y mantener plantillas de email de alta calidad como componentes de React, lo que es una mejora masiva sobre los sistemas de plantillas tradicionales.
*   **Modelo de Negocio SaaS-Friendly:** Su estructura de precios y límites (especialmente en la gestión de dominios por plan) está diseñada para un modelo de negocio multi-tenant como el nuestro, permitiéndonos escalar nuestra oferta en paralelo a nuestro crecimiento.
*   **Estrategia de Crecimiento por Fases:** El generoso plan gratuito nos permite lanzar el producto con funcionalidades de email completas sin costo inicial, mientras que los planes de pago ofrecen una ruta de escalabilidad clara y predecible.
*   **Filosofía Moderna:** Resend es una herramienta API-first, moderna y enfocada, que encaja perfectamente en nuestro ecosistema de componentes de clase mundial.

## 4. Consecuencias e Implicaciones

*   **Integración en Kestra:** Se deberá desarrollar un "plugin" o una tarea reutilizable para Kestra que encapsule la lógica de la llamada a la API de Resend.
*   **Gestión de Credenciales:** Las claves de API de Resend se almacenarán de forma segura en nuestro gestor de secretos (ej. Supabase Vault, HashiCorp Vault) y serán accedidas por Kestra en tiempo de ejecución.
*   **Modelo de Precios:** Los costos de Resend se convertirán en un costo de bienes vendidos (COGS) que debe ser modelado en nuestros propios planes de precios para los clientes.
*   **Configuración de Dominios:** La plataforma deberá incluir una interfaz para que los administradores de cada compañía puedan configurar y verificar sus dominios de envío de email (configurando registros DKIM, SPF, etc.). 