/**
 * Cliente API centralizado que elimina boilerplate en llamadas HTTP
 * 
 * Maneja automáticamente:
 * - Headers comunes
 * - Manejo de errores
 * - Interceptores de request/response
 * - Retry logic
 * - Timeout
 */

interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

class ApiClient {
  private config: ApiClientConfig;
  private defaultHeaders: Record<string, string>;

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_SUPABASE_URL || '',
      timeout: 30000, // 30 segundos
      retries: 3,
      retryDelay: 1000, // 1 segundo
      ...config,
    };

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Obtener token de autenticación
   */
  private getAuthToken(): string | null {
    // Implementar según tu sistema de auth
    return localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
  }

  /**
   * Crear headers con autenticación
   */
  private createHeaders(customHeaders?: Record<string, string>): Headers {
    const headers = new Headers({
      ...this.defaultHeaders,
      ...customHeaders,
    });

    // Agregar token de autenticación si existe
    const token = this.getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Crear URL completa
   */
  private createURL(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    
    const baseURL = this.config.baseURL.replace(/\/$/, '');
    const cleanEndpoint = endpoint.replace(/^\//, '');
    
    return `${baseURL}/${cleanEndpoint}`;
  }

  /**
   * Crear timeout promise
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Retry logic
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number,
    delay: number
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(requestFn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  /**
   * Determinar si un error es retryable
   */
  private isRetryableError(error: any): boolean {
    if (error instanceof TypeError) return true; // Network errors
    if (error.message?.includes('timeout')) return true;
    if (error.status >= 500 && error.status < 600) return true; // Server errors
    return false;
  }

  /**
   * Realizar request HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.config.timeout,
      retries = this.config.retries,
      ...requestOptions
    } = options;

    const url = this.createURL(endpoint);
    const headers = this.createHeaders(requestOptions.headers as Record<string, string>);

    const requestFn = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      
      const requestPromise = fetch(url, {
        ...requestOptions,
        headers,
        signal: controller.signal,
      });

      const timeoutPromise = this.createTimeoutPromise(timeout);

      const response = await Promise.race([requestPromise, timeoutPromise]);
      
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        throw error;
      }

      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as T;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    };

    return this.retryRequest(requestFn, retries, this.config.retryDelay);
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
    return response.data;
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, file: File, options?: RequestOptions): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
      ...options,
    });
    return response.data;
  }

  /**
   * Download file
   */
  async download(endpoint: string, filename?: string, options?: RequestOptions): Promise<void> {
    const response = await this.request<Blob>(endpoint, {
      method: 'GET',
      ...options,
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

// Instancia global del cliente API
export const apiClient = new ApiClient();

// Exportar la clase para casos especiales
export { ApiClient }; 