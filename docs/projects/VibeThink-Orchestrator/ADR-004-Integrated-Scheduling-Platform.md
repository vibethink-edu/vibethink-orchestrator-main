# ADR-004: Plataforma Integrada de Agendamiento de Citas

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---

**Fecha**: 2024-06-20

**Estado**: Propuesto

**Relacionado con**: [ADR-002](ADR-002-Advanced-CRM-And-Workflow-Architecture.md), [ADR-003](ADR-003-Advanced-Help-Desk-Architecture.md)

## Contexto

Una funcionalidad crítica para cualquier plataforma de CRM (ADR-002) o Help Desk (ADR-003) moderna es la capacidad de que los usuarios agenden citas de manera eficiente y automatizada (ej. demos de ventas, llamadas de soporte, entrevistas). Esta funcionalidad, popularizada por servicios como Calendly y Cal.com, elimina la fricción de la coordinación manual de horarios.

Se requiere una solución que se integre de forma nativa en nuestra plataforma, en lugar de depender de una herramienta externa, para crear un flujo de trabajo unificado y sin fisuras.

## Decisión

1.  **Integrar una funcionalidad de agendamiento de citas como una característica de primera clase** dentro de la plataforma, disponible para todos los usuarios.

2.  **Adoptar a Cal.com como la base técnica y el modelo de inspiración principal** para nuestro módulo de agendamiento. La decisión se fundamenta en su naturaleza **open source**, su moderna pila tecnológica (React, Next.js, Prisma, Tailwind CSS) y su filosofía API-first, que están perfectamente alineadas con las nuestras.

3.  **La implementación se basará en aprovechar el código open source de Cal.com** para acelerar drásticamente el desarrollo. No construiremos desde cero, sino que adaptaremos e integraremos su núcleo probado dentro de nuestra propia arquitectura y sistema de usuarios.

4.  **El módulo de agendamiento estará profundamente integrado con el motor de flujos de trabajo (`React Flow`)**. Esto permitirá automatizaciones avanzadas que conecten el CRM y el Help Desk con las acciones de agendamiento.

## Razón Fundamental

-   **Velocidad de Desarrollo (Time-to-Market)**: Aprovechar el núcleo open source de Cal.com nos ahorra miles de horas de desarrollo en comparación con construir una solución comparable desde cero. Obtenemos una funcionalidad madura y rica en características de forma casi inmediata.
-   **Experiencia de Usuario Unificada**: Al ser una característica nativa, el agendamiento se sentirá como una parte integral de la plataforma. Los usuarios no necesitarán gestionar una cuenta separada en un servicio de terceros. El branding y la UX serán 100% consistentes.
-   **Ventaja Competitiva Estratégica**: La verdadera innovación no reside en tener agendamiento, sino en cómo se integra con el resto del sistema. La capacidad de disparar y condicionar agendamientos desde nuestros flujos de trabajo del CRM y Help Desk es un diferenciador clave que ofrece un valor inmenso a los usuarios finales.
-   **Alineación Tecnológica y Filosófica**: Cal.com está construido por y para desarrolladores, con un enfoque en la extensibilidad y la integración, lo que lo convierte en el socio técnico ideal para nuestra visión de plataforma.

## Consecuencias e Implicaciones

-   **Planificación de Implementación**: El desarrollo de este módulo se llevará a cabo como una iniciativa paralela o inmediatamente posterior a la implementación del núcleo del CRM (ADR-002), ya que es una funcionalidad transversal que sirve a múltiples áreas de la plataforma.
-   **Impacto en la Infraestructura**: Si decidimos auto-hospedar ciertos componentes de la lógica de Cal.com, se deben considerar los recursos de servidor necesarios.
-   **Modelo de Datos**: Requerirá la adición de tablas relacionadas con el agendamiento en nuestra base de datos (`event_types`, `bookings`, `user_availability`, `credentials`), que deberán estar vinculadas a nuestro sistema de usuarios y departamentos.
-   **Integraciones de Calendario**: Una parte clave del desarrollo será gestionar las conexiones con los calendarios de los usuarios (Google Calendar, Outlook/Office 365) de forma segura, utilizando OAuth y almacenando los tokens de forma encriptada. 