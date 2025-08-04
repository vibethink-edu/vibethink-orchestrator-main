"use client";

import React from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Plus, 
  Package, 
  ShoppingCart,
  AlertTriangle,
  Image as ImageIcon
} from "lucide-react";
import { Product } from "../../types";

interface ProductGridProps {
  products: Product[];
  viewMode: "grid" | "list";
  onProductSelect: (product: Product) => void;
  isLoading: boolean;
}

export function ProductGrid({ 
  products, 
  viewMode, 
  onProductSelect, 
  isLoading 
}: ProductGridProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) {
      return { status: 'out', color: 'hsl(var(--destructive))', label: 'Out of Stock' };
    } else if (product.stock_quantity <= product.min_stock_level) {
      return { status: 'low', color: 'hsl(var(--warning))', label: 'Low Stock' };
    } else {
      return { status: 'in', color: 'hsl(var(--success))', label: 'In Stock' };
    }
  };

  const ProductGridItem = ({ product }: { product: Product }) => {
    const stockStatus = getStockStatus(product);
    const isOutOfStock = product.stock_quantity === 0;

    return (
      <Card 
        className={`p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
          isOutOfStock ? 'opacity-60' : 'hover:scale-105'
        }`}
        onClick={() => !isOutOfStock && onProductSelect(product)}
      >
        {/* Product Image */}
        <div className="relative mb-3">
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>

          {/* Stock Status Badge */}
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 text-xs"
            style={{
              backgroundColor: `${stockStatus.color}20`,
              color: stockStatus.color,
              borderColor: stockStatus.color
            }}
          >
            {stockStatus.status === 'out' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {stockStatus.label}
          </Badge>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2" title={product.name}>
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              SKU: {product.sku}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg text-primary">
                {formatCurrency(product.price)}
              </p>
              <p className="text-xs text-muted-foreground">
                Stock: {product.stock_quantity}
              </p>
            </div>

            <Button
              size="sm"
              disabled={isOutOfStock}
              className="flex items-center space-x-1"
              onClick={(e) => {
                e.stopPropagation();
                onProductSelect(product);
              }}
            >
              <Plus className="h-3 w-3" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const ProductListItem = ({ product }: { product: Product }) => {
    const stockStatus = getStockStatus(product);
    const isOutOfStock = product.stock_quantity === 0;

    return (
      <Card 
        className={`p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
          isOutOfStock ? 'opacity-60' : ''
        }`}
        onClick={() => !isOutOfStock && onProductSelect(product)}
      >
        <div className="flex items-center space-x-4">
          {/* Product Image */}
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </p>
                {product.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="text-right ml-4 flex-shrink-0">
                <p className="font-bold text-lg text-primary">
                  {formatCurrency(product.price)}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: `${stockStatus.color}20`,
                      color: stockStatus.color
                    }}
                  >
                    {product.stock_quantity} in stock
                  </Badge>
                  <Button
                    size="sm"
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductSelect(product);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading products...</span>
        </div>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
          <p className="text-muted-foreground mb-4">
            No products match your current search or filter criteria.
          </p>
          <Button variant="outline">
            Clear Filters
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductGridItem key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Load More Button (for pagination) */}
      {products.length > 0 && products.length % 20 === 0 && (
        <div className="text-center py-4">
          <Button variant="outline" onClick={() => {
            // TODO: Implement pagination
            console.log("Load more products");
          }}>
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
}