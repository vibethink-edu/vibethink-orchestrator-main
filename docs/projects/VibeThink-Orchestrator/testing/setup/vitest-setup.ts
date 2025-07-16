/**
 * Vitest Setup Configuration
 * 
 * Global setup for unit tests including:
 * - Testing Library configuration
 * - Mock service worker setup
 * - Global test utilities
 * - Environment variables
 * 
 * @author AI Pair Platform - Testing Team
 * @version 1.0.0
 */

import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@mocks/server';

// Mock environment variables for testing
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.VITE_OPENAI_API_KEY = 'test-openai-key';

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Setup MSW before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});

// Global test helpers
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  role: 'ADMIN',
  company_id: 'test-company-id',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockCompany = (overrides = {}) => ({
  id: 'test-company-id',
  name: 'Test Company',
  slug: 'test-company',
  status: 'ACTIVE',
  subscription_plan: 'PROFESSIONAL',
  max_users: 25,
  max_monthly_ai_requests: 10000,
  max_monthly_scraping_pages: 1000,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockConfiguration = (overrides = {}) => ({
  id: 'test-config-id',
  category: 'ai_models',
  config_key: 'openai_models',
  config_value: { models: ['gpt-4', 'gpt-3.5-turbo'] },
  description: 'Test configuration',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Test environment utilities
export const waitForElementToBeRemoved = (element: Element | null) => {
  return new Promise<void>((resolve) => {
    if (!element) {
      resolve();
      return;
    }
    
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

// Performance testing utilities
export const measurePerformance = (fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
};

// Accessibility testing utilities
export const checkA11y = async (container: HTMLElement) => {
  // Basic accessibility checks
  const buttons = container.querySelectorAll('button');
  const inputs = container.querySelectorAll('input');
  const images = container.querySelectorAll('img');
  
  // Check for alt text on images
  images.forEach((img) => {
    if (!img.alt && !img.getAttribute('aria-label')) {
      throw new Error(`Image missing alt text or aria-label: ${img.src}`);
    }
  });
  
  // Check for labels on inputs
  inputs.forEach((input) => {
    const id = input.id;
    const label = document.querySelector(`label[for="${id}"]`);
    const ariaLabel = input.getAttribute('aria-label');
    
    if (!label && !ariaLabel && input.type !== 'hidden') {
      throw new Error(`Input missing label or aria-label: ${id}`);
    }
  });
  
  return true;
}; 