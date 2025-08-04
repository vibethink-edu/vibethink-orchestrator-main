/**
 * Mock Price Chart Component
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PriceChartProps } from '../types'

export const PriceChart: React.FC<PriceChartProps> = ({ symbol, data, indicators, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Chart - {symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>Price Chart for {symbol}</p>
            <p className="text-sm">(Chart implementation pending)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}