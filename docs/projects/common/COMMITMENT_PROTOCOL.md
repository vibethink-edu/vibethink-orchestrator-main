# Compromiso de Prevención de Errores - VThink 1.0

## 🤝 **Compromiso Formal**

### **Como Asistente IA, me comprometo a:**

1. **Siempre consultar documentación** antes de hacer recomendaciones
2. **Validar contra decisiones existentes** antes de sugerir cambios
3. **Verificar stack tecnológico** antes de cualquier modificación
4. **Explicar racional** de cada recomendación
5. **Confirmar con usuario** antes de cambios grandes
6. **Documentar decisiones** inmediatamente

## 🚨 **Reglas Estrictas**

### **NUNCA haré:**
- Sugerir Vite como build tool (Next.js es el build tool)
- Ignorar decisiones arquitectónicas existentes
- Modificar stack sin justificación clara
- No consultar documentación del proyecto
- Asumir stack sin validar

### **SIEMPRE haré:**
- Consultar documentación relevante
- Verificar stack tecnológico actual
- Validar contra ADRs existentes
- Explicar por qué una solución es correcta
- Documentar decisiones inmediatamente

## 📋 **Proceso Obligatorio**

### **Antes de Cada Respuesta:**
```typescript
const mandatoryProcess = async (userQuery) => {
  // 1. CONSULTAR DOCUMENTACIÓN
  const docs = await searchProjectDocumentation(userQuery);
  
  // 2. VERIFICAR STACK ACTUAL
  const currentStack = getCurrentStack();
  
  // 3. VALIDAR DECISIONES EXISTENTES
  const decisions = await findRelevantADRs(userQuery);
  
  // 4. VERIFICAR COMPATIBILIDAD
  const compatibility = validateCompatibility(userQuery, currentStack);
  
  // 5. SOLO SI TODO ES VÁLIDO, PROCEDER
  if (compatibility.isValid && docs.isValid) {
    return generateResponse(userQuery, docs, currentStack, decisions);
  } else {
    return askForClarification(userQuery, compatibility.warnings);
  }
};
```

## 🎯 **Stack Confirmado (NO MODIFICAR)**

```typescript
const CONFIRMED_STACK = {
  frontend: 'Next.js + React + TypeScript',
  buildTool: 'Next.js (NO Vite)',
  testing: 'Vitest (solo testing)',
  backend: 'Supabase + Edge Functions',
  styling: 'Tailwind CSS + shadcn/ui',
  stateManagement: 'React Query + Zustand',
  forms: 'React Hook Form + Zod'
};
```

## 📚 **Documentos de Referencia Obligatorios**

1. `docs/projects/VibeThink-Orchestrator/ARCHITECTURE_DECISION_RECORD.md`
2. `docs/VIBETHINK_STACK_CURRENT.md`
3. `docs/architecture/DECISIONS_INDEX.md`
4. `docs/projects/common/BEST_PRACTICES_MASTER.md`

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

## 📚 **Documentación de Decisión**
[Registro inmediato de la decisión]
```

## 🚀 **Implementación**

### **Medidas de Seguridad:**
1. **Validación automática** antes de cada respuesta
2. **Consulta obligatoria** de documentación
3. **Verificación de stack** en cada interacción
4. **Confirmación con usuario** antes de cambios
5. **Documentación inmediata** de decisiones

---

**Este compromiso es OBLIGATORIO y se aplica en cada interacción.** 