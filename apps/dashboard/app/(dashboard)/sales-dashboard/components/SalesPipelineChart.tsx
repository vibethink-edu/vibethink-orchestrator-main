import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { useSalesData } from '../hooks/useSalesData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { SALES_COLORS } from '../types'

interface SalesPipelineChartProps {
  className?: string
}

// Sample pipeline data - in real app this would come from useSalesData hook
const pipelineData = [
  { 
    stage: 'Prospecting', 
    deals: 45, 
    value: 125000,
    percentage: 25,
    color: SALES_COLORS.prospecting
  },
  { 
    stage: 'Qualifying', 
    deals: 32, 
    value: 189000,
    percentage: 18,
    color: SALES_COLORS.qualifying
  },
  { 
    stage: 'Demo', 
    deals: 28, 
    value: 245000,
    percentage: 16,
    color: SALES_COLORS.demo
  },
  { 
    stage: 'Proposal', 
    deals: 18, 
    value: 167000,
    percentage: 10,
    color: SALES_COLORS.proposal
  },
  { 
    stage: 'Negotiating', 
    deals: 12, 
    value: 145000,
    percentage: 7,
    color: SALES_COLORS.negotiating
  },
  { 
    stage: 'Closing', 
    deals: 8, 
    value: 128000,
    percentage: 4,
    color: SALES_COLORS.closing
  }
]

const conversionData = [
  { stage: 'Prospecting → Qualifying', rate: 71, target: 75 },
  { stage: 'Qualifying → Demo', rate: 88, target: 80 },
  { stage: 'Demo → Proposal', rate: 64, target: 70 },
  { stage: 'Proposal → Negotiating', rate: 67, target: 65 },
  { stage: 'Negotiating → Closing', rate: 67, target: 75 },
  { stage: 'Closing → Won', rate: 75, target: 80 }
]

export function SalesPipelineChart({ className }: SalesPipelineChartProps) {
  const { loading } = useSalesData()

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}K`
  const formatTooltip = (value: any, name: string) => {
    if (name === 'deals') {
      return [`${value} deals`, 'Number of Deals']
    }
    if (name === 'value') {
      return [formatCurrency(value), 'Pipeline Value']
    }
    if (name === 'rate') {
      return [`${value}%`, 'Conversion Rate']
    }
    if (name === 'target') {
      return [`${value}%`, 'Target Rate']
    }
    return [value, name]
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sales Pipeline Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pipeline" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pipeline">Pipeline Overview</TabsTrigger>
            <TabsTrigger value="distribution">Stage Distribution</TabsTrigger>
            <TabsTrigger value="conversion">Conversion Rates</TabsTrigger>
          </TabsList>

          {/* Pipeline Overview - Bar Chart */}
          <TabsContent value="pipeline" className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="stage" 
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={formatTooltip}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="deals" 
                  name="deals"
                  fill="hsl(var(--chart-1))"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Pipeline summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">143</p>
                <p className="text-xs text-muted-foreground">Total Deals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">$999K</p>
                <p className="text-xs text-muted-foreground">Pipeline Value</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">28.4%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">42 days</p>
                <p className="text-xs text-muted-foreground">Avg Cycle</p>
              </div>
            </div>
          </TabsContent>

          {/* Stage Distribution - Pie Chart */}
          <TabsContent value="distribution" className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ stage, percentage }) => `${stage}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="deals"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} deals`, 'Number of Deals']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Conversion Rates - Bar Chart */}
          <TabsContent value="conversion" className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={conversionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="stage" 
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  className="text-xs"
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="rate" 
                  name="rate"
                  fill="hsl(var(--chart-2))"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="target" 
                  name="target"
                  fill="hsl(var(--chart-3))"
                  radius={[2, 2, 0, 0]}
                  opacity={0.7}
                />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="flex justify-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-2))' }}></div>
                <span className="text-sm text-muted-foreground">Actual Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded opacity-70" style={{ backgroundColor: 'hsl(var(--chart-3))' }}></div>
                <span className="text-sm text-muted-foreground">Target Rate</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
