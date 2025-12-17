"use client";

import React from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@vibethink/ui";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { 
  ShoppingCart as ShoppingCartIcon,
  Minus, 
  Plus, 
  Trash2, 
  CreditCard,
  X,
  Receipt
} from "lucide-react";
import { PosCart, CartItem } from "../../types";

interface ShoppingCartProps {
  cart: PosCart;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToPayment: () => void;
  onClearCart: () => void;
}

export function ShoppingCart({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onProceedToPayment,
  onClearCart 
}: ShoppingCartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const CartItemComponent = ({ item }: { item: CartItem }) => {
    return (
      <div className="flex items-center space-x-3 p-3 border rounded-lg">
        {/* Product Image */}
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {item.product.image_url ? (
            <img
              src={item.product.image_url}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ShoppingCartIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate" title={item.product.name}>
            {item.product.name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(item.unit_price)} each
          </p>
          {item.product.tax_rate > 0 && (
            <p className="text-xs text-muted-foreground">
              Tax: {formatCurrency(item.tax_amount)}
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value) || 0;
              onUpdateQuantity(item.id, Math.max(0, newQuantity));
            }}
            className="w-16 h-8 text-center text-sm"
            min="0"
            max={item.product.stock_quantity}
          />

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.product.stock_quantity}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Item Total */}
        <div className="text-right flex-shrink-0 min-w-0">
          <p className="font-semibold text-sm">
            {formatCurrency(item.total)}
          </p>
        </div>

        {/* Remove Button */}
        <Button
          variant="destructive"
          size="sm"
          className="h-8 w-8 p-0 flex-shrink-0"
          onClick={() => onRemoveItem(item.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  const EmptyCart = () => (
    <div className="text-center py-8">
      <ShoppingCartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Cart is Empty</h3>
      <p className="text-muted-foreground text-sm">
        Select products to add them to your cart
      </p>
    </div>
  );

  return (
    <Card className="p-4 h-full flex flex-col">
      {/* Cart Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShoppingCartIcon className="h-5 w-5" />
          <h3 className="font-semibold">Shopping Cart</h3>
          {cart.itemCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </div>

        {cart.items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto">
        {cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="space-y-3">
            {cart.items.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {cart.items.length > 0 && (
        <div className="mt-4 pt-4 border-t space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>

          {/* Tax */}
          {cart.taxTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax:</span>
              <span>{formatCurrency(cart.taxTotal)}</span>
            </div>
          )}

          {/* Discount */}
          {cart.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>-{formatCurrency(cart.discountAmount)}</span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total:</span>
            <span className="text-primary">{formatCurrency(cart.totalAmount)}</span>
          </div>

          {/* Payment Button */}
          <Button 
            className="w-full mt-4 h-12 text-lg font-semibold"
            onClick={onProceedToPayment}
            disabled={cart.items.length === 0}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Proceed to Payment
          </Button>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Implement discount functionality
                console.log("Apply discount");
              }}
            >
              Apply Discount
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Implement hold transaction
                console.log("Hold transaction");
              }}
            >
              Hold Transaction
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Notes */}
      {cart.items.length > 0 && (
        <div className="mt-3">
          <Input
            placeholder="Add transaction notes..."
            className="text-sm"
            onChange={(e) => {
              // TODO: Handle transaction notes
              console.log("Transaction notes:", e.target.value);
            }}
          />
        </div>
      )}
    </Card>
  );
}
