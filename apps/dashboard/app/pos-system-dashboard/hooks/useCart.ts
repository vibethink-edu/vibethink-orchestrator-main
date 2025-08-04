"use client";

import { useState, useCallback, useMemo } from "react";
import { PosCart, CartItem, Product } from "../types";

// Default tax rate (10%)
const DEFAULT_TAX_RATE = 0.10;

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Generate unique cart item ID
  const generateCartItemId = (productId: string): string => {
    return `${productId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Calculate cart totals
  const cart: PosCart = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const taxTotal = cartItems.reduce((sum, item) => sum + item.tax_amount, 0);
    const discountAmount = 0; // TODO: Implement discount logic
    const totalAmount = subtotal + taxTotal - discountAmount;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: cartItems,
      subtotal,
      taxTotal,
      discountAmount,
      totalAmount,
      itemCount
    };
  }, [cartItems]);

  // Add product to cart
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        // Don't exceed stock quantity
        const finalQuantity = Math.min(newQuantity, product.stock_quantity);
        
        const subtotal = finalQuantity * product.price;
        const taxAmount = subtotal * (product.tax_rate || DEFAULT_TAX_RATE);
        const total = subtotal + taxAmount;

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: finalQuantity,
          subtotal,
          tax_amount: taxAmount,
          total
        };

        return updatedItems;
      } else {
        // Add new item to cart
        const finalQuantity = Math.min(quantity, product.stock_quantity);
        const subtotal = finalQuantity * product.price;
        const taxAmount = subtotal * (product.tax_rate || DEFAULT_TAX_RATE);
        const total = subtotal + taxAmount;

        const newItem: CartItem = {
          id: generateCartItemId(product.id),
          product,
          quantity: finalQuantity,
          unit_price: product.price,
          subtotal,
          tax_amount: taxAmount,
          total
        };

        return [...prevItems, newItem];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          // Don't exceed stock quantity
          const finalQuantity = Math.min(newQuantity, item.product.stock_quantity);
          const subtotal = finalQuantity * item.unit_price;
          const taxAmount = subtotal * (item.product.tax_rate || DEFAULT_TAX_RATE);
          const total = subtotal + taxAmount;

          return {
            ...item,
            quantity: finalQuantity,
            subtotal,
            tax_amount: taxAmount,
            total
          };
        }
        return item;
      });
    });
  }, [removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Get cart item by product ID
  const getCartItemByProductId = useCallback((productId: string) => {
    return cartItems.find(item => item.product.id === productId);
  }, [cartItems]);

  // Check if product is in cart
  const isProductInCart = useCallback((productId: string) => {
    return cartItems.some(item => item.product.id === productId);
  }, [cartItems]);

  // Get total quantity of a specific product in cart
  const getProductQuantityInCart = useCallback((productId: string) => {
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  // Apply discount to cart
  const applyDiscount = useCallback((discountAmount: number) => {
    // TODO: Implement discount logic
    // This would involve updating the cart totals with discount applied
    console.log("Apply discount:", discountAmount);
  }, []);

  // Get cart totals separately
  const getTotalItems = useCallback(() => cart.itemCount, [cart.itemCount]);
  const getSubtotal = useCallback(() => cart.subtotal, [cart.subtotal]);
  const getTaxTotal = useCallback(() => cart.taxTotal, [cart.taxTotal]);
  const getTotal = useCallback(() => cart.totalAmount, [cart.totalAmount]);

  // Validate cart items against current product stock
  const validateCartStock = useCallback((currentProducts: Product[]) => {
    const updatedItems: CartItem[] = [];
    let hasChanges = false;

    cartItems.forEach(item => {
      const currentProduct = currentProducts.find(p => p.id === item.product.id);
      
      if (!currentProduct) {
        // Product no longer exists, remove from cart
        hasChanges = true;
        return;
      }

      if (!currentProduct.is_active) {
        // Product is no longer active, remove from cart
        hasChanges = true;
        return;
      }

      if (item.quantity > currentProduct.stock_quantity) {
        // Reduce quantity to available stock
        hasChanges = true;
        const newQuantity = Math.max(0, currentProduct.stock_quantity);
        
        if (newQuantity === 0) {
          return; // Remove item if no stock
        }

        const subtotal = newQuantity * item.unit_price;
        const taxAmount = subtotal * (currentProduct.tax_rate || DEFAULT_TAX_RATE);
        const total = subtotal + taxAmount;

        updatedItems.push({
          ...item,
          product: currentProduct, // Update product data
          quantity: newQuantity,
          subtotal,
          tax_amount: taxAmount,
          total
        });
      } else {
        // Item is valid, update product data if needed
        updatedItems.push({
          ...item,
          product: currentProduct
        });
      }
    });

    if (hasChanges) {
      setCartItems(updatedItems);
    }

    return hasChanges;
  }, [cartItems]);

  // Get cart summary for display
  const getCartSummary = useCallback(() => {
    return {
      itemCount: cart.itemCount,
      uniqueItems: cartItems.length,
      subtotal: cart.subtotal,
      taxTotal: cart.taxTotal,
      totalAmount: cart.totalAmount,
      isEmpty: cartItems.length === 0
    };
  }, [cart, cartItems]);

  return {
    cart,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemByProductId,
    isProductInCart,
    getProductQuantityInCart,
    applyDiscount,
    getTotalItems,
    getSubtotal,
    getTaxTotal,
    getTotal,
    validateCartStock,
    getCartSummary
  };
}