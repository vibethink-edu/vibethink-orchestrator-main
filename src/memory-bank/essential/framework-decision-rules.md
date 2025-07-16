# 🧠 Reglas de Memoria - Framework de Decisión Navaja Suiza

## 📋 **Reglas Fundamentales (SIEMPRE Recordar)**

### **🎯 Regla Principal:**
**"Siempre empezar con la NAVAJA SUIZA (Nivel 1), escalar solo cuando sea necesario"**

### **📊 Niveles de Herramientas:**

#### **NIVEL 1: Navaja Suiza (80% de casos)**
```typescript
const NIVEL_1_HERRAMIENTAS = {
  frontend: {
    charts: 'Recharts',
    tables: 'TanStack Table', 
    forms: 'React Hook Form + Zod',
    chat: 'Assistant UI + Vercel AI SDK',
    ui: 'shadcn/ui'
  },
  backend: {
    api: 'FastAPI + FastAPI-MCP',
    data: 'Pydantic + Pandas + NumPy'
  }
};
```

#### **NIVEL 2: Especializadas (15% de casos)**
```typescript
const NIVEL_2_HERRAMIENTAS = {
  charts: ['D3.js', 'Three.js', 'Chart.js'],
  tables: ['AG Grid', 'React Window'],
  forms: ['Formik', 'Final Form'],
  editors: ['Monaco Editor', 'Quill']
};
```

#### **NIVEL 3: Únicas (5% de casos)**
```typescript
const NIVEL_3_HERRAMIENTAS = {
  custom: ['Canvas/SVG personalizado', 'WebGL', 'WebAssembly'],
  experimental: ['Protocolos únicos', 'APIs nativas', 'Optimizaciones extremas']
};
```

## 🔍 **Proceso de Decisión Automática:**

### **Paso 1: Evaluar Nivel 1 (Navaja Suiza)**
```typescript
const evaluarNivel1 = (casoUso) => {
  // ¿Es un caso común (80% de casos)?
  // ¿Puede resolverlo con configuración mínima?
  // ¿Es una herramienta estándar de la industria?
  
  if (esCasoComun && configuracionMinima && herramientaEstandar) {
    return { nivel: 1, herramienta: 'navaja_suiza' };
  }
};
```

### **Paso 2: Evaluar Nivel 2 (Especializada)**
```typescript
const evaluarNivel2 = (casoUso) => {
  // ¿Requiere funcionalidad específica?
  // ¿Es performance crítica?
  // ¿Es 15% de casos de uso?
  
  if (funcionalidadEspecifica || performanceCritica) {
    return { nivel: 2, herramienta: 'especializada' };
  }
};
```

### **Paso 3: Evaluar Nivel 3 (Única)**
```typescript
const evaluarNivel3 = (casoUso) => {
  // ¿Es un caso único o experimental?
  // ¿Requiere desarrollo personalizado?
  // ¿Es 5% de casos de uso?
  
  if (casoUnico || desarrolloPersonalizado) {
    return { nivel: 3, herramienta: 'unica' };
  }
};
```

### **Paso 4: Buscar Nueva Herramienta**
```typescript
const buscarNuevaHerramienta = (casoUso) => {
  // Si no hay herramienta en ningún nivel
  // Investigar nuevas opciones
  // Documentar la búsqueda
};
```

## 🎯 **Checklist de Decisión (SIEMPRE Seguir):**

### **Antes de Sugerir Cualquier Herramienta:**
- [ ] ¿He evaluado todas las herramientas de NIVEL 1?
- [ ] ¿El caso de uso es realmente único?
- [ ] ¿He documentado la justificación?
- [ ] ¿He considerado el costo de mantenimiento?
- [ ] ¿He evaluado el impacto en el bundle size?

### **Al Documentar una Decisión:**
- [ ] Nivel de herramienta seleccionada (1, 2, o 3)
- [ ] Justificación técnica clara
- [ ] Alternativas consideradas
- [ ] Métricas de performance esperadas
- [ ] Fecha de revisión

