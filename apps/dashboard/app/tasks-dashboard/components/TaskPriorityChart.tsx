/**
 * Task Priority Chart Component - VibeThink Orchestrator
 * 
 * Priority distribution visualization
 * Following VThink 1.0 methodology with Recharts and HSL colors
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { useTaskData } from '../hooks'

const PRIORITY_COLORS = {
  low: 'hsl(210 40% 70%)',
  medium: 'hsl(45 93% 58%)',
  high: 'hsl(25 95% 65%)',
  critical: 'hsl(0 84% 60%)'
}

export default function TaskPriorityChart() {
  const { tasks, isLoading } = useTaskData()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
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
          <CardTitle>Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const priorityData = [
    {
      priority: 'Low',
      count: tasks.filter(t => t.priority === 'low').length,
      color: PRIORITY_COLORS.low
    },
    {
      priority: 'Medium',
      count: tasks.filter(t => t.priority === 'medium').length,
      color: PRIORITY_COLORS.medium
    },
    {
      priority: 'High',
      count: tasks.filter(t => t.priority === 'high').length,
      color: PRIORITY_COLORS.high
    },
    {
      priority: 'Critical',
      count: tasks.filter(t => t.priority === 'critical').length,
      color: PRIORITY_COLORS.critical
    }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label} Priority</p>
          <p className="text-sm text-muted-foreground">
            Tasks: {payload[0].value}
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
          <CardTitle>Priority Distribution</CardTitle>
          <Badge variant="outline">
            {tasks.length} Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="priority" 
                className="text-xs fill-muted-foreground"
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}