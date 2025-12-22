# CRM AI Agent - Context Design Review & Architecture

**STATUS:** 🚨 **PRE-IMPLEMENTATION EXPERT REVIEW**  
**DATE:** 2025-12-21  
**CONTEXT:** CRM V2 como caso de prueba para estrategia AI-First  
**OBJETIVO:** Evaluar concepto de "contexto" en AI antes de crear estructuras de datos

---

## 🎯 Objetivo del Review

**Evaluar y mejorar el diseño arquitectónico del concepto de "contexto" en AI para CRM antes de implementar estructuras de datos completas.**

Este documento:
1. Analiza el concepto actual de "contexto" en nuestro sistema AI
2. Identifica gaps y preguntas arquitectónicas
3. Propone mejoras basadas en patrones de Attio y mejores prácticas
4. Define un diseño de "Context-Aware AI Agent" para CRM
5. Crea una guía para expert review (Consejo de Expertos)

---

## 📊 Estado Actual: Concepto de "Contexto" en ViTo

### Contexto Actual (Según Documentación)

#### 1. **TerminologyContext** (UI/Services)
```typescript
interface TerminologyContext {
  locale?: string;                    // 'en-US', 'es-ES'
  productContext?: string;            // 'hotel', 'studio', 'crm'
  workspaceContext?: string;          // 'sales', 'support', 'marketing'
  industryContext?: string;           // 'health', 'hospitality' (opcional)
  tenantId?: string;                  // Multi-tenant
}
```

#### 2. **AgentContext** (AI Agents - MANDATORIO)
```typescript
interface AgentContext {
  locale: string;                     // OBLIGATORIO
  productContext: string;             // OBLIGATORIO: 'crm'
  tenantId: string;                   // OBLIGATORIO
  workspaceContext?: string;          // 'sales', 'support'
  industryContext?: string;           // Opcional
  timezone?: string;                  // Timezone del recurso
  currency?: string;                  // Moneda del recurso
}
```

#### 3. **ResourceContext** (External Normalization)
```typescript
interface ResourceContext {
  resourceId: string;
  sourceSystem: 'airbnb' | 'pms' | 'google_calendar' | 'google_workspace' | 'office_365';
  timeZone: string;                   // IANA: 'America/Cancun'
  locale?: string;
  currency?: string;
}
```

---

## 🤔 Análisis: ¿Estamos Manejando Bien el "Contexto" en AI?

### ✅ Fortalezas Actuales

1. **Separación Clara de Responsabilidades**
   - `TerminologyContext` para UI
   - `AgentContext` para AI
   - `ResourceContext` para integraciones

2. **Timezone Safety**
   - `ResourceContext.timeZone` define la fuente de verdad
   - Previene "timezone wars"

3. **Multi-Tenant Awareness**
   - `tenantId` en todos los contextos
   - Permite overrides por tenant

4. **Context-Aware Terminology**
   - Terminología se resuelve según contexto
   - Permite renombres dinámicos (Attio-like)

### 🔴 Gaps Identificados para CRM AI Agent

#### 1. **Falta de "Session Context" o "Conversation Context"**

**Problema:** No hay contexto de sesión/conversación para el agente de voz.

**Ejemplo del Usuario:**
> "Quiero que el agente maneje/manipule/responda actividades sobre un cliente específico que esté en contexto"

**Gap:** ¿Cómo mantiene el agente el contexto de "cliente específico" durante una conversación?

**Pregunta para Expert Review:**
- ¿Debemos agregar `sessionContext` o `conversationContext`?
- ¿Debemos usar memoria conversacional (conversation memory) en el agente?
- ¿Cómo se persiste el contexto entre interacciones?

**Propuesta:**
```typescript
interface ConversationContext {
  sessionId: string;                  // ID único de sesión
  userId: string;                     // Usuario actual
  tenantId: string;                   // Tenant actual
  
  // Contexto de entidad actual (cliente específico)
  activeEntity?: {
    type: 'account' | 'contact' | 'deal' | 'activity';
    id: string;
    name: string;
  };
  
  // Historial de conversación (últimas N interacciones)
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: InstantISO;
    entities?: string[];              // Entidades mencionadas
  }>;
  
  // Intención actual
  currentIntent?: {
    action: 'create' | 'read' | 'update' | 'delete' | 'query';
    entity: string;
    params?: Record<string, any>;
  };
}
```

---

#### 2. **Falta de "Entity Context" o "Focus Context"**

**Problema:** No hay mecanismo para que el agente "recuerde" sobre qué entidad está hablando el usuario.

**Ejemplo del Usuario:**
> "Manejar actividades sobre un cliente específico que esté en contexto"

