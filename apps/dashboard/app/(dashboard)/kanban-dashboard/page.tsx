"use client";

/**
 * Kanban Application - Complete Task Management System
 * 
 * Features:
 * - Multi-tenant security with company_id filtering
 * - Drag & drop task management between columns
 * - Advanced filtering and search capabilities
 * - Real-time collaboration (mock implementation)
 * - Responsive design for all devices
 * - Theme integration with HSL color variables
 * 
 * Architecture:
 * - Uses DashboardLayout for consistent design
 * - Custom hooks for data management and filtering
 * - TypeScript strict mode compliance
 * - shadcn/ui components for UI consistency
 */

import React, { useState, Suspense } from 'react';
;
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Plus, Search, Filter, Clock, AlertCircle, TrendingUp, Users, Target } from 'lucide-react';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Card, CardContent } from '@/shared/components/bundui-premium/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/bundui-premium/components/ui/select';
import { Skeleton } from '@/shared/components/bundui-premium/components/ui/skeleton';
import { useKanbanData, useKanbanFilters } from './hooks';
import KanbanColumn from './components/KanbanColumn';

// Main Kanban Page Component
function KanbanPageInner() {
  // Hooks for data management and filtering
  const { 
    board, 
    loading, 
    error, 
    moveTask, 
    addTask, 
    updateTask, 
    deleteTask 
  } = useKanbanData('board-1');
  
  const { 
    filters, 
    updateFilters, 
    resetFilters, 
    hasActiveFilters, 
    filterColumns, 
    getFilterStats, 
    getFilterOptions 
  } = useKanbanFilters();

  // Handle drag and drop operations
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      await moveTask(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index
      );
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  // Handle column actions
  const handleAddTask = (columnId: string) => {
    console.log('Add task to column:', columnId);
    // In a real app, this would open a task creation dialog
  };

  const handleEditColumn = (column: any) => {
    console.log('Edit column:', column.id);
    // In a real app, this would open a column editing dialog
  };

  const handleDeleteColumn = (columnId: string) => {
    console.log('Delete column:', columnId);
    // In a real app, this would delete the column after confirmation
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-3 w-16" />
              </Card>
            ))}
          </div>

          {/* Board skeleton */}
          <div className="flex gap-6 overflow-x-auto pb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-80 flex-shrink-0">
                <Card className="h-96 bg-muted/20">
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <div className="space-y-3">
                      {[...Array(3)].map((_, j) => (
                        <Skeleton key={j} className="h-24 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Error Loading Board
              </h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Target className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Board Not Found
              </h3>
              <p className="text-muted-foreground">
                The requested kanban board could not be found.
              </p>
            </div>
          </div>
      </div>
    );
  }

  // Get filtered columns and statistics
  const filteredColumns = filterColumns(board.columns);
  const filterStats = getFilterStats(board.columns, filteredColumns);
  const filterOptions = getFilterOptions(board.columns);

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {board.title}
            </h1>
            <p className="text-muted-foreground">
              {board.description}
            </p>
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {filterStats.filteredTasks} of {filterStats.totalTasks} tasks shown
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-6 text-xs"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-48"
              />
            </div>

            {/* Priority Filter */}
            <Select 
              value={filters.priority} 
              onValueChange={(value: any) => updateFilters({ priority: value })}
            >
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">
                  Low ({filterOptions.priorityCounts.low})
                </SelectItem>
                <SelectItem value="medium">
                  Medium ({filterOptions.priorityCounts.medium})
                </SelectItem>
                <SelectItem value="high">
                  High ({filterOptions.priorityCounts.high})
                </SelectItem>
                <SelectItem value="urgent">
                  Urgent ({filterOptions.priorityCounts.urgent})
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Assignee Filter */}
            <Select 
              value={filters.assignee} 
              onValueChange={(value) => updateFilters({ assignee: value })}
            >
              <SelectTrigger className="w-36">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {filterOptions.assignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add Column Button */}
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>
        </div>

        {/* Board Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredColumns.map((column) => {
            const originalColumn = board.columns.find(c => c.id === column.id);
            const originalTaskCount = originalColumn?.tasks.length || 0;
            const filteredTaskCount = column.tasks.length;
            const highPriorityTasks = column.tasks.filter(
              t => t.priority === 'high' || t.priority === 'urgent'
            ).length;
            const overdueTasks = column.tasks.filter(
              t => t.dueDate && new Date(t.dueDate) < new Date()
            ).length;

            return (
              <Card key={column.id} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <h4 className="font-medium text-sm truncate">{column.title}</h4>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-2xl font-bold">
                    {filteredTaskCount}
                  </p>
                  {hasActiveFilters && originalTaskCount !== filteredTaskCount && (
                    <span className="text-xs text-muted-foreground">
                      of {originalTaskCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {highPriorityTasks > 0 && (
                    <div className="flex items-center gap-1 text-orange-500">
                      <TrendingUp className="h-3 w-3" />
                      <span>{highPriorityTasks}</span>
                    </div>
                  )}
                  {overdueTasks > 0 && (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      <span>{overdueTasks}</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Kanban Board */}
        <div className="relative">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-6">
              {filteredColumns.map((column, index) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  index={index}
                  onAddTask={handleAddTask}
                  onEditColumn={handleEditColumn}
                  onDeleteColumn={handleDeleteColumn}
                />
              ))}
            </div>
          </DragDropContext>
        </div>

        {/* Board Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {hasActiveFilters ? (
              <>
                Showing {filterStats.filteredTasks} of {filterStats.totalTasks} tasks
                {filterStats.hiddenTasks > 0 && (
                  <span className="ml-2 text-orange-600">
                    ({filterStats.hiddenTasks} hidden by filters)
                  </span>
                )}
              </>
            ) : (
              <>Total tasks: {filterStats.totalTasks}</>
            )}
            {' • '}Company: {board.company_id}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date(board.updatedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
  );
}

export default function KanbanPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading Kanban...</div>}>
      <KanbanPageInner />
    </Suspense>
  );
}