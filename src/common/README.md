# Patrones y Configuraciones Comunes (`common/`)

## 🎯 **Propósito**

Esta carpeta contiene los **patrones de diseño, configuraciones y middleware común** que se utilizan en todo el sistema VibeThink Orchestrator.

## 📁 **Estructura**

```
common/
├── patterns/           # Patrones de diseño
├── config/             # Configuraciones
└── middleware/         # Middleware común
```

## 🎨 **Patrones de Diseño (`patterns/`)**

### **Propósito:**
Implementaciones de patrones de diseño reutilizables.

### **Patrones Incluidos:**

#### **Factory Pattern**
```typescript
// ✅ Factory para creación de componentes
export class ComponentFactory {
  static createComponent(type: string, props: any) {
    switch (type) {
      case 'button':
        return new ButtonComponent(props);
      case 'card':
        return new CardComponent(props);
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
  }
}
```

#### **Observer Pattern**
```typescript
// ✅ Observer para eventos del sistema
export class EventObserver {
  private observers: Map<string, Function[]> = new Map();
  
  subscribe(event: string, callback: Function) {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event)!.push(callback);
  }
  
  notify(event: string, data: any) {
    const callbacks = this.observers.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}
```

#### **Strategy Pattern**
```typescript
// ✅ Strategy para diferentes algoritmos
export interface PaymentStrategy {
  processPayment(amount: number): Promise<boolean>;
}

export class CreditCardStrategy implements PaymentStrategy {
  async processPayment(amount: number): Promise<boolean> {
    // Implementación de pago con tarjeta
    return true;
  }
}

export class PayPalStrategy implements PaymentStrategy {
  async processPayment(amount: number): Promise<boolean> {
    // Implementación de pago con PayPal
    return true;
  }
}
```

#### **Decorator Pattern**
```typescript
// ✅ Decorator para funcionalidades adicionales
export function withLogging<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    console.log(`Calling ${fn.name} with args:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}
```

### **Estructura:**
```
patterns/
├── factory/            # Factory patterns
├── observer/           # Observer patterns
├── strategy/           # Strategy patterns
├── decorator/          # Decorator patterns
├── singleton/          # Singleton patterns
├── adapter/            # Adapter patterns
├── facade/             # Facade patterns
├── proxy/              # Proxy patterns
├── command/            # Command patterns
└── state/              # State patterns
```

## ⚙️ **Configuraciones (`config/`)**

### **Propósito:**
Configuraciones centralizadas del sistema.

### **Configuraciones Principales:**

#### **Environment Configuration**
```typescript
// ✅ Configuración de entorno
export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL,
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
    ssl: process.env.NODE_ENV === 'production'
  },
  
  // API
  api: {
    baseUrl: process.env.API_BASE_URL,
    timeout: parseInt(process.env.API_TIMEOUT || '5000'),
    retries: parseInt(process.env.API_RETRIES || '3')
  },
  
  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600')
  },
  
  // AI Services
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4'
    },
    firecrawl: {
      apiKey: process.env.FIRECRAWL_API_KEY
    },
    knotie: {
      apiKey: process.env.KNOTIE_API_KEY
    }
  },
  
  // Workflow
  workflow: {
    kestra: {
      url: process.env.KESTRA_URL,
      apiKey: process.env.KESTRA_API_KEY
    },
    tracardi: {
      url: process.env.TRACARDI_URL,
      apiKey: process.env.TRACARDI_API_KEY
    }
  }
};
```

#### **Feature Flags**
```typescript
// ✅ Feature flags para funcionalidades
export const featureFlags = {
  // AI Features
  aiChat: process.env.FEATURE_AI_CHAT === 'true',
  universalAssistant: process.env.FEATURE_UNIVERSAL_ASSISTANT === 'true',
  aiOrchestration: process.env.FEATURE_AI_ORCHESTRATION === 'true',
  
  // Workflow Features
  workflowEngine: process.env.FEATURE_WORKFLOW_ENGINE === 'true',
  kestraIntegration: process.env.FEATURE_KESTRA === 'true',
  
  // UI Features
  darkMode: process.env.FEATURE_DARK_MODE === 'true',
  advancedThemes: process.env.FEATURE_ADVANCED_THEMES === 'true',
  
  // Security Features
  mfa: process.env.FEATURE_MFA === 'true',
  auditLogging: process.env.FEATURE_AUDIT_LOGGING === 'true'
};
```

#### **Company Configuration**
```typescript
// ✅ Configuración por empresa
export interface CompanyConfig {
  id: string;
  name: string;
  plan: 'basic' | 'pro' | 'enterprise';
  features: string[];
  limits: {
    users: number;
    storage: number;
    apiCalls: number;
    workflows: number;
  };
  branding: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
    theme: 'light' | 'dark' | 'auto';
  };
}
```

### **Estructura:**
```
config/
├── environment.ts       # Configuración de entorno
├── features.ts          # Feature flags
├── company.ts           # Configuración por empresa
├── security.ts          # Configuración de seguridad
├── database.ts          # Configuración de base de datos
├── api.ts              # Configuración de APIs
├── ai.ts               # Configuración de IA
├── workflow.ts          # Configuración de workflows
├── ui.ts               # Configuración de UI
└── validation.ts        # Validación de configuración
```

## 🔧 **Middleware Común (`middleware/`)**

### **Propósito:**
Middleware reutilizable para diferentes partes del sistema.

### **Middleware Principales:**

#### **Authentication Middleware**
```typescript
// ✅ Middleware de autenticación
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, config.security.jwtSecret);
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

