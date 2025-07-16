# Sistema de Prevención y Detección de Hardcoding - AI Pair Orchestrator Pro

## Resumen Ejecutivo

El **Sistema de Prevención y Detección de Hardcoding** es un mecanismo integral que previene, detecta y corrige violaciones de hardcoding en tiempo real, asegurando que todo el código siga los principios de universalidad y parametrización de AI Pair.

## 🚨 **Regla de Oro: Cero Hardcoding**

### **Principio Fundamental**
> **"Nunca uses valores específicos hardcodeados. Todo debe ser paramétrico, configurable y universal."**

### **Criterios de Violación**
1. **Cualquier valor específico** que limite la universalidad
2. **Configuraciones hardcodeadas** que no sean paramétricas
3. **Lógica específica** que no sea extensible
4. **Datos hardcodeados** que no sean configurables

## 📋 **Categorías de Violaciones Detectadas**

### **1. Seguridad (CRÍTICA - BLOQUEA COMMIT)**

#### **A. Credenciales Hardcodeadas**
```typescript
// ❌ VIOLACIÓN CRÍTICA - BLOQUEA COMMIT
const API_KEY = "sk-1234567890abcdef";
const PASSWORD = "admin123";
const SECRET_TOKEN = "secret123";

// ✅ SOLUCIÓN OBLIGATORIA
const API_KEY = process.env.REACT_APP_API_KEY;
const PASSWORD = process.env.REACT_APP_PASSWORD;
const SECRET_TOKEN = process.env.REACT_APP_SECRET_TOKEN;
```

#### **B. URLs y Endpoints Hardcodeados**
```typescript
// ❌ VIOLACIÓN CRÍTICA - BLOQUEA COMMIT
const API_URL = "https://api.example.com/v1";
const LOGIN_ENDPOINT = "https://auth.example.com/login";

// ✅ SOLUCIÓN OBLIGATORIA
const API_URL = process.env.REACT_APP_API_URL;
const LOGIN_ENDPOINT = `${process.env.REACT_APP_AUTH_URL}/login`;
```

### **2. Configuración (ALTA - ALERTA INMEDIATA)**

#### **A. Configuraciones de Entorno**
```typescript
// ❌ VIOLACIÓN ALTA
const IS_PRODUCTION = true;
const DEBUG_MODE = false;
const LOG_LEVEL = "info";

// ✅ SOLUCIÓN PARAMÉTRICA
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DEBUG_MODE = process.env.REACT_APP_DEBUG === 'true';
const LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL || 'info';
```

#### **B. Configuraciones de Base de Datos**
```typescript
// ❌ VIOLACIÓN ALTA
const dbConfig = {
  host: "localhost",
  port: 5432,
  database: "myapp"
};

// ✅ SOLUCIÓN PARAMÉTRICA
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'myapp'
};
```

### **3. Negocio (MEDIA - ADVERTENCIA)**

#### **A. Límites de Negocio Hardcodeados**
```typescript
// ❌ VIOLACIÓN MEDIA
const MAX_FILE_SIZE = 5242880; // 5MB
const MAX_UPLOADS = 10;
const SESSION_TIMEOUT = 3600000; // 1 hour

// ✅ SOLUCIÓN PARAMÉTRICA
const MAX_FILE_SIZE = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 5242880;
const MAX_UPLOADS = parseInt(process.env.REACT_APP_MAX_UPLOADS) || 10;
const SESSION_TIMEOUT = parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000;
```

#### **B. Entidades Específicas**
```typescript
// ❌ VIOLACIÓN MEDIA
const colombia = "CO";
const fedex = "fedex";
const admin = "admin";

// ✅ SOLUCIÓN PARAMÉTRICA
const currentCountry = getCountryCode();
const currentProvider = getProviderCode();
const currentRole = getCurrentRole();
```

### **4. Internacionalización (MEDIA - ADVERTENCIA)**

#### **A. Textos Hardcodeados**
```typescript
// ❌ VIOLACIÓN MEDIA
const ERROR_MESSAGES = {
  "invalid_email": "El email no es válido",
  "password_required": "La contraseña es requerida"
};

// ✅ SOLUCIÓN PARAMÉTRICA
const ERROR_MESSAGES = {
  "invalid_email": t('errors.invalid_email'),
  "password_required": t('errors.password_required')
};
```

### **5. Testing (BAJA - SUGERENCIA)**

