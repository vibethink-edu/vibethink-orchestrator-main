// POS System TypeScript Definitions
// Following VThink 1.0 methodology with strict typing

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  sku: string;
  barcode?: string;
  category_id: string;
  company_id: string; // Multi-tenant security
  stock_quantity: number;
  min_stock_level: number;
  is_active: boolean;
  image_url?: string;
  tax_rate: number; // Default 10%
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  color: string; // HSL color for category
  company_id: string; // Multi-tenant security
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
  tax_amount: number;
  total: number;
}

export interface Transaction {
  id: string;
  transaction_number: string;
  company_id: string; // Multi-tenant security
  cashier_id: string;
  customer_id?: string;
  items: CartItem[];
  subtotal: number;
  tax_total: number;
  discount_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_status: TransactionStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  transaction_id: string;
  payment_method: PaymentMethod;
  amount_tendered: number;
  amount_charged: number;
  change_amount: number;
  payment_status: PaymentStatus;
  reference_number?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company_id: string; // Multi-tenant security
  loyalty_points: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface PosSession {
  id: string;
  cashier_id: string;
  company_id: string; // Multi-tenant security
  terminal_id: string;
  start_time: string;
  end_time?: string;
  starting_cash: number;
  ending_cash?: number;
  total_sales: number;
  total_transactions: number;
  session_status: SessionStatus;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  company_id: string; // Multi-tenant security
  movement_type: InventoryMovementType;
  quantity: number;
  reference_id?: string; // Transaction ID for sales
  notes?: string;
  created_at: string;
}

// Enums for better type safety
export type PaymentMethod = 
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'digital_wallet'
  | 'bank_transfer'
  | 'loyalty_points';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type TransactionStatus = 
  | 'draft'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'voided';

export type SessionStatus = 
  | 'active'
  | 'closed'
  | 'suspended';

export type InventoryMovementType = 
  | 'sale'
  | 'purchase'
  | 'adjustment'
  | 'return'
  | 'waste'
  | 'transfer';

// Cart and POS Interface Types
export interface PosCart {
  items: CartItem[];
  subtotal: number;
  taxTotal: number;
  discountAmount: number;
  totalAmount: number;
  itemCount: number;
}

export interface PosState {
  currentView: PosView;
  activeSession: PosSession | null;
  cart: PosCart;
  selectedCustomer: Customer | null;
  paymentMethod: PaymentMethod;
  isProcessingPayment: boolean;
}

export type PosView = 
  | 'pos'
  | 'products'
  | 'analytics'
  | 'settings';

// Analytics Types
export interface SalesMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export interface SalesReportData {
  period: string;
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
  topProducts: TopProduct[];
  salesByCategory: CategorySales[];
  salesByHour: HourlySales[];
  salesByPaymentMethod: PaymentMethodSales[];
}

export interface TopProduct {
  product: Product;
  quantity_sold: number;
  revenue: number;
  profit: number;
}

export interface CategorySales {
  category: ProductCategory;
  sales: number;
  quantity: number;
  percentage: number;
}

export interface HourlySales {
  hour: number;
  sales: number;
  transactions: number;
}

export interface PaymentMethodSales {
  payment_method: PaymentMethod;
  amount: number;
  count: number;
  percentage: number;
}

// Form Types for Components
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  cost: number;
  sku: string;
  barcode: string;
  category_id: string;
  stock_quantity: number;
  min_stock_level: number;
  tax_rate: number;
  image_url: string;
  is_active: boolean;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  is_active: boolean;
}

export interface PaymentFormData {
  payment_method: PaymentMethod;
  amount_tendered: number;
  reference_number?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and Search Types
export interface ProductFilters {
  category_id?: string;
  is_active?: boolean;
  low_stock?: boolean;
  search?: string;
}

export interface TransactionFilters {
  start_date?: string;
  end_date?: string;
  payment_method?: PaymentMethod;
  transaction_status?: TransactionStatus;
  cashier_id?: string;
}

// POS Configuration
export interface PosConfig {
  company_id: string;
  default_tax_rate: number;
  currency: string;
  decimal_places: number;
  receipt_template: string;
  auto_print_receipt: boolean;
  require_customer_info: boolean;
  enable_loyalty_program: boolean;
  low_stock_threshold: number;
}

// Receipt Types
export interface ReceiptData {
  transaction: Transaction;
  company_info: {
    name: string;
    address: string;
    phone: string;
    email: string;
    tax_id?: string;
  };
  receipt_number: string;
  print_time: string;
}

export interface ReceiptLine {
  type: 'header' | 'item' | 'subtotal' | 'tax' | 'total' | 'payment' | 'footer';
  content: string;
  align?: 'left' | 'center' | 'right';
}