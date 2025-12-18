/**
 * Tasks Summary Cards Component - VibeThink Orchestrator
 * 
 * Summary metric cards for task overview
 * Following VThink 1.0 methodology with shadcn/ui compatibility
 */

'use client'

import React from 'react'
import { Card, CardContent, Badge } from '@vibethink/ui'
import { 
  ListTodo,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  Calendar
} from 'lucide-react'
import { useTaskSummary } from '../hooks'

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  isPositive?: boolean
  description: string
  icon: React.ReactNode
  badge?: {
    text: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
}

function MetricCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  description, 
  icon, 
  badge 
}: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {badge && (
                <Badge variant={badge.variant} className="text-xs">
                  {badge.text}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">{value}</p>
              {change && (
                <span className={`text-sm font-medium ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {change}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              {icon}
            </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-gradient-to-br from-primary/5 to-primary/10" />
      </CardContent>
    </Card>
  )
}

export default function TasksSummaryCards() {
  const { data: summary, isLoading } = useTaskSummary()

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700" />
                <div className="h-8 bg-gray-200 rounded dark:bg-gray-700" />
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-700" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) return null

  const currentDate = new Date()
  const overduePercentage = summary.total_tasks > 0 
    ? ((summary.overdue_tasks / summary.total_tasks) * 100).toFixed(1)
    : '0'

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Tasks */}
      <MetricCard
        title="Total Tasks"
        value={summary.total_tasks}
        change="+12%"
        isPositive={true}
        description="All tasks in the system"
        icon={<ListTodo className="h-6 w-6 text-blue-600" />}
      />

      {/* In Progress */}
      <MetricCard
        title="In Progress"
        value={summary.in_progress_tasks}
        change="+5%"
        isPositive={true}
        description="Currently active tasks"
        icon={<Clock className="h-6 w-6 text-orange-600" />}
        badge={{
          text: `${((summary.in_progress_tasks / summary.total_tasks) * 100).toFixed(0)}%`,
          variant: 'secondary'
        }}
      />

      {/* Completed */}
      <MetricCard
        title="Completed"
        value={summary.completed_tasks}
        change="+18%"
        isPositive={true}
        description="Successfully finished tasks"
        icon={<CheckCircle className="h-6 w-6 text-green-600" />}
        badge={{
          text: `${summary.completion_rate.toFixed(0)}%`,
          variant: 'default'
        }}
      />

      {/* Overdue */}
      <MetricCard
        title="Overdue"
        value={summary.overdue_tasks}
        change="-8%"
        isPositive={true}
        description="Tasks past due date"
        icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        badge={{
          text: `${overduePercentage}%`,
          variant: summary.overdue_tasks > 5 ? 'destructive' : 'outline'
        }}
      />

      {/* High Priority */}
      <MetricCard
        title="High Priority"
        value={summary.high_priority_tasks}
        description="High priority tasks requiring attention"
        icon={<Target className="h-6 w-6 text-purple-600" />}
        badge={{
          text: 'Urgent',
          variant: summary.critical_priority_tasks > 0 ? 'destructive' : 'secondary'
        }}
      />

      {/* Team Productivity */}
      <MetricCard
        title="Team Productivity"
        value={`${summary.team_productivity_score}%`}
        change="+3%"
        isPositive={true}
        description="Overall team efficiency score"
        icon={<TrendingUp className="h-6 w-6 text-indigo-600" />}
      />

      {/* Average Completion Time */}
      <MetricCard
        title="Avg Completion"
        value={`${summary.average_completion_time.toFixed(1)}h`}
        change="-2h"
        isPositive={true}
        description="Average time to complete tasks"
        icon={<Clock className="h-6 w-6 text-teal-600" />}
      />

      {/* On-Time Delivery */}
      <MetricCard
        title="On-Time Delivery"
        value={`${summary.on_time_delivery_rate}%`}
        change="+4%"
        isPositive={true}
        description="Tasks completed on schedule"
        icon={<Calendar className="h-6 w-6 text-green-600" />}
        badge={{
          text: summary.on_time_delivery_rate >= 85 ? 'Excellent' : 'Good',
          variant: summary.on_time_delivery_rate >= 85 ? 'default' : 'secondary'
        }}
      />
    </div>
  )
}
