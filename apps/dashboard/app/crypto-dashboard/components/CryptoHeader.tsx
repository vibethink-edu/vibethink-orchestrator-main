/**
 * Crypto Dashboard Header Component
 * Contains filters, actions, and dashboard controls
 */

import React, { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  DropdownMenu,  
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { 
  Download, 
  Plus, 
  Bell, 
  RefreshCw, 
  Filter,
  Search,
  Calendar,
  Settings,
  TrendingUp,
  Wallet
} from 'lucide-react'
import { CryptoHeaderProps } from '../types'

export const CryptoHeader: React.FC<CryptoHeaderProps> = ({
  onFiltersChange,
  onExport,
  onAddTransaction,
  onAddAlert,
  onSync,
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onFiltersChange({ search: value })
  }

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    onFiltersChange({ dateRange: value })
  }

  const handlePlatformChange = (value: string) => {
    setPlatformFilter(value)
    onFiltersChange({ platform: value })
  }

  const quickActions = [
    { label: 'Buy Crypto', icon: Plus, action: onAddTransaction },
    { label: 'Set Alert', icon: Bell, action: onAddAlert },
    { label: 'Export Data', icon: Download, action: onExport },
    { label: 'Sync Wallets', icon: RefreshCw, action: onSync },
  ]

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crypto Dashboard</h1>
          <p className="text-muted-foreground">
            Track your cryptocurrency portfolio and manage your investments
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              onClick={action.action}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <action.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cryptocurrencies..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Date Range Filter */}
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Platform Filter */}
            <Select value={platformFilter} onValueChange={handlePlatformChange}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Wallet className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="coinbase">Coinbase</SelectItem>
                <SelectItem value="binance">Binance</SelectItem>
                <SelectItem value="kraken">Kraken</SelectItem>
                <SelectItem value="phantom">Phantom</SelectItem>
                <SelectItem value="metamask">MetaMask</SelectItem>
                <SelectItem value="ledger">Ledger</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">More Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onFiltersChange({ showProfitable: true })}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Profitable Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltersChange({ showLosing: true })}>
                  <TrendingUp className="h-4 w-4 mr-2 rotate-180" />
                  Losing Positions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltersChange({ showLargeHoldings: true })}>
                  <Wallet className="h-4 w-4 mr-2" />
                  Large Holdings (&gt;$10k)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltersChange({ showRecentActivity: true })}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Recent Activity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltersChange({ reset: true })}>
                  <Settings className="h-4 w-4 mr-2" />
                  Reset All Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Status</p>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">BTC Price</p>
              <p className="text-lg font-semibold">$43,500</p>
              <p className="text-xs text-green-600">+2.95%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Fear & Greed</p>
              <p className="text-lg font-semibold">68</p>
              <p className="text-xs text-yellow-600">Greed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="text-lg font-semibold">$1.65T</p>
              <p className="text-xs text-green-600">+2.45%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}