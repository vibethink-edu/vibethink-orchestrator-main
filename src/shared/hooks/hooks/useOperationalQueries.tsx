
/**
 * Operational Queries Hook - Specialized queries for operational repositories
 * 
 * Provides optimized queries for the operational repositories system
 * with better performance and type safety.
 * 
 * Part of Phase 1: Developer Experience improvements without ORM
 * 
 * @author AI Pair Platform - Developer Experience Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions for operational repositories
type PromptTemplate = Database['public']['Tables']['prompt_templates']['Row'];
type NamingConvention = Database['public']['Tables']['naming_conventions']['Row'];
type FolderStructure = Database['public']['Tables']['folder_structure_templates']['Row'];
type OperationalRepository = Database['public']['Tables']['operational_repositories']['Row'];

export interface OperationalQueriesState {
  repositories: OperationalRepository[];
  prompts: PromptTemplate[];
  namingConventions: NamingConvention[];
  folderStructures: FolderStructure[];
  loading: boolean;
  error: string | null;
}

export interface OperationalQueriesFilters {
  department?: string;
  category?: string;
  industry?: string;
  searchTerm?: string;
  isActive?: boolean;
}

export interface OperationalQueriesActions {
  refreshAll: () => Promise<void>;
  searchPrompts: (query: string) => PromptTemplate[];
  validateNamingConvention: (name: string, pattern: string) => boolean;
  getPromptsByCategory: (category: string) => PromptTemplate[];
  getFolderStructuresByIndustry: (industry: string) => FolderStructure[];
  getRepositoryStats: () => Promise<{
    totalPrompts: number;
    totalConventions: number;
    totalStructures: number;
    mostUsedCategory: string;
  }>;
}

export const useOperationalQueries = (filters: OperationalQueriesFilters = {}) => {
  const { user } = useAuth();
  const [state, setState] = useState<OperationalQueriesState>({
    repositories: [],
    prompts: [],
    namingConventions: [],
    folderStructures: [],
    loading: true,
    error: null
  });

  const companyId = useMemo(() => user?.company?.id, [user?.company?.id]);

  // Build query filters
  const buildFilters = useCallback((baseQuery: any) => {
    let query = baseQuery;

    if (filters.department) {
      query = query.eq('department', filters.department);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.industry) {
      query = query.eq('industry', filters.industry);
    }
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }
    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
    }

    return query;
  }, [filters]);

  // Fetch all operational data
  const fetchOperationalData = useCallback(async () => {
    if (!companyId) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch repositories
      const { data: repositories, error: repoError } = await supabase
        .from('operational_repositories')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true);

      if (repoError) throw repoError;

      // Fetch prompts with filters
      let promptQuery = supabase
        .from('prompt_templates')
        .select('*')
        .eq('company_id', companyId);
      
      promptQuery = buildFilters(promptQuery);
      const { data: prompts, error: promptError } = await promptQuery;

      if (promptError) throw promptError;

      // Fetch naming conventions with filters
      let namingQuery = supabase
        .from('naming_conventions')
        .select('*')
        .eq('company_id', companyId);
      
      namingQuery = buildFilters(namingQuery);
      const { data: namingConventions, error: namingError } = await namingQuery;

      if (namingError) throw namingError;

      // Fetch folder structures with filters
      let folderQuery = supabase
        .from('folder_structure_templates')
        .select('*')
        .eq('company_id', companyId);
      
      folderQuery = buildFilters(folderQuery);
      const { data: folderStructures, error: folderError } = await folderQuery;

      if (folderError) throw folderError;

      setState({
        repositories: repositories || [],
        prompts: prompts || [],
        namingConventions: namingConventions || [],
        folderStructures: folderStructures || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching operational data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [companyId, buildFilters]);

  // Search prompts locally
  const searchPrompts = useCallback((query: string): PromptTemplate[] => {
    if (!query.trim()) return state.prompts;
    
    const lowerQuery = query.toLowerCase();
    return state.prompts.filter(prompt =>
      prompt.title.toLowerCase().includes(lowerQuery) ||
      prompt.description?.toLowerCase().includes(lowerQuery) ||
      prompt.content.toLowerCase().includes(lowerQuery) ||
      prompt.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [state.prompts]);

  // Validate naming convention
  const validateNamingConvention = useCallback((name: string, pattern: string): boolean => {
    try {
      const regex = new RegExp(pattern);
      return regex.test(name);
    } catch (error) {
      console.error('Invalid regex pattern:', pattern, error);
      return false;
    }
  }, []);

  // Get prompts by category
  const getPromptsByCategory = useCallback((category: string): PromptTemplate[] => {
    return state.prompts.filter(prompt => prompt.category === category);
  }, [state.prompts]);

  // Get folder structures by industry
  const getFolderStructuresByIndustry = useCallback((industry: string): FolderStructure[] => {
    return state.folderStructures.filter(structure => structure.industry === industry);
  }, [state.folderStructures]);

  // Get repository statistics
  const getRepositoryStats = useCallback(async () => {
    const totalPrompts = state.prompts.length;
    const totalConventions = state.namingConventions.length;
    const totalStructures = state.folderStructures.length;

    // Find most used category
    const categoryCount = state.prompts.reduce((acc, prompt) => {
      acc[prompt.category] = (acc[prompt.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedCategory = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    return {
      totalPrompts,
      totalConventions,
      totalStructures,
      mostUsedCategory
    };
  }, [state.prompts, state.namingConventions, state.folderStructures]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    if (companyId) {
      fetchOperationalData();
    }
  }, [companyId, fetchOperationalData]);

  const actions: OperationalQueriesActions = {
    refreshAll: fetchOperationalData,
    searchPrompts,
    validateNamingConvention,
    getPromptsByCategory,
    getFolderStructuresByIndustry,
    getRepositoryStats
  };

  return {
    ...state,
    actions
  };
};

// Specialized hook for prompt templates only
export const usePromptTemplates = (category?: string) => {
  const { prompts, loading, error, actions } = useOperationalQueries({ 
    category,
    isActive: true 
  });

  return {
    prompts,
    loading,
    error,
    searchPrompts: actions.searchPrompts,
    refresh: actions.refreshAll
  };
};

// Specialized hook for naming conventions only
export const useNamingConventions = (department?: string) => {
  const { namingConventions, loading, error, actions } = useOperationalQueries({ 
    department,
    isActive: true 
  });

  return {
    conventions: namingConventions,
    loading,
    error,
    validate: actions.validateNamingConvention,
    refresh: actions.refreshAll
  };
};
