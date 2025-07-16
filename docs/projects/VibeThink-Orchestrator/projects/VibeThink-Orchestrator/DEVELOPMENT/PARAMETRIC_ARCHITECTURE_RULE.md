# 🚨 REGLA OBLIGATORIA: ARQUITECTURA PARAMÉTRICA
## Regla #1: CERO HARDCODING - TODO PARAMÉTRICO

### 📋 **RESUMEN EJECUTIVO**

Esta es una **REGLAS OBLIGATORIA** que **TODOS** los desarrolladores deben seguir sin excepción. Cualquier violación de esta regla resultará en **rechazo del código** y **requerimiento de refactorización**.

---

## 🚨 **REGLAS OBLIGATORIAS**

### **REGLA #1: CERO HARDCODING DE JURISDICCIONES**
```yaml
❌ PROHIBIDO:
  - Variables con nombres de países (Colombia, Spain, Mexico)
  - URLs hardcodeadas específicas de jurisdicción
  - Precios hardcodeados en el código
  - Validaciones específicas de país en el código
  - Interfaces con nombres de países

✅ OBLIGATORIO:
  - Configuración en archivos YAML/JSON
  - Variables genéricas y paramétricas
  - Plugins configurables
  - Interfaces universales
```

### **REGLA #2: NOMENCLATURA UNIVERSAL**
```yaml
❌ PROHIBIDO:
  - cedula, colombiaTax, spainValidator
  - colombiaUser, mexicoService, spainController
  - registraduriaUrl, portalEstadoUrl
  - COLOMBIA_TAX_RATES, SPAIN_ID_REGEX

✅ OBLIGATORIO:
  - nationalId, taxRate, identityValidator
  - user, service, controller
  - identityAuthorityUrl, governmentPortalUrl
  - TAX_RATES, ID_REGEX (desde configuración)
```

### **REGLA #3: CONFIGURACIÓN EXTERNA**
```yaml
❌ PROHIBIDO:
  - Constantes hardcodeadas en el código
  - Configuración mezclada con lógica de negocio
  - Valores específicos de jurisdicción en variables

✅ OBLIGATORIO:
  - Toda configuración en archivos externos
  - ConfigurationManager para cargar configuraciones
  - Valores desde configuración dinámica
```

---

## 🔍 **CHECKLIST DE VALIDACIÓN OBLIGATORIO**

### **Antes de Cada Commit**
```yaml
✅ Validación_Automática:
  - [ ] No hay variables con nombres de países
  - [ ] No hay URLs hardcodeadas
  - [ ] No hay precios hardcodeados
  - [ ] No hay interfaces específicas de país
  - [ ] Configuración está en archivos externos
  - [ ] Nomenclatura es genérica
  - [ ] Tests pasan con configuración paramétrica
```

### **Antes de Cada Pull Request**
```yaml
✅ Revisión_Manual:
  - [ ] Código revisado por senior developer
  - [ ] Arquitectura paramétrica validada
  - [ ] Configuración externa verificada
  - [ ] Nomenclatura universal confirmada
  - [ ] Documentación actualizada
```

---

## 🛠️ **HERRAMIENTAS DE VALIDACIÓN**

### **1. ESLint Rules Personalizadas**
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // Prohibir variables con nombres de países
    'no-country-names': 'error',
    
    // Prohibir hardcoding de URLs
    'no-hardcoded-urls': 'error',
    
    // Prohibir precios hardcodeados
    'no-hardcoded-prices': 'error',
    
    // Requerir configuración externa
    'require-external-config': 'error'
  }
};
```

### **2. Pre-commit Hooks**
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Buscar violaciones de la regla
echo "🔍 Validando arquitectura paramétrica..."

# Buscar variables con nombres de países
if grep -r "Colombia\|Spain\|Mexico\|colombia\|spain\|mexico" src/ --include="*.ts" --include="*.js"; then
  echo "❌ ERROR: Variables con nombres de países encontradas"
  echo "   Regla: Usar nomenclatura genérica"
  exit 1
fi

# Buscar URLs hardcodeadas
if grep -r "https://.*\.gov\|http://.*\.gov" src/ --include="*.ts" --include="*.js"; then
  echo "❌ ERROR: URLs hardcodeadas encontradas"
  echo "   Regla: Usar configuración externa"
  exit 1
fi

# Buscar precios hardcodeados
if grep -r "[0-9]\{4,\}" src/ --include="*.ts" --include="*.js" | grep -v "test\|spec"; then
  echo "❌ ERROR: Posibles precios hardcodeados encontrados"
  echo "   Regla: Usar configuración externa"
  exit 1
fi

echo "✅ Validación de arquitectura paramétrica exitosa"
```

