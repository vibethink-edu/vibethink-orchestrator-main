# Timeline Component

> **ES:** Este componente sigue los principios de la metodología VThink 1.0. VThink 1.0 es únicamente la metodología, no el nombre del producto ni del sistema.
> 
> **EN:** This component follows the principles of the VThink 1.0 methodology. VThink 1.0 is only the methodology, not the name of the product or system.

## 🎯 **Concepto: Timeline Contextual por Entidad**

El **Timeline** es un componente cross-cutting que muestra todas las interacciones, eventos y actividades relacionadas con una entidad específica, independientemente del módulo de origen.

### **Características Principales**

#### **Contexto Dinámico por Entidad**
```typescript
// ✅ Timeline se adapta al contexto de la entidad
interface TimelineContext {
  entityId: string;
  entityType: 'company' | 'customer' | 'employee' | 'zone' | 'country';
  availableModules: string[]; // Módulos activos en la empresa
  userPermissions: string[];
  companyId: string;
}
```

#### **Agregación Multi-Módulo**
- **e2CRM**: Interacciones, oportunidades, casos
- **e2PQRS**: Peticiones, quejas, reclamos, sugerencias
- **Helpdesk**: Tickets de soporte
- **Workflows**: Estados y transiciones
- **AI Assistant**: Conversaciones y recomendaciones

#### **Filtros Inteligentes**
```typescript
// ✅ Filtros contextuales
const timelineFilters = {
  byModule: ['crm', 'pqrs', 'helpdesk', 'workflow', 'ai'],
  byType: ['interaction', 'case', 'ticket', 'workflow', 'ai-chat'],
  byStatus: ['active', 'resolved', 'pending'],
  byDate: { from: Date, to: Date },
  byPriority: ['low', 'medium', 'high', 'critical']
};
```

### **Arquitectura del Componente**

#### **Estructura de Archivos**
```
src/shared/components/timeline/
├── Timeline.tsx              # Componente principal
├── TimelineItem.tsx          # Item individual del timeline
├── TimelineFilters.tsx       # Filtros y búsqueda
├── TimelineContext.tsx       # Contexto del timeline
├── hooks/
│   ├── useTimeline.ts        # Hook principal
│   ├── useTimelineFilters.ts # Hook de filtros
│   └── useTimelineActions.ts # Hook de acciones
├── types/
│   └── timeline.types.ts     # Tipos del timeline
├── utils/
│   ├── timelineAggregator.ts # Agregación de datos
│   └── timelineFormatter.ts  # Formateo de fechas
└── README.md
```

#### **Integración con Módulos**
```typescript
// ✅ Timeline se integra con todos los módulos
const timelineModules = {
  crm: {
    source: 'e2CRM',
    events: ['interaction', 'opportunity', 'case'],
    icon: 'users',
    color: 'blue'
  },
  pqrs: {
    source: 'e2PQRS', 
    events: ['petition', 'complaint', 'claim', 'suggestion'],
    icon: 'file-text',
    color: 'green'
  },
  helpdesk: {
    source: 'Helpdesk',
    events: ['ticket', 'resolution', 'escalation'],
    icon: 'headphones',
    color: 'orange'
  },
  workflow: {
    source: 'Kestra',
    events: ['workflow_start', 'workflow_complete', 'workflow_error'],
    icon: 'git-branch',
    color: 'purple'
  },
  ai: {
    source: 'UniversalAssistant',
    events: ['chat_start', 'chat_message', 'recommendation'],
    icon: 'bot',
    color: 'indigo'
  }
};
```

### **Implementación del Hook Principal**

```typescript
// ✅ Hook useTimeline - VThink 1.0
export const useTimeline = (entityId: string, entityType: string) => {
  const { user } = useAuth();
  const { company } = useCompany();
  
  // Obtener módulos activos de la empresa
  const { data: activeModules } = useQuery({
    queryKey: ['company-modules', company.id],
    queryFn: () => fetchActiveModules(company.id)
  });

  // Agregar eventos de todos los módulos
  const { data: timelineEvents, isLoading } = useQuery({
    queryKey: ['timeline', entityId, entityType, activeModules],
    queryFn: () => aggregateTimelineEvents(entityId, entityType, activeModules),
    enabled: !!entityId && !!activeModules
  });

  // Filtros dinámicos
  const [filters, setFilters] = useState<TimelineFilters>({
    modules: activeModules || [],
    types: [],
    status: [],
    dateRange: null,
    priority: []
  });

  // Eventos filtrados
  const filteredEvents = useMemo(() => {
    return applyTimelineFilters(timelineEvents, filters);
  }, [timelineEvents, filters]);

  return {
    events: filteredEvents,
    isLoading,
    filters,
    setFilters,
    activeModules,
    refresh: () => queryClient.invalidateQueries(['timeline'])
  };
};
```

### **Componente Principal**

