/**
 * Cursor + Gemini Integration
 * Integra las capacidades de Cursor con Google Gemini
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface CursorGeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  features?: {
    codeGeneration?: boolean;
    codeReview?: boolean;
    refactoring?: boolean;
    debugging?: boolean;
    documentation?: boolean;
  };
}

export class CursorGeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private config: CursorGeminiConfig;

  constructor(config: CursorGeminiConfig) {
    this.config = {
      model: 'gemini-1.5-pro',
      temperature: 0.7,
      maxTokens: 4096,
      features: {
        codeGeneration: true,
        codeReview: true,
        refactoring: true,
        debugging: true,
        documentation: true
      },
      ...config
    };

    this.genAI = new GoogleGenerativeAI(this.config.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: this.config.model });
  }

  /**
   * Generar código con contexto de Cursor
   */
  async generateCode(prompt: string, context?: {
    language?: string;
    framework?: string;
    existingCode?: string;
    requirements?: string[];
  }) {
    const systemPrompt = this.buildCodeGenerationPrompt(context);
    const fullPrompt = `${systemPrompt}\n\nRequest: ${prompt}`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      
      return {
        code: response.text(),
        language: context?.language || 'typescript',
        suggestions: this.extractSuggestions(response.text()),
        metadata: {
          model: this.config.model,
          timestamp: new Date(),
          context: context
        }
      };
    } catch (error) {
      // TODO: log Error generating code with Gemini en desarrollo
      throw error;
    }
  }

  /**
   * Review de código estilo Cursor
   */
  async reviewCode(code: string, context?: {
    language?: string;
    purpose?: string;
    securityFocus?: boolean;
    performanceFocus?: boolean;
  }) {
    const reviewPrompt = this.buildCodeReviewPrompt(context);
    const fullPrompt = `${reviewPrompt}\n\nCode to review:\n\`\`\`${context?.language || 'typescript'}\n${code}\n\`\`\``;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      
      return {
        review: response.text(),
        issues: this.extractIssues(response.text()),
        suggestions: this.extractSuggestions(response.text()),
        score: this.calculateCodeScore(response.text()),
        metadata: {
          model: this.config.model,
          timestamp: new Date(),
          context: context
        }
      };
    } catch (error) {
      // TODO: log Error reviewing code with Gemini en desarrollo
      throw error;
    }
  }

  /**
   * Refactoring inteligente
   */
  async refactorCode(code: string, objective: string, context?: {
    language?: string;
    patterns?: string[];
    constraints?: string[];
  }) {
    const refactorPrompt = this.buildRefactorPrompt(objective, context);
    const fullPrompt = `${refactorPrompt}\n\nCode to refactor:\n\`\`\`${context?.language || 'typescript'}\n${code}\n\`\`\``;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      
      return {
        refactoredCode: this.extractCode(response.text()),
        explanation: this.extractExplanation(response.text()),
        improvements: this.extractImprovements(response.text()),
        metadata: {
          model: this.config.model,
          timestamp: new Date(),
          objective,
          context
        }
      };
    } catch (error) {
      // TODO: log Error refactoring code with Gemini en desarrollo
      throw error;
    }
  }

  /**
   * Debug asistido
   */
  async debugCode(code: string, error: string, context?: {
    language?: string;
    stackTrace?: string;
    expectedBehavior?: string;
  }) {
    const debugPrompt = this.buildDebugPrompt(context);
    const fullPrompt = `${debugPrompt}\n\nCode:\n\`\`\`${context?.language || 'typescript'}\n${code}\n\`\`\`\n\nError: ${error}\n${context?.stackTrace ? `\nStack Trace:\n${context.stackTrace}` : ''}`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      
      return {
        diagnosis: this.extractDiagnosis(response.text()),
        solution: this.extractSolution(response.text()),
        fixedCode: this.extractCode(response.text()),
        prevention: this.extractPrevention(response.text()),
        metadata: {
          model: this.config.model,
          timestamp: new Date(),
          error,
          context
        }
      };
    } catch (error) {
      // TODO: log Error debugging code with Gemini en desarrollo
      throw error;
    }
  }

  private buildCodeGenerationPrompt(context?: any): string {
    return `You are an expert developer assistant similar to Cursor AI, integrated with Google Gemini.
    
Your role:
- Generate high-quality, production-ready code
- Follow best practices and patterns
- Consider security, performance, and maintainability
- Provide clear explanations and documentation

${context?.language ? `Primary language: ${context.language}` : ''}
${context?.framework ? `Framework: ${context.framework}` : ''}
${context?.requirements ? `Requirements: ${context.requirements.join(', ')}` : ''}

Always provide:
1. Clean, well-commented code
2. Error handling where appropriate
3. Type safety (when applicable)
4. Performance considerations
5. Security best practices`;
  }

  private buildCodeReviewPrompt(context?: any): string {
    return `You are a senior code reviewer with expertise in modern development practices.

Review focus areas:
- Code quality and readability
- Security vulnerabilities
- Performance issues
- Best practices adherence
- Potential bugs
${context?.securityFocus ? '- SECURITY FOCUS: Extra attention to security issues' : ''}
${context?.performanceFocus ? '- PERFORMANCE FOCUS: Extra attention to performance optimizations' : ''}

Provide:
1. Overall assessment
2. Specific issues found
3. Improvement suggestions
4. Code quality score (1-10)
5. Priority recommendations`;
  }

  private buildRefactorPrompt(objective: string, context?: any): string {
    return `You are an expert at code refactoring with focus on: ${objective}

Guidelines:
- Maintain functionality while improving structure
- Apply modern patterns and best practices
- Improve readability and maintainability
- Consider performance implications
${context?.patterns ? `- Apply these patterns: ${context.patterns.join(', ')}` : ''}
${context?.constraints ? `- Respect these constraints: ${context.constraints.join(', ')}` : ''}

Provide:
1. Refactored code
2. Explanation of changes
3. Benefits achieved
4. Migration notes if needed`;
  }

  private buildDebugPrompt(context?: any): string {
    return `You are an expert debugger assistant helping to identify and fix code issues.

Your approach:
1. Analyze the error and code context
2. Identify root causes
3. Provide specific solutions
4. Suggest prevention strategies
${context?.expectedBehavior ? `Expected behavior: ${context.expectedBehavior}` : ''}

Provide:
1. Error diagnosis
2. Step-by-step solution
3. Fixed code
4. Prevention recommendations`;
  }

  // Helper methods for parsing responses
  private extractCode(text: string): string {
    const codeMatch = text.match(/```[\w]*\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : text;
  }

  private extractSuggestions(text: string): string[] {
    // Simple extraction - could be enhanced with better parsing
    const suggestions = text.match(/(?:suggestion|recommend|consider):\s*(.+)/gi);
    return suggestions ? suggestions.map(s => s.replace(/(?:suggestion|recommend|consider):\s*/i, '')) : [];
  }

  private extractIssues(text: string): string[] {
    const issues = text.match(/(?:issue|problem|bug):\s*(.+)/gi);
    return issues ? issues.map(i => i.replace(/(?:issue|problem|bug):\s*/i, '')) : [];
  }

  private extractImprovements(text: string): string[] {
    const improvements = text.match(/(?:improvement|benefit):\s*(.+)/gi);
    return improvements ? improvements.map(i => i.replace(/(?:improvement|benefit):\s*/i, '')) : [];
  }

  private extractDiagnosis(text: string): string {
    const diagnosisMatch = text.match(/diagnosis:\s*(.+?)(?:\n|$)/i);
    return diagnosisMatch ? diagnosisMatch[1] : '';
  }

  private extractSolution(text: string): string {
    const solutionMatch = text.match(/solution:\s*(.+?)(?:\n|$)/i);
    return solutionMatch ? solutionMatch[1] : '';
  }

  private extractExplanation(text: string): string {
    const explanationMatch = text.match(/explanation:\s*(.+?)(?:\n|$)/i);
    return explanationMatch ? explanationMatch[1] : '';
  }

  private extractPrevention(text: string): string {
    const preventionMatch = text.match(/prevention:\s*(.+?)(?:\n|$)/i);
    return preventionMatch ? preventionMatch[1] : '';
  }

  private calculateCodeScore(text: string): number {
    const scoreMatch = text.match(/score:\s*(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : 7; // Default score
  }
}

// Factory function para fácil uso
export const createCursorGeminiService = (config: CursorGeminiConfig) => {
  return new CursorGeminiService(config);
};

// Hook para React (si usas React)
export const useCursorGemini = (config: CursorGeminiConfig) => {
  const service = new CursorGeminiService(config);
  
  return {
    generateCode: service.generateCode.bind(service),
    reviewCode: service.reviewCode.bind(service),
    refactorCode: service.refactorCode.bind(service),
    debugCode: service.debugCode.bind(service)
  };
};
