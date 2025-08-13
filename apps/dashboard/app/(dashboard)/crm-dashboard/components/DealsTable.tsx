import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { MoreHorizontal, Calendar } from 'lucide-react'
import { useCrmData } from '../hooks/useCrmData'
import { useCrmFilters } from '../hooks/useCrmFilters'
import { Deal, DEAL_STAGES } from '../types'

const stageColors = {
  discovery: 'bg-gray-100 text-gray-800',
  qualified: 'bg-blue-100 text-blue-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closed: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800'
}

interface DealsTableProps {
  className?: string
}

export function DealsTable({ className }: DealsTableProps) {
  const { deals, loading, error } = useCrmData()
  const { filterDeals } = useCrmFilters()
  
  const filteredDeals = filterDeals(deals)
  const activeDeals = filteredDeals.filter(deal => deal.stage !== 'closed' && deal.stage !== 'lost')

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Active Deals Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-[80px]" />
                      <Skeleton className="h-6 w-[100px]" />
                    </div>
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Active Deals Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error loading deals: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Active Deals Pipeline
          <span className="text-sm font-normal text-muted-foreground">
            {activeDeals.length} active deals
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeDeals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active deals found</p>
            </div>
          ) : (
            activeDeals.slice(0, 10).map((deal: Deal) => (
              <div key={deal.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-sm text-muted-foreground">{deal.customer_name}</p>
                    {deal.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{deal.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">${deal.value.toLocaleString()}</span>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge className={stageColors[deal.stage as keyof typeof stageColors]}>
                      {DEAL_STAGES[deal.stage]}
                    </Badge>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(deal.close_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{deal.probability}%</span>
                    <Progress value={deal.probability} className="w-16 h-2" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}