/**
 * News Widget Component
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { ExternalLink, Clock } from 'lucide-react'
import { NewsWidgetProps } from '../types'

export const NewsWidget: React.FC<NewsWidgetProps> = ({ news, loading, maxItems = 5 }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crypto News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 w-3/4 bg-muted rounded mb-2"></div>
                <div className="h-3 w-full bg-muted rounded mb-1"></div>
                <div className="h-3 w-1/2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'negative': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.slice(0, maxItems).map((article) => (
            <div key={article.id} className="border-b last:border-b-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-sm font-medium line-clamp-2 mb-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                      {article.sentiment}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(article.published_at)}
                    </div>
                  </div>
                </div>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-1 hover:bg-muted rounded"
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
