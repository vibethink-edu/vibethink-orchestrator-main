/**
 * Tasks Overview Chart Component - VibeThink Orchestrator
 * 
 * Comprehensive task status distribution chart with analytics
 * Following VThink 1.0 methodology with Recharts and HSL color variables
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { useTaskData } from '../hooks'

// HSL color variables for theme compatibility
const CHART_COLORS = {
  todo: 'hsl(210 40% 70%)',        // Blue-gray
  'in-progress': 'hsl(25 95% 65%)', // Orange
  'in-review': 'hsl(45 93% 58%)',   // Yellow
  completed: 'hsl(142 76% 36%)',    // Green
  cancelled: 'hsl(0 84% 60%)'       // Red
}

const PRIORITY_COLORS = {
  low: 'hsl(210 40% 70%)',      // Blue-gray
  medium: 'hsl(45 93% 58%)',    // Yellow
  high: 'hsl(25 95% 65%)',      // Orange
  critical: 'hsl(0 84% 60%)'    // Red
}

export default function TasksOverviewChart() {
  const { tasks, isLoading } = useTaskData()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No tasks data available
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate status distribution
  const statusDistribution = [
    {
      name: 'To Do',
      value: tasks.filter(t => t.status === 'todo').length,
      percentage: ((tasks.filter(t => t.status === 'todo').length / tasks.length) * 100).toFixed(1),
      color: CHART_COLORS.todo
    },
    {
      name: 'In Progress',
      value: tasks.filter(t => t.status === 'in-progress').length,
      percentage: ((tasks.filter(t => t.status === 'in-progress').length / tasks.length) * 100).toFixed(1),
      color: CHART_COLORS['in-progress']
    },
    {
      name: 'In Review',
      value: tasks.filter(t => t.status === 'in-review').length,
      percentage: ((tasks.filter(t => t.status === 'in-review').length / tasks.length) * 100).toFixed(1),
      color: CHART_COLORS['in-review']
    },
    {
      name: 'Completed',
      value: tasks.filter(t => t.status === 'completed').length,
      percentage: ((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100).toFixed(1),
      color: CHART_COLORS.completed
    },
    {
      name: 'Cancelled',
      value: tasks.filter(t => t.status === 'cancelled').length,
      percentage: ((tasks.filter(t => t.status === 'cancelled').length / tasks.length) * 100).toFixed(1),
      color: CHART_COLORS.cancelled
    }
  ].filter(item => item.value > 0)

  // Calculate priority distribution
  const priorityDistribution = [
    {
      name: 'Low',
      value: tasks.filter(t => t.priority === 'low').length,
      color: PRIORITY_COLORS.low
    },
    {
      name: 'Medium',
      value: tasks.filter(t => t.priority === 'medium').length,
      color: PRIORITY_COLORS.medium
    },
    {
      name: 'High',
      value: tasks.filter(t => t.priority === 'high').length,
      color: PRIORITY_COLORS.high
    },
    {
      name: 'Critical',
      value: tasks.filter(t => t.priority === 'critical').length,
      color: PRIORITY_COLORS.critical
    }
  ].filter(item => item.value > 0)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {`Tasks: ${payload[0].value}`}
          </p>
          {payload[0].payload.percentage && (
            <p className="text-sm text-muted-foreground">
              {`Percentage: ${payload[0].payload.percentage}%`}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {`Tasks: ${data.value} (${data.percentage}%)`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Tasks Overview</CardTitle>
          <Badge variant="outline">
            {tasks.length} Total Tasks
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Status Distribution Pie Chart */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution Bar Chart */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Priority Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Priority Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tasks.filter(t => t.priority === 'high').length}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {tasks.filter(t => t.priority === 'critical').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-2">Quick Insights</h4>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <p>
              • {((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100).toFixed(1)}% 
              of tasks are completed
            </p>
            <p>
              • {tasks.filter(t => t.priority === 'high' || t.priority === 'critical').length} 
              high-priority tasks need attention
            </p>
            <p>
              • {tasks.filter(t => t.status === 'in-progress').length} 
              tasks are currently in progress
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}