# 🧠 Sistema de Memoria - Framework Navaja Suiza

## 📋 **Resumen Ejecutivo**

Este documento establece el sistema de memoria para que el asistente SIEMPRE recuerde y aplique correctamente el framework de decisión "Navaja Suiza" con sus 3 niveles de herramientas.

## 🎯 **Reglas de Memoria Fundamentales**

### **🎯 Regla Principal (SIEMPRE Recordar):**
**"Siempre empezar con la NAVAJA SUIZA (Nivel 1), escalar solo cuando sea necesario"**

### **📊 Distribución de Niveles:**
- **Nivel 1 (Navaja Suiza)**: 80% de casos de uso
- **Nivel 2 (Especializadas)**: 15% de casos de uso  
- **Nivel 3 (Únicas)**: 5% de casos de uso

## 🔧 **Herramientas por Nivel (Memorizar)**

### **NIVEL 1: Navaja Suiza (Herramientas Estándar)**

```typescript
const NIVEL_1_HERRAMIENTAS = {
  // Frontend
  charts: {
    tool: 'Recharts',
    useCases: ['gráficos de línea', 'barras', 'pastel', 'área'],
    performance: '< 100ms',
    complexity: 3
  },
  
  tables: {
    tool: 'TanStack Table',
    useCases: ['tablas paginadas', 'ordenamiento', 'filtros'],
    performance: '< 200ms',
    complexity: 4
  },
  
  forms: {
    tool: 'React Hook Form + Zod',
    useCases: ['validación', 'campos dinámicos', 'subida archivos'],
    performance: '< 50ms',
    complexity: 3
  },
  
  chat: {
    tool: 'Assistant UI + Vercel AI SDK',
    useCases: ['conversaciones', 'streaming', 'multi-provider'],
    performance: '< 300ms',
    complexity: 5
  },
  
  ui: {
    tool: 'shadcn/ui',
    useCases: ['botones', 'modales', 'navegación', 'inputs'],
    performance: '< 50ms',
    complexity: 2
  },
  
  // Backend
  backend: {
    tool: 'FastAPI + FastAPI-MCP',
    useCases: ['procesamiento Python', 'RAG', 'análisis de datos'],
    performance: '< 500ms',
    complexity: 4
  }
};
```

### **NIVEL 2: Herramientas Especializadas**

```typescript
const NIVEL_2_HERRAMIENTAS = {
  charts: {
    d3: {
      tool: 'D3.js',
      useCases: ['visualizaciones complejas', 'gráficos personalizados'],
      complexity: 9
    },
    threejs: {
      tool: 'Three.js',
      useCases: ['gráficos 3D', 'visualizaciones inmersivas'],
      complexity: 10
    }
  },
  
  tables: {
    agGrid: {
      tool: 'AG Grid',
      useCases: ['tablas con 100k+ filas', 'edición inline'],
      complexity: 7
    },
    reactWindow: {
      tool: 'React Window',
      useCases: ['listas virtuales', 'scroll infinito'],
      complexity: 6
    }
  },
  
  editors: {
    monaco: {
      tool: 'Monaco Editor',
      useCases: ['editor de código', 'syntax highlighting'],
      complexity: 8
    },
    quill: {
      tool: 'Quill',
      useCases: ['editor de texto rico', 'formateo'],
      complexity: 5
    }
  }
};
```

### **NIVEL 3: Herramientas Únicas**

```typescript
const NIVEL_3_HERRAMIENTAS = {
  custom: {
    canvas: {
      tool: 'Canvas/SVG personalizado',
      useCases: ['visualizaciones únicas', 'animaciones complejas'],
      complexity: 10
    },
    webgl: {
      tool: 'WebGL',
      useCases: ['gráficos avanzados', 'shaders personalizados'],
      complexity: 10
    },
    wasm: {
      tool: 'WebAssembly',
      useCases: ['cálculos pesados', 'performance extrema'],
      complexity: 10
    }
  },
  
  experimental: {
    protocols: {
      tool: 'Protocolos personalizados',
      useCases: ['comunicación única', 'integración específica'],
      complexity: 10
    },
    apis: {
      tool: 'APIs nativas del navegador',
      useCases: ['funcionalidades experimentales'],
      complexity: 9
    }
  }
};
```

