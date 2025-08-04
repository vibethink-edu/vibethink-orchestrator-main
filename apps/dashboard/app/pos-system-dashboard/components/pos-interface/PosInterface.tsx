"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { 
  Search, 
  Grid3X3, 
  List, 
  Scan,
  UserPlus,
  Settings2
} from "lucide-react";

// Import POS interface components
import { ProductGrid } from "./ProductGrid";
import { ShoppingCart } from "./ShoppingCart";
import { PaymentProcessor } from "./PaymentProcessor";

// Import hooks
import { useCart } from "../../hooks/useCart";
import { usePosData } from "../../hooks/usePosData";

// Import types
import { Product, Customer, PaymentMethod } from "../../types";

export function PosInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Hooks
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getTotalItems,
    getSubtotal,
    getTaxTotal,
    getTotal
  } = useCart();

  const { 
    products, 
    categories, 
    isLoading,
    searchProducts,
    getProductsByCategory 
  } = usePosData();

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    if (product.stock_quantity > 0) {
      addToCart(product);
    }
  };

  // Handle barcode scan
  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      handleProductSelect(product);
    }
  };

  // Handle payment processing
  const handleProceedToPayment = () => {
    if (cart.items.length > 0) {
      setShowPayment(true);
    }
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    clearCart();
    setShowPayment(false);
    setSelectedCustomer(null);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory && product.is_active;
  });

  if (showPayment) {
    return (
      <PaymentProcessor
        cart={cart}
        customer={selectedCustomer}
        onPaymentComplete={handlePaymentComplete}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Side - Product Selection */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search and Controls */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Barcode Scanner */}
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={() => {
                // TODO: Implement barcode scanning
                console.log("Open barcode scanner");
              }}
            >
              <Scan className="h-4 w-4" />
              <span className="hidden sm:inline">Scan</span>
            </Button>

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
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="whitespace-nowrap"
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
                style={{
                  backgroundColor: selectedCategory === category.id 
                    ? category.color 
                    : 'transparent',
                  borderColor: category.color,
                  color: selectedCategory === category.id 
                    ? 'white' 
                    : category.color
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* Product Grid/List */}
        <div className="flex-1">
          <ProductGrid
            products={filteredProducts}
            viewMode={viewMode}
            onProductSelect={handleProductSelect}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Right Side - Shopping Cart */}
      <div className="space-y-4">
        {/* Customer Selection */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Customer</h3>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => {
                // TODO: Implement customer selection
                console.log("Select customer");
              }}
            >
              <UserPlus className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </div>
          
          {selectedCustomer ? (
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{selectedCustomer.name}</p>
              {selectedCustomer.email && (
                <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
              )}
              <div className="flex justify-between items-center mt-2">
                <Badge variant="secondary">
                  {selectedCustomer.loyalty_points} points
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No customer selected</p>
          )}
        </Card>

        {/* Shopping Cart */}
        <ShoppingCart
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onProceedToPayment={handleProceedToPayment}
          onClearCart={clearCart}
        />

        {/* Quick Actions */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // TODO: Implement park transaction
                console.log("Park transaction");
              }}
            >
              Park Transaction
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // TODO: Implement recall transaction
                console.log("Recall transaction");
              }}
            >
              Recall Transaction
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // TODO: Implement no sale
                console.log("No sale");
              }}
            >
              No Sale
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}