**Gap:** ¿Cómo sabe el agente que "este cliente" se refiere a "Acme Inc." mencionado 3 interacciones atrás?

**Pregunta para Expert Review:**
- ¿Debemos implementar "entity focus" o "active context"?
- ¿Cómo se establece el foco? (¿explícitamente "habla sobre Acme Inc." o implícitamente?)
- ¿Cómo se pierde el foco? (¿timeout? ¿nueva entidad? ¿comando explícito?)

**Propuesta:**
```typescript
interface EntityFocusContext {
  // Entidad en foco actual
  focusedEntity?: {
    type: 'account' | 'contact' | 'deal' | 'activity';
    id: string;
    name: string;
    metadata: {
      lastAccessed: InstantISO;
      accessCount: number;
      relatedEntities?: string[];     // IDs de entidades relacionadas
    };
  };
  
  // Entidades mencionadas recientemente (para referencia)
  recentEntities?: Array<{
    type: string;
    id: string;
    name: string;
    mentionedAt: InstantISO;
  }>;
  
  // Filtros activos del usuario (vista actual)
  activeFilters?: {
    searchQuery?: string;
    status?: string;
    dateRange?: { start: CivilDate; end: CivilDate };
    assignedTo?: string;
  };
}
```

---

#### 3. **Falta de "Action Context" o "Workflow Context"**

**Problema:** No hay contexto de qué acción/flujo está ejecutando el usuario.

**Ejemplo:**
- Usuario: "Crea un deal para Acme Inc."
- Agente: "¿Cuál es el valor del deal?"
- Usuario: "$50,000" (¿Cómo sabe el agente que esto se refiere al deal anterior?)

**Gap:** ¿Cómo mantiene el agente el contexto de una acción multi-step?

**Pregunta para Expert Review:**
- ¿Debemos usar "workflow state" o "multi-step action context"?
- ¿Cómo se manejan las confirmaciones y validaciones?
- ¿Cómo se cancela un flujo en progreso?

**Propuesta:**
```typescript
interface WorkflowContext {
  // Acción/flujo en progreso
  activeWorkflow?: {
    type: 'create_deal' | 'update_contact' | 'schedule_meeting' | 'sync_calendar';
    step: number;
    totalSteps: number;
    collectedData: Record<string, any>;  // Datos recopilados hasta ahora
    requiredFields: string[];            // Campos faltantes
    optionalFields: string[];
    startedAt: InstantISO;
  };
  
  // Confirmaciones pendientes
  pendingConfirmations?: Array<{
    type: 'delete' | 'update' | 'create';
    entity: string;
    message: string;
    confirmed?: boolean;
  }>;
}
```

---

#### 4. **Falta de "Integration Context" para CRM**

**Problema:** No hay contexto de qué integraciones están activas y cómo se relacionan con las entidades.

**Ejemplo:**
- Usuario: "Sincroniza el calendario con Google"
- Agente: ¿Qué eventos? ¿Todos? ¿Solo de Acme Inc.?

**Gap:** ¿Cómo sabe el agente qué integraciones están activas y cómo usarlas?

**Pregunta para Expert Review:**
- ¿Debemos tener un "integration context" separado?
- ¿Cómo se relaciona con `ResourceContext`?
- ¿Cómo se maneja la sincronización bidireccional?

**Propuesta:**
```typescript
interface IntegrationContext {
  // Integraciones activas del tenant
  activeIntegrations: Array<{
    system: 'google_workspace' | 'office_365' | 'gmail' | 'outlook';
    status: 'connected' | 'disconnected' | 'error';
    lastSync?: InstantISO;
    syncScope?: {
      entities: string[];              // IDs de entidades sincronizadas
      bidirectional?: boolean;
    };
  }>;
  
  // Configuración de sincronización
  syncConfig?: {
    autoSync: boolean;
    syncInterval?: number;             // minutos
    conflictResolution?: 'last_write_wins' | 'manual' | 'merge';
  };
}
```

---

#### 5. **Falta de "Permission Context" o "Authorization Context"**

**Problema:** No hay contexto de permisos/autorizaciones del usuario actual.

**Ejemplo:**
- Usuario: "Elimina el deal de Acme Inc."
- Agente: ¿Tiene permiso? ¿Debe confirmar?

**Gap:** ¿Cómo sabe el agente qué puede hacer el usuario?

**Pregunta para Expert Review:**
- ¿Debemos agregar `permissionContext`?
- ¿Cómo se verifica autorización en tiempo real?
- ¿Cómo se manejan permisos granulares (field-level)?

