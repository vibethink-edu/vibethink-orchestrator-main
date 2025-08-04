// =============================================================================
// NOTE FILTERS HOOK
// =============================================================================
// 
// Hook for managing note filtering, search, and view state
// Provides advanced filtering capabilities with persistence
//
// VThink 1.0 Compliance:
// - ✅ Advanced filtering logic
// - ✅ Search functionality
// - ✅ State persistence
// - ✅ TypeScript strict mode
// =============================================================================

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from '@/shared/hooks/hooks/base/useDebounce';
import { 
  NoteFilters, 
  NoteSortOptions, 
  NoteViewConfig,
  Note,
  NoteType,
  NoteStatus,
  NotePriority 
} from '../types';

interface UseNoteFiltersReturn {
  // Current filters
  filters: NoteFilters;
  sortOptions: NoteSortOptions;
  viewConfig: NoteViewConfig;
  
  // Search
  searchQuery: string;
  debouncedSearchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  
  // Filter actions
  updateFilters: (newFilters: Partial<NoteFilters>) => void;
  updateSort: (newSort: NoteSortOptions) => void;
  updateViewConfig: (newConfig: Partial<NoteViewConfig>) => void;
  clearAllFilters: () => void;
  resetToDefaults: () => void;
  
  // Quick filters
  setTypeFilter: (types: NoteType[]) => void;
  setStatusFilter: (statuses: NoteStatus[]) => void;
  setPriorityFilter: (priorities: NotePriority[]) => void;
  setFolderFilter: (folderId: string | null) => void;
  setLabelFilter: (labels: string[]) => void;
  
  // Date filters
  setDateRange: (start: string, end: string) => void;
  setDateRangePreset: (preset: DateRangePreset) => void;
  clearDateRange: () => void;
  
  // Toggle filters
  toggleSharedOnly: () => void;
  toggleHasAttachments: () => void;
  toggleHasReminders: () => void;
  
  // Filter state
  hasActiveFilters: boolean;
  filterCount: number;
  
  // Saved filters
  savedFilters: SavedFilter[];
  saveCurrentFilters: (name: string) => void;
  loadSavedFilters: (filterId: string) => void;
  deleteSavedFilters: (filterId: string) => void;
  
  // Filter notes function
  filterNotes: (notes: Note[]) => Note[];
}

type DateRangePreset = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

interface SavedFilter {
  id: string;
  name: string;
  filters: NoteFilters;
  sortOptions: NoteSortOptions;
  created_at: string;
}

const DEFAULT_FILTERS: NoteFilters = {};

const DEFAULT_SORT: NoteSortOptions = {
  field: 'updated_at',
  direction: 'desc'
};

const DEFAULT_VIEW_CONFIG: NoteViewConfig = {
  view_type: 'list',
  sort: DEFAULT_SORT,
  filters: DEFAULT_FILTERS,
  columns: ['title', 'folder', 'labels', 'updated_at', 'priority']
};

