# Sistema de Prevención de Hardcoding - Guía de Uso

## 🚨 **Regla de Oro: Cero Hardcoding**

> **"Nunca uses valores específicos hardcodeados. Todo debe ser paramétrico, configurable y universal."**

## 📋 **Resumen Rápido**

### **¿Qué detecta el sistema?**
- **Credenciales hardcodeadas** (CRÍTICO - bloquea commit)
- **URLs y endpoints hardcodeados** (ALTO - alerta inmediata)
- **Entidades específicas** (MEDIO - advertencia)
- **Configuraciones hardcodeadas** (MEDIO - advertencia)
- **Textos hardcodeados** (BAJO - sugerencia)

### **¿Cómo funciona?**
1. **Detección automática** durante desarrollo
2. **Pre-commit hooks** que bloquean violaciones críticas
3. **CI/CD pipeline** que verifica en cada PR
4. **Notificaciones automáticas** al arquitecto

## 🛠️ **Uso Rápido**

### **Verificar hardcoding manualmente:**
```bash
# Verificar solo src/
npm run check-hardcoding

# Verificar todo el proyecto
npm run check-hardcoding-all
```

### **Verificar antes de commit:**
```bash
# El pre-commit hook se ejecuta automáticamente
git add .
git commit -m "Mi cambio"
# Si hay violaciones críticas, el commit será bloqueado
```

### **Verificar en CI/CD:**
- Se ejecuta automáticamente en cada PR
- Comenta violaciones en GitHub
- Bloquea merge si hay violaciones críticas

## 📊 **Categorías de Violaciones**

### **🚨 CRÍTICO (Bloquea Commit)**
```typescript
// ❌ MAL - Credenciales hardcodeadas
const API_KEY = "sk-1234567890abcdef";
const PASSWORD = "admin123";
const SECRET_TOKEN = "secret123";

// ✅ BIEN - Variables de entorno
const API_KEY = process.env.REACT_APP_API_KEY;
const PASSWORD = process.env.REACT_APP_PASSWORD;
const SECRET_TOKEN = process.env.REACT_APP_SECRET_TOKEN;
```

### **⚠️ ALTO (Alerta Inmediata)**
```typescript
// ❌ MAL - URLs hardcodeadas
const API_URL = "https://api.example.com/v1";
const LOGIN_ENDPOINT = "https://auth.example.com/login";

// ✅ BIEN - Variables de entorno
const API_URL = process.env.REACT_APP_API_URL;
const LOGIN_ENDPOINT = `${process.env.REACT_APP_AUTH_URL}/login`;
```

### **📝 MEDIO (Advertencia)**
```typescript
// ❌ MAL - Entidades específicas
const colombia = "CO";
const fedex = "fedex";
const admin = "admin";

// ✅ BIEN - Paramétrico
const currentCountry = getCountryCode();
const currentProvider = getProviderCode();
const currentRole = getCurrentRole();
```

### **💡 BAJO (Sugerencia)**
```typescript
// ❌ MAL - Textos hardcodeados
const message = "El email no es válido";

// ✅ BIEN - Internacionalización
const message = t('errors.invalid_email');
```

## 🔧 **Configuración**

### **1. Variables de Entorno**
Crea un archivo `.env.local`:
```bash
# Credenciales
REACT_APP_API_KEY=tu_api_key_aqui
REACT_APP_PASSWORD=tu_password_aqui
REACT_APP_SECRET_TOKEN=tu_token_aqui

# URLs
REACT_APP_API_URL=https://api.example.com/v1
REACT_APP_AUTH_URL=https://auth.example.com

# Configuraciones
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=info
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_MAX_UPLOADS=10
REACT_APP_SESSION_TIMEOUT=3600000

# País/Industria
REACT_APP_COUNTRY_CODE=CO
REACT_APP_INDUSTRY_TYPE=healthcare
```

### **2. ESLint Configuration**
En `.eslintrc.js`:
```javascript
module.exports = {
  plugins: ['ai-pair-parametric'],
  extends: [
    // ... otras configuraciones
    'plugin:ai-pair-parametric/recommended'
  ],
  rules: {
    // Reglas específicas si necesitas personalizar
    'ai-pair-parametric/no-hardcoded-credentials': 'error',
    'ai-pair-parametric/no-hardcoded-urls': 'warn'
  }
};
```

### **3. Pre-commit Hook**
El hook ya está configurado en `.husky/pre-commit`:
```bash
#!/bin/sh
# Se ejecuta automáticamente antes de cada commit
npm run check-hardcoding && npm run lint
```

## 📝 **Proceso de Corrección**