## 🔍 **Proceso de Decisión Automática**

### **Algoritmo de Decisión:**

```typescript
const DECISION_ALGORITHM = {
  step1: 'Evaluar Nivel 1 (Navaja Suiza)',
  step2: 'Si no resuelve → Evaluar Nivel 2 (Especializada)',
  step3: 'Si no resuelve → Evaluar Nivel 3 (Única)',
  step4: 'Si no resuelve → Buscar nueva herramienta'
};
```

### **Criterios de Evaluación:**

```typescript
const CRITERIOS_EVALUACION = {
  nivel1: {
    pregunta: '¿Es un caso común (80% de casos)?',
    criterios: ['configuración mínima', 'herramienta estándar', 'baja complejidad'],
    resultado: 'Usar herramienta de nivel 1'
  },
  
  nivel2: {
    pregunta: '¿Requiere funcionalidad específica o performance crítica?',
    criterios: ['funcionalidad no disponible en nivel 1', 'performance crítica', 'complejidad media'],
    resultado: 'Usar herramienta de nivel 2'
  },
  
  nivel3: {
    pregunta: '¿Es un caso único o experimental?',
    criterios: ['caso único', 'desarrollo personalizado', 'alta complejidad'],
    resultado: 'Usar herramienta de nivel 3'
  }
};
```

## 🎯 **Checklist de Memoria para el Asistente**

### **Antes de Sugerir Cualquier Herramienta:**

```typescript
const CHECKLIST_PRE_DECISION = [
  '¿He evaluado todas las herramientas de NIVEL 1?',
  '¿El caso de uso es realmente único?',
  '¿He documentado la justificación?',
  '¿He considerado el costo de mantenimiento?',
  '¿He evaluado el impacto en el bundle size?',
  '¿He verificado que no es un caso común?'
];
```

### **Al Documentar una Decisión:**

```typescript
const CHECKLIST_DOCUMENTACION = [
  'Nivel de herramienta seleccionada (1, 2, o 3)',
  'Justificación técnica clara',
  'Alternativas consideradas',
  'Métricas de performance esperadas',
  'Fecha de revisión',
  'Impacto en mantenimiento'
];
```

## 📝 **Ejemplos de Aplicación Correcta**

### **✅ Ejemplo 1: Gráfico Simple (Nivel 1)**
```typescript
// Usuario: "Necesito un gráfico de ventas mensuales"
// Respuesta del Asistente:
"Usar Recharts (Nivel 1 - Navaja Suiza)

Justificación:
- Caso común (80% de casos)
- Configuración mínima
- Herramienta estándar de la industria
- Performance optimizada (< 100ms)

Alternativas consideradas: D3.js (Nivel 2) - Rechazado por over-engineering"
```

### **✅ Ejemplo 2: Gráfico 3D (Nivel 2)**
```typescript
// Usuario: "Necesito un gráfico 3D interactivo"
// Respuesta del Asistente:
"Usar Three.js (Nivel 2 - Especializada)

Justificación:
- Funcionalidad específica no disponible en Nivel 1
- Recharts no soporta 3D
- Three.js es la herramienta estándar para 3D
- Caso de uso específico (15% de casos)

Alternativas consideradas: Recharts (Nivel 1) - Rechazado por limitaciones"
```

### **✅ Ejemplo 3: Visualización Única (Nivel 3)**
```typescript
// Usuario: "Necesito una visualización personalizada con shaders"
// Respuesta del Asistente:
"Desarrollo personalizado con WebGL (Nivel 3 - Única)

Justificación:
- Caso único (5% de casos)
- Requiere shaders personalizados
- No hay herramienta estándar disponible
- Desarrollo específico necesario

Alternativas consideradas: Three.js (Nivel 2) - Limitado para shaders personalizados"
```

## 🚫 **Ejemplos de Aplicación Incorrecta**

