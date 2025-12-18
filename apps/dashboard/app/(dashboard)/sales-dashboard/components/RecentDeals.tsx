import { Card, CardContent, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage, Badge, Button, Skeleton } from '@vibethink/ui'
import { 
  Clock, 
  DollarSign, 
  TrendingUp, 
  User,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  Activity
} from 'lucide-react'
import { useSalesData } from '../hooks/useSalesData'
import { SaleActivity, SALES_ACTIVITY_TYPES } from '../types'

interface RecentDealsProps {
  className?: string
}

// Sample recent activities data - in real app this would come from useSalesData hook
const recentActivities: (SaleActivity & {
  customer_name?: string
  deal_title?: string
  sales_rep_name?: string
  amount?: number
})[] = [
  {
    id: '1',
    sale_id: 'sale_1',
    type: 'stage_change',
    title: 'Deal moved to Closing',
    description: 'Enterprise Software License moved from Negotiating to Closing stage',
    created_at: '2024-01-28T14:30:00Z',
    created_by: 'sarah_johnson',
    company_id: 'comp1',
    customer_name: 'Acme Corporation',
    deal_title: 'Enterprise Software License',
    sales_rep_name: 'Sarah Johnson',
    amount: 45000,
    previous_stage: 'negotiating',
    new_stage: 'closing'
  },
  {
    id: '2',
    sale_id: 'sale_2',
    type: 'proposal_sent',
    title: 'Proposal sent to TechStart Inc',
    description: 'CRM Implementation proposal sent with custom pricing',
    created_at: '2024-01-28T11:15:00Z',
    created_by: 'mike_chen',
    company_id: 'comp1',
    customer_name: 'TechStart Inc',
    deal_title: 'CRM Implementation',
    sales_rep_name: 'Mike Chen',
    amount: 28000
  },
  {
    id: '3',
    sale_id: 'sale_3',
    type: 'demo',
    title: 'Product demo completed',
    description: 'Successful demo session with DataFlow Systems technical team',
    created_at: '2024-01-28T09:45:00Z',
    created_by: 'emma_davis',
    company_id: 'comp1',
    customer_name: 'DataFlow Systems',
    deal_title: 'API Integration Services',
    sales_rep_name: 'Emma Davis',
    amount: 15000
  },
  {
    id: '4',
    sale_id: 'sale_4',
    type: 'call',
    title: 'Follow-up call scheduled',
    description: 'Called Global Industries to discuss contract terms',
    created_at: '2024-01-27T16:20:00Z',
    created_by: 'sarah_johnson',
    company_id: 'comp1',
    customer_name: 'Global Industries',
    deal_title: 'Cloud Migration Project',
    sales_rep_name: 'Sarah Johnson',
    amount: 67000
  },
  {
    id: '5',
    sale_id: 'sale_5',
    type: 'email',
    title: 'Pricing information sent',
    description: 'Sent detailed pricing breakdown to RetailCorp',
    created_at: '2024-01-27T14:10:00Z',
    created_by: 'james_wilson',
    company_id: 'comp1',
    customer_name: 'RetailCorp',
    deal_title: 'Analytics Dashboard',
    sales_rep_name: 'James Wilson',
    amount: 22000
  },
  {
    id: '6',
    sale_id: 'sale_6',
    type: 'meeting',
    title: 'Discovery meeting held',
    description: 'Initial requirements gathering with FinanceFlow',
    created_at: '2024-01-27T10:30:00Z',
    created_by: 'lisa_rodriguez',
    company_id: 'comp1',
    customer_name: 'FinanceFlow',
    deal_title: 'Financial Reporting System',
    sales_rep_name: 'Lisa Rodriguez',
    amount: 38000
  }
]

export function RecentDeals({ className }: RecentDealsProps) {
  const { loading } = useSalesData()

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-[120px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-6 w-[60px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}K`
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    
    if (diffHours >= 24) {
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays}d ago`
    } else if (diffHours >= 1) {
      return `${diffHours}h ago`
    } else {
      return `${diffMinutes}m ago`
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4 text-blue-600" />
      case 'email':
        return <Mail className="h-4 w-4 text-green-600" />
      case 'meeting':
      case 'demo':
        return <User className="h-4 w-4 text-purple-600" />
      case 'proposal_sent':
        return <DollarSign className="h-4 w-4 text-orange-600" />
      case 'stage_change':
        return <ArrowRight className="h-4 w-4 text-indigo-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'email':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'meeting':
      case 'demo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'proposal_sent':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'stage_change':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const handleViewDeal = (activity: any) => {
    console.log('Viewing deal:', activity.sale_id)
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Recent Activity
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => handleViewDeal(activity)}
          >
            {/* Activity icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
              {getActivityIcon(activity.type)}
            </div>

            {/* Activity content */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{activity.title}</p>
                <Badge className={getActivityColor(activity.type)} variant="secondary">
                  {SALES_ACTIVITY_TYPES[activity.type]}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {activity.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{activity.customer_name}</span>
                {activity.amount && (
                  <>
                    <span>•</span>
                    <span className="font-medium">{formatCurrency(activity.amount)}</span>
                  </>
                )}
                <span>•</span>
                <span>{activity.sales_rep_name}</span>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground">
              {formatTimeAgo(activity.created_at)}
            </div>
          </div>
        ))}

        {/* Activity summary */}
        <div className="pt-4 mt-4 border-t space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">Activities Today</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">156</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Activity up 18% vs last week</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
