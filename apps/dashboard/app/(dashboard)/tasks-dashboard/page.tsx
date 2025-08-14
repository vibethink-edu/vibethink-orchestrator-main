/**
 * Tasks Management Dashboard Page
 * VibeThink Orchestrator
 * 
 * Complete task management dashboard with productivity features and team collaboration
 * Following VThink 1.0 methodology with multi-tenant security and DashboardLayout
 */

'use client'

import React, { useState } from 'react'
;
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { 
  ListTodo,
  Users,
  Plus,
  Download,
  BarChart3,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react'

// Import all task management components
import {
  TasksSummaryCards,
  TasksHeader,
  TasksOverviewChart,
  TaskPriorityChart,
  ProductivityAnalytics,
  RecentTasksTable,
  TaskMetrics,
  TasksReports,
  TaskReminders,
  CreateTaskDialog,
  TaskFiltersPanel,
  TeamWorkloadChart,
  TaskCompletionTrends
} from './components'

// Import hooks for data management
import { useTaskData } from './hooks/useTaskData'
import { Task, TaskFilters } from './types'

export default function TasksManagementPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({})

  const { tasks, teamMembers, taskMetrics, isLoading } = useTaskData(filters)

  const handleCreateTask = () => {
    setIsCreateTaskDialogOpen(true)
    setSelectedTask(null)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsCreateTaskDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    // TODO: Implement delete confirmation and deletion
    console.log('Delete task:', taskId)
  }

  const handleViewTask = (task: Task) => {
    // TODO: Navigate to task detail page or open task modal
    console.log('View task:', task.title)
  }

  const handleExportData = () => {
    // TODO: Implement data export functionality
    console.log('Export task data')
  }

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters)
  }

  const handleCompleteTask = (taskId: string) => {
    // TODO: Implement task completion
    console.log('Complete task:', taskId)
  }

  const handleAssignTask = (taskId: string, assigneeId: string) => {
    // TODO: Implement task assignment
    console.log('Assign task:', taskId, 'to:', assigneeId)
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <TasksHeader
          onCreateTask={handleCreateTask}
          onExportData={handleExportData}
          filtersCount={Object.keys(filters).length}
        />

        {/* Filters Panel */}
        <TaskFiltersPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          teamMembers={teamMembers}
        />

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <ListTodo className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="productivity" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Productivity</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <TasksSummaryCards />

            {/* Main Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TasksOverviewChart />
              </div>
              <div className="space-y-6">
                <TaskMetrics />
              </div>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
              <TaskPriorityChart />
              <ProductivityAnalytics />
              <TaskReminders />
            </div>

            {/* Recent Tasks Table */}
            <RecentTasksTable
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onViewTask={handleViewTask}
              onCompleteTask={handleCompleteTask}
              onAssignTask={handleAssignTask}
            />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            {/* Tasks Summary */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                      <p className="text-2xl font-bold">{tasks?.length || 0}</p>
                    </div>
                    <ListTodo className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold">{tasks?.filter(t => t.status === 'in-progress').length || 0}</p>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{tasks?.filter(t => t.status === 'completed').length || 0}</p>
                    </div>
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                      <p className="text-2xl font-bold text-red-600">
                        {tasks?.filter(t => t.status !== 'completed' && new Date(t.due_date) < new Date()).length || 0}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tasks Overview Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <TasksOverviewChart />
              <TaskPriorityChart />
            </div>

            {/* Tasks Table */}
            <RecentTasksTable
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onViewTask={handleViewTask}
              onCompleteTask={handleCompleteTask}
              onAssignTask={handleAssignTask}
            />
          </TabsContent>

          {/* Productivity Tab */}
          <TabsContent value="productivity" className="space-y-6">
            {/* Productivity Summary */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold">
                        {tasks && tasks.length > 0 
                          ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
                          : 0
                        }%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Time per Task</p>
                      <p className="text-2xl font-bold">
                        {tasks && tasks.length > 0 
                          ? Math.round(tasks.reduce((sum, t) => sum + t.actual_hours, 0) / tasks.length)
                          : 0
                        }h
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">On-Time Delivery</p>
                      <p className="text-2xl font-bold">85%</p>
                    </div>
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Team Efficiency</p>
                      <p className="text-2xl font-bold">
                        {teamMembers && teamMembers.length > 0 
                          ? Math.round(teamMembers.reduce((sum, m) => sum + m.efficiency_score, 0) / teamMembers.length)
                          : 0
                        }%
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Productivity Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ProductivityAnalytics />
              <TaskCompletionTrends />
            </div>

            {/* Task Metrics */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Productivity Insights</h3>
                    <p className="text-muted-foreground">
                      Detailed productivity analysis shows team performance trends, bottlenecks,
                      and optimization opportunities for improved task completion rates.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <TaskMetrics />
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            {/* Team Summary */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                      <p className="text-2xl font-bold">{teamMembers?.length || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Assignees</p>
                      <p className="text-2xl font-bold">
                        {teamMembers?.filter(m => m.active_tasks > 0).length || 0}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Workload</p>
                      <p className="text-2xl font-bold">
                        {teamMembers && teamMembers.length > 0
                          ? Math.round(teamMembers.reduce((sum, m) => sum + m.active_tasks, 0) / teamMembers.length)
                          : 0
                        }
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Team Efficiency</p>
                      <p className="text-2xl font-bold">
                        {teamMembers && teamMembers.length > 0 
                          ? Math.round(teamMembers.reduce((sum, m) => sum + m.efficiency_score, 0) / teamMembers.length)
                          : 0
                        }%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <TeamWorkloadChart />
              <TaskCompletionTrends />
            </div>

            {/* Team Performance */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Team Performance</h3>
                    <p className="text-muted-foreground">
                      Detailed team performance metrics including individual member
                      productivity, task completion rates, workload distribution, and collaboration effectiveness.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <TaskReminders />
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <TasksReports />
          </TabsContent>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-lg font-medium">Loading task data...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Create/Edit Task Dialog */}
        <CreateTaskDialog
          open={isCreateTaskDialogOpen}
          onOpenChange={setIsCreateTaskDialogOpen}
          editingTask={selectedTask}
          teamMembers={teamMembers}
        />
      </div>
  )
}