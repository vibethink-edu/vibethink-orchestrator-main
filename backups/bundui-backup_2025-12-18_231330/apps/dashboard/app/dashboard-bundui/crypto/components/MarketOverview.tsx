/**
 * Market Overview Component
 * Displays cryptocurrency market sentiment and key metrics
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'

interface MarketOverviewProps {
  sentiment?: {
    fear_greed_index?: number
    fear_greed_classification?: string
    bitcoin_dominance?: number
    market_cap_change_24h?: number
    volume_change_24h?: number
  }
  topCryptos?: any[]
  loading?: boolean
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ 
  sentiment, 
  topCryptos, 
  loading = false 
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="h-4 w-16 bg-muted rounded mx-auto"></div>
                  <div className="h-6 w-12 bg-muted rounded mx-auto"></div>
                  <div className="h-3 w-10 bg-muted rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const mockSentiment = {
    fear_greed_index: 68,
    fear_greed_classification: 'Greed',
    bitcoin_dominance: 52.3,
    market_cap_change_24h: 2.45,
    volume_change_24h: 12.8,
    ...sentiment
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Fear & Greed</p>
              <p className="text-lg font-bold">{mockSentiment.fear_greed_index}</p>
              <p className={`text-xs ${
                mockSentiment.fear_greed_index > 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {mockSentiment.fear_greed_classification}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="text-lg font-bold">$1.65T</p>
              <p className={`text-xs flex items-center justify-center gap-1 ${
                mockSentiment.market_cap_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {mockSentiment.market_cap_change_24h >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {mockSentiment.market_cap_change_24h >= 0 ? '+' : ''}
                {mockSentiment.market_cap_change_24h}%
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-lg font-bold">$65.2B</p>
              <p className={`text-xs flex items-center justify-center gap-1 ${
                mockSentiment.volume_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {mockSentiment.volume_change_24h >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {mockSentiment.volume_change_24h >= 0 ? '+' : ''}
                {mockSentiment.volume_change_24h}%
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">BTC Dominance</p>
              <p className="text-lg font-bold">{mockSentiment.bitcoin_dominance?.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">-0.5%</p>
            </div>
          </div>

          {/* Additional Market Stats */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-medium text-green-600">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  2,847
                </div>
                <div className="text-xs text-muted-foreground">Active Coins</div>
              </div>
              <div>
                <div className="text-sm font-medium text-blue-600">
                  <Activity className="h-4 w-4 inline mr-1" />
                  156
                </div>
                <div className="text-xs text-muted-foreground">Exchanges</div>
              </div>
              <div>
                <div className="text-sm font-medium text-primary">
                  <TrendingUp className="h-4 w-4 inline mr-1" />
                  $2.1T
                </div>
                <div className="text-xs text-muted-foreground">Total Cap</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
