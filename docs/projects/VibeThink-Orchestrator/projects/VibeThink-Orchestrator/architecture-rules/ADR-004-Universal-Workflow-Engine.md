# ADR-004: Motor Universal de Workflows

## Estado
**Aceptado** - 2025-01-22

## Contexto

El sistema necesita manejar múltiples tipos de procesos de negocio:
- **Ecommerce**: Pedidos, envíos, devoluciones
- **CRM**: Oportunidades, leads, casos
- **PQRS**: Casos de soporte, reclamaciones
- **Logística**: Tracking, almacenamiento, distribución
- **Aprobaciones**: Workflows de autorización

Cada proceso tiene:
- Estados y transiciones
- Tiempos y SLA
- Roles y permisos
- Notificaciones y escalaciones
- Integraciones con sistemas externos

## Decisiones Evaluadas

### Opción 1: Workflows Específicos por Dominio
- Un motor diferente para cada tipo de proceso
- **Pros**: UX específica, optimización por dominio
- **Contras**: Duplicación de código, mantenimiento complejo, inconsistencias

### Opción 2: Motor Universal con Plantillas
- Un solo motor que maneja todos los tipos de procesos
- Plantillas y configuraciones por dominio
- **Pros**: Reutilización, consistencia, escalabilidad
- **Contras**: Complejidad inicial, necesidad de abstracción

### Opción 3: Híbrido (Motor + Extensiones)
- Motor universal base
- Extensiones plug-in para lógica específica
- **Pros**: Flexibilidad, extensibilidad, mantenibilidad
- **Contras**: Complejidad de arquitectura

## Decisión

**Opción 3: Motor Universal con Extensiones Plug-in**

### Justificación

1. **Inspiración en Líderes del Mercado**
   - Amazon: Step Functions para todos los procesos
   - Salesforce: Flow universal con extensibilidad
   - HubSpot: Workflows con triggers y acciones
   - Zoho: Blueprint para cualquier proceso

2. **Patrón Event-Driven Architecture**
   - Todo proceso es una secuencia de eventos
   - Estados y transiciones configurables
   - Orquestación centralizada

3. **Escalabilidad y Mantenimiento**
   - Un solo motor para mantener
   - Extensiones para lógica específica
   - Plantillas reutilizables

## Consecuencias

### Positivas
- ✅ Consistencia en auditoría y monitoreo
- ✅ Reutilización de componentes
- ✅ Extensibilidad sin modificar el core
- ✅ Escalabilidad horizontal
- ✅ Observabilidad unificada

### Negativas
- ❌ Complejidad inicial mayor
- ❌ Curva de aprendizaje para desarrolladores
- ❌ Necesidad de abstracción cuidadosa

## Implementación

### Arquitectura del Motor

```typescript
interface UniversalWorkflow {
  id: string;
  name: string;
  entityType: 'shipment' | 'case' | 'opportunity' | 'order';
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  actions: WorkflowAction[];
  sla: WorkflowSLA[];
  plugins?: string[];
}
```

### Tipos de Pasos Soportados
1. **Manual**: Intervención humana
2. **Automated**: Proceso automático
3. **AI Enhanced**: Con inteligencia artificial
4. **Approval**: Requiere aprobación
5. **Notification**: Envío de notificaciones
6. **Integration**: Conexión con sistemas externos

### Sistema de Extensiones
- **Plug-ins**: Lógica específica por dominio
- **Hooks**: Puntos de extensión en el workflow
- **Templates**: Plantillas predefinidas por tipo

## Referencias

- [AWS Step Functions](https://aws.amazon.com/step-functions/)
- [Salesforce Flow](https://help.salesforce.com/s/articleView?id=sf.flow_overview.htm)
- [HubSpot Workflows](https://knowledge.hubspot.com/workflows)
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)

## Revisión

**Próxima revisión**: 2025-04-22 (3 meses)
**Responsable**: Equipo de Arquitectura 