### **3. GitHub Actions**
```yaml
# .github/workflows/parametric-validation.yml
name: Parametric Architecture Validation

on: [push, pull_request]

jobs:
  validate-architecture:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run ESLint with custom rules
      run: npm run lint:parametric
    
    - name: Validate configuration files
      run: npm run validate:config
    
    - name: Check for hardcoded values
      run: npm run check:hardcoding
```

---

## 📚 **ONBOARDING OBLIGATORIO PARA NUEVOS DESARROLLADORES**

### **Día 1: Introducción a la Regla**
```yaml
Sesión_1: Fundamentos
  Duración: 2 horas
  Contenido:
    - Explicación de la regla obligatoria
    - Por qué es importante
    - Consecuencias de violar la regla
    - Ejemplos de buenas y malas prácticas

Sesión_2: Práctica
  Duración: 3 horas
  Contenido:
    - Ejercicios de refactorización
    - Conversión de código problemático
    - Creación de configuraciones
    - Implementación de plugins

Sesión_3: Validación
  Duración: 1 hora
  Contenido:
    - Uso de herramientas de validación
    - Checklist obligatorio
    - Proceso de revisión
    - Recursos de ayuda
```

### **Material de Onboarding**
```yaml
Documentos_Obligatorios:
  - Guía de arquitectura paramétrica
  - Ejemplos de código correcto vs incorrecto
  - Checklist de validación
  - Herramientas de desarrollo
  - Recursos de ayuda

Videos_Tutoriales:
  - Introducción a la regla (10 min)
  - Refactorización paso a paso (20 min)
  - Uso de herramientas (15 min)
  - Casos de uso reales (25 min)

Ejercicios_Prácticos:
  - Refactorizar código problemático
  - Crear configuración para nueva jurisdicción
  - Implementar plugin específico
  - Validar arquitectura paramétrica
```

---

## 🎯 **EJEMPLOS PRÁCTICOS**

### **❌ CÓDIGO RECHAZADO (NO HACER)**
```typescript
// ❌ RECHAZADO: Variables específicas de Colombia
const COLOMBIA_TAX_RATES = {
  birth_certificate: 4200,
  death_certificate: 4200
};

// ❌ RECHAZADO: Clase específica de Colombia
class ColombiaIdValidator {
  validateCedula(cedula: string): boolean {
    return /^[0-9]{8,10}$/.test(cedula);
  }
}

// ❌ RECHAZADO: Interface específica de Colombia
interface ColombiaUser {
  cedula: string;
  cedulaType: string;
}

// ❌ RECHAZADO: URL hardcodeada
const REGISTRADURIA_URL = "https://api.registraduria.gov.co";
```

### **✅ CÓDIGO APROBADO (HACER)**
```typescript
// ✅ APROBADO: Configuración externa
const jurisdictionConfigs: Record<string, JurisdictionConfig> = {
  'CO': {
    id: 'CO',
    name: 'Colombia',
    taxRates: {
      birth_certificate: 4200,
      death_certificate: 4200
    }
  }
};

// ✅ APROBADO: Interface genérica
interface NationalIdValidator {
  validateFormat(id: string): boolean;
  validateChecksum(id: string): boolean;
}

// ✅ APROBADO: Implementación específica
class ColombiaIdValidator implements NationalIdValidator {
  validateFormat(id: string): boolean {
    const config = jurisdictionConfigs['CO'];
    const regex = new RegExp(config.idValidation.formatRegex);
    return regex.test(id);
  }
}

// ✅ APROBADO: Interface genérica
interface User {
  nationalId: string;
  nationalIdType: string;
  jurisdiction: string;
}

// ✅ APROBADO: URL desde configuración
const config = jurisdictionConfigs[jurisdictionCode];
const authorityUrl = config.integrations.identityAuthority;
```

---

## 🚨 **CONSECUENCIAS DE VIOLAR LA REGLA**

