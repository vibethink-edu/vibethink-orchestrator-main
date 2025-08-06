# 🛡️ Reglas de Protección de Arquitectura - VThink 1.0

## 🎯 **OBJETIVO**
Prevenir violaciones de arquitectura **ANTES** de que ocurran, no después.

## 🚨 **ARCHIVOS PROHIBIDOS EN ROOT**

### **NUNCA crear estos archivos en el root:**
```
❌ .next/
❌ next.config.js
❌ next-env.d.ts
❌ app/
❌ pages/
❌ src/app/
❌ src/pages/
```

### **✅ DONDE DEBEN ESTAR:**
```
✅ apps/main-app/.next/
✅ apps/main-app/next.config.js
✅ apps/main-app/next-env.d.ts
✅ apps/main-app/app/
✅ apps/main-app/pages/
```

## 🔒 **SISTEMA DE PROTECCIÓN**

### **1. Validación Automática**
```bash
# Se ejecuta ANTES de cada comando crítico
npm run dev          # ← Valida automáticamente
npm run build        # ← Valida automáticamente
npm run start        # ← Valida automáticamente
```

### **2. Validación Manual**
```bash
# Validar arquitectura actual
npm run validate:architecture

# Validar con guardián
npm run validate:guard

# Validación universal
npm run validate:universal
```

### **3. Validación Continua**
```bash
# Iniciar validación en tiempo real
node dev-tools/validation/architecture-guard.cjs
```

## 🎯 **REGLAS PARA IA**

### **ANTES de crear archivos:**
1. ✅ Verificar que NO esté en root
2. ✅ Verificar que esté en la app correcta
3. ✅ Validar con `npm run validate:guard`

### **DESPUÉS de crear archivos:**
1. ✅ Ejecutar `npm run validate:architecture`
2. ✅ Corregir inmediatamente si hay violaciones
3. ✅ Documentar cambios

## 🚨 **VIOLACIONES CRÍTICAS**

### **Si detectas estos archivos en root:**
```bash
# ELIMINAR INMEDIATAMENTE
rm -rf .next/
rm next.config.js
rm next-env.d.ts
rm -rf app/
```

### **Si faltan estas estructuras:**
```bash
# CREAR INMEDIATAMENTE
mkdir -p apps/main-app
mkdir -p src/shared
mkdir -p docs
mkdir -p dev-tools
```

## 📋 **CHECKLIST DE PROTECCIÓN**

### **Antes de cada operación:**
- [ ] ¿El archivo va en la app correcta?
- [ ] ¿No está en root?
- [ ] ¿Sigue ARCHITECTURE_RULES.md?
- [ ] ¿Paso la validación automática?

### **Después de cada operación:**
- [ ] ¿Ejecuté `npm run validate:architecture`?
- [ ] ¿No hay archivos prohibidos en root?
- [ ] ¿La estructura sigue siendo válida?
- [ ] ¿Documenté los cambios?

## 🎯 **COMANDOS DE EMERGENCIA**

### **Si hay violaciones:**
```bash
# 1. Detener todo
Ctrl+C

# 2. Validar
npm run validate:architecture

# 3. Corregir violaciones
npm run validate:guard

# 4. Verificar
npm run validate:universal
```

### **Si el repo está corrupto:**
```bash
# 1. Backup
git stash

# 2. Limpiar
npm run clean

# 3. Reinstalar
npm run setup

# 4. Validar
npm run validate:universal
```

## 🛡️ **PROTECCIÓN AUTOMÁTICA**

### **Git Hooks:**
```bash
# Pre-commit validation
npm run validate:universal
```

### **NPM Scripts:**
```bash
# Pre-command validation
npm run dev          # ← Valida automáticamente
npm run build        # ← Valida automáticamente
npm run start        # ← Valida automáticamente
```

### **Validación Continua:**
```bash
# Watch mode para violaciones
node dev-tools/validation/architecture-guard.cjs
```

## 🎯 **RESPONSABILIDADES**

### **Para IA:**
- ✅ **NUNCA** crear archivos Next.js en root
- ✅ **SIEMPRE** validar antes de operaciones
- ✅ **INMEDIATAMENTE** corregir violaciones
- ✅ **DOCUMENTAR** todos los cambios

### **Para Desarrolladores:**
- ✅ **SIEMPRE** ejecutar validaciones
- ✅ **NUNCA** ignorar errores de arquitectura
- ✅ **INMEDIATAMENTE** reportar violaciones
- ✅ **MANTENER** la estructura limpia

## 🚀 **RESULTADO ESPERADO**

### **Estructura Válida:**
```
/ (root) - SOLO WORKSPACE
├── package.json          ← Configuración del monorepo
├── apps/                ← Aplicaciones independientes
│   ├── main-app/        ← Next.js principal
│   ├── dashboard/       ← Dashboard
│   ├── admin/           ← Admin
│   ├── login/           ← Login
│   └── helpdesk/        ← Helpdesk
└── src/                 ← Código compartido
    └── shared/          ← Componentes compartidos
```

### **Sin Violaciones:**
- ✅ No archivos Next.js en root
- ✅ Apps independientes en `apps/`
- ✅ Código compartido en `src/shared/`
- ✅ Documentación en `docs/`
- ✅ Herramientas en `dev-tools/`

---

**¡MANTENER ESTA ESTRUCTURA ES CRÍTICO PARA LA ESTABILIDAD DEL PROYECTO!** 