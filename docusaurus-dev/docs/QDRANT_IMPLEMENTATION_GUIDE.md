# Guía Completa de Implementación de Qdrant

**Versión:** 1.0  
**Fecha:** 2024-06-20  
**Estado:** Documentación Activa  
**Responsable:** Data Engineer + Backend Developer

## Tabla de Contenidos

1. [Selección de Modelos de Embeddings](#selección-de-modelos-de-embeddings)
2. [Preprocesamiento de Texto para Español](#preprocesamiento-de-texto-para-español)
3. [Cliente de Embeddings](#cliente-de-embeddings)
4. [Integración con Qdrant](#integración-con-qdrant)
5. [Casos de Uso Multi-Tenant](#casos-de-uso-multi-tenant)
6. [Mejores Prácticas](#mejores-prácticas)
7. [Testing y Monitoreo](#testing-y-monitoreo)
8. [Optimización y Performance](#optimización-y-performance)

---

## Selección de Modelos de Embeddings

### **Modelos Recomendados para Español**

#### **OpenAI (Recomendado para producción)**
```typescript
// text-embedding-ada-002 (multilingüe, 1536 dimensiones)
const OPENAI_MODEL = "text-embedding-ada-002";
const VECTOR_SIZE = 1536;

// text-embedding-3-small (nuevo, más rápido, 1536 dimensiones)
const OPENAI_MODEL_SMALL = "text-embedding-3-small";

// text-embedding-3-large (máxima precisión, 3072 dimensiones)
const OPENAI_MODEL_LARGE = "text-embedding-3-large";
```

#### **Cohere (Excelente para español)**
```typescript
// embed-multilingual-v3.0 (especializado en multilingüe)
const COHERE_MODEL = "embed-multilingual-v3.0";
const VECTOR_SIZE = 1024;

// embed-english-v3.0 (si solo usas inglés)
const COHERE_MODEL_EN = "embed-english-v3.0";
```

#### **Hugging Face (Open source)**
```typescript
// sentence-transformers/all-MiniLM-L6-v2 (multilingüe)
const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const VECTOR_SIZE = 384;

// sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
const HF_MODEL_MULTI = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";
const VECTOR_SIZE = 384;
```

---

## Preprocesamiento de Texto para Español

### **Función de Preprocesamiento**
```typescript
// utils/textPreprocessor.ts
import { normalize } from 'normalize-unicode';

export class SpanishTextPreprocessor {
  
  /**
   * Preprocesa texto en español para embeddings
   * @param text - Texto original
   * @param options - Opciones de preprocesamiento
   * @returns Texto preprocesado
   */
  static preprocess(
    text: string, 
    options: {
      removeAccents?: boolean;
      lowercase?: boolean;
      removeSpecialChars?: boolean;
      normalizeUnicode?: boolean;
      maxLength?: number;
    } = {}
  ): string {
    const {
      removeAccents = false,
      lowercase = true,
      removeSpecialChars = true,
      normalizeUnicode = true,
      maxLength = 8192 // OpenAI limit
    } = options;

    let processedText = text;

    // 1. Normalizar Unicode (ñ, tildes, etc.)
    if (normalizeUnicode) {
      processedText = normalize(processedText, 'NFC');
    }

    // 2. Remover acentos si se solicita
    if (removeAccents) {
      processedText = this.removeAccents(processedText);
    }

    // 3. Convertir a minúsculas
    if (lowercase) {
      processedText = processedText.toLowerCase();
    }

    // 4. Limpiar caracteres especiales
    if (removeSpecialChars) {
      processedText = this.cleanSpecialCharacters(processedText);
    }

    // 5. Limitar longitud
    if (maxLength && processedText.length > maxLength) {
      processedText = processedText.substring(0, maxLength);
    }

    return processedText.trim();
  }

  /**
   * Remueve acentos preservando la ñ
   */
  private static removeAccents(text: string): string {
    const accentMap: Record<string, string> = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
      'ü': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
    };

    return text.replace(/[áéíóúüÁÉÍÓÚ]/g, (match) => accentMap[match] || match);
  }

  /**
   * Limpia caracteres especiales preservando estructura
   */
  private static cleanSpecialCharacters(text: string): string {
    return text
      // Preservar espacios, puntos, comas, números, letras y ñ
      .replace(/[^a-z0-9ñáéíóúüÁÉÍÓÚ\s.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]/g, ' ')
      // Normalizar espacios múltiples
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Tokeniza texto para análisis
   */
  static tokenize(text: string): string[] {
    return text
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  /**
   * Calcula densidad de información del texto
   */
  static calculateInformationDensity(text: string): number {
    const tokens = this.tokenize(text);
    const uniqueTokens = new Set(tokens);
    return uniqueTokens.size / tokens.length;
  }
}
```

---

## Cliente de Embeddings

### **Cliente OpenAI**
```typescript
// services/embeddings/openaiEmbeddings.ts
import OpenAI from 'openai';
import { SpanishTextPreprocessor } from '../../utils/textPreprocessor';

export class OpenAIEmbeddingsService {
  private client: OpenAI;
  private model: string;
  private vectorSize: number;

  constructor(apiKey: string, model: string = 'text-embedding-ada-002') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.vectorSize = model.includes('3-large') ? 3072 : 1536;
  }

  /**
   * Genera embedding para un texto
   */
  async generateEmbedding(
    text: string,
    options: {
      preprocess?: boolean;
      preprocessOptions?: any;
    } = {}
  ): Promise<number[]> {
    try {
      // Preprocesar texto si se solicita
      let processedText = text;
      if (options.preprocess !== false) {
        processedText = SpanishTextPreprocessor.preprocess(
          text,
          options.preprocessOptions
        );
      }

      // Validar que el texto no esté vacío
      if (!processedText.trim()) {
        throw new Error('Texto vacío después del preprocesamiento');
      }

      // Generar embedding
      const response = await this.client.embeddings.create({
        model: this.model,
        input: processedText,
        encoding_format: 'float'
      });

      const embedding = response.data[0].embedding;

      // Validar dimensiones
      if (embedding.length !== this.vectorSize) {
        throw new Error(
          `Dimensiones incorrectas: esperado ${this.vectorSize}, obtenido ${embedding.length}`
        );
      }

      return embedding;
    } catch (error) {
      console.error('Error generando embedding:', error);
      throw error;
    }
  }

  /**
   * Genera embeddings en batch
   */
  async generateEmbeddingsBatch(
    texts: string[],
    options: {
      preprocess?: boolean;
      preprocessOptions?: any;
      batchSize?: number;
    } = {}
  ): Promise<number[][]> {
    const { batchSize = 100 } = options;
    const embeddings: number[][] = [];

    // Procesar en batches para evitar rate limits
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      // Preprocesar batch
      const processedBatch = batch.map(text => 
        options.preprocess !== false 
          ? SpanishTextPreprocessor.preprocess(text, options.preprocessOptions)
          : text
      );

      // Generar embeddings para el batch
      const response = await this.client.embeddings.create({
        model: this.model,
        input: processedBatch,
        encoding_format: 'float'
      });

      embeddings.push(...response.data.map(item => item.embedding));
    }

    return embeddings;
  }

  /**
   * Calcula similitud entre dos embeddings
   */
  static calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Los embeddings deben tener la misma dimensión');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
```

### **Cliente Cohere**
```typescript
// services/embeddings/cohereEmbeddings.ts
import Cohere from 'cohere-ai';
import { SpanishTextPreprocessor } from '../../utils/textPreprocessor';

export class CohereEmbeddingsService {
  private model: string;
  private vectorSize: number;

  constructor(apiKey: string, model: string = 'embed-multilingual-v3.0') {
    Cohere.init(apiKey);
    this.model = model;
    this.vectorSize = 1024;
  }

  async generateEmbedding(
    text: string,
    options: {
      preprocess?: boolean;
      preprocessOptions?: any;
    } = {}
  ): Promise<number[]> {
    try {
      let processedText = text;
      if (options.preprocess !== false) {
        processedText = SpanishTextPreprocessor.preprocess(
          text,
          options.preprocessOptions
        );
      }

      const response = await Cohere.embed({
        texts: [processedText],
        model: this.model,
        inputType: 'search_document'
      });

      return response.embeddings[0];
    } catch (error) {
      console.error('Error generando embedding con Cohere:', error);
      throw error;
    }
  }
}
```

---

## Integración con Qdrant

### **Cliente Qdrant con Embeddings**
```typescript
// services/qdrant/qdrantService.ts
import { QdrantClient } from '@qdrant/js-client-rest';
import { OpenAIEmbeddingsService } from '../embeddings/openaiEmbeddings';

export class QdrantService {
  private client: QdrantClient;
  private embeddingsService: OpenAIEmbeddingsService;

  constructor(
    qdrantUrl: string,
    openaiApiKey: string,
    embeddingsModel: string = 'text-embedding-ada-002'
  ) {
    this.client = new QdrantClient({ url: qdrantUrl });
    this.embeddingsService = new OpenAIEmbeddingsService(openaiApiKey, embeddingsModel);
  }

  /**
   * Crea una colección para clientes
   */
  async createCustomersCollection(collectionName: string = 'customers'): Promise<void> {
    const vectorSize = this.embeddingsService.vectorSize;

    await this.client.createCollection(collectionName, {
      vectors: {
        size: vectorSize,
        distance: 'Cosine'
      },
      optimizers_config: {
        default_segment_number: 2
      },
      replication_factor: 1,
      write_consistency_factor: 1,
      on_disk_payload: true
    });

    console.log(`Colección ${collectionName} creada con ${vectorSize} dimensiones`);
  }

  /**
   * Indexa un cliente con embedding
   */
  async indexCustomer(customerData: {
    id: string;
    company_id: string;
    name: string;
    email: string;
    description?: string;
    department_access: Record<string, boolean>;
    customer_data: Record<string, any>;
    metadata: Record<string, any>;
  }): Promise<void> {
    try {
      // Generar embedding del cliente
      const textForEmbedding = this.buildCustomerText(customerData);
      const embedding = await this.embeddingsService.generateEmbedding(textForEmbedding);

      // Preparar payload
      const payload = {
        company_id: customerData.company_id,
        customer_id: customerData.id,
        name: customerData.name,
        email: customerData.email,
        department_access: customerData.department_access,
        customer_data: customerData.customer_data,
        metadata: customerData.metadata,
        text_for_embedding: textForEmbedding // Para debugging
      };

      // Insertar en Qdrant
      await this.client.upsert('customers', {
        points: [{
          id: customerData.id,
          vector: embedding,
          payload
        }]
      });

      console.log(`Cliente ${customerData.id} indexado exitosamente`);
    } catch (error) {
      console.error(`Error indexando cliente ${customerData.id}:`, error);
      throw error;
    }
  }

  /**
   * Construye texto para embedding del cliente
   */
  private buildCustomerText(customerData: any): string {
    const parts = [
      customerData.name,
      customerData.email,
      customerData.description || '',
      `Cliente ${customerData.customer_data.segment || 'estándar'}`,
      `Gasto total: ${customerData.customer_data.total_spent || 0}`,
      `Tickets de soporte: ${customerData.customer_data.support_tickets || 0}`,
      `Quejas: ${customerData.customer_data.complaints || 0}`,
      `Score de satisfacción: ${customerData.customer_data.satisfaction_score || 0}`
    ];

    return parts.filter(part => part).join(' ');
  }

  /**
   * Búsqueda semántica de clientes
   */
  async searchCustomers(
    query: string,
    companyId: string,
    options: {
      limit?: number;
      department?: string;
      filters?: Record<string, any>;
    } = {}
  ): Promise<any[]> {
    try {
      // Generar embedding de la consulta
      const queryEmbedding = await this.embeddingsService.generateEmbedding(query);

      // Construir filtros
      const filter: any = {
        must: [
          { key: 'company_id', match: { value: companyId } }
        ]
      };

      // Agregar filtro de departamento si se especifica
      if (options.department) {
        filter.must.push({
          key: `department_access.${options.department}`,
          match: { value: true }
        });
      }

      // Agregar filtros adicionales
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (typeof value === 'object' && value.range) {
            filter.must.push({ key, range: value.range });
          } else {
            filter.must.push({ key, match: { value } });
          }
        });
      }

      // Realizar búsqueda
      const response = await this.client.search('customers', {
        vector: queryEmbedding,
        filter,
        limit: options.limit || 10,
        with_payload: true,
        with_vectors: false
      });

      return response.map(point => ({
        id: point.id,
        score: point.score,
        payload: point.payload
      }));
    } catch (error) {
      console.error('Error en búsqueda de clientes:', error);
      throw error;
    }
  }
}
```

---

## Casos de Uso Multi-Tenant

### **Ejemplo de Indexación de Cliente**
```typescript
// Ejemplo de uso
const qdrantService = new QdrantService(
  'http://localhost:6333',
  process.env.OPENAI_API_KEY
);

// Indexar un cliente
await qdrantService.indexCustomer({
  id: 'customer_123',
  company_id: 'company_456',
  name: 'María González',
  email: 'maria.gonzalez@empresa.com',
  description: 'Cliente premium del sector financiero',
  department_access: {
    billing: true,
    support: true,
    sales: true,
    complaints: false
  },
  customer_data: {
    total_spent: 75000,
    support_tickets: 3,
    complaints: 1,
    satisfaction_score: 4.2,
    segment: 'premium'
  },
  metadata: {
    created_at: '2024-01-15',
    last_interaction: '2024-01-20',
    industry: 'financiero'
  }
});
```

### **Búsqueda Semántica**
```typescript
// Buscar clientes inconformes que gastan mucho
const results = await qdrantService.searchCustomers(
  'cliente que gasta mucho dinero pero está inconforme con el servicio',
  'company_456',
  {
    limit: 5,
    department: 'executive',
    filters: {
      'customer_data.total_spent': { range: { gte: 50000 } },
      'customer_data.satisfaction_score': { range: { lte: 3 } }
    }
  }
);

console.log('Clientes encontrados:', results);
```

---

## Mejores Prácticas

### **Optimización de Embeddings**
```typescript
// utils/embeddingOptimizer.ts
export class EmbeddingOptimizer {
  
  /**
   * Valida calidad del embedding
   */
  static validateEmbedding(embedding: number[]): boolean {
    // Verificar que no sea todo ceros
    const allZeros = embedding.every(val => val === 0);
    if (allZeros) return false;

    // Verificar que no sea todo el mismo valor
    const firstValue = embedding[0];
    const allSame = embedding.every(val => val === firstValue);
    if (allSame) return false;

    // Verificar rango de valores
    const min = Math.min(...embedding);
    const max = Math.max(...embedding);
    if (max - min < 0.01) return false;

    return true;
  }

  /**
   * Normaliza embedding si es necesario
   */
  static normalizeEmbedding(embedding: number[]): number[] {
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return embedding;
    
    return embedding.map(val => val / magnitude);
  }

  /**
   * Calcula calidad del embedding
   */
  static calculateQuality(embedding: number[]): number {
    const variance = this.calculateVariance(embedding);
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    
    return variance * magnitude;
  }

  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }
}
```

### **Monitoreo y Logging**
```typescript
// services/monitoring/embeddingMonitor.ts
export class EmbeddingMonitor {
  
  static logEmbeddingGeneration(
    text: string,
    embedding: number[],
    model: string,
    duration: number
  ): void {
    const quality = EmbeddingOptimizer.calculateQuality(embedding);
    const textLength = text.length;
    
    console.log({
      event: 'embedding_generated',
      model,
      text_length: textLength,
      embedding_quality: quality,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    });
  }

  static logSearchQuery(
    query: string,
    results: any[],
    companyId: string,
    duration: number
  ): void {
    console.log({
      event: 'search_executed',
      query_length: query.length,
      results_count: results.length,
      company_id: companyId,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    });
  }
}
```

---

## Testing y Monitoreo

### **Tests Unitarios**
```typescript
// tests/embeddings.test.ts
import { SpanishTextPreprocessor } from '../utils/textPreprocessor';
import { OpenAIEmbeddingsService } from '../services/embeddings/openaiEmbeddings';

describe('Embeddings Tests', () => {
  test('Preprocesamiento de texto español', () => {
    const text = 'Cliente María González con facturación de $50,000';
    const processed = SpanishTextPreprocessor.preprocess(text);
    
    expect(processed).toContain('maria');
    expect(processed).toContain('gonzalez');
    expect(processed).toContain('50000');
  });

  test('Generación de embedding', async () => {
    const service = new OpenAIEmbeddingsService(process.env.OPENAI_API_KEY!);
    const embedding = await service.generateEmbedding('Cliente premium');
    
    expect(embedding).toHaveLength(1536);
    expect(EmbeddingOptimizer.validateEmbedding(embedding)).toBe(true);
  });

  test('Similitud entre embeddings similares', async () => {
    const service = new OpenAIEmbeddingsService(process.env.OPENAI_API_KEY!);
    
    const embedding1 = await service.generateEmbedding('Cliente premium');
    const embedding2 = await service.generateEmbedding('Cliente VIP');
    const embedding3 = await service.generateEmbedding('Producto defectuoso');
    
    const similarity12 = OpenAIEmbeddingsService.calculateCosineSimilarity(embedding1, embedding2);
    const similarity13 = OpenAIEmbeddingsService.calculateCosineSimilarity(embedding1, embedding3);
    
    expect(similarity12).toBeGreaterThan(similarity13);
  });
});
```

---

## Optimización y Performance

### **Configuración de Qdrant**
```yaml
# docker-compose.yml
version: '3.8'
services:
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_storage:/qdrant/storage
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333
      - QDRANT__SERVICE__GRPC_PORT=6334
      - QDRANT__STORAGE__STORAGE_PATH=/qdrant/storage
      - QDRANT__LOG_LEVEL=INFO
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
    restart: unless-stopped

volumes:
  qdrant_storage:
```

### **Optimización de Consultas**
```typescript
// services/qdrant/optimizedQueries.ts
export class OptimizedQueries {
  
  /**
   * Búsqueda optimizada con paginación
   */
  static async searchWithPagination(
    qdrantService: QdrantService,
    query: string,
    companyId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    results: any[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const offset = (page - 1) * pageSize;
    
    const results = await qdrantService.searchCustomers(
      query,
      companyId,
      {
        limit: pageSize,
        offset
      }
    );
    
    // Obtener total (esto requeriría una consulta adicional)
    const total = await this.getTotalCount(qdrantService, companyId);
    
    return {
      results,
      total,
      page,
      pageSize
    };
  }
  
  /**
   * Búsqueda con cache
   */
  static async searchWithCache(
    qdrantService: QdrantService,
    query: string,
    companyId: string,
    cacheKey: string,
    ttl: number = 300 // 5 minutos
  ): Promise<any[]> {
    // Implementar cache con Redis
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const results = await qdrantService.searchCustomers(query, companyId);
    
    // Guardar en cache
    await redis.setex(cacheKey, ttl, JSON.stringify(results));
    
    return results;
  }
}
```

---

## Conclusión

Esta guía proporciona una implementación completa y robusta de Qdrant para el stack multi-tenant, incluyendo:

1. **Preprocesamiento específico para español**
2. **Modelos multilingües recomendados**
3. **Integración completa con Qdrant**
4. **Casos de uso multi-tenant**
5. **Testing y monitoreo**
6. **Optimización de performance**

**Próximos pasos:**
1. Implementar los servicios de embeddings
2. Configurar Qdrant en Docker
3. Crear las colecciones iniciales
4. Implementar los casos de uso multi-tenant
5. Configurar monitoreo y alertas

---

**Documentación Relacionada:**
- [Open Source Components Evaluation](./OPEN_SOURCE_COMPONENTS_EVALUATION.md)
- [Authentication Migration Plan](./AUTHENTICATION_MIGRATION_PLAN.md)
- [CRM Web Scraping Architecture](./CRM_WEB_SCRAPING_ARCHITECTURE.md) 