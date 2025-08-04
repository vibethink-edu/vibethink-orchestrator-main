// Placeholder hook for note templates
'use client';
import { useState } from 'react';
import { NoteTemplate } from '../types';

export function useNoteTemplates() {
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);
  return { templates, setTemplates };
}