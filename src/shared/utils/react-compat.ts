/**
 * React Compatibility Utilities
 * 
 * Handles compatibility issues between React versions and library dependencies.
 * Specifically addresses React 19 ref warnings from Radix UI while using React 18.
 */

// Store original console.error (works both server and client side)
const originalError = console.error;

// Override console.error to filter specific React 19 ref warnings
console.error = (...args: any[]) => {
  // Check if this is the specific React 19 ref warning
  const message = args[0];
  if (
    typeof message === 'string' && (
      message.includes('Accessing element.ref was removed in React 19') ||
      message.includes('ref is now a regular prop') ||
      message.includes('It will be removed from the JSX Element type')
    )
  ) {
    // Silently ignore React 19 compatibility warnings
    // These are expected with Radix UI + React 18 combination
    return;
  }
  
  // For all other errors, use the original console.error
  originalError.apply(console, args);
};

// Also intercept console.warn for React warnings
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const message = args[0];
  if (
    typeof message === 'string' && (
      message.includes('Accessing element.ref was removed in React 19') ||
      message.includes('ref is now a regular prop')
    )
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

export default {};
