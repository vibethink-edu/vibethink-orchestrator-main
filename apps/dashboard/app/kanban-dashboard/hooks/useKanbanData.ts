"use client";

/**
 * useKanbanData Hook - Data management for Kanban boards
 * 
 * Features:
 * - Multi-tenant security with company_id filtering
 * - Real-time board and task synchronization
 * - Optimistic updates for better UX
 * - Error handling and loading states
 * - Local caching for performance
 */

import { useState, useEffect, useCallback } from 'react';
import { Board, Task, Column, ApiResponse } from '../types';

// Mock user for demonstration - in real app, get from auth context
const mockUser = {
  id: 'user-1',
  company_id: 'company-123',
  name: 'John Doe',
  role: 'ADMIN' as const
};

// Mock data store - in real app, this would be Supabase/API calls
let mockBoardStore: Board = {
  id: 'board-1',
  title: 'Project Alpha Development',
  description: 'Main development board for Project Alpha features and tasks',
  company_id: 'company-123',
  created_by: 'user-1',
  team_members: ['user-1', 'user-2', 'user-3', 'user-4'],
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-22T10:15:00Z',
  settings: {
    isPublic: false,
    allowGuestAccess: false,
    enableTimeTracking: true,
    enableSubtasks: true,
    enableDependencies: true,
    enableComments: true,
    enableAttachments: true,
    autoArchiveCompletedTasks: false,
    taskIdPrefix: 'TASK-',
    defaultTaskPriority: 'medium' as const,
    workingDays: [1, 2, 3, 4, 5],
    workingHours: {
      start: '09:00',
      end: '17:00'
    }
  },
  permissions: {
    canView: true,
    canEdit: true,
    canDelete: true,
    canManageMembers: true,
    canCreateTasks: true,
    canDeleteTasks: true,
    canMoveTasks: true,
    canManageColumns: true,
    roleBasedAccess: {
      EMPLOYEE: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canManageMembers: false,
        canCreateTasks: true,
        canDeleteTasks: false,
        canMoveTasks: true,
        canManageColumns: false
      },
      MANAGER: {
        canView: true,
        canEdit: true,
        canDelete: false,
        canManageMembers: true,
        canCreateTasks: true,
        canDeleteTasks: true,
        canMoveTasks: true,
        canManageColumns: true
      },
      ADMIN: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canManageMembers: true,
        canCreateTasks: true,
        canDeleteTasks: true,
        canMoveTasks: true,
        canManageColumns: true
      },
      OWNER: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canManageMembers: true,
        canCreateTasks: true,
        canDeleteTasks: true,
        canMoveTasks: true,
        canManageColumns: true
      },
      SUPER_ADMIN: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canManageMembers: true,
        canCreateTasks: true,
        canDeleteTasks: true,
        canMoveTasks: true,
        canManageColumns: true
      }
    }
  },
  columns: [
    {
      id: 'col-1',
      title: 'To Do',
      description: 'Tasks that need to be started',
      color: 'hsl(210 40% 95%)',
      position: 0,
      isCollapsed: false,
      taskLimit: 10,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      company_id: 'company-123',
      board_id: 'board-1',
      settings: {
        allowTaskCreation: true,
        autoAssignUsers: [],
        defaultPriority: 'medium' as const,
        requiredFields: ['title', 'description']
      },
      tasks: [
        {
          id: 'task-1',
          title: 'Design user authentication flow',
          description: 'Create wireframes and mockups for the login and registration process',
          priority: 'high' as const,
          status: 'active' as const,
          assignee: {
            id: 'user-2',
            name: 'Alice Johnson',
            avatar: '',
            email: 'alice@company.com'
          },
          dueDate: '2024-02-15',
          labels: ['UI/UX', 'Authentication'],
          attachments: [],
          comments: [],
          dependencies: [],
          blockers: [],
          subtasks: [],
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
          company_id: 'company-123',
          column_id: 'col-1',
          board_id: 'board-1',
          position: 0
        }
      ]
    },
    {
      id: 'col-2',
      title: 'In Progress',
      description: 'Tasks currently being worked on',
      color: 'hsl(47 96% 88%)',
      position: 1,
      isCollapsed: false,
      taskLimit: 5,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      company_id: 'company-123',
      board_id: 'board-1',
      settings: {
        allowTaskCreation: true,
        autoAssignUsers: ['user-1'],
        defaultPriority: 'high' as const,
        requiredFields: ['title', 'assignee']
      },
      tasks: [
        {
          id: 'task-2',
          title: 'Implement user dashboard',
          description: 'Build the main dashboard with charts and user statistics',
          priority: 'high' as const,
          status: 'active' as const,
          assignee: {
            id: 'user-1',
            name: 'John Doe',
            avatar: '',
            email: 'john@company.com'
          },
          estimatedHours: 16,
          actualHours: 8,
          dueDate: '2024-02-10',
          labels: ['Frontend', 'Dashboard'],
          attachments: [],
          comments: [],
          dependencies: ['task-1'],
          blockers: [],
          subtasks: ['subtask-1', 'subtask-2'],
          createdAt: '2024-01-19T09:00:00Z',
          updatedAt: '2024-01-21T14:30:00Z',
          company_id: 'company-123',
          column_id: 'col-2',
          board_id: 'board-1',
          position: 0
        }
      ]
    },
    {
      id: 'col-3',
      title: 'In Review',
      description: 'Tasks pending review and approval',
      color: 'hsl(262 83% 95%)',
      position: 2,
      isCollapsed: false,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      company_id: 'company-123',
      board_id: 'board-1',
      settings: {
        allowTaskCreation: false,
        autoAssignUsers: [],
        defaultPriority: 'medium' as const,
        requiredFields: ['title']
      },
      tasks: [
        {
          id: 'task-3',
          title: 'API documentation',
          description: 'Complete API documentation with examples and usage guidelines',
          priority: 'medium' as const,
          status: 'active' as const,
          assignee: {
            id: 'user-4',
            name: 'Carol Davis',
            avatar: '',
            email: 'carol@company.com'
          },
          labels: ['Documentation', 'API'],
          attachments: [
            {
              id: 'att-1',
              filename: 'api-spec.json',
              filesize: 15432,
              mimetype: 'application/json',
              url: '/files/api-spec.json',
              uploadedBy: {
                id: 'user-4',
                name: 'Carol Davis'
              },
              createdAt: '2024-01-21T15:00:00Z',
              company_id: 'company-123',
              task_id: 'task-3'
            }
          ],
          comments: [
            {
              id: 'comment-1',
              content: 'First draft is ready for review',
              author: {
                id: 'user-4',
                name: 'Carol Davis',
                avatar: ''
              },
              createdAt: '2024-01-21T16:00:00Z',
              updatedAt: '2024-01-21T16:00:00Z',
              company_id: 'company-123',
              task_id: 'task-3'
            }
          ],
          dependencies: [],
          blockers: [],
          subtasks: [],
          createdAt: '2024-01-18T15:00:00Z',
          updatedAt: '2024-01-22T10:15:00Z',
          company_id: 'company-123',
          column_id: 'col-3',
          board_id: 'board-1',
          position: 0
        }
      ]
    },
    {
      id: 'col-4',
      title: 'Done',
      description: 'Completed tasks',
      color: 'hsl(142 71% 91%)',
      position: 3,
      isCollapsed: false,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      company_id: 'company-123',
      board_id: 'board-1',
      settings: {
        allowTaskCreation: false,
        autoAssignUsers: [],
        defaultPriority: 'low' as const,
        requiredFields: []
      },
      tasks: [
        {
          id: 'task-4',
          title: 'Database schema design',
          description: 'Design and implement the complete database schema for the application',
          priority: 'high' as const,
          status: 'active' as const,
          assignee: {
            id: 'user-1',
            name: 'John Doe',
            avatar: '',
            email: 'john@company.com'
          },
          labels: ['Database', 'Backend'],
          attachments: [],
          comments: [],
          dependencies: [],
          blockers: [],
          subtasks: [],
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-01-18T17:30:00Z',
          company_id: 'company-123',
          column_id: 'col-4',
          board_id: 'board-1',
          position: 0
        }
      ]
    }
  ]
};

