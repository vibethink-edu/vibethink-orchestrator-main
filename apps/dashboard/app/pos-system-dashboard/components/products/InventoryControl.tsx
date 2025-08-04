"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { 
  AlertTriangle, 
  Package, 
  TrendingDown,
  TrendingUp,
  Plus,
  Minus,
  BarChart3
} from "lucide-react";
import { usePosData } from "../../hooks/usePosData";

export function InventoryControl() {
  const { products, isLoading } = usePosData();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<string>("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get products with low stock
  const lowStockProducts = products.filter(p => p.stock_quantity <= p.min_stock_level);
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0);

  // Calculate inventory value
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock_quantity * p.cost || 0), 0);
  const totalRetailValue = products.reduce((sum, p) => sum + (p.stock_quantity * p.price), 0);

  const inventoryStats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "hsl(var(--chart-1))"
    },
    {
      label: "Low Stock Items",
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: "hsl(var(--warning))"
    },
    {
      label: "Out of Stock",
      value: outOfStockProducts.length,
      icon: TrendingDown,
      color: "hsl(var(--destructive))"
    },
    {
      label: "Inventory Value",
      value: formatCurrency(totalInventoryValue),
      icon: BarChart3,
      color: "hsl(var(--success))"
    }
  ];

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading inventory...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryStats.map((stat, index) => (
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
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
          </div>
          <div className="space-y-2">
            {lowStockProducts.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center justify-between text-sm">
                <span className="font-medium">{product.name}</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {product.stock_quantity} left
                </Badge>
              </div>
            ))}
            {lowStockProducts.length > 5 && (
              <p className="text-xs text-yellow-700">
                +{lowStockProducts.length - 5} more items need restocking
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Inventory Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product List */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Stock Levels</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map(product => {
              const isLowStock = product.stock_quantity <= product.min_stock_level;
              const isOutOfStock = product.stock_quantity === 0;
              
              return (
                <div 
                  key={product.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedProduct === product.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-muted-foreground/20'
                  }`}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold">
                        {product.stock_quantity} units
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          isOutOfStock 
                            ? 'bg-red-100 text-red-800'
                            : isLowStock 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {isOutOfStock 
                          ? 'Out of Stock'
                          : isLowStock 
                          ? 'Low Stock'
                          : 'In Stock'}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Stock Adjustment */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Stock Adjustment</h3>
          
          {selectedProduct ? (
            <div className="space-y-4">
              {(() => {
                const product = products.find(p => p.id === selectedProduct);
                if (!product) return null;
                
                return (
                  <>
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Current Stock: {product.stock_quantity} units
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Min Level: {product.min_stock_level} units
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Adjustment Quantity
                      </label>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const current = parseInt(adjustmentQuantity) || 0;
                            setAdjustmentQuantity((current - 1).toString());
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={adjustmentQuantity}
                          onChange={(e) => setAdjustmentQuantity(e.target.value)}
                          placeholder="0"
                          className="text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const current = parseInt(adjustmentQuantity) || 0;
                            setAdjustmentQuantity((current + 1).toString());
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Reason for Adjustment
                      </label>
                      <select
                        value={adjustmentReason}
                        onChange={(e) => setAdjustmentReason(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      >
                        <option value="">Select reason...</option>
                        <option value="purchase">New Purchase</option>
                        <option value="return">Customer Return</option>
                        <option value="damage">Damaged Stock</option>
                        <option value="theft">Theft/Loss</option>
                        <option value="correction">Stock Correction</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {adjustmentQuantity && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium">
                          New Stock Level: {' '}
                          <span className="text-blue-600">
                            {product.stock_quantity + (parseInt(adjustmentQuantity) || 0)} units
                          </span>
                        </p>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      disabled={!adjustmentQuantity || !adjustmentReason}
                      onClick={() => {
                        // TODO: Process stock adjustment
                        console.log("Stock adjustment:", {
                          productId: selectedProduct,
                          quantity: adjustmentQuantity,
                          reason: adjustmentReason
                        });
                        setAdjustmentQuantity("");
                        setAdjustmentReason("");
                      }}
                    >
                      Apply Adjustment
                    </Button>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Select a product to adjust stock levels
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}