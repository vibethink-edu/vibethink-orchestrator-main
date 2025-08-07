# 🚨 QUICK REFERENCE RULES - REGLAS ABSOLUTAS

## 🚨 **REGLAS ABSOLUTAS - NUNCA VIOLAR**

### **📦 DEPENDENCY MANAGEMENT RULES (OBLIGATORIAS):**
```json
// ✅ MANDATORY: Use exact versions only
"next": "15.3.4"  // ✅ YES - exact version
"@radix-ui/react-tooltip": "1.0.7"  // ✅ YES - exact version

// ❌ FORBIDDEN: Never use caret versions
"next": "^15.3.4"  // ❌ NO - causes instability
"@radix-ui/react-tooltip": "^1.0.7"  // ❌ NO - causes instability
```

### **🏗️ MONOREPO RULES (OBLIGATORIAS):**
```bash
# ✅ MANDATORY: Install only in root for shared dependencies
npm install clsx tailwind-merge --save  # ✅ ONLY in root

# ❌ FORBIDDEN: Never install in both places
npm install clsx --save  # ❌ NO in apps/dashboard
npm install clsx --save  # ❌ NO in root (duplicate)
```

### **🛡️ STABILITY RULES (OBLIGATORIAS):**
```typescript
// ✅ MANDATORY: Never change working code
// If it works, DON'T TOUCH IT

// ❌ FORBIDDEN: Don't "improve" working code
// Don't update versions "just because"
// Don't add dependencies "to fix errors"
```

### **📋 MANDATORY CHECKLIST BEFORE ANY CHANGE:**
1. ✅ **READ** existing rules in README.md lines 47-60
2. ✅ **VALIDATE** if change is really necessary
3. ✅ **USE** exact versions (no ^)
4. ✅ **INSTALL** only where appropriate
5. ✅ **DON'T TOUCH** working code

---

# Quick Reference Rules - VThink 1.0

## 🚨 **ANTES DE CUALQUIER CAMBIO - LEER ESTO**

### **1. ¿Dónde va el archivo?**
```
❌ NUNCA en root: .next/, next.config.js, app/, pages/
✅ SIEMPRE en apps/main-app/ o la app correspondiente
```

### **2. ¿Qué nombre usar?**
```
❌ NUNCA "VThink" para software
✅ SIEMPRE "VibeThink" para software
```

### **3. ¿Cómo validar?**
```bash
# ANTES de crear archivos
npm run validate:architecture

# DESPUÉS de crear archivos
npm run validate:universal
```

## 📋 **CHECKLIST RÁPIDO**

### **Antes de crear/modificar:**
- [ ] ¿Leí `ARCHITECTURE_RULES.md`?
- [ ] ¿El archivo va en la app correcta?
- [ ] ¿No está en root?
- [ ] ¿Uso "VibeThink" no "VThink"?

### **Después de crear/modificar:**
- [ ] ¿Ejecuté `npm run validate:architecture`?
- [ ] ¿No hay errores de validación?
- [ ] ¿El servidor funciona?

## 🎯 **COMANDOS CRÍTICOS**

### **Validar antes de cambios:**
```bash
npm run validate:architecture
```

### **Validar después de cambios:**
```bash
npm run validate:universal
```

### **Si hay problemas:**
```bash
npm run validate:guard
```

## 📚 **DOCUMENTACIÓN OBLIGATORIA**

### **LEER ANTES DE ACTUAR:**
- `ARCHITECTURE_RULES.md` - Reglas de arquitectura
- `VTHINK_METHODOLOGY_LAW.md` - Distinción VThink/VibeThink
- `AI_MANDATORY_REVIEW_SYSTEM.md` - Sistema de revisión

### **CONSULTAR SIEMPRE:**
- `CLAUDE_CODE_CONTEXT_COMPLETE.md` - Contexto completo
- `ARCHITECTURE_PROTECTION_RULES.md` - Protección automática

## 🚨 **VIOLACIONES CRÍTICAS**

### **Si ves esto en root - ELIMINAR INMEDIATAMENTE:**
```bash
rm -rf .next/
rm next.config.js
rm next-env.d.ts
rm -rf app/
```

### **Si falta esto - CREAR INMEDIATAMENTE:**
```bash
mkdir -p apps/main-app
mkdir -p src/shared
```

## 🎯 **RESUMEN**

### **El problema NO es falta de blindaje:**
- ✅ Validaciones funcionan
- ✅ Documentación existe
- ✅ Reglas están claras

### **El problema ES no leer/consultar:**
- ❌ No leemos la documentación
- ❌ No seguimos las validaciones
- ❌ No consultamos antes de actuar

### **La solución ES simple:**
1. 📖 **LEER** la documentación existente
2. 🔍 **VALIDAR** antes de cambios
3. 📋 **SEGUIR** el checklist
4. ✅ **CONSULTAR** si hay dudas

---

**¡LEER LA DOCUMENTACIÓN EXISTENTE ES MÁS EFECTIVO QUE CREAR MÁS BLINDAJE!** 