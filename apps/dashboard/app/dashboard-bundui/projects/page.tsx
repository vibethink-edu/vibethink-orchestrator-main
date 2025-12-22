/**
 * Project Management Dashboard Page
 * VibeThink Orchestrator
 * 
 * Complete project management dashboard with kanban boards, tracking, and analytics
 * Following VThink 1.0 methodology with multi-tenant security and DashboardLayout
 */

'use client'

import React, { useState } from 'react'
  ;
import { Tabs, TabsContent, TabsList, TabsTrigger, Card, CardContent } from '@vibethink/ui'
import { Button } from '@vibethink/ui'
import {
  Calendar,
  Users,
  Plus,
  Download,
  Settings,
  BarChart3
} from 'lucide-react'

// Import all project management components
import {
  SummaryCards,
  ProjectManagementHeader,
  ProjectOverviewChart,
  ProjectEfficiencyChart,
  AchievementByYear,
  RecentProjectsTable,
  SuccessMetrics,
  Reports,
  Reminders,
  AddReminderDialog
} from './components'

// Import hooks for data management
import { useProjectData } from './hooks/useProjectData'
import { Project, Task } from './types'
import { useTranslation } from '@/lib/i18n'

export default function ProjectManagementPage() {
  const { t } = useTranslation('projects')
  const [activeTab, setActiveTab] = useState('overview')
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false)
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const { projects, tasks, teamMembers, isLoading } = useProjectData()

  const handleCreateProject = () => {
    setIsCreateProjectDialogOpen(true)
  }

  const handleCreateTask = () => {
    setIsCreateTaskDialogOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setIsCreateProjectDialogOpen(true)
  }

  const handleViewProject = (project: Project) => {
    // TODO: Navigate to project detail page or open project modal
    console.log('View project:', project.name)
  }

  const handleDeleteProject = (projectId: string) => {
    // TODO: Implement delete confirmation and deletion
    console.log('Delete project:', projectId)
  }

  const handleExportData = () => {
    // TODO: Implement data export functionality
    console.log('Export project data')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProjectManagementHeader
        onCreateProject={handleCreateProject}
        onCreateTask={handleCreateTask}
        onExportData={handleExportData}
      />

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>{t('tabs.overview')}</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{t('tabs.projects')}</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{t('tabs.team')}</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>{t('tabs.reports')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <SummaryCards />

          {/* Main Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ProjectOverviewChart />
            </div>
            <div className="space-y-6">
              <SuccessMetrics />
            </div>
          </div>

          {/* Secondary Charts Row */}
          <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
            <AchievementByYear />
            <ProjectEfficiencyChart />
            <Reminders />
          </div>

          {/* Projects Table */}
          <RecentProjectsTable
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onViewProject={handleViewProject}
          />
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          {/* Projects Summary */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('summary.activeProjects')}</p>
                    <p className="text-2xl font-bold">{projects?.filter(p => p.status === 'active').length || 0}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('summary.completed')}</p>
                    <p className="text-2xl font-bold">{projects?.filter(p => p.status === 'completed').length || 0}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('summary.onHold')}</p>
                    <p className="text-2xl font-bold">{projects?.filter(p => p.status === 'on-hold').length || 0}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('summary.totalBudget')}</p>
                    <p className="text-2xl font-bold">
                      ${(projects?.reduce((sum, p) => sum + p.budget, 0) || 0).toLocaleString()}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Overview Chart */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ProjectOverviewChart />
            <AchievementByYear />
          </div>

          {/* Projects Table */}
          <RecentProjectsTable
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onViewProject={handleViewProject}
          />
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          {/* Team Summary */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('summary.teamMembers')}</p>
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
                    <p className="text-sm font-medium text-muted-foreground">{t('summary.activeTasks')}</p>
                    <p className="text-2xl font-bold">
                      {tasks?.filter(t => t.status === 'in-progress').length || 0}
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
                    <p className="text-sm font-medium text-muted-foreground">{t('summary.completedTasks')}</p>
                    <p className="text-2xl font-bold">
                      {tasks?.filter(t => t.status === 'completed').length || 0}
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
                    <p className="text-sm font-medium text-muted-foreground">{t('summary.avgEfficiency')}</p>
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

          {/* Team Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ProjectEfficiencyChart />
            <SuccessMetrics />
          </div>

          {/* Reminders for Team */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">{t('sections.teamPerformance')}</h3>
                  <p className="text-muted-foreground">
                    {t('sections.teamPerformanceDesc')}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Reminders />
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Reports />
        </TabsContent>
      </Tabs>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-lg font-medium">{t('sections.loadingData')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TODO: Add dialogs for creating/editing projects and tasks */}
      {/* These would be implemented as separate components */}
      {/*
      <CreateProjectDialog
        open={isCreateProjectDialogOpen}
        onOpenChange={setIsCreateProjectDialogOpen}
        editingProject={selectedProject}
      />
      
      <CreateTaskDialog
        open={isCreateTaskDialogOpen}
        onOpenChange={setIsCreateTaskDialogOpen}
      />
      */}
    </div>
  )
}