export function useNoteFilters(): UseNoteFiltersReturn {
  // State
  const [filters, setFilters] = useState<NoteFilters>(DEFAULT_FILTERS);
  const [sortOptions, setSortOptions] = useState<NoteSortOptions>(DEFAULT_SORT);
  const [viewConfig, setViewConfig] = useState<NoteViewConfig>(DEFAULT_VIEW_CONFIG);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  // Debounced search
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  /**
   * Load saved state from localStorage
   */
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('notes-filters-state');
      if (savedState) {
        const state = JSON.parse(savedState);
        if (state.filters) setFilters(state.filters);
        if (state.sortOptions) setSortOptions(state.sortOptions);
        if (state.viewConfig) setViewConfig(state.viewConfig);
      }

      const savedFiltersData = localStorage.getItem('notes-saved-filters');
      if (savedFiltersData) {
        setSavedFilters(JSON.parse(savedFiltersData));
      }
    } catch (error) {
      console.error('Error loading saved filters:', error);
    }
  }, []);

  /**
   * Save state to localStorage
   */
  useEffect(() => {
    try {
      const state = {
        filters,
        sortOptions,
        viewConfig
      };
      localStorage.setItem('notes-filters-state', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving filters state:', error);
    }
  }, [filters, sortOptions, viewConfig]);

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
    setViewConfig(prev => ({ ...prev, sort: newSort }));
  }, []);

  /**
   * Update view configuration
   */
  const updateViewConfig = useCallback((newConfig: Partial<NoteViewConfig>) => {
    setViewConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  /**
   * Set search query
   */
  const setSearchQueryCallback = useCallback((query: string) => {
    setSearchQuery(query);
    updateFilters({ search: query.trim() || undefined });
  }, [updateFilters]);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    updateFilters({ search: undefined });
  }, [updateFilters]);

  /**
   * Clear all filters
   */
  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  }, []);

  /**
   * Reset to defaults
   */
  const resetToDefaults = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSortOptions(DEFAULT_SORT);
    setViewConfig(DEFAULT_VIEW_CONFIG);
    setSearchQuery('');
  }, []);

  /**
   * Quick filter setters
   */
  const setTypeFilter = useCallback((types: NoteType[]) => {
    updateFilters({ type: types.length > 0 ? types : undefined });
  }, [updateFilters]);

  const setStatusFilter = useCallback((statuses: NoteStatus[]) => {
    updateFilters({ status: statuses.length > 0 ? statuses : undefined });
  }, [updateFilters]);

  const setPriorityFilter = useCallback((priorities: NotePriority[]) => {
    updateFilters({ priority: priorities.length > 0 ? priorities : undefined });
  }, [updateFilters]);

  const setFolderFilter = useCallback((folderId: string | null) => {
    updateFilters({ folder_id: folderId || undefined });
  }, [updateFilters]);

  const setLabelFilter = useCallback((labels: string[]) => {
    updateFilters({ labels: labels.length > 0 ? labels : undefined });
  }, [updateFilters]);

  /**
   * Date range helpers
   */
  const setDateRange = useCallback((start: string, end: string) => {
    updateFilters({ date_range: { start, end } });
  }, [updateFilters]);

  const setDateRangePreset = useCallback((preset: DateRangePreset) => {
    const now = new Date();
    let start: Date;
    let end = new Date(now);

    switch (preset) {
      case 'today':
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start = new Date(now);
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return;
    }

    setDateRange(start.toISOString(), end.toISOString());
  }, [setDateRange]);

  const clearDateRange = useCallback(() => {
    updateFilters({ date_range: undefined });
  }, [updateFilters]);

  /**
   * Toggle filters
   */
  const toggleSharedOnly = useCallback(() => {
    updateFilters({ shared_only: !filters.shared_only });
  }, [filters.shared_only, updateFilters]);

  const toggleHasAttachments = useCallback(() => {
    updateFilters({ has_attachments: !filters.has_attachments });
  }, [filters.has_attachments, updateFilters]);

  const toggleHasReminders = useCallback(() => {
    updateFilters({ has_reminders: !filters.has_reminders });
  }, [filters.has_reminders, updateFilters]);

  /**
   * Saved filters management
   */
  const saveCurrentFilters = useCallback((name: string) => {
    const newSavedFilter: SavedFilter = {
      id: `filter_${Date.now()}`,
      name,
      filters,
      sortOptions,
      created_at: new Date().toISOString()
    };

    const updatedSavedFilters = [...savedFilters, newSavedFilter];
    setSavedFilters(updatedSavedFilters);
    
    try {
      localStorage.setItem('notes-saved-filters', JSON.stringify(updatedSavedFilters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  }, [filters, sortOptions, savedFilters]);

  const loadSavedFilters = useCallback((filterId: string) => {
    const savedFilter = savedFilters.find(f => f.id === filterId);
    if (savedFilter) {
      setFilters(savedFilter.filters);
      setSortOptions(savedFilter.sortOptions);
      setSearchQuery(savedFilter.filters.search || '');
    }
  }, [savedFilters]);

  const deleteSavedFilters = useCallback((filterId: string) => {
    const updatedSavedFilters = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updatedSavedFilters);
    
    try {
      localStorage.setItem('notes-saved-filters', JSON.stringify(updatedSavedFilters));
    } catch (error) {
      console.error('Error deleting saved filters:', error);
    }
  }, [savedFilters]);

  /**
   * Filter notes function
   */
  const filterNotes = useCallback((notes: Note[]): Note[] => {
    let filteredNotes = [...notes];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.type?.length) {
      filteredNotes = filteredNotes.filter(note => filters.type!.includes(note.type));
    }

    if (filters.status?.length) {
      filteredNotes = filteredNotes.filter(note => filters.status!.includes(note.status));
    }

    if (filters.priority?.length) {
      filteredNotes = filteredNotes.filter(note => filters.priority!.includes(note.priority));
    }

    if (filters.folder_id) {
      filteredNotes = filteredNotes.filter(note => note.folder_id === filters.folder_id);
    }

    if (filters.labels?.length) {
      filteredNotes = filteredNotes.filter(note => 
        filters.labels!.some(label => note.labels.includes(label))
      );
    }

    if (filters.shared_only) {
      filteredNotes = filteredNotes.filter(note => note.share_level !== 'private');
    }

    if (filters.has_attachments) {
      filteredNotes = filteredNotes.filter(note => note.attachments && note.attachments.length > 0);
    }

    if (filters.has_reminders) {
      filteredNotes = filteredNotes.filter(note => note.reminder_at);
    }

    if (filters.date_range) {
      const { start, end } = filters.date_range;
      filteredNotes = filteredNotes.filter(note => {
        const noteDate = new Date(note.created_at);
        return noteDate >= new Date(start) && noteDate <= new Date(end);
      });
    }

    // Apply sorting
    filteredNotes.sort((a, b) => {
      const { field, direction } = sortOptions;
      let aValue = a[field];
      let bValue = b[field];

      // Handle different field types
      if (field === 'updated_at' || field === 'created_at') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filteredNotes;
  }, [filters, sortOptions]);

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0 || searchQuery.length > 0;
  }, [filters, searchQuery]);

  const filterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.type?.length) count++;
    if (filters.status?.length) count++;
    if (filters.priority?.length) count++;
    if (filters.folder_id) count++;
    if (filters.labels?.length) count++;
    if (filters.shared_only) count++;
    if (filters.has_attachments) count++;
    if (filters.has_reminders) count++;
    if (filters.date_range) count++;
    return count;
  }, [filters]);

  return {
    // Current filters
    filters,
    sortOptions,
    viewConfig,
    
    // Search
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery: setSearchQueryCallback,
    clearSearch,
    
    // Filter actions
    updateFilters,
    updateSort,
    updateViewConfig,
    clearAllFilters,
    resetToDefaults,
    
    // Quick filters
    setTypeFilter,
    setStatusFilter,
    setPriorityFilter,
    setFolderFilter,
    setLabelFilter,
    
    // Date filters
    setDateRange,
    setDateRangePreset,
    clearDateRange,
    
    // Toggle filters
    toggleSharedOnly,
    toggleHasAttachments,
    toggleHasReminders,
    
    // Filter state
    hasActiveFilters,
    filterCount,
    
    // Saved filters
    savedFilters,
    saveCurrentFilters,
    loadSavedFilters,
    deleteSavedFilters,
    
    // Filter notes function
    filterNotes,
  };
}