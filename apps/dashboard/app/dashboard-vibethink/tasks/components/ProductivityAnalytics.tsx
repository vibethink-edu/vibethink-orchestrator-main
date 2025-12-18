/**
 * Productivity Analytics Component - VibeThink Orchestrator
 * 
 * Team productivity metrics and trends
 * Following VThink 1.0 methodology with Recharts and HSL colors
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useTaskData } from '../hooks'

export default function ProductivityAnalytics() {
  const { taskMetrics, isLoading } = useTaskData()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productivity Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!taskMetrics?.productivity_trends) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productivity Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No productivity data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={taskMetrics.productivity_trends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs fill-muted-foreground"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="tasks_completed" 
                stroke="hsl(142 76% 36%)" 
                strokeWidth={2}
                name="Tasks Completed"
              />
              <Line 
                type="monotone" 
                dataKey="efficiency_score" 
                stroke="hsl(25 95% 65%)" 
                strokeWidth={2}
                name="Efficiency Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
