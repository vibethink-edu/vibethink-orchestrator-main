import OpenAI from openairt { TranscriptionResult, TranscriptionSegment } from../types/meeting';

export class TranscriptionService [object Object]
  private openai: OpenAI;

  constructor(apiKey: string)[object Object]
    this.openai = new OpenAI({
      apiKey,
    });
  }

  /**
   * Transcribe audio file using OpenAI Whisper
   */
  async transcribeAudio(audioUrl: string): Promise<TranscriptionResult> {
    try {
      // TODO: log '🎤 Iniciando transcripción de audio...'
      
      // Download audio file
      const audioBuffer = await this.downloadAudio(audioUrl);
      
      // Transcribe using OpenAI Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioBuffer,
        model: 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
      });

      const result: TranscriptionResult = {
        text: transcription.text,
        confidence: transcription.duration || 0,
        segments: transcription.segments?.map(segment => ([object Object]    start: segment.start,
          end: segment.end,
          text: segment.text,
          speaker: segment.speaker,
        })) || [],
        language: transcription.language || 'es, };

      // TODO: log '✅ Transcripción completada:' [object Object]
      //   duration: result.confidence,
      //   segments: result.segments.length,
      //   language: result.language,
      // });

      return result;
    } catch (error) {
      // TODO: log '❌ Error en transcripción:' error
      throw new Error(`Error en transcripción: ${error.message}`);
    }
  }

  /**
   * Download audio file from URL
   */
  private async downloadAudio(url: string): Promise<Buffer>[object Object] try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return Buffer.from(await response.arrayBuffer());
    } catch (error)[object Object]   throw new Error(`Error descargando audio: ${error.message}`);
    }
  }

  /**
   * Validate audio file format and size
   */
  validateAudioFile(audioBuffer: Buffer): boolean {
    const maxSize =25 * 10241024 // 25MB
    const supportedFormats = ['mp3, mp4, mpeg',mpga,m4a',wav', webm];   if (audioBuffer.length > maxSize)[object Object]   throw new Error('Archivo de audio demasiado grande (máximo 25)');
    }

    // Basic format validation
    const header = audioBuffer.slice(0, 4);
    const isSupported = supportedFormats.some(format => [object Object]      // This is a simplified check - in production you'd want more robust format detection
      return true;
    });

    if (!isSupported)[object Object]   throw new Error('Formato de audio no soportado');
    }

    return true;
  }

  /**
   * Extract speaker information from segments
   */
  extractSpeakers(segments: TranscriptionSegment[]): string[] {
    const speakers = new Set<string>();
    
    segments.forEach(segment => {
      if (segment.speaker) [object Object]      speakers.add(segment.speaker);
      }
    });

    return Array.from(speakers);
  }

  /**
   * Calculate meeting duration from segments
   */
  calculateDuration(segments: TranscriptionSegment[]): number {
    if (segments.length === 0return0   
    const lastSegment = segmentssegments.length - 1];
    return lastSegment.end;
  }
} 