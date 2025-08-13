import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Trophy, TrendingUp, Target, Award } from 'lucide-react'
import { useSalesData } from '../hooks/useSalesData'
import { SalesRep } from '../types'

interface TopPerformersProps {
  className?: string
}

// Sample top performers data - in real app this would come from useSalesData hook
const topPerformers: (SalesRep & { 
  quota_progress: number
  deals_this_month: number
  revenue_this_month: number
  rank_change: number
})[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    phone: '+1 555 0123',
    avatar: '/avatars/sarah.jpg',
    role: 'senior',
    territory: 'North America',
    commission_rate: 0.15,
    created_at: '2023-01-15',
    updated_at: '2024-01-28',
    company_id: 'comp1',
    monthly_quota: 100000,
    deals_closed: 47,
    total_revenue: 485000,
    conversion_rate: 32.5,
    last_activity: '2024-01-28',
    quota_progress: 112,
    deals_this_month: 12,
    revenue_this_month: 112000,
    rank_change: 0
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    phone: '+1 555 0124',
    avatar: '/avatars/mike.jpg',
    role: 'senior',
    territory: 'West Coast',
    commission_rate: 0.14,
    created_at: '2023-02-01',
    updated_at: '2024-01-27',
    company_id: 'comp1',
    monthly_quota: 95000,
    deals_closed: 38,
    total_revenue: 421000,
    conversion_rate: 28.7,
    last_activity: '2024-01-27',
    quota_progress: 105,
    deals_this_month: 9,
    revenue_this_month: 99750,
    rank_change: 1
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@company.com',
    phone: '+1 555 0125',
    avatar: '/avatars/emma.jpg',
    role: 'manager',
    territory: 'Europe',
    commission_rate: 0.16,
    created_at: '2022-08-10',
    updated_at: '2024-01-26',
    company_id: 'comp1',
    monthly_quota: 120000,
    deals_closed: 34,
    total_revenue: 398000,
    conversion_rate: 31.2,
    last_activity: '2024-01-26',
    quota_progress: 98,
    deals_this_month: 8,
    revenue_this_month: 117600,
    rank_change: -1
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james@company.com',
    phone: '+1 555 0126',
    avatar: '/avatars/james.jpg',
    role: 'junior',
    territory: 'East Coast',
    commission_rate: 0.12,
    created_at: '2023-06-01',
    updated_at: '2024-01-25',
    company_id: 'comp1',
    monthly_quota: 75000,
    deals_closed: 29,
    total_revenue: 234000,
    conversion_rate: 25.4,
    last_activity: '2024-01-25',
    quota_progress: 89,
    deals_this_month: 7,
    revenue_this_month: 66750,
    rank_change: 0
  },
  {
    id: '5',
    name: 'Lisa Rodriguez',
    email: 'lisa@company.com',
    phone: '+1 555 0127',
    avatar: '/avatars/lisa.jpg',
    role: 'senior',
    territory: 'South America',
    commission_rate: 0.15,
    created_at: '2023-03-15',
    updated_at: '2024-01-24',
    company_id: 'comp1',
    monthly_quota: 90000,
    deals_closed: 25,
    total_revenue: 298000,
    conversion_rate: 27.8,
    last_activity: '2024-01-24',
    quota_progress: 85,
    deals_this_month: 6,
    revenue_this_month: 76500,
    rank_change: 2
  }
]

export function TopPerformers({ className }: TopPerformersProps) {
  const { loading } = useSalesData()

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-[120px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <Skeleton className="h-6 w-[60px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}K`
  const formatPercentage = (value: number) => `${value}%`

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-4 w-4 text-yellow-500" />
      case 1: return <Award className="h-4 w-4 text-gray-400" />
      case 2: return <Award className="h-4 w-4 text-amber-600" />
      default: return <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
    }
  }

  const getRankChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-muted-foreground'
  }

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return '↑'
    if (change < 0) return '↓'
    return '−'
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 80) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Performers
        </CardTitle>
        <Badge variant="secondary" className="text-xs">
          This Month
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {topPerformers.map((performer, index) => (
          <div key={performer.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            {/* Rank */}
            <div className="flex items-center justify-center w-8 h-8">
              {getRankIcon(index)}
            </div>

            {/* Avatar and basic info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={performer.avatar} />
                <AvatarFallback>{performer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{performer.name}</p>
                  {performer.rank_change !== 0 && (
                    <span className={`text-xs ${getRankChangeColor(performer.rank_change)}`}>
                      {getRankChangeIcon(performer.rank_change)}{Math.abs(performer.rank_change)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{performer.territory}</span>
                  <span>•</span>
                  <span className="capitalize">{performer.role}</span>
                </div>
              </div>
            </div>

            {/* Performance metrics */}
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {formatCurrency(performer.revenue_this_month)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({performer.deals_this_month} deals)
                </span>
              </div>
              
              {/* Quota progress */}
              <div className="flex items-center gap-2 w-24">
                <Progress 
                  value={Math.min(performer.quota_progress, 100)} 
                  className="h-1 flex-1"
                />
                <span className={`text-xs font-medium ${
                  performer.quota_progress >= 100 ? 'text-green-600' : 
                  performer.quota_progress >= 80 ? 'text-yellow-600' : 
                  'text-muted-foreground'
                }`}>
                  {performer.quota_progress}%
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Summary statistics */}
        <div className="pt-4 mt-4 border-t space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-foreground">96%</p>
              <p className="text-xs text-muted-foreground">Avg Quota Achievement</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{formatCurrency(472600)}</p>
              <p className="text-xs text-muted-foreground">Total Team Revenue</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Team performance up 15% vs last month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}