**Propuesta:**
```typescript
interface PermissionContext {
  userId: string;
  tenantId: string;
  roles: string[];
  permissions: {
    entity: string;
    actions: ('create' | 'read' | 'update' | 'delete')[];
    conditions?: {
      // Permisos condicionales (ej: solo deals asignados)
      field?: string;
      operator?: 'equals' | 'in' | 'not_in';
      value?: any;
    };
  }[];
}
```

---

## 🏗️ Arquitectura Propuesta: Context-Aware AI Agent para CRM

### Visión: Agente de Voz Contextual para CRM

**Objetivo:** Crear un agente de voz que:
1. Mantiene contexto de conversación (cliente específico, entidad en foco)
2. Puede manejar/manipular/responder actividades sobre entidades
3. Integra con Google Workspace/Office 365
4. Sincroniza datos bidireccionalmente
5. Respeta permisos y autorizaciones

---

### Diseño de Arquitectura

#### Capa 1: Context Layer (Nueva)

```typescript
// packages/ai-agents/src/context/types.ts

/**
 * Contexto completo para un agente AI en CRM
 * Consolida todos los tipos de contexto necesarios
 */
export interface CrmAgentContext {
  // Contextos existentes (mejorados)
  terminology: TerminologyContext;
  agent: AgentContext;
  resource: ResourceContext;
  
  // Nuevos contextos (para CRM AI Agent)
  conversation: ConversationContext;
  entityFocus: EntityFocusContext;
  workflow: WorkflowContext;
  integration: IntegrationContext;
  permission: PermissionContext;
}

/**
 * Context Manager - Gestiona todos los contextos
 */
export class CrmContextManager {
  private conversationContext: ConversationContext;
  private entityFocusContext: EntityFocusContext;
  private workflowContext: WorkflowContext;
  
  /**
   * Establece una entidad como foco activo
   */
  setFocusEntity(entity: { type: string; id: string; name: string }): void {
    this.entityFocusContext.focusedEntity = {
      ...entity,
      metadata: {
        lastAccessed: new Date().toISOString() as InstantISO,
        accessCount: (this.entityFocusContext.focusedEntity?.metadata.accessCount || 0) + 1,
      },
    };
  }
  
  /**
   * Obtiene el contexto completo para el agente
   */
  getFullContext(): CrmAgentContext {
    return {
      terminology: this.getTerminologyContext(),
      agent: this.getAgentContext(),
      resource: this.getResourceContext(),
      conversation: this.conversationContext,
      entityFocus: this.entityFocusContext,
      workflow: this.workflowContext,
      integration: this.getIntegrationContext(),
      permission: this.getPermissionContext(),
    };
  }
  
  /**
   * Actualiza el historial de conversación
   */
  addToConversationHistory(
    role: 'user' | 'assistant',
    content: string,
    entities?: string[]
  ): void {
    this.conversationContext.conversationHistory = [
      ...(this.conversationContext.conversationHistory || []).slice(-9), // Mantener últimas 9
      {
        role,
        content,
        timestamp: new Date().toISOString() as InstantISO,
        entities,
      },
    ];
  }
}
```

---

#### Capa 2: Voice Agent Layer (Mejorada)

```typescript
// apps/dashboard/app/dashboard-bundui/crm-v2/components/crm-voice-agent.tsx
"use client";

import { useVoiceAgent } from '@/hooks/use-voice-agent';
import { useCrmContext } from '@/hooks/use-crm-context';
import { useTerm } from '@vibethink/terminology';

export function CrmVoiceAgent() {
  const { context, setFocusEntity, addToConversation } = useCrmContext();
  const dealLabel = useTerm('concept.crm.entity.deal');
  const contactLabel = useTerm('concept.crm.entity.contact');
  
  const { startRecording, stopRecording, isRecording, transcript } = useVoiceAgent({
    context: 'crm',
    productContext: 'crm',
    workspaceContext: context.agent.workspaceContext || 'sales',
    
    // Pasar contexto completo al agente
    agentContext: context.getFullContext(),
    
    // Handlers específicos para CRM
    onEntityMentioned: (entity) => {
      // Cuando el usuario menciona una entidad, establecer como foco
      setFocusEntity(entity);
    },
    
    onActionRequested: (action, params) => {
      // Cuando el usuario solicita una acción
      // Validar permisos, ejecutar workflow, etc.
      handleCrmAction(action, params, context);
    },
  });
  
  return (
    <div className="crm-voice-agent">
      {/* UI del agente */}
      <VoiceOrb isRecording={isRecording} />
      
      {/* Mostrar entidad en foco */}
      {context.entityFocus.focusedEntity && (
        <EntityFocusBadge entity={context.entityFocus.focusedEntity} />
      )}
      
      {/* Mostrar workflow en progreso */}
      {context.workflow.activeWorkflow && (
        <WorkflowProgress workflow={context.workflow.activeWorkflow} />
      )}
    </div>
  );
}
```

