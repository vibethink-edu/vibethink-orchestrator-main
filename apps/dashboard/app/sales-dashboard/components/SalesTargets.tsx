import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Button } from '@/shared/components/ui/button'
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useSalesData } from '../hooks/useSalesData'

interface SalesTargetsProps {
  className?: string
}

// Sample targets data - in real app this would come from useSalesData hook
const targetsData = [
  {
    id: '1',
    title: 'Monthly Revenue Target',
    target: 500000,
    achieved: 485000,
    unit: 'currency',
    period: 'January 2024',
    deadline: '2024-01-31',
    status: 'in_progress',
    progress: 97,
    trend: 15,
    description: 'Total revenue for January',
    category: 'revenue'
  },
  {
    id: '2',
    title: 'New Deals Closed',
    target: 45,
    achieved: 38,
    unit: 'count',
    period: 'January 2024',
    deadline: '2024-01-31',
    status: 'in_progress',
    progress: 84,
    trend: 8,
    description: 'Number of deals closed this month',
    category: 'deals'
  },
  {
    id: '3',
    title: 'Quarterly Pipeline',
    target: 1500000,
    achieved: 1650000,
    unit: 'currency',
    period: 'Q1 2024',
    deadline: '2024-03-31',
    status: 'achieved',
    progress: 110,
    trend: 22,
    description: 'Total pipeline value for Q1',
    category: 'pipeline'
  },
  {
    id: '4',
    title: 'New Prospects',
    target: 150,
    achieved: 142,
    unit: 'count',
    period: 'January 2024',
    deadline: '2024-01-31',
    status: 'in_progress',
    progress: 95,
    trend: -2,
    description: 'New prospects added this month',
    category: 'prospects'
  },
  {
    id: '5',
    title: 'Team Quota Attainment',
    target: 100,
    achieved: 96,
    unit: 'percentage',
    period: 'January 2024',
    deadline: '2024-01-31',
    status: 'at_risk',
    progress: 96,
    trend: 5,
    description: 'Overall team quota achievement',
    category: 'quota'
  }
]

export function SalesTargets({ className }: SalesTargetsProps) {
  const { loading } = useSalesData()

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-[120px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-[60px]" />
                <Skeleton className="h-3 w-[40px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case 'currency':
        return `$${(value / 1000).toFixed(0)}K`
      case 'percentage':
        return `${value}%`
      case 'count':
      default:
        return value.toString()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'at_risk':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'in_progress':
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'at_risk':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'in_progress':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
  }

  const getProgressColor = (progress: number, status: string) => {
    if (status === 'achieved') return 'bg-green-500'
    if (progress >= 90) return 'bg-yellow-500'
    if (progress >= 70) return 'bg-blue-500'
    return 'bg-red-500'
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-muted-foreground'
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Sales Targets
        </CardTitle>
        <Button variant="outline" size="sm">
          <Award className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {targetsData.map((target) => {
          const daysRemaining = getDaysRemaining(target.deadline)
          
          return (
            <div key={target.id} className="space-y-3 p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(target.status)}
                    <h4 className="font-medium text-sm">{target.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{target.description}</p>
                </div>
                <Badge className={getStatusColor(target.status)} variant="secondary">
                  {target.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {formatValue(target.achieved, target.unit)} / {formatValue(target.target, target.unit)}
                  </span>
                  <span className={`font-medium ${
                    target.progress >= 100 ? 'text-green-600' : 
                    target.progress >= 90 ? 'text-yellow-600' : 
                    'text-foreground'
                  }`}>
                    {target.progress}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(target.progress, 100)} 
                  className="h-2"
                />
              </div>

              {/* Footer with period and trend */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{target.period}</span>
                  {daysRemaining > 0 && (
                    <>
                      <span>•</span>
                      <span>{daysRemaining} days left</span>
                    </>
                  )}
                </div>
                
                {target.trend !== 0 && (
                  <div className={`flex items-center gap-1 ${getTrendColor(target.trend)}`}>
                    <TrendingUp className="h-3 w-3" />
                    <span>{target.trend > 0 ? '+' : ''}{target.trend}%</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Summary */}
        <div className="pt-4 mt-4 border-t space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-600">3/5</p>
              <p className="text-xs text-muted-foreground">Targets on Track</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">94%</p>
              <p className="text-xs text-muted-foreground">Avg Achievement</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Target className="h-3 w-3" />
            <span>Overall performance above expectations</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}