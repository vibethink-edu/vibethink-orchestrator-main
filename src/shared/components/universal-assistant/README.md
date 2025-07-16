# Universal Assistant - VThink 1.0

## 🎯 **Concepto: Agente Universal Contextual**

El **Universal Assistant** es un agente de IA que se adapta dinámicamente al contexto de la entidad y los módulos disponibles, proporcionando soporte inteligente y personalizado.

### **Características Principales**

#### **Adaptación Contextual por Entidad**
```typescript
// ✅ El asistente se adapta al contexto
interface AssistantContext {
  entityId: string;
  entityType: 'company' | 'customer' | 'employee' | 'zone' | 'country';
  activeModules: string[];
  userRole: UserRole;
  userPermissions: string[];
  companyId: string;
  currentModule?: string;
  currentAction?: string;
}
```

#### **Perfiles Dinámicos por Rol**
```typescript
// ✅ Perfiles adaptativos por rol y contexto
const assistantProfiles = {
  EMPLOYEE: {
    focus: ['basic_operations', 'self_service'],
    modules: ['helpdesk', 'pqrs'],
    tone: 'supportive',
    expertise: ['troubleshooting', 'guidance']
  },
  MANAGER: {
    focus: ['team_management', 'reporting'],
    modules: ['crm', 'pqrs', 'helpdesk'],
    tone: 'collaborative',
    expertise: ['analytics', 'process_optimization']
  },
  ADMIN: {
    focus: ['system_configuration', 'user_management'],
    modules: ['all'],
    tone: 'professional',
    expertise: ['administration', 'compliance']
  },
  OWNER: {
    focus: ['strategic_insights', 'business_optimization'],
    modules: ['all'],
    tone: 'executive',
    expertise: ['strategy', 'performance', 'growth']
  }
};
```

### **Arquitectura del Componente**

#### **Estructura de Archivos**
```
src/shared/components/universal-assistant/
├── UniversalAssistant.tsx    # Componente principal
├── AssistantChat.tsx         # Interfaz de chat
├── AssistantContext.tsx      # Contexto del asistente
├── AssistantProfile.tsx      # Perfil del asistente
├── hooks/
│   ├── useAssistant.ts       # Hook principal
│   ├── useAssistantContext.ts # Hook de contexto
│   ├── useAssistantProfile.ts # Hook de perfil
│   └── useAssistantActions.ts # Hook de acciones
├── types/
│   └── assistant.types.ts    # Tipos del asistente
├── utils/
│   ├── contextAnalyzer.ts    # Análisis de contexto
│   ├── profileMatcher.ts     # Matching de perfiles
│   └── responseGenerator.ts  # Generación de respuestas
├── profiles/
│   ├── employee.ts           # Perfil empleado
│   ├── manager.ts            # Perfil manager
│   ├── admin.ts              # Perfil admin
│   └── owner.ts              # Perfil owner
└── README.md
```

### **Implementación del Hook Principal**

```typescript
// ✅ Hook useAssistant - VThink 1.0
export const useAssistant = (entityId?: string, entityType?: string) => {
  const { user } = useAuth();
  const { company } = useCompany();
  const { currentModule } = useModuleContext();
  
  // Analizar contexto actual
  const context = useMemo(() => ({
    entityId,
    entityType,
    userRole: user.role,
    userPermissions: user.permissions,
    companyId: company.id,
    currentModule,
    activeModules: company.activeModules
  }), [entityId, entityType, user, company, currentModule]);

  // Determinar perfil del asistente
  const profile = useAssistantProfile(context);
  
  // Estado del chat
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Enviar mensaje
  const sendMessage = useCallback(async (content: string) => {
    const userMessage: AssistantMessage = {
      id: generateId(),
      type: 'user',
      content,
      timestamp: new Date(),
      context
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Generar respuesta contextual
      const response = await generateAssistantResponse({
        message: content,
        context,
        profile,
        conversationHistory: messages
      });

      const assistantMessage: AssistantMessage = {
        id: generateId(),
        type: 'assistant',
        content: response.content,
        actions: response.actions,
        timestamp: new Date(),
        context
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsTyping(false);
    }
  }, [context, profile, messages]);

  return {
    messages,
    sendMessage,
    isTyping,
    profile,
    context,
    clearChat: () => setMessages([])
  };
};
```

### **Análisis de Contexto**

