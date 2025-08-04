"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Download,
  Filter
} from "lucide-react";

// Import analytics components
import { SalesReports } from "./SalesReports";
import { TopProducts } from "./TopProducts";
import { SalesMetrics } from "./SalesMetrics";

// Import hooks
import { usePosData } from "../../hooks/usePosData";

export function PosAnalytics() {
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "products" | "metrics">("overview");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "quarter">("today");

  const { transactions, products, isLoading } = usePosData();

  // Mock analytics data - In real app, this would be calculated from actual data
  const analyticsData = {
    today: {
      totalSales: 2458.75,
      totalTransactions: 48,
      averageTransaction: 51.22,
      customersServed: 42,
      salesGrowth: 12.5,
      transactionGrowth: 8.3
    },
    week: {
      totalSales: 16420.30,
      totalTransactions: 312,
      averageTransaction: 52.63,
      customersServed: 278,
      salesGrowth: 15.2,
      transactionGrowth: 11.7
    },
    month: {
      totalSales: 65890.45,
      totalTransactions: 1245,
      averageTransaction: 52.93,
      customersServed: 1089,
      salesGrowth: 18.9,
      transactionGrowth: 14.2
    },
    quarter: {
      totalSales: 198567.89,
      totalTransactions: 3756,
      averageTransaction: 52.89,
      customersServed: 3234,
      salesGrowth: 22.1,
      transactionGrowth: 16.8
    }
  };

  const currentData = analyticsData[dateRange];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Tab navigation
  const tabs = [
    {
      id: "overview" as const,
      label: "Overview",
      icon: BarChart3,
      description: "Key metrics and KPIs"
    },
    {
      id: "reports" as const,
      label: "Reports",
      icon: Calendar,
      description: "Detailed sales reports"
    },
    {
      id: "products" as const,
      label: "Products",
      icon: ShoppingCart,
      description: "Product performance"
    },
    {
      id: "metrics" as const,
      label: "Metrics",
      icon: TrendingUp,
      description: "Advanced analytics"
    }
  ];

  // Date range options
  const dateRanges = [
    { id: "today" as const, label: "Today" },
    { id: "week" as const, label: "This Week" },
    { id: "month" as const, label: "This Month" },
    { id: "quarter" as const, label: "This Quarter" }
  ];

  // Key metrics cards
  const keyMetrics = [
    {
      label: "Total Sales",
      value: formatCurrency(currentData.totalSales),
      icon: DollarSign,
      color: "hsl(var(--chart-1))",
      growth: currentData.salesGrowth,
      trend: "up" as const
    },
    {
      label: "Transactions",
      value: currentData.totalTransactions.toLocaleString(),
      icon: ShoppingCart,
      color: "hsl(var(--chart-2))",
      growth: currentData.transactionGrowth,
      trend: "up" as const
    },
    {
      label: "Avg Transaction",
      value: formatCurrency(currentData.averageTransaction),
      icon: BarChart3,
      color: "hsl(var(--chart-3))",
      growth: 3.2,
      trend: "up" as const
    },
    {
      label: "Customers",
      value: currentData.customersServed.toLocaleString(),
      icon: Users,
      color: "hsl(var(--chart-4))",
      growth: 7.8,
      trend: "up" as const
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "reports":
        return <SalesReports dateRange={dateRange} />;
      case "products":
        return <TopProducts dateRange={dateRange} />;
      case "metrics":
        return <SalesMetrics dateRange={dateRange} />;
      default:
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {keyMetrics.map((metric, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      <metric.icon 
                        className="h-6 w-6" 
                        style={{ color: metric.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.label}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold">
                          {metric.value}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${metric.color}20`,
                            color: metric.color 
                          }}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{metric.growth.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Trend */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Sales Trend</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Sales trend chart would display here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Integration with chart library required
                    </p>
                  </div>
                </div>
              </Card>

              {/* Payment Methods */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Payment Methods</h3>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="space-y-3">
                  {[
                    { method: "Cash", amount: 1245.50, percentage: 50.6, color: "hsl(var(--chart-1))" },
                    { method: "Credit Card", amount: 865.25, percentage: 35.2, color: "hsl(var(--chart-2))" },
                    { method: "Debit Card", amount: 248.00, percentage: 10.1, color: "hsl(var(--chart-3))" },
                    { method: "Digital Wallet", amount: 100.00, percentage: 4.1, color: "hsl(var(--chart-4))" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.method}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(item.amount)}</p>
                        <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { time: "2 min ago", event: "Sale completed", amount: "$45.67", status: "success" },
                  { time: "5 min ago", event: "Refund processed", amount: "$23.45", status: "warning" },
                  { time: "8 min ago", event: "Sale completed", amount: "$89.12", status: "success" },
                  { time: "12 min ago", event: "Sale completed", amount: "$156.78", status: "success" },
                  { time: "15 min ago", event: "Inventory adjusted", amount: "Product ABC", status: "info" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' :
                        activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{activity.event}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {activity.amount}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading analytics...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">POS Analytics</h2>
          <p className="text-muted-foreground">
            Track sales performance and business insights
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex space-x-2">
          {dateRanges.map((range) => (
            <Button
              key={range.id}
              variant={dateRange === range.id ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(range.id)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              className={`flex items-center space-x-2 px-4 py-2 rounded-b-none border-b-2 ${
                isActive 
                  ? "border-primary bg-primary text-primary-foreground" 
                  : "border-transparent hover:border-muted-foreground/20"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs opacity-70">{tab.description}</div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {renderTabContent()}
      </div>
    </div>
  );
}