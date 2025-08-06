# 🛡️ STACK STABILITY RULES - REGLAS ABSOLUTAS

## 🚨 REGLA #1: NUNCA MEZCLAR GESTORES DE PAQUETES

### ✅ ÚNICO ESTÁNDAR PERMITIDO:
```bash
npm install    # SIEMPRE
npm run dev    # SIEMPRE
npm run build  # SIEMPRE
```

### ❌ PROHIBIDO ABSOLUTAMENTE:
```bash
yarn install   # NUNCA
pnpm install   # NUNCA
bun install    # NUNCA
```

## 🚨 REGLA #2: NUNCA CAMBIAR VERSIONES QUE FUNCIONAN

### ✅ VERSIONES ESTABLES ESTABLECIDAS:
- **Next.js**: `^15.3.4` (PROBADO Y FUNCIONAL)
- **React**: `^19.0.0` (PROBADO Y FUNCIONAL)
- **TailwindCSS**: `^3.4.17` (PROBADO Y FUNCIONAL)

### ❌ NO HACER:
- Actualizar versiones "porque son más nuevas"
- Agregar dependencias "para arreglar errores"
- Cambiar versiones sin probar completamente

## 🚨 REGLA #3: SI ALGO FUNCIONA, NO LO TOQUES

### ✅ PRINCIPIO SAGRADO:
**"Working code is sacred code"**

### ❌ NO HACER:
- Refactorizar código que funciona
- "Mejorar" configuraciones estables
- Cambiar imports que funcionan
- Modificar layouts estables

## 🚨 REGLA #4: DIAGNÓSTICO ANTES DE CAMBIOS

### ✅ PROCESO CORRECTO:
1. **IDENTIFICAR**: ¿Es problema de código o dependencias?
2. **AISLAR**: ¿Qué cambió desde que funcionaba?
3. **RESTAURAR**: Volver al último estado funcional
4. **SOLUCIONAR**: Solo el problema específico

### ❌ NUNCA HACER:
- Cambiar multiple cosas a la vez
- "Aprovechar para mejorar otras cosas"
- Introducir nuevas tecnologías durante debugging

## 🎯 COMANDOS DE EMERGENCIA

### Si algo se rompe:
```bash
# PASO 1: Volver al último commit funcional
git status
git restore [archivo-problemático]

# PASO 2: Limpiar solo si es necesario
npm cache clean --force
rm -rf node_modules
npm install

# PASO 3: Verificar
npm run dev
```

### Si el servidor no inicia:
```bash
# NO hacer: cambiar gestores de paquetes
# NO hacer: cambiar versiones
# SÍ hacer: esperar a que npm termine
npm install  # Y ESPERAR, aunque tarde
```

## 📋 CHECKLIST ANTES DE CUALQUIER CAMBIO

- [ ] ¿El código actual funciona? → Si sí, NO cambiar
- [ ] ¿Es realmente necesario? → Si no, NO hacer
- [ ] ¿He probado la solución mínima? → Si no, probar primero
- [ ] ¿Puedo volver atrás fácilmente? → Si no, hacer backup

## 🔒 REGLAS PARA AIs

### TODAS las AIs deben:
1. **SIEMPRE preguntar** antes de cambiar dependencias
2. **NUNCA sugerir** cambiar gestores de paquetes
3. **SIEMPRE usar** npm como único estándar
4. **PRESERVAR** configuraciones que funcionan

### FRASES PROHIBIDAS para AIs:
- ❌ "Probemos con yarn/pnpm, es más rápido"
- ❌ "Actualicemos a la versión más nueva"
- ❌ "Agreguemos esta dependencia para arreglar"
- ❌ "Refactoricemos esto mientras arreglamos"

### FRASES CORRECTAS:
- ✅ "Usemos npm install como es nuestro estándar"
- ✅ "Volvamos al último estado que funcionaba"
- ✅ "Identifiquemos el problema específico primero"
- ✅ "Mantengamos las versiones estables actuales"

## 🏆 PRINCIPIO FUNDAMENTAL

**"ESTABILIDAD > NOVEDAD"**

Un stack que funciona al 100% con tecnología "vieja" es **infinitamente mejor** que un stack roto con la tecnología más nueva.

---

**FECHA DE ESTABLECIMIENTO**: 5 Agosto 2025  
**ESTADO**: ACTIVO Y OBLIGATORIO  
**APLICABLE A**: Todos los desarrolladores y AIs  
**EXCEPCIONES**: NINGUNA