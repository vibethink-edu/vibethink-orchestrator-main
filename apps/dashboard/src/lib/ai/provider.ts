/**
 * @provenance
 * provider: Vercel AI SDK + OpenAI
 * package: ai@^6.0.3, @ai-sdk/openai@^3.0.1
 * distance: 1
 * risk: HIGH
 * policy: governed
 * rationale: Centralized AI provider access for Reasoning Layer
 * replaced_by: none (canonical boundary)
 */

import { openai as openaiProvider } from '@ai-sdk/openai';
import { streamText as sdkStreamText } from 'ai';
import type { CoreMessage } from 'ai';

/**
 * ViTo AI Provider Interface
 * Thin wrapper around AI SDK to enable provider swapping
 */

export interface StreamAIOptions {
    model: string;
    system: string;
    messages: CoreMessage[];
}

/**
 * Stream AI response using configured provider
 * Currently: OpenAI via Vercel AI SDK
 */
export function streamAI(options: StreamAIOptions) {
    const { model, system, messages } = options;

    return sdkStreamText({
        model: openaiProvider(model),
        system,
        messages,
    });
}

/**
 * Future: Add provider selection logic here if needed
 * Example:
 * export function streamAI(options: StreamAIOptions & { provider?: 'openai' | 'anthropic' })
 */
