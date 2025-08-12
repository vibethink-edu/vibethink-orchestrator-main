// Suppress React 19 warnings immediately on load
// This runs before any React components are mounted

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Override console.error immediately
  console.error = (...args: any[]) => {
    // Check for React 19 ref warnings in any argument
    const shouldSuppress = args.some((arg: any) => 
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
  
  // Also override console.warn
  console.warn = (...args: any[]) => {
    const shouldSuppress = args.some((arg: any) => 
      arg && typeof arg === 'string' && 
      (arg.includes('element.ref') ||
       arg.includes('React 19'))
    );
    
    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };
}

export {};