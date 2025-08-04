/**
 * Kanban Types - TypeScript definitions for the Kanban application
 * 
 * Features:
 * - Multi-tenant security with company_id on all entities
 * - Comprehensive task management types
 * - Role-based access control definitions
 * - Theme and UI configuration types
 */

// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';
  company_id: string; // Multi-tenant security
  created_at: string;
  updated_at: string;
}

// Task Management Types
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'archived' | 'deleted';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
  };
  reporter?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  labels: string[];
  attachments: TaskAttachment[];
  comments: TaskComment[];
  dependencies: string[]; // Array of task IDs this task depends on
  blockers: string[]; // Array of task IDs that block this task
  subtasks: string[]; // Array of subtask IDs
  parentTask?: string; // Parent task ID if this is a subtask
  createdAt: string;
  updatedAt: string;
  company_id: string; // Multi-tenant security
  column_id: string; // Reference to the column this task belongs to
  board_id: string; // Reference to the board this task belongs to
  position: number; // Position within the column for ordering
}

// Task Comments and Attachments
export interface TaskComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  company_id: string;
  task_id: string;
}

export interface TaskAttachment {
  id: string;
  filename: string;
  filesize: number;
  mimetype: string;
  url: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  company_id: string;
  task_id: string;
}

// Column Types
export interface Column {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  color: string; // HSL color value for theme compatibility
  position: number; // Order of columns in the board
  isCollapsed: boolean;
  taskLimit?: number; // WIP limit for the column
  settings: ColumnSettings;
  createdAt: string;
  updatedAt: string;
  company_id: string; // Multi-tenant security
  board_id: string; // Reference to the board this column belongs to
}

export interface ColumnSettings {
  allowTaskCreation: boolean;
  autoAssignUsers: string[]; // User IDs to auto-assign new tasks
  defaultPriority: Task['priority'];
  requiredFields: string[]; // Required fields when creating tasks in this column
}

// Board Types
export interface Board {
  id: string;
  title: string;
  description: string;
  columns: Column[];
  settings: BoardSettings;
  permissions: BoardPermissions;
  template?: BoardTemplate;
  createdAt: string;
  updatedAt: string;
  company_id: string; // Multi-tenant security
  created_by: string; // User ID who created the board
  team_members: string[]; // Array of user IDs with access to this board
}

export interface BoardSettings {
  isPublic: boolean;
  allowGuestAccess: boolean;
  enableTimeTracking: boolean;
  enableSubtasks: boolean;
  enableDependencies: boolean;
  enableComments: boolean;
  enableAttachments: boolean;
  autoArchiveCompletedTasks: boolean;
  taskIdPrefix: string; // Prefix for task IDs (e.g., "PROJ-")
  defaultTaskPriority: Task['priority'];
  workingDays: number[]; // Array of working days (0 = Sunday, 1 = Monday, etc.)
  workingHours: {
    start: string; // "09:00"
    end: string; // "17:00"
  };
}

export interface BoardPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageMembers: boolean;
  canCreateTasks: boolean;
  canDeleteTasks: boolean;
  canMoveTasks: boolean;
  canManageColumns: boolean;
  roleBasedAccess: {
    [key in User['role']]: Partial<BoardPermissions>;
  };
}

// Board Templates
export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  columns: Omit<Column, 'id' | 'tasks' | 'createdAt' | 'updatedAt' | 'company_id' | 'board_id'>[];
  defaultSettings: BoardSettings;
  category: 'software' | 'marketing' | 'hr' | 'general' | 'custom';
  isPublic: boolean;
  created_by: string;
  company_id: string;
}

// Drag and Drop Types
export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
  reason: 'DROP' | 'CANCEL';
}

// Filter and Search Types
export interface KanbanFilters {
  search: string;
  priority: Task['priority'] | 'all';
  assignee: string | 'all'; // User ID or 'all'
  labels: string[];
  dueDate: {
    from?: string;
    to?: string;
  };
  status: Task['status'] | 'all';
  hasAttachments: boolean | null;
  hasComments: boolean | null;
  overdue: boolean | null;
}

// Activity and Audit Types
export interface BoardActivity {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_moved' | 'task_deleted' | 'column_created' | 'column_updated' | 'column_deleted' | 'board_updated';
  description: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata: {
    task_id?: string;
    column_id?: string;
    from_column?: string;
    to_column?: string;
    changes?: Record<string, any>;
  };
  createdAt: string;
  company_id: string;
  board_id: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Webhook Types for Real-time Updates
export interface KanbanWebhookEvent {
  event: 'task_updated' | 'task_moved' | 'column_updated' | 'board_updated';
  data: {
    board_id: string;
    company_id: string;
    user_id: string;
    timestamp: string;
    payload: any;
  };
}

// Time Tracking Types
export interface TimeEntry {
  id: string;
  task_id: string;
  user_id: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration: number; // Duration in minutes
  billable: boolean;
  createdAt: string;
  updatedAt: string;
  company_id: string;
}

// Notification Types
export interface KanbanNotification {
  id: string;
  type: 'task_assigned' | 'task_due' | 'task_overdue' | 'task_completed' | 'comment_added' | 'board_shared';
  title: string;
  message: string;
  user_id: string;
  read: boolean;
  data: {
    task_id?: string;
    board_id?: string;
    comment_id?: string;
    url: string;
  };
  createdAt: string;
  company_id: string;
}

// Hook Return Types
export interface UseKanbanBoard {
  board: Board | null;
  loading: boolean;
  error: string | null;
  updateBoard: (updates: Partial<Board>) => Promise<void>;
  addColumn: (column: Omit<Column, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateColumn: (columnId: string, updates: Partial<Column>) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  reorderColumns: (columnIds: string[]) => Promise<void>;
}

export interface UseKanbanTasks {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, toColumnId: string, position: number) => Promise<void>;
  assignTask: (taskId: string, assigneeId: string) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  addAttachment: (taskId: string, file: File) => Promise<void>;
}

// Context Types
export interface KanbanContextType {
  currentBoard: Board | null;
  currentUser: User | null;
  filters: KanbanFilters;
  setFilters: (filters: Partial<KanbanFilters>) => void;
  isLoading: boolean;
  error: string | null;
}

// Component Props Types
export interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAssign: (taskId: string, assigneeId: string) => void;
  isDragging?: boolean;
}

export interface KanbanColumnProps {
  column: Column;
  index: number;
  onAddTask: (columnId: string) => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
}

export interface KanbanBoardProps {
  board: Board;
  onTaskMove: (result: DragResult) => void;
  filters: KanbanFilters;
  onFiltersChange: (filters: Partial<KanbanFilters>) => void;
}

// Form Types
export interface TaskFormData {
  title: string;
  description: string;
  priority: Task['priority'];
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  labels: string[];
  parentTaskId?: string;
}

export interface ColumnFormData {
  title: string;
  description?: string;
  color: string;
  taskLimit?: number;
  settings: ColumnSettings;
}

export interface BoardFormData {
  title: string;
  description: string;
  templateId?: string;
  settings: BoardSettings;
  teamMembers: string[];
}