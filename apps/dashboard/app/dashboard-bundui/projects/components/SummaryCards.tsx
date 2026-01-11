/**
 * Summary Cards Component - Project Management Dashboard
 * VibeThink Orchestrator
 * 
 * Key project metrics overview cards with trend indicators
 * Following VThink 1.0 methodology and DOI principle
 */

'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton
} from '@vibethink/ui'
import {
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Target
} from "@vibethink/ui/icons"
import { useProjectSummary } from '../hooks/useProjectData'
import { useTranslation } from '@/lib/i18n'

interface MetricCardProps {
  title: string
  value: string | number
  description: string
  change?: string
  isPositive?: boolean
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  change,
  isPositive,
  icon,
  trend = 'neutral'
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3" />
    if (trend === 'down') return <TrendingDown className="h-3 w-3" />
    return null
  }

  const getTrendColor = () => {
    if (isPositive === true) return 'text-green-600'
    if (isPositive === false) return 'text-red-600'
    return 'text-muted-foreground'
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={`flex items-center text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">{change}</span>
            <span className="ml-1 text-muted-foreground">{description}</span>
          </div>
        )}
        {!change && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

const SummaryCardsSkeleton: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32 mt-2" />
        </CardContent>
      </Card>
    ))}
  </div>
)

export const SummaryCards: React.FC = () => {
  const { t } = useTranslation('projects')
  const { data: summary, isLoading, error } = useProjectSummary()

  if (isLoading) {
    return <SummaryCardsSkeleton />
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('summary.failedToLoad')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!summary) {
    return <SummaryCardsSkeleton />
  }

  // Calculate trends and changes (mock for now - replace with real historical data)
  const activeProjectsChange = '+12.5%'
  const completedTasksChange = '+8.2%'
  const teamMembersChange = '+2'
  const overdueTasksChange = '-15.3%'

  const budgetUtilization = summary.total_budget > 0
    ? ((summary.total_spent / summary.total_budget) * 100).toFixed(1)
    : '0'

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title={t('summary.activeProjects')}
        value={summary.active_projects}
        description={t('summary.fromLastMonth')}
        change={activeProjectsChange}
        isPositive={true}
        trend="up"
        icon={<Briefcase className="h-4 w-4" />}
      />

      <MetricCard
        title={t('summary.completedTasks')}
        value={summary.completed_tasks_this_month}
        description={t('summary.thisMonth')}
        change={completedTasksChange}
        isPositive={true}
        trend="up"
        icon={<CheckCircle className="h-4 w-4" />}
      />

      <MetricCard
        title={t('summary.teamMembers')}
        value={summary.total_team_members}
        description={t('summary.activeContributors')}
        change={teamMembersChange}
        isPositive={true}
        trend="up"
        icon={<Users className="h-4 w-4" />}
      />

      <MetricCard
        title={t('summary.overdueTasks')}
        value={summary.overdue_tasks}
        description={t('summary.fromLastWeek')}
        change={overdueTasksChange}
        isPositive={true}
        trend="down"
        icon={<Clock className="h-4 w-4" />}
      />
    </div>
  )
}