```typescript
// ✅ Analizador de contexto - VThink 1.0
export const analyzeContext = (context: AssistantContext): ContextAnalysis => {
  const analysis: ContextAnalysis = {
    primaryFocus: determinePrimaryFocus(context),
    availableActions: getAvailableActions(context),
    suggestedTopics: getSuggestedTopics(context),
    urgency: determineUrgency(context),
    complexity: determineComplexity(context)
  };

  // Determinar enfoque principal
  if (context.currentModule) {
    analysis.primaryFocus = `module_${context.currentModule}`;
  } else if (context.entityType) {
    analysis.primaryFocus = `entity_${context.entityType}`;
  } else {
    analysis.primaryFocus = 'general_support';
  }

  // Obtener acciones disponibles según permisos
  analysis.availableActions = context.userPermissions.map(permission => ({
    action: permission,
    description: getActionDescription(permission),
    icon: getActionIcon(permission)
  }));

  return analysis;
};

// ✅ Determinar temas sugeridos según contexto
const getSuggestedTopics = (context: AssistantContext): string[] => {
  const topics: string[] = [];

  // Temas según módulos activos
  if (context.activeModules.includes('crm')) {
    topics.push('customer_management', 'sales_process', 'opportunity_tracking');
  }

  if (context.activeModules.includes('pqrs')) {
    topics.push('petition_management', 'complaint_resolution', 'regulatory_compliance');
  }

  if (context.activeModules.includes('helpdesk')) {
    topics.push('ticket_management', 'technical_support', 'escalation_process');
  }

  // Temas según rol
  switch (context.userRole) {
    case 'EMPLOYEE':
      topics.push('self_service', 'basic_operations', 'troubleshooting');
      break;
    case 'MANAGER':
      topics.push('team_management', 'reporting', 'process_optimization');
      break;
    case 'ADMIN':
      topics.push('system_configuration', 'user_management', 'compliance');
      break;
    case 'OWNER':
      topics.push('strategic_insights', 'business_optimization', 'performance_metrics');
      break;
  }

  return topics;
};
```

### **Generación de Respuestas Contextuales**

```typescript
// ✅ Generador de respuestas - VThink 1.0
export const generateAssistantResponse = async (params: {
  message: string;
  context: AssistantContext;
  profile: AssistantProfile;
  conversationHistory: AssistantMessage[];
}): Promise<AssistantResponse> => {
  const { message, context, profile, conversationHistory } = params;

  // Analizar intención del usuario
  const intent = await analyzeUserIntent(message, context);
  
  // Determinar tipo de respuesta
  const responseType = determineResponseType(intent, context);
  
  // Generar respuesta según tipo
  switch (responseType) {
    case 'information':
      return await generateInformationResponse(intent, context, profile);
    
    case 'action':
      return await generateActionResponse(intent, context, profile);
    
    case 'guidance':
      return await generateGuidanceResponse(intent, context, profile);
    
    case 'troubleshooting':
      return await generateTroubleshootingResponse(intent, context, profile);
    
    case 'recommendation':
      return await generateRecommendationResponse(intent, context, profile);
    
    default:
      return await generateGeneralResponse(intent, context, profile);
  }
};

// ✅ Respuesta de información contextual
const generateInformationResponse = async (
  intent: UserIntent,
  context: AssistantContext,
  profile: AssistantProfile
): Promise<AssistantResponse> => {
  let content = '';
  let actions: AssistantAction[] = [];

  switch (intent.topic) {
    case 'entity_overview':
      content = await generateEntityOverview(context);
      actions = [
        { label: 'Ver Timeline', action: 'view_timeline', icon: 'clock' },
        { label: 'Ver Métricas', action: 'view_metrics', icon: 'chart' },
        { label: 'Ver Casos', action: 'view_cases', icon: 'file-text' }
      ];
      break;

    case 'module_help':
      content = await generateModuleHelp(intent.module, context);
      actions = [
        { label: 'Abrir Módulo', action: `open_module_${intent.module}`, icon: 'external-link' },
        { label: 'Ver Tutorial', action: `view_tutorial_${intent.module}`, icon: 'play' }
      ];
      break;

    case 'workflow_status':
      content = await generateWorkflowStatus(context);
      actions = [
        { label: 'Ver Workflow', action: 'view_workflow', icon: 'git-branch' },
        { label: 'Actualizar Estado', action: 'update_workflow_status', icon: 'refresh' }
      ];
      break;
  }

  return { content, actions };
};
```

### **Componente Principal**

```typescript
// ✅ Universal Assistant Component - VThink 1.0
interface UniversalAssistantProps {
  entityId?: string;
  entityType?: string;
  className?: string;
  position?: 'sidebar' | 'floating' | 'fullscreen';
  showProfile?: boolean;
}

export const UniversalAssistant: React.FC<UniversalAssistantProps> = ({
  entityId,
  entityType,
  className,
  position = 'floating',
  showProfile = true
}) => {
  const {
    messages,
    sendMessage,
    isTyping,
    profile,
    context,
    clearChat
  } = useAssistant(entityId, entityType);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`universal-assistant ${position} ${className}`}>
      {/* Botón flotante */}
      {position === 'floating' && (
        <button
          className="assistant-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir asistente"
        >
          <BotIcon className="w-6 h-6" />
        </button>
      )}

      {/* Panel del asistente */}
      {(isOpen || position !== 'floating') && (
        <div className="assistant-panel">
          {/* Header con perfil */}
          <div className="assistant-header">
            {showProfile && <AssistantProfile profile={profile} context={context} />}
            <button
              className="assistant-close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar asistente"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Chat del asistente */}
          <AssistantChat
            messages={messages}
            onSendMessage={sendMessage}
            isTyping={isTyping}
            context={context}
          />

          {/* Acciones rápidas */}
          <div className="assistant-actions">
            <QuickActions context={context} onAction={sendMessage} />
          </div>
        </div>
      )}
    </div>
  );
};
```

