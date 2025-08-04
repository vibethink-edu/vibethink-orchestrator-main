import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react'
import { useSalesData } from '../hooks/useSalesData'
import { Sale, SALE_STAGES, SALES_COLORS } from '../types'

interface SalesTableProps {
  className?: string
}

// Sample sales data - in real app this would come from useSalesData hook
const salesData: Sale[] = [
  {
    id: '1',
    title: 'Enterprise Software License',
    customer_name: 'Acme Corporation',
    customer_email: 'john@acme.com',
    customer_company: 'Acme Corp',
    amount: 45000,
    stage: 'negotiating',
    probability: 80,
    close_date: '2024-02-15',
    created_at: '2024-01-10',
    updated_at: '2024-01-28',
    company_id: 'comp1',
    sales_rep_id: 'rep1',
    sales_rep_name: 'Sarah Johnson',
    source: 'inbound',
    tags: ['enterprise', 'priority'],
    notes: 'Key client for Q1 targets'
  },
  {
    id: '2',
    title: 'CRM Implementation',
    customer_name: 'TechStart Inc',
    customer_email: 'mary@techstart.io',
    customer_company: 'TechStart Inc',
    amount: 28000,
    stage: 'proposal',
    probability: 60,
    close_date: '2024-02-28',
    created_at: '2024-01-05',
    updated_at: '2024-01-25',
    company_id: 'comp1',
    sales_rep_id: 'rep2',
    sales_rep_name: 'Mike Chen',
    source: 'referral',
    tags: ['crm', 'implementation']
  },
  {
    id: '3',
    title: 'API Integration Services',
    customer_name: 'DataFlow Systems',
    customer_email: 'alex@dataflow.com',
    customer_company: 'DataFlow Systems',
    amount: 15000,
    stage: 'demo',
    probability: 40,
    close_date: '2024-03-10',
    created_at: '2024-01-12',
    updated_at: '2024-01-26',
    company_id: 'comp1',
    sales_rep_id: 'rep3',
    sales_rep_name: 'Emma Davis',
    source: 'outbound',
    tags: ['api', 'integration']
  },
  {
    id: '4',
    title: 'Cloud Migration Project',
    customer_name: 'Global Industries',
    customer_email: 'susan@global.com',
    customer_company: 'Global Industries',
    amount: 67000,
    stage: 'closing',
    probability: 90,
    close_date: '2024-02-08',
    created_at: '2023-12-15',
    updated_at: '2024-01-29',
    company_id: 'comp1',
    sales_rep_id: 'rep1',
    sales_rep_name: 'Sarah Johnson',
    source: 'partner',
    tags: ['cloud', 'migration', 'enterprise']
  },
  {
    id: '5',
    title: 'Analytics Dashboard',
    customer_name: 'RetailCorp',
    customer_email: 'james@retailcorp.com',
    customer_company: 'RetailCorp',
    amount: 22000,
    stage: 'qualifying',
    probability: 25,
    close_date: '2024-03-20',
    created_at: '2024-01-20',
    updated_at: '2024-01-27',
    company_id: 'comp1',
    sales_rep_id: 'rep4',
    sales_rep_name: 'James Wilson',
    source: 'website',
    tags: ['analytics', 'dashboard']
  }
]

export function SalesTable({ className }: SalesTableProps) {
  const { loading } = useSalesData()

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-3 w-[200px]" />
                </div>
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getStageColor = (stage: string) => {
    const stageColorMap: Record<string, string> = {
      prospecting: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      qualifying: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      demo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      proposal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      negotiating: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      closing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      won: 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-200',
      lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return stageColorMap[stage] || 'bg-gray-100 text-gray-800'
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600'
    if (probability >= 60) return 'text-yellow-600'
    if (probability >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const handleView = (sale: Sale) => {
    console.log('Viewing sale:', sale.id)
  }

  const handleEdit = (sale: Sale) => {
    console.log('Editing sale:', sale.id)
  }

  const handleDelete = (sale: Sale) => {
    console.log('Deleting sale:', sale.id)
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Sales</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>5 deals in pipeline</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rep</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Close Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesData.map((sale) => (
              <TableRow key={sale.id} className="hover:bg-muted/50">
                <TableCell>
                  <div>
                    <p className="font-medium">{sale.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.customer_company}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/avatars/${sale.customer_name.toLowerCase().replace(' ', '-')}.jpg`} />
                      <AvatarFallback>
                        {sale.customer_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{sale.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{sale.customer_email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{sale.sales_rep_name}</p>
                </TableCell>
                <TableCell>
                  <Badge className={getStageColor(sale.stage)}>
                    {SALE_STAGES[sale.stage]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{formatCurrency(sale.amount)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${getProbabilityColor(sale.probability)}`}>
                    {sale.probability}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{formatDate(sale.close_date)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(sale)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(sale)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Deal
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(sale)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Summary footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing 5 of 143 deals
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Total Value: {formatCurrency(177000)}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Weighted: {formatCurrency(105400)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}