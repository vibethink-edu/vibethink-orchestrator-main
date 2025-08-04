/**
 * Alerts Manager Component
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { AlertsManagerProps } from '../types'

export const AlertsManager: React.FC<AlertsManagerProps> = ({ alerts, loading, onCreateAlert, onUpdateAlert, onDeleteAlert }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 text-muted-foreground">
          <p>Price alerts management interface</p>
          <Button className="mt-4" onClick={() => onCreateAlert({} as any)}>
            Create Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}