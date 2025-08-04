"use client";

/**
 * useKanbanFilters Hook - Filter and search functionality for Kanban boards
 * 
 * Features:
 * - Advanced filtering by priority, assignee, labels, due dates
 * - Real-time search across task titles and descriptions
 * - Filter persistence in URL parameters
 * - Multi-tenant security compliance
 * - Performance optimized with debounced search
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Task, Column, KanbanFilters } from '../types';

// Default filter state
const defaultFilters: KanbanFilters = {
  search: '',
  priority: 'all',
  assignee: 'all',
  labels: [],
  dueDate: {},
  status: 'all',
  hasAttachments: null,
  hasComments: null,
  overdue: null
};

export const useKanbanFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<KanbanFilters>(() => {
    const urlFilters = { ...defaultFilters };
    
    // Parse URL parameters
    const search = searchParams.get('search');
    if (search) urlFilters.search = search;
    
    const priority = searchParams.get('priority');
    if (priority && ['low', 'medium', 'high', 'urgent', 'all'].includes(priority)) {
      urlFilters.priority = priority as KanbanFilters['priority'];
    }
    
    const assignee = searchParams.get('assignee');
    if (assignee) urlFilters.assignee = assignee;
    
    const labels = searchParams.get('labels');
    if (labels) {
      urlFilters.labels = labels.split(',').filter(Boolean);
    }
    
    const dueDateFrom = searchParams.get('dueDateFrom');
    const dueDateTo = searchParams.get('dueDateTo');
    if (dueDateFrom || dueDateTo) {
      urlFilters.dueDate = {
        from: dueDateFrom || undefined,
        to: dueDateTo || undefined
      };
    }
    
    const status = searchParams.get('status');
    if (status && ['active', 'archived', 'deleted', 'all'].includes(status)) {
      urlFilters.status = status as KanbanFilters['status'];
    }
    
    const hasAttachments = searchParams.get('hasAttachments');
    if (hasAttachments === 'true') urlFilters.hasAttachments = true;
    if (hasAttachments === 'false') urlFilters.hasAttachments = false;
    
    const hasComments = searchParams.get('hasComments');
    if (hasComments === 'true') urlFilters.hasComments = true;
    if (hasComments === 'false') urlFilters.hasComments = false;
    
    const overdue = searchParams.get('overdue');
    if (overdue === 'true') urlFilters.overdue = true;
    if (overdue === 'false') urlFilters.overdue = false;
    
    return urlFilters;
  });

  // Update URL when filters change
  const updateUrl = useCallback((newFilters: KanbanFilters) => {
    const params = new URLSearchParams();
    
    // Only add non-default values to URL
    if (newFilters.search && newFilters.search !== defaultFilters.search) {
      params.set('search', newFilters.search);
    }
    
    if (newFilters.priority !== defaultFilters.priority) {
      params.set('priority', newFilters.priority);
    }
    
    if (newFilters.assignee !== defaultFilters.assignee) {
      params.set('assignee', newFilters.assignee);
    }
    
    if (newFilters.labels.length > 0) {
      params.set('labels', newFilters.labels.join(','));
    }
    
    if (newFilters.dueDate.from) {
      params.set('dueDateFrom', newFilters.dueDate.from);
    }
    
    if (newFilters.dueDate.to) {
      params.set('dueDateTo', newFilters.dueDate.to);
    }
    
    if (newFilters.status !== defaultFilters.status) {
      params.set('status', newFilters.status);
    }
    
    if (newFilters.hasAttachments !== null) {
      params.set('hasAttachments', String(newFilters.hasAttachments));
    }
    
    if (newFilters.hasComments !== null) {
      params.set('hasComments', String(newFilters.hasComments));
    }
    
    if (newFilters.overdue !== null) {
      params.set('overdue', String(newFilters.overdue));
    }
    
    // Update URL without refreshing the page
    const newUrl = params.toString() ? `?${params.toString()}` : '/kanban';
    router.replace(newUrl, { scroll: false });
  }, [router]);

  // Update filters and URL
  const updateFilters = useCallback((updates: Partial<KanbanFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    updateUrl(newFilters);
  }, [filters, updateUrl]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    updateUrl(defaultFilters);
  }, [updateUrl]);

  // Check if task matches current filters
  const taskMatchesFilters = useCallback((task: Task): boolean => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchLower);
      const matchesDescription = task.description.toLowerCase().includes(searchLower);
      const matchesLabels = task.labels.some(label => 
        label.toLowerCase().includes(searchLower)
      );
      
      if (!matchesTitle && !matchesDescription && !matchesLabels) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Assignee filter
    if (filters.assignee !== 'all') {
      if (!task.assignee || task.assignee.id !== filters.assignee) {
        return false;
      }
    }

    // Labels filter
    if (filters.labels.length > 0) {
      const hasMatchingLabel = filters.labels.some(filterLabel =>
        task.labels.includes(filterLabel)
      );
      if (!hasMatchingLabel) {
        return false;
      }
    }

    // Due date filter
    if (filters.dueDate.from || filters.dueDate.to) {
      if (!task.dueDate) {
        return false;
      }
      
      const taskDate = new Date(task.dueDate);
      
      if (filters.dueDate.from) {
        const fromDate = new Date(filters.dueDate.from);
        if (taskDate < fromDate) {
          return false;
        }
      }
      
      if (filters.dueDate.to) {
        const toDate = new Date(filters.dueDate.to);
        if (taskDate > toDate) {
          return false;
        }
      }
    }

    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Attachments filter
    if (filters.hasAttachments !== null) {
      const hasAttachments = task.attachments && task.attachments.length > 0;
      if (filters.hasAttachments !== hasAttachments) {
        return false;
      }
    }

    // Comments filter
    if (filters.hasComments !== null) {
      const hasComments = task.comments && task.comments.length > 0;
      if (filters.hasComments !== hasComments) {
        return false;
      }
    }

    // Overdue filter
    if (filters.overdue !== null) {
      const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
      if (filters.overdue !== isOverdue) {
        return false;
      }
    }

    return true;
  }, [filters]);

  // Filter columns and their tasks
  const filterColumns = useCallback((columns: Column[]): Column[] => {
    return columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(taskMatchesFilters)
    }));
  }, [taskMatchesFilters]);

  // Get filter statistics
  const getFilterStats = useCallback((originalColumns: Column[], filteredColumns: Column[]) => {
    const originalTaskCount = originalColumns.reduce((sum, col) => sum + col.tasks.length, 0);
    const filteredTaskCount = filteredColumns.reduce((sum, col) => sum + col.tasks.length, 0);
    
    return {
      totalTasks: originalTaskCount,
      filteredTasks: filteredTaskCount,
      hiddenTasks: originalTaskCount - filteredTaskCount,
      isFiltering: filteredTaskCount < originalTaskCount
    };
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== defaultFilters.search ||
      filters.priority !== defaultFilters.priority ||
      filters.assignee !== defaultFilters.assignee ||
      filters.labels.length > 0 ||
      filters.dueDate.from !== undefined ||
      filters.dueDate.to !== undefined ||
      filters.status !== defaultFilters.status ||
      filters.hasAttachments !== null ||
      filters.hasComments !== null ||
      filters.overdue !== null
    );
  }, [filters]);

  // Get available filter options from tasks
  const getFilterOptions = useCallback((columns: Column[]) => {
    const allTasks = columns.flatMap(col => col.tasks);
    
    // Get unique assignees
    const assignees = Array.from(
      new Map(
        allTasks
          .filter(task => task.assignee)
          .map(task => [task.assignee!.id, task.assignee!])
      ).values()
    );

    // Get unique labels
    const labels = Array.from(
      new Set(allTasks.flatMap(task => task.labels))
    ).sort();

    // Get priority counts
    const priorityCounts = {
      low: allTasks.filter(t => t.priority === 'low').length,
      medium: allTasks.filter(t => t.priority === 'medium').length,
      high: allTasks.filter(t => t.priority === 'high').length,
      urgent: allTasks.filter(t => t.priority === 'urgent').length
    };

    return {
      assignees,
      labels,
      priorityCounts,
      totalTasks: allTasks.length
    };
  }, []);

  // Debounced search update
  useEffect(() => {
    if (filters.search !== searchParams.get('search')) {
      const timeoutId = setTimeout(() => {
        updateUrl(filters);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [filters.search, searchParams, updateUrl, filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    taskMatchesFilters,
    filterColumns,
    getFilterStats,
    getFilterOptions
  };
};

export default useKanbanFilters;