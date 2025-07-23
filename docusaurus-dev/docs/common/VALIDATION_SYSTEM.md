# Sistema de Validación Automática - VThink 1.0

## 🎯 **Propósito**
Sistema automático que valida todas las recomendaciones contra el contexto del proyecto antes de ser presentadas.

## 🔧 **Validación Automática**

### **Función de Validación:**
```typescript
const validateRecommendation = async (recommendation) => {
  // 1. Verificar stack actual
  const currentStack = {
    frontend: 'Next.js + React + TypeScript',
    buildTool: 'Next.js (NO Vite)',
    testing: 'Vitest (solo testing)',
    backend: 'Supabase + Edge Functions',
    styling: 'Tailwind CSS + shadcn/ui'
  };
  
  // 2. Verificar decisiones existentes
  const existingDecisions = [
    'Next.js como framework principal',
    'Vitest solo para testing',
    'No usar Vite como build tool',
    'Supabase como backend'
  ];
  
  // 3. Validar compatibilidad
  const compatibility = checkCompatibility(recommendation, currentStack);
  
  // 4. Verificar documentación
  const docs = await checkDocumentation(recommendation);
  
  return {
    isValid: compatibility.isValid && docs.isValid,
    warnings: [...compatibility.warnings, ...docs.warnings],
    alternatives: compatibility.alternatives
  };
};
```

## 🚨 **Reglas de Validación**

### **Regla 1: Stack Tecnológico**
```typescript
const validateStack = (recommendation) => {
  const forbidden = [
    'vite.config.ts',
    'webpack.config.js',
    'rollup.config.js'
  ];
  
  const allowed = [
    'vitest.config.ts',
    'next.config.js',
    'tailwind.config.ts'
  ];
  
  return {
    isValid: !forbidden.some(item => recommendation.includes(item)),
    warnings: forbidden.filter(item => recommendation.includes(item))
  };
};
```

### **Regla 2: Dependencias**
```typescript
const validateDependencies = (recommendation) => {
  const currentDeps = [
    'next', 'react', 'typescript', 'tailwindcss',
    'vitest', '@vitest/ui', '@vitest/coverage-v8'
  ];
  
  const forbiddenDeps = [
    'vite', '@vitejs/plugin-react'
  ];
  
  return {
    isValid: !forbiddenDeps.some(dep => recommendation.includes(dep)),
    warnings: forbiddenDeps.filter(dep => recommendation.includes(dep))
  };
};
```

### **Regla 3: Arquitectura**
```typescript
const validateArchitecture = (recommendation) => {
  const architecture = {
    buildTool: 'Next.js',
    testing: 'Vitest',
    backend: 'Supabase',
    styling: 'Tailwind CSS'
  };
  
  return {
    isValid: recommendation.alignsWith(architecture),
    warnings: recommendation.conflictsWith(architecture)
  };
};
```

## 📋 **Checklist de Validación**

### **Antes de Cualquier Recomendación:**
- [ ] Verificar stack tecnológico actual
- [ ] Consultar decisiones arquitectónicas
- [ ] Validar contra ADRs existentes
- [ ] Verificar documentación del proyecto
- [ ] Confirmar compatibilidad

### **Red Flags que Detienen el Proceso:**
- Sugerir Vite como build tool
- Modificar stack sin justificación
- Ignorar decisiones existentes
- No consultar documentación

## 🔧 **Implementación**

### **Proceso Automático:**
1. **Recibir consulta** del usuario
2. **Validar contexto** automáticamente
3. **Consultar documentación** relevante
4. **Verificar compatibilidad** con stack actual
5. **Presentar solución** validada

### **En Caso de Error:**
1. **Detener inmediatamente**
2. **Consultar documentación**
3. **Validar contra decisiones existentes**
4. **Confirmar con usuario** antes de proceder

---

**Este sistema se ejecuta automáticamente en cada interacción.** 