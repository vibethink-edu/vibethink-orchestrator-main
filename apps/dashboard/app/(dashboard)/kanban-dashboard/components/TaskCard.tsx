"use client";

/**
 * TaskCard Component - Individual task display and interaction
 * 
 * Features:
 * - Drag and drop support
 * - Priority indicators with HSL colors
 * - Due date warnings and overdue detection
 * - Assignee display with avatars
 * - Label and attachment indicators
 * - Quick actions menu
 * - Mobile-responsive design
 * - Multi-tenant security compliance
 */

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { 
  MoreHorizontal, 
  Calendar, 
  Flag, 
  Paperclip, 
  MessageSquare, 
  Clock,
  User,
  Edit,
  Trash2,
  Copy,
  Archive
} from 'lucide-react';
import { Task, TaskCardProps } from '../types';
import { Button } from '@vibethink/ui';
import { Badge } from '@vibethink/ui';
import { Card, CardContent } from '@vibethink/ui';
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger, } from '@vibethink/ui';
import { Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger, } from '@vibethink/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@vibethink/ui';

// Priority colors using HSL for theme compatibility
const priorityColors = {
  low: 'hsl(142 76% 36%)',
  medium: 'hsl(47 96% 53%)',
  high: 'hsl(25 95% 53%)',
  urgent: 'hsl(0 84% 60%)'
};

// Priority background colors (lighter variants)
const priorityBackgrounds = {
  low: 'hsl(142 76% 96%)',
  medium: 'hsl(47 96% 96%)',
  high: 'hsl(25 95% 96%)',
  urgent: 'hsl(0 84% 96%)'
};

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  index, 
  onEdit, 
  onDelete, 
  onAssign,
  isDragging = false 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Date formatting utilities
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateColor = (dueDate: string) => {
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return 'text-destructive';
    if (daysUntil <= 1) return 'text-orange-500';
    if (daysUntil <= 3) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle menu actions
  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit(task);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const handleDuplicate = () => {
    setIsMenuOpen(false);
    // Implementation would duplicate the task
    console.log('Duplicating task:', task.id);
  };

  const handleArchive = () => {
    setIsMenuOpen(false);
    // Implementation would archive the task
    console.log('Archiving task:', task.id);
  };

  return (
    <TooltipProvider>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${
              snapshot.isDragging ? 'rotate-1 shadow-xl scale-105' : ''
            } transition-all duration-200`}
          >
            <Card className={`
              mb-3 cursor-grab active:cursor-grabbing 
              hover:shadow-md transition-all duration-200 
              bg-card border-border/50 group
              ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary/20' : ''}
            `}>
              <CardContent className="p-4">
                {/* Task Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm leading-5 text-foreground line-clamp-2 mb-1">
                      {task.title}
                    </h4>
                    {/* Task ID display for reference */}
                    <div className="text-xs text-muted-foreground font-mono">
                      #{task.id.slice(-8)}
                    </div>
                  </div>
                  
                  <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="h-3 w-3 mr-2" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDuplicate}>
                        <Copy className="h-3 w-3 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleArchive}>
                        <Archive className="h-3 w-3 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={handleDelete}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Task Description */}
                {task.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Labels */}
                {task.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {task.labels.slice(0, 3).map((label, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs px-2 py-1 bg-secondary/80 text-secondary-foreground"
                      >
                        {label}
                      </Badge>
                    ))}
                    {task.labels.length > 3 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-1"
                          >
                            +{task.labels.length - 3}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-48">
                            {task.labels.slice(3).join(', ')}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                )}

                {/* Task Indicators */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Attachments indicator */}
                    {task.attachments && task.attachments.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Paperclip className="h-3 w-3 mr-1" />
                            <span>{task.attachments.length}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {task.attachments.length} attachment{task.attachments.length !== 1 ? 's' : ''}
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Comments indicator */}
                    {task.comments && task.comments.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span>{task.comments.length}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Time tracking */}
                    {task.estimatedHours && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{task.estimatedHours}h</span>
                            {task.actualHours && (
                              <span className="ml-1">/ {task.actualHours}h</span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Estimated: {task.estimatedHours}h
                          {task.actualHours && <><br />Actual: {task.actualHours}h</>}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>

                {/* Task Footer */}
                <div className="flex items-center justify-between">
                  {/* Left side - Priority and Due Date */}
                  <div className="flex items-center gap-2">
                    {/* Priority indicator */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge 
                          variant="outline" 
                          className="text-xs border px-2 py-1 capitalize"
                          style={{ 
                            borderColor: priorityColors[task.priority],
                            color: priorityColors[task.priority],
                            backgroundColor: priorityBackgrounds[task.priority]
                          }}
                        >
                          <Flag className="h-2 w-2 mr-1" />
                          {task.priority}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        Priority: {task.priority}
                      </TooltipContent>
                    </Tooltip>

                    {/* Due date */}
                    {task.dueDate && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center text-xs ${getDueDateColor(task.dueDate)}`}>
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                          {getDaysUntilDue(task.dueDate) < 0 && (
                            <div className="text-destructive font-medium">
                              Overdue by {Math.abs(getDaysUntilDue(task.dueDate))} day{Math.abs(getDaysUntilDue(task.dueDate)) !== 1 ? 's' : ''}
                            </div>
                          )}
                          {getDaysUntilDue(task.dueDate) === 0 && (
                            <div className="text-orange-500 font-medium">
                              Due today
                            </div>
                          )}
                          {getDaysUntilDue(task.dueDate) === 1 && (
                            <div className="text-orange-500 font-medium">
                              Due tomorrow
                            </div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  {/* Right side - Assignee */}
                  <div className="flex items-center gap-1">
                    {task.assignee ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-6 w-6 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                            <AvatarImage 
                              src={task.assignee.avatar} 
                              alt={task.assignee.name} 
                            />
                            <AvatarFallback className="text-xs font-medium">
                              {getInitials(task.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          Assigned to {task.assignee.name}
                          {task.assignee.email && (
                            <div className="text-xs text-muted-foreground">
                              {task.assignee.email}
                            </div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-accent"
                            onClick={() => {
                              // Open assign dialog or trigger assignment
                              console.log('Assign task:', task.id);
                            }}
                          >
                            <User className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Click to assign
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Subtasks indicator */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="text-xs h-5 px-1">
                            {task.subtasks.filter(st => st.includes('completed')).length}/{task.subtasks.length}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          Subtasks progress
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>

                {/* Progress bar for subtasks */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-secondary/50 rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(task.subtasks.filter(st => st.includes('completed')).length / task.subtasks.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    </TooltipProvider>
  );
};

export default TaskCard;
