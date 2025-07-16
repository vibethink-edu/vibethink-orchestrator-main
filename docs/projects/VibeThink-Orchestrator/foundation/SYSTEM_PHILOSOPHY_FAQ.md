# FAQ: La Arquitectura Unificada "AI Pair OS"

Este documento responde a las preguntas más importantes sobre la arquitectura de nuestra plataforma. Es la fuente de verdad para entender "por qué" construimos las cosas de la manera en que lo hacemos.

---

### **Preguntas sobre la Filosofía General**

#### P: ¿Cuál es la arquitectura principal de la plataforma?
**R:** Usamos un modelo que llamamos "AI Pair OS", compuesto por un **Núcleo de Datos Universal (CRM Schema-First)** y **Aplicaciones Nativas (Helpdesk, Workflows, etc.)** que se ejecutan sobre él. El núcleo es flexible y adaptable, mientras que las aplicaciones son estables, predecibles y especializadas en su propósito, pero heredan la flexibilidad del núcleo.

#### P: ¿Qué significa que una aplicación es "Schema-Aware" y "Schema-Extensible"?
**R:** Significa que la aplicación, aunque tiene una estructura interna fija, es lo suficientemente inteligente para:
1.  **Leer (`Schema-Aware`):** Entender la estructura de datos personalizada que un usuario ha creado en el núcleo (ej. saber qué atributos tiene un "Deal").
2.  **Extenderse (`Schema-Extensible`):** Permitir al usuario añadir campos y datos personalizados a sus propios registros (ej. añadir un campo "Nivel de Criticidad" a un Ticket de Soporte).

#### P: ¿Cómo se integra el Asistente de IA en este modelo?
**R:** El Asistente de IA no es una "aplicación" más, sino una **capa de inteligencia transversal**. Está embebido en cada interfaz y utiliza el contexto de la vista actual del usuario (el `Object` que está viendo, el `Record` que está editando) para ofrecer asistencia proactiva, relevante y personalizada.

---

### **Preguntas sobre el Enfoque Schema-First**

#### P: ¿Por qué usamos un enfoque "Schema-First" para el CRM?
**R:** Porque el propósito de un CRM es modelar el universo de negocio de un cliente, que es único e impredecible. Un enfoque de esquema fijo sería demasiado rígido. Schema-First nos da la flexibilidad necesaria para que la plataforma se adapte al cliente, y no al revés.

#### P: ¿Por qué NO usamos el mismo enfoque para el Helpdesk o PQRS?
**R:** Porque el propósito de un Helpdesk no es la flexibilidad, es la **eficiencia de un proceso**. Los conceptos de "Estado" y "Prioridad" en un ticket son universales y necesarios para la lógica de negocio. Forzar un modelo 100% flexible aquí sería contraproducente. En su lugar, construimos una aplicación de proceso estable y la hacemos *extensible* con campos personalizados.

#### P: ¿Cómo se maneja el rendimiento con una base de datos tan flexible?
**R:** Mitigamos los riesgos de rendimiento con tres estrategias clave:
1.  **Abstracción en la Base de Datos:** Usamos Vistas y Funciones (RPCs) de PostgreSQL para que las consultas complejas se ejecuten de forma optimizada en el servidor.
2.  **Indexación Inteligente:** Aplicamos índices GIN sobre las columnas JSONB, lo que acelera masivamente la búsqueda de datos dinámicos.
3.  **Virtualización en el Frontend:** Todas las listas y tablas usan virtualización de filas y columnas para manejar grandes volúmenes de datos sin degradar la experiencia de usuario.

---

### **Preguntas para Desarrolladores**

#### P: ¿Tengo que escribir SQL complejo para consultar los datos del CRM?
**R:** No. El frontend nunca debe construir consultas complejas. Se deben usar los hooks de React (`useCRMObjects`, etc.) que internamente llaman a las RPCs seguras y optimizadas de Supabase. La complejidad del SQL está aislada en la capa de la base de datos.

#### P: ¿Cómo conecto mi nuevo módulo con los datos del CRM?
**R:** A través de los **Atributos de tipo "Relación"**. En la definición de tu `Object` estándar, puedes crear un atributo que apunte a cualquier otro objeto del sistema (ej. un "Ticket" se relaciona con una "Persona"). La plataforma renderizará automáticamente los componentes de UI necesarios para gestionar esa relación.

#### P: ¿Dónde se define la lógica de negocio de un módulo como Helpdesk?
**R:** La lógica de negocio principal y estable (ej. las reglas sobre el cambio de estado de un ticket) se codifica directamente en los componentes y hooks de React de ese módulo. La lógica que depende de los datos personalizados del usuario se maneja a través del sistema de Workflows, que puede leer y reaccionar a los cambios en cualquier atributo, ya sea estándar o personalizado. 