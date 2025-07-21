/**
 * Centralized API Client
 * 
 * Provides standardized HTTP client with:
 * - Automatic authentication
 * - Error handling and retries
 * - Request/response interceptors
 * - Company scoping
 * - File upload/download
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { supabase } from '@/integrations/supabase/client';

// API client configuration
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

// Request options
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
  companyScope?: boolean;
}

// Response wrapper
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// Error wrapper
interface ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
  isNetworkError?: boolean;
  isTimeoutError?: boolean;
}

// Default configuration
const defaultConfig: ApiClientConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.VibeThink.com',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000
};

/**
 * API Client Class
 */
class ApiClient {
  private config: ApiClientConfig;
  private interceptors: {
    request: Array<(config: RequestOptions) => RequestOptions>;
    response: Array<(response: ApiResponse) => ApiResponse>;
    error: Array<(error: ApiError) => ApiError>;
  };

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.interceptors = {
      request: [],
      response: [],
      error: []
    };
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: (config: RequestOptions) => RequestOptions) {
    this.interceptors.request.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: (response: ApiResponse) => ApiResponse) {
    this.interceptors.response.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: (error: ApiError) => ApiError) {
    this.interceptors.error.push(interceptor);
  }

  /**
   * Execute interceptors
   */
  private executeRequestInterceptors(config: RequestOptions): RequestOptions {
    return this.interceptors.request.reduce((acc, interceptor) => interceptor(acc), config);
  }

  private executeResponseInterceptors(response: ApiResponse): ApiResponse {
    return this.interceptors.response.reduce((acc, interceptor) => interceptor(acc), response);
  }

  private executeErrorInterceptors(error: ApiError): ApiError {
    return this.interceptors.error.reduce((acc, interceptor) => interceptor(acc), error);
  }

  /**
   * Get authentication token
   */
  private async getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  /**
   * Get company ID from user
   */
  private async getCompanyId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    return profile?.company_id || null;
  }

  /**
   * Build URL with parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.config.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Create error object
   */
  private createError(message: string, status?: number, data?: any): ApiError {
    const error = new Error(message) as ApiError;
    error.status = status;
    error.data = data;
    return error;
  }

  /**
   * Retry function with exponential backoff
   */
  private async retry<T>(
    fn: () => Promise<T>,
    retries: number,
    delay: number
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error as ApiError)) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: ApiError): boolean {
    return (
      error.isNetworkError ||
      error.isTimeoutError ||
      (error.status && error.status >= 500) ||
      error.status === 429
    );
  }

  /**
   * Make HTTP request
   */
  private async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const config = this.executeRequestInterceptors({
      method: 'GET',
      headers: {},
      ...options
    });

    const url = this.buildURL(endpoint, config.params);
    const token = await this.getAuthToken();
    const companyId = config.companyScope !== false ? await this.getCompanyId() : null;

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (companyId) {
      headers['X-Company-ID'] = companyId;
    }

    // Prepare request
    const requestOptions: RequestInit = {
      method: config.method,
      headers,
      signal: AbortSignal.timeout(config.timeout || this.config.timeout)
    };

    if (config.body && config.method !== 'GET') {
      requestOptions.body = JSON.stringify(config.body);
    }

    // Execute request with retries
    return this.retry(
      async () => {
        try {
          const response = await fetch(url, requestOptions);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = this.createError(
              errorData.message || `HTTP ${response.status}`,
              response.status,
              errorData
            );
            throw this.executeErrorInterceptors(error);
          }

          const data = await response.json();
          const apiResponse: ApiResponse<T> = {
            data,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          };

          return this.executeResponseInterceptors(apiResponse);
        } catch (error) {
          if (error instanceof Error) {
            const apiError = this.createError(
              error.message,
              undefined,
              undefined
            );
            
            if (error.name === 'AbortError') {
              apiError.isTimeoutError = true;
            } else if (error.name === 'TypeError') {
              apiError.isNetworkError = true;
            }
            
            throw this.executeErrorInterceptors(apiError);
          }
          throw error;
        }
      },
      config.retries || this.config.retries,
      this.config.retryDelay
    );
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    const response = await this.request<T>(endpoint, { ...options, method: 'GET' });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    const response = await this.request<T>(endpoint, { ...options, method: 'POST', body: data });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    const response = await this.request<T>(endpoint, { ...options, method: 'PUT', body: data });
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    const response = await this.request<T>(endpoint, { ...options, method: 'PATCH', body: data });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    const response = await this.request<T>(endpoint, { ...options, method: 'DELETE' });
    return response.data;
  }

  /**
   * Upload file
   */
  async upload<T = any>(endpoint: string, file: File, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const token = await this.getAuthToken();
    const companyId = options.companyScope !== false ? await this.getCompanyId() : null;

    const headers: Record<string, string> = {
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (companyId) {
      headers['X-Company-ID'] = companyId;
    }

    const url = this.buildURL(endpoint, options.params);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(options.timeout || this.config.timeout)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw this.createError(
        errorData.message || `Upload failed: ${response.status}`,
        response.status,
        errorData
      );
    }

    return response.json();
  }

  /**
   * Download file
   */
  async download(endpoint: string, filename?: string, options: Omit<RequestOptions, 'method'> = {}): Promise<void> {
    const token = await this.getAuthToken();
    const companyId = options.companyScope !== false ? await this.getCompanyId() : null;

    const headers: Record<string, string> = {
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (companyId) {
      headers['X-Company-ID'] = companyId;
    }

    const url = this.buildURL(endpoint, options.params);
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(options.timeout || this.config.timeout)
    });

    if (!response.ok) {
      throw this.createError(
        `Download failed: ${response.status}`,
        response.status
      );
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Create default API client instance
const apiClient = new ApiClient();

// Add default interceptors
apiClient.addRequestInterceptor((config) => {
  // Add request timestamp
  config.headers = {
    ...config.headers,
    'X-Request-Timestamp': Date.now().toString()
  };
  return config;
});

apiClient.addResponseInterceptor((response) => {
  // TODO: log API Response en desarrollo
  return response;
});

apiClient.addErrorInterceptor((error) => {
  // TODO: log 'API Error:' error
  // Handle specific error types
  if (error.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  }
  
  return error;
});

export default apiClient;
export { ApiClient }; 