#### **A. Datos de Prueba Hardcodeados**
```typescript
// ❌ VIOLACIÓN BAJA
const testUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};

// ✅ SOLUCIÓN PARAMÉTRICA
const testUser = {
  id: generateTestId(),
  name: generateTestName(),
  email: generateTestEmail()
};
```

## 🛠️ **Herramientas de Implementación**

### **1. ESLint Plugin Personalizado**

```javascript
// eslint-plugin-ai-pair-hardcoding
module.exports = {
  rules: {
    // Reglas críticas que bloquean commit
    'no-hardcoded-credentials': {
      create(context) {
        return {
          Literal(node) {
            const patterns = [
              /api[_-]?key\s*[:=]\s*["'][^"']+["']/gi,
              /password\s*[:=]\s*["'][^"']+["']/gi,
              /secret\s*[:=]\s*["'][^"']+["']/gi,
              /token\s*[:=]\s*["'][^"']+["']/gi
            ];
            
            if (patterns.some(pattern => pattern.test(node.raw))) {
              context.report({
                node,
                message: 'CRÍTICO: Credenciales hardcodeadas detectadas. Usa variables de entorno.',
                severity: 2 // Error - bloquea commit
              });
            }
          }
        };
      }
    },

    'no-hardcoded-urls': {
      create(context) {
        return {
          Literal(node) {
            const urlPatterns = [
              /https?:\/\/[^\s"']+/g,
              /localhost:\d+/g
            ];
            
            if (urlPatterns.some(pattern => pattern.test(node.raw))) {
              context.report({
                node,
                message: 'ALTO: URLs hardcodeadas detectadas. Usa variables de entorno.',
                severity: 1 // Warning
              });
            }
          }
        };
      }
    },

    'no-specific-entities': {
      create(context) {
        const specificEntities = [
          'colombia', 'usa', 'mexico', 'spain',
          'fedex', 'dhl', 'ups', 'servientrega',
          'admin', 'manager', 'employee',
          'production', 'development', 'staging'
        ];
        
        return {
          Identifier(node) {
            if (specificEntities.includes(node.name.toLowerCase())) {
              context.report({
                node,
                message: `MEDIO: Entidad específica "${node.name}" detectada. Usa nombres paramétricos.`,
                severity: 1
              });
            }
          }
        };
      }
    }
  }
};
```

### **2. Pre-commit Hook**

```bash
#!/bin/sh
# .husky/pre-commit

echo "🔍 Verificando hardcoding..."

# Ejecutar detección de hardcoding
npm run check-hardcoding

# Si hay violaciones críticas, bloquear commit
if [ $? -ne 0 ]; then
  echo "❌ VIOLACIONES CRÍTICAS DETECTADAS - COMMIT BLOQUEADO"
  echo "📋 Revisa los errores y corrige antes de continuar"
  exit 1
fi

# Si hay violaciones altas, mostrar advertencia
if [ -f ".hardcoding-warnings" ]; then
  echo "⚠️  ADVERTENCIAS DE HARDCODING DETECTADAS"
  cat .hardcoding-warnings
  echo "💡 Considera corregir estas violaciones"
fi

echo "✅ Verificación de hardcoding completada"
```

### **3. Script de Detección**

