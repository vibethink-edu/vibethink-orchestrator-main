// =============================================================================
// NOTE EDITOR COMPONENT
// =============================================================================
// 
// Rich text editor for note content with support for different note types
// Includes markdown support, auto-save, and keyboard shortcuts
//
// VThink 1.0 Compliance:
// - ✅ Rich text editing capabilities
// - ✅ Auto-save functionality
// - ✅ HSL color variables
// - ✅ Responsive design
// =============================================================================

'use client';

import React, { useRef, useEffect } from 'react';
import { Textarea } from '@vibethink/ui';
import { ScrollArea } from '@vibethink/ui';
import { Button } from '@vibethink/ui';
import { Checkbox } from '@vibethink/ui';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Code,
  Link,
  Image,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Note, NoteType, ChecklistItem } from '../types';
import type { UseNoteEditorReturn } from '../hooks/useNoteEditor';

interface NoteEditorProps {
  note: Note;
  editor: UseNoteEditorReturn;
  onUpdateNote: (updates: Partial<Note>) => Promise<void>;
  className?: string;
}

export function NoteEditor({
  note,
  editor,
  onUpdateNote,
  className
}: NoteEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus editor
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [note.id]);

  // Handle checklist item changes
  const handleChecklistChange = async (index: number, checked: boolean) => {
    if (note.checklist_items) {
      const updatedItems = [...note.checklist_items];
      updatedItems[index] = { ...updatedItems[index], checked };
      await onUpdateNote({ checklist_items: updatedItems });
    }
  };

  const handleChecklistTextChange = async (index: number, text: string) => {
    if (note.checklist_items) {
      const updatedItems = [...note.checklist_items];
      updatedItems[index] = { ...updatedItems[index], text };
      await onUpdateNote({ checklist_items: updatedItems });
    }
  };

  // Add new checklist item
  const addChecklistItem = async () => {
    const newItem: ChecklistItem = {
      id: `item_${Date.now()}`,
      text: '',
      checked: false,
      order: note.checklist_items?.length || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedItems = [...(note.checklist_items || []), newItem];
    await onUpdateNote({ checklist_items: updatedItems });
  };

  // Remove checklist item
  const removeChecklistItem = async (index: number) => {
    if (note.checklist_items) {
      const updatedItems = note.checklist_items.filter((_, i) => i !== index);
      await onUpdateNote({ checklist_items: updatedItems });
    }
  };

  // Render based on note type
  const renderEditor = () => {
    switch (note.type) {
      case 'checklist':
        return (
          <div className="p-4 space-y-3">
            {note.checklist_items?.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 group">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={(checked) => handleChecklistChange(index, checked as boolean)}
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleChecklistTextChange(index, e.target.value)}
                  className={cn(
                    "flex-1 bg-transparent border-none outline-none text-sm",
                    "focus:bg-muted/30 px-2 py-1 rounded",
                    item.checked && "line-through text-muted-foreground"
                  )}
                  placeholder="Add item..."
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeChecklistItem(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </Button>
              </div>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={addChecklistItem}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <CheckSquare className="w-4 h-4" />
              Add item
            </Button>
          </div>
        );

      case 'markdown':
        return (
          <div className="flex h-full">
            {/* Editor */}
            <div className="flex-1 flex flex-col">
              <div className="p-2 border-b bg-muted/20">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Code className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Quote className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Link className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                ref={textareaRef}
                value={editor.content}
                onChange={(e) => editor.setContent(e.target.value)}
                placeholder="Write your note in Markdown..."
                className="flex-1 resize-none border-none rounded-none font-mono text-sm"
              />
              <div className="p-2 border-t bg-muted/20 text-xs text-muted-foreground">
                Lines: {editor.content.split('\n').length} | 
                Words: {editor.wordCount} | 
                Characters: {editor.characterCount}
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 border-l">
              <div className="p-2 border-b bg-muted/20 text-sm font-medium">
                Preview
              </div>
              <ScrollArea className="flex-1 p-4">
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ 
                    __html: editor.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/`(.*?)`/g, '<code>$1</code>')
                      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                      .replace(/\n/g, '<br>')
                  }}
                />
              </ScrollArea>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="p-4">
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Voice Note</span>
                <span className="text-xs text-muted-foreground">
                  {note.voice_duration ? `${Math.floor(note.voice_duration / 60)}:${(note.voice_duration % 60).toString().padStart(2, '0')}` : '0:00'}
                </span>
              </div>
              
              {/* Audio controls placeholder */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  ▶️ Play
                </Button>
                <div className="flex-1 bg-muted/50 h-2 rounded-full">
                  <div className="bg-primary h-full w-1/3 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Transcript */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Transcript</label>
              <Textarea
                value={note.voice_transcript || ''}
                onChange={(e) => onUpdateNote({ voice_transcript: e.target.value })}
                placeholder="Transcript will appear here..."
                className="min-h-48"
              />
            </div>
          </div>
        );

      default:
        // Text editor
        return (
          <ScrollArea className="flex-1">
            <Textarea
              ref={textareaRef}
              value={editor.content}
              onChange={(e) => editor.setContent(e.target.value)}
              placeholder="Start writing your note..."
              className="min-h-full resize-none border-none rounded-none text-base leading-relaxed p-4"
              style={{ minHeight: 'calc(100vh - 200px)' }}
            />
          </ScrollArea>
        );
    }
  };

  return (
    <div className={cn("flex-1 flex flex-col bg-background", className)}>
      {renderEditor()}
      
      {/* Editor Stats Footer */}
      <div className="border-t bg-card/30 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Words: {editor.wordCount}</span>
            <span>Characters: {editor.characterCount}</span>
            {editor.estimatedReadTime > 0 && (
              <span>Read time: ~{editor.estimatedReadTime} min</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {editor.canUndo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={editor.undo}
                className="text-xs h-6"
              >
                Undo
              </Button>
            )}
            {editor.canRedo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={editor.redo}
                className="text-xs h-6"
              >
                Redo
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