---

#### Capa 3: Action Handler Layer (Nueva)

```typescript
// apps/dashboard/src/services/crm/voice-action-handler.ts

/**
 * Maneja acciones solicitadas por el agente de voz
 */
export class CrmVoiceActionHandler {
  constructor(
    private contextManager: CrmContextManager,
    private crmService: CrmService,
    private integrationService: IntegrationService
  ) {}
  
  /**
   * Ejecuta una acción solicitada por el usuario
   */
  async handleAction(
    action: string,
    params: Record<string, any>
  ): Promise<ActionResult> {
    const context = this.contextManager.getFullContext();
    
    // 1. Validar permisos
    if (!this.hasPermission(action, context.permission)) {
      return {
        success: false,
        message: "No tienes permiso para realizar esta acción",
      };
    }
    
    // 2. Resolver entidad en foco (si aplica)
    const targetEntity = this.resolveTargetEntity(action, params, context);
    
    // 3. Ejecutar acción según tipo
    switch (action) {
      case 'create_deal':
        return await this.handleCreateDeal(params, context);
      
      case 'update_contact':
        return await this.handleUpdateContact(targetEntity, params, context);
      
      case 'schedule_meeting':
        return await this.handleScheduleMeeting(params, context);
      
      case 'sync_calendar':
        return await this.handleSyncCalendar(params, context);
      
      default:
        return {
          success: false,
          message: `Acción "${action}" no reconocida`,
        };
    }
  }
  
  /**
   * Crea un deal (ejemplo de workflow multi-step)
   */
  private async handleCreateDeal(
    params: Record<string, any>,
    context: CrmAgentContext
  ): Promise<ActionResult> {
    // Verificar si hay workflow en progreso
    if (context.workflow.activeWorkflow?.type === 'create_deal') {
      // Continuar workflow existente
      const collectedData = {
        ...context.workflow.activeWorkflow.collectedData,
        ...params,
      };
      
      // Verificar campos faltantes
      const missingFields = this.getMissingFields(collectedData, [
        'title',
        'customer_id',
        'value',
        'stage',
      ]);
      
      if (missingFields.length > 0) {
        // Actualizar workflow
        this.contextManager.updateWorkflow({
          ...context.workflow.activeWorkflow,
          collectedData,
          requiredFields: missingFields,
        });
        
        // Solicitar siguiente campo
        return {
          success: true,
          requiresInput: true,
          message: `Necesito el campo: ${missingFields[0]}`,
          workflow: context.workflow.activeWorkflow,
        };
      }
      
      // Todos los campos completos, crear deal
      const deal = await this.crmService.createDeal(collectedData);
      
      // Establecer como foco
      this.contextManager.setFocusEntity({
        type: 'deal',
        id: deal.id,
        name: deal.title,
      });
      
      // Limpiar workflow
      this.contextManager.clearWorkflow();
      
      return {
        success: true,
        message: `Deal "${deal.title}" creado exitosamente`,
        data: deal,
      };
    }
    
    // Iniciar nuevo workflow
    this.contextManager.startWorkflow({
      type: 'create_deal',
      step: 1,
      totalSteps: 4,
      collectedData: params,
      requiredFields: ['title', 'customer_id', 'value', 'stage'],
    });
    
    return {
      success: true,
      requiresInput: true,
      message: "Voy a crear un deal. ¿Cuál es el título?",
      workflow: context.workflow.activeWorkflow,
    };
  }
}
```

---

## ❓ Preguntas para Expert Review (Consejo de Expertos)

### 1. **Contexto de Conversación**

**Pregunta:** ¿Cómo debe persistirse el contexto de conversación?

**Opciones:**
- A) En memoria (sesión actual solo)
- B) En base de datos (persistir entre sesiones)
- C) Híbrido (memoria + cache + DB)

**Recomendación:** C (Híbrido)
- Memoria para contexto inmediato (última conversación)
- Cache (Redis) para contexto reciente (últimas 24h)
- DB para historial completo

---

### 2. **Entity Focus**

**Pregunta:** ¿Cómo se establece y pierde el foco de entidad?

**Opciones:**
- A) Explícito: "habla sobre Acme Inc."
- B) Implícito: detectar en conversación
- C) Ambos

**Recomendación:** C (Ambos)
- Explícito: comando directo
- Implícito: NER (Named Entity Recognition) + referencia en contexto