### **❌ Ejemplo Incorrecto 1:**
```typescript
// Usuario: "Necesito un gráfico de línea simple"
// Respuesta INCORRECTA: "Usar D3.js"
// Respuesta CORRECTA: "Usar Recharts (Nivel 1)"

// Error: No evaluó Nivel 1 primero
```

### **❌ Ejemplo Incorrecto 2:**
```typescript
// Usuario: "Necesito una tabla de usuarios"
// Respuesta INCORRECTA: "Usar AG Grid"
// Respuesta CORRECTA: "Usar TanStack Table (Nivel 1)"

// Error: Over-engineering para caso común
```

### **❌ Ejemplo Incorrecto 3:**
```typescript
// Usuario: "Necesito un formulario de contacto"
// Respuesta INCORRECTA: "Desarrollo personalizado"
// Respuesta CORRECTA: "Usar React Hook Form + Zod (Nivel 1)"

// Error: No consideró herramientas estándar
```

## 🧠 **Comandos de Memoria para el Asistente**

### **Comandos para Recordar el Framework:**
```typescript
const COMANDOS_MEMORIA = {
  recordarNiveles: "Framework Navaja Suiza: Nivel 1 (80%), Nivel 2 (15%), Nivel 3 (5%)",
  recordarProceso: "Siempre empezar con Nivel 1, escalar solo cuando sea necesario",
  recordarHerramientas: "Nivel 1: Recharts, TanStack, React Hook Form, Vercel AI SDK, FastAPI-MCP",
  recordarCriterios: "Evaluar Nivel 1 → Nivel 2 → Nivel 3 → Buscar nueva herramienta"
};
```

### **Comandos para Aplicar el Framework:**
```typescript
const COMANDOS_APLICACION = {
  evaluarCaso: "¿Es un caso común? → Nivel 1",
  escalar: "¿Requiere funcionalidad específica? → Nivel 2",
  unico: "¿Es un caso único? → Nivel 3",
  documentar: "Siempre documentar justificación y alternativas"
};
```

## 🔄 **Sistema de Revisión y Actualización**

### **Revisión Mensual:**
```typescript
const REVISION_MENSUAL = [
  'Revisar decisiones tomadas',
  'Validar resultados vs expectativas',
  'Ajustar criterios si es necesario',
  'Actualizar herramientas por nivel'
];
```

### **Revisión Trimestral:**
```typescript
const REVISION_TRIMESTRAL = [
  'Evaluar efectividad del framework',
  'Revisar distribución de casos por nivel',
  'Actualizar catálogo de herramientas',
  'Refinar criterios de decisión'
];
```

## 🎯 **Reglas de Memoria Específicas**

### **Reglas Fundamentales (SIEMPRE Seguir):**
1. **NUNCA sugerir herramientas de nivel 2 o 3 sin evaluar nivel 1 primero**
2. **SIEMPRE documentar la justificación de la decisión**
3. **SIEMPRE considerar el impacto en mantenimiento y bundle size**
4. **SIEMPRE revisar si es realmente un caso único**
5. **SIEMPRE evaluar si es un caso común (80% de casos)**

### **Reglas de Herramientas (Memorizar):**
```typescript
const REGLAS_HERRAMIENTAS = {
  nivel1: "Recharts, TanStack Table, React Hook Form, Vercel AI SDK, FastAPI-MCP",
  nivel2: "D3.js, Three.js, AG Grid, Monaco Editor",
  nivel3: "Canvas/SVG personalizado, WebGL, WebAssembly"
};
```

## 🎯 **Conclusión**

Este sistema de memoria asegura que el asistente:

1. **Siempre recuerde** el framework de 3 niveles
2. **Siempre aplique** el proceso de decisión correcto
3. **Siempre documente** las decisiones y justificaciones
4. **Siempre evite** over-engineering innecesario
5. **Siempre mantenga** consistencia en las decisiones

**La clave es: "Siempre empezar simple, escalar solo cuando sea necesario"**.

---

*Última actualización: Enero 2024*
*Próxima revisión: Abril 2024* 