### **Perfil del Asistente**

```typescript
// ✅ Componente de perfil del asistente
interface AssistantProfileProps {
  profile: AssistantProfile;
  context: AssistantContext;
}

export const AssistantProfile: React.FC<AssistantProfileProps> = ({
  profile,
  context
}) => {
  return (
    <div className="assistant-profile">
      <div className="profile-avatar">
        <img src={profile.avatar} alt={profile.name} />
        <div className={`status-indicator ${profile.status}`} />
      </div>
      
      <div className="profile-info">
        <h3 className="profile-name">{profile.name}</h3>
        <p className="profile-role">{profile.role}</p>
        <p className="profile-expertise">{profile.expertise.join(', ')}</p>
      </div>

      <div className="profile-context">
        <div className="context-item">
          <span className="label">Entidad:</span>
          <span className="value">{context.entityType || 'General'}</span>
        </div>
        <div className="context-item">
          <span className="label">Módulos:</span>
          <span className="value">{context.activeModules.length} activos</span>
        </div>
      </div>
    </div>
  );
};
```

### **Acciones Rápidas**

```typescript
// ✅ Acciones rápidas contextuales
interface QuickActionsProps {
  context: AssistantContext;
  onAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  context,
  onAction
}) => {
  const actions = useMemo(() => {
    const baseActions = [
      { label: 'Ayuda General', action: 'help_general', icon: 'help-circle' },
      { label: 'Ver Tutoriales', action: 'view_tutorials', icon: 'play' }
    ];

    // Agregar acciones según contexto
    if (context.entityId) {
      baseActions.push(
        { label: 'Ver Timeline', action: 'view_timeline', icon: 'clock' },
        { label: 'Ver Métricas', action: 'view_metrics', icon: 'chart' }
      );
    }

    if (context.currentModule) {
      baseActions.push(
        { label: 'Ayuda del Módulo', action: `help_module_${context.currentModule}`, icon: 'book' },
        { label: 'Ver Casos', action: `view_cases_${context.currentModule}`, icon: 'file-text' }
      );
    }

    return baseActions;
  }, [context]);

  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button
          key={action.action}
          className="quick-action-btn"
          onClick={() => onAction(action.action)}
          title={action.label}
        >
          <Icon name={action.icon} className="w-4 h-4" />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};
```

### **Tipos del Asistente**

```typescript
// ✅ Tipos del asistente - VThink 1.0
export interface AssistantProfile {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  tone: 'supportive' | 'collaborative' | 'professional' | 'executive';
  avatar: string;
  status: 'online' | 'busy' | 'away';
  focus: string[];
  modules: string[];
}

export interface AssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context: AssistantContext;
  actions?: AssistantAction[];
}

export interface AssistantAction {
  label: string;
  action: string;
  icon: string;
  params?: Record<string, any>;
}

export interface AssistantResponse {
  content: string;
  actions?: AssistantAction[];
  metadata?: Record<string, any>;
}

export interface UserIntent {
  topic: string;
  confidence: number;
  entities: Record<string, any>;
  module?: string;
  action?: string;
}
```

### **Integración en Dashboard**

```typescript
// ✅ Asistente integrado en dashboard
const EntityDashboard: React.FC<EntityDashboardProps> = ({ entityId, entityType }) => {
  return (
    <div className="entity-dashboard">
      <EntityHeader entityId={entityId} entityType={entityType} />
      
      <div className="dashboard-content">
        <div className="dashboard-main">
          <EntityMetrics entityId={entityId} entityType={entityType} />
          <EntityActions entityId={entityId} entityType={entityType} />
          <Timeline entityId={entityId} entityType={entityType} />
        </div>
        
        <div className="dashboard-sidebar">
          <UniversalAssistant 
            entityId={entityId}
            entityType={entityType}
            position="sidebar"
            showProfile={true}
          />
        </div>
      </div>
    </div>
  );
};
```

### **Ventajas del Enfoque**

1. **Contexto Inteligente**: Se adapta automáticamente al contexto de la entidad
2. **Perfiles Dinámicos**: Cambia según el rol y módulos activos
3. **Acciones Contextuales**: Sugiere acciones relevantes según el contexto
4. **Multi-tenant**: Aislamiento completo por empresa
5. **Escalabilidad**: Fácil agregar nuevos perfiles y capacidades
6. **Real-time**: Respuestas en tiempo real con contexto actualizado

### **Próximos Pasos**

1. Implementar el componente UniversalAssistant base
2. Crear perfiles específicos por rol
3. Integrar con el sistema de análisis de contexto
4. Agregar generación de respuestas con IA
5. Implementar acciones contextuales
6. Agregar integración con Timeline

---

**El Universal Assistant es el compañero inteligente que se adapta al contexto de cada usuario, proporcionando soporte personalizado y acciones relevantes según la entidad y módulos activos.** 