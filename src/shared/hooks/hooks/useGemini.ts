/**
 * React Hook para integración con Gemini + Cursor
 * Facilita el uso de Gemini en componentes React
 */

import { useState, useCallback, useRef } from 'react';
import { GeminiProvider, GeminiConfig } from '../services/ai/GeminiProvider';

interface UseGeminiOptions {
  apiKey: string;
  model?: string;
  temperature?: number;
  enableAutoComplete?: boolean;
  enableCodeReview?: boolean;
  enableChatMode?: boolean;
}

interface GeminiState {
  isLoading: boolean;
  error: string | null;
  lastResponse: any | null;
  conversationHistory: any[];
}

export const useGemini = (options: UseGeminiOptions) => {
  const [state, setState] = useState<GeminiState>({
    isLoading: false,
    error: null,
    lastResponse: null,
    conversationHistory: []
  });

  const geminiProvider = useRef<GeminiProvider | null>(null);

  // Initialize Gemini provider
  const initializeProvider = useCallback(() => {
    if (!geminiProvider.current) {
      const config: GeminiConfig = {
        provider: 'gemini',
        apiKey: options.apiKey,
        model: options.model || 'gemini-1.5-pro',
        temperature: options.temperature || 0.7,
        enableMultimodal: true,
        enableLongContext: true
      };
      
      geminiProvider.current = new GeminiProvider(config);
    }
    return geminiProvider.current;
  }, [options]);

  // Generate code with Cursor-like experience
  const generateCode = useCallback(async (
    prompt: string,
    context?: {
      language?: string;
      framework?: string;
      existingCode?: string;
      requirements?: string[];
      projectType?: string;
    }
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const provider = initializeProvider();
      const result = await provider.generateCodeWithContext(prompt, context || {});
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastResponse: result,
        error: null
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to generate code'
      }));
      throw error;
    }
  }, [initializeProvider]);

  // Analyze code (like Cursor's code review)
  const analyzeCode = useCallback(async (
    code: string,
    context?: {
      language?: string;
      analysisType?: 'security' | 'performance' | 'quality' | 'all';
      severity?: 'low' | 'medium' | 'high';
    }
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const provider = initializeProvider();
      const result = await provider.analyzeCode(code, context || {});
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastResponse: result,
        error: null
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to analyze code'
      }));
      throw error;
    }
  }, [initializeProvider]);

  // Chat with AI (like Cursor chat)
  const chatWithAI = useCallback(async (message: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const provider = initializeProvider();
      const result = await provider.chatWithAI(message, state.conversationHistory);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastResponse: result,
        conversationHistory: [
          ...prev.conversationHistory,
          { role: 'user', content: message },
          { role: 'assistant', content: result.response }
        ],
        error: null
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to chat with AI'
      }));
      throw error;
    }
  }, [initializeProvider, state.conversationHistory]);

  // Refactor code
  const refactorCode = useCallback(async (
    code: string,
    objective: string,
    context?: {
      language?: string;
      patterns?: string[];
      constraints?: string[];
    }
  ) => {
    const prompt = `Refactor this code with the objective: ${objective}

Code to refactor:
\`\`\`${context?.language || 'typescript'}
${code}
\`\`\`

${context?.patterns ? `Apply these patterns: ${context.patterns.join(', ')}` : ''}
${context?.constraints ? `Constraints: ${context.constraints.join(', ')}` : ''}

Provide:
1. Refactored code
2. Explanation of changes
3. Benefits achieved
4. Migration notes if needed`;

    return generateCode(prompt, {
      language: context?.language,
      existingCode: code,
      requirements: [objective]
    });
  }, [generateCode]);

  // Debug code
  const debugCode = useCallback(async (
    code: string,
    error: string,
    context?: {
      language?: string;
      stackTrace?: string;
      expectedBehavior?: string;
    }
  ) => {
    const prompt = `Help me debug this code error:

Code:
\`\`\`${context?.language || 'typescript'}
${code}
\`\`\`

Error: ${error}

${context?.stackTrace ? `Stack Trace:\n${context.stackTrace}` : ''}
${context?.expectedBehavior ? `Expected Behavior: ${context.expectedBehavior}` : ''}

Provide:
1. Error diagnosis
2. Root cause analysis
3. Step-by-step solution
4. Fixed code
5. Prevention recommendations`;

    return generateCode(prompt, {
      language: context?.language,
      existingCode: code,
      requirements: ['debug', 'fix error']
    });
  }, [generateCode]);

  // Auto-complete functionality (like Cursor's autocomplete)
  const getAutoComplete = useCallback(async (
    currentCode: string,
    cursorPosition: number,
    context?: {
      language?: string;
      filename?: string;
      projectContext?: string;
    }
  ) => {
    if (!options.enableAutoComplete) return null;

    const beforeCursor = currentCode.substring(0, cursorPosition);
    const afterCursor = currentCode.substring(cursorPosition);
    
    const prompt = `Complete this code at the cursor position:

Before cursor:
\`\`\`${context?.language || 'typescript'}
${beforeCursor}
\`\`\`

After cursor:
\`\`\`${context?.language || 'typescript'}
${afterCursor}
\`\`\`

${context?.filename ? `File: ${context.filename}` : ''}
${context?.projectContext ? `Project context: ${context.projectContext}` : ''}

Provide only the completion that should be inserted at the cursor position.`;

    try {
      const result = await generateCode(prompt, {
        language: context?.language,
        existingCode: currentCode
      });
      
      return {
        completion: result.code,
        confidence: 0.8, // Could be calculated based on response quality
        suggestions: result.suggestions
      };
    } catch (error) {
      console.error('Auto-complete failed:', error);
      return null;
    }
  }, [generateCode, options.enableAutoComplete]);

  // Clear conversation history
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      conversationHistory: [],
      lastResponse: null,
      error: null
    }));
  }, []);

  // Get provider health status
  const checkHealth = useCallback(async () => {
    try {
      const provider = initializeProvider();
      return await provider.isHealthy();
    } catch (error) {
      return false;
    }
  }, [initializeProvider]);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    lastResponse: state.lastResponse,
    conversationHistory: state.conversationHistory,

    // Core methods
    generateCode,
    analyzeCode,
    chatWithAI,
    
    // Advanced methods
    refactorCode,
    debugCode,
    getAutoComplete,
    
    // Utilities
    clearHistory,
    checkHealth
  };
};

// Helper hook for Cursor-like experience in editors
export const useCursorGemini = (options: UseGeminiOptions) => {
  const gemini = useGemini(options);
  
  // Editor-specific functionality
  const enhanceWithAI = useCallback(async (
    selection: string,
    action: 'explain' | 'optimize' | 'refactor' | 'test' | 'document',
    context?: any
  ) => {
    const prompts = {
      explain: `Explain this code clearly:\n\`\`\`\n${selection}\n\`\`\``,
      optimize: `Optimize this code for better performance:\n\`\`\`\n${selection}\n\`\`\``,
      refactor: `Refactor this code for better maintainability:\n\`\`\`\n${selection}\n\`\`\``,
      test: `Generate unit tests for this code:\n\`\`\`\n${selection}\n\`\`\``,
      document: `Generate documentation for this code:\n\`\`\`\n${selection}\n\`\`\``
    };
    
    return await gemini.generateCode(prompts[action], context);
  }, [gemini]);

  return {
    ...gemini,
    enhanceWithAI
  };
};
