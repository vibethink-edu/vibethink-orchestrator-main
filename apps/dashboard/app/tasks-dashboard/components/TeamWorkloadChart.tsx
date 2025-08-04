/**
 * Team Workload Chart Component - VibeThink Orchestrator
 * 
 * Team workload distribution visualization
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

export default function TeamWorkloadChart() {
  const { teamMembers, taskMetrics, isLoading } = useTaskData()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!taskMetrics?.workload_distribution) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No workload data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'hsl(0 84% 60%)'      // Red - overloaded
    if (utilization >= 75) return 'hsl(25 95% 65%)'     // Orange - high
    if (utilization >= 50) return 'hsl(142 76% 36%)'    // Green - optimal
    return 'hsl(210 40% 70%)'                           // Blue - underutilized
  }

  const chartData = taskMetrics.workload_distribution.map(item => ({
    name: item.member_name.split(' ')[0], // First name only for chart
    utilization: item.utilization_percentage,
    tasks: item.current_tasks,
    capacity: item.capacity,
    color: getUtilizationColor(item.utilization_percentage)
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Tasks: {data.tasks} / {data.capacity}
          </p>
          <p className="text-sm text-muted-foreground">
            Utilization: {data.utilization}%
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
          <CardTitle>Team Workload</CardTitle>
          <Badge variant="outline">
            {teamMembers?.length || 0} Members
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs fill-muted-foreground"
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="utilization" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Workload Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(210 40% 70%)' }} />
            <span>Under 50% - Underutilized</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(142 76% 36%)' }} />
            <span>50-75% - Optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(25 95% 65%)' }} />
            <span>75-90% - High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(0 84% 60%)' }} />
            <span>90%+ - Overloaded</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}