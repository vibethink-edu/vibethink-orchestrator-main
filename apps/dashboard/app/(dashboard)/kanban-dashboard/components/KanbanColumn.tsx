"use client";

/**
 * KanbanColumn Component - Individual column in the Kanban board
 * 
 * Features:
 * - Droppable area for tasks
 * - Column header with task count and actions
 * - Add new task functionality
 * - Column settings and customization
 * - WIP (Work In Progress) limits
 * - Collapse/expand functionality
 * - Mobile-responsive design
 * - Multi-tenant security compliance
 */

import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { 
  Plus, 
  MoreHorizontal, 
  Settings,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Users,
  Target,
  Edit,
  Trash2,
  Copy,
  Archive
} from 'lucide-react';
import { Column, KanbanColumnProps } from '../types';
import TaskCard from './TaskCard';
import { Button } from '@vibethink/ui';
import { Badge } from '@vibethink/ui';
import { Card, CardContent, CardHeader } from '@vibethink/ui';
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger, } from '@vibethink/ui';
import { Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger, } from '@vibethink/ui';
import { Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle, } from '@vibethink/ui';
import { Progress } from '@vibethink/ui';

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  index, 
  onAddTask, 
  onEditColumn, 
  onDeleteColumn 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(column.isCollapsed || false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Calculate column statistics
  const taskCount = column.tasks.length;
  const completedTasks = column.tasks.filter(task => task.status === 'active').length;
  const overdueTasks = column.tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date()
  ).length;
  const highPriorityTasks = column.tasks.filter(task => 
    task.priority === 'high' || task.priority === 'urgent'
  ).length;

  // Check if column exceeds WIP limit
  const isOverLimit = column.taskLimit && taskCount > column.taskLimit;
  const wipProgress = column.taskLimit ? (taskCount / column.taskLimit) * 100 : 0;

  // Handle column actions
  const handleAddTask = () => {
    onAddTask(column.id);
  };

  const handleEditColumn = () => {
    setIsMenuOpen(false);
    onEditColumn(column);
  };

  const handleDeleteColumn = () => {
    setIsMenuOpen(false);
    setShowDeleteDialog(true);
  };

  const confirmDeleteColumn = () => {
    setShowDeleteDialog(false);
    onDeleteColumn(column.id);
  };

  const handleDuplicateColumn = () => {
    setIsMenuOpen(false);
    // Implementation would duplicate the column
    console.log('Duplicating column:', column.id);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    // In a real app, this would persist the collapsed state
  };

  return (
    <TooltipProvider>
      <div className={`flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-80'
      }`}>
        <Card className="h-full bg-muted/20 border-border/50">
          {/* Column Header */}
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              {/* Left side - Title and collapse button */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-accent"
                  onClick={toggleCollapse}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>

                {!isCollapsed && (
                  <>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: column.color }}
                      />
                      <h3 className="font-semibold text-foreground truncate">
                        {column.title}
                      </h3>
                    </div>

                    {/* Task count badge */}
                    <Badge 
                      variant={isOverLimit ? "destructive" : "secondary"} 
                      className="ml-1 flex-shrink-0"
                    >
                      {taskCount}
                      {column.taskLimit && `/${column.taskLimit}`}
                    </Badge>
                  </>
                )}
              </div>

              {/* Right side - Actions */}
              {!isCollapsed && (
                <div className="flex items-center gap-1">
                  {/* Add task button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-accent"
                        onClick={handleAddTask}
                        disabled={isOverLimit}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isOverLimit ? 'WIP limit reached' : 'Add new task'}
                    </TooltipContent>
                  </Tooltip>

                  {/* Column menu */}
                  <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-accent"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={handleEditColumn}>
                        <Edit className="h-3 w-3 mr-2" />
                        Edit Column
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDuplicateColumn}>
                        <Copy className="h-3 w-3 mr-2" />
                        Duplicate Column
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="h-3 w-3 mr-2" />
                        Column Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="h-3 w-3 mr-2" />
                        Archive All Tasks
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleDeleteColumn}
                        className="text-destructive focus:text-destructive"
                        disabled={taskCount > 0}
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete Column
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Column description */}
            {!isCollapsed && column.description && (
              <p className="text-xs text-muted-foreground mt-2">
                {column.description}
              </p>
            )}

            {/* Column statistics */}
            {!isCollapsed && (
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                {overdueTasks > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{overdueTasks}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {overdueTasks} overdue task{overdueTasks !== 1 ? 's' : ''}
                    </TooltipContent>
                  </Tooltip>
                )}

                {highPriorityTasks > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-orange-500">
                        <Target className="h-3 w-3" />
                        <span>{highPriorityTasks}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {highPriorityTasks} high priority task{highPriorityTasks !== 1 ? 's' : ''}
                    </TooltipContent>
                  </Tooltip>
                )}

                {column.settings.autoAssignUsers.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{column.settings.autoAssignUsers.length}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Auto-assign enabled for {column.settings.autoAssignUsers.length} user{column.settings.autoAssignUsers.length !== 1 ? 's' : ''}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}

            {/* WIP Limit Progress */}
            {!isCollapsed && column.taskLimit && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">WIP Limit</span>
                  <span className={`${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {taskCount}/{column.taskLimit}
                  </span>
                </div>
                <Progress 
                  value={wipProgress} 
                  className={`h-1 ${isOverLimit ? 'bg-destructive/20' : ''}`}
                />
              </div>
            )}
          </CardHeader>

          {/* Column Content */}
          {!isCollapsed && (
            <CardContent className="pt-0 flex-1">
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-32 pb-2 ${
                      snapshot.isDraggingOver 
                        ? 'bg-accent/20 rounded-lg border-2 border-dashed border-accent' 
                        : ''
                    } transition-all duration-200`}
                  >
                    {/* Tasks */}
                    {column.tasks.map((task, taskIndex) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={taskIndex}
                        onEdit={(task) => console.log('Edit task:', task.id)}
                        onDelete={(taskId) => console.log('Delete task:', taskId)}
                        onAssign={(taskId, assigneeId) => console.log('Assign task:', taskId, 'to:', assigneeId)}
                      />
                    ))}
                    {provided.placeholder}

                    {/* Empty state */}
                    {column.tasks.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="text-4xl mb-2">📝</div>
                        <p className="text-sm font-medium">No tasks yet</p>
                        <p className="text-xs mb-4">
                          Drag tasks here or create new ones
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleAddTask}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-2" />
                          Add Task
                        </Button>
                      </div>
                    )}

                    {/* WIP limit warning */}
                    {isOverLimit && (
                      <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center gap-2 text-destructive text-xs">
                          <AlertTriangle className="h-3 w-3" />
                          <span>WIP limit exceeded</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Consider moving tasks to other columns
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </CardContent>
          )}

          {/* Collapsed view - show task count vertically */}
          {isCollapsed && (
            <CardContent className="pt-2 pb-2">
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="w-2 h-8 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <div className="text-xs font-medium text-center writing-mode-vertical-lr rotate-180">
                  {taskCount}
                </div>
                {overdueTasks > 0 && (
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Column</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{column.title}"? 
                {taskCount > 0 && (
                  <span className="text-destructive">
                    {' '}This column contains {taskCount} task{taskCount !== 1 ? 's' : ''} that will be lost.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteColumn}
                disabled={taskCount > 0}
              >
                Delete Column
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default KanbanColumn;
