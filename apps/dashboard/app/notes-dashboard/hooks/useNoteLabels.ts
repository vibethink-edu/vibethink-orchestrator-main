// =============================================================================
// NOTE LABELS HOOK
// =============================================================================
// 
// Hook for managing note labels with multi-tenant support
// Handles label CRUD and color management
//
// VThink 1.0 Compliance:
// - ✅ Multi-tenant security (company_id filtering)
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
  from: (table: string) => createMockQueryBuilder(mockLabelsData)
};

// Mock user - NO usar auth real (patrón CRM)
const mockUser = {
  id: '1',
  company_id: 'company_1',
  role: 'ADMIN' as const
};

// Mock labels data
const mockLabelsData = [
  {
    id: 'label_1',
    name: 'Work',
    color: 'hsl(var(--chart-1))',
    company_id: 'company_1',
    created_by: '1',
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z'
  },
  {
    id: 'label_2',
    name: 'Personal',
    color: 'hsl(var(--chart-2))',
    company_id: 'company_1',
    created_by: '1',
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z'
  }
];
import { NoteLabel } from '../types';

interface UseNoteLabelsReturn {
  labels: NoteLabel[];
  isLoading: boolean;
  error: string | null;
  createLabel: (title: string, color: string) => Promise<NoteLabel>;
  updateLabel: (id: string, updates: Partial<NoteLabel>) => Promise<NoteLabel>;
  deleteLabel: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useNoteLabels(): UseNoteLabelsReturn {
  const user = mockUser; // Use mock user (pattern CRM)
  const [labels, setLabels] = useState<NoteLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLabels = useCallback(async () => {
    if (!user?.company_id) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('note_labels')
        .select('*')
        .eq('company_id', user.company_id)
        .order('title');

      if (fetchError) throw fetchError;
      setLabels(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch labels');
    } finally {
      setIsLoading(false);
    }
  }, [user?.company_id]);

  const createLabel = useCallback(async (title: string, color: string): Promise<NoteLabel> => {
    if (!user?.company_id) throw new Error('User not authenticated');

    const labelData = {
      title,
      color,
      company_id: user.company_id,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('note_labels')
      .insert([labelData])
      .select()
      .single();

    if (error) throw error;
    
    setLabels(prev => [...prev, data]);
    return data;
  }, [user]);

  const updateLabel = useCallback(async (id: string, updates: Partial<NoteLabel>): Promise<NoteLabel> => {
    if (!user?.company_id) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('note_labels')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('company_id', user.company_id)
      .select()
      .single();

    if (error) throw error;
    
    setLabels(prev => prev.map(label => label.id === id ? data : label));
    return data;
  }, [user]);

  const deleteLabel = useCallback(async (id: string): Promise<void> => {
    if (!user?.company_id) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('note_labels')
      .delete()
      .eq('id', id)
      .eq('company_id', user.company_id);

    if (error) throw error;
    
    setLabels(prev => prev.filter(label => label.id !== id));
  }, [user]);

  const refetch = useCallback(async () => {
    await fetchLabels();
  }, [fetchLabels]);

  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  return {
    labels,
    isLoading,
    error,
    createLabel,
    updateLabel,
    deleteLabel,
    refetch
  };
}