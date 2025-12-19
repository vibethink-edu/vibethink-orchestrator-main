/**
 * Transaction History Component
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'
import { CryptoTransaction } from '../types'

interface TransactionHistoryProps {
  transactions: CryptoTransaction[]
  loading?: boolean
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 text-muted-foreground">
          <p>Cryptocurrency transaction history and records</p>
        </div>
      </CardContent>
    </Card>
  )
}
