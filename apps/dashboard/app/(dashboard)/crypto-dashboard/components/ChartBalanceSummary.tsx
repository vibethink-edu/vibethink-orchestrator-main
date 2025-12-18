/**
 * Chart Balance Summary Component - Bundui Premium Inspired
 * Complete cryptocurrency balance tracking with line chart visualization
 * Following VThink 1.0 methodology with multi-tenant security
 */

'use client'

import React from 'react'
import { CartesianGrid, Line, LineChart, XAxis, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'
import { Button } from '@vibethink/ui'
import { 
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@vibethink/ui'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'

interface ChartBalanceSummaryProps {
  loading?: boolean
  data?: Array<{
    month: string
    received: number
    send: number
    withdraw: number
  }>
  totals?: {
    received: number
    send: number
    withdraw: number
  }
  onExport?: () => void
}

// Mock chart data - in real app this would come from props
const defaultChartData = [
  { month: "January", received: 100, send: 180, withdraw: 290 },
  { month: "February", received: 305, send: 200, withdraw: 150 },
  { month: "March", received: 237, send: 120, withdraw: 180 },
  { month: "April", received: 73, send: 230, withdraw: 120 },
  { month: "May", received: 209, send: 130, withdraw: 125 },
  { month: "June", received: 214, send: 140, withdraw: 270 },
  { month: "July", received: 144, send: 170, withdraw: 240 }
]

// Chart configuration using HSL variables for shadcn/ui compatibility
const chartConfig = {
  received: {
    label: "Total Received",
    color: "hsl(var(--chart-1))"
  },
  send: {
    label: "Total Send", 
    color: "hsl(var(--chart-2))"
  },
  withdraw: {
    label: "Total Withdraw",
    color: "hsl(var(--chart-3))"
  }
} satisfies ChartConfig

export const ChartBalanceSummary: React.FC<ChartBalanceSummaryProps> = ({
  loading = false,
  data = defaultChartData,
  totals = {
    received: 2.010550,
    send: 1.201055, 
    withdraw: 5.41055
  },
  onExport
}) => {
  const handleExport = () => {
    if (onExport) {
      onExport()
    } else {
      // Default export functionality
      console.log('Exporting balance summary data...')
      // TODO: Implement CSV/PDF export
    }
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-6 w-32 bg-muted rounded mb-2"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted space-y-2 rounded-md border p-4">
                    <div className="h-4 w-24 bg-muted-foreground/20 rounded"></div>
                    <div className="h-6 w-32 bg-muted-foreground/20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Balance Summary</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-muted space-y-2 rounded-md border p-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[hsl(var(--chart-1))]"></span>
              <span className="font-medium">{chartConfig.received.label}</span>
            </div>
            <div className="text-xl font-semibold flex items-center gap-2">
              {totals.received.toFixed(6)} BTC
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-xs text-muted-foreground">
              +12.5% from last month
            </div>
          </div>
          
          <div className="bg-muted space-y-2 rounded-md border p-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[hsl(var(--chart-2))]"></span>
              <span className="font-medium">{chartConfig.send.label}</span>
            </div>
            <div className="text-xl font-semibold flex items-center gap-2">
              {totals.send.toFixed(6)} BTC
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-xs text-muted-foreground">
              -5.2% from last month
            </div>
          </div>
          
          <div className="bg-muted space-y-2 rounded-md border p-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[hsl(var(--chart-3))]"></span>
              <span className="font-medium">{chartConfig.withdraw.label}</span>
            </div>
            <div className="text-xl font-semibold flex items-center gap-2">
              {totals.withdraw.toFixed(6)} BTC
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-xs text-muted-foreground">
              +8.7% from last month
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <ChartContainer className="w-full h-[350px]" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="received"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
            />
            <Line
              dataKey="send"
              type="monotone"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--chart-2))", strokeWidth: 2 }}
            />
            <Line
              dataKey="withdraw"
              type="monotone"
              stroke="hsl(var(--chart-3))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--chart-3))", strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>

        {/* Chart Legend */}
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[hsl(var(--chart-1))] rounded"></div>
            <span className="text-muted-foreground">Received</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[hsl(var(--chart-2))] rounded"></div>
            <span className="text-muted-foreground">Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[hsl(var(--chart-3))] rounded"></div>
            <span className="text-muted-foreground">Withdrawn</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
