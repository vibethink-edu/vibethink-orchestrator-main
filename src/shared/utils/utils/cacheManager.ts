/**
 * Sistema de cache optimizado para configuraciones de empresa
 * Implementa cache en memoria, localStorage y base de datos
 */
export class CompanyCacheManager {
  private static instance: CompanyCacheManager;
  private memoryCache = new Map<string, { data: any; timestamp: number }>();
  private readonly MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly LOCAL_STORAGE_TTL = 30 * 60 * 1000; // 30 minutos
  
  static getInstance(): CompanyCacheManager {
    if (!CompanyCacheManager.instance) {
      CompanyCacheManager.instance = new CompanyCacheManager();
    }
    return CompanyCacheManager.instance;
  }
  
  /**
   * Genera clave de cache única por empresa y tipo de dato
   */
  private generateCacheKey(companyId: string, dataType: string): string {
    return `${dataType}_${companyId}`;
  }
  
  /**
   * Obtiene datos del cache con fallback automático
   */
  async get<T>(companyId: string, dataType: string, fetchFunction: () => Promise<T>): Promise<T> {
    const cacheKey = this.generateCacheKey(companyId, dataType);
    
    // 1. Intentar cache en memoria
    const memoryData = this.getFromMemory(cacheKey);
    if (memoryData) {
      return memoryData;
    }
    
    // 2. Intentar cache en localStorage
    const localStorageData = this.getFromLocalStorage(cacheKey);
    if (localStorageData) {
      this.setInMemory(cacheKey, localStorageData);
      return localStorageData;
    }
    
    // 3. Cargar desde fuente original
    const freshData = await fetchFunction();
    
    // 4. Guardar en ambos caches
    this.setInMemory(cacheKey, freshData);
    this.setInLocalStorage(cacheKey, freshData);
    
    return freshData;
  }
  
  private getFromMemory<T>(cacheKey: string): T | null {
    const cached = this.memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.MEMORY_CACHE_TTL) {
      return cached.data;
    }
    this.memoryCache.delete(cacheKey);
    return null;
  }
  
  private setInMemory<T>(cacheKey: string, data: T): void {
    this.memoryCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }
  
  private getFromLocalStorage<T>(cacheKey: string): T | null {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.LOCAL_STORAGE_TTL) {
          return data;
        }
        localStorage.removeItem(cacheKey);
      }
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
    }
    return null;
  }
  
  private setInLocalStorage<T>(cacheKey: string, data: T): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
    }
  }
  
  /**
   * Invalida cache específico
   */
  invalidate(companyId: string, dataType: string): void {
    const cacheKey = this.generateCacheKey(companyId, dataType);
    this.memoryCache.delete(cacheKey);
    localStorage.removeItem(cacheKey);
  }
  
  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.memoryCache.clear();
    // Limpiar solo las claves de cache de empresas
    Object.keys(localStorage).forEach(key => {
      if (key.includes('_')) {
        localStorage.removeItem(key);
      }
    });
  }
  
  /**
   * Obtiene estadísticas del cache
   */
  getStats(): { memorySize: number; localStorageSize: number } {
    const memorySize = this.memoryCache.size;
    let localStorageSize = 0;
    
    Object.keys(localStorage).forEach(key => {
      if (key.includes('_')) {
        localStorageSize++;
      }
    });
    
    return { memorySize, localStorageSize };
  }
} 