'use client'

import { TrendingUp, TrendingDown, Eye, Users, Clock, MousePointer } from "@vibethink/ui/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vibethink/ui/components/card'
import { Badge } from '@vibethink/ui/components/badge'
import { Skeleton } from '@vibethink/ui/components/skeleton'
import { useTranslation } from '@/lib/i18n'
import { useAnalyticsData } from '../hooks'
import { AnalyticsCardProps } from '../types'

/**
 * Website Analytics Card Component
 * 
 * Displays comprehensive website analytics overview:
 * - Traffic sources (Direct, Organic, Referral, Social)
 * - Key metrics (Page Views, Sessions, Conversion Rate)
 * - Performance indicators with trend analysis
 * 
 * Follows Bundui Premium design with VThink 1.0 patterns
 */
export function WebsiteAnalyticsCard({
  className = '',
  isLoading: externalLoading = false,
  error: externalError = null
}: AnalyticsCardProps) {
  const { t } = useTranslation('analytics')
  const { websiteMetrics, isLoading, error } = useAnalyticsData()

  const loading = isLoading || externalLoading
  const errorState = error || externalError

  // Get latest metrics or use mock data for development
  const latestMetrics = websiteMetrics[0] || {
    page_views: 2300,
    unique_visitors: 1840,
    bounce_rate: 0.28,
    session_duration: 185,
    conversion_rate: 0.285,
    direct_traffic: 432,
    organic_traffic: 216,
    referral_traffic: 89,
    social_traffic: 43
  }

  // Calculate percentage changes (mock for development)
  const previousMetrics = websiteMetrics[1] || null
  const pageViewsChange = previousMetrics
    ? ((latestMetrics.page_views - previousMetrics.page_views) / previousMetrics.page_views) * 100
    : 12.5

  const conversionRateChange = previousMetrics
    ? ((latestMetrics.conversion_rate - previousMetrics.conversion_rate) / previousMetrics.conversion_rate) * 100
    : 8.2

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatPercentage = (num: number): string => {
    return `${(num * 100).toFixed(1)}%`
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />
    return null
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-muted-foreground'
  }

  if (loading) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (errorState) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Analytics</CardTitle>
          <CardDescription>
            {errorState.message || 'Failed to load website analytics data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              Please try refreshing the page or contact support if the issue persists.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-chart-1" />
            Website Analytics
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            {getTrendIcon(conversionRateChange)}
            {formatPercentage(latestMetrics.conversion_rate)} Conversion
          </Badge>
        </div>
        <CardDescription>
          Total traffic and engagement metrics overview
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Page Views */}
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="flex h-10 w-14 items-center justify-center border border-border font-mono text-xs"
            >
              {formatNumber(latestMetrics.page_views)}
            </Badge>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{t('cards.websiteAnalytics.pageViews')}</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(pageViewsChange)}
                <span className={`text-xs ${getTrendColor(pageViewsChange)}`}>
                  {pageViewsChange > 0 ? '+' : ''}{pageViewsChange.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Unique Visitors */}
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="flex h-10 w-14 items-center justify-center border border-border font-mono text-xs"
            >
              {formatNumber(latestMetrics.unique_visitors)}
            </Badge>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{t('cards.websiteAnalytics.visitors')}</span>
              <span className="text-xs text-muted-foreground">{t('cards.websiteAnalytics.unique')}</span>
            </div>
          </div>

          {/* Session Duration */}
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="flex h-10 w-14 items-center justify-center border border-border font-mono text-xs"
            >
              {formatDuration(latestMetrics.session_duration)}
            </Badge>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{t('cards.websiteAnalytics.avgSession')}</span>
              <span className="text-xs text-muted-foreground">{t('cards.websiteAnalytics.duration')}</span>
            </div>
          </div>

          {/* Bounce Rate */}
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="flex h-10 w-14 items-center justify-center border border-border font-mono text-xs"
            >
              {formatPercentage(latestMetrics.bounce_rate)}
            </Badge>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{t('cards.websiteAnalytics.bounceRate')}</span>
              <span className="text-xs text-muted-foreground">{t('cards.websiteAnalytics.sessions')}</span>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{t('cards.websiteAnalytics.trafficSources')}</h4>
          <div className="grid grid-cols-2 gap-3">
            {/* Direct Traffic */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-1"></div>
              <span className="text-sm">{t('cards.websiteAnalytics.direct')}</span>
              <span className="ml-auto text-sm font-medium">
                {formatNumber(latestMetrics.direct_traffic)}
              </span>
            </div>

            {/* Organic Traffic */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-2"></div>
              <span className="text-sm">{t('cards.websiteAnalytics.organic')}</span>
              <span className="ml-auto text-sm font-medium">
                {formatNumber(latestMetrics.organic_traffic)}
              </span>
            </div>

            {/* Referral Traffic */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-3"></div>
              <span className="text-sm">{t('cards.websiteAnalytics.referral')}</span>
              <span className="ml-auto text-sm font-medium">
                {formatNumber(latestMetrics.referral_traffic || 89)}
              </span>
            </div>

            {/* Social Traffic */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-4"></div>
              <span className="text-sm">{t('cards.websiteAnalytics.social')}</span>
              <span className="ml-auto text-sm font-medium">
                {formatNumber(latestMetrics.social_traffic || 43)}
              </span>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <MousePointer className="h-4 w-4 text-chart-5" />
            <span className="text-sm font-medium">{t('cards.websiteAnalytics.conversionRate')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              {formatPercentage(latestMetrics.conversion_rate)}
            </span>
            <div className="flex items-center gap-1">
              {getTrendIcon(conversionRateChange)}
              <span className={`text-xs ${getTrendColor(conversionRateChange)}`}>
                {conversionRateChange > 0 ? '+' : ''}{conversionRateChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
