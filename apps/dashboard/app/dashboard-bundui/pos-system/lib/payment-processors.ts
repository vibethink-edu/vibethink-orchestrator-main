// Payment Processing Integration Library
// Following VThink 1.0 methodology with comprehensive payment support

import { PaymentMethod, PaymentStatus } from "../types";

export interface PaymentProcessor {
  name: string;
  supportedMethods: PaymentMethod[];
  processPayment: (paymentData: PaymentRequest) => Promise<PaymentResponse>;
  refundPayment: (refundData: RefundRequest) => Promise<RefundResponse>;
  voidPayment: (voidData: VoidRequest) => Promise<VoidResponse>;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
  referenceNumber?: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: PaymentStatus;
  message: string;
  referenceNumber?: string;
  receiptData?: any;
  error?: string;
}

export interface RefundRequest {
  originalTransactionId: string;
  amount: number;
  reason: string;
  partial?: boolean;
}

export interface RefundResponse {
  success: boolean;
  refundId: string;
  status: PaymentStatus;
  message: string;
  error?: string;
}

export interface VoidRequest {
  transactionId: string;
  reason: string;
}

export interface VoidResponse {
  success: boolean;
  voidId: string;
  status: PaymentStatus;
  message: string;
  error?: string;
}

/**
 * Mock Cash Processor
 * Handles cash transactions (always succeeds if amount is sufficient)
 */
class CashProcessor implements PaymentProcessor {
  name = "Cash Register";
  supportedMethods: PaymentMethod[] = ["cash"];

  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      transactionId: `CASH-${Date.now()}`,
      status: "completed",
      message: "Cash payment processed successfully",
      referenceNumber: `CR-${Date.now()}`
    };
  }

  async refundPayment(refundData: RefundRequest): Promise<RefundResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      refundId: `CASH-REF-${Date.now()}`,
      status: "completed",
      message: "Cash refund processed"
    };
  }

  async voidPayment(voidData: VoidRequest): Promise<VoidResponse> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      success: true,
      voidId: `CASH-VOID-${Date.now()}`,
      status: "completed",
      message: "Cash transaction voided"
    };
  }
}

/**
 * Mock Card Processor (Stripe/Square style)
 * Simulates credit/debit card processing
 */
class CardProcessor implements PaymentProcessor {
  name = "Card Payment Processor";
  supportedMethods: PaymentMethod[] = ["credit_card", "debit_card"];

  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    // Simulate card processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate occasional failures (5% failure rate)
    if (Math.random() < 0.05) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        message: "Card payment declined",
        error: "Insufficient funds or card declined"
      };
    }

    const isCredit = paymentData.method === "credit_card";
    const prefix = isCredit ? "CC" : "DC";

    return {
      success: true,
      transactionId: `${prefix}-${Date.now()}`,
      status: "completed",
      message: `${isCredit ? 'Credit' : 'Debit'} card payment processed successfully`,
      referenceNumber: this.generateAuthCode(),
      receiptData: {
        cardType: isCredit ? "Credit" : "Debit",
        last4: "****1234",
        authCode: this.generateAuthCode(),
        aid: "A0000000031010",
        tvr: "8000008000",
        tsi: "E800"
      }
    };
  }

  async refundPayment(refundData: RefundRequest): Promise<RefundResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate occasional refund failures (2% failure rate)
    if (Math.random() < 0.02) {
      return {
        success: false,
        refundId: "",
        status: "failed",
        message: "Refund failed",
        error: "Unable to process refund to original payment method"
      };
    }

    return {
      success: true,
      refundId: `REF-${Date.now()}`,
      status: "completed",
      message: "Card refund processed successfully"
    };
  }

  async voidPayment(voidData: VoidRequest): Promise<VoidResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      voidId: `VOID-${Date.now()}`,
      status: "completed",
      message: "Card transaction voided successfully"
    };
  }

  private generateAuthCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

