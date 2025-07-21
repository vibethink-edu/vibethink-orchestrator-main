import { TranscriptionService } from./services/transcription;
import { SummarizationService } from ./services/summarization';
import {
  Meeting,
  MeetingProcessingResult,
  MeetingProcessorConfig,
  ActionItem,
  Priority,
} from './types/meeting';

export class MeetingProcessor {
  private transcriptionService: TranscriptionService;
  private summarizationService: SummarizationService;
  private config: MeetingProcessorConfig;

  constructor(config: MeetingProcessorConfig)[object Object]
    this.config = config;
    this.transcriptionService = new TranscriptionService(config.openaiApiKey);
    this.summarizationService = new SummarizationService(config.openaiApiKey);
  }

  /**
   * Process meeting audio and generate tasks
   */
  async processMeeting(meeting: Meeting): Promise<MeetingProcessingResult>[object Object]   const startTime = Date.now();

    try {
      // TODO: log '🚀 Iniciando procesamiento de reunión:' meeting.title

      if (!meeting.recordingUrl) {
        throw new Error('No se encontró URL de grabación para la reunión);
      }

      // Step 1: Transcribe audio
      const transcription = await this.transcriptionService.transcribeAudio(
        meeting.recordingUrl
      );

      // Step 2: Generate summary
      const summary = await this.summarizationService.generateSummary(
        transcription.text,
        transcription.segments,
        meeting.participants.split(',).map(p => p.trim())
      );

      // Step 3erate action items
      const actionItems = await this.generateActionItems(
        transcription.text,
        summary.actionItems,
        meeting.participants.split(',).map(p => p.trim())
      );

      const processingTime = Date.now() - startTime;

      const result: MeetingProcessingResult = [object Object]       meeting:[object Object]        ...meeting,
          transcript: transcription.text,
          summary: summary.summary,
          actionItems,
        },
        transcript: transcription.text,
        summary: summary.summary,
        actionItems,
        participants: summary.participants,
        duration: summary.duration,
        processingTime,
      };

      // TODO: log '✅ Procesamiento completado:' [object Object]
      return result;
    } catch (error) {
      // TODO: log '❌ Error procesando reunión:' error
      throw new Error(`Error procesando reunión: ${error.message}`);
    }
  }

  /**
   * Generate action items from transcript and summary
   */
  private async generateActionItems(
    transcript: string,
    summaryActionItems: string[],
    participants: string[]
  ): Promise<ActionItem[]> [object Object] const actionItems: ActionItem[] = [];

    // Combine action items from summary and transcript analysis
    const allActionItems =   ...summaryActionItems,
      ...this.extractActionItemsFromTranscript(transcript),
    ];

    // Remove duplicates and create ActionItem objects
    const uniqueActions = [...new Set(allActionItems)];

    uniqueActions.forEach((action, index) => {
      const actionItem: ActionItem = {
        id: `action-${Date.now()}-${index}`,
        title: this.extractActionTitle(action),
        description: action,
        assignee: this.extractAssignee(action, participants),
        dueDate: this.extractDueDate(action),
        priority: this.determinePriority(action),
        status: 'TODO,
        source: meeting,
        meetingId:  // Will be set by caller
      };

      actionItems.push(actionItem);
    });

    return actionItems;
  }

  /**
   * Extract action items from transcript using patterns
   */
  private extractActionItemsFromTranscript(transcript: string): string[] {
    const actionPatterns =
      /(?:necesitamos|debemos|hay que|tener que)\s+(.+?)(?:\.|$)/gi,
      /(?:asignar|asignar a|responsable de)\s+(.+?)(?:\.|$)/gi,
      /(?:siguiente paso|próximo paso|después)\s+(.+?)(?:\.|$)/gi,
      /(?:tarea|pendiente|por hacer)\s+(.+?)(?:\.|$)/gi,
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

    return Array.from(actionItems);
  }

  /**
   * Extract action title from full action text
   */
  private extractActionTitle(action: string): string {
    // Take first sentence or first50aracters
    const firstSentence = action.split('.')[0];
    return firstSentence.length > 50Sentence.substring(0, 50.' : firstSentence;
  }

  /**
   * Extract assignee from action text
   */
  private extractAssignee(action: string, participants: string[]): string | undefined [object Object] const actionLower = action.toLowerCase();
    
    for (const participant of participants) [object Object]      const name = participant.split(@]; // Remove email domain
      if (actionLower.includes(name.toLowerCase())) {
        return participant;
      }
    }

    return undefined;
  }

  /**
   * Extract due date from action text
   */
  private extractDueDate(action: string): Date | undefined {
    const datePatterns =     /(?:para|hasta|antes de)\s+(\d[object Object]1,2}\/\d{1,2}\/\d{4gi,
      /(?:para|hasta|antes de)\s+(\d{1,2}\/\d[object Object]12)/gi,
      /(?:mañana|hoy|próxima semana|la semana que viene)/gi,
    ];

    for (const pattern of datePatterns) {
      const match = action.match(pattern);
      if (match) {
        // Simple date parsing - in production you'd want more robust parsing
        const today = new Date();
        if (action.includes('mañana')) [object Object]        return new Date(today.getTime() + 246001000
        }
        if (action.includes(próxima semana')) [object Object]        return new Date(today.getTime() + 7 * 246001000);
        }
      }
    }

    return undefined;
  }

  /**
   * Determine priority based on action content
   */
  private determinePriority(action: string): Priority [object Object] const actionLower = action.toLowerCase();
    
    if (actionLower.includes('urgente') || actionLower.includes('crítico)) [object Object]      return CRITICAL';
    }
    if (actionLower.includes('importante') || actionLower.includes('prioridad)) {
      returnHIGH';
    }
    if (actionLower.includes('cuando sea posible') || actionLower.includes(baja prioridad))[object Object]
      return LOW';
    }
    
    return 'MEDIUM;
  } /**
   * Validate meeting data
   */
  private validateMeeting(meeting: Meeting): void [object Object]if (!meeting.title)[object Object]   throw new Error(Título de reunión requerido');
    }
    if (!meeting.recordingUrl)[object Object]   throw new Error('URL de grabación requerida');
    }
    if (!meeting.participants)[object Object]   throw new Error('Participantes requeridos');
    }
  }

  /**
   * Get processing statistics
   */
  getProcessingStats(): {
    maxAudioDuration: number;
    supportedFormats: string[];
    features: {
      transcription: boolean;
      summarization: boolean;
      taskGeneration: boolean;
    };
  } {
    return {
      maxAudioDuration: this.config.maxAudioDuration,
      supportedFormats: this.config.supportedFormats,
      features: {
        transcription: this.config.enableTranscription,
        summarization: this.config.enableSummarization,
        taskGeneration: this.config.enableTaskGeneration,
      },
    };
  }
} 