### **Nivel 1: Rechazo de Código**
```yaml
Acción: Pull Request rechazado
Proceso:
  - Comentario explicando la violación
  - Solicitud de refactorización
  - Bloqueo hasta corrección
  - Revisión adicional requerida
```

### **Nivel 2: Advertencia Formal**
```yaml
Acción: Advertencia por escrito
Proceso:
  - Documentación de la violación
  - Revisión de la regla obligatoria
  - Sesión de refuerzo de buenas prácticas
  - Seguimiento en próximos PRs
```

### **Nivel 3: Revisión Obligatoria**
```yaml
Acción: Revisión obligatoria de todo el código
Proceso:
  - Revisión completa del código del desarrollador
  - Refactorización de todas las violaciones
  - Sesión de entrenamiento adicional
  - Mentoría obligatoria
```

---

## 📋 **PROCESO DE REVISIÓN OBLIGATORIO**

### **Checklist del Revisor**
```yaml
✅ Revisión_Arquitectura:
  - [ ] No hay hardcoding de jurisdicciones
  - [ ] Configuración está en archivos externos
  - [ ] Nomenclatura es genérica
  - [ ] Interfaces son universales
  - [ ] Plugins son configurables

✅ Revisión_Código:
  - [ ] Variables tienen nombres genéricos
  - [ ] URLs vienen de configuración
  - [ ] Precios vienen de configuración
  - [ ] Validaciones son paramétricas
  - [ ] Tests usan configuración

✅ Revisión_Documentación:
  - [ ] Configuración está documentada
  - [ ] Plugins están documentados
  - [ ] Ejemplos están actualizados
  - [ ] Guías están claras
```

### **Comentarios de Revisión**
```yaml
Comentario_Rechazo:
  "❌ VIOLACIÓN DE REGLA OBLIGATORIA: 
   Variable 'COLOMBIA_TAX_RATES' viola la regla de arquitectura paramétrica.
   
   ✅ SOLUCIÓN:
   - Mover a configuración externa
   - Usar nomenclatura genérica
   - Implementar plugin system
   
   🔗 Recursos: docs/development/PARAMETRIC_ARCHITECTURE_GUIDELINES.md"

Comentario_Aprobación:
  "✅ ARQUITECTURA PARAMÉTRICA APROBADA:
   - Configuración externa correcta
   - Nomenclatura genérica
   - Plugin system implementado
   - Tests paramétricos
   
   🎯 Excelente trabajo siguiendo las buenas prácticas!"
```

---

## 🎓 **RECURSOS DE AYUDA**

### **Documentación Obligatoria**
```yaml
Guías_Principales:
  - docs/development/PARAMETRIC_ARCHITECTURE_GUIDELINES.md
  - docs/development/CODE_REVIEW_PARAMETRIC.md
  - docs/development/AI_PAIR_GOV_STRATEGY.md

Ejemplos_Prácticos:
  - examples/parametric-architecture/
  - examples/plugin-implementation/
  - examples/configuration-files/

Herramientas:
  - scripts/validate-parametric.js
  - scripts/check-hardcoding.js
  - scripts/generate-config.js
```

### **Contactos de Ayuda**
```yaml
Mentores_Arquitectura:
  - Senior Developer: @senior-dev
  - Tech Lead: @tech-lead
  - Architect: @architect

Canales_Soporte:
  - Slack: #parametric-architecture
  - Discord: #dev-architecture
  - Email: architecture@VibeThink.com
```

---

## 🏆 **CONCLUSIÓN**

### **Esta Regla es OBLIGATORIA**

```yaml
Aplicación:
  - Todos los desarrolladores
  - Todos los proyectos
  - Todos los commits
  - Sin excepciones

Beneficios:
  - Código escalable
  - Mantenimiento simple
  - Onboarding rápido
  - Calidad consistente

Resultado:
  - Arquitectura paramétrica perfecta
  - Escalabilidad sin límites
  - Equipo alineado
  - Producto de calidad
```

**¡ESTA REGLA ES OBLIGATORIA PARA TODOS!** 🚨✨

---

**Fecha de creación:** 27 de Enero de 2025  
**Estado:** ✅ **REGLAS OBLIGATORIAS APROBADAS**  
**Aplicación:** Todos los desarrolladores sin excepción  
**Documento:** Reglas vinculantes para el equipo 