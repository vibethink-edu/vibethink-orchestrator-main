# Guía de Desarrollo: Construyendo sobre el AI Pair OS

---

## 📋 AVISO DE CONFIDENCIALIDAD

**PROPIEDAD DE EUPHORIANET**  
**© 2025 Euphorianet. Todos los derechos reservados.**

**Autor:** Marcelo Escallón, CEO de Euphorianet  
**Fecha:** 22 de junio de 2025  
**Sesión:** Consolidación de Arquitectura AI Pair OS  

**CONFIDENCIAL** - Este documento contiene información propietaria y estratégica de Euphorianet. Su distribución, reproducción o uso sin autorización expresa está prohibida. Este documento forma parte del Sistema de Conocimiento de Producto de Euphorianet y está protegido por derechos de autor.

---

**Versión:** 1.0
**Fecha:** 2025-06-22

## 1. Filosofía Central: El Sistema Operativo y las Aplicaciones

Nuestra plataforma no es un monolito. Es un ecosistema compuesto por dos capas principales:

1.  **El Núcleo (AI Pair OS):** Es el motor de datos universal, implementado como un CRM Schema-First. Su propósito es ser un "lienzo en blanco" que permite a los usuarios modelar cualquier entidad de negocio. Es la única parte del sistema que implementa la complejidad del patrón `Objects/Attributes/Records`.
2.  **Las Aplicaciones Nativas:** Son los módulos con propósito específico que se ejecutan "sobre" el núcleo (Helpdesk, PQRS, Tareas, Workflows, etc.). Estas aplicaciones NO son Schema-First, son **Schema-Aware** y **Schema-Extensible**.

El principio de oro es: **Construimos aplicaciones estables y predecibles, y las hacemos potentes permitiéndoles leer y extender el esquema flexible del núcleo.**

---

## 2. Guía Práctica: Cómo Construir una Nueva "Aplicación Nativa" (Ej: Helpdesk)

Sigue estos pasos para crear un nuevo módulo que se integre perfectamente en el ecosistema.

### Paso 1: Definir el "Objeto Estándar" en una Migración

Crea una nueva migración de Supabase para definir la estructura base de tu aplicación.

```sql
-- migrations/XXXXXXXX_create_helpdesk_module.sql

-- 1. Definir el Objeto Estándar
INSERT INTO objects (name, slug, type)
VALUES ('Helpdesk Ticket', 'helpdesk_tickets', 'standard')
RETURNING id INTO @object_id;

-- 2. Definir los Atributos de Sistema (esenciales y no modificables)
INSERT INTO attributes (object_id, name, type, constraints, source)
VALUES
  (@object_id, 'Subject', 'text', '{"required": true}', 'system'),
  (@object_id, 'Status', 'select', '{"options": ["Open", "In Progress", "Resolved"]}', 'system'),
  -- ...otros atributos fijos...
  -- 3. Definir la RELACIÓN CLAVE con el núcleo
  (@object_id, 'Requester', 'relation', '{"object_slug": "people"}', 'system');
```

### Paso 2: Construir la Interfaz de Usuario de la Aplicación

Crea los componentes de React para tu aplicación. La estructura debe separar la lógica fija de la dinámica.

```jsx
// src/pages/helpdesk/TicketPage.tsx

import { CustomAttributesPanel } from '@/components/core/CustomAttributesPanel';

function TicketPage({ ticketId }) {
  // Lógica para obtener los datos FIJOS del ticket
  const { data: ticket } = useTicketData(ticketId);

  return (
    <div>
      {/* Renderiza los componentes FIJOS de tu aplicación */}
      <h1>{ticket.subject}</h1>
      <StatusSelector value={ticket.status} />

      {/* Aquí inyectas la extensibilidad */}
      <CustomAttributesPanel
        objectSlug="helpdesk_tickets"
        recordId={ticketId}
      />
      
      {/* Más componentes fijos */}
      <ActivityTimeline recordId={ticketId} />
    </div>
  );
}
```

### Paso 3: Integrar el Asistente de IA Contextual

El Asistente de IA debe ser un componente omnipresente. Para hacerlo contextualmente consciente, debes alimentarlo con la información de la vista actual.

```jsx
// src/pages/helpdesk/TicketPage.tsx

import { AICompanionPanel } from '@/components/ai/AICompanionPanel';

function TicketPage({ ticketId }) {
  const { data: ticket } = useTicketData(ticketId);

  // Define el contexto para la IA
  const aiContext = {
    view: 'record_detail',
    object: 'helpdesk_tickets',
    recordId: ticketId,
    data: ticket
  };

  return (
    <Layout>
      <MainContent>
        {/* ...contenido del ticket... */}
      </MainContent>
      <ContextualPanel>
        {/* El Asistente IA recibe todo el contexto */}
        <AICompanionPanel context={aiContext} />
      </ContextualPanel>
    </Layout>
  );
}
```

---

## 3. Patrones de Desarrollo Clave

*   **Abstracción de Datos:** Nunca escribas SQL complejo en el frontend. Crea RPCs (Funciones) en PostgreSQL para abstraer la complejidad de las consultas al modelo EAV.
*   **Componentes Reutilizables:** Aprovecha los componentes del core como `CustomAttributesPanel` y `AttributeRenderer`. No reinventes la rueda.
*   **Virtualización:** Para cualquier vista de lista (`DataTable`), es OBLIGATORIO usar `TanStack Virtual` para garantizar el rendimiento, ya que no puedes predecir el número de filas o columnas personalizadas.
*   **Validación con Zod:** Utiliza Zod para generar esquemas de validación dinámicos a partir de las `validation_rules` definidas en los atributos, garantizando la integridad de los datos.

Siguiendo esta guía, asegurarás que tu módulo no solo funcione de manera eficiente, sino que también se integre de forma nativa y potente en el ecosistema unificado de la plataforma. 