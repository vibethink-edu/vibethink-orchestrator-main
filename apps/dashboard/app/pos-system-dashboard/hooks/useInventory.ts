"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, InventoryMovement, InventoryMovementType } from "../types";

// Mock user context
const mockUser = {
  id: "user-123",
  company_id: "company-123"
};

export function useInventory() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate inventory metrics
  const calculateInventoryMetrics = useCallback((products: Product[]) => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock_quantity * (p.cost || p.price)), 0);
    const totalRetailValue = products.reduce((sum, p) => sum + (p.stock_quantity * p.price), 0);
    const lowStock = products.filter(p => p.stock_quantity <= p.min_stock_level);
    const outOfStock = products.filter(p => p.stock_quantity === 0);
    
    return {
      totalProducts,
      totalValue,
      totalRetailValue,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      averageStockLevel: products.reduce((sum, p) => sum + p.stock_quantity, 0) / totalProducts || 0,
      turnoverRate: 12.4 // Mock data - would be calculated from sales history
    };
  }, []);

  // Check stock levels and update alerts
  const checkStockLevels = useCallback((products: Product[]) => {
    const lowStock = products.filter(p => 
      p.is_active && 
      p.stock_quantity > 0 && 
      p.stock_quantity <= p.min_stock_level
    );
    
    const outOfStock = products.filter(p => 
      p.is_active && 
      p.stock_quantity === 0
    );

    setLowStockProducts(lowStock);
    setOutOfStockProducts(outOfStock);

    return { lowStock, outOfStock };
  }, []);

  // Adjust stock level
  const adjustStockLevel = useCallback(async (
    productId: string,
    adjustment: number,
    movementType: InventoryMovementType,
    reason?: string,
    referenceId?: string
  ) => {
    setIsLoading(true);

    try {
      // Create inventory movement record
      const movement: InventoryMovement = {
        id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        product_id: productId,
        company_id: mockUser.company_id,
        movement_type: movementType,
        quantity: adjustment,
        reference_id: referenceId,
        notes: reason,
        created_at: new Date().toISOString()
      };

      // TODO: Save to database
      console.log("Creating inventory movement:", movement);

      // Update local state
      setInventoryMovements(prev => [movement, ...prev]);

      return { success: true, movement };
    } catch (error) {
      console.error("Failed to adjust stock level:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to adjust stock"
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Bulk adjust stock levels
  const bulkAdjustStock = useCallback(async (
    adjustments: Array<{
      productId: string;
      adjustment: number;
      reason?: string;
    }>,
    movementType: InventoryMovementType
  ) => {
    setIsLoading(true);

    try {
      const movements: InventoryMovement[] = [];

      for (const adj of adjustments) {
        const movement: InventoryMovement = {
          id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          product_id: adj.productId,
          company_id: mockUser.company_id,
          movement_type: movementType,
          quantity: adj.adjustment,
          notes: adj.reason,
          created_at: new Date().toISOString()
        };

        movements.push(movement);
      }

      // TODO: Save to database
      console.log("Creating bulk inventory movements:", movements);

      // Update local state
      setInventoryMovements(prev => [...movements, ...prev]);

      return { success: true, movements };
    } catch (error) {
      console.error("Failed to bulk adjust stock:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to bulk adjust stock"
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Record sale (decrease inventory)
  const recordSale = useCallback(async (items: Array<{ productId: string; quantity: number }>, transactionId: string) => {
    const adjustments = items.map(item => ({
      productId: item.productId,
      adjustment: -item.quantity, // Negative for sale
      reason: `Sale - Transaction ${transactionId}`
    }));

    return await bulkAdjustStock(adjustments, "sale");
  }, [bulkAdjustStock]);

  // Record return (increase inventory)
  const recordReturn = useCallback(async (items: Array<{ productId: string; quantity: number }>, transactionId: string) => {
    const adjustments = items.map(item => ({
      productId: item.productId,
      adjustment: item.quantity, // Positive for return
      reason: `Return - Transaction ${transactionId}`
    }));

    return await bulkAdjustStock(adjustments, "return");
  }, [bulkAdjustStock]);

  // Record waste/damage
  const recordWaste = useCallback(async (items: Array<{ productId: string; quantity: number; reason?: string }>) => {
    const adjustments = items.map(item => ({
      productId: item.productId,
      adjustment: -item.quantity, // Negative for waste
      reason: item.reason || "Waste/Damage"
    }));

    return await bulkAdjustStock(adjustments, "waste");
  }, [bulkAdjustStock]);

  // Get inventory movement history
  const getMovementHistory = useCallback(async (productId?: string, limit: number = 50) => {
    try {
      // TODO: Fetch from database
      let movements = inventoryMovements;
      
      if (productId) {
        movements = movements.filter(m => m.product_id === productId);
      }

      return movements.slice(0, limit);
    } catch (error) {
      console.error("Failed to fetch movement history:", error);
      return [];
    }
  }, [inventoryMovements]);

  // Generate low stock report
  const generateLowStockReport = useCallback((products: Product[]) => {
    const lowStockItems = products.filter(p => 
      p.is_active && 
      p.stock_quantity <= p.min_stock_level
    );

    return {
      items: lowStockItems.map(product => ({
        product,
        daysUntilOutOfStock: estimateDaysUntilOutOfStock(product),
        suggestedReorderQuantity: calculateReorderQuantity(product),
        priority: getRestockPriority(product)
      })),
      totalItems: lowStockItems.length,
      estimatedReorderCost: lowStockItems.reduce((sum, p) => 
        sum + (calculateReorderQuantity(p) * (p.cost || p.price * 0.6)), 0
      )
    };
  }, []);

  // Estimate days until out of stock (mock calculation)
  const estimateDaysUntilOutOfStock = (product: Product): number => {
    // Mock calculation - in real app would use sales velocity
    const averageDailySales = 2; // Mock: 2 units per day average
    return Math.max(0, Math.floor(product.stock_quantity / averageDailySales));
  };

  // Calculate suggested reorder quantity
  const calculateReorderQuantity = (product: Product): number => {
    // Simple reorder formula: 2x min stock level
    return Math.max(product.min_stock_level * 2, 10);
  };

  // Get restock priority
  const getRestockPriority = (product: Product): "high" | "medium" | "low" => {
    const daysLeft = estimateDaysUntilOutOfStock(product);
    
    if (daysLeft <= 2) return "high";
    if (daysLeft <= 7) return "medium";
    return "low";
  };

  // Validate stock adjustment
  const validateStockAdjustment = useCallback((
    currentStock: number,
    adjustment: number,
    movementType: InventoryMovementType
  ) => {
    // Check if adjustment would result in negative stock
    if (currentStock + adjustment < 0) {
      return {
        valid: false,
        error: "Adjustment would result in negative stock"
      };
    }

    // Check for reasonable adjustment limits
    if (Math.abs(adjustment) > 10000) {
      return {
        valid: false,
        error: "Adjustment amount seems unreasonably large"
      };
    }

    return { valid: true };
  }, []);

  // Get inventory turnover rate
  const calculateTurnoverRate = useCallback((product: Product, timeframeDays: number = 365) => {
    // Mock calculation - in real app would use actual sales data
    const averageDailySales = 2;
    const totalSold = averageDailySales * timeframeDays;
    const averageInventory = (product.stock_quantity + product.min_stock_level) / 2;
    
    return averageInventory > 0 ? totalSold / averageInventory : 0;
  }, []);

  // Get stock level status
  const getStockStatus = useCallback((product: Product) => {
    if (product.stock_quantity === 0) {
      return {
        status: "out_of_stock" as const,
        color: "hsl(var(--destructive))",
        label: "Out of Stock",
        urgency: "critical" as const
      };
    } else if (product.stock_quantity <= product.min_stock_level) {
      return {
        status: "low_stock" as const,
        color: "hsl(var(--warning))",
        label: "Low Stock",
        urgency: "high" as const
      };
    } else if (product.stock_quantity <= product.min_stock_level * 2) {
      return {
        status: "moderate_stock" as const,
        color: "hsl(var(--warning))",
        label: "Moderate Stock",
        urgency: "medium" as const
      };
    } else {
      return {
        status: "in_stock" as const,
        color: "hsl(var(--success))",
        label: "In Stock",
        urgency: "low" as const
      };
    }
  }, []);

  return {
    // State
    lowStockProducts,
    outOfStockProducts,
    inventoryMovements,
    isLoading,

    // Metrics
    calculateInventoryMetrics,
    checkStockLevels,

    // Stock adjustments
    adjustStockLevel,
    bulkAdjustStock,
    recordSale,
    recordReturn,
    recordWaste,

    // History & reporting
    getMovementHistory,
    generateLowStockReport,

    // Utilities
    validateStockAdjustment,
    calculateTurnoverRate,
    getStockStatus,
    estimateDaysUntilOutOfStock,
    calculateReorderQuantity,
    getRestockPriority
  };
}