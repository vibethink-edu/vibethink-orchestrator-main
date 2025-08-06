# 🧠 CONTEXTO COMPLETO PARA CLAUDE CODE - VThink 1.0

## 🎯 **INFORMACIÓN CRÍTICA DEL PROYECTO**

### **Nombre del Proyecto:**
- **Software:** VibeThink Orchestrator
- **Metodología:** VThink 1.0
- **NUNCA usar "VThink" como nombre de software**

### **Arquitectura Actual:**
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

## 🚨 **REGLAS ABSOLUTAS**

### **1. Arquitectura - NUNCA VIOLAR:**
- ❌ **NUNCA** crear archivos Next.js en root
- ❌ **NUNCA** crear `.next/`, `next.config.js`, `next-env.d.ts`, `app/` en root
- ✅ **SIEMPRE** crear en `apps/main-app/` o la app correspondiente
- ✅ **SIEMPRE** validar con `npm run validate:architecture`

### **2. Branding - DISTINCIÓN CRÍTICA:**
- **VThink** = Metodología (solo para documentación de metodología)
- **VibeThink** = Software/Brand (usar en código, componentes, nombres de archivos)
- ❌ **NUNCA** usar "VThink" para software
- ✅ **SIEMPRE** usar "VibeThink" para software

### **3. Validaciones OBLIGATORIAS:**
```bash
# ANTES de cualquier cambio
npm run validate:architecture
npm run validate:guard

# DESPUÉS de cualquier cambio
npm run validate:universal
```

## 🛠️ **STACK TÉCNICO ACTUAL**

### **Frontend:**
- **Framework:** Next.js 15.3.4
- **UI Library:** Shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod

### **Monorepo:**
- **Manager:** Lerna
- **Package Manager:** npm
- **Workspaces:** `apps/*`, `src/*`

### **Validaciones Automáticas:**
- `validate:architecture` - Estructura del monorepo
- `validate:guard` - Protección preventiva
- `validate:universal` - Todas las validaciones
- `validate:ecosystem` - Compatibilidad cross-app
- `validate:duplication` - Detectar duplicaciones
- `validate:integration` - Integración de sistemas
- `validate:ui-generic` - Componentes genéricos

## 📁 **ESTRUCTURA DE ARCHIVOS**

### **Apps Independientes:**
```
apps/
├── main-app/           ← Next.js principal
│   ├── app/           ← App Router
│   ├── package.json   ← Dependencias específicas
│   └── next.config.js ← Configuración Next.js
├── dashboard/          ← Dashboard app
├── admin/             ← Admin panel
├── login/             ← Authentication
└── helpdesk/          ← Support system
```

### **Código Compartido:**
```
src/
├── shared/            ← Componentes compartidos
│   ├── components/    ← UI components
│   ├── hooks/         ← Custom hooks
│   ├── utils/         ← Utilities
│   └── types/         ← Type definitions
├── integrations/      ← External integrations
└── modules/          ← Business logic
```

### **Herramientas de Desarrollo:**
```
dev-tools/
├── validation/        ← Validadores automáticos
├── scripts/          ← Scripts de utilidad
└── docs/            ← Documentación técnica
```

## 🎨 **COMPONENTES GENÉRICOS**

### **Componentes Base:**
- `Layout` - Layouts reutilizables
- `Card` - Tarjetas genéricas
- `Navigation` - Navegación genérica
- `Chart` - Gráficos con Recharts

### **Hooks Genéricos:**
- `useGenericData` - Fetching de datos
- `useAuth` - Autenticación
- `useTheme` - Gestión de temas

### **Utilidades Genéricas:**
- `genericFormatters` - Formateo de datos
- `cn` - Clases condicionales
- `validators` - Validaciones

## 🔒 **SISTEMA DE PROTECCIÓN**

### **Validación Automática:**
```bash
# Se ejecuta ANTES de cada comando crítico
npm run dev          # ← Valida automáticamente
npm run build        # ← Valida automáticamente
npm run start        # ← Valida automáticamente
```

### **Validación Manual:**
```bash
# Validar arquitectura actual
npm run validate:architecture

# Validar con guardián
npm run validate:guard

# Validación universal
npm run validate:universal
```

### **Validación Continua:**
```bash
# Iniciar validación en tiempo real
node dev-tools/validation/architecture-guard.cjs
```

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

## 📚 **DOCUMENTACIÓN CRÍTICA**

### **Archivos de Referencia:**
- `ARCHITECTURE_RULES.md` - Reglas de arquitectura
- `ARCHITECTURE_PROTECTION_RULES.md` - Protección automática
- `VTHINK_METHODOLOGY_LAW.md` - Distinción VThink/VibeThink
- `AI_MANDATORY_REVIEW_SYSTEM.md` - Sistema de revisión IA
- `UI_GENERIC_PRINCIPLES.md` - Principios de componentes genéricos

### **Validadores Automáticos:**
- `dev-tools/validation/architecture-validator.cjs`
- `dev-tools/validation/architecture-guard.cjs`
- `dev-tools/validation/pre-command-validator.cjs`

## 🎯 **ESTADO ACTUAL**

### **✅ Validaciones Exitosas:**
- Arquitectura válida
- Sin violaciones críticas
- Sistema de protección activo
- Componentes genéricos implementados

### **⚠️ Advertencias Menores:**
- Algunos componentes específicos por refactorizar
- Dependencias en proceso de limpieza
- Documentación en actualización

### **🚨 Problemas Conocidos:**
- Dependencias npm con conflictos de versiones
- Necesidad de limpieza completa del repo
- Servidor main-app requiere reinstalación

## 🔄 **PRÓXIMOS PASOS**

### **Inmediatos:**
1. ✅ Limpiar dependencias corruptas
2. ✅ Reinstalar todo el stack
3. ✅ Validar arquitectura
4. ✅ Probar servidor main-app

### **A Mediano Plazo:**
1. 🔄 Refactorizar componentes específicos a genéricos
2. 🔄 Implementar validación continua
3. 🔄 Documentar todos los componentes
4. 🔄 Optimizar build del monorepo

### **A Largo Plazo:**
1. 🎯 Implementar CI/CD automático
2. 🎯 Agregar testing completo
3. 🎯 Optimizar performance
4. 🎯 Implementar monitoreo

---

**¡MANTENER ESTA ESTRUCTURA ES CRÍTICO PARA LA ESTABILIDAD DEL PROYECTO!**

**Claude Code debe SIEMPRE seguir estas reglas sin excepción.** 