```javascript
// scripts/check-hardcoding.js
const fs = require('fs');
const path = require('path');

class HardcodingDetector {
  constructor() {
    this.violations = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };
    
    this.patterns = {
      credentials: [
        /api[_-]?key\s*[:=]\s*["'][^"']+["']/gi,
        /password\s*[:=]\s*["'][^"']+["']/gi,
        /secret\s*[:=]\s*["'][^"']+["']/gi,
        /token\s*[:=]\s*["'][^"']+["']/gi
      ],
      urls: [
        /https?:\/\/[^\s"']+/g,
        /localhost:\d+/g
      ],
      specificEntities: [
        'colombia', 'usa', 'mexico', 'spain',
        'fedex', 'dhl', 'ups', 'servientrega',
        'admin', 'manager', 'employee',
        'production', 'development', 'staging'
      ]
    };
  }

  async scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      this.checkLine(line, filePath, index + 1);
    });
  }

  checkLine(line, filePath, lineNumber) {
    // Verificar credenciales (CRÍTICO)
    this.patterns.credentials.forEach(pattern => {
      if (pattern.test(line)) {
        this.violations.critical.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          type: 'CREDENTIALS',
          message: 'Credenciales hardcodeadas detectadas'
        });
      }
    });

    // Verificar URLs (ALTO)
    this.patterns.urls.forEach(pattern => {
      if (pattern.test(line)) {
        this.violations.high.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          type: 'URLS',
          message: 'URLs hardcodeadas detectadas'
        });
      }
    });

    // Verificar entidades específicas (MEDIO)
    this.patterns.specificEntities.forEach(entity => {
      const regex = new RegExp(`\\b${entity}\\b`, 'gi');
      if (regex.test(line)) {
        this.violations.medium.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          type: 'SPECIFIC_ENTITY',
          message: `Entidad específica "${entity}" detectada`
        });
      }
    });
  }

  async scanDirectory(dir) {
    const files = await this.getFiles(dir);
    
    for (const file of files) {
      if (this.shouldScanFile(file)) {
        await this.scanFile(file);
      }
    }
  }

  shouldScanFile(filePath) {
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
    const excludeDirs = ['node_modules', '.git', 'dist', 'build'];
    
    const ext = path.extname(filePath);
    const shouldExclude = excludeDirs.some(dir => filePath.includes(dir));
    
    return extensions.includes(ext) && !shouldExclude;
  }

  async getFiles(dir) {
    const files = [];
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...await this.getFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  generateReport() {
    const report = {
      summary: {
        critical: this.violations.critical.length,
        high: this.violations.high.length,
        medium: this.violations.medium.length,
        low: this.violations.low.length
      },
      violations: this.violations,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.violations.critical.length > 0) {
      recommendations.push({
        priority: 'CRÍTICA',
        message: 'BLOQUEA COMMIT - Corrige credenciales hardcodeadas inmediatamente',
        action: 'Usa variables de entorno para todas las credenciales'
      });
    }

    if (this.violations.high.length > 0) {
      recommendations.push({
        priority: 'ALTA',
        message: 'ALERTA INMEDIATA - Corrige URLs hardcodeadas',
        action: 'Usa variables de entorno para configuraciones'
      });
    }

    if (this.violations.medium.length > 0) {
      recommendations.push({
        priority: 'MEDIA',
        message: 'ADVERTENCIA - Considera parametrizar entidades específicas',
        action: 'Usa nombres paramétricos y configuración dinámica'
      });
    }

    return recommendations;
  }
}

// Ejecutar detección
async function main() {
  const detector = new HardcodingDetector();
  await detector.scanDirectory('./src');
  
  const report = detector.generateReport();
  
  console.log('🔍 REPORTE DE DETECCIÓN DE HARDCODING');
  console.log('=====================================');
  console.log(`Críticas: ${report.summary.critical}`);
  console.log(`Altas: ${report.summary.high}`);
  console.log(`Medias: ${report.summary.medium}`);
  console.log(`Bajas: ${report.summary.low}`);
  
  if (report.violations.critical.length > 0) {
    console.log('\n❌ VIOLACIONES CRÍTICAS:');
    report.violations.critical.forEach(v => {
      console.log(`  ${v.file}:${v.line} - ${v.message}`);
      console.log(`    ${v.code}`);
    });
    process.exit(1); // Bloquear commit
  }
  
  if (report.violations.high.length > 0) {
    console.log('\n⚠️  VIOLACIONES ALTAS:');
    report.violations.high.forEach(v => {
      console.log(`  ${v.file}:${v.line} - ${v.message}`);
    });
  }
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 RECOMENDACIONES:');
    report.recommendations.forEach(r => {
      console.log(`  ${r.priority}: ${r.message}`);
      console.log(`    Acción: ${r.action}`);
    });
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = HardcodingDetector;
```

### **4. GitHub Action para CI/CD**

```yaml
# .github/workflows/hardcoding-check.yml
name: Hardcoding Detection

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  hardcoding-check:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run hardcoding detection
      run: npm run check-hardcoding
    
    - name: Comment PR with violations
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          const report = JSON.parse(fs.readFileSync('hardcoding-report.json', 'utf8'));
          
          if (report.summary.critical > 0) {
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `❌ **VIOLACIONES CRÍTICAS DETECTADAS**\n\nEste PR no puede ser mergeado hasta que se corrijan las violaciones críticas de hardcoding.\n\n${report.violations.critical.map(v => `- ${v.file}:${v.line} - ${v.message}`).join('\n')}`
            });
          } else if (report.summary.high > 0) {
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `⚠️ **ADVERTENCIAS DE HARDCODING**\n\nSe detectaron ${report.summary.high} violaciones altas. Considera corregirlas.\n\n${report.violations.high.map(v => `- ${v.file}:${v.line} - ${v.message}`).join('\n')}`
            });
          }
```

