/**
 * Task Metrics Component - VibeThink Orchestrator
 * 
 * Key performance indicators for task management
 * Following VThink 1.0 methodology with shadcn/ui compatibility
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Target, Clock, TrendingUp, Users } from 'lucide-react'
import { useTaskSummary } from '../hooks'

export default function TaskMetrics() {
  const { data: summary, isLoading } = useTaskSummary()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 mb-2" />
                <div className="h-2 bg-gray-200 rounded dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!summary) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Task Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Completion Rate</span>
            <Badge variant="outline">{summary.completion_rate.toFixed(1)}%</Badge>
          </div>
          <Progress value={summary.completion_rate} className="h-2" />
        </div>

        {/* On-Time Delivery */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">On-Time Delivery</span>
            <Badge variant="outline">{summary.on_time_delivery_rate}%</Badge>
          </div>
          <Progress value={summary.on_time_delivery_rate} className="h-2" />
        </div>

        {/* Team Productivity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Team Productivity</span>
            <Badge variant="outline">{summary.team_productivity_score}%</Badge>
          </div>
          <Progress value={summary.team_productivity_score} className="h-2" />
        </div>

        {/* Average Completion Time */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Avg Completion</span>
          </div>
          <span className="text-sm font-bold">{summary.average_completion_time.toFixed(1)}h</span>
        </div>
      </CardContent>
    </Card>
  )
}
