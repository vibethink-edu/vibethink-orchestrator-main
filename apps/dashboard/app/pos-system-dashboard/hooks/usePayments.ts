"use client";

import { useState, useCallback } from "react";
import { PaymentMethod, PaymentStatus, PosCart, Customer } from "../types";

interface PaymentData {
  method: PaymentMethod;
  amount_tendered: number;
  amount_charged: number;
  change_amount: number;
  reference_number?: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  receiptData?: any;
  error?: string;
}

export function usePayments() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [lastPayment, setLastPayment] = useState<PaymentData | null>(null);

  // Process payment
  const processPayment = useCallback(async (
    cart: PosCart,
    paymentMethod: PaymentMethod,
    amountTendered: number,
    customer?: Customer | null,
    notes?: string
  ): Promise<PaymentResult> => {
    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      // Validate payment amount
      if (paymentMethod === "cash" && amountTendered < cart.totalAmount) {
        throw new Error("Insufficient payment amount");
      }

      // Calculate payment details
      const paymentData: PaymentData = {
        method: paymentMethod,
        amount_tendered: paymentMethod === "cash" ? amountTendered : cart.totalAmount,
        amount_charged: cart.totalAmount,
        change_amount: paymentMethod === "cash" ? Math.max(0, amountTendered - cart.totalAmount) : 0,
        reference_number: paymentMethod !== "cash" ? generateReferenceNumber() : undefined
      };

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock payment processing logic
      const transactionData = {
        transaction_number: generateTransactionNumber(),
        items: cart.items,
        subtotal: cart.subtotal,
        tax_total: cart.taxTotal,
        discount_amount: cart.discountAmount,
        total_amount: cart.totalAmount,
        payment_method: paymentMethod,
        payment_data: paymentData,
        customer_id: customer?.id,
        notes,
        created_at: new Date().toISOString()
      };

      // TODO: Send to actual payment processor
      console.log("Processing payment:", transactionData);

      // Mock different payment method behaviors
      switch (paymentMethod) {
        case "credit_card":
        case "debit_card":
          // Simulate card processing
          if (Math.random() < 0.95) { // 95% success rate
            break;
          } else {
            throw new Error("Card payment declined");
          }
        
        case "digital_wallet":
          // Simulate digital wallet processing
          if (Math.random() < 0.98) { // 98% success rate
            break;
          } else {
            throw new Error("Digital wallet payment failed");
          }
        
        case "cash":
          // Cash payments always succeed if amount is sufficient
          break;
        
        default:
          throw new Error("Unsupported payment method");
      }

      // Update inventory (decrease stock quantities)
      await updateInventory(cart.items);

      // Generate receipt data
      const receiptData = generateReceiptData(transactionData, paymentData);

      setLastPayment(paymentData);
      setPaymentStatus("completed");

      return {
        success: true,
        transactionId: transactionData.transaction_number,
        receiptData
      };

    } catch (error) {
      setPaymentStatus("failed");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment processing failed"
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Generate transaction number
  const generateTransactionNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TXN-${timestamp}-${random}`;
  };

  // Generate reference number for card payments
  const generateReferenceNumber = () => {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
  };

  // Update inventory after successful payment
  const updateInventory = async (items: any[]) => {
    // TODO: Implement inventory update
    console.log("Updating inventory for items:", items);
    
    // In a real implementation, this would:
    // 1. Decrease stock quantities for each item
    // 2. Create inventory movement records
    // 3. Update product stock levels in database
    // 4. Trigger low stock alerts if needed
  };

  // Generate receipt data
  const generateReceiptData = (transactionData: any, paymentData: PaymentData) => {
    return {
      transaction: transactionData,
      payment: paymentData,
      company_info: {
        name: "Your Store Name",
        address: "123 Main St, City, State 12345",
        phone: "(555) 123-4567",
        email: "info@yourstore.com"
      },
      receipt_number: `R-${transactionData.transaction_number}`,
      print_time: new Date().toISOString()
    };
  };

  // Process refund
  const processRefund = useCallback(async (
    originalTransactionId: string,
    refundAmount: number,
    reason: string
  ): Promise<PaymentResult> => {
    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      // TODO: Implement refund logic
      console.log("Processing refund:", {
        originalTransactionId,
        refundAmount,
        reason
      });

      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPaymentStatus("completed");

      return {
        success: true,
        transactionId: `REF-${originalTransactionId}-${Date.now()}`
      };

    } catch (error) {
      setPaymentStatus("failed");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Refund processing failed"
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Void transaction
  const voidTransaction = useCallback(async (
    transactionId: string,
    reason: string
  ): Promise<PaymentResult> => {
    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      // TODO: Implement void logic
      console.log("Voiding transaction:", { transactionId, reason });

      // Simulate void processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPaymentStatus("completed");

      return {
        success: true,
        transactionId: `VOID-${transactionId}`
      };

    } catch (error) {
      setPaymentStatus("failed");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Transaction void failed"
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Get payment method display info
  const getPaymentMethodInfo = useCallback((method: PaymentMethod) => {
    const paymentMethods = {
      cash: {
        label: "Cash",
        icon: "💵",
        requiresAmount: true,
        processingTime: "Instant"
      },
      credit_card: {
        label: "Credit Card", 
        icon: "💳",
        requiresAmount: false,
        processingTime: "2-3 seconds"
      },
      debit_card: {
        label: "Debit Card",
        icon: "💳", 
        requiresAmount: false,
        processingTime: "2-3 seconds"
      },
      digital_wallet: {
        label: "Digital Wallet",
        icon: "📱",
        requiresAmount: false,
        processingTime: "1-2 seconds"
      },
      bank_transfer: {
        label: "Bank Transfer",
        icon: "🏦",
        requiresAmount: false,
        processingTime: "3-5 seconds"
      },
      loyalty_points: {
        label: "Loyalty Points",
        icon: "⭐",
        requiresAmount: false,
        processingTime: "Instant"
      }
    };

    return paymentMethods[method] || paymentMethods.cash;
  }, []);

  // Calculate change for cash payments
  const calculateChange = useCallback((amountTendered: number, totalAmount: number) => {
    return Math.max(0, amountTendered - totalAmount);
  }, []);

  // Validate payment amount
  const validatePaymentAmount = useCallback((
    paymentMethod: PaymentMethod,
    amountTendered: number,
    totalAmount: number
  ) => {
    if (paymentMethod === "cash") {
      if (amountTendered < totalAmount) {
        return { valid: false, error: "Insufficient payment amount" };
      }
    }

    if (amountTendered <= 0) {
      return { valid: false, error: "Payment amount must be greater than zero" };
    }

    return { valid: true };
  }, []);

  return {
    // State
    isProcessing,
    paymentStatus,
    lastPayment,

    // Actions
    processPayment,
    processRefund,
    voidTransaction,

    // Utilities
    getPaymentMethodInfo,
    calculateChange,
    validatePaymentAmount,
    generateTransactionNumber,
    generateReferenceNumber
  };
}