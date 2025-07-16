# CRM Layout Blueprint & AI Behavior

Este documento sirve como referencia visual y funcional para las interfaces clave del CRM, con un enfoque especial en el comportamiento del Asistente de IA contextual.

---

## 1. La Vista de Lista (Ej: `Companies`)

Esta es la vista principal para explorar colecciones de registros.

### 1.1. Estructura del Layout

```
+---------------------------------------------------------------------------------+
| <Header (Búsqueda Global, [AI], Notificaciones, Perfil)>                        |
+---------------------------------------------------------------------------------+
| <SidebarNav (Objects, Lists, Reports, Automations, Settings...)>              |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  <MainContent - Título: Companies>                                              |
|  +---------------------------------------------------------------------------+  |
|  | <Filtros (Añadir filtro, Guardar vista)>  [Nueva Compañía +]  [Opciones]  |  |
|  +---------------------------------------------------------------------------+  |
|  |                                                                           |  |
|  | <DataTable (Virtualizada, Columnas Dinámicas, Sorting, Selección...)>     |  |
|  |                                                                           |  |
|  |                                                                           |  |
|  +---------------------------------------------------------------------------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 1.2. Comportamiento del Asistente IA en esta Vista

*   **Invocación:** A través del ícono `[AI]` en el header.
*   **Contexto:** El asistente sabe que el usuario está viendo la lista del `Object` "Companies".
*   **Capacidades Proactivas:**
    *   **Resumir Datos:** "Resume las industrias más comunes en esta lista."
    *   **Sugerir Filtros:** "Muéstrame solo las compañías de 'Colombia' que no han sido contactadas en los últimos 30 días."
    *   **Creación Asistida:** "Ayúdame a crear una nueva vista de esta lista que solo muestre clientes de alto valor."
    *   **Análisis de Segmentos:** "¿Hay alguna correlación entre el tamaño de la empresa y su etapa en el pipeline?"

---

## 2. La Vista de Detalle de Registro (Ej: un `Deal`)

Esta vista muestra toda la información de un único registro.

### 2.1. Estructura del Layout

```
+---------------------------------------------------------------------------------+
| <Header (Búsqueda Global, [AI], Notificaciones, Perfil)>                        |
+---------------------------------------------------------------------------------+
| <SidebarNav>                                                                    |
+------------------------------------------+--------------------------------------+
|                                          |                                      |
|  <MainContent - Título: Deal Name>       | <ContextualPanel - AI Companion>     |
|  +------------------------------------+  | +----------------------------------+ |
|  | <Pestañas (Overview, Activity...)> |  | | **AI Insights:**                 | |
|  +------------------------------------+  | | - Resumen del trato.             | |
|  |                                    |  | | - Sentimiento de emails.         | |
|  | <Panel de Atributos Principales>   |  | | - Riesgos detectados.            | |
|  | - Stage: [Negotiation]             |  | |                                  | |
|  | - Value: [$50,000]                 |  | +----------------------------------+ |
|  | - Contacto: [Relación -> Persona]  |  | | **Acciones Sugeridas:**          | |
|  | ...                                |  | | > Enviar email de seguimiento    | |
|  +------------------------------------+  | | > Agendar próxima reunión        | |
|  | <Timeline de Actividad>            |  | | > Actualizar probabilidad al 80% | |
|  | - Email enviado (hace 2 días)      |  | |                                  | |
|  | - Nota añadida (hace 1 día)        |  | +----------------------------------+ |
|  |                                    |  |                                      |
|  +------------------------------------+  |                                      |
|                                          |                                      |
+------------------------------------------+--------------------------------------+
```

### 1.2. Comportamiento del Asistente IA en esta Vista

*   **Invocación:** Siempre presente en el panel contextual derecho.
*   **Contexto:** El asistente conoce el `Record` exacto (`Deal-ID-123`), todos sus `Attributes` y su historial de actividad.
*   **Capacidades Proactivas:**
    *   **Resumen Ejecutivo:** "Dame un resumen de 3 puntos sobre el estado de este trato."
    *   **Redacción Asistida:** "Ayúdame a redactar un email de seguimiento para 'Juan Pérez' mencionando el valor de $50,000."
    *   **Análisis Predictivo:** "¿Cuál es la probabilidad real de cierre este mes basándote en tratos similares?"
    *   **Extracción de Información:** "Busca en la transcripción de la última llamada si se mencionó a algún competidor."

---

## 3. El Editor de Objetos (Admin)

Vista de administración para configurar la estructura de los datos.

### 3.1. Estructura del Layout

```
+---------------------------------------------------------------------------------+
| <Header (Búsqueda Global, [AI], Notificaciones, Perfil)>                        |
+---------------------------------------------------------------------------------+
| <SidebarNav>                                                                    |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  <MainContent - Título: Editando el Objeto "Deals">                             |
|  +---------------------------------------------------------------------------+  |
|  | <Pestañas (Configuration, Appearance, Attributes, Templates...)>          |  |
|  +---------------------------------------------------------------------------+  |
|  |                                                                           |  |
|  | <Lista de Atributos>  [Crear Atributo +]                                  |  |
|  | - Name (Text, Required)                                                   |  |
|  | - Value (Number, Currency)                                                |  |
|  | - Company (Relation -> Companies) [AI: Sugerencia de relación]            |  |
|  |                                                                           |  |
|  +---------------------------------------------------------------------------+  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 1.2. Comportamiento del Asistente IA en esta Vista

*   **Invocación:** Contextual, a través de íconos `[AI]` junto a elementos específicos o en el header.
*   **Contexto:** El asistente sabe que el usuario está en modo "admin", modificando la estructura de la base de datos.
*   **Capacidades Proactivas:**
    *   **Sugerencia de Atributos:** "Los objetos de tipo 'Deal' suelen tener atributos como 'Expected Close Date' (Date) y 'Probability' (Percentage). ¿Quieres añadirlos?"
    *   **Validación de Esquema:** "He notado que no tienes un atributo de relación con el objeto 'Companies'. Conectar 'Deals' con 'Companies' es una práctica recomendada."
    *   **Buenas Prácticas:** Al crear un atributo de texto: "Considera añadir una regla de validación para limitar la longitud máxima."
    *   **Generación de Plantillas:** "Puedo generar una plantilla de creación con los atributos más importantes para que tu equipo empiece a usar este objeto rápidamente." 