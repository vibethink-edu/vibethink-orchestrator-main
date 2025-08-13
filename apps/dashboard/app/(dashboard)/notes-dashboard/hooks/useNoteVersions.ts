// Placeholder hook for note versions
'use client';
import { useState } from 'react';
import { NoteVersion } from '../types';

export function useNoteVersions() {
  const [versions, setVersions] = useState<NoteVersion[]>([]);
  return { versions, setVersions };
}