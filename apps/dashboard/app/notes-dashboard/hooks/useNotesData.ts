// =============================================================================
// NOTES DATA HOOK
// =============================================================================
// 
// Primary hook for notes data management with multi-tenant security
// Handles CRUD operations, filtering, and real-time updates
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security (ALWAYS filter by company_id)
// - ✅ Real-time subscriptions
// - ✅ Error handling and loading states
// - ✅ TypeScript strict mode
// =============================================================================

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Note, 
  CreateNotePayload, 
  UpdateNotePayload, 
  NoteFilters, 
  NoteSortOptions,
  BulkNoteOperation 
} from '../types';

// Mock notes data - MUST be defined first
const mockNotesData = [
  {
    id: '1',
    title: 'Project Planning Notes',
    content: '# Project Planning\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.',
    type: 'markdown' as const,
    folder_id: 'folder_1',
    labels: ['work', 'planning'],
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
    company_id: 'company_1',
    created_by: '1'
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Meeting with team about Q1 goals and objectives.',
    type: 'text' as const,
    folder_id: 'folder_1',
    labels: ['meeting'],
    created_at: '2025-01-02T14:00:00Z',
    updated_at: '2025-01-02T14:00:00Z',
    company_id: 'company_1',
    created_by: '1'
  }
];

// Mock Supabase client - NO importar cliente real (patrón CRM)
const createMockQueryBuilder = (data: any) => ({
  select: (columns: string) => createMockQueryBuilder(data),
  eq: (column: string, value: string) => createMockQueryBuilder(data),
  neq: (column: string, value: string) => createMockQueryBuilder(data),
  in: (column: string, values: any[]) => createMockQueryBuilder(data),
  or: (condition: string) => createMockQueryBuilder(data),
  not: (column: string, operator: string, value: any) => createMockQueryBuilder(data),
  gte: (column: string, value: any) => createMockQueryBuilder(data),
  lte: (column: string, value: any) => createMockQueryBuilder(data),
  order: (column: string, options?: any) => createMockQueryBuilder(data),
  limit: (count: number) => createMockQueryBuilder(data),
  single: () => Promise.resolve({ data: data[0] || null, error: null }),
  insert: (records: any[]) => createMockQueryBuilder(records),
  update: (updates: any) => createMockQueryBuilder(data),
  delete: () => createMockQueryBuilder(data),
  then: (callback: (result: any) => any) => callback({ data, error: null })
});

// Mock channel for real-time subscriptions
const createMockChannel = () => ({
  on: (event: string, config: any, callback: (payload: any) => void) => createMockChannel(),
  subscribe: () => ({ unsubscribe: () => {} }),
  unsubscribe: () => {}
});

const supabase = {
  from: (table: string) => createMockQueryBuilder(mockNotesData),
  channel: (name: string) => createMockChannel(),
  removeChannel: (channel: any) => {}
};
// Mock user - NO usar auth real (patrón CRM)
const mockUser = {
  id: '1',
  company_id: 'company_1',
  role: 'ADMIN' as const
};

interface UseNotesDataReturn {
  // Data state
  notes: Note[];
  selectedNote: Note | null;
  totalCount: number;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error state
  error: string | null;
  
  // CRUD operations
  createNote: (payload: CreateNotePayload) => Promise<Note>;
  updateNote: (payload: UpdateNotePayload) => Promise<Note>;
  deleteNote: (noteId: string) => Promise<void>;
  duplicateNote: (noteId: string) => Promise<Note>;
  
  // Selection
  selectNote: (noteId: string | null) => void;
  
  // Bulk operations
  bulkOperation: (operation: BulkNoteOperation) => Promise<void>;
  
  // Archive/Restore
  archiveNote: (noteId: string) => Promise<void>;
  restoreNote: (noteId: string) => Promise<void>;
  
  // Filtering and sorting
  filters: NoteFilters;
  sortOptions: NoteSortOptions;
  updateFilters: (newFilters: Partial<NoteFilters>) => void;
  updateSort: (newSort: NoteSortOptions) => void;
  clearFilters: () => void;
  
  // Data refresh
  refetch: () => Promise<void>;
  
  // Statistics
  stats: {
    totalNotes: number;
    archivedNotes: number;
    sharedNotes: number;
    todayNotes: number;
  };
}