**Timeout:**
- ¿Cuánto tiempo sin mencionar la entidad = perder foco?
- Recomendación: 5 minutos sin actividad relacionada

---

### 3. **Workflow Multi-Step**

**Pregunta:** ¿Cómo se manejan workflows multi-step?

**Opciones:**
- A) State machine explícito
- B) Conversación libre con validación
- C) Híbrido (state machine + NLU flexible)

**Recomendación:** C (Híbrido)
- State machine para flujos críticos (crear deal, actualizar contacto)
- Conversación libre para consultas simples

---

### 4. **Integración con Google Workspace/Office 365**

**Pregunta:** ¿Cómo se sincroniza bidireccionalmente?

**Opciones:**
- A) Sincronización en tiempo real (webhooks)
- B) Sincronización programada (polling)
- C) Híbrido (webhooks + polling de respaldo)

**Recomendación:** C (Híbrido)
- Webhooks para cambios inmediatos
- Polling cada 15 minutos como respaldo

**Conflict Resolution:**
- ¿Qué pasa si se modifica en ambos lados?
- Recomendación: "Last write wins" con notificación al usuario

---

### 5. **Permisos y Autorización**

**Pregunta:** ¿Cómo se verifica autorización en tiempo real?

**Opciones:**
- A) Verificar en cada acción
- B) Cachear permisos en contexto
- C) Híbrido (cache + verificación periódica)

**Recomendación:** C (Híbrido)
- Cachear permisos en contexto de sesión
- Verificar en acciones críticas (delete, update sensible)
- Refrescar cache cada 5 minutos

---

## 📋 Checklist de Implementación (Pre-Estructuras de Datos)

### Fase 1: Definir Tipos y Interfaces (Esta Semana)

- [ ] Definir `ConversationContext` interface
- [ ] Definir `EntityFocusContext` interface
- [ ] Definir `WorkflowContext` interface
- [ ] Definir `IntegrationContext` interface
- [ ] Definir `PermissionContext` interface
- [ ] Definir `CrmAgentContext` (consolidado)
- [ ] Crear `CrmContextManager` class

### Fase 2: Implementar Context Manager (Próxima Semana)

- [ ] Implementar `setFocusEntity()`
- [ ] Implementar `addToConversationHistory()`
- [ ] Implementar `startWorkflow()` / `updateWorkflow()` / `clearWorkflow()`
- [ ] Implementar `getFullContext()`
- [ ] Tests unitarios para Context Manager

### Fase 3: Integrar con Voice Agent (2 Semanas)

- [ ] Crear hook `useCrmContext()`
- [ ] Integrar `CrmVoiceAgent` con Context Manager
- [ ] Implementar `CrmVoiceActionHandler`
- [ ] Integrar con agente de voz existente
- [ ] Tests de integración

### Fase 4: UI Components (2-3 Semanas)

- [ ] `EntityFocusBadge` component
- [ ] `WorkflowProgress` component
- [ ] `ConversationHistory` component
- [ ] `IntegrationStatus` component
- [ ] Tests de UI

---

## 🎯 Recomendaciones Finales

### 1. **No Crear Estructuras de Datos Todavía**

**Razón:** Primero debemos validar el diseño de contexto con expert review y prototipos.

**Acción:** Crear mocks/in-memory para validar arquitectura.

### 2. **Crear Prototipo de Context Manager**

**Razón:** Validar que el diseño de contexto funciona antes de implementar todo.

**Acción:** Implementar `CrmContextManager` con datos mock.

### 3. **Expert Review Session**

**Razón:** Validar decisiones arquitectónicas con expertos antes de comprometerse.

**Acción:** Organizar sesión de review con:
- Expertos en AI/ML
- Expertos en CRM (Attio, Salesforce)
- Expertos en arquitectura de software

### 4. **Validar con Usuario (Usuario = Tú)**

**Razón:** Asegurar que el diseño cumple con las necesidades reales.

**Acción:** Probar prototipo y ajustar según feedback.

---

## 📚 Referencias

- [AI-First Universal Methodology](./AI_FIRST_UNIVERSAL_METHODOLOGY.md)
- [I18N AI Agent Context Resolution](./I18N_AI_AGENT_CONTEXT_RESOLUTION.md)
- [ViTo Architecture Spec Unified](./VITO_ARCHITECTURE_SPEC_UNIFIED.md)
- Attio Documentation (Onboarding & Context Handling)

---

**Documento generado para:** Expert Review & Architecture Design  
**Fecha:** 2025-12-21  
**Versión:** 1.0.0  
**Estado:** Pre-Implementación (Validar antes de crear estructuras de datos)

