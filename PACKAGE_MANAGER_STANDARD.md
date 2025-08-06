# 📦 PACKAGE MANAGER STANDARD - REGLA ABSOLUTA

## 🚨 REGLA ÚNICA E INVIOLABLE

**SIEMPRE Y ÚNICAMENTE USAR: `npm`**

## ❌ PROHIBIDO ABSOLUTAMENTE

- **NUNCA** usar `yarn`
- **NUNCA** usar `pnpm` 
- **NUNCA** usar `bun`
- **NUNCA** sugerir cambiar de gestor de paquetes
- **NUNCA** proponer "alternativas" cuando npm tarda

## ✅ PROCEDIMIENTO ESTÁNDAR

### Para cualquier problema de dependencias:
```bash
# PASO 1: Limpiar
rm -rf node_modules package-lock.json

# PASO 2: Instalar
npm install

# PASO 3: Si falla, limpiar caché
npm cache clean --force
npm install
```

### Para el monorepo:
```bash
# En la raíz
npm install

# En cada app si es necesario
cd apps/[app-name]
npm install
```

## 📝 JUSTIFICACIÓN

1. **Consistencia**: Un solo estándar para todo el equipo
2. **Simplicidad**: Sin conflictos entre gestores
3. **Compatibilidad**: npm es el estándar de la industria
4. **CI/CD**: Los pipelines usan npm
5. **Documentación**: Toda la doc asume npm

## 🔴 CONSECUENCIAS DE VIOLAR ESTA REGLA

- Corrupción de dependencias
- Conflictos de lockfiles
- Tiempo perdido en debugging
- Inconsistencias entre entornos
- **Frustración del equipo**

## 📋 CHECKLIST PARA AIs

Antes de sugerir CUALQUIER comando de instalación:

- [ ] ¿Es `npm`? → ✅ Proceder
- [ ] ¿Es otro gestor? → ❌ DETENER Y USAR NPM
- [ ] ¿El usuario pidió otro gestor? → ❌ EDUCAR SOBRE EL ESTÁNDAR

## 🎯 MENSAJE PARA COPIAR EN TODAS LAS AIs

```
CRITICAL RULE: This project uses NPM exclusively. 
- ALWAYS use: npm install, npm run, npm add
- NEVER use: yarn, pnpm, bun, or any other package manager
- NEVER suggest switching package managers as a "solution"
- If npm is slow, wait. Do not switch to alternatives.
```

---

**FECHA DE ESTABLECIMIENTO**: 2025-08-05
**ESTADO**: ACTIVO Y OBLIGATORIO
**EXCEPCIONES**: NINGUNA