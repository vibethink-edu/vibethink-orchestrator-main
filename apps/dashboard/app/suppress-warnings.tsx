"use client";

import { useEffect } from 'react';

export function SuppressReact19Warnings() {
  useEffect(() => {
    // Suppress React 19 ref warnings in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      const originalWarn = console.warn;
      
      // Override console.error
      console.error = (...args) => {
        // Check for React 19 ref warnings in any argument
        const shouldSuppress = args.some(arg => 
          arg && typeof arg === 'string' && 
          (arg.includes('element.ref was removed in React 19') ||
           arg.includes('ref is now a regular prop') ||
           arg.includes('Accessing element.ref') ||
           arg.includes('JSX Element type'))
        );
        
        if (!shouldSuppress) {
          originalError.apply(console, args);
        }
      };
      
      // Also override console.warn just in case
      console.warn = (...args) => {
        const shouldSuppress = args.some(arg => 
          arg && typeof arg === 'string' && 
          (arg.includes('element.ref') ||
           arg.includes('React 19'))
        );
        
        if (!shouldSuppress) {
          originalWarn.apply(console, args);
        }
      };
      
      // Cleanup on unmount
      return () => {
        console.error = originalError;
        console.warn = originalWarn;
      };
    }
  }, []);
  
  return null;
}
