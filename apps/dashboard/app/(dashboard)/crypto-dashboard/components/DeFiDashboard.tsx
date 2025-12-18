/**
 * DeFi Dashboard Component
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'
import { DeFiDashboardProps } from '../types'

export const DeFiDashboard: React.FC<DeFiDashboardProps> = ({ positions, loading, onStake, onUnstake, onClaimRewards }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DeFi Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 text-muted-foreground">
          <p>DeFi staking, lending, and yield farming positions</p>
        </div>
      </CardContent>
    </Card>
  )
}
