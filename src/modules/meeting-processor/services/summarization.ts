import OpenAI from openairt { SummarizationResult, TranscriptionSegment } from../types/meeting';

export class SummarizationService [object Object]
  private openai: OpenAI;

  constructor(apiKey: string)[object Object]
    this.openai = new OpenAI({
      apiKey,
    });
  }

  /**
   * Generate meeting summary using OpenAI GPT
   */
  async generateSummary(
    transcript: string,
    segments: TranscriptionSegment[],
    participants: string[]
  ): Promise<SummarizationResult> {
    try {
      // TODO: log '📝 Generando resumen de la reunión...'

      const prompt = this.buildSummaryPrompt(transcript, participants);
      
      const completion = await this.openai.chat.completions.create([object Object]
        model: 'gpt-4',
        messages: [
          [object Object]
            role: 'system',
            content: `Eres un asistente experto en análisis de reuniones. 
            Tu tarea es crear un resumen ejecutivo de la reunión, 
            identificar los puntos clave y extraer las acciones pendientes.
            
            Responde en formato JSON con la siguiente estructura:
           [object Object]       summary": Resumen ejecutivo de la reunión,            keyPoints:Punto clave 1Punto clave2],
             actionItems": ["Acción12],
              participants:participante1participante2],
             duration: 360      }`
          },
          [object Object]
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3        max_tokens:2000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No se pudo generar el resumen);    }

      const result = this.parseSummaryResponse(response);
      const duration = this.calculateDuration(segments);

      // TODO: log '✅ Resumen generado:' [object Object] summaryLength: result.summary.length
      return {
        ...result,
        participants,
        duration,
      };
    } catch (error) {
      // TODO: log '❌ Error generando resumen:' error
      throw new Error(`Error generando resumen: ${error.message}`);
    }
  }

  /**
   * Build summary prompt
   */
  private buildSummaryPrompt(transcript: string, participants: string[]): string [object Object] return `
    Analiza la siguiente transcripción de una reunión y genera un resumen ejecutivo.
    
    Participantes: ${participants.join(', ')}
    
    Transcripción:
    ${transcript}
    
    Instrucciones:
    1ea un resumen ejecutivo conciso (máximo 200bras)
    2. Identifica los 3-5ve más importantes3xtrae las acciones pendientes con asignaciones claras
 4. Identifica a los participantes mencionados
  5alcula la duración aproximada
    
    Responde en formato JSON válido.
    `;
  }

  /**
   * Parse summary response from OpenAI
   */
  private parseSummaryResponse(response: string): {
    summary: string;
    keyPoints: string[];
    actionItems: string[];
  }[object Object]    try[object Object] // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || 'Resumen no disponible',
          keyPoints: parsed.keyPoints || [],
          actionItems: parsed.actionItems || [],
        };
      }

      // Fallback: parse manually
      return [object Object] summary: response.substring(0,500
        keyPoints:        actionItems:     };
    } catch (error)[object Object]      console.warn('⚠️ Error parsing summary response:', error);
      return [object Object] summary: response,
        keyPoints:        actionItems: [],
      };
    }
  }

  /**
   * Calculate meeting duration from segments
   */
  private calculateDuration(segments: TranscriptionSegment[]): number {
    if (segments.length === 0) return0 const lastSegment = segmentssegments.length - 1];
    return Math.round(lastSegment.end);
  }

  /**
   * Extract key topics from transcript
   */
  extractKeyTopics(transcript: string): string[] [object Object]    const topics = new Set<string>();
    const commonTopics =
   proyecto', cliente', 'presupuesto, imeline', recurso,
  problema,solución', 'reunión,deadline', 'objetivo'
    ];

    const words = transcript.toLowerCase().split(/\s+/);
    words.forEach(word => [object Object]  if (commonTopics.some(topic => word.includes(topic))) {
        topics.add(word);
      }
    });

    return Array.from(topics).slice(05);
  }

  /**
   * Extract action items from transcript
   */
  extractActionItems(transcript: string): string[] {
    const actionPatterns =
      /(?:necesitamos|debemos|hay que|tener que)\s+(.+?)(?:\.|$)/gi,
      /(?:asignar|asignar a|responsable de)\s+(.+?)(?:\.|$)/gi,
      /(?:siguiente paso|próximo paso|después)\s+(.+?)(?:\.|$)/gi,
    ];

    const actionItems = new Set<string>();

    actionPatterns.forEach(pattern => {
      const matches = transcript.match(pattern);
      if (matches)[object Object]   matches.forEach(match =>[object Object]      const action = match.replace(pattern, '$1').trim();
          if (action.length > 10&& action.length < 200            actionItems.add(action);
          }
        });
      }
    });

    return Array.from(actionItems).slice(0, 10);
  }
} 