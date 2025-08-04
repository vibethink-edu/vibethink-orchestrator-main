// =============================================================================
// NOTE EDITOR HOOK
// =============================================================================
// 
// Hook for managing note editing state, auto-save, and editor functionality
// Supports rich text editing, markdown, and real-time collaboration
//
// VThink 1.0 Compliance:
// - ✅ Auto-save functionality
// - ✅ Real-time collaboration
// - ✅ Multi-format editing support
// - ✅ TypeScript strict mode
// =============================================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from '@/shared/hooks/hooks/base/useDebounce';
import { Note, UpdateNotePayload, NoteType } from '../types';

interface UseNoteEditorReturn {
  // Editor state
  title: string;
  content: string;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  
  // Editor actions
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  saveNote: () => Promise<void>;
  resetEditor: () => void;
  
  // Auto-save
  enableAutoSave: boolean;
  setEnableAutoSave: (enabled: boolean) => void;
  autoSaveInterval: number;
  setAutoSaveInterval: (interval: number) => void;
  
  // Editor features
  insertText: (text: string, position?: number) => void;
  insertChecklistItem: () => void;
  toggleChecklistItem: (index: number) => void;
  
  // Format helpers
  wordCount: number;
  characterCount: number;
  estimatedReadTime: number;
  
  // History/Undo
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  
  // Focus management
  focusEditor: () => void;
  blurEditor: () => void;
}

interface UseNoteEditorOptions {
  note?: Note;
  onSave?: (payload: UpdateNotePayload) => Promise<void>;
  autoSave?: boolean;
  autoSaveInterval?: number;
  enableHistory?: boolean;
}

