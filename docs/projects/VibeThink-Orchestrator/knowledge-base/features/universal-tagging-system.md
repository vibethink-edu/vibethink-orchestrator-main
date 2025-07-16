# Sistema Universal de Etiquetas

## ¿Qué es el Sistema Universal de Etiquetas?

El **Sistema Universal de Etiquetas** es una funcionalidad que permite a los usuarios organizar y categorizar cualquier entidad en la plataforma (clientes, tickets, documentos, etc.) mediante etiquetas personalizables, sin estar limitados por estructuras rígidas de base de datos.

## ¿Por qué es importante esta funcionalidad?

### Problema que resuelve:
- **Flexibilidad limitada:** Los sistemas tradicionales tienen campos predefinidos que no se adaptan a las necesidades específicas de cada empresa
- **Organización rígida:** Los usuarios no pueden agrupar información de la forma que les resulta más natural
- **Búsqueda limitada:** Difícil encontrar entidades relacionadas por criterios personalizados

### Solución que ofrece:
- **Agrupación dinámica:** Los usuarios crean etiquetas según sus necesidades específicas
- **Organización intuitiva:** Cada empresa puede organizar su información de forma única
- **Búsqueda poderosa:** Encontrar entidades por múltiples criterios de etiquetas
- **Escalabilidad:** Funciona con miles de etiquetas sin degradar el rendimiento

## ¿En qué módulos está implementado?

### CRM
- **Contacts** (clientes directos)
- **People** (terceros/consultores)
- **Deals** (oportunidades de venta)
- **Interactions** (interacciones con clientes)
- **PQRS Requests** (peticiones, quejas, reclamos)

### Help Desk
- **Support Tickets** (tickets de soporte)
- **Support Conversations** (conversaciones de soporte)

### Operational Repositories
- **Prompt Templates** (plantillas de prompts)
- **Naming Conventions** (convenciones de nomenclatura)
- **Folder Structures** (estructuras de carpetas)

### Otros Módulos
- **Meetings** (reuniones)
- **Resources** (recursos escaneados)
- **Content Items** (contenido)
- **Tasks** (tareas)

## ¿Cómo funciona técnicamente?

### Arquitectura de Base de Datos
```sql
-- Categorías de etiquetas (organización por módulo)
tag_categories (id, company_id, name, module, color, icon, ...)

-- Etiquetas disponibles
tags (id, company_id, category_id, name, color, usage_count, ...)

-- Relación entidad-etiqueta
entity_tags (id, company_id, tag_id, entity_type, entity_id, ...)
```

### Características Técnicas
- **Multi-tenant:** Aislamiento completo por compañía
- **Performance:** Índices optimizados para búsquedas rápidas
- **Seguridad:** Row Level Security (RLS) en todas las tablas
- **Escalabilidad:** Funciones SQL para operaciones complejas

## ¿Cómo se usa en la práctica?

### Crear Etiquetas
1. Los usuarios pueden crear etiquetas desde cualquier módulo
2. Las etiquetas se organizan por categorías (ej: "Estado del Cliente", "Industria")
3. Cada etiqueta tiene un color personalizable para identificación visual

### Etiquetar Entidades
1. En cualquier entidad (cliente, ticket, etc.), hacer clic en el botón de etiquetas
2. Seleccionar etiquetas existentes o crear nuevas
3. Las etiquetas se aplican instantáneamente

### Buscar por Etiquetas
1. Usar filtros avanzados para buscar entidades por múltiples etiquetas
2. Combinar etiquetas para encontrar coincidencias específicas
3. Ver estadísticas de uso de etiquetas

## ¿Qué beneficios ofrece a los usuarios?

### Para Equipos de Ventas
- Etiquetar clientes por industria, tamaño, estado del pipeline
- Agrupar oportunidades por probabilidad, valor, región
- Seguimiento de interacciones por tipo y resultado

### Para Equipos de Soporte
- Categorizar tickets por tipo de problema, prioridad, producto
- Etiquetar conversaciones por tema, resolución, satisfacción
- Organizar casos por cliente, complejidad, tiempo de resolución

### Para Operaciones
- Etiquetar templates por departamento, uso, efectividad
- Organizar recursos por tema, fuente, calidad
- Categorizar tareas por proyecto, responsable, deadline

## ¿Cómo se integra con la IA?

### Sugerencias Inteligentes
- El sistema sugiere etiquetas basadas en el contexto
- Aprende de los patrones de uso de la empresa
- Recomienda etiquetas populares para entidades similares

### Analytics Avanzados
- Análisis de patrones de etiquetado
- Identificación de etiquetas más efectivas
- Insights sobre organización de información

## ¿Es escalable?

### Sí, el sistema está diseñado para escalar:
- **Base de datos:** Índices optimizados para miles de etiquetas
- **UI:** Componentes que manejan grandes cantidades de datos
- **Performance:** Consultas eficientes con paginación
- **Memoria:** Carga lazy de etiquetas según necesidad

## ¿Cómo se mantiene la consistencia?

### Estándares de Uso
- **Categorías predefinidas:** Etiquetas del sistema para casos comunes
- **Convenciones de nomenclatura:** Guías para nombrar etiquetas
- **Colores consistentes:** Paleta de colores para categorías
- **Documentación:** Guías de uso por módulo

### Gobernanza
- **Permisos:** Control sobre quién puede crear etiquetas
- **Auditoría:** Log de cambios en etiquetas
- **Backup:** Preservación de relaciones etiqueta-entidad

## ¿Cuál es la hoja de ruta futura?

### Próximas Funcionalidades
- **IA Avanzada:** Sugerencias automáticas basadas en contenido
- **Workflows:** Automatización basada en etiquetas
- **Integración:** Conectores con sistemas externos
- **Mobile:** Soporte completo en dispositivos móviles

### Mejoras Técnicas
- **Caché inteligente:** Optimización de consultas frecuentes
- **Búsqueda semántica:** Búsqueda por significado, no solo texto
- **Analytics en tiempo real:** Métricas instantáneas de uso

## Conclusión

El Sistema Universal de Etiquetas es una **característica diferenciadora** que empodera a los usuarios para organizar su información de forma natural y flexible. No solo mejora la productividad, sino que también proporciona insights valiosos sobre cómo las empresas utilizan y organizan su información.

---

**Categoría:** `Core Features`  
**Audiencia:** `USER`, `ADMIN`, `INTERNAL_DEV`  
**Etiquetas:** `tagging-system`, `organization`, `flexibility`, `search`, `analytics` 