/**
 * Mock Digital Wallet Processor (Apple Pay, Google Pay, etc.)
 */
class DigitalWalletProcessor implements PaymentProcessor {
  name = "Digital Wallet Processor";
  supportedMethods: PaymentMethod[] = ["digital_wallet"];

  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    // Simulate wallet processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate very low failure rate (1%)
    if (Math.random() < 0.01) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        message: "Digital wallet payment failed",
        error: "Payment not authorized by wallet provider"
      };
    }

    return {
      success: true,
      transactionId: `DW-${Date.now()}`,
      status: "completed",
      message: "Digital wallet payment processed successfully",
      referenceNumber: `DW-${this.generateWalletRef()}`,
      receiptData: {
        walletType: "Digital Wallet",
        deviceId: "****5678",
        transactionRef: this.generateWalletRef()
      }
    };
  }

  async refundPayment(refundData: RefundRequest): Promise<RefundResponse> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      success: true,
      refundId: `DW-REF-${Date.now()}`,
      status: "completed",
      message: "Digital wallet refund processed"
    };
  }

  async voidPayment(voidData: VoidRequest): Promise<VoidResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      voidId: `DW-VOID-${Date.now()}`,
      status: "completed",
      message: "Digital wallet transaction voided"
    };
  }

  private generateWalletRef(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

/**
 * Mock Bank Transfer Processor
 */
class BankTransferProcessor implements PaymentProcessor {
  name = "Bank Transfer Processor";
  supportedMethods: PaymentMethod[] = ["bank_transfer"];

  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    // Simulate bank processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate moderate failure rate (3%)
    if (Math.random() < 0.03) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        message: "Bank transfer failed",
        error: "Bank declined the transaction"
      };
    }

    return {
      success: true,
      transactionId: `BT-${Date.now()}`,
      status: "completed",
      message: "Bank transfer processed successfully",
      referenceNumber: `BT-${this.generateBankRef()}`,
      receiptData: {
        bankName: "Mock Bank",
        accountLast4: "****9012",
        confirmationCode: this.generateBankRef()
      }
    };
  }

  async refundPayment(refundData: RefundRequest): Promise<RefundResponse> {
    await new Promise(resolve => setTimeout(resolve, 2500));

    return {
      success: true,
      refundId: `BT-REF-${Date.now()}`,
      status: "completed",
      message: "Bank transfer refund initiated"
    };
  }

  async voidPayment(voidData: VoidRequest): Promise<VoidResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      voidId: `BT-VOID-${Date.now()}`,
      status: "completed",
      message: "Bank transfer voided"
    };
  }

  private generateBankRef(): string {
    return Math.random().toString().substring(2, 12);
  }
}

/**
 * Mock Loyalty Points Processor
 */
class LoyaltyPointsProcessor implements PaymentProcessor {
  name = "Loyalty Points Processor";
  supportedMethods: PaymentMethod[] = ["loyalty_points"];

  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    // Simulate points processing
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate insufficient points (10% failure rate)
    if (Math.random() < 0.10) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        message: "Insufficient loyalty points",
        error: "Customer does not have enough points for this transaction"
      };
    }

    const pointsUsed = Math.ceil(paymentData.amount * 100); // 100 points per dollar

    return {
      success: true,
      transactionId: `LP-${Date.now()}`,
      status: "completed",
      message: "Loyalty points payment processed",
      referenceNumber: `LP-${Date.now()}`,
      receiptData: {
        pointsUsed,
        pointsRemaining: Math.floor(Math.random() * 5000), // Mock remaining points
        conversionRate: "100 points = $1.00"
      }
    };
  }

  async refundPayment(refundData: RefundRequest): Promise<RefundResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      refundId: `LP-REF-${Date.now()}`,
      status: "completed",
      message: "Loyalty points refunded to customer account"
    };
  }

  async voidPayment(voidData: VoidRequest): Promise<VoidResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      success: true,
      voidId: `LP-VOID-${Date.now()}`,
      status: "completed",
      message: "Loyalty points transaction voided"
    };
  }
}

