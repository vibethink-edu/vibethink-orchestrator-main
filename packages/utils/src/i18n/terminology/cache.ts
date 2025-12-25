/**
 * Cache simple en memoria para terminology
 * 
 * CAPA 2: Terminology Cache
 */
export const terminologyCache = new Map<string, string>();

export function clearTerminologyCache(): void {
  terminologyCache.clear();
}

export function getCacheStats() {
  return {
    size: terminologyCache.size,
    keys: Array.from(terminologyCache.keys()).slice(0, 10),
  };
}



