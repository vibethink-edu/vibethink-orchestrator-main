// POS Utility Functions
// Following VThink 1.0 methodology with comprehensive utility support

import { Product, CartItem, Transaction, PaymentMethod } from "../types";

/**
 * Currency formatting utilities
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const parseCurrency = (currencyString: string): number => {
  const cleaned = currencyString.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Tax calculation utilities
 */
export const calculateTax = (amount: number, taxRate: number): number => {
  return amount * (taxRate / 100);
};

export const calculateTaxInclusivePrice = (price: number, taxRate: number): number => {
  return price + calculateTax(price, taxRate);
};

export const extractTaxFromPrice = (inclusivePrice: number, taxRate: number): number => {
  return inclusivePrice - (inclusivePrice / (1 + taxRate / 100));
};

/**
 * Discount calculation utilities
 */
export const calculatePercentageDiscount = (amount: number, percentage: number): number => {
  return amount * (percentage / 100);
};

export const calculateFixedDiscount = (amount: number, discountAmount: number): number => {
  return Math.min(discountAmount, amount);
};

export const applyDiscount = (
  amount: number, 
  discountType: 'percentage' | 'fixed', 
  discountValue: number
): { discountedAmount: number; discountApplied: number } => {
  let discountApplied: number;
  
  if (discountType === 'percentage') {
    discountApplied = calculatePercentageDiscount(amount, discountValue);
  } else {
    discountApplied = calculateFixedDiscount(amount, discountValue);
  }
  
  return {
    discountedAmount: amount - discountApplied,
    discountApplied
  };
};

/**
 * Transaction number generation
 */
export const generateTransactionNumber = (prefix: string = 'TXN'): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

export const generateReceiptNumber = (transactionNumber: string): string => {
  return `R-${transactionNumber.replace('TXN-', '')}`;
};

/**
 * SKU and barcode utilities
 */
export const generateSKU = (category: string, name: string): string => {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const nameCode = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${categoryCode}-${nameCode}-${timestamp}`;
};

export const validateBarcode = (barcode: string): boolean => {
  // Basic barcode validation (length and numeric check)
  return /^\d{8,13}$/.test(barcode);
};

export const generateBarcode = (): string => {
  // Generate a simple 12-digit barcode
  return Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
};

/**
 * Cart calculations
 */
export const calculateCartSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
};

export const calculateCartTax = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.tax_amount, 0);
};

export const calculateCartTotal = (items: CartItem[], discountAmount: number = 0): number => {
  const subtotal = calculateCartSubtotal(items);
  const tax = calculateCartTax(items);
  return subtotal + tax - discountAmount;
};

export const getCartItemCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * Price and margin calculations
 */
export const calculateMargin = (cost: number, price: number): number => {
  if (price === 0) return 0;
  return ((price - cost) / price) * 100;
};

export const calculateMarkup = (cost: number, price: number): number => {
  if (cost === 0) return 0;
  return ((price - cost) / cost) * 100;
};

export const calculatePriceFromMargin = (cost: number, marginPercentage: number): number => {
  return cost / (1 - marginPercentage / 100);
};

export const calculatePriceFromMarkup = (cost: number, markupPercentage: number): number => {
  return cost * (1 + markupPercentage / 100);
};

/**
 * Stock and inventory utilities
 */
export const isProductInStock = (product: Product): boolean => {
  return product.stock_quantity > 0;
};

export const isProductLowStock = (product: Product): boolean => {
  return product.stock_quantity > 0 && product.stock_quantity <= product.min_stock_level;
};

export const getStockStatusColor = (product: Product): string => {
  if (product.stock_quantity === 0) return 'hsl(var(--destructive))';
  if (isProductLowStock(product)) return 'hsl(var(--warning))';
  return 'hsl(var(--success))';
};

export const calculateStockValue = (product: Product, useCost: boolean = false): number => {
  const unitPrice = useCost ? (product.cost || product.price) : product.price;
  return product.stock_quantity * unitPrice;
};

/**
 * Date and time utilities
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getBusinessHoursStatus = (): { isOpen: boolean; nextChange: string } => {
  const now = new Date();
  const hour = now.getHours();
  
  // Mock business hours: 9 AM to 9 PM
  const isOpen = hour >= 9 && hour < 21;
  const nextChange = isOpen ? '9:00 PM' : '9:00 AM';
  
  return { isOpen, nextChange };
};

/**
 * Payment utilities
 */
export const getPaymentMethodIcon = (method: PaymentMethod): string => {
  const icons = {
    cash: '💵',
    credit_card: '💳',
    debit_card: '💳',
    digital_wallet: '📱',
    bank_transfer: '🏦',
    loyalty_points: '⭐'
  };
  return icons[method] || '💳';
};

export const calculateChange = (amountTendered: number, totalAmount: number): number => {
  return Math.max(0, amountTendered - totalAmount);
};

export const validatePaymentAmount = (
  method: PaymentMethod, 
  amountTendered: number, 
  totalAmount: number
): { valid: boolean; error?: string } => {
  if (method === 'cash' && amountTendered < totalAmount) {
    return { valid: false, error: 'Insufficient payment amount' };
  }
  
  if (amountTendered <= 0) {
    return { valid: false, error: 'Payment amount must be greater than zero' };
  }
  
  return { valid: true };
};

/**
 * Search and filter utilities
 */
export const searchProducts = (products: Product[], query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.sku.toLowerCase().includes(lowercaseQuery) ||
    (product.description && product.description.toLowerCase().includes(lowercaseQuery)) ||
    (product.barcode && product.barcode.includes(query))
  );
};

export const filterProductsByCategory = (products: Product[], categoryId: string): Product[] => {
  if (categoryId === 'all') return products;
  return products.filter(product => product.category_id === categoryId);
};

export const sortProducts = (
  products: Product[], 
  sortBy: 'name' | 'price' | 'stock' | 'created_at',
  sortOrder: 'asc' | 'desc' = 'asc'
): Product[] => {
  return [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'stock':
        comparison = a.stock_quantity - b.stock_quantity;
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

/**
 * Validation utilities
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

export const validateSKU = (sku: string): boolean => {
  // SKU should be 3-20 characters, alphanumeric with hyphens
  const skuRegex = /^[A-Z0-9-]{3,20}$/;
  return skuRegex.test(sku);
};

/**
 * Number formatting utilities
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Color utilities for UI
 */
export const getStatusColor = (status: string): string => {
  const colors = {
    active: 'hsl(var(--success))',
    inactive: 'hsl(var(--muted-foreground))',
    pending: 'hsl(var(--warning))',
    completed: 'hsl(var(--success))',
    cancelled: 'hsl(var(--destructive))',
    failed: 'hsl(var(--destructive))',
    processing: 'hsl(var(--primary))'
  };
  return colors[status as keyof typeof colors] || 'hsl(var(--muted-foreground))';
};

/**
 * Multi-tenant security utilities
 */
export const validateCompanyAccess = (resourceCompanyId: string, userCompanyId: string): boolean => {
  return resourceCompanyId === userCompanyId;
};

export const addCompanyFilter = (queryParams: any, companyId: string): any => {
  return {
    ...queryParams,
    company_id: companyId
  };
};

/**
 * Export utilities for reports
 */
export const generateCSVContent = (data: any[], columns: string[]): string => {
  const headers = columns.join(',');
  const rows = data.map(row => 
    columns.map(col => `"${row[col] || ''}"`).join(',')
  );
  return [headers, ...rows].join('\n');
};

export const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};