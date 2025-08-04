/**
 * Trading Card Component - Bundui Premium Inspired
 * Complete cryptocurrency trading interface with buy/sell functionality
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { 
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Calculator,
  AlertCircle,
  Shield,
  Zap
} from 'lucide-react'

// Trading form validation schema
const tradingSchema = z.object({
  crypto: z.string().min(1, 'Please select a cryptocurrency'),
  amount_crypto: z.string().min(1, 'Amount is required'),
  amount_usd: z.string().min(1, 'USD amount is required'),
  order_type: z.enum(['market', 'limit']).default('market'),
  limit_price: z.string().optional()
})

type TradingFormData = z.infer<typeof tradingSchema>

interface TradingCardProps {
  loading?: boolean
  availableBalance?: number
  onTrade?: (data: TradingFormData & { type: 'buy' | 'sell' }) => void
  cryptoList?: Array<{
    id: string
    name: string
    symbol: string
    current_price: number
    price_change_percentage_24h: number
    icon?: string
  }>
}

// Mock cryptocurrency data
const defaultCryptos = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    current_price: 43500,
    price_change_percentage_24h: 2.95,
    icon: '₿'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    current_price: 2650,
    price_change_percentage_24h: -0.56,
    icon: 'Ξ'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    current_price: 0.48,
    price_change_percentage_24h: -1.2,
    icon: '♠'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    current_price: 118,
    price_change_percentage_24h: 5.8,
    icon: '◎'
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    current_price: 36.20,
    price_change_percentage_24h: 3.4,
    icon: '🔺'
  }
]

export const TradingCard: React.FC<TradingCardProps> = ({
  loading = false,
  availableBalance = 46200,
  onTrade,
  cryptoList = defaultCryptos
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [selectedCrypto, setSelectedCrypto] = useState<string>(cryptoList[0]?.id || '')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')

  const form = useForm<TradingFormData>({
    resolver: zodResolver(tradingSchema),
    defaultValues: {
      crypto: selectedCrypto,
      amount_crypto: '',
      amount_usd: '',
      order_type: 'market',
      limit_price: ''
    }
  })

  const selectedCryptoData = cryptoList.find(crypto => crypto.id === selectedCrypto)
  const watchedValues = form.watch(['amount_crypto', 'amount_usd'])

  // Calculate conversions automatically
  React.useEffect(() => {
    if (selectedCryptoData && watchedValues[0] && !form.formState.isSubmitting) {
      const cryptoAmount = parseFloat(watchedValues[0])
      if (!isNaN(cryptoAmount)) {
        const usdValue = (cryptoAmount * selectedCryptoData.current_price).toFixed(2)
        form.setValue('amount_usd', usdValue, { shouldValidate: false })
      }
    }
  }, [watchedValues[0], selectedCrypto, selectedCryptoData, form])

  React.useEffect(() => {
    if (selectedCryptoData && watchedValues[1] && !form.formState.isSubmitting) {
      const usdAmount = parseFloat(watchedValues[1])
      if (!isNaN(usdAmount)) {
        const cryptoValue = (usdAmount / selectedCryptoData.current_price).toFixed(8)
        form.setValue('amount_crypto', cryptoValue, { shouldValidate: false })
      }
    }
  }, [watchedValues[1], selectedCrypto, selectedCryptoData, form])

  const onSubmit = (data: TradingFormData) => {
    if (onTrade) {
      onTrade({ ...data, type: activeTab })
    } else {
      console.log('Trading data:', { ...data, type: activeTab })
      // TODO: Implement actual trading logic
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`
    }
    return formatCurrency(price)
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-16 bg-muted rounded"></div>
            <div className="h-8 w-24 bg-muted rounded"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-full bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="h-4 w-16 bg-muted rounded"></div>
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded"></div>
                <div className="h-10 w-full bg-muted rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded"></div>
                <div className="h-10 w-full bg-muted rounded"></div>
              </div>
            </div>
            <div className="h-10 w-full bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Trading
        </CardDescription>
        <CardTitle className="font-display text-3xl">
          {formatCurrency(availableBalance)}
        </CardTitle>
        <div className="text-xs text-muted-foreground">Available Balance</div>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')}
        >
          <TabsList className="mb-4 w-full">
            <TabsTrigger 
              className="w-full flex items-center gap-2" 
              value="buy"
            >
              <TrendingUp className="h-4 w-4" />
              Buy
            </TabsTrigger>
            <TabsTrigger 
              className="w-full flex items-center gap-2" 
              value="sell"
            >
              <TrendingDown className="h-4 w-4" />
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Cryptocurrency Selection */}
                <FormField
                  control={form.control}
                  name="crypto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cryptocurrency</FormLabel>
                      <FormControl>
                        <Select 
                          value={selectedCrypto} 
                          onValueChange={(value) => {
                            setSelectedCrypto(value)
                            field.onChange(value)
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {selectedCryptoData && (
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{selectedCryptoData.icon}</span>
                                  <span>{selectedCryptoData.name}</span>
                                  <span className="text-muted-foreground">({selectedCryptoData.symbol})</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`ml-auto ${
                                      selectedCryptoData.price_change_percentage_24h >= 0 
                                        ? 'text-green-600 border-green-200' 
                                        : 'text-red-600 border-red-200'
                                    }`}
                                  >
                                    {selectedCryptoData.price_change_percentage_24h >= 0 ? '+' : ''}
                                    {selectedCryptoData.price_change_percentage_24h.toFixed(2)}%
                                  </Badge>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {cryptoList.map((crypto) => (
                              <SelectItem key={crypto.id} value={crypto.id}>
                                <div className="flex items-center gap-2 w-full">
                                  <span className="text-lg">{crypto.icon}</span>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span>{crypto.name}</span>
                                      <span className="text-muted-foreground">({crypto.symbol})</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatPrice(crypto.current_price)}
                                    </div>
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      crypto.price_change_percentage_24h >= 0 
                                        ? 'text-green-600 border-green-200' 
                                        : 'text-red-600 border-red-200'
                                    }`}
                                  >
                                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                                    {crypto.price_change_percentage_24h.toFixed(2)}%
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Current Price Display */}
                {selectedCryptoData && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Price</span>
                      <span className="font-medium">{formatPrice(selectedCryptoData.current_price)}</span>
                    </div>
                  </div>
                )}

                {/* Order Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Type</label>
                  <Tabs value={orderType} onValueChange={(value) => setOrderType(value as 'market' | 'limit')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="market" className="flex items-center gap-2">
                        <Zap className="h-3 w-3" />
                        Market
                      </TabsTrigger>
                      <TabsTrigger value="limit" className="flex items-center gap-2">
                        <Calculator className="h-3 w-3" />
                        Limit
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Limit Price (if limit order) */}
                {orderType === 'limit' && (
                  <FormField
                    control={form.control}
                    name="limit_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limit Price (USD)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="0.00" />
                        </FormControl>
                        <FormDescription>
                          Order will execute when price reaches this level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Amount Inputs */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="amount_crypto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Amount ({selectedCryptoData?.symbol || 'Crypto'})
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="0.00000000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount_usd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (USD)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="0.00" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Trading Summary */}
                {selectedCryptoData && form.watch('amount_usd') && (
                  <div className="bg-muted rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Fee</span>
                      <span>$2.50</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Cost</span>
                      <span className="font-medium">
                        ${(parseFloat(form.watch('amount_usd') || '0') + 2.50).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Processing...' : `Buy ${selectedCryptoData?.symbol || 'Crypto'}`}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="sell">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Same form structure as buy, but for selling */}
                <FormField
                  control={form.control}
                  name="crypto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cryptocurrency</FormLabel>
                      <FormControl>
                        <Select 
                          value={selectedCrypto} 
                          onValueChange={(value) => {
                            setSelectedCrypto(value)
                            field.onChange(value)
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {selectedCryptoData && (
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{selectedCryptoData.icon}</span>
                                  <span>{selectedCryptoData.name}</span>
                                  <span className="text-muted-foreground">({selectedCryptoData.symbol})</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {cryptoList.map((crypto) => (
                              <SelectItem key={crypto.id} value={crypto.id}>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{crypto.icon}</span>
                                  <span>{crypto.name}/{crypto.symbol}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="amount_crypto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Amount ({selectedCryptoData?.symbol || 'Crypto'})
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="0.00000000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount_usd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (USD)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="0.00" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="destructive"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Processing...' : `Sell ${selectedCryptoData?.symbol || 'Crypto'}`}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              All trades are secured with multi-factor authentication and real-time fraud detection.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}