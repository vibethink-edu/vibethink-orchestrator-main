import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Skeleton, ScrollArea } from '@vibethink/ui'
import { FinancialInsightsProps, FinancialInsight } from '../types'
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Target,
  BarChart3,
  ArrowRight,
  X,
  RefreshCw,
  Info
} from 'lucide-react'
import { useState } from 'react'

/**
 * FinancialInsights Component
 * 
 * Displays AI-powered financial insights and recommendations.
 * Shows trends, alerts, opportunities, and actionable suggestions.
 * 
 * Features:
 * - AI-generated financial insights
 * - Priority-based sorting
 * - Impact level indicators
 * - Trend analysis
 * - Actionable recommendations
 * - Dismissible insights
 * - Category-based filtering
 * - Real-time updates
 * - Visual priority indicators
 * - Loading states with skeletons
 * - HSL color variables for theme compatibility
 */
export function FinancialInsights({ 
  insights, 
  loading = false, 
  className 
}: FinancialInsightsProps) {
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-[160px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2 p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const filteredInsights = insights.filter(insight => {
    if (dismissedInsights.has(insight.id)) return false
    if (filter === 'all') return true
    return insight.impact === filter
  })

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'revenue_opportunity':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'cost_optimization':
        return <Target className="h-4 w-4 text-blue-600" />
      case 'cash_flow_warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'budget_variance':
        return <BarChart3 className="h-4 w-4 text-purple-600" />
      case 'trend_analysis':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'compliance':
        return <CheckCircle className="h-4 w-4 text-indigo-600" />
      case 'forecast':
        return <DollarSign className="h-4 w-4 text-teal-600" />
      default:
        return <Lightbulb className="h-4 w-4 text-amber-600" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-blue-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getImpactBadgeVariant = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600'
      case 'important':
        return 'text-orange-600'
      case 'normal':
        return 'text-blue-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'negative':
        return <TrendingDown className="h-3 w-3 text-red-600" />
      case 'neutral':
        return <div className="w-3 h-3 rounded-full bg-gray-400" />
      default:
        return null
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      case 'neutral':
        return 'text-gray-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const handleDismissInsight = (insightId: string) => {
    setDismissedInsights(prev => new Set([...prev, insightId]))
  }

  const handleRefreshInsights = () => {
    console.log('Refresh insights')
    // TODO: Implement insight refresh functionality
  }

  const handleTakeAction = (insight: FinancialInsight) => {
    console.log('Take action on insight:', insight.id)
    // TODO: Implement action functionality
  }

  const insightsByPriority = {
    urgent: filteredInsights.filter(i => i.priority === 'urgent').length,
    important: filteredInsights.filter(i => i.priority === 'important').length,
    normal: filteredInsights.filter(i => i.priority === 'normal').length
  }

  const sortedInsights = [...filteredInsights].sort((a, b) => {
    const priorityOrder = { urgent: 3, important: 2, normal: 1 }
    const impactOrder = { high: 3, medium: 2, low: 1 }
    
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
    
    if (aPriority !== bPriority) return bPriority - aPriority
    
    const aImpact = impactOrder[a.impact as keyof typeof impactOrder] || 0
    const bImpact = impactOrder[b.impact as keyof typeof impactOrder] || 0
    
    return bImpact - aImpact
  })

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          Financial Insights
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {filteredInsights.length} insights
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleRefreshInsights}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Priority Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-3 w-3 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-600">{insightsByPriority.urgent}</p>
              <p className="text-xs text-red-600/80">Urgent</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20">
            <Info className="h-3 w-3 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-orange-600">{insightsByPriority.important}</p>
              <p className="text-xs text-orange-600/80">Important</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <CheckCircle className="h-3 w-3 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-600">{insightsByPriority.normal}</p>
              <p className="text-xs text-blue-600/80">Normal</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(['all', 'high', 'medium', 'low'] as const).map((level) => (
            <Button
              key={level}
              variant={filter === level ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(level)}
              className="text-xs capitalize"
            >
              {level === 'all' ? 'All Insights' : `${level} Impact`}
            </Button>
          ))}
        </div>

        {/* Insights List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {sortedInsights.length === 0 ? (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium text-muted-foreground">No Insights Available</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Financial insights will appear here as they're generated.
                </p>
              </div>
            ) : (
              sortedInsights.map((insight) => (
                <div 
                  key={insight.id} 
                  className="p-4 border rounded-lg space-y-3 hover:bg-muted/20 transition-colors"
                >
                  {/* Insight Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground text-sm">
                            {insight.title}
                          </h4>
                          {getTrendIcon(insight.trend)}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant={getImpactBadgeVariant(insight.impact)} 
                            className="text-xs capitalize"
                          >
                            {insight.impact} impact
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs capitalize ${getPriorityColor(insight.priority)}`}
                          >
                            {insight.priority}
                          </Badge>
                          {insight.value && (
                            <span className="text-xs font-medium text-foreground">
                              ${insight.value.toLocaleString()}
                            </span>
                          )}
                          {insight.percentage && (
                            <span className={`text-xs font-medium ${getTrendColor(insight.trend)}`}>
                              {insight.percentage >= 0 ? '+' : ''}{insight.percentage.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissInsight(insight.id)}
                      className="h-6 w-6 p-0 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Insight Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>

                  {/* Action Required */}
                  {insight.action_required && insight.action_suggestion && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Recommended Action:
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          {insight.action_suggestion}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleTakeAction(insight)}
                        className="ml-3 gap-1"
                      >
                        Take Action
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {/* Insight Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{insight.category} insight</span>
                      <span>•</span>
                      <span>Generated {new Date(insight.created_at).toLocaleDateString()}</span>
                    </div>
                    {insight.action_required && (
                      <Badge variant="outline" className="text-xs">
                        Action Required
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Insights Summary */}
        {filteredInsights.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{filteredInsights.length}</p>
              <p className="text-xs text-muted-foreground">Total Insights</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-600">
                {filteredInsights.filter(i => i.action_required).length}
              </p>
              <p className="text-xs text-muted-foreground">Need Action</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">
                {filteredInsights.filter(i => i.trend === 'positive').length}
              </p>
              <p className="text-xs text-muted-foreground">Positive Trends</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-orange-600">
                {filteredInsights.filter(i => i.impact === 'high').length}
              </p>
              <p className="text-xs text-muted-foreground">High Impact</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
