"use client";

import React, { useState } from "react";
;
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings,
  CreditCard,
  Users,
  TrendingUp,
  DollarSign
} from "lucide-react";

// Import POS components
import { PosInterface } from "./components/pos-interface/PosInterface";
import { ProductsManagement } from "./components/products/ProductsManagement";
import { PosAnalytics } from "./components/analytics/PosAnalytics";
import { PosHeader } from "./components/PosHeader";

// Import hooks
import { usePosData } from "./hooks/usePosData";
import { usePosSecurity } from "./hooks/usePosSecurity";

// Import types
import { PosView } from "./types";

export default function PosSystemPage() {
  const [activeView, setActiveView] = useState<PosView>("pos");
  const { sessionData, isLoading } = usePosData();
  const { hasPermission } = usePosSecurity();

  // Navigation items for POS system
  const navigationItems = [
    {
      id: "pos" as PosView,
      label: "POS Interface",
      icon: ShoppingCart,
      description: "Process transactions and sales",
      permission: "POS_ACCESS"
    },
    {
      id: "products" as PosView,
      label: "Products",
      icon: Package,
      description: "Manage inventory and products",
      permission: "INVENTORY_MANAGE"
    },
    {
      id: "analytics" as PosView,
      label: "Analytics",
      icon: BarChart3,
      description: "Sales reports and analytics",
      permission: "ANALYTICS_VIEW"
    }
  ];

  // Quick stats for dashboard overview
  const quickStats = [
    {
      label: "Today's Sales",
      value: sessionData?.todaySales || 0,
      icon: DollarSign,
      color: "hsl(var(--chart-1))",
      trend: "+12%"
    },
    {
      label: "Transactions",
      value: sessionData?.todayTransactions || 0,
      icon: CreditCard,
      color: "hsl(var(--chart-2))",
      trend: "+8%"
    },
    {
      label: "Active Products",
      value: sessionData?.activeProducts || 0,
      icon: Package,
      color: "hsl(var(--chart-3))",
      trend: "+3%"
    },
    {
      label: "Customers Served",
      value: sessionData?.todayCustomers || 0,
      icon: Users,
      color: "hsl(var(--chart-4))",
      trend: "+15%"
    }
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case "pos":
        return <PosInterface />;
      case "products":
        return <ProductsManagement />;
      case "analytics":
        return <PosAnalytics />;
      default:
        return <PosInterface />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
        {/* POS Header */}
        <PosHeader activeView={activeView} sessionData={sessionData} />

        {/* Quick Stats Overview - Only show on main POS view */}
        {activeView === "pos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center space-x-4">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon 
                      className="h-5 w-5" 
                      style={{ color: stat.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">
                        {typeof stat.value === 'number' && stat.label.includes('Sales') 
                          ? `$${stat.value.toLocaleString()}` 
                          : stat.value.toLocaleString()}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${stat.color}20`,
                          color: stat.color 
                        }}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.trend}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;
            const hasAccess = hasPermission(item.permission);
            
            if (!hasAccess) return null;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`flex items-center space-x-2 px-4 py-2 rounded-b-none border-b-2 ${
                  isActive 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-transparent hover:border-muted-foreground/20"
                }`}
                onClick={() => setActiveView(item.id)}
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Active View Content */}
        <div className="flex-1">
          {renderActiveView()}
        </div>
      </div>
  );
}