// =============================================================================
// NOTES CONTENT COMPONENT
// =============================================================================
// 
// Main content area combining notes list and editor
// Replaces the sidebar+content layout with a unified content area
//
// VThink 1.0 Compliance:
// - ✅ Universal DashboardLayout pattern
// - ✅ HSL color variables
// - ✅ Shadcn/ui components
// - ✅ Responsive design
// =============================================================================

'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { ScrollArea } from '@/shared/components/bundui-premium/components/ui/scroll-area';
import { Separator } from '@/shared/components/bundui-premium/components/ui/separator';
import { 
  StickyNote,
  Plus,
  Grid3X3,
  List,
  PanelLeft,
  PanelRight
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Note, NoteFolder, NoteLabel } from '../types';
import { NoteListItem } from './NoteListItem';
import { NoteContent as NoteEditor } from './NoteContent';

interface NotesContentProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (noteId: string | null) => void;
  onUpdateNote: (updates: any) => void;
  onDeleteNote: (noteId: string) => void;
  onShareNote: () => void;
  onCreateNote: () => void;
  folders: NoteFolder[];
  labels: NoteLabel[];
  isUpdating: boolean;
}

type ViewMode = 'grid' | 'list' | 'editor';
type LayoutMode = 'list-only' | 'editor-only' | 'split';

export function NotesContent({
  notes,
  selectedNote,
  onSelectNote,
  onUpdateNote,
  onDeleteNote,
  onShareNote,
  onCreateNote,
  folders,
  labels,
  isUpdating
}: NotesContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');

  // Auto-adjust layout based on selection and screen size
  const getEffectiveLayout = (): LayoutMode => {
    if (!selectedNote) return 'list-only';
    return layoutMode;
  };

  const effectiveLayout = getEffectiveLayout();

  return (
    <div className="grid gap-6">
      {/* Content Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {notes.length} notes
          </span>
          {selectedNote && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground">
                Editing: {selectedNote.title}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none rounded-l-md"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none rounded-r-md"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>

          {/* Layout Toggle */}
          {selectedNote && (
            <div className="flex items-center border rounded-md ml-2">
              <Button
                variant={effectiveLayout === 'list-only' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayoutMode('list-only')}
                className="rounded-none rounded-l-md"
              >
                <PanelLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={effectiveLayout === 'split' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayoutMode('split')}
                className="rounded-none"
              >
                <PanelRight className="w-4 h-4" />
              </Button>
              <Button
                variant={effectiveLayout === 'editor-only' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayoutMode('editor-only')}
                className="rounded-none rounded-r-md"
              >
                <StickyNote className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cn(
        "grid gap-6",
        effectiveLayout === 'split' && "lg:grid-cols-5",
        effectiveLayout === 'list-only' && "grid-cols-1",
        effectiveLayout === 'editor-only' && "grid-cols-1"
      )}>
        {/* Notes List */}
        {effectiveLayout !== 'editor-only' && (
          <div className={cn(
            effectiveLayout === 'split' ? "lg:col-span-2" : "col-span-1"
          )}>
            <Card className="h-[600px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notes</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCreateNote}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[520px]">
                  {notes.length > 0 ? (
                    <div className={cn(
                      "p-4",
                      viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-2"
                    )}>
                      {notes.map((note) => (
                        <NoteListItem
                          key={note.id}
                          note={note}
                          isSelected={note.id === selectedNote?.id}
                          onClick={() => onSelectNote(note.id)}
                          onDelete={() => onDeleteNote(note.id)}
                          labels={labels}
                          folders={folders}
                          compact={viewMode === 'grid'}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <StickyNote className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No notes found
                      </h3>
                      <p className="text-muted-foreground mb-4 max-w-sm">
                        Create your first note to get started with organizing your thoughts and ideas.
                      </p>
                      <Button 
                        onClick={onCreateNote}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create First Note
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Note Editor */}
        {effectiveLayout !== 'list-only' && selectedNote && (
          <div className={cn(
            effectiveLayout === 'split' ? "lg:col-span-3" : "col-span-1"
          )}>
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <NoteEditor
                  note={selectedNote}
                  onUpdateNote={onUpdateNote}
                  onDeleteNote={() => onDeleteNote(selectedNote.id)}
                  onShareNote={onShareNote}
                  folders={folders}
                  labels={labels}
                  isUpdating={isUpdating}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State when no note selected in split/editor mode */}
        {effectiveLayout !== 'list-only' && !selectedNote && (
          <div className={cn(
            effectiveLayout === 'split' ? "lg:col-span-3" : "col-span-1"
          )}>
            <Card className="h-[600px]">
              <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <StickyNote className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Select a note to start editing
                </h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  Choose a note from the list to view and edit its content, or create a new note.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={onCreateNote}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Note
                  </Button>
                  {notes.length > 0 && (
                    <Button 
                      variant="outline"
                      onClick={() => onSelectNote(notes[0].id)}
                      className="gap-2"
                    >
                      <StickyNote className="w-4 h-4" />
                      Open First Note
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}