/**
 * Integra Gemini con el sistema VibeThink Orchestrator
 * Proporciona funcionalidades de IA avanzadas para el desarrollo
 * y análisis de código en la plataforma VibeThink
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AbstractAIProvider, AIProviderConfig } from './AbstractAIProvider';

export interface GeminiConfig extends AIProviderConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  enableMultimodal?: boolean;
  enableLongContext?: boolean;
}

export class GeminiProvider extends AbstractAIProvider {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    super(config);
    
    this.config = {
      model: 'gemini-1.5-pro',
      temperature: 0.7,
      maxTokens: 4096,
      enableMultimodal: true,
      enableLongContext: true,
      ...config
    };

    if (!this.config.apiKey) {
      throw new Error('Gemini API key is required');
    }

    this.genAI = new GoogleGenerativeAI(this.config.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: this.config.model!,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      }
    });
  }

  async generateText(prompt: string, context?: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      // Track usage antes de la llamada
      await this.trackUsage('generateText', {
        provider: 'gemini',
        model: this.config.model,
        prompt: prompt.substring(0, 100) // Solo primeros 100 chars para log
      });

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const endTime = Date.now();
      
      // Track successful response
      await this.trackUsage('generateText_success', {
        provider: 'gemini',
        model: this.config.model,
        responseTime: endTime - startTime,
        tokensUsed: this.estimateTokens(text)
      });

      return {
        content: text,
        model: this.config.model,
        provider: 'gemini',
        usage: {
          promptTokens: this.estimateTokens(prompt),
          completionTokens: this.estimateTokens(text),
          totalTokens: this.estimateTokens(prompt + text)
        },
        metadata: {
          responseTime: endTime - startTime,
          timestamp: new Date(),
          context
        }
      };
    } catch (error) {
      // TODO: log Gemini API Error en desarrollo
      // Track error
      await this.trackUsage('generateText_error', {
        provider: 'gemini',
        error: error.message,
        responseTime: Date.now() - startTime
      });
      
      throw error;
    }
  }

  async generateCodeWithContext(prompt: string, context: {
    language?: string;
    framework?: string;
    existingCode?: string;
    requirements?: string[];
    projectType?: string;
  }): Promise<any> {
    const enhancedPrompt = this.buildCodePrompt(prompt, context);
    
    try {
      const result = await this.generateText(enhancedPrompt, context);
      
      return {
        ...result,
        code: this.extractCode(result.content),
        language: context.language || 'typescript',
        suggestions: this.extractSuggestions(result.content),
        explanation: this.extractExplanation(result.content)
      };
    } catch (error) {
      // TODO: log Gemini Code Generation Error: error
      throw error;
    }
  }

  async analyzeCode(code: string, context: {
    language?: string;
    analysisType?: 'security' | 'performance' | 'quality' | 'all';
    severity?: 'low' | 'medium' | 'high';
  }): Promise<any> {
    const analysisPrompt = this.buildAnalysisPrompt(code, context);
    
    try {
      const result = await this.generateText(analysisPrompt, context);
      
      return {
        ...result,
        analysis: this.extractAnalysis(result.content),
        issues: this.extractIssues(result.content),
        recommendations: this.extractRecommendations(result.content),
        score: this.extractScore(result.content)
      };
    } catch (error) {
      // TODO: log Gemini Code Analysis Error: error
      throw error;
    }
  }

  async chatWithAI(message: string, conversationHistory?: any[]): Promise<any> {
    const chatPrompt = this.buildChatPrompt(message, conversationHistory);
    
    try {
      const result = await this.generateText(chatPrompt, { type: 'chat' });
      
      return {
        ...result,
        response: result.content,
        conversationId: this.generateConversationId(),
        timestamp: new Date()
      };
    } catch (error) {
      // TODO: log Gemini Chat Error en desarrollo
      throw error;
    }
  }

  private buildCodePrompt(prompt: string, context: any): string {
    const systemPrompt = `You are an expert software developer assistant integrated with VibeThink Orchestrator.

Your specialties:
- Modern development practices
- ${context.language || 'TypeScript'} development
- ${context.framework || 'React/Node.js'} frameworks
- Security best practices
- Performance optimization
- Code quality and maintainability

Current project context:
${context.projectType ? `Project Type: ${context.projectType}` : ''}
${context.requirements ? `Requirements: ${context.requirements.join(', ')}` : ''}
${context.existingCode ? `Existing Code Context:\n\`\`\`${context.language}\n${context.existingCode.substring(0, 500)}\n\`\`\`` : ''}

Instructions:
1. Generate production-ready code
2. Include proper error handling
3. Add clear comments and documentation
4. Follow best practices for ${context.language || 'TypeScript'}
5. Consider security implications
6. Optimize for performance where relevant`;

    return `${systemPrompt}\n\nUser Request: ${prompt}`;
  }

  private buildAnalysisPrompt(code: string, context: any): string {
    const analysisTypes = {
      security: 'Focus on security vulnerabilities, injection attacks, authentication issues',
      performance: 'Focus on performance bottlenecks, memory usage, optimization opportunities',
      quality: 'Focus on code quality, maintainability, best practices adherence',
      all: 'Comprehensive analysis covering security, performance, and code quality'
    };

    return `You are a senior code reviewer with expertise in ${context.language || 'multiple languages'}.

Analysis Type: ${analysisTypes[context.analysisType || 'all']}
Severity Level: ${context.severity || 'medium'} and above

Please analyze the following code:

\`\`\`${context.language || 'typescript'}
${code}
\`\`\`

Provide:
1. Overall assessment
2. Specific issues found (with severity levels)
3. Security concerns (if any)
4. Performance recommendations
5. Code quality improvements
6. Overall score (1-10)
7. Priority action items`;
  }

  private buildChatPrompt(message: string, history?: any[]): string {
    let conteVTKrompt = `You are an AI assistant integrated with VibeThink Orchestrator, specialized in software development.

You can help with:
- Code generation and review
- Architecture discussions
- Debugging assistance
- Best practices recommendations
- Technology stack advice
- Project planning

`;

    if (history && history.length > 0) {
      conteVTKrompt += 'Conversation History:\n';
      history.slice(-5).forEach((msg, index) => {
        conteVTKrompt += `${msg.role}: ${msg.content}\n`;
      });
      conteVTKrompt += '\n';
    }

    return `${conteVTKrompt}User: ${message}`;
  }

  // Helper methods for extracting information from responses
  private extractCode(text: string): string {
    const codeMatch = text.match(/```[\w]*\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : '';
  }

  private extractSuggestions(text: string): string[] {
    const suggestions = text.match(/(?:suggestion|recommend|consider):\s*(.+)/gi);
    return suggestions ? suggestions.map(s => s.replace(/(?:suggestion|recommend|consider):\s*/i, '')) : [];
  }

  private extractExplanation(text: string): string {
    const explanationMatch = text.match(/(?:explanation|summary):\s*(.+?)(?:\n\n|\n$)/is);
    return explanationMatch ? explanationMatch[1] : '';
  }

  private extractAnalysis(text: string): string {
    const analysisMatch = text.match(/(?:analysis|assessment):\s*(.+?)(?:\n\n|\n$)/is);
    return analysisMatch ? analysisMatch[1] : '';
  }

  private extractIssues(text: string): string[] {
    const issues = text.match(/(?:issue|problem|concern):\s*(.+)/gi);
    return issues ? issues.map(i => i.replace(/(?:issue|problem|concern):\s*/i, '')) : [];
  }

  private extractRecommendations(text: string): string[] {
    const recommendations = text.match(/(?:recommendation|improve):\s*(.+)/gi);
    return recommendations ? recommendations.map(r => r.replace(/(?:recommendation|improve):\s*/i, '')) : [];
  }

  private extractScore(text: string): number {
    const scoreMatch = text.match(/score:\s*(\d+(?:\.\d+)?)/i);
    return scoreMatch ? parseFloat(scoreMatch[1]) : 7;
  }

  private estimateTokens(text: string): number {
    // Estimación simple: ~4 caracteres por token
    return Math.ceil(text.length / 4);
  }

  private generateConversationId(): string {
    return `gemini_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Implement required abstract methods
  async isHealthy(): Promise<boolean> {
    try {
      const testResult = await this.generateText('Test connection', { test: true });
      return !!testResult.content;
    } catch (error) {
      // TODO: log Gemini health check failed: error
      return false;
    }
  }

  async getUsageStats(): Promise<any> {
    // Implementar tracking de uso específico para Gemini
    return {
      provider: 'gemini',
      model: this.config.model,
      totalRequests: 0, // Implementar contador real
      totalTokens: 0,   // Implementar contador real
      lastUsed: new Date()
    };
  }
}

// Factory function
export const createGeminiProvider = (config: GeminiConfig): GeminiProvider => {
  return new GeminiProvider(config);
};
