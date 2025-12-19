/**
 * Performance Metrics Component
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'

interface PerformanceMetricsProps {
  metrics: any
  riskMetrics: any
  loading?: boolean
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics, riskMetrics, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
            <span className="font-medium">{riskMetrics?.sharpe_ratio?.toFixed(2) || '1.8'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Max Drawdown</span>
            <span className="font-medium text-red-600">{riskMetrics?.max_drawdown?.toFixed(1) || '-15.5'}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Risk Score</span>
            <span className="font-medium">{riskMetrics?.risk_score || '65'}/100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
