// Placeholder component for note toolbar
'use client';
import React from 'react';
import { Note } from '../types';
import { UseNoteEditorReturn } from '../hooks/useNoteEditor';

interface NoteToolbarProps {
  note: Note;
  editor: UseNoteEditorReturn;
  onUpdateNote: (updates: Partial<Note>) => Promise<void>;
}

export function NoteToolbar(props: NoteToolbarProps) {
  return (
    <div className="border-b bg-card/30 p-2">
      <div className="text-xs text-muted-foreground">
        Toolbar coming soon...
      </div>
    </div>
  );
}