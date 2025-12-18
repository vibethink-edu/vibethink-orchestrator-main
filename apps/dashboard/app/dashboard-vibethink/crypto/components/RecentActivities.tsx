/**
 * Recent Activities Component - Bundui Premium Inspired
 * Displays recent cryptocurrency transactions and activities
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@vibethink/ui'
import { Button } from '@vibethink/ui'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send,
  Activity,
  Clock,
  DollarSign
} from 'lucide-react'
import { CryptoTransaction } from '../types'
import { cn } from '@/lib/utils'

interface RecentActivitiesProps {
  transactions?: CryptoTransaction[]
  loading?: boolean
  maxItems?: number
  onViewAll?: () => void
}

// Mock crypto icons mapping
const getCryptoIcon = (symbol: string) => {
  const iconMap: { [key: string]: string } = {
    'BTC': '₿',
    'ETH': 'Ξ',
    'ADA': '♠',
    'SOL': '◎',
    'USDT': '⊕',
    'USDC': '⊙',
    'DOT': '●',
    'LINK': '🔗',
    'AVAX': '🔺'
  }
  
  return iconMap[symbol.toUpperCase()] || '🪙'
}

// Mock activity data if no transactions provided
const mockActivities = [
  {
    id: 'activity1',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'bitcoin',
    symbol: 'BTC',
    type: 'buy' as const,
    amount: 0.5384,
    price: 43500,
    total_value: 23429.40,
    fee: 25,
    fee_currency: 'USD',
    platform: 'coinbase',
    status: 'completed' as const,
    date: '2024-01-30T23:34:00Z',
    created_at: '2024-01-30T23:34:00Z',
    updated_at: '2024-01-30T23:34:00Z'
  },
  {
    id: 'activity2',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'ethereum',
    symbol: 'ETH',
    type: 'buy' as const,
    amount: 1.5,
    price: 2650,
    total_value: 3975,
    fee: 15,
    fee_currency: 'USD',
    platform: 'binance',
    status: 'completed' as const,
    date: '2024-01-28T23:34:00Z',
    created_at: '2024-01-28T23:34:00Z',
    updated_at: '2024-01-28T23:34:00Z'
  },
  {
    id: 'activity3',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'cardano',
    symbol: 'ADA',
    type: 'sell' as const,
    amount: 5000,
    price: 0.48,
    total_value: 2400,
    fee: 5,
    fee_currency: 'USD',
    platform: 'kraken',
    status: 'completed' as const,
    date: '2024-01-25T14:22:00Z',
    created_at: '2024-01-25T14:22:00Z',
    updated_at: '2024-01-25T14:22:00Z'
  },
  {
    id: 'activity4',
    company_id: 'comp1',
    user_id: 'user_1',
    crypto_id: 'solana',
    symbol: 'SOL',
    type: 'buy' as const,
    amount: 25,
    price: 118,
    total_value: 2950,
    fee: 10,
    fee_currency: 'USD',
    platform: 'phantom',
    status: 'completed' as const,
    date: '2024-01-20T16:45:00Z',
    created_at: '2024-01-20T16:45:00Z',
    updated_at: '2024-01-20T16:45:00Z'
  }
]

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  transactions = mockActivities,
  loading = false,
  maxItems = 6,
  onViewAll
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatCryptoAmount = (amount: number, symbol: string) => {
    const decimals = amount < 1 ? 6 : amount < 100 ? 4 : 2
    return `${amount.toFixed(decimals)} ${symbol}`
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy': return <ArrowDownLeft className="h-4 w-4" />
      case 'sell': return <ArrowUpRight className="h-4 w-4" />
      case 'send': return <Send className="h-4 w-4" />
      case 'receive': return <ArrowDownLeft className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'buy':
        return "border-orange-400 bg-orange-100 text-orange-900 dark:border-orange-700 dark:bg-orange-900 dark:text-white"
      case 'sell':
        return "border-blue-400 bg-blue-100 text-blue-900 dark:border-blue-700 dark:bg-blue-900 dark:text-white"
      case 'send':
        return "border-green-400 bg-green-100 text-green-900 dark:border-green-700 dark:bg-green-900 dark:text-white"
      case 'receive':
        return "border-purple-400 bg-purple-100 text-purple-900 dark:border-purple-700 dark:bg-purple-900 dark:text-white"
      default:
        return "border-gray-400 bg-gray-100 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'failed': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center animate-pulse">
              <div className="size-12 rounded-full bg-muted"></div>
              <div className="ml-4 space-y-2 flex-1">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-3 w-32 bg-muted rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded ml-auto"></div>
                <div className="h-3 w-12 bg-muted rounded ml-auto"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const displayTransactions = transactions.slice(0, maxItems)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {displayTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No recent activities</p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center group hover:bg-muted/50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                {/* Crypto Icon */}
                <div className="bg-muted size-12 rounded-full border p-2 flex items-center justify-center text-lg font-bold">
                  {getCryptoIcon(transaction.symbol)}
                </div>
                
                {/* Transaction Details */}
                <div className="ml-4 space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm leading-none font-medium">
                      {transaction.symbol}
                    </p>
                    <Badge className={cn("border text-xs", getTransactionColor(transaction.type))}>
                      {getTransactionIcon(transaction.type)}
                      <span className="ml-1 capitalize">{transaction.type}</span>
                    </Badge>
                    <div className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(transaction.date)}</span>
                    <span>•</span>
                    <span className="capitalize">{transaction.platform}</span>
                  </div>
                </div>
                
                {/* Amount and Value */}
                <div className="ml-auto flex flex-col text-end">
                  <span className="text-sm font-medium">
                    {formatCryptoAmount(transaction.amount, transaction.symbol)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>{formatCurrency(transaction.total_value)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {displayTransactions.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onViewAll}
          >
            {onViewAll ? (
              <span>View All Activities</span>
            ) : (
              <Link href="/crypto-dashboard" className="w-full">
                View All Activities
              </Link>
            )}
          </Button>
        )}

        {/* Summary Stats */}
        {displayTransactions.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-medium text-green-600">
                  {displayTransactions.filter(t => t.type === 'buy').length}
                </div>
                <div className="text-xs text-muted-foreground">Buys</div>
              </div>
              <div>
                <div className="text-sm font-medium text-blue-600">
                  {displayTransactions.filter(t => t.type === 'sell').length}
                </div>
                <div className="text-xs text-muted-foreground">Sells</div>
              </div>
              <div>
                <div className="text-sm font-medium text-primary">
                  {formatCurrency(displayTransactions.reduce((sum, t) => sum + t.total_value, 0))}
                </div>
                <div className="text-xs text-muted-foreground">Volume</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
