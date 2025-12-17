'use client'
import { Headphones, ClockIcon, CheckCircle, AlertTriangle, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useAnalyticsData } from '../hooks'
import { AnalyticsCardProps } from '../types'

// Mock support tickets data
const ticketsData = {
  total: 1247,
  open: 89,
  inProgress: 156,
  resolved: 1002,
  averageResponseTime: 2.4, // hours
  satisfactionScore: 4.6,
  priorityBreakdown: {
    high: 23,
    medium: 198,
    low: 1026
  },
  categoryBreakdown: [
    { category: 'Technical Issues', count: 445, percentage: 35.7 },
    { category: 'Billing Questions', count: 312, percentage: 25.0 },
    { category: 'Feature Requests', count: 234, percentage: 18.8 },
    { category: 'Account Issues', count: 156, percentage: 12.5 },
    { category: 'General Support', count: 100, percentage: 8.0 }
  ]
}

/**
 * Tickets Card Component
 * 
 * Displays comprehensive support ticket metrics:
 * - Total tickets and status breakdown
 * - Response time and resolution metrics
 * - Customer satisfaction scores
 * - Priority and category analysis
 * 
 * Provides insights into support team performance and customer service quality
 */
export function TicketsCard({ 
  className = '',
  isLoading: externalLoading = false,
  error: externalError = null
}: AnalyticsCardProps) {
  const { supportTickets, isLoading, error } = useAnalyticsData()
  
  const loading = isLoading || externalLoading
  const errorState = error || externalError

  // Calculate metrics
  const resolutionRate = (ticketsData.resolved / ticketsData.total) * 100
  const pendingTickets = ticketsData.open + ticketsData.inProgress
  const responseTimeStatus = ticketsData.averageResponseTime <= 4 ? 'excellent' : 
                           ticketsData.averageResponseTime <= 8 ? 'good' : 'needs-improvement'

  // Format time
  const formatTime = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}min`
    return `${hours.toFixed(1)}h`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'needs-improvement': return 'text-yellow-600'
      default: return 'text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (errorState) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Tickets Data</CardTitle>
          <CardDescription>
            {errorState.message || 'Failed to load support tickets data'}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-chart-1" />
            Support Tickets
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`gap-1 ${getStatusColor(responseTimeStatus)}`}
          >
            <ClockIcon className="h-3 w-3" />
            {formatTime(ticketsData.averageResponseTime)} avg
          </Badge>
        </div>
        
        <CardDescription>
          Support team performance and ticket analytics
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Resolution Rate</span>
            </div>
            <div className="text-lg font-bold">{resolutionRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">
              {ticketsData.resolved} resolved
            </div>
          </div>
          
          <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950/20">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-xs font-medium">Satisfaction</span>
            </div>
            <div className="text-lg font-bold">{ticketsData.satisfactionScore.toFixed(1)}/5</div>
            <div className="text-xs text-muted-foreground">
              Customer rating
            </div>
          </div>
        </div>

        {/* Ticket Status Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Ticket Status</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Resolved</span>
              </div>
              <span className="font-medium">{ticketsData.resolved}</span>
            </div>
            <Progress value={(ticketsData.resolved / ticketsData.total) * 100} className="h-1.5" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>In Progress</span>
              </div>
              <span className="font-medium">{ticketsData.inProgress}</span>
            </div>
            <Progress value={(ticketsData.inProgress / ticketsData.total) * 100} className="h-1.5" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span>Open</span>
              </div>
              <span className="font-medium">{ticketsData.open}</span>
            </div>
            <Progress value={(ticketsData.open / ticketsData.total) * 100} className="h-1.5" />
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Priority Distribution</h4>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-red-50 p-2 dark:bg-red-950/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                <span className="text-xs font-medium">High</span>
              </div>
              <div className="text-sm font-bold">{ticketsData.priorityBreakdown.high}</div>
            </div>
            
            <div className="rounded-lg bg-yellow-50 p-2 dark:bg-yellow-950/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ClockIcon className="h-3 w-3 text-yellow-600" />
                <span className="text-xs font-medium">Medium</span>
              </div>
              <div className="text-sm font-bold">{ticketsData.priorityBreakdown.medium}</div>
            </div>
            
            <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium">Low</span>
              </div>
              <div className="text-sm font-bold">{ticketsData.priorityBreakdown.low}</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Top Categories</h4>
          
          <div className="space-y-2">
            {ticketsData.categoryBreakdown.slice(0, 4).map((category, index) => (
              <div key={category.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }}
                  ></div>
                  <span className="truncate">{category.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {category.percentage}%
                  </span>
                  <span className="font-medium">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Support Performance</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• {resolutionRate.toFixed(1)}% of tickets resolved successfully</p>
            <p>• {formatTime(ticketsData.averageResponseTime)} average response time</p>
            <p>• {ticketsData.satisfactionScore}/5 customer satisfaction score</p>
            <p>• {pendingTickets} tickets currently pending</p>
          </div>
        </div>

        {/* Response Time Indicator */}
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-chart-1" />
              <span className="text-sm font-medium">Response Time</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">
                {formatTime(ticketsData.averageResponseTime)}
              </div>
              <div className={`text-xs ${getStatusColor(responseTimeStatus)}`}>
                {responseTimeStatus === 'excellent' && 'Excellent'}
                {responseTimeStatus === 'good' && 'Good'}
                {responseTimeStatus === 'needs-improvement' && 'Needs Improvement'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
