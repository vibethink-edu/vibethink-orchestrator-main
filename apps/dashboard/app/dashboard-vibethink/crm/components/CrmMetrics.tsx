import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui/components/card'
import { Skeleton } from '@vibethink/ui/components/skeleton'
import { Users, DollarSign, TrendingUp, Target } from 'lucide-react'
import { useCrmData } from '../hooks/useCrmData'

interface CrmMetricsProps {
  className?: string
}

export function CrmMetrics({ className }: CrmMetricsProps) {
  const { metrics, loading, error } = useCrmData()

  if (loading) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px] mb-2" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">Error loading metrics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value}%`

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalCustomers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(metrics.monthlyGrowth.customers)} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(metrics.monthlyGrowth.revenue)} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeDeals}</div>
          <p className="text-xs text-muted-foreground">
            Pipeline value: {formatCurrency(metrics.averageDealSize * metrics.activeDeals)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
          <p className="text-xs text-muted-foreground">
            Avg deal size: {formatCurrency(metrics.averageDealSize)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
