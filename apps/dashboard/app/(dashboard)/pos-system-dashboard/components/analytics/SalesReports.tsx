"use client";

import React, { useState } from "react";
import { Card, Button, Badge } from "@vibethink/ui";
import { 
  Calendar, 
  Download, 
  FileText,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock
} from "lucide-react";

interface SalesReportsProps {
  dateRange: "today" | "week" | "month" | "quarter";
}

export function SalesReports({ dateRange }: SalesReportsProps) {
  const [reportType, setReportType] = useState<"summary" | "detailed" | "hourly" | "daily">("summary");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Mock report data
  const reportData = {
    summary: {
      totalSales: 2458.75,
      totalTransactions: 48,
      averageTransaction: 51.22,
      refunds: 3,
      refundAmount: 87.50,
      topSellingHour: "2:00 PM - 3:00 PM",
      peakSalesDay: "Friday"
    },
    hourlyBreakdown: [
      { hour: "9:00 AM", sales: 125.50, transactions: 3 },
      { hour: "10:00 AM", sales: 234.75, transactions: 5 },
      { hour: "11:00 AM", sales: 345.25, transactions: 7 },
      { hour: "12:00 PM", sales: 567.80, transactions: 12 },
      { hour: "1:00 PM", sales: 423.45, transactions: 9 },
      { hour: "2:00 PM", sales: 678.90, transactions: 14 },
      { hour: "3:00 PM", sales: 456.30, transactions: 10 },
      { hour: "4:00 PM", sales: 342.10, transactions: 7 },
      { hour: "5:00 PM", sales: 289.70, transactions: 6 }
    ],
    recentTransactions: [
      { id: "TXN-001", time: "15:45", amount: 45.67, items: 3, payment: "Cash", status: "completed" },
      { id: "TXN-002", time: "15:42", amount: 23.45, items: 1, payment: "Card", status: "completed" },
      { id: "TXN-003", time: "15:38", amount: 89.12, items: 5, payment: "Cash", status: "completed" },
      { id: "TXN-004", time: "15:35", amount: 156.78, items: 8, payment: "Card", status: "completed" },
      { id: "TXN-005", time: "15:30", amount: 34.20, items: 2, payment: "Digital", status: "completed" }
    ]
  };

  const reportTypes = [
    { id: "summary" as const, label: "Summary", icon: FileText },
    { id: "detailed" as const, label: "Detailed", icon: Calendar },
    { id: "hourly" as const, label: "Hourly", icon: Clock },
    { id: "daily" as const, label: "Daily", icon: TrendingUp }
  ];

  const renderReportContent = () => {
    switch (reportType) {
      case "summary":
        return (
          <div className="space-y-6">
            {/* Key Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(reportData.summary.totalSales)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {reportData.summary.totalTransactions}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Transaction</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(reportData.summary.averageTransaction)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Refunds</p>
                    <p className="text-2xl font-bold text-red-600">
                      {reportData.summary.refunds}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(reportData.summary.refundAmount)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Key Insights */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Peak Sales Hour</h4>
                  <p className="text-sm text-blue-700">{reportData.summary.topSellingHour}</p>
                  <p className="text-xs text-blue-600 mt-1">Highest transaction volume</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Best Sales Day</h4>
                  <p className="text-sm text-green-700">{reportData.summary.peakSalesDay}</p>
                  <p className="text-xs text-green-600 mt-1">Highest revenue day</p>
                </div>
              </div>
            </Card>

            {/* Performance Comparison */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Performance vs Previous Period</h3>
              <div className="space-y-3">
                {[
                  { metric: "Sales Revenue", current: 2458.75, previous: 2156.32, change: 14.0 },
                  { metric: "Transaction Count", current: 48, previous: 42, change: 14.3 },
                  { metric: "Average Transaction", current: 51.22, previous: 51.34, change: -0.2 },
                  { metric: "Customer Count", current: 45, previous: 39, change: 15.4 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.metric}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {item.metric.includes('Count') || item.metric.includes('Customer') 
                          ? item.current.toString() 
                          : formatCurrency(item.current)}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={`${
                        item.change > 0 
                          ? 'bg-green-100 text-green-800' 
                          : item.change < 0 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case "hourly":
        return (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Hourly Sales Breakdown</h3>
            <div className="space-y-3">
              {reportData.hourlyBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.hour}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.transactions} transaction{item.transactions !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(item.sales)}</p>
                    <p className="text-xs text-muted-foreground">
                      Avg: {formatCurrency(item.sales / item.transactions)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      case "detailed":
        return (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {reportData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{transaction.id}</Badge>
                    <div>
                      <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.items} item{transaction.items !== 1 ? 's' : ''} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{transaction.payment}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      default:
        return (
          <Card className="p-8">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Report Coming Soon</h3>
              <p className="text-muted-foreground">
                This report type is under development.
              </p>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          {reportTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Button
                key={type.id}
                variant={reportType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setReportType(type.id)}
                className="flex items-center space-x-2"
              >
                <IconComponent className="h-4 w-4" />
                <span>{type.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Report Content */}
      {renderReportContent()}

      {/* Report Footer */}
      <Card className="p-4 bg-muted/20">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Report generated for {dateRange} period • Last updated: {new Date().toLocaleString()}
          </p>
          <p>
            Data includes all completed transactions and excludes voided sales
          </p>
        </div>
      </Card>
    </div>
  );
}
