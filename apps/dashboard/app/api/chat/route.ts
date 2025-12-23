import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, contextData } = await req.json();

    // 1. Generate System Prompt based on Context
    // Defaults
    let empresaNombre = "Guest Company";
    let currentModule = "General";
    let activeEntityName = "None";
    let activeEntityId = "N/A";

    if (contextData) {
        empresaNombre = contextData.company?.name || empresaNombre;
        currentModule = contextData.module || currentModule;
        activeEntityName = contextData.activeEntity?.name || activeEntityName;
        activeEntityId = contextData.activeEntity?.id || activeEntityId;
    }

    const systemPrompt = `
Eres el Asistente Inteligente de la plataforma VibeThink Orchestrator. 
Tu objetivo es ayudar al usuario a gestionar el módulo de **${currentModule}**.

CONTEXTO ACTUAL:
- Empresa: ${empresaNombre}
- Usuario: Sistema (Authenticated)
- Tarea/Entidad activa: ${activeEntityName} (ID: ${activeEntityId})

REGLAS DE COMPORTAMIENTO:
1. Sincronización con el Timeline: Tienes acceso visual al historial de la derecha. Si el usuario pregunta "¿Qué pasó ayer?", asume que puedes ver los eventos recientes (aunque por ahora solo se te pasa el contexto general, responde como si tuvieras la vista).
2. Tono: Profesional, ejecutivo y proactivo.
3. Capacidades: Puedes explicar campos del formulario, resumir el historial de mantenimiento o redactar borradores legales basados en el proceso actual.
4. Restricción: No inventes datos que no estén en el contexto del módulo.
  `;

    // 2. Call OpenAI (or compatible provider)
    const result = streamText({
        model: openai('gpt-4-turbo'),
        system: systemPrompt,
        messages,
    });

    return result.toDataStreamResponse();
}