#### **Multi-tenant Middleware**
```typescript
// ✅ Middleware multi-tenant
export const multiTenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.headers['x-company-id'] as string;
    
    if (!companyId) {
      return res.status(400).json({ error: 'Company ID required' });
    }
    
    // Validar que el usuario pertenece a la empresa
    if (req.user.company_id !== companyId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    req.companyId = companyId;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Multi-tenant error' });
  }
};
```

#### **Rate Limiting Middleware**
```typescript
// ✅ Middleware de rate limiting
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
```

#### **Logging Middleware**
```typescript
// ✅ Middleware de logging
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      user: req.user?.id,
      company: req.companyId
    });
  });
  
  next();
};
```

#### **Error Handling Middleware**
```typescript
// ✅ Middleware de manejo de errores
export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id,
    company: req.companyId
  });
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};
```

### **Estructura:**
```
middleware/
├── auth.ts             # Middleware de autenticación
├── multi-tenant.ts     # Middleware multi-tenant
├── rate-limit.ts       # Middleware de rate limiting
├── logging.ts          # Middleware de logging
├── error-handler.ts    # Middleware de manejo de errores
├── validation.ts       # Middleware de validación
├── compression.ts      # Middleware de compresión
├── cors.ts            # Middleware de CORS
├── security.ts        # Middleware de seguridad
└── performance.ts     # Middleware de performance
```

## 🧪 **Testing Strategy**

### **Patrones de Testing:**
```typescript
// ✅ Test de patrones
describe('Factory Pattern', () => {
  it('should create correct component type', () => {
    const button = ComponentFactory.createComponent('button', {});
    expect(button).toBeInstanceOf(ButtonComponent);
  });
});

// ✅ Test de middleware
describe('Auth Middleware', () => {
  it('should validate token correctly', async () => {
    const req = mockRequest({ headers: { authorization: 'Bearer valid-token' } });
    const res = mockResponse();
    const next = jest.fn();
    
    await authMiddleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });
});
```

## 📊 **Métricas de Calidad**

### **Patrones:**
- **Reutilización**: >80% de patrones reutilizados
- **Performance**: <10ms overhead por patrón
- **Testing**: >95% coverage

### **Configuraciones:**
- **Validación**: 100% de configuraciones validadas
- **Type safety**: 100% TypeScript coverage
- **Documentación**: 100% documentado

### **Middleware:**
- **Performance**: <5ms overhead por middleware
- **Security**: 100% validación de seguridad
- **Error handling**: 100% errores manejados

---

**Los patrones y configuraciones comunes siguen los principios de VThink 1.0, asegurando reutilización, seguridad y mantenibilidad.** 