### **Paso 1: Identificar la Violación**
```bash
npm run check-hardcoding
```

### **Paso 2: Clasificar la Criticidad**
- **CRÍTICA**: Bloquea commit - Corregir inmediatamente
- **ALTA**: Alerta - Corregir en esta iteración
- **MEDIA**: Advertencia - Considerar corrección
- **BAJA**: Sugerencia - Mejora futura

### **Paso 3: Aplicar la Corrección**
```typescript
// ANTES (violación)
const API_KEY = "sk-123...";

// DESPUÉS (corrección)
const API_KEY = process.env.REACT_APP_API_KEY;
```

### **Paso 4: Validar la Corrección**
```bash
npm run check-hardcoding
npm run lint
npm run type-check
```

## 🚨 **Qué Hacer en Casos Especiales**

### **Si necesitas un valor específico temporalmente:**
1. **Documenta** la justificación en el código
2. **Crea un ticket** de refactoring
3. **Usa comentarios** para explicar la limitación
4. **Planifica** la migración futura

```typescript
// TEMPORAL: Necesario para demo específica
// TODO: Migrar a configuración paramétrica en v2.1
// Ticket: REFACTOR-123
const TEMP_VALUE = "specific_value";
```

### **Si el sistema bloquea tu commit:**
1. **Lee** el mensaje de error detallado
2. **Identifica** el valor hardcodeado
3. **Aplica** la corrección sugerida
4. **Valida** que la funcionalidad funciona
5. **Intenta** el commit nuevamente

### **Si necesitas ayuda:**
- **Revisa** la [documentación completa](./HARDCODING_PREVENTION_SYSTEM.md)
- **Consulta** la [FAQ](./FAQ_PATTERNS_AI_PAIR.md)
- **Contacta** al arquitecto para violaciones críticas

## 📊 **Métricas y Reportes**

### **Reporte Automático**
El sistema genera un reporte en `hardcoding-report.json`:
```json
{
  "summary": {
    "critical": 0,
    "high": 2,
    "medium": 5,
    "low": 3,
    "total": 10
  },
  "violations": {
    "critical": [],
    "high": [...],
    "medium": [...],
    "low": [...]
  },
  "recommendations": [...]
}
```

### **Métricas de Éxito**
- **Violaciones críticas**: 0 (objetivo)
- **Violaciones altas**: < 5 por sprint
- **Tiempo de corrección**: < 1 hora
- **Prevención**: > 90% de violaciones prevenidas

## 🔍 **Herramientas Disponibles**

### **Scripts de NPM**
```bash
# Detección básica
npm run check-hardcoding

# Detección completa
npm run check-hardcoding-all

# Pre-commit (automático)
npm run pre-commit
```

### **Herramientas de Desarrollo**
- **ESLint Plugin**: Detección en tiempo real
- **Pre-commit Hook**: Bloqueo automático
- **CI/CD Pipeline**: Verificación en PRs
- **Notificaciones**: Alertas al arquitecto

### **Archivos de Configuración**
- `.eslintrc.js`: Configuración de ESLint
- `.husky/pre-commit`: Hook de pre-commit
- `.github/workflows/hardcoding-check.yml`: CI/CD
- `scripts/check-hardcoding.js`: Script principal

## 📚 **Documentación Relacionada**

- **[Sistema Completo](./HARDCODING_PREVENTION_SYSTEM.md)**: Documentación detallada
- **[FAQ](./FAQ_PATTERNS_AI_PAIR.md)**: Preguntas frecuentes
- **[Ejemplos](./examples/hardcoding-violations-example.ts)**: Ejemplos de violaciones
- **[Regla Universal](./UNIVERSAL_DEVELOPMENT_RULE.md)**: Principio fundamental

## 🎯 **Beneficios del Sistema**

### **Seguridad**
- **Cero credenciales** en código
- **Prevención de leaks** automática
- **Auditoría** continua de seguridad

### **Calidad**
- **Código universal** y mantenible
- **Configuración paramétrica** automática
- **Consistencia** en todo el proyecto

### **Escalabilidad**
- **Funciona en cualquier contexto** sin cambios
- **Configuración dinámica** por país/industria
- **Extensibilidad** sin límites específicos

## 🚀 **Próximos Pasos**

1. **Implementa** el sistema en tu proyecto
2. **Configura** las variables de entorno
3. **Migra** código existente gradualmente
4. **Monitorea** las métricas de éxito
5. **Optimiza** basado en feedback

---

**Recuerda: La universalidad y parametrización son fundamentales para el éxito de AI Pair Orchestrator Pro.** 