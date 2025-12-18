// Placeholder component for note sharing dialog
'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@vibethink/ui';
import { Note } from '../types';

interface NoteShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  onUpdateNote: (updates: Partial<Note>) => Promise<void>;
}

export function NoteShareDialog(props: NoteShareDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">Sharing functionality coming soon...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