/**
 * Payment Processor Registry
 */
class PaymentProcessorRegistry {
  private processors: Map<PaymentMethod, PaymentProcessor> = new Map();

  constructor() {
    // Initialize processors
    const cashProcessor = new CashProcessor();
    const cardProcessor = new CardProcessor();
    const walletProcessor = new DigitalWalletProcessor();
    const bankProcessor = new BankTransferProcessor();
    const loyaltyProcessor = new LoyaltyPointsProcessor();

    // Register processors for their supported methods
    cashProcessor.supportedMethods.forEach(method => {
      this.processors.set(method, cashProcessor);
    });

    cardProcessor.supportedMethods.forEach(method => {
      this.processors.set(method, cardProcessor);
    });

    walletProcessor.supportedMethods.forEach(method => {
      this.processors.set(method, walletProcessor);
    });

    bankProcessor.supportedMethods.forEach(method => {
      this.processors.set(method, bankProcessor);
    });

    loyaltyProcessor.supportedMethods.forEach(method => {
      this.processors.set(method, loyaltyProcessor);
    });
  }

  getProcessor(method: PaymentMethod): PaymentProcessor | null {
    return this.processors.get(method) || null;
  }

  getSupportedMethods(): PaymentMethod[] {
    return Array.from(this.processors.keys());
  }

  async processPayment(method: PaymentMethod, paymentData: PaymentRequest): Promise<PaymentResponse> {
    const processor = this.getProcessor(method);
    
    if (!processor) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        message: "Unsupported payment method",
        error: `No processor available for payment method: ${method}`
      };
    }

    try {
      return await processor.processPayment(paymentData);
    } catch (error) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        message: "Payment processing error",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async refundPayment(method: PaymentMethod, refundData: RefundRequest): Promise<RefundResponse> {
    const processor = this.getProcessor(method);
    
    if (!processor) {
      return {
        success: false,
        refundId: "",
        status: "failed",
        message: "Unsupported payment method for refund",
        error: `No processor available for payment method: ${method}`
      };
    }

    try {
      return await processor.refundPayment(refundData);
    } catch (error) {
      return {
        success: false,
        refundId: "",
        status: "failed",
        message: "Refund processing error",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async voidPayment(method: PaymentMethod, voidData: VoidRequest): Promise<VoidResponse> {
    const processor = this.getProcessor(method);
    
    if (!processor) {
      return {
        success: false,
        voidId: "",
        status: "failed",
        message: "Unsupported payment method for void",
        error: `No processor available for payment method: ${method}`
      };
    }

    try {
      return await processor.voidPayment(voidData);
    } catch (error) {
      return {
        success: false,
        voidId: "",
        status: "failed",
        message: "Void processing error",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}

// Export singleton instance
export const paymentRegistry = new PaymentProcessorRegistry();

// Export utility functions
export const isPaymentMethodSupported = (method: PaymentMethod): boolean => {
  return paymentRegistry.getSupportedMethods().includes(method);
};

export const getPaymentMethodDisplayName = (method: PaymentMethod): string => {
  const displayNames: Record<PaymentMethod, string> = {
    cash: "Cash",
    credit_card: "Credit Card",
    debit_card: "Debit Card", 
    digital_wallet: "Digital Wallet",
    bank_transfer: "Bank Transfer",
    loyalty_points: "Loyalty Points"
  };
  
  return displayNames[method] || method;
};

export const getPaymentMethodProcessingTime = (method: PaymentMethod): string => {
  const processingTimes: Record<PaymentMethod, string> = {
    cash: "Instant",
    credit_card: "2-3 seconds",
    debit_card: "2-3 seconds",
    digital_wallet: "1-2 seconds", 
    bank_transfer: "3-5 seconds",
    loyalty_points: "Instant"
  };
  
  return processingTimes[method] || "Unknown";
};