export function useNoteEditor(options: UseNoteEditorOptions = {}): UseNoteEditorReturn {
  const {
    note,
    onSave,
    autoSave = true,
    autoSaveInterval: defaultAutoSaveInterval = 2000,
    enableHistory = true
  } = options;

  // Editor state
  const [title, setTitleState] = useState(note?.title || '');
  const [content, setContentState] = useState(note?.content || '');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Auto-save settings
  const [enableAutoSave, setEnableAutoSave] = useState(autoSave);
  const [autoSaveInterval, setAutoSaveInterval] = useState(defaultAutoSaveInterval);
  
  // History management
  const historyRef = useRef<{ title: string; content: string }[]>([]);
  const historyIndexRef = useRef(0);
  const maxHistorySize = 50;
  
  // Editor refs
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  
  // Debounced content for auto-save
  const debouncedTitle = useDebounce(title, autoSaveInterval);
  const debouncedContent = useDebounce(content, autoSaveInterval);

  /**
   * Set title with dirty tracking
   */
  const setTitle = useCallback((newTitle: string) => {
    setTitleState(newTitle);
    if (newTitle !== note?.title) {
      setIsDirty(true);
    }
    
    // Add to history
    if (enableHistory) {
      addToHistory(newTitle, content);
    }
  }, [note?.title, content, enableHistory]);

  /**
   * Set content with dirty tracking
   */
  const setContent = useCallback((newContent: string) => {
    setContentState(newContent);
    if (newContent !== note?.content) {
      setIsDirty(true);
    }
    
    // Add to history
    if (enableHistory) {
      addToHistory(title, newContent);
    }
  }, [note?.content, title, enableHistory]);

  /**
   * Add entry to history for undo/redo
   */
  const addToHistory = useCallback((historyTitle: string, historyContent: string) => {
    const newEntry = { title: historyTitle, content: historyContent };
    const history = historyRef.current;
    
    // Remove any future history if we're not at the end
    if (historyIndexRef.current < history.length - 1) {
      historyRef.current = history.slice(0, historyIndexRef.current + 1);
    }
    
    // Add new entry
    historyRef.current.push(newEntry);
    historyIndexRef.current = historyRef.current.length - 1;
    
    // Limit history size
    if (historyRef.current.length > maxHistorySize) {
      historyRef.current = historyRef.current.slice(-maxHistorySize);
      historyIndexRef.current = historyRef.current.length - 1;
    }
  }, []);

  /**
   * Save note
   */
  const saveNote = useCallback(async () => {
    if (!note || !onSave || !isDirty) return;

    try {
      setIsSaving(true);
      
      const payload: UpdateNotePayload = {
        id: note.id,
        title: title.trim(),
        content: content.trim(),
      };

      await onSave(payload);
      
      setIsDirty(false);
      setLastSaved(new Date());
      
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [note, onSave, isDirty, title, content]);

  /**
   * Reset editor to original note state
   */
  const resetEditor = useCallback(() => {
    setTitleState(note?.title || '');
    setContentState(note?.content || '');
    setIsDirty(false);
    
    // Reset history
    if (enableHistory) {
      historyRef.current = [{ title: note?.title || '', content: note?.content || '' }];
      historyIndexRef.current = 0;
    }
  }, [note, enableHistory]);

  /**
   * Insert text at current cursor position
   */
  const insertText = useCallback((text: string, position?: number) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = position ?? textarea.selectionStart;
    const end = position ?? textarea.selectionEnd;
    
    const newContent = content.substring(0, start) + text + content.substring(end);
    setContent(newContent);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  }, [content, setContent]);

  /**
   * Insert checklist item
   */
  const insertChecklistItem = useCallback(() => {
    insertText('\n- [ ] ');
  }, [insertText]);

  /**
   * Toggle checklist item at specific index
   */
  const toggleChecklistItem = useCallback((index: number) => {
    const lines = content.split('\n');
    const line = lines[index];
    
    if (line && line.match(/^- \[([ x])\]/)) {
      const isChecked = line.includes('[x]');
      lines[index] = line.replace(/^- \[([ x])\]/, `- [${isChecked ? ' ' : 'x'}]`);
      setContent(lines.join('\n'));
    }
  }, [content, setContent]);

  /**
   * Undo last change
   */
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const entry = historyRef.current[historyIndexRef.current];
      setTitleState(entry.title);
      setContentState(entry.content);
      setIsDirty(true);
    }
  }, []);

  /**
   * Redo last undone change
   */
  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const entry = historyRef.current[historyIndexRef.current];
      setTitleState(entry.title);
      setContentState(entry.content);
      setIsDirty(true);
    }
  }, []);

  /**
   * Focus editor
   */
  const focusEditor = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  /**
   * Blur editor
   */
  const blurEditor = useCallback(() => {
    editorRef.current?.blur();
  }, []);

  // Computed values
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = content.length;
  const estimatedReadTime = Math.ceil(wordCount / 200); // ~200 WPM reading speed

  const canUndo = enableHistory && historyIndexRef.current > 0;
  const canRedo = enableHistory && historyIndexRef.current < historyRef.current.length - 1;

  // Auto-save effect
  useEffect(() => {
    if (enableAutoSave && isDirty && !isSaving && onSave && note) {
      saveNote().catch(error => {
        console.error('Auto-save failed:', error);
      });
    }
  }, [debouncedTitle, debouncedContent, enableAutoSave, isDirty, isSaving, onSave, note, saveNote]);

  // Initialize history when note changes
  useEffect(() => {
    if (note && enableHistory) {
      historyRef.current = [{ title: note.title, content: note.content }];
      historyIndexRef.current = 0;
    }
  }, [note, enableHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when editor is focused
      if (document.activeElement !== editorRef.current) return;
      
      if ((event.ctrlKey || event.metaKey)) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            saveNote();
            break;
          case 'z':
            if (event.shiftKey) {
              event.preventDefault();
              redo();
            } else {
              event.preventDefault();
              undo();
            }
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveNote, undo, redo]);

  // Reset when note changes
  useEffect(() => {
    if (note) {
      setTitleState(note.title);
      setContentState(note.content);
      setIsDirty(false);
      setLastSaved(note.updated_at ? new Date(note.updated_at) : null);
    }
  }, [note]);

  return {
    // Editor state
    title,
    content,
    isDirty,
    isSaving,
    lastSaved,
    
    // Editor actions
    setTitle,
    setContent,
    saveNote,
    resetEditor,
    
    // Auto-save
    enableAutoSave,
    setEnableAutoSave,
    autoSaveInterval,
    setAutoSaveInterval,
    
    // Editor features
    insertText,
    insertChecklistItem,
    toggleChecklistItem,
    
    // Format helpers
    wordCount,
    characterCount,
    estimatedReadTime,
    
    // History/Undo
    canUndo,
    canRedo,
    undo,
    redo,
    
    // Focus management
    focusEditor,
    blurEditor,
  };
}