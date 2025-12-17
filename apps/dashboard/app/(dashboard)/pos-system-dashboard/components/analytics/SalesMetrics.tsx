"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@vibethink/ui";
import { Badge } from "@/shared/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Calendar
} from "lucide-react";

interface SalesMetricsProps {
  dateRange: "today" | "week" | "month" | "quarter";
}

export function SalesMetrics({ dateRange }: SalesMetricsProps) {
  const [metricType, setMetricType] = useState<"kpi" | "trends" | "goals" | "performance">("kpi");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Mock metrics data
  const metricsData = {
    kpi: {
      revenuePerHour: 245.83,
      transactionsPerHour: 4.8,
      averageTransactionValue: 51.22,
      customerReturnRate: 68.5,
      conversionRate: 85.2,
      profitMargin: 42.8,
      inventoryTurnover: 12.4,
      customerSatisfaction: 4.7
    },
    trends: [
      { period: "9:00 AM", revenue: 125.50, transactions: 3, customers: 3 },
      { period: "10:00 AM", revenue: 234.75, transactions: 5, customers: 5 },
      { period: "11:00 AM", revenue: 345.25, transactions: 7, customers: 6 },
      { period: "12:00 PM", revenue: 567.80, transactions: 12, customers: 11 },
      { period: "1:00 PM", revenue: 423.45, transactions: 9, customers: 8 },
      { period: "2:00 PM", revenue: 678.90, transactions: 14, customers: 12 },
      { period: "3:00 PM", revenue: 456.30, transactions: 10, customers: 9 },
      { period: "4:00 PM", revenue: 342.10, transactions: 7, customers: 7 },
      { period: "5:00 PM", revenue: 289.70, transactions: 6, customers: 6 }
    ],
    goals: [
      { metric: "Daily Sales", target: 3000, current: 2458.75, progress: 81.96 },
      { metric: "Transactions", target: 60, current: 48, progress: 80.0 },
      { metric: "New Customers", target: 15, current: 12, progress: 80.0 },
      { metric: "Profit Margin", target: 45, current: 42.8, progress: 95.11 }
    ],
    performance: {
      salesEfficiency: 92.3,
      staffProductivity: 87.6,
      customerSatisfaction: 94.2,
      inventoryOptimization: 78.9,
      operationalEfficiency: 85.4
    }
  };

  const metricTypes = [
    { id: "kpi" as const, label: "KPIs", icon: Target },
    { id: "trends" as const, label: "Trends", icon: TrendingUp },
    { id: "goals" as const, label: "Goals", icon: BarChart3 },
    { id: "performance" as const, label: "Performance", icon: Activity }
  ];

  const renderMetricContent = () => {
    switch (metricType) {
      case "kpi":
        return (
          <div className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue/Hour</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(metricsData.kpi.revenuePerHour)}
                    </p>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.5%
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transactions/Hour</p>
                    <p className="text-xl font-bold text-blue-600">
                      {metricsData.kpi.transactionsPerHour.toFixed(1)}
                    </p>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.3%
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Transaction</p>
                    <p className="text-xl font-bold text-purple-600">
                      {formatCurrency(metricsData.kpi.averageTransactionValue)}
                    </p>
                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 mt-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -2.1%
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Return Rate</p>
                    <p className="text-xl font-bold text-orange-600">
                      {metricsData.kpi.customerReturnRate.toFixed(1)}%
                    </p>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5.7%
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            {/* Additional KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="p-3 bg-indigo-50 rounded-lg inline-block mb-2">
                    <Target className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {metricsData.kpi.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Visitors to buyers</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-center">
                  <div className="p-3 bg-teal-50 rounded-lg inline-block mb-2">
                    <PieChart className="h-6 w-6 text-teal-600" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {metricsData.kpi.profitMargin.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Overall profitability</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-center">
                  <div className="p-3 bg-cyan-50 rounded-lg inline-block mb-2">
                    <Activity className="h-6 w-6 text-cyan-600" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Inventory Turnover</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {metricsData.kpi.inventoryTurnover.toFixed(1)}x
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Annual turnover rate</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-center">
                  <div className="p-3 bg-pink-50 rounded-lg inline-block mb-2">
                    <Users className="h-6 w-6 text-pink-600" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {metricsData.kpi.customerSatisfaction.toFixed(1)}/5
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Customer rating</p>
                </div>
              </Card>
            </div>
          </div>
        );

      case "trends":
        return (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Hourly Performance Trends</h3>
            <div className="space-y-3">
              {metricsData.trends.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.period}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.transactions} transactions • {item.customers} customers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(item.revenue)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.revenue / item.transactions)} avg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      case "goals":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Daily Goals Progress</h3>
              <p className="text-muted-foreground">Track your performance against set targets</p>
            </div>
            
            {metricsData.goals.map((goal, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{goal.metric}</h4>
                    <p className="text-sm text-muted-foreground">
                      Target: {goal.metric.includes('Sales') || goal.metric.includes('Margin') 
                        ? goal.metric.includes('Margin') ? `${goal.target}%` : formatCurrency(goal.target)
                        : goal.target.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {goal.metric.includes('Sales') 
                        ? formatCurrency(goal.current)
                        : goal.metric.includes('Margin')
                        ? `${goal.current.toFixed(1)}%`
                        : goal.current.toLocaleString()}
                    </p>
                    <Badge 
                      variant="secondary"
                      className={`text-xs ${
                        goal.progress >= 90 
                          ? 'bg-green-100 text-green-800'
                          : goal.progress >= 70
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {goal.progress.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      goal.progress >= 90 
                        ? 'bg-green-500'
                        : goal.progress >= 70
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        );

      case "performance":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Overall Performance Score</h3>
              <div className="text-4xl font-bold text-primary mb-2">
                {Object.values(metricsData.performance).reduce((a, b) => a + b, 0) / Object.values(metricsData.performance).length}%
              </div>
              <p className="text-muted-foreground">Composite performance rating</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(metricsData.performance).map(([key, value], index) => {
                const labels: Record<string, string> = {
                  salesEfficiency: "Sales Efficiency",
                  staffProductivity: "Staff Productivity", 
                  customerSatisfaction: "Customer Satisfaction",
                  inventoryOptimization: "Inventory Optimization",
                  operationalEfficiency: "Operational Efficiency"
                };

                return (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{labels[key]}</h4>
                      <Badge 
                        variant="secondary"
                        className={`${
                          value >= 90 
                            ? 'bg-green-100 text-green-800'
                            : value >= 80
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {value.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          value >= 90 
                            ? 'bg-green-500'
                            : value >= 80
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      default:
        return (
          <Card className="p-8">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Metrics Coming Soon</h3>
              <p className="text-muted-foreground">
                This metrics view is under development.
              </p>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Type Selector */}
      <div className="flex space-x-2">
        {metricTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <Button
              key={type.id}
              variant={metricType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setMetricType(type.id)}
              className="flex items-center space-x-2"
            >
              <IconComponent className="h-4 w-4" />
              <span>{type.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Metric Content */}
      {renderMetricContent()}

      {/* Metric Footer */}
      <Card className="p-4 bg-muted/20">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Metrics calculated for {dateRange} period • Last updated: {new Date().toLocaleString()}
          </p>
          <p>
            Benchmarks based on industry standards and historical performance
          </p>
        </div>
      </Card>
    </div>
  );
}
