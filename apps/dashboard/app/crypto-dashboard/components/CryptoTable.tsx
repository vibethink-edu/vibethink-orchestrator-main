/**
 * Crypto Holdings Table Component
 * Displays cryptocurrency holdings in a table format
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { 
  MoreHorizontal, 
  TrendingUp, 
  TrendingDown, 
  Edit, 
  Trash2,
  ExternalLink
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { CryptoTableProps } from '../types'

export const CryptoTable: React.FC<CryptoTableProps> = ({ 
  holdings, 
  loading = false,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crypto Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-16 bg-muted rounded"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 w-20 bg-muted rounded ml-auto"></div>
                  <div className="h-3 w-16 bg-muted rounded ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (holdings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crypto Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium mb-2">No Holdings Found</p>
            <p className="text-sm">Start by adding your first cryptocurrency holding</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatNumber = (value: number, decimals = 6) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Crypto Holdings</span>
          <span className="text-sm text-muted-foreground font-normal">
            {holdings.length} {holdings.length === 1 ? 'asset' : 'assets'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 px-2 text-sm font-medium text-muted-foreground">Asset</th>
                    <th className="py-3 px-2 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="py-3 px-2 text-sm font-medium text-muted-foreground">Holdings</th>
                    <th className="py-3 px-2 text-sm font-medium text-muted-foreground">Value</th>
                    <th className="py-3 px-2 text-sm font-medium text-muted-foreground">P&L</th>
                    <th className="py-3 px-2 text-sm font-medium text-muted-foreground">Platform</th>
                    <th className="py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => (
                    <tr key={holding.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {holding.symbol.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{holding.symbol}</p>
                            <p className="text-sm text-muted-foreground">{holding.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div>
                          <p className="font-medium">{formatCurrency(holding.current_price)}</p>
                          <p className="text-sm text-muted-foreground">
                            Avg: {formatCurrency(holding.average_cost)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <p className="font-medium">{formatNumber(holding.amount)}</p>
                      </td>
                      <td className="py-4 px-2">
                        <p className="font-medium">{formatCurrency(holding.total_value)}</p>
                      </td>
                      <td className="py-4 px-2">
                        <div className={`${
                          holding.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <div className="flex items-center space-x-1">
                            {holding.profit_loss >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span className="font-medium">
                              {formatCurrency(Math.abs(holding.profit_loss))}
                            </span>
                          </div>
                          <p className="text-sm">
                            {formatPercentage(holding.profit_loss_percentage)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {holding.platform}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(holding)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {onDelete && (
                              <DropdownMenuItem 
                                onClick={() => onDelete(holding.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {holdings.map((holding) => (
              <Card key={holding.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {holding.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{holding.symbol}</p>
                      <p className="text-sm text-muted-foreground">{holding.name}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(holding)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={() => onDelete(holding.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Holdings</p>
                    <p className="font-medium">{formatNumber(holding.amount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Value</p>
                    <p className="font-medium">{formatCurrency(holding.total_value)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-medium">{formatCurrency(holding.current_price)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">P&L</p>
                    <div className={`${
                      holding.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <div className="flex items-center space-x-1">
                        {holding.profit_loss >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium text-xs">
                          {formatPercentage(holding.profit_loss_percentage)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {holding.platform}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Avg Cost: {formatCurrency(holding.average_cost)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}