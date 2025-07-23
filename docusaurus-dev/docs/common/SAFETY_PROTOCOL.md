# Protocolo de Seguridad - VThink 1.0

## 🚨 **OBLIGATORIO - Antes de Cualquier Respuesta**

### **Checklist de Seguridad:**
```typescript
const safetyCheck = async (userQuery) => {
  // 1. VERIFICAR CONTEXTO
  const context = await verifyProjectContext();
  
  // 2. CONSULTAR DOCUMENTACIÓN
  const docs = await searchRelevantDocumentation(userQuery);
  
  // 3. VALIDAR STACK ACTUAL
  const currentStack = getCurrentStack();
  
  // 4. VERIFICAR DECISIONES EXISTENTES
  const existingDecisions = await findRelevantADRs(userQuery);
  
  // 5. VALIDAR COMPATIBILIDAD
  const compatibility = validateCompatibility(userQuery, currentStack);
  
  return {
    canProceed: compatibility.isValid,
    context: context,
    stack: currentStack,
    decisions: existingDecisions,
    warnings: compatibility.warnings
  };
};
```

## 📋 **Proceso Obligatorio**

### **Paso 1: Contexto (OBLIGATORIO)**
```markdown
## 🔍 **Contexto Verificado**
- [ ] Documentación del proyecto consultada
- [ ] Stack tecnológico confirmado
- [ ] Decisiones arquitectónicas validadas
- [ ] ADRs relevantes identificados
```

### **Paso 2: Análisis**
```markdown
## 📋 **Estado Actual Confirmado**
- Stack: Next.js + React + TypeScript
- Build Tool: Next.js (NO Vite)
- Testing: Vitest (solo testing)
- Backend: Supabase + Edge Functions
```

### **Paso 3: Validación**
```markdown
## ✅ **Solución Validada**
- Compatible con stack actual
- Alineada con decisiones existentes
- Documentada apropiadamente
```

## 🚨 **Red Flags - DETENER INMEDIATAMENTE**

### **Cuando NO tengo suficiente información:**
- Stack tecnológico no claro
- Decisiones arquitectónicas no documentadas
- Conflicto con patrones establecidos
- Cambio que afecta múltiples capas

### **Cuando debo CONSULTAR:**
- Cambios en build tools
- Modificaciones de arquitectura
- Nuevas dependencias
- Cambios en stack principal

## 📚 **Fuentes de Verificación Obligatorias**

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

## 🔧 **Template de Respuesta Segura**

```markdown
## 🔍 **Contexto Verificado**
[Documentación consultada y validada]

## 📋 **Stack Confirmado**
[Stack actual verificado]

## 🎯 **Problema Identificado**
[Descripción clara del problema]

## ✅ **Solución Validada**
[Explicación de compatibilidad]

## 🔄 **Alternativas Consideradas**
[Por qué se rechazaron]

## 📚 **Documentación de Decisión**
[Registro inmediato de la decisión]
```

## 🚀 **Implementación**

### **Medidas de Seguridad:**
1. **Siempre consultar documentación** antes de sugerir
2. **Validar contra ADRs** existentes
3. **Explicar racional** de cada recomendación
4. **Confirmar con usuario** antes de cambios grandes
5. **Documentar decisiones** inmediatamente

---

**Este protocolo es OBLIGATORIO para todas las interacciones técnicas.** 