import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { AI_ASSISTANT_CONFIG } from '@/lib/constants/ai-config';
import {
    ExtendedPanelContext,
    canUserAccessAI,
    selectModelForTask
} from '@/lib/types/ai-context';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * ViTo AI Assistant - Chat API Route
 * 
 * Handles AI chat requests with:
 * - Plan-based access control
 * - Intelligent model selection
 * - Department-specific optimization
 * - Context-aware system prompts
 */

export async function POST(req: Request) {
    try {
        const { messages, contextData } = await req.json();

        // Cast to extended context (with fallback for backward compatibility)
        const context: ExtendedPanelContext = contextData || {
            company: { id: 'default', name: 'Guest Company', plan: 'free' as const },
            user: {
                id: 'guest',
                name: 'Guest User',
                email: 'guest@example.com',
                department: 'default' as const,
                role: 'user' as const,
                permissions: {
                    aiEnabled: true, // Allow for development
                    allowedModels: ['gpt-3.5-turbo', 'gpt-4-turbo'],
                    maxTokensPerMonth: 100000,
                    voiceEnabled: false,
                    imageGeneration: false
                }
            },
            module: 'General',
            activeEntity: undefined,
            aiConfig: undefined
        };

        // ========================================
        // 1. VALIDATE USER ACCESS
        // ========================================
        const accessCheck = canUserAccessAI(context);

        if (!accessCheck.allowed) {
            return Response.json({
                error: 'upgrade_required',
                message: accessCheck.message,
                upgradeUrl: accessCheck.upgradeUrl,
                currentPlan: context.company.plan,
                assistantName: AI_ASSISTANT_CONFIG.fullName
            }, { status: 403 });
        }

        // ========================================
        // 2. SELECT OPTIMAL MODEL
        // ========================================
        const taskType = context.aiConfig?.taskType || 'quickTasks';
        const selectedModel = selectModelForTask(
            taskType,
            context.user.permissions.allowedModels,
            context.user.department
        );

        // ========================================
        // 3. BUILD DYNAMIC SYSTEM PROMPT
        // ========================================
        const systemPrompt = buildSystemPrompt(context, selectedModel);

        // ========================================
        // 4. STREAM AI RESPONSE
        // ========================================
        const result = streamText({
            model: openai(selectedModel),
            system: systemPrompt,
            messages,
        });

        return result.toDataStreamResponse();

    } catch (error) {
        console.error(`[${AI_ASSISTANT_CONFIG.name}] Error:`, error);
        return Response.json({
            error: 'internal_error',
            message: 'An error occurred while processing your request.'
        }, { status: 500 });
    }
}

/**
 * Build context-aware system prompt
 */
function buildSystemPrompt(context: ExtendedPanelContext, model: string): string {
    const { company, user, module, activeEntity } = context;

    return `Eres ${AI_ASSISTANT_CONFIG.fullName}, ${AI_ASSISTANT_CONFIG.tagline}.

**CONTEXTO ACTUAL:**
- Empresa: ${company.name} (Plan ${company.plan})
- Usuario: ${user.name} (${user.role} en ${user.department})
- Módulo: ${module}
${activeEntity ? `- Entidad Activa: ${activeEntity.name} (${activeEntity.type}, ID: ${activeEntity.id})` : ''}

**TU ROL:**
Eres un asistente inteligente especializado en ayudar a profesionales de ${user.department} con sus tareas diarias. Tienes acceso al contexto de ${module} y puedes ver la misma información que ${user.name}.

**CAPACIDADES:**
- Responder preguntas sobre el proyecto/entidad actual
- Proporcionar insights basados en el timeline y historial de actividades
- Ayudar a redactar comunicaciones y documentos
- Analizar datos y proporcionar recomendaciones
- Sincronización con Timeline: Puedes ver los eventos recientes en el historial

**REGLAS DE COMPORTAMIENTO:**
1. Tono: Profesional, ejecutivo y proactivo
2. Adaptación: Ajusta tu lenguaje a las necesidades del departamento de ${user.department}
3. Precisión: No inventes datos que no estén en el contexto
4. Concisión: Respuestas claras y accionables

**MODELO:** ${model}
**DEPARTAMENTO:** ${user.department}`;
}
