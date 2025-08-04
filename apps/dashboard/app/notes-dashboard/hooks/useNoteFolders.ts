// =============================================================================
// NOTE FOLDERS HOOK
// =============================================================================
// 
// Hook for managing note folders with multi-tenant support
// Handles folder CRUD, hierarchical organization, and sharing
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security (company_id filtering)
// - ✅ Hierarchical folder structure
// - ✅ TypeScript strict mode
// =============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
// Mock Supabase client - NO importar cliente real (patrón CRM)
const createMockQueryBuilder = (data: any) => ({
  select: (columns: string) => createMockQueryBuilder(data),
  eq: (column: string, value: string) => createMockQueryBuilder(data),
  order: (column: string, options?: any) => createMockQueryBuilder(data),
  single: () => Promise.resolve({ data: data[0] || null, error: null }),
  insert: (records: any[]) => createMockQueryBuilder(records),
  update: (updates: any) => createMockQueryBuilder(data),
  delete: () => Promise.resolve({ error: null }),
  then: (callback: (result: any) => any) => callback({ data, error: null })
});

const supabase = {
  from: (table: string) => createMockQueryBuilder(mockFoldersData)
};

// Mock user - NO usar auth real (patrón CRM)
const mockUser = {
  id: '1',
  company_id: 'company_1',
  role: 'ADMIN' as const
};

// Mock folders data
const mockFoldersData = [
  {
    id: 'folder_1',
    name: 'Work',
    color: 'hsl(var(--chart-1))',
    parent_id: null,
    company_id: 'company_1',
    created_by: '1',
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z'
  },
  {
    id: 'folder_2',
    name: 'Personal',
    color: 'hsl(var(--chart-2))',
    parent_id: null,
    company_id: 'company_1',
    created_by: '1',
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z'
  }
];
import { NoteFolder } from '../types';

interface UseNoteFoldersReturn {
  folders: NoteFolder[];
  isLoading: boolean;
  error: string | null;
  createFolder: (name: string, parentId?: string) => Promise<NoteFolder>;
  updateFolder: (id: string, updates: Partial<NoteFolder>) => Promise<NoteFolder>;
  deleteFolder: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useNoteFolders(): UseNoteFoldersReturn {
  const user = mockUser; // Use mock user (pattern CRM)
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    if (!user?.company_id) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('note_folders')
        .select('*')
        .eq('company_id', user.company_id)
        .order('name');

      if (fetchError) throw fetchError;
      setFolders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch folders');
    } finally {
      setIsLoading(false);
    }
  }, [user?.company_id]);

  const createFolder = useCallback(async (name: string, parentId?: string): Promise<NoteFolder> => {
    if (!user?.company_id) throw new Error('User not authenticated');

    const folderData = {
      name,
      parent_folder_id: parentId || null,
      company_id: user.company_id,
      user_id: user.id,
      share_level: 'private' as const,
      order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('note_folders')
      .insert([folderData])
      .select()
      .single();

    if (error) throw error;
    
    setFolders(prev => [...prev, data]);
    return data;
  }, [user]);

  const updateFolder = useCallback(async (id: string, updates: Partial<NoteFolder>): Promise<NoteFolder> => {
    if (!user?.company_id) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('note_folders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('company_id', user.company_id)
      .select()
      .single();

    if (error) throw error;
    
    setFolders(prev => prev.map(folder => folder.id === id ? data : folder));
    return data;
  }, [user]);

  const deleteFolder = useCallback(async (id: string): Promise<void> => {
    if (!user?.company_id) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('note_folders')
      .delete()
      .eq('id', id)
      .eq('company_id', user.company_id);

    if (error) throw error;
    
    setFolders(prev => prev.filter(folder => folder.id !== id));
  }, [user]);

  const refetch = useCallback(async () => {
    await fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    isLoading,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    refetch
  };
}