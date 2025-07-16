/**
 * Base Local Storage Hook for Data Persistence
 * 
 * Provides standardized local storage management
 * - Type-safe storage with serialization
 * - Company-scoped storage
 * - Automatic cleanup and expiration
 * - Encryption support for sensitive data
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';

// Storage item with metadata
interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
  encrypted?: boolean;
}

// Storage options
interface StorageOptions {
  /** Whether to encrypt the data */
  encrypt?: boolean;
  /** Expiration time in milliseconds */
  expiresIn?: number;
  /** Whether to scope by company */
  companyScope?: boolean;
  /** Custom serializer */
  serialize?: (value: any) => string;
  /** Custom deserializer */
  deserialize?: (value: string) => any;
}

// Default storage options
const defaultOptions: StorageOptions = {
  encrypt: false,
  expiresIn: undefined,
  companyScope: true,
  serialize: JSON.stringify,
  deserialize: JSON.parse
};

/**
 * Simple encryption/decryption (for development - use proper encryption in production)
 */
const encrypt = (text: string): string => {
  if (typeof window === 'undefined') return text;
  return btoa(text);
};

const decrypt = (text: string): string => {
  if (typeof window === 'undefined') return text;
  try {
    return atob(text);
  } catch {
    return text;
  }
};

/**
 * Generate storage key with company scoping
 */
const generateKey = (key: string, companyId?: string, companyScope: boolean = true): string => {
  if (companyScope && companyId) {
    return `ai-pair:${companyId}:${key}`;
  }
  return `ai-pair:${key}`;
};

/**
 * Check if item is expired
 */
const isExpired = (item: StorageItem<any>): boolean => {
  if (!item.expiresAt) return false;
  return Date.now() > item.expiresAt;
};

/**
 * Base local storage hook
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: StorageOptions = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const { user } = useAuth();
  const mergedOptions = { ...defaultOptions, ...options };
  
  const storageKey = generateKey(key, user?.company_id, mergedOptions.companyScope);

  // Get initial value from localStorage
  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(storageKey);
      if (!item) return initialValue;

      let parsedItem: StorageItem<T>;
      
      if (mergedOptions.encrypt) {
        const decrypted = decrypt(item);
        parsedItem = mergedOptions.deserialize!(decrypted);
      } else {
        parsedItem = mergedOptions.deserialize!(item);
      }

      // Check expiration
      if (isExpired(parsedItem)) {
        window.localStorage.removeItem(storageKey);
        return initialValue;
      }

      return parsedItem.value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  }, [storageKey, initialValue, mergedOptions]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Update stored value
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Create storage item
      const item: StorageItem<T> = {
        value: valueToStore,
        timestamp: Date.now(),
        encrypted: mergedOptions.encrypt
      };

      // Add expiration if specified
      if (mergedOptions.expiresIn) {
        item.expiresAt = Date.now() + mergedOptions.expiresIn;
      }

      // Serialize and optionally encrypt
      let serialized = mergedOptions.serialize!(item);
      if (mergedOptions.encrypt) {
        serialized = encrypt(serialized);
      }

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, serialized);
      }

      // Update state
      setStoredValue(valueToStore);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }, [storedValue, storageKey, mergedOptions]);

  // Remove value
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(storageKey);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [storageKey, initialValue]);

  // Update stored value when key or company changes
  useEffect(() => {
    setStoredValue(getStoredValue());
  }, [storageKey, getStoredValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for storing user preferences
 */
export function useUserPreferences<T extends Record<string, any>>(
  initialPreferences: T
): [T, (preferences: Partial<T>) => void] {
  const [preferences, setPreferences] = useLocalStorage('user-preferences', initialPreferences, {
    companyScope: false, // User-specific, not company-specific
    expiresIn: 365 * 24 * 60 * 60 * 1000 // 1 year
  });

  const updatePreferences = useCallback((newPreferences: Partial<T>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, [setPreferences]);

  return [preferences, updatePreferences];
}

/**
 * Hook for storing company configuration
 */
export function useCompanyConfiguration<T extends Record<string, any>>(
  initialConfig: T
): [T, (config: Partial<T>) => void] {
  const [config, setConfig] = useLocalStorage('company-config', initialConfig, {
    companyScope: true,
    expiresIn: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  const updateConfig = useCallback((newConfig: Partial<T>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, [setConfig]);

  return [config, updateConfig];
}

/**
 * Hook for storing sensitive data (encrypted)
 */
export function useSecureStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  return useLocalStorage(key, initialValue, {
    encrypt: true,
    companyScope: true,
    expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

/**
 * Hook for storing temporary data (short expiration)
 */
export function useTemporaryStorage<T>(
  key: string,
  initialValue: T,
  expiresIn: number = 24 * 60 * 60 * 1000 // 1 day
): [T, (value: T) => void, () => void] {
  return useLocalStorage(key, initialValue, {
    expiresIn,
    companyScope: true
  });
}

/**
 * Utility to clear all company-scoped storage
 */
export function clearCompanyStorage(companyId?: string): void {
  if (typeof window === 'undefined') return;

  const keys = Object.keys(window.localStorage);
  const prefix = companyId ? `ai-pair:${companyId}:` : 'ai-pair:';
  
  keys.forEach(key => {
    if (key.startsWith(prefix)) {
      window.localStorage.removeItem(key);
    }
  });
}

/**
 * Utility to get storage size
 */
export function getStorageSize(): { used: number; available: number; total: number } {
  if (typeof window === 'undefined') {
    return { used: 0, available: 0, total: 0 };
  }

  let used = 0;
  const keys = Object.keys(window.localStorage);
  
  keys.forEach(key => {
    used += window.localStorage.getItem(key)?.length || 0;
  });

  // Estimate available space (5MB is typical limit)
  const total = 5 * 1024 * 1024; // 5MB
  const available = total - used;

  return { used, available, total };
} 