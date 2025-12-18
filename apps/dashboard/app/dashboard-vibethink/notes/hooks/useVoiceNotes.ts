// Placeholder hook for voice notes
'use client';
import { useState } from 'react';
import { VoiceNoteConfig } from '../types';

export function useVoiceNotes() {
  const [isRecording, setIsRecording] = useState(false);
  const [config, setConfig] = useState<VoiceNoteConfig>({
    language: 'en-US',
    auto_transcribe: true,
    quality: 'medium',
    max_duration: 600
  });
  return { isRecording, config, setIsRecording, setConfig };
}