"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Package,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload
} from "lucide-react";

// Import product management components
import { InventoryControl } from "./InventoryControl";
import { CategoryManager } from "./CategoryManager";
import { PriceManager } from "./PriceManager";

// Import hooks
import { usePosData } from "../../hooks/usePosData";
import { usePosSecurity } from "../../hooks/usePosSecurity";

// Import types
import { Product, ProductFilters } from "../../types";

export function ProductsManagement() {
  const [activeTab, setActiveTab] = useState<"products" | "inventory" | "categories" | "pricing">("products");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Hooks
  const { 
    products, 
    categories, 
    isLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct 
  } = usePosData();

  const { hasPermission } = usePosSecurity();

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get stock status
  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) {
      return { status: 'out', color: 'hsl(var(--destructive))', label: 'Out of Stock' };
    } else if (product.stock_quantity <= product.min_stock_level) {
      return { status: 'low', color: 'hsl(var(--warning))', label: 'Low Stock' };
    } else {
      return { status: 'in', color: 'hsl(var(--success))', label: 'In Stock' };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Tab navigation
  const tabs = [
    {
      id: "products" as const,
      label: "Products",
      icon: Package,
      description: "Manage product catalog",
      permission: "INVENTORY_VIEW"
    },
    {
      id: "inventory" as const,
      label: "Inventory",
      icon: AlertTriangle,
      description: "Stock management",
      permission: "INVENTORY_MANAGE"
    },
    {
      id: "categories" as const,
      label: "Categories",
      icon: Grid3X3,
      description: "Product categories",
      permission: "INVENTORY_MANAGE"
    },
    {
      id: "pricing" as const,
      label: "Pricing",
      icon: Edit,
      description: "Price management",
      permission: "PRICE_OVERRIDE"
    }
  ];

  // Product grid/list item component
  const ProductItem = ({ product }: { product: Product }) => {
    const stockStatus = getStockStatus(product);
    const isSelected = selectedProducts.includes(product.id);

    return (
      <Card className={`p-4 transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        {viewMode === "grid" ? (
          <div className="space-y-3">
            {/* Product Image */}
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-8 w-8 text-muted-foreground" />
              )}
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
                  <p className="font-bold text-primary">
                    {formatCurrency(product.price)}
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-xs mt-1"
                    style={{
                      backgroundColor: `${stockStatus.color}20`,
                      color: stockStatus.color
                    }}
                  >
                    {product.stock_quantity} in stock
                  </Badge>
                </div>

                <div className="flex space-x-1">
                  {hasPermission("INVENTORY_VIEW") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        // TODO: View product details
                        console.log("View product:", product.id);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {hasPermission("INVENTORY_MANAGE") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        // TODO: Edit product
                        console.log("Edit product:", product.id);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {/* Selection Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedProducts([...selectedProducts, product.id]);
                } else {
                  setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                }
              }}
              className="rounded border-gray-300"
            />

            {/* Product Image */}
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {product.image_url ? (
                <img
                  src={product.image_url}
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
                      {stockStatus.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {product.stock_quantity} units
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-1 flex-shrink-0">
              {hasPermission("INVENTORY_VIEW") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // TODO: View product details
                    console.log("View product:", product.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              
              {hasPermission("INVENTORY_MANAGE") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // TODO: Edit product
                    console.log("Edit product:", product.id);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {hasPermission("INVENTORY_MANAGE") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    // TODO: Confirm and delete product
                    console.log("Delete product:", product.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "inventory":
        return <InventoryControl />;
      case "categories":
        return <CategoryManager />;
      case "pricing":
        return <PriceManager />;
      default:
        return (
          <div className="space-y-4">
            {/* Search and Filter Bar */}
            <Card className="p-4">
              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Add Product Button */}
                {hasPermission("INVENTORY_MANAGE") && (
                  <Button
                    className="flex items-center space-x-2"
                    onClick={() => {
                      // TODO: Open add product modal
                      console.log("Add new product");
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </Button>
                )}
              </div>

              {/* Bulk Actions */}
              {selectedProducts.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Bulk edit
                          console.log("Bulk edit:", selectedProducts);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Export selected
                          console.log("Export:", selectedProducts);
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          // TODO: Bulk delete
                          console.log("Delete:", selectedProducts);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Products Grid/List */}
            {isLoading ? (
              <Card className="p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3 text-muted-foreground">Loading products...</span>
                </div>
              </Card>
            ) : filteredProducts.length === 0 ? (
              <Card className="p-8">
                <div className="text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategory !== "all" 
                      ? "No products match your search criteria." 
                      : "Get started by adding your first product."}
                  </p>
                  {hasPermission("INVENTORY_MANAGE") && (
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductItem key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <ProductItem key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          const hasAccess = hasPermission(tab.permission);
          
          if (!hasAccess) return null;

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