/**
 * Risk Analysis Component
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { RiskAnalysisProps } from '../types'

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ riskMetrics, portfolioMetrics, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 text-muted-foreground">
          <p>Portfolio risk analysis and metrics</p>
        </div>
      </CardContent>
    </Card>
  )
}