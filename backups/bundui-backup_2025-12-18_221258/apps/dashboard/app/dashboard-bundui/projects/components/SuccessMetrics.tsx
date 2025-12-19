/**
 * Success Metrics Component
 * VibeThink Orchestrator
 * 
 * Success KPIs and performance metrics display
 * Following VThink 1.0 methodology and DOI principle with HSL colors
 */

'use client'

import React, { useMemo } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  Progress
} from '@vibethink/ui'
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Clock,
  DollarSign,
  Users,
  Award,
  ChevronRight,
  Info
} from 'lucide-react'
import { useProjectSummary } from '../hooks/useProjectData'
import { SuccessMetrics as SuccessMetricsType } from '../types'

interface SuccessMetricsProps {
  className?: string
}

interface MetricItemProps {
  title: string
  value: number
  target?: number
  format: 'percentage' | 'number' | 'currency' | 'days'
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: number
  icon: React.ReactNode
  description?: string
}

const MetricItem: React.FC<MetricItemProps> = ({
  title,
  value,
  target,
  format,
  trend = 'neutral',
  trendValue,
  icon,
  description
}) => {
  const formatValue = (val: number, fmt: MetricItemProps['format']) => {
    switch (fmt) {
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'currency':
        return `$${val.toLocaleString()}`
      case 'days':
        return `${val} days`
      case 'number':
      default:
        return val.toLocaleString()
    }
  }

  const getProgressValue = () => {
    if (!target) return value
    return Math.min((value / target) * 100, 100)
  }

  const getProgressColor = () => {
    const progress = getProgressValue()
    if (progress >= 90) return 'bg-green-500'
    if (progress >= 70) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-500" />
    return null
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-muted-foreground'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-muted-foreground">{icon}</div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        {trendValue && (
          <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trendValue > 0 ? '+' : ''}{trendValue}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">{formatValue(value, format)}</span>
          {target && (
            <span className="text-sm text-muted-foreground">
              / {formatValue(target, format)}
            </span>
          )}
        </div>
        
        {target && (
          <div className="space-y-1">
            <Progress value={getProgressValue()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{getProgressValue().toFixed(1)}% of target</span>
              <span className={value >= target ? 'text-green-600 font-medium' : ''}>
                {value >= target ? 'Target achieved!' : `${(target - value).toFixed(1)} to go`}
              </span>
            </div>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}

const SuccessMetricsSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-6 w-32 bg-muted rounded animate-pulse" />
      <div className="h-4 w-48 bg-muted rounded animate-pulse" />
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            <div className="h-2 w-full bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export const SuccessMetrics: React.FC<SuccessMetricsProps> = ({ className }) => {
  const { data: summary, isLoading, error } = useProjectSummary()

  const metrics: SuccessMetricsType = useMemo(() => {
    if (!summary) {
      return {
        project_success_rate: 0,
        on_time_delivery: 0,
        budget_adherence: 0,
        client_satisfaction: 0,
        team_efficiency: 0,
        average_project_duration: 0,
        milestone_completion_rate: 0,
        resource_utilization: 0
      }
    }

    // Calculate derived metrics from summary data
    return {
      project_success_rate: summary.success_rate,
      on_time_delivery: summary.on_time_delivery_rate,
      budget_adherence: summary.budget_adherence_rate,
      client_satisfaction: 87.5, // Mock - would come from client feedback
      team_efficiency: 82.3, // Mock - calculated from task completion rates
      average_project_duration: summary.average_project_completion_time,
      milestone_completion_rate: 91.2, // Mock - calculated from milestone data
      resource_utilization: 78.9 // Mock - calculated from team workload
    }
  }, [summary])

  if (isLoading) {
    return <SuccessMetricsSkeleton />
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Success Metrics</CardTitle>
          <CardDescription>Failed to load metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Error loading success metrics</p>
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
              <Award className="h-5 w-5" />
              <span>Success Metrics</span>
            </CardTitle>
            <CardDescription>
              Key performance indicators and project success rates
            </CardDescription>
          </div>
          
          <Button variant="outline" size="sm">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Primary Success Metrics */}
          <div className="space-y-4">
            <MetricItem
              title="Project Success Rate"
              value={metrics.project_success_rate}
              target={85}
              format="percentage"
              trend="up"
              trendValue={3.2}
              icon={<Target className="h-4 w-4" />}
              description="Percentage of projects completed successfully"
            />
            
            <MetricItem
              title="On-Time Delivery"
              value={metrics.on_time_delivery}
              target={90}
              format="percentage"
              trend="up"
              trendValue={5.1}
              icon={<Clock className="h-4 w-4" />}
              description="Projects delivered by scheduled deadline"
            />
            
            <MetricItem
              title="Budget Adherence"
              value={metrics.budget_adherence}
              target={95}
              format="percentage"
              trend="down"
              trendValue={-2.3}
              icon={<DollarSign className="h-4 w-4" />}
              description="Projects completed within approved budget"
            />
            
            <MetricItem
              title="Team Efficiency"
              value={metrics.team_efficiency}
              target={80}
              format="percentage"
              trend="up"
              trendValue={1.8}
              icon={<Users className="h-4 w-4" />}
              description="Overall team productivity and effectiveness"
            />
          </div>

          {/* Performance Overview */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-3">Performance Overview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client Satisfaction</span>
                  <span className="font-medium">{metrics.client_satisfaction.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.client_satisfaction} className="h-1" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Milestone Rate</span>
                  <span className="font-medium">{metrics.milestone_completion_rate.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.milestone_completion_rate} className="h-1" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resource Utilization</span>
                  <span className="font-medium">{metrics.resource_utilization.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.resource_utilization} className="h-1" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Duration</span>
                  <span className="font-medium">{metrics.average_project_duration} days</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {metrics.average_project_duration <= 30 ? 'Excellent' : 
                   metrics.average_project_duration <= 60 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
            </div>
          </div>

          {/* Success Insights */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Success Insights</span>
            </h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <p>Project success rate is {metrics.project_success_rate >= 80 ? 'above' : 'below'} industry standard (80%)</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <p>On-time delivery shows {metrics.on_time_delivery >= 85 ? 'excellent' : 'good'} performance consistency</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                <p>Budget adherence indicates {metrics.budget_adherence >= 90 ? 'strong' : 'moderate'} financial control</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <p>Team efficiency reflects {metrics.team_efficiency >= 80 ? 'high' : 'moderate'} productivity levels</p>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-2">Recommended Actions</h4>
            <div className="space-y-2">
              {metrics.budget_adherence < 90 && (
                <div className="flex items-center space-x-2 text-sm">
                  <Badge variant="outline" className="text-xs">Budget</Badge>
                  <span className="text-muted-foreground">Review budget planning and cost estimation processes</span>
                </div>
              )}
              {metrics.on_time_delivery < 85 && (
                <div className="flex items-center space-x-2 text-sm">
                  <Badge variant="outline" className="text-xs">Timeline</Badge>
                  <span className="text-muted-foreground">Improve project scheduling and milestone tracking</span>
                </div>
              )}
              {metrics.team_efficiency < 80 && (
                <div className="flex items-center space-x-2 text-sm">
                  <Badge variant="outline" className="text-xs">Team</Badge>
                  <span className="text-muted-foreground">Focus on team productivity and workflow optimization</span>
                </div>
              )}
              {metrics.project_success_rate >= 85 && metrics.on_time_delivery >= 85 && metrics.budget_adherence >= 90 && (
                <div className="flex items-center space-x-2 text-sm">
                  <Badge variant="default" className="text-xs">Success</Badge>
                  <span className="text-muted-foreground">Excellent performance across all key metrics!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
