// Placeholder hook for note attachments
'use client';
import { useState } from 'react';
import { NoteAttachment } from '../types';

export function useNoteAttachments() {
  const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
  return { attachments, setAttachments };
}