/**
 * Project Efficiency Chart Component
 * VibeThink Orchestrator
 * 
 * Team efficiency and productivity trends chart using Recharts
 * Following VThink 1.0 methodology and DOI principle with HSL colors
 */

'use client'

import React, { useState, useMemo } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts'
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
  TrendingDown,
  Activity,
  Zap,
  Clock,
  Target
} from 'lucide-react'
import { useProjectData } from '../hooks/useProjectData'
import { ProjectEfficiencyChartData } from '../types'

interface ProjectEfficiencyChartProps {
  className?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm">{item.name}</span>
            </div>
            <span className="text-sm font-medium">
              {item.name === 'Efficiency' || item.name === 'Productivity' 
                ? `${item.value}%` 
                : item.value
              }
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Generate mock efficiency data - replace with real data
const generateEfficiencyData = (): ProjectEfficiencyChartData[] => {
  const data: ProjectEfficiencyChartData[] = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    
    // Generate realistic efficiency data with trends
    const baseEfficiency = 75 + Math.sin(i * 0.1) * 10 + Math.random() * 10
    const baseProductivity = 80 + Math.cos(i * 0.15) * 8 + Math.random() * 8
    const completedTasks = Math.floor(Math.random() * 15) + 5
    
    data.push({
      date: date.toISOString().split('T')[0],
      efficiency: Math.round(Math.max(0, Math.min(100, baseEfficiency))),
      productivity: Math.round(Math.max(0, Math.min(100, baseProductivity))),
      completed_tasks: completedTasks
    })
  }
  
  return data
}

export const ProjectEfficiencyChart: React.FC<ProjectEfficiencyChartProps> = ({ 
  className 
}) => {
  const [timeRange, setTimeRange] = useState('30d')
  const [chartType, setChartType] = useState<'line' | 'area'>('area')
  const { projects, tasks, isLoading } = useProjectData()

  const chartData = useMemo(() => {
    return generateEfficiencyData()
  }, [timeRange])

  const averageEfficiency = useMemo(() => {
    if (!chartData.length) return 0
    return Math.round(chartData.reduce((sum, item) => sum + item.efficiency, 0) / chartData.length)
  }, [chartData])

  const averageProductivity = useMemo(() => {
    if (!chartData.length) return 0
    return Math.round(chartData.reduce((sum, item) => sum + item.productivity, 0) / chartData.length)
  }, [chartData])

  const totalCompletedTasks = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.completed_tasks, 0)
  }, [chartData])

  const efficiencyTrend = useMemo(() => {
    if (chartData.length < 2) return 'neutral'
    const firstWeek = chartData.slice(0, 7).reduce((sum, item) => sum + item.efficiency, 0) / 7
    const lastWeek = chartData.slice(-7).reduce((sum, item) => sum + item.efficiency, 0) / 7
    return lastWeek > firstWeek ? 'up' : lastWeek < firstWeek ? 'down' : 'neutral'
  }, [chartData])

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Team Efficiency</CardTitle>
          <CardDescription>Loading efficiency data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
              <Activity className="h-5 w-5" />
              <span>Team Efficiency</span>
            </CardTitle>
            <CardDescription>
              Performance trends and productivity metrics
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={chartType} onValueChange={(value: 'line' | 'area') => setChartType(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                <div className="flex items-center space-x-1">
                  <p className="text-xl font-bold">{averageEfficiency}%</p>
                  {efficiencyTrend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {efficiencyTrend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-lg">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productivity</p>
                <p className="text-xl font-bold">{averageProductivity}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-xl font-bold">{totalCompletedTasks}</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={80} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                  <Area
                    type="monotone"
                    dataKey="efficiency"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#efficiencyGradient)"
                    strokeWidth={2}
                    name="Efficiency"
                  />
                  <Area
                    type="monotone"
                    dataKey="productivity"
                    stroke="hsl(var(--chart-2))"
                    fill="url(#productivityGradient)"
                    strokeWidth={2}
                    name="Productivity"
                  />
                </AreaChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={80} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                    name="Efficiency"
                  />
                  <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                    name="Productivity"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2">Performance Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Team Efficiency</span>
                  <Badge variant={averageEfficiency >= 80 ? "default" : averageEfficiency >= 60 ? "secondary" : "destructive"}>
                    {averageEfficiency >= 80 ? 'Excellent' : averageEfficiency >= 60 ? 'Good' : 'Needs Focus'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Productivity</span>
                  <Badge variant={averageProductivity >= 80 ? "default" : averageProductivity >= 60 ? "secondary" : "destructive"}>
                    {averageProductivity >= 80 ? 'High' : averageProductivity >= 60 ? 'Moderate' : 'Low'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Trend</span>
                  <Badge variant={efficiencyTrend === 'up' ? "default" : efficiencyTrend === 'down' ? "destructive" : "secondary"}>
                    {efficiencyTrend === 'up' ? 'Improving' : efficiencyTrend === 'down' ? 'Declining' : 'Stable'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2">Key Insights</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• Average efficiency above industry standard (75%)</p>
                <p>• {totalCompletedTasks} tasks completed in selected period</p>
                <p>• Team maintains consistent productivity levels</p>
                <p>• {efficiencyTrend === 'up' ? 'Positive trend indicates good momentum' : 'Focus on efficiency improvements needed'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
