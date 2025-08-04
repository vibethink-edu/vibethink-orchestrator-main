// =============================================================================
// NOTE CONTENT COMPONENT
// =============================================================================
// 
// Main note content area with editor, toolbar, and metadata
// Supports multiple note types and real-time editing
//
// VThink 1.0 Compliance:
// - ✅ Rich text editing
// - ✅ Auto-save functionality
// - ✅ HSL color variables
// - ✅ Responsive design
// =============================================================================

'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { ScrollArea } from '@/shared/components/bundui-premium/components/ui/scroll-area';
import { Separator } from '@/shared/components/bundui-premium/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';
import { 
  Save,
  Share2,
  MoreHorizontal,
  Archive,
  Trash2,
  Copy,
  Download,
  Pin,
  Tag,
  FolderOpen,
  Clock,
  Type,
  CheckSquare,
  Image,
  Mic,
  FileText,
  Star,
  Users
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Note, NoteFolder, NoteLabel, NoteType } from '../types';
import { useNoteEditor } from '../hooks/useNoteEditor';
import { NoteEditor } from './NoteEditor';
import { NoteToolbar } from './NoteToolbar';
import { formatDistanceToNow, format } from 'date-fns';

interface NoteContentProps {
  note: Note;
  onUpdateNote: (updates: Partial<Note>) => Promise<void>;
  onDeleteNote: () => void;
  onShareNote: () => void;
  folders: NoteFolder[];
  labels: NoteLabel[];
  isUpdating: boolean;
}

export function NoteContent({
  note,
  onUpdateNote,
  onDeleteNote,
  onShareNote,
  folders,
  labels,
  isUpdating
}: NoteContentProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(note.title);

  // Note editor hook
  const editor = useNoteEditor({
    note,
    onSave: async (payload) => {
      await onUpdateNote(payload);
    },
    autoSave: true,
    autoSaveInterval: 2000
  });

  // Get note metadata
  const folder = folders.find(f => f.id === note.folder_id);
  const noteLabels = labels.filter(label => note.labels.includes(label.id));
  
  // Note type info
  const noteTypeInfo = {
    text: { icon: FileText, label: 'Text Note' },
    checklist: { icon: CheckSquare, label: 'Checklist' },
    markdown: { icon: Type, label: 'Markdown' },
    image: { icon: Image, label: 'Image Note' },
    voice: { icon: Mic, label: 'Voice Note' },
    template: { icon: Star, label: 'Template' }
  };

  const currentTypeInfo = noteTypeInfo[note.type] || noteTypeInfo.text;
  const TypeIcon = currentTypeInfo.icon;

  // Handle title editing
  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTempTitle(note.title);
  };

  const handleTitleSave = async () => {
    if (tempTitle.trim() !== note.title) {
      await onUpdateNote({ title: tempTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(note.title);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  // Menu actions
  const handleArchive = () => {
    onUpdateNote({ status: 'archived' });
  };

  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate note:', note.id);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export note:', note.id);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50">
        {/* Title and Metadata */}
        <div className="flex-1 min-w-0 mr-4">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <TypeIcon className="w-5 h-5 text-muted-foreground" />
            {isEditingTitle ? (
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                autoFocus
              />
            ) : (
              <h1
                className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={handleTitleEdit}
              >
                {note.title || 'Untitled'}
              </h1>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Type className="w-4 h-4" />
              <span>{note.word_count} words</span>
            </div>

            {note.estimated_read_time > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{note.estimated_read_time} min read</span>
              </div>
            )}

            {folder && (
              <div className="flex items-center gap-1">
                <FolderOpen className="w-4 h-4" />
                <span>{folder.name}</span>
              </div>
            )}

            {note.share_level !== 'private' && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="capitalize">{note.share_level}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Save Status */}
          {editor.isDirty && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {editor.isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>Unsaved changes</span>
                </>
              )}
            </div>
          )}

          {editor.lastSaved && !editor.isDirty && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Save className="w-4 h-4" />
              <span>Saved {formatDistanceToNow(editor.lastSaved, { addSuffix: true })}</span>
            </div>
          )}

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onShareNote}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>

          {/* More Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDeleteNote}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Labels */}
      {noteLabels.length > 0 && (
        <div className="px-4 py-2 border-b bg-card/30">
          <div className="flex flex-wrap gap-2">
            {noteLabels.map((label) => (
              <Badge
                key={label.id}
                variant="outline"
                className="text-xs"
                style={{ 
                  borderColor: label.color + '40',
                  backgroundColor: label.color + '10',
                  color: label.color
                }}
              >
                <Tag className="w-3 h-3 mr-1" />
                {label.title}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Editor Toolbar */}
      <NoteToolbar
        note={note}
        editor={editor}
        onUpdateNote={onUpdateNote}
      />

      {/* Content Editor */}
      <div className="flex-1 overflow-hidden">
        <NoteEditor
          note={note}
          editor={editor}
          onUpdateNote={onUpdateNote}
        />
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t bg-card/30 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Created {format(new Date(note.created_at), 'MMM d, yyyy')}</span>
            <span>Version {note.version}</span>
            {note.is_template && (
              <Badge variant="secondary" className="text-xs">
                Template
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {note.attachments && note.attachments.length > 0 && (
              <span>{note.attachments.length} attachments</span>
            )}
            {note.reminder_at && (
              <span>Reminder set</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}