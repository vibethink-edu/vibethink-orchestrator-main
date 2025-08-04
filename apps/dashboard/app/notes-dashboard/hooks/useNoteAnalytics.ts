// Placeholder hook for note analytics
'use client';
import { useState } from 'react';
import { NoteAnalytics } from '../types';

export function useNoteAnalytics() {
  const [analytics, setAnalytics] = useState<NoteAnalytics | null>(null);
  return { analytics, setAnalytics };
}