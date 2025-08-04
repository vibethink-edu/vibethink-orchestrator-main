/**
 * Trading Interface Component
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { TradingInterfaceProps } from '../types'

export const TradingInterface: React.FC<TradingInterfaceProps> = ({ strategies, loading, onCreateStrategy, onUpdateStrategy }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Strategies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 text-muted-foreground">
          <p>Trading strategies and automation interface</p>
          <Button className="mt-4" onClick={() => onCreateStrategy({} as any)}>
            Create Strategy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}