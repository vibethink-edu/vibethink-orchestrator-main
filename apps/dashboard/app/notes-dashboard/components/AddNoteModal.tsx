// =============================================================================
// ADD NOTE MODAL COMPONENT
// =============================================================================
// 
// Modal for creating new notes with type selection and initial configuration
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security
// - ✅ HSL color variables
// - ✅ Shadcn/ui components
// =============================================================================

'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/bundui-premium/components/ui/dialog';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Label } from '@/shared/components/bundui-premium/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/bundui-premium/components/ui/select';
import { FileText, CheckSquare, Type, Image, Mic } from 'lucide-react';
import { NoteFolder, NoteLabel, NoteType, CreateNotePayload } from '../types';

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNote: (payload: CreateNotePayload) => Promise<void>;
  folders: NoteFolder[];
  labels: NoteLabel[];
}

const noteTypes = [
  { value: 'text' as NoteType, label: 'Text Note', icon: FileText },
  { value: 'checklist' as NoteType, label: 'Checklist', icon: CheckSquare },
  { value: 'markdown' as NoteType, label: 'Markdown', icon: Type },
  { value: 'voice' as NoteType, label: 'Voice Note', icon: Mic },
  { value: 'image' as NoteType, label: 'Image Note', icon: Image },
];

export function AddNoteModal({ open, onOpenChange, onCreateNote, folders, labels }: AddNoteModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<NoteType>('text');
  const [folderId, setFolderId] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      const payload: CreateNotePayload = {
        title: title.trim(),
        content: '',
        type,
        folder_id: folderId || null,
        labels: [],
        tags: [],
        priority: 'medium'
      };

      await onCreateNote(payload);
      
      // Reset form
      setTitle('');
      setType('text');
      setFolderId('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Note Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as NoteType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {noteTypes.map((noteType) => {
                  const Icon = noteType.icon;
                  return (
                    <SelectItem key={noteType.value} value={noteType.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {noteType.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {folders.length > 0 && (
            <div className="space-y-2">
              <Label>Folder (Optional)</Label>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No folder</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isCreating}>
              {isCreating ? 'Creating...' : 'Create Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}