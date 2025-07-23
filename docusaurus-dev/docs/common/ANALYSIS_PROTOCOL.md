# Protocolo de Análisis - VThink 1.0

## 🎯 **Propósito**
Este protocolo garantiza que todas las recomendaciones y cambios estén alineados con las decisiones arquitectónicas existentes y el contexto del proyecto.

## 📋 **Checklist Obligatorio**

### **Fase 1: Contexto (OBLIGATORIO)**
- [ ] Leer documentación del proyecto
- [ ] Verificar ADRs (Architecture Decision Records)
- [ ] Consultar stack tecnológico confirmado
- [ ] Revisar decisiones recientes
- [ ] Entender arquitectura actual

### **Fase 2: Análisis**
- [ ] Identificar el problema real
- [ ] Verificar si ya existe solución
- [ ] Consultar patrones establecidos
- [ ] Validar contra restricciones técnicas

### **Fase 3: Recomendación**
- [ ] Explicar por qué la solución es correcta
- [ ] Mostrar alternativas consideradas
- [ ] Documentar impacto en arquitectura
- [ ] Validar con usuario antes de implementar

## 🚨 **Red Flags - Detener y Preguntar**

### **Cuando NO tengo suficiente contexto:**
- Stack tecnológico no claro
- Decisiones arquitectónicas no documentadas
- Conflicto con patrones establecidos
- Cambio que afecta múltiples capas

### **Cuando debo consultar:**
- Cambios en build tools
- Modificaciones de arquitectura
- Nuevas dependencias
- Cambios en stack principal

## 📚 **Fuentes de Verificación**

### **Documentos Críticos:**
1. `docs/projects/VibeThink-Orchestrator/ARCHITECTURE_DECISION_RECORD.md`
2. `docs/VIBETHINK_STACK_CURRENT.md`
3. `docs/architecture/DECISIONS_INDEX.md`
4. `docs/projects/common/BEST_PRACTICES_MASTER.md`

### **Archivos de Configuración:**
1. `package.json` - Dependencias y scripts
2. `next.config.js` - Configuración Next.js
3. `tsconfig.json` - Configuración TypeScript
4. `tailwind.config.ts` - Configuración CSS

## 🔧 **Proceso de Validación**

### **Antes de Cualquier Cambio:**
```typescript
const validateChange = async (proposedChange) => {
  // 1. Verificar contexto
  const context = await readProjectContext();
  
  // 2. Validar contra decisiones existentes
  const isCompatible = validateAgainstADRs(proposedChange);
  
  // 3. Verificar stack actual
  const stackValidation = validateAgainstCurrentStack(proposedChange);
  
  // 4. Consultar con usuario
  if (!isCompatible || !stackValidation.valid) {
    return {
      shouldProceed: false,
      reasons: [stackValidation.reasons],
      alternatives: stackValidation.alternatives
    };
  }
  
  return { shouldProceed: true };
};
```

## 📝 **Template de Respuesta**

### **Estructura Obligatoria:**
```markdown
## 🔍 **Análisis de Contexto**
[Verificación de documentación existente]

## 📋 **Estado Actual**
[Stack confirmado y decisiones relevantes]

## 🎯 **Problema Identificado**
[Descripción clara del problema]

## ✅ **Solución Recomendada**
[Explicación de por qué es la correcta]

## 🔄 **Alternativas Consideradas**
[Por qué se rechazaron]

## 📚 **Documentación de Decisión**
[Registro de la decisión]
```

## 🚀 **Implementación**

### **Para Evitar Errores Futuros:**
1. **Siempre consultar documentación** antes de sugerir cambios
2. **Validar contra ADRs** existentes
3. **Explicar racional** de cada recomendación
4. **Documentar decisiones** inmediatamente
5. **Confirmar con usuario** antes de implementar cambios grandes

---

**Este protocolo es OBLIGATORIO para todas las interacciones técnicas.** 