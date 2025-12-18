"use client";

import React, { useState } from "react";
import { Card, Button, Badge } from "@vibethink/ui";
import { 
  TrendingUp, 
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Star,
  AlertTriangle
} from "lucide-react";

interface TopProductsProps {
  dateRange: "today" | "week" | "month" | "quarter";
}

export function TopProducts({ dateRange }: TopProductsProps) {
  const [sortBy, setSortBy] = useState<"revenue" | "quantity" | "profit">("revenue");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Mock product performance data
  const productData = [
    {
      id: "1",
      name: "Premium Coffee Beans - Colombian",
      sku: "COF-001",
      category: "Coffee",
      quantitySold: 45,
      revenue: 675.00,
      cost: 337.50,
      profit: 337.50,
      margin: 50.0,
      averagePrice: 15.00,
      trend: "up" as const,
      trendValue: 12.5,
      image: null
    },
    {
      id: "2", 
      name: "Artisan Pastry Selection",
      sku: "PAS-002",
      category: "Pastries",
      quantitySold: 38,
      revenue: 456.00,
      cost: 228.00,
      profit: 228.00,
      margin: 50.0,
      averagePrice: 12.00,
      trend: "up" as const,
      trendValue: 8.3,
      image: null
    },
    {
      id: "3",
      name: "Organic Green Tea",
      sku: "TEA-003", 
      category: "Tea",
      quantitySold: 32,
      revenue: 256.00,
      cost: 128.00,
      profit: 128.00,
      margin: 50.0,
      averagePrice: 8.00,
      trend: "down" as const,
      trendValue: -3.2,
      image: null
    },
    {
      id: "4",
      name: "Espresso Machine Maintenance Kit",
      sku: "EQP-004",
      category: "Equipment",
      quantitySold: 8,
      revenue: 320.00,
      cost: 160.00,
      profit: 160.00,
      margin: 50.0,
      averagePrice: 40.00,
      trend: "up" as const,
      trendValue: 25.0,
      image: null
    },
    {
      id: "5",
      name: "House Blend Coffee - Ground",
      sku: "COF-005",
      category: "Coffee",
      quantitySold: 28,
      revenue: 308.00,
      cost: 154.00,
      profit: 154.00,
      margin: 50.0,
      averagePrice: 11.00,
      trend: "up" as const,
      trendValue: 5.7,
      image: null
    }
  ];

  // Sort products based on selected criteria
  const sortedProducts = [...productData].sort((a, b) => {
    switch (sortBy) {
      case "quantity":
        return b.quantitySold - a.quantitySold;
      case "profit":
        return b.profit - a.profit;
      default: // revenue
        return b.revenue - a.revenue;
    }
  });

  // Product categories performance
  const categoryPerformance = [
    { category: "Coffee", revenue: 983.00, quantity: 73, products: 2, avgMargin: 50.0 },
    { category: "Pastries", revenue: 456.00, quantity: 38, products: 1, avgMargin: 50.0 },
    { category: "Equipment", revenue: 320.00, quantity: 8, products: 1, avgMargin: 50.0 },
    { category: "Tea", revenue: 256.00, quantity: 32, products: 1, avgMargin: 50.0 }
  ];

  const sortOptions = [
    { id: "revenue" as const, label: "Revenue", icon: DollarSign },
    { id: "quantity" as const, label: "Quantity Sold", icon: ShoppingCart },
    { id: "profit" as const, label: "Profit", icon: TrendingUp }
  ];

  // Calculate totals
  const totals = {
    revenue: productData.reduce((sum, p) => sum + p.revenue, 0),
    quantity: productData.reduce((sum, p) => sum + p.quantitySold, 0),
    profit: productData.reduce((sum, p) => sum + p.profit, 0),
    avgMargin: productData.reduce((sum, p) => sum + p.margin, 0) / productData.length
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totals.revenue)}
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
              <p className="text-sm font-medium text-muted-foreground">Units Sold</p>
              <p className="text-2xl font-bold text-blue-600">
                {totals.quantity.toLocaleString()}
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
              <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(totals.profit)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Margin</p>
              <p className="text-2xl font-bold text-orange-600">
                {totals.avgMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sort Options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold">Top Performing Products</h3>
          <p className="text-sm text-muted-foreground">
            Ranked by {sortBy === 'revenue' ? 'total revenue' : sortBy === 'quantity' ? 'units sold' : 'profit margin'}
          </p>
        </div>
        
        <div className="flex space-x-2">
          {sortOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Button
                key={option.id}
                variant={sortBy === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(option.id)}
                className="flex items-center space-x-2"
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Top Products List */}
      <div className="space-y-4">
        {sortedProducts.map((product, index) => (
          <Card key={product.id} className="p-4">
            <div className="flex items-center space-x-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                {index + 1}
              </div>

              {/* Product Image */}
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold truncate" title={product.name}>
                      {product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {product.category} • SKU: {product.sku}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="text-sm">
                        <span className="font-medium">{product.quantitySold}</span>
                        <span className="text-muted-foreground"> units sold</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{formatCurrency(product.averagePrice)}</span>
                        <span className="text-muted-foreground"> avg price</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-bold text-lg text-primary">
                        {sortBy === 'revenue' ? formatCurrency(product.revenue) :
                         sortBy === 'quantity' ? `${product.quantitySold} units` :
                         formatCurrency(product.profit)}
                      </p>
                      {product.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          product.trend === 'up' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.trend === 'up' ? '+' : ''}{product.trendValue.toFixed(1)}%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {product.margin.toFixed(1)}% margin
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      Profit: {formatCurrency(product.profit)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Category Performance */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Performance by Category</h3>
        <div className="space-y-3">
          {categoryPerformance.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div>
                  <h4 className="font-medium">{category.category}</h4>
                  <p className="text-sm text-muted-foreground">
                    {category.products} product{category.products !== 1 ? 's' : ''} • 
                    {category.quantity} units sold • 
                    {category.avgMargin.toFixed(1)}% avg margin
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{formatCurrency(category.revenue)}</p>
                <p className="text-xs text-muted-foreground">
                  {((category.revenue / totals.revenue) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Insights */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-green-900">Top Performer</h4>
            </div>
            <p className="text-sm text-green-700">
              {sortedProducts[0]?.name} leads with {formatCurrency(sortedProducts[0]?.revenue)} in revenue
            </p>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">Opportunity</h4>
            </div>
            <p className="text-sm text-yellow-700">
              Coffee category dominates with {((categoryPerformance[0]?.revenue / totals.revenue) * 100).toFixed(1)}% of total revenue
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
