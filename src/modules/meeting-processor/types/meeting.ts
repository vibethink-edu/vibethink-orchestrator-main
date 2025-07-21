export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  participants: string;
  recordingUrl?: string;
  transcript?: string;
  summary?: string;
  actionItems: ActionItem[];
  status: MeetingStatus;
  metadata: Record<string, any>;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: Date;
  priority: Priority;
  status: TaskStatus;
  source: 'meeting' | 'manual' | 'dartai';
  meetingId: string;
}

export interface MeetingProcessingResult {
  meeting: Meeting;
  transcript: string;
  summary: string;
  actionItems: ActionItem[];
  participants: string[];
  duration: number;
  processingTime: number;
}

export interface MeetingProcessorConfig {
  openaiApiKey: string;
  dartAiToken: string;
  maxAudioDuration: number;
  supportedFormats: string[];
  enableTranscription: boolean;
  enableSummarization: boolean;
  enableTaskGeneration: boolean;
}

export type MeetingStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TranscriptionResult {
  text: string;
  confidence: number;
  segments: TranscriptionSegment[];
  language: string;
}

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

export interface SummarizationResult {
  summary: string;
  keyPoints: string[];
  participants: string[];
  duration: number;
}

export interface TaskGenerationResult {
  tasks: ActionItem[];
  assignees: Record<string, string>;
  priorities: Record<string, Priority>;
  dueDates: Record<string, Date>;
} 