```typescript
// ✅ Timeline Component - VThink 1.0
interface TimelineProps {
  entityId: string;
  entityType: string;
  className?: string;
  showFilters?: boolean;
  maxItems?: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  entityId,
  entityType,
  className,
  showFilters = true,
  maxItems = 50
}) => {
  const {
    events,
    isLoading,
    filters,
    setFilters,
    activeModules
  } = useTimeline(entityId, entityType);

  if (isLoading) {
    return <TimelineSkeleton />;
  }

  return (
    <div className={`timeline-container ${className}`}>
      {showFilters && (
        <TimelineFilters
          filters={filters}
          onFiltersChange={setFilters}
          activeModules={activeModules}
        />
      )}
      
      <div className="timeline-events">
        {events.slice(0, maxItems).map((event) => (
          <TimelineItem
            key={event.id}
            event={event}
            entityType={entityType}
          />
        ))}
      </div>
    </div>
  );
};
```

### **Agregación de Datos**

```typescript
// ✅ Agregador de eventos del timeline
export const aggregateTimelineEvents = async (
  entityId: string,
  entityType: string,
  activeModules: string[]
): Promise<TimelineEvent[]> => {
  const events: TimelineEvent[] = [];

  // Agregar eventos de CRM
  if (activeModules.includes('crm')) {
    const crmEvents = await fetchCRMEvents(entityId, entityType);
    events.push(...crmEvents);
  }

  // Agregar eventos de PQRS
  if (activeModules.includes('pqrs')) {
    const pqrsEvents = await fetchPQRSEvents(entityId, entityType);
    events.push(...pqrsEvents);
  }

  // Agregar eventos de Helpdesk
  if (activeModules.includes('helpdesk')) {
    const helpdeskEvents = await fetchHelpdeskEvents(entityId, entityType);
    events.push(...helpdeskEvents);
  }

  // Agregar eventos de Workflows
  if (activeModules.includes('workflow')) {
    const workflowEvents = await fetchWorkflowEvents(entityId, entityType);
    events.push(...workflowEvents);
  }

  // Agregar eventos de AI Assistant
  if (activeModules.includes('ai')) {
    const aiEvents = await fetchAIEvents(entityId, entityType);
    events.push(...aiEvents);
  }

  // Ordenar por fecha descendente
  return events.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};
```

### **Tipos del Timeline**

```typescript
// ✅ Tipos del timeline - VThink 1.0
export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: TimelineEventType;
  module: string;
  title: string;
  description: string;
  status: TimelineEventStatus;
  priority: TimelineEventPriority;
  metadata: Record<string, any>;
  userId?: string;
  userName?: string;
  entityId: string;
  entityType: string;
}

export type TimelineEventType = 
  | 'interaction' | 'opportunity' | 'case'
  | 'petition' | 'complaint' | 'claim' | 'suggestion'
  | 'ticket' | 'resolution' | 'escalation'
  | 'workflow_start' | 'workflow_complete' | 'workflow_error'
  | 'chat_start' | 'chat_message' | 'recommendation';

export type TimelineEventStatus = 
  | 'active' | 'resolved' | 'pending' | 'cancelled';

export type TimelineEventPriority = 
  | 'low' | 'medium' | 'high' | 'critical';
```

### **Integración en Dashboard**

```typescript
// ✅ Timeline en dashboard de entidad
const EntityDashboard: React.FC<EntityDashboardProps> = ({ entityId, entityType }) => {
  return (
    <div className="entity-dashboard">
      <EntityHeader entityId={entityId} entityType={entityType} />
      
      <div className="dashboard-content">
        <div className="dashboard-main">
          <EntityMetrics entityId={entityId} entityType={entityType} />
          <EntityActions entityId={entityId} entityType={entityType} />
        </div>
        
        <div className="dashboard-sidebar">
          <Timeline 
            entityId={entityId}
            entityType={entityType}
            maxItems={20}
            showFilters={false}
          />
        </div>
      </div>
    </div>
  );
};
```

### **Ventajas del Enfoque**

1. **Contexto Unificado**: Muestra todas las interacciones de la entidad en un solo lugar
2. **Adaptabilidad**: Se adapta automáticamente a los módulos activos de cada empresa
3. **Escalabilidad**: Fácil agregar nuevos módulos y tipos de eventos
4. **Performance**: Virtualización para grandes volúmenes de datos
5. **Multi-tenant**: Aislamiento completo por empresa
6. **Real-time**: Actualizaciones en tiempo real vía Supabase subscriptions

### **Próximos Pasos**

1. Implementar el componente Timeline base
2. Crear hooks de agregación por módulo
3. Integrar con el sistema de permisos
4. Agregar virtualización para performance
5. Implementar filtros avanzados
6. Agregar exportación y reportes

---

**El Timeline es el corazón del panorama unificado alrededor de la entidad, mostrando toda la actividad relacionada independientemente del módulo de origen.** 