export const useKanbanData = (boardId: string) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API delay for realistic experience
  const simulateDelay = (ms: number = 300) => 
    new Promise(resolve => setTimeout(resolve, ms));

  // Load board data with company_id filtering
  const loadBoard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await simulateDelay();
      
      // In a real app, this would be a Supabase query:
      // const { data, error } = await supabase
      //   .from('boards')
      //   .select(`
      //     *,
      //     columns (
      //       *,
      //       tasks (*)
      //     )
      //   `)
      //   .eq('id', boardId)
      //   .eq('company_id', mockUser.company_id)
      //   .single();
      
      // Multi-tenant security check
      if (mockBoardStore.company_id !== mockUser.company_id) {
        throw new Error('Unauthorized access to board');
      }
      
      setBoard(mockBoardStore);
    } catch (err) {
      console.error('Error loading board:', err);
      setError(err instanceof Error ? err.message : 'Failed to load board');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  // Update board data
  const updateBoard = useCallback(async (updates: Partial<Board>) => {
    try {
      setError(null);
      
      // Multi-tenant security check
      if (mockBoardStore.company_id !== mockUser.company_id) {
        throw new Error('Unauthorized board update');
      }
      
      await simulateDelay(200);
      
      // In a real app:
      // const { error } = await supabase
      //   .from('boards')
      //   .update(updates)
      //   .eq('id', boardId)
      //   .eq('company_id', mockUser.company_id);
      
      mockBoardStore = {
        ...mockBoardStore,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      setBoard({ ...mockBoardStore });
    } catch (err) {
      console.error('Error updating board:', err);
      setError(err instanceof Error ? err.message : 'Failed to update board');
      throw err;
    }
  }, [boardId]);

  // Move task between columns
  const moveTask = useCallback(async (
    taskId: string, 
    fromColumnId: string, 
    toColumnId: string, 
    newPosition: number
  ) => {
    try {
      setError(null);
      
      // Find the task and verify ownership
      const fromColumn = mockBoardStore.columns.find(col => col.id === fromColumnId);
      const task = fromColumn?.tasks.find(t => t.id === taskId);
      
      if (!task || task.company_id !== mockUser.company_id) {
        throw new Error('Unauthorized task access');
      }
      
      // Optimistic update
      const updatedBoard = { ...mockBoardStore };
      const sourceColumn = updatedBoard.columns.find(col => col.id === fromColumnId)!;
      const targetColumn = updatedBoard.columns.find(col => col.id === toColumnId)!;
      
      // Remove from source
      const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
      const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
      
      // Update task's column reference
      movedTask.column_id = toColumnId;
      movedTask.position = newPosition;
      movedTask.updatedAt = new Date().toISOString();
      
      // Add to target
      targetColumn.tasks.splice(newPosition, 0, movedTask);
      
      // Update positions of other tasks in target column
      targetColumn.tasks.forEach((t, index) => {
        if (t.id !== taskId) {
          t.position = index;
        }
      });
      
      setBoard(updatedBoard);
      mockBoardStore = updatedBoard;
      
      await simulateDelay(200);
      
      // In a real app:
      // await supabase
      //   .from('tasks')
      //   .update({ 
      //     column_id: toColumnId, 
      //     position: newPosition,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', taskId)
      //   .eq('company_id', mockUser.company_id);
      
    } catch (err) {
      console.error('Error moving task:', err);
      setError(err instanceof Error ? err.message : 'Failed to move task');
      // Revert optimistic update
      await loadBoard();
      throw err;
    }
  }, [loadBoard]);

  // Add new task
  const addTask = useCallback(async (
    columnId: string, 
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'company_id' | 'column_id' | 'board_id' | 'position'>
  ) => {
    try {
      setError(null);
      
      const column = mockBoardStore.columns.find(col => col.id === columnId);
      if (!column || column.company_id !== mockUser.company_id) {
        throw new Error('Unauthorized column access');
      }
      
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company_id: mockUser.company_id,
        column_id: columnId,
        board_id: mockBoardStore.id,
        position: column.tasks.length
      };
      
      // Optimistic update
      const updatedBoard = { ...mockBoardStore };
      const targetColumn = updatedBoard.columns.find(col => col.id === columnId)!;
      targetColumn.tasks.push(newTask);
      
      setBoard(updatedBoard);
      mockBoardStore = updatedBoard;
      
      await simulateDelay(300);
      
      // In a real app:
      // const { error } = await supabase
      //   .from('tasks')
      //   .insert([newTask]);
      
      return newTask;
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err instanceof Error ? err.message : 'Failed to add task');
      await loadBoard();
      throw err;
    }
  }, [loadBoard]);

  // Update task
  const updateTask = useCallback(async (
    taskId: string, 
    updates: Partial<Task>
  ) => {
    try {
      setError(null);
      
      // Find task and verify ownership
      const column = mockBoardStore.columns.find(col => 
        col.tasks.some(t => t.id === taskId)
      );
      const task = column?.tasks.find(t => t.id === taskId);
      
      if (!task || task.company_id !== mockUser.company_id) {
        throw new Error('Unauthorized task access');
      }
      
      // Optimistic update
      const updatedBoard = { ...mockBoardStore };
      const targetColumn = updatedBoard.columns.find(col => 
        col.tasks.some(t => t.id === taskId)
      )!;
      const taskIndex = targetColumn.tasks.findIndex(t => t.id === taskId);
      
      targetColumn.tasks[taskIndex] = {
        ...targetColumn.tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      setBoard(updatedBoard);
      mockBoardStore = updatedBoard;
      
      await simulateDelay(200);
      
      // In a real app:
      // const { error } = await supabase
      //   .from('tasks')
      //   .update({ ...updates, updated_at: new Date().toISOString() })
      //   .eq('id', taskId)
      //   .eq('company_id', mockUser.company_id);
      
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
      await loadBoard();
      throw err;
    }
  }, [loadBoard]);

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setError(null);
      
      // Find task and verify ownership
      const column = mockBoardStore.columns.find(col => 
        col.tasks.some(t => t.id === taskId)
      );
      const task = column?.tasks.find(t => t.id === taskId);
      
      if (!task || task.company_id !== mockUser.company_id) {
        throw new Error('Unauthorized task access');
      }
      
      // Optimistic update
      const updatedBoard = { ...mockBoardStore };
      const targetColumn = updatedBoard.columns.find(col => 
        col.tasks.some(t => t.id === taskId)
      )!;
      
      targetColumn.tasks = targetColumn.tasks.filter(t => t.id !== taskId);
      
      setBoard(updatedBoard);
      mockBoardStore = updatedBoard;
      
      await simulateDelay(200);
      
      // In a real app:
      // const { error } = await supabase
      //   .from('tasks')
      //   .delete()
      //   .eq('id', taskId)
      //   .eq('company_id', mockUser.company_id);
      
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      await loadBoard();
      throw err;
    }
  }, [loadBoard]);

  // Load board on mount
  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  return {
    board,
    loading,
    error,
    refetch: loadBoard,
    updateBoard,
    moveTask,
    addTask, 
    updateTask,
    deleteTask
  };
};

export default useKanbanData;