/**
 * Watchlist Widget Component
 * Displays cryptocurrencies in the user's watchlist
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'
import { Button } from '@vibethink/ui'
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Star,
  X,
  AlertCircle
} from "@vibethink/ui/icons"
import { WatchlistProps } from '../types'

export const WatchlistWidget: React.FC<WatchlistProps> = ({ 
  watchlist, 
  marketPrices,
  loading = false,
  onAddCrypto,
  onRemoveCrypto
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div>
                    <div className="h-4 w-16 bg-muted rounded mb-1"></div>
                    <div className="h-3 w-12 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-20 bg-muted rounded mb-1"></div>
                  <div className="h-3 w-16 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  const getMarketPrice = (cryptoId: string) => {
    return marketPrices.find(price => price.id === cryptoId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Watchlist</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onAddCrypto}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {watchlist.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm mb-2">No cryptocurrencies in watchlist</p>
            <Button variant="outline" size="sm" onClick={onAddCrypto}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {watchlist.map((item) => {
              const marketData = getMarketPrice(item.crypto_id)
              const currentPrice = marketData?.current_price || 0
              const priceChange = marketData?.price_change_percentage_24h || 0
              const isAboveTarget = item.target_price && currentPrice > item.target_price
              const isBelowTarget = item.target_price && currentPrice < item.target_price
              
              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {item.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{item.symbol}</p>
                        {item.target_price && (
                          <div className="flex items-center">
                            {((item.alert_type === 'price_above' && isAboveTarget) || 
                              (item.alert_type === 'price_below' && isBelowTarget)) && (
                              <AlertCircle className="h-3 w-3 text-orange-500" />
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                      {item.target_price && (
                        <p className="text-xs text-muted-foreground">
                          Target: {formatCurrency(item.target_price)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="text-sm font-medium">{formatCurrency(currentPrice)}</p>
                        <div className={`flex items-center space-x-1 text-xs ${
                          priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {priceChange >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>{formatPercentage(priceChange)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                        onClick={() => onRemoveCrypto(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {watchlist.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full" onClick={onAddCrypto}>
              <Plus className="h-4 w-4 mr-2" />
              Add More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
