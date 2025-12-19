/**
 * Project Overview Chart Component
 * VibeThink Orchestrator
 * 
 * Project status distribution chart using Recharts
 * Following VThink 1.0 methodology and DOI principle with HSL colors
 */

'use client'

import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Badge
} from '@vibethink/ui'
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon,
  MoreHorizontal,
  Download
} from 'lucide-react'
import { useProjectData } from '../hooks/useProjectData'
import { ProjectOverviewChartData } from '../types'

interface ProjectOverviewChartProps {
  className?: string
}

const CHART_COLORS = {
  active: 'hsl(var(--chart-1))',
  completed: 'hsl(var(--chart-2))', 
  'on-hold': 'hsl(var(--chart-3))',
  cancelled: 'hsl(var(--chart-4))'
}

const STATUS_LABELS = {
  active: 'Active',
  completed: 'Completed',
  'on-hold': 'On Hold',
  cancelled: 'Cancelled'
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {data.value} projects ({data.percentage}%)
        </p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export const ProjectOverviewChart: React.FC<ProjectOverviewChartProps> = ({ 
  className 
}) => {
  const [chartType, setChartType] = useState<'pie' | 'donut'>('donut')
  const [timeRange, setTimeRange] = useState('all')
  const { projects, isLoading, error } = useProjectData()

  const chartData: ProjectOverviewChartData[] = React.useMemo(() => {
    if (!projects || projects.length === 0) return []

    const statusCounts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const total = projects.length

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
      value: count,
      percentage: Math.round((count / total) * 100),
      color: CHART_COLORS[status as keyof typeof CHART_COLORS] || 'hsl(var(--chart-5))'
    }))
  }, [projects])

  const totalProjects = projects?.length || 0
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0
  const successRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
          <CardDescription>Loading project data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !chartData.length) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
          <CardDescription>No project data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No projects found</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5" />
              <span>Projects Overview</span>
            </CardTitle>
            <CardDescription>
              Project status distribution across {totalProjects} projects
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={chartType === 'donut' ? 60 : 0}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{totalProjects}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{successRate}%</p>
                  <Badge variant={successRate >= 80 ? "default" : successRate >= 60 ? "secondary" : "destructive"}>
                    {successRate >= 80 ? 'Excellent' : successRate >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Project Breakdown</h4>
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trends */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Trends</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• {activeProjects} projects currently active</p>
                <p>• {completedProjects} projects completed</p>
                <p>• {successRate}% success rate this period</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
