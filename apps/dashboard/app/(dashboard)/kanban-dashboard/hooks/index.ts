/**
 * Kanban Hooks - Centralized exports for all kanban-related hooks
 * 
 * This file provides a single entry point for importing all kanban hooks,
 * making imports cleaner and more maintainable across the application.
 */

export { useKanbanData } from './useKanbanData';
export { useKanbanFilters } from './useKanbanFilters';

// Re-export types for convenience
export type { 
  Task, 
  Column, 
  Board, 
  KanbanFilters,
  UseKanbanBoard,
  UseKanbanTasks,
  TaskFormData,
  ColumnFormData,
  BoardFormData
} from '../types';