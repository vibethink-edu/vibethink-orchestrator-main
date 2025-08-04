// Placeholder hook for note comments
'use client';
import { useState } from 'react';
import { NoteComment } from '../types';

export function useNoteComments() {
  const [comments, setComments] = useState<NoteComment[]>([]);
  return { comments, setComments };
}