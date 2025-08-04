"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Save,
  X,
  Calculator,
  Percent
} from "lucide-react";
import { usePosData } from "../../hooks/usePosData";
import { Product } from "../../types";

export function PriceManager() {
  const { products, isLoading } = usePosData();
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceAdjustmentType, setPriceAdjustmentType] = useState<"amount" | "percentage">("percentage");
  const [bulkAdjustment, setBulkAdjustment] = useState<string>("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateMargin = (cost: number, price: number) => {
    if (!cost || cost === 0) return 0;
    return ((price - cost) / price) * 100;
  };

  const calculateMarkup = (cost: number, price: number) => {
    if (!cost || cost === 0) return 0;
    return ((price - cost) / cost) * 100;
  };

  const handleSavePrice = (productId: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) return;

    // TODO: Update product price in database
    console.log("Update price:", { productId, newPrice: price });
    
    setEditingProduct(null);
    setNewPrice("");
  };

  const handleBulkPriceAdjustment = () => {
    const adjustment = parseFloat(bulkAdjustment);
    if (isNaN(adjustment)) return;

    const filteredProducts = products.filter(p => 
      selectedCategory === "all" || p.category_id === selectedCategory
    );

    // TODO: Apply bulk price adjustment
    console.log("Bulk price adjustment:", {
      products: filteredProducts.map(p => p.id),
      type: priceAdjustmentType,
      adjustment
    });

    setBulkAdjustment("");
  };

  // Filter products by category
  const filteredProducts = products.filter(p => 
    selectedCategory === "all" || p.category_id === selectedCategory
  );

  // Price analysis
  const priceStats = {
    averagePrice: filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length || 0,
    highestPrice: Math.max(...filteredProducts.map(p => p.price), 0),
    lowestPrice: Math.min(...filteredProducts.map(p => p.price), Infinity) === Infinity ? 0 : Math.min(...filteredProducts.map(p => p.price)),
    averageMargin: filteredProducts.reduce((sum, p) => sum + calculateMargin(p.cost || 0, p.price), 0) / filteredProducts.length || 0
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading pricing data...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Price Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Price
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(priceStats.averagePrice)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Highest Price
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(priceStats.highestPrice)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Lowest Price
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(priceStats.lowestPrice)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Percent className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Margin
              </p>
              <p className="text-2xl font-bold">
                {priceStats.averageMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bulk Price Adjustment */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Bulk Price Adjustment</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Category Filter
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              {/* TODO: Add category options */}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Adjustment Type
            </label>
            <select
              value={priceAdjustmentType}
              onChange={(e) => setPriceAdjustmentType(e.target.value as "amount" | "percentage")}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="amount">Fixed Amount ($)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Adjustment Value
            </label>
            <div className="relative">
              {priceAdjustmentType === "percentage" ? (
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              ) : (
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                type="number"
                value={bulkAdjustment}
                onChange={(e) => setBulkAdjustment(e.target.value)}
                placeholder={priceAdjustmentType === "percentage" ? "5.0" : "1.50"}
                className="pl-10"
                step={priceAdjustmentType === "percentage" ? "0.1" : "0.01"}
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleBulkPriceAdjustment}
              disabled={!bulkAdjustment}
              className="w-full"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Apply Adjustment
            </Button>
          </div>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          This will affect {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </Card>

      {/* Products Price List */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Product Pricing</h3>
        
        <div className="space-y-3">
          {filteredProducts.map(product => {
            const isEditing = editingProduct === product.id;
            const margin = calculateMargin(product.cost || 0, product.price);
            const markup = calculateMarkup(product.cost || 0, product.price);
            
            return (
              <div key={product.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                  {product.cost && (
                    <p className="text-xs text-muted-foreground">
                      Cost: {formatCurrency(product.cost)}
                    </p>
                  )}
                </div>

                {/* Current Price */}
                <div className="text-right">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-24 pl-8"
                          step="0.01"
                          min="0"
                          autoFocus
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSavePrice(product.id)}
                        disabled={!newPrice || parseFloat(newPrice) <= 0}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(null);
                          setNewPrice("");
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-lg text-primary">
                        {formatCurrency(product.price)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product.id);
                          setNewPrice(product.price.toString());
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>

                {/* Margin & Markup */}
                {product.cost && (
                  <div className="text-right text-sm">
                    <div className="flex space-x-2">
                      <Badge 
                        variant="secondary"
                        className={`${
                          margin >= 30 
                            ? 'bg-green-100 text-green-800'
                            : margin >= 15
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {margin.toFixed(1)}% margin
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {markup.toFixed(1)}% markup
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No products found for the selected category.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}