## 📝 **Ejemplos de Aplicación:**

### **✅ Caso Correcto - Nivel 1:**
```typescript
// Usuario: "Necesito un gráfico de ventas mensuales"
// Respuesta: "Usar Recharts (Nivel 1 - Navaja Suiza)"
// Justificación: Caso común, configuración mínima, herramienta estándar
```

### **✅ Caso Correcto - Nivel 2:**
```typescript
// Usuario: "Necesito un gráfico 3D interactivo"
// Respuesta: "Usar Three.js (Nivel 2 - Especializada)"
// Justificación: Funcionalidad específica no disponible en Nivel 1
```

### **✅ Caso Correcto - Nivel 3:**
```typescript
// Usuario: "Necesito una visualización personalizada con shaders"
// Respuesta: "Desarrollo personalizado con WebGL (Nivel 3 - Única)"
// Justificación: Caso único, requiere desarrollo específico
```

### **❌ Caso Incorrecto:**
```typescript
// Usuario: "Necesito un gráfico de línea simple"
// Respuesta: "Usar D3.js" // ❌ INCORRECTO
// Respuesta Correcta: "Usar Recharts (Nivel 1)"
```

## 🧠 **Reglas de Memoria para el Asistente:**

### **Reglas Fundamentales:**
1. **NUNCA sugerir herramientas de nivel 2 o 3 sin evaluar nivel 1 primero**
2. **SIEMPRE documentar la justificación de la decisión**
3. **SIEMPRE considerar el impacto en mantenimiento y bundle size**
4. **SIEMPRE revisar si es realmente un caso único**

### **Herramientas por Nivel (Memorizar):**
```typescript
const HERRAMIENTAS_POR_NIVEL = {
  nivel1: {
    charts: 'Recharts',
    tables: 'TanStack Table',
    forms: 'React Hook Form + Zod',
    chat: 'Assistant UI + Vercel AI SDK',
    ui: 'shadcn/ui',
    backend: 'FastAPI + FastAPI-MCP'
  },
  nivel2: {
    charts: ['D3.js', 'Three.js'],
    tables: ['AG Grid'],
    editors: ['Monaco Editor']
  },
  nivel3: {
    custom: ['Canvas/SVG', 'WebGL', 'WebAssembly']
  }
};
```

### **Criterios de Decisión:**
```typescript
const CRITERIOS_DECISION = {
  nivel1: {
    casos: '80% de casos de uso',
    configuracion: 'Mínima',
    complejidad: 'Baja',
    mantenimiento: 'Bajo'
  },
  nivel2: {
    casos: '15% de casos de uso',
    configuracion: 'Media',
    complejidad: 'Media',
    mantenimiento: 'Medio'
  },
  nivel3: {
    casos: '5% de casos de uso',
    configuracion: 'Alta',
    complejidad: 'Alta',
    mantenimiento: 'Alto'
  }
};
```

## 🔄 **Proceso de Revisión:**

### **Revisión Mensual:**
- Revisar decisiones tomadas
- Validar resultados vs expectativas
- Ajustar criterios si es necesario

### **Revisión Trimestral:**
- Evaluar efectividad del framework
- Actualizar herramientas por nivel
- Revisar distribución de casos

## 🎯 **Comandos de Memoria:**

### **Para Recordar el Framework:**
```
"Framework Navaja Suiza: Nivel 1 (80%), Nivel 2 (15%), Nivel 3 (5%)"
"Siempre empezar con Nivel 1, escalar solo cuando sea necesario"
```

### **Para Aplicar el Framework:**
```
"Evaluar Nivel 1 → Nivel 2 → Nivel 3 → Buscar nueva herramienta"
"Documentar siempre la justificación de la decisión"
```

---

**Última actualización: Enero 2024**
**Próxima revisión: Abril 2024** 