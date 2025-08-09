"use client";

import { useState, useEffect, useCallback } from "react";
import supabaseClient from "@/integrations/supabase/client";
import { 
  Product, 
  ProductCategory, 
  Transaction,
  PosSession,
  ProductFilters,
  TransactionFilters 
} from "../types";

// Mock user context - In real app, this would come from auth context
const mockUser = {
  id: "user-123",
  company_id: "company-123",
  role: "MANAGER"
};

export function usePosData() {
  // For type compatibility in mock/real client union, treat as any for chaining
  const supabase: any = supabaseClient as any;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentSession, setCurrentSession] = useState<PosSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Session data for dashboard
  const [sessionData, setSessionData] = useState<{
    id: string;
    cashier_name: string;
    terminal_id: string;
    start_time: string;
    starting_cash: number;
    current_sales: number;
    transaction_count: number;
    status: 'active' | 'closed' | 'suspended';
    todaySales: number;
    todayTransactions: number;
    activeProducts: number;
    todayCustomers: number;
  } | null>(null);

  // Fetch products with multi-tenant security
  const fetchProducts = useCallback(async (filters?: ProductFilters) => {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*)
        `)
        .eq('company_id', mockUser.company_id); // Multi-tenant security

      // Apply filters
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }
      
      if (filters?.low_stock) {
        query = query.lt('stock_quantity', 'min_stock_level');
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('name');

      if (error) throw error;

      // Transform data to match our types
      const transformedProducts: Product[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        cost: item.cost,
        sku: item.sku,
        barcode: item.barcode,
        category_id: item.category_id,
        company_id: item.company_id,
        stock_quantity: item.stock_quantity,
        min_stock_level: item.min_stock_level,
        is_active: item.is_active,
        image_url: item.image_url,
        tax_rate: item.tax_rate || 0.10,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setProducts(transformedProducts);
      return transformedProducts;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      return [];
    }
  }, []);

  // Fetch categories with multi-tenant security
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('company_id', mockUser.company_id) // Multi-tenant security
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      const transformedCategories: ProductCategory[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        color: item.color || 'hsl(var(--primary))',
        company_id: item.company_id,
        is_active: item.is_active,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setCategories(transformedCategories);
      return transformedCategories;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      return [];
    }
  }, []);

  // Fetch transactions with multi-tenant security
  const fetchTransactions = useCallback(async (filters?: TransactionFilters) => {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          transaction_items(*)
        `)
        .eq('company_id', mockUser.company_id); // Multi-tenant security

      // Apply filters
      if (filters?.start_date) {
        query = query.gte('created_at', filters.start_date);
      }
      
      if (filters?.end_date) {
        query = query.lte('created_at', filters.end_date);
      }
      
      if (filters?.payment_method) {
        query = query.eq('payment_method', filters.payment_method);
      }
      
      if (filters?.transaction_status) {
        query = query.eq('transaction_status', filters.transaction_status);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Transform data to match our types (simplified for now)
      const transformedTransactions: Transaction[] = (data || []).map(item => ({
        id: item.id,
        transaction_number: item.transaction_number,
        company_id: item.company_id,
        cashier_id: item.cashier_id,
        customer_id: item.customer_id,
        items: [], // TODO: Transform transaction_items
        subtotal: item.subtotal,
        tax_total: item.tax_total,
        discount_amount: item.discount_amount || 0,
        total_amount: item.total_amount,
        payment_method: item.payment_method,
        payment_status: item.payment_status,
        transaction_status: item.transaction_status,
        notes: item.notes,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setTransactions(transformedTransactions);
      return transformedTransactions;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      return [];
    }
  }, []);

  // Initialize session data (mock data for now)
  const initializeSessionData = useCallback(() => {
    // In a real app, this would fetch from the database
    const mockSessionData = {
      id: "session-123",
      cashier_name: "John Doe",
      terminal_id: "POS-001",
      start_time: new Date().toISOString(),
      starting_cash: 200.00,
      current_sales: 1250.75,
      transaction_count: 15,
      status: 'active' as const,
      todaySales: 1250.75,
      todayTransactions: 15,
      activeProducts: 150,
      todayCustomers: 12
    };

    setSessionData(mockSessionData);
  }, []);

  // Search products
  const searchProducts = useCallback(async (query: string) => {
    return fetchProducts({ search: query });
  }, [fetchProducts]);

  // Get products by category
  const getProductsByCategory = useCallback(async (categoryId: string) => {
    return fetchProducts({ category_id: categoryId });
  }, [fetchProducts]);

  // Get low stock products
  const getLowStockProducts = useCallback(async () => {
    return fetchProducts({ low_stock: true });
  }, [fetchProducts]);

  // Create product
  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          company_id: mockUser.company_id // Multi-tenant security
        }])
        .select('*')
        .single();

      if (error) throw error;

      // Refresh products list
      await fetchProducts();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err;
    }
  }, [fetchProducts]);

  // Update product
  const updateProduct = useCallback(async (productId: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .eq('company_id', mockUser.company_id) // Multi-tenant security
        .select('*')
        .single();

      if (error) throw error;

      // Refresh products list
      await fetchProducts();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  }, [fetchProducts]);

  // Delete product
  const deleteProduct = useCallback(async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .eq('id', productId)
        .eq('company_id', mockUser.company_id) // Multi-tenant security
        .delete();

      if (error) throw error;

      // Refresh products list
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  }, [fetchProducts]);

  // Process transaction
  const processTransaction = useCallback(async (transactionData: any) => {
    try {
      // TODO: Implement transaction processing
      console.log("Processing transaction:", transactionData);
      
      // This would involve:
      // 1. Creating transaction record
      // 2. Creating transaction items
      // 3. Updating inventory
      // 4. Creating payment record
      
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process transaction');
      throw err;
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchTransactions(),
        ]);
        initializeSessionData();
      } catch (err) {
        console.error('Failed to initialize POS data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [fetchProducts, fetchCategories, fetchTransactions, initializeSessionData]);

  return {
    // Data
    products,
    categories,
    transactions,
    currentSession,
    sessionData,
    
    // Loading states
    isLoading,
    error,
    
    // Actions
    fetchProducts,
    fetchCategories,
    fetchTransactions,
    searchProducts,
    getProductsByCategory,
    getLowStockProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    processTransaction,
    
    // Utilities
    refetch: () => {
      fetchProducts();
      fetchCategories();
      fetchTransactions();
    }
  };
}