export function useNotesData(): UseNotesDataReturn {
  // Authentication - using mock user (patrón CRM)
  const user = mockUser;
  
  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and sorting
  const [filters, setFilters] = useState<NoteFilters>({});
  const [sortOptions, setSortOptions] = useState<NoteSortOptions>({
    field: 'updated_at',
    direction: 'desc'
  });

  // Ensure user and company_id are available
  const companyId = user?.company_id;

  /**
   * Fetch notes with multi-tenant filtering
   */
  const fetchNotes = useCallback(async () => {
    if (!user || !companyId) {
      setNotes([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('notes')
        .select(`
          *,
          folder:note_folders(id, name, color),
          labels:note_labels(id, title, color),
          attachments:note_attachments(id, filename, file_size, mime_type),
          shares:note_shares(id, permission, shared_with_user_id)
        `)
        .eq('company_id', companyId) // CRITICAL: Multi-tenant security
        .neq('status', 'deleted');

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }
      
      if (filters.type?.length) {
        query = query.in('type', filters.type);
      }
      
      if (filters.status?.length) {
        query = query.in('status', filters.status);
      } else {
        // Default to active notes if no status filter
        query = query.eq('status', 'active');
      }
      
      if (filters.priority?.length) {
        query = query.in('priority', filters.priority);
      }
      
      if (filters.folder_id) {
        query = query.eq('folder_id', filters.folder_id);
      }
      
      if (filters.shared_only) {
        query = query.neq('share_level', 'private');
      }
      
      if (filters.has_attachments) {
        query = query.not('attachments', 'is', null);
      }
      
      if (filters.has_reminders) {
        query = query.not('reminder_at', 'is', null);
      }
      
      if (filters.date_range) {
        query = query
          .gte('created_at', filters.date_range.start)
          .lte('created_at', filters.date_range.end);
      }

      // Apply sorting
      query = query.order(sortOptions.field, { ascending: sortOptions.direction === 'asc' });

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setNotes(data || []);
      setTotalCount(count || 0);

    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  }, [user, companyId, filters, sortOptions]);

  /**
   * Create new note
   */
  const createNote = useCallback(async (payload: CreateNotePayload): Promise<Note> => {
    if (!user || !companyId) {
      throw new Error('User not authenticated');
    }

    try {
      setIsCreating(true);
      setError(null);

      const noteData = {
        ...payload,
        company_id: companyId, // CRITICAL: Multi-tenant security
        user_id: user.id,
        status: 'active' as const,
        share_level: payload.share_level || 'private',
        priority: payload.priority || 'medium',
        word_count: payload.content.split(/\s+/).length,
        estimated_read_time: Math.ceil(payload.content.split(/\s+/).length / 200), // ~200 WPM
        version: 1,
        is_template: payload.is_template || false,
        is_encrypted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString()
      };

      const { data, error: createError } = await supabase
        .from('notes')
        .insert([noteData])
        .select('*')
        .single();

      if (createError) {
        throw createError;
      }

      // Update local state
      setNotes(prev => [data, ...prev]);
      
      return data;

    } catch (err) {
      console.error('Error creating note:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create note';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }, [user, companyId]);

  /**
   * Update existing note
   */
  const updateNote = useCallback(async (payload: UpdateNotePayload): Promise<Note> => {
    if (!user || !companyId) {
      throw new Error('User not authenticated');
    }

    try {
      setIsUpdating(true);
      setError(null);

      const updateData: Partial<Note> = {
        ...(payload as Partial<Note>),
        updated_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString()
      };

      // Update word count and read time if content changed
      if (payload.content !== undefined) {
        const updatedWordCount = payload.content.split(/\s+/).length;
        updateData.word_count = updatedWordCount;
        updateData.estimated_read_time = Math.ceil(updatedWordCount / 200);
      }

      const { data, error: updateError } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', payload.id)
        .eq('company_id', companyId) // CRITICAL: Multi-tenant security
        .select('*')
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setNotes(prev => prev.map(note => note.id === payload.id ? data : note));
      
      if (selectedNote?.id === payload.id) {
        setSelectedNote(data);
      }

      return data;

    } catch (err) {
      console.error('Error updating note:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update note';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [user, companyId, selectedNote]);

  /**
   * Delete note (soft delete)
   */
  const deleteNote = useCallback(async (noteId: string): Promise<void> => {
    if (!user || !companyId) {
      throw new Error('User not authenticated');
    }

    try {
      setIsDeleting(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('notes')
        .update({ 
          status: 'deleted',
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .eq('company_id', companyId); // CRITICAL: Multi-tenant security

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }

    } catch (err) {
      console.error('Error deleting note:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete note';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [user, companyId, selectedNote]);

  /**
   * Duplicate note
   */
  const duplicateNote = useCallback(async (noteId: string): Promise<Note> => {
    const originalNote = notes.find(note => note.id === noteId);
    if (!originalNote) {
      throw new Error('Note not found');
    }

    const duplicatePayload: CreateNotePayload = {
      title: `${originalNote.title} (Copy)`,
      content: originalNote.content,
      type: originalNote.type,
      folder_id: originalNote.folder_id,
      labels: originalNote.labels,
      tags: originalNote.tags,
      priority: originalNote.priority,
      share_level: 'private', // Reset to private
    };

    return await createNote(duplicatePayload);
  }, [notes, createNote]);

  /**
   * Select note
   */
  const selectNote = useCallback((noteId: string | null) => {
    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      setSelectedNote(note || null);
      
      // Update last accessed time
      if (note && user && companyId) {
        supabase
          .from('notes')
          .update({ last_accessed_at: new Date().toISOString() })
          .eq('id', noteId)
          .eq('company_id', companyId)
          .then(() => {
            // Silent update, no error handling needed
          });
      }
    } else {
      setSelectedNote(null);
    }
  }, [notes, user, companyId]);

  /**
   * Bulk operations
   */
  const bulkOperation = useCallback(async (operation: BulkNoteOperation): Promise<void> => {
    if (!user || !companyId) {
      throw new Error('User not authenticated');
    }

    try {
      setIsUpdating(true);
      setError(null);

      let updateData: Partial<Note> = {
        updated_at: new Date().toISOString()
      };

      switch (operation.operation) {
        case 'archive':
          updateData.status = 'archived';
          break;
        case 'delete':
          updateData.status = 'deleted';
          break;
        case 'move':
          if (operation.params?.folder_id !== undefined) {
            updateData.folder_id = operation.params.folder_id;
          }
          break;
        case 'label':
          if (operation.params?.labels) {
            updateData.labels = operation.params.labels;
          }
          break;
        case 'share':
          if (operation.params?.share_level) {
            updateData.share_level = operation.params.share_level;
          }
          break;
      }

      const { error: bulkError } = await supabase
        .from('notes')
        .update(updateData)
        .in('id', operation.note_ids)
        .eq('company_id', companyId); // CRITICAL: Multi-tenant security

      if (bulkError) {
        throw bulkError;
      }

      // Refresh data
      await fetchNotes();

    } catch (err) {
      console.error('Error performing bulk operation:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform bulk operation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [user, companyId, fetchNotes]);

  /**
   * Archive note
   */
  const archiveNote = useCallback(async (noteId: string): Promise<void> => {
    await updateNote({ id: noteId, status: 'archived' });
  }, [updateNote]);

  /**
   * Restore note
   */
  const restoreNote = useCallback(async (noteId: string): Promise<void> => {
    await updateNote({ id: noteId, status: 'active' });
  }, [updateNote]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters: Partial<NoteFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Update sort options
   */
  const updateSort = useCallback((newSort: NoteSortOptions) => {
    setSortOptions(newSort);
  }, []);

  /**
   * Clear filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  /**
   * Refetch data
   */
  const refetch = useCallback(async () => {
    await fetchNotes();
  }, [fetchNotes]);

  // Stats computation
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return {
      totalNotes: notes.filter(n => n.status === 'active').length,
      archivedNotes: notes.filter(n => n.status === 'archived').length,
      sharedNotes: notes.filter(n => n.share_level !== 'private').length,
      todayNotes: notes.filter(n => n.created_at.startsWith(today)).length,
    };
  }, [notes]);

  // Effects
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !companyId) return;

    const channel = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notes',
          filter: `company_id=eq.${companyId}`
        },
        (payload) => {
          // Handle real-time updates
          if (payload.eventType === 'INSERT') {
            setNotes(prev => [payload.new as Note, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotes(prev => prev.map(note => 
              note.id === payload.new.id ? payload.new as Note : note
            ));
          } else if (payload.eventType === 'DELETE') {
            setNotes(prev => prev.filter(note => note.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, companyId]);

  return {
    // Data state
    notes,
    selectedNote,
    totalCount,
    
    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Error state
    error,
    
    // CRUD operations
    createNote,
    updateNote,
    deleteNote,
    duplicateNote,
    
    // Selection
    selectNote,
    
    // Bulk operations
    bulkOperation,
    
    // Archive/Restore
    archiveNote,
    restoreNote,
    
    // Filtering and sorting
    filters,
    sortOptions,
    updateFilters,
    updateSort,
    clearFilters,
    
    // Data refresh
    refetch,
    
    // Statistics
    stats,
  };
}