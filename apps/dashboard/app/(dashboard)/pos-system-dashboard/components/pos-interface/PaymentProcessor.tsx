"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@vibethink/ui";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  ArrowLeft,
  Receipt,
  CheckCircle,
  Calculator,
  DollarSign
} from "lucide-react";
import { PosCart, Customer, PaymentMethod } from "../../types";

interface PaymentProcessorProps {
  cart: PosCart;
  customer: Customer | null;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export function PaymentProcessor({ 
  cart, 
  customer, 
  onPaymentComplete, 
  onCancel 
}: PaymentProcessorProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountTendered, setAmountTendered] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateChange = () => {
    const tendered = parseFloat(amountTendered) || 0;
    return Math.max(0, tendered - cart.totalAmount);
  };

  const paymentMethods = [
    {
      id: "cash" as PaymentMethod,
      label: "Cash",
      icon: Banknote,
      color: "hsl(var(--chart-1))",
      requiresAmount: true
    },
    {
      id: "credit_card" as PaymentMethod,
      label: "Credit Card",
      icon: CreditCard,
      color: "hsl(var(--chart-2))",
      requiresAmount: false
    },
    {
      id: "debit_card" as PaymentMethod,
      label: "Debit Card",
      icon: CreditCard,
      color: "hsl(var(--chart-3))",
      requiresAmount: false
    },
    {
      id: "digital_wallet" as PaymentMethod,
      label: "Digital Wallet",
      icon: Smartphone,
      color: "hsl(var(--chart-4))",
      requiresAmount: false
    }
  ];

  const quickCashAmounts = [
    cart.totalAmount, // Exact amount
    Math.ceil(cart.totalAmount), // Round up to nearest dollar
    Math.ceil(cart.totalAmount / 5) * 5, // Round up to nearest $5
    Math.ceil(cart.totalAmount / 10) * 10, // Round up to nearest $10
    Math.ceil(cart.totalAmount / 20) * 20, // Round up to nearest $20
  ].filter((amount, index, arr) => arr.indexOf(amount) === index); // Remove duplicates

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implement actual payment processing
      console.log("Processing payment:", {
        method: selectedPaymentMethod,
        amount: cart.totalAmount,
        tendered: selectedPaymentMethod === "cash" ? parseFloat(amountTendered) : cart.totalAmount,
        change: selectedPaymentMethod === "cash" ? calculateChange() : 0
      });

      setShowReceipt(true);
    } catch (error) {
      console.error("Payment processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const canProcessPayment = () => {
    if (selectedPaymentMethod === "cash") {
      const tendered = parseFloat(amountTendered) || 0;
      return tendered >= cart.totalAmount;
    }
    return true;
  };

  const ReceiptView = () => (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="font-medium">
              {paymentMethods.find(p => p.id === selectedPaymentMethod)?.label}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium">{formatCurrency(cart.totalAmount)}</span>
          </div>
          {selectedPaymentMethod === "cash" && (
            <>
              <div className="flex justify-between">
                <span>Tendered:</span>
                <span className="font-medium">{formatCurrency(parseFloat(amountTendered))}</span>
              </div>
              <div className="flex justify-between">
                <span>Change:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(calculateChange())}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // TODO: Print receipt
              console.log("Print receipt");
            }}
          >
            <Receipt className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          
          <Button
            className="w-full"
            onClick={onPaymentComplete}
          >
            Complete Transaction
          </Button>
        </div>
      </div>
    </Card>
  );

  if (showReceipt) {
    return <ReceiptView />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cart</span>
        </Button>
        <h1 className="text-2xl font-bold">Payment Processing</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Payment Methods */}
        <div className="space-y-6">
          {/* Transaction Summary */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items ({cart.itemCount}):</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              {cart.taxTotal > 0 && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatCurrency(cart.taxTotal)}</span>
                </div>
              )}
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(cart.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(cart.totalAmount)}</span>
              </div>
            </div>

            {customer && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-medium">Customer: {customer.name}</p>
                {customer.email && (
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                )}
              </div>
            )}
          </Card>

          {/* Payment Methods */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                const isSelected = selectedPaymentMethod === method.id;
                
                return (
                  <Button
                    key={method.id}
                    variant={isSelected ? "default" : "outline"}
                    className="h-16 flex flex-col items-center space-y-1"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    style={{
                      backgroundColor: isSelected ? method.color : 'transparent',
                      borderColor: method.color,
                      color: isSelected ? 'white' : method.color
                    }}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-xs">{method.label}</span>
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side - Payment Input */}
        <div className="space-y-6">
          {/* Cash Payment Input */}
          {selectedPaymentMethod === "cash" && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Cash Payment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Amount Tendered
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={amountTendered}
                      onChange={(e) => setAmountTendered(e.target.value)}
                      placeholder="0.00"
                      className="pl-10 text-lg font-medium"
                      step="0.01"
                      min={cart.totalAmount}
                    />
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <p className="text-sm font-medium mb-2">Quick Amounts</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickCashAmounts.map((amount, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmountTendered(amount.toString())}
                        className="text-sm"
                      >
                        {formatCurrency(amount)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Change Calculation */}
                {amountTendered && parseFloat(amountTendered) >= cart.totalAmount && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-green-800">Change Due:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(calculateChange())}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Card Payment Info */}
          {(selectedPaymentMethod === "credit_card" || selectedPaymentMethod === "debit_card") && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Card Payment</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Please insert or swipe the customer's card when ready to process payment.
                </p>
                <div className="flex items-center justify-center py-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <div className="text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Waiting for card...
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Digital Wallet Payment */}
          {selectedPaymentMethod === "digital_wallet" && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Digital Wallet Payment</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Customer can tap their phone or scan QR code to pay.
                </p>
                <div className="flex items-center justify-center py-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Ready for tap or scan
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Process Payment Button */}
          <Button
            className="w-full h-12 text-lg font-semibold"
            onClick={handlePayment}
            disabled={!canProcessPayment() || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Process Payment ({formatCurrency(cart.totalAmount)})
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
