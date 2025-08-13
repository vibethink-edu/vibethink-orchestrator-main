import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/bundui-premium/components/ui/chart'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { TrendingUp, Users, Target } from 'lucide-react'

// Sample data for CRM charts
const customerGrowthData = [
  { month: 'Jan', customers: 150 },
  { month: 'Feb', customers: 180 },
  { month: 'Mar', customers: 220 },
  { month: 'Apr', customers: 280 },
  { month: 'May', customers: 320 },
  { month: 'Jun', customers: 380 }
]

const chartConfig = {
  customers: {
    label: "Customers",
    color: "hsl(var(--chart-1))",
  },
  value: {
    label: "Value",
    color: "hsl(var(--chart-2))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-3))",
  },
}

const salesFunnelData = [
  { stage: 'Leads', value: 1000 },
  { stage: 'Qualified', value: 750 },
  { stage: 'Proposal', value: 500 },
  { stage: 'Negotiation', value: 350 },
  { stage: 'Decision', value: 200 },
  { stage: 'Closed', value: 127 }
]

const revenueData = [
  { month: 'Jan', revenue: 25000 },
  { month: 'Feb', revenue: 32000 },
  { month: 'Mar', revenue: 28000 },
  { month: 'Apr', revenue: 45000 },
  { month: 'May', revenue: 52000 },
  { month: 'Jun', revenue: 48000 }
]

export function CrmCharts() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Customer Growth</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <LineChart data={customerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="customers" 
                stroke="var(--color-customers)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-customers)" }}
              />
            </LineChart>
          </ChartContainer>
          <div className="flex items-center pt-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-muted-foreground">
              +23% growth this quarter
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Sales Funnel</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <BarChart data={salesFunnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="value" 
                fill="var(--color-value)"
              />
            </BarChart>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12.7%</div>
              <div className="text-xs text-muted-foreground">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-xs text-muted-foreground">Active Deals</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Revenue Trends</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="revenue" 
                fill="var(--color-revenue)"
              />
            </BarChart>
          </ChartContainer>
          <div className="flex items-center justify-between pt-2">
            <div className="text-center">
              <div className="text-lg font-bold">$84,290</div>
              <div className="text-xs text-muted-foreground">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">+25%</div>
              <div className="text-xs text-muted-foreground">vs Last Month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}