### **5. Sistema de Notificaciones**

```javascript
// scripts/notify-violations.js
class ViolationNotifier {
  constructor() {
    this.notificationChannels = {
      slack: process.env.SLACK_WEBHOOK_URL,
      email: process.env.EMAIL_NOTIFICATION,
      teams: process.env.TEAMS_WEBHOOK_URL
    };
  }

  async notifyCriticalViolations(violations) {
    const message = {
      text: '🚨 VIOLACIONES CRÍTICAS DE HARDCODING DETECTADAS',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*CRÍTICO: Credenciales hardcodeadas detectadas*\n\nEsto requiere atención inmediata del arquitecto.'
          }
        },
        {
          type: 'section',
          fields: violations.map(v => ({
            type: 'mrkdwn',
            text: `*${v.file}:${v.line}*\n${v.message}`
          }))
        }
      ]
    };

    await this.sendToSlack(message);
    await this.notifyArchitect(violations);
  }

  async notifyArchitect(violations) {
    // Notificar específicamente a Marcelo (Arquitecto)
    const architectMessage = {
      to: 'marcelo@VibeThink.com',
      subject: '🚨 Violaciones Críticas de Hardcoding Detectadas',
      body: `
        Se detectaron ${violations.length} violaciones críticas de hardcoding.
        
        Archivos afectados:
        ${violations.map(v => `- ${v.file}:${v.line}`).join('\n')}
        
        Acción requerida: Revisión inmediata y corrección.
      `
    };

    await this.sendEmail(architectMessage);
  }
}
```

## 📚 **Documentación y FAQs**

### **1. FAQ para Developers**

```markdown
# FAQ: Prevención de Hardcoding

## ¿Por qué no puedo usar valores hardcodeados?

**Respuesta**: Los valores hardcodeados limitan la universalidad de la plataforma. AI Pair debe funcionar para cualquier país, industria o dominio sin cambios de código.

## ¿Qué hago si necesito un valor específico?

**Respuesta**: Usa configuración paramétrica:
- Variables de entorno para configuraciones
- Configuración por país/industria
- Sistema de plugins para casos específicos

## ¿Cómo corrijo una violación crítica?

**Respuesta**:
1. Identifica el valor hardcodeado
2. Crea variable de entorno correspondiente
3. Reemplaza el valor hardcodeado con la variable
4. Documenta la nueva variable

## ¿Qué pasa si no puedo evitar el hardcoding?

**Respuesta**: Si es absolutamente necesario, documenta la justificación y crea un ticket de refactoring para futuras versiones.
```

### **2. Guía de Corrección**

```markdown
# Guía de Corrección de Hardcoding

## Paso 1: Identificar la Violación
- Lee el mensaje de error
- Identifica el archivo y línea
- Entiende el tipo de violación

## Paso 2: Clasificar la Criticidad
- **CRÍTICA**: Bloquea commit - Corregir inmediatamente
- **ALTA**: Alerta - Corregir en esta iteración
- **MEDIA**: Advertencia - Considerar corrección
- **BAJA**: Sugerencia - Mejora futura

## Paso 3: Aplicar la Corrección
- Usa el patrón recomendado
- Mantén compatibilidad hacia atrás
- Documenta los cambios

## Paso 4: Validar la Corrección
- Ejecuta las pruebas
- Verifica que no hay regresiones
- Confirma que la funcionalidad funciona
```

## 🎯 **Beneficios del Sistema**

### **1. Prevención Proactiva**
- **Detección en tiempo real** durante desarrollo
- **Bloqueo de commits** con violaciones críticas
- **Alertas inmediatas** para violaciones altas

### **2. Calidad de Código**
- **Cero credenciales** en código
- **Configuración paramétrica** universal
- **Código mantenible** y escalable

### **3. Seguridad**
- **Prevención de leaks** de credenciales
- **Configuración segura** por entorno
- **Auditoría automática** de seguridad

### **4. Escalabilidad**
- **Código universal** que funciona en cualquier contexto
- **Configuración dinámica** sin cambios de código
- **Extensibilidad** sin límites específicos

---

**Este sistema asegura que AI Pair mantenga su universalidad y calidad de código en todo momento.** 