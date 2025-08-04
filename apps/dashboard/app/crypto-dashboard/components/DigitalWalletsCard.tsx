/**
 * Digital Wallets Card Component - Bundui Premium Inspired
 * Displays user's cryptocurrency wallets with balances and quick actions
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { 
  ChevronRight, 
  Wallet, 
  ExternalLink, 
  Copy,
  Eye,
  EyeOff,
  Zap,
  Shield,
  TrendingUp,
  Clock
} from 'lucide-react'
import { CryptoWallet } from '../types'

interface DigitalWalletsCardProps {
  wallets?: CryptoWallet[]
  loading?: boolean
  onWalletClick?: (wallet: CryptoWallet) => void
  onAddWallet?: () => void
  showBalances?: boolean
  onToggleBalances?: () => void
}

// Mock crypto icons mapping
const getCryptoIcon = (platform: string, type: string) => {
  const iconMap: { [key: string]: string } = {
    'bitcoin': '₿',
    'ethereum': 'Ξ', 
    'coinbase': '🔵',
    'binance': '🟡',
    'kraken': '🟣',
    'ledger': '🔷',
    'phantom': '👻',
    'metamask': '🦊'
  }
  
  return iconMap[platform.toLowerCase()] || iconMap[type.toLowerCase()] || '🪙'
}

// Mock wallet data
const defaultWallets: CryptoWallet[] = [
  {
    id: 'wallet1',
    company_id: 'comp1',
    user_id: 'user_1',
    name: 'Bitcoin Wallet',
    type: 'exchange',
    platform: 'coinbase',
    balance_usd: 108750,
    holdings_count: 3,
    last_sync: '2024-01-30T14:20:00Z',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  },
  {
    id: 'wallet2',
    company_id: 'comp1',
    user_id: 'user_1',
    name: 'Ethereum Wallet',
    type: 'hot',
    platform: 'metamask',
    balance_usd: 41870,
    holdings_count: 5,
    last_sync: '2024-01-30T13:15:00Z',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  },
  {
    id: 'wallet3',
    company_id: 'comp1',
    user_id: 'user_1',
    name: 'Hardware Wallet',
    type: 'cold',
    platform: 'ledger',
    balance_usd: 25000,
    holdings_count: 2,
    last_sync: '2024-01-30T12:00:00Z',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-30T14:20:00Z'
  }
]

export const DigitalWalletsCard: React.FC<DigitalWalletsCardProps> = ({
  wallets = defaultWallets,
  loading = false,
  onWalletClick,
  onAddWallet,
  showBalances = true,
  onToggleBalances
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'hot': return 'bg-orange-100 text-orange-800 border-orange-200'  
      case 'exchange': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getWalletTypeIcon = (type: string) => {
    switch (type) {
      case 'cold': return <Shield className="h-3 w-3" />
      case 'hot': return <Zap className="h-3 w-3" />
      case 'exchange': return <TrendingUp className="h-3 w-3" />
      default: return <Wallet className="h-3 w-3" />
    }
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-6 w-32 bg-muted rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                    <div className="h-3 w-16 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-20 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Digital Wallets
          </CardTitle>
          <div className="flex items-center gap-2">
            {onToggleBalances && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onToggleBalances}
                className="p-2"
              >
                {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}
            {onAddWallet && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onAddWallet}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {wallets.length === 0 ? (
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No wallets found</p>
            {onAddWallet && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={onAddWallet}
              >
                Add Wallet
              </Button>
            )}
          </div>
        ) : (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="hover:border-primary/30 hover:bg-muted/50 block rounded-md border p-4 transition-colors cursor-pointer group"
              onClick={() => onWalletClick && onWalletClick(wallet)}
            >
              <div className="space-y-3">
                {/* Wallet Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                      {getCryptoIcon(wallet.platform, wallet.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{wallet.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getWalletTypeColor(wallet.type)}`}
                        >
                          {getWalletTypeIcon(wallet.type)}
                          {wallet.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{wallet.platform}</span>
                        <span>•</span>
                        <span>{wallet.holdings_count} assets</span>
                      </div>
                    </div>
                  </div>
                  
                  {wallet.is_active ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                </div>
                
                {/* Wallet Balance */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">
                      {showBalances ? formatCurrency(wallet.balance_usd) : '••••••'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Synced {formatTime(wallet.last_sync)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {wallet.address && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(wallet.address!)
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Open wallet in new tab or external app
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Total Summary */}
        {wallets.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Balance</span>
              <span className="font-semibold">
                {showBalances 
                  ? formatCurrency(wallets.reduce((sum, w) => sum + w.balance_usd, 0))
                  : '••••••'
                }
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
              <span>Active Wallets</span>
              <span>{wallets.filter(w => w.is_active).length} of {wallets.length}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}